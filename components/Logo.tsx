
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
            {/* Nouveau logo: L'Ascension Analytique */}
            <g fill="url(#logo-gradient)">
                {/* Bar 1 (forms left of 'N') */}
                <path d="M6 35 V 20 C 6 19.4477 6.44772 19 7 19 H 9 C 9.55228 19 10 19.4477 10 20 V 35 C 10 35.5523 9.55228 36 9 36 H 7 C 6.44772 36 6 35.5523 6 35 Z" />
                {/* Bar 2 (forms right of 'N' and left of 'W') */}
                <path d="M13 35 V 12 C 13 11.4477 13.4477 11 14 11 H 16 C 16.5523 11 17 11.4477 17 12 V 35 C 17 35.5523 16.5523 36 16 36 H 14 C 13.4477 36 13 35.5523 13 35 Z" />
                {/* Bar 3 (forms middle of 'W') */}
                <path d="M20 35 V 25 C 20 24.4477 20.4477 24 21 24 H 23 C 23.5523 24 24 24.4477 24 25 V 35 C 24 35.5523 23.5523 36 23 36 H 21 C 20.4477 36 20 35.5523 20 35 Z" />
                {/* Bar 4 (forms right of 'W') */}
                <path d="M27 35 V 5 C 27 4.44772 27.4477 4 28 4 H 30 C 30.5523 4 31 4.44772 31 5 V 35 C 31 35.5523 30.5523 36 30 36 H 28 C 27.4477 36 27 35.5523 27 35 Z" />
            </g>
        </svg>
      <span className="text-2xl font-bold text-white">
        Next<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Win</span>
      </span>
    </div>
  );
};

export default Logo;
