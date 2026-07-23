import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { createSpeechRecognition, speakGujaratiText, stopSpeech, cleanDuplicateText } from '../utils/speech';
import { 
  Volume2, 
  Square, 
  Mic, 
  MicOff, 
  RefreshCw, 
  ArrowLeft, 
  Send, 
  HelpCircle, 
  Edit3, 
  Award,
  AlertCircle
} from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestionsCount: number;
  attemptNumber: number;
  selectedLanguage: 'gu' | 'en' | 'hi';
  onLanguageChange: (lang: 'gu' | 'en' | 'hi') => void;
  onEvaluateAnswer: (studentTranscript: string, attemptNumber: number, language: 'gu' | 'en' | 'hi') => void;
  onBackToChapters: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  questionIndex,
  totalQuestionsCount,
  attemptNumber,
  selectedLanguage,
  onLanguageChange,
  onEvaluateAnswer,
  onBackToChapters,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const speechManagerRef = useRef<ReturnType<typeof createSpeechRecognition> | null>(null);

  useEffect(() => {
    speechManagerRef.current = createSpeechRecognition();
    return () => {
      stopSpeech();
      if (speechManagerRef.current) {
        speechManagerRef.current.stop();
      }
    };
  }, []);

  const getLangCode = (lang: 'gu' | 'en' | 'hi') => {
    if (lang === 'en') return 'en-IN';
    if (lang === 'hi') return 'hi-IN';
    return 'gu-IN';
  };

  const handleToggleTTS = () => {
    if (isPlayingTTS) {
      stopSpeech();
      setIsPlayingTTS(false);
    } else {
      setIsPlayingTTS(true);
      const textToRead = selectedLanguage === 'en' && question.questionTextEnglish
        ? question.questionTextEnglish
        : question.questionTextGujarati;
      speakGujaratiText(
        textToRead,
        () => {
          setIsPlayingTTS(false);
        },
        getLangCode(selectedLanguage)
      );
    }
  };

  const handleStartRecording = () => {
    setErrorMessage(null);
    if (!speechManagerRef.current) return;

    if (isRecording) {
      speechManagerRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechManagerRef.current.start(
        (text) => {
          setTranscript(cleanDuplicateText(text));
        },
        (err) => {
          setErrorMessage(err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        },
        getLangCode(selectedLanguage)
      );
    }
  };

  const handleClearTranscript = () => {
    setTranscript('');
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    const cleaned = cleanDuplicateText(transcript);
    if (!cleaned || cleaned.length === 0) {
      const msg = selectedLanguage === 'en'
        ? 'Please speak into the mic or type an answer first.'
        : selectedLanguage === 'hi'
        ? 'कृपया पहले माइक दबाकर बोलें या उत्तर टाइप करें।'
        : 'કૃપા કરીને પહેલા માઇક્રોફોન દબાવીને બોલો અથવા ટાઇપ કરીને જવાબ લખો.';
      setErrorMessage(msg);
      return;
    }
    stopSpeech();
    if (isRecording && speechManagerRef.current) {
      speechManagerRef.current.stop();
      setIsRecording(false);
    }
    onEvaluateAnswer(cleaned, attemptNumber, selectedLanguage);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Navigation & Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToChapters}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-800 hover:text-[#0061A4] bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-slate-200 transition-all hover:bg-slate-50"
          id="question-back-to-chapters-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#0061A4]" />
          <span>Back to Chapters</span>
        </button>

        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Attempt Badge */}
          <span className="text-xs font-black text-[#241E00] bg-amber-300 px-3.5 py-1.5 rounded-full border border-amber-400 shadow-xs flex items-center gap-1">
            <span>🎯</span>
            <span>
              Attempt {attemptNumber}/3
            </span>
          </span>

          <span className="text-xs font-black text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
            Q {questionIndex + 1} / {totalQuestionsCount}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#001D36] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            <Award className="w-4 h-4 text-[#0061A4]" />
            {question.totalMarks} Marks
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6 relative overflow-hidden">
        
        {/* Top Accent Pill & Language Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0061A4] text-white font-black text-xs uppercase tracking-wider shadow-xs">
            <HelpCircle className="w-4 h-4" />
            <span>NCERT Question ({question.totalMarks} Marks)</span>
          </div>

          {/* Language Selection Bar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => onLanguageChange('gu')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                selectedLanguage === 'gu'
                  ? 'bg-[#0061A4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0061A4]'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-[#0061A4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0061A4]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                selectedLanguage === 'hi'
                  ? 'bg-[#0061A4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0061A4]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Text-to-Speech (Read Question) Button */}
          <button
            onClick={handleToggleTTS}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-xs ${
              isPlayingTTS
                ? 'bg-amber-300 text-slate-900 animate-pulse'
                : 'bg-slate-100 text-[#0061A4] hover:bg-slate-200 border border-slate-200'
            }`}
            id="tts-read-question-btn"
          >
            {isPlayingTTS ? (
              <>
                <Square className="w-4 h-4 fill-slate-900 text-slate-900" />
                <span>Stop Reading</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#0061A4]" />
                <span>Read Aloud 🔊</span>
              </>
            )}
          </button>
        </div>

        {/* Question Text Display */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-relaxed pr-6">
            {selectedLanguage === 'en' && question.questionTextEnglish
              ? question.questionTextEnglish
              : question.questionTextGujarati}
          </h2>

          {selectedLanguage !== 'en' && question.questionTextEnglish && (
            <p className="text-xs text-slate-500 font-semibold italic">
              {question.questionTextEnglish}
            </p>
          )}

          {/* Media & Attachments Display */}
          {(question.imageUrl || question.diagramUrl || question.audioUrl || question.pdfUrl) && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mt-3">
              <span className="text-xs font-black uppercase text-[#0061A4] block">
                📎 Question Attachments:
              </span>

              {/* Attached Image */}
              {(question.imageUrl || question.diagramUrl) && (
                <div className="rounded-xl overflow-hidden max-h-64 border border-slate-200 bg-white">
                  <img
                    src={question.imageUrl || question.diagramUrl}
                    alt="Question Diagram"
                    className="max-h-64 mx-auto object-contain p-2"
                  />
                </div>
              )}

              {/* Attached Audio */}
              {question.audioUrl && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-purple-700 block">🔊 Audio Reference:</span>
                  <audio controls src={question.audioUrl} className="w-full h-8" />
                </div>
              )}

              {/* Attached PDF */}
              {question.pdfUrl && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#006D32] flex items-center gap-1.5">
                    📄 <span>PDF Document Attached</span>
                  </span>
                  <a
                    href={question.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-[#006D32] text-white rounded-lg text-xs font-black shadow-xs hover:bg-[#005225]"
                  >
                    Open PDF
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Hint Display for Attempt 2 or 3 */}
          {attemptNumber > 1 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 space-y-1">
              <span className="font-black text-amber-900 flex items-center gap-1">
                💡 <span>Hint for Attempt {attemptNumber}:</span>
              </span>
              <p className="font-bold text-amber-950">
                {attemptNumber === 2
                  ? (question.hint1 || question.hintGujarati || 'પ્રશ્નમાં આપેલ મુખ્ય શબ્દો પર ધ્યાન આપો.')
                  : (question.hint2 || question.hint1 || question.hintGujarati || 'જવાબના તમામ અપેક્ષિત કી-પોઈન્ટ્સ આવરી લો.')}
              </p>
            </div>
          )}

        </div>

        {/* Attempt Nudge Tip */}
        <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-[#0061A4] text-xs sm:text-sm font-bold text-slate-600 flex items-center justify-between">
          <span>
            {selectedLanguage === 'en'
              ? `Attempt ${attemptNumber} of 3: Speak or type key points clearly. AI will evaluate and give hints if incomplete.`
              : selectedLanguage === 'hi'
              ? `प्रयास ${attemptNumber}/3: मुख्य बिंदुओं को स्पष्ट रूप से बोलें या लिखें। यदि उत्तर अधूरा है, तो AI एक संकेत देगा।`
              : `પ્રયાસ ${attemptNumber} / ૩: મુખ્ય મુદ્દા સ્પષ્ટ બોલો. અધૂરો જવાબ હશે તો AI હિન્ટ (ઈશારો) આપશે.`}
          </span>
        </div>

        {/* Voice Control Section */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between shadow-xs border-2 border-[#0061A4] gap-6 relative">
          
          {isRecording && (
            <div className="absolute -top-3 left-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Listening to your voice... 🎙️</span>
            </div>
          )}

          <div className="flex flex-col text-center md:text-left">
            <p className="text-xs font-black text-[#0061A4] mb-1 uppercase tracking-widest">
              Voice Control (STT)
            </p>
            <p className="text-lg sm:text-xl font-black text-slate-900">
              {isRecording 
                ? 'Listening to your answer...'
                : 'Tap mic to speak your answer'}
            </p>
            <p className="text-xs text-slate-500 font-bold mt-1">
              {selectedLanguage === 'en'
                ? 'Speak clearly. Auto-stops after 2 seconds of silence.'
                : selectedLanguage === 'hi'
                ? 'स्पष्ट हिंदी में बोलें। २ सेकंड शांत रहने पर स्वतः रुक जाएगा।'
                : 'ગુજરાતીમાં સ્પષ્ટ બોલો. ૨ સેકન્ડ શાંત રહેવાથી આપોઆપ બંધ થશે.'}
            </p>
          </div>

          <button
            onClick={handleStartRecording}
            className={`group w-24 h-24 rounded-full flex items-center justify-center transition-all transform active:scale-95 shrink-0 ${
              isRecording
                ? 'bg-rose-600 text-white shadow-md animate-pulse'
                : 'bg-[#0061A4] text-white shadow-md hover:scale-105'
            }`}
            id="big-mic-record-btn"
          >
            {isRecording ? (
              <MicOff className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>
        </div>

        {/* Transcript Preview Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-600">
            <span className="flex items-center gap-1.5 text-[#0061A4]">
              <Edit3 className="w-3.5 h-3.5" />
              Spoken Transcript / Typed Answer:
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsManualEdit(!isManualEdit)}
                className="text-xs text-[#0061A4] font-black hover:underline"
                id="toggle-manual-edit-btn"
              >
                {isManualEdit 
                  ? 'Close Typing Mode'
                  : 'Type / Edit Manually'}
              </button>
              {transcript && (
                <button
                  onClick={handleClearTranscript}
                  className="text-xs text-rose-600 font-black hover:underline flex items-center gap-1"
                  id="clear-transcript-btn"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {isManualEdit ? (
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-28 p-3 text-sm font-bold text-slate-900 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
              id="manual-transcript-textarea"
            />
          ) : (
            <div className="min-h-[70px] text-sm font-bold text-slate-900 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
              {transcript ? (
                <span>"{transcript}"</span>
              ) : (
                <span className="text-slate-400 italic font-semibold">
                  Press the mic button or type your answer here...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message if any */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-black flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!transcript || transcript.trim().length === 0}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-xs transition-all flex items-center justify-center gap-3 ${
              transcript && transcript.trim().length > 0
                ? 'bg-[#006D32] hover:bg-[#005225] text-white hover:scale-[1.01]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            id="submit-answer-btn"
          >
            <span>Evaluate Answer (AI)</span>
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
};

