import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AnalyticsService } from '../services/analytics';
import { RoadmapService } from '../services/roadmapService';
import { 
  PageRoute, 
  AssessmentResult, 
  StudentReadiness, 
  TopicAnalysis, 
  RoadmapActivity,
  StudentStreak
} from '../types';
import { 
  TrendingUp, 
  Target, 
  Award, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Code2,
  FileCheck2,
  AlertCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  Flame,
  Calendar,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface ProgressPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const { user, resultsVersion } = useAuth();

  const [results, setResults] = useState<AssessmentResult[]>(() => 
    StorageService.getAssessmentResults(user?.id)
  );

  const [roadmap, setRoadmap] = useState<RoadmapActivity[]>(() =>
    RoadmapService.generateRoadmap(user, results)
  );

  const [streak, setStreak] = useState<StudentStreak>(() =>
    StorageService.getStudentStreak(user?.id || 'demo')
  );

  useEffect(() => {
    const updatedResults = StorageService.getAssessmentResults(user?.id);
    setResults(updatedResults);
    setRoadmap(RoadmapService.generateRoadmap(user, updatedResults));
    setStreak(StorageService.getStudentStreak(user?.id || 'demo'));
  }, [resultsVersion, user]);

  const readiness: StudentReadiness = AnalyticsService.calculateReadiness(user, results);
  const topicAnalysis: TopicAnalysis = AnalyticsService.getTopicAnalysis(results);
  const overallRoadmapStats = RoadmapService.getOverallStats(roadmap);
  const categoryProgress = RoadmapService.getCategoryProgress(roadmap);

  // Overall completion formula based purely on dynamic user accomplishments:
  // Starts at 0 until user begins completing milestones or assessments
  const assessmentCategoryCount = new Set(results.map((r) => r.category)).size;
  const assessmentCoverageRate = Math.min(1, assessmentCategoryCount / 4);
  const roadmapCompletionRate = overallRoadmapStats.totalActivities > 0 
    ? (overallRoadmapStats.completedActivities / overallRoadmapStats.totalActivities) 
    : 0;

  const overallCompletionPercentage = (roadmapCompletionRate === 0 && assessmentCoverageRate === 0)
    ? 0
    : Math.round((roadmapCompletionRate * 0.55 + assessmentCoverageRate * 0.45) * 100);

  const completedActivitiesList = roadmap.filter((a) => a.status === 'completed');

  // Improvement over time: compute initial test vs latest test deltas
  const assessmentImprovement = results.map((res, index) => {
    // Find earlier result for same assessment title
    const earlierResults = results.slice(0, index).filter((r) => r.assessmentId === res.assessmentId);
    const hasPrevious = earlierResults.length > 0;
    const delta = hasPrevious ? (res.percentage - earlierResults[0].percentage) : null;
    return {
      result: res,
      delta,
      isRetake: hasPrevious
    };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Progress Hub · Real-Time Student Metrics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Placement Preparation Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Deterministic progress synthesized from real assessment submissions, completed roadmap milestones, and active streak.
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
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <span>View Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. Core Real-Time Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Overall Completion */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Overall Progress</span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{overallCompletionPercentage}%</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallCompletionPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Milestones + Diagnostics + Profile
            </p>
          </div>

          {/* Current Streak */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Current Streak</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-orange-400">{streak.currentStreak}</p>
              <span className="text-xs text-slate-400 font-semibold">days active 🔥</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Longest: {streak.longestStreak} days · Active {streak.lastActivityDate}
            </p>
          </div>

          {/* Completed Milestones */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Roadmap Milestones</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-emerald-400">{completedActivitiesList.length}</p>
              <span className="text-xs text-slate-400">/ {roadmap.length} done</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {overallRoadmapStats.completedHours} hrs practical preparation
            </p>
          </div>

          {/* Diagnostic Evaluations */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Readiness Score</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-purple-400">{readiness.overallScore}%</p>
            <p className="text-[11px] text-purple-300 mt-1 font-semibold">{readiness.level}</p>
            <p className="text-[10px] text-slate-400 mt-1">{results.length} tests completed</p>
          </div>

        </div>

        {/* 2. Category-Wise Progress (All 7 Placement Pillars) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Category-Wise Placement Progress</h2>
              <p className="text-xs text-slate-400">Tracks preparation across the 7 essential campus recruitment dimensions</p>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold self-start sm:self-auto"
            >
              Open Roadmap Hub →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {categoryProgress.map((cp) => (
              <div key={cp.category} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{cp.category}</span>
                  <span className="font-extrabold text-blue-400">{cp.percentage}%</span>
                </div>
                
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      cp.percentage >= 75 ? 'bg-emerald-500' : cp.percentage >= 40 ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${cp.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{cp.completedActivities} of {cp.totalActivities} completed</span>
                  <span className={cp.completedActivities === cp.totalActivities && cp.totalActivities > 0 ? 'text-emerald-400 font-semibold' : ''}>
                    {cp.completedActivities === cp.totalActivities && cp.totalActivities > 0 ? '✓ Complete' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Weak Areas & Action Required */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Identified Weak Areas (&lt; 50% Accuracy)</h2>
                <p className="text-xs text-slate-400">Detected from actual diagnostic assessment answers</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('assessments')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Take Diagnostics →
            </button>
          </div>

          {topicAnalysis.weakTopics.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-white">No Weak Topics Flagged!</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {results.length > 0 
                  ? 'All evaluated topics achieved ≥ 50% accuracy. Continue maintaining strong fundamentals.' 
                  : 'Take diagnostic assessments to identify your baseline strengths and weak areas.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {topicAnalysis.weakTopics.map((wt) => (
                <div key={wt.topic} className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">{wt.topic}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                      {wt.percentage}% Accuracy ({wt.correct}/{wt.total})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {wt.reason}
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 font-medium">Category: {wt.category}</span>
                    <button
                      onClick={() => onNavigate('roadmap')}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      Practice in Roadmap <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Improvement Over Time & Assessment History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Assessment History & Improvement Over Time</h2>
              <p className="text-xs text-slate-400">Verifiable timeline of diagnostic submissions and retake performance deltas</p>
            </div>
            
            <button
              onClick={() => onNavigate('assessments')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold self-start sm:self-auto"
            >
              Take Another Test
            </button>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl">
              <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-white">No assessments attempted yet</p>
              <p className="text-xs text-slate-400 mt-1">Complete your initial diagnostic test to start your improvement timeline.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assessmentImprovement.map(({ result: res, delta, isRetake }) => (
                <div 
                  key={res.id} 
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                        {res.category}
                      </span>
                      <h4 className="text-sm font-bold text-white">{res.assessmentTitle}</h4>
                      {isRetake && (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                          Retake Attempt
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Completed: {new Date(res.completedAt).toLocaleString()} · Time spent: {Math.round(res.timeSpentSeconds / 60)} min {res.timeSpentSeconds % 60} sec
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-base font-extrabold text-white">
                          {res.score}/{res.totalQuestions} ({res.percentage}%)
                        </span>
                        {delta !== null && (
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            delta > 0 ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800' : 'text-slate-400 bg-slate-800'
                          }`}>
                            {delta > 0 ? `+${delta}% improvement` : `${delta}%`}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {res.percentage >= 75 ? 'Strong Performance' : res.percentage >= 50 ? 'Average Baseline' : 'Needs Practice'}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigate('assessments')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Completed Activities List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Completed Roadmap Activities ({completedActivitiesList.length})</h2>
              <p className="text-xs text-slate-400">Verified placement preparation milestones completed by you</p>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Add Milestones →
            </button>
          </div>

          {completedActivitiesList.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No activities marked completed yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Go to the Roadmap page and mark activities complete as you study to build your verified placement track record.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedActivitiesList.map((act) => (
                <div key={act.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-900/40 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">{act.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{act.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="text-emerald-400 font-medium">{act.category}</span>
                      <span>·</span>
                      <span>~{act.estimatedHours} hrs</span>
                      {act.completedAt && (
                        <>
                          <span>·</span>
                          <span>Completed {new Date(act.completedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
