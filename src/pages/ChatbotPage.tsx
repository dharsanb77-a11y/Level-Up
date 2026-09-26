import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AnalyticsService } from '../services/analytics';
import { RoadmapService } from '../services/roadmapService';
import { ChatbotService } from '../services/chatbotService';
import { PageRoute, AssessmentResult } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  BookOpen, 
  Code2, 
  FileText, 
  HelpCircle,
  Clock,
  RotateCcw,
  Copy,
  Check,
  Target,
  ArrowRight,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

interface ChatbotPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  'What should I study next?',
  'Why is my readiness score low?',
  'What are my weak areas?',
  'Explain my roadmap.',
  'How should I prepare for DSA?',
  'How should I prepare for Aptitude?',
  'How should I prepare for Technical interviews?',
  'How should I prepare for Interviews?',
  'How should I improve my Resume/Projects?'
];

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ onNavigate }) => {
  const { user, resultsVersion } = useAuth();

  const [results, setResults] = useState<AssessmentResult[]>(() =>
    StorageService.getAssessmentResults(user?.id)
  );

  useEffect(() => {
    setResults(StorageService.getAssessmentResults(user?.id));
  }, [resultsVersion, user?.id]);

  const readiness = AnalyticsService.calculateReadiness(user, results);
  const topicAnalysis = AnalyticsService.getTopicAnalysis(results);
  const roadmap = RoadmapService.generateRoadmap(user, results);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello ${user?.name || 'Student'}! 👋 I am your Placement Preparation Assistant, actively synchronized with your **${user?.department || 'CSE'}** profile, **${readiness.overallScore}% (${readiness.level})** readiness score, and diagnostic evaluations.

Ask me anything about your syllabus, weak areas, coding rounds, or click any of the curated prompts below to start!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate intelligent response grounded in student's live data
    setTimeout(() => {
      const responseText = ChatbotService.generateResponse(
        query,
        user,
        readiness,
        topicAnalysis,
        roadmap,
        results
      );

      const assistantMessage: Message = {
        id: 'msg_asst_' + Date.now(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 400);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'assistant',
        text: `Chat cleared. How can I help with your ${user?.department || 'placement'} preparation next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper to format basic markdown-style text into pleasant JSX
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-extrabold text-sm sm:text-base text-white pt-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('* **') || line.startsWith('• **')) {
            const clean = line.replace(/^\* |^• /, '');
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1.5">
                <span className="text-blue-400 font-bold shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(clean) }} />
              </div>
            );
          }
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1.5">
                <span className="text-slate-400 shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.substring(2)) }} />
              </div>
            );
          }
          if (line.startsWith('|')) {
            // Table row preview
            return (
              <div key={idx} className="font-mono text-[11px] bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-slate-300 overflow-x-auto">
                {line}
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-800 rounded text-blue-300 font-mono text-[11px]">$1</code>');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Bot className="w-3.5 h-3.5" />
              Contextual AI Assistant · Phase 3 Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Placement Preparation Chatbot
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Intelligent placement advisor grounded in your live assessment results, weak areas, and roadmap
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Live Student Context Capsule */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{user?.name}</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">{user?.department} ({user?.currentYear})</span>
            <span className="text-slate-600">|</span>
            <span className="text-blue-400 font-semibold">Readiness: {readiness.overallScore}% ({readiness.level})</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-semibold">{topicAnalysis.weakTopics.length} Weak Areas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View Dashboard →
            </button>
          </div>
        </div>

        {/* Preset Prompt Questions (All 9 Core Requirements) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant Placement Prompts (1-Click Test)</span>
            </span>
            <span className="text-[11px] text-slate-500">Grounded in your real profile</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-600 hover:text-cyan-300 text-slate-300 text-xs font-medium transition-all text-left shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 min-h-[440px] max-h-[560px] overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-cyan-950 border border-cyan-800 text-cyan-400'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950/90 border border-slate-800/80 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.sender === 'assistant' ? (
                  renderFormattedText(msg.text)
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}

                <div
                  className={`flex items-center justify-between pt-1 border-t text-[10px] ${
                    msg.sender === 'user' ? 'border-blue-500/40 text-blue-200' : 'border-slate-800/80 text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-white flex items-center gap-1 text-[10px]"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 rounded-tl-none flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2">Synthesizing personalized advice from your profile...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask about your ${user?.department || 'placement'} prep, weak areas, DSA, or interview roadmap...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
