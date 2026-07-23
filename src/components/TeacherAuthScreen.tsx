import React, { useState } from 'react';
import { 
  BookOpen, 
  Lock, 
  Mail, 
  UserCheck, 
  School, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  KeyRound,
  Zap
} from 'lucide-react';
import { TeacherProfile } from '../types';
import { saveTeacherToFirestore, getTeacherFromFirestore } from '../services/firebaseService';

interface TeacherAuthScreenProps {
  onLoginSuccess: (teacher: TeacherProfile) => void;
  onBackToHome: () => void;
}

export const TeacherAuthScreen: React.FC<TeacherAuthScreenProps> = ({
  onLoginSuccess,
  onBackToHome
}) => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [email, setEmail] = useState('teacher@school.com');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickDemoLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const demoTeacher: TeacherProfile = {
        id: 'teacher_demo_master',
        email: 'teacher@school.com',
        name: 'ઈમરાન મન્સૂરી (Master Teacher)',
        school: 'I M MASTER AI School',
        pin: '1234',
        isLoggedIn: true
      };
      await saveTeacherToFirestore(demoTeacher);
      onLoginSuccess(demoTeacher);
    } catch (err) {
      console.error('Demo teacher login error:', err);
      setError('લૉગિન કરવામાં ક્ષતિ આવી.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !pin.trim()) {
      setError('કૃપા કરીને ઈમેઈલ અને ૪ અંકનો PIN દાખલ કરો.');
      return;
    }

    if (pin.length < 4) {
      setError('PIN ઓછામાં ઓછો ૪ અંકનો હોવો જોઈએ.');
      return;
    }

    if (isSignupMode && (!name.trim() || !school.trim())) {
      setError('કૃપા કરીને તમારું નામ અને શાળાનું નામ દાખલ કરો.');
      return;
    }

    setIsSubmitting(true);

    try {
      const teacherId = `teacher_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

      if (!isSignupMode) {
        // Try fetching existing teacher to check PIN
        const existingTeacher = await getTeacherFromFirestore(teacherId);
        if (existingTeacher && existingTeacher.pin && existingTeacher.pin !== pin) {
          setError('ખોટો PIN દાખલ કર્યો છે! કૃપા કરીને સાચો PIN લખો.');
          setIsSubmitting(false);
          return;
        }
      }

      const teacherObj: TeacherProfile = {
        id: teacherId,
        email: email.trim(),
        name: isSignupMode ? name.trim() : (name.trim() || 'IMRAN MANSURI'),
        school: isSignupMode ? school.trim() : (school.trim() || 'I M MASTER AI Academy'),
        pin: pin.trim(),
        isLoggedIn: true
      };

      // Save to Firebase Firestore
      await saveTeacherToFirestore(teacherObj);

      onLoginSuccess(teacherObj);
    } catch (err) {
      console.error('Teacher auth error:', err);
      setError('લૉગિન કરવામાં ક્ષતિ આવી. પુનઃ પ્રયાસ કરો.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-[#0061A4] text-white rounded-[32px] p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center text-white shadow-inner">
          <BookOpen className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase bg-[#D1E4FF] text-[#001D36] px-3 py-1 rounded-full">
            શિક્ષક પોર્ટલ (Teacher Content Management System)
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            {isSignupMode ? 'નવા શિક્ષક રજીસ્ટ્રેશન 📝' : 'શિક્ષક સુરક્ષિત PIN પ્રવેશ 🔐'}
          </h2>
          <p className="text-xs text-blue-100 font-medium mt-1">
            NCERT પ્રકરણો, પ્રશ્નો, આદર્શ કી-પોઈન્ટ્સ, માર્ક્સ અને મીડિયા મેનેજ કરવા પ્રવેશો.
          </p>
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-md border border-[#C4C6D0]/40 space-y-5">
        
        {/* Toggle Login / Signup */}
        <div className="flex bg-[#F0F4F9] p-1 rounded-2xl border border-[#C4C6D0]/30 text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsSignupMode(false)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              !isSignupMode
                ? 'bg-white text-[#0061A4] shadow-sm font-black'
                : 'text-[#44474E] hover:text-[#0061A4]'
            }`}
          >
            PIN લૉગિન
          </button>
          <button
            type="button"
            onClick={() => setIsSignupMode(true)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              isSignupMode
                ? 'bg-white text-[#0061A4] shadow-sm font-black'
                : 'text-[#44474E] hover:text-[#0061A4]'
            }`}
          >
            નવું એકાઉન્ટ
          </button>
        </div>

        {/* Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={isSubmitting}
          className="w-full p-3.5 bg-gradient-to-r from-[#FFD941] to-amber-300 hover:from-amber-300 hover:to-amber-400 text-[#241E00] font-black text-xs rounded-2xl border border-amber-400 shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#241E00]" />
            <span>ઇન્સ્ટન્ટ ડેમો PIN પ્રવેશ (PIN: 1234)</span>
          </div>
          <ArrowRight className="w-4 h-4" />
        </button>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignupMode && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#0061A4]" />
                  શિક્ષકનું નામ (Teacher Name)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="દા.ત. ઈમરાન મન્સૂરી / IMRAN MANSURI"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 font-bold text-xs text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-[#0061A4]" />
                  શાળા / સંસ્થાનું નામ (School Name)
                </label>
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="તમારી શાળા અથવા ટ્યુશનનું નામ"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 font-bold text-xs text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0061A4]" />
              ઈમેઈલ આઈડી (Teacher Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              className="w-full px-4 py-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 font-bold text-xs text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#0061A4]" />
              સુરક્ષિત ૪-અંક PIN (Teacher Secret PIN)
            </label>
            <input
              type="password"
              required
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="દા.ત. 1234"
              className="w-full px-4 py-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 font-bold text-base text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#0061A4] tracking-widest text-center"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#0061A4] hover:bg-[#004F87] text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 border border-blue-400/30"
              id="teacher-login-submit-btn"
            >
              <span>{isSubmitting ? 'ચકાસી રહ્યા છીએ...' : (isSignupMode ? 'નવું એકાઉન્ટ બનાવો' : 'શિક્ષક ડેશબોર્ડમાં પ્રવેશો')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs font-bold text-[#44474E] hover:text-[#0061A4] transition-colors"
          >
            ← હોમ સ્ક્રીન પર પાછા જાવ
          </button>
        </div>

      </div>

    </div>
  );
};

