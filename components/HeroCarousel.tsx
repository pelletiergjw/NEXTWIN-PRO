
import React, { useState, useEffect } from 'react';

// --- SLIDE COMPONENTS ---

const SlideContainer: React.FC<{ children: React.ReactNode, active: boolean }> = ({ children, active }) => (
    <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${active ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg p-4 md:p-6">
            {children}
        </div>
    </div>
);

const AnalysisDashboardSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl">⚽</span>
            <span className="text-sm md:text-lg font-bold text-white truncate">PSG vs. R. Madrid</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-[9px] uppercase font-bold text-blue-300">Analyse en cours</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-4">
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Probabilité de Victoire (PSG)</p>
            <p className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500 my-1 md:my-2">72.5%</p>
            <div className="w-full bg-white/10 rounded-full h-2 md:h-3"><div className="bg-gradient-to-r from-green-400 to-teal-400 h-2 md:h-3 rounded-full" style={{width: '72.5%'}}></div></div>
          </div>
          <div className="md:col-span-1 space-y-2 md:space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Forme Récente</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-5 h-5 flex items-center justify-center bg-green-500/20 text-green-400 text-xs rounded-full">V</span><span className="w-5 h-5 flex items-center justify-center bg-green-500/20 text-green-400 text-xs rounded-full">V</span><span className="w-5 h-5 flex items-center justify-center bg-yellow-500/20 text-yellow-400 text-xs rounded-full">N</span><span className="w-5 h-5 flex items-center justify-center bg-red-500/20 text-red-400 text-xs rounded-full">D</span><span className="w-5 h-5 flex items-center justify-center bg-green-500/20 text-green-400 text-xs rounded-full">V</span>
              </div>
            </div>
             <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Historique</p><p className="text-base md:text-lg font-bold text-white mt-1">PSG 3-1</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
          <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Verdict de l'IA</p>
          <p className="text-xs md:text-sm text-white/80 mt-1 italic line-clamp-2 md:line-clamp-none">"Malgré l'absence d'un joueur clé, l'avantage à domicile et la dynamique actuelle favorisent fortement le PSG."</p>
        </div>
    </SlideContainer>
);

const LiveSearchSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-white/10">
            <h3 className="text-base md:text-lg font-bold text-white">Vérification Live</h3>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <span className="text-[9px] uppercase font-bold text-purple-300">Temps Réel</span>
            </div>
        </div>
        <div className="relative w-full h-[calc(100%-52px)] md:h-[calc(100%-60px)] flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            
            <div className="absolute top-0 left-1 w-24 h-8 md:w-32 md:h-10 bg-gray-900/70 rounded-lg p-2 text-[10px] md:text-xs flex items-center gap-2 border border-white/10"><span className="text-sm md:text-base">📰</span><p className="font-bold text-white/80">Actualités</p></div>
            <div className="absolute bottom-0 left-1 w-24 h-8 md:w-32 md:h-10 bg-gray-900/70 rounded-lg p-2 text-[10px] md:text-xs flex items-center gap-2 border border-white/10"><span className="text-sm md:text-base">📈</span><p className="font-bold text-white/80">Stats</p></div>
            <div className="absolute top-0 right-1 w-24 h-8 md:w-32 md:h-10 bg-gray-900/70 rounded-lg p-2 text-[10px] md:text-xs flex items-center gap-2 border border-white/10"><span className="text-sm md:text-base">☁️</span><p className="font-bold text-white/80">Météo</p></div>
            <div className="absolute bottom-0 right-1 w-24 h-8 md:w-32 md:h-10 bg-gray-900/70 rounded-lg p-2 text-[10px] md:text-xs flex items-center gap-2 border border-white/10"><span className="text-sm md:text-base">💰</span><p className="font-bold text-white/80">Cotes</p></div>

            <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
                <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: '#F97316', stopOpacity: 1}} /><stop offset="100%" style={{stopColor: '#EC4899', stopOpacity: 0}} /></linearGradient></defs>
                <line x1="25" y1="20" x2="50" y2="50" stroke="url(#grad)" strokeWidth="0.5" />
                <line x1="25" y1="80" x2="50" y2="50" stroke="url(#grad)" strokeWidth="0.5" />
                <line x1="75" y1="20" x2="50" y2="50" stroke="url(#grad)" strokeWidth="0.5" />
                <line x1="75" y1="80" x2="50" y2="50" stroke="url(#grad)" strokeWidth="0.5" />
            </svg>
        </div>
    </SlideContainer>
);

const DailyPicksSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-white/10">
            <h3 className="text-base md:text-lg font-bold text-white">Pronostics du Jour</h3>
            <span className="text-[9px] uppercase font-bold text-green-300 bg-green-500/10 px-2 py-1 rounded">9 Pronos</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-3 mt-4">
            {['⚽ Football', '🏀 Basket', '🎾 Tennis'].map(sport => (
                <div key={sport} className="space-y-1.5 flex-1">
                    <p className="font-bold text-xs text-center text-gray-300 mb-1 md:mb-2">{sport}</p>
                    <div className="p-2 bg-gray-900/50 rounded text-[10px] text-center"><p className="font-bold text-white/90 truncate">Équipe A vs Équipe B</p><p className="text-orange-400">Vainqueur: A (1.85)</p></div>
                    <div className="p-2 bg-gray-900/50 rounded text-[10px] text-center"><p className="font-bold text-white/90 truncate">Équipe C vs Équipe D</p><p className="text-orange-400">Total Buts: +2.5</p></div>
                    <div className="hidden md:block p-2 bg-gray-900/50 rounded text-xs text-center"><p className="font-bold text-white/90 truncate">Équipe E vs Équipe F</p><p className="text-orange-400">Double Chance</p></div>
                </div>
            ))}
        </div>
    </SlideContainer>
);

const HeadToHeadSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-white/10"><h3 className="text-base md:text-lg font-bold text-white">Analyse H2H</h3></div>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
                <p className="font-bold text-white text-sm md:text-base">PSG</p>
                <p className="text-3xl md:text-4xl font-black text-green-400">3</p>
                <p className="text-[11px] md:text-xs text-gray-400">Victoires (5 derniers)</p>
            </div>
            <div className="text-center">
                <p className="font-bold text-white text-sm md:text-base">Real Madrid</p>
                <p className="text-3xl md:text-4xl font-black text-red-400">1</p>
                <p className="text-[11px] md:text-xs text-gray-400">Victoire (5 derniers)</p>
            </div>
        </div>
        <div className="text-center mt-2"><p className="text-xs text-gray-400">1 Match Nul</p></div>
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
          <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Insight IA</p>
          <p className="text-xs md:text-sm text-white/80 mt-1 italic line-clamp-2 md:line-clamp-none">"Le PSG a un avantage psychologique significatif, ayant remporté 60% des dernières confrontations."</p>
        </div>
    </SlideContainer>
);

const BankrollSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-white/10">
            <h3 className="text-base md:text-lg font-bold text-white">Gestion Bankroll</h3>
            <span className="text-[9px] uppercase font-bold text-green-300 bg-green-500/10 px-2 py-1 rounded">PRO</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mt-4">
            <div className="col-span-2 md:col-span-2 space-y-3">
                <div>
                    <p className="text-[10px] text-gray-400">Bankroll Actuelle</p>
                    <p className="font-black text-2xl md:text-3xl text-green-400">1234.50€</p>
                </div>
                <div className="flex gap-4">
                     <div>
                        <p className="text-[10px] text-gray-400">Profit</p>
                        <p className="font-bold text-base md:text-lg text-green-400">+234€</p>
                    </div>
                     <div>
                        <p className="text-[10px] text-gray-400">ROI</p>
                        <p className="font-bold text-base md:text-lg text-green-400">+15%</p>
                    </div>
                </div>
            </div>
            <div className="col-span-2 md:col-span-3">
                 <p className="text-[10px] text-gray-400 mb-2">Historique Récent</p>
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded text-xs">
                        <span className="font-bold text-white/90 truncate">✅ PSG vs OM</span>
                        <span className="font-bold text-green-400">+42€</span>
                    </div>
                     <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded text-xs">
                        <span className="font-bold text-white/90 truncate">❌ Nadal vs Djokovic</span>
                        <span className="font-bold text-red-400">-50€</span>
                    </div>
                     <div className="hidden sm:flex justify-between items-center bg-gray-900/50 p-2 rounded text-xs">
                        <span className="font-bold text-white/90 truncate">✅ Lakers vs Celtics</span>
                        <span className="font-bold text-green-400">+88€</span>
                    </div>
                 </div>
            </div>
        </div>
    </SlideContainer>
);

const TacticalSlide: React.FC<{ active: boolean }> = ({ active }) => (
    <SlideContainer active={active}>
        <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-white/10"><h3 className="text-base md:text-lg font-bold text-white">Analyse Tactique</h3></div>
        <div className="w-full h-[calc(100%-52px)] md:h-[calc(100%-60px)] flex items-center justify-center">
             <svg className="w-full h-full" viewBox="0 0 200 130">
                <defs>
                    <filter id="heatmapBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="8" /></filter>
                    <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto"><polygon points="0 0, 5 1.75, 0 3.5" fill="#F97316" /></marker>
                     <marker id="arrowhead-blue" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto"><polygon points="0 0, 5 1.75, 0 3.5" fill="#3B82F6" /></marker>
                </defs>
                <rect x="1" y="1" width="198" height="128" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="5" />
                <line x1="100" y1="1" x2="100" y2="129" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <circle cx="100" cy="65" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <rect x="1" y="25" width="25" height="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <rect x="174" y="25" width="25" height="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <ellipse cx="70" cy="40" rx="30" ry="20" fill="rgba(249, 115, 22, 0.2)" filter="url(#heatmapBlur)" />
                <ellipse cx="140" cy="80" rx="25" ry="15" fill="rgba(59, 130, 246, 0.2)" filter="url(#heatmapBlur)" />
                <path d="M 40 40 C 60 20, 90 30, 110 50" stroke="#F97316" fill="none" strokeWidth="1.5" strokeDasharray="4 2" marker-end="url(#arrowhead)" />
                <path d="M 160 90 L 120 70" stroke="#3B82F6" fill="none" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 145 45 C 130 30, 100 40, 90 50" stroke="#3B82F6" fill="none" strokeWidth="1.5" marker-end="url(#arrowhead-blue)"/>
                <circle cx="40" cy="40" r="4" fill="#F97316" stroke="white" strokeWidth="0.5" /><circle cx="70" cy="70" r="4" fill="#F97316" stroke="white" strokeWidth="0.5" /><circle cx="90" cy="50" r="4" fill="#F97316" stroke="white" strokeWidth="0.5" /><circle cx="110" cy="50" r="4" fill="#F97316" stroke="white" strokeWidth="0.5" />
                <circle cx="160" cy="90" r="4" fill="#3B82F6" stroke="white" strokeWidth="0.5" /><circle cx="130" cy="60" r="4" fill="#3B82F6" stroke="white" strokeWidth="0.5" /><circle cx="120" cy="70" r="4" fill="#3B82F6" stroke="white" strokeWidth="0.5" /><circle cx="145" cy="45" r="4" fill="#3B82F6" stroke="white" strokeWidth="0.5" />
            </svg>
        </div>
    </SlideContainer>
);

const slides = [
  { component: AnalysisDashboardSlide, title: "Analyse Détaillée" },
  { component: LiveSearchSlide, title: "Vérification Live" },
  { component: DailyPicksSlide, title: "Pronostics du Jour" },
  { component: HeadToHeadSlide, title: "Analyse H2H" },
  { component: BankrollSlide, title: "Gestion de Bankroll" },
  { component: TacticalSlide, title: "Visuels Tactiques" },
];

// --- MAIN CAROUSEL COMPONENT ---

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col justify-center items-center group perspective-1000">
      {/* Glow */}
      <div className="absolute -inset-16 bg-gradient-to-tr from-orange-500/20 via-pink-500/20 to-purple-500/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

      {/* Slides Container */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] transform transition-transform duration-500 md:group-hover:rotate-x-6 md:group-hover:-translate-y-4">
         {/* Shimmer Effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none z-10">
            <div className="absolute top-0 left-[-150%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_4s_ease-in_out_infinite]"></div>
        </div>
        <style>{`@keyframes shimmer { 0% { transform: translateX(0); } 100% { transform: translateX(250%); } }`}</style>
        
        {slides.map((Slide, index) => (
          <Slide.component key={index} active={index === currentIndex} />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6 md:absolute md:-bottom-12 md:mt-0">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-orange-500 scale-125' : 'bg-gray-600 hover:bg-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
