
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/public/HomePage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AiPresentationPage from './pages/public/AiPresentationPage';
import SportsAndBetsPage from './pages/public/SportsAndBetsPage';
import PricingPage from './pages/public/PricingPage';
import FaqPage from './pages/public/FaqPage';
import ContactPage from './pages/public/ContactPage';
import LegalNoticePage from './pages/public/LegalNoticePage';
import TermsOfSalePage from './pages/public/TermsOfSalePage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/member/DashboardPage';
import AnalysisPage from './pages/member/AnalysisPage';
import HistoryPage from './pages/member/HistoryPage';
import SubscriptionPage from './pages/member/SubscriptionPage';
import ProfilePage from './pages/member/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#10101A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/ai-presentation" element={<AiPresentationPage />} />
          <Route path="/sports-and-bets" element={<SportsAndBetsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal-notice" element={<LegalNoticePage />} />
          <Route path="/terms-of-sale" element={<TermsOfSalePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Member Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute requireSubscription><AnalysisPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute requireSubscription><HistoryPage /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
