
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/pricing');
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-8">{t('signup_title')}</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            id="email" 
            label={t('login_email')} 
            type="email" 
            placeholder="your.email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            id="password" 
            label={t('login_password')} 
            type="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <Button type="submit" className="w-full py-3">{t('signup_button')}</Button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          {t('signup_has_account')} <Link to="/login" className="text-orange-400 hover:underline">{t('signup_login_link')}</Link>
        </p>
      </Card>
    </div>
  );
};

export default SignUpPage;
