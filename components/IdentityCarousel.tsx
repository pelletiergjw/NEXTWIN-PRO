
import React, { useState, useEffect } from 'react';

const SlideContainer: React.FC<{ children: React.ReactNode, active: boolean }> = ({ children, active }) => (
    <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${active ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95 pointer-events-none'}`}>
        <div className="relative w-full h-full bg-gradient-to-br from-[#1C1C2B] to-[#11111E] border border-white/5 rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            {children}
        </div>
    </div>
);

const IdentityCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      icon: "🎯",
      title: "Précision Absolue",
      desc: "Chaque donnée est passée au crible de 4 algorithmes distincts.",
      color: "from-orange-500 to-pink-500"
    },
    {
      icon: "⚡",
      title: "Vitesse Temps Réel",
      desc: "Analyses mises à jour à la milliseconde près selon le marché.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: "🧠",
      title: "Intelligence V4.0",
      desc: "Le moteur prédictif le plus avancé du marché français.",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: "🛡️",
      title: "Sécurité Totale",
      desc: "Vos données et votre capital sont protégés par cryptage AES-256.",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: "🌍",
      title: "Vision Globale",
      desc: "Scan permanent de plus de 10 000 sources internationales.",
      color: "from-yellow-400 to-orange-600"
    },
    {
      icon: "🏆",
      title: "Standard Excellence",
      desc: "Conçu par des experts pour des investisseurs exigeants.",
      color: "from-pink-500 to-rose-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square group">
      {/* Dynamic Glow Background */}
      <div className={`absolute -inset-10 bg-gradient-to-tr ${slides[currentIndex].color} blur-[80px] opacity-20 transition-all duration-1000`}></div>

      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <SlideContainer key={index} active={index === currentIndex}>
            <div className={`w-20 h-20 md:w-24 md:h-24 mb-6 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center text-4xl md:text-5xl shadow-2xl shadow-black/50 border border-white/20 transform group-hover:rotate-6 transition-transform duration-500`}>
              {slide.icon}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight leading-tight uppercase">
              {slide.title}
            </h3>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed px-4">
              {slide.desc}
            </p>
            
            {/* Visual Indicator of Progress */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
                    ></div>
                ))}
            </div>
          </SlideContainer>
        ))}
      </div>
    </div>
  );
};

export default IdentityCarousel;
