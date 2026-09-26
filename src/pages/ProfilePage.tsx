import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageRoute, Department, AcademicYear } from '../types';
import { DEPARTMENTS, ACADEMIC_YEARS, AVAILABLE_TECHNOLOGIES, AVAILABLE_INTERESTS } from '../data/seedData';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Layers, 
  Code2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  SlidersHorizontal,
  Briefcase,
  Globe,
  Award,
  Plus,
  X,
  FileText,
  Sparkles
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile, logout, triggerRefresh } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState<Department>(user?.department || 'CSE');
  const [currentYear, setCurrentYear] = useState<AcademicYear>(user?.currentYear || '3rd Year');
  const [cgpa, setCgpa] = useState(user?.cgpa || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [targetCompanies, setTargetCompanies] = useState((user?.targetCompanies || []).join(', '));
  const [bio, setBio] = useState(user?.bio || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [resumeStatus, setResumeStatus] = useState<'Not Started' | 'Drafting' | 'Reviewed' | 'Ready for Campus'>(
    user?.resumeStatus || 'Reviewed'
  );
  const [resumeSummary, setResumeSummary] = useState(user?.resumeSummary || '');

  // Technologies & Interests State
  const [knownTechnologies, setKnownTechnologies] = useState<string[]>(user?.knownTechnologies || []);
  const [customTech, setCustomTech] = useState('');
  const [preferredInterests, setPreferredInterests] = useState<string[]>(user?.preferredInterests || []);
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddTech = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !knownTechnologies.includes(trimmed)) {
      setKnownTechnologies([...knownTechnologies, trimmed]);
    }
    setCustomTech('');
  };

  const handleRemoveTech = (tech: string) => {
    setKnownTechnologies(knownTechnologies.filter((t) => t !== tech));
  };

  const handleToggleInterest = (interestName: string) => {
    if (preferredInterests.includes(interestName)) {
      setPreferredInterests(preferredInterests.filter((i) => i !== interestName));
    } else {
      setPreferredInterests([...preferredInterests, interestName]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSaving(true);

    const companiesArray = targetCompanies
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const res = await updateProfile({
      name: name.trim(),
      department,
      currentYear,
      cgpa: cgpa.trim(),
      targetRole: targetRole.trim(),
      targetCompanies: companiesArray,
      bio: bio.trim(),
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      resumeStatus,
      resumeSummary: resumeSummary.trim(),
      knownTechnologies,
      preferredInterests
    });

    setIsSaving(false);
    if (res.success) {
      triggerRefresh();
      setStatusMessage({ 
        type: 'success', 
        text: 'Profile updated successfully! Preparation roadmap, readiness score, and recommendations have been synchronized.' 
      });
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              Student Profile Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic & Placement Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Changes sync across your roadmap, readiness score, and practice focus immediately
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg bg-rose-950/50 border border-rose-800/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 shadow-lg ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/80 border-rose-800 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* 1. Personal & Identity */}
            <div className="space-y-4 pb-6 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span>Identity & Contact</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address (Login Identity)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950/60 border border-slate-800 rounded-lg text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Academic Calibration */}
            <div className="space-y-4 pb-6 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>Academic Calibration</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department (Curriculum Base)
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.code} value={dept.code}>
                        {dept.code} - {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Academic Year
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value as AcademicYear)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ACADEMIC_YEARS.map((yr) => (
                      <option key={yr.id} value={yr.id}>
                        {yr.label} ({yr.stage})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current CGPA
                  </label>
                  <input
                    type="text"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g. 8.85 / 10"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Known Technologies Management */}
            <div className="space-y-4 pb-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Known Technologies ({knownTechnologies.length})</span>
                </h3>
                <span className="text-xs text-slate-400">Directly impacts Skill Coverage readiness</span>
              </div>

              {/* Active Tech Badges */}
              <div className="flex flex-wrap gap-1.5">
                {knownTechnologies.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No technologies registered yet.</span>
                ) : (
                  knownTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Custom Add & Quick Suggestions */}
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    placeholder="Add custom technology or tool (e.g. Next.js, Redis, PyTorch)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTech(customTech)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">Quick Add:</span>
                  {AVAILABLE_TECHNOLOGIES.slice(0, 10).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      disabled={knownTechnologies.includes(t.name)}
                      onClick={() => handleAddTech(t.name)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                        knownTechnologies.includes(t.name)
                          ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      + {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Preferred Domains / Interests */}
            <div className="space-y-4 pb-6 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Preferred Domains & Specialization ({preferredInterests.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = preferredInterests.includes(interest.name);
                  return (
                    <div
                      key={interest.id}
                      onClick={() => handleToggleInterest(interest.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-700 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{interest.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {interest.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Placement Targets & Career Assets */}
            <div className="space-y-4 pb-6 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Placement Targets & Resume Status</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Job Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Software Development Engineer / SDE"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Resume Status
                  </label>
                  <select
                    value={resumeStatus}
                    onChange={(e) => setResumeStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Drafting">Drafting (In Progress)</option>
                    <option value="Reviewed">Reviewed & Polished</option>
                    <option value="Ready for Campus">Ready for Campus Recruitment</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Companies (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={targetCompanies}
                    onChange={(e) => setTargetCompanies(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Atlassian, TCS Digital, Zoho"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Resume Summary / Key Portfolio Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={resumeSummary}
                    onChange={(e) => setResumeSummary(e.target.value)}
                    placeholder="e.g. 2 production projects with live URLs, LeetCode 150+ solved, specialized in distributed systems..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourhandle"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Placement Bio / Professional Intro
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short narrative of your engineering foundation, passion projects, and career ambitions..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                All changes persist to storage and sync live across all modules.
              </span>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save & Sync Profile'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
