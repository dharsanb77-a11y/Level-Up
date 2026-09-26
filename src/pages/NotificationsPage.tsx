import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { PageRoute, AppNotification } from '../types';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Info, 
  FileCheck2, 
  MapPin, 
  CheckCircle2,
  ArrowRight,
  Trash2,
  AlertTriangle,
  PlayCircle,
  ShieldCheck,
  Zap,
  Flame
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user, refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    StorageService.getNotifications(user?.id)
  );
  const [filter, setFilter] = useState<'all' | 'unread' | 'reminders'>('all');
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [browserPermission, setBrowserPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? window.Notification.permission : 'unsupported'
  );

  useEffect(() => {
    setNotifications(StorageService.getNotifications(user?.id));
  }, [user?.id]);

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    const updated = StorageService.getNotifications(user?.id);
    setNotifications(updated);
    refreshNotifications();
  };

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsAsRead(user?.id);
    const updated = StorageService.getNotifications(user?.id);
    setNotifications(updated);
    refreshNotifications();
  };

  const handleDelete = (id: string) => {
    StorageService.deleteNotification(id);
    const updated = StorageService.getNotifications(user?.id);
    setNotifications(updated);
    refreshNotifications();
  };

  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await window.Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          new window.Notification('PlacementReady Notifications Enabled 🔔', {
            body: 'You will now receive desktop placement reminders for weak topics and upcoming milestones.'
          });
        }
      } catch (err) {
        console.error('Permission error:', err);
      }
    }
  };

  const handleTriggerReengagement = (simulate: boolean) => {
    if (!user) return;
    const res = StorageService.checkInactivityAndGenerateReminder(user.id, simulate);
    const updated = StorageService.getNotifications(user.id);
    setNotifications(updated);
    refreshNotifications();

    if (res.generated) {
      setSimulationStatus(
        `Generated personalized re-engagement alert: "${res.notification?.title}". (Inactive: ~${res.hoursInactive} hrs)`
      );
    } else {
      setSimulationStatus(res.reason || 'Inactivity condition not satisfied (< 24h).');
    }

    setTimeout(() => setSimulationStatus(null), 5000);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'reminders') return n.type === 'reminder';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return <FileCheck2 className="w-5 h-5 text-amber-400" />;
      case 'roadmap':
        return <MapPin className="w-5 h-5 text-emerald-400" />;
      case 'reminder':
        return <Zap className="w-5 h-5 text-orange-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  // Compute hours inactive
  const lastActiveTime = user?.lastActiveAt ? new Date(user.lastActiveAt).getTime() : Date.now();
  const hoursSinceActive = Math.max(0, Math.floor((Date.now() - lastActiveTime) / 3600000));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              Notifications & Re-engagement
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Placement Alerts & Inactivity Reminders
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Personalized re-engagement triggers automatically when inactive for 24+ hours
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              Mark All as Read
            </button>
          </div>
        </div>

        {/* 24+ Hours Inactivity Engine & Simulation Card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0 mt-0.5">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>24h+ Inactivity Re-engagement Engine</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                    Autonomous
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitors student inactivity. When inactive for &ge;24 hours, synthesizes a personalized reminder using weak topics & roadmap.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  <span>Last Active: {user?.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : 'Just now'}</span>
                  <span>·</span>
                  <span className={hoursSinceActive >= 24 ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                    Elapsed: ~{hoursSinceActive} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => handleTriggerReengagement(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
                title="Simulates 26 hours of inactivity to demonstrate the personalized reminder generation"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate 24h+ Inactivity</span>
              </button>
              
              {browserPermission !== 'granted' && browserPermission !== 'unsupported' && (
                <button
                  onClick={handleRequestPermission}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Enable Desktop Alerts
                </button>
              )}
            </div>
          </div>

          {simulationStatus && (
            <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{simulationStatus}</span>
            </div>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
          <button
            onClick={() => setFilter('reminders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'reminders'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Re-engagement Reminders ({notifications.filter((n) => n.type === 'reminder').length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-white">No notifications in this view</p>
              <p className="text-xs text-slate-400 mt-1">You are completely up to date with your placement schedule.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  notif.read
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                    : 'bg-slate-900 border-blue-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      {notif.type === 'reminder' && (
                        <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800">
                          Re-engagement
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notif.timestamp).toLocaleString()}</span>
                      </div>
                      {notif.linkRoute && (
                        <button
                          onClick={() => {
                            if (!notif.read) handleMarkAsRead(notif.id);
                            if (notif.linkRoute) onNavigate(notif.linkRoute);
                          }}
                          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                        >
                          View page <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
