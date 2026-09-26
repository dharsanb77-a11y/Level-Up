import { Student } from '../types';

export interface ProgressEmail {
  id: string;
  studentId: string;
  recipientEmail: string;
  recipientName: string;
  stepType: 
    | 'registration' 
    | 'onboarding_completed' 
    | 'profile_updated' 
    | 'topic_started' 
    | 'assessment_started' 
    | 'assessment_completed' 
    | 'activity_completed' 
    | 'readiness_boosted' 
    | 'inactivity_reminder';
  subject: string;
  preview: string;
  body: string;
  metricBadge?: { label: string; value: string };
  sentAt: string;
  read: boolean;
}

const EMAIL_STORE_KEY_PREFIX = 'placement_ready_sent_emails_v1_';

export const EmailService = {
  /**
   * Retrieves all emails sent to a specific student
   */
  getEmails(studentId?: string): ProgressEmail[] {
    if (!studentId || typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(`${EMAIL_STORE_KEY_PREFIX}${studentId}`);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * Saves email list for a student
   */
  saveEmails(studentId: string, emails: ProgressEmail[]): void {
    if (!studentId || typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(`${EMAIL_STORE_KEY_PREFIX}${studentId}`, JSON.stringify(emails));
    } catch {
      // fallback
    }
  },

  /**
   * Sends a motivating, cheerful and positive progress email to the user's registered email
   * and records it in the student's dispatch inbox.
   */
  sendProgressEmail(
    student: { id: string; name: string; email: string },
    stepType: ProgressEmail['stepType'],
    details?: {
      department?: string;
      topicTitle?: string;
      assessmentTitle?: string;
      score?: number;
      activityTitle?: string;
      readinessScore?: number;
      hoursInactive?: number;
    }
  ): ProgressEmail {
    const studentName = student.name.split(' ')[0] || 'Friend';
    let subject = '';
    let preview = '';
    let body = '';
    let metricBadge: { label: string; value: string } | undefined;

    switch (stepType) {
      case 'registration':
        subject = `Welcome to PlacementReady, ${studentName}! 🚀 Your launchpad is live`;
        preview = `We're thrilled to accompany you on your campus placement journey!`;
        body = `Hey ${studentName}! Welcome to PlacementReady! You have taken the first step toward landing your dream campus job offer. We'll be cheering you on and sending motivating milestones on every step you take. Let's make this journey exciting and rewarding!`;
        metricBadge = { label: 'Account', value: 'Ready' };
        break;

      case 'onboarding_completed':
        subject = `🌟 High five, ${studentName}! Your personalized roadmap is ready`;
        preview = `Your academic focus in ${details?.department || 'Engineering'} has been calibrated.`;
        body = `Awesome job completing your onboarding! Your customized learning path for ${details?.department || 'Engineering'} has been set up. Start with your first diagnostic assessment or dive straight into your personalized topic documentation!`;
        metricBadge = { label: 'Focus', value: details?.department || 'Active' };
        break;

      case 'profile_updated':
        subject = `🎯 Profile updated! Your readiness calculation is refreshed`;
        preview = `Your skills, target role and achievements are synced.`;
        body = `Great progress, ${studentName}! We have updated your profile credentials. Every skill and target company you add brings you one step closer to campus drive success. Keep building!`;
        metricBadge = { label: 'Status', value: 'Synced' };
        break;

      case 'topic_started':
        subject = `📚 Diving into ${details?.topicTitle || 'New Topic'}! Fantastic start`;
        preview = `Documentation opened in your study tab. You're building solid fundamentals!`;
        body = `Keep that enthusiasm shining, ${studentName}! You just initiated deep study on ${details?.topicTitle || 'your selected topic'}. Focus on the core patterns and solved examples, then test your understanding with the diagnostic test!`;
        metricBadge = { label: 'Topic', value: 'In Progress' };
        break;

      case 'assessment_started':
        subject = `⏱️ Best of luck on ${details?.assessmentTitle || 'your assessment'}!`;
        preview = `Stay calm, trust your preparation, and take it one question at a time.`;
        body = `You've got this, ${studentName}! Your assessment has launched in a dedicated new tab. Read each question carefully, manage your time, and remember that diagnostics are all about finding opportunities to grow!`;
        metricBadge = { label: 'Assessment', value: 'Active' };
        break;

      case 'assessment_completed':
        subject = `🏆 You scored ${details?.score || 0}% on ${details?.assessmentTitle || 'Diagnostic'}!`;
        preview = `Your diagnostic results and updated readiness score are in!`;
        body = `Way to go, ${studentName}! You completed ${details?.assessmentTitle || 'your assessment'} with a score of ${details?.score || 0}%. We've analyzed your strengths and weak areas so your roadmap adapts automatically. Celebrate your effort today!`;
        metricBadge = { label: 'Score', value: `${details?.score || 0}%` };
        break;

      case 'activity_completed':
        subject = `🔥 Milestone unlocked: ${details?.activityTitle || 'Roadmap Milestone'}!`;
        preview = `Another milestone checked off. Your consistency is inspiring!`;
        body = `Boom! You just finished "${details?.activityTitle || 'your milestone'}". Consistent small efforts every single day lead to massive campus placement success. Keep this streak blazing!`;
        metricBadge = { label: 'Milestone', value: 'Completed' };
        break;

      case 'readiness_boosted':
        subject = `📈 Level up! Your readiness score reached ${details?.readinessScore || 0}%`;
        preview = `Your placement readiness index just jumped higher!`;
        body = `Woohoo, ${studentName}! Your placement readiness score just increased to ${details?.readinessScore || 0}%. You are actively moving towards becoming fully Placement Ready. Keep the momentum alive!`;
        metricBadge = { label: 'Readiness', value: `${details?.readinessScore || 0}%` };
        break;

      case 'inactivity_reminder':
        subject = `✨ We believe in you, ${studentName}! 5 minutes to stay ahead`;
        preview = `Just 10 minutes on your roadmap today will keep your streak and confidence soaring!`;
        body = `Hey ${studentName}! We missed you yesterday! Even 5 to 10 minutes reviewing your weak areas or checking a quick documentation concept makes a world of difference for placement season. Jump back in, conquer a quick topic, and keep your winning streak alive!`;
        metricBadge = { label: 'Motivation', value: 'High' };
        break;
    }

    const newEmail: ProgressEmail = {
      id: 'email_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      studentId: student.id,
      recipientEmail: student.email,
      recipientName: student.name,
      stepType,
      subject,
      preview,
      body,
      metricBadge,
      sentAt: new Date().toISOString(),
      read: false
    };

    const existing = this.getEmails(student.id);
    existing.unshift(newEmail);
    this.saveEmails(student.id, existing);

    // Dispatches a custom browser event so any active UI can instantly update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('placement_ready_email_sent', { detail: newEmail }));
    }

    // Trigger browser notification if user allowed
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(subject, {
          body: preview,
          icon: '/favicon.ico'
        });
      } catch {
        // notification error safe ignore
      }
    }

    return newEmail;
  },

  markAsRead(studentId: string, emailId: string): void {
    const list = this.getEmails(studentId);
    const updated = list.map((e) => (e.id === emailId ? { ...e, read: true } : e));
    this.saveEmails(studentId, updated);
  },

  markAllAsRead(studentId: string): void {
    const list = this.getEmails(studentId);
    const updated = list.map((e) => ({ ...e, read: true }));
    this.saveEmails(studentId, updated);
  },

  clearEmails(studentId: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.removeItem(`${EMAIL_STORE_KEY_PREFIX}${studentId}`);
    } catch {
      // fallback
    }
  }
};
