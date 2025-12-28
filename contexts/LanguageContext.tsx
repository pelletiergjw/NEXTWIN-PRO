
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { translations } from '../translations';

export type Language = 'fr' | 'en';
type TranslationKey = keyof typeof translations.fr & keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || key;
  }, [language]);
  
  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
