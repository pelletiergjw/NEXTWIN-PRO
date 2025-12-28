
import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div className="relative">
      <svg viewBox="0 0 800 300" className="w-full h-auto">
        <defs>
          <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Abstract background shapes */}
        <path d="M0 150 Q 200 50, 400 150 T 800 150" stroke="url(#hero-grad)" strokeWidth="2" fill="none" opacity="0.3" filter="url(#glow)" />
        <path d="M0 200 Q 200 250, 400 200 T 800 200" stroke="#8B5CF6" strokeWidth="1.5" fill="none" opacity="0.2" />

        {/* Central element - representing analysis */}
        <g transform="translate(400, 150)">
          <circle cx="0" cy="0" r="40" fill="none" stroke="url(#hero-grad)" strokeWidth="2" />
          <path d="M -20 -15 L 20 15 M -20 15 L 20 -15" stroke="#fff" strokeWidth="1" opacity="0.5" />
          <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">AI</text>
        </g>
        
        {/* Graph-like lines */}
        <polyline points="50,250 150,180 250,220 350,150" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" strokeDasharray="5 5" />
        <polyline points="450,150 550,220 650,180 750,250" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" strokeDasharray="5 5" />

        {/* Sports icons */}
        <text x="100" y="100" fontSize="30" fill="white" opacity="0.2">⚽</text>
        <text x="700" y="100" fontSize="30" fill="white" opacity="0.2">🏀</text>
        <text x="250" y="70" fontSize="30" fill="white" opacity="0.2">🎾</text>

      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#10101A] via-transparent to-transparent"></div>
    </div>
  );
};

export default HeroImage;
