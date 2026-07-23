import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Home, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  ArrowRight,
  Send,
  GraduationCap,
  Languages,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  XCircle,
  PlayCircle,
  ListChecks,
  Trash2,
  Share2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { StudentProfile, AIChatMessage, Question, Standard } from '../types';
import { cleanDuplicateText } from '../utils/speech';
import { 
  saveAIChatMessageToFirestore, 
  subscribeAIChatHistory, 
  clearAIChatHistoryInFirestore 
} from '../services/firebaseService';

interface VoiceAITeacherScreenProps {
  profile: StudentProfile;
  onNavigateHome: () => void;
  allQuestions?: Question[];
  onStartPracticeQuestion?: (q: Question) => void;
}

const PRESET_QUESTIONS = {
  gu: [
    "ધોરણ ૭ વિજ્ઞાન: સ્વાવલંબી અને પરાવલંબી પોષણ એટલે શું?",
    "ધોરણ ૬ વિજ્ઞાન: ખોરાકના મુખ્ય પોષક તત્વો કયા છે?",
    "ધોરણ ૮ ગણિત: સંમેય સંખ્યાઓ કોને કહેવાય?",
    "ધોરણ ૭ વિજ્ઞાન: પ્રકાશસંશ્લેષણ પ્રક્રિયા સમજાવો.",
    "ધોરણ ૭ વિજ્ઞાન: એસિડ અને બેઝ વચ્ચેનો તફાવત શું છે?"
  ],
  hi: [
    "कक्षा 7 विज्ञान: स्वपोषी और विषमपोषी पोषण क्या है?",
    "कक्षा 6 विज्ञान: भोजन के मुख्य पोषक तत्व कौन से हैं?",
    "कक्षा 8 गणित: परिमेय संख्याएं किसे कहते हैं?",
    "कक्षा 7 विज्ञान: प्रकाश-संश्लेषण प्रक्रिया समझाएं।",
    "कक्षा 7 विज्ञान: अम्ल और क्षार में क्या अंतर है?"
  ],
  en: [
    "Class 7 Science: What is Autotrophic and Heterotrophic nutrition?",
    "Class 6 Science: What are the main nutrients in food?",
    "Class 8 Maths: What are rational numbers?",
    "Class 7 Science: Explain the process of photosynthesis.",
    "Class 7 Science: What is the difference between acids and bases?"
  ]
};

export const VoiceAITeacherScreen: React.FC<VoiceAITeacherScreenProps> = ({
  profile,
  onNavigateHome,
  allQuestions = [],
  onStartPracticeQuestion
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'gu' | 'hi' | 'en'>('gu');
  const [selectedStandard, setSelectedStandard] = useState<Standard>(profile.standard || 7);
  
  const [status, setStatus] = useState<'idle' | 'listening' | 'analyzing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  
  // Chat History
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Follow-up interaction states
  const [followupInput, setFollowupInput] = useState('');
  const [evaluatingFollowup, setEvaluatingFollowup] = useState(false);
  const [followupEvaluation, setFollowupEvaluation] = useState<{ isCorrect?: boolean; hint?: string; feedback?: string } | null>(null);

  // Simplification states
  const [isSimplifying, setIsSimplifying] = useState(false);
  
  // Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Subscribe to Firebase Chat History on mount
  useEffect(() => {
    const studentId = profile.id || profile.email || 'student_local';
    const unsubscribe = subscribeAIChatHistory(studentId, (firestoreMsgs) => {
      if (firestoreMsgs && firestoreMsgs.length > 0) {
        setChatMessages(firestoreMsgs);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      stopSpeechSynthesis();
    };
  }, [profile.id]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, currentResponse]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage === 'hi' ? 'hi-IN' : 'gu-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setStatus('listening');
          setErrorMsg(null);
        };

        recognition.onresult = (event: any) => {
          let fullText = '';
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              fullText += event.results[i][0].transcript + ' ';
            }
          }
          const cleaned = cleanDuplicateText(fullText);
          if (cleaned) {
            setTranscript(cleaned);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'no-speech') {
            setErrorMsg(
              selectedLanguage === 'en'
                ? 'No voice detected. Please speak clearly into microphone.'
                : selectedLanguage === 'hi'
                ? 'आवाज नहीं सुनाई दी। कृपया जोर से बोलें।'
                : 'અવાજ સંભળાયો નથી. કૃપા કરીને મોટેથી બોલો.'
            );
          } else {
            setErrorMsg(
              selectedLanguage === 'en'
                ? 'Microphone permission or network issue. You can also type below.'
                : selectedLanguage === 'hi'
                ? 'मायक्रोफोन अनुमति या नेटवर्क समस्या है। आप नीचे टाइप भी कर सकते हैं।'
                : 'માઇક્રોફોન મંજૂરી અથવા નેટવર્ક સમસ્યા છે. તમે નીચે ટાઇપ કરી શકો છો.'
            );
          }
          setStatus('idle');
        };

        recognition.onend = () => {
          setStatus('idle');
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition init error:', e);
      }
    }
  }, [selectedLanguage]);

  const startListening = () => {
    stopSpeechSynthesis();
    setTranscript('');
    setErrorMsg(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage === 'hi' ? 'hi-IN' : 'gu-IN';
        recognitionRef.current.start();
      } catch (e) {
        setStatus('listening');
      }
    } else {
      setStatus('listening');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
    if (transcript.trim().length > 0) {
      handleAskQuestion(transcript);
    } else {
      setStatus('idle');
    }
  };

  const speakText = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;
    stopSpeechSynthesis();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage === 'hi' ? 'hi-IN' : 'gu-IN';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (selectedLanguage === 'gu') {
      const guVoice = voices.find(v => v.lang.includes('gu') || v.lang.includes('GU'));
      if (guVoice) utterance.voice = guVoice;
    } else if (selectedLanguage === 'hi') {
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
      if (hiVoice) utterance.voice = hiVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Main Question Handler
  const handleAskQuestion = async (queryStr: string) => {
    const qText = queryStr || textInput || transcript;
    if (!qText || qText.trim().length === 0) {
      setErrorMsg(
        selectedLanguage === 'en'
          ? 'Please speak or type a question.'
          : selectedLanguage === 'hi'
          ? 'कृपया बोलकर या लिखकर प्रश्न पूछें।'
          : 'કૃપા કરીને બોલીને અથવા ટાઇપ કરીને પ્રશ્ન પૂછો.'
      );
      return;
    }

    stopSpeechSynthesis();
    setStatus('analyzing');
    setErrorMsg(null);
    setFollowupEvaluation(null);
    setFollowupInput('');

    const studentId = profile.id || profile.email || 'student_local';

    // Save user message to chat
    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      studentId,
      role: 'user',
      senderName: profile.name,
      text: qText.trim(),
      timestamp: new Date().toISOString(),
      language: selectedLanguage,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    saveAIChatMessageToFirestore(studentId, userMsg);

    try {
      const res = await fetch('/api/ai-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qText.trim(),
          language: selectedLanguage,
          standard: selectedStandard,
          action: 'explain',
        }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        const data = json.data;
        setCurrentResponse(data);
        setStatus('idle');
        setTextInput('');
        setTranscript('');

        // Save AI response message
        const aiMsg: AIChatMessage = {
          id: `ai_${Date.now()}`,
          studentId,
          role: 'assistant',
          senderName: selectedLanguage === 'en' ? 'I M MASTER AI Teacher Guruji' : selectedLanguage === 'hi' ? 'I M MASTER AI गुरुजी' : 'I M MASTER AI ગુરુજી',
          text: data.answerText,
          spokenText: data.spokenText,
          timestamp: new Date().toISOString(),
          language: selectedLanguage,
          detectedClass: data.detectedClass,
          detectedSubject: data.detectedSubject,
          detectedChapter: data.detectedChapter,
          stepByStepExplanation: data.detailedExplanation,
          followUpQuestion: data.followUpQuestion,
          practiceQuestion: data.practiceQuestion,
          isWithinSyllabus: data.isWithinSyllabus,
        };

        setChatMessages((prev) => [...prev, aiMsg]);
        saveAIChatMessageToFirestore(studentId, aiMsg);

        // Play audio automatically
        if (data.spokenText || data.answerText) {
          speakText(data.spokenText || data.answerText);
        }
      } else {
        throw new Error(json.error || 'AI Teacher response error.');
      }
    } catch (err: any) {
      console.error('AI Teacher error:', err);
      setErrorMsg(
        selectedLanguage === 'en'
          ? 'Network error. Please try again.'
          : selectedLanguage === 'hi'
          ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।'
          : 'નેટવર્ક ક્ષતિ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.'
      );
      setStatus('idle');
    }
  };

  // Requirement 10: "Simplify More" button handler
  const handleSimplifyMore = async () => {
    if (!currentResponse) return;
    setIsSimplifying(true);
    stopSpeechSynthesis();

    const studentId = profile.id || profile.email || 'student_local';

    try {
      const res = await fetch('/api/ai-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentResponse.detectedQuestion || currentResponse.answerText,
          previousQuestion: currentResponse.detectedQuestion,
          previousAnswer: currentResponse.answerText,
          language: selectedLanguage,
          action: 'simplify',
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const data = json.data;
        setCurrentResponse(data);

        const simplifiedMsg: AIChatMessage = {
          id: `ai_simp_${Date.now()}`,
          studentId,
          role: 'assistant',
          senderName: selectedLanguage === 'en' ? 'I M MASTER AI Teacher (Simplified)' : selectedLanguage === 'hi' ? 'I M MASTER AI गुरुजी (सरल रूप)' : 'I M MASTER AI ગુરુજી (સરલ સમજૂતી)',
          text: data.answerText,
          spokenText: data.spokenText,
          timestamp: new Date().toISOString(),
          language: selectedLanguage,
          stepByStepExplanation: data.detailedExplanation,
          followUpQuestion: data.followUpQuestion,
          practiceQuestion: data.practiceQuestion,
        };

        setChatMessages((prev) => [...prev, simplifiedMsg]);
        saveAIChatMessageToFirestore(studentId, simplifiedMsg);

        if (data.spokenText || data.answerText) {
          speakText(data.spokenText || data.answerText);
        }
      }
    } catch (e) {
      console.error('Simplify error:', e);
    } finally {
      setIsSimplifying(false);
    }
  };

  // Requirement 5 & 6: Follow-up question answer evaluation (gives hint if wrong)
  const handleEvaluateFollowupAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupInput.trim() || !currentResponse?.followUpQuestion) return;

    setEvaluatingFollowup(true);
    stopSpeechSynthesis();

    try {
      const res = await fetch('/api/ai-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followUpQuestion: currentResponse.followUpQuestion,
          studentFollowupAnswer: followupInput.trim(),
          language: selectedLanguage,
          action: 'evaluate_followup',
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const data = json.data;
        setFollowupEvaluation({
          isCorrect: data.isStudentFollowupCorrect,
          hint: data.hint,
          feedback: data.answerText || data.spokenText,
        });

        if (data.spokenText || data.hint) {
          speakText(data.spokenText || data.hint);
        }
      }
    } catch (err) {
      console.error('Followup evaluation err:', err);
    } finally {
      setEvaluatingFollowup(false);
    }
  };

  // Requirement 11: "Practice Now" button handler
  const handlePracticeNow = () => {
    if (!currentResponse) return;
    
    // Find matching question in database or trigger callback
    const match = allQuestions.find(
      (q) =>
        q.questionTextGujarati.includes(currentResponse.detectedQuestion) ||
        (currentResponse.detectedSubject && q.subject.includes(currentResponse.detectedSubject.toLowerCase()))
    );

    if (match && onStartPracticeQuestion) {
      onStartPracticeQuestion(match);
    } else if (allQuestions.length > 0 && onStartPracticeQuestion) {
      onStartPracticeQuestion(allQuestions[0]);
    } else {
      alert(
        selectedLanguage === 'en'
          ? `Practice Question: ${currentResponse.practiceQuestion || 'Write key points in your notebook!'}`
          : selectedLanguage === 'hi'
          ? `अभ्यास प्रश्न: ${currentResponse.practiceQuestion || 'अपनी नोटबुक में मुख्य बिंदु लिखें!'}`
          : `પ્રેક્ટિસ પ્રશ્ન: ${currentResponse.practiceQuestion || 'તમારી નોટબુકમાં મુખ્ય મુદ્દાઓ લખો!'}`
      );
    }
  };

  // Clear Chat History
  const handleClearHistory = () => {
    if (confirm(selectedLanguage === 'en' ? 'Clear chat history?' : selectedLanguage === 'hi' ? 'क्या चैट इतिहास साफ़ करें?' : 'શું ચેટ હિસ્ટ્રી ભૂંસી નાખવી છે?')) {
      const studentId = profile.id || profile.email || 'student_local';
      setChatMessages([]);
      setCurrentResponse(null);
      clearAIChatHistoryInFirestore(studentId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001D36] via-[#002B4E] to-[#001D36] text-white p-3 sm:p-6 pb-28 space-y-6">
      
      {/* Top Navigation Header */}
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-blue-500 text-[#001D36] flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-7 h-7 text-[#001D36]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                NCERT ૬ - ૭ - ૮
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300">
                {selectedLanguage === 'en' ? 'Maths & Science' : selectedLanguage === 'hi' ? 'गणित और विज्ञान' : 'ગણિત & વિજ્ઞાન'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
              🎓 I M MASTER AI Live Teacher (ગુરુજી)
            </h1>
          </div>
        </div>

        {/* Right Controls: Language Switcher & Home */}
        <div className="flex items-center gap-2">
          
          {/* Requirement 16 & 9: Language Switcher Tabs */}
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 flex items-center gap-1 shadow-sm">
            <button
              onClick={() => setSelectedLanguage('gu')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                selectedLanguage === 'gu'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="ai-teacher-lang-gu-btn"
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                selectedLanguage === 'hi'
                  ? 'bg-amber-500 text-[#001D36] shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="ai-teacher-lang-hi-btn"
            >
              हिंदी
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="ai-teacher-lang-en-btn"
            >
              English
            </button>
          </div>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-black transition-all shadow-md"
            id="ai-teacher-home-top-btn"
          >
            <Home className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Center Microphone & Main Voice Input Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-[36px] p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Teacher Subtitle & Standard Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="text-left space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-blue-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                {selectedLanguage === 'en' ? 'Speak or Type Your Question' : selectedLanguage === 'hi' ? 'बोलकर या लिखकर प्रश्न पूछें' : 'અવાજથી અથવા ટાઇપ કરીને પ્રશ્ન પૂછો'}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {selectedLanguage === 'en' 
                  ? 'NCERT Std 6, 7 & 8 Maths, Science & All Subjects' 
                  : selectedLanguage === 'hi'
                  ? 'NCERT कक्षा 6, 7 और 8 गणित एवं विज्ञान मार्गदर्शन'
                  : 'ધોરણ ૬, ૭ કે ૮ NCERT ગણિત અને વિજ્ઞાન ત્વરિત ઉત્તર'}
              </p>
            </div>

            {/* Standard Selector */}
            <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/15">
              <span className="text-[11px] font-bold text-slate-300 pl-2">
                {selectedLanguage === 'en' ? 'Std:' : selectedLanguage === 'hi' ? 'कक्षा:' : 'ધોરણ:'}
              </span>
              {([6, 7, 8] as Standard[]).map((std) => (
                <button
                  key={std}
                  onClick={() => setSelectedStandard(std)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    selectedStandard === std
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                  id={`ai-teacher-std-${std}-btn`}
                >
                  {std}
                </button>
              ))}
            </div>
          </div>

          {/* ONE LARGE MICROPHONE BUTTON IN CENTER */}
          <div className="flex flex-col items-center justify-center my-4 space-y-3">
            <div className="relative flex items-center justify-center">
              {status === 'listening' && (
                <>
                  <div className="absolute w-44 h-44 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                  <div className="absolute w-36 h-36 rounded-full bg-emerald-400/30 animate-pulse pointer-events-none" />
                </>
              )}

              <button
                onClick={status === 'listening' ? stopListening : startListening}
                className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl border-4 ${
                  status === 'listening'
                    ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white border-white ring-8 ring-emerald-500/40 animate-pulse'
                    : status === 'analyzing'
                    ? 'bg-amber-500 text-white border-amber-300 ring-8 ring-amber-500/30 animate-spin'
                    : 'bg-gradient-to-tr from-[#0061A4] via-[#0080FF] to-emerald-500 text-white border-white/40 ring-8 ring-blue-500/20 hover:scale-105'
                }`}
                id="main-ai-live-teacher-mic-btn"
              >
                <Mic className={`w-12 h-12 ${status === 'listening' ? 'scale-125' : ''}`} />
              </button>
            </div>

            {/* Mic Status Text */}
            <div className="space-y-1">
              <span className={`text-xs font-black uppercase tracking-wider block px-4 py-1.5 rounded-full inline-block ${
                status === 'listening'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : status === 'analyzing'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/10 text-white border border-white/20'
              }`}>
                {status === 'listening' && (
                  selectedLanguage === 'en' ? '🎙️ Listening... (Speak in English)' : selectedLanguage === 'hi' ? '🎙️ सुन रहे हैं... (हिंदी में बोलें)' : '🎙️ સાંભળી રહ્યા છીએ... (ગુજરાતીમાં બોલો)'
                )}
                {status === 'analyzing' && '⚡ I M MASTER AI ગુરુજી વિશ્લેષણ કરી રહ્યા છે...'}
                {status === 'idle' && (
                  selectedLanguage === 'en' ? 'Tap Mic to Speak' : selectedLanguage === 'hi' ? 'माइक पर दबाकर बोलें' : 'માઇક પર દબાવીને અવાજમાં પૂછો'
                )}
              </span>

              {status === 'listening' && (
                <p className="text-xs text-emerald-300 font-bold animate-pulse pt-1">
                  {selectedLanguage === 'en' ? 'Tap mic again when finished speaking' : selectedLanguage === 'hi' ? 'बोलने के बाद फिर से माइक दबाएं' : 'બોલી રહ્યા બાદ ફરી માઇક દબાવો'}
                </p>
              )}
            </div>
          </div>

          {/* Transcript Display */}
          {(transcript || status === 'listening') && (
            <div className="bg-black/40 border border-white/15 rounded-2xl p-4 text-left max-w-xl mx-auto space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">
                તમારો પ્રશ્ન (Your Question):
              </span>
              <p className="text-sm font-semibold text-white min-h-[1.5rem]">
                {transcript || 'બોલવાનું શરૂ કરો...'}
              </p>
            </div>
          )}

          {/* Manual Text Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion(textInput);
            }} 
            className="max-w-xl mx-auto flex items-center gap-2 pt-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                selectedLanguage === 'en'
                  ? 'Or type your question here...'
                  : selectedLanguage === 'hi'
                  ? 'अथवा यहाँ टाइप करके पूछें...'
                  : 'અથવા અહીં ટાઇપ કરીને પ્રશ્ન પૂછો...'
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
              id="ai-teacher-text-input"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || status === 'analyzing'}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 disabled:opacity-50 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-1.5"
              id="ai-teacher-text-submit-btn"
            >
              <span>મોકલો</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Sample Preset NCERT Questions */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[11px] font-bold text-slate-300 block mb-2">
              💡 {selectedLanguage === 'en' ? 'Sample Questions:' : selectedLanguage === 'hi' ? 'नमूना प्रश्न:' : 'ઝડપી પ્રશ્ન પસંદ કરો:'}
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {PRESET_QUESTIONS[selectedLanguage].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTextInput(q);
                    handleAskQuestion(q);
                  }}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-900/60 border border-red-500/50 text-red-200 p-3 rounded-2xl text-xs flex items-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* AI RESPONSE & TEACHER EXPLANATION CARD */}
        {currentResponse && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[36px] p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in" id="ai-teacher-response-card">
            
            {/* Header Metadata Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${
                  currentResponse.isWithinSyllabus !== false
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-amber-500 text-[#001D36]'
                }`}>
                  <BookOpen className="w-3.5 h-3.5" />
                  {currentResponse.detectedClass || `Std ${selectedStandard}`}
                </span>

                <span className="bg-blue-600/80 text-white px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30">
                  {currentResponse.detectedSubject || 'વિજ્ઞાન & ગણિત'}
                </span>

                {currentResponse.detectedChapter && (
                  <span className="bg-purple-600/80 text-white px-3 py-1 rounded-full text-xs font-bold border border-purple-400/30">
                    {currentResponse.detectedChapter}
                  </span>
                )}
              </div>

              {isSpeaking && (
                <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 text-xs font-bold animate-pulse">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>I M MASTER AI ગુરુજી બોલી રહ્યા છે...</span>
                </div>
              )}
            </div>

            {/* Question Title */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                પ્રશ્ન (Question):
              </span>
              <h3 className="text-base sm:text-xl font-black text-white">
                "{currentResponse.detectedQuestion || 'આપનો પ્રશ્ન'}"
              </h3>
            </div>

            {/* Direct Textbook Answer */}
            <div className="bg-black/30 border border-white/15 rounded-3xl p-5 sm:p-6 space-y-3">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                NCERT આદર્શ ઉત્તર (Direct Answer):
              </span>
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                {currentResponse.answerText}
              </p>
            </div>

            {/* Requirement 4 & 8: Step-by-Step Detailed Explanation */}
            {currentResponse.detailedExplanation && (
              <div className="bg-gradient-to-br from-black/50 via-slate-900/60 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 space-y-3">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  📖 તબક્કાવાર સરળ સમજૂતી (Step-by-Step Explanation):
                </span>
                <div className="text-xs sm:text-sm text-emerald-50 leading-relaxed whitespace-pre-line space-y-2">
                  {currentResponse.detailedExplanation}
                </div>
              </div>
            )}

            {/* Requirement 5 & 6: Follow-up Check Question & Hint Evaluation Box */}
            {currentResponse.followUpQuestion && (
              <div className="bg-gradient-to-r from-blue-900/50 via-emerald-950/60 to-blue-900/50 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4">
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                    🤔 તપાસો તમારું જ્ઞાન (Check Your Understanding)
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-white pt-2 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>"{currentResponse.followUpQuestion}"</span>
                  </h4>
                </div>

                {/* Interactive Answer Input for Check Question */}
                <form onSubmit={handleEvaluateFollowupAnswer} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={followupInput}
                      onChange={(e) => setFollowupInput(e.target.value)}
                      placeholder={
                        selectedLanguage === 'en'
                          ? 'Type your answer to this check question...'
                          : selectedLanguage === 'hi'
                          ? 'इस जाँच प्रश्न का उत्तर लिखें...'
                          : 'આ પ્રશ્નનો જવાબ અહીં લખો...'
                      }
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-black/40 border border-white/20 text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      id="ai-teacher-followup-input"
                    />
                    <button
                      type="submit"
                      disabled={evaluatingFollowup || !followupInput.trim()}
                      className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white px-4 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md shrink-0"
                      id="ai-teacher-followup-submit-btn"
                    >
                      {evaluatingFollowup ? 'ચકાસી રહ્યા છીએ...' : 'જવાબ ચકાસો 🎯'}
                    </button>
                  </div>
                </form>

                {/* Requirement 6: Hint Box if student answer was incorrect */}
                {followupEvaluation && (
                  <div className={`p-4 rounded-2xl border-2 space-y-2 animate-fade-in ${
                    followupEvaluation.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                      : 'bg-amber-950/90 border-amber-400 text-amber-100'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm">
                      {followupEvaluation.isCorrect ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span>અદ્ભુત! તમારો જવાબ બિલકુલ સાચો છે! 🌟</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-5 h-5 text-amber-400" />
                          <span>💡 માર્ગદર્શક ઈશારો (Hint):</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                      {followupEvaluation.hint || followupEvaluation.feedback}
                    </p>

                    {!followupEvaluation.isCorrect && (
                      <p className="text-[11px] text-amber-300 italic font-bold">
                        ઈશારાની મદદથી ફરી વિચાર કરીને સાચો જવાબ આપવાનો પ્રયાસ કરો!
                      </p>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* MANDATORY ACTION BUTTONS (Req 9, 10, 11):
                1. 🔁 Repeat Explanation (જવાબ ફરી સાંભળો)
                2. ✨ Simplify More (વધુ સરળ બનાવો)
                3. 📝 Practice Now (હવે પ્રશ્ન પ્રેક્ટિસ કરો)
                4. 🎤 Ask Another Question (નવો પ્રશ્ન પૂછો)
            */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
              
              {/* 1. 🔁 Repeat Explanation */}
              <button
                onClick={() => speakText(currentResponse.spokenText || currentResponse.answerText)}
                className="py-3 px-3 rounded-2xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
                id="ai-teacher-repeat-btn"
              >
                <Volume2 className="w-4 h-4 text-white" />
                <span>🔁 ફરી સાંભળો</span>
              </button>

              {/* 2. ✨ Simplify More */}
              <button
                onClick={handleSimplifyMore}
                disabled={isSimplifying}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
                id="ai-teacher-simplify-btn"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isSimplifying ? 'સરળ થઈ રહ્યું છે...' : '✨ વધુ સરળ બનાવો'}</span>
              </button>

              {/* 3. 📝 Practice Now */}
              <button
                onClick={handlePracticeNow}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
                id="ai-teacher-practice-now-btn"
              >
                <ListChecks className="w-4 h-4 text-white" />
                <span>📝 સવાલ પ્રેક્ટિસ કરો</span>
              </button>

              {/* 4. 🎤 Ask Another Question */}
              <button
                onClick={startListening}
                className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
                id="ai-teacher-ask-new-btn"
              >
                <Mic className="w-4 h-4 text-emerald-300" />
                <span>🎤 નવો પ્રશ્ન</span>
              </button>

            </div>

          </div>
        )}

        {/* MULTI-TURN CONVERSATION HISTORY DISPLAY CARD (Req 12 & 13) */}
        {chatMessages.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-[32px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base text-white">
                  ચેટ ઇતિહાસ (Saved Conversation History)
                </h3>
              </div>

              <button
                onClick={handleClearHistory}
                className="text-xs text-red-300 hover:text-red-200 font-bold flex items-center gap-1 bg-red-950/60 px-3 py-1 rounded-xl border border-red-500/30"
                id="ai-teacher-clear-history-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ઇતિહાસ ભૂંસો</span>
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-1 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-bold px-1">
                    {msg.senderName || (msg.role === 'user' ? 'તમે' : 'I M MASTER AI ગુરુજી')} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div
                    className={`max-w-[85%] p-4 rounded-3xl text-xs sm:text-sm font-medium leading-relaxed shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-100 border border-white/15 rounded-tl-none space-y-2'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.stepByStepExplanation && msg.role === 'assistant' && (
                      <div className="pt-2 mt-2 border-t border-white/10 text-xs text-emerald-300 whitespace-pre-line">
                        {msg.stepByStepExplanation.slice(0, 150)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
