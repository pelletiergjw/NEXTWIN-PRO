import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../hooks/useLanguage';

// Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const InfoItem: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center text-orange-400">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-white">{title}</h3>
            <div className="text-sm text-gray-400">{children}</div>
        </div>
    </div>
);

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Card>
          <div className="p-8">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/20 mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">{t('contact_success_title')}</h2>
            <p className="text-gray-300 mb-8">{t('contact_success_subtitle')}</p>
            <Link to="/">
                <Button>{t('contact_back_home')}</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">{t('contact_title')}</h1>
        <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
          {t('contact_subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input id="name" label={t('contact_name')} type="text" placeholder="John Doe" required />
              <Input id="email" label={t('contact_email')} type="email" placeholder="john.doe@example.com" required />
              <Input id="subject" label={t('contact_subject')} type="text" placeholder={t('contact_subject')} required />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  {t('contact_message')}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={`${t('contact_message')}...`}
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full py-4 text-lg">{t('contact_send')}</Button>
            </form>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-2 space-y-8 pt-6">
          <InfoItem 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            title={t('contact_info_title')}
          >
            <a href={`mailto:${t('contact_info_email')}`} className="hover:text-orange-400 transition-colors">{t('contact_info_email')}</a>
          </InfoItem>
          <InfoItem 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title={t('contact_response_time_title')}
          >
            {t('contact_response_time_desc')}
          </InfoItem>
          <InfoItem 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title={t('contact_check_faq')}
          >
            <p>{t('contact_faq_desc')} <Link to="/faq" className="text-orange-400 hover:underline">{t('nav_faq')}</Link></p>
          </InfoItem>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;