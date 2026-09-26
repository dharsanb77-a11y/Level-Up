import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageRoute, Department, AcademicYear } from '../types';
import { 
  DEPARTMENTS, 
  ACADEMIC_YEARS, 
  AVAILABLE_TECHNOLOGIES, 
  AVAILABLE_INTERESTS 
} from '../data/seedData';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  GraduationCap, 
  Plus, 
  Search, 
  Layers, 
  BrainCircuit, 
  AlertCircle,
  Loader2,
  Code2
} from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { user, saveOnboarding, isLoading } = useAuth();

  // Wizard Step (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states initialized with existing user values if editing
  const [selectedDept, setSelectedDept] = useState<Department | null>(user?.department || null);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(user?.currentYear || null);
  const [selectedTechs, setSelectedTechs] = useState<string[]>(user?.knownTechnologies || []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.preferredInterests || []);
  
  // Custom tech tag addition
  const [techSearch, setTechSearch] = useState<string>('');
  const [customTechInput, setCustomTechInput] = useState<string>('');
  const [activeTechCategory, setActiveTechCategory] = useState<string>('All');

  // Error feedback
  const [stepError, setStepError] = useState<string | null>(null);

  // Toggle technology
  const toggleTech = (techName: string) => {
    setSelectedTechs((prev) => 
      prev.includes(techName) ? prev.filter((t) => t !== techName) : [...prev, techName]
    );
  };

  // Add custom technology
  const handleAddCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTechInput.trim();
    if (trimmed && !selectedTechs.includes(trimmed)) {
      setSelectedTechs((prev) => [...prev, trimmed]);
      setCustomTechInput('');
    }
  };

  // Toggle interest
  const toggleInterest = (interestName: string) => {
    setSelectedInterests((prev) => 
      prev.includes(interestName) ? prev.filter((i) => i !== interestName) : [...prev, interestName]
    );
  };

  // Navigation between steps with validation
  const goToNextStep = () => {
    setStepError(null);

    if (currentStep === 1) {
      if (!selectedDept) {
        setStepError('Please select your engineering department.');
        return;
      }
      if (!selectedYear) {
        setStepError('Please select your current academic year.');
        return;
      }
    }

    if (currentStep === 2) {
      if (selectedTechs.length === 0) {
        setStepError('Please select at least one technology or programming language you know.');
        return;
      }
    }

    if (currentStep === 3) {
      if (selectedInterests.length === 0) {
        setStepError('Please select at least one area of interest / preferred career domain.');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final submission
  const handleComplete = async () => {
    if (!selectedDept || !selectedYear) {
      setStepError('Missing department or year.');
      return;
    }
    if (selectedTechs.length === 0 || selectedInterests.length === 0) {
      setStepError('Please ensure you have selected technologies and interests.');
      return;
    }

    const res = await saveOnboarding(selectedDept, selectedYear, selectedTechs, selectedInterests);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setStepError(res.error || 'Failed to save onboarding data.');
    }
  };

  // Filtered technologies
  const filteredTechs = AVAILABLE_TECHNOLOGIES.filter((tech) => {
    const matchesCategory = activeTechCategory === 'All' || tech.category === activeTechCategory;
    const matchesSearch = tech.name.toLowerCase().includes(techSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'Core Engineering'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header / Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Step-by-Step Profile Calibration
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Personalize Your Placement Path
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Welcome, {user?.name || 'Student'}! Tell us about your department, current skillset, and target domain to generate your tailor-fit preparation ecosystem.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium">
            <div className={`p-2 rounded-lg transition-colors ${currentStep === 1 ? 'bg-blue-600 text-white font-bold' : currentStep > 1 ? 'text-blue-400 bg-blue-950/60' : 'text-slate-500'}`}>
              <span className="block sm:inline font-mono">01.</span> Branch & Year
            </div>
            <div className={`p-2 rounded-lg transition-colors ${currentStep === 2 ? 'bg-blue-600 text-white font-bold' : currentStep > 2 ? 'text-blue-400 bg-blue-950/60' : 'text-slate-500'}`}>
              <span className="block sm:inline font-mono">02.</span> Known Skills
            </div>
            <div className={`p-2 rounded-lg transition-colors ${currentStep === 3 ? 'bg-blue-600 text-white font-bold' : currentStep > 3 ? 'text-blue-400 bg-blue-950/60' : 'text-slate-500'}`}>
              <span className="block sm:inline font-mono">03.</span> Career Domain
            </div>
            <div className={`p-2 rounded-lg transition-colors ${currentStep === 4 ? 'bg-blue-600 text-white font-bold' : 'text-slate-500'}`}>
              <span className="block sm:inline font-mono">04.</span> Confirmation
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {stepError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{stepError}</div>
          </div>
        )}

        {/* STEP 1: Department & Academic Year */}
        {currentStep === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
            
            {/* Department Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                    Select Your Engineering Department
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your registered college academic branch
                  </p>
                </div>
                {selectedDept && (
                  <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
                    Selected: {selectedDept}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDept === dept.code;
                  return (
                    <button
                      key={dept.code}
                      type="button"
                      onClick={() => setSelectedDept(dept.code)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/30'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-mono text-base font-bold ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                          {dept.code}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-xs font-medium text-slate-300 mb-1">{dept.name}</p>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{dept.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Academic Year Selection */}
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Select Your Current Academic Year
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Roadmaps adapt according to how close you are to campus recruitment drives
                  </p>
                </div>
                {selectedYear && (
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                    Selected: {selectedYear}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACADEMIC_YEARS.map((yr) => {
                  const isSelected = selectedYear === yr.id;
                  return (
                    <button
                      key={yr.id}
                      type="button"
                      onClick={() => setSelectedYear(yr.id)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className={`block font-bold text-sm mb-1 ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {yr.label}
                      </span>
                      <span className="text-[10px] text-slate-400 leading-tight block">
                        {yr.stage}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: Technologies Currently Known */}
        {currentStep === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  Technologies & Skills Currently Known
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select all programming languages, frameworks, or tools you have worked with
                </p>
              </div>
              <div className="text-xs font-medium text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/80 shrink-0 self-start sm:self-auto">
                {selectedTechs.length} Selected
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  placeholder="Filter technologies (e.g. Python, SQL, React)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Add Custom Tech Input */}
              <form onSubmit={handleAddCustomTech} className="flex gap-2">
                <input
                  type="text"
                  value={customTechInput}
                  onChange={(e) => setCustomTechInput(e.target.value)}
                  placeholder="Add custom tech..."
                  className="w-full sm:w-44 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </form>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTechCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTechCategory === cat
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tech Chips Grid */}
            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              {filteredTechs.map((tech) => {
                const isSelected = selectedTechs.includes(tech.name);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => toggleTech(tech.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{tech.name}</span>
                  </button>
                );
              })}

              {/* Display custom added techs */}
              {selectedTechs
                .filter((st) => !AVAILABLE_TECHNOLOGIES.some((at) => at.name === st))
                .map((custom) => (
                  <button
                    key={custom}
                    type="button"
                    onClick={() => toggleTech(custom)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-emerald-950/80 border-emerald-500 text-emerald-200 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{custom} (Custom)</span>
                  </button>
                ))}
            </div>

            {/* Selected Summary preview */}
            {selectedTechs.length > 0 && (
              <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">Your selected skillset:</span>
                <p className="text-slate-300 font-mono leading-relaxed">
                  {selectedTechs.join(', ')}
                </p>
              </div>
            )}

          </div>
        )}

        {/* STEP 3: Areas of Interest / Preferred Domains */}
        {currentStep === 3 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-amber-400" />
                  Areas of Interest & Target Career Domain
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select one or more domains you wish to focus on for campus drives and technical rounds
                </p>
              </div>
              <div className="text-xs font-medium text-amber-400 bg-amber-950/80 px-3 py-1 rounded-md border border-amber-800/80 shrink-0 self-start sm:self-auto">
                {selectedInterests.length} Selected
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {AVAILABLE_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest.name);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.name)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/20'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                        {interest.category}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 mb-1">{interest.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{interest.description}</p>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* STEP 4: Review & Personalize Launchpad */}
        {currentStep === 4 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            <div className="text-center max-w-lg mx-auto mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Review Onboarding Calibration</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your profile configuration will be stored permanently to seed your customized placement preparation dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Academic Profile Review */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs uppercase font-semibold text-blue-400 mb-2">1. Academic Branch & Stage</div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-white">{selectedDept || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Academic Year:</span>
                    <span className="font-semibold text-white">{selectedYear || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Target Domain Review */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs uppercase font-semibold text-amber-400 mb-2">2. Target Career Domains ({selectedInterests.length})</div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {selectedInterests.map((interest) => (
                    <span key={interest} className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/60 text-amber-300 text-[11px]">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies Review */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs uppercase font-semibold text-emerald-400 mb-2">3. Known Technologies & Skills ({selectedTechs.length})</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTechs.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/60 text-xs text-slate-300">
              <p className="font-semibold text-blue-300 mb-1">Reusable Data Storage Notice:</p>
              <p className="leading-relaxed text-slate-400">
                This data structure supports future Phase 2-4 features including personalized skills diagnostics, adaptive course recommendations, mock interview tracks, and placement readiness score tracking.
              </p>
            </div>

          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="mt-8 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleComplete}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Onboarding & Launch Dashboard</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
