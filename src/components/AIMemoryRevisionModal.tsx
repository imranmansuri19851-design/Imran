import React, { useState } from 'react';
import { Standard, SubjectId } from '../types';

interface AIMemoryRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  standard: Standard;
  subject: SubjectId;
}

const MEMORY_CARDS = [
  {
    id: 'm1',
    topicGujarati: 'પ્રાણીઓમાં પોષણ અને પાચન માર્ગ (Digestive Tract)',
    trickGujarati: '🧠 શોર્ટ ટ્રીક: "મુખ → અન્નનળી → જઠર → નાનું આંતરડું → મોટું આંતરડું → મળદ્વાર"',
    keyFormula: 'જઠરમાં HCl એસિડ ખોરાકને એસિડિક બનાવે છે અને બેક્ટેરિયાનો નાશ કરે છે.',
    importantQuestion: 'નાના આંતરડાની લંબાઈ કેટલી હોય છે? → આશરે ૭.૫ મીટર!',
  },
  {
    id: 'm2',
    topicGujarati: 'વનસ્પતિમાં ખોરાકની બનાવટ (સૂર્યપ્રકાશ અને હરિતદ્રવ્ય)',
    trickGujarati: '🧠 ટ્રીક: "કાર્બન ડાયોક્સાઈડ + પાણી + સૂર્યપ્રકાશ = ગ્લુકોઝ + ઓક્સિજન"',
    keyFormula: 'પર્ણરંધ્રો (Stomata) દ્વારા વાયુઓનું આદાન-પ્રદાન થાય છે.',
    importantQuestion: 'અમરવેલ કયા પ્રકારની વનસ્પતિ છે? → પરજીવી (Parasite) વનસ્પતિ!',
  },
  {
    id: 'm3',
    topicGujarati: 'ભારતીય બંધારણ અને ખરડા સમિતિ',
    trickGujarati: '🧠 ટ્રીક: "આંબેડકર → ખરડા સમિતિ પ્રમુખ | ૨૬ જાન્યુઆરી ૧૯૫૦ → અમલ"',
    keyFormula: 'બંધારણ સભાની રચનામાં ૨ વર્ષ, ૧૧ મહિના અને ૧૮ દિવસ લાગ્યા હતા.',
    importantQuestion: 'બંધારણના આત્મા સમાન અધિકાર કયો છે? → બંધારણીય ઈલાજોનો અધિકાર!',
  },
];

export const AIMemoryRevisionModal: React.FC<AIMemoryRevisionModalProps> = ({
  isOpen,
  onClose,
  standard,
  subject,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const card = MEMORY_CARDS[activeCardIndex % MEMORY_CARDS.length];

  const handlePlayAudioTip = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `મેમરી ટ્રીક: ${card.topicGujarati}. ${card.trickGujarati}. ${card.keyFormula}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'gu-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all"
            id="memory-revision-close-btn"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-amber-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                  PREMIUM AI REVISION
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-1">
                AI મેમરી રિવિઝન અને ટ્રીક્સ
              </h2>
              <p className="text-xs text-cyan-100 font-medium">
                ધોરણ {standard} • {subject === 'science' ? 'વિજ્ઞાન' : 'સામાજિક વિજ્ઞાન'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="p-6 space-y-5">
          
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-cyan-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                યાદ રાખવાની ટ્રીક #{activeCardIndex + 1}
              </span>

              <button
                onClick={handlePlayAudioTip}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-cyan-700 hover:bg-cyan-800 text-white'
                }`}
                id="memory-audio-play-btn"
              >
                <span>{isPlayingAudio ? '🔊 ઓડિયો વાગી રહ્યો છે...' : '🔊 I M MASTER AI ગુરુજી અવાજમાં સાંભળો'}</span>
              </button>
            </div>

            <div>
              <h3 className="font-black text-base text-cyan-950">
                {card.topicGujarati}
              </h3>
              <p className="text-xs font-black text-amber-800 bg-amber-100/80 p-2.5 rounded-xl border border-amber-200 mt-2">
                {card.trickGujarati}
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-cyan-100 space-y-1 text-xs">
              <p className="font-bold text-slate-800">📌 મુખ્ય કી-પોઈન્ટ:</p>
              <p className="text-slate-600 font-medium">{card.keyFormula}</p>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-cyan-100 space-y-1 text-xs">
              <p className="font-bold text-[#0061A4]">🎯 પરીક્ષાનો મોસ્ટ આઈએમપી પ્રશ્ન:</p>
              <p className="text-slate-800 font-bold">{card.importantQuestion}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : MEMORY_CARDS.length - 1))}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl text-xs font-extrabold transition-all"
              id="prev-memory-card-btn"
            >
              ← પૂર્વ ટ્રીક
            </button>
            <button
              onClick={() => setActiveCardIndex((prev) => prev + 1)}
              className="flex-1 bg-[#0061A4] hover:bg-[#004F87] text-white py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-md"
              id="next-memory-card-btn"
            >
              આગામી ટ્રીક →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
