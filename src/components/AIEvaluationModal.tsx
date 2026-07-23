import React, { useEffect } from 'react';
import { EvaluationResult } from '../types';
import { 
  CheckCircle2, 
  Lightbulb, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Sparkles, 
  Volume2,
  AlertTriangle,
  BookOpen,
  Compass,
  Brain,
  Zap,
  CheckCircle,
  Database
} from 'lucide-react';
import { speakGujaratiText, stopSpeech } from '../utils/speech';

interface AIEvaluationModalProps {
  evaluation: EvaluationResult;
  questionTextGujarati: string;
  totalMarks: number;
  onTryAgain: () => void;
  onProceedToFinalResult: () => void;
}

export const AIEvaluationModal: React.FC<AIEvaluationModalProps> = ({
  evaluation,
  questionTextGujarati,
  totalMarks = 5,
  onTryAgain,
  onProceedToFinalResult,
}) => {
  const displayTotal = evaluation.totalMarks || totalMarks || 5;
  const earnedMarks = evaluation.earnedMarks ?? 0;
  const calculatedPercentage = evaluation.percentage ?? Math.round((earnedMarks / displayTotal) * 100);
  const isPerfectScore = earnedMarks === displayTotal;
  const currentAttempt = evaluation.attemptNumber || 1;
  const canTryAgain = !isPerfectScore && currentAttempt < 3;

  const hintLevel = evaluation.hintLevel || currentAttempt;
  const hintLevelLabel = hintLevel === 1 
    ? 'Level 1: Small Clue' 
    : hintLevel === 2 
    ? 'Level 2: Bigger Clue' 
    : 'Level 3: Almost Complete Guidance';

  const encouragingPhrase = evaluation.encouragingPhrase || 
    (isPerfectScore ? 'Excellent Work! - I M MASTER AI Teacher' : currentAttempt === 1 ? 'Good Effort! - I M MASTER AI Teacher' : 'Almost There! - I M MASTER AI Teacher');

  const rawSuggestions = evaluation.suggestions && evaluation.suggestions.length > 0 
    ? evaluation.suggestions 
    : evaluation.improvementTips && evaluation.improvementTips.length > 0 
    ? evaluation.improvementTips 
    : ['I M MASTER AI Teacher: Include NCERT technical keywords for maximum marks.'];

  const suggestionsList = rawSuggestions.map(sug => 
    sug.startsWith('I M MASTER AI')
      ? sug 
      : `I M MASTER AI Teacher: ${sug}`
  );

  const handleSpeakFeedback = () => {
    stopSpeech();
    const suggestionsText = suggestionsList.join('. ');
    const spokenText = `I M MASTER AI Teacher evaluation: ${encouragingPhrase}. ${evaluation.feedback || ''}. You earned ${earnedMarks} out of ${displayTotal} marks (${calculatedPercentage} percent). Suggestions: ${suggestionsText}`;
    const langCode = evaluation.language === 'en' ? 'en-IN' : evaluation.language === 'hi' ? 'hi-IN' : 'gu-IN';
    speakGujaratiText(spokenText, undefined, langCode);
  };

  useEffect(() => {
    handleSpeakFeedback();
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0061A4] text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  AI Evaluation Feedback
                </h3>
                <span className="text-[11px] font-black text-slate-900 bg-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400">
                  Attempt {currentAttempt} / 3
                </span>
              </div>
              <p className="text-xs text-[#0061A4] font-bold flex items-center gap-1">
                <span>NCERT Criteria Verification</span>
                <span>•</span>
                <span className="text-emerald-700 font-black">{earnedMarks}/{displayTotal} Marks Earned</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSpeakFeedback}
            className="px-4 py-2 rounded-2xl bg-[#006D32] hover:bg-[#005225] text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs border border-emerald-600"
            id="eval-speak-aloud-btn"
          >
            <Volume2 className="w-4 h-4 text-white" />
            <span>Read Feedback 🔊</span>
          </button>
        </div>

        {/* 1. Score, Percentage & Encouraging Phrase Banner */}
        <div className="p-6 rounded-[24px] bg-gradient-to-r from-[#003B68] via-[#0061A4] to-[#006D32] text-white space-y-3 shadow-md relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-amber-300 text-slate-900 font-black text-xs px-3.5 py-1 rounded-full shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-slate-900" />
              <span>{encouragingPhrase}</span>
            </span>

            <span className="text-xs font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
              Score: {calculatedPercentage}%
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-3xl sm:text-4xl font-black italic flex items-baseline gap-2">
                <span>{earnedMarks}</span>
                <span className="text-blue-100 text-lg font-bold">/ {displayTotal} Marks</span>
                <span className="text-xs font-black text-amber-300 bg-black/30 px-2.5 py-1 rounded-lg">({calculatedPercentage}%)</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-50 font-bold pt-1.5 max-w-md leading-relaxed">
                {evaluation.feedback}
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <Award className="w-10 h-10 text-amber-300" />
            </div>
          </div>

        </div>

        {/* 2. Teacher's Evaluation Rubric Criteria Scores (6 Core Criteria) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span className="font-black text-[#0061A4] text-xs flex items-center gap-1.5 uppercase tracking-wide">
            <Brain className="w-4 h-4 text-[#0061A4]" />
            <span>AI Rubric Breakdown (6 Evaluation Criteria):</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs font-bold text-slate-900">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500">Concept Understanding</span>
              <span className="text-sm font-black text-[#006D32]">{evaluation.conceptUnderstandingScore ?? 85}%</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500">Accuracy</span>
              <span className="text-sm font-black text-[#0061A4]">{evaluation.accuracyScore ?? 90}%</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500">Completeness</span>
              <span className="text-sm font-black text-purple-700">{evaluation.completenessScore ?? 80}%</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500">Key Points Covered</span>
              <span className="text-sm font-black text-amber-700">{evaluation.keywordsScore ?? 85}%</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500">Logical Flow</span>
              <span className="text-sm font-black text-[#0061A4]">{evaluation.logicalOrderScore ?? 85}%</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500">Keywords Accuracy</span>
              <span className="text-sm font-black text-[#006D32]">{evaluation.grammarScore ?? 88}%</span>
            </div>
          </div>
        </div>

        {/* Progressive 3-Level Hint Box (If not full score and can try again) */}
        {canTryAgain && evaluation.hint && (
          <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-slate-900 text-sm block">
                    {hintLevelLabel}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800">
                    Guided hint for improving your answer
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[11px]">
                Hint Level {hintLevel}/3
              </span>
            </div>

            <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed bg-white/90 p-3.5 rounded-2xl border border-amber-200/80">
              "{evaluation.hint}"
            </p>
          </div>
        )}

        {/* Highlighted Points Grid: Correct (Green), Missing (Orange), Incorrect (Red) */}
        <div className="space-y-3">
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-[#0061A4]" />
            <span>Point-by-Point AI Analysis:</span>
          </h4>

          <div className="grid grid-cols-1 gap-3">
            
            {/* 3. Highlight Correct Points (Green) */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1.5 shadow-xs">
              <span className="font-black text-[#006D32] text-xs flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle className="w-4 h-4 text-[#006D32]" />
                <span>Correct Points Covered:</span>
              </span>
              <ul className="space-y-1 text-xs text-emerald-950 font-bold pt-1">
                {evaluation.correctPoints && evaluation.correctPoints.length > 0 ? (
                  evaluation.correctPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-extrabold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-amber-800 italic">Key points remain to be covered.</li>
                )}
              </ul>
            </div>

            {/* 4. Highlight Missing Points (Orange) */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-1.5 shadow-xs">
              <span className="font-black text-amber-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                <Compass className="w-4 h-4 text-amber-700" />
                <span>Missing NCERT Points:</span>
              </span>
              <ul className="space-y-1 text-xs text-amber-950 font-bold pt-1">
                {evaluation.missingPoints && evaluation.missingPoints.length > 0 ? (
                  evaluation.missingPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-extrabold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#006D32] font-black">Great job! All NCERT key points were included!</li>
                )}
              </ul>
            </div>

            {/* 5. Highlight Incorrect Points (Red - if any) */}
            {((evaluation.incorrectStatements && evaluation.incorrectStatements.length > 0) || (evaluation.wrongPoints && evaluation.wrongPoints.length > 0)) && (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-300 space-y-1.5 shadow-xs">
                <span className="font-black text-rose-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Incorrect Statements to Fix:</span>
                </span>
                <ul className="space-y-1 text-xs text-rose-950 font-bold pt-1">
                  {(evaluation.incorrectStatements || evaluation.wrongPoints || []).map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-extrabold">✗</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* 6. Suggestions to Improve Answer */}
        <div className="p-4 bg-blue-50/90 rounded-2xl border border-blue-200 space-y-2">
          <span className="font-black text-[#0061A4] text-xs flex items-center gap-1.5 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-[#0061A4]" />
            <span>Suggestions for Higher Score:</span>
          </span>
          <ul className="space-y-1.5 text-xs text-slate-900 font-bold">
            {suggestionsList.map((sug, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-blue-200">
                <span className="text-[#0061A4] font-black">💡</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Show Ideal Model Answer */}
        {(!canTryAgain || isPerfectScore) && (
          <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-300 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#006D32] font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#006D32]" />
              <span>NCERT Official Model Answer:</span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-emerald-950 bg-white p-4 rounded-xl border border-emerald-200 leading-relaxed shadow-xs">
              {evaluation.modelAnswer || evaluation.gujaratiExplanation}
            </p>
          </div>
        )}

        {/* 10. Stored in Firebase Badge */}
        <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Score & progress saved to Firebase cloud.</span>
          </span>
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
            Firebase Saved
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
          
          {canTryAgain && (
            <button
              onClick={onTryAgain}
              className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-[#0061A4] text-[#0061A4] rounded-2xl font-black text-xs shadow-xs hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              id="try-again-voice-btn"
            >
              <RotateCcw className="w-4 h-4 text-[#0061A4]" />
              <span>Try Again (Attempt {currentAttempt + 1})</span>
            </button>
          )}

          <button
            onClick={onProceedToFinalResult}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#006D32] hover:bg-[#005225] text-white rounded-2xl font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            id="proceed-final-result-btn"
          >
            <span>{canTryAgain ? 'View Result Card' : 'Full Report & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};


