
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-bold text-white mb-6">{t('pricing_title')}</h1>
      <p className="text-xl text-gray-300 mb-16">
        {t('pricing_subtitle')}
      </p>

      <Card className="max-w-md mx-auto transform hover:scale-105 transition-transform duration-300 border-2 border-orange-500">
        <h2 className="text-2xl font-bold text-white mb-2">{t('pricing_plan_name')}</h2>
        <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 my-4">
          {t('pricing_price')}
        </p>
        <p className="text-gray-400 font-semibold mb-6">{t('pricing_per_month')}</p>

        <ul className="text-left space-y-4 text-gray-300 my-8">
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>{t('pricing_feature1')}
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>{t('pricing_feature2')}
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>{t('pricing_feature3')}
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>{t('pricing_feature4')}
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>{t('pricing_feature5')}
          </li>
        </ul>
        
        {isSubscribed ? (
            <div className="mt-8 p-3 bg-green-900 text-green-300 border border-green-700 rounded-lg">
                {t('pricing_subscribed_message')}
            </div>
        ) : (
             <Button onClick={handleSubscribe} className="w-full text-lg py-3 mt-8">
                {isAuthenticated ? t('pricing_subscribe_now') : t('pricing_signup_subscribe')}
            </Button>
        )}
      </Card>
    </div>
  );
};

export default PricingPage;
