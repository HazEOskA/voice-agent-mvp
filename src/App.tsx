import { useState, useCallback, useRef } from 'react'
import { createSpeechRecognition, isSpeechRecognitionSupported } from './voice/speechRecognition'
import { speak, cancelSpeech, isSpeechSynthesisSupported } from './voice/speechSynthesis'
import { getMockResponse } from './agent/mockAgent'

type Status = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'

export default function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [agentResponse, setAgentResponse] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [autoSpeak, setAutoSpeak] = useState(true)
  const autoSpeakRef = useRef(autoSpeak)
  autoSpeakRef.current = autoSpeak
  const stopRecognitionRef = useRef<(() => void) | null>(null)

  const sttSupported = isSpeechRecognitionSupported()
  const ttsSupported = isSpeechSynthesisSupported()

  const handleSpeak = useCallback((text: string) => {
    if (!text) return
    setStatus('speaking')
    speak({
      text,
      onEnd: () => setStatus('idle'),
      onError: (err) => {
        setErrorMsg(err)
        setStatus('error')
      },
    })
  }, [])

  const startListening = useCallback(() => {
    setErrorMsg('')
    setInterimTranscript('')
    setFinalTranscript('')
    setAgentResponse('')
    setStatus('listening')

    stopRecognitionRef.current = createSpeechRecognition({
      onResult: ({ transcript, isFinal }) => {
        if (isFinal) {
          setFinalTranscript(transcript)
          setInterimTranscript('')
          setStatus('processing')

          const response = getMockResponse(transcript)
          setAgentResponse(response)
          setStatus('idle')

          if (autoSpeakRef.current && ttsSupported) {
            handleSpeak(response)
          }
        } else {
          setInterimTranscript(transcript)
        }
      },
      onError: (err) => {
        setErrorMsg(err)
        setStatus('error')
      },
      onEnd: () => {
        // Functional updater reads live state, avoiding the stale-closure bug
        // where the captured `status` value is always 'idle' (pre-setStatus call).
        setStatus(current => current === 'listening' ? 'idle' : current)
      },
    })
  }, [ttsSupported, handleSpeak])

  const stopListening = useCallback(() => {
    stopRecognitionRef.current?.()
    stopRecognitionRef.current = null
    setStatus('idle')
    setInterimTranscript('')
  }, [])

  const handleMicClick = useCallback(() => {
    if (status === 'listening') {
      stopListening()
    } else if (status === 'speaking') {
      cancelSpeech()
      setStatus('idle')
    } else {
      startListening()
    }
  }, [status, startListening, stopListening])

  const statusLabel: Record<Status, string> = {
    idle: 'Ready',
    listening: 'Listening...',
    processing: 'Processing...',
    speaking: 'Speaking...',
    error: 'Error',
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Voice Agent <span className="badge">MVP v0.1</span></h1>
        <p className="subtitle">Browser-based voice demo — mic → STT → mock AI → TTS</p>
      </header>

      {(!sttSupported || !ttsSupported) && (
        <div className="support-warning">
          {!sttSupported && <p>Speech recognition not supported. Use Chrome or Edge.</p>}
          {!ttsSupported && <p>Speech synthesis not supported in this browser.</p>}
        </div>
      )}

      <main className="app-main">
        <div className="mic-section">
          <button
            className={`mic-btn ${status === 'listening' ? 'listening' : ''} ${status === 'speaking' ? 'speaking' : ''}`}
            onClick={handleMicClick}
            disabled={status === 'processing'}
            aria-label={status === 'listening' ? 'Stop listening' : 'Start listening'}
          >
            {status === 'listening' ? '⏹' : status === 'speaking' ? '🔊' : '🎤'}
          </button>
          <div className={`status-pill status-${status}`}>
            {statusLabel[status]}
          </div>
        </div>

        {errorMsg && (
          <div className="error-box" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="panels">
          <section className="panel transcript-panel">
            <h2>You said</h2>
            <div className="panel-content">
              {finalTranscript && <p className="final-text">{finalTranscript}</p>}
              {interimTranscript && <p className="interim-text">{interimTranscript}</p>}
              {!finalTranscript && !interimTranscript && (
                <p className="placeholder">Your speech will appear here...</p>
              )}
            </div>
          </section>

          <section className="panel response-panel">
            <h2>Agent response</h2>
            <div className="panel-content">
              {agentResponse ? (
                <p className="response-text">{agentResponse}</p>
              ) : (
                <p className="placeholder">Agent response will appear here...</p>
              )}
            </div>
            {agentResponse && (
              <button
                className="speak-btn"
                onClick={() => handleSpeak(agentResponse)}
                disabled={status === 'speaking'}
              >
                {status === 'speaking' ? 'Speaking...' : 'Speak response'}
              </button>
            )}
          </section>
        </div>

        <div className="options-bar">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
            />
            Auto-speak responses
          </label>
        </div>
      </main>

      <footer className="app-footer">
        <p>Uses Web Speech API &mdash; best supported in Chrome / Edge &mdash; no data leaves your browser</p>
      </footer>
    </div>
  )
}
