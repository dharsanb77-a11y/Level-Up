import { Assessment, AssessmentQuestion } from '../types';

export const APTITUDE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'apt-q1',
    topic: 'Percentages',
    question: 'If the price of a commodity increases by 25%, by what percentage must a household reduce its consumption so that the total expenditure remains unchanged?',
    options: ['15%', '20%', '25%', '33.33%'],
    correctAnswer: 1, // 20%
    explanation: 'Let initial price = 100, consumption = 100, total = 10000. New price = 125. Required new consumption = 10000 / 125 = 80. Reduction = (100 - 80) = 20%.'
  },
  {
    id: 'apt-q2',
    topic: 'Percentages',
    question: 'In a college campus drive, 60% of students passed the aptitude round, 45% passed coding, and 25% passed both. What percentage of students failed both rounds?',
    options: ['15%', '20%', '25%', '30%'],
    correctAnswer: 1, // 20%
    explanation: 'Using set union: P(A ∪ C) = P(A) + P(C) - P(A ∩ C) = 60 + 45 - 25 = 80%. Therefore, students who failed both = 100% - 80% = 20%.'
  },
  {
    id: 'apt-q3',
    topic: 'Time & Work',
    question: 'Worker A can complete a software task in 12 days, and Worker B can complete the same task in 18 days. If they work together for 4 days and then Worker A leaves, how many more days will B take to finish the remaining work?',
    options: ['6 days', '8 days', '10 days', '12 days'],
    correctAnswer: 1, // 8 days
    explanation: 'Work done per day: A = 1/12, B = 1/18. In 4 days together: 4 * (1/12 + 1/18) = 4 * (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9. Days for B to finish = (4/9) / (1/18) = (4/9) * 18 = 8 days.'
  },
  {
    id: 'apt-q4',
    topic: 'Time & Work',
    question: 'Pipes A and B can fill an overhead water cistern in 20 minutes and 30 minutes respectively, while pipe C can empty it in 15 minutes. If all three pipes are opened simultaneously, in how many minutes will the tank fill?',
    options: ['45 minutes', '60 minutes', '75 minutes', 'Tank will never fill'],
    correctAnswer: 1, // 60 minutes
    explanation: 'Net filling rate per minute = 1/20 + 1/30 - 1/15 = (3 + 2 - 4) / 60 = 1/60. Hence the cistern fills in 60 minutes.'
  },
  {
    id: 'apt-q5',
    topic: 'Probability',
    question: 'Two fair 6-sided dice are rolled simultaneously. What is the probability that the sum of the numbers rolled is a prime number?',
    options: ['5/12', '7/18', '15/36', '13/36'],
    correctAnswer: 0, // 5/12 (= 15/36)
    explanation: 'Total outcomes = 36. Possible prime sums are 2, 3, 5, 7, 11. Sum 2: (1,1) [1]; Sum 3: (1,2),(2,1) [2]; Sum 5: (1,4),(2,3),(3,2),(4,1) [4]; Sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) [6]; Sum 11: (5,6),(6,5) [2]. Total favorable = 1+2+4+6+2 = 15. Probability = 15/36 = 5/12.'
  },
  {
    id: 'apt-q6',
    topic: 'Probability',
    question: 'A box contains 5 red, 4 blue, and 3 green marbles. If 2 marbles are drawn at random without replacement, what is the probability that both marbles are blue?',
    options: ['1/11', '1/12', '2/11', '1/6'],
    correctAnswer: 0, // 1/11
    explanation: 'Total marbles = 12. P(First blue) = 4/12 = 1/3. P(Second blue | First blue) = 3/11. Combined probability = (4/12) * (3/11) = 12/132 = 1/11.'
  },
  {
    id: 'apt-q7',
    topic: 'Averages',
    question: 'The average weight of 24 engineering students in a lab batch is 58 kg. When the lab instructor is included, the average weight increases by 1 kg. What is the weight of the lab instructor?',
    options: ['78 kg', '81 kg', '83 kg', '85 kg'],
    correctAnswer: 2, // 83 kg
    explanation: 'Total weight of 24 students = 24 * 58 = 1392 kg. New average with 25 people = 59 kg. Total weight = 25 * 59 = 1475 kg. Instructor weight = 1475 - 1392 = 83 kg.'
  },
  {
    id: 'apt-q8',
    topic: 'Syllogisms',
    question: 'Statements: (1) All algorithms are logic. (2) Some logic is code. Conclusions: I. Some code is algorithms. II. Some logic is algorithms. Which conclusion logically follows?',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither follows'],
    correctAnswer: 1, // Only conclusion II follows
    explanation: 'Since "All algorithms are logic", by immediate conversion, "Some logic is algorithms" (Conclusion II) is universally valid. However, code cannot be definitively linked to algorithms without an overlapping premise, so Conclusion I is not necessarily true.'
  }
];

export const DSA_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'dsa-q1',
    topic: 'Arrays',
    question: 'What is the most optimal worst-case time and space complexity to find the maximum contiguous subarray sum (Kadane’s Algorithm)?',
    options: ['Time O(N), Space O(1)', 'Time O(N log N), Space O(N)', 'Time O(N^2), Space O(1)', 'Time O(N), Space O(N)'],
    correctAnswer: 0,
    explanation: 'Kadane’s algorithm iterates through the array once keeping running max and global max in scalar variables, yielding O(N) time and O(1) auxiliary space.'
  },
  {
    id: 'dsa-q2',
    topic: 'Arrays',
    question: 'Given an array of integers sorted in ascending order, which two-pointer technique finds two numbers that sum up to a target with O(1) extra space?',
    options: [
      'Fast and Slow pointers moving from index 0',
      'Left pointer at start and Right pointer at end, incrementing Left if sum < target, else decrementing Right',
      'Hash Table frequency map with two nested pointers',
      'Sliding window with variable expansion only'
    ],
    correctAnswer: 1,
    explanation: 'Because the array is sorted, comparing sum(arr[L], arr[R]) against target allows deterministic directional narrowing in O(N) time and O(1) space.'
  },
  {
    id: 'dsa-q3',
    topic: 'Strings',
    question: 'To check if string B is a valid permutation (anagram) of string A with lowercase English letters, which algorithm achieves O(N) time and O(1) space?',
    options: [
      'Sorting both strings with TimSort in O(N log N)',
      'Generating all substrings recursively',
      'Fixed-size 26-element integer frequency array comparing character counts',
      'Converting each character to ASCII product'
    ],
    correctAnswer: 2,
    explanation: 'A fixed 26-integer array counts character occurrences of A and decrements with B. Since alphabet size is bounded to 26, auxiliary space is O(1) and runtime is strictly O(N).'
  },
  {
    id: 'dsa-q4',
    topic: 'Linked Lists',
    question: 'In Floyd’s Cycle-Finding Algorithm (Tortoise and Hare), if a loop exists in a singly linked list with head pointer, which statement is strictly TRUE?',
    options: [
      'The fast pointer may skip over the slow pointer and never collide in even-length loops',
      'The fast and slow pointers are guaranteed to meet inside the cycle within O(N) steps',
      'A hash set of node values must be stored alongside pointer traversal',
      'Slow pointer must move 2 steps while fast moves 3 steps'
    ],
    correctAnswer: 1,
    explanation: 'Because the relative distance between slow (1 step) and fast (2 steps) reduces by exactly 1 in each iteration once inside the cycle, they are mathematically guaranteed to meet.'
  },
  {
    id: 'dsa-q5',
    topic: 'Linked Lists',
    question: 'What is the pointer operation order to insert a new node P between node A and node B (where A.next == B)?',
    options: [
      'A.next = P; P.next = B;',
      'P.next = A.next; A.next = P;',
      'P.next = B.next; A.next = P;',
      'A.next = P.next; P.next = B;'
    ],
    correctAnswer: 1,
    explanation: 'You must link P.next to A.next first to preserve access to the remaining linked list before changing A.next to point to P.'
  },
  {
    id: 'dsa-q6',
    topic: 'Trees',
    question: 'In a Binary Search Tree (BST), which tree traversal order produces node keys in strictly ascending sorted order?',
    options: ['Preorder (Root, Left, Right)', 'Inorder (Left, Root, Right)', 'Postorder (Left, Right, Root)', 'Level Order (BFS)'],
    correctAnswer: 1,
    explanation: 'By BST definition: Left < Root < Right. Therefore, Inorder traversal visits Left subtree first, then current node, then Right subtree, outputting sorted elements.'
  },
  {
    id: 'dsa-q7',
    topic: 'Trees',
    question: 'What is the worst-case time complexity of searching an element in an unbalance degenerate Binary Search Tree (skewed tree) of N nodes?',
    options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(1)'],
    correctAnswer: 1,
    explanation: 'A skewed BST degenerates into a singly linked list with height N, resulting in worst-case search complexity O(N).'
  },
  {
    id: 'dsa-q8',
    topic: 'Stacks & Queues',
    question: 'Which data structure is ideal for solving the "Next Greater Element to the right" problem in O(N) overall time complexity?',
    options: ['Monotonic Stack', 'Priority Queue (Min Heap)', 'Circular Doubly Linked Queue', 'Trie'],
    correctAnswer: 0,
    explanation: 'A monotonic decreasing stack keeps indices of elements waiting for a greater number. Each index is pushed and popped at most once, guaranteeing linear O(N) runtime.'
  }
];

export const TECHNICAL_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'tech-q1',
    topic: 'DBMS',
    question: 'Which ACID property guarantees that multiple concurrent transactions execute without interfering with one another, preventing dirty reads and phantom reads?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correctAnswer: 2,
    explanation: 'Isolation ensures concurrent execution of transactions leaves the database in the same state as if transactions were executed sequentially.'
  },
  {
    id: 'tech-q2',
    topic: 'DBMS',
    question: 'Why do relational database engines predominantly use B+ Trees rather than standard Binary Search Trees for disk-based table indexing?',
    options: [
      'B+ Trees require zero memory during index lookup',
      'High fan-out minimizes disk I/O operations, and leaf nodes are linked for efficient range scans',
      'Binary Search Trees do not support duplicate keys under any circumstance',
      'B+ Trees automatically encrypt data blocks before writing to secondary storage'
    ],
    correctAnswer: 1,
    explanation: 'B+ Trees have large branching factors (fan-out), keeping tree height low (typically 3-4 levels) which dramatically reduces costly disk seeks, and leaf chaining allows sequential range traversal.'
  },
  {
    id: 'tech-q3',
    topic: 'Operating Systems',
    question: 'Which of the following is NOT one of the four Coffman conditions necessary for a system deadlock to occur?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctAnswer: 2,
    explanation: 'The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlock cannot occur.'
  },
  {
    id: 'tech-q4',
    topic: 'Operating Systems',
    question: 'What occurs during "Thrashing" in an operating system virtual memory subsystem?',
    options: [
      'CPU registers overheat due to infinite while loops',
      'The system spends more time servicing page faults and swapping pages than executing user processes',
      'Disk sectors are physically damaged by rapid write heads',
      'Network sockets deadlock under excessive UDP packet storms'
    ],
    correctAnswer: 1,
    explanation: 'Thrashing happens when the total working sets of active processes exceed physical RAM, causing continuous page faults and heavy disk swapping that collapses CPU utilization.'
  },
  {
    id: 'tech-q5',
    topic: 'Python',
    question: 'In Python, what is the key behavioral difference between the "==" operator and the "is" keyword when comparing two objects?',
    options: [
      '"==" compares memory addresses (identity), while "is" compares values (equality)',
      '"==" compares values (equality), while "is" compares object identities in memory',
      '"is" only works for numeric integer types',
      'There is no difference in Python 3'
    ],
    correctAnswer: 1,
    explanation: '"==" checks if values of two objects are equal (invoking __eq__), whereas "is" checks whether both references point to the exact same memory address (id(a) == id(b)).'
  },
  {
    id: 'tech-q6',
    topic: 'SQL',
    question: 'Given two tables "Students" and "Placements", which SQL JOIN returns all students, including those who have not yet secured an offer in the Placements table?',
    options: ['INNER JOIN', 'LEFT OUTER JOIN', 'CROSS JOIN', 'RIGHT OUTER JOIN with Students on the right only'],
    correctAnswer: 1,
    explanation: 'A LEFT OUTER JOIN preserves all records from the left table (Students) and fills NULL for columns from the right table (Placements) where no match exists.'
  },
  {
    id: 'tech-q7',
    topic: 'OOP Concepts',
    question: 'In object-oriented programming, method overriding in derived classes at runtime is an example of which fundamental pillar?',
    options: ['Dynamic (Runtime) Polymorphism', 'Compile-time Encapsulation', 'Multiple Inheritance delegation', 'Data Abstraction hiding'],
    correctAnswer: 0,
    explanation: 'Method overriding allows a subclass to provide a specific implementation of a method defined in its superclass, resolved dynamically at runtime via virtual method tables.'
  },
  {
    id: 'tech-q8',
    topic: 'Computer Networks',
    question: 'Which layer of the OSI model is responsible for end-to-end reliability, segmentation, flow control, and port addressing (TCP/UDP)?',
    options: ['Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'Session Layer (Layer 5)', 'Data Link Layer (Layer 2)'],
    correctAnswer: 1,
    explanation: 'Transport layer (Layer 4) manages end-to-end communication, segmentation, flow control, and port numbers for host applications.'
  }
];

export const COMMUNICATION_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'comm-q1',
    topic: 'Grammar',
    question: 'Choose the grammatically correct sentence adhering to standard business English subject-verb agreement:',
    options: [
      'The committee have reached their decision after five hours of deliberation.',
      'Neither the project manager nor the software engineers was present at the scrum meeting.',
      'The committee has reached its decision after five hours of deliberation.',
      'A collection of technical papers were published yesterday.'
    ],
    correctAnswer: 2,
    explanation: 'In formal business English, collective nouns acting as a singular unit ("committee") take singular verbs ("has reached") and singular pronouns ("its").'
  },
  {
    id: 'comm-q2',
    topic: 'Grammar',
    question: 'Identify the sentence that correctly avoids a dangling modifier:',
    options: [
      'Walking into the interview room, the technical test seemed intimidating.',
      'Walking into the interview room, Arjun found the technical test intimidating.',
      'Having finished the code review, the bug was fixed by the intern.',
      'To pass the campus aptitude test, rigorous daily practice is needed by students.'
    ],
    correctAnswer: 1,
    explanation: 'The modifier "Walking into the interview room" must logically modify the subject that follows it ("Arjun"), not "the technical test".'
  },
  {
    id: 'comm-q3',
    topic: 'Reading Comprehension',
    question: 'Passage: "While microservices architecture offers autonomous team deployment and failure isolation, it introduces non-trivial operational overhead in distributed observability, eventual consistency management, and network serialization costs." What is the author’s primary message?',
    options: [
      'Microservices are universally superior to monolithic architecture for campus startups.',
      'Microservices offer distinct structural benefits but come with significant architectural trade-offs.',
      'Network serialization latency makes microservices unsuitable for modern engineering.',
      'Distributed systems should always avoid eventual consistency.'
    ],
    correctAnswer: 1,
    explanation: 'The author balances the benefits ("autonomous team deployment and failure isolation") with costs ("operational overhead, consistency management"), highlighting trade-offs.'
  },
  {
    id: 'comm-q4',
    topic: 'Vocabulary in Context',
    question: 'Select the word that best replaces the underlined term: "The engineering team worked tirelessly to _mitigate_ the latency spikes during peak admission hours."',
    options: ['exacerbate', 'alleviate / reduce', 'amplify', 'postpone'],
    correctAnswer: 1,
    explanation: '"Mitigate" means to make something less severe, painful, or serious; "alleviate / reduce" is the exact contextual synonym.'
  },
  {
    id: 'comm-q5',
    topic: 'Professional Email',
    question: 'When emailing a campus recruiter to request a rescheduling of your interview due to a conflicting university semester examination, which subject line is most appropriate?',
    options: [
      'Urgent: Need to change my interview time right now',
      'Interview Rescheduling Request - [Your Name] - [Roll Number] - Software Engineer Intern',
      'Exams happening tomorrow so cannot attend',
      'Hey HR team, reschedule please'
    ],
    correctAnswer: 1,
    explanation: 'A professional email subject line includes the purpose ("Interview Rescheduling Request"), candidate identification ("Name", "Roll Number"), and applied role.'
  },
  {
    id: 'comm-q6',
    topic: 'HR Interview STAR Method',
    question: 'In the STAR interview response framework, which element represents explaining the quantifiable measurable outcome achieved by your intervention?',
    options: ['Situation', 'Task', 'Action', 'Result'],
    correctAnswer: 3,
    explanation: 'In STAR (Situation, Task, Action, Result), the "Result" highlights the quantified outcome (e.g., "reduced latency by 35% and onboarded 500 users").'
  }
];

export const ALL_ASSESSMENTS: Assessment[] = [
  {
    id: 'as-aptitude',
    title: 'Quantitative & Logical Aptitude Diagnostic',
    type: 'Aptitude',
    durationMinutes: 20,
    questionsCount: APTITUDE_QUESTIONS.length,
    difficulty: 'Intermediate',
    status: 'available',
    description: 'Evaluate core quantitative aptitude, percentages, probability, time & work, and logical syllogisms asked in company screening rounds.',
    topics: ['Percentages', 'Time & Work', 'Probability', 'Averages', 'Syllogisms'],
    questions: APTITUDE_QUESTIONS
  },
  {
    id: 'as-dsa',
    title: 'Data Structures & Algorithms Diagnostic',
    type: 'DSA',
    durationMinutes: 25,
    questionsCount: DSA_QUESTIONS.length,
    difficulty: 'Intermediate',
    status: 'available',
    description: 'Diagnose algorithmic proficiency across Arrays, Two-Pointers, Strings, Linked Lists, Binary Search Trees, and Monotonic Stacks.',
    topics: ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Stacks & Queues'],
    questions: DSA_QUESTIONS
  },
  {
    id: 'as-technical',
    title: 'Core Technical & CS Fundamentals Diagnostic',
    type: 'Technical',
    durationMinutes: 20,
    questionsCount: TECHNICAL_QUESTIONS.length,
    difficulty: 'Intermediate',
    status: 'available',
    description: 'Comprehensive test covering DBMS ACID & indexing, Operating Systems paging & deadlock, Python/SQL, and OOP principles.',
    topics: ['DBMS', 'Operating Systems', 'Python', 'SQL', 'OOP Concepts', 'Computer Networks'],
    questions: TECHNICAL_QUESTIONS
  },
  {
    id: 'as-communication',
    title: 'Verbal & Professional Communication Diagnostic',
    type: 'Communication',
    durationMinutes: 15,
    questionsCount: COMMUNICATION_QUESTIONS.length,
    difficulty: 'Beginner',
    status: 'available',
    description: 'Assess business English grammar, reading comprehension inference, vocabulary precision, and professional interview etiquette.',
    topics: ['Grammar', 'Reading Comprehension', 'Vocabulary in Context', 'Professional Email', 'HR Interview STAR Method'],
    questions: COMMUNICATION_QUESTIONS
  }
];
