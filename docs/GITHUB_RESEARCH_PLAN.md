# GitHub Research Plan — STT / TTS / Voice Agent Ecosystem

A structured plan for analysing ~20 GitHub repositories to inform the v0.3 local pipeline decision.

---

## Research objectives

1. Identify the best **in-browser STT** option (WASM-based Whisper vs Web Speech API)
2. Identify the best **local neural TTS** option (Piper, Coqui, Bark, etc.)
3. Identify the best **local LLM** option for voice latency budgets (Ollama, llama.cpp, etc.)
4. Survey existing **voice agent frameworks** for patterns worth adopting

---

## Repo list

### Speech-to-Text (STT)

| # | Repo | What to study |
|---|------|---------------|
| 1 | `ggerganov/whisper.cpp` | Core C++ Whisper port; check WASM build status |
| 2 | `xenova/whisper-web` | Browser WASM Whisper demo; study latency data |
| 3 | `openai/whisper` | Original Python reference; API compatibility |
| 4 | `nickcoutsos/browser-speech-demo` | Web Speech API patterns |

### Text-to-Speech (TTS)

| # | Repo | What to study |
|---|------|---------------|
| 5 | `rhasspy/piper` | Local neural TTS; voice quality, latency, ONNX export |
| 6 | `coqui-ai/TTS` | Multi-voice TTS; model sizes, streaming support |
| 7 | `suno-ai/bark` | Expressive TTS; GPU requirements |
| 8 | `myshell-ai/OpenVoice` | Voice cloning; licensing |
| 9 | `hexgrad/kokoro` | Lightweight neural TTS; ONNX / browser compatibility |

### Local LLM inference

| # | Repo | What to study |
|---|------|---------------|
| 10 | `ollama/ollama` | Local model runner; REST API, streaming, model library |
| 11 | `ggerganov/llama.cpp` | Core inference; WASM build, quantization options |
| 12 | `Mozilla/llama.cpp` fork | Firefox context; any Web AI additions |
| 13 | `LostRuins/koboldcpp` | Single-binary alternative; API compatibility |

### Voice agent frameworks

| # | Repo | What to study |
|---|------|---------------|
| 14 | `livekit/agents` | Production voice pipeline patterns; STT/TTS/LLM orchestration |
| 15 | `pipecat-ai/pipecat` | Frame-pipeline approach; interruption handling |
| 16 | `humeai/empathic-voice-interface-starter` | EVI SDK patterns |
| 17 | `gabber-dev/gabber-sdk-browser` | Browser voice SDK |
| 18 | `LAION-AI/Open-Assistant` | Open chat assistant; conversation management |

### Browser / WASM AI

| # | Repo | What to study |
|---|------|---------------|
| 19 | `xenova/transformers.js` | ONNX model runner in browser; model catalogue |
| 20 | `google/mediapipe` | On-device inference; JavaScript API coverage |

---

## Evaluation criteria per repo

For each repo collect:

- **Latency** — time-to-first-token / time-to-first-audio (for voice pipelines)
- **Model size** — MB on disk; suitable for browser (< 100 MB ideal) vs server
- **Browser support** — WASM build available? SharedArrayBuffer required?
- **License** — MIT / Apache 2.0 preferred; check for CC-BY-NC restrictions
- **Activity** — last commit, stars, open issues, PR velocity
- **API surface** — REST / WebSocket / direct function call; streaming support
- **Integration effort** — how many lines to wire into this project?

---

## Decision matrix

After research, fill this in:

| Dimension | Option A | Option B | Winner |
|-----------|----------|----------|--------|
| Browser STT | Web Speech API | whisper.cpp WASM | TBD |
| Server STT | Whisper Python | Whisper.cpp REST | TBD |
| Browser TTS | Web Speech API | Piper ONNX WASM | TBD |
| Server TTS | Piper | Coqui | TBD |
| Local LLM | Ollama | llama.cpp direct | TBD |

---

## Output

Produce a `docs/LOCAL_PIPELINE_DECISION.md` summarising the chosen stack for v0.3, with latency benchmarks and integration notes.
