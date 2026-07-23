import React, { useState } from 'react';
import { 
  StudentProfile, 
  PracticeHistoryItem, 
  Chapter, 
  Question, 
  SpacedRepetitionItem 
} from '../types';
import { calculateAILearningSummary, AIIntelligenceSummary } from '../utils/aiLearningEngine';
import { 
  BrainCircuit, 
  Sparkles, 
  Flame, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  TrendingUp, 
  RefreshCw, 
  BookOpen, 
  Layers, 
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Zap,
  Printer
} from 'lucide-react';

interface AILearningIntelligenceDashboardProps {
  profile: StudentProfile;
  history: PracticeHistoryItem[];
  allChapters: Chapter[];
  allQuestions: Question[];
  spacedRepetitionItems: SpacedRepetitionItem[];
  onBackToHome: () => void;
  onStartReviewQuestion?: (questionId: string) => void;
}

export const AILearningIntelligenceDashboard: React.FC<AILearningIntelligenceDashboardProps> = ({
  profile,
  history,
  allChapters,
  allQuestions,
  spacedRepetitionItems,
  onBackToHome,
  onStartReviewQuestion
}) => {
  const [lang, setLang] = useState<'gu' | 'hi' | 'en'>('gu');
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'weekly' | 'monthly' | 'spaced'>('overview');

  const summary: AIIntelligenceSummary = calculateAILearningSummary(
    profile,
    history,
    allChapters,
    allQuestions,
    spacedRepetitionItems
  );

  const labels = {
    gu: {
      title: "AI લર્નિંગ ઈન્ટેલિજન્સ સિસ્ટમ",
      subtitle: "તમારા પર્સનલ લર્નિંગ પ્રોફાઈલ અને NCERT વિશ્લેષણનો સ્માર્ટ ડેશબોર્ડ",
      overallScore: "કુલ ગુણ / ચોકસાઈ",
      progressPct: "પ્રગતિ ડેશબોર્ડ %",
      accuracyPct: "સાચાઈ (Accuracy)",
      practiceTime: "કુલ અભ્યાસ સમય",
      streak: "દૈનિક સ્ટ્રીક",
      weakTopics: "નબળા મુદ્દાઓ અને પ્રકરણો",
      weakSubjects: "નબળા વિષયો",
      strongSubjects: "મજબૂત વિષયો",
      frequentlyForgotten: "વારંવાર ભુલાઈ જતા પ્રશ્નો",
      dailyPlanTab: "📅 દૈનિક પ્લાન",
      weeklyPlanTab: "🗓️ સાપ્તાહિક રિવિઝન",
      monthlyReportTab: "📊 માસિક પ્રગતિ રિપોર્ટ",
      spacedTab: "🧠 સ્પેસ્ડ રિપિટિશન",
      overviewTab: "🎯 લર્નિંગ પ્રોફાઈલ",
      reviewNow: "હમણાં પુનરાવર્તન કરો",
      noSpacedItems: "તમામ સ્પેસ્ડ લર્નિંગ પ્રશ્નો પૂર્ણ થયેલા છે! ખૂબ સરસ!",
      printReport: "રિપોર્ટ પ્રિન્ટ / ડાઉનલોડ કરો"
    },
    hi: {
      title: "AI लर्निंग इंटेलिजेंस सिस्टम",
      subtitle: "आपकी पर्सनल लर्निंग प्रोफाइल और NCERT विश्लेषण का स्मार्ट डैशबोर्ड",
      overallScore: "कुल अंक / सटीकता",
      progressPct: "प्रगति %",
      accuracyPct: "सटीकता (Accuracy)",
      practiceTime: "कुल अभ्यास समय",
      streak: "दैनिक स्ट्रिक",
      weakTopics: "कमजोर विषय और अध्याय",
      weakSubjects: "कमजोर विषय",
      strongSubjects: "मजबूत विषय",
      frequentlyForgotten: "बार-बार भूलने वाले प्रश्न",
      dailyPlanTab: "📅 दैनिक योजना",
      weeklyPlanTab: "🗓️ साप्ताहिक रिवीजन",
      monthlyReportTab: "📊 मासिक प्रगति रिपोर्ट",
      spacedTab: "🧠 स्पैस्ड रिपीटीशन",
      overviewTab: "🎯 लर्निंग प्रोफाइल",
      reviewNow: "अभी रिवीजन करें",
      noSpacedItems: "सभी स्पैस्ड लर्निंग प्रश्न पूरे हो चुके हैं! बहुत बढ़िया!",
      printReport: "रिपोर्ट प्रिंट / डाउनलोड करें"
    },
    en: {
      title: "AI Learning Intelligence System",
      subtitle: "Smart AI dashboard with personalized learning profile and NCERT analytics",
      overallScore: "Overall Score",
      progressPct: "Progress %",
      accuracyPct: "Accuracy %",
      practiceTime: "Total Practice Time",
      streak: "Daily Streak",
      weakTopics: "Weak Topics & Chapters",
      weakSubjects: "Weak Subjects",
      strongSubjects: "Strong Subjects",
      frequentlyForgotten: "Frequently Forgotten Topics",
      dailyPlanTab: "📅 Daily Plan",
      weeklyPlanTab: "🗓️ Weekly Revision",
      monthlyReportTab: "📊 Monthly Progress",
      spacedTab: "🧠 Spaced Repetition",
      overviewTab: "🎯 Learning Profile",
      reviewNow: "Review Now",
      noSpacedItems: "All spaced repetition items are reviewed and mastered!",
      printReport: "Print / Download Report"
    }
  };

  const l = labels[lang];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Bar Header */}
      <div className="bg-[#0061A4] text-white rounded-[32px] p-6 sm:p-8 shadow-md relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-2xl transition-all border border-white/20"
            id="ai-dashboard-back-home-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'en' ? 'Back Home' : 'મુખ્ય પૃષ્ઠ'}</span>
          </button>

          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 text-xs font-bold">
            <button
              onClick={() => setLang('gu')}
              className={`px-3 py-1 rounded-xl transition-all ${
                lang === 'gu' ? 'bg-white text-[#0061A4] shadow-sm font-extrabold' : 'text-white/80 hover:text-white'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-xl transition-all ${
                lang === 'hi' ? 'bg-white text-[#0061A4] shadow-sm font-extrabold' : 'text-white/80 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-xl transition-all ${
                lang === 'en' ? 'bg-white text-[#0061A4] shadow-sm font-extrabold' : 'text-white/80 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="p-3 bg-amber-400 text-slate-900 rounded-2xl shadow-lg mt-1">
            <BrainCircuit className="w-8 h-8" />
          </span>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-[11px] font-black uppercase text-blue-100 tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Learning Intelligence Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{l.title}</h2>
            <p className="text-xs text-blue-100 font-medium">{l.subtitle}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-[#0061A4] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {l.overviewTab}
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'daily'
                ? 'bg-white text-[#0061A4] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {l.dailyPlanTab}
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'weekly'
                ? 'bg-white text-[#0061A4] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {l.weeklyPlanTab}
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'monthly'
                ? 'bg-white text-[#0061A4] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {l.monthlyReportTab}
          </button>
          <button
            onClick={() => setActiveTab('spaced')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'spaced'
                ? 'bg-[#FFD941] text-[#241E00] shadow-md font-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {l.spacedTab} ({summary.dueSpacedRepetitionItems.length})
          </button>
        </div>

      </div>

      {/* 1. OVERVIEW TAB: Personal Student Learning Profile */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Profile Card Summary */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C4C6D0]/30 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold uppercase text-[#0061A4]">
                  વિદ્યાર્થી પ્રોફાઈલ (Student Profile)
                </span>
                <h3 className="text-xl font-black text-[#1A1C1E]">{profile.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#001D36] bg-[#D1E4FF] px-3 py-1.5 rounded-full">
                <span>ધોરણ: {profile.standard}</span>
                <span>•</span>
                <span>માધ્યમ: {profile.medium}</span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              
              <div className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/30 space-y-1">
                <span className="text-[11px] font-extrabold text-[#44474E] block">{l.streak}</span>
                <p className="text-xl font-black text-[#241E00] flex items-center gap-1">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>{summary.dailyStreakDays} {lang === 'en' ? 'Days' : 'દિવસ'}</span>
                </p>
              </div>

              <div className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/30 space-y-1">
                <span className="text-[11px] font-extrabold text-[#44474E] block">{l.accuracyPct}</span>
                <p className="text-xl font-black text-[#0061A4]">
                  {summary.accuracyPercentage}%
                </p>
              </div>

              <div className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/30 space-y-1">
                <span className="text-[11px] font-extrabold text-[#44474E] block">પ્રશ્નોના ઉત્તર</span>
                <p className="text-xl font-black text-slate-900">
                  {summary.totalQuestionsAnswered}
                </p>
                <span className="text-[10px] text-[#006D32] font-bold">
                  {summary.correctAnswersCount} સાચા / {summary.wrongAnswersCount} ભૂલો
                </span>
              </div>

              <div className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/30 space-y-1">
                <span className="text-[11px] font-extrabold text-[#44474E] block">પૂર્ણ પ્રકરણો</span>
                <p className="text-xl font-black text-purple-900">
                  {summary.completedChaptersCount} / {allChapters.length}
                </p>
              </div>

              <div className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/30 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-extrabold text-[#44474E] block">{l.practiceTime}</span>
                <p className="text-xl font-black text-[#006D32]">
                  {summary.totalPracticeTimeMinutes} {lang === 'en' ? 'Mins' : 'મિનિટ'}
                </p>
              </div>

            </div>
          </div>

          {/* AI Detections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weak Subjects & Chapters */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-rose-200 space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-black text-base border-b border-rose-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3>{l.weakTopics}</h3>
              </div>

              {summary.weakChapters.length === 0 && summary.weakSubjects.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  કોઈ નબળા પ્રકરણો શોધાયા નથી! ઉત્કૃષ્ટ પ્રદર્શન!
                </p>
              ) : (
                <div className="space-y-3">
                  {summary.weakSubjects.map((ws) => (
                    <div key={ws.subjectId} className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-rose-900 block">
                          {lang === 'en' ? ws.nameEnglish : lang === 'hi' ? ws.nameHindi : ws.nameGujarati}
                        </span>
                        <span className="text-[11px] font-bold text-rose-700">નબળો વિષય (Accuracy: {ws.accuracy}%)</span>
                      </div>
                      <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-black rounded-lg">
                        મહાવરો જરૂરી
                      </span>
                    </div>
                  ))}

                  {summary.weakChapters.map((wc) => (
                    <div key={wc.chapterId} className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-amber-950 block">
                          {lang === 'en' ? wc.titleEnglish : lang === 'hi' ? wc.titleHindi : wc.titleGujarati}
                        </span>
                        <span className="text-[11px] font-bold text-amber-800">ચોકસાઈ: {wc.accuracy}%</span>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg">
                        પુનરાવર્તન
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Frequently Forgotten Topics & Strong Subjects */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-base border-b border-emerald-100 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3>{l.strongSubjects} & {l.frequentlyForgotten}</h3>
              </div>

              <div className="space-y-3">
                {summary.strongSubjects.map((ss) => (
                  <div key={ss.subjectId} className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-950 block">
                        🌟 {lang === 'en' ? ss.nameEnglish : lang === 'hi' ? ss.nameHindi : ss.nameGujarati}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">ઉત્કૃષ્ટ વિષય ({ss.accuracy}% Accuracy)</span>
                    </div>
                    <span className="px-2.5 py-1 bg-[#006D32] text-white text-[10px] font-black rounded-lg">
                      માસ્ટર્ડ
                    </span>
                  </div>
                ))}

                {summary.frequentlyForgottenTopics.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-black text-purple-900 block">🧠 વારંવાર ભુલાઈ જતા પ્રશ્નો ({summary.frequentlyForgottenTopics.length}):</span>
                    {summary.frequentlyForgottenTopics.slice(0, 3).map((ff) => (
                      <div key={ff.questionId} className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-1">
                        <p className="font-bold text-purple-950">
                          {lang === 'en' && ff.questionTextEnglish ? ff.questionTextEnglish : ff.questionTextGujarati}
                        </p>
                        <span className="text-[10px] font-extrabold text-purple-700 block">
                          ⚠️ {ff.incorrectTimes} વખત ભૂલ થઈ છે
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. DAILY PRACTICE PLAN TAB */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#C4C6D0]/40 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-[#C4C6D0]/30 pb-4">
            <span className="p-2.5 bg-[#0061A4] text-white rounded-2xl">
              <Calendar className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-black text-lg text-[#1A1C1E]">
                {lang === 'en' ? 'Daily AI Practice Plan' : 'આજનો AI દૈનિક પ્રેક્ટિસ પ્લાન'}
              </h3>
              <p className="text-xs text-[#44474E] font-medium">
                અંદાજિત સમય: {summary.plan.dailyPracticePlan.estimatedTimeMinutes} મિનિટ | રિવિઝન: {summary.plan.dailyPracticePlan.todaysRevisionCount} પ્રશ્નો
              </p>
            </div>
          </div>

          {/* Recommended Chapters */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-[#0061A4]">
              શ્રેષ્ઠ ભલામણ કરેલ પ્રકરણો (Recommended Chapters):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {summary.plan.dailyPracticePlan.recommendedChapters.map((rc) => (
                <div key={rc.chapterId} className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#001D36]">
                      {lang === 'en' ? rc.titleEnglish : lang === 'hi' ? rc.titleHindi : rc.titleGujarati}
                    </span>
                    <span className="px-2 py-0.5 bg-[#0061A4] text-white text-[10px] font-black rounded-md">
                      AI Recommend
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[#44474E]">{rc.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
            💡 AI સલાહ: અવાજથી ઉત્તર આપવાની ટેવ રાખવાથી યાદશક્તિમાં ૪૦% વધારે વન-ટાઇમ રિકોલ મળે છે.
          </div>
        </div>
      )}

      {/* 3. WEEKLY REVISION PLAN TAB */}
      {activeTab === 'weekly' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#C4C6D0]/40 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-[#C4C6D0]/30 pb-4">
            <span className="p-2.5 bg-[#7D00B3] text-white rounded-2xl">
              <Layers className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-black text-lg text-[#1A1C1E]">
                {lang === 'en' ? 'Weekly Revision Plan' : 'સાપ્તાહિક સ્માર્ટ રિવિઝન પ્લાન'}
              </h3>
              <p className="text-xs text-[#44474E] font-medium">
                લક્ષ્યાંક: અઠવાડિયામાં {summary.plan.weeklyRevisionPlan.weeklyTargetQuestions} પ્રશ્નોનું રિવિઝન
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-[#7D00B3]">
              મુખ્ય ફોકસ વિષયો: {summary.plan.weeklyRevisionPlan.focusSubjects.join(', ')}
            </h4>
            <div className="space-y-2">
              {summary.plan.weeklyRevisionPlan.focusChapters.map((fc, idx) => (
                <div key={idx} className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-xs font-black text-purple-950">{fc.titleGujarati}</span>
                  <span className="px-3 py-1 bg-[#7D00B3] text-white text-xs font-extrabold rounded-xl">
                    {fc.targetDay}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MONTHLY PROGRESS REPORT TAB */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#C4C6D0]/40 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#C4C6D0]/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-[#006D32] text-white rounded-2xl">
                <FileText className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-black text-lg text-[#1A1C1E]">
                  માસિક પ્રગતિ રિપોર્ટ card ({summary.plan.monthlyProgressReport.monthYear})
                </h3>
                <p className="text-xs text-[#44474E] font-medium">
                  {profile.name} - ધોરણ {profile.standard} ({profile.school})
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition-all"
              id="print-monthly-report-btn"
            >
              <Printer className="w-4 h-4" />
              <span>{l.printReport}</span>
            </button>
          </div>

          {/* Report Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">કુલ સમય</span>
              <p className="text-lg font-black text-slate-900">{summary.plan.monthlyProgressReport.totalPracticeMinutes} મિનિટ</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">ચોકસાઈ</span>
              <p className="text-lg font-black text-[#0061A4]">{summary.plan.monthlyProgressReport.overallAccuracy}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">પૂર્ણ પ્રકરણો</span>
              <p className="text-lg font-black text-[#006D32]">{summary.plan.monthlyProgressReport.chaptersCompletedCount}</p>
            </div>
          </div>

          {/* AI Recommendations list */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-extrabold uppercase text-[#006D32]">
              I M MASTER AI ગુરુજી ખાસ ભલામણો (Recommendations):
            </h4>
            <div className="space-y-2">
              {summary.plan.monthlyProgressReport.aiRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SPACED REPETITION TAB */}
      {activeTab === 'spaced' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-amber-200 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-amber-200 pb-4">
            <span className="p-2.5 bg-[#FFD941] text-[#241E00] rounded-2xl">
              <BrainCircuit className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-black text-lg text-[#1A1C1E]">
                સ્પેસ્ડ રિપિટિશન સિસ્ટમ (1d → 3d → 7d → 15d → 30d)
              </h3>
              <p className="text-xs text-[#44474E] font-medium">
                ભૂલ પડેલા પ્રશ્નો વિજ્ઞાન-આધારિત સમયરેખા મુજબ ઓટોમેટિક પુનરાવર્તનમાં આવે છે.
              </p>
            </div>
          </div>

          {/* Due Items List */}
          {summary.dueSpacedRepetitionItems.length === 0 ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-sm font-black text-emerald-950">{l.noSpacedItems}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-amber-900 block">
                આજે પુનરાવર્તન માટે બાકી પ્રશ્નો ({summary.dueSpacedRepetitionItems.length}):
              </span>
              {summary.dueSpacedRepetitionItems.map((item) => (
                <div key={item.id} className="p-4 bg-amber-50 rounded-2xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-md">
                      Stage {item.stage + 1} ({item.intervalDays} દિવસ ઇન્ટરવલ)
                    </span>
                    <p className="text-xs font-black text-slate-900">
                      {lang === 'en' && item.questionTextEnglish ? item.questionTextEnglish : item.questionTextGujarati}
                    </p>
                    <span className="text-[10px] font-bold text-amber-900 block">
                      છેલ્લો પ્રયાસ: {item.lastAttemptMarks}/{item.lastAttemptTotalMarks} ગુણ | ભૂલો: {item.incorrectCount}
                    </span>
                  </div>

                  {onStartReviewQuestion && (
                    <button
                      onClick={() => onStartReviewQuestion(item.questionId)}
                      className="px-4 py-2 bg-[#0061A4] hover:bg-[#004F87] text-white text-xs font-black rounded-xl shadow transition-all shrink-0"
                    >
                      {l.reviewNow}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
