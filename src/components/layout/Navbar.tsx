import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageRoute } from '../../types';
import { 
  GraduationCap, 
  LayoutDashboard, 
  FileCheck2, 
  MapPin, 
  TrendingUp, 
  Bot, 
  Bell, 
  Mail,
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenEmails?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onOpenEmails }) => {
  const { user, isAuthenticated, logout, unreadNotificationsCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('landing');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">PlacementReady</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Campus Placement Engine</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentRoute === 'dashboard'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                Dashboard
              </button>

              <button
                onClick={() => handleNavClick('roadmap')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentRoute === 'roadmap'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                Roadmap
              </button>

              <button
                onClick={() => handleNavClick('assessments')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentRoute === 'assessments'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                Assessments
              </button>

              <button
                onClick={() => handleNavClick('progress')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentRoute === 'progress'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Progress
              </button>

              <button
                onClick={() => handleNavClick('chatbot')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentRoute === 'chatbot'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                AI Assistant
              </button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handleNavClick('landing')}
                className={`text-sm font-medium transition-colors ${
                  currentRoute === 'landing' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                Home
              </button>
            </nav>
          )}

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Email Progress Updates Button */}
                {onOpenEmails && (
                  <button
                    onClick={onOpenEmails}
                    title={`Progress Updates Dispatched to ${user?.email || 'your email'}`}
                    aria-label="Email Updates"
                    className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-blue-400" />
                  </button>
                )}

                {/* Notifications Button */}
                <button
                  onClick={() => handleNavClick('notifications')}
                  title="Notifications"
                  aria-label="Notifications"
                  className={`relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
                    currentRoute === 'notifications' ? 'bg-slate-800 text-white' : ''
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                  )}
                </button>

                {/* Profile Button with User details */}
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border transition-colors ${
                    currentRoute === 'profile'
                      ? 'bg-slate-800 border-blue-500 text-white'
                      : 'border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name.slice(0, 2) : 'ST'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-100 leading-tight truncate max-w-[120px]">
                      {user?.name || 'Student'}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {user?.department ? `${user.department} · ${user.currentYear || 'Prep'}` : 'Onboarding pending'}
                    </p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md shadow transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <>
                {onOpenEmails && (
                  <button
                    onClick={onOpenEmails}
                    className="relative p-2 text-slate-300 hover:text-white"
                    aria-label="Email Updates"
                  >
                    <Mail className="w-5 h-5 text-blue-400" />
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('notifications')}
                  className="relative p-2 text-slate-300 hover:text-white"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 bg-slate-800/80 rounded-lg mb-3">
                <p className="font-semibold text-white text-sm">{user?.name}</p>
                <p className="text-xs text-slate-400">
                  {user?.department ? `${user.department} · ${user.currentYear}` : user?.email}
                </p>
              </div>

              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  currentRoute === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                Dashboard
              </button>

              <button
                onClick={() => handleNavClick('roadmap')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  currentRoute === 'roadmap' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                Roadmap
              </button>

              <button
                onClick={() => handleNavClick('assessments')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  currentRoute === 'assessments' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                Assessments
              </button>

              <button
                onClick={() => handleNavClick('progress')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  currentRoute === 'progress' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Progress
              </button>

              <button
                onClick={() => handleNavClick('chatbot')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  currentRoute === 'chatbot' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                AI Assistant
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  currentRoute === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4 text-purple-400" />
                Student Profile
              </button>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-rose-400 hover:bg-rose-950/30 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleNavClick('landing')}
                className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md text-sm"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('login')}
                className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full text-center px-4 py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-500"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
