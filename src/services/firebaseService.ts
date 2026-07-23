import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  StudentProfile, 
  TeacherProfile, 
  Chapter, 
  Question, 
  PracticeHistoryItem,
  Standard,
  SubjectId,
  DynamicStandard,
  DynamicSubject,
  SpacedRepetitionItem,
  AILearningPlan,
  AppNotification,
  AIChatMessage
} from '../types';

// Collections
const COLLECTION_STUDENTS = 'students';
const COLLECTION_TEACHERS = 'teachers';
const COLLECTION_STANDARDS = 'standards';
const COLLECTION_SUBJECTS = 'subjects';
const COLLECTION_CHAPTERS = 'chapters';
const COLLECTION_QUESTIONS = 'questions';
const COLLECTION_PRACTICE = 'practice_history';
const COLLECTION_SPACED_REPETITION = 'spaced_repetition';
const COLLECTION_AI_PLANS = 'ai_learning_plans';
const COLLECTION_NOTIFICATIONS = 'notifications';
const COLLECTION_AI_CHAT = 'ai_teacher_chats';


// --- STANDARDS ---

export async function saveStandardToFirestore(std: DynamicStandard): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_STANDARDS, std.id), std, { merge: true });
  } catch (err) {
    console.error('Error saving standard to Firestore:', err);
    throw err;
  }
}

export async function deleteStandardFromFirestore(stdId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_STANDARDS, stdId));
  } catch (err) {
    console.error('Error deleting standard from Firestore:', err);
    throw err;
  }
}

export function subscribeStandards(callback: (standards: DynamicStandard[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_STANDARDS));
    return onSnapshot(q, (snapshot) => {
      const list: DynamicStandard[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as DynamicStandard);
      });
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for standards:', error);
    });
  } catch (e) {
    console.error('Error subscribing to standards:', e);
    return () => {};
  }
}

// --- SUBJECTS ---

export async function saveSubjectToFirestore(sub: DynamicSubject): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_SUBJECTS, sub.id), sub, { merge: true });
  } catch (err) {
    console.error('Error saving subject to Firestore:', err);
    throw err;
  }
}

export async function deleteSubjectFromFirestore(subId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_SUBJECTS, subId));
  } catch (err) {
    console.error('Error deleting subject from Firestore:', err);
    throw err;
  }
}

export function subscribeSubjects(callback: (subjects: DynamicSubject[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_SUBJECTS));
    return onSnapshot(q, (snapshot) => {
      const list: DynamicSubject[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as DynamicSubject);
      });
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for subjects:', error);
    });
  } catch (e) {
    console.error('Error subscribing to subjects:', e);
    return () => {};
  }
}

// --- STUDENT PROFILES ---

export async function saveStudentProfileToFirestore(profile: StudentProfile): Promise<string> {
  try {
    const studentId = profile.id || profile.email || `std_${Date.now()}`;
    const profileToSave: StudentProfile = {
      ...profile,
      id: studentId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, COLLECTION_STUDENTS, studentId), profileToSave, { merge: true });
    return studentId;
  } catch (err) {
    console.error('Error saving student profile to Firestore:', err);
    return profile.id || 'local_student';
  }
}

export async function getStudentProfileFromFirestore(studentId: string): Promise<StudentProfile | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION_STUDENTS, studentId));
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching student profile:', err);
    return null;
  }
}

export function subscribeStudents(callback: (students: StudentProfile[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_STUDENTS));
    return onSnapshot(q, (snapshot) => {
      const list: StudentProfile[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as StudentProfile);
      });
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for students:', error);
    });
  } catch (e) {
    console.error('Error subscribing to students:', e);
    return () => {};
  }
}

// --- TEACHERS ---

export async function saveTeacherToFirestore(teacher: TeacherProfile): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_TEACHERS, teacher.id), teacher, { merge: true });
  } catch (err) {
    console.error('Error saving teacher to Firestore:', err);
  }
}

export async function getTeacherFromFirestore(teacherId: string): Promise<TeacherProfile | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION_TEACHERS, teacherId));
    if (snap.exists()) {
      return snap.data() as TeacherProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching teacher:', err);
    return null;
  }
}

// --- CHAPTERS ---

export async function saveChapterToFirestore(chapter: Chapter): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_CHAPTERS, chapter.id), {
      ...chapter,
      createdAt: chapter.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving chapter to Firestore:', err);
    throw err;
  }
}

export function subscribeChapters(callback: (chapters: Chapter[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_CHAPTERS));
    return onSnapshot(q, (snapshot) => {
      const list: Chapter[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Chapter);
      });
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for chapters:', error);
    });
  } catch (e) {
    console.error('Error subscribing to chapters:', e);
    return () => {};
  }
}

// --- QUESTIONS ---

export async function saveQuestionToFirestore(question: Question): Promise<void> {
  try {
    const now = new Date().toISOString();
    await setDoc(doc(db, COLLECTION_QUESTIONS, question.id), {
      ...question,
      createdAt: question.createdAt || now,
      lastUpdated: now,
      status: question.status || 'Approved'
    }, { merge: true });
  } catch (err) {
    console.error('Error saving question to Firestore:', err);
    throw err;
  }
}

export async function deleteQuestionFromFirestore(questionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_QUESTIONS, questionId));
  } catch (err) {
    console.error('Error deleting question from Firestore:', err);
    throw err;
  }
}

export async function bulkSaveQuestionsToFirestore(questions: Question[]): Promise<void> {
  try {
    const batchSize = 450;
    const now = new Date().toISOString();
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = questions.slice(i, i + batchSize);
      for (const q of chunk) {
        const qRef = doc(db, COLLECTION_QUESTIONS, q.id);
        batch.set(qRef, {
          ...q,
          createdAt: q.createdAt || now,
          lastUpdated: now,
          status: q.status || 'Approved'
        }, { merge: true });
      }
      await batch.commit();
    }
  } catch (err) {
    console.error('Error batch saving questions to Firestore:', err);
    for (const q of questions) {
      await saveQuestionToFirestore(q);
    }
  }
}

export async function queryQuestionsByHierarchy(filters: {
  standard?: number;
  subject?: string;
  chapterId?: string;
  marks?: number;
  status?: string;
}): Promise<Question[]> {
  try {
    const constraints: any[] = [];
    if (filters.standard !== undefined) constraints.push(where('standard', '==', filters.standard));
    if (filters.subject) constraints.push(where('subject', '==', filters.subject));
    if (filters.chapterId) constraints.push(where('chapterId', '==', filters.chapterId));
    if (filters.status) constraints.push(where('status', '==', filters.status));

    const q = query(collection(db, COLLECTION_QUESTIONS), ...constraints);
    const snap = await getDocs(q);
    const results: Question[] = [];
    snap.forEach((docSnap) => {
      results.push(docSnap.data() as Question);
    });
    return results;
  } catch (err) {
    console.error('Error querying questions by hierarchy:', err);
    return [];
  }
}

export async function deleteChapterFromFirestore(chapterId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_CHAPTERS, chapterId));
  } catch (err) {
    console.error('Error deleting chapter from Firestore:', err);
    throw err;
  }
}

export function subscribeQuestions(callback: (questions: Question[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_QUESTIONS));
    return onSnapshot(q, (snapshot) => {
      const list: Question[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Question);
      });
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for questions:', error);
    });
  } catch (e) {
    console.error('Error subscribing to questions:', e);
    return () => {};
  }
}

// --- PRACTICE HISTORY ---

export async function savePracticeHistoryToFirestore(item: PracticeHistoryItem): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_PRACTICE, item.id), item, { merge: true });
  } catch (err) {
    console.error('Error saving practice history:', err);
  }
}

export function subscribePracticeHistory(studentId: string, callback: (history: PracticeHistoryItem[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_PRACTICE));
    return onSnapshot(q, (snapshot) => {
      const list: PracticeHistoryItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PracticeHistoryItem;
        if (!studentId || !data.studentId || data.studentId === studentId) {
          list.push(data);
        }
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for practice history:', error);
    });
  } catch (e) {
    console.error('Error subscribing to practice history:', e);
    return () => {};
  }
}

// --- RESTORE BACKUP DATA ---
export async function restoreFullBackupToFirestore(data: {
  standards?: DynamicStandard[];
  subjects?: DynamicSubject[];
  chapters?: Chapter[];
  questions?: Question[];
}): Promise<{ standardsCount: number; subjectsCount: number; chaptersCount: number; questionsCount: number }> {
  let stds = 0, subs = 0, chs = 0, qs = 0;

  if (data.standards && Array.isArray(data.standards)) {
    for (const s of data.standards) {
      if (s.id) {
        await saveStandardToFirestore(s);
        stds++;
      }
    }
  }

  if (data.subjects && Array.isArray(data.subjects)) {
    for (const sub of data.subjects) {
      if (sub.id) {
        await saveSubjectToFirestore(sub);
        subs++;
      }
    }
  }

  if (data.chapters && Array.isArray(data.chapters)) {
    for (const ch of data.chapters) {
      if (ch.id) {
        await saveChapterToFirestore(ch);
        chs++;
      }
    }
  }

  if (data.questions && Array.isArray(data.questions)) {
    for (const q of data.questions) {
      if (q.id) {
        await saveQuestionToFirestore(q);
        qs++;
      }
    }
  }

  return { standardsCount: stds, subjectsCount: subs, chaptersCount: chs, questionsCount: qs };
}

// --- SPACED REPETITION ---

export async function saveSpacedRepetitionToFirestore(item: SpacedRepetitionItem): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_SPACED_REPETITION, item.id), item, { merge: true });
  } catch (err) {
    console.error('Error saving spaced repetition item to Firestore:', err);
  }
}

export async function deleteSpacedRepetitionFromFirestore(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_SPACED_REPETITION, itemId));
  } catch (err) {
    console.error('Error deleting spaced repetition item from Firestore:', err);
  }
}

export function subscribeSpacedRepetition(studentId: string, callback: (items: SpacedRepetitionItem[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_SPACED_REPETITION));
    return onSnapshot(q, (snapshot) => {
      const list: SpacedRepetitionItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as SpacedRepetitionItem;
        if (!studentId || !data.studentId || data.studentId === studentId) {
          list.push(data);
        }
      });
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for spaced repetition:', error);
    });
  } catch (e) {
    console.error('Error subscribing to spaced repetition:', e);
    return () => {};
  }
}

// --- AI LEARNING PLANS ---

export async function saveAILearningPlanToFirestore(studentId: string, plan: AILearningPlan): Promise<void> {
  try {
    const id = studentId || 'default_student_plan';
    await setDoc(doc(db, COLLECTION_AI_PLANS, id), {
      ...plan,
      studentId: id,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving AI Learning Plan to Firestore:', err);
  }
}

export function subscribeAILearningPlan(studentId: string, callback: (plan: AILearningPlan | null) => void) {
  try {
    const id = studentId || 'default_student_plan';
    const docRef = doc(db, COLLECTION_AI_PLANS, id);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as AILearningPlan);
      } else {
        callback(null);
      }
    }, (error) => {
      console.warn('Firestore subscription warning for AI Learning Plan:', error);
    });
  } catch (e) {
    console.error('Error subscribing to AI Learning Plan:', e);
    return () => {};
  }
}

// --- NOTIFICATIONS ---

export async function saveNotificationToFirestore(notif: AppNotification): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_NOTIFICATIONS, notif.id), notif, { merge: true });
  } catch (err) {
    console.error('Error saving notification to Firestore:', err);
  }
}

export function subscribeNotifications(role: 'parent' | 'teacher' | 'student' | 'all', callback: (notifications: AppNotification[]) => void) {
  try {
    const q = query(collection(db, COLLECTION_NOTIFICATIONS));
    return onSnapshot(q, (snapshot) => {
      const list: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as AppNotification;
        if (role === 'all' || !data.recipientRole || data.recipientRole === role) {
          list.push(data);
        }
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for notifications:', error);
    });
  } catch (e) {
    console.error('Error subscribing to notifications:', e);
    return () => {};
  }
}

// --- AI TEACHER CHAT HISTORY ---

export async function saveAIChatMessageToFirestore(studentId: string, msg: AIChatMessage): Promise<void> {
  try {
    const sId = studentId || 'default_student';
    const msgDocId = msg.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(db, COLLECTION_AI_CHAT, msgDocId), {
      ...msg,
      id: msgDocId,
      studentId: sId,
      timestamp: msg.timestamp || new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving AI chat message to Firestore:', err);
  }
}

export function subscribeAIChatHistory(studentId: string, callback: (messages: AIChatMessage[]) => void) {
  try {
    const sId = studentId || 'default_student';
    const q = query(collection(db, COLLECTION_AI_CHAT));
    return onSnapshot(q, (snapshot) => {
      const list: AIChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as AIChatMessage;
        if (!sId || !data.studentId || data.studentId === sId) {
          list.push(data);
        }
      });
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      callback(list);
    }, (error) => {
      console.warn('Firestore subscription warning for AI Chat:', error);
    });
  } catch (e) {
    console.error('Error subscribing to AI Chat history:', e);
    return () => {};
  }
}

export async function clearAIChatHistoryInFirestore(studentId: string): Promise<void> {
  try {
    const sId = studentId || 'default_student';
    const q = query(collection(db, COLLECTION_AI_CHAT));
    const snap = await getDocs(q);
    snap.forEach(async (docSnap) => {
      const data = docSnap.data() as AIChatMessage;
      if (!sId || !data.studentId || data.studentId === sId) {
        await deleteDoc(doc(db, COLLECTION_AI_CHAT, docSnap.id));
      }
    });
  } catch (err) {
    console.error('Error clearing AI chat history in Firestore:', err);
  }
}


