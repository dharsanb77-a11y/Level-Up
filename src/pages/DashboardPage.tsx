import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AnalyticsService } from '../services/analytics';
import { RoadmapService } from '../services/roadmapService';
import { PageRoute, AssessmentResult, TopicPerformance, StudentReadiness, Recommendation, TopicAnalysis, AssessmentCategory, RoadmapActivity } from '../types';
import { 
  GraduationCap, 
  MapPin, 
  FileCheck2, 
  TrendingUp, 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Code2, 
  BrainCircuit,
  SlidersHorizontal,
  Clock,
  AlertCircle,
  AlertTriangle,
  Award,
  Target,
  BarChart3,
  Calendar,
  BookOpen,
  RotateCcw,
  Check,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, resultsVersion } = useAuth();

  // Load results from storage
  const [results, setResults] = useState<AssessmentResult[]>(() => 
    StorageService.getAssessmentResults(user?.id)
  );

  // Re-fetch when results change or user changes
  useEffect(() => {
    const updated = StorageService.getAssessmentResults(user?.id);
    setResults(updated);
  }, [resultsVersion, user?.id]);

  // Compute deterministic analytics
  const topicAnalysis: TopicAnalysis = AnalyticsService.getTopicAnalysis(results);
  const readiness: StudentReadiness = AnalyticsService.calculateReadiness(user, results);
  const recommendations: Recommendation[] = AnalyticsService.generateRecommendations(topicAnalysis, user);

  // Group topics by category for category-level breakdown
  const categories: AssessmentCategory[] = ['Aptitude', 'DSA', 'Technical', 'Communication'];

  const getTopicsByCategory = (cat: AssessmentCategory) => {
    return {
      strong: topicAnalysis.strongTopics.filter((t) => t.category === cat),
      average: topicAnalysis.averageTopics.filter((t) => t.category === cat),
      weak: topicAnalysis.weakTopics.filter((t) => t.category === cat)
    };
  };

  // Compute live roadmap
  const roadmapActivities = RoadmapService.generateRoadmap(user, results);
  const roadmapStats = RoadmapService.getOverallStats(roadmapActivities);
  const nextRoadmapActivity = roadmapActivities.find((a) => a.status !== 'completed') || roadmapActivities[0];

  // Readiness level styling
  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    if (score >= 65) return 'text-blue-400 bg-blue-950/80 border-blue-800';
    if (score >= 45) return 'text-amber-400 bg-amber-950/80 border-amber-800';
    return 'text-rose-400 bg-rose-950/80 border-rose-800';
  };

  // Generate Weekly Preparation Focus based on department, year, and prioritized weak topics
  const primaryWeakTopic = topicAnalysis.weakTopics[0]?.topic || 'Quantitative Aptitude Diagnostic';
  const secondaryWeakTopic = topicAnalysis.weakTopics[1]?.topic || 'Data Structures Foundation';

  const dsaAct = roadmapActivities.find((a) => a.category === 'DSA' && a.status !== 'completed') || 
                 roadmapActivities.find((a) => a.category === 'Programming' && a.status !== 'completed');
  const codingFocusTitle = dsaAct ? dsaAct.title : (user?.department === 'ECE' ? 'Embedded C & RTOS' : user?.department === 'MECHANICAL' ? 'CAD Parametric Modeling' : 'Arrays & Two-Pointers');
  const codingFocusDesc = dsaAct ? dsaAct.description : 'Solve targeted pattern problems to build algorithmic speed for coding rounds.';

  const getCoreTheoryData = (dept?: string) => {
    switch (dept) {
      case 'ECE':
        return {
          title: 'Embedded Systems & Digital Logic',
          desc: 'Review ARM architecture, I2C/SPI protocols, and combinational state machines.'
        };
      case 'EEE':
        return {
          title: 'Power Systems & Machines Simulation',
          desc: 'Review electrical machines, MATLAB Simulink modeling, and control dynamics.'
        };
      case 'MECHANICAL':
        return {
          title: 'SolidWorks FEA & Thermal Systems',
          desc: 'Review finite element stress audits, kinematics, and thermodynamics cycles.'
        };
      case 'CIVIL':
        return {
          title: 'Structural Design & AutoCAD Civil 3D',
          desc: 'Review reinforced concrete design, bending moments, and surveying data.'
        };
      case 'AIDS':
      case 'AIML':
        return {
          title: 'ML Validation & Pipeline Engineering',
          desc: 'Review Scikit-Learn pipelines, cross-validation metrics, and neural architectures.'
        };
      default:
        return {
          title: 'Core CS: DBMS, OS & System Design',
          desc: 'Review DBMS ACID isolation levels, B+ Trees, and OS process concurrency for technical rounds.'
        };
    }
  };

  const coreTheory = getCoreTheoryData(user?.department);
  const mockDiagnosticTitle = topicAnalysis.weakTopics.length > 0 
    ? `Retake: ${primaryWeakTopic}`
    : 'Full Mock Diagnostic';
  const mockDiagnosticDesc = topicAnalysis.weakTopics.length > 0
    ? `Retake the ${primaryWeakTopic} diagnostic test to verify score improvement and advance readiness.`
    : 'Attempt full-length timed diagnostic rounds to benchmark your speed across categories.';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. TOP STUDENT WELCOME BANNER (Personalized by Dept, Year, Techs, Interests) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/50 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950/90 px-2.5 py-0.5 rounded border border-blue-800/80">
                  {user?.department || 'CSE'} Engineering
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded">
                  {user?.currentYear || '3rd Year'}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">
                  {user?.knownTechnologies?.length || 0} Skills Active · {user?.preferredInterests?.length || 0} Target Domains
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || 'Student'} 👋
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Your personalized placement roadmap is calibrated to <span className="text-white font-medium">{user?.department}</span> recruitment standards. 
                {results.length > 0 ? (
                  ` You have completed ${results.length} diagnostic assessment${results.length > 1 ? 's' : ''}. Weak areas are actively prioritized below.`
                ) : (
                  ' Take your initial diagnostic assessments to generate topic-level strength and weakness analytics.'
                )}
              </p>

              {/* Target domains chips */}
              {user?.preferredInterests && user.preferredInterests.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Target Domains:</span>
                  {user.preferredInterests.map((interest) => (
                    <span key={interest} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/80 text-blue-300 font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <button
                onClick={() => onNavigate('onboarding')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                Edit Profile
              </button>
              
              <button
                onClick={() => onNavigate('assessments')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-950 transition-colors"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Diagnostics Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* 2. PLACEMENT READINESS SCORE + DETERMINISTIC BREAKDOWN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Target className="w-3.5 h-3.5" />
                Deterministic Metric
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Placement Readiness Score</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Computed from actual assessment results, skill coverage, topic mastery, and academic profile
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getReadinessColor(readiness.overallScore)}`}>
                <Award className="w-4 h-4" />
                <span>{readiness.level}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Big Score Dial */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Outer Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={
                      readiness.overallScore >= 80 
                        ? 'stroke-emerald-500' 
                        : readiness.overallScore >= 65 
                        ? 'stroke-blue-500' 
                        : readiness.overallScore >= 45 
                        ? 'stroke-amber-500' 
                        : 'stroke-rose-500'
                    }
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - readiness.overallScore / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{readiness.overallScore}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs font-bold text-slate-200 block">Overall Placement Index</span>
                <span className="text-[11px] text-slate-400">
                  {results.length > 0 
                    ? `Driven by ${results.length} active diagnostic evaluations` 
                    : 'Take tests to calibrate with live scores'}
                </span>
              </div>
            </div>

            {/* 4-Pillar Score Breakdown */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Score Pillar Breakdown (Weighted Formula):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Pillar 1: Assessments */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                      Assessment Diagnostics ({readiness.breakdown.assessmentPerformance.weight}%)
                    </span>
                    <span className="font-bold text-white">{readiness.breakdown.assessmentPerformance.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${readiness.breakdown.assessmentPerformance.score}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">{readiness.breakdown.assessmentPerformance.detail}</p>
                </div>

                {/* Pillar 2: Skill Coverage */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      Skill & Tech Coverage ({readiness.breakdown.skillCoverage.weight}%)
                    </span>
                    <span className="font-bold text-white">{readiness.breakdown.skillCoverage.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${readiness.breakdown.skillCoverage.score}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">{readiness.breakdown.skillCoverage.detail}</p>
                </div>

                {/* Pillar 3: Topic Mastery & Practice */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      Topic Mastery & Practice ({readiness.breakdown.practiceProgress.weight}%)
                    </span>
                    <span className="font-bold text-white">{readiness.breakdown.practiceProgress.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${readiness.breakdown.practiceProgress.score}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">{readiness.breakdown.practiceProgress.detail}</p>
                </div>

                {/* Pillar 4: Interview Preparedness */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                      Interview Preparedness ({readiness.breakdown.interviewPreparedness.weight}%)
                    </span>
                    <span className="font-bold text-white">{readiness.breakdown.interviewPreparedness.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${readiness.breakdown.interviewPreparedness.score}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">{readiness.breakdown.interviewPreparedness.detail}</p>
                </div>

              </div>

              {/* Explanations List */}
              <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <span className="font-bold text-slate-300 block mb-1">Why is my readiness score {readiness.overallScore}%?</span>
                {readiness.explanation.map((exp, i) => (
                  <p key={i} className="text-slate-400 flex items-start gap-2 leading-relaxed">
                    <span className="text-blue-400 font-bold shrink-0">•</span>
                    <span>{exp}</span>
                  </p>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* 3. PROGRESS METRICS (Overall, Aptitude, DSA, Technical, Interview) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase font-semibold text-[11px]">Aptitude Progress</span>
              <span className="text-xs font-bold text-blue-400">{readiness.categoryProgress.aptitude}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${readiness.categoryProgress.aptitude}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">Quantitative & Logical</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase font-semibold text-[11px]">DSA Progress</span>
              <span className="text-xs font-bold text-emerald-400">{readiness.categoryProgress.dsa}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${readiness.categoryProgress.dsa}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">Algorithms & Data Structures</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase font-semibold text-[11px]">Technical Prep</span>
              <span className="text-xs font-bold text-amber-400">{readiness.categoryProgress.technical}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${readiness.categoryProgress.technical}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">DBMS, OS, OOPs & Core</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase font-semibold text-[11px]">Communication Prep</span>
              <span className="text-xs font-bold text-cyan-400">{readiness.categoryProgress.communication}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${readiness.categoryProgress.communication}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">Grammar & HR Interviews</p>
          </div>

        </div>

        {/* 3.5. PERSONALIZED ROADMAP SNAPSHOT */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Active Roadmap Tracker
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Personalized Preparation Roadmap</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {roadmapStats.completedActivities} of {roadmapStats.totalActivities} milestones completed ({roadmapStats.completionPercentage}%). Weak topic focus drills are prioritized.
              </p>
            </div>

            <button
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow self-start sm:self-auto transition-colors"
            >
              <span>Open Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Next Recommended Milestone Preview */}
          {nextRoadmapActivity && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Next Focus
                  </span>
                  <span className="text-xs text-slate-400">{nextRoadmapActivity.category}</span>
                  {nextRoadmapActivity.isWeakTopicPriority && (
                    <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-semibold">
                      Weak Area Priority
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">{nextRoadmapActivity.title}</h4>
                <p className="text-xs text-slate-400 max-w-2xl">{nextRoadmapActivity.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400">~{nextRoadmapActivity.estimatedHours} hrs</span>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Start Activity →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. TOPIC-LEVEL STRENGTH & WEAKNESS ANALYSIS (Core Phase 2 requirement) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Topic-Level Strength & Weakness Analysis
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  Live Assessment Driven
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Analyzed at individual topic level across Aptitude, DSA, Technical, and Communication assessments
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                {topicAnalysis.weakTopics.length} Weak Topics
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                {topicAnalysis.averageTopics.length} Average Topics
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {topicAnalysis.strongTopics.length} Strong Topics
              </span>
            </div>
          </div>

          {/* Section: Category Cards with Strong & Weak Topics */}
          {results.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <FileCheck2 className="w-10 h-10 text-blue-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">No Diagnostic Tests Submitted Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Topic-level strength and weakness identification is generated directly from your actual assessment answers. Start a diagnostic test to generate your breakdown.
              </p>
              <button
                onClick={() => onNavigate('assessments')}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>Take First Diagnostic Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => {
                const { strong, average, weak } = getTopicsByCategory(cat);
                const hasData = strong.length > 0 || average.length > 0 || weak.length > 0;

                return (
                  <div key={cat} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {cat} Diagnostic Topics
                      </span>
                      {!hasData && (
                        <span className="text-[10px] text-slate-500">Not Attempted</span>
                      )}
                    </div>

                    {!hasData ? (
                      <p className="text-xs text-slate-500 py-3 text-center">
                        Take the {cat} diagnostic to unlock topic-level breakdown.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {/* Weak Topics in this category */}
                        {weak.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                              Weak Topics (Focus Area · &lt; 50% accuracy):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {weak.map((t) => (
                                <span 
                                  key={t.topic} 
                                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-950/80 border border-rose-800 text-rose-200 flex items-center gap-1.5"
                                >
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                  <span>{t.topic}</span>
                                  <span className="text-[10px] opacity-80 font-mono">({t.percentage}%)</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Average Topics */}
                        {average.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                              Average / Developing Topics (50% - 74%):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {average.map((t) => (
                                <span 
                                  key={t.topic} 
                                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-950/80 border border-amber-800 text-amber-200 flex items-center gap-1.5"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{t.topic}</span>
                                  <span className="text-[10px] opacity-80 font-mono">({t.percentage}%)</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Strong Topics */}
                        {strong.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                              Strong Topics (Mastered · &ge; 75%):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {strong.map((t) => (
                                <span 
                                  key={t.topic} 
                                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/80 border border-emerald-800 text-emerald-200 flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{t.topic}</span>
                                  <span className="text-[10px] opacity-80 font-mono">({t.percentage}%)</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. WEAK-TOPIC PRIORITIZED RECOMMENDATIONS & RECOMMENDED PRACTICE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Prioritization Engine
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recommended Preparation & Targeted Practice</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Weak topics receive the highest recommendation priority. Strong topics are maintained with targeted mock drills.
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Ranked by Urgency & Campus Recruitment Impact
            </div>
          </div>

          {/* Student Clarity Framework: What I am strong in, What I am weak in, Why I am weak, What to focus on next */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: What I am weak in & Why */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">
                1. Focus Areas (Weak Topics)
              </span>
              <p className="text-xs font-semibold text-white">
                {topicAnalysis.weakTopics.length > 0 
                  ? topicAnalysis.weakTopics.map((t) => t.topic).join(', ') 
                  : 'No critical weak topics detected'}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {topicAnalysis.weakTopics.length > 0 
                  ? topicAnalysis.weakTopics[0]?.reason
                  : 'Diagnostic scores currently above benchmark.'}
              </p>
            </div>

            {/* Box 2: What I am strong in */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                2. Mastered Areas (Strong Topics)
              </span>
              <p className="text-xs font-semibold text-white">
                {topicAnalysis.strongTopics.length > 0 
                  ? topicAnalysis.strongTopics.map((t) => t.topic).join(', ') 
                  : 'Diagnostic required to confirm masteries'}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Maintain consistency by solving 1-2 advanced problems weekly.
              </p>
            </div>

            {/* Box 3: What I should focus on next */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
                3. Immediate Next Action
              </span>
              <p className="text-xs font-semibold text-white">
                {recommendations[0]?.suggestedAction || 'Complete diagnostic assessments'}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Estimated practice duration: ~{recommendations[0]?.estimatedHours || 3} hours.
              </p>
            </div>

          </div>

          {/* Actionable Recommended Practice Cards */}
          <div className="space-y-3 pt-2">
            {recommendations.slice(0, 5).map((rec) => (
              <div 
                key={rec.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  rec.priority === 'High' 
                    ? 'bg-slate-900/90 border-rose-800/70 hover:border-rose-700' 
                    : rec.priority === 'Medium'
                    ? 'bg-slate-900 border-amber-800/60 hover:border-amber-700'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rec.priority === 'High'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : rec.priority === 'Medium'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {rec.priority} Priority {rec.isWeakTopic && '· Focus Area'}
                    </span>
                    <span className="text-xs font-bold text-white">{rec.topic}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">{rec.category}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-semibold">Diagnosis: </span>
                    {rec.reason}
                  </p>

                  <p className="text-xs text-blue-300 leading-relaxed">
                    <span className="text-slate-400 font-semibold">Recommended Plan: </span>
                    {rec.suggestedAction}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                  <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    ~{rec.estimatedHours} hrs {rec.practiceType}
                  </span>

                  <button
                    onClick={() => onNavigate('assessments')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Practice / Retake</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 6. WEEKLY PREPARATION FOCUS (Personalized for Department, Year, Weak Topics) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Weekly Preparation Focus Schedule
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Tailored 7-day tactical sprint prioritizing {user?.department} target skills and identified weak areas
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800 font-semibold">
              Sprint 1 Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Day 1 - 2</span>
                <span className="text-[10px] text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800 font-bold">Weak Area</span>
              </div>
              <h4 className="text-sm font-bold text-white">{primaryWeakTopic}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated concept review and 15 drill problems to eliminate conceptual error patterns.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Day 3 - 4</span>
                <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800 font-bold">Coding Focus</span>
              </div>
              <h4 className="text-sm font-bold text-white">{codingFocusTitle}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {codingFocusDesc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Day 5</span>
                <span className="text-[10px] text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800 font-bold">Core Theory</span>
              </div>
              <h4 className="text-sm font-bold text-white">{coreTheory.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {coreTheory.desc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Day 6 - 7</span>
                <span className="text-[10px] text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800 font-bold">Diagnostics</span>
              </div>
              <h4 className="text-sm font-bold text-white">{mockDiagnosticTitle}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {mockDiagnosticDesc}
              </p>
            </div>

          </div>
        </div>

        {/* 7. ASSESSMENT PERFORMANCE MATRIX */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                Assessment Diagnostics Performance Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Summary of diagnostic tests and active scores stored in client storage
              </p>
            </div>

            <button
              onClick={() => onNavigate('assessments')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const matchingResults = results.filter((r) => r.category === cat);
              const latest = matchingResults[matchingResults.length - 1];

              return (
                <div key={cat} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{cat}</span>
                    {latest ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {latest.percentage}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                        Pending
                      </span>
                    )}
                  </div>

                  {latest ? (
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300 font-semibold">{latest.score}/{latest.totalQuestions} questions correct</p>
                      <p className="text-[11px] text-slate-500">Completed {new Date(latest.completedAt).toLocaleDateString()}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 leading-snug">
                      Diagnostic not taken yet. Complete to identify topic gaps.
                    </p>
                  )}

                  <button
                    onClick={() => onNavigate('assessments')}
                    className="w-full py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    {latest ? <RotateCcw className="w-3 h-3 text-blue-400" /> : <FileCheck2 className="w-3 h-3 text-blue-400" />}
                    <span>{latest ? 'Retake Diagnostic' : 'Start Diagnostic'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
