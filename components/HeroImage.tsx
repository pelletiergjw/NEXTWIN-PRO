
import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto py-16 flex justify-center items-center">
      {/* Glow de fond subtil */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent blur-3xl pointer-events-none"></div>

      <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="main-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          
          <filter id="neon-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>
            {`
              @keyframes hover-effect {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              .sport-item { animation: hover-effect 4s ease-in-out infinite; transform-origin: center; }
              .delay-1 { animation-delay: -1s; }
              .delay-2 { animation-delay: -2s; }
            `}
          </style>
        </defs>

        {/* Ligne de connexion élégante */}
        <path d="M50,100 L450,100" stroke="url(#main-grad)" strokeWidth="1" strokeDasharray="5,10" opacity="0.2" />

        {/* Football */}
        <g className="sport-item">
          <circle cx="100" cy="100" r="45" fill="#1C1C2B" stroke="url(#main-grad)" strokeWidth="2" filter="url(#neon-glow)" />
          <text x="100" y="110" fontSize="40" textAnchor="middle">⚽</text>
          <text x="100" y="170" fontSize="10" fill="gray" textAnchor="middle" fontWeight="bold" letterSpacing="2">FOOTBALL</text>
        </g>

        {/* Basketball */}
        <g className="sport-item delay-1">
          <circle cx="250" cy="100" r="45" fill="#1C1C2B" stroke="url(#main-grad)" strokeWidth="2" filter="url(#neon-glow)" />
          <text x="250" y="110" fontSize="40" textAnchor="middle">🏀</text>
          <text x="250" y="170" fontSize="10" fill="gray" textAnchor="middle" fontWeight="bold" letterSpacing="2">BASKETBALL</text>
        </g>

        {/* Tennis */}
        <g className="sport-item delay-2">
          <circle cx="400" cy="100" r="45" fill="#1C1C2B" stroke="url(#main-grad)" strokeWidth="2" filter="url(#neon-glow)" />
          <text x="400" y="110" fontSize="40" textAnchor="middle">🎾</text>
          <text x="400" y="170" fontSize="10" fill="gray" textAnchor="middle" fontWeight="bold" letterSpacing="2">TENNIS</text>
        </g>
      </svg>
      
      {/* Mini badge d'état */}
      <div className="absolute -bottom-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">IA Active : 24/7 Live Monitoring</span>
      </div>
    </div>
  );
};

export default HeroImage;
