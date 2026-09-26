import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AnalyticsService } from '../services/analytics';
import { EmailService } from '../services/emailService';
import { ALL_ASSESSMENTS } from '../data/assessmentQuestions';
import { Assessment, AssessmentQuestion, AssessmentResult, PageRoute } from '../types';
import { 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  ArrowLeft, 
  Award, 
  Layers, 
  Flame, 
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AssessmentSessionPageProps {
  onNavigate?: (route: PageRoute) => void;
}

export const AssessmentSessionPage: React.FC<AssessmentSessionPageProps> = ({ onNavigate }) => {
  const { user, triggerRefresh } = useAuth();

  // Parse assessment id from window.location.hash
  const [testId, setTestId] = useState<string>('as-dsa');
  const [activeTest, setActiveTest] = useState<Assessment | null>(null);

  // Runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60);
  const [testStartTime, setTestStartTime] = useState<number>(Date.now());
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<AssessmentResult | null>(null);

  // Initialize test from hash
  useEffect(() => {
    let targetId = 'as-dsa';
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const queryStr = hash.substring(queryIdx + 1);
        const params = new URLSearchParams(queryStr);
        const idParam = params.get('id');
        if (idParam) targetId = idParam;
      }
    }
    setTestId(targetId);

    // Look up test
    const found = StorageService.getAssessmentById(targetId, user?.id) || 
                  ALL_ASSESSMENTS.find((a) => a.id === targetId) || 
                  ALL_ASSESSMENTS[0];
    
    setActiveTest(found);
    setTimeLeftSeconds((found.durationMinutes || 20) * 60);
    setTestStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSubmittedResult(null);
  }, [user?.id]);

  // Timer countdown
  useEffect(() => {
    if (submittedResult || !activeTest) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTestAuto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submittedResult, activeTest, userAnswers]);

  // Format timer mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Option selection
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submittedResult) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Submit test (automated or manual)
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

    // 1. Save assessment result to storage
    StorageService.saveAssessmentResult(evaluation);

    // 2. Record activity & update streak
    StorageService.recordActivity(user.id);

    // 3. Send progress email to student's registered email
    EmailService.sendProgressEmail(user, 'assessment_completed', {
      assessmentTitle: activeTest.title,
      score: evaluation.percentage
    });

    // 4. Trigger state refresh for listener components
    triggerRefresh();

    // 5. Transition to result review view
    setSubmittedResult(evaluation);
    setShowConfirmSubmit(false);
  };

  const handleSubmitTestAuto = () => {
    handleSubmitTest();
  };

  // Retake
  const handleRetake = () => {
    if (!activeTest) return;
    setUserAnswers({});
    setTimeLeftSeconds((activeTest.durationMinutes || 20) * 60);
    setTestStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setSubmittedResult(null);
    setShowConfirmSubmit(false);
  };

  // Return to Roadmap or Dashboard
  const handleReturnToDashboard = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#/dashboard';
    }
  };

  const handleReturnToRoadmap = () => {
    if (onNavigate) {
      onNavigate('roadmap');
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#/roadmap';
    }
  };

  if (!activeTest) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <p className="text-slate-400">Loading assessment session...</p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW: POST-SUBMISSION RESULTS VIEW
  // -------------------------------------------------------------------------
  if (submittedResult) {
    const weakTopics = submittedResult.topicBreakdown.filter((t) => t.status === 'weak');
    const averageTopics = submittedResult.topicBreakdown.filter((t) => t.status === 'average');
    const strongTopics = submittedResult.topicBreakdown.filter((t) => t.status === 'strong');

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Result Header Hero */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                  Diagnostic Result Completed 🎯
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {submittedResult.assessmentTitle}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Completed on {new Date(submittedResult.completedAt).toLocaleString()}
                </p>
              </div>

              {/* Score Badge */}
              <div className="text-center sm:text-right bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {submittedResult.percentage}%
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {submittedResult.score} of {submittedResult.totalQuestions} questions correct
                </p>
              </div>
            </div>

            {/* Email Dispatch Notice */}
            <div className="bg-emerald-950/60 border border-emerald-800/80 p-3.5 rounded-xl flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Diagnostic report & score confirmation dispatched to registered email <strong>{user?.email}</strong>.
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleReturnToRoadmap}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-950 flex items-center gap-1.5"
              >
                <span>View Personalized Roadmap</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReturnToDashboard}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Go to Dashboard
              </button>

              <button
                onClick={handleRetake}
                className="py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>
            </div>
          </div>

          {/* Topic Performance Breakdown */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Skill & Topic Breakdown Analysis</span>
            </h2>

            {/* Weak Topics */}
            {weakTopics.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Weak Focus Areas (&lt;50% Accuracy - Needs Remediation)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {weakTopics.map((topic) => (
                    <div 
                      key={topic.topic}
                      className="p-4 rounded-xl bg-slate-900 border border-rose-900/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{topic.topic}</span>
                        <span className="text-xs font-bold text-rose-400 bg-rose-950/90 px-2 py-0.5 rounded border border-rose-800">
                          {topic.correct}/{topic.total} ({topic.percentage}%)
                        </span>
                      </div>
                      <p className="text-xs text-rose-300/90 leading-relaxed bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/50">
                        <strong>Why Flagged:</strong> {topic.reason}
                      </p>
                      <p className="text-xs text-slate-300">
                        <strong>Recommended Action:</strong> {topic.recommendedAction}
                      </p>
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
                  <span>Strong Topics (&gt;=75% Accuracy - Mastered)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {strongTopics.map((topic) => (
                    <div 
                      key={topic.topic}
                      className="p-4 rounded-xl bg-slate-900 border border-emerald-900/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{topic.topic}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800">
                          {topic.correct}/{topic.total} ({topic.percentage}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {topic.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Question-by-Question Solution Review */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Question Solutions & Explanations</span>
            </h3>

            <div className="space-y-4">
              {activeTest.questions.map((q, idx) => {
                const userAns = submittedResult.userAnswers[q.id];
                const isCorrect = userAns !== undefined && userAns === q.correctAnswer;
                const isUnanswered = userAns === undefined;

                return (
                  <div 
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-xl border space-y-3 ${
                      isCorrect 
                        ? 'bg-slate-950 border-emerald-900/60' 
                        : isUnanswered 
                        ? 'bg-slate-950 border-slate-800' 
                        : 'bg-slate-950 border-rose-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-400">
                        Question {idx + 1} · {q.topic}
                      </span>
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : isUnanswered ? (
                        <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                          Unanswered
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded border border-rose-800 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {q.question}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAns === optIdx;
                        const isRightAnswer = q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                              isRightAnswer
                                ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-semibold'
                                : isChosen
                                ? 'bg-rose-950/70 border-rose-600 text-rose-200'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono border border-slate-700">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong className="text-blue-400">Solution Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW: ACTIVE TEST RUNNER
  // -------------------------------------------------------------------------
  const currentQ: AssessmentQuestion = activeTest.questions[currentQuestionIndex];
  const totalQuestions = activeTest.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Assessment Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/60">
                {activeTest.type} Diagnostic Session
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">{activeTest.title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer countdown */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
              timeLeftSeconds < 300 
                ? 'bg-rose-950 border-rose-800 text-rose-300 animate-pulse' 
                : 'bg-slate-950 border-slate-800 text-blue-400'
            }`}>
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            <div className="text-right">
              <p className="text-[11px] text-slate-400">Answered</p>
              <p className="text-sm font-bold text-emerald-400">{answeredCount} / {totalQuestions}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-semibold text-blue-400 uppercase tracking-wider">
              Topic: {currentQ.topic}
            </span>
            <span>Single Choice MCQ</span>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, optIndex) => {
              const isSelected = userAnswers[currentQ.id] === optIndex;

              return (
                <button
                  key={optIndex}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, optIndex)}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 text-white shadow-md shadow-blue-950/50'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Palette & Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quick Navigation Palette:</span>
            <span>{answeredCount} Answered · {totalQuestions - answeredCount} Pending</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeTest.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'ring-2 ring-blue-400 bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-950 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-base font-bold text-white">Submit Diagnostic Assessment?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have answered <strong className="text-emerald-400">{answeredCount}</strong> of <strong className="text-white">{totalQuestions}</strong> questions.
                {answeredCount < totalQuestions && (
                  <span className="block mt-1 text-amber-300">
                    ⚠️ You have {totalQuestions - answeredCount} unanswered questions.
                  </span>
                )}
              </p>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Keep Solving
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow"
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
};
