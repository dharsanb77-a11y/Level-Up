import { Technology, Interest, RoadmapActivity, Department, AcademicYear } from '../types';
import { ALL_ASSESSMENTS } from './assessmentQuestions';

export const SEED_ASSESSMENTS = ALL_ASSESSMENTS;

export const DEPARTMENTS: { code: Department; name: string; icon: string; description: string }[] = [
  { 
    code: 'CSE', 
    name: 'Computer Science & Engineering', 
    icon: 'Laptop',
    description: 'Software development, algorithms, system architecture, and networks' 
  },
  { 
    code: 'AIDS', 
    name: 'Artificial Intelligence & Data Science', 
    icon: 'Brain',
    description: 'Data analytics, predictive models, deep learning, and big data systems' 
  },
  { 
    code: 'AIML', 
    name: 'AI & Machine Learning', 
    icon: 'Sparkles',
    description: 'Neural networks, computer vision, NLP, and intelligent autonomous agents' 
  },
  { 
    code: 'ECE', 
    name: 'Electronics & Communication', 
    icon: 'Cpu',
    description: 'Embedded systems, VLSI, signal processing, and communication protocols' 
  },
  { 
    code: 'EEE', 
    name: 'Electrical & Electronics', 
    icon: 'Zap',
    description: 'Power systems, circuit design, renewable energy, and control electronics' 
  },
  { 
    code: 'MECHANICAL', 
    name: 'Mechanical Engineering', 
    icon: 'Wrench',
    description: 'CAD/CAM, robotics, thermodynamics, design, and manufacturing' 
  },
  { 
    code: 'CIVIL', 
    name: 'Civil Engineering', 
    icon: 'Building2',
    description: 'Structural engineering, geotechnics, project management, and BIM' 
  }
];

export const ACADEMIC_YEARS: { id: AcademicYear; label: string; stage: string }[] = [
  { id: '1st Year', label: '1st Year', stage: 'Fundamentals & Exploration' },
  { id: '2nd Year', label: '2nd Year', stage: 'Core Skills & Projects' },
  { id: '3rd Year', label: '3rd Year', stage: 'Placement Prep & Internships' },
  { id: 'Final Year', label: 'Final Year', stage: 'Campus Drives & Job Offers' }
];

export const AVAILABLE_TECHNOLOGIES: Technology[] = [
  // Languages
  { id: 'tech-c', name: 'C', category: 'Languages', popular: true },
  { id: 'tech-cpp', name: 'C++', category: 'Languages', popular: true },
  { id: 'tech-java', name: 'Java', category: 'Languages', popular: true },
  { id: 'tech-python', name: 'Python', category: 'Languages', popular: true },
  { id: 'tech-js', name: 'JavaScript', category: 'Languages', popular: true },
  { id: 'tech-ts', name: 'TypeScript', category: 'Languages', popular: true },
  { id: 'tech-go', name: 'Go', category: 'Languages' },
  { id: 'tech-rust', name: 'Rust', category: 'Languages' },
  
  // Frontend
  { id: 'tech-html-css', name: 'HTML / CSS', category: 'Frontend', popular: true },
  { id: 'tech-react', name: 'React', category: 'Frontend', popular: true },
  { id: 'tech-nextjs', name: 'Next.js', category: 'Frontend' },
  { id: 'tech-tailwind', name: 'Tailwind CSS', category: 'Frontend', popular: true },
  { id: 'tech-vue', name: 'Vue.js', category: 'Frontend' },

  // Backend
  { id: 'tech-node', name: 'Node.js', category: 'Backend', popular: true },
  { id: 'tech-express', name: 'Express.js', category: 'Backend', popular: true },
  { id: 'tech-django', name: 'Django / FastAPI', category: 'Backend', popular: true },
  { id: 'tech-spring', name: 'Spring Boot', category: 'Backend', popular: true },

  // Database
  { id: 'tech-sql', name: 'SQL / PostgreSQL', category: 'Database', popular: true },
  { id: 'tech-mysql', name: 'MySQL', category: 'Database', popular: true },
  { id: 'tech-mongodb', name: 'MongoDB', category: 'Database', popular: true },
  { id: 'tech-redis', name: 'Redis', category: 'Database' },

  // Cloud & DevOps
  { id: 'tech-git', name: 'Git & GitHub', category: 'Cloud & DevOps', popular: true },
  { id: 'tech-docker', name: 'Docker', category: 'Cloud & DevOps', popular: true },
  { id: 'tech-linux', name: 'Linux OS', category: 'Cloud & DevOps', popular: true },
  { id: 'tech-aws', name: 'AWS Cloud', category: 'Cloud & DevOps' },

  // Core Engineering & Hardware
  { id: 'tech-matlab', name: 'MATLAB / Simulink', category: 'Core Engineering' },
  { id: 'tech-autocad', name: 'AutoCAD / SolidWorks', category: 'Core Engineering' },
  { id: 'tech-embedded-c', name: 'Embedded C / Arduino', category: 'Core Engineering' },
  { id: 'tech-verilog', name: 'Verilog / VHDL', category: 'Core Engineering' },
  { id: 'tech-dsa', name: 'Data Structures & Algorithms', category: 'Core Engineering', popular: true }
];

export const AVAILABLE_INTERESTS: Interest[] = [
  {
    id: 'int-fullstack',
    name: 'Full Stack Web Development',
    category: 'Software',
    description: 'Modern frontend, robust backend APIs, databases, and microservices architecture'
  },
  {
    id: 'int-aiml',
    name: 'AI & Machine Learning',
    category: 'Data & AI',
    description: 'Predictive modeling, deep neural networks, computer vision, and generative AI'
  },
  {
    id: 'int-datascience',
    name: 'Data Science & Business Analytics',
    category: 'Data & AI',
    description: 'Data wrangling, statistical modeling, business intelligence, and Tableau/PowerBI'
  },
  {
    id: 'int-cloud-devops',
    name: 'Cloud Computing & DevOps',
    category: 'Infrastructure',
    description: 'Cloud deployment, container orchestration, CI/CD pipelines, and site reliability'
  },
  {
    id: 'int-cybersecurity',
    name: 'Cybersecurity & Ethical Hacking',
    category: 'Security',
    description: 'Network defense, application security audits, penetration testing, and cryptography'
  },
  {
    id: 'int-embedded-iot',
    name: 'Embedded Systems & IoT',
    category: 'Hardware & Systems',
    description: 'Microcontroller programming, sensor integration, real-time operating systems'
  },
  {
    id: 'int-vlsi',
    name: 'VLSI & Chip Design',
    category: 'Hardware & Systems',
    description: 'Digital circuit design, ASIC verification, semiconductor systems'
  },
  {
    id: 'int-cad-design',
    name: 'Core Mechanical Design & Robotics',
    category: 'Core Engineering',
    description: 'Kinematics, product prototyping, finite element analysis, and automation'
  },
  {
    id: 'int-product-management',
    name: 'Technical Product Management & Consulting',
    category: 'Strategy & Leadership',
    description: 'Product lifecycle, technical roadmapping, business cases, and agile delivery'
  }
];

export const SEED_ROADMAP_ACTIVITIES: RoadmapActivity[] = [
  {
    id: 'rm-1',
    phase: 'Phase 1: Foundation & Analytical Skills',
    phaseNumber: 1,
    title: 'Quantitative & Logical Aptitude Mastery',
    category: 'Aptitude',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    status: 'not_started',
    domain: 'General Placement',
    description: 'Master high-frequency aptitude topics: Time & Work, Speed & Distance, Probability, Syllogisms, and Puzzles.',
    topics: ['Arithmetic', 'Algebra & Geometry', 'Logical Deductions', 'Speed Math Techniques']
  },
  {
    id: 'rm-2',
    phase: 'Phase 1: Foundation & Analytical Skills',
    phaseNumber: 1,
    title: 'Core Programming Language Proficiency',
    category: 'Programming',
    difficulty: 'Beginner',
    estimatedHours: 25,
    status: 'in_progress',
    domain: 'Software Engineering',
    description: 'Build complete command over one primary language (Java, C++, or Python) including memory models, OOPs, and standard libraries.',
    topics: ['Syntax & Standard Library', 'OOP Principles', 'Pointers / References', 'Clean Code Practices']
  },
  {
    id: 'rm-3',
    phase: 'Phase 2: Core Data Structures & Algorithms',
    phaseNumber: 2,
    title: 'Essential Data Structures',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedHours: 40,
    status: 'not_started',
    domain: 'Coding & Problem Solving',
    description: 'Hands-on practice with Linear & Non-linear data structures: Arrays, Strings, Stacks, Queues, HashMaps, Trees, and Heaps.',
    topics: ['Arrays & Two Pointers', 'Sliding Window', 'Binary Search', 'Trees & BST', 'Recursion & Backtracking']
  },
  {
    id: 'rm-4',
    phase: 'Phase 3: Domain Specialization & Capstone Project',
    phaseNumber: 3,
    title: 'Production-Grade Capstone Project',
    category: 'Projects',
    difficulty: 'Advanced',
    estimatedHours: 35,
    status: 'not_started',
    domain: 'Selected Domain',
    description: 'Build and deploy a full-scale portfolio project reflecting your chosen domain of interest with clean Git commits and documentation.',
    topics: ['System Architecture', 'Database Schema', 'API Implementation', 'Deployment & CI/CD']
  },
  {
    id: 'rm-5',
    phase: 'Phase 4: Interview Readiness & Mock Rounds',
    phaseNumber: 4,
    title: 'HR, Behavioral & Technical Mock Interviews',
    category: 'Interviews',
    difficulty: 'Intermediate',
    estimatedHours: 15,
    status: 'not_started',
    domain: 'Placement Readiness',
    description: 'Prepare STAR method behavioral answers, resume walk-throughs, and participate in peer mock interviews.',
    topics: ['STAR Method Answers', 'Resume Deep Dive', 'Company Specific Questions', 'Salary & Offer Etiquette']
  }
];
