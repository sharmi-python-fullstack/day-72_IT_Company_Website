# Nexora IT Company Website

A responsive React + Vite landing page for an IT company, with an optional Gemini-powered chatbot and FAQ generator.

## Get started

```sh
npm install
```

Copy `.env.example` to `.env` and add a Gemini API key to enable the chatbot and FAQ generation. The server uses Gemini 3.1 Flash-Lite through the Interactions API by default. Set `GEMINI_MODEL` in `.env` if you want to use another model available to your API key. The key is read only by the local Node API server and is not included in the browser bundle.

```sh
npm run dev
```

This starts the Vite website and the API server together. Open the local URL printed by Vite. Without a Gemini API key, the static FAQ content and rest of the website still work; AI features display a configuration message.

## Checks

```sh
npm run lint
npm run build
```

## Deploy to Render

1. Push this project to a GitHub repository. Do not commit `.env`; it is ignored by Git.
2. In Render, choose **New +** → **Blueprint** and connect the repository containing `render.yaml`.
3. Before creating the service, enter your Gemini API key when Render prompts for `GEMINI_API_KEY`. You can also add or update it later under the service's **Environment** settings.
4. Deploy the `nexora-it-company` web service. Render runs `npm ci && npm run build`, then `npm start`.
5. Open the Render URL and test the website, chatbot, and FAQ generator. The `/api/health` endpoint is used for Render health checks.

The Node server serves both the built Vite frontend and `/api` routes from the same Render service. Keep the Gemini key in Render's environment settings, never in frontend code or Git.
