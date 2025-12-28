
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg width="40" height="40" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#F97316', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#8B5CF6', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M96 16L112 32L64 80L16 32L32 16L64 48L96 16Z" fill="url(#grad1)" transform="rotate(-45 64 64)"/>
            <path d="M24,104 C40,88 64,80 88,88" stroke="url(#grad2)" strokeWidth="12" strokeLinecap="round" fill="none"/>
             <circle cx="20" cy="80" r="6" fill="url(#grad1)"/>
            <circle cx="48" cy="68" r="6" fill="url(#grad1)"/>
            <circle cx="76" cy="72" r="6" fill="url(#grad1)"/>
        </svg>
      <span className="text-2xl font-bold text-white">
        Next<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Win</span>
      </span>
    </div>
  );
};

export default Logo;
