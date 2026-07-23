import React, { useState } from 'react';
import { Award } from 'lucide-react';

interface DeveloperAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  onClick?: () => void;
  className?: string;
}

const DEVELOPER_PHOTO_PATH = '/assets/developer_photo.jpg';

export const DeveloperAvatar: React.FC<DeveloperAvatarProps> = ({
  size = 'md',
  showBadge = false,
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Profile photo size dimensions
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs border-[2.5px]',
    md: 'w-16 h-16 text-xs border-3',
    lg: 'w-28 h-28 text-sm border-4',
    xl: 'w-36 h-36 sm:w-44 sm:h-44 text-base border-[5px]',
  };

  const badgeSizeClasses = {
    sm: 'w-4 h-4 text-[9px]',
    md: 'w-5 h-5 text-[10px]',
    lg: 'w-6 h-6 text-xs',
    xl: 'w-8 h-8 text-sm',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-block shrink-0 ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200' : ''} ${className}`}
      title="ઈમરાન મન્સૂરી (IMRAN MANSURI) - ગણિત અને વિજ્ઞાન શિક્ષક | Founder of I M MASTER AI"
    >
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-amber-400/80 bg-[#001D36] shadow-lg shadow-amber-950/20 flex items-center justify-center relative transform-gpu`}
      >
        {!imageError ? (
          <img
            src={DEVELOPER_PHOTO_PATH}
            alt="Official Developer Photo - IMRAN MANSURI"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center rounded-full transform-gpu transition-transform duration-300 hover:scale-105"
            style={{ borderRadius: '50%', imageRendering: 'auto' }}
          />
        ) : (
          /* Exact required failure state */
          <div
            className="w-full h-full bg-[#001D36] text-amber-200 flex items-center justify-center text-center select-none p-1 font-bold text-[9px] sm:text-xs leading-tight"
            title="Developer photo asset missing"
          >
            Developer photo asset missing
          </div>
        )}
      </div>

      {showBadge && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 bg-gradient-to-r from-emerald-600 to-green-700 text-amber-200 rounded-full p-1 border-2 border-white shadow-md flex items-center justify-center ring-2 ring-emerald-500/30`}
          title="Mathematics & Science Teacher • Founder I M MASTER AI"
        >
          <Award className={badgeSizeClasses[size]} />
        </div>
      )}
    </div>
  );
};



