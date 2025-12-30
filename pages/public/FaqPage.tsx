
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`transition-all duration-500 border border-gray-800/40 rounded-3xl overflow-hidden mb-4 ${isOpen ? 'bg-gray-800/20 border-orange-500/30 ring-1 ring-orange-500/10' : 'bg-[#1C1C2B] hover:border-gray-700'}`}>
      <button
        className="w-full flex justify-between items-center text-left py-6 px-8 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={`text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-gray-300'}`}>{question}</span>
        <span className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-orange-500 border-orange-500 rotate-180 text-white' : 'text-gray-500'}`}>
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
           </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        role="region"
      >
        <div className="pb-8 px-8 text-gray-400 text-sm md:text-base leading-relaxed font-medium">
          <p className="whitespace-pre-line bg-black/20 p-6 rounded-2xl border border-white/5">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FaqPage: React.FC = () => {
    const { t } = useLanguage();
  
  const faqCategories = [
    {
      category: t('faq_cat_general'),
      items: [
        { q: t('faq_q_what_is'), a: t('faq_a_what_is') },
        { q: t('faq_q_for_who'), a: t('faq_a_for_who') },
        { q: t('faq_q_is_legal'), a: t('faq_a_is_legal') }
      ]
    },
    {
      category: t('faq_cat_ai'),
      items: [
        { q: t('faq_q_how_picks'), a: t('faq_a_how_picks') },
        { q: t('faq_q_is_reliable'), a: t('faq_a_is_reliable') },
        { q: t('faq_q_when_picks'), a: t('faq_a_when_picks') }
      ]
    },
    {
      category: t('faq_cat_sub'),
      items: [
        { q: t('faq_q_how_cancel'), a: t('faq_a_how_cancel') },
        { q: t('faq_q_payment'), a: t('faq_a_payment') },
        { q: t('faq_q_what_after_sub'), a: t('faq_a_what_after_sub') }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-20 space-y-6">
        <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Centre d'aide stratégique</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {t('faq_title')}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('faq_subtitle')}
        </p>
      </div>

      <div className="space-y-16">
        {faqCategories.map((category, index) => (
          <div key={index} className="space-y-8">
            <div className="flex items-center gap-4">
                <h2 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] whitespace-nowrap">
                    {category.category}
                </h2>
                <div className="h-px w-full bg-gradient-to-r from-orange-500/20 to-transparent"></div>
            </div>
            
            <div className="space-y-0">
              {category.items.map((faq, faqIndex) => (
                <FaqItem key={faqIndex} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="mt-24 p-8 md:p-12 bg-gradient-to-br from-[#1C1C2B] to-[#11111E] border border-gray-800 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/5 blur-[80px]"></div>
        <h3 className="text-2xl font-black text-white mb-4">Une question spécifique ?</h3>
        <p className="text-gray-400 mb-8 font-medium">Notre équipe d'experts est disponible pour vous répondre sous 24h.</p>
        <Link to="/contact" className="inline-block px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all hover:scale-105 tracking-widest text-[10px] uppercase">
            Contacter le support
        </Link>
      </div>
    </div>
  );
};

export default FaqPage;
