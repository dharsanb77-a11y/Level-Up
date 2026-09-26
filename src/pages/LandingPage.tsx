import React from 'react';
import { PageRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  BrainCircuit, 
  Layers, 
  Award,
  Users,
  Compass,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { DEPARTMENTS } from '../data/seedData';

interface LandingPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Reimagine Placement Preparation · Hackathon Edition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              From College Syllabus to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                Dream Placement Offers
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              A personalized placement preparation platform designed for engineering students.
              Bridge skill gaps with department-specific roadmaps, aptitude diagnostics, and career readiness frameworks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  Go to Student Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                  >
                    Start Placement Journey
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-all"
                  >
                    Student Login
                  </button>
                </>
              )}
            </div>

            {/* Quick Proof Points */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">7+</p>
                <p className="text-xs text-slate-400 mt-1">Engineering Branches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">7 Pillars</p>
                <p className="text-xs text-slate-400 mt-1">Full Placement Pipeline</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">100%</p>
                <p className="text-xs text-slate-400 mt-1">Student Centric</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">Zero</p>
                <p className="text-xs text-slate-400 mt-1">Superficial Noise</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Pillars of PlacementReady */}
      <section className="py-16 lg:py-24 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-blue-400 mb-2">
              Architected for Impact
            </h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Everything Needed for Campus Recruitment
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              Standard placement preparation is fragmented across random sheets, outdated video playlists, and uncalibrated mock tests. PlacementReady unites it into one clear pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">1. Personalized Onboarding</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures branch (CSE, AIDS, AIML, ECE, EEE, MECH, CIVIL), academic year, current tech stack, and target domain to craft your baseline.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">2. Milestone Roadmap</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Phased preparation schedule covering Quantitative Aptitude, Data Structures, OOPs/Core fundamentals, and Capstone projects.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">3. Diagnostic Assessments</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Timed aptitude tests, coding diagnostics, and core engineering assessments calibrated to top campus recruiters.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">4. Placement Readiness</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Holistic readiness index tracking practice consistency, topic coverage, and interview simulation benchmarks.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase font-semibold text-blue-400 mb-1">Tailored for Every Stream</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Supported Engineering Departments</h3>
            </div>
            <p className="text-slate-400 text-xs mt-2 md:mt-0 max-w-md">
              Placement preparation is not one-size-fits-all. A core ECE or Mechanical student requires different interview preparation than a CSE or AI student.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.map((dept) => (
              <div 
                key={dept.code} 
                className="p-4 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-blue-300">{dept.code}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Engineering</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 mb-1">{dept.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{dept.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Onboarding & roadmap enabled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 shadow-xl">
            <GraduationCap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to take charge of your campus placements?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
              Join PlacementReady today. Configure your department profile, log your known technologies, and get your personalized preparation dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                Create Student Account
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Sign In Existing
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
