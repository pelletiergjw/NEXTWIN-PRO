
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-in-out ${
      isActive 
        ? 'text-white' 
        : 'text-gray-500 hover:text-white'
    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transform after:scale-x-0 after:transition-transform after:duration-300 ${
      isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between w-full py-5 text-sm font-black uppercase tracking-[0.25em] transition-all ${
      isActive ? 'text-orange-500' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header className="bg-[#10101A]/90 backdrop-blur-xl sticky top-0 z-[100] border-b border-white/5">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo className="scale-90 md:scale-100" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <NavLink to="/" className={navLinkClass}>{t('nav_home')}</NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>{t('nav_how_it_works')}</NavLink>
          <NavLink to="/bankroll-feature" className={navLinkClass}>{t('nav_bankroll')}</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>{t('nav_join_us' as any)}</NavLink>
          <NavLink to="/faq" className={navLinkClass}>{t('nav_faq')}</NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-gray-500 uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <button 
              className={`transition-all ${language === 'fr' ? 'text-orange-400' : 'hover:text-white'}`}
              onClick={() => setLanguage('fr')}
            >FR</button>
            <span className="text-gray-800">|</span>
            <button 
              className={`transition-all ${language === 'en' ? 'text-orange-400' : 'hover:text-white'}`}
              onClick={() => setLanguage('en')}
            >EN</button>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-[11px] font-black uppercase tracking-widest text-white hover:text-orange-400 transition-colors">{t('nav_dashboard')}</Link>
              <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">{t('nav_logout')}</button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-white hover:text-orange-400 transition-colors">{t('nav_login')}</Link>
              <Link to="/signup">
                <Button className="text-[11px] px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20 uppercase tracking-[0.2em] font-black">
                  {t('nav_signup')}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="lg:hidden w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M8 12h12M4 16h16" />
          </svg>
        </button>
      </div>

      {/* MOBILE DRAWER SYSTEM */}
      <div 
        className={`lg:hidden fixed inset-0 z-[200] transition-all duration-500 ease-in-out ${isMenuOpen ? 'visible' : 'invisible'}`}
      >
        {/* Dark Backdrop */}
        <div 
            className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Solid Drawer Content */}
        <div 
            className={`absolute top-0 right-0 w-[85%] max-w-[380px] h-full bg-[#0D0D16] border-l border-white/5 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header Mobile Menu */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <Logo className="scale-75 origin-left" />
            <button 
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                onClick={() => setIsMenuOpen(false)}
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>

          {/* Main Navigation Area */}
          <div className="flex-grow overflow-y-auto px-8 py-10">
            <nav className="flex flex-col space-y-2">
              <NavLink to="/" className={mobileNavLinkClass}>
                <span>{t('nav_home')}</span>
                <span className="text-orange-500 opacity-20">→</span>
              </NavLink>
              <NavLink to="/how-it-works" className={mobileNavLinkClass}>
                <span>{t('nav_how_it_works')}</span>
                <span className="text-orange-500 opacity-20">→</span>
              </NavLink>
              <NavLink to="/bankroll-feature" className={mobileNavLinkClass}>
                <span>{t('nav_bankroll')}</span>
                <span className="text-orange-500 opacity-20">→</span>
              </NavLink>
              <NavLink to="/pricing" className={mobileNavLinkClass}>
                <span>{t('nav_join_us' as any)}</span>
                <span className="text-orange-500 opacity-20">→</span>
              </NavLink>
              <NavLink to="/faq" className={mobileNavLinkClass}>
                <span>{t('nav_faq')}</span>
                <span className="text-orange-500 opacity-20">→</span>
              </NavLink>
            </nav>
          </div>

          {/* Action Footer Area (Solid Background) */}
          <div className="p-8 bg-[#121221] border-t border-white/10 space-y-8 pb-12">
            
            {/* Auth Actions */}
            <div className="space-y-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button className="w-full py-4 text-[11px] font-black uppercase tracking-[0.25em] shadow-xl shadow-orange-500/10">
                      {t('nav_dashboard')}
                    </Button>
                  </Link>
                  <button 
                      onClick={logout}
                      className="w-full text-center py-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hover:text-red-400 transition-colors"
                  >
                      {t('nav_logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Button className="w-full py-5 text-[11px] font-black uppercase tracking-[0.25em] shadow-xl shadow-orange-500/20">
                      {t('nav_signup')}
                    </Button>
                  </Link>
                  <Link to="/login" className="block text-center py-4 text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-white transition-colors">
                      {t('nav_login')}
                  </Link>
                </>
              )}
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-center gap-10 pt-4">
                <button 
                    onClick={() => setLanguage('fr')}
                    className={`text-[10px] font-black tracking-[0.3em] transition-all relative pb-2 ${language === 'fr' ? 'text-orange-500' : 'text-gray-600'}`}
                >
                    FRANÇAIS
                    {language === 'fr' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>}
                </button>
                <button 
                    onClick={() => setLanguage('en')}
                    className={`text-[10px] font-black tracking-[0.3em] transition-all relative pb-2 ${language === 'en' ? 'text-orange-500' : 'text-gray-600'}`}
                >
                    ENGLISH
                    {language === 'en' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>}
                </button>
            </div>

            <div className="text-center">
                <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.5em]">NextWin AI Pro Engine v4.0</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
