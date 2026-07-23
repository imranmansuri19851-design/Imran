import { StudentProfile, PracticeHistoryItem, WeakTopic } from '../types';

const PROFILE_KEY = 'answer_coach_profile';
const HISTORY_KEY = 'answer_coach_history';

export const DEFAULT_PROFILE: StudentProfile = {
  id: 'std_default_1',
  name: 'કશિશ મનસુરી',
  standard: 7,
  school: 'સરકારી માધ્યમિક શાળા / પ્રાઈવેટ શાળા',
  medium: 'Gujarati',
  age: 12,
  learningStyle: 'Auditory',
  targetMarks: '90%',
  selectedSubject: 'science',
  streakDays: 3,
  dailyGoalMinutes: 15,
  minutesSpentToday: 8,
  totalQuestionsAnswered: 12,
  totalMarksEarned: 42,
  avatarSeed: 'kashish_mansuri',
  isLoggedIn: true,
  email: 'kashishmansuri786786786@gmail.com',
  plan: 'premium', // Default to premium for easy family/demo access
  dailyEvaluationsUsed: 1,
  referralCode: 'KASHISH2026',
  invitedFriendsCount: 2,
  bonusDaysEarned: 14,
};

export const getStoredProfile = (): StudentProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.name || parsed.name.includes('Aarav') || parsed.name.includes('Patel')) {
        parsed.name = 'કશિશ મનસુરી';
      }
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load profile from storage:', e);
  }
  return DEFAULT_PROFILE;
};

export const saveStoredProfile = (profile: StudentProfile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile:', e);
  }
};

export const getPracticeHistory = (): PracticeHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load history:', e);
  }
  return [
    {
      id: 'h-1',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      questionId: 'q-s7-1-2',
      questionTextGujarati: 'સ્વાવલંબી અને પરાવલંબી પોષણ વચ્ચેનો તફાવત જણાવો.',
      standard: 7,
      subject: 'science',
      totalMarks: 3,
      earnedMarks: 3,
      studentTranscript: 'સ્વાવલંબી પોષણમાં વનસ્પતિ સૂર્યપ્રકાશમાં પોતાનો ખોરાક બનાવે છે.',
      feedback: 'ઉત્કૃષ્ટ! સચોટ જવાબ.',
    },
    {
      id: 'h-2',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      questionId: 'q-s7-2-1',
      questionTextGujarati: 'નાના આંતરડામાં ખોરાકનું પાચન સમજાવો.',
      standard: 7,
      subject: 'science',
      totalMarks: 5,
      earnedMarks: 4,
      studentTranscript: 'નાના આંતરડામાં પિત્તરસ અને સ્વાદુરસ આવે છે જેથી પાચન પૂર્ણ થાય છે.',
      feedback: 'ખૂબ જ સરસ! મોટાભાગના મુદ્દા કવર થયા.',
    },
    {
      id: 'h-3',
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      questionId: 'q-ss8-2-1',
      questionTextGujarati: 'ભારતના બંધારણના મુખ્ય લક્ષણો જણાવો.',
      standard: 8,
      subject: 'social_science',
      totalMarks: 5,
      earnedMarks: 3,
      studentTranscript: 'બાબાસાહેબ આંબેડકરે ખરડા સમિતિ બનાવી અને 26 જાન્યુઆરી 1950થી બંધારણ અમલમાં આવ્યું.',
      feedback: 'સારા પ્રયાસ! વધુ 2 મુદ્દા ઉમેરવાની જરૂર છે.',
    },
  ];
};

export const savePracticeHistory = (history: PracticeHistoryItem[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save history:', e);
  }
};

export const calculateWeakTopics = (history: PracticeHistoryItem[]): WeakTopic[] => {
  if (history.length === 0) {
    return [
      {
        subjectNameGujarati: 'વિજ્ઞાન (Science)',
        topicNameGujarati: 'પ્રાણીઓમાં પાચનતંત્ર (Digestive System)',
        accuracyPercentage: 65,
        needsPractice: true,
      },
      {
        subjectNameGujarati: 'સામાજિક વિજ્ઞાન',
        topicNameGujarati: 'દિલ્હી સલ્તનત અને શાસકો',
        accuracyPercentage: 50,
        needsPractice: true,
      },
    ];
  }

  const map: Record<string, { totalEarned: number; totalPossible: number; count: number; subject: string }> = {};

  history.forEach((h) => {
    const key = h.questionTextGujarati.slice(0, 20);
    if (!map[key]) {
      map[key] = {
        totalEarned: 0,
        totalPossible: 0,
        count: 0,
        subject: h.subject === 'science' ? 'વિજ્ઞાન' : h.subject === 'social_science' ? 'સામાજિક વિજ્ઞાન' : 'ગુજરાતી',
      };
    }
    map[key].totalEarned += h.earnedMarks;
    map[key].totalPossible += h.totalMarks;
    map[key].count += 1;
  });

  const list: WeakTopic[] = Object.entries(map).map(([topicKey, val]) => {
    const acc = Math.round((val.totalEarned / Math.max(1, val.totalPossible)) * 100);
    return {
      subjectNameGujarati: val.subject,
      topicNameGujarati: topicKey + '...',
      accuracyPercentage: acc,
      needsPractice: acc < 75,
    };
  });

  return list.sort((a, b) => a.accuracyPercentage - b.accuracyPercentage).slice(0, 4);
};
