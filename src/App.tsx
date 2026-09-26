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
import { Loader2, ShieldAlert } from 'lucide-react';

const PROTECTED_ROUTES: PageRoute[] = [
  'onboarding',
  'dashboard',
  'assessments',
  'roadmap',
  'progress',
  'notifications',
  'chatbot',
  'profile'
];

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Track active route, sync with window.location.hash
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#/', '').replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = [
        'landing', 'login', 'register', 'onboarding', 'dashboard', 
        'assessments', 'roadmap', 'progress', 'notifications', 'chatbot', 'profile'
      ];
      if (validRoutes.includes(hash)) {
        return hash;
      }
    }
    return 'landing';
  });

  // Keep hash in sync with route
  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${route}`;
      window.scrollTo(0, 0);
    }
  };

  // Listen to browser hash changes (e.g. back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = [
        'landing', 'login', 'register', 'onboarding', 'dashboard', 
        'assessments', 'roadmap', 'progress', 'notifications', 'chatbot', 'profile'
      ];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Protected Route Enforcement & Auth State Changes
  useEffect(() => {
    if (isLoading) return;

    const isProtected = PROTECTED_ROUTES.includes(currentRoute);

    if (isProtected && !isAuthenticated) {
      // User is attempting to access a protected route while unauthenticated
      handleNavigate('login');
      return;
    }

    if (isAuthenticated) {
      // If user is authenticated and lands on login or register, redirect
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
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans antialiased text-slate-100">
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
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
