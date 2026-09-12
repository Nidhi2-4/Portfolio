/**
 * ==========================================================================
 * PROJECTS DATA SOURCE
 * Curated projects portfolio with tags, highlights, and demo links
 * ==========================================================================
 */

const portfolioProjects = [
  {
    id: 'himsagar',
    title: 'HimSagar | Polar Science Outreach & RAG Knowledge Repository',
    category: 'fullstack',
    badge: 'FULL STACK / GOVTECH & RAG',
    summary: 'An integrated polar science portal engineered for Smart India Hackathon (MoES / NCPOR, Goa). Features real-time station radar tracking across India\'s 5 polar stations, an in-browser Kaggle-style data explorer, and a cited RAG AI research assistant powered by Mistral Large & pgvector.',
    details: 'The National Centre for Polar and Ocean Research (NCPOR) conducts missions across Arctic, Antarctic, and Himalayan stations (Maitri, Bharati, Himadri, Himansh, IndARC). HimSagar unifies scattered polar datasets into an all-in-one portal featuring geospatial radar telemetry, an in-browser data exploration studio, automated science newsroom synthesis with vernacular translations, and a cited RAG research assistant with dual persona modes (Student vs Polar Scientist).',
    highlights: [
      'Interactive Polar Station Radar built with Leaflet.js rendering live telemetry across 5 Indian polar observatories.',
      'Kaggle-style in-browser data exploration engine with Recharts for dynamic multi-series charting and instant CSV/JSON exports.',
      'Cited RAG research assistant using Mistral Large 3 (256K context) and PostgreSQL pgvector with dual persona switching.',
      'Automated generative science newsroom generating layman explainers, press articles, and IndicTrans2 regional translations.'
    ],
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Mistral AI & RAG', 'pgvector', 'PostgreSQL', 'Prisma', 'Leaflet.js', 'Recharts'],
    gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #0e7490 100%)',
    icon: '❄️',
    image: 'assets/himsagar.png',
    demoUrl: 'https://himsagar.vercel.app/',
    githubUrl: 'https://github.com/Nidhi2-4/OffGrid_SIH'
  },
  {
    id: 'kyro-panel',
    title: 'Kyro Panel | Coordinated AI Voice Interview Panel',
    category: 'ai',
    badge: 'AI / VOICE & REAL-TIME RTC',
    summary: 'A coordinated voice AI interview panel built for EchoSphere: Agora Hackathon 2026. Features three autonomous AI interviewers (Technical Architect, PM, HR) sharing one memory on a live voice call, bidding on who speaks next with real-time SSE events, Deepgram ASR, and MiniMax voice switching.',
    details: 'Standard AI interviewers ask scripted questions in isolation. Kyro Panel puts three specialized personas in the room — Arjun Mehta (Technical Architect), Ananya Shah (Product Manager), and Rohan Iyer (HR/Behavioral). After every answer, all three evaluate candidate statements via a Claims Ledger and bid on who should challenge next, streaming dynamic responses over a single low-latency audio pipeline.',
    highlights: [
      'Engineered real-time Agora RTC voice pipeline with Deepgram nova-3 ASR & MiniMax neural voice switching.',
      'Designed multi-agent turn-taking auction: single LLM call computes bids and routes to highest bidder.',
      'Implemented Claims Ledger engine to cross-examine candidate claims against past responses for contradictions.',
      'Built live deliberation room UI, interactive candidate entry, and post-interview evidence scorecard dashboard.'
    ],
    tags: ['Agora RTC', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Deepgram / MiniMax', 'Server-Sent Events'],
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    icon: '🎙️',
    image: 'assets/kyropanel.png',
    demoUrl: 'https://kyro-panel.onrender.com/',
    videoUrl: 'https://youtu.be/6dNKDevgXX4',
    youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/6dNKDevgXX4',
    githubUrl: 'https://github.com/Anish974/kyro-panel'
  },
  {
    id: 'aerokeep',
    title: 'AeroKeep | Defense Tech Inventory Management',
    category: 'fullstack',
    badge: 'FULL STACK / DEFENSE TECH',
    summary: 'A full-stack inventory management and logistics platform engineered for a defense tech startup, with JWT auth, role-based access control, and 14 REST API endpoints across 4 relational models.',
    details: 'Built to streamline mission-critical hardware tracking and defense logistics. AeroKeep manages component life-cycles, supplier traceability, automated low-stock warnings, and barcode-based inventory audits with atomic transaction safety.',
    highlights: [
      'Architected 14 secure RESTful API endpoints with Express and Prisma ORM against PostgreSQL.',
      'Implemented robust JWT authentication with Role-Based Access Control (RBAC) across warehouse & admin tiers.',
      'Integrated real-time low-stock telemetry alerts and atomic stock decrement transactions to prevent race conditions.',
      'Created one-click CSV export pipelines and barcode scanner integration for on-field physical inventory audits.'
    ],
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'JWT & RBAC', 'REST APIs'],
    gradient: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
    icon: '🛡️',
    image: 'assets/aerokeep.png',
    demoUrl: 'https://aero-keep-bq8b.vercel.app/',
    githubUrl: 'https://github.com/Nidhi2-4/AeroKeep'
  },
  {
    id: 'sevalog',
    title: 'SevaLog | Proof-of-Work for Informal Workers',
    category: 'fullstack',
    badge: 'FULL STACK / SOCIAL IMPACT',
    summary: 'A digital verification and trust platform empowering informal gig workers, with role-based access across Worker, Employer, and Verifier roles, backed by a cryptographic hash-chain audit log.',
    details: 'Informal workers often lack verifiable work histories for credit access and employment. SevaLog provides tamper-evident proof-of-work certificates, reputation scoring algorithms, and automated SMS alerts, reducing verification latency by 60% in real-world testing.',
    highlights: [
      'Designed SHA-256 hash-chain audit log to ensure tamper-proof historical proof-of-work records.',
      'Constructed algorithmic Trust Score index based on completed jobs, verifier endorsements, and dispute history.',
      'Implemented multi-tenant RBAC with Supabase Auth & PostgreSQL Row-Level Security (RLS).',
      'Automated real-time SMS status dispatches via Twilio, slashing manual employer verification turnaround by 60%.'
    ],
    tags: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Hash-Chains', 'Tailwind CSS'],
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
    icon: '🤝',
    image: 'assets/sevalog.png',
    demoUrl: 'https://seva-log.vercel.app/',
    githubUrl: 'https://github.com/Nidhi2-4/SevaLog'
  },
  {
    id: 'glitch-ribbon',
    title: 'Hand-Tracking Glitch Ribbon',
    category: 'ai',
    badge: 'AI / COMPUTER VISION',
    summary: "A real-time interactive computer vision installation mapping live 21-point hand landmarks to a dynamically stretching, warping glitch ribbon texture in TouchDesigner.",
    details: 'Reverse-engineered an Instagram visual effect from scratch with zero prior MediaPipe experience. Combines live webcam video feeds, MediaPipe hand mesh extraction in Python, and custom GLSL displacement shaders in TouchDesigner to warp video textures interactively at 60 FPS.',
    highlights: [
      'Extracted 21 high-precision 3D hand landmarks in real-time using Google MediaPipe & OpenCV in Python.',
      'Streamed normalized spatial coordinates into TouchDesigner over local OSC / socket protocols with <10ms latency.',
      'Authored GLSL pixel displacement shaders and feedback loops to render fluid, reactive glitch ribbon distortions.',
      'Showcased live demonstration on LinkedIn, generating high engagement across creative technologist communities.'
    ],
    tags: ['TouchDesigner', 'MediaPipe', 'Python', 'GLSL Shaders', 'Computer Vision', 'OpenCV'],
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
    icon: '🖐️',
    image: 'assets/glitch-ribbon.png',
    demoText: 'Watch Demo ↗',
    demoUrl: 'https://lnkd.in/p/guVGs6gg',
    githubUrl: 'https://github.com/Nidhi2-4/Hand-Tracking-Glitch-Ribbon'
  },
  {
    id: 'er-optimizer',
    title: 'ER | Emergency Room Optimizer',
    category: 'algorithms',
    badge: 'ALGORITHMS & DSA',
    summary: 'A real-time hospital triage and resource optimizer applying five fundamental DSA paradigms to optimize resource allocation for 50+ concurrent patients across triage, OT scheduling, and ward allocation.',
    details: 'Hospital emergency rooms face critical bottlenecks during sudden casualty surges. This simulation engine implements custom algorithms to compute optimal patient priority ordering, operating theatre scheduling, and doctor-bed assignments in sub-millisecond execution times.',
    highlights: [
      'Applied 5 core DSA paradigms: Merge Sort, 0/1 Knapsack DP, Greedy Priority Queue, Backtracking, and Divide & Conquer.',
      'Simulated concurrent resource allocation for 50+ emergency patients across Triage, ICU, OT, and General Wards.',
      'Built interactive visual dashboard rendering algorithmic step execution, complexity metrics, and queue analytics.',
      'Engineered with pure TypeScript and React for high-frequency state updates without UI frame drops.'
    ],
    tags: ['TypeScript', 'React', 'Dynamic Programming', 'Greedy Algorithms', 'Graph Theory', 'DSA'],
    gradient: 'linear-gradient(135deg, #ea580c 0%, #ef4444 100%)',
    icon: '⚡',
    image: 'assets/er-optimizer.png',
    demoUrl: 'https://er-emergency-room-optimizer.vercel.app/',
    githubUrl: 'https://github.com/Nidhi2-4/ER-Emergency-Room-Optimizer'
  }
];

window.portfolioProjects = portfolioProjects;
