import React, { useState } from 'react';
import { PlanType, PaymentGateway, StudentProfile } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType, gateway?: PaymentGateway, couponCode?: string) => void;
  profile: StudentProfile;
}

const AVAILABLE_COUPONS = [
  { code: 'IMRAN100', discount: 100, plan: 'premium' as PlanType, desc: '૧૦૦% ફ્રી પ્રીમિયમ સબ્સ્ક્રિપ્શન (I M MASTER AI ગુરુજી પ્રોમો)' },
  { code: 'FAMILY2026', discount: 100, plan: 'premium' as PlanType, desc: 'ફેમિલી યુઝ સ્પેશિયલ કૂપન' },
  { code: 'SCHOOL99', discount: 100, plan: 'school' as PlanType, desc: 'શાળા અને શિક્ષક સંપૂર્ણ એક્સેસ' },
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
  profile,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('premium');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');
  const [couponErrorMsg, setCouponErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    setCouponErrorMsg('');
    setCouponSuccessMsg('');
    const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    
    if (found) {
      setAppliedDiscount(found.discount);
      setSelectedPlan(found.plan);
      setCouponSuccessMsg(`✅ કૂપન સફળતાપૂર્વક લાગુ થઈ! (${found.desc})`);
    } else if (couponCode.trim().length > 0) {
      setCouponErrorMsg('❌ અમાન્ય કૂપન કોડ. કૃપા કરીને સાચો કોડ દાખલ કરો (દા.ત. IMRAN100 અથવા FAMILY2026)');
    }
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSelectPlan(selectedPlan, selectedGateway, couponCode);
      alert(`🎉 સબ્સ્ક્રિપ્શન સફળ! તમારો ${selectedPlan.toUpperCase()} પ્લાન સક્રિય થઈ ગયો છે.`);
      onClose();
    }, 1200);
  };

  const getPrice = (plan: PlanType) => {
    if (appliedDiscount === 100) return '₹૦ (૧૦૦% ફ્રી)';
    if (plan === 'free') return '₹૦ / કાયમી ફ્રી';
    if (plan === 'premium') return '₹૧૯૯ / મહિને';
    if (plan === 'school') return '₹૯૯૯ / વર્ષે (સમગ્ર વર્ગ)';
    return '₹૦';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0061A4] via-blue-700 to-[#004F87] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-all"
            id="subscription-close-btn"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                AnswerCoach.AI પ્રીમિયમ અને સબ્સ્ક્રિપ્શન
              </h2>
              <p className="text-xs text-blue-100 font-medium mt-1">
                પરિવાર માટે ફ્રી, શાળા અને ભવિષ્યના બિઝનેસ માટે અનલિમિટેડ AI ક્ષમતા!
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Family Always Free Alert */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-emerald-900">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏡</span>
              <span>કુટુંબ અને પર્સનલ યુઝ માટે બધું જ ફ્રી ઉપલબ્ધ છે!</span>
            </div>
            <button
              onClick={() => {
                onSelectPlan('premium');
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl font-black shadow transition-all text-xs"
              id="family-free-unlock-btn"
            >
              ખાનગી પરિવાર મોડ (Free Upgrade)
            </button>
          </div>

          {/* Subscription Plans Choice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Free Plan */}
            <div
              onClick={() => setSelectedPlan('free')}
              className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                selectedPlan === 'free'
                  ? 'border-[#0061A4] bg-blue-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-black">
                  FREE
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-2">ફ્રી પ્લાન</h3>
                <p className="text-sm font-black text-[#0061A4] mt-1">{getPrice('free')}</p>
                <ul className="text-xs text-slate-600 space-y-1.5 mt-3">
                  <li>✅ દૈનિક ૫ AI મૂલ્યાંકન</li>
                  <li>✅ NCERT ધોરણ ૬, ૭, ૮</li>
                  <li>✅ સામાન્ય હોમ સ્ક્રીન</li>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div
              onClick={() => setSelectedPlan('premium')}
              className={`cursor-pointer rounded-2xl p-4 border-2 relative transition-all flex flex-col justify-between ${
                selectedPlan === 'premium'
                  ? 'border-[#0061A4] bg-blue-50/80 shadow-md ring-2 ring-[#0061A4]/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="absolute -top-3 right-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                સૌથી લોકપ્રિય
              </div>
              <div>
                <span className="bg-[#0061A4] text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                  PREMIUM
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-2">પ્રીમિયમ પ્લાન</h3>
                <p className="text-sm font-black text-[#0061A4] mt-1">{getPrice('premium')}</p>
                <ul className="text-xs text-slate-600 space-y-1.5 mt-3">
                  <li>✨ <strong>અનલિમિટેડ</strong> AI જવાબ ચકાસણી</li>
                  <li>✨ <strong>અનલિમિટેડ</strong> વોઈસ પ્રેક્ટિસ</li>
                  <li>🧠 AI મેમરી રિવિઝન અને ટિપ્સ</li>
                  <li>📊 વિગતવાર વાલી પ્રોગ્રેસ રીપોર્ટ</li>
                </ul>
              </div>
            </div>

            {/* School Plan */}
            <div
              onClick={() => setSelectedPlan('school')}
              className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                selectedPlan === 'school'
                  ? 'border-purple-600 bg-purple-50/60 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <span className="bg-purple-700 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                  SCHOOL & TEACHER
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-2">શાળા/શિક્ષક પ્લાન</h3>
                <p className="text-sm font-black text-purple-700 mt-1">{getPrice('school')}</p>
                <ul className="text-xs text-slate-600 space-y-1.5 mt-3">
                  <li>🏫 સમગ્ર વર્ગના વિદ્યાર્થીઓ માટે</li>
                  <li>🔐 શિક્ષક કસ્ટમ પ્રશ્ન રચના</li>
                  <li>📈 ક્લાસ લાઈવ એનાલિટિક્સ</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Coupon Code Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              🎁 કૂપન કોડ ધરાવો છો? (Discount Code)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="દા.ત. IMRAN100 અથવા FAMILY2026"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
                id="coupon-code-input"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-[#0061A4] hover:bg-[#004F87] text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm"
                id="apply-coupon-btn"
              >
                એપ્લાય
              </button>
            </div>

            {/* Default Helpful Coupon Suggestion */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-500 font-bold">ટ્રાય કરો:</span>
              <button
                onClick={() => {
                  setCouponCode('IMRAN100');
                  setAppliedDiscount(100);
                  setSelectedPlan('premium');
                  setCouponSuccessMsg('✅ ૧૦૦% ફ્રી I M MASTER AI ગુરુજી કૂપન લાગુ થઈ!');
                }}
                className="text-[10px] bg-blue-100 hover:bg-blue-200 text-[#0061A4] px-2 py-0.5 rounded-md font-extrabold border border-blue-200"
              >
                IMRAN100 (100% Free)
              </button>
              <button
                onClick={() => {
                  setCouponCode('FAMILY2026');
                  setAppliedDiscount(100);
                  setSelectedPlan('premium');
                  setCouponSuccessMsg('✅ ફેમિલી ફ્રી અનલોક લાગુ થયું!');
                }}
                className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold border border-emerald-200"
              >
                FAMILY2026
              </button>
            </div>

            {couponSuccessMsg && (
              <p className="text-xs font-bold text-emerald-700 mt-2">{couponSuccessMsg}</p>
            )}
            {couponErrorMsg && (
              <p className="text-xs font-bold text-red-600 mt-2">{couponErrorMsg}</p>
            )}
          </div>

          {/* Payment Gateway Options Placeholder */}
          {selectedPlan !== 'free' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                💳 પેમેન્ટ ગેટવે સિલેક્ટ કરો (Payment Integration Placeholder):
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedGateway('razorpay')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    selectedGateway === 'razorpay'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>⚡ Razorpay (UPI, GPay, Cards)</span>
                </button>
                <button
                  onClick={() => setSelectedGateway('google_play')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    selectedGateway === 'google_play'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>🤖 Google Play Billing (App Store)</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-[#0061A4] to-blue-700 hover:from-[#004F87] hover:to-blue-800 text-white py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
            id="confirm-subscription-btn"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>સબ્સ્ક્રિપ્શન ચકાસાઈ રહ્યું છે...</span>
              </>
            ) : (
              <>
                <span>🚀 {selectedPlan === 'free' ? 'ફ્રી મોડ ચાલુ રાખો' : `${selectedPlan.toUpperCase()} પ્લાન સક્રિય કરો`}</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
