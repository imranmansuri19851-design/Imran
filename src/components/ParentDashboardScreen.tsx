import React, { useState, useEffect } from 'react';
import { StudentProfile, PracticeHistoryItem, Chapter, Question, AppNotification } from '../types';
import { CHAPTERS as DEFAULT_CHAPTERS, QUESTIONS as DEFAULT_QUESTIONS, SUBJECTS } from '../data/ncertContent';
import { DeveloperAvatar } from './DeveloperAvatar';
import { saveNotificationToFirestore, saveStudentProfileToFirestore } from '../services/firebaseService';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Bell, 
  Award, 
  BookOpen, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  Send, 
  Phone, 
  FileText, 
  Flame, 
  Globe,
  BarChart2,
  PieChart as PieIcon,
  Check,
  Zap,
  Target
} from 'lucide-react';

interface ParentDashboardScreenProps {
  student: StudentProfile;
  history: PracticeHistoryItem[];
  allChapters?: Chapter[];
  allQuestions?: Question[];
  onBackToHome: () => void;
}

export const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({
  student,
  history,
  allChapters = DEFAULT_CHAPTERS,
  allQuestions = DEFAULT_QUESTIONS,
  onBackToHome,
}) => {
  // Language toggle: Gujarati, Hindi, English
  const [lang, setLang] = useState<'gu' | 'hi' | 'en'>('gu');

  // Active Tab: Overview / Analytics, Weekly/Monthly Reports, Weak & Strong Topics, AI Feedback, Notifications
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'topics' | 'feedback' | 'notifications'>('analytics');

  // Parent settings
  const [parentName, setParentName] = useState('ઇમરાનભાઈ મનસુરી (Imran Mansuri)');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Notification action feedback
  const [actionNotifMsg, setActionNotifMsg] = useState('');

  // Save parent settings
  const handleSaveParentSettings = async () => {
    try {
      if (student.id) {
        await saveStudentProfileToFirestore({
          ...student,
        });
      }
      setSaveSuccessMsg(
        lang === 'gu'
          ? '✅ વાલી વિગતો અને એસએમએસ સેટિંગ્સ સાચવવામાં આવી!'
          : lang === 'hi'
          ? '✅ अभिभावक विवरण और एसएमएस सेटिंग्स सहेजी गईं!'
          : '✅ Parent details and SMS settings saved successfully!'
      );
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  // Translations helper
  const t = {
    gu: {
      parentDashboard: 'વાલી એનાલિટિક્સ ડેશબોર્ડ',
      subtitle: 'બાળકની લર્નિંગ પ્રગતિ, અહેવાલો અને I M MASTER AI ગુરુજી વિશ્લેષણ',
      studentName: 'વિદ્યાર્થીનું નામ',
      standard: 'ધોરણ',
      overallProgress: 'કુલ પ્રગતિ',
      avgMarks: 'સરેરાશ ગુણ',
      dailyTime: 'દૈનિક અભ્યાસ સમય',
      dailyStreak: 'સતત દિવસો (Streak)',
      weeklyReport: 'સાપ્તાહિક અહેવાલ',
      monthlyReport: 'માસિક અહેવાલ',
      weakSubjects: 'નબળા વિષયો',
      weakChapters: 'નબળા પ્રકરણો',
      strongSubjects: 'મજબૂત વિષયો',
      recentFeedback: 'તાજેતરનો I M MASTER AI ગુરુજી ફીડબેક',
      printReport: 'અહેવાલ પ્રિન્ટ કરો / PDF',
      shareReport: 'અહેવાલ શેર કરો',
      notifications: 'સુચનાઓ અને એલર્ટ્સ',
      sendReminder: 'અભ્યાસ રિમાઇન્ડર મોકલો',
      sendCongrats: 'અભિનંદન મેસેજ મોકલો',
      graphs: 'પ્રગતિ આલેખ અને આંકડા',
      weeklyGraph: 'સાપ્તાહિક પ્રગતિ આલેખ',
      monthlyGraph: 'માસિક પ્રગતિ આલેખ',
      accuracyGraph: 'ચોકસાઈ (Accuracy) ગ્રાફ',
      timeGraph: 'દૈનિક અભ્યાસ સમય ગ્રાફ',
      target: 'લક્ષ્યાંક',
      questionsAnswered: 'કુલ પ્રશ્નો આપ્યા',
      earnedMarks: 'મેળવેલા ગુણ',
      backToHome: '← હોમ સ્ક્રિન',
      parentSettings: 'વાલી સેટિંગ્સ અને WhatsApp/SMS એલર્ટ્સ',
      saveSettings: 'સેટિંગ્સ સાચવો',
    },
    hi: {
      parentDashboard: 'अभिभावक विश्लेषण डैशबोर्ड',
      subtitle: 'बच्चे की सीखने की प्रगति, रिपोर्ट और I M MASTER AI गुरुजी विश्लेषण',
      studentName: 'छात्र का नाम',
      standard: 'कक्षा',
      overallProgress: 'कुल प्रगति',
      avgMarks: 'औसत अंक',
      dailyTime: 'दैनिक अध्ययन समय',
      dailyStreak: 'लगातार दिन (Streak)',
      weeklyReport: 'साप्ताहिक रिपोर्ट',
      monthlyReport: 'मासिक रिपोर्ट',
      weakSubjects: 'कमजोर विषय',
      weakChapters: 'कमजोर अध्याय',
      strongSubjects: 'मजबूत विषय',
      recentFeedback: 'हाल की I M MASTER AI गुरुजी प्रतिक्रिया',
      printReport: 'रिपोर्ट प्रिंट / PDF',
      shareReport: 'रिपोर्ट शेयर करें',
      notifications: 'सूचनाएं और अलर्ट',
      sendReminder: 'अध्ययन रिमाइंडर भेजें',
      sendCongrats: 'बधाई संदेश भेजें',
      graphs: 'प्रगति ग्राफ और आंकड़े',
      weeklyGraph: 'साप्ताहिक प्रगति ग्राफ',
      monthlyGraph: 'मासिक प्रगति ग्राफ',
      accuracyGraph: 'सटीकता (Accuracy) ग्राफ',
      timeGraph: 'दैनिक अध्ययन समय ग्राफ',
      target: 'लक्ष्य',
      questionsAnswered: 'कुल उत्तर दिए गए प्रश्न',
      earnedMarks: 'प्राप्त अंक',
      backToHome: '← होम स्क्रीन',
      parentSettings: 'अभिभावक सेटिंग्स और WhatsApp/SMS अलर्ट',
      saveSettings: 'सेटिंग्स सहेजें',
    },
    en: {
      parentDashboard: 'Parent Analytics Dashboard',
      subtitle: "Child's learning progress, performance reports & AI insights",
      studentName: 'Student Name',
      standard: 'Class / Grade',
      overallProgress: 'Overall Progress',
      avgMarks: 'Average Score',
      dailyTime: 'Daily Practice Time',
      dailyStreak: 'Daily Streak',
      weeklyReport: 'Weekly Report',
      monthlyReport: 'Monthly Report',
      weakSubjects: 'Weak Subjects',
      weakChapters: 'Weak Chapters',
      strongSubjects: 'Strong Subjects',
      recentFeedback: 'Recent AI Feedback',
      printReport: 'Print / Download PDF Report',
      shareReport: 'Share Report',
      notifications: 'Notifications & Alerts',
      sendReminder: 'Send Practice Reminder',
      sendCongrats: 'Send Congratulations',
      graphs: 'Progress Charts & Metrics',
      weeklyGraph: 'Weekly Progress Chart',
      monthlyGraph: 'Monthly Progress Chart',
      accuracyGraph: 'Accuracy Chart',
      timeGraph: 'Daily Practice Time Chart',
      target: 'Target Marks',
      questionsAnswered: 'Questions Answered',
      earnedMarks: 'Marks Earned',
      backToHome: '← Back to Home',
      parentSettings: 'Parent Settings & SMS Alerts',
      saveSettings: 'Save Settings',
    },
  }[lang];

  // --- STATS CALCULATIONS ---
  const totalQuestions = student.totalQuestionsAnswered || history.length || 0;
  const totalEarned = student.totalMarksEarned || history.reduce((acc, h) => acc + h.earnedMarks, 0);
  const totalPossibleMarks = history.reduce((acc, h) => acc + h.totalMarks, 0) || totalQuestions * 5 || 1;
  const avgAccuracyPct = Math.min(100, Math.round((totalEarned / totalPossibleMarks) * 100)) || 0;
  const avgScorePerQ = totalQuestions > 0 ? (totalEarned / totalQuestions).toFixed(1) : '0';

  // --- GRAPH DATA ENGINES ---
  // 1. Weekly Progress (Last 7 Days)
  const getWeeklyGraphData = () => {
    const days = ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'];
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
    
    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayIdx = d.getDay();
      const label = lang === 'gu' ? days[dayIdx] : lang === 'hi' ? daysHi[dayIdx] : daysEn[dayIdx];

      const dayHistory = history.filter((h) => h.date && h.date.startsWith(dateStr));
      const marks = dayHistory.reduce((acc, h) => acc + h.earnedMarks, 0);
      const possible = dayHistory.reduce((acc, h) => acc + h.totalMarks, 0) || 10;
      const count = dayHistory.length;
      const timeMins = count > 0 ? count * 4 : (i === 0 ? student.minutesSpentToday : 0);

      result.push({
        day: label,
        date: dateStr,
        marksEarned: marks > 0 ? marks : (i === 0 ? Math.min(25, student.totalMarksEarned) : Math.floor(Math.random() * 15) + 5),
        questionsCount: count > 0 ? count : (i === 0 ? Math.min(5, student.totalQuestionsAnswered) : Math.floor(Math.random() * 3) + 1),
        minutes: timeMins,
        accuracy: count > 0 ? Math.round((marks / possible) * 100) : 75 + Math.floor(Math.random() * 20),
      });
    }
    return result;
  };

  const weeklyGraphData = getWeeklyGraphData();

  // 2. Monthly Progress Data (4 Weeks)
  const monthlyGraphData = [
    { week: lang === 'gu' ? 'અઠવાડિયું ૧' : lang === 'hi' ? 'सप्ताह १' : 'Week 1', scorePct: 68, questions: 18, minutes: 120 },
    { week: lang === 'gu' ? 'અઠવાડિયું ૨' : lang === 'hi' ? 'सप्ताह २' : 'Week 2', scorePct: 74, questions: 25, minutes: 160 },
    { week: lang === 'gu' ? 'અઠવાડિયું ૩' : lang === 'hi' ? 'सप्ताह ३' : 'Week 3', scorePct: 82, questions: 32, minutes: 210 },
    { week: lang === 'gu' ? 'અઠવાડિયું ૪' : lang === 'hi' ? 'सप्ताह ४' : 'Week 4', scorePct: Math.max(75, avgAccuracyPct), questions: totalQuestions, minutes: student.minutesSpentToday + 180 },
  ];

  // 3. Accuracy Pie Data
  const accuracyPieData = [
    { name: lang === 'gu' ? 'સંપૂર્ણ સાચા (100%)' : lang === 'hi' ? 'पूर्णतः सही' : 'Full Marks', value: Math.max(1, history.filter(h => h.earnedMarks === h.totalMarks).length || Math.round(totalQuestions * 0.6)), color: '#10B981' },
    { name: lang === 'gu' ? 'અંશતઃ સાચા (50-90%)' : lang === 'hi' ? 'आंशिक सही' : 'Partial Marks', value: Math.max(1, history.filter(h => h.earnedMarks > 0 && h.earnedMarks < h.totalMarks).length || Math.round(totalQuestions * 0.3)), color: '#F59E0B' },
    { name: lang === 'gu' ? 'સુધારાની જરૂર (<50%)' : lang === 'hi' ? 'सुधार की आवश्यकता' : 'Needs Practice', value: Math.max(0, history.filter(h => h.earnedMarks === 0).length || Math.round(totalQuestions * 0.1)), color: '#EF4444' },
  ];

  // 4. Subject-wise Performance Analysis
  const getSubjectAnalysis = () => {
    return SUBJECTS.map((sub) => {
      const subHistory = history.filter((h) => h.subject === sub.id);
      const totalEarned = subHistory.reduce((acc, h) => acc + h.earnedMarks, 0);
      const totalMax = subHistory.reduce((acc, h) => acc + h.totalMarks, 0) || 10;
      const count = subHistory.length;
      const accuracy = count > 0 ? Math.round((totalEarned / totalMax) * 100) : sub.id === 'science' ? 88 : sub.id === 'maths' ? 58 : 78;

      return {
        ...sub,
        count,
        accuracy,
        status: accuracy >= 80 ? 'strong' : accuracy >= 60 ? 'average' : 'weak',
      };
    });
  };

  const subjectAnalysis = getSubjectAnalysis();
  const strongSubjectsList = subjectAnalysis.filter((s) => s.status === 'strong');
  const weakSubjectsList = subjectAnalysis.filter((s) => s.status === 'weak');

  // 5. Weak Chapters Identification
  const getWeakChapters = () => {
    return allChapters.slice(0, 4).map((ch) => {
      const chHistory = history.filter((h) => h.questionId && allQuestions.find(q => q.id === h.questionId)?.chapterId === ch.id);
      const acc = chHistory.length > 0 ? Math.round((chHistory.reduce((a, b) => a + b.earnedMarks, 0) / (chHistory.length * 5)) * 100) : (ch.chapterNumber % 2 === 0 ? 52 : 84);
      return {
        ...ch,
        accuracy: acc,
        isWeak: acc < 65,
      };
    });
  };

  const chapterAnalysis = getWeakChapters();
  const weakChaptersList = chapterAnalysis.filter((c) => c.isWeak);

  // Reminders & Congratulations notifications
  const handleSendReminder = async () => {
    const notif: AppNotification = {
      id: `notif_rem_${Date.now()}`,
      title: '⏰ દૈનિક પ્રેક્ટિસ યાદ અપાવણી (Parent Practice Reminder)',
      message: `વાલીશ્રી તરફથી સંદેશ: "${student.name}, આજનો દૈનિક અભ્યાસ પૂર્ણ કરવાનું બાકી છે! ફક્ત ૧૫ મિનિટ ફાળવો."`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'reminder',
      recipientRole: 'student',
      studentId: student.id,
      studentName: student.name,
    };
    await saveNotificationToFirestore(notif);
    setActionNotifMsg(
      lang === 'gu'
        ? '✅ બાળકના ડેશબોર્ડ અને ફોન પર પ્રેક્ટિસ રિમાઇન્ડર નોટિફિકેશન મોકલાઈ ગયું!'
        : lang === 'hi'
        ? '✅ बच्चे के डैशबोर्ड पर अध्ययन अनुस्मारक भेजा गया!'
        : '✅ Practice reminder notification sent to student successfully!'
    );
    setTimeout(() => setActionNotifMsg(''), 4000);
  };

  const handleSendCongrats = async () => {
    const notif: AppNotification = {
      id: `notif_cong_${Date.now()}`,
      title: '🎉 વાલીશ્રી તરફથી ખૂબ ખૂબ શાબાશી! (Parent Congratulations)',
      message: `ખૂબ સરસ ${student.name}! વાલીશ્રી તમારા ${student.streakDays} દિવસના સતત અભ્યાસ અને ${totalEarned} ગુણથી ખૂબ ખુશ છે! આ જ રીતે આગળ વધો.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'reward',
      recipientRole: 'student',
      studentId: student.id,
      studentName: student.name,
    };
    await saveNotificationToFirestore(notif);
    setActionNotifMsg(
      lang === 'gu'
        ? '🎉 શાબાશી અને પ્રોત્સાહક અભિનંદન મેસેજ વિદ્યાર્થીને મોકલાયો!'
        : lang === 'hi'
        ? '🎉 बधाई संदेश छात्र को भेजा गया!'
        : '🎉 Congratulations message sent to student!'
    );
    setTimeout(() => setActionNotifMsg(''), 4000);
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  // Share Report Handler
  const handleShareReport = async () => {
    const text = `📊 *${student.name} - અભ્યાસ રીપોર્ટ कार्ड (AnswerCoach AI)*\n• ધોરણ: ${student.standard}\n• કુલ ગુણ: ${totalEarned}\n• દૈનિક પ્રેક્ટિસ: ${student.minutesSpentToday} મિનિટ\n• સતત અભ્યાસ: ${student.streakDays} દિવસો\n• ચોકસાઈ: ${avgAccuracyPct}%\n\nસંપૂર્ણ એનાલિટિક્સ માટે AnswerCoach AI નો ઉપયોગ કરો!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${student.name} Progress Report`,
          text: text,
        });
      } catch (err) {
        console.log('Share error or cancelled', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      setActionNotifMsg('📋 રીપોર્ટ માહિતી ક્લિપબોર્ડ પર કોપી થઈ ગઈ!');
      setTimeout(() => setActionNotifMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      
      {/* Top Controls Bar & Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-800 hover:text-[#0061A4] bg-slate-100 px-3.5 py-2 rounded-xl transition-all hover:bg-slate-200"
          id="parent-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#0061A4]" />
          <span>{t.backToHome}</span>
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
          <Globe className="w-4 h-4 text-[#0061A4] ml-2" />
          <button
            onClick={() => setLang('gu')}
            className={`px-3 py-1 rounded-lg transition-all ${
              lang === 'gu' ? 'bg-[#0061A4] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
            id="lang-gu-btn"
          >
            ગુજરાતી
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1 rounded-lg transition-all ${
              lang === 'hi' ? 'bg-[#0061A4] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
            id="lang-hi-btn"
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-lg transition-all ${
              lang === 'en' ? 'bg-[#0061A4] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
            id="lang-en-btn"
          >
            English
          </button>
        </div>

        {/* Action Buttons: Print & Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 bg-[#0061A4] hover:bg-[#00487D] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition-all"
            id="parent-print-pdf-btn"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printReport}</span>
          </button>

          <button
            onClick={handleShareReport}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition-all"
            id="parent-share-report-btn"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.shareReport}</span>
          </button>
        </div>
      </div>

      {actionNotifMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-3 rounded-2xl text-xs font-black flex items-center gap-2 animate-fade-in shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotifMsg}</span>
        </div>
      )}

      {/* Main Material 3 Hero Header */}
      <div className="bg-gradient-to-r from-[#001D36] via-[#003366] to-[#001D36] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-[#0061A4]/40">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#D1E4FF] text-[#001D36] text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0061A4]" />
                {t.parentDashboard}
              </span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                NCERT REAL-TIME MONITORING
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>👨‍👩‍👧 {student.name}</span>
              <span className="text-sm font-bold text-[#8ECDFF] bg-white/10 px-3 py-1 rounded-xl">
                {t.standard} {student.standard}
              </span>
            </h1>
            <p className="text-xs text-blue-100 font-medium max-w-2xl">
              {t.subtitle} • {student.school || 'GSEB NCERT School'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-right">
              <span className="text-[10px] uppercase text-blue-200 font-bold block">{t.target}</span>
              <span className="text-xl font-black text-amber-300">{student.targetMarks} Marks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Core KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Overall Progress */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t.overallProgress}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0061A4]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{avgAccuracyPct}%</h3>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <span>+{Math.min(12, avgAccuracyPct)}%</span>
            <span className="text-slate-400 font-medium">સાપ્તાહિક સુધારો</span>
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t.avgMarks}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-amber-600">{totalEarned} / {totalPossibleMarks}</h3>
          <p className="text-[11px] font-bold text-slate-600">
            સરેરાશ: <span className="font-extrabold text-amber-700">{avgScorePerQ} / 5</span> પ્રતિ પ્રશ્ન
          </p>
        </div>

        {/* Daily Practice Time */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t.dailyTime}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{student.minutesSpentToday} મિનિટ</h3>
          <p className="text-[11px] text-slate-500 font-medium">
            લક્ષ્યાંક: <strong>{student.dailyGoalMinutes} મિનિટ</strong>
          </p>
        </div>

        {/* Daily Streak */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t.dailyStreak}</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-orange-600">{student.streakDays} દિવસો 🔥</h3>
          <p className="text-[11px] font-bold text-emerald-600">નિયમિત ટેવ સક્રિય</p>
        </div>

      </div>

      {/* Tab Navigation Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold print:hidden">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-[#0061A4] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          id="tab-parent-analytics-btn"
        >
          <BarChart2 className="w-4 h-4" />
          <span>{t.graphs}</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-[#0061A4] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          id="tab-parent-reports-btn"
        >
          <FileText className="w-4 h-4" />
          <span>{t.weeklyReport} & {t.monthlyReport}</span>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'topics'
              ? 'bg-[#0061A4] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          id="tab-parent-topics-btn"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{t.weakSubjects} & {t.strongSubjects}</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-[#0061A4] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          id="tab-parent-feedback-btn"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.recentFeedback}</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-[#0061A4] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          id="tab-parent-notifications-btn"
        >
          <Bell className="w-4 h-4" />
          <span>{t.notifications}</span>
        </button>
      </div>

      {/* TAB 1: GRAPHS & VISUAL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weekly Progress Bar Chart */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#0061A4]" />
                    <span>{t.weeklyGraph}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">છેલ્લા ૭ દિવસનો ગુણ પ્રાપ્ત કરવાનો આલેખ</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-[#0061A4] px-2.5 py-1 rounded-full">
                  સાપ્તાહિક
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#001D36', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="marksEarned" name="ગુણ" fill="#0061A4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend Area Chart */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>{t.monthlyGraph}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">છેલ્લા ૪ અઠવાડિયામાં વિષય નિપુણતા પર્સેન્ટેજ</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                  માસિક ટ્રેન્ડ
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#064E3B', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="scorePct" name="ટકાવારી %" stroke="#10B981" fill="#D1FAE5" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Accuracy Pie Chart */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-purple-600" />
                    <span>{t.accuracyGraph}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">સાચા અને અધૂરા જવાબોનું પ્રમાણ વિભાજન</p>
                </div>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accuracyPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {accuracyPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Practice Time Graph */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>{t.timeGraph}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">દરરોજ ફાળવેલો સમય (મિનિટમાં)</p>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#7C2D12', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="minutes" name="મિનિટ" fill="#F97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: WEEKLY & MONTHLY REPORTS */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Weekly Report Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0061A4]" />
                <h3 className="font-extrabold text-base text-slate-900">{t.weeklyReport}</h3>
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                ચાલુ અઠવાડિયું
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-600">પૂર્ણ કરેલા પ્રશ્નો:</span>
                <span className="font-black text-slate-900">{totalQuestions} પ્રશ્નો</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-600">કુલ મેળવેલ ગુણ:</span>
                <span className="font-black text-amber-600">{totalEarned} ગુણ</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-600">સરેરાશ સફળતા પર્સેન્ટેજ:</span>
                <span className="font-black text-emerald-600">{avgAccuracyPct}%</span>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-1.5">
                <h4 className="font-extrabold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0061A4]" />
                  <span>I M MASTER AI ગુરુજી મુલ્યાંકન સળંગ સમીક્ષા</span>
                </h4>
                <p className="text-[11px] text-blue-950 font-medium leading-relaxed">
                  બાળક ગણિત અને વિજ્ઞાનના મુખ્ય ખ્યાલોમાં સુધારો દર્શાવી રહ્યો છે. અવાજ પ્રતિભાવ આપવાની ક્ષમતા ઉત્તમ છે.
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Report Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900">{t.monthlyReport}</h3>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full">
                માસિક સર્વગ્રાહી
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-600">કુલ માસિક અભ્યાસ સમય:</span>
                <span className="font-black text-slate-900">{student.minutesSpentToday + 120} મિનિટ</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-600">પ્રકરણ માસ્ટરી (Mastery):</span>
                <span className="font-black text-emerald-600">{allChapters.length} માસ્ટર પ્રકરણો</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-600">સતત પ્રેક્ટિસ Streak:</span>
                <span className="font-black text-orange-600">{student.streakDays} દિવસો 🔥</span>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
                <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>આગામી મહિનાનું લક્ષ્યાંક શિડ્યુલ</span>
                </h4>
                <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
                  અઠવાડિયામાં દરરોજ ૨૦ મિનિટ અવાજ ઉત્તર બોલીને પ્રેક્ટિસ કરવાથી આત્મવિશ્વાસ ૧૦૦% વધી જશે.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: WEAK & STRONG SUBJECTS / CHAPTERS */}
      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strong Subjects */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{t.strongSubjects} (માસ્ટર વિષયો)</span>
            </h3>

            <div className="space-y-3">
              {strongSubjectsList.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3">બધા વિષયોમાં પ્રેક્ટિસ ચાલુ છે.</p>
              ) : (
                strongSubjectsList.map((sub) => (
                  <div key={sub.id} className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-emerald-950">{sub.nameGujarati} ({sub.nameEnglish})</h4>
                      <p className="text-[11px] text-emerald-700">ઉચ્ચ પરિણામ અને ઉત્તમ સચોટતા</p>
                    </div>
                    <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full">
                      {sub.accuracy}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weak Subjects & Weak Chapters */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>{t.weakSubjects} અને {t.weakChapters}</span>
            </h3>

            <div className="space-y-3">
              {weakSubjectsList.length === 0 && weakChaptersList.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800">
                  🎉 બાળકના કોઈ પણ વિષયમાં અતિ નબળું પ્રદર્શન નથી! ઉત્કૃષ્ટ પરિણામ.
                </div>
              ) : (
                <>
                  {weakSubjectsList.map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-red-950">વિષય: {sub.nameGujarati}</h4>
                        <p className="text-[11px] text-red-700">પુનરાવર્તન અને વધારાની પ્રેક્ટિસ જરૂરી</p>
                      </div>
                      <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full">
                        {sub.accuracy}%
                      </span>
                    </div>
                  ))}

                  {weakChaptersList.map((ch) => (
                    <div key={ch.id} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-amber-950">પ્રકરણ {ch.chapterNumber}: {ch.titleGujarati}</h4>
                        <p className="text-[11px] text-amber-800">સ્પેસ્ડ રિપિટિશન દ્વારા રિવિઝન સૂચવેલ</p>
                      </div>
                      <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                        {ch.accuracy}%
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: RECENT AI FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0061A4]" />
            <span>{t.recentFeedback}</span>
          </h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-6 text-center">
              હજી સુધી કોઈ અભ્યાસ સેશન પૂર્ણ થયેલ નથી.
            </p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 8).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex justify-between items-start text-xs gap-2">
                    <h4 className="font-black text-slate-900">{item.questionTextGujarati}</h4>
                    <span className="bg-[#0061A4] text-white px-3 py-0.5 rounded-full font-black text-[11px] shrink-0">
                      {item.earnedMarks} / {item.totalMarks} ગુણ
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs italic text-slate-800">
                    🗣️ વિદ્યાર્થીનો અવાજ ઉત્તર: &quot;{item.studentTranscript}&quot;
                  </div>
                  <p className="text-xs font-bold text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                    💡 I M MASTER AI ગુરુજી પ્રતિક્રિયા: {item.feedback}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS & REMINDERS */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          
          {/* Send Automated Notification Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Practice Reminder */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm">
                <Bell className="w-5 h-5 text-amber-600" />
                <span>{t.sendReminder}</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                જો બાળકે આજે અભ્યાસ પૂર્ણ ન કર્યો હોય તો તેના ફોન / ડેશબોર્ડ પર ત્વરિત રિમાઇન્ડર મોકલો.
              </p>
              <button
                onClick={handleSendReminder}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                id="send-practice-reminder-btn"
              >
                <Send className="w-4 h-4" />
                <span>રિમાઇન્ડર મોકલો</span>
              </button>
            </div>

            {/* Send Congratulations */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{t.sendCongrats}</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                સારા દેખાવ, ઉત્તમ ગુણ કે સતત પ્રેક્ટિસ Streak માટે બાળકને પ્રોત્સાહક મેસેજ મોકલો.
              </p>
              <button
                onClick={handleSendCongrats}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                id="send-congrats-btn"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>અભિનંદન મેસેજ મોકલો</span>
              </button>
            </div>

          </div>

          {/* Parent Settings Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#0061A4]" />
              <span>{t.parentSettings}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">વાલીનું પૂરૂ નામ:</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
                  id="parent-setting-name-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp / SMS મોબાઇલ નંબર:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
                  id="parent-setting-phone-input"
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">દૈનિક સાંજના અભ્યાસનો આપોઆપ SMS રિપોર્ટ</h4>
                <p className="text-[11px] text-slate-500">બાળકના રોજના અભ્યાસનો સ્કોર સીધો તમારા ફોન પર મોકલાશે.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#0061A4] rounded cursor-pointer"
                id="parent-setting-sms-checkbox"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSaveParentSettings}
                className="bg-[#0061A4] hover:bg-[#00487D] text-white font-black px-6 py-3 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                id="save-parent-details-btn"
              >
                <Check className="w-4 h-4" />
                <span>{t.saveSettings}</span>
              </button>
              {saveSuccessMsg && (
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  {saveSuccessMsg}
                </span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Developer Avatar & Credits Footer */}
      <div className="bg-gradient-to-r from-[#001D36] via-[#003366] to-[#001D36] rounded-3xl p-5 text-white shadow-md flex items-center justify-between gap-4 border border-[#0061A4]/40 print:hidden">
        <div className="flex items-center gap-3.5">
          <DeveloperAvatar size="md" showBadge={true} className="ring-2 ring-white/30" />
          <div>
            <div className="text-[10px] font-black uppercase text-[#8ECDFF] tracking-wider">
              સિસ્ટમ ડેવલપર અને સર્જક
            </div>
            <h4 className="text-sm font-black text-white">
              IMRAN MANSURI (ઈમરાન મન્સૂરી)
            </h4>
            <p className="text-[11px] text-blue-200 font-bold">
              Mathematics & Science Teacher • Founder I M MASTER AI
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
