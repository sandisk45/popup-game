# Popup Apocalypse — Retro Windows XP Edition

A contained, playable browser game built with React + Vite. It simulates a chaotic Windows XP-style desktop. It does not create real browser alerts, change browser settings, or affect anything outside the webpage.

## Features
- Retro XP-inspired desktop, taskbar, Start menu, icons, and windows
- Pop-ups with draggable title bars and working close/action buttons
- Escalating chaos meter and patience meter
- Random events and increasingly chaotic pop-up behavior
- Fake Task Manager and Whack-a-Popup mini-game
- Multiple endings, achievements, score, and restart button
- Responsive layout for desktop and mobile
- Saves best score and discovered endings in localStorage

## Requirements
- Node.js 20+ recommended
- npm

## Setup
Open this folder in VS Code, then run:

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually http://localhost:5173.

## Build for production
```bash
npm run build
npm run preview
```

## Project structure
```text
popup-apocalypse/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    └── styles.css
```

All effects are simulated inside the page. The restart button clears the current game session. No AI API key or backend is required.
