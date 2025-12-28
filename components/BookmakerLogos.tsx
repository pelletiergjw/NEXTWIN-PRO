
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

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
    <section className="text-center">
      <h2 className="text-4xl font-bold text-white mb-4">{t('home_bookmakers_title')}</h2>
      <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">{t('home_bookmakers_subtitle')}</p>
      <div className="flex justify-center items-center gap-x-8 gap-y-6 flex-wrap">
        {bookmakers.map((name) => (
          <div key={name} className="bg-gray-800/50 rounded-lg px-6 py-3 transition-transform duration-300 hover:scale-110 hover:bg-gray-700">
            <span className="text-xl font-bold text-gray-300 tracking-wider">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookmakerLogos;
