import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { EmailService } from '../services/emailService';
import { getDocumentationForTopic, TopicDocumentation } from '../data/topicDocumentation';
import { PageRoute } from '../types';
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft, 
  PlayCircle, 
  Code2, 
  HelpCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Building,
  Sparkles,
  Zap
} from 'lucide-react';

interface DocsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigate }) => {
  const { user, triggerRefresh } = useAuth();

  // Parse topic query parameter from window.location.hash
  const [topicName, setTopicName] = useState<string>('Arrays, Two-Pointers & Sliding Window');
  const [activityId, setActivityId] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isCompletedInRoadmap, setIsCompletedInRoadmap] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const queryStr = hash.substring(queryIdx + 1);
        const params = new URLSearchParams(queryStr);
        const t = params.get('topic');
        const act = params.get('activityId');
        if (t) setTopicName(decodeURIComponent(t));
        if (act) setActivityId(act);
      }
    }
  }, []);

  const doc: TopicDocumentation = getDocumentationForTopic(topicName);

  // Check if this activity is marked completed in roadmap storage
  useEffect(() => {
    if (user?.id && activityId && typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(`placement_ready_roadmap_status_v1_${user.id}`);
        if (raw) {
          const statuses = JSON.parse(raw);
          if (statuses[activityId]?.status === 'completed') {
            setIsCompletedInRoadmap(true);
          }
        }
      } catch {
        // fallback
      }
    }
  }, [user?.id, activityId]);

  // Copy code handler
  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Mark activity completed from within documentation
  const handleMarkCompleted = () => {
    if (!user) return;
    setIsCompletedInRoadmap(true);

    if (activityId) {
      const storageKey = `placement_ready_roadmap_status_v1_${user.id}`;
      try {
        const raw = window.localStorage.getItem(storageKey);
        const current = raw ? JSON.parse(raw) : {};
        current[activityId] = {
          status: 'completed',
          completedAt: new Date().toISOString()
        };
        window.localStorage.setItem(storageKey, JSON.stringify(current));
      } catch {
        // fallback
      }
    }

    StorageService.recordActivity(user.id);
    triggerRefresh();

    // Send cheerful email update
    EmailService.sendProgressEmail(user, 'activity_completed', {
      activityTitle: doc.topicTitle
    });

    setToastMessage(`🎉 Awesome! Marked "${doc.topicTitle}" as completed & sent progress update to ${user.email}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Launch assessment in a NEW TAB as required:
  // "Taking user to a new tab only when he clicks 'start assessment'. at this point, a new tab, is required operations and functions should be inserted into current application setup."
  const handleStartAssessmentNewTab = () => {
    const testId = doc.linkedAssessmentId || 'as-dsa';

    if (user) {
      // Dispatch email update on assessment start
      EmailService.sendProgressEmail(user, 'assessment_started', {
        assessmentTitle: `${doc.topicTitle} Diagnostic`
      });
      StorageService.recordActivity(user.id);
    }

    // URL to open in new tab
    const baseUrl = window.location.origin + window.location.pathname;
    const targetUrl = `${baseUrl}#/assessment-session?id=${testId}`;

    const newWindow = window.open(targetUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // In case popup blocker intercepted, route directly
      window.location.hash = `#/assessment-session?id=${testId}`;
    } else {
      setToastMessage(`🚀 Assessment launched in a new tab! Progress email sent to ${user?.email || 'your account'}.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-950 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Navigation & Controls Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('roadmap')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Roadmap</span>
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/60">
                {doc.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {doc.difficulty} Level
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isCompletedInRoadmap ? (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Topic Completed</span>
              </span>
            ) : (
              <button
                onClick={handleMarkCompleted}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark as Completed</span>
              </button>
            )}

            {/* Crucial requirement: Takes user to a new tab when clicking start assessment */}
            <button
              onClick={handleStartAssessmentNewTab}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-950 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
              <span>Start Assessment</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
            </button>
          </div>
        </div>

        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Official Topic Documentation</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>~{doc.readingTimeMinutes} mins read</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Placement Core Subject</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {doc.topicTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
            {doc.overview}
          </p>

          <div className="pt-2 flex items-start gap-2 text-xs text-blue-300 bg-blue-950/60 border border-blue-800/80 p-3.5 rounded-xl">
            <Building className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Placement Significance:</span>
              <span>{doc.placementSignificance}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left 2 Columns: Core Concepts & Code */}
          <div className="lg:col-span-2 space-y-6">

            {/* Core Concepts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Fundamental Principles & Key Concepts</span>
              </h2>

              <div className="space-y-6 divide-y divide-slate-800">
                {doc.keyConcepts.map((section, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-5 space-y-2.5' : 'space-y-2.5'}>
                    <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-800 text-[11px] flex items-center justify-center text-blue-300">
                        {idx + 1}
                      </span>
                      <span>{section.heading}</span>
                    </h3>
                    <ul className="space-y-2 pl-7 list-disc text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {section.points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Solved Code Example */}
            {doc.codeExample && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="bg-slate-950 border-b border-slate-800 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {doc.codeExample.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({doc.codeExample.language})
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(doc.codeExample!.code)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5">
                  <pre className="bg-slate-950 p-4 rounded-xl text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
                    <code>{doc.codeExample.code}</code>
                  </pre>
                  <p className="text-xs text-slate-400 mt-3 italic">
                    💡 <strong className="text-slate-300 not-italic">Note:</strong> {doc.codeExample.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Top Interview Questions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>Top Campus Interview Questions</span>
              </h2>

              <div className="space-y-4">
                {doc.interviewQuestions.map((q, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-white">
                        Q{idx + 1}: {q.question}
                      </p>
                      {q.askedByCompanies && q.askedByCompanies.length > 0 && (
                        <div className="flex flex-wrap gap-1 shrink-0">
                          {q.askedByCompanies.map((c) => (
                            <span key={c} className="text-[10px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                      <strong className="text-emerald-400">Model Answer: </strong>
                      {q.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Quick Reference, Pitfalls & Test CTA */}
          <div className="space-y-6">

            {/* Assessment Launch Box */}
            <div className="bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-700/80 rounded-2xl p-6 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500 flex items-center justify-center mx-auto text-blue-400">
                <PlayCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Ready to Test Your Mastery?</h3>
                <p className="text-xs text-slate-300">
                  Launch the diagnostic test in a new tab. Timed questions with instant score analysis & weakness detection.
                </p>
              </div>

              {/* Crucial requirement: Takes user to a new tab when clicking start assessment */}
              <button
                onClick={handleStartAssessmentNewTab}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-950 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Start Assessment</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <p className="text-[11px] text-slate-400">
                Takes you to a dedicated assessment tab with automatic score & progress updates.
              </p>
            </div>

            {/* Quick Rules & Complexities */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Quick Reference Rules</span>
              </h3>
              <div className="divide-y divide-slate-800">
                {doc.quickReferenceRules.map((qr, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{qr.rule}</span>
                    <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {qr.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Traps / Pitfalls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Common Traps to Avoid</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-4">
                {doc.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-rose-200/90">
                    <span className="text-slate-300">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roadmap Status Widget */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Roadmap Integration</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Completing this topic and taking the follow-up diagnostic updates your overall Readiness Score and resets your 24h activity streak!
              </p>
              <button
                onClick={handleMarkCompleted}
                disabled={isCompletedInRoadmap}
                className={`w-full py-2.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  isCompletedInRoadmap
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isCompletedInRoadmap ? 'Completed in Roadmap' : 'Mark Topic as Completed'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
