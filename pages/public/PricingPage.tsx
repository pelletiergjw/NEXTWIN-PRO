
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
    <div className="relative min-h-screen py-20 px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block px-4 py-1.5 mb-8 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Offre Limitée - Accès Immédiat</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
          {t('pricing_title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('pricing_subtitle')}
        </p>

        <div className="max-w-lg mx-auto">
          <div className="relative group">
            {/* Animated Glow Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative p-0.5 bg-gradient-to-br from-white/10 to-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden">
              <Card className="bg-[#10101A]/90 p-10 md:p-14 rounded-[2.45rem] border-0 text-center">
                
                {/* Badge Pro */}
                <div className="flex justify-center mb-8">
                    <span className="px-5 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20">
                        {t('pricing_plan_name')}
                    </span>
                </div>
                
                <div className="mb-12">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl md:text-7xl font-black text-white tracking-tighter">{t('pricing_price')}</span>
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">/ {t('pricing_per_month')}</span>
                  </div>
                  <div className="inline-block px-3 py-1 bg-orange-500/5 rounded-full mt-4 border border-orange-500/10">
                    <p className="text-orange-500 text-[10px] uppercase font-black tracking-widest">{t('pricing_no_commitment')}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-12 text-left">
                  {/* Highlighted Feature 1 */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-orange-500/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl shadow-inner">🎯</div>
                    <div>
                        <p className="text-white font-black text-lg">{t('pricing_feature1')}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Foot, Basket & Tennis</p>
                    </div>
                  </div>

                  {/* Highlighted Feature 2 */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-pink-500/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-xl shadow-inner">📊</div>
                    <div>
                        <p className="text-white font-black text-lg">{t('pricing_feature3')}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Suivi algorithmique certifié</p>
                    </div>
                  </div>

                  {/* Other Features */}
                  <div className="grid grid-cols-1 gap-4 px-2">
                    {[
                        t('pricing_feature2'),
                        t('pricing_feature4')
                    ].map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-gray-400">
                            <span className="text-orange-500/60 font-black text-xs">✓</span>
                            <span className="text-sm font-bold tracking-wide">{feat}</span>
                        </div>
                    ))}
                  </div>
                </div>
                
                {isSubscribed ? (
                    <div className="p-5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em]">
                        {t('pricing_subscribed_message')}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Button onClick={handleSubscribe} className="w-full py-5 text-xl font-black rounded-2xl shadow-2xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                            {isAuthenticated ? t('pricing_subscribe_now') : t('pricing_signup_subscribe')}
                        </Button>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Activation immédiate après paiement
                        </p>
                    </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Footer info within pricing */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>SSL Secured Checkout</span>
            </div>
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Stripe Verified</span>
            </div>
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>Instant Setup</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
