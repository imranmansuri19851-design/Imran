import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  TeacherProfile,
  Question, 
  Chapter,
  EvaluationResult, 
  PracticeHistoryItem,
  PlanType,
  PaymentGateway,
  SpacedRepetitionItem,
  AILearningPlan
} from './types';
import { QUESTIONS, CHAPTERS } from './data/ncertContent';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getPracticeHistory, 
  savePracticeHistory 
} from './utils/storage';
import { 
  processSpacedRepetition, 
  calculateAILearningSummary 
} from './utils/aiLearningEngine';

import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ChapterScreen } from './components/ChapterScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { AIEvaluationModal } from './components/AIEvaluationModal';
import { FinalResultView } from './components/FinalResultView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { TeacherMode } from './components/TeacherMode';
import { StudentRegistrationScreen } from './components/StudentRegistrationScreen';
import { TeacherAuthScreen } from './components/TeacherAuthScreen';
import { FirebaseAuthModal } from './components/FirebaseAuthModal';
import { AndroidFrame } from './components/AndroidFrame';
import { AboutDeveloperModal } from './components/AboutDeveloperModal';
import { SplashScreen } from './components/SplashScreen';
import { Footer } from './components/Footer';

import { SubscriptionModal } from './components/SubscriptionModal';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { ParentDashboardScreen } from './components/ParentDashboardScreen';
import { VoiceAITeacherScreen } from './components/VoiceAITeacherScreen';
import { VoiceAnswerModuleScreen } from './components/VoiceAnswerModuleScreen';
import { ReferralModal } from './components/ReferralModal';
import { AIMemoryRevisionModal } from './components/AIMemoryRevisionModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { PrePracticeRecommendationModal } from './components/PrePracticeRecommendationModal';

import { 
  saveStudentProfileToFirestore, 
  savePracticeHistoryToFirestore,
  subscribeChapters,
  subscribeQuestions,
  subscribePracticeHistory,
  subscribeSpacedRepetition,
  saveSpacedRepetitionToFirestore,
  saveAILearningPlanToFirestore
} from './services/firebaseService';

const CUSTOM_QUESTIONS_KEY = 'answer_coach_custom_questions';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile());
  const [history, setHistory] = useState<PracticeHistoryItem[]>(getPracticeHistory());
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  
  const [firestoreChapters, setFirestoreChapters] = useState<Chapter[]>([]);
  const [firestoreQuestions, setFirestoreQuestions] = useState<Question[]>([]);

  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'registration' | 'chapters' | 'question' | 'final-result' | 'dashboard' | 'voice-teacher' | 'teacher-auth' | 'teacher' | 'parent' | 'admin'
  >('home');

  const [isAndroidFrame, setIsAndroidFrame] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAboutDevOpen, setIsAboutDevOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<'gu' | 'en' | 'hi'>('gu');

  const [spacedRepetitionItems, setSpacedRepetitionItems] = useState<SpacedRepetitionItem[]>([]);
  const [isPrePracticeModalOpen, setIsPrePracticeModalOpen] = useState(false);

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubChapters = subscribeChapters((chList) => {
      setFirestoreChapters(chList);
    });

    const unsubQuestions = subscribeQuestions((qList) => {
      setFirestoreQuestions(qList);
    });

    const studentId = profile.id || profile.email || 'student';
    const unsubHistory = subscribePracticeHistory(studentId, (histList) => {
      if (histList && histList.length > 0) {
        setHistory(histList);
      }
    });

    const unsubSpaced = subscribeSpacedRepetition(studentId, (srItems) => {
      if (srItems) {
        setSpacedRepetitionItems(srItems);
      }
    });

    return () => {
      unsubChapters();
      unsubQuestions();
      unsubHistory();
      unsubSpaced();
    };
  }, [profile.id, profile.email]);

  const allChaptersList = [
    ...CHAPTERS,
    ...firestoreChapters.filter(fc => !CHAPTERS.some(c => c.id === fc.id))
  ];

  const allQuestionsList = [
    ...QUESTIONS,
    ...firestoreQuestions,
    ...customQuestions.filter(cq => !firestoreQuestions.some(fq => fq.id === cq.id))
  ];

  const currentQuestionsList = allQuestionsList.filter(
    (q) =>
      q.standard === profile.standard &&
      q.subject === profile.selectedSubject &&
      (!selectedChapterId || q.chapterId === selectedChapterId)
  );

  const activeQuestionList = currentQuestionsList.length > 0 ? currentQuestionsList : allQuestionsList;

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    savePracticeHistory(history);
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(customQuestions));
    } catch (e) {
      console.warn('Failed to save custom questions:', e);
    }
  }, [customQuestions]);

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    const updatedProf = { ...profile, ...updated };
    setProfile(updatedProf);
    saveStudentProfileToFirestore(updatedProf).catch(e => console.warn('Sync profile err:', e));
  };

  const handleSelectPlan = (plan: PlanType, gateway?: PaymentGateway, couponCode?: string) => {
    handleUpdateProfile({
      plan: plan,
      planExpiryDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    });
  };

  const handleCompleteRegistration = (registeredProfile: StudentProfile) => {
    setProfile(registeredProfile);
    saveStoredProfile(registeredProfile);
    setCurrentScreen('home');
  };

  const handleAddCustomQuestion = (newQ: Question) => {
    setCustomQuestions((prev) => [newQ, ...prev]);
  };

  const handleDeleteCustomQuestion = (qId: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  const handleStartPracticeFromHome = () => {
    setIsPrePracticeModalOpen(true);
  };

  const handleStartAIPracticePlan = () => {
    const aiSummary = calculateAILearningSummary(
      profile,
      history,
      allChaptersList,
      allQuestionsList,
      spacedRepetitionItems
    );

    const recIds = aiSummary.plan.dailyPracticePlan.recommendedQuestionIds;
    if (recIds.length > 0) {
      const q = allQuestionsList.find((item) => item.id === recIds[0]);
      if (q) {
        setActiveQuestion(q);
        setAttemptNumber(1);
        setCurrentQuestionIndex(0);
        setCurrentScreen('question');
        return;
      }
    }
    setCurrentScreen('chapters');
  };

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setCurrentQuestionIndex(0);
    setAttemptNumber(1);
    const qList = allQuestionsList.filter(
      (q) => q.standard === profile.standard && q.subject === profile.selectedSubject && q.chapterId === chapterId
    );
    if (qList.length > 0) {
      setActiveQuestion(qList[0]);
    } else {
      setActiveQuestion(allQuestionsList[0]);
    }
    setCurrentScreen('question');
  };

  const handleSelectSpecificQuestion = (question: Question) => {
    setActiveQuestion(question);
    setAttemptNumber(1);
    const idx = activeQuestionList.findIndex((q) => q.id === question.id);
    setCurrentQuestionIndex(idx >= 0 ? idx : 0);
    setCurrentScreen('question');
  };

  const handleEvaluateAnswer = async (
    studentTranscript: string,
    attempt: number = 1,
    lang: 'gu' | 'en' | 'hi' = 'gu'
  ) => {
    if (!activeQuestion) return;

    // Check free plan usage limits
    if (profile.plan === 'free' && profile.dailyEvaluationsUsed >= 5) {
      setIsSubscriptionOpen(true);
      alert('⚠️ આજના તમારા ૫ ફ્રી એવલ્યુએશન વપરાઈ ગયા છે. કાયમી ફ્રી ફેમિલી મોડ અનલોક કરવા કૂપન વાપરો ( FAMILY2026 ) અથવા પ્રીમિયમ સિલેક્ટ કરો!');
      return;
    }

    setIsEvaluating(true);

    try {
      const qMarks = activeQuestion.totalMarks || activeQuestion.marks || 5;
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: activeQuestion.questionTextGujarati,
          questionEnglish: activeQuestion.questionTextEnglish,
          standard: activeQuestion.standard,
          subject: activeQuestion.subject,
          chapter: activeQuestion.chapterId,
          totalMarks: qMarks,
          keyPoints: activeQuestion.expectedKeyPoints || activeQuestion.mainPoints || [],
          modelAnswer: activeQuestion.officialNCERTModelAnswer || activeQuestion.modelAnswer || (activeQuestion.expectedKeyPoints || []).join('. '),
          alternativeAnswers: activeQuestion.alternativeAcceptableAnswers || activeQuestion.alternativeAcceptedAnswers || [],
          aiEvaluationRules: activeQuestion.aiEvaluationRules || {},
          studentAnswer: studentTranscript,
          attemptNumber: attempt,
          language: lang,
        }),
      });

      const data = await response.json();

      if (data.success && data.evaluation) {
        setEvaluationResult(data.evaluation);
        setShowEvaluationModal(true);

        const earned = data.evaluation.earnedMarks ?? 0;
        const total = data.evaluation.totalMarks || qMarks;
        const accuracyPct = Math.min(100, Math.max(0, Math.round((earned / total) * 100)));
        const hintsUsed = attempt > 1 ? attempt - 1 : 0;
        const initialScoreEst = Math.max(1, Math.round(earned * (1 / attempt)));
        const improvementPct = attempt > 1 ? Math.min(100, Math.round(((earned - initialScoreEst) / total) * 100)) : 0;

        const newHistoryItem: PracticeHistoryItem = {
          id: 'hist_' + Date.now(),
          date: new Date().toISOString(),
          studentId: profile.id || 'student',
          questionId: activeQuestion.id,
          questionTextGujarati: activeQuestion.questionTextGujarati,
          standard: activeQuestion.standard,
          subject: activeQuestion.subject,
          chapterId: activeQuestion.chapterId,
          totalMarks: total,
          earnedMarks: earned,
          attempts: attempt,
          hintsUsed: hintsUsed,
          scoreBeforeHint: initialScoreEst,
          improvementPercentage: improvementPct,
          timeTaken: data.evaluation.timeTakenSeconds || 30,
          weakConcepts: data.evaluation.weakConcepts || data.evaluation.missingPoints || [],
          whatToRevise: data.evaluation.whatToRevise || data.evaluation.missingPoints || [],
          recommendedNextPractice: data.evaluation.recommendedNextPractice || 'વધારાની પ્રેક્ટિસ માટે સંકલ્પનાઓનું પુનરાવર્તન કરો.',
          accuracyPercentage: accuracyPct,
          studentTranscript: studentTranscript,
          feedback: data.evaluation.feedback || 'I M MASTER AI ગુરુજી દ્વારા જવાબ ચકાસણી પૂર્ણ થઈ.',
          evaluationResult: data.evaluation,
        };

        savePracticeHistoryToFirestore(newHistoryItem);

        setHistory((prev) => [newHistoryItem, ...prev]);

        // Process Spaced Repetition
        const { updatedItems } = processSpacedRepetition(
          activeQuestion,
          earned,
          activeQuestion.totalMarks,
          spacedRepetitionItems,
          profile.id || 'student'
        );
        setSpacedRepetitionItems(updatedItems);
        updatedItems.forEach((sr) => {
          saveSpacedRepetitionToFirestore(sr);
        });

        const newProfileStats: Partial<StudentProfile> = {
          totalQuestionsAnswered: profile.totalQuestionsAnswered + 1,
          totalMarksEarned: profile.totalMarksEarned + earned,
          minutesSpentToday: profile.minutesSpentToday + 2,
          dailyEvaluationsUsed: (profile.dailyEvaluationsUsed || 0) + 1,
        };

        handleUpdateProfile(newProfileStats);
      }
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
      const fallbackEval: EvaluationResult = {
        earnedMarks: Math.max(1, Math.round(activeQuestion.totalMarks * (attempt === 3 ? 0.9 : 0.6))),
        totalMarks: activeQuestion.totalMarks,
        correctPoints: [activeQuestion.expectedKeyPoints[0] || 'સાચો પ્રયાસ'],
        missingPoints: activeQuestion.expectedKeyPoints.slice(1, 3),
        wrongPoints: attempt === 1 ? ['મુખ્ય વૈજ્ઞાનિક પદ સુધારવું જરૂરી'] : [],
        suggestions: ['વધુ સ્પષ્ટતા અને વૈજ્ઞાનિક વ્યાખ્યા ઉમેરો.'],
        hint: activeQuestion.hintGujarati,
        keywords: activeQuestion.keywords,
        memoryTips: activeQuestion.memoryTipGujarati,
        feedback: attempt >= 3 
          ? 'ઉત્તમ પૂર્ણાહુતિ! સંપૂર્ણ નમૂનારૂપ જવાબ નીચે આપેલો છે.' 
          : `પ્રયાસ ${attempt}/3: સરસ પ્રયાસ! હિન્ટ ધ્યાનમાં રાખીને ફરી બોલો.`,
        attemptNumber: attempt,
        language: lang,
        modelAnswer: activeQuestion.modelAnswer || activeQuestion.expectedKeyPoints.join('. '),
        isCompleteModelAnswerRevealed: attempt >= 3,
      };
      setEvaluationResult(fallbackEval);
      setShowEvaluationModal(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleProceedToFinalResult = () => {
    setShowEvaluationModal(false);
    setCurrentScreen('final-result');
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQuestionIndex + 1;
    setAttemptNumber(1);
    if (nextIdx < activeQuestionList.length) {
      setCurrentQuestionIndex(nextIdx);
      setActiveQuestion(activeQuestionList[nextIdx]);
      setCurrentScreen('question');
    } else {
      setCurrentScreen('chapters');
    }
  };

  const handleRetryCurrentQuestion = () => {
    setShowEvaluationModal(false);
    setAttemptNumber((prev) => Math.min(3, prev + 1));
    setCurrentScreen('question');
  };

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      <AndroidFrame
        enabled={isAndroidFrame}
        onNavigateHome={() => setCurrentScreen('home')}
      >
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
          
          {/* Main Header */}
          <Header
            profile={profile}
            isAndroidFrame={isAndroidFrame}
            onToggleAndroidFrame={() => setIsAndroidFrame(!isAndroidFrame)}
            onOpenProfile={() => setCurrentScreen('registration')}
            onOpenAuth={() => setCurrentScreen('registration')}
            onNavigateHome={() => setCurrentScreen('home')}
            onNavigateDashboard={() => setCurrentScreen('dashboard')}
            onNavigateVoiceTeacher={() => setCurrentScreen('voice-teacher')}
            onNavigateTeacher={() => {
              if (teacherProfile && teacherProfile.isLoggedIn) {
                setCurrentScreen('teacher');
              } else {
                setCurrentScreen('teacher-auth');
              }
            }}
            onNavigateParent={() => setCurrentScreen('parent')}
            onNavigateAdmin={() => setCurrentScreen('admin')}
            onOpenSubscription={() => setIsSubscriptionOpen(true)}
            onOpenReferral={() => setIsReferralOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenAIMemory={() => setIsAIMemoryOpen(true)}
            onOpenAboutDeveloper={() => setIsAboutDevOpen(true)}
            currentScreen={currentScreen}
          />

          {/* Loading Overlay when API is evaluating */}
          {isEvaluating && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
              <h3 className="font-extrabold text-xl tracking-tight">
                I M MASTER AI ગુરુજી જવાબ ચકાસી રહ્યા છે...
              </h3>
              <p className="text-xs text-blue-200">
                તમારા અવાજના જવાબનું NCERT કી-પોઈન્ટ્સ સાથે વિશ્લેષણ થઈ રહ્યું છે.
              </p>
            </div>
          )}

          {/* Subheader Bar with Plan & User Quick Switcher */}
          <div className="bg-[#D1E4FF]/60 border-b border-[#0061A4]/20 py-2 px-4">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#001D36]">
              <div className="flex items-center gap-2">
                <span className="bg-[#0061A4] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  {profile.plan || 'PREMIUM'} PLAN
                </span>
                <span>વિદ્યાર્થી: <strong className="text-[#0061A4]">{profile.name}</strong> (Std {profile.standard})</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsSubscriptionOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all text-xs font-black shadow-sm"
                  id="header-upgrade-btn"
                >
                  👑 સબ્સ્ક્રિપ્શન પ્લાન
                </button>

                <button
                  onClick={() => setCurrentScreen('parent')}
                  className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all text-xs font-black shadow-sm border border-amber-300"
                  id="sub-header-parent-btn"
                >
                  👨‍👩‍👧 વાલી ડેશબોર્ડ
                </button>

                <button
                  onClick={() => {
                    if (teacherProfile && teacherProfile.isLoggedIn) {
                      setCurrentScreen('teacher');
                    } else {
                      setCurrentScreen('teacher-auth');
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#0061A4] text-white hover:bg-[#004F87] transition-all text-xs font-black shadow-sm"
                  id="header-teacher-portal-link"
                >
                  🔐 શિક્ષક પોર્ટલ
                </button>

                <button
                  onClick={() => setCurrentScreen('admin')}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all text-xs font-black shadow-sm"
                  id="sub-header-admin-btn"
                >
                  ⚙️ એડમિન ડેશબોર્ડ
                </button>
              </div>
            </div>
          </div>

          {/* Main View Router */}
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
            
            {/* 1. Student Registration Screen */}
            {currentScreen === 'registration' && (
              <StudentRegistrationScreen
                currentProfile={profile}
                onCompleteRegistration={handleCompleteRegistration}
                onCancel={() => setCurrentScreen('home')}
              />
            )}

            {/* 2. Teacher Login Screen */}
            {currentScreen === 'teacher-auth' && (
              <TeacherAuthScreen
                onLoginSuccess={(teacher) => {
                  setTeacherProfile(teacher);
                  setCurrentScreen('teacher');
                }}
                onBackToHome={() => setCurrentScreen('home')}
              />
            )}

            {/* 3. Teacher Dashboard Screen */}
            {currentScreen === 'teacher' && (
              <TeacherMode
                customQuestions={customQuestions}
                currentTeacher={teacherProfile}
                onAddQuestion={handleAddCustomQuestion}
                onDeleteQuestion={handleDeleteCustomQuestion}
                onBackToHome={() => setCurrentScreen('home')}
              />
            )}

            {/* 4. Parent Dashboard Screen */}
            {currentScreen === 'parent' && (
              <ParentDashboardScreen
                student={profile}
                history={history}
                onBackToHome={() => setCurrentScreen('home')}
              />
            )}

            {/* 5. Admin Dashboard Screen */}
            {currentScreen === 'admin' && (
              <AdminDashboardScreen
                students={[profile]}
                teachers={teacherProfile ? [teacherProfile] : []}
                history={history}
                onBackToHome={() => setCurrentScreen('home')}
              />
            )}

            {/* 6. Student Dashboard / Home */}
            {currentScreen === 'home' && (
              <HomeScreen
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onStartPractice={handleStartPracticeFromHome}
                onOpenVoiceTeacher={() => setCurrentScreen('voice-teacher')}
                onOpenDashboard={() => setCurrentScreen('dashboard')}
                onOpenTeacher={() => {
                  if (teacherProfile && teacherProfile.isLoggedIn) {
                    setCurrentScreen('teacher');
                  } else {
                    setCurrentScreen('teacher-auth');
                  }
                }}
                onOpenParent={() => setCurrentScreen('parent')}
                onOpenAboutDeveloper={() => setIsAboutDevOpen(true)}
              />
            )}

            {/* 7. 🎙 AI Live Teacher Module Screen */}
            {currentScreen === 'voice-teacher' && (
              <VoiceAITeacherScreen
                profile={profile}
                onNavigateHome={() => setCurrentScreen('home')}
                allQuestions={allQuestionsList}
                onStartPracticeQuestion={(q) => {
                  setActiveQuestion(q);
                  setAttemptNumber(1);
                  setCurrentQuestionIndex(0);
                  setCurrentScreen('question');
                }}
              />
            )}

            {/* 7b. 🎙 Dedicated Voice Answer Practice Screen */}
            {currentScreen === 'voice-answer' && (
              <VoiceAnswerModuleScreen
                allChapters={allChaptersList}
                allQuestions={allQuestionsList}
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNavigateHome={() => setCurrentScreen('home')}
              />
            )}

            {/* Chapter Selection */}
            {currentScreen === 'chapters' && (
              <ChapterScreen
                standard={profile.standard}
                subject={profile.selectedSubject}
                allQuestions={allQuestionsList}
                onSelectChapter={handleSelectChapter}
                onSelectSpecificQuestion={handleSelectSpecificQuestion}
                onBackToHome={() => setCurrentScreen('home')}
              />
            )}

            {/* Practice Questions */}
            {currentScreen === 'question' && activeQuestion && (
              <QuestionScreen
                question={activeQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestionsCount={activeQuestionList.length}
                attemptNumber={attemptNumber}
                selectedLanguage={selectedLanguage}
                onLanguageChange={(lang) => setSelectedLanguage(lang)}
                onEvaluateAnswer={handleEvaluateAnswer}
                onBackToChapters={() => setCurrentScreen('chapters')}
              />
            )}

            {/* Final Evaluation Result */}
            {currentScreen === 'final-result' && activeQuestion && evaluationResult && (
              <FinalResultView
                question={activeQuestion}
                evaluation={evaluationResult}
                onNextQuestion={handleNextQuestion}
                onRetryQuestion={handleRetryCurrentQuestion}
                onBackToChapters={() => setCurrentScreen('chapters')}
                onPracticePersonalizedQuestion={(pQuestion) => {
                  const newQ: Question = {
                    id: 'pq_' + Date.now(),
                    standard: activeQuestion.standard,
                    subject: activeQuestion.subject,
                    chapterId: activeQuestion.chapterId,
                    questionTextGujarati: pQuestion.questionText,
                    questionTextEnglish: pQuestion.questionText,
                    questionTextHindi: pQuestion.questionText,
                    totalMarks: 5,
                    expectedKeyPoints: pQuestion.expectedKeyPoints && pQuestion.expectedKeyPoints.length > 0 ? pQuestion.expectedKeyPoints : [pQuestion.hint],
                    keywords: pQuestion.expectedKeyPoints || ['પ્રેક્ટિસ'],
                    memoryTipGujarati: pQuestion.hint,
                    hintGujarati: pQuestion.hint,
                    difficulty: 'Medium',
                    modelAnswer: pQuestion.expectedKeyPoints ? pQuestion.expectedKeyPoints.join('. ') : pQuestion.hint,
                    questionType: 'long',
                  };
                  setActiveQuestion(newQ);
                  setAttemptNumber(1);
                  setCurrentQuestionIndex(0);
                  setCurrentScreen('question');
                }}
                hasNextQuestion={currentQuestionIndex + 1 < activeQuestionList.length}
              />
            )}

            {/* Progress Dashboard */}
            {currentScreen === 'dashboard' && (
              <ProgressDashboard
                profile={profile}
                history={history}
                allChapters={allChaptersList}
                allQuestions={allQuestionsList}
                spacedRepetitionItems={spacedRepetitionItems}
                onBackToHome={() => setCurrentScreen('home')}
                onStartReviewQuestion={(qId) => {
                  const q = allQuestionsList.find((item) => item.id === qId);
                  if (q) {
                    setActiveQuestion(q);
                    setAttemptNumber(1);
                    setCurrentQuestionIndex(0);
                    setCurrentScreen('question');
                  }
                }}
              />
            )}

          </main>

          {/* Pre-Practice Recommendation Modal */}
          <PrePracticeRecommendationModal
            isOpen={isPrePracticeModalOpen}
            onClose={() => {
              setIsPrePracticeModalOpen(false);
              setCurrentScreen('chapters');
            }}
            profile={profile}
            dueSpacedItems={calculateAILearningSummary(profile, history, allChaptersList, allQuestionsList, spacedRepetitionItems).dueSpacedRepetitionItems}
            plan={calculateAILearningSummary(profile, history, allChaptersList, allQuestionsList, spacedRepetitionItems).plan}
            onStartAIPracticePlan={() => {
              setIsPrePracticeModalOpen(false);
              handleStartAIPracticePlan();
            }}
          />

          {/* AI Evaluation Modal */}
          {showEvaluationModal && evaluationResult && activeQuestion && (
            <AIEvaluationModal
              evaluation={evaluationResult}
              questionTextGujarati={activeQuestion.questionTextGujarati}
              totalMarks={activeQuestion.totalMarks}
              onTryAgain={handleRetryCurrentQuestion}
              onProceedToFinalResult={handleProceedToFinalResult}
            />
          )}

          {/* Subscription & Payment Modal */}
          <SubscriptionModal
            isOpen={isSubscriptionOpen}
            onClose={() => setIsSubscriptionOpen(false)}
            currentPlan={profile.plan || 'premium'}
            onSelectPlan={handleSelectPlan}
            profile={profile}
          />

          {/* Referral & Invite Friends Modal */}
          <ReferralModal
            isOpen={isReferralOpen}
            onClose={() => setIsReferralOpen(false)}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />

          {/* AI Memory Revision Modal */}
          <AIMemoryRevisionModal
            isOpen={isAIMemoryOpen}
            onClose={() => setIsAIMemoryOpen(false)}
            standard={profile.standard}
            subject={profile.selectedSubject}
          />

          {/* Notifications Modal */}
          <NotificationCenterModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />

          {/* About Developer Modal */}
          <AboutDeveloperModal
            isOpen={isAboutDevOpen}
            onClose={() => setIsAboutDevOpen(false)}
          />

          {/* Firebase Authentication Modal */}
          <FirebaseAuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />

          {/* Footer */}
          <Footer
            onOpenAboutDeveloper={() => setIsAboutDevOpen(true)}
            onNavigateHome={() => setCurrentScreen('home')}
            onNavigateTeacher={() => {
              if (teacherProfile && teacherProfile.isLoggedIn) {
                setCurrentScreen('teacher');
              } else {
                setCurrentScreen('teacher-auth');
              }
            }}
            onNavigateDashboard={() => setCurrentScreen('dashboard')}
          />

        </div>
      </AndroidFrame>
    </>
  );
}
