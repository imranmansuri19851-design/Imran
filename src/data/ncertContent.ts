import { 
  ALL_QUESTION_BANK_SUBJECTS, 
  getAllQuestionBankChapters, 
  getAllQuestionBankQuestions 
} from './questionBank';

export { ALL_QUESTION_BANK_SUBJECTS as SUBJECTS };
export const CHAPTERS = getAllQuestionBankChapters();
export const QUESTIONS = getAllQuestionBankQuestions();

export * from './questionBank';
