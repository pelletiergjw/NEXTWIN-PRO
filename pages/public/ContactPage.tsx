
import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../hooks/useLanguage';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-5xl font-bold text-center text-white mb-6">{t('contact_title')}</h1>
      <p className="text-xl text-center text-gray-300 mb-12">
        {t('contact_subtitle')}
      </p>
      <Card>
        {submitted ? (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-white mb-2">{t('contact_success_title')}</h2>
            <p className="text-gray-300">{t('contact_success_subtitle')}</p>
          </div>
        ) : (
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
                rows={5}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={`${t('contact_message')}...`}
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full py-3">{t('contact_send')}</Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ContactPage;
