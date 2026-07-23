import { StudentProfile, PracticeHistoryItem } from '../types';

export interface Badge {
  id: string;
  titleGujarati: string;
  titleEnglish: string;
  descriptionGujarati: string;
  descriptionEnglish: string;
  icon: 'Award' | 'Flame' | 'Sparkles' | 'Zap' | 'Trophy' | 'Crown' | 'BookOpen' | 'Star' | 'CheckCircle2';
  color: string;
  bgLight: string;
  category: 'milestone' | 'streak' | 'accuracy' | 'subject';
  isUnlocked: boolean;
  unlockedAt?: string;
  progressCurrent: number;
  progressTarget: number;
  unitGujarati: string;
  unitEnglish: string;
}

export const getCalculatedBadges = (
  profile: StudentProfile,
  history: PracticeHistoryItem[]
): Badge[] => {
  const totalQuestions = Math.max(profile.totalQuestionsAnswered || 0, history.length);
  const totalMarks = Math.max(profile.totalMarksEarned || 0, history.reduce((acc, h) => acc + h.earnedMarks, 0));
  const streakDays = profile.streakDays || 1;

  // Science high accuracy count
  const scienceHighAccuracyCount = history.filter(
    (h) => h.subject === 'science' && (h.earnedMarks / Math.max(1, h.totalMarks)) >= 0.75
  ).length;

  // Social Science count
  const socialScienceCount = history.filter(
    (h) => h.subject === 'social_science' && (h.earnedMarks / Math.max(1, h.totalMarks)) >= 0.6
  ).length;

  // Perfect scores
  const perfectScoreCount = history.filter(
    (h) => h.earnedMarks === h.totalMarks && h.totalMarks > 0
  ).length;

  // Voice transcript count
  const voiceAnswerCount = history.filter(
    (h) => h.studentTranscript && h.studentTranscript.trim().length > 3
  ).length;

  return [
    {
      id: 'quiz_master',
      titleGujarati: 'ક્વિઝ માસ્ટર',
      titleEnglish: 'Quiz Master',
      descriptionGujarati: 'ઓછામાં ઓછા ૫ NCERT પ્રશ્નોના ઉત્તર આપો',
      descriptionEnglish: 'Answer at least 5 NCERT questions',
      icon: 'Trophy',
      color: '#0061A4',
      bgLight: '#D1E4FF',
      category: 'milestone',
      isUnlocked: totalQuestions >= 5,
      progressCurrent: Math.min(totalQuestions, 5),
      progressTarget: 5,
      unitGujarati: 'પ્રશ્નો',
      unitEnglish: 'questions',
    },
    {
      id: 'science_whiz',
      titleGujarati: 'સાયન્સ વિઝ (વિજ્ઞાન નિષ્ણાત)',
      titleEnglish: 'Science Whiz',
      descriptionGujarati: 'વિજ્ઞાન વિષયમાં ૩ શ્રેષ્ઠ ઉત્તરો આપો (૭૫%+ ગુણ)',
      descriptionEnglish: 'Get 75%+ score on 3 Science questions',
      icon: 'Zap',
      color: '#006D32',
      bgLight: '#C4EED0',
      category: 'subject',
      isUnlocked: scienceHighAccuracyCount >= 3,
      progressCurrent: Math.min(scienceHighAccuracyCount, 3),
      progressTarget: 3,
      unitGujarati: 'પ્રશ્નો',
      unitEnglish: 'questions',
    },
    {
      id: 'consistent_learner',
      titleGujarati: 'નિયમિત વિદ્યાર્થી',
      titleEnglish: 'Consistent Learner',
      descriptionGujarati: 'સતત ૩ દિવસ સુધી દરરોજ અભ્યાસ કરો',
      descriptionEnglish: 'Maintain a 3-day practice streak',
      icon: 'Flame',
      color: '#B9770E',
      bgLight: '#FFD941',
      category: 'streak',
      isUnlocked: streakDays >= 3,
      progressCurrent: Math.min(streakDays, 3),
      progressTarget: 3,
      unitGujarati: 'દિવસ',
      unitEnglish: 'days',
    },
    {
      id: 'perfect_score',
      titleGujarati: 'પરિપૂર્ણ ૧૦૦% ગુણ',
      titleEnglish: 'Perfect Score',
      descriptionGujarati: 'કોઈપણ પ્રશ્નમાં પૂરેપૂરા (100%) ગુણ મેળવો',
      descriptionEnglish: 'Achieve 100% marks on any question',
      icon: 'Crown',
      color: '#7D00B3',
      bgLight: '#F3E5F5',
      category: 'accuracy',
      isUnlocked: perfectScoreCount >= 1,
      progressCurrent: Math.min(perfectScoreCount, 1),
      progressTarget: 1,
      unitGujarati: 'વખત',
      unitEnglish: 'times',
    },
    {
      id: 'voice_champion',
      titleGujarati: 'વોઈસ ચેમ્પિયન',
      titleEnglish: 'Voice Champion',
      descriptionGujarati: 'અવાજથી બોલીને ૩ પ્રશ્નોનું મૂલ્યાંકન કરાવો',
      descriptionEnglish: 'Evaluate 3 answers using voice speech',
      icon: 'Sparkles',
      color: '#0061A4',
      bgLight: '#E1F5FE',
      category: 'milestone',
      isUnlocked: voiceAnswerCount >= 3,
      progressCurrent: Math.min(voiceAnswerCount, 3),
      progressTarget: 3,
      unitGujarati: 'વખત',
      unitEnglish: 'times',
    },
    {
      id: 'scholar_student',
      titleGujarati: 'મેધાવી સ્કોલર',
      titleEnglish: 'Scholar Student',
      descriptionGujarati: 'કુલ ૩૦ કે તેથી વધુ ગુણ પ્રાપ્ત કરો',
      descriptionEnglish: 'Earn 30+ total practice marks',
      icon: 'Award',
      color: '#1B5E20',
      bgLight: '#E8F5E9',
      category: 'milestone',
      isUnlocked: totalMarks >= 30,
      progressCurrent: Math.min(totalMarks, 30),
      progressTarget: 30,
      unitGujarati: 'ગુણ',
      unitEnglish: 'marks',
    },
    {
      id: 'social_science_star',
      titleGujarati: 'સામાજિક વિજ્ઞાન સ્ટાર',
      titleEnglish: 'Social Science Star',
      descriptionGujarati: 'સામાજિક વિજ્ઞાનમાં ૨ પ્રશ્નો પૂર્ણ કરો',
      descriptionEnglish: 'Answer 2 Social Science questions',
      icon: 'Star',
      color: '#C62828',
      bgLight: '#FFEBEE',
      category: 'subject',
      isUnlocked: socialScienceCount >= 2,
      progressCurrent: Math.min(socialScienceCount, 2),
      progressTarget: 2,
      unitGujarati: 'પ્રશ્નો',
      unitEnglish: 'questions',
    },
  ];
};
