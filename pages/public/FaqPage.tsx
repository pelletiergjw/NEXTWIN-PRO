
import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-300 pr-4">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FaqPage: React.FC = () => {
    const { t } = useLanguage();
  const faqs = [
    {
      question: t('faq_q1'),
      answer: t('faq_a1')
    },
    {
      question: t('faq_q2'),
      answer: t('faq_a2')
    },
    {
      question: t('faq_q3'),
      answer: t('faq_a3')
    },
    {
      question: t('faq_q4'),
      answer: t('faq_a4')
    },
    {
      question: t('faq_q5'),
      answer: t('faq_a5')
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-center text-white mb-6">{t('faq_title')}</h1>
      <p className="text-xl text-center text-gray-300 mb-16">
        {t('faq_subtitle')}
      </p>
      <div className="bg-[#1C1C2B] rounded-lg p-6">
        {faqs.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
