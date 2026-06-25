# Roadmap

## v0.1 — Browser STT/TTS + mock agent (current)

**Goal:** Prove the voice loop works end-to-end in the browser.

- [x] React + TypeScript + Vite scaffold
- [x] Web Speech API speech recognition wrapper
- [x] Web Speech API speech synthesis wrapper
- [x] Mock AI agent (keyword → canned response)
- [x] Clean dark-theme UI with status indicators
- [x] Auto-speak toggle
- [x] Browser support detection + warning
- [x] Local build passes (`npm run build`)

---

## v0.2 — Real LLM API

**Goal:** Replace mock responses with a real language model.

- [ ] Add Claude API (Anthropic) integration in `src/agent/claudeAgent.ts`
- [ ] Streaming response support (token-by-token TTS feeding)
- [ ] API key management via `.env.local` (never committed)
- [ ] Fallback to mock agent if API key absent
- [ ] Rate-limiting / error handling UX

---

## v0.3 — Whisper / Piper / Ollama research

**Goal:** Evaluate fully local STT, TTS, and LLM options.

- [ ] Evaluate whisper.cpp WASM for in-browser STT
- [ ] Evaluate Piper for local neural TTS
- [ ] Evaluate Ollama for local LLM inference
- [ ] Benchmark latency vs quality tradeoffs
- [ ] Prototype local pipeline (see `docs/GITHUB_RESEARCH_PLAN.md`)
- [ ] Decision: WASM in-browser vs local server bridge

---

## v0.4 — Deploy & demo polish

**Goal:** Ship a shareable demo.

- [ ] Add Supabase for optional conversation history
- [ ] Conversation log with scroll-back
- [ ] Barge-in support (interrupt agent speech)
- [ ] Deploy to Vercel / Cloudflare Pages
- [ ] PWA manifest for mobile install
- [ ] Accessibility audit (WCAG 2.1 AA)
