# Reel Insights Editor

Standalone React app version of the Instagram Reel Insights dashboard editor
(converted from a Claude artifact — same component, no changes made to its
logic or icons).

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy that folder to Vercel, Netlify, or any
static host.

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import the repo
3. Vercel auto-detects Vite — just click Deploy
4. Done — you'll get a live URL

## What's inside

- `src/ReelInsightsEditor.jsx` — the original dashboard component, untouched.
  All its icons are either inline SVG or base64-embedded images, so nothing
  external needed to be fixed.
- `src/index.css` — Tailwind setup + a few custom `fs-*` (font-size) utility
  classes the original component relies on that aren't part of Tailwind's
  default set.
- Everything else (`vite.config.js`, `tailwind.config.js`, etc.) is standard
  Vite + React + Tailwind boilerplate.

## Next steps (subscription/monetization)

This is just the working app. Auth, Stripe subscriptions, and paywall logic
aren't wired in yet — that's the next piece to build on top of this.
