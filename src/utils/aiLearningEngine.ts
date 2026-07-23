import { 
  StudentProfile, 
  PracticeHistoryItem, 
  Chapter, 
  Question, 
  SpacedRepetitionItem, 
  AILearningPlan 
} from '../types';

export interface AIIntelligenceSummary {
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  accuracyPercentage: number;
  totalPracticeTimeMinutes: number;
  completedChaptersCount: number;
  dailyStreakDays: number;
  
  // AI Detections
  weakChapters: Array<{ chapterId: string; titleGujarati: string; titleEnglish: string; titleHindi: string; accuracy: number }>;
  weakSubjects: Array<{ subjectId: string; nameGujarati: string; nameEnglish: string; nameHindi: string; accuracy: number }>;
  strongSubjects: Array<{ subjectId: string; nameGujarati: string; nameEnglish: string; nameHindi: string; accuracy: number }>;
  frequentlyForgottenTopics: Array<{ questionId: string; questionTextGujarati: string; questionTextEnglish: string; questionTextHindi: string; incorrectTimes: number }>;
  
  // Spaced Repetition
  dueSpacedRepetitionItems: SpacedRepetitionItem[];
  allSpacedRepetitionItems: SpacedRepetitionItem[];
  
  // Plans
  plan: AILearningPlan;
}

const SPACED_INTERVALS = [1, 3, 7, 15, 30]; // 1 day, 3 days, 7 days, 15 days, 30 days

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Process a practice answer attempt to update/create Spaced Repetition items
 */
export function processSpacedRepetition(
  question: Question,
  earnedMarks: number,
  totalMarks: number,
  existingItems: SpacedRepetitionItem[],
  studentId?: string
): { updatedItems: SpacedRepetitionItem[]; isNewSpacedItem: boolean } {
  const isCorrect = earnedMarks >= totalMarks * 0.7; // 70%+ is considered passed
  const today = getTodayDateString();
  const existingIdx = existingItems.findIndex(i => i.questionId === question.id);

  let updatedList = [...existingItems];
  let isNewSpacedItem = false;

  if (existingIdx >= 0) {
    const item = { ...updatedList[existingIdx] };
    item.lastAttemptMarks = earnedMarks;
    item.lastAttemptTotalMarks = totalMarks;
    item.lastAttemptDate = new Date().toISOString();

    if (isCorrect) {
      // Advance stage
      const nextStage = Math.min(item.stage + 1, SPACED_INTERVALS.length);
      item.stage = nextStage;
      if (nextStage < SPACED_INTERVALS.length) {
        item.intervalDays = SPACED_INTERVALS[nextStage];
        item.nextReviewDate = addDaysToDate(today, item.intervalDays);
      } else {
        // Mastered!
        item.intervalDays = 999;
        item.nextReviewDate = '2099-12-31';
      }
    } else {
      // Incorrect -> reset interval to 1 day (stage 0)
      item.stage = 0;
      item.intervalDays = 1;
      item.nextReviewDate = addDaysToDate(today, 1);
      item.incorrectCount = (item.incorrectCount || 0) + 1;
    }
    updatedList[existingIdx] = item;
  } else if (!isCorrect) {
    // New incorrect answer -> create spaced repetition item at 1-day interval
    isNewSpacedItem = true;
    const newItem: SpacedRepetitionItem = {
      id: `sr_${question.id}_${Date.now()}`,
      studentId: studentId || 'default',
      questionId: question.id,
      questionTextGujarati: question.questionTextGujarati,
      questionTextEnglish: question.questionTextEnglish,
      questionTextHindi: question.questionTextHindi,
      standard: question.standard,
      subject: question.subject,
      chapterId: question.chapterId,
      stage: 0,
      intervalDays: 1,
      nextReviewDate: addDaysToDate(today, 1),
      incorrectCount: 1,
      lastAttemptMarks: earnedMarks,
      lastAttemptTotalMarks: totalMarks,
      lastAttemptDate: new Date().toISOString()
    };
    updatedList.push(newItem);
  }

  return { updatedItems: updatedList, isNewSpacedItem };
}

/**
 * Calculates complete AI Learning Intelligence Summary from student data
 */
export function calculateAILearningSummary(
  profile: StudentProfile,
  history: PracticeHistoryItem[],
  allChapters: Chapter[],
  allQuestions: Question[],
  spacedRepetitionItems: SpacedRepetitionItem[]
): AIIntelligenceSummary {
  const today = getTodayDateString();

  // 1. Basic Stats
  const totalQuestionsAnswered = history.length;
  let correctAnswersCount = 0;
  let wrongAnswersCount = 0;
  let totalEarned = 0;
  let totalPossible = 0;

  // Chapter & Subject tracking maps
  const chapterStats: Record<string, { earned: number; total: number; count: number; wrongCount: number }> = {};
  const subjectStats: Record<string, { earned: number; total: number; count: number }> = {};
  const questionWrongMap: Record<string, number> = {};

  history.forEach((h) => {
    totalEarned += h.earnedMarks;
    totalPossible += h.totalMarks;

    const isCorrect = h.earnedMarks >= h.totalMarks * 0.7;
    if (isCorrect) {
      correctAnswersCount++;
    } else {
      wrongAnswersCount++;
      questionWrongMap[h.questionId] = (questionWrongMap[h.questionId] || 0) + 1;
    }

    // Chapter stats
    if (h.questionId) {
      const qObj = allQuestions.find((q) => q.id === h.questionId);
      const chId = qObj?.chapterId || 'ch_unknown';
      if (!chapterStats[chId]) {
        chapterStats[chId] = { earned: 0, total: 0, count: 0, wrongCount: 0 };
      }
      chapterStats[chId].earned += h.earnedMarks;
      chapterStats[chId].total += h.totalMarks;
      chapterStats[chId].count++;
      if (!isCorrect) chapterStats[chId].wrongCount++;
    }

    // Subject stats
    const subKey = String(h.subject || 'science');
    if (!subjectStats[subKey]) {
      subjectStats[subKey] = { earned: 0, total: 0, count: 0 };
    }
    subjectStats[subKey].earned += h.earnedMarks;
    subjectStats[subKey].total += h.totalMarks;
    subjectStats[subKey].count++;
  });

  const accuracyPercentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  const totalPracticeTimeMinutes = profile.minutesSpentToday + (totalQuestionsAnswered * 2);

  // Completed chapters (where accuracy >= 70% and count >= 2)
  const completedChaptersCount = Object.keys(chapterStats).filter((chId) => {
    const s = chapterStats[chId];
    return s.count >= 2 && (s.earned / s.total) >= 0.7;
  }).length;

  // 2. AI Detections: Weak & Strong Subjects
  const weakSubjects: Array<{ subjectId: string; nameGujarati: string; nameEnglish: string; nameHindi: string; accuracy: number }> = [];
  const strongSubjects: Array<{ subjectId: string; nameGujarati: string; nameEnglish: string; nameHindi: string; accuracy: number }> = [];

  const subjectNamesMap: Record<string, { gu: string; en: string; hi: string }> = {
    science: { gu: 'વિજ્ઞાન', en: 'Science', hi: 'विज्ञान' },
    social_science: { gu: 'સામાજિક વિજ્ઞાન', en: 'Social Science', hi: 'सामाजिक विज्ञान' },
    gujarati: { gu: 'ગુજરાતી', en: 'Gujarati', hi: 'गुजराती' },
    maths: { gu: 'ગણિત', en: 'Mathematics', hi: 'गणित' }
  };

  Object.keys(subjectStats).forEach((subId) => {
    const st = subjectStats[subId];
    const acc = st.total > 0 ? Math.round((st.earned / st.total) * 100) : 0;
    const names = subjectNamesMap[subId] || { gu: subId, en: subId, hi: subId };

    if (acc < 65 && st.count >= 1) {
      weakSubjects.push({ subjectId: subId, nameGujarati: names.gu, nameEnglish: names.en, nameHindi: names.hi, accuracy: acc });
    } else if (acc >= 80 && st.count >= 2) {
      strongSubjects.push({ subjectId: subId, nameGujarati: names.gu, nameEnglish: names.en, nameHindi: names.hi, accuracy: acc });
    }
  });

  // 3. AI Detections: Weak Chapters
  const weakChapters: Array<{ chapterId: string; titleGujarati: string; titleEnglish: string; titleHindi: string; accuracy: number }> = [];

  Object.keys(chapterStats).forEach((chId) => {
    const st = chapterStats[chId];
    const acc = st.total > 0 ? Math.round((st.earned / st.total) * 100) : 0;
    if (acc < 65 || st.wrongCount >= 2) {
      const chObj = allChapters.find((c) => c.id === chId);
      weakChapters.push({
        chapterId: chId,
        titleGujarati: chObj?.titleGujarati || 'પ્રકરણ',
        titleEnglish: chObj?.titleEnglish || 'Chapter',
        titleHindi: chObj?.titleHindi || 'अध्याय',
        accuracy: acc
      });
    }
  });

  // 4. Frequently Forgotten Topics
  const frequentlyForgottenTopics: Array<{
    questionId: string;
    questionTextGujarati: string;
    questionTextEnglish: string;
    questionTextHindi: string;
    incorrectTimes: number;
  }> = [];

  Object.keys(questionWrongMap).forEach((qId) => {
    const wrongTimes = questionWrongMap[qId];
    if (wrongTimes >= 1) {
      const qObj = allQuestions.find((q) => q.id === qId);
      if (qObj) {
        frequentlyForgottenTopics.push({
          questionId: qId,
          questionTextGujarati: qObj.questionTextGujarati,
          questionTextEnglish: qObj.questionTextEnglish || '',
          questionTextHindi: qObj.questionTextHindi || '',
          incorrectTimes: wrongTimes
        });
      }
    }
  });

  // Sort frequently forgotten by most wrong first
  frequentlyForgottenTopics.sort((a, b) => b.incorrectTimes - a.incorrectTimes);

  // 5. Spaced Repetition Due Items
  const dueSpacedRepetitionItems = spacedRepetitionItems.filter((item) => {
    return item.nextReviewDate <= today && item.stage < SPACED_INTERVALS.length;
  });

  // 6. Generate AI Plans
  // Recommended Chapters for Today
  const recommendedChapters = weakChapters.length > 0
    ? weakChapters.slice(0, 3).map((wc) => ({
        chapterId: wc.chapterId,
        titleGujarati: wc.titleGujarati,
        titleEnglish: wc.titleEnglish,
        titleHindi: wc.titleHindi,
        reason: 'નબળી ચોકસાઈવાળું પ્રકરણ - પુનરાવર્તન જરૂરી (Low accuracy - Revision needed)'
      }))
    : allChapters.slice(0, 2).map((c) => ({
        chapterId: c.id,
        titleGujarati: c.titleGujarati,
        titleEnglish: c.titleEnglish,
        titleHindi: c.titleHindi || 'अध्याय',
        reason: 'નવું પ્રકરણ મહાવરો (New chapter practice)'
      }));

  const recommendedQuestionIds = [
    ...dueSpacedRepetitionItems.map((i) => i.questionId),
    ...frequentlyForgottenTopics.slice(0, 3).map((f) => f.questionId)
  ].slice(0, 8);

  const plan: AILearningPlan = {
    dailyPracticePlan: {
      todaysRevisionCount: dueSpacedRepetitionItems.length,
      todaysNewQuestionsCount: Math.max(3, 5 - dueSpacedRepetitionItems.length),
      estimatedTimeMinutes: Math.max(10, (dueSpacedRepetitionItems.length + 3) * 3),
      recommendedChapters,
      recommendedQuestionIds
    },
    weeklyRevisionPlan: {
      weekRange: 'આ અઠવાડિયું (Current Week)',
      focusSubjects: weakSubjects.length > 0 ? weakSubjects.map((s) => s.nameGujarati) : ['વિજ્ઞાન', 'સામાજિક વિજ્ઞાન'],
      focusChapters: recommendedChapters.map((rc, idx) => ({
        chapterId: rc.chapterId,
        titleGujarati: rc.titleGujarati,
        targetDay: ['સોમવાર', 'બુધવાર', 'શુક્રવાર'][idx % 3]
      })),
      weeklyTargetQuestions: 25
    },
    monthlyProgressReport: {
      monthYear: new Date().toLocaleDateString('gu-IN', { month: 'long', year: 'numeric' }),
      totalPracticeMinutes: totalPracticeTimeMinutes,
      chaptersCompletedCount: completedChaptersCount,
      overallAccuracy: accuracyPercentage,
      strongSubjects: strongSubjects.map((s) => s.nameGujarati),
      weakSubjects: weakSubjects.map((s) => s.nameGujarati),
      weakChapters: weakChapters.map((c) => c.titleGujarati),
      frequentlyForgottenTopics: frequentlyForgottenTopics.map((f) => f.questionTextGujarati.substring(0, 40) + '...'),
      aiRecommendations: [
        dueSpacedRepetitionItems.length > 0
          ? `આજે સ્પેસ્ડ રિપિટિશનના ${dueSpacedRepetitionItems.length} પ્રશ્નોનું પુનરાવર્તન કરો.`
          : 'આજે નવુ પ્રકરણ શરૂ કરીને ૫ નવા પ્રશ્નોના અવાજથી ઉત્તર આપો.',
        weakChapters.length > 0
          ? `પ્રકરણ "${weakChapters[0]?.titleGujarati}" માં વિશિષ્ટ ધ્યાન આપો.`
          : 'તમારું વિજ્ઞાનમાં પ્રદર્શન ઉત્કૃષ્ટ છે, સામાજિક વિજ્ઞાનમાં મહાવરો વધારો.',
        'રોજ ૧૫ મિનિટ બોલીને ઉત્તર આપવાથી યાદશક્તિ અને આત્મવિશ્વાસ બમણો થાય છે.'
      ]
    }
  };

  return {
    totalQuestionsAnswered,
    correctAnswersCount,
    wrongAnswersCount,
    accuracyPercentage,
    totalPracticeTimeMinutes,
    completedChaptersCount,
    dailyStreakDays: profile.streakDays || 1,
    weakChapters,
    weakSubjects,
    strongSubjects,
    frequentlyForgottenTopics,
    dueSpacedRepetitionItems,
    allSpacedRepetitionItems: spacedRepetitionItems,
    plan
  };
}
