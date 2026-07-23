// Web Speech API interfaces for browser support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * Clean and deduplicate repeated words, phrases, and sentences in transcript
 */
export const cleanDuplicateText = (text: string): string => {
  if (!text) return '';

  // 1. Remove consecutive duplicate words
  const words = text.trim().split(/\s+/);
  const cleanWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = cleanWords[cleanWords.length - 1];

    const currentNorm = word.toLowerCase().replace(/^[^\w\u0A80-\u0AFF]+|[^\w\u0A80-\u0AFF]+$/g, '');
    const prevNorm = prevWord ? prevWord.toLowerCase().replace(/^[^\w\u0A80-\u0AFF]+|[^\w\u0A80-\u0AFF]+$/g, '') : '';

    if (prevWord && currentNorm && currentNorm === prevNorm) {
      continue;
    }
    cleanWords.push(word);
  }

  let result = cleanWords.join(' ');

  // 2. Remove consecutive duplicate sentences or clauses
  const sentences = result.split(/(?<=[.!?|॥])\s+/);
  if (sentences.length > 1) {
    const cleanSentences: string[] = [];
    for (const sentence of sentences) {
      const sTrim = sentence.trim();
      if (!sTrim) continue;
      if (cleanSentences.length > 0 && cleanSentences[cleanSentences.length - 1].toLowerCase() === sTrim.toLowerCase()) {
        continue;
      }
      cleanSentences.push(sTrim);
    }
    result = cleanSentences.join(' ');
  }

  return result.trim();
};

export interface SpeechRecognitionManager {
  isSupported: boolean;
  start: (
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void,
    langCode?: string // 'gu-IN' | 'en-IN' | 'hi-IN'
  ) => void;
  stop: () => void;
}

let recognitionInstance: any = null;
let silenceTimer: any = null;

export const createSpeechRecognition = (): SpeechRecognitionManager => {
  const SpeechRecognitionClass =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    return {
      isSupported: false,
      start: (_onResult, onError) => {
        onError('તમારા બ્રાઉઝરમાં અવાજથી ટાઇપ કરવાની સુવિધા ઉપલબ્ધ નથી. કૃપા કરીને ટાઇપ કરીને જવાબ લખો.');
      },
      stop: () => {},
    };
  }

  return {
    isSupported: true,
    start: (onResult, onError, onEnd, langCode = 'gu-IN') => {
      try {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }

        if (recognitionInstance) {
          try {
            recognitionInstance.stop();
          } catch (e) {
            // ignore
          }
        }

        const recognition = new SpeechRecognitionClass();
        recognitionInstance = recognition;
        
        // Requirements 1, 4: Ignore interim results & use final results only
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = langCode;

        // Process final speech recognition results cleanly without repeating
        recognition.onresult = (event: any) => {
          // Requirement 7: Automatically stop recording after 2 seconds of silence
          if (silenceTimer) clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            try {
              if (recognitionInstance) {
                recognitionInstance.stop();
              }
            } catch (e) {
              // ignore
            }
          }, 2000);

          let fullFinalText = '';
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const chunk = event.results[i][0].transcript;
              fullFinalText += chunk + ' ';
            }
          }

          // Requirements 3 & 9: Clean duplicate words and sentences before emitting
          const cleanedText = cleanDuplicateText(fullFinalText);
          if (cleanedText) {
            onResult(cleanedText, true);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (silenceTimer) clearTimeout(silenceTimer);
          if (event.error === 'no-speech') {
            return;
          }
          onError(`અવાજ રેકોર્ડિંગ ક્ષતિ: ${event.error}`);
        };

        recognition.onend = () => {
          if (silenceTimer) clearTimeout(silenceTimer);
          onEnd();
        };

        recognition.start();

        // Initial 6-second silence timer if no speech starts
        silenceTimer = setTimeout(() => {
          try {
            if (recognitionInstance) {
              recognitionInstance.stop();
            }
          } catch (e) {
            // ignore
          }
        }, 6000);

      } catch (err: any) {
        if (silenceTimer) clearTimeout(silenceTimer);
        onError('માઇક્રોફોન શરૂ થઈ શક્યો નથી.');
        onEnd();
      }
    },
    stop: () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          // ignore
        }
        recognitionInstance = null;
      }
    },
  };
};

/**
 * Text-to-Speech synthesis with language support
 */
export const speakGujaratiText = (text: string, onEnd?: () => void, langCode: string = 'gu-IN') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88;
  utterance.pitch = 1.0;
  utterance.lang = langCode;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

