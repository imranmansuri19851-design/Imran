import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  CheckCircle2,
  Database
} from 'lucide-react';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [email, setEmail] = useState(profile.email || '');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentName, setStudentName] = useState(profile.name);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onUpdateProfile({
        name: studentName,
        email: email,
        isLoggedIn: true,
      });
      onClose();
    }, 800);
  };

  const handleSignOut = () => {
    onUpdateProfile({
      isLoggedIn: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#C4C6D0]/40 relative animate-fadeIn space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#F0F4F9] hover:bg-[#E1E2EC] text-[#44474E] flex items-center justify-center absolute top-5 right-5 transition-colors"
          id="close-auth-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0061A4] text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-black text-[#1A1C1E] text-xl">
            {profile.isLoggedIn ? 'વિદ્યાર્થી એકાઉન્ટ (Firebase Sync)' : 'Firebase પ્રવેશ / નોંધણી'}
          </h3>
          <p className="text-xs text-[#44474E] font-semibold">
            તમારો પ્રગતિ અહેવાલ અને સ્કોર ડેટાબેઝમાં સુરક્ષિત સિંક કરો.
          </p>
        </div>

        {profile.isLoggedIn ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#006D32]/10 border border-[#006D32]/30 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#006D32] text-white font-black text-base flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#1A1C1E] text-sm">
                {profile.name}
              </h4>
              <p className="text-xs text-[#006D32] font-bold">
                {profile.email} (Firestore સિંક સક્રિય)
              </p>
            </div>

            <div className="p-3.5 bg-[#F0F4F9] rounded-2xl border border-[#C4C6D0]/30 text-xs text-[#44474E] space-y-1 font-medium">
              <span className="font-bold text-[#1A1C1E] flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-[#0061A4]" />
                ડેટાબેઝ સ્ટેટસ:
              </span>
              <p>દરેક જવાબના ગુણ અને સ્ટ્રીક ક્લાઉડમાં સેવ થાય છે.</p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3.5 rounded-2xl bg-[#BA1A1A]/10 hover:bg-[#BA1A1A]/20 text-[#BA1A1A] font-bold text-sm transition-colors border border-[#BA1A1A]/30"
              id="firebase-signout-btn"
            >
              લૉગ આઉટ કરો (Sign Out)
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1A1C1E]">
                  વિદ્યાર્થીનું પૂરું નામ
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#44474E] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="દા.ત. કશિશ મનસુરી"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#C4C6D0] bg-[#F0F4F9] text-sm focus:outline-none focus:ring-2 focus:ring-[#0061A4] font-semibold text-[#1A1C1E]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1A1C1E]">
                ઈમેલ સરનામું (Email Address)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#44474E] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#C4C6D0] bg-[#F0F4F9] text-sm focus:outline-none focus:ring-2 focus:ring-[#0061A4] font-semibold text-[#1A1C1E]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1A1C1E]">
                પાસવર્ડ (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#44474E] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#C4C6D0] bg-[#F0F4F9] text-sm focus:outline-none focus:ring-2 focus:ring-[#0061A4] font-semibold text-[#1A1C1E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#0061A4] hover:bg-[#004F87] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              id="firebase-submit-auth-btn"
            >
              {isLoading ? (
                <span>સાંકળી રહ્યા છીએ...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isSignUp ? 'નવું એકાઉન્ટ બનાવો' : 'પ્રવેશ કરો (Log In)'}</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-[#0061A4] hover:underline"
                id="toggle-signup-login-mode-btn"
              >
                {isSignUp ? 'પહેલેથી એકાઉન્ટ છે? લૉગ ઇન કરો' : 'નવા છો? એકાઉન્ટ બનાવો'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
