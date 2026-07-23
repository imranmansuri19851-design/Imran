import React, { useState } from 'react';
import { AppNotification } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: '🔔 દૈનિક પ્રેક્ટિસ રીમાઇન્ડર',
    message: 'તમારા આજના વિજ્ઞાન વિષયના ૫ પ્રશ્નો બોલીને પૂર્ણ કરવાનો સમય થયો છે!',
    timestamp: 'આજે, સાંજે ૬:૦૦',
    read: false,
    type: 'reminder',
  },
  {
    id: 'n2',
    title: '🎉 રેફરલ બોનસ ઈનામ!',
    message: 'તમારા મિત્રે તમારો કોડ વાપર્યો. તમને +૭ દિવસ ફ્રી પ્રીમિયમ મળ્યું છે.',
    timestamp: 'ગઈકાલે',
    read: true,
    type: 'reward',
  },
  {
    id: 'n3',
    title: '📚 નવો NCERT પ્રશ્ન સમૂહ ઉમેરાયો',
    message: 'ધોરણ ૭ વિજ્ઞાન પ્રકરણ ૩ અને ૪ ના નવા પ્રશ્નો ચકાસણી માટે ઉપલબ્ધ છે.',
    timestamp: '૨ દિવસ પહેલા',
    read: true,
    type: 'system',
  },
];

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('18:00');
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMsg('✅ તમામ સુચનાઓ વંચાઈ ગઈ.');
    setTimeout(() => setToastMsg(''), 2000);
  };

  const handleSaveReminder = () => {
    setToastMsg(`⏰ દૈનિક રીમાઇન્ડર ${reminderTime} વાગ્યે સેટ થઈ ગયું!`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-[#0061A4] to-blue-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all"
            id="notification-close-btn"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                સુચનાઓ અને રીમાઇન્ડર (Notifications)
              </h2>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                દૈનિક અભ્યાસની યાદ અપાવતી સિસ્ટમ
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Daily Alarm Setting Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">⏰ દૈનિક અભ્યાસ નોટિફિકેશન</h4>
                <p className="text-[11px] text-slate-600">દરરોજ નિયમિત પ્રેક્ટિસ માટે એલાર્મ</p>
              </div>
              <input
                type="checkbox"
                checked={dailyReminderEnabled}
                onChange={(e) => setDailyReminderEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#0061A4] rounded cursor-pointer"
                id="daily-reminder-checkbox"
              />
            </div>

            {dailyReminderEnabled && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-blue-200/60">
                <span className="text-xs font-bold text-slate-700">રીમાઇન્ડર સમય:</span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0061A4]"
                  id="reminder-time-input"
                />
                <button
                  onClick={handleSaveReminder}
                  className="bg-[#0061A4] text-white text-xs font-black px-3 py-1 rounded-xl shadow hover:bg-[#004F87] transition-all"
                  id="save-reminder-btn"
                >
                  સેવ
                </button>
              </div>
            )}
          </div>

          {/* Toast Message */}
          {toastMsg && (
            <p className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
              {toastMsg}
            </p>
          )}

          {/* List of Notifications */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-700">
              <span>તાજેતરની સુચનાઓ ({notifications.filter(n => !n.read).length} નવી)</span>
              <button
                onClick={handleMarkAllRead}
                className="text-[#0061A4] hover:underline"
                id="mark-all-read-btn"
              >
                બધી વંચાઈ ગઈ
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border text-xs transition-all space-y-1 ${
                    n.read
                      ? 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-blue-50/70 border-blue-200 text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex justify-between items-start font-bold">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-700">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-all"
            id="notification-done-btn"
          >
            બંધ કરો
          </button>

        </div>

      </div>
    </div>
  );
};
