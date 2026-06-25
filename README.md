# Voice Agent MVP

A minimal browser-based voice agent demo built with React + TypeScript + Vite.

## Goal

Demonstrate the core voice loop entirely in the browser — no backend required:

```
microphone → speech-to-text → mock AI response → text-to-speech → speaker
```

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open `http://localhost:5173` in Chrome or Edge.

## Build

```bash
npm run build
```

## MVP flow (v0.1)

1. Click the microphone button to start listening
2. Speak into your microphone
3. Your transcript appears in the "You said" panel
4. The mock agent generates a simple response
5. The response appears in the "Agent response" panel
6. If "Auto-speak responses" is enabled, the browser reads the response aloud
7. Click "Speak response" at any time to re-read the last response

## Browser support

| Browser | Speech-to-Text | Text-to-Speech |
|---------|---------------|----------------|
| Chrome  | Yes           | Yes            |
| Edge    | Yes           | Yes            |
| Firefox | No (STT)      | Yes            |
| Safari  | Partial       | Yes            |

> The Web Speech API (SpeechRecognition) is best supported in Chromium-based browsers.
> The app shows a warning if your browser lacks support.

## Project structure

```
voice-agent-mvp/
├── src/
│   ├── App.tsx                    # Main UI component
│   ├── main.tsx                   # React entry point
│   ├── styles.css                 # Dark-theme styles
│   ├── voice/
│   │   ├── speechRecognition.ts   # Web Speech API wrapper (STT)
│   │   └── speechSynthesis.ts     # Web Speech API wrapper (TTS)
│   └── agent/
│       └── mockAgent.ts           # Mock AI response engine
└── docs/
    ├── ARCHITECTURE.md
    ├── ROADMAP.md
    └── GITHUB_RESEARCH_PLAN.md
```

## No data leaves your browser

Everything runs locally using the Web Speech API. No API keys, no network calls, no backend.
