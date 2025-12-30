
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const PricingPage: React.FC = () => {
  const { isAuthenticated, isSubscribed, subscribe } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubscribe = () => {
    if (isAuthenticated) {
      subscribe();
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center py-16 px-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">{t('pricing_title')}</h1>
      <p className="text-base md:text-lg text-gray-400 mb-14 max-w-xl mx-auto font-medium">
        {t('pricing_subtitle')}
      </p>

      <div className="max-w-sm mx-auto">
        <div className="relative p-0.5 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-[2rem] shadow-2xl">
          <Card className="bg-[#1C1C2B] p-10 md:p-12 rounded-[1.95rem] border-0">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{t('pricing_plan_name')}</h2>
            
            <div className="my-8">
              <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{t('pricing_price')}</span>
              <span className="text-gray-400 text-sm font-bold block mt-1 uppercase tracking-widest">/ {t('pricing_per_month')}</span>
              <div className="inline-block px-3 py-1 bg-orange-500/10 rounded-full mt-4">
                <p className="text-orange-400 text-[9px] uppercase font-black tracking-widest">{t('pricing_no_commitment')}</p>
              </div>
            </div>

            <ul className="text-left space-y-4 text-gray-300 mb-10">
              {[
                t('pricing_feature1'),
                t('pricing_feature2'),
                t('pricing_feature3'),
                t('pricing_feature4')
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-orange-500 text-base mt-0.5">✓</span>
                  <span className="text-[13px] font-medium opacity-90">{feat}</span>
                </li>
              ))}
            </ul>
            
            {isSubscribed ? (
                <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    {t('pricing_subscribed_message')}
                </div>
            ) : (
                 <Button onClick={handleSubscribe} className="w-full py-4 text-lg font-black rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
                    {isAuthenticated ? t('pricing_subscribe_now') : t('pricing_signup_subscribe')}
                </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
