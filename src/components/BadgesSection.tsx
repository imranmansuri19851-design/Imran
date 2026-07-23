import React, { useState } from 'react';
import { Badge, getCalculatedBadges } from '../utils/badges';
import { StudentProfile, PracticeHistoryItem } from '../types';
import { 
  Award, 
  Flame, 
  Sparkles, 
  Zap, 
  Trophy, 
  Crown, 
  BookOpen, 
  Star, 
  CheckCircle2, 
  Lock,
  Medal,
  ChevronRight
} from 'lucide-react';

interface BadgesSectionProps {
  profile: StudentProfile;
  history: PracticeHistoryItem[];
  selectedLanguage?: 'gu' | 'en' | 'hi';
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({
  profile,
  history,
  selectedLanguage = 'gu',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges = getCalculatedBadges(profile, history);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalCount = badges.length;

  const filteredBadges = badges.filter((b) => {
    if (activeTab === 'unlocked') return b.isUnlocked;
    if (activeTab === 'locked') return !b.isUnlocked;
    return true;
  });

  const renderBadgeIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Star':
        return <Star className={className} />;
      default:
        return <Medal className={className} />;
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#C4C6D0]/30 space-y-6">
      
      {/* Header & Badges Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C4C6D0]/30 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFD941] text-[#241E00] font-black">
              <Award className="w-5 h-5 text-[#241E00]" />
            </div>
            <h3 className="font-black text-[#1A1C1E] text-lg sm:text-xl">
              {selectedLanguage === 'en'
                ? 'Virtual Medals & Achievement Badges'
                : selectedLanguage === 'hi'
                ? 'वर्चुअल मेडल और उपलब्धि बैच'
                : 'વર્ચ્યુઅલ મેડલ્સ અને સિદ્ધિ બેજ (Virtual Badges)'}
            </h3>
          </div>
          <p className="text-xs text-[#44474E] font-semibold pl-1">
            {selectedLanguage === 'en'
              ? 'Earn medals by achieving high scores, streaks, and completing NCERT topics.'
              : selectedLanguage === 'hi'
              ? 'उच्च अंक, लगातार अभ्यास और NCERT विषयों को पूरा करके मेडल हासिल करें।'
              : 'ઉચ્ચ ગુણ, દૈનિક સ્ટ્રીક અને NCERT વિષય પૂર્ણ કરીને મેડલ મેળવો.'}
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-2 bg-[#F0F4F9] p-2 rounded-2xl border border-[#C4C6D0]/40">
          <span className="text-xs font-extrabold text-[#0061A4] bg-[#D1E4FF] px-3.5 py-1.5 rounded-xl border border-[#0061A4]/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0061A4]" />
            <span>
              {unlockedCount} / {totalCount} {selectedLanguage === 'en' ? 'Unlocked' : selectedLanguage === 'hi' ? 'अनलॉक्ड' : 'અનલોક'}
            </span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-[#0061A4] text-white shadow-sm'
              : 'bg-[#F0F4F9] text-[#44474E] hover:text-[#0061A4]'
          }`}
        >
          {selectedLanguage === 'en' ? `All (${totalCount})` : selectedLanguage === 'hi' ? `सभी (${totalCount})` : `તમામ બેજ (${totalCount})`}
        </button>
        <button
          onClick={() => setActiveTab('unlocked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'unlocked'
              ? 'bg-[#006D32] text-white shadow-sm'
              : 'bg-[#F0F4F9] text-[#44474E] hover:text-[#006D32]'
          }`}
        >
          🏆 {selectedLanguage === 'en' ? `Unlocked (${unlockedCount})` : selectedLanguage === 'hi' ? `અનલોક (${unlockedCount})` : `અનલોક થએલા (${unlockedCount})`}
        </button>
        <button
          onClick={() => setActiveTab('locked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'locked'
              ? 'bg-[#241E00] text-white shadow-sm'
              : 'bg-[#F0F4F9] text-[#44474E] hover:text-[#241E00]'
          }`}
        >
          🔒 {selectedLanguage === 'en' ? `In Progress (${totalCount - unlockedCount})` : selectedLanguage === 'hi' ? `પ્રગતિ હેઠળ (${totalCount - unlockedCount})` : `બાકી રહેલા (${totalCount - unlockedCount})`}
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const percent = Math.min(100, Math.round((badge.progressCurrent / Math.max(1, badge.progressTarget)) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between space-y-3 ${
                badge.isUnlocked
                  ? 'bg-gradient-to-br from-white via-[#F0F4F9] to-white border-[#0061A4]/30 shadow-sm hover:shadow-md hover:border-[#0061A4]'
                  : 'bg-[#F0F4F9]/60 border-[#C4C6D0]/30 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Unlocked / Locked Top Tag */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    badge.isUnlocked
                      ? 'bg-[#006D32] text-white border-emerald-600'
                      : 'bg-gray-200 text-gray-700 border-gray-300'
                  }`}
                >
                  {badge.isUnlocked
                    ? (selectedLanguage === 'en' ? 'Unlocked' : 'મેડલ વિજેતા')
                    : (selectedLanguage === 'en' ? 'Locked' : 'બાકી')}
                </span>

                <span className="text-xs font-bold text-[#44474E]">
                  {badge.progressCurrent} / {badge.progressTarget} {selectedLanguage === 'en' ? badge.unitEnglish : badge.unitGujarati}
                </span>
              </div>

              {/* Badge Icon & Titles */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner transition-transform group-hover:scale-105 ${
                    badge.isUnlocked
                      ? 'shadow-md'
                      : 'grayscale opacity-60 bg-gray-200 border-gray-300'
                  }`}
                  style={{
                    backgroundColor: badge.isUnlocked ? badge.bgLight : '#E1E2EC',
                    borderColor: badge.isUnlocked ? badge.color : '#C4C6D0',
                  }}
                >
                  {badge.isUnlocked ? (
                    renderBadgeIcon(badge.icon, 'w-6 h-6 text-[#1A1C1E]')
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                <div className="space-y-0.5 pr-2">
                  <h4 className="font-extrabold text-sm text-[#1A1C1E] line-clamp-1">
                    {selectedLanguage === 'en' ? badge.titleEnglish : badge.titleGujarati}
                  </h4>
                  <p className="text-[11px] text-[#44474E] font-medium line-clamp-2">
                    {selectedLanguage === 'en' ? badge.descriptionEnglish : badge.descriptionGujarati}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full h-2 bg-[#E1E2EC] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      badge.isUnlocked ? 'bg-[#006D32]' : 'bg-[#0061A4]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-[#44474E]">
                  <span>{percent}% પૂર્ણ</span>
                  <span className="text-[#0061A4] group-hover:underline flex items-center">
                    વિગતો <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Badge Detail */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#C4C6D0]/40 text-center relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-black text-lg p-1"
            >
              ✕
            </button>

            <div
              className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border-2 shadow-lg"
              style={{
                backgroundColor: selectedBadge.bgLight,
                borderColor: selectedBadge.color,
              }}
            >
              {renderBadgeIcon(selectedBadge.icon, 'w-10 h-10 text-[#1A1C1E]')}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-[#0061A4] uppercase tracking-wider bg-[#D1E4FF] px-3 py-1 rounded-full inline-block">
                {selectedBadge.isUnlocked ? '🏅 અનલોક થયેલ મેડલ' : '🎯 પ્રગતિ હેઠળ'}
              </span>
              <h3 className="text-lg font-black text-[#1A1C1E] pt-2">
                {selectedLanguage === 'en' ? selectedBadge.titleEnglish : selectedBadge.titleGujarati}
              </h3>
              <p className="text-xs text-[#44474E] font-medium">
                {selectedLanguage === 'en' ? selectedBadge.descriptionEnglish : selectedBadge.descriptionGujarati}
              </p>
            </div>

            <div className="bg-[#F0F4F9] p-3.5 rounded-2xl space-y-1 border border-[#C4C6D0]/40 text-left">
              <div className="flex justify-between text-xs font-bold text-[#1A1C1E]">
                <span>પ્રગતિ સ્થિતિ (Progress):</span>
                <span>
                  {selectedBadge.progressCurrent} / {selectedBadge.progressTarget} {selectedLanguage === 'en' ? selectedBadge.unitEnglish : selectedBadge.unitGujarati}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#E1E2EC] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#0061A4] rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((selectedBadge.progressCurrent / selectedBadge.progressTarget) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 bg-[#0061A4] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#004B80]"
            >
              બંધ કરો (Close)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
