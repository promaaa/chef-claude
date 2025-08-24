# ChefGen (React)

React port of your “ChefGen” app (formerly “ChefClaude”) in the `chefgen` folder, keeping the same UX and core features with a minimal structure.

## Features

- Providers: OpenAI, Mistral, Gemini, plus a local Demo (mock)
- Model selector (curated list + Custom field)
- API keys management: show/hide and optional local storage
- Temperature, presets (Speed/Balanced/Quality), max ready time
- Ingredients: fast entry (Enter/comma), clickable tags, “Pantry” shortcuts
- Dietary preferences, servings, skill level, cuisine
- Generate, copy rendered recipe, download JSON, “Surprise me”
- Light/Dark theme persisted in `localStorage` + “About” modal

## Prerequisites

- Node.js 16+ and npm

## Install

```bash
cd chefgen
npm install
```

## Start

```bash
npm run dev
```

Available at `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Structure

```
chefgen/
├── App.jsx
├── Header.jsx
├── Main.jsx
├── index.css
├── index.html
├── index.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Security

- API calls run client-side for local/private use. Do not deploy this with exposed keys.
- Avoid committing keys. If you must deploy, add a backend (or serverless) to proxy requests.

Enjoy cooking with ChefGen! 🍝
