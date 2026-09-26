import { AssessmentQuestion } from '../types';

export interface OpenSourceReference {
  sourceName: string;
  license: string;
  sourceUrl?: string;
  attributionNote: string;
}

export interface TopicDocumentation {
  id: string;
  topicTitle: string;
  category: 'DSA' | 'Aptitude' | 'Technical' | 'Core Engineering' | 'Interview & Career';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTimeMinutes: number;
  openSourceReference: OpenSourceReference;
  overview: string;
  placementSignificance: string;
  keyConcepts: {
    heading: string;
    points: string[];
  }[];
  quickReferenceRules: {
    rule: string;
    detail: string;
  }[];
  codeExample?: {
    language: string;
    title: string;
    code: string;
    explanation: string;
  };
  interviewQuestions: {
    question: string;
    answer: string;
    askedByCompanies?: string[];
  }[];
  commonMistakes: string[];
  linkedAssessmentId: string;
  assessmentQuestions: AssessmentQuestion[];
}

export const TOPIC_DOCUMENTATION_DATABASE: Record<string, TopicDocumentation> = {
  // 1. Arrays & Two-Pointers
  'arrays': {
    id: 'arrays',
    topicTitle: 'Arrays, Two-Pointers & Sliding Window',
    category: 'DSA',
    difficulty: 'Beginner',
    readingTimeMinutes: 8,
    openSourceReference: {
      sourceName: 'OpenDSA Project & MIT OpenCourseWare (6.006)',
      license: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)',
      sourceUrl: 'https://opendsa-server.cs.vt.edu/',
      attributionNote: 'Sourced from OpenDSA Interactive Data Structures & Algorithms and MIT OCW 6.006 Lecture Notes.'
    },
    overview: 'Arrays are contiguous memory blocks representing the fundamental data structure in algorithmic problem solving. Two-pointer and sliding window techniques enable solving subarray and pairing problems in linear time O(n) instead of naive quadratic O(n^2).',
    placementSignificance: 'Asked in almost 100% of campus placement coding rounds by Amazon, Google, Microsoft, TCS Digital, and Cognizant.',
    keyConcepts: [
      {
        heading: 'Two-Pointer Technique (Opposite Ends)',
        points: [
          'Used primarily on sorted arrays for search or optimization problems like Two Sum II, 3Sum, and Trapping Rainwater.',
          'Start left at 0 and right at array.length - 1. Move left pointer rightward when the sum is too small, and right pointer leftward when the sum is too large.',
          'Reduces time complexity from O(n^2) brute force nested loops to single-pass O(n).'
        ]
      },
      {
        heading: 'Sliding Window (Fixed vs Dynamic Size)',
        points: [
          'Fixed Window: Used when subarray length K is given (e.g., maximum sum subarray of size K). Slide by subtracting outgoing element and adding incoming element in O(1).',
          'Dynamic Window: Used for condition-based subarrays (e.g., smallest subarray with sum >= S, longest substring without repeating characters). Expand right pointer, then shrink left pointer when condition is violated.'
        ]
      },
      {
        heading: 'Prefix Sum & Prefix Difference',
        points: [
          'Precompute prefixSum[i] = sum(arr[0]...arr[i-1]) in O(n) time.',
          'Any range sum query [L, R] can be answered in O(1) time as prefixSum[R+1] - prefixSum[L].'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'Index Lookup', detail: 'O(1) direct memory offset calculation' },
      { rule: 'Linear Search', detail: 'O(n) time, O(1) auxiliary space' },
      { rule: 'Binary Search (Sorted)', detail: 'O(log n) time, requires monotonic sorted order' },
      { rule: 'Insertion/Deletion at End', detail: 'O(1) amortized for dynamic arrays (ArrayList/vector)' },
      { rule: 'Insertion/Deletion at Middle', detail: 'O(n) due to shifting remaining elements' }
    ],
    codeExample: {
      language: 'java',
      title: 'Two-Pointer Pairing on Sorted Array (Target Sum)',
      code: `// Time: O(n), Space: O(1)
public static boolean hasPairWithSum(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left < right) {
        int currentSum = nums[left] + nums[right];
        if (currentSum == target) {
            return true; // Found matching pair
        } else if (currentSum < target) {
            left++; // Need a larger value, advance left pointer
        } else {
            right--; // Need a smaller value, decrement right pointer
        }
    }
    return false;
}`,
      explanation: 'Because the array is sorted, incrementing left increases the sum monotonically, while decrementing right decreases it. We examine each element at most once.'
    },
    interviewQuestions: [
      {
        question: 'Why does two-pointer only work reliably if the array is sorted?',
        answer: 'Sorted order guarantees monotonicity: advancing left always increases the sum and decrementing right always decreases the sum. Without sorting, we cannot know which pointer to move.',
        askedByCompanies: ['Amazon', 'Adobe', 'Cisco']
      },
      {
        question: 'What is the Dutch National Flag algorithm and its time/space complexity?',
        answer: 'It partitions an array of 0s, 1s, and 2s using three pointers (low, mid, high) in one pass: O(n) time and O(1) space, avoiding standard two-pass counting.',
        askedByCompanies: ['Microsoft', 'Goldman Sachs']
      }
    ],
    commonMistakes: [
      'Off-by-one errors when setting boundary conditions (while left < right vs while left <= right).',
      'Forgetting that integer arithmetic can overflow when summing large integers (use long or left + (right - left)/2 for midpoint).',
      'Modifying array size while iterating without adjusting indexing pointers.'
    ],
    linkedAssessmentId: 'as-dsa',
    assessmentQuestions: [
      {
        id: 'arr-test-1',
        topic: 'Arrays',
        question: 'What is the optimal time complexity of finding the maximum sum of any contiguous subarray in an array of N integers (Kadane\'s Algorithm)?',
        options: ['O(N^2)', 'O(N log N)', 'O(N)', 'O(1)'],
        correctAnswer: 2,
        explanation: 'Kadane\'s Algorithm scans the array once, keeping track of the current maximum ending here and the global maximum, running in O(N) time and O(1) space.'
      },
      {
        id: 'arr-test-2',
        topic: 'Two Pointers',
        question: 'In a sorted integer array of size N, what is the time complexity of finding two elements whose sum equals target using the two-pointer technique?',
        options: ['O(N^2)', 'O(N)', 'O(log N)', 'O(N log N)'],
        correctAnswer: 1,
        explanation: 'With two pointers starting at both ends of a sorted array, each step advances or decrements one pointer. Total steps cannot exceed N, achieving O(N) linear time.'
      },
      {
        id: 'arr-test-3',
        topic: 'Sliding Window',
        question: 'Which condition makes the sliding window technique applicable to find the longest substring with a given property?',
        options: [
          'The elements in the array must be sorted in descending order',
          'The window condition exhibits monotonicity (expanding right makes it more likely to satisfy/violate, shrinking left reverses it)',
          'The array cannot contain negative numbers or zeros under any circumstances',
          'The array size must be an exact power of two'
        ],
        correctAnswer: 1,
        explanation: 'Sliding window relies on monotonicity: expanding the right bound progresses towards or away from a threshold, and advancing the left pointer restores the invariant.'
      },
      {
        id: 'arr-test-4',
        topic: 'Prefix Sum',
        question: 'Given an array of size N, what is the query time to compute the sum of elements from index L to R after building a prefix sum array in O(N)?',
        options: ['O(N)', 'O(R - L)', 'O(log N)', 'O(1)'],
        correctAnswer: 3,
        explanation: 'Prefix sum array allows any range sum [L, R] to be evaluated in O(1) via prefixSum[R + 1] - prefixSum[L].'
      },
      {
        id: 'arr-test-5',
        topic: 'Array Invariants',
        question: 'What is the space complexity of the Dutch National Flag (3-way partition) algorithm for sorting an array of 0s, 1s, and 2s?',
        options: ['O(1) auxiliary space', 'O(N) auxiliary space', 'O(log N) stack space', 'O(N^2) space'],
        correctAnswer: 0,
        explanation: 'The Dutch National Flag algorithm partitions the array in-place using three pointers (low, mid, high), requiring strictly O(1) auxiliary space.'
      }
    ]
  },

  // 2. Linked Lists
  'linked lists': {
    id: 'linked lists',
    topicTitle: 'Linked Lists & Fast-Slow Pointer Strategies',
    category: 'DSA',
    difficulty: 'Intermediate',
    readingTimeMinutes: 7,
    openSourceReference: {
      sourceName: 'OpenDSA Data Structures & Stanford CS Education Library',
      license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      sourceUrl: 'http://cslibrary.stanford.edu/105/LinkedListProblems.pdf',
      attributionNote: 'Derived from Stanford CS Library "Linked List Problems" and OpenDSA open algorithms textbook.'
    },
    overview: 'Linked lists are non-contiguous linear collections linked by pointers. Fast-and-slow pointer (Floyd’s Cycle Finding) is the hallmark technique for cycle detection, midpoint discovery, and palindrome validation.',
    placementSignificance: 'Heavily tested in online tests and technical interview rounds by Microsoft, Infosys Springboard, Wipro, and TCS Digital.',
    keyConcepts: [
      {
        heading: 'Floyd\'s Tortoise & Hare Algorithm',
        points: [
          'Slow pointer moves 1 step per iteration, fast pointer moves 2 steps.',
          'If a cycle exists, fast pointer will inevitably lap slow pointer inside the loop.',
          'To find cycle entry: when slow and fast meet, reset slow to head. Move both 1 step at a time; their collision point is the cycle start.'
        ]
      },
      {
        heading: 'In-Place List Reversal',
        points: [
          'Maintain three pointers: prev = null, curr = head, next = null.',
          'Iterate: next = curr.next; curr.next = prev; prev = curr; curr = next.',
          'Achieves in-place reversal in O(n) time and O(1) memory without creating new nodes.'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'Cycle Detection', detail: 'O(n) time, O(1) memory via 2-pointer' },
      { rule: 'Middle Element', detail: 'Slow pointer reaches middle when Fast reaches null' },
      { rule: 'Insert at Head', detail: 'O(1) time' },
      { rule: 'Search Element', detail: 'O(n) time traversal required' }
    ],
    codeExample: {
      language: 'cpp',
      title: 'Detect Cycle and Find Loop Starting Node',
      code: `ListNode *detectCycle(ListNode *head) {
    if (!head || !head->next) return nullptr;
    ListNode *slow = head, *fast = head;
    
    // Step 1: Detect cycle
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            // Cycle detected! Step 2: Find entrance
            ListNode *entry = head;
            while (entry != slow) {
                entry = entry->next;
                slow = slow->next;
            }
            return entry;
        }
    }
    return nullptr; // No cycle
}`,
      explanation: 'Mathematical proof: distance from head to loop start equals distance from meeting point to loop start modulo loop length.'
    },
    interviewQuestions: [
      {
        question: 'How do you check if a singly linked list is a palindrome in O(1) extra space?',
        answer: 'Find the middle using fast & slow pointers, reverse the second half in-place, compare the two halves node-by-node, and optionally restore the second half.',
        askedByCompanies: ['Amazon', 'Flipkart', 'Oracle']
      }
    ],
    commonMistakes: [
      'Null pointer dereferencing when checking fast->next->next before verifying fast and fast->next.',
      'Losing head references during in-place pointer manipulation without a dummy head node.'
    ],
    linkedAssessmentId: 'as-dsa',
    assessmentQuestions: [
      {
        id: 'll-test-1',
        topic: 'Linked Lists',
        question: 'In Floyd\'s cycle detection algorithm on a linked list, what are the movement speeds of the slow and fast pointers per step?',
        options: ['Slow = 1 node, Fast = 2 nodes', 'Slow = 2 nodes, Fast = 3 nodes', 'Slow = 1 node, Fast = 3 nodes', 'Both move at the same speed of 1 node'],
        correctAnswer: 0,
        explanation: 'Floyd\'s algorithm moves the slow pointer 1 node per step and the fast pointer 2 nodes per step. If a loop exists, the distance between them decreases by 1 on each step.'
      },
      {
        id: 'll-test-2',
        topic: 'Linked Lists',
        question: 'What is the auxiliary space complexity required to reverse a singly linked list in-place iteratively?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
        correctAnswer: 2,
        explanation: 'Iterative reversal only requires three pointer variables (prev, curr, next), operating in O(1) auxiliary space.'
      },
      {
        id: 'll-test-3',
        topic: 'Linked Lists',
        question: 'Why is a dummy head node commonly introduced in linked list manipulation problems (such as merging two sorted lists)?',
        options: [
          'It reduces time complexity from O(N) to O(1)',
          'It eliminates edge cases where the head of the resulting list changes or is initially empty',
          'It automatically balances the linked list like an AVL tree',
          'It converts singly linked list nodes into doubly linked nodes'
        ],
        correctAnswer: 1,
        explanation: 'A dummy head eliminates special-case checks for inserting at the head node and returning the head of the modified list.'
      },
      {
        id: 'll-test-4',
        topic: 'Linked Lists',
        question: 'What is the time complexity to find the K-th node from the end of a singly linked list of N nodes in a single pass?',
        options: ['O(N)', 'O(N^2)', 'O(K log N)', 'O(1)'],
        correctAnswer: 0,
        explanation: 'Using two pointers separated by K steps, we reach the end in one pass of N steps, taking O(N) time and O(1) space.'
      }
    ]
  },

  // 3. Stacks & Queues
  'stacks & queues': {
    id: 'stacks & queues',
    topicTitle: 'Stacks, Queues & Monotonic Sequences',
    category: 'DSA',
    difficulty: 'Intermediate',
    readingTimeMinutes: 7,
    openSourceReference: {
      sourceName: 'MIT OpenCourseWare (6.006) & GeeksforGeeks Open Archive',
      license: 'Creative Commons Attribution-ShareAlike (CC BY-SA)',
      sourceUrl: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
      attributionNote: 'Synthesized from MIT OCW 6.006 Lecture 3 (Data Structures) and Open Algorithms Compendium.'
    },
    overview: 'Stacks (LIFO) and Queues (FIFO) underpin recursion, evaluation of postfix expressions, breadth-first search, and sliding window maximums. Monotonic stacks solve Next Greater Element in O(n).',
    placementSignificance: 'A favorite topic of campus recruitment rounds for testing attention to edge cases and monotonic data structures.',
    keyConcepts: [
      {
        heading: 'Monotonic Stack (Next Greater Element)',
        points: [
          'Stack maintains elements in strictly increasing or decreasing order.',
          'When a new element arrives, pop smaller elements from the stack until invariant is restored.',
          'Each element is pushed and popped at most once, leading to an overall O(n) amortized complexity.'
        ]
      },
      {
        heading: 'Queue via Stacks & BFS Traversal',
        points: [
          'Two stacks (inputStack, outputStack) can simulate a FIFO queue with O(1) amortized enqueue and dequeue.',
          'Standard queues drive Breadth-First Search (BFS) graph and tree level-order algorithms.'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'Push / Pop / Peek', detail: 'O(1) time strictly' },
      { rule: 'Valid Parentheses', detail: 'Stack matching with O(n) time and O(n) space' },
      { rule: 'Next Greater Element', detail: 'O(n) time using Monotonic Stack' }
    ],
    codeExample: {
      language: 'python',
      title: 'Next Greater Element using Monotonic Decreasing Stack',
      code: `def next_greater_element(nums):
    result = [-1] * len(nums)
    stack = [] # Stores indices
    
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            idx = stack.pop()
            result[idx] = num
        stack.append(i)
        
    return result`,
      explanation: 'Every element that was waiting in the stack is resolved the moment a strictly larger number appears.'
    },
    interviewQuestions: [
      {
        question: 'How do you design a Min Stack that retrieves the minimum element in O(1) time?',
        answer: 'Maintain a secondary stack that tracks the minimum so far, or push pairs (value, currentMin) onto a single stack.',
        askedByCompanies: ['Microsoft', 'Samsung', 'Paytm']
      }
    ],
    commonMistakes: [
      'Popping from an empty stack without checking isEmpty().',
      'Storing values instead of indices in monotonic stack when duplicate values or distance queries are involved.'
    ],
    linkedAssessmentId: 'as-dsa',
    assessmentQuestions: [
      {
        id: 'sq-test-1',
        topic: 'Stacks',
        question: 'What is the amortized time complexity of implementing a Queue using two Stacks?',
        options: ['O(1) per operation', 'O(N) per operation', 'O(log N)', 'O(N^2)'],
        correctAnswer: 0,
        explanation: 'Each element is pushed to the input stack once, transferred to the output stack once, and popped once. Amortized cost across N operations is O(1).'
      },
      {
        id: 'sq-test-2',
        topic: 'Monotonic Stack',
        question: 'For an array of size N, what is the total number of push and pop operations performed on a monotonic stack when finding the Next Greater Element for all items?',
        options: ['At most 2N operations, running in O(N) time', 'N^2 operations, running in O(N^2) time', 'N log N operations', 'Indefinite number of operations'],
        correctAnswer: 0,
        explanation: 'Each array index is pushed to the stack exactly once and popped at most once, bounding the total operations to at most 2N (linear O(N)).'
      },
      {
        id: 'sq-test-3',
        topic: 'Stacks',
        question: 'Which data structure is fundamentally utilized by compilers for parsing balanced parentheses and evaluating arithmetic expressions (Infix to Postfix)?',
        options: ['Stack', 'Queue', 'Hash Table', 'Disjoint Set (Union-Find)'],
        correctAnswer: 0,
        explanation: 'Stacks follow Last-In-First-Out (LIFO), which maps directly to nested syntactic structures, scopes, and operator precedence rules.'
      }
    ]
  },

  // 4. Binary Trees & BST
  'trees': {
    id: 'trees',
    topicTitle: 'Binary Trees, BSTs & Hierarchical Traversal',
    category: 'DSA',
    difficulty: 'Intermediate',
    readingTimeMinutes: 9,
    openSourceReference: {
      sourceName: 'OpenDSA & NIST Data Structure Compendium',
      license: 'Public Domain / Creative Commons (CC0 / CC BY 4.0)',
      sourceUrl: 'https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/BinaryTree.html',
      attributionNote: 'Adapted from OpenDSA Computer Science Interactive Chapter on Binary Trees & Traversal Properties.'
    },
    overview: 'Binary Trees and Binary Search Trees (BST) model hierarchical data. Mastery over recursive traversals (Inorder, Preorder, Postorder) and iterative Level Order (BFS) is non-negotiable for software engineering drives.',
    placementSignificance: 'Featured in >80% of technical interview rounds at tier-1 and tier-2 placement drives.',
    keyConcepts: [
      {
        heading: 'Inorder Traversal of BST',
        points: [
          'Inorder traversal (Left -> Root -> Right) of a valid BST always yields strictly sorted values in ascending order.',
          'Used to validate BST property, find K-th smallest element in O(k) time, and recover swapped nodes.'
        ]
      },
      {
        heading: 'Lowest Common Ancestor (LCA)',
        points: [
          'For BST: If both p and q are less than root, search left; if both are greater, search right; otherwise root is LCA.',
          'For Binary Tree: Use bottom-up recursion. If left and right subtrees both return non-null, current node is LCA.'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'BST Search / Insert / Delete', detail: 'O(h) where h is tree height; O(log n) balanced, O(n) skewed' },
      { rule: 'Tree Height', detail: 'Max depth = 1 + max(height(left), height(right))' },
      { rule: 'Full vs Complete vs Perfect', detail: 'Complete trees are packed from left to right, ideal for heaps' }
    ],
    codeExample: {
      language: 'javascript',
      title: 'Lowest Common Ancestor in Binary Tree',
      code: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) return root; // p and q are in opposite subtrees
  return left || right; // Return non-null node
}`,
      explanation: 'Bottom-up divide and conquer: visits every node once in O(n) time and O(h) recursion stack space.'
    },
    interviewQuestions: [
      {
        question: 'What is the difference between a Binary Search Tree and a Binary Heap?',
        answer: 'A BST enforces total ordering (left < root < right) enabling O(log n) search. A Heap only enforces heap-order property (parent <= children or parent >= children) and is always a complete binary tree, optimized for O(1) find-min/max.',
        askedByCompanies: ['Google', 'Amazon', 'Atlassian']
      }
    ],
    commonMistakes: [
      'Assuming that checking left.val < root.val and right.val > root.val is sufficient for BST validation (must propagate valid range [min, max] down the tree).',
      'Neglecting stack overflow on heavily skewed trees.'
    ],
    linkedAssessmentId: 'as-dsa',
    assessmentQuestions: [
      {
        id: 'tree-test-1',
        topic: 'Binary Search Tree',
        question: 'Which tree traversal produces the values of a Binary Search Tree in ascending sorted order?',
        options: ['Preorder Traversal', 'Inorder Traversal', 'Postorder Traversal', 'Level Order Traversal'],
        correctAnswer: 1,
        explanation: 'Inorder traversal visits left subtree, root, and right subtree. Because BST property enforces left < root < right, Inorder produces sorted sequence.'
      },
      {
        id: 'tree-test-2',
        topic: 'Binary Trees',
        question: 'What is the maximum number of nodes in a binary tree of height H (where a single root node has height 1)?',
        options: ['2^H - 1', '2^(H - 1)', '2^(H + 1)', 'H^2'],
        correctAnswer: 0,
        explanation: 'Summing nodes level-by-level: 2^0 + 2^1 + ... + 2^(H-1) = 2^H - 1.'
      },
      {
        id: 'tree-test-3',
        topic: 'Binary Trees',
        question: 'What is the worst-case time complexity of searching an element in an unbalanced Binary Search Tree of N nodes?',
        options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
        correctAnswer: 1,
        explanation: 'If the BST is skewed (e.g., degenerate linked-list structure resulting from inserting sorted inputs), search degenerates to O(N).'
      }
    ]
  },

  // 5. Quantitative Aptitude - Percentages
  'percentages': {
    id: 'percentages',
    topicTitle: 'Quantitative Aptitude: Percentages & Expenditure',
    category: 'Aptitude',
    difficulty: 'Beginner',
    readingTimeMinutes: 6,
    openSourceReference: {
      sourceName: 'Open Quantitative Education Project & Khan Academy Open Content',
      license: 'Creative Commons Attribution-NonCommercial-ShareAlike 3.0 (CC BY-NC-SA 3.0)',
      sourceUrl: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:rational-exponents',
      attributionNote: 'Derived from Open Quantitative & Arithmetic curriculum for placement aptitude preparation.'
    },
    overview: 'Percentages are the bedrock of campus aptitude tests, governing profit & loss, discount structures, data interpretation charts, and expenditure calculations.',
    placementSignificance: 'Mandatory section in campus screening drives for TCS NQT, Infosys, Capgemini, Accenture, and Cognizant.',
    keyConcepts: [
      {
        heading: 'Expenditure Compensation Rule',
        points: [
          'Expenditure = Price * Consumption.',
          'If Price increases by x% = (x/100) = (a/b), Consumption must decrease by a / (a + b) to keep expenditure constant.',
          'Example: Price rises by 25% (1/4). Consumption must decrease by 1 / (1 + 4) = 1/5 = 20%.'
        ]
      },
      {
        heading: 'Successive Percentage Changes',
        points: [
          'Net change for consecutive changes of a% and b% = [a + b + (ab / 100)]%.',
          'Use positive for increase and negative for discount/decrease.'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'Fraction 1/6', detail: '16.66%' },
      { rule: 'Fraction 1/7', detail: '14.28%' },
      { rule: 'Fraction 1/8', detail: '12.5%' },
      { rule: 'Fraction 1/12', detail: '8.33%' }
    ],
    interviewQuestions: [
      {
        question: 'If A is 20% more than B, by what percentage is B less than A?',
        answer: 'B = 100, A = 120. B is less than A by 20/120 = 1/6 = 16.67%.',
        askedByCompanies: ['TCS', 'Accenture', 'Wipro']
      }
    ],
    commonMistakes: [
      'Confusing percentage points with percentage change.',
      'Applying successive discounts by simply adding percentages directly.'
    ],
    linkedAssessmentId: 'as-aptitude',
    assessmentQuestions: [
      {
        id: 'pct-test-1',
        topic: 'Percentages',
        question: 'If the price of petrol increases by 25%, by what percentage must a car owner reduce fuel consumption to keep the total expenditure unchanged?',
        options: ['15%', '20%', '25%', '33.33%'],
        correctAnswer: 1,
        explanation: 'Formula: [R / (100 + R)] * 100. For R = 25%: [25 / 125] * 100 = 1/5 * 100 = 20%.'
      },
      {
        id: 'pct-test-2',
        topic: 'Percentages',
        question: 'Two successive discounts of 20% and 10% on a laptop are equivalent to a single net discount of:',
        options: ['30%', '28%', '25%', '22%'],
        correctAnswer: 1,
        explanation: 'Net change = a + b - (ab/100) = 20 + 10 - (200/100) = 30 - 2 = 28%.'
      },
      {
        id: 'pct-test-3',
        topic: 'Percentages',
        question: 'In a college batch of 120 students, 60% passed Aptitude, 45% passed Coding, and 25% passed both. How many students failed both exams?',
        options: ['18 students', '24 students', '30 students', '36 students'],
        correctAnswer: 1,
        explanation: 'Union % = 60 + 45 - 25 = 80%. Failed both % = 100 - 80 = 20%. Total failed = 20% of 120 = 24 students.'
      }
    ]
  },

  // 6. Time & Work
  'time & work': {
    id: 'time & work',
    topicTitle: 'Time, Work & Pipes/Cisterns',
    category: 'Aptitude',
    difficulty: 'Intermediate',
    readingTimeMinutes: 6,
    openSourceReference: {
      sourceName: 'Open Arithmetic & Work Rate Mathematical Compendium',
      license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      sourceUrl: 'https://en.wikibooks.org/wiki/Arithmetic/Rate',
      attributionNote: 'Open Educational Resource (OER) on Inverse Proportionality & Work-Rate Systems.'
    },
    overview: 'Time and Work questions rely on inverse proportionality and LCM methods to compute combined productivity rates and cistern emptying velocities.',
    placementSignificance: 'Frequently tested in online screening rounds by tech conglomerates and core engineering service recruiters.',
    keyConcepts: [
      {
        heading: 'The LCM Total Work Method',
        points: [
          'Assume Total Work = LCM of given individual time durations.',
          'Efficiency (Units/Day) = Total Work / Individual Days.',
          'Combined Days = Total Work / Sum of Efficiencies.'
        ]
      },
      {
        heading: 'Pipes and Cisterns Inlets vs Outlets',
        points: [
          'Inlet pipes perform positive work (+rate).',
          'Drain/Leak pipes perform negative work (-rate).'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'Two Workers Together', detail: '(A * B) / (A + B) days' },
      { rule: 'Efficiency & Time', detail: 'Efficiency is inversely proportional to time taken' }
    ],
    interviewQuestions: [
      {
        question: 'A can do a piece of work in 10 days, B in 15 days. Working together, in how many days will it finish?',
        answer: 'Total work = LCM(10, 15) = 30 units. A = 3 units/day, B = 2 units/day. Combined = 5 units/day. Days = 30 / 5 = 6 days.',
        askedByCompanies: ['Capgemini', 'Infosys', 'L&T']
      }
    ],
    commonMistakes: [
      'Adding time values directly instead of reciprocal rates or unit efficiencies.'
    ],
    linkedAssessmentId: 'as-aptitude',
    assessmentQuestions: [
      {
        id: 'tw-test-1',
        topic: 'Time & Work',
        question: 'Worker A can build a project module in 12 days and Worker B can build it in 18 days. If they work together for 4 days, what fraction of work remains to be finished?',
        options: ['5/9', '4/9', '1/3', '2/5'],
        correctAnswer: 1,
        explanation: 'Work done per day = 1/12 + 1/18 = 5/36. In 4 days = 4 * 5/36 = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9.'
      },
      {
        id: 'tw-test-2',
        topic: 'Pipes & Cisterns',
        question: 'Pipe A fills a reservoir in 20 minutes, Pipe B in 30 minutes, and Drain Pipe C empties it in 15 minutes. If all three operate together, the tank fills in:',
        options: ['45 minutes', '60 minutes', '75 minutes', 'Tank overflows in 30 minutes'],
        correctAnswer: 1,
        explanation: 'Net rate = 1/20 + 1/30 - 1/15 = (3 + 2 - 4) / 60 = 1/60 per minute. Tank fills in 60 minutes.'
      }
    ]
  },

  // 7. DBMS & SQL
  'dbms': {
    id: 'dbms',
    topicTitle: 'Database Management Systems, ACID & Indexing',
    category: 'Technical',
    difficulty: 'Intermediate',
    readingTimeMinutes: 8,
    openSourceReference: {
      sourceName: 'PostgreSQL & SQLite Open Architecture Docs / MIT OCW 6.830',
      license: 'PostgreSQL License & Creative Commons Attribution (CC BY 3.0)',
      sourceUrl: 'https://www.postgresql.org/docs/',
      attributionNote: 'Grounded in PostgreSQL open documentation and MIT OpenCourseWare 6.830 Database Systems.'
    },
    overview: 'DBMS principles govern reliable data storage, transactional integrity, relational algebra, and high-performance querying using B+ Tree indexes.',
    placementSignificance: 'A cornerstone topic in tech interviews at Amazon, Oracle, Microsoft, and fintech companies.',
    keyConcepts: [
      {
        heading: 'ACID Properties of Transactions',
        points: [
          'Atomicity: All operations in a transaction succeed, or the entire transaction rolls back completely (All-or-Nothing).',
          'Consistency: Database transitions strictly between valid schema states without violating constraints.',
          'Isolation: Concurrent transactions execute independently without interference (Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).',
          'Durability: Once committed, updates survive system crashes, logged to write-ahead logs (WAL).'
        ]
      },
      {
        heading: 'B+ Tree Indexing & Clustering',
        points: [
          'B+ Trees store all actual record pointers in leaf nodes connected as a doubly linked list, optimizing range queries.',
          'Clustered Index determines physical storage order of data rows on disk (only one clustered index per table).'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: '1NF', detail: 'Atomic values, no repeating groups' },
      { rule: '2NF', detail: '1NF + No partial dependencies on composite primary key' },
      { rule: '3NF', detail: '2NF + No transitive dependencies on non-key attributes' },
      { rule: 'BCNF', detail: 'For every functional dependency X -> Y, X must be a super key' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between DELETE, TRUNCATE, and DROP in SQL?',
        answer: 'DELETE is DML (logged row-by-row, triggers fire, rollback possible, supports WHERE clause). TRUNCATE is DDL (deallocates pages quickly, resets identity, cannot filter). DROP is DDL (removes table structure and definition completely).',
        askedByCompanies: ['Oracle', 'Amazon', 'Deloitte']
      }
    ],
    commonMistakes: [
      'Creating redundant indexes on low-cardinality columns like boolean flags.',
      'Assuming MySQL UNIQUE allows only one NULL (SQL standards allow multiple NULL values in UNIQUE columns).'
    ],
    linkedAssessmentId: 'as-technical',
    assessmentQuestions: [
      {
        id: 'db-test-1',
        topic: 'DBMS ACID',
        question: 'Which ACID property guarantees that once a database transaction commits, its modifications are permanently recorded even in the event of an abrupt power outage?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctAnswer: 3,
        explanation: 'Durability ensures committed modifications survive system crashes or power failures via Write-Ahead Logging (WAL) and non-volatile storage flushing.'
      },
      {
        id: 'db-test-2',
        topic: 'DBMS Indexing',
        question: 'Why are B+ Trees favored over standard Binary Search Trees or B Trees for on-disk relational database indexing?',
        options: [
          'B+ Trees require zero memory during operations',
          'All leaf nodes are at the same depth and connected sequentially as a linked list, dramatically speeding up range scans with fewer disk I/O operations',
          'B+ Trees only support string data types',
          'B+ Trees avoid any logarithmic lookup overhead'
        ],
        correctAnswer: 1,
        explanation: 'B+ Trees store internal nodes strictly as search keys with high branching factor (minimizing disk seeks) and connect leaf nodes for O(1) sequential range scans.'
      },
      {
        id: 'db-test-3',
        topic: 'SQL',
        question: 'What is the structural difference between SQL DELETE and TRUNCATE commands?',
        options: [
          'DELETE is DDL while TRUNCATE is DML',
          'DELETE deletes the schema definition while TRUNCATE preserves the table name',
          'DELETE is DML (row-by-row logging with WHERE support), while TRUNCATE is DDL (page deallocation, cannot have a WHERE clause)',
          'There is no functional or performance difference'
        ],
        correctAnswer: 2,
        explanation: 'DELETE is a DML statement supporting WHERE filters and row triggers; TRUNCATE is a DDL operation that deallocates entire data pages and resets identities.'
      }
    ]
  },

  // 8. Operating Systems
  'operating systems': {
    id: 'operating systems',
    topicTitle: 'Operating Systems: Processes, Threads & Deadlocks',
    category: 'Technical',
    difficulty: 'Intermediate',
    readingTimeMinutes: 8,
    openSourceReference: {
      sourceName: 'The Linux Documentation Project (TLDP) & OSTEP Open Textbook',
      license: 'GNU Free Documentation License & Creative Commons (CC BY-NC-ND 3.0)',
      sourceUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
      attributionNote: 'Sourced from "Operating Systems: Three Easy Pieces" (Remzi H. Arpaci-Dusseau) and Linux Kernel Open Documentation.'
    },
    overview: 'Operating Systems manage CPU scheduling, memory management (virtual memory, page replacement), process synchronization, and inter-process communication.',
    placementSignificance: 'Core CS interview question driver for product companies and systems engineering recruiters.',
    keyConcepts: [
      {
        heading: 'Process vs Thread',
        points: [
          'A process is an executing program instance with its own independent address space (Heap, Stack, Data, Code).',
          'Threads are lightweight units of execution within a process that share the process memory (Heap and Code) but possess private Program Counters and Stacks.',
          'Context switching between threads is significantly faster than between processes due to shared TLB and cache.'
        ]
      },
      {
        heading: 'Coffman\'s 4 Necessary Conditions for Deadlock',
        points: [
          '1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.',
          '2. Hold and Wait: A process holds resources while requesting additional resources.',
          '3. No Preemption: Resources cannot be forcibly revoked; held until voluntary release.',
          '4. Circular Wait: A closed chain of processes exists where each holds a resource requested by the next.'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'Virtual Memory', detail: 'Paging maps logical addresses to physical frames using Page Table' },
      { rule: 'Thrashing', detail: 'Occurs when high page fault rate leads to CPU spending more time swapping than executing' },
      { rule: 'Banker\'s Algorithm', detail: 'Used for deadlock avoidance by verifying safe states' }
    ],
    interviewQuestions: [
      {
        question: 'What is a Race Condition and how can it be prevented?',
        answer: 'A race condition occurs when multiple threads concurrently access and mutate shared data where the outcome depends on execution timing. Prevented via Mutex locks, Semaphores, or atomic operations.',
        askedByCompanies: ['Qualcomm', 'Intel', 'Samsung']
      }
    ],
    commonMistakes: [
      'Confusing Deadlock (threads blocked forever) with Starvation (a thread is continually denied access due to priority inversion).'
    ],
    linkedAssessmentId: 'as-technical',
    assessmentQuestions: [
      {
        id: 'os-test-1',
        topic: 'Operating Systems',
        question: 'Which of the following is NOT one of Coffman\'s four necessary conditions for a system deadlock to occur?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Resource Preemption by High-Priority Processes', 'Circular Wait'],
        correctAnswer: 2,
        explanation: 'The condition is "No Preemption" (resources cannot be forcibly taken away). If preemption is allowed, deadlocks cannot occur.'
      },
      {
        id: 'os-test-2',
        topic: 'Operating Systems',
        question: 'What memory phenomenon occurs when excessive page faults lead to the operating system spending virtually all CPU time swapping pages in and out of secondary storage?',
        options: ['Segmentation Fault', 'Thrashing', 'Memory Fragmentation', 'Spooling'],
        correctAnswer: 1,
        explanation: 'Thrashing happens when the total working set of active processes exceeds physical memory, causing endless page replacement I/O.'
      },
      {
        id: 'os-test-3',
        topic: 'Operating Systems',
        question: 'Which memory segments are typically shared among threads belonging to the same process?',
        options: ['Program Counter and Stack', 'CPU Registers and Thread Local Storage', 'Heap and Code (Text) Segments', 'Kernel Stack and Signal Masks'],
        correctAnswer: 2,
        explanation: 'Threads within the same process share the process address space including the Heap, Global Data, and Code segments, while maintaining independent Stacks and Program Counters.'
      }
    ]
  },

  // 9. Object Oriented Programming (OOP)
  'oop principles': {
    id: 'oop principles',
    topicTitle: 'Object-Oriented Design, SOLID Principles & Design Patterns',
    category: 'Technical',
    difficulty: 'Intermediate',
    readingTimeMinutes: 8,
    openSourceReference: {
      sourceName: 'Open Web Application Security Project (OWASP) & Software Engineering Open Curriculum',
      license: 'Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)',
      sourceUrl: 'https://en.wikipedia.org/wiki/SOLID',
      attributionNote: 'Curated from open software architecture compendiums and design pattern repositories.'
    },
    overview: 'Object-Oriented Programming models real-world business domains using encapsulation, inheritance, polymorphism, and abstraction. Mastering SOLID principles separates entry-level coders from production engineers.',
    placementSignificance: 'Asked in almost every campus technical round for Java, C++, Python, and C# developer roles.',
    keyConcepts: [
      {
        heading: 'The SOLID Principles',
        points: [
          'S - Single Responsibility: A class should have only one reason to change.',
          'O - Open/Closed: Software entities should be open for extension but closed for modification.',
          'L - Liskov Substitution: Subtypes must be substitutable for their base types without altering correctness.',
          'I - Interface Segregation: Clients should not be forced to depend upon interfaces they do not use.',
          'D - Dependency Inversion: Depend upon abstractions, not concretions.'
        ]
      },
      {
        heading: 'Creational & Structural Patterns',
        points: [
          'Singleton: Ensures a class has only one instance with global access (thread-safe with double-checked locking).',
          'Factory Method: Defines an interface for creating an object, but lets subclasses decide which class to instantiate.'
        ]
      }
    ],
    quickReferenceRules: [
      { rule: 'Composition over Inheritance', detail: 'Prefer `has-a` relationships over rigid `is-a` hierarchies' },
      { rule: 'Dynamic Polymorphism', detail: 'Method overriding resolved at runtime via vtable' },
      { rule: 'Static Polymorphism', detail: 'Method overloading resolved at compile-time' }
    ],
    codeExample: {
      language: 'java',
      title: 'Thread-Safe Double-Checked Locking Singleton',
      code: `public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;
    
    private DatabaseConnectionPool() {
        // Private constructor prevents reflection instantiation
    }
    
    public static DatabaseConnectionPool getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }
}`,
      explanation: 'The volatile keyword ensures visibility and prevents instruction reordering during multi-threaded initialization.'
    },
    interviewQuestions: [
      {
        question: 'What is the Liskov Substitution Principle and give a classic violation example?',
        answer: 'The Square-Rectangle problem: If class Square inherits from Rectangle, setting width also mutates height, violating the expectations of callers who treat it as a general rectangle.',
        askedByCompanies: ['Amazon', 'Microsoft', 'ThoughtWorks']
      }
    ],
    commonMistakes: [
      'Over-engineering simple problems with unnecessary design patterns.',
      'Violating Single Responsibility by creating monolithic "God Objects" or "Manager" classes.'
    ],
    linkedAssessmentId: 'as-technical',
    assessmentQuestions: [
      {
        id: 'oop-test-1',
        topic: 'OOP Concepts',
        question: 'Which SOLID principle is directly violated when a subclass overrides a base class method with an empty implementation or throws an UnsupportedOperationException?',
        options: ['Single Responsibility Principle', 'Liskov Substitution Principle', 'Open/Closed Principle', 'Interface Segregation Principle'],
        correctAnswer: 1,
        explanation: 'Liskov Substitution Principle states that derived classes must be completely substitutable for base classes without breaking client assumptions.'
      },
      {
        id: 'oop-test-2',
        topic: 'Design Patterns',
        question: 'Why is the `volatile` modifier required in Java for a double-checked locking Singleton implementation?',
        options: [
          'It forces the object to serialize onto the filesystem',
          'It prevents instruction reordering by the compiler/CPU during memory allocation and assignment',
          'It automatically garbage collects the instance when idle',
          'It locks the entire class permanently'
        ],
        correctAnswer: 1,
        explanation: 'Without `volatile`, CPU instruction reordering may assign memory address to the reference before constructor execution completes, exposing half-initialized objects.'
      },
      {
        id: 'oop-test-3',
        topic: 'OOP Concepts',
        question: 'What is the primary difference between Method Overloading and Method Overriding?',
        options: [
          'Overloading is runtime polymorphism; Overriding is compile-time polymorphism',
          'Overloading is compile-time polymorphism (same name, distinct signatures); Overriding is runtime polymorphism (same name & signature in subclass)',
          'Overloading only applies to private methods; Overriding only applies to static methods',
          'There is no difference in modern programming languages'
        ],
        correctAnswer: 1,
        explanation: 'Overloading resolves method signatures at compile-time within the same scope; Overriding dynamically dispatches via vtable at runtime across inheritance boundaries.'
      }
    ]
  }
};

/**
 * Fallback generator for any custom topic from the personalized roadmap
 */
export function getDocumentationForTopic(topicName: string): TopicDocumentation {
  const normalized = topicName.toLowerCase().trim();

  // Direct match
  if (TOPIC_DOCUMENTATION_DATABASE[normalized]) {
    return TOPIC_DOCUMENTATION_DATABASE[normalized];
  }

  // Keyword match
  for (const [key, doc] of Object.entries(TOPIC_DOCUMENTATION_DATABASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return doc;
    }
  }

  // OOP / Programming keywords
  if (normalized.includes('oop') || normalized.includes('programming') || normalized.includes('clean code') || normalized.includes('solid') || normalized.includes('design pattern')) {
    return {
      ...TOPIC_DOCUMENTATION_DATABASE['oop principles'],
      id: normalized,
      topicTitle: topicName
    };
  }

  // If topic relates to Aptitude / Logic
  if (normalized.includes('quant') || normalized.includes('ratio') || normalized.includes('profit') || normalized.includes('speed') || normalized.includes('aptitude') || normalized.includes('logic') || normalized.includes('syllogism') || normalized.includes('puzzle')) {
    return {
      ...TOPIC_DOCUMENTATION_DATABASE['percentages'],
      id: normalized,
      topicTitle: topicName,
      overview: `Detailed guide on ${topicName} for campus recruitment exams. Covers essential mathematical principles, speed calculation tricks, and solved model problems.`,
      linkedAssessmentId: 'as-aptitude'
    };
  }

  // If topic relates to Technical/CS
  if (normalized.includes('sql') || normalized.includes('db') || normalized.includes('network') || normalized.includes('os') || normalized.includes('linux')) {
    return {
      ...TOPIC_DOCUMENTATION_DATABASE['dbms'],
      id: normalized,
      topicTitle: topicName,
      overview: `Core Computer Science & Engineering guide on ${topicName}. Sourced from open technical references to clear technical interview rounds at top software companies.`,
      linkedAssessmentId: 'as-technical'
    };
  }

  // Default to DSA Arrays / Algorithms
  return {
    ...TOPIC_DOCUMENTATION_DATABASE['arrays'],
    id: normalized,
    topicTitle: topicName,
    overview: `Comprehensive placement notes for ${topicName}. Master the underlying algorithmic patterns, edge cases, time/space complexities, and interview trade-offs.`,
    linkedAssessmentId: 'as-dsa'
  };
}
