import { Question, QuestionMarkType, Standard, SubjectId, AIEvaluationRules } from '../../types';

export interface QuestionBankFilter {
  standard?: Standard;
  subject?: SubjectId | string;
  chapterId?: string;
  marksCategory?: QuestionMarkType;
}

export function createNCERTQuestion(params: {
  id: string;
  standard: Standard;
  subject: SubjectId;
  chapterId: string;
  chapterNumber: number;
  chapterTitleGujarati: string;
  marks: QuestionMarkType;
  difficulty: 'સરળ' | 'મધ્યમ' | 'અઘરું';
  questionTextGujarati: string;
  questionTextEnglish: string;
  keywords: string[];
  voiceEvaluationKeywords?: string[];
  mainPoints: string[];
  officialNCERTModelAnswer: string;
  alternativeAcceptableAnswers?: string[];
  commonMistakes?: string[];
  aiEvaluationRules?: Partial<AIEvaluationRules>;
  memoryTipGujarati: string;
  hintGujarati: string;
}): Question {
  const {
    id,
    standard,
    subject,
    chapterId,
    chapterNumber,
    chapterTitleGujarati,
    marks,
    difficulty,
    questionTextGujarati,
    questionTextEnglish,
    keywords,
    voiceEvaluationKeywords,
    mainPoints,
    officialNCERTModelAnswer,
    alternativeAcceptableAnswers = [],
    commonMistakes = [],
    aiEvaluationRules,
    memoryTipGujarati,
    hintGujarati,
  } = params;

  return {
    id,
    questionId: id,
    chapterId,
    chapterNumber,
    chapterTitleGujarati,
    chapterName: chapterTitleGujarati,
    standard,
    subject,
    marks,
    totalMarks: marks,
    maximumScore: 10,
    difficulty,
    questionTextGujarati,
    questionGujarati: questionTextGujarati,
    questionTextEnglish,
    keywords,
    importantKeywords: keywords,
    voiceEvaluationKeywords: voiceEvaluationKeywords || keywords,
    mainPoints,
    expectedKeyPoints: mainPoints,
    revisionTags: mainPoints,
    modelAnswer: officialNCERTModelAnswer,
    officialModelAnswer: officialNCERTModelAnswer,
    officialNCERTModelAnswer,
    alternativeAcceptableAnswers,
    alternativeAcceptedAnswers: alternativeAcceptableAnswers,
    commonMistakes,
    commonStudentMistakes: commonMistakes,
    aiEvaluationRules: {
      accuracyCheck: aiEvaluationRules?.accuracyCheck || `Check if student accurately states NCERT terms for Std ${standard} ${subject}.`,
      completenessCheck: aiEvaluationRules?.completenessCheck || `Verify coverage of all ${mainPoints.length} main NCERT key points.`,
      keywordsCheck: aiEvaluationRules?.keywordsCheck || `Match essential keywords: ${keywords.join(', ')}.`,
      conceptCheck: aiEvaluationRules?.conceptCheck || `Ensure zero scientific or conceptual errors.`,
    },
    memoryTipGujarati,
    hintGujarati,
    questionType: `${marks}_marks` as any,
  };
}
