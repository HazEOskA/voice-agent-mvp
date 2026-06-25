export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

export type SpeakOptions = {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

export function speak(options: SpeakOptions): () => void {
  const { text, lang = 'en-US', rate = 1, pitch = 1, onEnd, onError } = options;

  if (!isSpeechSynthesisSupported()) {
    onError?.('Speech synthesis is not supported in this browser.');
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;

  utterance.onend = () => onEnd?.();
  utterance.onerror = (event) => onError?.(`Synthesis error: ${event.error}`);

  window.speechSynthesis.speak(utterance);

  return () => window.speechSynthesis.cancel();
}

export function cancelSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
