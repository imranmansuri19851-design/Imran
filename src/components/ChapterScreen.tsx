import React, { useState } from 'react';
import { Standard, SubjectId, Question } from '../types';
import { CHAPTERS, SUBJECTS } from '../data/ncertContent';
import { ArrowLeft, BookOpen, Search, ChevronRight, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface ChapterScreenProps {
  standard: Standard;
  subject: SubjectId;
  allQuestions: Question[];
  onSelectChapter: (chapterId: string) => void;
  onSelectSpecificQuestion: (question: Question) => void;
  onBackToHome: () => void;
}

export const ChapterScreen: React.FC<ChapterScreenProps> = ({
  standard,
  subject,
  allQuestions,
  onSelectChapter,
  onSelectSpecificQuestion,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapterForQuestions, setSelectedChapterForQuestions] = useState<string | null>(null);

  const currentSubjectInfo = SUBJECTS.find((s) => s.id === subject) || SUBJECTS[0];

  const filteredChapters = CHAPTERS.filter(
    (ch) =>
      ch.standard === standard &&
      ch.subject === subject &&
      (ch.titleGujarati.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.chapterNumber.toString().includes(searchQuery))
  );

  const activeChapterQuestions = selectedChapterForQuestions
    ? allQuestions.filter((q) => q.chapterId === selectedChapterForQuestions)
    : [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Navigation & Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-800 hover:text-[#0061A4] bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-slate-200 transition-all hover:bg-slate-50"
          id="chapter-screen-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#0061A4]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#001D36] font-black text-xs border border-blue-200">
            Std {standard}
          </span>
          <span 
            className="px-3 py-1 rounded-full font-black text-xs"
            style={{ backgroundColor: currentSubjectInfo.bgLight, color: currentSubjectInfo.color }}
          >
            {currentSubjectInfo.nameEnglish}
          </span>
        </div>
      </div>

      {/* Chapter Banner */}
      <div className="rounded-[28px] p-6 sm:p-8 shadow-md bg-gradient-to-r from-[#003B68] via-[#0061A4] to-[#00677D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Chapter & Question Selection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight pt-1">
            {currentSubjectInfo.nameGujarati} ({currentSubjectInfo.nameEnglish}) - Select Chapter
          </h2>
          <p className="text-xs text-blue-100 font-medium">
            કોઈપણ પાઠ પર ક્લિક કરી તેના વિશિષ્ટ પ્રશ્નો પસંદ કરો અથવા શ્રેણીબદ્ધ અભ્યાસ શરૂ કરો.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Chapter..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white text-xs font-bold placeholder-cyan-100/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 border border-white/20"
            id="search-chapter-input"
          />
        </div>
      </div>

      {/* Chapter Question Drill-Down View if Selected */}
      {selectedChapterForQuestions ? (
        <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <button
                onClick={() => setSelectedChapterForQuestions(null)}
                className="text-xs font-bold text-[#0061A4] hover:underline flex items-center gap-1 mb-1"
              >
                ← Back to All Chapters
              </button>
              <h3 className="font-black text-lg text-slate-900">
                Question Selection
              </h3>
            </div>

            <button
              onClick={() => onSelectChapter(selectedChapterForQuestions)}
              className="px-5 py-2.5 rounded-2xl bg-[#006D32] hover:bg-[#005225] text-white font-black text-xs shadow-xs flex items-center gap-2 transition-colors"
              id="start-chapter-sequential-btn"
            >
              <span>Start Sequential Practice →</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeChapterQuestions.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-slate-500">
                આ પ્રકરણમાં હાલ કોઈ પ્રશ્ન નથી. શિક્ષક મોડમાંથી નવો પ્રશ્ન ઉમેરી શકો છો!
              </div>
            ) : (
              activeChapterQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => onSelectSpecificQuestion(q)}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  id={`select-q-card-${q.id}`}
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0061A4] text-white font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#006D32] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Award className="w-3 h-3 text-[#006D32]" />
                        {q.totalMarks} Marks
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        Difficulty: {q.difficulty}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#0061A4] transition-colors leading-snug">
                      {q.questionTextGujarati}
                    </h4>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {q.keywords.map((kw, kIdx) => (
                        <span key={kIdx} className="text-[10px] bg-white px-2 py-0.5 rounded-md text-slate-600 font-bold border border-slate-200">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSpecificQuestion(q);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0061A4] group-hover:bg-[#004F87] text-white font-black text-xs shrink-0 shadow-xs transition-all"
                  >
                    Start Voice Answer →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Chapters Grid */
        filteredChapters.length === 0 ? (
          <div className="bg-white rounded-[28px] p-12 text-center space-y-3 border border-slate-200 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-black text-slate-800 text-base">No Chapters Found</h3>
            <p className="text-xs text-slate-500 font-medium">
              Please select another standard or subject.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChapters.map((ch) => {
              const progressPercent = Math.round((ch.completedQuestions / Math.max(1, ch.totalQuestions)) * 100);

              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChapterForQuestions(ch.id)}
                  className="group bg-white rounded-[28px] p-6 shadow-xs hover:shadow-md border border-slate-200 hover:border-[#0061A4] transition-all cursor-pointer flex flex-col justify-between gap-4"
                  id={`chapter-card-${ch.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: currentSubjectInfo.bgLight, color: currentSubjectInfo.color }}
                      >
                        {ch.chapterNumber}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-black text-slate-500 tracking-wider uppercase">
                          Chapter {ch.chapterNumber}
                        </span>
                        <h3 className="font-black text-slate-900 text-base group-hover:text-[#0061A4] transition-colors leading-snug">
                          {ch.titleGujarati}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">
                          {ch.titleEnglish}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#0061A4] group-hover:text-white text-slate-800 flex items-center justify-center transition-all shrink-0">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Question stats & progress bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                      <span className="flex items-center gap-1 text-slate-800">
                        <BookOpen className="w-3.5 h-3.5 text-[#0061A4]" />
                        {ch.totalQuestions} Questions
                      </span>
                      <span className="text-[#006D32] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {ch.completedQuestions} Completed ({progressPercent}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                      <div 
                        className="h-full bg-[#006D32] rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
};


