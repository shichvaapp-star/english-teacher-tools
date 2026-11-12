// Browser APIs and window fields that TypeScript's DOM types don't include.

/** Minimal Web Speech API recognition types (Chrome/Safari expose it as webkitSpeechRecognition). */
interface SpeechRecognitionAlternativeLike {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionEventLike extends Event {
  readonly results: ArrayLike<ArrayLike<SpeechRecognitionAlternativeLike>>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;

  // Utterances kept on window so Chrome/Safari don't garbage-collect them mid-speech.
  __speechUtteranceSet?: Set<SpeechSynthesisUtterance>;
  __questionUtterance?: SpeechSynthesisUtterance | null;
  __unseenWordUtterance?: SpeechSynthesisUtterance | null;
  __vocabUtterance?: SpeechSynthesisUtterance | null;
  __writingUtterance?: SpeechSynthesisUtterance | null;
}
