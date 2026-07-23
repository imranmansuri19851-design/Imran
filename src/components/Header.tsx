import React from 'react';
import { Mic, Smartphone, Monitor, ShieldCheck, Flame, BookOpen, Crown, Bell, Gift, Brain, UserCheck } from 'lucide-react';
import { StudentProfile } from '../types';
import { DeveloperAvatar } from './DeveloperAvatar';

interface HeaderProps {
  profile: StudentProfile;
  isAndroidFrame: boolean;
  onToggleAndroidFrame: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateVoiceTeacher: () => void;
  onNavigateTeacher: () => void;
  onNavigateParent: () => void;
  onNavigateAdmin: () => void;
  onOpenSubscription: () => void;
  onOpenReferral: () => void;
  onOpenNotifications: () => void;
  onOpenAIMemory: () => void;
  onOpenAboutDeveloper: () => void;
  currentScreen: string;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isAndroidFrame,
  onToggleAndroidFrame,
  onOpenProfile,
  onOpenAuth,
  onNavigateHome,
  onNavigateDashboard,
  onNavigateVoiceTeacher,
  onNavigateTeacher,
  onNavigateParent,
  onNavigateAdmin,
  onOpenSubscription,
  onOpenReferral,
  onOpenNotifications,
  onOpenAIMemory,
  onOpenAboutDeveloper,
  currentScreen,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* App Title / Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group"
          id="header-app-logo"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0061A4] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-2">
              I M MASTER Answer AI
              <span className="text-[10px] bg-[#D1E4FF] text-[#001D36] border border-[#0061A4]/20 px-2 py-0.5 rounded-full font-bold hidden lg:inline-block">
                NCERT 6-7-8
              </span>
            </h1>
            <p className="text-[10px] text-[#006D32] font-black uppercase tracking-wider hidden sm:block">
              Created by IMRAN MANSURI
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* Home Nav */}
          <button
            onClick={onNavigateHome}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'home'
                ? 'bg-[#0061A4] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            id="nav-home-btn"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Voice AI Teacher Link */}
          <button
            onClick={onNavigateVoiceTeacher}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border shadow-xs ${
              currentScreen === 'voice-teacher'
                ? 'bg-gradient-to-r from-[#006D32] to-[#0061A4] text-white border-emerald-400'
                : 'bg-emerald-50 text-[#006D32] border-emerald-300 hover:bg-emerald-100'
            }`}
            id="nav-voice-teacher-btn"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice AI</span>
          </button>

          {/* Progress Dashboard */}
          <button
            onClick={onNavigateDashboard}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'dashboard'
                ? 'bg-[#0061A4] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            id="nav-dashboard-btn"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Progress</span>
            <span className="bg-[#006D32] text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
              {profile.streakDays}d
            </span>
          </button>

          {/* Parent Portal Nav */}
          <button
            onClick={onNavigateParent}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'parent'
                ? 'bg-amber-100 text-amber-950 shadow-xs border border-amber-300'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
            id="nav-parent-btn"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Parents</span>
          </button>

          {/* Teacher Nav */}
          <button
            onClick={onNavigateTeacher}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'teacher'
                ? 'bg-[#0061A4] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            id="nav-teacher-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Teachers</span>
          </button>

          {/* Admin Nav */}
          <button
            onClick={onNavigateAdmin}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              currentScreen === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            id="nav-admin-btn"
          >
            <span>⚙️</span>
            <span className="hidden xl:inline">Admin</span>
          </button>

          {/* AI Memory Revision Trigger */}
          <button
            onClick={onOpenAIMemory}
            title="AI Memory Revision"
            className="p-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#00677D] transition-all flex items-center gap-1 text-xs font-extrabold border border-cyan-200 shadow-xs"
            id="header-ai-memory-btn"
          >
            <Brain className="w-3.5 h-3.5 text-[#00677D]" />
            <span className="hidden md:inline">Memory</span>
          </button>

          {/* Referral Button */}
          <button
            onClick={onOpenReferral}
            title="Invite Friends"
            className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 transition-all flex items-center gap-1 text-xs font-extrabold border border-purple-200 shadow-xs"
            id="header-referral-btn"
          >
            <Gift className="w-3.5 h-3.5 text-purple-700" />
            <span className="hidden lg:inline">Invite</span>
          </button>

          {/* Subscription Button */}
          <button
            onClick={onOpenSubscription}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs transition-all flex items-center gap-1 shadow-xs"
            id="header-subscription-btn"
          >
            <Crown className="w-3.5 h-3.5 text-yellow-200" />
            <span>{profile.plan ? profile.plan.toUpperCase() : 'PREMIUM'}</span>
          </button>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative"
            id="header-notification-btn"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
              1
            </span>
          </button>

          {/* Developer Profile Quick Button */}
          <button
            onClick={onOpenAboutDeveloper}
            title="IMRAN MANSURI (Mathematics & Science Teacher)"
            className="flex items-center gap-1 p-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
            id="header-dev-profile-btn"
          >
            <DeveloperAvatar size="sm" showBadge={false} />
          </button>

          {/* Android Frame View Toggle */}
          <button
            onClick={onToggleAndroidFrame}
            title={isAndroidFrame ? "Switch to Full Screen View" : "Switch to Android Frame"}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            id="toggle-android-frame-btn"
          >
            {isAndroidFrame ? (
              <Monitor className="w-4 h-4 text-[#0061A4]" />
            ) : (
              <Smartphone className="w-4 h-4 text-[#006D32]" />
            )}
          </button>

          {/* User Profile Badge / Auth Button */}
          <button
            onClick={profile.isLoggedIn ? onOpenProfile : onOpenAuth}
            className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition-all text-xs font-bold text-slate-800"
            id="user-profile-badge-btn"
          >
            <div className="w-6 h-6 rounded-full bg-[#0061A4] text-white font-black flex items-center justify-center text-[10px] shadow-xs">
              {profile.name.charAt(0)}
            </div>
            <span className="max-w-[70px] truncate hidden sm:inline">
              Profile
            </span>
            {profile.isLoggedIn && (
              <ShieldCheck className="w-3.5 h-3.5 text-[#006D32]" />
            )}
          </button>

        </div>

      </div>
    </header>
  );
};

