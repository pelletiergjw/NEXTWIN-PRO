
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
    <div className="max-w-4xl mx-auto text-center py-12 px-4">
      <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">{t('pricing_title')}</h1>
      <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
        {t('pricing_subtitle')}
      </p>

      <div className="relative group max-w-md mx-auto">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <Card className="relative transform transition-all duration-300 border-2 border-orange-500/30 hover:border-orange-500 bg-[#1C1C2B] p-8 md:p-12 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">{t('pricing_plan_name')}</h2>
          
          <div className="my-10 flex flex-col items-center">
            <span className="text-7xl font-black text-white leading-none">{t('pricing_price')}</span>
            <span className="text-gray-400 mt-3 text-lg font-medium opacity-80">{t('pricing_per_month')}</span>
            <span className="text-orange-500/70 text-[10px] uppercase font-black tracking-widest mt-2">{t('pricing_no_commitment')}</span>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-8">
            <p className="text-orange-400 font-bold text-sm">
              ✨ {t('pricing_feature1')}
            </p>
          </div>

          <ul className="text-left space-y-4 text-gray-300 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold text-xl leading-none">✓</span>
              <span className="text-sm font-medium">{t('pricing_feature2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold text-xl leading-none">✓</span>
              <span className="text-sm font-medium">{t('pricing_feature3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold text-xl leading-none">✓</span>
              <span className="text-sm font-medium">{t('pricing_feature4')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold text-xl leading-none">✓</span>
              <span className="text-sm font-medium">{t('pricing_feature5')}</span>
            </li>
          </ul>
          
          {isSubscribed ? (
              <div className="mt-8 p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold uppercase text-xs tracking-widest">
                  {t('pricing_subscribed_message')}
              </div>
          ) : (
               <Button onClick={handleSubscribe} className="w-full text-xl py-5 shadow-xl shadow-orange-500/40 font-black">
                  {isAuthenticated ? t('pricing_subscribe_now') : t('pricing_signup_subscribe')}
              </Button>
          )}
          
          <p className="mt-8 text-[10px] text-gray-500 uppercase font-bold tracking-tighter opacity-60">
            Paiement sécurisé via Stripe • Résiliation en 1 clic
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;
