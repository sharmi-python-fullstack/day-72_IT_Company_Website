import { createServer } from 'node:http'

const port = Number(process.env.API_PORT || 3001)
const apiKey = process.env.GEMINI_API_KEY
const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
const maxBodyBytes = 16 * 1024
const maxGeminiAttempts = 3

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function getRetryDelay(response, attempt) {
  const retryAfter = response.headers.get('retry-after')
  const retryAfterSeconds = Number(retryAfter)
  const retryAfterDate = Date.parse(retryAfter || '')
  const serverDelay = Number.isFinite(retryAfterSeconds)
    ? retryAfterSeconds * 1000
    : Number.isFinite(retryAfterDate)
      ? retryAfterDate - Date.now()
      : 0

  return Math.min(Math.max(serverDelay, 700 * (2 ** attempt)) + Math.random() * 250, 5000)
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(data))
}

async function readJsonBody(request) {
  const chunks = []
  let bytesRead = 0

  for await (const chunk of request) {
    bytesRead += chunk.length
    if (bytesRead > maxBodyBytes) {
      throw Object.assign(new Error('Request body is too large.'), { statusCode: 413 })
    }
    chunks.push(chunk)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { statusCode: 400 })
  }
}

async function generateInteraction(input, { previousInteractionId, systemInstruction } = {}) {
  if (!apiKey) {
    throw Object.assign(new Error('Gemini is not configured. Add GEMINI_API_KEY to your environment.'), {
      statusCode: 503,
    })
  }

  const requestBody = {
    model,
    input,
    ...(previousInteractionId && { previous_interaction_id: previousInteractionId }),
    ...(systemInstruction && { system_instruction: systemInstruction }),
  }

  let response
  for (let attempt = 0; attempt < maxGeminiAttempts; attempt += 1) {
    try {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(30_000),
      })
    } catch (error) {
      if (attempt === maxGeminiAttempts - 1) throw error
      await sleep(700 * (2 ** attempt) + Math.random() * 250)
      continue
    }

    if (response.ok || ![408, 429, 500, 502, 503, 504].includes(response.status)) break

    if (attempt < maxGeminiAttempts - 1) {
      await sleep(getRetryDelay(response, attempt))
    }
  }

  if (!response?.ok) {
    const errorBody = await response?.json().catch(() => null)
    const originalMessage = errorBody?.error?.message || `Gemini returned HTTP ${response?.status}.`
    console.error(`Gemini request failed (${response?.status}) after ${maxGeminiAttempts} attempts: ${originalMessage}`)

    if (response?.status === 429 || response?.status === 503) {
      throw Object.assign(
        new Error('Gemini is temporarily busy. Please wait a few seconds, then try again.'),
        { statusCode: 503 },
      )
    }
    if (response?.status >= 500) {
      throw Object.assign(new Error('Gemini is temporarily unavailable. Please try again shortly.'), {
        statusCode: 503,
      })
    }
    throw Object.assign(new Error(originalMessage), { statusCode: 502 })
  }

  const result = await response.json()
  const text = result.steps
    ?.filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content || [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text || '')
    .join('')
    .trim()

  if (result.status !== 'completed' || !text || typeof result.id !== 'string') {
    throw Object.assign(new Error('Gemini returned an empty response. Please try again.'), {
      statusCode: 502,
    })
  }

  return { text, interactionId: result.id }
}

async function handleRequest(request, response) {
  const pathname = new URL(request.url, 'http://localhost').pathname
  if (!['/api/chat', '/api/faqs'].includes(pathname)) {
    sendJson(response, 404, { error: 'API route not found.' })
    return
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed.' })
    return
  }

  if (!request.headers['content-type']?.includes('application/json')) {
    sendJson(response, 415, { error: 'Content-Type must be application/json.' })
    return
  }

  try {
    if (pathname === '/api/chat') {
      const { prompt, previousInteractionId } = await readJsonBody(request)
      if (typeof prompt !== 'string' || !prompt.trim()) {
        sendJson(response, 400, { error: 'Enter a message before sending.' })
        return
      }
      if (prompt.length > 4000) {
        sendJson(response, 400, { error: 'Messages must be 4,000 characters or fewer.' })
        return
      }

      if (
        previousInteractionId !== undefined &&
        previousInteractionId !== null &&
        (typeof previousInteractionId !== 'string' || previousInteractionId.length > 200)
      ) {
        sendJson(response, 400, { error: 'The conversation reference is invalid. Start a new chat.' })
        return
      }

      const interaction = await generateInteraction(prompt.trim(), {
        previousInteractionId,
        systemInstruction:
          "You are Nexora's friendly IT company assistant. Answer clearly and concisely about IT services, digital transformation, cloud, software engineering, data, and AI. If asked something outside this scope, briefly say how Nexora can help and invite the user to contact the team. Do not claim specific pricing, clients, or capabilities that are not provided.",
      })
      sendJson(response, 200, {
        reply: interaction.text,
        interactionId: interaction.interactionId,
      })
      return
    }

    const { text } = await generateInteraction(
      'Create 5 common questions and helpful, concise answers someone might ask about an IT company like Nexora, which offers digital transformation, cloud and infrastructure, product engineering, data, and AI services. Return only a JSON array with objects shaped exactly like {"question":"...","answer":"..."}.',
    )
    let faqs
    try {
      faqs = JSON.parse(text)
    } catch {
      throw Object.assign(new Error('The FAQ response was not valid JSON. Please try again.'), {
        statusCode: 502,
      })
    }

    if (
      !Array.isArray(faqs) ||
      faqs.length === 0 ||
      faqs.length > 10 ||
      faqs.some(
        (faq) =>
          !faq ||
          typeof faq.question !== 'string' ||
          typeof faq.answer !== 'string' ||
          !faq.question.trim() ||
          !faq.answer.trim(),
      )
    ) {
      throw Object.assign(new Error('The FAQ response had an unexpected format. Please try again.'), {
        statusCode: 502,
      })
    }

    sendJson(response, 200, {
      faqs: faqs.map(({ question, answer }) => ({
        question: question.trim(),
        answer: answer.trim(),
      })),
    })
  } catch (error) {
    const statusCode = error.statusCode || (error.name === 'TimeoutError' ? 504 : 500)
    if (statusCode >= 500) console.error(`API request failed: ${error.message}`)
    sendJson(response, statusCode, {
      error: statusCode === 504 ? 'Gemini took too long to respond. Please try again.' : error.message,
    })
  }
}

createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('Unexpected API server error:', error)
    if (!response.headersSent) {
      sendJson(response, 500, { error: 'An unexpected server error occurred.' })
    } else {
      response.destroy(error)
    }
  })
}).listen(port, '127.0.0.1', () => {
  console.log(`Gemini API server listening at http://127.0.0.1:${port}`)
})
