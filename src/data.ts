import { Project, TimelineItem, SkillCategory, PhilosophyPillar } from './types';

export const portfolioData = {
  name: "Eban Godwin Ikoni",
  brandName: "Airban Ikonicity",
  tagline: "Software Engineer | Problem Solver",
  email: "ikonicityairban@gmail.com",
  phone: "+234 816 986 2852",
  github: "https://github.com/ikonicity-airban",
  address: "Enugu, Nigeria · Remote Worldwide",
  
  pullQuote: "You have to find your own way. Not every problem has the same solution, and most problems have more than one.",
  
  currently: {
    building: "Geek Creations",
    maintaining: "iCatholic Igbo (70k+ users)",
    consulting: "PWorld Concepts",
    openTo: "Freelance · Contract · Full-Time · Remote"
  },
  
  beyondCode: "Music runs as deep as engineering does. I play keyboard, acoustic and bass guitar, drums, and recorder — and sing tenor in a choir I help direct and compose for. When I'm not coding, I'm usually painting, baking, cooking, or pulled into a football match — either watching or solving the kind of puzzle that doesn't compile.",
  
  whatIDontBuild: "I decline any work involving fraud, deception, or scams — as a matter of personal conviction, not just policy.",
  
  aboutNarrative: [
    "I'm a Full-Stack Software Engineer with a foundation in Electronics and Computer Engineering.",
    "I don't specialize in frameworks. I specialize in problems.",
    "My work spans web platforms, mobile applications, cloud infrastructure, AI-powered systems, and automation — whatever the problem demands. I've built products used by 70,000+ people, led engineering teams, and shipped solutions across education, e-commerce, blockchain, and enterprise automation.",
    "I'm drawn to the work most engineers avoid — the deep debugging sessions, the architectural overhauls, the systems that don't have a Stack Overflow answer. That's where the interesting problems live.",
    "Currently building CodeOven Technologies Inc. and Geek Creations, consulting across multiple engineering teams, and taking on select freelance and contract work."
  ],

  philosophyPillars: [
    {
      title: "Depth Over Shortcuts",
      tagline: "─────────────────────",
      description: "Every system has a right foundation. Find it before you build."
    },
    {
      title: "Complexity Is the Job",
      tagline: "─────────────────────",
      description: "If it were easy, it wouldn't need an engineer. Lean in."
    },
    {
      title: "Build to Teach",
      tagline: "─────────────────────",
      description: "The best proof of mastery is being able to transfer it."
    }
  ] as PhilosophyPillar[],

  timelineData: [
    {
      period: "2018 – 2023",
      role: "Electronics & Computer Engineering",
      company: "University of Nigeria, Nsukka"
    },
    {
      period: "2019 – 2022",
      role: "Computer Analyst & Operator",
      company: "Wisdom Internet Services"
    },
    {
      period: "2021",
      role: "First code written",
      company: "C → JavaScript"
    },
    {
      period: "2022",
      role: "Frontend Engineer",
      company: "Automated Cafe (Heartzibah Shop)"
    },
    {
      period: "Early–Late 2023",
      role: "Frontend Engineer",
      company: "Blaitware (RabbAi)"
    },
    {
      period: "2023 – 2024",
      role: "Dev Lead & Software Engineer",
      company: "SOFE Group"
    },
    {
      period: "2024 – now",
      role: "Freelance Software Consultant",
      company: "PWorld Concepts (iCatholic Igbo)"
    },
    {
      period: "2025 – now",
      role: "Freelance Software Engineer",
      company: "The Seventh Legion (Oyadrop, EB Pathway)"
    },
    {
      period: "Ongoing",
      role: "Founder & Lead Engineer",
      company: "Airban Ikonicity (Geek Creations, WhatsApp CRM)"
    }
  ] as TimelineItem[],

  skillsGrouped: [
    {
      category: "LANGUAGES",
      skills: ["TypeScript", "JavaScript", "Go", "PHP", "Python", "Rust", "C#", "Java", "Solidity", "C"]
    },
    {
      category: "AGENTIC DEVELOPMENT",
      skills: ["LangChain", "LangGraph", "CrewAI", "LlamaIndex", "Semantic Kernel", "AutoGPT", "Multi-Agent Orchestration"]
    },
    {
      category: "AGENTIC CODING TOOLS",
      skills: ["Cursor AI", "Windsurf IDE", "GitHub Copilot", "Cline (Claude Dev)", "v0 (by Vercel)", "Hugging Face"]
    },
    {
      category: "FRONTEND",
      skills: ["React", "Next.js", "React Native (Expo)", "Tailwind CSS", "Vue.js", "Angular", "Framer Motion", "Three.js", "Svelte", "HTML", "CSS"]
    },
    {
      category: "BACKEND",
      skills: ["Node.js", "Bun", "Laravel", "Django", "Spring Boot", "Hono", "Express.js", "FastAPI", "NestJS", ".NET"]
    },
    {
      category: "DATABASES",
      skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite", "Supabase", "Firebase"]
    },
    {
      category: "CLOUD & DEVOPS",
      skills: ["Docker", "DigitalOcean", "AWS", "CI/CD Pipelines", "Linux", "Nginx"]
    },
    {
      category: "BLOCKCHAIN & WEB3",
      skills: ["Solana", "Solidity", "Ethers.js", "ICP (Internet Computer)", "Foundry", "Smart Contracts"]
    },
    {
      category: "AI & AUTOMATION",
      skills: ["AI Agent Systems", "LLM Integration", "Workflow Automation", "WhatsApp Automation (Baileys + Meta API)", "Telegram Bots"]
    },
    {
      category: "CREATIVE & DESIGN",
      skills: ["Figma", "Adobe XD", "Adobe Photoshop", "CorelDraw"]
    },
    {
      category: "OFFICE & PRODUCTIVITY",
      skills: ["Microsoft Office", "Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint"]
    },
    {
      category: "TOOLS & PLATFORMS",
      skills: ["Git", "GitHub", "Shopify Storefront API", "Paystack", "Google Maps API", "Postman", "VS Code"]
    }
  ] as SkillCategory[],

  projects: [
    {
      id: "geek-creations",
      title: "Geek Creations",
      subtitle: "Nigerian Print-on-Demand platform with global reach.",
      tag: "Lead Developer · Full-Stack · E-Commerce",
      description: "A Shopify-powered customization platform that lets users design and order branded merchandise — apparel, cups, caps, and more — through an online editor. Accepts fiat, card, and cryptocurrency payments, enabling both local delivery across Nigeria and international orders.",
      status: "🟡 Active Development (Phase 2)",
      logoText: "GC",
      tech: ["React", "Shopify Storefront API", "Crypto Payments"],
      links: [
        { label: "Live Site", url: "https://geekcreations.vercel.app" },
        { label: "Case Study", url: "#" }
      ],
      meta: "TX_RATE: 1.8s // GLOBAL_DELIVERY: ENABLED",
      image: "/src/assets/images/geek_creations_mock_1781656794120.jpg"
    },
    {
      id: "icatholic-igbo",
      title: "iCatholic Igbo",
      subtitle: "Catholic missal and media platform. App Store + Play Store.",
      tag: "Contributor · React Native · 70k+ Users",
      description: "Catholic missal and Igbo liturgy media platform serving global users. Responsible for extensive database optimizations, offline audio playback components, and refactoring a large untyped codebase.",
      status: "🟢 Live",
      logoText: "IC",
      tech: ["React Native (Expo)"],
      links: [
        { label: "Live Site", url: "https://icatholicigbo.com" },
        { label: "Play Store", url: "#" }
      ],
      meta: "DL_COUNT: 70K+ // UPTIME: 99.99%",
      image: "/src/assets/images/icatholic_igbo_mock_1781656745123.jpg"
    },
    {
      id: "biddo",
      title: "Biddo",
      subtitle: "Live property auction platform with real-time bidding, heatmaps, and bidder communication.",
      tag: "Full-Stack · Real-Time · Auction Platform",
      description: "A real-time property auction platform with live tracking, heatmaps, and bidder communication, optimized to solve severe memory leaks in Dockerized Express & Next.js instances.",
      status: "🟢 Live (actual active users)",
      logoText: "BD",
      tech: ["Next.js", "Express.js", "Docker", "DigitalOcean"],
      links: [
        { label: "Web App", url: "https://web.biddo.info" },
        { label: "App Platform", url: "#" }
      ],
      meta: "REAL_TIME: active // DB_LATENCY: 12ms",
      image: "/src/assets/images/biddo_mock_1781656772702.jpg"
    },
    {
      id: "estc-tourism",
      title: "ESTC (Enugu State Tourism)",
      subtitle: "Discover and book tours across Enugu State, Nigeria.",
      tag: "Full-Stack · Tourism · Booking Platform",
      description: "A tourism discovery and booking platform showcasing tour sites, travel packages, and services across Enugu State. Built end-to-end as solo full-stack developer — from data modeling to deployment.",
      status: "🟢 Live",
      logoText: "ES",
      tech: ["React (Vite)", "Firebase"],
      links: [
        { label: "Live Site", url: "https://vite-tour.netlify.app/" }
      ],
      meta: "REGION: ENUGU // SOLO_DEV",
      image: "/src/assets/images/estc_tourism_mock_1781656783472.jpg"
    },
    {
      id: "heartzibah-shop",
      title: "Heartzibah Shop",
      subtitle: "Online storefront for baby wares and household essentials.",
      tag: "Frontend · E-Commerce · Client Work",
      description: "A frontend e-commerce build for a retail client specializing in baby wares, household utensils, appliances, and food supplies. Delivered as a contract engagement through Automated Cafe.",
      status: "⚪ Archived (client-owned)",
      logoText: "HZ",
      tech: ["React", "CSS", "JavaScript"],
      links: [
        { label: "Archived Portal", url: "#" }
      ],
      meta: "STATUS: COMPLETED // ARCHIVED",
      image: "/src/assets/images/heartzibah_shop_mock_1781659440604.jpg"
    },
    {
      id: "rabbai",
      title: "RabbAi",
      subtitle: "AI-powered exam preparation suite.",
      tag: "Frontend Engineer · AI & Cognitive Design",
      description: "AI exam prep platform targeting WAEC, NECO, and JAMB students, designed around highly performant custom retrieval context pipelines.",
      status: "🔴 Sunset (Blaitware)",
      logoText: "RA",
      tech: ["React", "FastAPI", "Docker"],
      links: [
        { label: "Project Brief", url: "#" }
      ],
      meta: "AI_LATENCY: 145ms",
      image: "/src/assets/images/rabbai_mock_1781659459219.jpg"
    },
    {
      id: "waplug",
      title: "WAPlug",
      subtitle: "WhatsApp CRM & automation plugin engine.",
      tag: "Founder · Lead Engineer · Automation",
      description: "Automation workflow engine linking headless WhatsApp container nodes with local CRM dispatch routines using Baileys and Meta API.",
      status: "🟢 Live",
      logoText: "WA",
      tech: ["Baileys", "Meta API", "Node.js"],
      links: [
        { label: "Live Site", url: "https://plugins-wa.onrender.com" }
      ],
      meta: "DISPATCHES: 15K/day",
      image: "/src/assets/images/waplug_mock_1781659368567.jpg"
    },
    {
      id: "sofe-platform",
      title: "SOFE Platform",
      subtitle: "Blockchain organization and core platform site.",
      tag: "Dev Lead & Software Engineer · Web3",
      description: "Decentralized ecosystem home and Telegram bot integrations powering blockchain automated transactions.",
      status: "🟢 Live",
      logoText: "SF",
      tech: ["Next.js", "Telegram Bot API", "Web3"],
      links: [
        { label: "Live Site", url: "https://sofegroup.com" }
      ],
      meta: "DOMAIN: sofegroup.com",
      image: "/src/assets/images/sofe_platform_mock_1781656729844.jpg"
    },
    {
      id: "oyadrop",
      title: "Oyadrop",
      subtitle: "Autonomous shipping and routing pipeline.",
      tag: "Freelance Software Engineer · Logistics",
      description: "Optimized shipping platform integrating local maps routing with secure Paystack billing flows.",
      status: "🟢 Live",
      logoText: "OY",
      tech: ["React", "Google Maps", "Paystack"],
      links: [
        { label: "Live Site", url: "https://oyadrop.com" }
      ],
      meta: "LATENCY: 54ms // GPS: LOCKED",
      image: "/src/assets/images/oyadrop_mock_1781659380018.jpg"
    },
    {
      id: "eb-pathway",
      title: "EB Pathway",
      subtitle: "Immigration automation and role-based workflows.",
      tag: "Freelance Software Engineer · SaaS (NDA)",
      description: "Strict role-based file-processing engine with document compiler microservices.",
      status: "🟢 Live",
      logoText: "EB",
      tech: ["React", "Node.js", "PostgreSQL"],
      links: [
        { label: "Live Site", url: "https://ebpathway.netlify.net" }
      ],
      meta: "WORKFLOWS: STRICT",
      image: "/src/assets/images/eb_pathway_mock_1781659393288.jpg"
    },
    {
      id: "inextai",
      title: "iNextAI",
      subtitle: "Emotion-aware AI crypto trading platform on the Internet Computer.",
      tag: "Contributor · Web3 · AI Trading",
      description: "Contributed feature-level development to iNextAI — a Web3 platform combining AI market analysis with emotional trading pattern tracking, built on ICP with Internet Identity authentication and cross-chain support.",
      status: "🟢 Live (contributor role)",
      logoText: "IN",
      tech: ["ICP", "Internet Identity", "Web3", "AI"],
      links: [
        { label: "Web3 App", url: "#" }
      ],
      meta: "AUTHENTICATION: II // PROTOCOL: ICP",
      image: "/src/assets/images/inext_ai_mock_1781656759832.jpg"
    }
  ] as Project[],

  certifications: [
    {
      title: "Google Professional Data Architect & AI Engineering Specialty",
      issuer: "Google Coursera",
      year: "2024",
      iconType: "google"
    },
    {
      title: "Google Advanced Systems & Security Protocols",
      issuer: "Google Coursera",
      year: "2023",
      iconType: "google"
    },
    {
      title: "Full-Stack Applied Software Engineering Career Path",
      issuer: "FreeCodeCamp",
      year: "2022",
      iconType: "free"
    },
    {
      title: "Advanced Systems Automation & Microservices API Design",
      issuer: "Codecademy",
      year: "2022",
      iconType: "code"
    },
    {
      title: "Blockchain Architecture & Smart Contract Engineering",
      issuer: "Sololearn Developer Academy",
      year: "2021",
      iconType: "solo"
    }
  ]
};
