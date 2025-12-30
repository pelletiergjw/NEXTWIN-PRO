
import React, { useState, useEffect } from 'react';

// --- SLIDE COMPONENTS ---

const SlideContainer: React.FC<{ children: React.ReactNode, active: boolean }> = ({ children, active }) => (
    <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${active ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-full bg-[#151522]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg p-3 md:p-6 overflow-hidden">
            {children}
        </div>
    </div>
);

const AnalysisDashboardSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="text-base md:text-xl">⚽</span>
            <span className="text-[10px] md:text-lg font-bold text-white truncate max-w-[120px] md:max-w-none">PSG vs. R. Madrid</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-[7px] md:text-[9px] uppercase font-black text-blue-300">Live AI</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-3 md:mt-4">
          <div className="md:col-span-2">
            <p className="text-[7px] md:text-[10px] uppercase font-bold text-gray-400 tracking-wider">Probabilité Victoire (PSG)</p>
            <p className="text-2xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500 my-0.5 md:my-2">72.5%</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 md:h-3"><div className="bg-gradient-to-r from-green-400 to-teal-400 h-1.5 md:h-3 rounded-full" style={{width: '72.5%'}}></div></div>
          </div>
          <div className="md:col-span-1 flex flex-row md:flex-col justify-between md:justify-start gap-2 md:gap-4">
            <div>
              <p className="text-[7px] md:text-[10px] uppercase font-bold text-gray-400">Forme</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {['V', 'V', 'N', 'D', 'V'].map((r, i) => (
                    <span key={i} className={`w-3.5 h-3.5 md:w-5 md:h-5 flex items-center justify-center text-[7px] md:text-xs rounded-full ${r === 'V' ? 'bg-green-500/20 text-green-400' : r === 'N' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{r}</span>
                ))}
              </div>
            </div>
             <div className="text-right md:text-left">
              <p className="text-[7px] md:text-[10px] uppercase font-bold text-gray-400">Dernier H2H</p>
              <p className="text-[10px] md:text-lg font-bold text-white mt-0.5">PSG 3-1</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 bg-black/20 p-2 rounded-lg border border-white/5">
          <p className="text-[7px] md:text-[10px] uppercase font-bold text-orange-400 tracking-wider">Verdict AI</p>
          <p className="text-[9px] md:text-sm text-white/80 mt-0.5 italic line-clamp-2">"Avantage domicile et dynamique offensive favorisent fortement le PSG."</p>
        </div>
    </SlideContainer>
);

const LiveSearchSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-white/10">
            <h3 className="text-[10px] md:text-lg font-bold text-white">Vérification Multi-Sources</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <span className="text-[7px] md:text-[9px] uppercase font-black text-purple-300">Temps Réel</span>
            </div>
        </div>
        <div className="relative w-full h-[calc(100%-80px)] md:h-[calc(100%-60px)] flex items-center justify-center">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse relative z-10">
                <svg className="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            
            {/* Mobile Floating Badges */}
            <div className="absolute top-2 left-2 md:top-0 md:left-1 flex items-center gap-1.5 bg-gray-900/80 rounded-full px-2 py-1 border border-white/10">
                <span className="text-[8px] md:text-base">📰</span>
                <p className="text-[7px] md:text-xs font-black text-white/70 uppercase">News</p>
            </div>
            <div className="absolute bottom-2 left-2 md:bottom-0 md:left-1 flex items-center gap-1.5 bg-gray-900/80 rounded-full px-2 py-1 border border-white/10">
                <span className="text-[8px] md:text-base">📈</span>
                <p className="text-[7px] md:text-xs font-black text-white/70 uppercase">Stats</p>
            </div>
            <div className="absolute top-2 right-2 md:top-0 md:right-1 flex items-center gap-1.5 bg-gray-900/80 rounded-full px-2 py-1 border border-white/10">
                <span className="text-[8px] md:text-base">☁️</span>
                <p className="text-[7px] md:text-xs font-black text-white/70 uppercase">Météo</p>
            </div>
            <div className="absolute bottom-2 right-2 md:bottom-0 md:right-1 flex items-center gap-1.5 bg-gray-900/80 rounded-full px-2 py-1 border border-white/10">
                <span className="text-[8px] md:text-base">💰</span>
                <p className="text-[7px] md:text-xs font-black text-white/70 uppercase">Cotes</p>
            </div>

            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <line x1="25" y1="20" x2="50" y2="50" stroke="#F97316" strokeWidth="0.2" />
                <line x1="25" y1="80" x2="50" y2="50" stroke="#F97316" strokeWidth="0.2" />
                <line x1="75" y1="20" x2="50" y2="50" stroke="#F97316" strokeWidth="0.2" />
                <line x1="75" y1="80" x2="50" y2="50" stroke="#F97316" strokeWidth="0.2" />
            </svg>
        </div>
    </SlideContainer>
);

const DailyPicksSlide: React.FC<{ active: boolean }> = ({ active }) => {
    const picks = [
        { s: '⚽', m: 'PSG vs Marseille', p: 'PSG (1.65)' },
        { s: '⚽', m: 'City vs Arsenal', p: 'Over 2.5 (1.75)' },
        { s: '⚽', m: 'Real vs Barca', p: 'BTTS (1.50)' },
        { s: '🏀', m: 'Lakers vs Warriors', p: 'Lakers (1.80)' },
        { s: '🏀', m: 'Celtics vs Heat', p: 'Under 210 (1.90)' },
        { s: '🏀', m: 'Bulls vs Knicks', p: 'Knicks (1.70)' },
        { s: '🎾', m: 'Alcaraz vs Sinner', p: 'Sinner (2.10)' },
        { s: '🎾', m: 'Djokovic vs Nadal', p: 'Over 22.5 (1.85)' },
        { s: '🎾', m: 'Swiatek vs Sabalenka', p: 'Sabalenka (2.30)' },
    ];

    return (
        <SlideContainer active={active}>
            <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-white/10">
                <h3 className="text-[10px] md:text-lg font-bold text-white">Les 9 Pronostics du Jour</h3>
                <span className="text-[7px] md:text-[9px] uppercase font-black text-green-300 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">9 Sélectionnés</span>
            </div>
            <div className="grid grid-cols-3 gap-1 md:gap-2.5 mt-2.5 md:mt-4">
                {picks.map((pick, i) => (
                    <div key={i} className="p-1.5 md:p-2 bg-gray-900/60 rounded-lg md:rounded-xl border border-white/5 hover:border-orange-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-0.5">
                             <span className="text-[8px] md:text-xs">{pick.s}</span>
                             <div className="w-1 h-1 bg-green-400 rounded-full shadow-[0_0_5px_rgba(74,222,128,0.5)]"></div>
                        </div>
                        <p className="font-bold text-[7px] md:text-[10px] text-white truncate leading-tight">{pick.m}</p>
                        <p className="text-[6.5px] md:text-[9px] text-orange-400 font-black mt-0.5">{pick.p}</p>
                    </div>
                ))}
            </div>
            <div className="mt-2.5 md:mt-4 flex justify-center">
                <div className="text-[6px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
                    <span>3 Football</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span>3 Basketball</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span>3 Tennis</span>
                </div>
            </div>
        </SlideContainer>
    );
};

const HeadToHeadSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-white/10"><h3 className="text-[10px] md:text-lg font-bold text-white">Analyse Historique</h3></div>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
                <p className="font-black text-[10px] md:text-base text-white">PSG</p>
                <p className="text-2xl md:text-4xl font-black text-green-400">3</p>
                <p className="text-[7px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">Victoires (5 derniers)</p>
            </div>
            <div className="text-center">
                <p className="font-black text-[10px] md:text-base text-white">R. Madrid</p>
                <p className="text-2xl md:text-4xl font-black text-red-400">1</p>
                <p className="text-[7px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">Victoire (5 derniers)</p>
            </div>
        </div>
        <div className="text-center mt-3"><p className="text-[8px] md:text-xs text-gray-400 font-bold">1 Match Nul enregistré</p></div>
        <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 bg-orange-500/5 p-2 rounded-lg border border-orange-500/10">
          <p className="text-[7px] md:text-[10px] uppercase font-black text-orange-400">Insight AI</p>
          <p className="text-[9px] md:text-sm text-white/80 mt-0.5 italic">"Avantage psychologique : le PSG a remporté 60% des duels directs."</p>
        </div>
    </SlideContainer>
);

const BankrollSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-white/10">
            <h3 className="text-[10px] md:text-lg font-bold text-white">Gestion de Capital</h3>
            <span className="text-[7px] md:text-[9px] uppercase font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Secure</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-4">
            <div className="flex-1 space-y-2">
                <div className="bg-white/5 p-2 rounded-xl">
                    <p className="text-[7px] md:text-[10px] text-gray-400 uppercase font-bold">Solde Actuel</p>
                    <p className="font-black text-sm md:text-2xl text-green-400">1,234.50€</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 bg-white/5 p-2 rounded-xl">
                        <p className="text-[7px] md:text-[10px] text-gray-400 uppercase font-bold">Profit</p>
                        <p className="font-black text-[10px] md:text-lg text-green-400">+234€</p>
                    </div>
                    <div className="flex-1 bg-white/5 p-2 rounded-xl">
                        <p className="text-[7px] md:text-[10px] text-gray-400 uppercase font-bold">ROI</p>
                        <p className="font-black text-[10px] md:text-lg text-green-400">+15%</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-gray-900/40 p-2 rounded-xl border border-white/5 overflow-hidden">
                 <p className="text-[7px] md:text-[10px] text-gray-500 mb-1.5 uppercase font-bold tracking-widest text-center">Historique</p>
                 <div className="space-y-1">
                    <div className="flex justify-between items-center bg-green-500/10 p-1.5 rounded text-[7px] md:text-[9px] font-bold">
                        <span className="text-white">✅ PSG win</span>
                        <span className="text-green-400">+42€</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-500/10 p-1.5 rounded text-[7px] md:text-[9px] font-bold">
                        <span className="text-white">❌ Nadal lost</span>
                        <span className="text-red-400">-15€</span>
                    </div>
                 </div>
            </div>
        </div>
    </SlideContainer>
);

const TacticalSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-white/10">
            <h3 className="text-[10px] md:text-lg font-bold text-white">NextWin Tactical Pro</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-full">
                <span className="text-[7px] md:text-[9px] uppercase font-black text-orange-400">V4 Engine</span>
            </div>
        </div>
        <div className="w-full h-full flex items-center justify-center p-1 md:p-3">
             <svg className="w-full h-auto max-h-[160px] md:max-h-full drop-shadow-2xl" viewBox="0 0 200 130">
                <defs>
                    <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#10101A', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#1A1A2F', stopOpacity: 1}} />
                    </linearGradient>
                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="heatMap" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                    </filter>
                </defs>
                
                {/* Field Structure */}
                <rect x="2" y="2" width="196" height="126" fill="url(#fieldGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="4" />
                <line x1="100" y1="2" x2="100" y2="128" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <circle cx="100" cy="65" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                
                {/* Tactical Elements - Heatmaps */}
                <ellipse cx="140" cy="45" rx="30" ry="20" fill="rgba(249, 115, 22, 0.15)" filter="url(#heatMap)" />
                <ellipse cx="155" cy="45" rx="15" ry="10" fill="rgba(249, 115, 22, 0.25)" filter="url(#heatMap)" />
                <ellipse cx="40" cy="85" rx="25" ry="15" fill="rgba(59, 130, 246, 0.1)" filter="url(#heatMap)" />
                
                {/* Attack Vectors */}
                <path d="M 60 40 Q 100 20, 160 45" stroke="#F97316" fill="none" strokeWidth="1.2" strokeDasharray="3 2" filter="url(#neonGlow)" />
                <path d="M 160 45 L 152 41 M 160 45 L 152 49" stroke="#F97316" strokeWidth="1.2" />
                
                <path d="M 140 85 Q 90 100, 40 85" stroke="#3B82F6" fill="none" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                
                {/* Player Nodes */}
                <circle cx="160" cy="45" r="3.5" fill="#F97316" stroke="white" strokeWidth="0.5" filter="url(#neonGlow)" />
                <text x="165" y="42" fill="white" fontSize="5" fontWeight="black" fontFamily="sans-serif">K. Mbappé</text>
                <text x="165" y="48" fill="#F97316" fontSize="4" fontWeight="bold">ZONE DANGER</text>
                
                <circle cx="40" cy="85" r="3" fill="#3B82F6" stroke="white" strokeWidth="0.5" />
                <text x="25" y="94" fill="#3B82F6" fontSize="4" fontWeight="black" textAnchor="middle">BLOC BAS</text>

                {/* Data Overlays */}
                <rect x="5" y="5" width="40" height="15" rx="2" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" />
                <text x="8" y="11" fill="rgba(255,255,255,0.5)" fontSize="3.5" fontWeight="bold">XP: 2.14</text>
                <text x="8" y="17" fill="#F97316" fontSize="3.5" fontWeight="black">POSS: 58%</text>

                <rect x="155" y="110" width="40" height="15" rx="2" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" />
                <text x="158" y="116" fill="rgba(255,255,255,0.5)" fontSize="3.5" fontWeight="bold">CONFIANCE</text>
                <text x="158" y="122" fill="#22C55E" fontSize="4" fontWeight="black">TRÈS HAUTE</text>
            </svg>
        </div>
    </SlideContainer>
);

const slides = [
  { component: AnalysisDashboardSlide, title: "Analyse" },
  { component: LiveSearchSlide, title: "Sources" },
  { component: DailyPicksSlide, title: "Picks" },
  { component: HeadToHeadSlide, title: "H2H" },
  { component: BankrollSlide, title: "Bankroll" },
  { component: TacticalSlide, title: "Tactique" },
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Updated to 3 seconds for professional reading time
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col justify-center items-center group">
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-10 md:-inset-16 bg-gradient-to-tr from-orange-500/10 via-pink-500/10 to-purple-500/10 blur-[60px] md:blur-[100px] opacity-50 transition-opacity duration-500"></div>

      {/* Main Container */}
      <div className="relative w-full aspect-[3.5/4] sm:aspect-[4/3] md:aspect-[16/9] transform transition-all duration-500 md:group-hover:-translate-y-2">
         {/* Shimmer Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-20">
            <div className="absolute top-0 left-[-150%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in_out_infinite]"></div>
        </div>
        
        {slides.map((Slide, index) => (
          <Slide.component key={index} active={index === currentIndex} />
        ))}
      </div>

      {/* Responsive Navigation Dots */}
      <div className="flex justify-center gap-2.5 mt-6 md:absolute md:-bottom-12">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Aller au slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index 
                ? 'w-6 md:w-8 h-1.5 md:h-2 bg-orange-500' 
                : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-600 hover:bg-gray-400'
            }`}
          ></button>
        ))}
      </div>

      <style>{`
        @keyframes shimmer { 0% { transform: translateX(0); } 100% { transform: translateX(250%); } }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
