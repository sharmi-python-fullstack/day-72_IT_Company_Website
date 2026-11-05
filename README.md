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
