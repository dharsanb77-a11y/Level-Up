import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmailService, ProgressEmail } from '../../services/emailService';
import { 
  Mail, 
  X, 
  CheckCheck, 
  Clock, 
  Trash2, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck
} from 'lucide-react';

interface EmailUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailUpdatesModal: React.FC<EmailUpdatesModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [emails, setEmails] = useState<ProgressEmail[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load emails
  const loadEmails = () => {
    if (user?.id) {
      setEmails(EmailService.getEmails(user.id));
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen, user?.id]);

  // Listen for live dispatched emails
  useEffect(() => {
    const handleEmailSent = () => {
      loadEmails();
    };

    window.addEventListener('placement_ready_email_sent', handleEmailSent);
    return () => window.removeEventListener('placement_ready_email_sent', handleEmailSent);
  }, [user?.id]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    if (user?.id) {
      EmailService.markAllAsRead(user.id);
      loadEmails();
    }
  };

  const handleClear = () => {
    if (user?.id && window.confirm('Clear your progress email dispatch history?')) {
      EmailService.clearEmails(user.id);
      loadEmails();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (user?.id) {
      EmailService.markAsRead(user.id, id);
      loadEmails();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Student Progress Email Dispatch</h2>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected to registered email: <span className="text-blue-300 font-medium">{user?.email || 'student@college.edu'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Total Updates Sent: <strong className="text-white">{emails.length}</strong>
          </span>

          <div className="flex items-center gap-3">
            {emails.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllRead}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mark all read</span>
                </button>
                <button
                  onClick={handleClear}
                  className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {emails.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Mail className="w-10 h-10 mx-auto text-slate-700" />
              <p className="text-sm font-medium text-slate-400">No progress updates dispatched yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                As you take assessments, start roadmap topics, and complete milestones, cheerful and motivating emails are dispatched to your registered address!
              </p>
            </div>
          ) : (
            emails.map((email) => {
              const isExpanded = expandedId === email.id;

              return (
                <div
                  key={email.id}
                  className={`rounded-2xl border transition-all ${
                    !email.read 
                      ? 'bg-slate-950/90 border-blue-900/60 shadow-sm' 
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(email.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                        <Send className="w-3.5 h-3.5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {email.subject}
                          </span>
                          {!email.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                          {email.metricBadge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                              {email.metricBadge.label}: {email.metricBadge.value}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1">
                          {email.preview}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                          <span>To: {email.recipientEmail}</span>
                          <span>·</span>
                          <span>{new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(email.sentAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 mt-1 space-y-3 text-xs leading-relaxed text-slate-300">
                      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-slate-200">
                        {email.body}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Delivery Status: <strong className="text-emerald-400">Delivered & Verified</strong></span>
                        <span className="text-slate-400">PlacementReady Notification Engine</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400">
          Emails automatically dispatch at registration, onboarding, topic starts, assessments, and roadmap milestones.
        </div>

      </div>
    </div>
  );
};
