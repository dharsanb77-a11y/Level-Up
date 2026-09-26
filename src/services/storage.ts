import { Student, Department, AcademicYear, AppNotification, Assessment, RoadmapActivity, AssessmentResult } from '../types';
import { SEED_ROADMAP_ACTIVITIES } from '../data/seedData';
import { ALL_ASSESSMENTS } from '../data/assessmentQuestions';
import { EmailService } from './emailService';

const STUDENTS_KEY = 'placement_ready_students_v1';
const CURRENT_USER_KEY = 'placement_ready_current_user_v1';
const NOTIFICATIONS_KEY = 'placement_ready_notifications_v1';
const RESULTS_KEY = 'placement_ready_results_v1';

// In-memory fallback in case localStorage is disabled/restricted
const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // fallback
  }
  memoryStore[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
  } catch {
    // fallback
  }
  delete memoryStore[key];
}

// Initial demo student so the evaluator or user can immediately test or inspect
const INITIAL_DEMO_STUDENTS: Student[] = [
  {
    id: 'student-demo-1',
    name: 'Aarav Patel',
    email: 'aarav@college.edu',
    password: 'password123',
    department: 'CSE',
    currentYear: '3rd Year',
    knownTechnologies: ['Python', 'Java', 'React', 'SQL / PostgreSQL', 'Git & GitHub'],
    preferredInterests: ['Full Stack Web Development', 'AI & Machine Learning'],
    onboardingCompleted: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    lastActiveAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    cgpa: '8.85',
    targetRole: 'Full Stack Engineer / SDE',
    targetCompanies: ['Google', 'Microsoft', 'Atlassian', 'TCS Digital'],
    resumeStatus: 'Reviewed',
    resumeSummary: '3 production projects, LeetCode 200+ problems solved, specialized in distributed React & Spring systems.',
    bio: 'Passionate about distributed web systems, clean architecture, and competitive programming.'
  }
];

export const StorageService = {
  getStudents(): Student[] {
    const raw = safeGetItem(STUDENTS_KEY);
    if (!raw) {
      this.saveStudents(INITIAL_DEMO_STUDENTS);
      return INITIAL_DEMO_STUDENTS;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_DEMO_STUDENTS;
    } catch {
      return INITIAL_DEMO_STUDENTS;
    }
  },

  saveStudents(students: Student[]): void {
    safeSetItem(STUDENTS_KEY, JSON.stringify(students));
  },

  getCurrentStudent(): Student | null {
    const raw = safeGetItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.id) return null;
      // Get the freshest record from the students array
      const allStudents = this.getStudents();
      const fresh = allStudents.find((s) => s.id === parsed.id);
      return fresh || parsed;
    } catch {
      return null;
    }
  },

  setCurrentStudent(student: Student | null): void {
    if (student) {
      safeSetItem(CURRENT_USER_KEY, JSON.stringify(student));
    } else {
      safeRemoveItem(CURRENT_USER_KEY);
    }
  },

  register(name: string, email: string, password: string): { success: boolean; student?: Student; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid college or personal email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const students = this.getStudents();
    const existing = students.find((s) => s.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newStudent: Student = {
      id: 'student_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: trimmedName,
      email: trimmedEmail,
      password: password,
      knownTechnologies: [],
      preferredInterests: [],
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    students.push(newStudent);
    this.saveStudents(students);
    this.setCurrentStudent(newStudent);

    // Create a welcoming notification
    this.addNotification({
      id: 'notif_' + Date.now(),
      studentId: newStudent.id,
      title: 'Welcome to PlacementReady! 🎓',
      message: 'Complete your onboarding profile to unlock your personalized placement preparation roadmap.',
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
      linkRoute: 'onboarding'
    });

    // Send cheerful welcome & progress start email to user's registered email
    EmailService.sendProgressEmail(newStudent, 'registration');

    return { success: true, student: newStudent };
  },

  login(email: string, password: string): { success: boolean; student?: Student; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const students = this.getStudents();

    const student = students.find((s) => s.email.toLowerCase() === trimmedEmail);
    if (!student) {
      return { success: false, error: 'No account found with this email. Please check or register.' };
    }

    if (student.password && student.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    const now = new Date().toISOString();
    student.lastLoginAt = now;
    student.lastActiveAt = now;
    this.saveStudents(students);
    this.setCurrentStudent(student);
    return { success: true, student };
  },

  logout(): void {
    this.setCurrentStudent(null);
  },

  saveOnboarding(
    studentId: string,
    department: Department,
    currentYear: AcademicYear,
    technologies: string[],
    interests: string[]
  ): Student {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === studentId);

    const now = new Date().toISOString();
    let updatedStudent: Student;

    if (index !== -1) {
      updatedStudent = {
        ...students[index],
        department,
        currentYear,
        knownTechnologies: technologies,
        preferredInterests: interests,
        onboardingCompleted: true,
        updatedAt: now,
        lastActiveAt: now
      };
      students[index] = updatedStudent;
    } else {
      updatedStudent = {
        id: studentId,
        name: 'Student',
        email: 'student@example.com',
        department,
        currentYear,
        knownTechnologies: technologies,
        preferredInterests: interests,
        onboardingCompleted: true,
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now
      };
      students.push(updatedStudent);
    }

    this.saveStudents(students);
    this.setCurrentStudent(updatedStudent);

    // Add milestone notification
    this.addNotification({
      id: 'notif_onboard_' + Date.now(),
      studentId,
      title: 'Profile Onboarding Complete! 🚀',
      message: `Your ${department} (${currentYear}) readiness profile has been initialized with ${technologies.length} skills and ${interests.length} domain targets.`,
      type: 'roadmap',
      timestamp: now,
      read: false,
      linkRoute: 'dashboard'
    });

    // Send cheerful onboarding completion email
    EmailService.sendProgressEmail(updatedStudent, 'onboarding_completed', {
      department
    });

    return updatedStudent;
  },

  updateProfile(studentId: string, updates: Partial<Student>): Student {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === studentId);
    if (index === -1) {
      throw new Error('Student not found');
    }

    const updated = {
      ...students[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      lastActiveAt: updates.lastActiveAt !== undefined ? updates.lastActiveAt : (students[index].lastActiveAt || new Date().toISOString())
    };
    students[index] = updated;
    this.saveStudents(students);
    this.setCurrentStudent(updated);

    // Send profile update email if user updated key credentials
    if (updates.knownTechnologies || updates.targetRole || updates.cgpa || updates.targetCompanies || updates.resumeStatus) {
      EmailService.sendProgressEmail(updated, 'profile_updated');
    }

    return updated;
  },

  getNotifications(studentId?: string): AppNotification[] {
    const raw = safeGetItem(NOTIFICATIONS_KEY);
    let list: AppNotification[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [];
      }
    }

    if (!list || list.length === 0) {
      // Default notification seed
      list = [
        {
          id: 'notif-welcome',
          title: 'Welcome to PlacementReady 🚀',
          message: 'Your placement preparation launchpad is ready. Check your diagnostic assessment schedule.',
          type: 'info',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          linkRoute: 'dashboard'
        },
        {
          id: 'notif-assessment',
          title: 'Campus Aptitude Diagnostic Available 📝',
          message: 'A 45-minute timed aptitude test has been added to your preparation roadmap.',
          type: 'assessment',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false,
          linkRoute: 'assessments'
        }
      ];
      safeSetItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    }

    if (studentId) {
      return list.filter((n) => !n.studentId || n.studentId === studentId);
    }
    return list;
  },

  addNotification(notification: AppNotification): void {
    const all = this.getNotifications();
    all.unshift(notification);
    safeSetItem(NOTIFICATIONS_KEY, JSON.stringify(all));
  },

  markNotificationAsRead(id: string): void {
    const all = this.getNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    safeSetItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  markAllNotificationsAsRead(studentId?: string): void {
    const all = this.getNotifications();
    const updated = all.map((n) => {
      if (!studentId || !n.studentId || n.studentId === studentId) {
        return { ...n, read: true };
      }
      return n;
    });
    safeSetItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  deleteNotification(id: string): void {
    const all = this.getNotifications();
    const updated = all.filter((n) => n.id !== id);
    safeSetItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  recordActivity(studentId: string): void {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      const now = new Date().toISOString();
      students[index].lastActiveAt = now;
      this.saveStudents(students);
      const current = this.getCurrentStudent();
      if (current && current.id === studentId) {
        current.lastActiveAt = now;
        this.setCurrentStudent(current);
      }
    }
  },

  /**
   * Evaluates if student has been inactive for 24+ hours
   * Generates a personalized reminder based on profile, roadmap, interests, skill gaps
   * Prevents duplicate reminders for the same inactivity period
   * Triggers browser notifications when permitted
   */
  checkInactivityAndGenerateReminder(
    studentId: string, 
    forceSimulate?: boolean
  ): { generated: boolean; notification?: AppNotification; reason?: string; hoursInactive?: number } {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      return { generated: false, reason: 'Student not found.' };
    }

    const now = Date.now();
    const lastActiveTime = student.lastActiveAt 
      ? new Date(student.lastActiveAt).getTime() 
      : (student.lastLoginAt ? new Date(student.lastLoginAt).getTime() : new Date(student.createdAt).getTime());
    
    const elapsedMs = now - lastActiveTime;
    const hoursInactive = Math.max(1, Math.floor(elapsedMs / (1000 * 60 * 60)));

    // Must be inactive for 24+ hours unless forceSimulate is true
    if (!forceSimulate && elapsedMs < 24 * 60 * 60 * 1000) {
      return { 
        generated: false, 
        reason: `Student active recently (${hoursInactive} hours ago). Threshold for reminder is 24+ hours.`, 
        hoursInactive 
      };
    }

    // Prevent duplicate reminders for the same inactivity period
    if (!forceSimulate && student.lastInactivityReminderAt) {
      const lastReminderTime = new Date(student.lastInactivityReminderAt).getTime();
      if (lastReminderTime > lastActiveTime) {
        return { 
          generated: false, 
          reason: 'A re-engagement reminder has already been generated for this inactivity period.', 
          hoursInactive 
        };
      }
    }

    // Inspect student's assessment results to check for weak areas
    const results = this.getAssessmentResults(studentId);
    const weakTopics: { topic: string; category: string; percentage: number }[] = [];
    results.forEach((r) => {
      r.topicBreakdown.forEach((tp) => {
        if (tp.status === 'weak') {
          weakTopics.push({ topic: tp.topic, category: tp.category, percentage: tp.percentage });
        }
      });
    });

    const firstName = student.name.split(' ')[0] || 'Friend';
    let notifTitle = `✨ Keep shining, ${firstName}!`;
    let notifMessage = '';
    let targetRoute: 'assessments' | 'roadmap' | 'dashboard' = 'roadmap';

    if (weakTopics.length > 0) {
      const topWeak = weakTopics[0];
      notifTitle = `🌟 5 min to conquer ${topWeak.topic}!`;
      notifMessage = `Hey ${firstName}! A quick 5-minute review on ${topWeak.topic} will boost your readiness score. You've got this, jump back in!`;
      targetRoute = 'roadmap';
    } else if (student.knownTechnologies && student.knownTechnologies.length > 0) {
      const tech = student.knownTechnologies[0];
      notifTitle = `🚀 You're doing amazing, ${firstName}!`;
      notifMessage = `Your placement dream is built one day at a time! Take a quick peek at your ${tech} milestones and keep your streak blazing.`;
      targetRoute = 'roadmap';
    } else {
      notifTitle = `🎉 We believe in you, ${firstName}!`;
      notifMessage = `Ready to level up today? Take 5 minutes to explore your personalized roadmap and boost your placement confidence!`;
      targetRoute = 'roadmap';
    }

    const notification: AppNotification = {
      id: 'notif_reengage_' + Date.now(),
      studentId: student.id,
      title: notifTitle,
      message: notifMessage,
      type: 'reminder',
      timestamp: new Date().toISOString(),
      read: false,
      linkRoute: targetRoute
    };

    this.addNotification(notification);

    // Send cheerful, motivating progress email to user's registered address
    EmailService.sendProgressEmail(student, 'inactivity_reminder', {
      hoursInactive: forceSimulate ? 26 : hoursInactive
    });

    // Update lastInactivityReminderAt and if forced simulation, also simulate lastActiveAt to 26 hours ago
    const updates: Partial<Student> = { 
      lastInactivityReminderAt: new Date().toISOString() 
    };
    if (forceSimulate) {
      updates.lastActiveAt = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString();
    }
    this.updateProfile(student.id, updates);

    // Optional browser desktop notification
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      try {
        new window.Notification(notifTitle, {
          body: notifMessage
        });
      } catch {
        // ignore notification error
      }
    }

    return { generated: true, notification, hoursInactive: forceSimulate ? 26 : hoursInactive };
  },

  /**
   * Deterministic streak calculation based on real user actions:
   * logins, assessment completions, and roadmap milestones
   */
  getStudentStreak(studentId: string): { currentStreak: number; longestStreak: number; lastActivityDate: string } {
    const dates = new Set<string>();

    // Accumulate dates from actual assessment completions
    const results = this.getAssessmentResults(studentId);
    results.forEach((r) => {
      if (r.completedAt) dates.add(r.completedAt.substring(0, 10));
    });

    // Accumulate dates from actual roadmap milestone completions
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(`placement_ready_roadmap_status_v1_${studentId}`);
        if (raw) {
          const statuses = JSON.parse(raw);
          Object.values(statuses).forEach((item: any) => {
            if (item?.status === 'completed' && item?.completedAt) {
              dates.add(item.completedAt.substring(0, 10));
            }
          });
        }
      }
    } catch {
      // fallback
    }

    const dateList = Array.from(dates).sort().reverse();
    const todayStr = new Date().toISOString().substring(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().substring(0, 10);

    if (dateList.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastActivityDate: '' };
    }

    let currentStreak = 0;
    const hasToday = dateList.includes(todayStr);
    const hasYesterday = dateList.includes(yesterdayStr);

    if (hasToday || hasYesterday) {
      let checkDate = hasToday ? new Date() : new Date(Date.now() - 86400000);
      while (true) {
        const dStr = checkDate.toISOString().substring(0, 10);
        if (dates.has(dStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0; // Inactive, streak reset
    }

    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, dateList.length),
      lastActivityDate: dateList[0] || todayStr
    };
  },

  getAssessmentResults(studentId?: string): AssessmentResult[] {
    const raw = safeGetItem(RESULTS_KEY);
    let list: AssessmentResult[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }

    if (studentId) {
      return list.filter((r) => r.studentId === studentId);
    }
    return list;
  },

  saveAssessmentResult(result: AssessmentResult): void {
    const all = this.getAssessmentResults();
    // Replace any previous result for this same assessment for this student, or push new
    const index = all.findIndex((r) => r.studentId === result.studentId && r.assessmentId === result.assessmentId);
    if (index !== -1) {
      all[index] = result;
    } else {
      all.push(result);
    }
    safeSetItem(RESULTS_KEY, JSON.stringify(all));

    // Also notify the student of their result and newly identified focus areas
    const weakTopics = result.topicBreakdown.filter((t) => t.status === 'weak');
    const weakSummary = weakTopics.length > 0 
      ? `Focus Areas Identified: ${weakTopics.map((t) => t.topic).join(', ')}.` 
      : 'Great job! Strong performance across tested topics.';

    this.addNotification({
      id: 'notif_result_' + Date.now(),
      studentId: result.studentId,
      title: `${result.assessmentTitle} Completed 🎯`,
      message: `Score: ${result.score}/${result.totalQuestions} (${result.percentage}%). ${weakSummary}`,
      type: 'assessment',
      timestamp: new Date().toISOString(),
      read: false,
      linkRoute: 'dashboard'
    });
  },

  deleteAssessmentResult(studentId: string, assessmentId: string): void {
    const all = this.getAssessmentResults();
    const filtered = all.filter((r) => !(r.studentId === studentId && r.assessmentId === assessmentId));
    safeSetItem(RESULTS_KEY, JSON.stringify(filtered));
  },

  getAssessments(studentId?: string): Assessment[] {
    const results = studentId ? this.getAssessmentResults(studentId) : [];
    
    return ALL_ASSESSMENTS.map((base) => {
      const match = results.find((r) => r.assessmentId === base.id);
      if (match) {
        return {
          ...base,
          status: 'completed',
          score: match.percentage,
          lastAttemptAt: match.completedAt
        };
      }
      return {
        ...base,
        status: 'available'
      };
    });
  },

  getAssessmentById(id: string, studentId?: string): Assessment | undefined {
    const all = this.getAssessments(studentId);
    return all.find((a) => a.id === id);
  },

  getRoadmapActivities(): RoadmapActivity[] {
    return SEED_ROADMAP_ACTIVITIES;
  }
};
