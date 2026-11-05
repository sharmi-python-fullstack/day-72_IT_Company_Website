import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import Chatbot from './components/Chatbot.jsx'
import FAQItem from './components/FAQItem.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ServiceCard from './components/ServiceCard.jsx'

const services = [
  {
    number: '01',
    title: 'Digital transformation',
    description:
      'Modernize the way you work with practical strategies, thoughtful automation, and technology that moves your business forward.',
    icon: 'transform',
    color: 'lavender',
  },
  {
    number: '02',
    title: 'Cloud & infrastructure',
    description:
      'Build a secure, scalable foundation in the cloud—designed around your needs today and ready for what comes next.',
    icon: 'cloud',
    color: 'mint',
  },
  {
    number: '03',
    title: 'Product engineering',
    description:
      'Turn big ideas into dependable digital products with a collaborative team, from the first sketch to the next release.',
    icon: 'code',
    color: 'peach',
  },
  {
    number: '04',
    title: 'Data & intelligence',
    description:
      'Make clearer decisions with connected data, actionable insights, and AI experiences built for real people.',
    icon: 'chart',
    color: 'blue',
  },
]

const initialFaqs = [
  {
    question: 'What does Nexora do?',
    answer:
      'We help organizations plan, build, and improve digital products and IT systems—from cloud infrastructure and software engineering to data and AI.',
  },
  {
    question: 'Who do you work with?',
    answer:
      'We partner with ambitious teams of all sizes, from growing startups to established businesses looking to solve complex technology challenges.',
  },
  {
    question: 'How does a project get started?',
    answer:
      'We begin with a conversation about your goals, users, and constraints. From there, we shape a clear scope and a practical plan together.',
  },
  {
    question: 'Can you work with our in-house team?',
    answer:
      'Absolutely. We can own a project end to end or join your team to bring a specific skill set, extra capacity, or a fresh perspective.',
  },
]

async function readApiResponse(response) {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    await response.text()
    throw new Error('The API did not return JSON. Run `npm run dev` to start the website and Gemini server together.')
  }

  try {
    return await response.json()
  } catch {
    throw new Error('The API returned an invalid response. Restart `npm run dev` and try again.')
  }
}

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [faqContent, setFaqContent] = useState([])
  const [isFaqLoading, setIsFaqLoading] = useState(false)
  const [faqError, setFaqError] = useState('')

  async function sendChatMessage(prompt, previousInteractionId) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, previousInteractionId }),
    })
    const result = await readApiResponse(response)

    if (!response.ok) {
      throw new Error(result.error || 'The assistant could not respond. Please try again.')
    }

    return result
  }

  async function generateFAQ() {
    setIsFaqLoading(true)
    setFaqError('')

    try {
      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const result = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(result.error || 'FAQs could not be generated. Please try again.')
      }

      setFaqContent(result.faqs)
    } catch (error) {
      setFaqError(error.message)
    } finally {
      setIsFaqLoading(false)
    }
  }

  const displayedFaqs = faqContent.length > 0 ? faqContent : initialFaqs

  return (
    <>
      <Navbar onOpenChat={() => setIsChatbotOpen(true)} />
      <main>
        <section id="hero" className="hero-section section-anchor">
          <div className="hero-orb hero-orb-one" aria-hidden="true" />
          <div className="hero-orb hero-orb-two" aria-hidden="true" />
          <div className="page-shell hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                YOUR PARTNER IN WHAT&apos;S NEXT
              </span>
              <h1>
                Technology that
                <br />
                moves you <span>forward.</span>
              </h1>
              <p className="hero-description">
                We turn complex challenges into clear, confident progress.
                Thoughtful IT, built around your business and the people behind it.
              </p>
              <div className="hero-actions">
                <a className="button button-dark" href="#contact">
                  Let&apos;s talk <ArrowRight size={17} />
                </a>
                <a className="text-link" href="#services">
                  Explore what we do <ArrowDown size={16} />
                </a>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack" aria-hidden="true">
                  <span>J</span>
                  <span>M</span>
                  <span>A</span>
                  <span>+</span>
                </div>
                <p>
                  <strong>Good people.</strong> Better outcomes.
                </p>
              </div>
            </div>

            <div className="hero-visual" aria-label="Illustration of connected digital systems">
              <div className="visual-glow" />
              <div className="orbit orbit-outer" />
              <div className="orbit orbit-inner" />
              <div className="orbit-node node-top"><span>AI</span></div>
              <div className="orbit-node node-left"><span>☁</span></div>
              <div className="orbit-node node-right"><span>↗</span></div>
              <div className="orbit-node node-bottom"><span>⌘</span></div>
              <div className="visual-center">
                <div className="center-spark"><Sparkles size={24} /></div>
                <span>Make it<br />meaningful.</span>
                <div className="center-bars"><i /><i /><i /><i /><i /></div>
              </div>
              <div className="floating-note note-top">
                <span className="note-icon note-icon-green">↗</span>
                <span><strong>Built to scale</strong><small>Ready for what&apos;s next</small></span>
              </div>
              <div className="floating-note note-bottom">
                <span className="live-dot" />
                <span><strong>Ideas into impact</strong><small>One good step at a time</small></span>
              </div>
              <span className="visual-caption">Curiosity, meet possibility.</span>
            </div>
          </div>
          <div className="hero-bottom-line">
            <span>INDEPENDENT THINKING. CONNECTED TECHNOLOGY.</span>
            <a href="#about">A little about us <ArrowDown size={14} /></a>
          </div>
        </section>

        <section className="trust-strip" aria-label="Our approach">
          <div className="page-shell trust-strip-inner">
            <span>PEOPLE FIRST</span><i />
            <span>BUILT TO LAST</span><i />
            <span>ALWAYS CURIOUS</span><i />
            <span>BETTER TOGETHER</span>
          </div>
        </section>

        <section id="services" className="section section-services section-anchor">
          <div className="page-shell">
            <div className="section-heading heading-split">
              <div>
                <span className="eyebrow">HOW WE HELP</span>
                <h2>Big-picture thinking.<br /><span>Hands-on making.</span></h2>
              </div>
              <p>
                The right technology should make work feel a little less
                complicated and a lot more possible. That&apos;s where we come in.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service.number} service={service} />
              ))}
            </div>
            <a className="section-foot-link" href="#contact">
              Have a challenge in mind? Let&apos;s untangle it. <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section id="about" className="section section-about section-anchor">
          <div className="page-shell about-grid">
            <div className="about-art">
              <div className="about-art-grid" />
              <div className="about-note">
                <span className="note-sun">✳</span>
                <span>Technology is<br />better with people.</span>
              </div>
              <div className="about-sticker">GOOD<br />THINGS<br /><em>GROW</em></div>
              <span className="about-art-caption">A team that gets in it with you.</span>
            </div>
            <div className="about-copy">
              <span className="eyebrow">A LITTLE ABOUT US</span>
              <h2>We like the<br />hard questions.<br /><span>And the people<br />asking them.</span></h2>
              <p>
                We&apos;re a close-knit team of strategists, engineers, and
                curious minds. We listen first, make things clear, and stay
                by your side from the first “what if?” to the finished thing.
              </p>
              <div className="about-stats">
                <div><strong>12<span>+</span></strong><small>years building better</small></div>
                <div><strong>48</strong><small>good humans, one team</small></div>
                <div><strong>92<span>%</span></strong><small>work from referrals</small></div>
              </div>
              <a className="button button-outline" href="#contact">
                Get to know us <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="section section-faq section-anchor">
          <div className="page-shell faq-grid">
            <div className="faq-intro">
              <span className="eyebrow">GOOD TO KNOW</span>
              <h2>Questions?<br /><span>We&apos;re listening.</span></h2>
              <p>Here are a few things people often ask. Have another one? We&apos;re only a message away.</p>
              <button
                className="button button-ai"
                type="button"
                onClick={generateFAQ}
                disabled={isFaqLoading}
              >
                <Sparkles size={16} />
                {isFaqLoading ? 'Thinking up answers…' : 'Refresh FAQs with AI'}
              </button>
            </div>
            <div className="faq-list" aria-live="polite">
              {isFaqLoading ? (
                <div className="faq-loading"><span className="loading-spinner" />Finding a few good answers…</div>
              ) : (
                displayedFaqs.map((faq, index) => (
                  <FAQItem key={`${faq.question}-${index}`} faq={faq} />
                ))
              )}
              {faqError && <p className="inline-error" role="alert">{faqError}</p>}
            </div>
          </div>
        </section>

        <section id="contact" className="section section-contact section-anchor">
          <div className="page-shell">
            <div className="contact-card">
              <div className="contact-orb" aria-hidden="true" />
              <div className="contact-copy">
                <span className="eyebrow eyebrow-light">THE NEXT STEP IS A CONVERSATION</span>
                <h2>Let&apos;s make<br />something <span>matter.</span></h2>
                <p>Tell us what you&apos;re working on. We&apos;ll bring the coffee and a few good questions.</p>
              </div>
              <div className="contact-cta">
                <a className="button button-light" href="mailto:hello@nexora.example">
                  hello@nexora.example <ArrowUpRight size={18} />
                </a>
                <span>Or, if you prefer, start with our AI assistant.</span>
                <button className="contact-chat-link" onClick={() => setIsChatbotOpen(true)} type="button">
                  Say hello to Nexora AI <ArrowRight size={16} />
                </button>
              </div>
              <span className="contact-decoration" aria-hidden="true">✳</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onSendMessage={sendChatMessage}
      />
    </>
  )
}

export default App
