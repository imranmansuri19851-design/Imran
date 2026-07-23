import React, { useState } from 'react';
import { 
  User, 
  School, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Award, 
  Target, 
  Brain, 
  CheckCircle2, 
  ArrowRight,
  Languages,
  Clock
} from 'lucide-react';
import { 
  StudentProfile, 
  Standard, 
  MediumType, 
  LearningStyleType, 
  TargetMarksType 
} from '../types';
import { saveStudentProfileToFirestore } from '../services/firebaseService';

interface StudentRegistrationScreenProps {
  currentProfile: StudentProfile;
  onCompleteRegistration: (updatedProfile: StudentProfile) => void;
  onCancel?: () => void;
}

export const StudentRegistrationScreen: React.FC<StudentRegistrationScreenProps> = ({
  currentProfile,
  onCompleteRegistration,
  onCancel
}) => {
  const [name, setName] = useState(currentProfile.name || '');
  const [standard, setStandard] = useState<Standard>(currentProfile.standard || 7);
  const [school, setSchool] = useState(currentProfile.school || 'સરકારી માધ્યમિક શાળા / પ્રાઈવેટ શાળા');
  const [medium, setMedium] = useState<MediumType>(currentProfile.medium || 'Gujarati');
  const [age, setAge] = useState<number>(currentProfile.age || 12);
  const [learningStyle, setLearningStyle] = useState<LearningStyleType>(currentProfile.learningStyle || 'Auditory');
  const [targetMarks, setTargetMarks] = useState<TargetMarksType>(currentProfile.targetMarks || '90%');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      name: name.trim(),
      standard,
      school: school.trim(),
      medium,
      age: Number(age),
      learningStyle,
      targetMarks,
      isLoggedIn: true,
      updatedAt: new Date().toISOString()
    };

    try {
      // Save directly to Firebase Firestore!
      const firestoreId = await saveStudentProfileToFirestore(updatedProfile);
      updatedProfile.id = firestoreId;

      setSuccessMessage('વિદ્યાર્થી નોંધણી ફાયરબેઝમાં સફળતાપૂર્વક સચવાઈ ગઈ!');
      setTimeout(() => {
        onCompleteRegistration(updatedProfile);
      }, 800);
    } catch (err) {
      console.error('Registration save error:', err);
      // Still proceed locally
      onCompleteRegistration(updatedProfile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-[#0061A4] text-white rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D1E4FF] text-[#001D36] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#0061A4]" />
            વિદ્યાર્થી પ્રોફાઇલ રજીસ્ટ્રેશન (Student Registration)
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            નવા વિદ્યાર્થી ખાતાની નોંધણી 🎓
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
            તમારું નામ, ધોરણ, શાળા, અને ભણવાની શૈલી પસંદ કરો. આ બધી માહિતી તમારા Firebase Firestore એકાઉન્ટમાં સેવ થશે.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-black flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-6 sm:p-8 shadow-md border border-[#C4C6D0]/40 space-y-6">
        
        {/* 1. Student Name */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#0061A4]" />
            વિદ્યાર્થીનું નામ (Full Name) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="દા.ત. કશિશ મનસુરી"
            className="w-full px-4 py-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 font-bold text-sm text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#0061A4] focus:bg-white transition-all"
          />
        </div>

        {/* 2. Standard Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#0061A4]" />
            ધોરણ (Standard) <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-3 gap-3">
            {([6, 7, 8] as Standard[]).map((std) => (
              <button
                type="button"
                key={std}
                onClick={() => setStandard(std)}
                className={`py-3.5 px-4 rounded-2xl border font-black text-sm transition-all flex flex-col items-center gap-1 ${
                  standard === std
                    ? 'bg-[#0061A4] text-white border-[#0061A4] shadow-md scale-[1.02]'
                    : 'bg-[#F0F4F9] text-[#44474E] border-[#C4C6D0]/40 hover:bg-[#E1E2EC]'
                }`}
              >
                <span>ધોરણ {std}</span>
                <span className="text-[10px] opacity-80 font-medium">Std {std} NCERT</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. School Name & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-[#0061A4]" />
              શાળાનું નામ (School Name)
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="તમારી શાળાનું નામ દાખલ કરો"
              className="w-full px-4 py-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 font-bold text-sm text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#0061A4] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0061A4]" />
              ઉંમર (Age)
            </label>
            <input
              type="number"
              min={8}
              max={18}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-[#F0F4F9] border border-[#C4C6D0]/40 font-bold text-sm text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#0061A4] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 4. Medium Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#0061A4]" />
            અભ્યાસનું માધ્યમ (Medium)
          </label>

          <div className="grid grid-cols-2 gap-3">
            {(['Gujarati', 'English'] as MediumType[]).map((med) => (
              <button
                type="button"
                key={med}
                onClick={() => setMedium(med)}
                className={`py-3 px-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  medium === med
                    ? 'bg-[#006D32] text-white border-[#006D32] shadow-sm'
                    : 'bg-[#F0F4F9] text-[#44474E] border-[#C4C6D0]/40 hover:bg-[#E1E2EC]'
                }`}
              >
                <span>{med === 'Gujarati' ? 'ગુજરાતી માધ્યમ' : 'English Medium'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Learning Style Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#0061A4]" />
            ભણવાની મનપસંદ શૈલી (Learning Style)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Auditory', title: 'શ્રાવ્ય (Auditory)', desc: 'અવાજ સાંભળીને' },
              { id: 'Visual', title: 'દ્રશ્ય (Visual)', desc: 'ચિત્રો જોઈને' },
              { id: 'Kinesthetic', title: 'પ્રાયોગિક (Kinesthetic)', desc: 'કરીને શીખવું' },
              { id: 'Reading-Writing', title: 'વાંચન-લેખન', desc: 'નોટ્સ બનાવીને' },
            ].map((style) => (
              <button
                type="button"
                key={style.id}
                onClick={() => setLearningStyle(style.id as LearningStyleType)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  learningStyle === style.id
                    ? 'bg-[#D1E4FF] border-[#0061A4] text-[#001D36] ring-2 ring-[#0061A4]'
                    : 'bg-[#F0F4F9] border-[#C4C6D0]/40 text-[#44474E] hover:bg-[#E1E2EC]'
                }`}
              >
                <p className="font-extrabold text-xs">{style.title}</p>
                <p className="text-[10px] text-[#44474E] mt-0.5">{style.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Target Marks */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-[#006D32]" />
            ટાર્ગેટ માર્ક્સ (Target Marks Goal)
          </label>

          <div className="grid grid-cols-4 gap-2">
            {(['80%', '90%', '95%', '100%'] as TargetMarksType[]).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setTargetMarks(m)}
                className={`py-3 rounded-2xl border font-black text-xs transition-all ${
                  targetMarks === m
                    ? 'bg-[#006D32] text-white border-[#006D32] shadow-sm'
                    : 'bg-[#F0F4F9] text-[#44474E] border-[#C4C6D0]/40 hover:bg-[#E1E2EC]'
                }`}
              >
                {m} ગુણ
              </button>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#C4C6D0]/30">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-2xl bg-[#F0F4F9] hover:bg-[#E1E2EC] text-[#44474E] font-bold text-xs transition-all"
            >
              રદ કરો (Cancel)
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-[#0061A4] hover:bg-[#004F87] text-white font-black text-xs shadow-lg transition-all flex items-center gap-2 border border-blue-400/30 disabled:opacity-50"
            id="save-student-registration-btn"
          >
            <span>{isSubmitting ? 'સેવ થઈ રહ્યું છે...' : 'રજીસ્ટ્રેશન સેવ કરો (Save Profile)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
