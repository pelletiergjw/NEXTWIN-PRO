
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const bookmakers = [
  'Betclic',
  'Winamax',
  'Unibet',
  'Parions Sport',
  'Bwin',
  'ZEbet'
];

const BookmakerLogos: React.FC = () => {
    const { t } = useLanguage();
  return (
    <section className="text-center py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
          {t('home_bookmakers_title')}
        </h2>
        <p className="text-base md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('home_bookmakers_subtitle')}
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {bookmakers.map((name) => (
            <div 
              key={name} 
              className="group relative bg-white/5 border border-white/5 rounded-2xl px-6 py-6 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-orange-500/30 shadow-xl overflow-hidden"
            >
              {/* Subtle hover background glow */}
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
              
              <span className="relative z-10 text-sm md:text-base font-black text-gray-400 group-hover:text-white tracking-[0.1em] uppercase transition-colors">
                {name}
              </span>
              
              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center items-center gap-6 opacity-40 grayscale group hover:grayscale-0 transition-all">
           <div className="h-px w-12 bg-gray-800"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Flux de cotes certifiés</span>
           <div className="h-px w-12 bg-gray-800"></div>
        </div>
      </div>
    </section>
  );
};

export default BookmakerLogos;
