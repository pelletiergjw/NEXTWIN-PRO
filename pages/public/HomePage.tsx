
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { SPORTS } from '../../constants';
import HeroImage from '../../components/HeroImage';
import { useLanguage } from '../../hooks/useLanguage';
import BookmakerLogos from '../../components/BookmakerLogos';
import Testimonials from '../../components/Testimonials';

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <Card className="text-center transform hover:scale-105 transition-transform duration-300">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </Card>
);

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            {t('home_hero_title_1')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{t('home_hero_title_2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            {t('home_hero_subtitle')}
          </p>
          <div className="mt-10">
            <Link to="/signup">
              <Button className="px-10 py-4 text-lg">{t('home_hero_cta')}</Button>
            </Link>
          </div>
        </div>
        <div className="mt-12 max-w-5xl mx-auto px-4">
            <HeroImage />
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-4xl font-bold text-center text-white mb-12">{t('home_features_title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🧠" 
            title={t('home_feature1_title')}
            description={t('home_feature1_desc')}
          />
          <FeatureCard 
            icon="📊" 
            title={t('home_feature2_title')}
            description={t('home_feature2_desc')}
          />
          <FeatureCard 
            icon="✍️" 
            title={t('home_feature3_title')}
            description={t('home_feature3_desc')}
          />
        </div>
      </section>

      {/* Sports Section */}
      <section className="text-center">
        <h2 className="text-4xl font-bold text-white mb-12">{t('home_sports_title')}</h2>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {SPORTS.map(sport => (
            <div key={sport.key} className="flex flex-col items-center p-6 bg-[#1C1C2B] rounded-xl">
              <span className="text-6xl">{sport.icon}</span>
              <span className="mt-4 text-xl font-semibold">{t(sport.labelKey as any)}</span>
            </div>
          ))}
        </div>
         <div className="mt-10">
          <Link to="/sports-and-bets">
            <Button variant="secondary">{t('home_sports_cta')}</Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Bookmakers Section */}
      <BookmakerLogos />

       {/* CTA Section */}
      <section>
        <Card className="bg-gradient-to-r from-orange-500 to-pink-600 text-center py-12">
            <h2 className="text-4xl font-bold text-white mb-4">{t('home_cta_title')}</h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">{t('home_cta_subtitle')}</p>
            <Link to="/pricing">
                <Button variant="secondary" className="bg-gray-900 hover:bg-black text-lg px-8 py-3">{t('home_cta_button')}</Button>
            </Link>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
