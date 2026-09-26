import { 
  Student, 
  AssessmentResult, 
  StudentReadiness, 
  TopicAnalysis, 
  RoadmapActivity 
} from '../types';

export const ChatbotService = {
  /**
   * Generates a context-aware response grounded directly in the student's live data
   */
  generateResponse(
    query: string,
    student: Student | null,
    readiness: StudentReadiness,
    topicAnalysis: TopicAnalysis,
    roadmap: RoadmapActivity[],
    results: AssessmentResult[]
  ): string {
    const q = query.trim().toLowerCase();
    const name = student?.name || 'Student';
    const dept = student?.department || 'Engineering';
    const year = student?.currentYear || '3rd Year';
    const weakTopics = topicAnalysis.weakTopics;
    const strongTopics = topicAnalysis.strongTopics;
    const averageTopics = topicAnalysis.averageTopics;
    const score = readiness.overallScore;
    const level = readiness.level;

    const completedActivities = roadmap.filter((a) => a.status === 'completed');
    const incompleteActivities = roadmap.filter((a) => a.status !== 'completed');
    const nextActivity = incompleteActivities[0] || roadmap[0];

    const targetCompanies = student?.targetCompanies && student.targetCompanies.length > 0 
      ? student.targetCompanies.join(', ') 
      : 'Tier-1 tech companies & campus recruiters';

    // -------------------------------------------------------------------------
    // 1. "What should I study next?"
    // -------------------------------------------------------------------------
    if (
      q.includes('study next') || 
      q.includes('what should i study') || 
      q.includes('what next') || 
      q.includes('next topic') ||
      q.includes('next practice')
    ) {
      if (weakTopics.length > 0) {
        const primaryWeak = weakTopics[0];
        return `### 🎯 Targeted Next Step for ${name}

Based on your current readiness score (**${score}% · ${level}**), your immediate top priority is remediating your weakest topic:

**1. Priority Focus: ${primaryWeak.topic} (${primaryWeak.category})**
* **Diagnostic Accuracy:** ${primaryWeak.percentage}% (${primaryWeak.correct}/${primaryWeak.total} correct).
* **Why this matters:** Recruiters heavily test ${primaryWeak.topic} in the initial screening filter.
* **Recommended Action:** ${primaryWeak.recommendedAction}
* **Allocated Time:** ~4 hours of focused practice.

**2. Next Roadmap Activity:**
* **"${nextActivity.title}"** (${nextActivity.category} · ~${nextActivity.estimatedHours} hrs)
* ${nextActivity.description}

💡 *Pro-tip:* Clear your weak area drill first, then mark the activity complete in your Roadmap to increase your readiness score by +6%!`;
      }

      return `### 🚀 Recommended Next Step for ${name}

Your diagnostic foundation is solid with **${strongTopics.length} strong topics**!

Here is your immediate preparation focus for **${dept} (${year})**:
* **Next Roadmap Activity:** **"${nextActivity?.title}"** (${nextActivity?.category} · ~${nextActivity?.estimatedHours} hrs).
* **Goal:** ${nextActivity?.description}
* **Target Companies:** Aligning with your targets (${targetCompanies}).

Head over to the **Roadmap** tab and update the activity status to "In Progress" to track your streak!`;
    }

    // -------------------------------------------------------------------------
    // 2. "Why is my readiness score low?" / Score explanation
    // -------------------------------------------------------------------------
    if (
      q.includes('why is my readiness score low') || 
      q.includes('why score low') || 
      q.includes('readiness score low') || 
      q.includes('explain score') ||
      q.includes('readiness score')
    ) {
      const b = readiness.breakdown;
      const drags: string[] = [];

      if (results.length === 0) {
        drags.push(`• **Diagnostic Assessments (Score: ${b.assessmentPerformance.score}/100, Weight: 35%):** You haven't completed tests across all 4 categories (Aptitude, DSA, Technical, Communication).`);
      } else if (results.length < 3) {
        drags.push(`• **Assessment Category Coverage (Score: ${b.assessmentPerformance.score}/100, Weight: 35%):** You have only completed ${results.length} of 4 core assessment categories.`);
      }

      if (weakTopics.length > 0) {
        drags.push(`• **Weak Topic Penalties (Score: ${b.practiceProgress.score}/100, Weight: 20%):** You have ${weakTopics.length} unaddressed weak topic${weakTopics.length > 1 ? 's' : ''} (${weakTopics.map((w) => w.topic).join(', ')}), which penalizes the Topic Mastery pillar.`);
      }

      if (completedActivities.length < 3) {
        drags.push(`• **Roadmap Milestone Progress (Score: ${b.practiceProgress.score}/100):** Only ${completedActivities.length} of ${roadmap.length} roadmap activities completed.`);
      }

      if (!student?.resumeStatus || student?.resumeStatus === 'Not Started' || student?.resumeStatus === 'Drafting') {
        drags.push(`• **Resume & Career Polish (Score: ${b.interviewPreparedness.score}/100, Weight: 20%):** Resume is currently "${student?.resumeStatus || 'Drafting'}" without verification.`);
      }

      return `### 📊 Deterministic Breakdown: Your Readiness is ${score}% (${level})

Your placement readiness score is not arbitrary—it is calculated deterministically from 4 key pillars:

| Pillar | Weight | Current Score | Status |
| :--- | :--- | :--- | :--- |
| **1. Assessments** | 35% | **${b.assessmentPerformance.score}%** | ${b.assessmentPerformance.detail} |
| **2. Skill Coverage** | 25% | **${b.skillCoverage.score}%** | ${b.skillCoverage.detail} |
| **3. Practice & Mastery** | 20% | **${b.practiceProgress.score}%** | ${b.practiceProgress.detail} |
| **4. Interview Readiness** | 20% | **${b.interviewPreparedness.score}%** | ${b.interviewPreparedness.detail} |

**Key Factors Lowering Your Score:**
${drags.length > 0 ? drags.join('\n') : '• Balanced profile, ready for advanced mock interviews!'}

**How to quickly boost your score by +15–20%:**
1. Retake diagnostics in your weak areas (${weakTopics.map((w) => w.topic).join(', ') || 'Aptitude & DSA'}).
2. Mark completed practice items on your **Roadmap**.
3. Update your Profile to set target role, CGPA, and resume status.`;
    }

    // -------------------------------------------------------------------------
    // 3. "What are my weak areas?"
    // -------------------------------------------------------------------------
    if (
      q.includes('weak areas') || 
      q.includes('weak topics') || 
      q.includes('what are my weak') || 
      q.includes('skill gaps') ||
      q.includes('needs improvement')
    ) {
      if (weakTopics.length === 0) {
        return `### 🌟 Topic Performance Analysis for ${name}

You currently have **0 weak topics** flagged across your completed evaluations!

* **Strong Topics (≥ 75% accuracy):** ${strongTopics.length > 0 ? strongTopics.map((s) => `**${s.topic}** (${s.percentage}%)`).join(', ') : 'None yet'}
* **Average Topics (50–74% accuracy):** ${averageTopics.length > 0 ? averageTopics.map((a) => `**${a.topic}** (${a.percentage}%)`).join(', ') : 'None yet'}

If you haven't taken all 4 diagnostic assessments yet (Aptitude, DSA, Technical, Communication), take the remaining tests in the **Assessments** tab to identify potential blind spots before campus drives start!`;
      }

      const list = weakTopics.map((wt, idx) => {
        return `**${idx + 1}. ${wt.topic} (${wt.category})**
* **Diagnostic Accuracy:** ${wt.percentage}% (${wt.correct}/${wt.total} correct)
* **Diagnosis:** ${wt.reason}
* **Recommended Next Action:** ${wt.recommendedAction}
* **Priority Status:** Elevated to Top Priority on your Roadmap.`;
      }).join('\n\n');

      return `### ⚠️ Identified Weak Areas & Skill Gaps (${weakTopics.length} detected)

Campus interviewers probe edge cases in these topics to eliminate candidates. Here are your prioritized focus areas:

${list}

**Action Plan:**
Go to your **Roadmap** page. These weak topics are pinned to the top as **Weak Area Priority** drills with curated reference formulas and practice links.`;
    }

    // -------------------------------------------------------------------------
    // 4. "Explain my roadmap."
    // -------------------------------------------------------------------------
    if (
      q.includes('explain my roadmap') || 
      q.includes('explain roadmap') || 
      q.includes('my roadmap') ||
      q.includes('how is my roadmap structured')
    ) {
      return `### 🗺️ Your Personalized Roadmap Architecture

Your preparation roadmap is specifically engineered for **${dept}** students in their **${year}**:

**1. Phase 1: Foundation & Analytical Skills (~67 hrs)**
* **Aptitude Mastery:** Time & Work, Speed & Distance, Percentages, and Syllogisms.
* **Language Proficiency:** ${student?.knownTechnologies?.[0] || 'Primary language'} OOP architecture, pointers, and memory model.
* *Weak topic drills are automatically pinned here for immediate remediation.*

**2. Phase 2: Core Data Structures & Algorithms (~75 hrs)**
* **Linear Structures:** Arrays, Strings, Two Pointers, and Sliding Window.
* **Non-Linear Structures:** Binary Search Trees, DFS/BFS Graph Traversals, and Monotonic Stacks.

**3. Phase 3: Domain Specialization & Capstone Project (~60 hrs)**
* **Technical CS Core:** DBMS ACID properties, SQL indexing, and OS Concurrency.
* **Capstone Build:** Production project focused on ${student?.preferredInterests?.[0] || 'Full Stack Web Development'}.

**4. Phase 4: Interview Readiness & Mock Rounds (~28 hrs)**
* **1-Page ATS Resume:** Quantified impact statements.
* **STAR Behavioral Method:** 5 structured narratives for HR and managerial rounds.
* **Live Coding Simulation:** Thinking aloud under timed constraints.

**Current Roadmap Status:** ${completedActivities.length} of ${roadmap.length} activities completed (${Math.round((completedActivities.length / Math.max(1, roadmap.length)) * 100)}%).`;
    }

    // -------------------------------------------------------------------------
    // 5. "How should I prepare for DSA?"
    // -------------------------------------------------------------------------
    if (
      q.includes('prepare for dsa') || 
      q.includes('dsa') || 
      q.includes('data structures') || 
      q.includes('coding round')
    ) {
      const dsaWeak = weakTopics.filter((w) => w.category === 'DSA');
      const weakNote = dsaWeak.length > 0 
        ? `\n⚠️ *Note from your diagnostics:* You had low accuracy in **${dsaWeak.map((w) => w.topic).join(', ')}**. Revisit standard patterns for these first.` 
        : '';

      return `### 💻 DSA Preparation Strategy for Campus Placements

To clear online coding assessments (OA) and technical rounds at companies like **${targetCompanies}**:
${weakNote}

**1. High-Frequency Pattern Blueprint (80/20 Rule):**
* **Arrays & Strings:** Two Pointers, Sliding Window, Prefix Sum (Kadane's Algorithm).
* **HashMaps & Sets:** Frequency counting, Subarray sum equals K.
* **Binary Search:** Search on answer space, first and last occurrence.
* **Trees & Graphs:** Level-order traversal (BFS), Tree depth & diameter (DFS), Cycle detection.
* **Dynamic Programming:** 0/1 Knapsack variations, Longest Common Subsequence (LCS).

**2. Daily Problem-Solving Schedule:**
* **Target:** 3 problems/day (2 Medium, 1 Easy or Hard).
* **Time limit:** Try for 25 minutes before reading hints. If stuck, study the pattern, not just the code.
* Always analyze both **Time Complexity O(N)** and **Space Complexity O(1)** out loud.

**3. Your Roadmap Milestones:**
Check Phase 2 in your Roadmap for curated LeetCode pattern checklists!`;
    }

    // -------------------------------------------------------------------------
    // 6. "How should I prepare for Aptitude?"
    // -------------------------------------------------------------------------
    if (
      q.includes('prepare for aptitude') || 
      q.includes('aptitude') || 
      q.includes('quant') || 
      q.includes('logical reasoning')
    ) {
      const aptWeak = weakTopics.filter((w) => w.category === 'Aptitude');
      const weakAptNote = aptWeak.length > 0 
        ? `\n🎯 **Immediate Focus from your Diagnostic:** Your assessment flagged **${aptWeak.map((w) => w.topic).join(', ')}** (<50% score). Prioritize these topics!` 
        : '';

      return `### 📐 Campus Aptitude Round Playbook
${weakAptNote}

Aptitude rounds eliminate over **60% of applicants** in campus drives. Prepare across all 3 sections:

**1. Quantitative Ability (High Yield):**
* **Arithmetic Core:** Time & Work, Speed Distance & Time, Percentages, Profit & Loss.
* **Modern Math:** Probability, Permutations & Combinations (P&C).
* *Rule:* Memorize fractional percentages (e.g., 1/7 ≈ 14.28%, 1/8 = 12.5%) for instant mental calculations.

**2. Logical Reasoning:**
* **Syllogisms:** Master Venn diagram deductions (All A are B, Some B are C).
* **Arrangements:** Linear & Circular seating arrangement templates.
* **Blood Relations & Direction Sense:** Draw tree diagrams immediately upon reading the prompt.

**3. Speed & Exam Strategy:**
* **Skip rule:** If an arithmetic question takes > 60 seconds without a clear path, flag it and move on.
* Take 1 full-length timed mock test (45 mins) every 3 days.`;
    }

    // -------------------------------------------------------------------------
    // 7. "How should I prepare for Technical interviews?"
    // -------------------------------------------------------------------------
    if (
      q.includes('technical interviews') || 
      q.includes('technical interview') || 
      q.includes('core cs') || 
      q.includes('tech round')
    ) {
      return `### ⚙️ Technical Interview Blueprint for ${dept} Engineering

Technical rounds evaluate your depth in core computer systems and problem-solving reasoning:

**1. Core CS Fundamentals (Crucial for ${dept}):**
* **DBMS & SQL:** ACID properties, Normalization (1NF to BCNF), Primary vs Foreign vs Unique keys, B+ Tree Indexing internals, and writing multi-table JOIN queries.
* **Operating Systems:** Process vs Thread, CPU scheduling algorithms, Deadlock conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait), and Virtual Memory Paging.
* **Computer Networks:** TCP 3-way handshake vs UDP, OSI model layers, What happens when you type a URL into a browser?
* **OOP Design:** Explain Polymorphism, Encapsulation, Abstraction, and Inheritance with real-world code examples.

**2. Technical Communication Protocol:**
* **Clarify Requirements:** Ask clarifying questions before coding (e.g., "Can the array contain negatives?").
* **Dry Run:** Trace your code with sample inputs and an edge-case (e.g., empty array or single element) before saying you are done.

**3. Projects Deep Dive:**
Be prepared to explain every line of code, architectural choice, and trade-off in your registered projects (${student?.preferredInterests?.[0] || 'Capstones'}).`;
    }

    // -------------------------------------------------------------------------
    // 8. "How should I prepare for Interviews?" (HR & Behavioral)
    // -------------------------------------------------------------------------
    if (
      q.includes('how should i prepare for interviews') || 
      q.includes('prepare for interviews') || 
      q.includes('hr interview') || 
      q.includes('behavioral') || 
      q.includes('mock interview')
    ) {
      return `### 🤝 HR & Behavioral Interview Preparation (STAR Framework)

HR rounds evaluate cultural fit, teamwork, and communication. Standardize your answers using the **STAR Method**:

**STAR Architecture:**
* **S - Situation:** Briefly set the context (company, project, semester).
* **T - Task:** What was your specific responsibility or problem?
* **A - Action:** What concrete technical/collaborative steps did YOU take?
* **R - Result:** Quantifiable outcome (e.g., "Delivered 2 days early and reduced load time by 30%").

**Prepare 5 Core Stories in Advance:**
1. **"Tell me about a challenging bug you fixed."** (Show systematic debugging and root-cause analysis).
2. **"Tell me about a time you had a conflict in a team project."** (Show maturity, listening, and consensus).
3. **"Describe a project you are proud of."** (Highlight ownership and technical choices).
4. **"What is your greatest weakness?"** (Name a real skill you are actively improving).
5. **"Why do you want to join our company?"** (Reference specific products or engineering blogs of ${targetCompanies}).`;
    }

    // -------------------------------------------------------------------------
    // 9. "How should I improve my Resume/Projects?"
    // -------------------------------------------------------------------------
    if (
      q.includes('resume') || 
      q.includes('projects') || 
      q.includes('improve my resume') || 
      q.includes('project ideas') || 
      q.includes('cv')
    ) {
      return `### 📄 High-Impact Resume & Project Strategy

For student targeting **${student?.targetRole || 'Software Development Engineer'}** at **${targetCompanies}**:

**1. The XYZ Resume Formula (Google Standard):**
Never write "Built a weather app using React". Instead write:
> *"Architected a responsive weather analytics application using React & OpenWeather API, reducing initial bundle size by 35% with dynamic code-splitting."*
* Every bullet point must have: **[Action Verb] + [What you built / optimized] + [Quantified Metric]**.

**2. Resume Checklist:**
* **Single page PDF:** Recruiters review each resume for only 6 seconds.
* **No skill rating bars:** Never write "Python: 4/5 stars" or "Java: 80%". Categorize by: Languages, Frameworks, Developer Tools, Databases.
* **Links:** Live deployed demo URL + public GitHub repository for every listed project.

**3. Recommended Projects for your domain (${student?.preferredInterests?.[0] || 'Full Stack'}):**
* **Full-Stack SaaS:** Authentication, relational database (PostgreSQL), RESTful API, background worker queue.
* **AI/ML Integration:** End-to-end model trained on real dataset, served via FastAPI with interactive frontend.`;
    }

    // -------------------------------------------------------------------------
    // Default contextual placement guidance
    // -------------------------------------------------------------------------
    return `### 🎓 Placement Advisory for ${name} (${dept} · ${year})

Thank you for your question! Here is personalized guidance based on your readiness status (**${score}% · ${level}**):

* **Top Priority Weak Topic:** ${weakTopics[0]?.topic ? `${weakTopics[0].topic} (${weakTopics[0].percentage}% accuracy)` : 'All current diagnostic topics tested at solid baseline'}
* **Next Roadmap Step:** "${nextActivity.title}" (~${nextActivity.estimatedHours} hrs)
* **Target Companies:** ${targetCompanies}

You can also ask me specifically about:
* *"What should I study next?"*
* *"Why is my readiness score low?"*
* *"What are my weak areas?"*
* *"Explain my roadmap."*
* *"How should I prepare for DSA / Aptitude / Technical interviews?"*
* *"How should I improve my Resume/Projects?"*`;
  }
};
