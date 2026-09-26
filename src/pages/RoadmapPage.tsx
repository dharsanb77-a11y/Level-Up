import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AnalyticsService } from '../services/analytics';
import { RoadmapService } from '../services/roadmapService';
import { EmailService } from '../services/emailService';
import { RoadmapAssessmentModal } from '../components/roadmap/RoadmapAssessmentModal';
import { 
  PageRoute, 
  RoadmapActivity, 
  RoadmapCategory, 
  ActivityStatus, 
  AssessmentResult 
} from '../types';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Layers, 
  BookOpen, 
  ArrowRight,
  Filter,
  Flame,
  AlertTriangle,
  PlayCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Target,
  Award,
  Check
} from 'lucide-react';

interface RoadmapPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate }) => {
  const { user, resultsVersion, triggerRefresh } = useAuth();

  const [results, setResults] = useState<AssessmentResult[]>(() =>
    StorageService.getAssessmentResults(user?.id)
  );

  const [activities, setActivities] = useState<RoadmapActivity[]>(() => 
    RoadmapService.generateRoadmap(user, results)
  );

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onlyWeakPriorities, setOnlyWeakPriorities] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // In-place Assessment & Open-Source Theory Modal State
  const [modalActivity, setModalActivity] = useState<RoadmapActivity | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [modalInitialTab, setModalInitialTab] = useState<'assessment' | 'theory'>('assessment');

  useEffect(() => {
    const updatedResults = StorageService.getAssessmentResults(user?.id);
    setResults(updatedResults);
    setActivities(RoadmapService.generateRoadmap(user, updatedResults));
  }, [resultsVersion, user]);

  const handleToggleStatus = (activityId: string, targetStatus?: ActivityStatus) => {
    if (!user) return;
    const { activities: updatedList, updatedActivity } = RoadmapService.toggleActivityStatus(
      user.id, 
      activityId, 
      targetStatus
    );
    setActivities(updatedList);
    triggerRefresh();

    // Send cheerful email update if completed
    if (updatedActivity.status === 'completed') {
      EmailService.sendProgressEmail(user, 'activity_completed', {
        activityTitle: updatedActivity.title
      });
    }

    const statusLabels: Record<ActivityStatus, string> = {
      'completed': 'marked as Completed! 🎯 Readiness score updated.',
      'in_progress': 'set to In Progress. Keep going!',
      'not_started': 'reset to Not Started.'
    };

    setSuccessToast(`"${updatedActivity.title}" ${statusLabels[updatedActivity.status]}`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  /**
   * User requirement:
   * "in the roadmap a button named start assesment while clicking that do not direct it to other new tabs just add some theories or tests in that take the theory from the open sources"
   *
   * Launches the in-place assessment and open-source theory module directly inside the current view.
   * NO new tabs, NO window.open.
   */
  const handleStartAssessment = (act: RoadmapActivity, tab: 'assessment' | 'theory' = 'assessment') => {
    if (!user) return;

    // 1. Mark in_progress if not started
    if (act.status === 'not_started') {
      handleToggleStatus(act.id, 'in_progress');
    }

    // 2. Dispatch cheerful progress email
    EmailService.sendProgressEmail(user, 'assessment_started', {
      assessmentTitle: `${act.title} Assessment`
    });

    // 3. Open in-place interactive assessment & theory modal (DO NOT direct to other new tabs)
    setModalActivity(act);
    setModalInitialTab(tab);
    setIsAssessmentModalOpen(true);
  };

  const categories: (RoadmapCategory | 'all')[] = [
    'all',
    'Programming',
    'DSA',
    'Aptitude',
    'Technical Skills',
    'Projects',
    'Resume',
    'Interviews'
  ];

  const overallStats = RoadmapService.getOverallStats(activities);
  const categoryProgress = RoadmapService.getCategoryProgress(activities);

  const filteredActivities = activities.filter((act) => {
    if (categoryFilter !== 'all' && act.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && act.status !== statusFilter) return false;
    if (onlyWeakPriorities && !act.isWeakTopicPriority) return false;
    return true;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'Intermediate':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              Personalized Roadmap · Phase 3 Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Placement Preparation Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Calibrated for <span className="text-white font-medium">{user?.department || 'Engineering'}</span> ({user?.currentYear || '3rd Year'}). Activities adapt dynamically to diagnostic results and weak areas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('assessments')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <span>Take Assessments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button 
              onClick={() => setSuccessToast(null)} 
              className="text-emerald-400 hover:text-white text-xs ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Roadmap Completion</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{overallStats.completionPercentage}%</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallStats.completionPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {overallStats.completedActivities} of {overallStats.totalActivities} milestones completed
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Practice Investment</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-blue-400">{overallStats.completedHours} hrs</p>
            <p className="text-xs text-slate-400 mt-1">
              of ~{overallStats.totalEstimatedHours} hrs estimated preparation
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Weak Area Priorities</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-amber-400">
              {activities.filter((a) => a.isWeakTopicPriority).length}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Elevated to high priority from diagnostics
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">In Progress</span>
              <PlayCircle className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-400">{overallStats.inProgressActivities}</p>
            <p className="text-xs text-slate-400 mt-1">
              Milestones currently active
            </p>
          </div>
        </div>

        {/* Category-Wise Progress Bars */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Category-Wise Preparation Progress
            </h3>
            <span className="text-xs text-slate-400">7 Core Placement Pillars</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryProgress.map((cp) => (
              <div 
                key={cp.category}
                onClick={() => setCategoryFilter(cp.category)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  categoryFilter === cp.category
                    ? 'bg-blue-950/60 border-blue-600 text-white'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold truncate">{cp.category}</span>
                  <span className="font-bold">{cp.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${cp.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>{cp.completedActivities}/{cp.totalActivities} completed</span>
                  <span className="text-blue-400 hover:underline">Filter →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Activities' : cat}
              </button>
            ))}
          </div>

          {/* Sub Filters */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={() => setOnlyWeakPriorities(!onlyWeakPriorities)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                onlyWeakPriorities
                  ? 'bg-amber-950 border-amber-600 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Weak Topics Only</span>
            </button>
          </div>

        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <h3 className="text-base font-bold text-white">No activities match your filter</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try selecting "All Activities" or clearing the weak topics filter.
              </p>
              <button
                onClick={() => { setCategoryFilter('all'); setStatusFilter('all'); setOnlyWeakPriorities(false); }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                className={`bg-slate-900 border rounded-2xl p-6 transition-all ${
                  act.status === 'completed'
                    ? 'border-emerald-800/60 bg-emerald-950/10'
                    : act.isWeakTopicPriority
                    ? 'border-amber-700/60 shadow-md shadow-amber-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Weak Topic Priority Banner */}
                {act.isWeakTopicPriority && (
                  <div className="mb-3.5 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800/80 text-amber-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="font-semibold">Weak Area Priority:</span>
                    <span className="text-amber-200">{act.priorityReason || 'Flagged in recent diagnostic test.'}</span>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Activity Details */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800">
                        {act.category}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{act.phase}</span>
                      <span className="text-slate-600">·</span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyBadge(act.difficulty)}`}>
                        {act.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">
                      {act.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                      {act.description}
                    </p>

                    {/* Topics Covered */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {act.topics.map((t) => (
                        <span 
                          key={t}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Optional Learning Resource */}
                    {act.learningResource && (
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold">Recommended Resource:</span>
                        <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{act.learningResource.title}</span>
                          <span className="text-[10px] text-slate-500 uppercase">({act.learningResource.type})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status Controls */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0">
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>~{act.estimatedHours} hrs estimated</span>
                    </div>

                    {/* Status & Assessment Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {act.status !== 'completed' ? (
                        <>
                          <button
                            onClick={() => handleStartAssessment(act, 'assessment')}
                            title="Start interactive assessment test in-place"
                            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-950 flex items-center gap-1.5 cursor-pointer group"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-200 group-hover:scale-110 transition-transform" />
                            <span>Start Assessment</span>
                          </button>

                          <button
                            onClick={() => handleStartAssessment(act, 'theory')}
                            title="Read open-source theory & concepts"
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Theory</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(act.id, 'completed')}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Complete</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/90 px-3 py-1.5 rounded-lg border border-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Completed</span>
                          </span>

                          <button
                            onClick={() => handleStartAssessment(act, 'assessment')}
                            title="Retake or review assessment test"
                            className="px-2.5 py-1.5 text-xs text-blue-300 hover:text-blue-100 rounded-lg bg-blue-950/60 border border-blue-800 hover:border-blue-700 flex items-center gap-1.5 font-medium cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            <span>Start Assessment</span>
                          </button>

                          <button
                            onClick={() => handleStartAssessment(act, 'theory')}
                            title="Review open-source theory"
                            className="px-2 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <span>Theory</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(act.id, 'not_started')}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs cursor-pointer"
                            title="Reset to incomplete"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {act.completedAt && (
                      <span className="text-[10px] text-slate-500">
                        Done on {new Date(act.completedAt).toLocaleDateString()}
                      </span>
                    )}

                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* In-Place Interactive Assessment & Open-Source Theory Modal */}
      <RoadmapAssessmentModal
        isOpen={isAssessmentModalOpen}
        activity={modalActivity}
        initialTab={modalInitialTab}
        onClose={() => setIsAssessmentModalOpen(false)}
        onActivityUpdated={() => {
          if (user) {
            const updatedResults = StorageService.getAssessmentResults(user.id);
            setResults(updatedResults);
            setActivities(RoadmapService.generateRoadmap(user, updatedResults));
          }
        }}
      />
    </div>
  );
};
