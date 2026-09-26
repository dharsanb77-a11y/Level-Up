/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageRoute } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ProgressPage } from './pages/ProgressPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { ProfilePage } from './pages/ProfilePage';
import { DocsPage } from './pages/DocsPage';
import { AssessmentSessionPage } from './pages/AssessmentSessionPage';
import { EmailUpdatesModal } from './components/layout/EmailUpdatesModal';
import { Loader2, ShieldAlert } from 'lucide-react';

const PROTECTED_ROUTES: PageRoute[] = [
  'onboarding',
  'dashboard',
  'assessments',
  'roadmap',
  'progress',
  'notifications',
  'chatbot',
  'profile',
  'docs',
  'assessment-session'
];

const VALID_ROUTES: PageRoute[] = [
  'landing', 'login', 'register', 'onboarding', 'dashboard', 
  'assessments', 'roadmap', 'progress', 'notifications', 'chatbot', 'profile',
  'docs', 'assessment-session'
];

function getRouteFromHash(): PageRoute {
  if (typeof window !== 'undefined' && window.location.hash) {
    const raw = window.location.hash.replace('#/', '').replace('#', '');
    const clean = raw.split('?')[0] as PageRoute;
    if (VALID_ROUTES.includes(clean)) {
      return clean;
    }
  }
  return 'landing';
}

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  
  // Track active route, sync with window.location.hash
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => getRouteFromHash());

  // Keep hash in sync with route
  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${route}`;
      window.scrollTo(0, 0);
    }
  };

  // Listen to browser hash changes (e.g. back/forward buttons or opening links)
  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      setCurrentRoute(route);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Protected Route Enforcement & Auth State Changes
  useEffect(() => {
    if (isLoading) return;

    const isProtected = PROTECTED_ROUTES.includes(currentRoute);

    if (isProtected && !isAuthenticated) {
      handleNavigate('login');
      return;
    }

    if (isAuthenticated) {
      if (currentRoute === 'login' || currentRoute === 'register') {
        if (!user?.onboardingCompleted) {
          handleNavigate('onboarding');
        } else {
          handleNavigate('dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, currentRoute, user?.onboardingCompleted]);

  // Loading state during initial session retrieval
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <p className="text-sm font-medium">Initializing PlacementReady Platform...</p>
      </div>
    );
  }

  // Render view based on route with protection guard
  const renderPage = () => {
    const isProtected = PROTECTED_ROUTES.includes(currentRoute);

    if (isProtected && !isAuthenticated) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="w-12 h-12 text-amber-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            This module is protected. Please sign in to your student account to access this page.
          </p>
          <button
            onClick={() => handleNavigate('login')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
          >
            Go to Student Sign In
          </button>
        </div>
      );
    }

    switch (currentRoute) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'onboarding':
        return <OnboardingPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'assessments':
        return <AssessmentsPage onNavigate={handleNavigate} />;
      case 'roadmap':
        return <RoadmapPage onNavigate={handleNavigate} />;
      case 'progress':
        return <ProgressPage onNavigate={handleNavigate} />;
      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;
      case 'chatbot':
        return <ChatbotPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'docs':
        return <DocsPage onNavigate={handleNavigate} />;
      case 'assessment-session':
        return <AssessmentSessionPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans antialiased text-slate-100">
      <Navbar 
        currentRoute={currentRoute} 
        onNavigate={handleNavigate} 
        onOpenEmails={() => setShowEmailModal(true)} 
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      
      {/* Email Dispatch History Viewer Modal */}
      <EmailUpdatesModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
