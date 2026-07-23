import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Question, 
  Chapter, 
  Standard, 
  SubjectId, 
  TeacherProfile, 
  QuestionMarkType,
  DynamicStandard,
  DynamicSubject,
  StudentProfile,
  PracticeHistoryItem
} from '../types';
import { SUBJECTS as DEFAULT_SUBJECTS, CHAPTERS as DEFAULT_CHAPTERS } from '../data/ncertContent';
import { 
  PlusCircle, 
  BookOpen, 
  Code, 
  Trash2, 
  Edit,
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  HelpCircle, 
  Award, 
  Lightbulb, 
  Copy, 
  Check,
  UserCheck,
  FolderPlus,
  FileText,
  Download,
  Upload,
  Image as ImageIcon,
  Video,
  Volume2,
  Clock,
  FileSpreadsheet,
  ShieldAlert,
  RefreshCw,
  Eye,
  Search,
  Layers,
  Grid,
  Sliders,
  ChevronDown,
  Save,
  Zap,
  Users,
  BarChart3,
  Database,
  Paperclip,
  Music,
  Plus,
  X,
  FileUp,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { 
  saveQuestionToFirestore, 
  deleteQuestionFromFirestore, 
  saveChapterToFirestore,
  deleteChapterFromFirestore,
  bulkSaveQuestionsToFirestore,
  subscribeChapters,
  subscribeQuestions,
  subscribeStandards,
  subscribeSubjects,
  saveStandardToFirestore,
  deleteStandardFromFirestore,
  saveSubjectToFirestore,
  deleteSubjectFromFirestore,
  subscribeStudents,
  subscribePracticeHistory,
  restoreFullBackupToFirestore
} from '../services/firebaseService';
import { TeacherAnalyticsView } from './TeacherAnalyticsView';

interface TeacherModeProps {
  customQuestions: Question[];
  currentTeacher?: TeacherProfile | null;
  onAddQuestion: (newQ: Question) => void;
  onDeleteQuestion: (qId: string) => void;
  onBackToHome: () => void;
}

export const TeacherMode: React.FC<TeacherModeProps> = ({
  customQuestions,
  currentTeacher,
  onAddQuestion,
  onDeleteQuestion,
  onBackToHome,
}) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'standards' | 'subjects' | 'chapters' | 'questions' | 'students' | 'reports' | 'backup' | 'flutter'
  >('overview');

  // Firestore Real-time Collections
  const [firestoreStandards, setFirestoreStandards] = useState<DynamicStandard[]>([]);
  const [firestoreSubjects, setFirestoreSubjects] = useState<DynamicSubject[]>([]);
  const [firestoreChapters, setFirestoreChapters] = useState<Chapter[]>([]);
  const [firestoreQuestions, setFirestoreQuestions] = useState<Question[]>([]);
  const [firestoreStudents, setFirestoreStudents] = useState<StudentProfile[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistoryItem[]>([]);

  // Editing States
  const [editingStandard, setEditingStandard] = useState<DynamicStandard | null>(null);
  const [editingSubject, setEditingSubject] = useState<DynamicSubject | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // --- STANDARDS FORM STATE ---
  const [stdNumber, setStdNumber] = useState<number>(9);
  const [stdTitleGuj, setStdTitleGuj] = useState('');
  const [stdTitleEng, setStdTitleEng] = useState('');
  const [stdDesc, setStdDesc] = useState('');

  // --- SUBJECTS FORM STATE ---
  const [subIdInput, setSubIdInput] = useState('');
  const [subNameGuj, setSubNameGuj] = useState('');
  const [subNameEng, setSubNameEng] = useState('');
  const [subIcon, setSubIcon] = useState('BookOpen');
  const [subColor, setSubColor] = useState('#0284C7');

  // --- CHAPTERS FORM STATE ---
  const [chStandard, setChStandard] = useState<number>(7);
  const [chSubject, setChSubject] = useState<string>('science');
  const [chNumber, setChNumber] = useState<number>(1);
  const [chTitleGujarati, setChTitleGujarati] = useState('');
  const [chTitleEnglish, setChTitleEnglish] = useState('');
  const [chTitleHindi, setChTitleHindi] = useState('');

  // --- QUESTIONS FORM STATE ---
  const [qStandard, setQStandard] = useState<number>(7);
  const [qSubject, setQSubject] = useState<string>('science');
  const [qSelectedChapterId, setQSelectedChapterId] = useState<string>('');
  const [qTextGujarati, setQTextGujarati] = useState('');
  const [qTextEnglish, setQTextEnglish] = useState('');
  const [qTextHindi, setQTextHindi] = useState('');
  const [qTotalMarks, setQTotalMarks] = useState<number>(5);
  const [qQuestionType, setQQuestionType] = useState<
    '1_mark' | '2_marks' | '3_marks' | '4_marks' | '5_marks' | '6_marks' | 'mcq' | 'short' | 'long' | 'fill_blanks' | 'true_false'
  >('5_marks');
  const [qDifficulty, setQDifficulty] = useState<'સરળ' | 'મધ્યમ' | 'અઘરું'>('મધ્યમ');
  const [qModelAnswerInput, setQModelAnswerInput] = useState('');
  const [qKeyPointsInput, setQKeyPointsInput] = useState('');
  const [qKeywordsInput, setQKeywordsInput] = useState('');
  const [qAlternativeAnswersInput, setQAlternativeAnswersInput] = useState('');
  const [qCommonMistakesInput, setQCommonMistakesInput] = useState('');
  const [qRevisionTagsInput, setQRevisionTagsInput] = useState('');
  
  // AI Evaluation Rubric fields
  const [qRubricAccuracy, setQRubricAccuracy] = useState('');
  const [qRubricCompleteness, setQRubricCompleteness] = useState('');
  const [qRubricKeywords, setQRubricKeywords] = useState('');
  const [qRubricConcept, setQRubricConcept] = useState('');

  const [qHint1, setQHint1] = useState('');
  const [qHint2, setQHint2] = useState('');
  const [qHint3, setQHint3] = useState('');
  const [qNcertReference, setQNcertReference] = useState('NCERT GSEB Page Ref');
  const [qMarksDistribution, setQMarksDistribution] = useState('');

  // Media & Attachments (Requirement 5)
  const [qImageUrl, setQImageUrl] = useState('');
  const [qAudioUrl, setQAudioUrl] = useState('');
  const [qPdfUrl, setQPdfUrl] = useState('');
  const [qVideoUrl, setQVideoUrl] = useState('');

  // UI Feedback States
  const [formSuccessMsg, setFormSuccessMsg] = useState('');
  const [formErrMsg, setFormErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedFlutterCode, setCopiedFlutterCode] = useState(false);

  // Search & Filters
  const [searchQuestion, setSearchQuestion] = useState('');
  const [filterQStd, setFilterQStd] = useState<string>('all');
  const [filterQSub, setFilterQSub] = useState<string>('all');
  const [filterQChapter, setFilterQChapter] = useState<string>('all');
  const [filterQMarks, setFilterQMarks] = useState<string>('all');
  const [filterQDiff, setFilterQDiff] = useState<string>('all');

  const [searchStudent, setSearchStudent] = useState('');
  const [filterStudentStd, setFilterStudentStd] = useState<string>('all');

  const [searchChapter, setSearchChapter] = useState('');
  const [filterChStd, setFilterChStd] = useState<string>('all');

  // File Import / Restore Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);
  const qBankImportInputRef = useRef<HTMLInputElement>(null);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Bulk Selection & Question Bank Management States
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [bulkActionType, setBulkActionType] = useState<string>('');
  const [bulkValueMarks, setBulkValueMarks] = useState<number>(5);
  const [bulkValueDiff, setBulkValueDiff] = useState<'સરળ' | 'મધ્યમ' | 'અઘરું'>('મધ્યમ');
  const [bulkValueChapterId, setBulkValueChapterId] = useState<string>('');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Import Question Bank Report State
  const [importReport, setImportReport] = useState<{
    totalRows: number;
    importedCount: number;
    duplicateIdCount: number;
    duplicateTextCount: number;
    emptyFieldsCount: number;
    errors: string[];
  } | null>(null);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const unsubStds = subscribeStandards((stds) => setFirestoreStandards(stds));
    const unsubSubs = subscribeSubjects((subs) => setFirestoreSubjects(subs));
    const unsubChs = subscribeChapters((chs) => setFirestoreChapters(chs));
    const unsubQs = subscribeQuestions((qs) => setFirestoreQuestions(qs));
    const unsubStus = subscribeStudents((stus) => setFirestoreStudents(stus));
    const unsubHist = subscribePracticeHistory('', (hist) => setPracticeHistory(hist));

    return () => {
      unsubStds();
      unsubSubs();
      unsubChs();
      unsubQs();
      unsubStus();
      unsubHist();
    };
  }, []);

  // Combined Standards List
  const defaultStandards: DynamicStandard[] = [
    { id: 'std_6', standardNumber: 6, titleGujarati: 'ધોરણ ૬', titleEnglish: 'Class 6', active: true },
    { id: 'std_7', standardNumber: 7, titleGujarati: 'ધોરણ ૭', titleEnglish: 'Class 7', active: true },
    { id: 'std_8', standardNumber: 8, titleGujarati: 'ધોરણ ૮', titleEnglish: 'Class 8', active: true },
  ];

  const allStandards = [
    ...defaultStandards,
    ...firestoreStandards.filter(fs => !defaultStandards.some(ds => ds.id === fs.id))
  ];

  // Combined Subjects List
  const defaultSubjects: DynamicSubject[] = DEFAULT_SUBJECTS.map(s => ({
    id: s.id,
    nameGujarati: s.nameGujarati,
    nameEnglish: s.nameEnglish,
    icon: s.icon,
    color: s.color,
    bgLight: s.bgLight
  }));

  const allSubjects = [
    ...defaultSubjects,
    ...firestoreSubjects.filter(fs => !defaultSubjects.some(ds => ds.id === fs.id))
  ];

  // Combined Chapters List
  const allChapters = [
    ...DEFAULT_CHAPTERS,
    ...firestoreChapters.filter(fc => !DEFAULT_CHAPTERS.some(dc => dc.id === fc.id))
  ];

  // Combined Questions List
  const allQuestions = [
    ...firestoreQuestions,
    ...customQuestions.filter(cq => !firestoreQuestions.some(fq => fq.id === cq.id))
  ];

  // Filtered Chapters for Question Form
  const filteredChaptersForQuestionForm = allChapters.filter(
    (c) => c.standard === qStandard && c.subject === qSubject
  );

  // Auto-select first chapter if none selected
  useEffect(() => {
    if (filteredChaptersForQuestionForm.length > 0 && !qSelectedChapterId) {
      setQSelectedChapterId(filteredChaptersForQuestionForm[0].id);
    }
  }, [qStandard, qSubject, filteredChaptersForQuestionForm, qSelectedChapterId]);

  // --- ACTIONS: STANDARDS ---
  const handleSaveStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdTitleGuj.trim()) {
      alert('કૃપા કરીને ધોરણનું શીર્ષક લખો.');
      return;
    }
    setIsSubmitting(true);
    const stdObj: DynamicStandard = {
      id: editingStandard ? editingStandard.id : `std_${stdNumber}_${Date.now()}`,
      standardNumber: Number(stdNumber),
      titleGujarati: stdTitleGuj.trim(),
      titleEnglish: stdTitleEng.trim() || `Class ${stdNumber}`,
      description: stdDesc.trim() || undefined,
      active: true
    };
    try {
      await saveStandardToFirestore(stdObj);
      alert('ધોરણ Firebase Firestore માં સફળતાપૂર્વક સેવ થયું!');
      setEditingStandard(null);
      setStdTitleGuj('');
      setStdTitleEng('');
      setStdDesc('');
    } catch (err) {
      console.error('Error saving standard:', err);
      alert('ધોરણ સેવ કરવામાં ક્ષતિ આવી.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStandard = async (stdId: string) => {
    if (!confirm('શું તમે આ ધોરણ ડીલીટ કરવા માંગો છો?')) return;
    try {
      await deleteStandardFromFirestore(stdId);
      alert('ધોરણ ડીલીટ થયું.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS: SUBJECTS ---
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subNameGuj.trim()) {
      alert('કૃપા કરીને વિષયનું નામ લખો.');
      return;
    }
    setIsSubmitting(true);
    const id = editingSubject ? editingSubject.id : subIdInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || `sub_${Date.now()}`;
    const subObj: DynamicSubject = {
      id,
      nameGujarati: subNameGuj.trim(),
      nameEnglish: subNameEng.trim() || subNameGuj.trim(),
      icon: subIcon,
      color: subColor,
      bgLight: '#F0F4F9'
    };
    try {
      await saveSubjectToFirestore(subObj);
      alert('વિષય Firebase Firestore માં સેવ થયો!');
      setEditingSubject(null);
      setSubIdInput('');
      setSubNameGuj('');
      setSubNameEng('');
    } catch (err) {
      console.error('Error saving subject:', err);
      alert('વિષય સેવ કરવામાં ક્ષતિ આવી.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async (subId: string) => {
    if (!confirm('શું તમે આ વિષય ડીલીટ કરવા માંગો છો?')) return;
    try {
      await deleteSubjectFromFirestore(subId);
      alert('વિષય ડીલીટ થયો.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS: CHAPTERS ---
  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitleGujarati.trim()) {
      alert('કૃપા કરીને પ્રકરણનું શીર્ષક લખો.');
      return;
    }
    setIsSubmitting(true);
    const chObj: Chapter = {
      id: editingChapter ? editingChapter.id : `ch_custom_${Date.now()}`,
      standard: Number(chStandard) as Standard,
      subject: chSubject as SubjectId,
      chapterNumber: Number(chNumber),
      titleGujarati: chTitleGujarati.trim(),
      titleEnglish: chTitleEnglish.trim() || `Chapter ${chNumber}`,
      titleHindi: chTitleHindi.trim() || undefined,
      totalQuestions: 0,
      createdBy: currentTeacher?.email || 'Teacher',
      createdAt: editingChapter?.createdAt || new Date().toISOString()
    };
    try {
      await saveChapterToFirestore(chObj);
      alert('પ્રકરણ Firebase માં સફળતાપૂર્વક ઉમેરાઈ/અપડેટ થઈ ગયું!');
      setEditingChapter(null);
      setChTitleGujarati('');
      setChTitleEnglish('');
      setChTitleHindi('');
    } catch (err) {
      console.error(err);
      alert('પ્રકરણ સેવ કરવામાં ક્ષતિ આવી.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChapter = async (chId: string) => {
    if (!confirm('શું તમે આ પ્રકરણ ડીલીટ કરવા માંગો છો?')) return;
    try {
      await deleteChapterFromFirestore(chId);
      alert('પ્રકરણ ડીલીટ થયું.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS: QUESTIONS ---
  const handleStartEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQStandard(Number(q.standard));
    setQSubject(String(q.subject));
    setQSelectedChapterId(q.chapterId);
    setQTextGujarati(q.questionTextGujarati || '');
    setQTextEnglish(q.questionTextEnglish || '');
    setQTextHindi(q.questionTextHindi || '');
    setQTotalMarks(Number(q.totalMarks || q.marks || 5));
    setQQuestionType(q.questionType || (q.totalMarks === 1 ? '1_mark' : q.totalMarks === 6 ? '6_marks' : q.totalMarks === 5 ? '5_marks' : '3_marks'));
    setQDifficulty(q.difficulty as any || 'મધ્યમ');
    setQModelAnswerInput(q.officialNCERTModelAnswer || q.modelAnswer || '');
    setQKeyPointsInput((q.expectedKeyPoints || q.mainPoints || []).join('\n'));
    setQKeywordsInput((q.keywords || []).join(', '));
    setQAlternativeAnswersInput((q.alternativeAcceptableAnswers || q.alternativeAcceptedAnswers || []).join('\n'));
    setQCommonMistakesInput((q.commonMistakes || q.commonStudentMistakes || []).join('\n'));
    setQRevisionTagsInput((q.revisionTags || []).join(', '));
    
    setQRubricAccuracy(q.aiEvaluationRules?.accuracyCheck || '');
    setQRubricCompleteness(q.aiEvaluationRules?.completenessCheck || '');
    setQRubricKeywords(q.aiEvaluationRules?.keywordsCheck || '');
    setQRubricConcept(q.aiEvaluationRules?.conceptCheck || '');

    setQHint1(q.hint1 || q.hintGujarati || '');
    setQHint2(q.hint2 || '');
    setQHint3(q.hint3 || '');
    setQNcertReference(q.ncertReference || 'NCERT GSEB Reference');
    setQMarksDistribution(q.marksDistribution || '');
    setQImageUrl(q.imageUrl || q.diagramUrl || '');
    setQAudioUrl(q.audioUrl || '');
    setQPdfUrl(q.pdfUrl || '');
    setQVideoUrl(q.videoUrl || '');

    setActiveTab('questions');
  };

  const handleResetQuestionForm = () => {
    setEditingQuestion(null);
    setQTextGujarati('');
    setQTextEnglish('');
    setQTextHindi('');
    setQModelAnswerInput('');
    setQKeyPointsInput('');
    setQKeywordsInput('');
    setQAlternativeAnswersInput('');
    setQCommonMistakesInput('');
    setQRevisionTagsInput('');
    setQRubricAccuracy('');
    setQRubricCompleteness('');
    setQRubricKeywords('');
    setQRubricConcept('');
    setQHint1('');
    setQHint2('');
    setQHint3('');
    setQMarksDistribution('');
    setQImageUrl('');
    setQAudioUrl('');
    setQPdfUrl('');
    setQVideoUrl('');
    setFormSuccessMsg('');
    setFormErrMsg('');
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccessMsg('');
    setFormErrMsg('');

    if (!qTextGujarati.trim() || !qKeyPointsInput.trim()) {
      setFormErrMsg('કૃપા કરીને પ્રશ્ન (ગુજરાતી) અને અપેક્ષિત કી-પોઈન્ટ્સ અચૂક ઉમેરો.');
      return;
    }

    // --- DUPLICATE QUESTION VALIDATION ---
    const gujClean = qTextGujarati.trim().toLowerCase();
    const engClean = qTextEnglish.trim().toLowerCase();

    const isDuplicate = allQuestions.some((q) => {
      if (editingQuestion && q.id === editingQuestion.id) return false;
      const sameStd = Number(q.standard) === Number(qStandard);
      const sameSub = String(q.subject) === String(qSubject);
      const sameTextGuj = q.questionTextGujarati && q.questionTextGujarati.trim().toLowerCase() === gujClean;
      const sameTextEng = engClean && q.questionTextEnglish && q.questionTextEnglish.trim().toLowerCase() === engClean;
      return sameStd && sameSub && (sameTextGuj || sameTextEng);
    });

    if (isDuplicate) {
      const confirmAdd = window.confirm(
        '⚠️ સાવચેતી (Duplicate Question Warning):\nઆ સરખો પ્રશ્ન પસંદ કરેલ ધોરણ અને વિષયમાં પહેલેથી જ ઉપલબ્ધ છે.\n\nશું તમે છતાં પણ આ પ્રશ્ન ઉમેરવા માંગો છો?'
      );
      if (!confirmAdd) {
        setFormErrMsg('ડુપ્લિકેટ પ્રશ્ન ઉમેરવાનું રદ કરવામાં આવ્યું છે.');
        return;
      }
    }

    setIsSubmitting(true);

    const keyPointsArray = qKeyPointsInput
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const keywordsArray = qKeywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const altAnswersArray = qAlternativeAnswersInput
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const commonMistakesArray = qCommonMistakesInput
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const revisionTagsArray = qRevisionTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const qId = editingQuestion ? editingQuestion.id : `q_cms_${Date.now()}`;

    const aiEvaluationRules = {
      accuracyCheck: qRubricAccuracy.trim() || 'ચોક્કસ અને તથ્યાત્મક ઉત્તરની ચકાસણી.',
      completenessCheck: qRubricCompleteness.trim() || 'તમામ અપેક્ષિત મુદ્દાઓ આવરી લેવાયેલ છે કે નહીં.',
      keywordsCheck: qRubricKeywords.trim() || 'મુખ્ય વિજ્ઞાન/વિષય સંબંધિત શબ્દોની હાજરી.',
      conceptCheck: qRubricConcept.trim() || 'સંકલ્પનાત્મક સ્પષ્ટતા અને યોગ્ય રજૂઆત.'
    };

    const newQ: Question = {
      id: qId,
      questionId: qId,
      chapterId: qSelectedChapterId || `ch_custom_${Date.now()}`,
      standard: Number(qStandard) as Standard,
      subject: qSubject as SubjectId,
      questionTextGujarati: qTextGujarati.trim(),
      questionTextEnglish: qTextEnglish.trim() || 'Custom Question',
      questionTextHindi: qTextHindi.trim() || undefined,
      totalMarks: Number(qTotalMarks) as QuestionMarkType,
      marks: Number(qTotalMarks) as QuestionMarkType,
      questionType: qQuestionType,
      difficulty: qDifficulty,
      modelAnswer: qModelAnswerInput.trim() || keyPointsArray.join(' '),
      officialNCERTModelAnswer: qModelAnswerInput.trim() || keyPointsArray.join(' '),
      expectedKeyPoints: keyPointsArray,
      mainPoints: keyPointsArray,
      keywords: keywordsArray.length > 0 ? keywordsArray : ['NCERT', 'શિક્ષક પ્રશ્ન'],
      alternativeAcceptableAnswers: altAnswersArray,
      alternativeAcceptedAnswers: altAnswersArray,
      commonMistakes: commonMistakesArray,
      commonStudentMistakes: commonMistakesArray,
      revisionTags: revisionTagsArray,
      aiEvaluationRules,
      hintGujarati: qHint1.trim() || 'પ્રશ્નના મુખ્ય શબ્દો ધ્યાનથી ચકાસો.',
      hint1: qHint1.trim() || 'પ્રશ્નના મુખ્ય શબ્દો ધ્યાનથી ચકાસો.',
      hint2: qHint2.trim() || undefined,
      hint3: qHint3.trim() || undefined,
      memoryTipGujarati: 'મુખ્ય મુદ્દાઓ વારંવાર બોલીને પુનરાવર્તન કરો.',
      ncertReference: qNcertReference.trim() || 'NCERT GSEB',
      marksDistribution: qMarksDistribution.trim() || undefined,
      imageUrl: qImageUrl.trim() || undefined,
      diagramUrl: qImageUrl.trim() || undefined,
      audioUrl: qAudioUrl.trim() || undefined,
      pdfUrl: qPdfUrl.trim() || undefined,
      videoUrl: qVideoUrl.trim() || undefined,
      createdBy: currentTeacher?.email || 'Teacher',
      createdAt: editingQuestion?.createdAt || new Date().toISOString()
    };

    try {
      await saveQuestionToFirestore(newQ);
      onAddQuestion(newQ);
      setFormSuccessMsg(editingQuestion ? 'પ્રશ્ન સફળતાપૂર્વક અપડેટ થયો!' : 'નવો પ્રશ્ન Firebase માં સફળતાપૂર્વક સેવ થયો!');
      setTimeout(() => {
        handleResetQuestionForm();
      }, 1000);
    } catch (err) {
      console.error(err);
      setFormErrMsg('ફાયરબેઝમાં સેવ કરવામાં ક્ષતિ આવી.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('શું તમે ખરેખર આ પ્રશ્ન ડીલીટ કરવા માંગો છો?')) return;
    try {
      await deleteQuestionFromFirestore(qId);
      onDeleteQuestion(qId);
    } catch (err) {
      console.error(err);
      onDeleteQuestion(qId);
    }
  };

  // --- ATTACHMENT FILE UPLOAD HANDLERS ---
  const handleFileUploadToDataUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- BACKUP & RESTORE ---
  const handleExportFullBackupJSON = () => {
    const backupData = {
      standards: allStandards,
      subjects: allSubjects,
      chapters: allChapters,
      questions: allQuestions,
      exportDate: new Date().toISOString(),
      appName: 'AnswerCoach.AI - NCERT CMS'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `answercoach_full_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleRestoreFullBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackupStatus('બેકઅપ ફાઈલ પ્રોસેસ થઈ રહી છે અને Firestore માં રીસ્ટોર થઈ રહી છે...');
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        
        const res = await restoreFullBackupToFirestore(parsed);
        setBackupStatus(
          `સફળતાપૂર્વક રીસ્ટોર પૂર્ણ! ${res.standardsCount} ધોરણો, ${res.subjectsCount} વિષયો, ${res.chaptersCount} પ્રકરણો અને ${res.questionsCount} પ્રશ્નો Firestore માં અપડેટ થયા.`
        );
      } catch (err) {
        console.error('Restore error:', err);
        setBackupStatus('બેકઅપ રીસ્ટોર કરવામાં ભૂલ થઈ. કૃપા કરીને યોગ્ય JSON ફાઈલ અપલોડ કરો.');
      }
    };
    reader.readAsText(file);
  };

  // --- BULK SELECTION & QUESTION BANK IMPORT/EXPORT ---
  const handleSelectAllFilteredQuestions = () => {
    if (selectedQuestionIds.length === filteredQuestionsList.length && filteredQuestionsList.length > 0) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(filteredQuestionsList.map(q => q.id));
    }
  };

  const handleToggleSelectQuestion = (id: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleApplyBulkAction = async () => {
    if (selectedQuestionIds.length === 0) {
      alert('કૃપા કરીને પહેલા પ્રશ્નો પસંદ કરો.');
      return;
    }
    if (!bulkActionType) {
      alert('કૃપા કરીને બલ્ક એક્શન પસંદ કરો.');
      return;
    }

    setIsProcessingBulk(true);
    try {
      if (bulkActionType === 'delete') {
        if (!confirm(`શું તમે ખરેખર પસંદ કરેલા ${selectedQuestionIds.length} પ્રશ્નો ડીલીટ કરવા માંગો છો?`)) {
          setIsProcessingBulk(false);
          return;
        }
        for (const qId of selectedQuestionIds) {
          await deleteQuestionFromFirestore(qId);
          onDeleteQuestion(qId);
        }
        setSelectedQuestionIds([]);
        alert(`${selectedQuestionIds.length} પ્રશ્નો સફળતાપૂર્વક ડીલીટ કરવામાં આવ્યા.`);
      } else if (bulkActionType === 'update_marks') {
        const updatedQs = allQuestions
          .filter(q => selectedQuestionIds.includes(q.id))
          .map(q => ({
            ...q,
            totalMarks: bulkValueMarks as QuestionMarkType,
            marks: bulkValueMarks as QuestionMarkType,
            questionType: (bulkValueMarks === 1 ? '1_mark' : bulkValueMarks === 6 ? '6_marks' : bulkValueMarks === 5 ? '5_marks' : '3_marks') as any
          }));
        await bulkSaveQuestionsToFirestore(updatedQs);
        alert(`${updatedQs.length} પ્રશ્નોના ગુણ (${bulkValueMarks} ગુણ) માં અપડેટ કરવામાં આવ્યા.`);
      } else if (bulkActionType === 'update_diff') {
        const updatedQs = allQuestions
          .filter(q => selectedQuestionIds.includes(q.id))
          .map(q => ({
            ...q,
            difficulty: bulkValueDiff
          }));
        await bulkSaveQuestionsToFirestore(updatedQs);
        alert(`${updatedQs.length} પ્રશ્નોનું કાઠિન્ય કક્ષા (${bulkValueDiff}) માં અપડેટ કરવામાં આવ્યું.`);
      } else if (bulkActionType === 'update_chapter') {
        if (!bulkValueChapterId) {
          alert('કૃપા કરીને પ્રકરણ પસંદ કરો.');
          setIsProcessingBulk(false);
          return;
        }
        const updatedQs = allQuestions
          .filter(q => selectedQuestionIds.includes(q.id))
          .map(q => ({
            ...q,
            chapterId: bulkValueChapterId
          }));
        await bulkSaveQuestionsToFirestore(updatedQs);
        alert(`${updatedQs.length} પ્રશ્નોનું પ્રકરણ અપડેટ કરવામાં આવ્યું.`);
      } else if (bulkActionType === 'export_xlsx') {
        const targetQs = allQuestions.filter(q => selectedQuestionIds.includes(q.id));
        handleExportQuestions('xlsx', targetQs);
      } else if (bulkActionType === 'export_csv') {
        const targetQs = allQuestions.filter(q => selectedQuestionIds.includes(q.id));
        handleExportQuestions('csv', targetQs);
      } else if (bulkActionType === 'export_json') {
        const targetQs = allQuestions.filter(q => selectedQuestionIds.includes(q.id));
        handleExportQuestions('json', targetQs);
      }
    } catch (err) {
      console.error('Error applying bulk action:', err);
      alert('બલ્ક એક્શન એક્ઝિક્યુટ કરવામાં ભૂલ થઈ.');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // --- QUESTION BANK EXPORT ---
  const handleExportQuestions = (format: 'xlsx' | 'csv' | 'json', targetQuestions?: Question[]) => {
    const listToExport = targetQuestions || filteredQuestionsList;
    if (listToExport.length === 0) {
      alert('નિકાસ માટે કોઈ પ્રશ્ન ઉપલબ્ધ નથી.');
      return;
    }

    const rows = listToExport.map((q, idx) => ({
      'Question ID': q.id,
      'Standard': q.standard,
      'Subject': q.subject,
      'Chapter ID': q.chapterId,
      'Chapter Name': q.chapterTitleGujarati || q.chapterName || '',
      'Question': q.questionTextGujarati,
      'English Question': q.questionTextEnglish || '',
      'Marks': q.totalMarks || q.marks || 5,
      'Difficulty': q.difficulty || 'મધ્યમ',
      'Model Answer': q.officialNCERTModelAnswer || q.modelAnswer || '',
      'Key Points': (q.expectedKeyPoints || q.mainPoints || []).join('\n'),
      'Accepted Answers': (q.alternativeAcceptableAnswers || q.alternativeAcceptedAnswers || []).join('\n'),
      'Rubric Accuracy': q.aiEvaluationRules?.accuracyCheck || '',
      'Rubric Completeness': q.aiEvaluationRules?.completenessCheck || '',
      'Rubric Keywords': q.aiEvaluationRules?.keywordsCheck || '',
      'Rubric Concept': q.aiEvaluationRules?.conceptCheck || '',
      'Hint 1': q.hint1 || q.hintGujarati || '',
      'Hint 2': q.hint2 || '',
      'Hint 3': q.hint3 || '',
      'Common Mistakes': (q.commonMistakes || q.commonStudentMistakes || []).join('\n'),
      'Revision Tags': (q.revisionTags || []).join(', '),
      'NCERT Ref': q.ncertReference || ''
    }));

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rows, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `question_bank_export_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'QuestionBank');

      if (format === 'csv') {
        XLSX.writeFile(workbook, `question_bank_export_${Date.now()}.csv`, { bookType: 'csv' });
      } else {
        XLSX.writeFile(workbook, `question_bank_export_${Date.now()}.xlsx`, { bookType: 'xlsx' });
      }
    }
  };

  // --- SAMPLE TEMPLATE DOWNLOAD ---
  const handleDownloadQuestionTemplate = (format: 'xlsx' | 'csv' | 'json') => {
    const sampleRows = [
      {
        'Question ID': 'q_sample_101',
        'Standard': 7,
        'Subject': 'science',
        'Chapter ID': 'ch_std7_science_1',
        'Chapter Name': 'વનસ્પતિમાં પોષણ',
        'Question': 'પ્રકાશસંશ્લેષણ એટલે શું? વનસ્પતિમાં તેની પ્રક્રિયા સમજાવો.',
        'English Question': 'What is photosynthesis? Explain the process in plants.',
        'Marks': 5,
        'Difficulty': 'મધ્યમ',
        'Model Answer': 'લીલી વનસ્પતિ સૂર્યપ્રકાશ, પાણી અને કાર્બન ડાયોક્સાઈડનો ઉપયોગ કરીને હરિતદ્રવ્યની મદદથી ગ્લુકોઝ અને ઓક્સિજન બનાવે છે.',
        'Key Points': 'હરિતદ્રવ્ય અને સૂર્યપ્રકાશની હાજરી\nકાર્બન ડાયોક્સાઈડ અને પાણીનો ઉપયોગ\nગ્લુકોઝનું નિર્માણ અને ઓક્સિજન વાયુ મુક્ત થવો',
        'Accepted Answers': 'વનસ્પતિ દ્વારા સૂર્યપ્રકાશમાં ખોરાક બનાવવાની પ્રક્રિયા\nPhotosynthesis process in green plants',
        'Rubric Accuracy': 'તથ્યાત્મક અને વ્યાખ્યાત્મક ચોકસાઈ',
        'Rubric Completeness': 'તમામ ૩ તબક્કાઓનો સમાવેશ',
        'Rubric Keywords': 'હરિતદ્રવ્ય, પ્રકાશસંશ્લેષણ, ગ્લુકોઝ',
        'Rubric Concept': 'સૂર્યપ્રકાશ શક્તિનું રાસાયણિક શક્તિમાં રૂપાંતરણ',
        'Hint 1': 'સૂર્યપ્રકાશ અને લીલા પાંદડા વિચારો.',
        'Hint 2': 'હરિતદ્રવ્ય કયો વાયુ મુક્ત કરે છે?',
        'Hint 3': 'સમીકરણ: CO2 + H2O -> Glucose + O2',
        'Common Mistakes': 'ઓક્સિજન વાયુ લેવામાં આવે છે તેવી ગેરસમજ',
        'Revision Tags': 'પ્રકાશસંશ્લેષણ, વનસ્પતિ, IMP, NCERT',
        'NCERT Ref': 'NCERT Std 7 Science Ch 1'
      }
    ];

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sampleRows, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `question_bank_sample_template.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      const worksheet = XLSX.utils.json_to_sheet(sampleRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SampleTemplate');
      if (format === 'csv') {
        XLSX.writeFile(workbook, `question_bank_sample_template.csv`, { bookType: 'csv' });
      } else {
        XLSX.writeFile(workbook, `question_bank_sample_template.xlsx`, { bookType: 'xlsx' });
      }
    }
  };

  // --- QUESTION BANK IMPORT FROM EXCEL/CSV/JSON WITH VALIDATION ---
  const handleImportQuestionBank = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setImportReport(null);

    const fileName = file.name.toLowerCase();
    const isJson = fileName.endsWith('.json');

    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        let rawRows: any[] = [];
        if (isJson) {
          const text = evt.target?.result as string;
          const parsed = JSON.parse(text);
          rawRows = Array.isArray(parsed) ? parsed : parsed.questions || [parsed];
        } else {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rawRows = XLSX.utils.sheet_to_json(worksheet);
        }

        if (rawRows.length === 0) {
          alert('ફાઈલ ખાલી છે અથવા કોઈ રેકોર્ડ મળ્યો નથી.');
          setIsSubmitting(false);
          return;
        }

        const validQuestions: Question[] = [];
        const errors: string[] = [];
        let duplicateIdCount = 0;
        let duplicateTextCount = 0;
        let emptyFieldsCount = 0;

        const existingIdsSet = new Set(allQuestions.map(q => q.id));
        const existingTextsSet = new Set(
          allQuestions.map(q => `${q.standard}_${q.subject}_${(q.questionTextGujarati || q.questionTextEnglish || '').trim().toLowerCase()}`)
        );

        for (let i = 0; i < rawRows.length; i++) {
          const row = rawRows[i];
          const rowNum = i + 1;

          const qTextGuj = String(row['Question'] || row['questionTextGujarati'] || row['questionGujarati'] || row['પ્રશ્ન'] || '').trim();
          const qTextEng = String(row['English Question'] || row['questionTextEnglish'] || row['questionEnglish'] || '').trim();
          const std = Number(row['Standard'] || row['standard'] || 7);
          const sub = String(row['Subject'] || row['subject'] || 'science').trim().toLowerCase();

          // Validation 1: Required Fields
          if (!qTextGuj && !qTextEng) {
            emptyFieldsCount++;
            errors.push(`રો ${rowNum}: પ્રશ્નનું લખાણ ખાલી છે.`);
            continue;
          }

          const modelAns = String(row['Model Answer'] || row['officialNCERTModelAnswer'] || row['modelAnswer'] || '').trim();
          const keyPointsRaw = String(row['Key Points'] || row['expectedKeyPoints'] || '').trim();

          if (!modelAns && !keyPointsRaw) {
            emptyFieldsCount++;
            errors.push(`રો ${rowNum}: મોડેલ આન્સર અથવા કી-પોઈન્ટ્સ ખાલી છે.`);
            continue;
          }

          // Validation 2: Duplicate Question ID Check
          let qId = String(row['Question ID'] || row['id'] || row['questionId'] || `q_imp_${Date.now()}_${i}`).trim();
          if (existingIdsSet.has(qId)) {
            duplicateIdCount++;
            errors.push(`રો ${rowNum}: ડુપ્લિકેટ Question ID (${qId}) સ્કીપ કરવામાં આવ્યો.`);
            continue;
          }

          // Validation 3: Duplicate Question Text Check
          const textKey = `${std}_${sub}_${(qTextGuj || qTextEng).toLowerCase()}`;
          if (existingTextsSet.has(textKey)) {
            duplicateTextCount++;
            errors.push(`રો ${rowNum}: ધોરણ ${std} ${sub} માં આ પ્રશ્ન પહેલેથી અસ્તિત્વ ધરાવે છે.`);
            continue;
          }

          // Format parsing
          const keyPointsArr = keyPointsRaw ? keyPointsRaw.split(/\n|,/).map(s => s.trim()).filter(Boolean) : [modelAns];
          const altAnsArr = String(row['Accepted Answers'] || row['alternativeAcceptableAnswers'] || '').split(/\n/).map(s => s.trim()).filter(Boolean);
          const commonMistakesArr = String(row['Common Mistakes'] || row['commonMistakes'] || '').split(/\n/).map(s => s.trim()).filter(Boolean);
          const revisionTagsArr = String(row['Revision Tags'] || row['revisionTags'] || '').split(/,/).map(s => s.trim()).filter(Boolean);

          const marks = Number(row['Marks'] || row['totalMarks'] || 5) as QuestionMarkType;
          const marksNum = [1, 2, 3, 4, 5, 6].includes(marks) ? marks : 5;

          const questionObj: Question = {
            id: qId,
            questionId: qId,
            standard: std,
            subject: sub,
            chapterId: String(row['Chapter ID'] || row['chapterId'] || `ch_custom_${std}_${sub}`),
            chapterNumber: Number(row['Chapter Number'] || row['chapterNumber'] || 1),
            chapterName: String(row['Chapter Name'] || row['chapterName'] || 'NCERT Chapter'),
            questionTextGujarati: qTextGuj || qTextEng,
            questionTextEnglish: qTextEng || qTextGuj,
            totalMarks: marksNum,
            marks: marksNum,
            questionType: (marksNum === 1 ? '1_mark' : marksNum === 6 ? '6_marks' : marksNum === 5 ? '5_marks' : '3_marks') as any,
            difficulty: (row['Difficulty'] || row['difficulty'] || 'મધ્યમ') as any,
            modelAnswer: modelAns || keyPointsArr.join(' '),
            officialNCERTModelAnswer: modelAns || keyPointsArr.join(' '),
            expectedKeyPoints: keyPointsArr,
            mainPoints: keyPointsArr,
            keywords: revisionTagsArr.length > 0 ? revisionTagsArr : ['NCERT', 'ઇમ્પોર્ટ'],
            alternativeAcceptableAnswers: altAnsArr,
            alternativeAcceptedAnswers: altAnsArr,
            commonMistakes: commonMistakesArr,
            commonStudentMistakes: commonMistakesArr,
            revisionTags: revisionTagsArr,
            aiEvaluationRules: {
              accuracyCheck: String(row['Rubric Accuracy'] || 'ચોક્કસ અને તથ્યાત્મક ઉત્તર.'),
              completenessCheck: String(row['Rubric Completeness'] || 'તમામ અપેક્ષિત મુદ્દાઓ.'),
              keywordsCheck: String(row['Rubric Keywords'] || 'મુખ્ય પારિભાષિક શબ્દો.'),
              conceptCheck: String(row['Rubric Concept'] || 'સંકલ્પનાત્મક સ્પષ્ટતા.')
            },
            hint1: String(row['Hint 1'] || row['hint1'] || 'પ્રશ્ન ધ્યાનથી વાંચો.'),
            hintGujarati: String(row['Hint 1'] || row['hint1'] || 'પ્રશ્ન ધ્યાનથી વાંચો.'),
            hint2: String(row['Hint 2'] || row['hint2'] || ''),
            hint3: String(row['Hint 3'] || row['hint3'] || ''),
            memoryTipGujarati: 'મુખ્ય મુદ્દાઓ વારંવાર ચકાસો.',
            ncertReference: String(row['NCERT Ref'] || row['ncertReference'] || 'NCERT GSEB'),
            createdBy: currentTeacher?.email || 'Teacher Import',
            createdAt: new Date().toISOString()
          };

          validQuestions.push(questionObj);
          existingIdsSet.add(qId);
          existingTextsSet.add(textKey);
        }

        if (validQuestions.length > 0) {
          await bulkSaveQuestionsToFirestore(validQuestions);
          validQuestions.forEach(q => onAddQuestion(q));
        }

        setImportReport({
          totalRows: rawRows.length,
          importedCount: validQuestions.length,
          duplicateIdCount,
          duplicateTextCount,
          emptyFieldsCount,
          errors
        });

      } catch (err) {
        console.error('Error importing question bank:', err);
        alert('ફાઈલ ઈમ્પોર્ટ કરવામાં ક્ષતિ આવી. કૃપા કરીને ફાઈલનો ફોર્મેટ ચકાસો.');
      } finally {
        setIsSubmitting(false);
        if (e.target) e.target.value = '';
      }
    };

    if (isJson) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  // Filtered Questions List
  const filteredQuestionsList = allQuestions.filter((q) => {
    if (filterQStd !== 'all' && Number(q.standard) !== Number(filterQStd)) return false;
    if (filterQSub !== 'all' && String(q.subject) !== filterQSub) return false;
    if (filterQChapter !== 'all' && String(q.chapterId) !== filterQChapter) return false;
    if (filterQMarks !== 'all' && Number(q.totalMarks || q.marks) !== Number(filterQMarks)) return false;
    if (filterQDiff !== 'all' && q.difficulty !== filterQDiff) return false;
    if (searchQuestion.trim()) {
      const term = searchQuestion.toLowerCase();
      const matchGuj = q.questionTextGujarati?.toLowerCase().includes(term);
      const matchEng = q.questionTextEnglish?.toLowerCase().includes(term);
      const matchKw = q.keywords?.some(k => k.toLowerCase().includes(term));
      const matchAns = q.modelAnswer?.toLowerCase().includes(term) || q.officialNCERTModelAnswer?.toLowerCase().includes(term);
      if (!matchGuj && !matchEng && !matchKw && !matchAns) return false;
    }
    return true;
  });

  // Filtered Students List
  const filteredStudentsList = firestoreStudents.filter((st) => {
    if (filterStudentStd !== 'all' && Number(st.standard) !== Number(filterStudentStd)) return false;
    if (searchStudent.trim()) {
      const term = searchStudent.toLowerCase();
      const matchName = st.name?.toLowerCase().includes(term);
      const matchSchool = st.school?.toLowerCase().includes(term);
      if (!matchName && !matchSchool) return false;
    }
    return true;
  });

  const flutterCodeSnippet = `import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

void main() {
  runApp(const TeacherAdminApp());
}

class TeacherAdminApp extends StatelessWidget {
  const TeacherAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AnswerCoach AI - Teacher Admin Panel',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF0061A4),
      ),
      home: const TeacherDashboardScreen(),
    );
  }
}

class TeacherDashboardScreen extends StatelessWidget {
  const TeacherDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('NCERT Teacher CMS (Firestore)')),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection('questions').snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
          final docs = snapshot.data!.docs;
          return ListView.builder(
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final data = docs[index].data() as Map<String, dynamic>;
              return ListTile(
                title: Text(data['questionTextGujarati'] ?? ''),
                subtitle: Text('Std \${data['standard']} • \${data['subject']} • \${data['totalMarks']} Marks'),
              );
            },
          );
        },
      ),
    );
  }
}
`;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto animate-fadeIn" id="teacher-admin-panel-root">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A1C1E] hover:text-[#0061A4] bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-[#C4C6D0]/40 transition-all hover:bg-[#F0F4F9]"
          id="teacher-mode-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#0061A4]" />
          <span>મુખ્ય પૃષ્ઠ (Home)</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#001D36] bg-[#D1E4FF] border border-[#0061A4]/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <UserCheck className="w-4 h-4 text-[#0061A4]" />
            શિક્ષક: {currentTeacher?.name || 'ઈમરાન મન્સૂરી'}
          </span>
          <span className="text-[11px] font-black bg-[#FFD941] text-[#241E00] px-3 py-1.5 rounded-full border border-amber-300">
            PIN લૉગઇન્ડ 🔐
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-[#0061A4] via-[#004F87] to-slate-900 text-white shadow-xl border border-[#0061A4]/30 space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D1E4FF] text-[#001D36] text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#0061A4]" />
          શિક્ષક એડમિન કંટ્રોલ પેનલ (Teacher Admin Panel)
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          ધોરણો, વિષયો, પ્રકરણો, પ્રશ્ન બેંક, વિદ્યાર્થીઓ અને રિપોર્ટ્સ મેનેજ કરો 📝
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-3xl leading-relaxed">
          આ પેનલ દ્વારા કોઈપણ ફેરફાર સીધો Firebase Firestore માં સેવ થાય છે અને વિદ્યાર્થીઓના મોબાઈલ એપમાં રિયલ-ટાઇમમાં ઓટોમેટિક અપડેટ થઈ જાય છે.
        </p>
      </div>

      {/* Material 3 Responsive Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white rounded-2xl p-2 shadow-sm border border-[#C4C6D0]/30 scrollbar-none">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-overview"
        >
          <Grid className="w-4 h-4" />
          <span>ઓવરવ્યૂ (Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab('standards')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'standards'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-standards"
        >
          <Layers className="w-4 h-4" />
          <span>૧. ધોરણો ({allStandards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'subjects'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-subjects"
        >
          <BookOpen className="w-4 h-4" />
          <span>૨. વિષયો ({allSubjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chapters')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'chapters'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-chapters"
        >
          <FolderPlus className="w-4 h-4" />
          <span>૩. પ્રકરણો ({allChapters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-questions"
        >
          <PlusCircle className="w-4 h-4" />
          <span>૪. પ્રશ્ન બેંક ({allQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'students'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-students"
        >
          <Users className="w-4 h-4" />
          <span>૫. વિદ્યાર્થીઓ ({firestoreStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-reports"
        >
          <BarChart3 className="w-4 h-4" />
          <span>૬. રિપોર્ટ્સ (Reports)</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'backup'
              ? 'bg-[#0061A4] text-white shadow-md font-black'
              : 'text-[#44474E] hover:bg-[#F0F4F9]'
          }`}
          id="teacher-tab-backup"
        >
          <Database className="w-4 h-4" />
          <span>૭. બેકઅપ & રીસ્ટોર</span>
        </button>

      </div>

      {/* SECTION 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            
            <div className="bg-white rounded-[24px] p-4 border border-[#C4C6D0]/30 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#44474E] uppercase">ધોરણો</span>
              <div className="text-2xl font-black text-[#0061A4] flex items-baseline justify-between">
                <span>{allStandards.length}</span>
                <Layers className="w-4 h-4 text-[#0061A4]" />
              </div>
              <p className="text-[10px] text-emerald-700 font-bold">Firestore Active</p>
            </div>

            <div className="bg-white rounded-[24px] p-4 border border-[#C4C6D0]/30 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#44474E] uppercase">વિષયો</span>
              <div className="text-2xl font-black text-[#7D00B3] flex items-baseline justify-between">
                <span>{allSubjects.length}</span>
                <BookOpen className="w-4 h-4 text-[#7D00B3]" />
              </div>
              <p className="text-[10px] text-purple-700 font-bold">NCERT Subjects</p>
            </div>

            <div className="bg-white rounded-[24px] p-4 border border-[#C4C6D0]/30 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#44474E] uppercase">પ્રકરણો</span>
              <div className="text-2xl font-black text-[#006D32] flex items-baseline justify-between">
                <span>{allChapters.length}</span>
                <FolderPlus className="w-4 h-4 text-[#006D32]" />
              </div>
              <p className="text-[10px] text-emerald-800 font-bold">Chapters Sync</p>
            </div>

            <div className="bg-white rounded-[24px] p-4 border border-[#C4C6D0]/30 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#44474E] uppercase">પ્રશ્ન બેંક</span>
              <div className="text-2xl font-black text-[#0061A4] flex items-baseline justify-between">
                <span>{allQuestions.length}</span>
                <FileText className="w-4 h-4 text-[#0061A4]" />
              </div>
              <p className="text-[10px] text-[#0061A4] font-bold">૧ થી ૫ માર્ક્સ</p>
            </div>

            <div className="bg-white rounded-[24px] p-4 border border-[#C4C6D0]/30 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#44474E] uppercase">વિદ્યાર્થીઓ</span>
              <div className="text-2xl font-black text-amber-600 flex items-baseline justify-between">
                <span>{firestoreStudents.length || 1}</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-[10px] text-amber-700 font-bold">નોંધાયેલ પ્રોફાઈલ</p>
            </div>

            <div className="bg-white rounded-[24px] p-4 border border-[#C4C6D0]/30 shadow-sm space-y-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">કુલ પ્રેક્ટિસ</span>
              <div className="text-2xl font-black text-emerald-900 flex items-baseline justify-between">
                <span>{practiceHistory.length}</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[10px] text-emerald-700 font-bold">AI મૂલ્યાંકન રેકોર્ડ</p>
            </div>

          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            <h3 className="font-extrabold text-[#1A1C1E] text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0061A4]" />
              <span>ઝડપી મેનેજમેન્ટ શોર્ટકટ્સ (Quick Shortcuts):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('standards')}
                className="p-4 bg-[#F0F4F9] hover:bg-[#E1E2EC] rounded-2xl font-bold text-xs text-[#0061A4] border border-[#C4C6D0]/40 flex items-center justify-between"
              >
                <span>+ ધોરણો ઉમેરો / બદલો</span>
                <Layers className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('subjects')}
                className="p-4 bg-[#F0F4F9] hover:bg-[#E1E2EC] rounded-2xl font-bold text-xs text-[#7D00B3] border border-[#C4C6D0]/40 flex items-center justify-between"
              >
                <span>+ વિષયો ઉમેરો / બદલો</span>
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('chapters')}
                className="p-4 bg-[#F0F4F9] hover:bg-[#E1E2EC] rounded-2xl font-bold text-xs text-[#006D32] border border-[#C4C6D0]/40 flex items-center justify-between"
              >
                <span>+ પ્રકરણો ઉમેરો / બદલો</span>
                <FolderPlus className="w-4 h-4" />
              </button>

              <button
                onClick={() => { handleResetQuestionForm(); setActiveTab('questions'); }}
                className="p-4 bg-[#0061A4] text-white rounded-2xl font-bold text-xs shadow-md hover:bg-[#004B80] flex items-center justify-between"
              >
                <span>+ નવો પ્રશ્ન ઉમેરો</span>
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: STANDARDS MANAGEMENT */}
      {activeTab === 'standards' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Add Standard Form */}
          <form onSubmit={handleSaveStandard} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            <h3 className="font-extrabold text-base text-[#1A1C1E] border-b border-[#C4C6D0]/30 pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0061A4]" />
              <span>{editingStandard ? 'ધોરણ એડિટ કરો' : 'નવું ધોરણ ઉમેરો (Add Standard)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">ધોરણ નંબર (Std Number):</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={12}
                  value={stdNumber}
                  onChange={(e) => setStdNumber(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">શીર્ષક (ગુજરાતી): *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. ધોરણ ૯ (Standard 9)"
                  value={stdTitleGuj}
                  onChange={(e) => setStdTitleGuj(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">Title (English):</label>
                <input
                  type="text"
                  placeholder="e.g. Class 9"
                  value={stdTitleEng}
                  onChange={(e) => setStdTitleEng(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-medium text-[#1A1C1E]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {editingStandard && (
                <button
                  type="button"
                  onClick={() => { setEditingStandard(null); setStdTitleGuj(''); setStdTitleEng(''); }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-bold"
                >
                  રદ કરો
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#0061A4] hover:bg-[#004B80] text-white rounded-xl text-xs font-black shadow"
              >
                {editingStandard ? 'અપડેટ કરો' : 'ધોરણ Firebase માં ઉમેરો (Save Standard)'}
              </button>
            </div>
          </form>

          {/* Existing Standards List */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            <h4 className="font-extrabold text-sm text-[#1A1C1E]">ઉપલબ્ધ ધોરણો (Active Standards List):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {allStandards.map((st) => (
                <div key={st.id} className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-sm text-[#0061A4]">{st.titleGujarati}</h5>
                    <p className="text-xs text-[#44474E] font-medium">{st.titleEnglish}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingStandard(st);
                        setStdNumber(st.standardNumber);
                        setStdTitleGuj(st.titleGujarati);
                        setStdTitleEng(st.titleEnglish);
                      }}
                      className="p-1.5 text-[#0061A4] hover:bg-blue-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStandard(st.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: SUBJECTS MANAGEMENT */}
      {activeTab === 'subjects' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Add Subject Form */}
          <form onSubmit={handleSaveSubject} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            <h3 className="font-extrabold text-base text-[#1A1C1E] border-b border-[#C4C6D0]/30 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#7D00B3]" />
              <span>{editingSubject ? 'વિષય એડિટ કરો' : 'નવો વિષય ઉમેરો (Add Subject)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">વિષય નામ (ગુજરાતી): *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. અંગ્રેજી / સામાજિક વિજ્ઞાન"
                  value={subNameGuj}
                  onChange={(e) => setSubNameGuj(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">Subject Name (English):</label>
                <input
                  type="text"
                  placeholder="e.g. English / Social Science"
                  value={subNameEng}
                  onChange={(e) => setSubNameEng(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-medium text-[#1A1C1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">વિષય કલર (Theme Color):</label>
                <input
                  type="color"
                  value={subColor}
                  onChange={(e) => setSubColor(e.target.value)}
                  className="w-full h-10 rounded-2xl cursor-pointer border border-[#C4C6D0]/40 p-1 bg-[#F0F4F9]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {editingSubject && (
                <button
                  type="button"
                  onClick={() => { setEditingSubject(null); setSubNameGuj(''); setSubNameEng(''); }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-bold"
                >
                  રદ કરો
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#7D00B3] hover:bg-[#5C008A] text-white rounded-xl text-xs font-black shadow"
              >
                {editingSubject ? 'અપડેટ કરો' : 'વિષય Firebase માં ઉમેરો (Save Subject)'}
              </button>
            </div>
          </form>

          {/* Existing Subjects List */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            <h4 className="font-extrabold text-sm text-[#1A1C1E]">ઉપલબ્ધ વિષયો (Active Subjects List):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {allSubjects.map((sb) => (
                <div key={sb.id} className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sb.color || '#0061A4' }} />
                    <div>
                      <h5 className="font-black text-xs text-[#1A1C1E]">{sb.nameGujarati}</h5>
                      <p className="text-[10px] text-[#44474E]">{sb.nameEnglish}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingSubject(sb);
                        setSubNameGuj(sb.nameGujarati);
                        setSubNameEng(sb.nameEnglish);
                        setSubColor(sb.color || '#0284C7');
                      }}
                      className="p-1 text-[#0061A4] hover:bg-blue-100 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(sb.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 4: CHAPTERS MANAGEMENT */}
      {activeTab === 'chapters' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Add / Edit Chapter Form */}
          <form onSubmit={handleSaveChapter} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            <h3 className="font-extrabold text-base text-[#1A1C1E] border-b border-[#C4C6D0]/30 pb-3 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#006D32]" />
              <span>{editingChapter ? 'પ્રકરણ એડિટ કરો' : '૩. નવું NCERT પ્રકરણ ઉમેરો (Add Chapter)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">ધોરણ (Standard):</label>
                <select
                  value={chStandard}
                  onChange={(e) => setChStandard(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                >
                  {allStandards.map(s => (
                    <option key={s.id} value={s.standardNumber}>{s.titleGujarati}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">વિષય (Subject):</label>
                <select
                  value={chSubject}
                  onChange={(e) => setChSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                >
                  {allSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.nameGujarati}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">પ્રકરણ નંબર (Chapter Number):</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={chNumber}
                  onChange={(e) => setChNumber(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1A1C1E]">પ્રકરણનું નામ (ગુજરાતી): *</label>
              <input
                type="text"
                required
                placeholder="દા.ત. વનસ્પતિમાં પોષણ"
                value={chTitleGujarati}
                onChange={(e) => setChTitleGujarati(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {editingChapter && (
                <button
                  type="button"
                  onClick={() => { setEditingChapter(null); setChTitleGujarati(''); setChTitleEnglish(''); }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-bold"
                >
                  રદ કરો
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#006D32] hover:bg-[#005225] text-white rounded-xl text-xs font-black shadow"
              >
                {editingChapter ? 'અપડેટ કરો' : 'પ્રકરણ Firebase માં ઉમેરો (Save Chapter)'}
              </button>
            </div>
          </form>

          {/* Filter & Chapters List */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-extrabold text-sm text-[#1A1C1E]">ઉપલબ્ધ પ્રકરણો (Chapters List):</h4>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="પ્રકરણ શોધો..."
                  value={searchChapter}
                  onChange={(e) => setSearchChapter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                />
                <select
                  value={filterChStd}
                  onChange={(e) => setFilterChStd(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                >
                  <option value="all">તમામ ધોરણ</option>
                  {allStandards.map(s => (
                    <option key={s.id} value={s.standardNumber}>{s.titleGujarati}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allChapters
                .filter(ch => {
                  if (filterChStd !== 'all' && Number(ch.standard) !== Number(filterChStd)) return false;
                  if (searchChapter.trim() && !ch.titleGujarati?.toLowerCase().includes(searchChapter.toLowerCase())) return false;
                  return true;
                })
                .map((ch) => (
                  <div key={ch.id} className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase text-[#0061A4] bg-[#D1E4FF] px-2 py-0.5 rounded-full">
                        Std {ch.standard} • {ch.subject}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingChapter(ch);
                            setChStandard(Number(ch.standard));
                            setChSubject(String(ch.subject));
                            setChNumber(ch.chapterNumber);
                            setChTitleGujarati(ch.titleGujarati);
                            setChTitleEnglish(ch.titleEnglish || '');
                          }}
                          className="p-1 text-[#0061A4]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(ch.id)}
                          className="p-1 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h5 className="font-bold text-xs text-[#1A1C1E]">
                      પાઠ {ch.chapterNumber}: {ch.titleGujarati}
                    </h5>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 5: QUESTIONS MANAGEMENT (Full Requirements: Text, Type, Marks, Diff, Model Answer, KeyPoints, Keywords, Hints 1-3, NCERT Ref, Attachments) */}
      {activeTab === 'questions' && (
        <div className="space-y-6 animate-fadeIn">

          {/* Top Question Bank Import / Export & Sample Templates Bar */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-[#004B80] to-[#0061A4] rounded-[32px] text-white shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">વર્ઝન 1.0 ક્વેશ્ચન બેંક મેનેજમેન્ટ શક્તિ</span>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                  <span>પ્રશ્ન બેંક ઇમ્પોર્ટ, એક્સપોર્ટ & સેમ્પલ ટેમ્પલેટ ફોર્મેટ</span>
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={qBankImportInputRef}
                  accept=".xlsx, .xls, .csv, .json"
                  className="hidden"
                  onChange={handleImportQuestionBank}
                />
                <button
                  type="button"
                  onClick={() => qBankImportInputRef.current?.click()}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 border border-emerald-300"
                  id="import-qbank-btn"
                >
                  <FileUp className="w-4 h-4" />
                  <span>પ્રશ્ન બેંક ઇમ્પોર્ટ કરો (.xlsx / .csv / .json)</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold pt-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-100">સેમ્પલ ટેમ્પલેટ ડાઉનલોડ કરો:</span>
                <button
                  type="button"
                  onClick={() => handleDownloadQuestionTemplate('xlsx')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 flex items-center gap-1 text-[11px]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadQuestionTemplate('csv')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 flex items-center gap-1 text-[11px]"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-300" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadQuestionTemplate('json')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 flex items-center gap-1 text-[11px]"
                >
                  <Code className="w-3.5 h-3.5 text-amber-300" />
                  <span>JSON</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blue-100">ફિલ્ટર થયેલ પ્રશ્ન બેંક એક્સપોર્ટ કરો:</span>
                <button
                  type="button"
                  onClick={() => handleExportQuestions('xlsx')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel નિકાસ ({filteredQuestionsList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportQuestions('csv')}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportQuestions('json')}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-sm flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* Import Validation Report Modal/Banner */}
          {importReport && (
            <div className="p-6 bg-white rounded-[32px] border-2 border-[#0061A4] shadow-lg space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#C4C6D0]/30 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-[#006D32]" />
                  <h4 className="font-black text-base text-[#1A1C1E]">
                    ઇમ્પોર્ટ ચકાસણી રિપોર્ટ (Import Validation Summary)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setImportReport(null)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/30">
                  <span className="text-[10px] font-bold text-gray-600 block">કુલ રો (Rows)</span>
                  <span className="text-lg font-black text-gray-900">{importReport.totalRows}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 block">સફળતાપૂર્વક ઉમેરાયા</span>
                  <span className="text-lg font-black text-emerald-700">{importReport.importedCount}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 block">ડુપ્લિકેટ ID સ્કીપ</span>
                  <span className="text-lg font-black text-amber-700">{importReport.duplicateIdCount}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 block">ડુપ્લિકેટ પ્રશ્ન સ્કીપ</span>
                  <span className="text-lg font-black text-amber-700">{importReport.duplicateTextCount}</span>
                </div>
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200">
                  <span className="text-[10px] font-bold text-red-800 block">ખાલી ફિલ્ડ ભૂલો</span>
                  <span className="text-lg font-black text-red-700">{importReport.emptyFieldsCount}</span>
                </div>
              </div>

              {importReport.errors.length > 0 && (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1.5 max-h-40 overflow-y-auto text-xs font-medium text-amber-900">
                  <span className="font-bold block text-amber-950">વર્ણનાત્મક વોનિંગ અને એરર લોગ:</span>
                  {importReport.errors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Question Creation / Editing Form */}
          <form onSubmit={handleSaveQuestion} className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#C4C6D0]/30 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#C4C6D0]/30 pb-3">
              <div>
                <h3 className="text-lg font-black text-[#1A1C1E]">
                  {editingQuestion ? 'પ્રશ્ન એડિટ અને અપડેટ કરો (Edit Question) ✏️' : '૪. નવો NCERT પ્રશ્ન ઉમેરો (Add Question) 📝'}
                </h3>
                <p className="text-xs text-[#44474E] font-medium">
                  પ્રશ્ન, ટાઈપ, ગુણ, કાઠિન્ય, મોડેલ આન્સર, કી-પોઈન્ટ્સ, હિન્ટ્સ ૧-૩ અને મીડિયા અટેચમેન્ટ્સ ઉમેરો.
                </p>
              </div>
              {editingQuestion && (
                <button
                  type="button"
                  onClick={handleResetQuestionForm}
                  className="text-xs font-bold text-[#BA1A1A] hover:underline"
                >
                  રદ કરો (Cancel)
                </button>
              )}
            </div>

            {formSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{formSuccessMsg}</span>
              </div>
            )}

            {formErrMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                <span>{formErrMsg}</span>
              </div>
            )}

            {/* Row 1: Standard, Subject, Question Type, Marks, Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">ધોરણ (Standard):</label>
                <select
                  value={qStandard}
                  onChange={(e) => setQStandard(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                >
                  {allStandards.map(s => (
                    <option key={s.id} value={s.standardNumber}>{s.titleGujarati}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">વિષય (Subject):</label>
                <select
                  value={qSubject}
                  onChange={(e) => setQSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                >
                  {allSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.nameGujarati}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">પ્રશ્ન પ્રકાર (Type):</label>
                <select
                  value={qQuestionType}
                  onChange={(e) => setQQuestionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                >
                  <option value="5_marks">૫ ગુણ લાંબો પ્રશ્ન</option>
                  <option value="3_marks">૩ ગુણ પ્રશ્ન</option>
                  <option value="2_marks">૨ ગુણ ટૂંકો પ્રશ્ન</option>
                  <option value="1_mark">૧ ગુણ ટૂંકો પ્રશ્ન</option>
                  <option value="mcq">MCQ વિકલ્પ</option>
                  <option value="fill_blanks">ખાલી જગ્યા પૂરો</option>
                  <option value="true_false">ખરા-ખોટા</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">કુલ ગુણ (Marks):</label>
                <select
                  value={qTotalMarks}
                  onChange={(e) => setQTotalMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                >
                  <option value={1}>૧ ગુણ</option>
                  <option value={2}>૨ ગુણ</option>
                  <option value={3}>૩ ગુણ</option>
                  <option value={4}>૪ ગુણ</option>
                  <option value={5}>૫ ગુણ</option>
                  <option value={6}>૬ ગુણ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">કાઠિન્ય મૂલ્ય (Difficulty):</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                >
                  <option value="સરળ">સરળ (Easy)</option>
                  <option value="મધ્યમ">મધ્યમ (Medium)</option>
                  <option value="અઘરું">અઘરું (Hard)</option>
                </select>
              </div>
            </div>

            {/* Chapter Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1A1C1E]">પ્રકરણ પસંદ કરો (Select Chapter):</label>
              <select
                value={qSelectedChapterId}
                onChange={(e) => setQSelectedChapterId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
              >
                {filteredChaptersForQuestionForm.map((c) => (
                  <option key={c.id} value={c.id}>
                    પ્રકરણ {c.chapterNumber}: {c.titleGujarati} ({c.titleEnglish})
                  </option>
                ))}
              </select>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E]">પ્રશ્ન લખાણ (ગુજરાતી) *</label>
                <textarea
                  required
                  rows={2}
                  value={qTextGujarati}
                  onChange={(e) => setQTextGujarati(e.target.value)}
                  placeholder="દા.ત. વનસ્પતિમાં પ્રકાશસંશ્લેષણની પ્રક્રિયા આકૃતિ સાથે સમજાવો."
                  className="w-full p-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Question in English"
                  value={qTextEnglish}
                  onChange={(e) => setQTextEnglish(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                />
                <input
                  type="text"
                  placeholder="प्रश्न हिन्दी में"
                  value={qTextHindi}
                  onChange={(e) => setQTextHindi(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                />
              </div>
            </div>

            {/* Model Answer & Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#C4C6D0]/30 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0061A4]" />
                  <span>સંપૂર્ણ મોડેલ આન્સર (NCERT Model Answer):</span>
                </label>
                <textarea
                  rows={4}
                  value={qModelAnswerInput}
                  onChange={(e) => setQModelAnswerInput(e.target.value)}
                  placeholder="સંપૂર્ણ આદર્શ ઉત્તર પેરાગ્રાફમાં લખો..."
                  className="w-full p-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006D32]" />
                  <span>અપેક્ષિત કી-પોઈન્ટ્સ (Key Points - નવી લીટીમાં) *</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={qKeyPointsInput}
                  onChange={(e) => setQKeyPointsInput(e.target.value)}
                  placeholder="મુદ્દો ૧: પર્ણરંધ્ર દ્વારા CO2 મેળવે છે.&#10;મુદ્દો ૨: ક્લોરોફિલ સૂર્યશક્તિ શોષે છે."
                  className="w-full p-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                />
              </div>
            </div>

            {/* Accepted Alternative Answers & Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#C4C6D0]/30 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E] flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#7D00B3]" />
                  <span>સ્વીકાર્ય વૈકલ્પિક ઉત્તરો (Accepted Alternative Answers - નવી લીટીમાં):</span>
                </label>
                <textarea
                  rows={3}
                  value={qAlternativeAnswersInput}
                  onChange={(e) => setQAlternativeAnswersInput(e.target.value)}
                  placeholder="વૈકલ્પિક ઉત્તર ૧&#10;વૈકલ્પિક ઉત્તર ૨"
                  className="w-full p-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1C1E] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#BA1A1A]" />
                  <span>વિદ્યાર્થીઓની સામાન્ય ભૂલો (Common Student Mistakes - નવી લીટીમાં):</span>
                </label>
                <textarea
                  rows={3}
                  value={qCommonMistakesInput}
                  onChange={(e) => setQCommonMistakesInput(e.target.value)}
                  placeholder="ભૂલ ૧: CO2 અને O2 વચ્ચે મૂંઝવણ&#10;ભૂલ ૨: સમીકરણ અપૂર્ણ લખવું"
                  className="w-full p-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                />
              </div>
            </div>

            {/* AI Evaluation Rubric Criteria */}
            <div className="space-y-3 border-t border-[#C4C6D0]/30 pt-4">
              <h4 className="text-xs font-black uppercase text-[#0061A4] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#0061A4]" />
                <span>AI મૂલ્યાંકન રુબ્રિક નિયમો (AI Evaluation Rubric Rules):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">ચોકસાઈ ચકાસણી (Accuracy):</label>
                  <input
                    type="text"
                    placeholder="દા.ત. તથ્યાત્મક સાચાઈ"
                    value={qRubricAccuracy}
                    onChange={(e) => setQRubricAccuracy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">પરિપૂર્ણતા (Completeness):</label>
                  <input
                    type="text"
                    placeholder="દા.ત. તમામ મુદ્દાઓની હાજરી"
                    value={qRubricCompleteness}
                    onChange={(e) => setQRubricCompleteness(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">કીવર્ડઝ (Keywords Match):</label>
                  <input
                    type="text"
                    placeholder="દા.ત. મુખ્ય વૈજ્ઞાનિક શબ્દો"
                    value={qRubricKeywords}
                    onChange={(e) => setQRubricKeywords(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">સંકલ્પના (Concept Check):</label>
                  <input
                    type="text"
                    placeholder="દા.ત. સિદ્ધાંતની સ્પષ્ટતા"
                    value={qRubricConcept}
                    onChange={(e) => setQRubricConcept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                  />
                </div>
              </div>
            </div>

            {/* Requirement 4: Hints 1, 2, 3, Keywords & NCERT Reference */}
            <div className="space-y-3 border-t border-[#C4C6D0]/30 pt-4">
              <h4 className="text-xs font-black uppercase text-[#0061A4]">માર્ગદર્શક હિન્ટ્સ (Hints 1, 2, 3) & NCERT Reference:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">💡 હિન્ટ ૧ (Attempt 1 Hint):</label>
                  <input
                    type="text"
                    placeholder="પ્રકાશ અને પર્ણનો ઉલ્લેખ કરો"
                    value={qHint1}
                    onChange={(e) => setQHint1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">💡 હિન્ટ ૨ (Attempt 2 Hint):</label>
                  <input
                    type="text"
                    placeholder="હરિતદ્રવ્ય અને ઓક્સિજન મુક્તિ દર્શાવો"
                    value={qHint2}
                    onChange={(e) => setQHint2(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">💡 હિન્ટ ૩ (Attempt 3 Hint):</label>
                  <input
                    type="text"
                    placeholder="સંપૂર્ણ સમીકરણ યાદ કરો"
                    value={qHint3}
                    onChange={(e) => setQHint3(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">મુખ્ય કીવર્ડ્સ (Comma separated):</label>
                  <input
                    type="text"
                    placeholder="હરિતદ્રવ્ય, પર્ણરંધ્ર, ગ્લુકોઝ"
                    value={qKeywordsInput}
                    onChange={(e) => setQKeywordsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">પુનરાવર્તન ટેગ્સ (Revision Tags):</label>
                  <input
                    type="text"
                    placeholder="પ્રકાશસંશ્લેષણ, વનસ્પતિ, IMP, 2026"
                    value={qRevisionTagsInput}
                    onChange={(e) => setQRevisionTagsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1C1E]">NCERT સંદર્ભ (NCERT Reference):</label>
                  <input
                    type="text"
                    placeholder="NCERT Class 7 Science Ch 1, p. 12"
                    value={qNcertReference}
                    onChange={(e) => setQNcertReference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F4F9] border border-[#C4C6D0]/40 text-xs text-[#1A1C1E]"
                  />
                </div>
              </div>
            </div>

            {/* Requirement 5: Support Image, Audio, and PDF Attachments */}
            <div className="space-y-3 border-t border-[#C4C6D0]/30 pt-4">
              <h4 className="text-xs font-black uppercase text-[#0061A4] flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-[#0061A4]" />
                <span>મીડિયા અને ડાયાગ્રામ અટેચમેન્ટ્સ (Image, Audio, PDF Uploads):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Image Upload / URL */}
                <div className="p-3 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 space-y-2">
                  <span className="text-[11px] font-bold text-[#1A1C1E] flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0061A4]" />
                    <span>૧. ઇમેજ / ડાયાગ્રામ (Image)</span>
                  </span>
                  <input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={qImageUrl}
                    onChange={(e) => setQImageUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white border border-gray-300"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-[#0061A4] text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-[#004F87]">
                      ફાઈલ અપલોડ કરો
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUploadToDataUrl(e, setQImageUrl)}
                      />
                    </label>
                    {qImageUrl && (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> જોડાયેલ
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio Upload / URL */}
                <div className="p-3 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 space-y-2">
                  <span className="text-[11px] font-bold text-[#1A1C1E] flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#7D00B3]" />
                    <span>૨. ઓડિયો ફાઈલ (Audio)</span>
                  </span>
                  <input
                    type="url"
                    placeholder="https://example.com/audio.mp3"
                    value={qAudioUrl}
                    onChange={(e) => setQAudioUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white border border-gray-300"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-[#7D00B3] text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-[#5C008A]">
                      ફાઈલ અપલોડ કરો
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileUploadToDataUrl(e, setQAudioUrl)}
                      />
                    </label>
                    {qAudioUrl && (
                      <span className="text-[10px] text-purple-700 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> જોડાયેલ
                      </span>
                    )}
                  </div>
                </div>

                {/* PDF Upload / URL */}
                <div className="p-3 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 space-y-2">
                  <span className="text-[11px] font-bold text-[#1A1C1E] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#006D32]" />
                    <span>૩. PDF અભ્યાસ પત્રક (PDF Study Doc)</span>
                  </span>
                  <input
                    type="url"
                    placeholder="https://example.com/notes.pdf"
                    value={qPdfUrl}
                    onChange={(e) => setQPdfUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white border border-gray-300"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-[#006D32] text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-[#005225]">
                      ફાઈલ અપલોડ કરો
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleFileUploadToDataUrl(e, setQPdfUrl)}
                      />
                    </label>
                    {qPdfUrl && (
                      <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> જોડાયેલ
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Save Question Submit */}
            <div className="pt-2 flex justify-end gap-3">
              {editingQuestion && (
                <button
                  type="button"
                  onClick={handleResetQuestionForm}
                  className="px-5 py-3 bg-gray-200 text-gray-800 font-bold text-xs rounded-2xl"
                >
                  રદ કરો
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#0061A4] hover:bg-[#004B80] text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-2"
                id="save-question-btn"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'સેવ થઈ રહ્યું છે...' : (editingQuestion ? 'પ્રશ્ન અપડેટ કરો' : 'પ્રશ્ન Firebase માં સેવ કરો (Save)')}</span>
              </button>
            </div>

          </form>

          {/* Search & Multi-Filter List of Questions */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-extrabold text-base text-[#1A1C1E]">
                પ્રશ્ન બેંક યાદી ({filteredQuestionsList.length} પ્રશ્નો):
              </h4>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="પ્રશ્ન અથવા કીવર્ડ શોધો..."
                  value={searchQuestion}
                  onChange={(e) => setSearchQuestion(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                />

                <select
                  value={filterQStd}
                  onChange={(e) => setFilterQStd(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                >
                  <option value="all">તમામ ધોરણ</option>
                  {allStandards.map(s => (
                    <option key={s.id} value={s.standardNumber}>{s.titleGujarati}</option>
                  ))}
                </select>

                <select
                  value={filterQSub}
                  onChange={(e) => setFilterQSub(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                >
                  <option value="all">તમામ વિષય</option>
                  {allSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.nameGujarati}</option>
                  ))}
                </select>

                <select
                  value={filterQChapter}
                  onChange={(e) => setFilterQChapter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40 max-w-[150px] truncate"
                >
                  <option value="all">તમામ પ્રકરણ</option>
                  {allChapters.map(c => (
                    <option key={c.id} value={c.id}>Ch {c.chapterNumber}: {c.titleGujarati}</option>
                  ))}
                </select>

                <select
                  value={filterQMarks}
                  onChange={(e) => setFilterQMarks(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                >
                  <option value="all">તમામ ગુણ</option>
                  <option value="1">૧ ગુણ</option>
                  <option value="2">૨ ગુણ</option>
                  <option value="3">૩ ગુણ</option>
                  <option value="4">૪ ગુણ</option>
                  <option value="5">૫ ગુણ</option>
                  <option value="6">૬ ગુણ</option>
                </select>

                <select
                  value={filterQDiff}
                  onChange={(e) => setFilterQDiff(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                >
                  <option value="all">તમામ કાઠિન્ય</option>
                  <option value="સરળ">સરળ</option>
                  <option value="મધ્યમ">મધ્યમ</option>
                  <option value="અઘરું">અઘરું</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions Controls Bar */}
            <div className="p-4 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-[#1A1C1E]">
                  <input
                    type="checkbox"
                    checked={selectedQuestionIds.length === filteredQuestionsList.length && filteredQuestionsList.length > 0}
                    onChange={handleSelectAllFilteredQuestions}
                    className="w-4 h-4 rounded text-[#0061A4] focus:ring-[#0061A4]"
                  />
                  <span>તમામ પસંદ કરો ({filteredQuestionsList.length})</span>
                </label>

                {selectedQuestionIds.length > 0 && (
                  <span className="text-xs font-extrabold bg-[#0061A4] text-white px-2.5 py-0.5 rounded-full">
                    {selectedQuestionIds.length} પ્રશ્નો પસંદ કર્યા
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={bulkActionType}
                  onChange={(e) => setBulkActionType(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/50"
                >
                  <option value="">-- બલ્ક એક્શન પસંદ કરો --</option>
                  <option value="update_marks">ગુણ બદલો (Update Marks)</option>
                  <option value="update_diff">કાઠિન્ય બદલો (Update Difficulty)</option>
                  <option value="update_chapter">પ્રકરણ બદલો (Update Chapter)</option>
                  <option value="delete">પસંદ કરેલા ડીલીટ કરો (Delete Selected)</option>
                  <option value="export_xlsx">પસંદ કરેલા Excel માં નિકાસ</option>
                  <option value="export_csv">પસંદ કરેલા CSV માં નિકાસ</option>
                  <option value="export_json">પસંદ કરેલા JSON માં નિકાસ</option>
                </select>

                {bulkActionType === 'update_marks' && (
                  <select
                    value={bulkValueMarks}
                    onChange={(e) => setBulkValueMarks(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl bg-white text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/50"
                  >
                    <option value={1}>૧ ગુણ</option>
                    <option value={2}>૨ ગુણ</option>
                    <option value={3}>૩ ગુણ</option>
                    <option value={4}>૪ ગુણ</option>
                    <option value={5}>૫ ગુણ</option>
                    <option value={6}>૬ ગુણ</option>
                  </select>
                )}

                {bulkActionType === 'update_diff' && (
                  <select
                    value={bulkValueDiff}
                    onChange={(e) => setBulkValueDiff(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-white text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/50"
                  >
                    <option value="સરળ">સરળ</option>
                    <option value="મધ્યમ">મધ્યમ</option>
                    <option value="અઘરું">અઘરું</option>
                  </select>
                )}

                {bulkActionType === 'update_chapter' && (
                  <select
                    value={bulkValueChapterId}
                    onChange={(e) => setBulkValueChapterId(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/50 max-w-[180px] truncate"
                  >
                    <option value="">-- પ્રકરણ પસંદ કરો --</option>
                    {allChapters.map(c => (
                      <option key={c.id} value={c.id}>Ch {c.chapterNumber}: {c.titleGujarati}</option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={handleApplyBulkAction}
                  disabled={isProcessingBulk || selectedQuestionIds.length === 0}
                  className="px-4 py-2 bg-[#0061A4] hover:bg-[#004B80] disabled:bg-gray-300 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                  id="apply-bulk-action-btn"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isProcessingBulk ? 'પ્રોસેસ...' : 'બલ્ક અપડેટ કરો'}</span>
                </button>
              </div>
            </div>

            {/* Questions Grid Cards */}
            <div className="space-y-3">
              {filteredQuestionsList.map((q, idx) => (
                <div key={q.id} className={`p-5 bg-[#F0F4F9] rounded-[24px] border space-y-3 transition-all ${selectedQuestionIds.includes(q.id) ? 'border-[#0061A4] ring-2 ring-[#0061A4]/30 bg-blue-50/40' : 'border-[#C4C6D0]/40 hover:border-[#0061A4]/50'}`}>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C4C6D0]/30 pb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedQuestionIds.includes(q.id)}
                        onChange={() => handleToggleSelectQuestion(q.id)}
                        className="w-4 h-4 rounded text-[#0061A4] focus:ring-[#0061A4] cursor-pointer"
                      />
                      <span className="text-[10px] font-black text-[#001D36] bg-[#D1E4FF] px-2.5 py-0.5 rounded-full">
                        Std {q.standard} • {q.subject}
                      </span>
                      <span className="text-[10px] font-black text-[#241E00] bg-[#FFD941] px-2.5 py-0.5 rounded-full">
                        {q.totalMarks} ગુણ ({q.difficulty || 'મધ્યમ'})
                      </span>
                      {q.imageUrl && <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">📷 Image</span>}
                      {q.audioUrl && <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">🔊 Audio</span>}
                      {q.pdfUrl && <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">📄 PDF</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEditQuestion(q)}
                        className="px-3 py-1 bg-[#D1E4FF] text-[#0061A4] hover:bg-[#0061A4] hover:text-white rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>એડિટ</span>
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-[#1A1C1E] text-sm">
                      {idx + 1}. {q.questionTextGujarati}
                    </h5>
                    {q.ncertReference && (
                      <p className="text-[11px] text-[#44474E] italic mt-0.5">
                        સંદર્ભ: {q.ncertReference}
                      </p>
                    )}
                  </div>

                  {/* Hints Preview */}
                  <div className="p-3 bg-white rounded-2xl border border-[#C4C6D0]/30 text-xs space-y-1">
                    <span className="font-bold text-[#0061A4] block">અપેક્ષિત મુદ્દાઓ & હિન્ટ્સ:</span>
                    <p className="text-[#1A1C1E] font-medium">• {q.expectedKeyPoints?.join(' • ')}</p>
                    {q.hint1 && <p className="text-amber-800 text-[11px] font-bold pt-1">💡 હિન્ટ ૧: {q.hint1}</p>}
                  </div>

                </div>
              ))}

              {filteredQuestionsList.length === 0 && (
                <div className="p-8 text-center text-gray-500 font-bold text-xs bg-[#F0F4F9] rounded-2xl">
                  કોઈ પ્રશ્નો મળ્યા નહીં. નવો પ્રશ્ન ઉમેરો.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SECTION 6: STUDENTS MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#C4C6D0]/30 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C4C6D0]/30 pb-3">
              <div>
                <h3 className="font-black text-lg text-[#1A1C1E]">
                  ૫. નોંધાયેલા વિદ્યાર્થીઓ અને પ્રગતિ ચકાસણી ({filteredStudentsList.length})
                </h3>
                <p className="text-xs text-[#44474E] font-medium">
                  તમામ વિદ્યાર્થીઓના દૈનિક જવાબો, ગુણ અને પ્રગતિ ચકાસો.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="વિદ્યાર્થી અથવા શાળા શોધો..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                />

                <select
                  value={filterStudentStd}
                  onChange={(e) => setFilterStudentStd(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F0F4F9] text-xs font-bold text-[#1A1C1E] border border-[#C4C6D0]/40"
                >
                  <option value="all">તમામ ધોરણ</option>
                  {allStandards.map(s => (
                    <option key={s.id} value={s.standardNumber}>{s.titleGujarati}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F0F4F9] text-[#1A1C1E] font-black rounded-xl">
                  <tr>
                    <th className="p-3">વિદ્યાર્થીનું નામ</th>
                    <th className="p-3">ધોરણ</th>
                    <th className="p-3">શાળા</th>
                    <th className="p-3">પ્લાન</th>
                    <th className="p-3">કુલ પ્રશ્નો</th>
                    <th className="p-3">કુલ ગુણ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#1A1C1E]">
                  {filteredStudentsList.map((st, idx) => (
                    <tr key={st.id || idx} className="hover:bg-[#F0F4F9]">
                      <td className="p-3 font-bold flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#0061A4]" />
                        <span>{st.name}</span>
                      </td>
                      <td className="p-3">Std {st.standard} ({st.medium || 'Gujarati'})</td>
                      <td className="p-3">{st.school}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          {st.plan || 'PREMIUM'}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{st.totalQuestionsAnswered || 0}</td>
                      <td className="p-3 font-bold text-[#0061A4]">{st.totalMarksEarned || 0}</td>
                    </tr>
                  ))}

                  {filteredStudentsList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 font-bold">
                        હજુ સુધી કોઈ વિદ્યાર્થી મળ્યા નથી.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 7: REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fadeIn">
          <TeacherAnalyticsView
            students={firestoreStudents}
            history={practiceHistory}
            chapters={allChapters}
            questions={allQuestions}
          />
        </div>
      )}

      {/* SECTION 8: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#C4C6D0]/30 space-y-6">
            <div className="space-y-1 border-b border-[#C4C6D0]/30 pb-3">
              <h3 className="text-lg font-black text-[#1A1C1E] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#0061A4]" />
                <span>૭. ડેટાબેઝ બેકઅપ અને રીસ્ટોર (Backup & Restore System) 💾</span>
              </h3>
              <p className="text-xs text-[#44474E] font-medium">
                તમામ ધોરણો, વિષયો, પ્રકરણો અને પ્રશ્ન બેંકનો સંપૂર્ણ JSON બેકઅપ ડાઉનલોડ કરો અથવા રીસ્ટોર કરો.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Backup Card */}
              <div className="p-6 bg-[#F0F4F9] rounded-[28px] border border-[#C4C6D0]/40 space-y-4">
                <div>
                  <span className="text-xs font-black uppercase text-[#0061A4]">૧-ક્લિક બેકઅપ</span>
                  <h4 className="font-black text-base text-[#1A1C1E] mt-1">સંપૂર્ણ ડેટાબેઝ ડાઉનલોડ કરો</h4>
                  <p className="text-xs text-[#44474E] font-medium mt-1">
                    તમામ {allStandards.length} ધોરણો, {allSubjects.length} વિષયો, {allChapters.length} પ્રકરણો અને {allQuestions.length} પ્રશ્નો JSON ફાઈલમાં સેવ કરો.
                  </p>
                </div>

                <button
                  onClick={handleExportFullBackupJSON}
                  className="w-full py-3.5 px-4 bg-[#0061A4] hover:bg-[#004B80] text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>સંપૂર્ણ JSON બેકઅપ ડાઉનલોડ કરો (.json)</span>
                </button>
              </div>

              {/* Restore Card */}
              <div className="p-6 bg-[#F0F4F9] rounded-[28px] border border-[#C4C6D0]/40 space-y-4">
                <div>
                  <span className="text-xs font-black uppercase text-[#006D32]">બેકઅપ રીસ્ટોર</span>
                  <h4 className="font-black text-base text-[#1A1C1E] mt-1">બેકઅપ ફાઈલ અપલોડ કરી રીસ્ટોર કરો</h4>
                  <p className="text-xs text-[#44474E] font-medium mt-1">
                    JSON ફાઈલ પસંદ કરી સીધા Firebase Firestore માં તમામ ડેટા રીસ્ટોર/અપડેટ કરો.
                  </p>
                </div>

                <input
                  type="file"
                  ref={backupInputRef}
                  accept=".json"
                  className="hidden"
                  onChange={handleRestoreFullBackup}
                />

                <button
                  onClick={() => backupInputRef.current?.click()}
                  className="w-full py-3.5 px-4 bg-[#241E00] hover:bg-black text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 border border-amber-300/30"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>ફાઈલ પસંદ કરી રીસ્ટોર કરો (Restore Data)</span>
                </button>

                {backupStatus && (
                  <div className="p-3.5 bg-white rounded-2xl border border-[#C4C6D0]/40 text-xs font-bold text-[#1A1C1E] animate-fadeIn">
                    {backupStatus}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SECTION 9: FLUTTER CODE SNIPPET */}
      {activeTab === 'flutter' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#C4C6D0]/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#C4C6D0]/30 pb-3">
            <div>
              <h3 className="font-black text-lg text-[#1A1C1E]">
                Flutter Android / iOS એપ કોડ સ્નિપેટ
              </h3>
              <p className="text-xs text-[#44474E] font-semibold">
                આ એપ્લિકેશન માટેનો મોબાઈલ ક્લાયન્ટ કોડ
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(flutterCodeSnippet);
                setCopiedFlutterCode(true);
                setTimeout(() => setCopiedFlutterCode(false), 2000);
              }}
              className="px-4 py-2 bg-[#0061A4] text-white rounded-xl text-xs font-bold hover:bg-[#004B80] flex items-center gap-1.5"
            >
              {copiedFlutterCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFlutterCode ? 'કોપી થયું!' : 'કોડ કોપી કરો'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#1E1E1E] text-green-400 font-mono text-xs rounded-2xl overflow-x-auto h-96">
            {flutterCodeSnippet}
          </pre>
        </div>
      )}

    </div>
  );
};
