
import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800/50">
      <button
        className="w-full flex justify-between items-center text-left py-6 px-2 focus:outline-none focus-visible:bg-gray-800/50 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s/g, '')}`}
      >
        <span className="text-lg font-semibold text-white">{question}</span>
        <span className="flex-shrink-0 ml-4">
           <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
        </span>
      </button>
      <div
        id={`faq-answer-${question.replace(/\s/g, '')}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
        role="region"
      >
        <div className="pb-6 px-2 text-gray-300/90 leading-relaxed">
          <p className="whitespace-pre-line">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FaqPage: React.FC = () => {
    const { t } = useLanguage();
  
  const faqCategories = [
    {
      category: t('faq_cat_general' as any),
      items: [
        { q: t('faq_q_what_is' as any), a: t('faq_a_what_is' as any) },
        { q: t('faq_q_for_who' as any), a: t('faq_a_for_who' as any) },
        { q: t('faq_q_is_legal' as any), a: t('faq_a_is_legal' as any) }
      ]
    },
    {
      category: t('faq_cat_ai' as any),
      items: [
        { q: t('faq_q_how_picks' as any), a: t('faq_a_how_picks' as any) },
        { q: t('faq_q_is_reliable' as any), a: t('faq_a_is_reliable' as any) },
        { q: t('faq_q_when_picks' as any), a: t('faq_a_when_picks' as any) }
      ]
    },
    {
      category: t('faq_cat_sub' as any),
      items: [
        { q: t('faq_q_how_cancel' as any), a: t('faq_a_how_cancel' as any) },
        { q: t('faq_q_payment' as any), a: t('faq_a_payment' as any) },
        { q: t('faq_q_what_after_sub' as any), a: t('faq_a_what_after_sub' as any) }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-center text-white mb-6">{t('faq_title')}</h1>
      <p className="text-xl text-center text-gray-300 mb-16">
        {t('faq_subtitle')}
      </p>
      <div className="space-y-12">
        {faqCategories.map((category, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4 pb-2 border-b-2 border-orange-400/20">{category.category}</h2>
            <div className="bg-[#1C1C2B] rounded-lg p-2 md:p-6">
              {category.items.map((faq, faqIndex) => (
                <FaqItem key={faqIndex} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
