import { 
  Student, 
  AssessmentResult, 
  TopicPerformance, 
  StudentReadiness, 
  Recommendation, 
  TopicAnalysis,
  AssessmentCategory
} from '../types';

export const AnalyticsService = {
  /**
   * Evaluates questions against user answers to compute topic-level breakdown
   */
  evaluateAssessment(
    assessmentId: string,
    studentId: string,
    category: AssessmentCategory,
    assessmentTitle: string,
    questions: { id: string; topic: string; question: string; options: string[]; correctAnswer: number; explanation: string }[],
    userAnswers: Record<string, number>,
    timeSpentSeconds: number
  ): AssessmentResult {
    const topicStats: Record<string, { correct: number; total: number }> = {};

    let totalCorrect = 0;

    questions.forEach((q) => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, total: 0 };
      }
      topicStats[q.topic].total += 1;

      const selected = userAnswers[q.id];
      if (selected !== undefined && selected === q.correctAnswer) {
        topicStats[q.topic].correct += 1;
        totalCorrect += 1;
      }
    });

    const topicBreakdown: TopicPerformance[] = Object.keys(topicStats).map((topicName) => {
      const { correct, total } = topicStats[topicName];
      const percentage = Math.round((correct / total) * 100);

      let status: 'strong' | 'average' | 'weak';
      let reason: string;
      let recommendedAction: string;

      if (percentage >= 75) {
        status = 'strong';
        reason = `High accuracy (${correct}/${total} correct, ${percentage}%). Foundational principles and problem solving are solid.`;
        recommendedAction = `Maintain mastery with timed hard drills and advanced edge cases.`;
      } else if (percentage >= 50) {
        status = 'average';
        reason = `Moderate performance (${correct}/${total} correct, ${percentage}%). Occasional misses in complex variations or speed.`;
        recommendedAction = `Review underlying theory formulas and solve 10-15 targeted medium-difficulty problems.`;
      } else {
        status = 'weak';
        reason = `Low accuracy (${correct}/${total} correct, ${percentage}%). Conceptual gap identified in standard patterns and calculation steps.`;
        recommendedAction = `High Priority: Revisit core concepts, review step-by-step solutions, and retake diagnostic test.`;
      }

      return {
        topic: topicName,
        category,
        correct,
        total,
        percentage,
        status,
        reason,
        recommendedAction
      };
    });

    const scorePercentage = Math.round((totalCorrect / questions.length) * 100);

    return {
      id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      assessmentId,
      studentId,
      category,
      assessmentTitle,
      completedAt: new Date().toISOString(),
      score: totalCorrect,
      totalQuestions: questions.length,
      percentage: scorePercentage,
      userAnswers,
      topicBreakdown,
      timeSpentSeconds
    };
  },

  /**
   * Aggregates all assessment results to extract overall Strong, Weak, and Average topics
   */
  getTopicAnalysis(results: AssessmentResult[]): TopicAnalysis {
    if (!results || results.length === 0) {
      return {
        strongTopics: [],
        weakTopics: [],
        averageTopics: [],
        allTopics: []
      };
    }

    // Keep the latest result per topic
    const topicMap: Record<string, TopicPerformance> = {};

    // Sort ascending by completedAt so later results overwrite earlier ones
    const sorted = [...results].sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    sorted.forEach((res) => {
      res.topicBreakdown.forEach((tp) => {
        topicMap[tp.topic] = tp;
      });
    });

    const allTopics = Object.values(topicMap);
    const strongTopics = allTopics.filter((t) => t.status === 'strong');
    const weakTopics = allTopics.filter((t) => t.status === 'weak');
    const averageTopics = allTopics.filter((t) => t.status === 'average');

    return {
      strongTopics,
      weakTopics,
      averageTopics,
      allTopics
    };
  },

  /**
   * Generates prioritized recommendations heavily emphasizing weak topics
   */
  generateRecommendations(topicAnalysis: TopicAnalysis, student: Student | null): Recommendation[] {
    const list: Recommendation[] = [];

    // 1. First add all WEAK topics with HIGH priority
    topicAnalysis.weakTopics.forEach((wt) => {
      list.push({
        id: 'rec-weak-' + wt.topic.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        topic: wt.topic,
        category: wt.category,
        priority: 'High',
        isWeakTopic: true,
        reason: `Diagnostic score was only ${wt.percentage}% (${wt.correct}/${wt.total} correct). Recruiters frequently eliminate candidates on this topic.`,
        suggestedAction: wt.recommendedAction,
        practiceType: 'Concept Revision',
        estimatedHours: 4
      });
    });

    // 2. Add AVERAGE topics with MEDIUM priority
    topicAnalysis.averageTopics.forEach((at) => {
      list.push({
        id: 'rec-avg-' + at.topic.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        topic: at.topic,
        category: at.category,
        priority: 'Medium',
        isWeakTopic: false,
        reason: `Scored ${at.percentage}% (${at.correct}/${at.total}). Good baseline but needs polish to guarantee high percentile in campus rounds.`,
        suggestedAction: at.recommendedAction,
        practiceType: 'Practice Drill',
        estimatedHours: 3
      });
    });

    // 3. Add Strong topics with LOW priority maintenance
    topicAnalysis.strongTopics.forEach((st) => {
      list.push({
        id: 'rec-strong-' + st.topic.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        topic: st.topic,
        category: st.category,
        priority: 'Low',
        isWeakTopic: false,
        reason: `Strong performance (${st.percentage}%). Solved cleanly in recent assessment.`,
        suggestedAction: `Solve 2 advanced speed problems weekly to keep memory sharp.`,
        practiceType: 'Mock Test',
        estimatedHours: 1
      });
    });

    // 4. If no assessments attempted yet, generate default recommendations from student profile
    if (list.length === 0 && student) {
      list.push({
        id: 'rec-default-1',
        topic: 'Aptitude Diagnostic',
        category: 'Aptitude',
        priority: 'High',
        isWeakTopic: true,
        reason: 'No aptitude diagnostic completed yet. Campus drives filter 60%+ students in this first round.',
        suggestedAction: 'Take the 20-minute Quantitative & Logical Diagnostic to identify your baseline.',
        practiceType: 'Mock Test',
        estimatedHours: 1
      });

      list.push({
        id: 'rec-default-2',
        topic: 'Arrays & Two Pointers',
        category: 'DSA',
        priority: 'High',
        isWeakTopic: true,
        reason: 'Most common coding interview pattern across tier-1 service and product companies.',
        suggestedAction: 'Review Kadane’s algorithm, two-pointer search, and sliding window templates.',
        practiceType: 'Concept Revision',
        estimatedHours: 3
      });

      list.push({
        id: 'rec-default-3',
        topic: 'DBMS ACID & Indexing',
        category: 'Technical',
        priority: 'Medium',
        isWeakTopic: false,
        reason: 'Crucial core computer science subject tested in technical interview rounds.',
        suggestedAction: 'Study transaction isolation levels and B+ tree index structures.',
        practiceType: 'Practice Drill',
        estimatedHours: 2
      });
    }

    return list;
  },

  /**
   * Deterministic Placement Readiness Score calculation
   */
  calculateReadiness(student: Student | null, results: AssessmentResult[]): StudentReadiness {
    const explanations: string[] = [];

    // --- PILLAR 1: Assessment Performance (Weight: 35%) ---
    let assessmentScore = 0;
    if (results.length > 0) {
      const avgPercent = results.reduce((acc, r) => acc + r.percentage, 0) / results.length;
      // Coverage bonus: how many of the 4 core categories have been attempted?
      const categoriesCovered = new Set(results.map((r) => r.category)).size;
      const coverageMultiplier = Math.min(1, 0.4 + (categoriesCovered / 4) * 0.6);
      assessmentScore = Math.round(avgPercent * coverageMultiplier);
      explanations.push(
        `Diagnostic Assessments: Average score of ${Math.round(avgPercent)}% across ${results.length} tests (${categoriesCovered}/4 categories attempted).`
      );
    } else {
      assessmentScore = 20; // baseline before taking any tests
      explanations.push(`Diagnostic Assessments: No assessments completed yet. Take tests to boost this component.`);
    }

    // --- PILLAR 2: Topic & Skill Coverage (Weight: 25%) ---
    let skillScore = 0;
    const techCount = student?.knownTechnologies?.length || 0;
    if (techCount >= 6) {
      skillScore = 95;
    } else if (techCount >= 4) {
      skillScore = 80;
    } else if (techCount >= 2) {
      skillScore = 60;
    } else if (techCount >= 1) {
      skillScore = 40;
    } else {
      skillScore = 20;
    }
    explanations.push(
      `Skill Coverage: ${techCount} technologies registered in profile (${student?.department || 'Engineering'} curriculum aligned).`
    );

    // --- PILLAR 3: Practice & Topic Mastery (Weight: 20%) ---
    let practiceScore = 0;
    const topicAnalysis = this.getTopicAnalysis(results);
    const strongCount = topicAnalysis.strongTopics.length;
    const weakCount = topicAnalysis.weakTopics.length;

    // Check roadmap completion in storage
    let completedRoadmapActivities = 0;
    if (student?.id && typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(`placement_ready_roadmap_status_v1_${student.id}`);
        if (raw) {
          const statuses = JSON.parse(raw);
          completedRoadmapActivities = Object.values(statuses).filter((item: any) => item?.status === 'completed').length;
        }
      } catch {
        // fallback
      }
    }

    if (results.length > 0 || completedRoadmapActivities > 0) {
      // Reward strong topics and completed roadmap milestones, penalize unaddressed weak topics
      const basePractice = 40;
      const strongBonus = Math.min(30, strongCount * 7);
      const weakPenalty = Math.min(25, weakCount * 5);
      const roadmapBonus = Math.min(35, completedRoadmapActivities * 6);
      practiceScore = Math.max(10, Math.min(100, basePractice + strongBonus + roadmapBonus - weakPenalty));
      explanations.push(
        `Topic Mastery & Practice: ${strongCount} strong topics mastered, ${completedRoadmapActivities} roadmap milestones completed, ${weakCount} weak areas flagged.`
      );
    } else {
      practiceScore = 30;
      explanations.push(`Topic Mastery: Awaiting diagnostic test results and roadmap practice milestones.`);
    }

    // --- PILLAR 4: Interview Preparedness & Profile Completeness (Weight: 20%) ---
    let interviewScore = 35;
    if (student?.cgpa) interviewScore += 15;
    if (student?.targetRole) interviewScore += 15;
    if (student?.targetCompanies && student.targetCompanies.length > 0) interviewScore += 15;
    if (student?.githubUrl || student?.linkedinUrl) interviewScore += 10;
    if (student?.resumeStatus === 'Reviewed' || student?.resumeStatus === 'Ready for Campus') interviewScore += 10;
    interviewScore = Math.min(100, interviewScore);

    explanations.push(
      `Career Preparedness: Academic stage ${student?.currentYear || 'Prep'} with ${student?.cgpa ? 'CGPA recorded' : 'CGPA pending'}, resume status "${student?.resumeStatus || 'Drafting'}", and ${student?.targetCompanies?.length || 0} target companies.`
    );

    // --- Composite Deterministic Score ---
    const weightAssessment = 0.35;
    const weightSkill = 0.25;
    const weightPractice = 0.20;
    const weightInterview = 0.20;

    const rawTotal = 
      assessmentScore * weightAssessment +
      skillScore * weightSkill +
      practiceScore * weightPractice +
      interviewScore * weightInterview;

    const overallScore = Math.round(Math.max(10, Math.min(100, rawTotal)));

    let level: 'Needs Preparation' | 'Developing' | 'Competent' | 'Placement Ready';
    if (overallScore >= 80) {
      level = 'Placement Ready';
    } else if (overallScore >= 65) {
      level = 'Competent';
    } else if (overallScore >= 45) {
      level = 'Developing';
    } else {
      level = 'Needs Preparation';
    }

    // Category progress metrics
    const getCategoryProgress = (cat: AssessmentCategory): number => {
      const catResults = results.filter((r) => r.category === cat);
      if (catResults.length > 0) {
        // Return latest percentage
        const latest = catResults[catResults.length - 1];
        return latest.percentage;
      }
      // Baseline placeholder if not taken yet
      return 25;
    };

    return {
      overallScore,
      level,
      breakdown: {
        assessmentPerformance: {
          score: assessmentScore,
          weight: 35,
          label: 'Assessment Diagnostics',
          detail: `${results.length} tests completed`
        },
        skillCoverage: {
          score: skillScore,
          weight: 25,
          label: 'Skill & Tech Coverage',
          detail: `${techCount} tech skills active`
        },
        practiceProgress: {
          score: practiceScore,
          weight: 20,
          label: 'Topic Mastery & Practice',
          detail: `${strongCount} strong vs ${weakCount} weak`
        },
        interviewPreparedness: {
          score: interviewScore,
          weight: 20,
          label: 'Interview Preparedness',
          detail: `${student?.currentYear || 'Undergrad'} profile readiness`
        }
      },
      explanation: explanations,
      categoryProgress: {
        aptitude: getCategoryProgress('Aptitude'),
        dsa: getCategoryProgress('DSA'),
        technical: getCategoryProgress('Technical'),
        communication: getCategoryProgress('Communication')
      }
    };
  }
};
