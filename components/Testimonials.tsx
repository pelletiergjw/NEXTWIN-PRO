
import React from 'react';
import Card from './ui/Card';
import { useLanguage } from '../hooks/useLanguage';

const TestimonialCard: React.FC<{ name: string; role: string; text: string }> = ({ name, role, text }) => (
  <Card className="w-[350px] mx-4 flex-shrink-0 relative p-6 h-full flex flex-col border-gray-800/60 bg-gradient-to-br from-[#1C1C2B] to-[#151522] hover:border-orange-500/50 transition-all duration-300 shadow-xl">
    <div className="absolute top-2 right-6 text-5xl text-orange-500/5 font-serif leading-none italic pointer-events-none">“</div>
    <div className="flex gap-1 mb-3 text-orange-400">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-gray-300 mb-6 italic text-sm flex-grow leading-relaxed">"{text}"</p>
    <div className="flex items-center gap-3 pt-4 border-t border-gray-800/50">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shadow-inner">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm leading-none mb-1">{name}</h4>
        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{role}</p>
      </div>
    </div>
  </Card>
);

const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  const testimonialsRow1 = [
    { name: t('testimony1_name' as any), role: t('testimony1_role' as any), text: t('testimony1_text' as any) },
    { name: t('testimony2_name' as any), role: t('testimony2_role' as any), text: t('testimony2_text' as any) },
    { name: t('testimony3_name' as any), role: t('testimony3_role' as any), text: t('testimony3_text' as any) },
    { name: t('testimony4_name' as any), role: t('testimony4_role' as any), text: t('testimony4_text' as any) },
    { name: t('testimony5_name' as any), role: t('testimony5_role' as any), text: t('testimony5_text' as any) },
  ];

  const testimonialsRow2 = [
    { name: t('testimony6_name' as any), role: t('testimony6_role' as any), text: t('testimony6_text' as any) },
    { name: t('testimony7_name' as any), role: t('testimony7_role' as any), text: t('testimony7_text' as any) },
    { name: t('testimony8_name' as any), role: t('testimony8_role' as any), text: t('testimony8_text' as any) },
    { name: t('testimony9_name' as any), role: t('testimony9_role' as any), text: t('testimony9_text' as any) },
    { name: t('testimony1_name' as any), role: t('testimony1_role' as any), text: t('testimony1_text' as any) },
  ];

  return (
    <section className="py-24 bg-[#10101A] overflow-hidden">
      <div className="text-center mb-16 px-4">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-orange-400 uppercase bg-orange-400/10 rounded-full">
          Social Proof
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          {t('home_testimonials_title' as any)}
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('home_testimonials_subtitle' as any)}
        </p>
      </div>

      <div className="pause-on-hover relative space-y-8">
        {/* Row 1 - Défilement vers la gauche */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee">
            {testimonialsRow1.map((item, idx) => (
              <TestimonialCard key={`row1-${idx}`} {...item} />
            ))}
            {/* Duplication pour l'effet infini */}
            {testimonialsRow1.map((item, idx) => (
              <TestimonialCard key={`row1-dup-${idx}`} {...item} />
            ))}
          </div>
        </div>

        {/* Row 2 - Défilement vers la droite */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-reverse">
            {testimonialsRow2.map((item, idx) => (
              <TestimonialCard key={`row2-${idx}`} {...item} />
            ))}
            {/* Duplication pour l'effet infini */}
            {testimonialsRow2.map((item, idx) => (
              <TestimonialCard key={`row2-dup-${idx}`} {...item} />
            ))}
          </div>
        </div>
        
        {/* Gradients de masquage sur les côtés pour un effet de fondu */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#10101A] to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#10101A] to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
};

export default Testimonials;
