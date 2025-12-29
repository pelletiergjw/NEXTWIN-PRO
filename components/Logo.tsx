
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
            </defs>
            {/* Monogramme géométrique N/W */}
            <path 
                d="M4 36V4h10l12 20V4h10v32h-10L14 16v20H4z"
                fill="url(#logo-gradient)"
            />
        </svg>
      <span className="text-2xl font-bold text-white">
        Next<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Win</span>
      </span>
    </div>
  );
};

export default Logo;
