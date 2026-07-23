import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ChevronLeft, Circle, Square } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onNavigateHome: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  enabled,
  onNavigateHome,
}) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-6 my-auto">
      
      {/* Outer Smartphone Body */}
      <div className="w-full max-w-[430px] h-[880px] max-h-[95vh] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col relative overflow-hidden">
        
        {/* Status Bar */}
        <div className="bg-blue-950 text-white text-[11px] font-medium px-6 pt-2 pb-1.5 flex items-center justify-between rounded-t-[36px] z-30 shrink-0 select-none">
          {/* Time */}
          <span className="font-bold tracking-tight text-emerald-300">
            {timeString || '10:30'}
          </span>

          {/* Notch / Camera Hole */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto flex items-center justify-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
          </div>

          {/* System Icons */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-300">5G</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 bg-slate-50 overflow-y-auto relative custom-scrollbar rounded-b-[20px]">
          {children}
        </div>

        {/* Android Navigation Bar */}
        <div className="bg-slate-950 py-2.5 px-12 flex items-center justify-around rounded-b-[36px] shrink-0 text-slate-400 z-30 border-t border-slate-800">
          
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="p-1 hover:text-white transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Home Button */}
          <button
            onClick={onNavigateHome}
            className="p-1 hover:text-white transition-colors"
            title="Home"
          >
            <Circle className="w-4 h-4 fill-slate-300 text-slate-300 hover:fill-white hover:text-white" />
          </button>

          {/* Recents Button */}
          <button
            className="p-1 hover:text-white transition-colors"
            title="Recents"
          >
            <Square className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
