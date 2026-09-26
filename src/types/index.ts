export type Department = 
  | 'CSE' 
  | 'AIDS' 
  | 'AIML' 
  | 'ECE' 
  | 'EEE' 
  | 'MECHANICAL' 
  | 'CIVIL';

export type AcademicYear = 
  | '1st Year' 
  | '2nd Year' 
  | '3rd Year' 
  | 'Final Year';

export interface Student {
  id: string;
  name: string;
  email: string;
  password?: string;
  department?: Department;
  currentYear?: AcademicYear;
  knownTechnologies: string[];
  preferredInterests: string[];
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  lastInactivityReminderAt?: string;
  cgpa?: string;
  targetRole?: string;
  targetCompanies?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  resumeStatus?: 'Not Started' | 'Drafting' | 'Reviewed' | 'Ready for Campus';
  resumeSummary?: string;
  bio?: string;
}

export interface Technology {
  id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'Core Engineering' | 'Tools';
  popular?: boolean;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName?: string;
}

export interface Skill {
  id: string;
  studentId: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  verified: boolean;
  lastPracticed?: string;
}

export type AssessmentCategory = 
  | 'Aptitude' 
  | 'DSA' 
  | 'Technical' 
  | 'Communication' 
  | 'Core Domain';

export interface AssessmentQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentCategory;
  durationMinutes: number;
  questionsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard';
  status: 'available' | 'upcoming' | 'completed';
  description: string;
  topics: string[];
  questions: AssessmentQuestion[];
  departmentTarget?: Department[];
  score?: number;
  lastAttemptAt?: string;
}

export interface TopicPerformance {
  topic: string;
  category: AssessmentCategory;
  correct: number;
  total: number;
  percentage: number; // 0 - 100
  status: 'strong' | 'average' | 'weak';
  reason: string;
  recommendedAction: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  category: AssessmentCategory;
  assessmentTitle: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  userAnswers: Record<string, number>; // questionId -> option index
  topicBreakdown: TopicPerformance[];
  timeSpentSeconds: number;
}

export interface Recommendation {
  id: string;
  topic: string;
  category: AssessmentCategory;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  suggestedAction: string;
  practiceType: 'Practice Drill' | 'Concept Revision' | 'Mock Test';
  estimatedHours: number;
  isWeakTopic: boolean;
}

export interface StudentReadiness {
  overallScore: number; // 0 - 100
  level: 'Needs Preparation' | 'Developing' | 'Competent' | 'Placement Ready';
  breakdown: {
    assessmentPerformance: { score: number; weight: number; label: string; detail: string };
    skillCoverage: { score: number; weight: number; label: string; detail: string };
    practiceProgress: { score: number; weight: number; label: string; detail: string };
    interviewPreparedness: { score: number; weight: number; label: string; detail: string };
  };
  explanation: string[];
  categoryProgress: {
    aptitude: number;
    dsa: number;
    technical: number;
    communication: number;
  };
}

export interface TopicAnalysis {
  strongTopics: TopicPerformance[];
  weakTopics: TopicPerformance[];
  averageTopics: TopicPerformance[];
  allTopics: TopicPerformance[];
}

export type RoadmapCategory = 
  | 'Programming' 
  | 'DSA' 
  | 'Aptitude' 
  | 'Technical Skills' 
  | 'Projects' 
  | 'Resume' 
  | 'Interviews';

export type ActivityDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ActivityStatus = 'not_started' | 'in_progress' | 'completed';

export interface LearningResource {
  title: string;
  type: 'Article' | 'Practice' | 'Video' | 'Documentation' | 'Template';
  url?: string;
}

export interface RoadmapActivity {
  id: string;
  studentId?: string;
  title: string;
  category: RoadmapCategory;
  phase: string;
  phaseNumber: number;
  difficulty: ActivityDifficulty;
  estimatedHours: number;
  status: ActivityStatus;
  domain: string;
  description: string;
  topics: string[];
  learningResource?: LearningResource;
  isWeakTopicPriority?: boolean;
  priorityReason?: string;
  completedAt?: string;
}

export interface CategoryProgress {
  category: RoadmapCategory;
  totalActivities: number;
  completedActivities: number;
  percentage: number;
}

export interface StudentStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

export interface AppNotification {
  id: string;
  studentId?: string;
  title: string;
  message: string;
  type: 'info' | 'assessment' | 'roadmap' | 'reminder';
  timestamp: string;
  read: boolean;
  linkRoute?: PageRoute;
}

export type Notification = AppNotification;

export type PageRoute = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'onboarding' 
  | 'dashboard' 
  | 'assessments' 
  | 'roadmap' 
  | 'progress' 
  | 'notifications' 
  | 'chatbot' 
  | 'profile'
  | 'docs'
  | 'assessment-session';
