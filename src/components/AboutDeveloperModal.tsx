import React from 'react';
import { X, Award, BookOpen, Sparkles, GraduationCap, Code, CheckCircle2, HeartHandshake, PhoneCall, Mail } from 'lucide-react';
import { DeveloperAvatar } from './DeveloperAvatar';

interface AboutDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDeveloperModal: React.FC<AboutDeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-[#C4C6D0]/40 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#004B82] via-[#0061A4] to-[#001D36] text-white p-7 relative flex flex-col items-center text-center space-y-4 shadow-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-sm"
            id="close-about-developer-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Developer Photo */}
          <DeveloperAvatar size="xl" showBadge={true} className="shadow-2xl ring-4 ring-amber-400/80 my-1" />

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              ડેવલપર પરિચય (Founder & Creator)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              IMRAN MANSURI
            </h2>
            <p className="text-sm text-emerald-200 font-extrabold tracking-wide">
              ઈમરાન મન્સૂરી • Mathematics & Science Teacher
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar bg-[#F0F4F9]/50">
          
          {/* Key Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#C4C6D0]/40 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-[#0061A4]">
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">હોદ્દો (Role)</span>
              </div>
              <p className="font-extrabold text-sm text-[#1A1C1E]">
                Mathematics & Science Teacher
              </p>
              <p className="text-[11px] text-[#44474E] font-medium">
                ગણિત અને વિજ્ઞાન વિષય નિષ્ણાત
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#C4C6D0]/40 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-[#006D32]">
                <Award className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">સ્થાપક (Founder)</span>
              </div>
              <p className="font-extrabold text-sm text-[#1A1C1E]">
                Founder of I M MASTER AI
              </p>
              <p className="text-[11px] text-[#44474E] font-medium">
                આઈ એમ માસ્ટર AI ના સંસ્થાપક
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="p-4 rounded-2xl bg-[#D1E4FF]/60 border border-[#0061A4]/20 space-y-2">
            <h3 className="font-extrabold text-xs text-[#001D36] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#0061A4]" />
              મિશન અને વિઝન (Mission)
            </h3>
            <p className="text-xs text-[#1A1C1E] font-medium leading-relaxed">
              "ગુજરાતી માધ્યમના ધોરણ ૬, ૭ અને ૮ ના વિદ્યાર્થીઓ પોતાના ઘરબેઠા અવાજથી બોલીને ગણિત અને વિજ્ઞાનના મુખર પ્રશ્નોનો મહાવરો કરી શકે અને AI ટેકનોલોજી દ્વારા ત્વરિત સાચું માર્ગદર્શન મેળવી શકે તે હેતુથી આ 'I M MASTER Answer AI' બનાવવામાં આવી છે."
            </p>
          </div>

          {/* Key Achievements & Features */}
          <div className="space-y-2.5 bg-white rounded-2xl p-4 border border-[#C4C6D0]/40 shadow-sm">
            <h4 className="font-extrabold text-xs text-[#1A1C1E] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006D32]" />
              એપ્લિકેશનની મુખ્ય લાક્ષણિકતાઓ
            </h4>

            <ul className="space-y-2 text-xs text-[#44474E] font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4] mt-1.5 shrink-0" />
                <span>NCERT ધોરણ ૬, ૭ અને ૮ ના ગણિત અને વિજ્ઞાનના પ્રકરણ મુજબ કી-પોઈન્ટ્સ.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4] mt-1.5 shrink-0" />
                <span>અવાજથી જવાબ આપી ગુણ મેળવવાની લાઈવ સ્પીચ સુવિધા.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4] mt-1.5 shrink-0" />
                <span>શિક્ષકો માટે પોતાના નવા પ્રશ્નો અને આદર્શ કી-પોઈન્ટ્સ ઉમેરવાનો શિક્ષક મોડ.</span>
              </li>
            </ul>
          </div>

          {/* Developer Contact & Email */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#C4C6D0]/40 shadow-sm space-y-1.5 text-center">
            <span className="text-[10px] font-black text-[#0061A4] uppercase tracking-wider flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#0061A4]" />
              સંપર્ક ઈમેઈલ (Developer Contact)
            </span>
            <a 
              href="mailto:imranmansuri19851@gmail.com"
              className="inline-block font-extrabold text-xs text-[#0061A4] hover:underline bg-[#D1E4FF]/60 px-3 py-1.5 rounded-xl border border-[#0061A4]/30"
            >
              imranmansuri19851@gmail.com
            </a>
          </div>

          {/* Footer Contact */}
          <div className="text-center pt-1 space-y-1">
            <p className="text-[11px] font-bold text-[#0061A4] flex items-center justify-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              Created by IMRAN MANSURI • Mathematics & Science Teacher
            </p>
            <p className="text-[10px] text-[#44474E]">
              Founder: I M MASTER AI • All Rights Reserved
            </p>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-4 bg-white border-t border-[#C4C6D0]/40">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#0061A4] hover:bg-[#004F87] text-white font-black text-xs shadow-md transition-all"
            id="close-about-modal-action-btn"
          >
            બંધ કરો (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
