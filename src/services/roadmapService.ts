import { 
  Student, 
  Department, 
  AcademicYear, 
  RoadmapActivity, 
  RoadmapCategory, 
  ActivityStatus, 
  ActivityDifficulty,
  AssessmentResult, 
  CategoryProgress, 
  TopicAnalysis 
} from '../types';
import { StorageService } from './storage';
import { AnalyticsService } from './analytics';

const ROADMAP_STATUS_KEY = 'placement_ready_roadmap_status_v1';

function safeGetStatuses(studentId: string): Record<string, { status: ActivityStatus; completedAt?: string }> {
  try {
    const raw = localStorage.getItem(`${ROADMAP_STATUS_KEY}_${studentId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {};
}

function safeSaveStatuses(studentId: string, statuses: Record<string, { status: ActivityStatus; completedAt?: string }>): void {
  try {
    localStorage.setItem(`${ROADMAP_STATUS_KEY}_${studentId}`, JSON.stringify(statuses));
  } catch {
    // fallback
  }
}

export const RoadmapService = {
  /**
   * Generates a fully personalized preparation roadmap incorporating:
   * Department + Year + Technologies + Interests + Assessment Results + Skill Gaps + Current Progress
   */
  generateRoadmap(student: Student | null, results?: AssessmentResult[]): RoadmapActivity[] {
    const studentId = student?.id || 'demo_student';
    const dept: Department = student?.department || 'CSE';
    const year: AcademicYear = student?.currentYear || '3rd Year';
    const userTechs = student?.knownTechnologies || [];
    const userInterests = student?.preferredInterests || [];

    const assessmentResults = results || StorageService.getAssessmentResults(studentId);
    const topicAnalysis: TopicAnalysis = AnalyticsService.getTopicAnalysis(assessmentResults);
    const weakTopics = topicAnalysis.weakTopics;

    const savedStatuses = safeGetStatuses(studentId);

    const baseActivities: RoadmapActivity[] = [];

    // -------------------------------------------------------------
    // 1. PROGRAMMING (Foundation & Language Mastery)
    // -------------------------------------------------------------
    const primaryTech = userTechs.find((t) => ['Java', 'Python', 'C++', 'JavaScript / TypeScript', 'C# / .NET'].includes(t)) || 'Java / C++ / Python';
    baseActivities.push({
      id: 'act-prog-core',
      studentId,
      title: `${primaryTech} Language Mastery & Memory Model`,
      category: 'Programming',
      phase: 'Phase 1: Foundation & Analytical Skills',
      phaseNumber: 1,
      difficulty: 'Beginner',
      estimatedHours: 20,
      status: 'not_started',
      domain: 'Core Programming',
      description: `Build complete proficiency in ${primaryTech}. Master object-oriented principles, memory management, pointers/references, and standard template libraries (STL / Java Collections / Python Built-ins).`,
      topics: ['OOP Principles', 'Standard Libraries', 'Memory & Garbage Collection', 'Exception Handling'],
      learningResource: {
        title: `${primaryTech} Placement Essentials & Standard Library Reference`,
        type: 'Documentation',
        url: 'https://docs.oracle.com/en/java/'
      }
    });

    baseActivities.push({
      id: 'act-prog-oop',
      studentId,
      title: 'Object-Oriented Design & Clean Code Practices',
      category: 'Programming',
      phase: 'Phase 1: Foundation & Analytical Skills',
      phaseNumber: 1,
      difficulty: 'Intermediate',
      estimatedHours: 15,
      status: 'not_started',
      domain: 'Core Programming',
      description: 'Implement SOLID principles, Design Patterns (Singleton, Factory, Observer), and write modular, testable code for technical round evaluations.',
      topics: ['SOLID Principles', 'Factory & Singleton Patterns', 'Modular Architecture', 'Code Refactoring'],
      learningResource: {
        title: 'Refactoring Guru: Design Patterns & SOLID',
        type: 'Article'
      }
    });

    // -------------------------------------------------------------
    // 2. APTITUDE (Quantitative, Logical, Verbal)
    // -------------------------------------------------------------
    baseActivities.push({
      id: 'act-apt-quant',
      studentId,
      title: 'Quantitative Aptitude High-Yield Drills',
      category: 'Aptitude',
      phase: 'Phase 1: Foundation & Analytical Skills',
      phaseNumber: 1,
      difficulty: 'Intermediate',
      estimatedHours: 18,
      status: 'not_started',
      domain: 'General Placement',
      description: 'Master high-weightage placement quantitative topics: Percentages, Profit & Loss, Time & Work, Speed Distance & Time, and Simple/Compound Interest.',
      topics: ['Time & Work', 'Percentages', 'Speed & Distance', 'Averages & Ratios'],
      learningResource: {
        title: 'Quantitative Formulas & Speed-Math Shortcut Guide',
        type: 'Practice'
      }
    });

    baseActivities.push({
      id: 'act-apt-logic',
      studentId,
      title: 'Logical Reasoning & Deduction Puzzles',
      category: 'Aptitude',
      phase: 'Phase 1: Foundation & Analytical Skills',
      phaseNumber: 1,
      difficulty: 'Intermediate',
      estimatedHours: 14,
      status: 'not_started',
      domain: 'General Placement',
      description: 'Develop fast deduction skills for Syllogisms, Blood Relations, Seating Arrangements, Direction Sense, and Coding-Decoding puzzles.',
      topics: ['Syllogisms', 'Seating Arrangements', 'Blood Relations', 'Deductive Logic'],
      learningResource: {
        title: 'Campus Logical Reasoning Question Bank',
        type: 'Practice'
      }
    });

    baseActivities.push({
      id: 'act-apt-verbal',
      studentId,
      title: 'Verbal Ability & Comprehension Round Prep',
      category: 'Aptitude',
      phase: 'Phase 1: Foundation & Analytical Skills',
      phaseNumber: 1,
      difficulty: 'Beginner',
      estimatedHours: 10,
      status: 'not_started',
      domain: 'General Placement',
      description: 'Enhance accuracy on sentence completion, reading comprehension passages, error spotting, and vocabulary for campus screening tests.',
      topics: ['Grammar & Prepositions', 'Reading Comprehension', 'Sentence Correction', 'Para Jumbles'],
      learningResource: {
        title: 'Verbal Ability & Campus English Rules Cheatsheet',
        type: 'Article'
      }
    });

    // -------------------------------------------------------------
    // 3. DSA (Data Structures & Algorithms)
    // -------------------------------------------------------------
    baseActivities.push({
      id: 'act-dsa-linear',
      studentId,
      title: 'Arrays, Two-Pointers & Sliding Window Patterns',
      category: 'DSA',
      phase: 'Phase 2: Core Data Structures & Algorithms',
      phaseNumber: 2,
      difficulty: 'Intermediate',
      estimatedHours: 25,
      status: 'not_started',
      domain: 'Problem Solving',
      description: 'Solve top recurring patterns on 1D/2D Arrays: Two Pointers, Prefix Sum, Kadane’s Algorithm, and Sliding Window maximums.',
      topics: ['Arrays', 'Two Pointers', 'Sliding Window', 'Prefix Sums'],
      learningResource: {
        title: 'LeetCode Curated 75: Array Patterns',
        type: 'Practice'
      }
    });

    baseActivities.push({
      id: 'act-dsa-linked-stack',
      studentId,
      title: 'Linked Lists, Stacks & Queues Foundations',
      category: 'DSA',
      phase: 'Phase 2: Core Data Structures & Algorithms',
      phaseNumber: 2,
      difficulty: 'Intermediate',
      estimatedHours: 20,
      status: 'not_started',
      domain: 'Problem Solving',
      description: 'Pointer manipulation, Floyd’s cycle detection in Linked Lists, Monotonic Stacks, and Queue implementations for online coding rounds.',
      topics: ['Linked Lists', 'Cycle Detection', 'Monotonic Stack', 'Queue Buffer'],
      learningResource: {
        title: 'Linked List & Stack Interview Problems Drill',
        type: 'Practice'
      }
    });

    baseActivities.push({
      id: 'act-dsa-trees',
      studentId,
      title: 'Binary Trees, BST & Graph Traversal (DFS/BFS)',
      category: 'DSA',
      phase: 'Phase 2: Core Data Structures & Algorithms',
      phaseNumber: 2,
      difficulty: 'Advanced',
      estimatedHours: 30,
      status: 'not_started',
      domain: 'Problem Solving',
      description: 'Tree traversals (Inorder, Preorder, Postorder, Level-order), Lowest Common Ancestor, Binary Search Tree validation, and Breadth/Depth First Searches.',
      topics: ['Binary Trees', 'Binary Search Trees', 'DFS & BFS', 'Tree Recursion'],
      learningResource: {
        title: 'Binary Tree Traversal & Recursion Visualizer',
        type: 'Video'
      }
    });

    // -------------------------------------------------------------
    // 4. TECHNICAL SKILLS (Department-Specific Curriculum)
    // -------------------------------------------------------------
    if (dept === 'CSE' || dept === 'AIDS' || dept === 'AIML') {
      baseActivities.push({
        id: 'act-tech-dbms',
        studentId,
        title: 'Database Management Systems (DBMS & SQL Deep Dive)',
        category: 'Technical Skills',
        phase: 'Phase 3: Domain Specialization & Core Engineering',
        phaseNumber: 3,
        difficulty: 'Intermediate',
        estimatedHours: 18,
        status: 'not_started',
        domain: 'Computer Science Core',
        description: 'Relational design, Normalization (1NF to BCNF), ACID transaction properties, indexing mechanisms (B-Trees), and complex SQL joins.',
        topics: ['DBMS', 'SQL', 'ACID Transactions', 'Indexing & B+ Trees', 'Normalization'],
        learningResource: {
          title: 'PostgreSQL & Database Internals Guide',
          type: 'Documentation'
        }
      });

      baseActivities.push({
        id: 'act-tech-os-cn',
        studentId,
        title: 'Operating Systems & Computer Networks Core',
        category: 'Technical Skills',
        phase: 'Phase 3: Domain Specialization & Core Engineering',
        phaseNumber: 3,
        difficulty: 'Intermediate',
        estimatedHours: 20,
        status: 'not_started',
        domain: 'Computer Science Core',
        description: 'Process synchronization, Mutex/Semaphores, Memory Paging, TCP/IP vs UDP protocols, DNS, HTTP/HTTPS lifecycle, and socket connections.',
        topics: ['Operating Systems', 'Process Concurrency', 'TCP/IP Model', 'Paging & Virtual Memory'],
        learningResource: {
          title: 'CS Core Subjects Interview Handbook',
          type: 'Article'
        }
      });

      if (dept === 'AIDS' || dept === 'AIML' || userInterests.includes('AI & Machine Learning')) {
        baseActivities.push({
          id: 'act-tech-aiml',
          studentId,
          title: 'Machine Learning Pipelines & Model Evaluation',
          category: 'Technical Skills',
          phase: 'Phase 3: Domain Specialization & Core Engineering',
          phaseNumber: 3,
          difficulty: 'Advanced',
          estimatedHours: 25,
          status: 'not_started',
          domain: 'AI & Data Science',
          description: 'Data preprocessing, feature engineering, Supervised/Unsupervised models, Confusion Matrix, Cross-Validation, and PyTorch/Scikit-Learn implementation.',
          topics: ['Scikit-Learn', 'Feature Engineering', 'Model Evaluation', 'Neural Networks'],
          learningResource: {
            title: 'Applied Machine Learning for Tech Interviews',
            type: 'Practice'
          }
        });
      }
    } else if (dept === 'ECE') {
      baseActivities.push({
        id: 'act-tech-ece-embedded',
        studentId,
        title: 'Embedded Systems & Microcontroller Architecture',
        category: 'Technical Skills',
        phase: 'Phase 3: Domain Specialization & Core Engineering',
        phaseNumber: 3,
        difficulty: 'Intermediate',
        estimatedHours: 24,
        status: 'not_started',
        domain: 'Electronics Engineering',
        description: 'ARM Cortex architecture, GPIO, Timers, UART/SPI/I2C communication protocols, interrupt handling, and Real-Time Operating System (RTOS) basics.',
        topics: ['Embedded C', 'Microcontrollers', 'I2C / SPI Protocols', 'RTOS Basics'],
        learningResource: {
          title: 'Embedded Systems & Hardware Interfacing Notes',
          type: 'Documentation'
        }
      });

      baseActivities.push({
        id: 'act-tech-ece-vlsi',
        studentId,
        title: 'Digital Electronics & Verilog / VHDL RTL Design',
        category: 'Technical Skills',
        phase: 'Phase 3: Domain Specialization & Core Engineering',
        phaseNumber: 3,
        difficulty: 'Intermediate',
        estimatedHours: 20,
        status: 'not_started',
        domain: 'VLSI & Circuit Design',
        description: 'Combinational & Sequential logic design, Finite State Machines (FSM), Verilog RTL synthesis, and static timing analysis.',
        topics: ['Verilog HDL', 'FSM State Machines', 'Combinational Logic', 'Timing Constraints'],
        learningResource: {
          title: 'Digital Circuit Design & Verilog RTL Cheatsheet',
          type: 'Article'
        }
      });
    } else if (dept === 'EEE') {
      baseActivities.push({
        id: 'act-tech-eee-power',
        studentId,
        title: 'Power Systems & Electrical Machines Analysis',
        category: 'Technical Skills',
        phase: 'Phase 3: Domain Specialization & Core Engineering',
        phaseNumber: 3,
        difficulty: 'Intermediate',
        estimatedHours: 22,
        status: 'not_started',
        domain: 'Electrical Engineering',
        description: 'Transformers, Synchronous/Induction machines, Load flow calculations, Power factor correction, and MATLAB/Simulink modeling.',
        topics: ['Electrical Machines', 'MATLAB Simulink', 'Power Electronics', 'Control Systems'],
        learningResource: {
          title: 'Power Systems & Machines Technical Interview Notes',
          type: 'Documentation'
        }
      });
    } else if (dept === 'MECHANICAL') {
      baseActivities.push({
        id: 'act-tech-mech-cad',
        studentId,
        title: 'CAD Modeling, SolidWorks Prototyping & FEA',
        category: 'Technical Skills',
        phase: 'Phase 3: Domain Specialization & Core Engineering',
        phaseNumber: 3,
        difficulty: 'Intermediate',
        estimatedHours: 25,
        status: 'not_started',
        domain: 'Mechanical Design',
        description: '3D parametric modeling in SolidWorks/AutoCAD, Finite Element Analysis (FEA), stress-strain audits, and GD&T drafting standards.',
        topics: ['SolidWorks / AutoCAD', 'FEA Stress Analysis', 'GD&T Standards', 'Thermodynamics'],
        learningResource: {
          title: 'Mechanical Design & Simulation Handbook',
          type: 'Documentation'
        }
      });
    } else if (dept === 'CIVIL') {
      baseActivities.push({
        id: 'act-tech-civil-struct',
        studentId,
        title: 'Structural Analysis & AutoCAD Civil 3D Blueprinting',
        category: 'Technical Skills',
        phase: 'Phase 3: Domain Specialization & Core Engineering',
        phaseNumber: 3,
        difficulty: 'Intermediate',
        estimatedHours: 25,
        status: 'not_started',
        domain: 'Civil Infrastructure',
        description: 'Reinforced concrete design, bending moment and shear force diagrams, surveying calculations, and AutoCAD Civil 3D drafting.',
        topics: ['Structural Design', 'AutoCAD Civil 3D', 'Concrete Technology', 'Cost Estimation'],
        learningResource: {
          title: 'Civil Engineering Design & Blueprint Guide',
          type: 'Documentation'
        }
      });
    }

    // -------------------------------------------------------------
    // 5. PROJECTS (Domain Capstone)
    // -------------------------------------------------------------
    const primaryInterest = userInterests[0] || 'Full Stack Web Development';
    baseActivities.push({
      id: 'act-proj-capstone',
      studentId,
      title: `Production Capstone Project: ${primaryInterest}`,
      category: 'Projects',
      phase: 'Phase 3: Domain Specialization & Core Engineering',
      phaseNumber: 3,
      difficulty: 'Advanced',
      estimatedHours: 35,
      status: 'not_started',
      domain: primaryInterest,
      description: `Architect and deploy an end-to-end portfolio project showcasing ${primaryInterest}. Include structured Git commit history, architecture diagrams, unit tests, and live demo link.`,
      topics: ['System Architecture', 'Git & GitHub', 'REST / GraphQL APIs', 'Deployment & CI/CD'],
      learningResource: {
        title: 'Project Architecture Template & GitHub Readme Standards',
        type: 'Template'
      }
    });

    baseActivities.push({
      id: 'act-proj-docs',
      studentId,
      title: 'GitHub Portfolio Curation & Technical Documentation',
      category: 'Projects',
      phase: 'Phase 3: Domain Specialization & Core Engineering',
      phaseNumber: 3,
      difficulty: 'Intermediate',
      estimatedHours: 8,
      status: 'not_started',
      domain: 'Portfolio',
      description: 'Document system designs with clear READMEs, setup instructions, architecture flowcharts, and live preview badges to impress technical interviewers.',
      topics: ['README Documentation', 'Architecture Diagrams', 'Open Source Etiquette', 'Project Demonstration'],
      learningResource: {
        title: 'High-Impact Developer Readme Blueprint',
        type: 'Template'
      }
    });

    // -------------------------------------------------------------
    // 6. RESUME (ATS-Compliant Profile)
    // -------------------------------------------------------------
    baseActivities.push({
      id: 'act-res-audit',
      studentId,
      title: '1-Page ATS-Compliant Placement Resume Crafting',
      category: 'Resume',
      phase: 'Phase 4: Interview Readiness & Mock Rounds',
      phaseNumber: 4,
      difficulty: 'Intermediate',
      estimatedHours: 6,
      status: 'not_started',
      domain: 'Placement Readiness',
      description: 'Draft an ATS-optimized single-page PDF resume using standard typography. Structure bullet points with the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
      topics: ['ATS Formatting', 'XYZ Formula Bullets', 'Skill Section Categorization', 'Grammar Audit'],
      learningResource: {
        title: 'Overleaf / LaTeX Placement Resume Template',
        type: 'Template'
      }
    });

    // -------------------------------------------------------------
    // 7. INTERVIEWS (Behavioral, Technical, HR Mock)
    // -------------------------------------------------------------
    baseActivities.push({
      id: 'act-int-star',
      studentId,
      title: 'Behavioral & HR Interview Mastery (STAR Framework)',
      category: 'Interviews',
      phase: 'Phase 4: Interview Readiness & Mock Rounds',
      phaseNumber: 4,
      difficulty: 'Intermediate',
      estimatedHours: 10,
      status: 'not_started',
      domain: 'Placement Readiness',
      description: 'Structure 5 key stories using STAR (Situation, Task, Action, Result) for conflict resolution, leadership, failure analysis, and team cooperation questions.',
      topics: ['STAR Framework', 'Tell Me About Yourself', 'Weakness & Strength Framing', 'Company Culture Pitch'],
      learningResource: {
        title: 'STAR Method Interview Guide & Top 25 Campus HR Questions',
        type: 'Article'
      }
    });

    baseActivities.push({
      id: 'act-int-tech-mock',
      studentId,
      title: 'Technical Mock Interview & Live Coding Simulation',
      category: 'Interviews',
      phase: 'Phase 4: Interview Readiness & Mock Rounds',
      phaseNumber: 4,
      difficulty: 'Advanced',
      estimatedHours: 12,
      status: 'not_started',
      domain: 'Placement Readiness',
      description: 'Practice thinking out loud, discussing time/space complexity before writing code, edge-case testing, and receiving architectural feedback.',
      topics: ['Live Problem Solving', 'Complexity Analysis', 'System Design Walkthrough', 'Handling Interviewer Hints'],
      learningResource: {
        title: 'Mock Technical Interview Rubric & Scoring Sheet',
        type: 'Practice'
      }
    });

    // -------------------------------------------------------------
    // MERGE SAVED STATUSES
    // -------------------------------------------------------------
    let activities = baseActivities.map((act) => {
      const saved = savedStatuses[act.id];
      if (saved) {
        return {
          ...act,
          status: saved.status,
          completedAt: saved.completedAt
        };
      }
      return act;
    });

    // -------------------------------------------------------------
    // WEAK-TOPIC PRIORITIZATION & INJECTION
    // -------------------------------------------------------------
    // For every weak topic identified in assessments:
    // Mark relevant activities as high priority or inject focused remediation activities
    weakTopics.forEach((wt) => {
      // Look for activity containing topic
      const matched = activities.find(
        (a) => a.topics.some((t) => t.toLowerCase().includes(wt.topic.toLowerCase()) || wt.topic.toLowerCase().includes(t.toLowerCase()))
      );

      if (matched) {
        matched.isWeakTopicPriority = true;
        matched.priorityReason = `⚠️ Diagnostic identified ${wt.topic} as a weak area (${wt.percentage}% accuracy). High recommendation priority.`;
      } else {
        // Inject dedicated weak topic remediation activity
        const catMap: Record<string, RoadmapCategory> = {
          'Aptitude': 'Aptitude',
          'DSA': 'DSA',
          'Technical': 'Technical Skills',
          'Communication': 'Interviews'
        };
        const roadmapCat: RoadmapCategory = catMap[wt.category] || 'Technical Skills';

        const remActivityId = `act-weak-${wt.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const savedRem = savedStatuses[remActivityId];

        activities.unshift({
          id: remActivityId,
          studentId,
          title: `Focus Drill: Master ${wt.topic} (${wt.category})`,
          category: roadmapCat,
          phase: 'Phase 1: Foundation & Analytical Skills',
          phaseNumber: 1,
          difficulty: 'Intermediate',
          estimatedHours: 4,
          status: savedRem ? savedRem.status : 'not_started',
          domain: 'Weak Topic Remediation',
          description: `Targeted practice to remediate low accuracy on ${wt.topic} (${wt.correct}/${wt.total} correct in diagnostic). ${wt.reason} ${wt.recommendedAction}`,
          topics: [wt.topic, 'Step-by-Step Solutions', 'Speed Practice', 'Formula Revision'],
          isWeakTopicPriority: true,
          priorityReason: `⚠️ Needs Improvement: You scored only ${wt.percentage}% in diagnostic assessment. High priority focus area.`,
          completedAt: savedRem?.completedAt,
          learningResource: {
            title: `${wt.topic} Problem Set & Theory Guide`,
            type: 'Practice'
          }
        });
      }
    });

    // Sort: weak topic priorities first within their phases
    activities.sort((a, b) => {
      if (a.isWeakTopicPriority && !b.isWeakTopicPriority) return -1;
      if (!a.isWeakTopicPriority && b.isWeakTopicPriority) return 1;
      return a.phaseNumber - b.phaseNumber;
    });

    return activities;
  },

  /**
   * Toggles an activity status: 'not_started' -> 'in_progress' -> 'completed' -> 'not_started'
   * Or sets targetStatus directly
   */
  toggleActivityStatus(
    studentId: string, 
    activityId: string, 
    targetStatus?: ActivityStatus
  ): { activities: RoadmapActivity[]; updatedActivity: RoadmapActivity } {
    const savedStatuses = safeGetStatuses(studentId);
    const current = savedStatuses[activityId]?.status || 'not_started';

    let nextStatus: ActivityStatus;
    if (targetStatus) {
      nextStatus = targetStatus;
    } else {
      if (current === 'not_started') nextStatus = 'in_progress';
      else if (current === 'in_progress') nextStatus = 'completed';
      else nextStatus = 'not_started';
    }

    const now = new Date().toISOString();
    savedStatuses[activityId] = {
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? now : undefined
    };

    safeSaveStatuses(studentId, savedStatuses);

    // Update student's lastActiveAt in storage
    const currentStudent = StorageService.getCurrentStudent();
    if (currentStudent && currentStudent.id === studentId) {
      StorageService.updateProfile(studentId, {
        lastActiveAt: now
      });
    }

    // If marked completed, trigger a milestone notification
    if (nextStatus === 'completed') {
      const studentRoadmap = this.generateRoadmap(currentStudent);
      const act = studentRoadmap.find((a) => a.id === activityId);
      if (act) {
        StorageService.addNotification({
          id: 'notif_act_' + Date.now(),
          studentId,
          title: `Roadmap Milestone Completed! 🎉`,
          message: `You marked "${act.title}" as completed (+${act.estimatedHours} hrs practice). Placement readiness recalculated.`,
          type: 'roadmap',
          timestamp: now,
          read: false,
          linkRoute: 'roadmap'
        });
      }
    }

    const refreshedRoadmap = this.generateRoadmap(currentStudent);
    const updated = refreshedRoadmap.find((a) => a.id === activityId)!;

    return { activities: refreshedRoadmap, updatedActivity: updated };
  },

  /**
   * Computes category-wise progress
   */
  getCategoryProgress(activities: RoadmapActivity[]): CategoryProgress[] {
    const categories: RoadmapCategory[] = [
      'Programming',
      'DSA',
      'Aptitude',
      'Technical Skills',
      'Projects',
      'Resume',
      'Interviews'
    ];

    return categories.map((category) => {
      const catActs = activities.filter((a) => a.category === category);
      const total = catActs.length;
      const completed = catActs.filter((a) => a.status === 'completed').length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        category,
        totalActivities: total,
        completedActivities: completed,
        percentage
      };
    });
  },

  /**
   * Computes overall roadmap completion statistics
   */
  getOverallStats(activities: RoadmapActivity[]): {
    totalActivities: number;
    completedActivities: number;
    inProgressActivities: number;
    completionPercentage: number;
    totalEstimatedHours: number;
    completedHours: number;
  } {
    const total = activities.length;
    const completed = activities.filter((a) => a.status === 'completed').length;
    const inProgress = activities.filter((a) => a.status === 'in_progress').length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const totalEstimatedHours = activities.reduce((acc, a) => acc + a.estimatedHours, 0);
    const completedHours = activities
      .filter((a) => a.status === 'completed')
      .reduce((acc, a) => acc + a.estimatedHours, 0);

    return {
      totalActivities: total,
      completedActivities: completed,
      inProgressActivities: inProgress,
      completionPercentage,
      totalEstimatedHours,
      completedHours
    };
  }
};
