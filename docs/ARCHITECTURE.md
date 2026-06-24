# Architecture

## Layered architecture (v0.1)

```
┌──────────────────────────────────────────────────────┐
│                     UI Layer                         │
│  App.tsx — microphone button, status, transcript,    │
│            agent response, speak button, auto-speak  │
└────────────────────┬─────────────────────────────────┘
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
│ Voice Input  │ │ Agent Brain  │ │  Voice Output    │
│  Layer       │ │  Layer       │ │  Layer           │
│              │ │              │ │                  │
│ speechRecog- │ │ mockAgent.ts │ │ speechSynthesis  │
│ nition.ts    │ │              │ │ .ts              │
│              │ │ getMock-     │ │                  │
│ Wraps browser│ │ Response()   │ │ Wraps browser    │
│ SpeechRecog- │ │              │ │ speechSynthesis  │
│ nition API   │ │ Simple key-  │ │ API              │
│              │ │ word→reply   │ │                  │
│ Returns stop │ │ lookup table │ │ speak() /        │
│ function     │ │              │ │ cancelSpeech()   │
└──────────────┘ └──────────────┘ └──────────────────┘
```

## Data flow

```
User speaks
    │
    ▼
SpeechRecognition API (browser)
    │  interim results → update UI
    │  final result    ─────────────────────────────┐
    ▼                                               │
createSpeechRecognition()                           │
    │                                               │
    ▼                                               ▼
onResult({ transcript, isFinal })          getMockResponse(transcript)
                                                    │
                                                    ▼
                                           agentResponse string
                                                    │
                                    ┌───────────────┤
                                    ▼               ▼
                             display in UI    speak() if autoSpeak
                                                    │
                                                    ▼
                                           SpeechSynthesis API (browser)
```

## Key design decisions

- **No backend for v0.1** — everything runs in the browser using standard Web APIs.
- **Graceful degradation** — the app checks for browser support on load and shows a clear warning.
- **stop function pattern** — `createSpeechRecognition()` returns a cleanup function, making it easy to cancel from the UI or in effects.
- **Mock agent as a pure function** — `getMockResponse(transcript)` is a pure function for easy replacement with a real LLM call in v0.2.
- **Single-shot recognition** — `continuous = false` avoids the complexity of session management for the MVP.

## Future layers (planned)

```
v0.2  ─  Real LLM layer replacing mockAgent.ts
          (Claude API or OpenAI)

v0.3  ─  Local model layer
          Whisper (STT) + Piper (TTS) + Ollama (LLM)
          via small Node/Python bridge

v0.4  ─  Streaming + interruption handling
          Progressive rendering of LLM tokens
          Barge-in (user can interrupt agent mid-speech)
```
