import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AnalyticsService } from '../services/analytics';
import { EmailService } from '../services/emailService';
import { PageRoute, Assessment, AssessmentQuestion, AssessmentResult, AssessmentCategory } from '../types';
import { 
  FileCheck2, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  ChevronRight,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';

interface AssessmentsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({ onNavigate }) => {
  const { user, resultsVersion, triggerRefresh } = useAuth();

  const [assessments, setAssessments] = useState<Assessment[]>(() => 
    StorageService.getAssessments(user?.id)
  );
  const [filterType, setFilterType] = useState<string>('All');
  
  // Active test runner state
  const [activeTest, setActiveTest] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [testStartTime, setTestStartTime] = useState<number>(0);

  // Completed result view state
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // Sync assessments list when resultsVersion updates or user changes
  useEffect(() => {
    setAssessments(StorageService.getAssessments(user?.id));
  }, [resultsVersion, user?.id]);

  const filteredTests = assessments.filter((test) => {
    if (filterType === 'All') return true;
    return test.type.toLowerCase() === filterType.toLowerCase();
  });

  // Start test - launches in new tab with email dispatch
  const handleStartTest = (test: Assessment) => {
    if (user) {
      EmailService.sendProgressEmail(user, 'assessment_started', {
        assessmentTitle: test.title
      });
      StorageService.recordActivity(user.id);
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const targetUrl = `${baseUrl}#/assessment-session?id=${test.id}`;

    const newWin = window.open(targetUrl, '_blank');
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      // If popup blocker intervened, fall back to in-place runner
      setActiveTest(test);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTestStartTime(Date.now());
      setActiveResult(null);
      setShowConfirmSubmit(false);
    }
  };

  // Retake test
  const handleRetakeTest = (testId: string) => {
    const test = StorageService.getAssessmentById(testId, user?.id);
    if (test) {
      handleStartTest(test);
    }
  };

  // View previously submitted result
  const handleViewExistingResult = (assessmentId: string) => {
    const results = StorageService.getAssessmentResults(user?.id);
    const found = results.find((r) => r.assessmentId === assessmentId);
    if (found) {
      setActiveResult(found);
    }
  };

  // Select an option
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Submit test
  const handleSubmitTest = () => {
    if (!activeTest || !user) return;

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - testStartTime) / 1000));
    
    const evaluation = AnalyticsService.evaluateAssessment(
      activeTest.id,
      user.id,
      activeTest.type,
      activeTest.title,
      activeTest.questions,
      userAnswers,
      timeSpentSeconds
    );

    StorageService.saveAssessmentResult(evaluation);
    StorageService.recordActivity(user.id);

    // Send cheerful email update
    EmailService.sendProgressEmail(user, 'assessment_completed', {
      assessmentTitle: activeTest.title,
      score: evaluation.percentage
    });

    triggerRefresh();

    // Switch to result view
    setActiveResult(evaluation);
    setActiveTest(null);
    setShowConfirmSubmit(false);
  };

  // -------------------------------------------------------------
  // VIEW 1: ACTIVE TEST RUNNER
  // -------------------------------------------------------------
  if (activeTest) {
    const currentQ: AssessmentQuestion = activeTest.questions[currentQuestionIndex];
    const totalQuestions = activeTest.questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Runner Top Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                  {activeTest.type} Diagnostic
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-snug">{activeTest.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-400">Answered</p>
                <p className="text-sm font-bold text-emerald-400">{answeredCount} / {totalQuestions}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (answeredCount > 0) {
                    if (window.confirm('Are you sure you want to exit? Your current test progress will be lost.')) {
                      setActiveTest(null);
                    }
                  } else {
                    setActiveTest(null);
                  }
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Exit Test
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Palette Buttons */}
          <div className="flex flex-wrap gap-1.5 p-3 bg-slate-900 border border-slate-800 rounded-xl">
            {activeTest.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'ring-2 ring-blue-400 bg-blue-600 text-white font-extrabold'
                      : isAnswered
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Topic Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/60">
                Topic: {currentQ.topic}
              </span>
              <span className="text-xs text-slate-500">
                Single Choice MCQ
              </span>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-xl text-left border flex items-start gap-3.5 transition-all ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/30 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm pt-0.5 leading-relaxed flex-1">
                      {option}
                    </span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5 shadow transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Review & Submit
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Confirm Submit Modal */}
          {showConfirmSubmit && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Submit {activeTest.title}?</h3>
                    <p className="text-xs text-slate-400">
                      Answered {answeredCount} of {totalQuestions} questions
                    </p>
                  </div>
                </div>

                {answeredCount < totalQuestions && (
                  <div className="p-3 bg-amber-950/60 border border-amber-800 text-amber-200 text-xs rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>You have {totalQuestions - answeredCount} unanswered questions. Unanswered questions will be scored as incorrect.</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">
                  Upon submission, your test will be evaluated instantly. Your topic strengths, weak areas, and personalized placement readiness score will be recalculated immediately.
                </p>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmSubmit(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Continue Answering
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitTest}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors"
                  >
                    Confirm & Submit
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: TEST RESULTS & TOPIC LEVEL BREAKDOWN
  // -------------------------------------------------------------
  if (activeResult) {
    const strongTopics = activeResult.topicBreakdown.filter((t) => t.status === 'strong');
    const averageTopics = activeResult.topicBreakdown.filter((t) => t.status === 'average');
    const weakTopics = activeResult.topicBreakdown.filter((t) => t.status === 'weak');

    const testDefinition = StorageService.getAssessmentById(activeResult.assessmentId, user?.id);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <button
                onClick={() => setActiveResult(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessment Hub
              </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeResult.assessmentTitle}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Completed on {new Date(activeResult.completedAt).toLocaleString()} · Time: ~{Math.round(activeResult.timeSpentSeconds / 60)} mins
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRetakeTest(activeResult.assessmentId)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                Retake Assessment
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Overall Score Banner */}
          <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
            activeResult.percentage >= 75
              ? 'bg-gradient-to-r from-slate-900 to-emerald-950/40 border-emerald-800/80'
              : activeResult.percentage >= 50
              ? 'bg-gradient-to-r from-slate-900 to-amber-950/40 border-amber-800/80'
              : 'bg-gradient-to-r from-slate-900 to-rose-950/40 border-rose-800/80'
          }`}>
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-950/80 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                Diagnostic Evaluation Result
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {activeResult.percentage >= 75 
                  ? 'Strong Performance · Campus Ready Benchmark' 
                  : activeResult.percentage >= 50
                  ? 'Moderate Performance · Target Areas Identified'
                  : 'Needs Practice · Specific Knowledge Gaps Found'}
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Topic-level diagnostics have been automatically factored into your overall Placement Readiness Score and Dashboard priority queue.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-center shrink-0 min-w-[130px]">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Total Score</span>
              <p className="text-3xl font-extrabold text-white my-1">{activeResult.percentage}%</p>
              <p className="text-xs text-emerald-400 font-semibold">{activeResult.score} / {activeResult.totalQuestions} Correct</p>
            </div>
          </div>

          {/* Topic-Level Performance Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Topic-Level Strength & Weakness Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed analysis based on actual answers in each conceptual area
                </p>
              </div>
            </div>

            {/* Weak Topics (Prioritized First) */}
            {weakTopics.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Weak Topics (Focus Area · Needs Immediate Improvement)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {weakTopics.map((topic) => (
                    <div 
                      key={topic.topic}
                      className="p-4 rounded-xl bg-slate-900 border border-rose-800/80 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{topic.topic}</span>
                        <span className="text-xs font-bold text-rose-400 bg-rose-950/90 px-2 py-0.5 rounded border border-rose-800">
                          {topic.correct}/{topic.total} ({topic.percentage}%)
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-rose-400 font-semibold block mb-1">Why I am weak:</span>
                        {topic.reason}
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-slate-300 font-semibold">Recommended Focus: </span>
                        {topic.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Average Topics */}
            {averageTopics.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Average / Improving Topics (Moderate Baseline)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {averageTopics.map((topic) => (
                    <div 
                      key={topic.topic}
                      className="p-4 rounded-xl bg-slate-900 border border-amber-800/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{topic.topic}</span>
                        <span className="text-xs font-bold text-amber-400 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-800">
                          {topic.correct}/{topic.total} ({topic.percentage}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {topic.reason}
                      </p>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-slate-300 font-semibold">Suggested Practice: </span>
                        {topic.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strong Topics */}
            {strongTopics.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Strong Topics (Mastered Concepts)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {strongTopics.map((topic) => (
                    <div 
                      key={topic.topic}
                      className="p-4 rounded-xl bg-slate-900 border border-emerald-800/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{topic.topic}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800">
                          {topic.correct}/{topic.total} ({topic.percentage}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {topic.reason}
                      </p>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-slate-300 font-semibold">Maintenance Plan: </span>
                        {topic.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Question Review Accordion / List */}
          {testDefinition && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Comprehensive Question-by-Question Solution Review
              </h3>

              <div className="space-y-4">
                {testDefinition.questions.map((q, idx) => {
                  const userAnsIdx = activeResult.userAnswers[q.id];
                  const isCorrect = userAnsIdx !== undefined && userAnsIdx === q.correctAnswer;
                  const isUnanswered = userAnsIdx === undefined;

                  return (
                    <div 
                      key={q.id}
                      className={`p-5 rounded-xl border space-y-3 ${
                        isCorrect
                          ? 'bg-slate-900 border-slate-800'
                          : 'bg-slate-900/90 border-rose-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            Topic: <span className="text-white">{q.topic}</span>
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isCorrect
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : isUnanswered
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {isCorrect ? 'Correct' : isUnanswered ? 'Unanswered' : 'Incorrect'}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-white">{q.question}</p>

                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isOptionCorrect = optIdx === q.correctAnswer;
                          const wasSelected = optIdx === userAnsIdx;

                          let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-400';
                          if (isOptionCorrect) {
                            optionStyle = 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-semibold';
                          } else if (wasSelected && !isOptionCorrect) {
                            optionStyle = 'bg-rose-950/70 border-rose-600 text-rose-200';
                          }

                          return (
                            <div 
                              key={optIdx} 
                              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optionStyle}`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {isOptionCorrect && (
                                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Correct Answer
                                </span>
                              )}
                              {wasSelected && !isOptionCorrect && (
                                <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                                  <X className="w-3.5 h-3.5" /> Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300 space-y-1">
                        <span className="font-semibold text-blue-400 block">Solution & Explanation:</span>
                        <p className="text-slate-400 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setActiveResult(null)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800"
            >
              Back to Catalog
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow"
            >
              <span>See Updated Placement Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: ASSESSMENT CATALOGUE SELECTION
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              Diagnostic Assessments Engine · Phase 2 Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus Placement Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Take realistic topic-based assessments across Aptitude, Data Structures, Core CS Technical, and Communication. Results directly drive your readiness metrics and focus areas.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="self-start md:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {['All', 'Aptitude', 'DSA', 'Technical', 'Communication'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterType.toLowerCase() === type.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Available Diagnostics: <span className="font-bold text-white">{filteredTests.length}</span>
          </div>
        </div>

        {/* Assessments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => {
            const hasCompleted = test.status === 'completed';
            const userResults = StorageService.getAssessmentResults(user?.id);
            const latestResult = userResults.find((r) => r.assessmentId === test.id);

            return (
              <div 
                key={test.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/60">
                      {test.type}
                    </span>
                    {hasCompleted ? (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Scored {test.score}%
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-400">
                        Ready to Start
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {test.description}
                  </p>

                  {/* Topics Covered Chips */}
                  <div className="mb-4">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1.5">
                      Topics Evaluated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {test.topics.map((tp) => (
                        <span key={tp} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                          {tp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{test.durationMinutes} mins</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>{test.questionsCount} Questions</span>
                    </div>
                    <span>·</span>
                    <span className="text-amber-400 font-medium">{test.difficulty}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {hasCompleted ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewExistingResult(test.id)}
                          className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>Review Diagnostic</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRetakeTest(test.id)}
                          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartTest(test)}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-950 cursor-pointer group"
                      >
                        <span>Start Diagnostic Test</span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
