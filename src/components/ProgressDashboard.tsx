import React, { useState } from 'react';
import { StudentProfile, PracticeHistoryItem, Chapter, Question, SpacedRepetitionItem } from '../types';
import { calculateWeakTopics } from '../utils/storage';
import { BadgesSection } from './BadgesSection';
import { AILearningIntelligenceDashboard } from './AILearningIntelligenceDashboard';
import { 
  Flame, 
  Clock, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  ArrowLeft, 
  BarChart3, 
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface ProgressDashboardProps {
  profile: StudentProfile;
  history: PracticeHistoryItem[];
  allChapters?: Chapter[];
  allQuestions?: Question[];
  spacedRepetitionItems?: SpacedRepetitionItem[];
  onBackToHome: () => void;
  onStartReviewQuestion?: (questionId: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  profile,
  history,
  allChapters = [],
  allQuestions = [],
  spacedRepetitionItems = [],
  onBackToHome,
  onStartReviewQuestion
}) => {
  const [viewMode, setViewMode] = useState<'ai_intelligence' | 'standard_graph'>('ai_intelligence');
  const weakTopics = calculateWeakTopics(history);

  // Prepare chart data from practice history
  const chartData = history
    .slice()
    .reverse()
    .map((h, i) => {
      const percentage = Math.round((h.earnedMarks / Math.max(1, h.totalMarks)) * 100);
      return {
        name: `Q ${i + 1}`,
        accuracy: percentage,
        score: `${h.earnedMarks}/${h.totalMarks}`,
      };
    });

  if (chartData.length === 0) {
    // Default fallback chart data for immediate visual engagement
    chartData.push(
      { name: 'Day 1', accuracy: 60, score: '3/5' },
      { name: 'Day 2', accuracy: 80, score: '4/5' },
      { name: 'Day 3', accuracy: 100, score: '5/5' }
    );
  }

  const averageAccuracy = Math.round(
    chartData.reduce((acc, curr) => acc + curr.accuracy, 0) / Math.max(1, chartData.length)
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* View Mode Selector Header */}
      <div className="bg-blue-50/70 p-2 rounded-2xl border border-blue-200 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-800 hover:text-[#0061A4] bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 transition-all hover:bg-slate-50"
          id="dashboard-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#0061A4]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl shadow-xs border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setViewMode('ai_intelligence')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'ai_intelligence'
                ? 'bg-[#0061A4] text-white font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="view-ai-intelligence-btn"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Learning Intelligence System</span>
          </button>

          <button
            onClick={() => setViewMode('standard_graph')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'standard_graph'
                ? 'bg-[#0061A4] text-white font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="view-standard-graph-btn"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Scorecard & Graphs</span>
          </button>
        </div>
      </div>

      {viewMode === 'ai_intelligence' ? (
        <AILearningIntelligenceDashboard
          profile={profile}
          history={history}
          allChapters={allChapters}
          allQuestions={allQuestions}
          spacedRepetitionItems={spacedRepetitionItems}
          onBackToHome={onBackToHome}
          onStartReviewQuestion={onStartReviewQuestion}
        />
      ) : (
        <>
          {/* Hero Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Daily Practice Streak */}
            <div className="bg-amber-300 text-slate-900 rounded-[28px] p-6 shadow-xs space-y-2 relative overflow-hidden border border-amber-400">
              <div className="flex items-center justify-between font-black text-xs uppercase tracking-wider">
                <span>Daily Practice Streak</span>
                <Flame className="w-5 h-5 fill-slate-900 text-slate-900" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {profile.streakDays} Days
              </div>
              <p className="text-[11px] font-extrabold opacity-90">
                Active daily practice streak 🔥
              </p>
            </div>

            {/* Minutes Spent Today */}
            <div className="bg-gradient-to-r from-[#003B68] to-[#0061A4] text-white rounded-[28px] p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-blue-100 font-black text-xs uppercase tracking-wider">
                <span>Time Spent Today</span>
                <Clock className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="text-3xl font-black text-white">
                {profile.minutesSpentToday} Mins
              </div>
              <p className="text-[11px] font-bold text-blue-100">
                Daily Goal: 15 Mins
              </p>
            </div>

            {/* Total Marks */}
            <div className="bg-[#006D32] text-white rounded-[28px] p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-100 font-black text-xs uppercase tracking-wider">
                <span>Total Marks Earned</span>
                <Award className="w-5 h-5 text-emerald-200" />
              </div>
              <div className="text-3xl font-black text-white">
                {profile.totalMarksEarned} Marks
              </div>
              <p className="text-[11px] font-bold text-emerald-100">
                {profile.totalQuestionsAnswered} Questions Practiced
              </p>
            </div>

            {/* Average Accuracy */}
            <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-black text-xs uppercase tracking-wider">
                <span>Average Accuracy</span>
                <TrendingUp className="w-5 h-5 text-[#0061A4]" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {averageAccuracy}%
              </div>
              <p className="text-[11px] font-bold text-[#006D32] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Consistent Performance
              </p>
            </div>

          </div>

          {/* Virtual Medals & Badges Section */}
          <BadgesSection profile={profile} history={history} />

          {/* Improvement Graph Section (Recharts) */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#0061A4]" />
                  Performance Improvement Graph
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Track your evaluation scores over time
                </p>
              </div>
              <span className="text-xs font-black text-[#001D36] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                {averageAccuracy}% Avg Accuracy
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0061A4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0061A4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value: any) => [`${value}% Accuracy`, 'Accuracy']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#0061A4" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#accuracyGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weak Topics & Focus Areas */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Recommended Focus Topics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weakTopics.map((topic, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                      {topic.subjectNameGujarati}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {topic.topicNameGujarati}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900 block">
                      {topic.accuracyPercentage}% Score
                    </span>
                    <span className="text-[10px] text-amber-950 font-black bg-amber-300 px-2.5 py-0.5 rounded-full">
                      Needs Revision
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice History Timeline */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-base">
              Recent Practice Activity
            </h3>

            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-500">
                      <span className="text-[#0061A4] font-black">
                        Std {item.standard}
                      </span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {item.questionTextGujarati}
                    </h4>
                    <p className="text-slate-600 italic font-semibold">
                      Spoken Transcript: "{item.studentTranscript}"
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#006D32] bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200">
                      {item.earnedMarks} / {item.totalMarks} Marks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

