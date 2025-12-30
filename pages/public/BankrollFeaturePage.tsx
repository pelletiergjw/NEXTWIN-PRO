
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../hooks/useLanguage';

const FeatureVisual: React.FC<{ type: 'bar-chart' | 'pie-chart' | 'calculator' }> = ({ type }) => {
  const barChart = (
    <svg viewBox="0 0 100 60" className="w-full h-auto" aria-hidden="true">
      <rect x="10" y="30" width="15" height="30" fill="#F97316" rx="2" opacity="0.5"/>
      <rect x="30" y="20" width="15" height="40" fill="#F97316" rx="2" opacity="0.7"/>
      <rect x="50" y="10" width="15" height="50" fill="#F97316" rx="2" />
      <rect x="70" y="25" width="15" height="35" fill="#F97316" rx="2" opacity="0.8"/>
      <line x1="5" y1="60" x2="95" y2="60" stroke="#4B5563" strokeWidth="2"/>
    </svg>
  );

  const pieChart = (
    <svg viewBox="0 0 100 60" className="w-full h-auto" aria-hidden="true">
        <circle cx="50" cy="30" r="28" fill="transparent" stroke="#4B5563" strokeWidth="4"/>
        <path d="M 50 2 A 28 28 0 0 1 78 30 L 50 30 Z" fill="#10B981" />
        <path d="M 78 30 A 28 28 0 0 1 22 30 L 50 30 Z" fill="#EF4444" />
        <path d="M 22 30 A 28 28 0 0 1 50 2 L 50 30 Z" fill="#F59E0B" />
    </svg>
  );
  
  const calculator = (
      <div className="text-orange-400 font-mono text-center text-4xl font-black tracking-tighter">
          [ (b*p - q) / b ]
      </div>
  )

  switch (type) {
    case 'bar-chart': return barChart;
    case 'pie-chart': return pieChart;
    case 'calculator': return calculator;
    default: return null;
  }
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string; visual: 'bar-chart' | 'pie-chart' | 'calculator' }> = ({ icon, title, description, visual }) => (
  <Card className="flex flex-col">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 flex-shrink-0 bg-gray-800 rounded-lg flex items-center justify-center text-2xl text-orange-400">{icon}</div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-300 flex-grow mb-6">{description}</p>
    <div className="mt-auto bg-gray-900/50 rounded-lg p-6 border border-gray-800/50">
      <FeatureVisual type={visual} />
    </div>
  </Card>
);

const BankrollFeaturePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
          {t('bankroll_feature_title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl mx-auto leading-relaxed font-light">
          {t('bankroll_feature_subtitle')}
        </p>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('bankroll_feature_section_title')}</h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="📊" 
            title={t('bankroll_feature1_title')} 
            description={t('bankroll_feature1_desc')} 
            visual="bar-chart"
          />
          <FeatureCard 
            icon="📈" 
            title={t('bankroll_feature2_title')} 
            description={t('bankroll_feature2_desc')}
            visual="pie-chart"
          />
          <FeatureCard 
            icon="🧠" 
            title={t('bankroll_feature3_title')} 
            description={t('bankroll_feature3_desc')}
            visual="calculator"
          />
           <FeatureCard 
            icon="🎯" 
            title={t('bankroll_feature4_title')} 
            description={t('bankroll_feature4_desc')}
            visual="bar-chart"
          />
        </div>
      </div>

      <Card className="text-center bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-orange-500/20">
        <h2 className="text-3xl font-bold text-white mb-4">{t('bankroll_feature_cta_title')}</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">{t('bankroll_feature_cta_desc')}</p>
        <Link to="/pricing">
          <Button className="px-10 py-4 text-lg shadow-lg shadow-orange-500/30">{t('bankroll_feature_cta_button')}</Button>
        </Link>
      </Card>
    </div>
  );
};

export default BankrollFeaturePage;
