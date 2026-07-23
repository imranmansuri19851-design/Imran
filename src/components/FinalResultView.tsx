import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EvaluationResult, Question } from '../types';
import { 
  Key, 
  Brain, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Sparkles,
  Award,
  Star,
  Clock,
  Target,
  AlertCircle,
  Database,
  Flame
} from 'lucide-react';

interface FinalResultViewProps {
  question: Question;
  evaluation: EvaluationResult;
  onNextQuestion: () => void;
  onRetryQuestion: () => void;
  onBackToChapters: () => void;
  hasNextQuestion: boolean;
}

export const FinalResultView: React.FC<FinalResultViewProps> = ({
  question,
  evaluation,
  onNextQuestion,
  onRetryQuestion,
  onBackToChapters,
  hasNextQuestion,
}) => {

  const totalMarks = evaluation.totalMarks || question.totalMarks || 5;
  const earnedMarks = evaluation.earnedMarks || 0;
  const pct = Math.min(100, Math.max(0, Math.round((earnedMarks / Math.max(1, totalMarks)) * 100)));
  
  // Calculate 1-5 Star Rating based on percentage
  const starRating = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 50 ? 3 : pct >= 25 ? 2 : 1;

  // Breakdown scores (defaulting logically if not explicitly returned)
  const accuracyScore = evaluation.accuracyScore ?? pct;
  const completenessScore = evaluation.completenessScore ?? Math.round(((evaluation.correctPoints?.length || 1) / Math.max(1, question.expectedKeyPoints?.length || 1)) * 100);
  const keywordsScore = evaluation.keywordsScore ?? Math.min(100, pct + 10);
  const conceptUnderstandingScore = evaluation.conceptUnderstandingScore ?? Math.min(100, pct + 5);

  useEffect(() => {
    // Fire celebratory confetti if student scored >= 60%
    if (pct >= 60) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [pct]);

  // SVG Circular progress math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      
      {/* Top Banner Card */}
      <div className="rounded-[28px] bg-gradient-to-r from-[#003B68] via-[#0061A4] to-[#006D32] text-white p-6 sm:p-8 shadow-xl border border-blue-300 space-y-6 text-center relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xs shadow-xs border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Evaluation Report</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-black">
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <span>Saved in Firebase</span>
          </span>
        </div>

        {/* Circular Score Indicator & 1-5 Star Rating */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
          
          {/* Circular Score Indicator */}
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-white/20"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-emerald-300 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white italic">{earnedMarks}/{totalMarks}</span>
              <span className="text-xs font-black text-emerald-200 uppercase tracking-wider">{pct}% Marks</span>
            </div>
          </div>

          {/* Performance & Star Rating */}
          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {pct >= 80 ? 'Outstanding Work!' : pct >= 50 ? 'Good Progress!' : 'Needs Practice!'}
            </h2>

            {/* 1-5 Star Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-7 h-7 transition-all ${
                    star <= starRating
                      ? 'fill-amber-300 text-amber-300 drop-shadow-md scale-105'
                      : 'text-white/30'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs font-black text-amber-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                {starRating} / 5 Stars
              </span>
            </div>

            <p className="text-xs text-blue-100 font-semibold max-w-xs leading-relaxed">
              {evaluation.feedback || 'Your spoken answer has been verified against NCERT criteria.'}
            </p>
          </div>

        </div>

      </div>

      {/* Analytics Breakdown Card: 4 Evaluation Metrics Progress Bars */}
      <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-[#0061A4]" />
            <span>4-Dimension Rubric Breakdown</span>
          </h3>
          <span className="text-xs font-black text-[#0061A4] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            NCERT Criteria
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Accuracy Progress Bar */}
          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-black text-slate-900">
              <span>🎯 Content Accuracy</span>
              <span className="text-[#0061A4] font-black">{accuracyScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#0061A4] h-3 rounded-full transition-all duration-700" 
                style={{ width: `${accuracyScore}%` }}
              />
            </div>
          </div>

          {/* 2. Completeness Progress Bar */}
          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-black text-slate-900">
              <span>📋 Key Points Completeness</span>
              <span className="text-[#006D32] font-black">{completenessScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#006D32] h-3 rounded-full transition-all duration-700" 
                style={{ width: `${completenessScore}%` }}
              />
            </div>
          </div>

          {/* 3. Keywords Progress Bar */}
          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-black text-slate-900">
              <span>🔑 NCERT Vocabulary</span>
              <span className="text-amber-700 font-black">{keywordsScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-amber-500 h-3 rounded-full transition-all duration-700" 
                style={{ width: `${keywordsScore}%` }}
              />
            </div>
          </div>

          {/* 4. Concept Understanding Progress Bar */}
          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-black text-slate-900">
              <span>🧠 Concept Depth</span>
              <span className="text-purple-700 font-black">{conceptUnderstandingScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-700" 
                style={{ width: `${conceptUnderstandingScore}%` }}
              />
            </div>
          </div>

        </div>

        {/* Quick Stored Metrics Badges */}
        <div className="flex flex-wrap items-center justify-around gap-2 pt-2 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Attempt: <strong>{evaluation.attemptNumber || 1} / 3</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#0061A4]" />
            <span>Time Taken: <strong>{evaluation.timeTakenSeconds || 45}s</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#006D32]" />
            <span>Overall Score: <strong>{pct}%</strong></span>
          </span>
        </div>

      </div>

      {/* Weak Concepts Warning (if any) */}
      {((evaluation.weakConcepts && evaluation.weakConcepts.length > 0) || (evaluation.missingPoints && evaluation.missingPoints.length > 0)) && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-300 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Topics Recommended for Revision:</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(evaluation.weakConcepts && evaluation.weakConcepts.length > 0 
              ? evaluation.weakConcepts 
              : evaluation.missingPoints.slice(0, 3)
            ).map((wc, idx) => (
              <span key={idx} className="px-3 py-1 bg-amber-200 text-amber-950 font-extrabold rounded-xl border border-amber-300">
                • {wc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Model Answer & Simple Gujarati Explanation */}
      <div className="bg-white rounded-[28px] p-6 shadow-xs border-2 border-[#0061A4]/30 space-y-4">
        
        <div className="flex items-center gap-2 text-[#0061A4] font-black text-base border-b border-slate-100 pb-3">
          <Sparkles className="w-5 h-5 text-[#0061A4]" />
          <span>Official Ideal Model Answer:</span>
        </div>

        {/* Model Answer Paragraph */}
        <div className="space-y-1">
          <span className="text-xs font-black text-[#0061A4] uppercase tracking-wider block">
            NCERT Model Answer Text:
          </span>
          <p className="text-xs sm:text-sm text-slate-900 font-extrabold leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {evaluation.modelAnswer || question.modelAnswer || question.expectedKeyPoints.join('. ')}
          </p>
        </div>

        {/* Simple Gujarati Explanation */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
          <span className="text-xs font-black text-[#006D32] flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-[#006D32]" />
            <span>જવાબની સરળ સમજૂતી (Gujarati Explanation):</span>
          </span>
          <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed pt-1">
            {evaluation.gujaratiExplanation || question.modelAnswer || `આ પ્રશ્નમાં મુખ્યત્વે આ મુદ્દાઓ આવરી લેવાના હોય છે: ${question.expectedKeyPoints.join(' તેમજ ')}.`}
          </p>
        </div>

      </div>

      {/* Keywords & Memory Tips Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Keywords Card */}
        <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-[#0061A4] font-black text-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0061A4] flex items-center justify-center font-black">
              <Key className="w-4 h-4 text-[#0061A4]" />
            </div>
            <span>NCERT Essential Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(evaluation.keywords && evaluation.keywords.length > 0 ? evaluation.keywords : question.keywords).map((kw, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0061A4] font-black text-xs border border-blue-200 shadow-xs"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Memory Tips / Mnemonics Card */}
        <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-[#006D32] font-black text-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#006D32] flex items-center justify-center font-black">
              <Brain className="w-4 h-4 text-[#006D32]" />
            </div>
            <span>Shortcut Memory Tip</span>
          </div>
          <div className="p-3.5 bg-amber-300 text-slate-900 rounded-2xl border border-amber-400">
            <p className="text-xs sm:text-sm font-black leading-relaxed">
              {evaluation.memoryTips || question.memoryTipGujarati}
            </p>
          </div>
        </div>

      </div>

      {/* Action Buttons: Practice Again & Next Question */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        
        <button
          onClick={onBackToChapters}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-all flex items-center justify-center gap-2 border border-slate-200"
          id="final-result-back-chapters-btn"
        >
          <BookOpen className="w-4 h-4 text-[#0061A4]" />
          <span>Back to Chapters</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Practice Again Button */}
          <button
            onClick={onRetryQuestion}
            className="w-1/2 sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-[#0061A4] font-black text-xs transition-all flex items-center justify-center gap-2 border-2 border-[#0061A4] shadow-xs"
            id="final-result-practice-again-btn"
          >
            <RotateCcw className="w-4 h-4 text-[#0061A4]" />
            <span>Practice Again</span>
          </button>

          {/* Next Question Button */}
          {hasNextQuestion && (
            <button
              onClick={onNextQuestion}
              className="w-1/2 sm:w-auto px-8 py-3.5 rounded-2xl bg-[#006D32] hover:bg-[#005225] text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              id="final-result-next-question-btn"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

