export type Standard = 6 | 7 | 8;

export type SubjectId = 'gujarati' | 'maths' | 'science' | 'social_science' | 'hindi' | 'english' | 'sanskrit';

export type MediumType = 'Gujarati' | 'English';

export type LearningStyleType = 'Auditory' | 'Visual' | 'Kinesthetic' | 'Reading-Writing';

export type TargetMarksType = '80%' | '90%' | '95%' | '100%';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export type PlanType = 'free' | 'premium' | 'school';

export type PaymentGateway = 'razorpay' | 'google_play';

export interface SubjectInfo {
  id: SubjectId;
  nameGujarati: string;
  nameEnglish: string;
  icon: string;
  color: string;
  bgLight: string;
}

export interface StudentProfile {
  id?: string;
  name: string;
  standard: Standard;
  school: string;
  medium: MediumType;
  age: number;
  learningStyle: LearningStyleType;
  targetMarks: TargetMarksType;
  selectedSubject: SubjectId;
  streakDays: number;
  dailyGoalMinutes: number;
  minutesSpentToday: number;
  totalQuestionsAnswered: number;
  totalMarksEarned: number;
  avatarSeed: string;
  isLoggedIn: boolean;
  email?: string;
  updatedAt?: string;
  // Business & Subscription Additions
  plan: PlanType;
  planExpiryDate?: string;
  dailyEvaluationsUsed: number;
  lastEvaluationDate?: string; // YYYY-MM-DD
  referralCode: string;
  invitedFriendsCount: number;
  bonusDaysEarned: number;
}

export interface TeacherProfile {
  id: string;
  email: string;
  name: string;
  school: string;
  isLoggedIn: boolean;
  role?: 'teacher';
  plan?: PlanType;
  schoolCode?: string;
  pin?: string;
}

export interface ParentProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isLoggedIn: boolean;
  linkedStudentId: string;
  dailySmsAlerts: boolean;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export interface Chapter {
  id: string;
  standard: Standard;
  subject: SubjectId;
  chapterNumber: number;
  titleGujarati: string;
  titleEnglish: string;
  titleHindi?: string;
  totalQuestions: number;
  completedQuestions?: number;
  iconName?: string;
  createdBy?: string;
  createdAt?: string;
}

export type QuestionMarkType = 1 | 2 | 3 | 4 | 5 | 6;

export interface AIEvaluationRules {
  accuracyCheck: string;
  completenessCheck: string;
  keywordsCheck: string;
  conceptCheck: string;
}

export interface DynamicStandard {
  id: string;
  standardNumber: number;
  titleGujarati: string;
  titleEnglish: string;
  description?: string;
  active?: boolean;
}

export interface DynamicSubject {
  id: string;
  nameGujarati: string;
  nameEnglish: string;
  icon: string;
  color: string;
  bgLight: string;
  standard?: number;
}

export interface Question {
  id: string;
  questionId?: string;
  chapterId: string;
  chapterNumber?: number;
  chapterTitleGujarati?: string;
  chapterName?: string;
  standard: Standard | number;
  subject: SubjectId | string;
  marks?: QuestionMarkType | number;
  totalMarks: QuestionMarkType | number;
  maximumScore?: number; // Always 10
  difficulty: 'સરળ' | 'મધ્યમ' | 'અઘરું' | 'Easy' | 'Medium' | 'Hard';
  questionTextGujarati: string;
  questionGujarati?: string;
  questionTextEnglish: string;
  questionTextHindi?: string;
  keywords: string[];
  importantKeywords?: string[];
  voiceEvaluationKeywords?: string[];
  mainPoints?: string[];
  expectedKeyPoints: string[];
  modelAnswer?: string;
  officialModelAnswer?: string;
  officialNCERTModelAnswer?: string;
  alternativeAcceptableAnswers?: string[];
  alternativeAcceptedAnswers?: string[];
  commonMistakes?: string[];
  commonStudentMistakes?: string[];
  revisionTags?: string[];
  aiEvaluationRules?: AIEvaluationRules;
  memoryTipGujarati: string;
  hintGujarati: string;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  createdBy?: string;
  createdAt?: string;
  lastUpdated?: string;
  status?: 'Draft' | 'Approved' | 'draft' | 'approved';
  // CMS rich fields & attachments
  questionType?: '1_mark' | '2_marks' | '3_marks' | '4_marks' | '5_marks' | '6_marks' | 'mcq' | 'short' | 'long' | 'fill_blanks' | 'true_false';
  marksDistribution?: string;
  imageUrl?: string;
  diagramUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  estimatedTimeMinutes?: number;
  ncertReference?: string;
  board?: string;
}

export interface PersonalizedPracticeQuestion {
  questionText: string;
  hint: string;
  chapter: string;
  expectedKeyPoints: string[];
}

export interface EstimatedExamMarks {
  scoreOutOf100: number;
  breakdown: string;
}

export interface EvaluationResult {
  earnedMarks: number;
  totalMarks: number;
  percentage?: number;
  grade?: string; // 'A+', 'A', 'B', 'C', 'D', 'F'
  confidenceScore?: number; // 0 - 100
  accuracyScore?: number; // 0 - 100
  completenessScore?: number; // 0 - 100
  keywordsScore?: number; // 0 - 100
  conceptUnderstandingScore?: number; // 0 - 100
  grammarScore?: number; // 0 - 100
  logicalOrderScore?: number; // 0 - 100
  correctSentences?: string[]; // Green
  correctPoints: string[];
  missingPoints: string[]; // Orange
  incorrectStatements?: string[]; // Red
  wrongPoints?: string[];
  strengths?: string[];
  weaknesses?: string[];
  improvementTips?: string[];
  suggestions?: string[];
  personalizedPracticeQuestion?: PersonalizedPracticeQuestion;
  estimatedExamMarks?: EstimatedExamMarks;
  hint: string;
  hintLevel?: number; // 1: Small clue, 2: Bigger clue, 3: Almost complete guidance
  hintLevelName?: string;
  hintsUsed?: number;
  missingKeywords?: string[];
  encouragingPhrase?: string;
  keywords: string[];
  memoryTips: string;
  feedback: string;
  attemptNumber?: number;
  timeTakenSeconds?: number;
  scoreBeforeHint?: number;
  improvementPercentage?: number;
  weakConcepts?: string[];
  whatToRevise?: string[];
  recommendedNextPractice?: string;
  gujaratiExplanation?: string;
  keyPointExplanationsGujarati?: { point: string; explanation: string }[];
  isCompleteModelAnswerRevealed?: boolean;
  modelAnswer?: string;
  language?: 'gu' | 'en' | 'hi';
  source?: string;
}

export interface PracticeHistoryItem {
  id: string;
  date: string; // ISO string
  studentId?: string;
  questionId: string;
  questionTextGujarati: string;
  standard: Standard;
  subject: SubjectId;
  chapterId?: string;
  totalMarks: number;
  earnedMarks: number;
  attempts?: number;
  hintsUsed?: number;
  scoreBeforeHint?: number;
  improvementPercentage?: number;
  timeTaken?: number; // in seconds
  weakConcepts?: string[];
  whatToRevise?: string[];
  recommendedNextPractice?: string;
  accuracyPercentage?: number;
  studentTranscript: string;
  feedback: string;
  evaluationResult?: EvaluationResult;
}

export interface SpacedRepetitionItem {
  id: string;
  studentId?: string;
  questionId: string;
  questionTextGujarati: string;
  questionTextEnglish?: string;
  questionTextHindi?: string;
  standard: Standard | number;
  subject: SubjectId | string;
  chapterId: string;
  stage: number; // 0: 1d, 1: 3d, 2: 7d, 3: 15d, 4: 30d, 5: Mastered
  nextReviewDate: string; // YYYY-MM-DD
  intervalDays: number; // 1, 3, 7, 15, 30
  incorrectCount: number;
  lastAttemptMarks: number;
  lastAttemptTotalMarks: number;
  lastAttemptDate: string; // ISO String
}

export interface AILearningPlan {
  dailyPracticePlan: {
    todaysRevisionCount: number;
    todaysNewQuestionsCount: number;
    estimatedTimeMinutes: number;
    recommendedChapters: Array<{ chapterId: string; titleGujarati: string; titleEnglish?: string; titleHindi?: string; reason: string }>;
    recommendedQuestionIds: string[];
  };
  weeklyRevisionPlan: {
    weekRange: string;
    focusSubjects: string[];
    focusChapters: Array<{ chapterId: string; titleGujarati: string; targetDay: string }>;
    weeklyTargetQuestions: number;
  };
  monthlyProgressReport: {
    monthYear: string;
    totalPracticeMinutes: number;
    chaptersCompletedCount: number;
    overallAccuracy: number;
    strongSubjects: string[];
    weakSubjects: string[];
    weakChapters: string[];
    frequentlyForgottenTopics: string[];
    aiRecommendations: string[];
  };
}

export interface WeakTopic {
  subjectNameGujarati: string;
  topicNameGujarati: string;
  accuracyPercentage: number;
  needsPractice: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  planUpgrade: PlanType;
  active: boolean;
  description: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userRole: UserRole;
  planType: PlanType;
  gateway: PaymentGateway;
  amountINR: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: string;
  razorpayPaymentId?: string;
  googlePlayPurchaseToken?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'reward' | 'system' | 'update' | 'alert';
  recipientRole?: 'parent' | 'teacher' | 'student';
  studentId?: string;
  studentName?: string;
}

export interface AIChatMessage {
  id: string;
  studentId?: string;
  role: 'user' | 'assistant';
  senderName?: string;
  text: string;
  spokenText?: string;
  timestamp: string; // ISO string
  language?: 'gu' | 'hi' | 'en';
  detectedClass?: string;
  detectedSubject?: string;
  detectedChapter?: string;
  stepByStepExplanation?: string;
  followUpQuestion?: string;
  hint?: string;
  practiceQuestion?: string;
  isWithinSyllabus?: boolean;
}

