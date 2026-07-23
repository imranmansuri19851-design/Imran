import React, { useState } from 'react';
import { StudentProfile } from '../types';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [friendCode, setFriendCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState('');
  const [redeemError, setRedeemError] = useState('');

  if (!isOpen) return null;

  const referralCode = profile.referralCode || `${profile.name.slice(0, 4).toUpperCase()}2026`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRedeemFriendCode = () => {
    setRedeemError('');
    setRedeemSuccess('');

    if (!friendCode.trim()) {
      setRedeemError('કૃપા કરીને તમારા મિત્રનો રેફરલ કોડ દાખલ કરો.');
      return;
    }

    if (friendCode.trim().toUpperCase() === referralCode) {
      setRedeemError('તમે તમારો પોતાનો રેફરલ કોડ વાપરી શકતા નથી.');
      return;
    }

    // Award +7 free bonus premium days!
    const updatedBonus = (profile.bonusDaysEarned || 0) + 7;
    onUpdateProfile({
      bonusDaysEarned: updatedBonus,
      plan: 'premium',
    });

    setRedeemSuccess('🎉 બ્રાવો! રેફરલ કોડ સફળ થયો. તમને +૭ દિવસનું ફ્રી પ્રીમિયમ મળ્યું છે!');
    setFriendCode('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all"
            id="referral-close-btn"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                મિત્રોને ઈન્વાઈટ કરો અને ફ્રી મેળવો
              </h2>
              <p className="text-xs text-purple-200 mt-1">
                દરેક મિત્ર જોડાવા પર +૭ દિવસ પ્રીમિયમ મફત!
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* User's Own Referral Code Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center space-y-2">
            <p className="text-xs font-bold text-purple-900">તમારો સ્પેશિયલ રેફરલ કોડ:</p>
            <div className="bg-white border-2 border-dashed border-purple-400 p-3 rounded-xl flex items-center justify-between">
              <span className="font-black text-xl text-purple-900 tracking-wider">
                {referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-xs font-black transition-all shadow-sm"
                id="copy-referral-code-btn"
              >
                {copied ? '✅ કોપી થયો!' : '📋 કોપી કોડ'}
              </button>
            </div>
          </div>

          {/* Bonus Counter */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <p className="text-[11px] font-bold text-slate-500">આમંત્રિત મિત્રો</p>
              <h4 className="text-lg font-black text-purple-800 mt-0.5">
                {profile.invitedFriendsCount || 2} મિત્રો
              </h4>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
              <p className="text-[11px] font-bold text-emerald-800">મળેલા ફ્રી દિવસો</p>
              <h4 className="text-lg font-black text-emerald-900 mt-0.5">
                +{profile.bonusDaysEarned || 14} દિવસો
              </h4>
            </div>
          </div>

          {/* Redeem Friend Code */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              📥 મિત્રનો રેફરલ કોડ રિડીમ કરો (Redeem Friend Code):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="મિત્રનો કોડ દાખલ કરો"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                id="friend-referral-input"
              />
              <button
                onClick={handleRedeemFriendCode}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow transition-all"
                id="redeem-friend-code-btn"
              >
                રિડીમ
              </button>
            </div>

            {redeemSuccess && (
              <p className="text-xs font-bold text-emerald-700">{redeemSuccess}</p>
            )}
            {redeemError && (
              <p className="text-xs font-bold text-red-600">{redeemError}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-all"
            id="referral-done-btn"
          >
            બંધ કરો
          </button>

        </div>

      </div>
    </div>
  );
};
