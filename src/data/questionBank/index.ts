import { Chapter, Question, QuestionMarkType, Standard, SubjectId, SubjectInfo } from '../../types';
import { ALL_NCERT_SUBJECTS } from './subjects';
import { STD_6_CHAPTERS, STD_6_QUESTIONS } from './std6Questions';
import { STD_7_CHAPTERS, STD_7_QUESTIONS } from './std7Questions';
import { STD_8_CHAPTERS, STD_8_QUESTIONS } from './std8Questions';
import { QuestionBankFilter } from './types';

// In-memory master stores
let masterChaptersStore: Chapter[] = [
  ...STD_6_CHAPTERS,
  ...STD_7_CHAPTERS,
  ...STD_8_CHAPTERS,
];

let masterQuestionsStore: Question[] = [
  ...STD_6_QUESTIONS,
  ...STD_7_QUESTIONS,
  ...STD_8_QUESTIONS,
];

export const ALL_QUESTION_BANK_SUBJECTS: SubjectInfo[] = ALL_NCERT_SUBJECTS;

/**
 * Get all active chapters in the Question Bank
 */
export function getAllQuestionBankChapters(): Chapter[] {
  return masterChaptersStore;
}

/**
 * Get all active questions in the Question Bank
 */
export function getAllQuestionBankQuestions(): Question[] {
  return masterQuestionsStore;
}

/**
 * Filter questions by standard, subject, chapterId, or mark category (1-6 marks)
 */
export function getQuestionsByFilter(filter: QuestionBankFilter): Question[] {
  return masterQuestionsStore.filter(q => {
    if (filter.standard && Number(q.standard) !== Number(filter.standard)) return false;
    if (filter.subject && q.subject !== filter.subject) return false;
    if (filter.chapterId && q.chapterId !== filter.chapterId) return false;
    if (filter.marksCategory && Number(q.marks || q.totalMarks) !== Number(filter.marksCategory)) return false;
    return true;
  });
}

/**
 * Get chapters for a given standard and subject
 */
export function getChaptersBySubject(standard: Standard | number, subject: SubjectId | string): Chapter[] {
  return masterChaptersStore.filter(ch => Number(ch.standard) === Number(standard) && ch.subject === subject);
}

/**
 * Add a new chapter and its associated questions dynamically (scalable one-by-one addition)
 */
export function addChapterToQuestionBank(chapter: Chapter, questions: Question[]): void {
  const existingChapterIdx = masterChaptersStore.findIndex(ch => ch.id === chapter.id);
  if (existingChapterIdx >= 0) {
    masterChaptersStore[existingChapterIdx] = { ...masterChaptersStore[existingChapterIdx], ...chapter };
  } else {
    masterChaptersStore.push(chapter);
  }

  questions.forEach(newQ => {
    const existingQIdx = masterQuestionsStore.findIndex(q => q.id === newQ.id);
    if (existingQIdx >= 0) {
      masterQuestionsStore[existingQIdx] = { ...masterQuestionsStore[existingQIdx], ...newQ };
    } else {
      masterQuestionsStore.push(newQ);
    }
  });
}

/**
 * Search the question bank by text query (Gujarati/English/Hindi keywords or text)
 */
export function searchQuestionBank(query: string): Question[] {
  if (!query || query.trim().length === 0) return masterQuestionsStore;
  const qLower = query.toLowerCase().trim();
  return masterQuestionsStore.filter(q => 
    q.questionTextGujarati.toLowerCase().includes(qLower) ||
    q.questionTextEnglish.toLowerCase().includes(qLower) ||
    (q.keywords && q.keywords.some(k => k.toLowerCase().includes(qLower))) ||
    (q.chapterTitleGujarati && q.chapterTitleGujarati.toLowerCase().includes(qLower))
  );
}
