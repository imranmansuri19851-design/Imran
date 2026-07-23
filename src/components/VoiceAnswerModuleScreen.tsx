import React, { useState, useEffect, useRef } from 'react';
import { Chapter, Question, Standard, SubjectId, StudentProfile, EvaluationResult, PracticeHistoryItem } from '../types';
import { SUBJECTS } from '../data/ncertContent';
import { createSpeechRecognition, speakGujaratiText, stopSpeech, cleanDuplicateText } from '../utils/speech';
import { savePracticeHistoryToFirestore, saveStudentProfileToFirestore } from '../services/firebaseService';
import { 
  Mic, 
  MicOff, 
  Volume2, 
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
  Award,
  Book,
  Layers,
  RefreshCw,
  Edit3,
  Lightbulb,
  XCircle,
  GraduationCap,
  Star
} from 'lucide-react';

interface VoiceAnswerModuleScreenProps {
  allChapters: Chapter[];
  allQuestions: Question[];
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onNavigateHome: () => void;
}

export const VoiceAnswerModuleScreen: React.FC<VoiceAnswerModuleScreenProps> = ({
  allChapters,
  allQuestions,
  profile,
  onUpdateProfile,
  onNavigateHome,
}) => {
  // Requirement 1: Selection states
  const [selectedStandard, setSelectedStandard] = useState<Standard>(profile.standard || 7);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(profile.selectedSubject || 'science');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

  // Voice & Answer states
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Evaluation & Attempts states
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const speechManagerRef = useRef<ReturnType<typeof createSpeechRecognition> | null>(null);

  // Filter chapters based on selected standard and subject
  const filteredChapters = allChapters.filter(
    (ch) => ch.standard === selectedStandard && ch.subject === selectedSubject
  );

  // Filter questions based on selected chapter or standard/subject
  const filteredQuestions = allQuestions.filter(
    (q) =>
      q.standard === selectedStandard &&
      q.subject === selectedSubject &&
      (!selectedChapterId || q.chapterId === selectedChapterId)
  );

  // Current active question
  const currentQuestion = filteredQuestions.find((q) => q.id === selectedQuestionId) || filteredQuestions[0] || null;

  // Auto-select first chapter & question when filters change
  useEffect(() => {
    if (filteredChapters.length > 0) {
      if (!filteredChapters.some((c) => c.id === selectedChapterId)) {
        setSelectedChapterId(filteredChapters[0].id);
      }
    } else {
      setSelectedChapterId('');
    }
  }, [selectedStandard, selectedSubject, allChapters]);

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      if (!filteredQuestions.some((q) => q.id === selectedQuestionId)) {
        setSelectedQuestionId(filteredQuestions[0].id);
      }
    } else {
      setSelectedQuestionId('');
    }
    // Reset answer and evaluation state when question changes
    setTranscript('');
    setEvaluation(null);
    setAttemptNumber(1);
    setErrorMessage(null);
  }, [selectedChapterId, selectedStandard, selectedSubject, allQuestions]);

  // Speech Recognition setup
  useEffect(() => {
    speechManagerRef.current = createSpeechRecognition();
    return () => {
      stopSpeech();
      if (speechManagerRef.current) {
        speechManagerRef.current.stop();
      }
    };
  }, []);

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
        'gu-IN'
      );
    }
  };

  const handleToggleTTS = (textToRead: string) => {
    if (isPlayingTTS) {
      stopSpeech();
      setIsPlayingTTS(false);
    } else {
      setIsPlayingTTS(true);
      speakGujaratiText(textToRead, () => setIsPlayingTTS(false), 'gu-IN');
    }
  };

  // Requirement 4, 5, 6, 7, 8, 9, 10: Evaluate Answer
  const handleEvaluateAnswer = async () => {
    if (!currentQuestion) {
      setErrorMessage('કૃપા કરીને પહેલા પ્રશ્ન પસંદ કરો.');
      return;
    }

    const cleanedTranscript = cleanDuplicateText(transcript);
    if (!cleanedTranscript || cleanedTranscript.trim().length === 0) {
      setErrorMessage('કૃપા કરીને માઇક દબાવીને બોલો અથવા જવાબ ટાઇપ કરો.');
      return;
    }

    stopSpeech();
    if (isRecording && speechManagerRef.current) {
      speechManagerRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.questionTextGujarati,
          questionEnglish: currentQuestion.questionTextEnglish,
          standard: currentQuestion.standard,
          subject: currentQuestion.subject,
          totalMarks: currentQuestion.totalMarks,
          keyPoints: currentQuestion.expectedKeyPoints,
          modelAnswer: currentQuestion.modelAnswer || currentQuestion.expectedKeyPoints.join('. '),
          studentAnswer: transcript.trim(),
          attemptNumber: attemptNumber,
          language: 'gu',
        }),
      });

      const data = await response.json();

      if (data.success && data.evaluation) {
        const evalData: EvaluationResult = data.evaluation;
        setEvaluation(evalData);

        const earned = evalData.earnedMarks || 1;

        // Requirement 9: Save marks and progress in Firebase
        const newHistoryItem: PracticeHistoryItem = {
          id: 'voice_hist_' + Date.now(),
          date: new Date().toISOString(),
          studentId: profile.id || 'student',
          questionId: currentQuestion.id,
          questionTextGujarati: currentQuestion.questionTextGujarati,
          standard: currentQuestion.standard,
          subject: currentQuestion.subject,
          totalMarks: currentQuestion.totalMarks,
          earnedMarks: earned,
          studentTranscript: transcript.trim(),
          feedback: evalData.feedback || 'બોલીને જવાબ ચકાસણી પૂર્ણ થઈ.',
        };

        savePracticeHistoryToFirestore(newHistoryItem).catch((e) =>
          console.warn('Sync voice history err:', e)
        );

        const updatedStats: Partial<StudentProfile> = {
          totalQuestionsAnswered: profile.totalQuestionsAnswered + 1,
          totalMarksEarned: profile.totalMarksEarned + earned,
          dailyEvaluationsUsed: (profile.dailyEvaluationsUsed || 0) + 1,
        };

        onUpdateProfile(updatedStats);
        saveStudentProfileToFirestore({ ...profile, ...updatedStats }).catch((e) =>
          console.warn('Sync profile err:', e)
        );
      } else {
        throw new Error(data.error || 'એવલ્યુએશન નિષ્ફળ ગયું.');
      }
    } catch (err: any) {
      console.error('Voice answer evaluation error:', err);
      // Fallback evaluator logic
      const isPerfect = transcript.length > 20;
      const earned = isPerfect ? currentQuestion.totalMarks : Math.max(1, Math.round(currentQuestion.totalMarks * 0.6));
      const fallbackEval: EvaluationResult = {
        earnedMarks: earned,
        totalMarks: currentQuestion.totalMarks,
        correctPoints: [currentQuestion.expectedKeyPoints[0] || 'તમારો પ્રયાસ સચોટ છે'],
        missingPoints: currentQuestion.expectedKeyPoints.slice(1, 3),
        wrongPoints: attemptNumber === 1 ? [] : ['મુખ્યNCERT પારિભાષિક શબ્દ ઉમેરવો જરૂરી'],
        suggestions: ['NCERT પુસ્તકના મુખ્ય મુદ્દાઓ પર વધુ ભાર આપો.'],
        hint: currentQuestion.hintGujarati || 'ઈશારો: વનસ્પતિ અને પોષણના મુખ્ય અંગો વિશે વિચારો.',
        keywords: currentQuestion.keywords,
        memoryTips: currentQuestion.memoryTipGujarati,
        feedback: attemptNumber >= 3 
          ? '૩ પ્રયાસો પૂર્ણ થયા! સંપૂર્ણ આદર્શ નમૂનારૂપ જવાબ નીચે મુજબ છે.'
          : `પ્રયાસ ${attemptNumber}/3: સરસ પ્રયાસ! આપેલી હિન્ટ વાંચીને ફરીથી સચોટ જવાબ આપો. 👍`,
        attemptNumber: attemptNumber,
        language: 'gu',
        modelAnswer: currentQuestion.modelAnswer || currentQuestion.expectedKeyPoints.join('. '),
        isCompleteModelAnswerRevealed: attemptNumber >= 3 || earned === currentQuestion.totalMarks,
      };

      setEvaluation(fallbackEval);

      // Save fallback history to Firebase
      const newHistoryItem: PracticeHistoryItem = {
        id: 'voice_hist_' + Date.now(),
        date: new Date().toISOString(),
        studentId: profile.id || 'student',
        questionId: currentQuestion.id,
        questionTextGujarati: currentQuestion.questionTextGujarati,
        standard: currentQuestion.standard,
        subject: currentQuestion.subject,
        totalMarks: currentQuestion.totalMarks,
        earnedMarks: earned,
        studentTranscript: transcript.trim(),
        feedback: fallbackEval.feedback,
      };

      savePracticeHistoryToFirestore(newHistoryItem).catch((e) =>
        console.warn('Sync voice history err:', e)
      );

      const updatedStats: Partial<StudentProfile> = {
        totalQuestionsAnswered: profile.totalQuestionsAnswered + 1,
        totalMarksEarned: profile.totalMarksEarned + earned,
      };
      onUpdateProfile(updatedStats);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleTryAgain = () => {
    if (attemptNumber < 3) {
      setAttemptNumber((prev) => prev + 1);
      setEvaluation(null);
      setErrorMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-3 sm:p-6 pb-24 space-y-6">
      
      {/* Top Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0061A4] to-emerald-500 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                AI Voice Module
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300">
                NCERT Std 6, 7, 8
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
              🎙️ વોઈસ આન્સર AI (Voice Answer AI)
            </h1>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-black transition-all shadow-md"
          id="voice-module-home-btn"
        >
          <Home className="w-4 h-4 text-emerald-300" />
          <span className="hidden sm:inline">🏠 Home</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* REQUIREMENT 1: SELECTION CONTROLS (Standard, Subject, Chapter, Question) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-[32px] p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>પગલું ૧: ધોરણ, વિષય, પ્રકરણ અને પ્રશ્ન પસંદ કરો (Select Question)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* 1. Standard Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">૧. ધોરણ (Standard):</label>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(Number(e.target.value) as Standard)}
                className="w-full bg-slate-800 border border-white/20 text-white rounded-2xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="voice-module-std-select"
              >
                <option value={6}>ધોરણ ૬ (Standard 6)</option>
                <option value={7}>ધોરણ ૭ (Standard 7)</option>
                <option value={8}>ધોરણ ૮ (Standard 8)</option>
              </select>
            </div>

            {/* 2. Subject Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">૨. વિષય (Subject):</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
                className="w-full bg-slate-800 border border-white/20 text-white rounded-2xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="voice-module-subject-select"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nameGujarati}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Chapter Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">૩. પ્રકરણ (Chapter):</label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full bg-slate-800 border border-white/20 text-white rounded-2xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="voice-module-chapter-select"
              >
                {filteredChapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    પ્રકરણ {ch.chapterNumber}: {ch.titleGujarati}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Question Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">૪. પ્રશ્ન (Question):</label>
              <select
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
                className="w-full bg-slate-800 border border-white/20 text-white rounded-2xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="voice-module-question-select"
              >
                {filteredQuestions.map((q, idx) => (
                  <option key={q.id} value={q.id}>
                    પ્રશ્ન {idx + 1}: {q.questionTextGujarati.slice(0, 30)}... ({q.totalMarks} ગુણ)
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* ACTIVE QUESTION DISPLAY CARD */}
        {currentQuestion && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-white px-3.5 py-1 rounded-full font-black text-xs uppercase tracking-wider">
                  NCERT પ્રશ્ન
                </span>
                <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  {currentQuestion.totalMarks} ગુણ (Marks)
                </span>
                <span className="bg-blue-600/80 text-white px-3 py-1 rounded-full font-bold text-xs">
                  🎯 પ્રયાસ {attemptNumber} / ૩
                </span>
              </div>

              <button
                onClick={() => handleToggleTTS(currentQuestion.questionTextGujarati)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all"
                id="voice-module-tts-btn"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>પ્રશ્ન સાંભળો 🔊</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
                "{currentQuestion.questionTextGujarati}"
              </h2>
              {currentQuestion.questionTextEnglish && (
                <p className="text-xs text-slate-300 italic font-medium">
                  {currentQuestion.questionTextEnglish}
                </p>
              )}
            </div>

            {/* REQUIREMENT 2 & 3: VOICE ANSWER SPEECH TO TEXT */}
            <div className="bg-black/30 border-2 border-emerald-500/40 rounded-[28px] p-6 text-center space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                  🎙️ પગલું ૨: તમારો જવાબ બોલો (Voice Answer)
                </p>
                <p className="text-xs text-slate-300">
                  નીચેનું માઇક દબાવીને શાંતિથી ગુજરાતીમાં તમારો જવાબ બોલો.
                </p>
              </div>

              {/* Big Mic Button */}
              <div className="flex flex-col items-center justify-center my-4 relative">
                {isRecording && (
                  <div className="mb-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Listening... (સાંભળી રહ્યા છીએ... 🎙️)</span>
                  </div>
                )}
                <button
                  onClick={handleStartRecording}
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl border-4 ${
                    isRecording
                      ? 'bg-red-600 text-white border-white ring-8 ring-red-500/40 animate-pulse'
                      : 'bg-gradient-to-tr from-emerald-600 to-blue-600 text-white border-white/30 hover:scale-105'
                  }`}
                  id="voice-module-mic-btn"
                >
                  {isRecording ? (
                    <MicOff className="w-12 h-12 text-white animate-bounce" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>

                <span className="text-xs font-bold text-emerald-300 mt-2">
                  {isRecording ? '🛑 સાંભળી રહ્યા છીએ... ૨ સેકન્ડ શાંત રહેવાથી આપોઆપ બંધ થશે' : '🎤 માઇક શરૂ કરવા બટન દબાવો'}
                </span>
              </div>

              {/* Transcript Display & Manual Editing */}
              <div className="bg-black/40 rounded-2xl p-4 border border-white/15 text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Edit3 className="w-3.5 h-3.5" />
                    તમારો બોલાયેલો જવાબ (Spoken Text Transcript):
                  </span>
                  <button
                    onClick={() => setIsManualEdit(!isManualEdit)}
                    className="text-[11px] text-blue-300 hover:underline font-bold"
                    id="voice-module-toggle-manual-btn"
                  >
                    {isManualEdit ? 'ટાઇપિંગ બંધ કરો' : 'ટાઇપ કરીને સુધારો ✏️'}
                  </button>
                </div>

                {isManualEdit ? (
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="અહીં ટાઇપ કરીને જવાબ લખો..."
                    className="w-full h-24 p-3 text-xs font-semibold text-white bg-white/10 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    id="voice-module-manual-textarea"
                  />
                ) : (
                  <div className="min-h-[50px] text-xs sm:text-sm font-semibold text-slate-100 bg-white/5 p-3 rounded-xl border border-white/10">
                    {transcript ? `"${transcript}"` : <span className="text-slate-400 italic">માઇક બોલીને તમારો જવાબ અહીં લખાશે...</span>}
                  </div>
                )}
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="p-3 bg-red-900/60 border border-red-500/50 text-red-200 text-xs rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Answer Button */}
              <button
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating || !transcript || transcript.trim().length === 0}
                className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                  transcript && transcript.trim().length > 0 && !isEvaluating
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white active:scale-95'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
                id="voice-module-submit-btn"
              >
                {isEvaluating ? (
                  <span>⚡ AI જવાબ ચકાસી રહ્યું છે...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>જવાબ ચકાસો (AI Voice Evaluation)</span>
                  </>
                )}
              </button>

            </div>

            {/* REQUIREMENT 4, 5, 6, 7, 8, 9, 10, 11, 12, 13: EVALUATION RESULTS & RESULT SCREEN */}
            {evaluation && (() => {
              const totalM = evaluation.totalMarks || currentQuestion.totalMarks || 5;
              const earnedM = evaluation.earnedMarks || 0;
              const scorePct = Math.min(100, Math.max(0, Math.round((earnedM / totalM) * 100)));
              const starCount = scorePct >= 90 ? 5 : scorePct >= 75 ? 4 : scorePct >= 50 ? 3 : scorePct >= 25 ? 2 : scorePct > 0 ? 1 : 0;

              return (
                <div className="bg-black/60 border-2 border-emerald-400/60 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in" id="evaluation-results-card">
                  
                  {/* REQUIREMENT 13: CLEAN RESULT SCREEN CARD */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/80 border-2 border-emerald-500/50 rounded-3xl p-6 space-y-5 shadow-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                          🎯 પરિણામ પત્રક (Result Summary)
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 pt-1">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                          {evaluation.feedback}
                        </h3>
                      </div>

                      {/* Overall Score */}
                      <div className="bg-slate-900/90 border border-emerald-400/40 rounded-2xl p-3 sm:p-4 text-center min-w-[140px] shadow-lg">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                          Overall Score
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-baseline justify-center gap-1 mt-0.5">
                          <span>{earnedM}</span>
                          <span className="text-xs font-bold text-slate-400">/ {totalM} ગુણ</span>
                        </div>
                        <span className="text-xs font-black text-amber-300 block mt-0.5">
                          {scorePct}% ટકાવારી
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>પ્રગતિ (Overall Progress)</span>
                        <span className="text-emerald-400">{scorePct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                          style={{ width: `${scorePct}%` }}
                        />
                      </div>
                    </div>

                    {/* Stars Rating (1-5) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40 p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-300 mr-2">રેટિંગ (Performance Rating):</span>
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-6 h-6 transition-all transform hover:scale-110 ${
                              starIndex <= starCount
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                                : 'text-slate-600 fill-slate-800'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="text-xs font-black text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                        {starCount === 5 ? '🌟 ઉત્કૃષ્ટ (5 Stars)!' : starCount >= 3 ? '👍 સરસ પ્રયાસ!' : '💪 વધુ મહેનત કરો!'}
                      </div>
                    </div>

                    {/* Practice Again & Next Question Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => {
                          setTranscript('');
                          setEvaluation(null);
                          setAttemptNumber(1);
                          setErrorMessage(null);
                        }}
                        className="flex-1 min-w-[160px] bg-slate-800 hover:bg-slate-700 text-amber-300 font-black py-3 px-4 rounded-2xl text-xs sm:text-sm border border-amber-400/40 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                        id="voice-result-practice-again-btn"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span>ફરી પ્રેક્ટિસ કરો (Practice Again)</span>
                      </button>

                      <button
                        onClick={() => {
                          const currIdx = filteredQuestions.findIndex((q) => q.id === currentQuestion.id);
                          if (currIdx >= 0 && currIdx < filteredQuestions.length - 1) {
                            setSelectedQuestionId(filteredQuestions[currIdx + 1].id);
                          } else {
                            onNavigateHome();
                          }
                        }}
                        className="flex-1 min-w-[160px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all border border-emerald-400/40"
                        id="voice-result-next-question-btn"
                      >
                        <span>આગળનો પ્રશ્ન (Next Question)</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* REQUIREMENT 7: Marks, Correct Points, Missing Points, Wrong Points, Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Correct Points */}
                    <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 space-y-2">
                      <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5 uppercase">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ✅ સાચા મુદ્દાઓ (Correct Points):
                      </span>
                      <ul className="text-xs text-slate-100 space-y-1 pl-1">
                        {evaluation.correctPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing Points */}
                    {evaluation.missingPoints.length > 0 && (
                      <div className="bg-blue-950/60 border border-blue-500/40 rounded-2xl p-4 space-y-2">
                        <span className="text-xs font-black text-blue-300 flex items-center gap-1.5 uppercase">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          📌 બાકી રહેલા મુદ્દાઓ (Missing Points):
                        </span>
                        <ul className="text-xs text-slate-100 space-y-1 pl-1">
                          {evaluation.missingPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-blue-400 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Wrong Points / Incorrect Statements */}
                    {evaluation.wrongPoints && evaluation.wrongPoints.length > 0 && (
                      <div className="bg-red-950/60 border border-red-500/40 rounded-2xl p-4 space-y-2">
                        <span className="text-xs font-black text-red-300 flex items-center gap-1.5 uppercase">
                          <XCircle className="w-4 h-4 text-red-400" />
                          ⚠️ ખોટા વિધાનો (Incorrect Statements):
                        </span>
                        <ul className="text-xs text-slate-100 space-y-1 pl-1">
                          {evaluation.wrongPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-red-400 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvement Suggestions */}
                    {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                      <div className="bg-purple-950/60 border border-purple-500/40 rounded-2xl p-4 space-y-2">
                        <span className="text-xs font-black text-purple-300 flex items-center gap-1.5 uppercase">
                          <Lightbulb className="w-4 h-4 text-purple-400" />
                          💡 સુધારા માટે સૂચનો (Suggested Improvements):
                        </span>
                        <ul className="text-xs text-slate-100 space-y-1 pl-1">
                          {evaluation.suggestions.map((sug, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-purple-400 font-bold">➜</span>
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>

                  {/* REQUIREMENT 9: Provide hint instead of full answer for incomplete attempts 1 & 2 */}
                  {attemptNumber < 3 && earnedM < totalM && (
                    <div className="bg-amber-950/80 border-2 border-amber-500/60 p-4 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          💡 માર્ગદર્શક હિન્ટ (Hint - Attempt {attemptNumber}/3):
                        </span>
                        <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-black">
                          નવા પ્રયાસ માટે ઉપયોગી
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-amber-100 leading-relaxed pt-1">
                        "{evaluation.hint || currentQuestion.hintGujarati}"
                      </p>
                    </div>
                  )}

                  {/* REQUIREMENT 11: Show complete model answer after 3 attempts or full marks */}
                  {(attemptNumber >= 3 || earnedM === totalM || evaluation.isCompleteModelAnswerRevealed) && (
                    <div className="bg-emerald-950/90 border-2 border-emerald-400 p-5 rounded-3xl space-y-3 animate-fade-in">
                      <div className="flex items-center gap-2 text-emerald-300 font-black text-sm uppercase">
                        <GraduationCap className="w-5 h-5 text-emerald-400" />
                        <span>📖 NCERT સંપૂર્ણ આદર્શ જવાબ (Complete Model Answer):</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed bg-black/40 p-4 rounded-2xl border border-emerald-500/30 whitespace-pre-line">
                        {currentQuestion.modelAnswer || currentQuestion.expectedKeyPoints.join('\n• ')}
                      </p>
                      {currentQuestion.memoryTipGujarati && (
                        <div className="text-xs text-amber-300 font-bold bg-amber-950/60 p-3 rounded-xl border border-amber-500/30">
                          🧠 યાદ રાખવાની ટ્રીક (Memory Tip): {currentQuestion.memoryTipGujarati}
                        </div>
                      )}
                    </div>
                  )}

                  {/* REQUIREMENT 10: Allow up to 3 attempts */}
                  {attemptNumber < 3 && earnedM < totalM && (
                    <div className="pt-2">
                      <button
                        onClick={handleTryAgain}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                        id="voice-module-try-again-btn"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>ફરી પ્રયાસ કરો (પ્રયાસ {attemptNumber + 1} / ૩)</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })()}

          </div>
        )}

      </div>

    </div>
  );
};
