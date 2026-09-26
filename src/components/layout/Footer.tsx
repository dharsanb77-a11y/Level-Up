import React from 'react';
import { GraduationCap, Code2, Sparkles, BookOpen } from 'lucide-react';
import { PageRoute } from '../../types';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span>PlacementReady</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reimagining college placement preparation with personalized roadmaps, skill diagnostics, and career readiness frameworks for engineering graduates.
            </p>
            <div className="text-xs text-blue-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Hackathon Edition · Placement Ready
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Departments Supported
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="text-slate-400 hover:text-slate-300">Computer Science (CSE)</li>
              <li className="text-slate-400 hover:text-slate-300">AI & Data Science (AIDS)</li>
              <li className="text-slate-400 hover:text-slate-300">AI & Machine Learning (AIML)</li>
              <li className="text-slate-400 hover:text-slate-300">Electronics & Comm. (ECE)</li>
              <li className="text-slate-400 hover:text-slate-300">Electrical & Electronics (EEE)</li>
              <li className="text-slate-400 hover:text-slate-300">Mechanical & Civil Engineering</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Preparation Pillars
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Data Structures & Algorithms</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quantitative & Logical Aptitude</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Core Domain & OOPs Concepts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mock Technical & HR Interviews</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <button 
                onClick={() => onNavigate('landing')}
                className="text-left text-slate-400 hover:text-blue-400 transition-colors"
              >
                Platform Overview
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="text-left text-slate-400 hover:text-blue-400 transition-colors"
              >
                Student Sign In
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="text-left text-slate-400 hover:text-blue-400 transition-colors"
              >
                Register New Account
              </button>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PlacementReady. Built for "Reimagine Placement Preparation".</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Engineering Student Centric</span>
            <span>·</span>
            <span>Zero-Distraction UI</span>
            <span>·</span>
            <span>Full Placement Pipeline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
