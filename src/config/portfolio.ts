import type {
  ArchiveCategory,
  ArchiveEntry,
  CaseStudy,
  Credential,
  NavigationItem,
  Service,
  SkillGroup,
  SocialLink,
  SpokenLanguage,
  Stat,
  StoryChapter,
} from '@/types';

/**
 * Single source of truth for every piece of personal information on the site.
 * Nothing here should be duplicated inside a component.
 *
 * Translatable UI strings (labels, headings, form copy) live in
 * src/content/en.json and src/content/bn.json instead.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const identity = {
  fullName: 'Md Ashik Miah',
  /** Used for the oversized split-line hero treatment. */
  nameLines: ['Md Ashik', 'Miah'],
  title: 'Software Engineer & ML Researcher',
  shortIntro:
    'I build web systems end to end and research machine learning that has to hold up outside a notebook.',
  longBio: [
    'I am a computer science graduate from East West University in Dhaka, majoring in Intelligent Systems and Data Science. My work sits in two places at once: shipping production web software, and running the kind of applied ML research that has to survive contact with messy real-world data.',
    'On the engineering side I work across the stack — TypeScript and React on the front, Node and Python services behind them, relational databases underneath. I care about the parts people rarely see: input validation, rate limiting, sane error states, migrations that do not lose data.',
    'On the research side I have published on neural collaborative filtering for e-commerce recommendation and built an explainable CNN framework for plant disease diagnosis. Both projects taught me the same lesson — a model nobody can interpret is a model nobody will deploy.',
  ],
  location: 'Dhaka, Bangladesh',
  timezone: 'UTC+6',
  availability: 'Open to software engineering roles',
  availabilityStatus: 'available' as const,
  yearsOfExperience: '01',
  projectCount: '08',
  email: 'ashik3232himu@gmail.com',
  resumeUrl: '/md-ashik-resume.pdf',
} as const;

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/ConstantineAshik',
    handle: 'ConstantineAshik',
  },
  {
    label: 'Email',
    href: `mailto:${identity.email}`,
    handle: identity.email,
  },
];

export const navigationItems: NavigationItem[] = [
  { index: '01', labelKey: 'about', target: 'about' },
  { index: '02', labelKey: 'research', target: 'research' },
  { index: '03', labelKey: 'work', target: 'work' },
  { index: '04', labelKey: 'archive', target: 'archive' },
  { index: '05', labelKey: 'contact', target: 'contact' },
];

export const stats: Stat[] = [
  { value: '08', label: 'featured projects' },
  { value: '02', label: 'research papers' },
  { value: '07', label: 'programming languages' },
  { value: '50+', label: 'members mentored' },
];

export const services: Service[] = [
  {
    index: '01',
    title: 'Full-stack web development',
    description:
      'React and Next.js front ends backed by Node, Express, or FastAPI services, with the database schema designed rather than inherited.',
  },
  {
    index: '02',
    title: 'Applied machine learning',
    description:
      'Recommendation systems, computer vision, and explainable models — built to be evaluated honestly and shipped, not just demoed.',
  },
  {
    index: '03',
    title: 'Legacy modernisation',
    description:
      'Migrating older stacks onto maintainable foundations without losing the behaviour people already depend on.',
  },
  {
    index: '04',
    title: 'Secure API design',
    description:
      'Authentication, validation, sanitisation, rate limiting, and audit trails treated as part of the interface, not an afterthought.',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'PHP', 'C++'],
  },
  {
    title: 'Frontend',
    items: [
      'React',
      'Next.js',
      'Tailwind CSS',
      'HTML5',
      'CSS3',
      'Three.js',
      'Framer Motion',
      'EJS',
    ],
  },
  {
    title: 'Backend & APIs',
    items: ['Node.js', 'Express.js', 'FastAPI', 'Flask'],
  },
  {
    title: 'Data & ML',
    items: [
      'TensorFlow',
      'Keras',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'OpenCV',
      'YOLOv8',
    ],
  },
  {
    title: 'Databases & Cloud',
    items: [
      'MySQL / MariaDB',
      'SQL Server',
      'Firebase',
    ],
  },
  {
    title: 'Tooling',
    items: ['Git', 'Docker', 'Linux', 'Vitest', 'Playwright'],
  },
];

export const spokenLanguages: SpokenLanguage[] = [
  { name: 'Bangla', level: 'Native' },
  { name: 'English', level: 'Intermediate' },
  { name: 'Urdu / Hindi', level: 'Conversational' },
];

export const education = {
  degree: 'B.Sc. in Computer Science and Engineering',
  major: 'Intelligent Systems and Data Science',
  institution: 'East West University',
  location: 'Dhaka, Bangladesh',
  coursework: [
    'Object-Oriented Programming',
    'Data Structures & Algorithms',
    'Database Systems',
    'Web Development',
    'Computer Networks',
    'Software Project Management',
    'Artificial Intelligence',
  ],
} as const;

export const experience = [
  {
    role: 'Software Development Intern',
    organisation: 'Grameen Communications',
    location: 'Dhaka, Bangladesh',
    period: 'Jun 2026 — Present',
    summary:
      'Modernising the organisation’s public website: rebuilding it on Node.js and Express with EJS templating over MariaDB, and hardening the request pipeline with compression, security headers, rate limiting, validation, and sanitisation.',
  },
] as const;

export const leadership = [
  {
    role: 'General Secretary & Volunteer Coordinator',
    organisation: 'EWU Robotics Club',
    summary:
      'Organised the EWU National RoboFest, ran the "Kickstart to Robotics" workshop series, and coordinated the robotics segment of the CSE Fest.',
  },
] as const;

/** Research output — drives the credential carousel in #research. */
export const credentials: Credential[] = [
  {
    id: 'ncf-ecommerce',
    title:
      'E-commerce Conversion Rates and Customer Satisfaction through Neural Collaborative Filtering',
    issuer: 'CIIR',
    year: '2025',
    status: 'Presented',
    description:
      'A neural collaborative filtering recommender evaluated against conversion and satisfaction rather than ranking metrics alone. Built with TensorFlow and Keras over a cleaned interaction dataset.',
    image: {
      src: '/images/credentials/ncf-ecommerce.svg',
      alt: 'Certificate for the neural collaborative filtering paper presented at ICIIRD',
      width: 1200,
      height: 900,
    },
    href:
      'https://drive.google.com/file/d/1UcUEPir7t3wg4ZYeQkNTW_zY6mLcHiLk/view',
    tags: ['TensorFlow', 'Keras', 'Pandas', 'Scikit-learn'],
  },
  {
    id: 'guavanet',
    title:
      'GuavaNet-XAI: A CNN-Based Framework for Accurate and Interpretable Diagnosis of Guava Diseases',
    issuer: '28th ICCIT',
    year: '2025',
    status: 'Under review',
    description:
      'A comparison of DenseNet, EfficientNetV2, and ResNeXt backbones for guava disease classification, with Grad-CAM attribution so an agronomist can see which lesion drove each prediction.',
    image: {
      src: '/images/credentials/guavanet.svg',
      alt: 'Poster for the GuavaNet explainable disease diagnosis paper',
      width: 1200,
      height: 900,
    },
    tags: ['DenseNet', 'EfficientNetV2', 'ResNeXt', 'Grad-CAM'],
  },
  {
    id: 'degree',
    title: 'B.Sc. in Computer Science and Engineering',
    issuer: 'East West University',
    year: 'Graduated',
    status: 'Completed',
    description:
      'Major in Intelligent Systems and Data Science, with coursework spanning algorithms, database systems, networks, and artificial intelligence.',
    image: {
      src: '/images/credentials/degree.svg',
      alt: 'Degree certificate from East West University',
      width: 1200,
      height: 900,
    },
    tags: ['Intelligent Systems', 'Data Science'],
  },
  {
    id: 'robofest',
    title: 'EWU National RoboFest — Organising Committee',
    issuer: 'EWU Robotics Club',
    year: '2025',
    status: 'Completed',
    description:
      'Recognition for organising the national robotics festival and the accompanying workshop series as General Secretary of the club.',
    image: {
      src: '/images/credentials/robofest.svg',
      alt: 'Recognition certificate from the EWU National RoboFest',
      width: 1200,
      height: 900,
    },
    tags: ['Leadership', 'Events'],
  },
];

/** Case studies — the pinned title list in #work. */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'traffic-risk-assessment',
    title: 'Automated Traffic Risk Assessment',
    client: 'Academic — Capstone',
    year: '2026',
    category: 'Computer Vision',
    role: 'Lead engineer & researcher',
    contributions: [
      'Dataset collection',
      'Detection pipeline',
      'Risk heuristics',
      'Evaluation',
      'Demo interface',
    ],
    shortDescription:
      'Rider-perspective video from Dhaka scored frame by frame as safe, caution, or danger.',
    fullDescription:
      'A capstone system that reads motorcycle rider-perspective footage shot on Dhaka roads and classifies each moment as SAFE, CAUTION, or DANGER. YOLOv8 handles detection; optical flow supplies relative motion; a rule layer on top derives proximity, time-to-collision, blind-spot occupancy, side cut-ins, wrong-side approaches, and degraded conditions such as night-time, wet road, and phone distraction. Rules were chosen over an end-to-end classifier deliberately — a rider needs to know why a warning fired, and a black box cannot tell them.',
    stack: ['Python', 'YOLOv8', 'OpenCV', 'Scikit-learn', 'Gradio'],
    cover: {
      src: '/images/work/traffic-risk-cover.svg',
      alt: 'Frame from the traffic risk assessment system with detection overlays and a risk label',
      width: 1600,
      height: 900,
      dominantColor: '#141a12',
    },
    gallery: [
      {
        src: '/images/work/traffic-risk-detection.svg',
        alt: 'Detection overlay showing tracked vehicles and estimated distances',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/work/traffic-risk-scoring.svg',
        alt: 'Risk scoring panel showing time-to-collision and blind-spot indicators',
        width: 1600,
        height: 900,
      },
    ],
    colorTheme: '#c6f04e',
    credits: [{ role: 'Supervision', name: 'East West University, CSE' }],
    externalUrl:
      'https://github.com/ConstantineAshik/Automated-Traffic-Risk-Assessment',
  },
  {
    slug: 'database-change-intelligence',
    title: 'Enterprise Database Change Intelligence',
    client: 'Personal — In design',
    year: '2026',
    category: 'Platform Architecture',
    role: 'Architect',
    contributions: [
      'System architecture',
      'Service boundaries',
      'Approval model',
      'Documentation',
    ],
    shortDescription:
      'A monorepo platform for reviewing, simulating, and approving schema changes before they reach production.',
    fullDescription:
      'An architecture and documentation effort for a platform that makes database change safe to reason about. A Next.js desktop client and a React Native companion sit over a FastAPI core and an ASP.NET Core SQL gateway, while Neo4j models dependency graphs between objects. Every change runs as a dry run first, requires human approval, is scoped by role, and lands in an audit trail. Currently at the architecture and documentation phase — no production deployment yet.',
    stack: [
      'Next.js',
      'TypeScript',
      'React Native',
      'FastAPI',
      'ASP.NET Core',
      'Neo4j',
      'Docker',
    ],
    cover: {
      src: '/images/work/dbci-cover.svg',
      alt: 'Architecture diagram of the database change intelligence platform',
      width: 1600,
      height: 900,
      dominantColor: '#101418',
    },
    gallery: [
      {
        src: '/images/work/dbci-graph.svg',
        alt: 'Dependency graph view of database objects',
        width: 1600,
        height: 900,
      },
    ],
    colorTheme: '#7dd3fc',
    credits: [],
    externalUrl:
      'https://github.com/ConstantineAshik/Enterprise-Database-Change-Intelligence-Platform',
  },
  {
    slug: 'grameen-modernisation',
    title: 'Grameen Communications Website Modernisation',
    client: 'Grameen Communications',
    year: '2026',
    category: 'Web Platform',
    role: 'Software development intern',
    contributions: [
      'Migration',
      'Templating',
      'Security middleware',
      'Database work',
    ],
    shortDescription:
      'Rebuilding a long-running public website on a maintainable Node stack without losing its content history.',
    fullDescription:
      'The organisation’s public site had accumulated years of content on an ageing stack. I rebuilt it on Node.js and Express with EJS templating over MariaDB, migrating existing records rather than starting clean. The request pipeline gained compression, security headers, rate limiting, input validation, sanitisation, and constrained file uploads. A Hugging Face Transformers integration handles text summarisation for the news archive.',
    stack: [
      'Node.js',
      'Express.js',
      'EJS',
      'MariaDB',
      'Hugging Face Transformers',
    ],
    cover: {
      src: '/images/work/grameen-cover.svg',
      alt: 'Layout of the modernised Grameen Communications website',
      width: 1600,
      height: 900,
      dominantColor: '#12140f',
    },
    gallery: [],
    colorTheme: '#c6f04e',
    credits: [],
    externalUrl: 'https://github.com/ConstantineAshik/grameen-communications',
  },
  {
    slug: 'swoosh-shop',
    title: 'Swoosh Shop Platform',
    client: 'Personal',
    year: '2025',
    category: 'E-commerce',
    role: 'Full-stack engineer',
    contributions: [
      'Monorepo setup',
      'Storefront',
      'Admin panel',
      'Backend API',
      'Deployment',
    ],
    shortDescription:
      'A monorepo storefront, admin panel, and backend sharing one typed package boundary.',
    fullDescription:
      'A commerce platform split into a customer storefront, an admin panel, and a backend API, with shared types and validation in a common package so the three cannot drift apart. React 19 and Vite power the front end, with Express, Prisma, and MySQL via TiDB behind it.',
    stack: [
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Express',
      'Prisma',
      'MySQL / TiDB',
      'Docker',
    ],
    cover: {
      src: '/images/work/swoosh-cover.svg',
      alt: 'Storefront and admin panel views of the Swoosh commerce platform',
      width: 1600,
      height: 900,
      dominantColor: '#161016',
    },
    gallery: [],
    colorTheme: '#f0a6c8',
    credits: [],
    externalUrl: 'https://github.com/scarface-h/swoosh',
  },
  {
    slug: 'pensieve-player',
    title: 'The Pensieve Player',
    client: 'Personal',
    year: '2026',
    category: 'Android · Local Music',
    role: 'Android developer',
    contributions: [
      'Offline playback',
      'Local library management',
      'Lyrics and queues',
      'Listening history',
      'Large-library performance',
    ],
    shortDescription:
      'A premium offline-first Android music player for people who keep their music library on-device.',
    fullDescription:
      'The Pensieve Player is an advanced Android local music player built around a memory-inspired identity. It combines powerful playback, local-library management, lyrics, queues, and listening history without depending on a streaming service. The experience is designed to remain modern, minimal, smooth, and responsive even with large music collections.',
    stack: ['Android', 'Kotlin', 'Local media', 'Offline-first'],
    cover: {
      src: '/images/work/pensieve-player.png',
      alt: 'The Pensieve Player memory-inspired music player identity',
      width: 1254,
      height: 1254,
      dominantColor: '#f8f8f8',
    },
    gallery: [],
    colorTheme: '#0b2a5b',
    credits: [],
    externalUrl: 'https://github.com/ConstantineAshik/The-Pensieve-Player',
  },
  {
    slug: 'filesort',
    title: 'FileSort',
    client: 'Personal',
    year: '2026',
    category: 'Android · File Automation',
    role: 'Android developer',
    contributions: [
      'Rule-based sorting',
      'Scheduled automation',
      'Move and copy workflows',
      'Media organisation',
    ],
    shortDescription:
      'An Android storage automation tool that turns chaotic folders into an organised media library.',
    fullDescription:
      'FileSort lets users define where files belong, choose when a rule should run, and leave the application to organise storage automatically. It can move or copy media across folders so downloads, videos, and other files arrive in the right place regardless of which application created them.',
    stack: ['Android', 'Kotlin', 'Storage Access Framework', 'Background work'],
    cover: {
      src: '/images/work/filesort-cover.svg',
      alt: 'FileSort automated storage organisation project',
      width: 1600,
      height: 900,
      dominantColor: '#111713',
    },
    gallery: [],
    colorTheme: '#c6f04e',
    credits: [],
    externalUrl: 'https://github.com/ConstantineAshik/FileSort',
  },
];

export const archiveCategories: ArchiveCategory[] = [
  {
    slug: 'machine-learning',
    title: 'Machine Learning',
    description:
      'Models built for a stated decision, evaluated against it, and explained.',
    count: 2,
  },
  {
    slug: 'web-platforms',
    title: 'Web Platforms',
    description: 'Full applications: storefronts, portals, internal tools.',
    count: 2,
  },
  {
    slug: 'apis-services',
    title: 'APIs & Services',
    description: 'Backends, gateways, and the contracts between them.',
    count: 1,
  },
  {
    slug: 'data-systems',
    title: 'Data Systems',
    description: 'Schemas, migrations, and the queries that outlive them.',
    count: 1,
  },
  {
    slug: 'android-apps',
    title: 'Android Apps',
    description: 'Offline-first mobile tools for media and local storage.',
    count: 2,
  },
];

export const archiveEntries: ArchiveEntry[] = [
  {
    id: 'ar-01',
    slug: 'traffic-risk-assessment',
    title: 'Automated Traffic Risk Assessment',
    category: 'machine-learning',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'Python',
    framework: 'YOLOv8 · OpenCV',
    scope: 'Capstone',
    year: '2026',
    orientation: 'landscape',
    image: {
      src: '/images/archive/traffic-risk.svg',
      alt: 'Traffic risk assessment output with detection boxes and a risk classification',
      width: 1600,
      height: 900,
      dominantColor: '#141a12',
    },
    thumbnail: {
      src: '/images/archive/traffic-risk.svg',
      alt: 'Traffic risk assessment thumbnail',
      width: 800,
      height: 450,
    },
    story:
      'Rule-based risk on top of learned detection, so every warning can be traced back to the condition that produced it.',
  },
  {
    id: 'ar-02',
    slug: 'guavanet',
    title: 'GuavaNet Disease Diagnosis',
    category: 'machine-learning',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'Python',
    framework: 'TensorFlow · Keras',
    scope: 'Research',
    year: '2026',
    orientation: 'landscape',
    image: {
      src: '/images/archive/guavanet.svg',
      alt: 'Grad-CAM heat maps over guava leaf images showing the regions driving each diagnosis',
      width: 1600,
      height: 900,
      dominantColor: '#101a12',
    },
    thumbnail: {
      src: '/images/archive/guavanet.svg',
      alt: 'GuavaNet thumbnail',
      width: 800,
      height: 450,
    },
    story:
      'Three CNN backbones compared, then Grad-CAM applied so the prediction comes with its evidence.',
  },
  {
    id: 'ar-03',
    slug: 'swoosh-shop',
    title: 'Swoosh Shop Platform',
    category: 'web-platforms',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'TypeScript',
    framework: 'React 19 · Vite',
    scope: 'Production',
    year: '2025',
    orientation: 'landscape',
    image: {
      src: '/images/archive/swoosh.svg',
      alt: 'Swoosh storefront product grid alongside the admin dashboard',
      width: 1600,
      height: 900,
      dominantColor: '#161016',
    },
    thumbnail: {
      src: '/images/archive/swoosh.svg',
      alt: 'Swoosh Shop thumbnail',
      width: 800,
      height: 450,
    },
    repoUrl: 'https://github.com/scarface-h/swoosh',
  },
  {
    id: 'ar-04',
    slug: 'grameen-modernisation',
    title: 'Grameen Communications Website',
    category: 'web-platforms',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'JavaScript',
    framework: 'Express · EJS',
    scope: 'Production',
    year: '2026',
    orientation: 'landscape',
    image: {
      src: '/images/archive/grameen.svg',
      alt: 'Home page of the modernised Grameen Communications website',
      width: 1600,
      height: 900,
      dominantColor: '#12140f',
    },
    thumbnail: {
      src: '/images/archive/grameen.svg',
      alt: 'Grameen Communications thumbnail',
      width: 800,
      height: 450,
    },
    repoUrl: 'https://github.com/ConstantineAshik/grameen-communications',
  },
  {
    id: 'ar-05',
    slug: 'database-change-intelligence',
    title: 'Database Change Intelligence',
    category: 'apis-services',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'TypeScript · Python',
    framework: 'FastAPI · ASP.NET Core',
    scope: 'Architecture',
    year: '2026',
    orientation: 'landscape',
    image: {
      src: '/images/archive/dbci.svg',
      alt: 'Service topology of the database change intelligence platform',
      width: 1600,
      height: 900,
      dominantColor: '#101418',
    },
    thumbnail: {
      src: '/images/archive/dbci.svg',
      alt: 'Database change intelligence thumbnail',
      width: 800,
      height: 450,
    },
    story:
      'Dry runs, human approval, role scoping, and an audit trail — the guardrails come before the automation.',
  },
  {
    id: 'ar-06',
    slug: 'online-voting-system',
    title: 'Online Voting System',
    category: 'data-systems',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'PHP',
    framework: 'MySQL',
    scope: 'Coursework',
    year: '2024',
    orientation: 'landscape',
    image: {
      src: '/images/archive/voting.svg',
      alt: 'Ballot and results screens of the online voting system',
      width: 1600,
      height: 900,
      dominantColor: '#141014',
    },
    thumbnail: {
      src: '/images/archive/voting.svg',
      alt: 'Online voting system thumbnail',
      width: 800,
      height: 450,
    },
    story:
      'One vote per eligible account, enforced at the schema level rather than in application code.',
  },
];

/** Scroll-driven story in #story — the GuavaNet research, chapter by chapter. */
archiveEntries.push(
  {
    id: 'ar-07',
    slug: 'pensieve-player',
    title: 'The Pensieve Player',
    category: 'android-apps',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'Kotlin',
    framework: 'Android',
    scope: 'Personal',
    year: '2026',
    orientation: 'square',
    image: {
      src: '/images/work/pensieve-player.png',
      alt: 'The Pensieve Player logo',
      width: 1254,
      height: 1254,
    },
    thumbnail: {
      src: '/images/work/pensieve-player.png',
      alt: 'The Pensieve Player thumbnail',
      width: 600,
      height: 600,
    },
    story:
      'Offline playback, lyrics, queues, library management, and listening history for large on-device music collections.',
    repoUrl: 'https://github.com/ConstantineAshik/The-Pensieve-Player',
  },
  {
    id: 'ar-08',
    slug: 'filesort',
    title: 'FileSort',
    category: 'android-apps',
    city: 'Dhaka',
    country: 'Bangladesh',
    language: 'Kotlin',
    framework: 'Android',
    scope: 'Personal',
    year: '2026',
    orientation: 'landscape',
    image: {
      src: '/images/work/filesort-cover.svg',
      alt: 'FileSort automated storage organisation project',
      width: 1600,
      height: 900,
    },
    thumbnail: {
      src: '/images/work/filesort-cover.svg',
      alt: 'FileSort thumbnail',
      width: 800,
      height: 450,
    },
    story:
      'Rules and schedules automatically move or copy media into the folders where it belongs.',
    repoUrl: 'https://github.com/ConstantineAshik/FileSort',
  },
);

export const storyChapters: StoryChapter[] = [
  {
    id: 'ch-01',
    year: '01',
    title: 'The problem is not the model',
    description:
      'Guava disease costs smallholders real yield, and the diagnosis usually arrives too late. A classifier is easy to train. A classifier an agronomist will act on is not.',
    metadata: [
      { label: 'Field', value: 'Computer Vision' },
      { label: 'Domain', value: 'Agriculture' },
    ],
    image: {
      src: '/images/story/chapter-01.svg',
      alt: 'Diseased guava leaves photographed in the field',
      width: 1400,
      height: 1000,
    },
  },
  {
    id: 'ch-02',
    year: '02',
    title: 'Three backbones, one dataset',
    description:
      'DenseNet, EfficientNetV2, and ResNeXt were trained on the same split under the same augmentation budget, so the comparison measured architecture rather than tuning effort.',
    metadata: [
      { label: 'Models', value: '3' },
      { label: 'Framework', value: 'TensorFlow' },
    ],
    image: {
      src: '/images/story/chapter-02.svg',
      alt: 'Training curves for three convolutional backbones',
      width: 1400,
      height: 1000,
    },
  },
  {
    id: 'ch-03',
    year: '03',
    title: 'Making the model explain itself',
    description:
      'Grad-CAM turns each prediction into a heat map over the leaf. When the attention lands on background rather than lesion, the prediction is wrong for the right reason — and you can see it.',
    metadata: [
      { label: 'Method', value: 'Grad-CAM' },
      { label: 'Output', value: 'Attribution map' },
    ],
    image: {
      src: '/images/story/chapter-03.svg',
      alt: 'Grad-CAM heat map highlighting a lesion on a guava leaf',
      width: 1400,
      height: 1000,
    },
  },
  {
    id: 'ch-04',
    year: '04',
    title: 'What survives review',
    description:
      'Submitted to the 28th ICCIT and currently under review. The framework matters more than the accuracy number: interpretability is what makes the result usable in a field, by someone who is not an ML engineer.',
    metadata: [
      { label: 'Venue', value: '28th ICCIT' },
      { label: 'Status', value: 'Under review' },
    ],
    image: {
      src: '/images/story/chapter-04.svg',
      alt: 'Comparison table of model results with attribution samples',
      width: 1400,
      height: 1000,
    },
  },
];

export const footer = {
  /** Computed at render so a long-lived build does not freeze the year. */
  copyright: (year: number) => `© ${year} ${identity.fullName}`,
  note: 'Designed and built from scratch.',
} as const;
