
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
                </filter>
            </defs>
            
            <g filter="url(#logo-shadow)">
                {/* Main "N" path */}
                <path 
                    d="M10 40 L10 8 H20 L30 27 V8 H40 V40 H30 L20 19 V40 H10Z"
                    fill="url(#logo-gradient)"
                />
            </g>
        </svg>
      <span className="text-2xl font-bold text-white">
        Next<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Win</span>
      </span>
    </div>
  );
};

export default Logo;
