import React from 'react';
import { Mic, HeartHandshake, Sparkles, Award } from 'lucide-react';
import { DeveloperAvatar } from './DeveloperAvatar';

interface FooterProps {
  onOpenAboutDeveloper: () => void;
  onNavigateHome: () => void;
  onNavigateTeacher: () => void;
  onNavigateDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAboutDeveloper,
  onNavigateHome,
  onNavigateTeacher,
  onNavigateDashboard,
}) => {
  return (
    <footer className="bg-white border-t border-[#C4C6D0]/40 pt-8 pb-10 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-[#C4C6D0]/30 pb-6">
          
          {/* Col 1: App Info */}
          <div className="space-y-2 text-center md:text-left">
            <div 
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0061A4] text-white flex items-center justify-center font-bold shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-[#1A1C1E] tracking-tight group-hover:text-[#0061A4] transition-colors">
                I M MASTER Answer AI
              </h3>
            </div>
            <p className="text-xs text-[#44474E] font-medium leading-relaxed max-w-sm">
              ધોરણ ૬, ૭ અને ૮ ના ગણિત અને વિજ્ઞાનના NCERT મુખર જવાબ અભ્યાસ માટેનું સ્પેશિયલ AI પ્લેટફોર્મ.
            </p>
          </div>

          {/* Col 2: Created by IMRAN MANSURI Highlight Card */}
          <div 
            onClick={onOpenAboutDeveloper}
            className="p-4 rounded-2xl bg-[#D1E4FF]/40 hover:bg-[#D1E4FF]/70 border border-[#0061A4]/20 cursor-pointer transition-all flex items-center gap-3 justify-center md:justify-start group shadow-sm"
            id="footer-created-by-card"
          >
            <DeveloperAvatar size="md" showBadge={true} />
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-[#0061A4] tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3 text-[#006D32]" />
                Created by IMRAN MANSURI
              </span>
              <p className="font-extrabold text-xs text-[#1A1C1E] group-hover:text-[#0061A4] transition-colors">
                Mathematics & Science Teacher
              </p>
              <p className="text-[10px] text-[#006D32] font-bold">
                Founder of I M MASTER AI • imranmansuri19851@gmail.com
              </p>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3 text-xs font-bold text-[#0061A4]">
            <button 
              onClick={onNavigateHome} 
              className="hover:underline px-3 py-1.5 rounded-xl bg-[#F0F4F9] hover:bg-[#D1E4FF]"
            >
              મુખ્ય પૃષ્ઠ
            </button>
            <button 
              onClick={onNavigateDashboard} 
              className="hover:underline px-3 py-1.5 rounded-xl bg-[#F0F4F9] hover:bg-[#D1E4FF]"
            >
              પ્રોગ્રેસ બોર્ડ
            </button>
            <button 
              onClick={onNavigateTeacher} 
              className="hover:underline px-3 py-1.5 rounded-xl bg-[#F0F4F9] hover:bg-[#D1E4FF]"
            >
              શિક્ષક મોડ
            </button>
            <button 
              onClick={onOpenAboutDeveloper} 
              className="hover:underline px-3 py-1.5 rounded-xl bg-[#0061A4] text-white hover:bg-[#004F87]"
            >
              ડેવલપર પરિચય
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#44474E] font-medium text-center sm:text-left">
          <p className="flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-[#0061A4]" />
            <span>Created by IMRAN MANSURI • Mathematics & Science Teacher</span>
          </p>
          <p className="font-bold text-[#001D36]">
            © {new Date().getFullYear()} I M MASTER AI. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
