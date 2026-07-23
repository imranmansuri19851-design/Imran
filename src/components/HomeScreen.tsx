import React from 'react';
import { StudentProfile, Standard, SubjectId } from '../types';
import { SUBJECTS } from '../data/ncertContent';
import { 
  Sparkles, 
  FlaskConical, 
  Globe, 
  BookOpen, 
  Calculator, 
  Play, 
  Award, 
  Mic, 
  CheckCircle2, 
  Flame,
  UserCheck
} from 'lucide-react';
import { DeveloperAvatar } from './DeveloperAvatar';

interface HomeScreenProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onStartPractice: () => void;
  onOpenVoiceTeacher: () => void;
  onOpenDashboard: () => void;
  onOpenTeacher: () => void;
  onOpenParent?: () => void;
  onOpenAboutDeveloper: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onUpdateProfile,
  onStartPractice,
  onOpenVoiceTeacher,
  onOpenDashboard,
  onOpenTeacher,
  onOpenParent,
  onOpenAboutDeveloper,
}) => {
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#003B68] via-[#0061A4] to-[#00677D] text-white p-6 sm:p-10 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-[#006D32]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Top Bar inside Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>NCERT Medium (Std 6, 7, 8)</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Top Right Developer Profile Link */}
              <div 
                onClick={onOpenAboutDeveloper}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 text-xs font-extrabold cursor-pointer transition-all shadow-xs group"
                title="IMRAN MANSURI • Click for About Developer"
                id="home-top-right-dev-photo"
              >
                <DeveloperAvatar size="sm" showBadge={true} />
                <span className="text-white hidden sm:inline group-hover:underline">
                  IMRAN MANSURI
                </span>
              </div>

              {/* Streak and Marks Badge */}
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-black">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Flame className="w-4 h-4 fill-amber-300" />
                  {profile.streakDays}d Streak
                </span>
                <span className="text-white/30">|</span>
                <span className="text-emerald-300">
                  {profile.totalMarksEarned} Marks
                </span>
              </div>
            </div>
          </div>

          {/* App Header & Developer Card */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                I M MASTER Answer AI
              </h1>
              <p className="text-xs sm:text-sm text-cyan-200 font-extrabold uppercase tracking-widest">
                Mathematics & Science Voice Answer AI Platform
              </p>
            </div>

            {/* Developer Banner Card */}
            <div 
              onClick={onOpenAboutDeveloper}
              className="bg-gradient-to-r from-white/15 via-white/10 to-amber-500/10 hover:from-white/20 hover:to-amber-500/20 backdrop-blur-md border border-amber-300/30 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 max-w-xl group shadow-md hover:shadow-xl hover:border-amber-300/50"
              id="created-by-imran-mansuri-card"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <DeveloperAvatar size="md" showBadge={true} className="ring-2 ring-amber-300/60 shadow-md" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-amber-300 tracking-wider bg-amber-400/20 px-2.5 py-0.5 rounded-md border border-amber-300/30">
                      Developer & Founder
                    </span>
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors tracking-tight">
                    Created by IMRAN MANSURI
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-snug">
                    Mathematics & Science Teacher • Founder of I M MASTER AI
                  </p>
                </div>
              </div>

              <span className="text-xs font-black bg-gradient-to-r from-[#006D32] to-emerald-700 hover:from-[#005225] hover:to-emerald-800 text-white px-4 py-2 rounded-xl shrink-0 hidden sm:inline-flex items-center gap-1.5 shadow-sm transition-all duration-200 group-hover:translate-x-0.5">
                Profile →
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight pt-1">
              Welcome, <span className="text-emerald-300">{profile.name.split(' ')[0]}</span>! 👋
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              લખીને નહિ, હવે બોલીને મોટો જવાબ યાદ રાખો! તમારા અવાજમાં જવાબ રેકોર્ડ કરો અને I M MASTER AI ગુરુજી પાસેથી ત્વરિત માર્ગદર્શન મેળવો.
            </p>
          </div>

          {/* Student Name Quick Edit Input */}
          <div className="pt-1 max-w-md">
            <label className="block text-xs font-bold text-cyan-100 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              Student Name:
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              placeholder="Enter student name..."
              className="w-full px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm font-bold transition-all"
              id="student-name-input"
            />
          </div>
        </div>
      </div>

      {/* Main Selection & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Standard and Subject Selectors */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Select Standard */}
          <div className="bg-white rounded-[28px] p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#0061A4] text-white font-black flex items-center justify-center text-xs shadow-xs">
                  1
                </span>
                Select Standard
              </h3>
              <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">NCERT Textbook</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {([6, 7, 8] as Standard[]).map((std) => {
                const isSelected = profile.standard === std;
                return (
                  <button
                    key={std}
                    onClick={() => onUpdateProfile({ standard: std })}
                    className={`relative p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-[#0061A4] bg-blue-50/80 text-[#001D36] shadow-xs ring-2 ring-[#0061A4]/20 font-black'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800 font-bold'
                    }`}
                    id={`select-std-${std}-btn`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#0061A4] absolute top-2 right-2" />
                    )}
                    <span className="text-2xl font-black tracking-tight text-[#0061A4]">
                      ધોરણ {std === 6 ? '૬' : std === 7 ? '૭' : '૮'}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">Std {std}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Subject */}
          <div className="bg-white rounded-[28px] p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#006D32] text-white font-black flex items-center justify-center text-xs shadow-xs">
                  2
                </span>
                Select Subject
              </h3>
              <span className="text-xs text-[#006D32] font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Std {profile.standard} Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBJECTS.map((sub) => {
                const isSelected = profile.selectedSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onUpdateProfile({ selectedSubject: sub.id as SubjectId })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#006D32] bg-emerald-50/80 text-slate-900 shadow-xs ring-2 ring-[#006D32]/20 font-black'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800'
                    }`}
                    id={`select-subject-${sub.id}-btn`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: sub.bgLight, color: sub.color }}
                      >
                        {getSubjectIcon(sub.icon)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {sub.nameGujarati}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-semibold">
                          {sub.nameEnglish}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#006D32] text-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Big Start Practice Button */}
          <div>
            <button
              onClick={onStartPractice}
              className="w-full py-4 px-6 rounded-2xl bg-[#0061A4] hover:bg-[#004F87] text-white font-black text-lg sm:text-xl shadow-md hover:scale-[1.005] active:scale-[0.995] transition-all flex items-center justify-center gap-3 group border border-white/10"
              id="start-practice-primary-btn"
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#0061A4] flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xs">
                <Mic className="w-5 h-5 text-[#0061A4]" />
              </div>
              <span>Start Practice</span>
              <Play className="w-5 h-5 fill-white text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Right Col: Quick Access Cards & Stats */}
        <div className="space-y-6">
          
          {/* AI Learning Intelligence System Card */}
          <div 
            onClick={onOpenDashboard}
            className="bg-gradient-to-br from-[#003B68] to-[#0061A4] text-white rounded-[28px] p-6 shadow-md border border-blue-400/30 hover:border-blue-300 transition-all cursor-pointer space-y-4 group relative overflow-hidden"
            id="home-ai-intelligence-card"
          >
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-black uppercase text-cyan-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                AI Learning Intelligence
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-xs">
                <Award className="w-5 h-5 text-slate-900" />
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <h3 className="font-black text-xl text-white group-hover:text-cyan-200 transition-colors flex items-center gap-2">
                🧠 Progress Dashboard
              </h3>
              <p className="text-xs text-blue-100 font-medium leading-relaxed">
                નબળા વિષયો, સ્પેસ્ડ રિપિટિશન, દૈનિક પ્રેક્ટિસ પ્લાન અને માસિક પ્રગતિ રિપોર્ટ.
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs font-black text-cyan-200 group-hover:translate-x-1 transition-transform relative z-10">
              <span>View Analytics →</span>
              <span className="bg-white text-[#0061A4] px-3 py-1 rounded-xl shadow-xs text-[11px]">
                Open Dashboard
              </span>
            </div>
          </div>

          {/* Voice AI Teacher Card */}
          <div 
            onClick={onOpenVoiceTeacher}
            className="bg-gradient-to-br from-[#004B80] to-[#00677D] text-white rounded-[28px] p-6 shadow-md border border-cyan-300/30 hover:border-cyan-200 transition-all cursor-pointer space-y-4 group relative overflow-hidden"
            id="home-voice-ai-teacher-card"
          >
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-black uppercase text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Special Mode
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-slate-900 flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-xs">
                <Mic className="w-5 h-5 text-slate-900" />
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <h3 className="font-black text-xl text-white group-hover:text-emerald-200 transition-colors flex items-center gap-2">
                🎙 Voice AI Teacher
              </h3>
              <p className="text-xs text-cyan-100 font-medium leading-relaxed">
                અવાજથી સીધો પ્રશ્ન પૂછો! ધોરણ ૬-૮ NCERT ગણિત અને વિજ્ઞાનનો જવાબ અવાજમાં સાંભળો.
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs font-black text-emerald-300 group-hover:translate-x-1 transition-transform relative z-10">
              <span>Start Speaking →</span>
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-xl shadow-xs text-[11px]">
                Mic On
              </span>
            </div>
          </div>

          {/* Teacher Mode Access Card */}
          <div 
            onClick={onOpenTeacher}
            className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200 hover:border-[#0061A4] transition-all cursor-pointer space-y-2 group"
            id="home-teacher-mode-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0061A4] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Teacher Portal
              </span>
              <BookOpen className="w-5 h-5 text-[#0061A4] group-hover:scale-105 transition-transform" />
            </div>
            <h4 className="font-black text-slate-900 text-base group-hover:text-[#0061A4] transition-colors">
              Teacher Mode: Add Questions 📝
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              તમારા શાળા કે ટ્યુશન માટે નવો NCERT પ્રશ્ન, આદર્શ કી-પોઈન્ટ્સ અને ગુણ ઉમેરો.
            </p>
          </div>

          {/* Parent Mode Access Card */}
          {onOpenParent && (
            <div 
              onClick={onOpenParent}
              className="bg-amber-50/60 rounded-[28px] p-6 shadow-xs border border-amber-200/80 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
              id="home-parent-mode-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-900 bg-amber-200/70 px-3 py-1 rounded-full">
                  Parent Analytics
                </span>
                <UserCheck className="w-5 h-5 text-amber-700 group-hover:scale-105 transition-transform" />
              </div>
              <h4 className="font-black text-slate-900 text-base group-hover:text-amber-800 transition-colors">
                Parent Mode: Progress Reports 👨‍👩‍👧‍👦
              </h4>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                ઓવરઓલ સ્કોર, સાપ્તાહિક/માસિક આલેખ, દૈનિક સમય અને શૈક્ષણિક નોટિસ રિપોર્ટ જુઓ.
              </p>
            </div>
          )}

          {/* Daily Progress Widget */}
          <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Daily Goal
              </h3>
              <button 
                onClick={onOpenDashboard}
                className="text-xs text-[#0061A4] font-extrabold hover:underline"
                id="view-full-dashboard-link"
              >
                View Analytics →
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>15 Mins Daily Voice Practice</span>
                <span className="text-[#0061A4] font-black">{profile.minutesSpentToday} / 15 Mins</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                <div 
                  className="h-full bg-[#006D32] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (profile.minutesSpentToday / 15) * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="block text-xl font-black text-[#0061A4]">
                  {profile.totalQuestionsAnswered}
                </span>
                <span className="text-[11px] text-slate-600 font-bold">Questions Practiced</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="block text-xl font-black text-[#006D32]">
                  {profile.totalMarksEarned}
                </span>
                <span className="text-[11px] text-slate-600 font-bold">Total Marks</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

