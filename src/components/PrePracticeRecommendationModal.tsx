import React, { useState } from 'react';
import { StudentProfile, SpacedRepetitionItem, AILearningPlan } from '../types';
import { Sparkles, Clock, RefreshCw, BookOpen, CheckCircle, ArrowRight, X } from 'lucide-react';

interface PrePracticeRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  dueSpacedItems: SpacedRepetitionItem[];
  plan: AILearningPlan;
  onStartAIPracticePlan: () => void;
}

export const PrePracticeRecommendationModal: React.FC<PrePracticeRecommendationModalProps> = ({
  isOpen,
  onClose,
  profile,
  dueSpacedItems,
  plan,
  onStartAIPracticePlan
}) => {
  const [lang, setLang] = useState<'gu' | 'hi' | 'en'>('gu');

  if (!isOpen) return null;

  const labels = {
    gu: {
      title: "AI અભ્યાસ માર્ગદર્શક (Practice Recommendation)",
      subtitle: `${profile.name} (ધોરણ ${profile.standard}) માટે આજનું AI વિશ્લેષણ:`,
      todaysRevision: "આજનું પુનરાવર્તન (Today's Revision)",
      todaysRevisionDesc: `${dueSpacedItems.length} સ્પેસ્ડ લર્નિંગ પ્રશ્નો પુનરાવર્તન માટે તૈયાર છે.`,
      todaysNew: "આજના નવા પ્રશ્નો (New Questions)",
      todaysNewDesc: `${plan.dailyPracticePlan.todaysNewQuestionsCount} નવા મહત્વના NCERT પ્રશ્નો`,
      estTime: "અંદાજિત સમય (Estimated Time)",
      estTimeValue: `${plan.dailyPracticePlan.estimatedTimeMinutes} મિનિટ`,
      startBtn: "🚀 આજનો AI પ્રેક્ટિસ પ્લાન શરૂ કરો",
      skipBtn: "સામાન્ય પ્રકરણ પસંદ કરો"
    },
    hi: {
      title: "AI अभ्यास मार्गदर्शक (Practice Recommendation)",
      subtitle: `${profile.name} (कक्षा ${profile.standard}) के लिए आज का AI विश्लेषण:`,
      todaysRevision: "आज का पुनरावृत्ति (Today's Revision)",
      todaysRevisionDesc: `${dueSpacedItems.length} स्पैस्ड लर्निंग प्रश्न रिवीज़न हेतु तैयार हैं।`,
      todaysNew: "आज के नए प्रश्न (New Questions)",
      todaysNewDesc: `${plan.dailyPracticePlan.todaysNewQuestionsCount} नए महत्वपूर्ण NCERT प्रश्न`,
      estTime: "अनुमानित समय (Estimated Time)",
      estTimeValue: `${plan.dailyPracticePlan.estimatedTimeMinutes} मिनट`,
      startBtn: "🚀 आज का AI प्रैक्टिस प्लान शुरू करें",
      skipBtn: "सामान्य अध्याय चुनें"
    },
    en: {
      title: "AI Practice Recommendation",
      subtitle: `Today's AI Analysis for ${profile.name} (Std ${profile.standard}):`,
      todaysRevision: "Today's Revision",
      todaysRevisionDesc: `${dueSpacedItems.length} spaced repetition items due for review.`,
      todaysNew: "New Questions Today",
      todaysNewDesc: `${plan.dailyPracticePlan.todaysNewQuestionsCount} new NCERT questions recommended.`,
      estTime: "Estimated Time",
      estTimeValue: `${plan.dailyPracticePlan.estimatedTimeMinutes} Minutes`,
      startBtn: "🚀 Start Today's AI Practice Plan",
      skipBtn: "Choose Chapter Manually"
    }
  };

  const l = labels[lang];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#C4C6D0]/40 space-y-6 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#C4C6D0]/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-[#0061A4]/10 text-[#0061A4] rounded-2xl">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h3 className="font-black text-lg text-[#1A1C1E]">{l.title}</h3>
              <p className="text-xs font-semibold text-[#44474E]">{l.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
            id="pre-practice-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-end gap-1.5 bg-[#F0F4F9] p-1.5 rounded-2xl text-xs font-bold w-fit ml-auto border border-[#C4C6D0]/30">
          <button
            onClick={() => setLang('gu')}
            className={`px-3 py-1 rounded-xl transition-all ${
              lang === 'gu' ? 'bg-[#0061A4] text-white shadow-sm' : 'text-[#44474E] hover:text-[#0061A4]'
            }`}
          >
            ગુજરાતી
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1 rounded-xl transition-all ${
              lang === 'hi' ? 'bg-[#0061A4] text-white shadow-sm' : 'text-[#44474E] hover:text-[#0061A4]'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-xl transition-all ${
              lang === 'en' ? 'bg-[#0061A4] text-white shadow-sm' : 'text-[#44474E] hover:text-[#0061A4]'
            }`}
          >
            English
          </button>
        </div>

        {/* Recommendation Cards */}
        <div className="grid grid-cols-1 gap-3">
          
          {/* Card 1: Today's Revision */}
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-start gap-3">
            <span className="p-2 bg-[#7D00B3] text-white rounded-xl shadow-sm mt-0.5">
              <RefreshCw className="w-5 h-5" />
            </span>
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#7D00B3]">
                {l.todaysRevision}
              </span>
              <p className="text-sm font-black text-slate-900">
                {dueSpacedItems.length} {lang === 'en' ? 'Items' : 'પ્રશ્નો સ્પેસ્ડ લર્નિંગ'}
              </p>
              <p className="text-xs font-medium text-slate-600">{l.todaysRevisionDesc}</p>
            </div>
          </div>

          {/* Card 2: New Questions */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <span className="p-2 bg-[#006D32] text-white rounded-xl shadow-sm mt-0.5">
              <BookOpen className="w-5 h-5" />
            </span>
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#006D32]">
                {l.todaysNew}
              </span>
              <p className="text-sm font-black text-slate-900">
                {plan.dailyPracticePlan.todaysNewQuestionsCount} {lang === 'en' ? 'Questions' : 'નવા પ્રશ્નો'}
              </p>
              <p className="text-xs font-medium text-slate-600">{l.todaysNewDesc}</p>
            </div>
          </div>

          {/* Card 3: Estimated Time */}
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-start gap-3">
            <span className="p-2 bg-[#0061A4] text-white rounded-xl shadow-sm mt-0.5">
              <Clock className="w-5 h-5" />
            </span>
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#0061A4]">
                {l.estTime}
              </span>
              <p className="text-sm font-black text-slate-900">{l.estTimeValue}</p>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onStartAIPracticePlan();
              onClose();
            }}
            className="w-full py-3.5 px-4 bg-[#0061A4] text-white hover:bg-[#004F87] rounded-2xl text-sm font-black shadow-lg shadow-[#0061A4]/25 flex items-center justify-center gap-2 transition-all"
            id="start-ai-practice-plan-btn"
          >
            <span>{l.startBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#F0F4F9] text-[#001D36] hover:bg-[#D1E4FF] rounded-2xl text-xs font-bold transition-all text-center"
            id="choose-chapter-manually-btn"
          >
            {l.skipBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
