// Minimal Web Speech API types (not yet in the standard TypeScript DOM lib)
interface ISpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): { readonly transcript: string };
  [index: number]: { readonly transcript: string };
}

interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface ISpeechRecognitionCtor {
  new (): ISpeechRecognition;
}

type SpeechWindow = Window & {
  SpeechRecognition?: ISpeechRecognitionCtor;
  webkitSpeechRecognition?: ISpeechRecognitionCtor;
};

export type RecognitionResult = {
  transcript: string;
  isFinal: boolean;
};

export type RecognitionHandlers = {
  onResult: (result: RecognitionResult) => void;
  onError: (error: string) => void;
  onEnd: () => void;
};

export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function createSpeechRecognition(handlers: RecognitionHandlers): () => void {
  if (!isSpeechRecognitionSupported()) {
    handlers.onError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
    return () => {};
  }

  const win = window as SpeechWindow;
  const SpeechRecognitionCtor = (win.SpeechRecognition ?? win.webkitSpeechRecognition)!;

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event: ISpeechRecognitionEvent) => {
    const last = event.results[event.results.length - 1];
    handlers.onResult({
      transcript: last[0].transcript,
      isFinal: last.isFinal,
    });
  };

  recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
    handlers.onError(`Recognition error: ${event.error}`);
  };

  recognition.onend = () => {
    handlers.onEnd();
  };

  recognition.start();

  return () => recognition.stop();
}
