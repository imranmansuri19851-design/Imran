import React, { useEffect, useState } from 'react';
import { Sparkles, Mic, Award, ArrowRight } from 'lucide-react';
import { DeveloperAvatar } from './DeveloperAvatar';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#001D36] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none animate-fadeIn">
      
      {/* Top Tagline */}
      <div className="pt-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1E4FF] text-[#001D36] text-xs font-black shadow-md">
          <Sparkles className="w-4 h-4 text-[#0061A4]" />
          <span>NCERT 6-7-8 • Voice AI Education</span>
        </div>
      </div>

      {/* Main Branding Block */}
      <div className="flex flex-col items-center text-center max-w-md space-y-6">
        
        {/* App Logo */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-[#0061A4] border-2 border-blue-400/40 shadow-2xl flex items-center justify-center text-white ring-8 ring-blue-500/10">
            <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <span className="absolute -top-2 -right-2 bg-[#006D32] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white">
            STD 6-8
          </span>
        </div>

        {/* App Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            I M MASTER Answer AI
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 font-bold uppercase tracking-widest">
            ગણિત અને વિજ્ઞાન વોઈસ આન્સર કોચ
          </p>
        </div>

        {/* Developer Card (Created by IMRAN MANSURI) */}
        <div className="w-full bg-gradient-to-r from-white/15 via-white/10 to-amber-500/10 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-amber-300/30 shadow-2xl flex items-center gap-4 text-left">
          <DeveloperAvatar size="lg" showBadge={true} className="ring-2 ring-amber-300/60 shadow-lg" />
          
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-300/30 inline-block mb-0.5">
              સર્જક / ડેવલપર
            </span>
            <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
              Created by IMRAN MANSURI
            </h3>
            <p className="text-xs text-blue-100/90 font-medium">
              Mathematics & Science Teacher
            </p>
            <p className="text-xs text-emerald-300 font-bold">
              Founder of I M MASTER AI
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Loading Progress & Enter Button */}
      <div className="w-full max-w-xs space-y-4 pb-6 text-center">
        
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-blue-200 font-bold">
            <span>લોડ થઈ રહ્યું છે...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {progress >= 100 ? (
          <button
            onClick={onFinish}
            className="w-full py-3.5 rounded-2xl bg-[#0061A4] hover:bg-[#004F87] text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 border border-blue-400/30 animate-bounce"
            id="splash-enter-app-btn"
          >
            <span>અભ્યાસ શરૂ કરો (Start)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <p className="text-[11px] text-blue-300/80 font-medium">
            તમારો વ્યક્તિગત AI આન્સર કોચ તૈયાર થઈ રહ્યો છે...
          </p>
        )}

      </div>

    </div>
  );
};
