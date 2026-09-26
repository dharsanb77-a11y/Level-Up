import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { RoadmapService } from '../../services/roadmapService';
import { EmailService } from '../../services/emailService';
import { getDocumentationForTopic, TopicDocumentation } from '../../data/topicDocumentation';
import { ALL_ASSESSMENTS } from '../../data/assessmentQuestions';
import { 
  RoadmapActivity, 
  AssessmentQuestion, 
  AssessmentResult, 
  TopicPerformance,
  AssessmentCategory
} from '../../types';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  Copy, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  Building,
  Code2,
  Share2,
  FileCheck
} from 'lucide-react';

interface RoadmapAssessmentModalProps {
  activity: RoadmapActivity | null;
  isOpen: boolean;
  initialTab?: 'assessment' | 'theory';
  onClose: () => void;
  onActivityUpdated?: () => void;
}

export const RoadmapAssessmentModal: React.FC<RoadmapAssessmentModalProps> = ({
  activity,
  isOpen,
  initialTab = 'assessment',
  onClose,
  onActivityUpdated
}) => {
  const { user, triggerRefresh } = useAuth();

  const [activeTab, setActiveTab] = useState<'assessment' | 'theory'>(initialTab);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Test Runner State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [testTimeElapsedSeconds, setTestTimeElapsedSeconds] = useState<number>(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [submittedScore, setSubmittedScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Reset runner
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTestTimeElapsedSeconds(0);
      setIsTestSubmitted(false);
      setSubmittedScore(0);
      setCorrectCount(0);
      setShowConfirmSubmit(false);
    }
  }, [isOpen, initialTab, activity?.id]);

  // Test Timer
  useEffect(() => {
    if (!isOpen || activeTab !== 'assessment' || isTestSubmitted) return;

    const timer = setInterval(() => {
      setTestTimeElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, activeTab, isTestSubmitted]);

  if (!isOpen || !activity) return null;

  // Retrieve matching topic documentation & open source theory
  const primaryTopic = activity.topics[0] || activity.title;
  const doc: TopicDocumentation = getDocumentationForTopic(primaryTopic);

  // Retrieve questions for this activity/topic
  const questions: AssessmentQuestion[] = (doc.assessmentQuestions && doc.assessmentQuestions.length > 0)
    ? doc.assessmentQuestions
    : (ALL_ASSESSMENTS.find(a => a.id === doc.linkedAssessmentId)?.questions.slice(0, 4) || []);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isTestSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optIndex
    }));
  };

  const handleSubmitTest = () => {
    if (!user) return;

    // Calculate score
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const calculatedScore = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    setCorrectCount(correct);
    setSubmittedScore(calculatedScore);
    setIsTestSubmitted(true);
    setShowConfirmSubmit(false);

    // Map category
    const categoryMapping: Record<string, AssessmentCategory> = {
      'DSA': 'DSA',
      'Aptitude': 'Aptitude',
      'Technical': 'Technical',
      'Programming': 'Technical',
      'Projects': 'Technical',
      'Resume': 'Technical',
      'Interviews': 'Technical'
    };
    const validCategory = categoryMapping[activity.category] || 'Technical';

    // Topic breakdown
    const topicBreakdown: TopicPerformance[] = [
      {
        topic: primaryTopic,
        category: validCategory,
        correct,
        total: totalQuestions,
        percentage: calculatedScore,
        status: calculatedScore >= 75 ? 'strong' : calculatedScore >= 50 ? 'average' : 'weak',
        reason: calculatedScore >= 75 
          ? `Solid command over open-source ${primaryTopic} theory & problem invariants.`
          : `Needs further drill down on ${primaryTopic} edge cases and formulas.`,
        recommendedAction: calculatedScore >= 75 
          ? 'Proceed to advanced mock drills or next roadmap module.'
          : 'Review the Open-Source Theory tab and retake the test.'
      }
    ];

    // Save assessment result dynamically
    const assessmentResult: AssessmentResult = {
      id: `res-${Date.now()}`,
      assessmentId: doc.linkedAssessmentId || 'as-dsa',
      studentId: user.id,
      category: validCategory,
      assessmentTitle: `${activity.title} Assessment`,
      completedAt: new Date().toISOString(),
      score: calculatedScore,
      totalQuestions,
      percentage: calculatedScore,
      userAnswers,
      topicBreakdown,
      timeSpentSeconds: testTimeElapsedSeconds
    };

    StorageService.saveAssessmentResult(assessmentResult);
    StorageService.recordActivity(user.id);

    // If passed (score >= 60), mark activity as completed in roadmap
    if (calculatedScore >= 60) {
      RoadmapService.toggleActivityStatus(user.id, activity.id, 'completed');
      EmailService.sendProgressEmail(user, 'assessment_completed', {
        assessmentTitle: `${activity.title} Assessment`,
        score: calculatedScore
      });
      EmailService.sendProgressEmail(user, 'activity_completed', {
        activityTitle: activity.title
      });
      setToastMessage(`🎯 Excellent! Scored ${calculatedScore}% (${correct}/${totalQuestions}). Milestone marked completed and progress saved dynamically!`);
    } else {
      RoadmapService.toggleActivityStatus(user.id, activity.id, 'in_progress');
      EmailService.sendProgressEmail(user, 'assessment_completed', {
        assessmentTitle: `${activity.title} Assessment`,
        score: calculatedScore
      });
      setToastMessage(`📝 Assessment recorded with ${calculatedScore}%. Review the open-source theory and retake anytime!`);
    }

    triggerRefresh();
    if (onActivityUpdated) onActivityUpdated();
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTestTimeElapsedSeconds(0);
    setIsTestSubmitted(false);
    setShowConfirmSubmit(false);
    setSubmittedScore(0);
    setCorrectCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 bg-emerald-950 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
              {activity.category}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-medium">
              {activity.phase}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              {activity.difficulty}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header & Interactive Tab Switcher */}
        <div className="px-5 sm:px-6 pt-4 pb-3 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{activity.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Open-source theoretical curriculum & interactive placement test module. Everything runs in-place with dynamic progress tracking.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'assessment'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assessment Test</span>
              <span className="text-[10px] bg-blue-950/90 text-blue-200 px-1.5 py-0.2 rounded-full border border-blue-700">
                {totalQuestions}Q
              </span>
            </button>

            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'theory'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open-Source Theory</span>
              <span className="text-[10px] bg-emerald-950/90 text-emerald-200 px-1.5 py-0.2 rounded-full border border-emerald-700">
                OpenDSA / MIT
              </span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: ASSESSMENT TEST                                                    */}
          {/* ========================================================================= */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              
              {!isTestSubmitted ? (
                /* LIVE TEST RUNNER */
                <div className="space-y-5">
                  
                  {/* Test Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {answeredCount} of {totalQuestions} answered
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Elapsed: {formatTimer(testTimeElapsedSeconds)}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('theory')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                      >
                        Check Open Theory First
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    />
                  </div>

                  {/* Question Card */}
                  {currentQuestion && (
                    <div className="bg-slate-950/80 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-5">
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-blue-400 bg-blue-950/90 px-2.5 py-0.5 rounded border border-blue-800">
                          {currentQuestion.topic}
                        </span>
                        <span className="text-xs text-slate-500">
                          Question ID: {currentQuestion.id}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                        {currentQuestion.question}
                      </h3>

                      {/* Options */}
                      <div className="space-y-2.5 pt-1">
                        {currentQuestion.options.map((option, idx) => {
                          const isSelected = userAnswers[currentQuestion.id] === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectOption(currentQuestion.id, idx)}
                              className={`w-full text-left p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-start gap-3 border cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-950/80 border-blue-500 text-white shadow-md'
                                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-400 text-white'
                                  : 'bg-slate-800 border-slate-700 text-slate-400'
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="flex-1 pt-0.5 leading-snug">{option}</span>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {/* Question Navigator Pills & Bottom Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    
                    {/* Navigation Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {questions.map((q, idx) => {
                        const isAns = typeof userAnswers[q.id] !== 'undefined';
                        const isCurrent = idx === currentQuestionIndex;
                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                              isCurrent
                                ? 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-500/40'
                                : isAns
                                ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next / Previous & Submit */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (answeredCount < totalQuestions) {
                              setShowConfirmSubmit(true);
                            } else {
                              handleSubmitTest();
                            }
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Submit Assessment</span>
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Incomplete Warning Modal Alert */}
                  {showConfirmSubmit && (
                    <div className="p-4 bg-amber-950/70 border border-amber-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-center gap-2.5 text-xs text-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          You answered {answeredCount} of {totalQuestions} questions. Are you sure you want to submit now?
                        </span>
                      </div>
                      <div className="flex items-center gap-2 self-end">
                        <button
                          onClick={() => setShowConfirmSubmit(false)}
                          className="px-3 py-1 bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-800"
                        >
                          Continue Test
                        </button>
                        <button
                          onClick={handleSubmitTest}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg"
                        >
                          Confirm & Submit
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* POST-TEST RESULTS & COMPREHENSIVE QUESTION REVIEW */
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Results Score Banner */}
                  <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                    submittedScore >= 70
                      ? 'bg-emerald-950/50 border-emerald-700/80 text-emerald-100'
                      : 'bg-blue-950/50 border-blue-700/80 text-blue-100'
                  }`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950 border border-slate-800">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Assessment Completed</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white">
                      {submittedScore}% Score
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                      {submittedScore >= 70
                        ? `🎉 Outstanding! You answered ${correctCount} of ${totalQuestions} questions correctly. Activity marked as completed and dynamic readiness score updated.`
                        : `Good attempt! You answered ${correctCount} of ${totalQuestions} correctly. Master the concepts below with open-source theory and retake anytime.`}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('theory')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Review Open-Source Theory</span>
                      </button>

                      <button
                        onClick={handleRetake}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Test</span>
                      </button>

                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow"
                      >
                        <span>Done & Return to Roadmap</span>
                      </button>
                    </div>
                  </div>

                  {/* Question-by-Question Solution Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                      <span>Detailed Answer Solutions & Open-Source Justifications</span>
                    </h4>

                    {questions.map((q, idx) => {
                      const userAns = userAnswers[q.id];
                      const isCorrect = userAns === q.correctAnswer;

                      return (
                        <div 
                          key={q.id}
                          className={`p-4 sm:p-5 rounded-xl border space-y-3.5 ${
                            isCorrect
                              ? 'bg-slate-950/60 border-emerald-900/60'
                              : 'bg-slate-950/60 border-rose-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-400">
                              Question {idx + 1}
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-semibold text-white">
                            {q.question}
                          </p>

                          {/* Options visualizer */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, oIdx) => {
                              const isThisCorrect = oIdx === q.correctAnswer;
                              const isThisUser = userAns === oIdx;

                              return (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                                    isThisCorrect
                                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-bold'
                                      : isThisUser
                                      ? 'bg-rose-950/60 border-rose-600 text-rose-200 line-through'
                                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                  {isThisCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Open-Source Explanation Box */}
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                            <span className="font-bold text-blue-400 block">Explanation (Open Theory):</span>
                            <p className="text-slate-300 leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: OPEN-SOURCE THEORY & DOCUMENTATION                                 */}
          {/* ========================================================================= */}
          {activeTab === 'theory' && (
            <div className="space-y-6">

              {/* Open-Source Attribution Banner */}
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Open-Source Educational Curriculum
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {doc.openSourceReference?.sourceName || 'OpenDSA Project & MIT OpenCourseWare'}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    License: {doc.openSourceReference?.license || 'Creative Commons Attribution (CC BY-SA)'} · {doc.openSourceReference?.attributionNote}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('assessment')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow self-start sm:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Assessment Test</span>
                </button>
              </div>

              {/* Theory Overview */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Theoretical Foundations & Overview</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {doc.overview}
                </p>
              </div>

              {/* Placement Significance */}
              <div className="p-4 bg-blue-950/40 border border-blue-800/80 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>Why Campus Recruiters Test This</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {doc.placementSignificance}
                </p>
              </div>

              {/* Key Concepts */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Core Invariants & Mathematical Formulations
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {doc.keyConcepts.map((kc, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>{kc.heading}</span>
                      </h4>
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-300 leading-relaxed">
                        {kc.points.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big-O Complexity Quick Reference */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Big-O Complexity & Quick Reference Rules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {doc.quickReferenceRules.map((qr, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-semibold text-slate-300">{qr.rule}</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        {qr.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Example (if available) */}
              {doc.codeExample && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <span>{doc.codeExample.title}</span>
                    </h3>
                    <button
                      onClick={() => handleCopyCode(doc.codeExample?.code || '')}
                      className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed">
                    <code>{doc.codeExample.code}</code>
                  </pre>
                  <p className="text-xs text-slate-400 italic">
                    {doc.codeExample.explanation}
                  </p>
                </div>
              )}

              {/* Common Mistakes */}
              {doc.commonMistakes && doc.commonMistakes.length > 0 && (
                <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Common Interview Traps & Pitfalls</span>
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-xs text-rose-200/90 leading-relaxed">
                    {doc.commonMistakes.map((cm, idx) => (
                      <li key={idx}>{cm}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Campus Interview Q&A */}
              {doc.interviewQuestions && doc.interviewQuestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Real Campus Interview Questions
                  </h3>
                  <div className="space-y-3">
                    {doc.interviewQuestions.map((iq, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            Q: {iq.question}
                          </h4>
                          {iq.askedByCompanies && iq.askedByCompanies.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-500" />
                              <span className="text-[10px] text-slate-400">
                                {iq.askedByCompanies.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 pl-3 border-l-2 border-blue-500 leading-relaxed">
                          {iq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA to switch to Assessment */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Mastered the open-source concepts?
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Test your understanding with instant evaluation, score calculation, and progress recording.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('assessment')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Take Assessment Test</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Open-source theory + interactive tests. Zero external tab redirects.</span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
