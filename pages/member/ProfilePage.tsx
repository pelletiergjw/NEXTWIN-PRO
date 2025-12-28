
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated profile:", { name, email });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-center text-white mb-8">{t('profile_title')}</h1>
            <Card className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        id="name"
                        label={t('profile_username')}
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Input 
                        id="email"
                        label={t('profile_email')}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Input 
                        id="password"
                        label={t('profile_password_label')}
                        type="password"
                    />
                    <div className="flex justify-between items-center">
                        <Button type="submit">{t('profile_save_button')}</Button>
                        {isSaved && <span className="text-green-400">{t('profile_saved_message')}</span>}
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ProfilePage;
