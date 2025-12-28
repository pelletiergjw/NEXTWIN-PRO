
import React from 'react';
import Card from './ui/Card';
import { useLanguage } from '../hooks/useLanguage';

const TestimonialCard: React.FC<{ name: string; role: string; text: string }> = ({ name, role, text }) => (
  <Card className="relative p-8 h-full flex flex-col border-gray-800/60 bg-gradient-to-br from-[#1C1C2B] to-[#151522] hover:border-orange-500/30 transition-all duration-300">
    <div className="absolute top-4 right-8 text-6xl text-orange-500/10 font-serif leading-none italic pointer-events-none">“</div>
    <div className="flex gap-1 mb-4 text-orange-400">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-gray-300 mb-6 italic flex-grow">"{text}"</p>
    <div className="flex items-center gap-3 pt-4 border-t border-gray-800/50">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{name}</h4>
        <p className="text-gray-500 text-xs">{role}</p>
      </div>
    </div>
  </Card>
);

const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl font-bold text-white mb-4">{t('home_testimonials_title' as any)}</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t('home_testimonials_subtitle' as any)}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        <TestimonialCard 
          name={t('testimony1_name' as any)} 
          role={t('testimony1_role' as any)} 
          text={t('testimony1_text' as any)} 
        />
        <TestimonialCard 
          name={t('testimony2_name' as any)} 
          role={t('testimony2_role' as any)} 
          text={t('testimony2_text' as any)} 
        />
        <TestimonialCard 
          name={t('testimony3_name' as any)} 
          role={t('testimony3_role' as any)} 
          text={t('testimony3_text' as any)} 
        />
      </div>
    </section>
  );
};

export default Testimonials;
