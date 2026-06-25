import { motion } from 'motion/react';
import { Layers, Database, Cpu, Cloud, Link as LinkIcon, Compass, Play } from 'lucide-react';
import { getAccentHex, getAccentTextClass, getAccentBgClass, getViaColorClass } from '../../utils';
// @ts-ignore
import servicesBg from '../../assets/images/services_bg_1782142266947.jpg';

interface ServicesSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

interface ServiceCard {
  id: string; // "01", "02", etc.
  title: string;
  description: string;
  icon: any;
  deliverables: string[];
  stack: string[];
}

const services: ServiceCard[] = [
  {
    id: "01",
    title: "Full-Stack Development",
    description: "The complete build — from database schema to deployed UI. No handoffs, no gaps.",
    icon: Layers,
    deliverables: [
      "Web application architecture & development",
      "REST and GraphQL API design",
      "Database modelling and optimization",
      "Authentication, authorization, and security",
      "Deployment and hosting configuration",
      "Post-launch support and maintenance"
    ],
    stack: ["Next.js", "React", "Node.js", "Bun", "Postgres", "MongoDB", "Docker"]
  },
  {
    id: "02",
    title: "Backend Engineering",
    description: "Scalable server architecture built for performance, reliability, and growth.",
    icon: Database,
    deliverables: [
      "API design and implementation",
      "Microservices and monolith architecture",
      "Real-time systems (WebSockets, SSE)",
      "Job queues and background processing",
      "Database design and query optimization",
      "Infrastructure setup and CI/CD pipelines"
    ],
    stack: ["Node.js", "Bun", "Hono", "Express", "NestJS", "Rust", "Go", "C#"]
  },
  {
    id: "03",
    title: "AI & Automation",
    description: "Intelligent systems that reduce manual work and create operational leverage.",
    icon: Cpu,
    deliverables: [
      "AI agent design and integration",
      "LLM-powered workflow automation",
      "WhatsApp and Telegram bot development",
      "Business process automation",
      "Chatbot systems with custom knowledge bases",
      "AI-assisted CRM and communication tools"
    ],
    stack: ["OpenAI", "LangChain", "Python", "Baileys", "Meta WhatsApp API", "Telegram Bot API"]
  },
  {
    id: "04",
    title: "Cloud & DevOps",
    description: "Production infrastructure that doesn't surprise you at 2am.",
    icon: Cloud,
    deliverables: [
      "Cloud architecture design (AWS · DigitalOcean)",
      "Docker containerization and orchestration",
      "CI/CD pipeline setup",
      "Server configuration and security hardening",
      "Performance monitoring and alerting",
      "Cost optimization and scaling strategy"
    ],
    stack: ["Docker", "AWS", "DigitalOcean", "Nginx", "Linux", "GitHub Actions"]
  },
  {
    id: "05",
    title: "Blockchain Development",
    description: "Decentralized applications, smart contracts, and Web3 integrations built for reliability.",
    icon: LinkIcon,
    deliverables: [
      "Smart contract development and auditing",
      "DApp frontend integration",
      "Token and airdrop system architecture",
      "Wallet connection and transaction flows",
      "ICP (Internet Computer) development",
      "Web3 consulting and technical reviews"
    ],
    stack: ["Solidity", "Ethers.js", "Foundry", "ICP", "Motoko", "React"]
  },
  {
    id: "06",
    title: "Technical Consulting",
    description: "Senior engineering perspective without the full-time overhead.",
    icon: Compass,
    deliverables: [
      "Architecture and system design reviews",
      "Code audits and refactoring roadmaps",
      "Technology stack selection",
      "Engineering team technical direction",
      "MVP scoping and feasibility assessment",
      "Algorithm and performance optimization"
    ],
    stack: [
      "Startups preparing to scale",
      "Teams inheriting legacy codebases",
      "Founders who need a technical co-thinker"
    ]
  }
];

const processSteps = [
  { id: "01", title: "BRIEF", desc: "We define the problem and goals clearly." },
  { id: "02", title: "SCOPE", desc: "I map out the technical solution and timeline." },
  { id: "03", title: "BUILD", desc: "Clean, documented, production-grade code." },
  { id: "04", title: "SHIP", desc: "Deployed, tested, and handed over properly." }
];

export default function ServicesSection({ accentColor }: ServicesSectionProps) {
  const accentTextClass = getAccentTextClass(accentColor);
  
  const getAccentBorderLeftClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-l-2 border-l-[#39FF14]';
      case 'cyan': return 'border-l-2 border-l-[#00D4FF]';
      case 'pink': return 'border-l-2 border-l-[#FF007F]';
      case 'purple': return 'border-l-2 border-l-[#BD00FF]';
      case 'yellow': return 'border-l-2 border-l-[#FFE600]';
      default: return 'border-l-2 border-l-[#39FF14]';
    }
  };
  const accentBorderLeftClass = getAccentBorderLeftClass(accentColor);

  const getHoverBorders = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'hover:border-[#39FF14]/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]';
      case 'cyan': return 'hover:border-[#00D4FF]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]';
      case 'pink': return 'hover:border-[#FF007F]/40 hover:shadow-[0_0_20px_rgba(255,0,127,0.1)]';
      case 'purple': return 'hover:border-[#BD00FF]/40 hover:shadow-[0_0_20px_rgba(189,0,255,0.1)]';
      case 'yellow': return 'hover:border-[#FFE600]/40 hover:shadow-[0_0_20px_rgba(255,230,0,0.1)]';
      default: return 'hover:border-[#39FF14]/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]';
    }
  };
  const hoverBorders = getHoverBorders(accentColor);

  const getCtaBtnColorClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'bg-[#39FF14] text-[#050816] hover:bg-[#32e012]';
      case 'cyan': return 'bg-[#00D4FF] text-[#050816] hover:bg-[#00b2d6]';
      case 'pink': return 'bg-[#FF007F] text-[#050816] hover:bg-[#d40066]';
      case 'purple': return 'bg-[#BD00FF] text-[#050816] hover:bg-[#9900cc]';
      case 'yellow': return 'bg-[#FFE600] text-[#050816] hover:bg-[#ccb400]';
      default: return 'bg-[#39FF14] text-[#050816] hover:bg-[#32e012]';
    }
  };
  const ctaBtnColorClass = getCtaBtnColorClass(accentColor);

  const scrollToContact = () => {
    const el = document.getElementById('transmit');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="services" 
      className="py-24 border-t border-white/5 relative z-20 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${servicesBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#050816]/92 backdrop-blur-[2px] z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 text-left">
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-[0.25em] font-extrabold ${accentTextClass} block mb-2`}>
              &gt;_ SECTOR_004 // SERVICE CAPABILITIES
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight leading-none text-white uppercase">
              Operations &amp; Tech Services
            </h2>
          </div>
          <p className="text-xs text-[#8A9BC4] max-w-sm leading-relaxed font-mono">
            Fine-tuned developer deliverables customized to accelerate digital workflows and scale backend nodes.
          </p>
        </div>

        {/* 3x3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const IconComponent = svc.icon;
            return (
              <motion.div 
                key={svc.id}
                className={`p-6 bg-gradient-to-b from-white/[0.01] to-[#080D1F]/90 backdrop-blur-md border border-white/5 rounded-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[460px] ${accentBorderLeftClass} ${hoverBorders}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  {/* Card Header Label */}
                  <div className="flex items-center justify-between mb-5 font-mono text-[9px] text-[#8A9BC4]">
                    <span className="font-bold">// {svc.id}  {svc.title.toUpperCase()}</span>
                    <IconComponent className={`w-4 h-4 ${accentTextClass} shrink-0`} />
                  </div>

                  {/* Service Title */}
                  <h3 className="text-base font-display font-black text-white uppercase tracking-wider mb-2 leading-tight">
                    {svc.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#8A9BC4] leading-relaxed mb-6 font-mono">
                    {svc.description}
                  </p>

                  {/* Bullet Deliverables */}
                  <div className="space-y-2 mt-4">
                    {svc.deliverables.slice(0, 5).map((del, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#F0F4FF] leading-relaxed">
                        <span className={`text-[10px] ${accentTextClass} font-bold select-none`}>→</span>
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer stacks detail */}
                <div className="pt-4 border-t border-white/5 mt-6">
                  <span className="block text-[8px] font-mono text-slate-500 font-extrabold uppercase tracking-widest mb-2">
                    {svc.id === "06" ? "BEST FOR" : "PREFERRED TECH"}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {svc.stack.slice(0, 5).map((tech, i) => (
                      <span key={i} className="text-[9px] font-mono py-0.5 px-1.5 rounded bg-[#050816] text-[#8A9BC4] border border-white/[0.03]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Strip Section */}
        <div className="mt-20 pt-16 border-t border-white/5">
          <span className="block text-[9px] font-mono tracking-widest font-black text-slate-500 text-left uppercase mb-8">
            // OPERATIONAL WORKFLOW // PROCESS STRIP
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {processSteps.map((step) => (
              <div 
                key={step.id}
                className="p-5 rounded-xl bg-white/[0.01] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3 text-mono font-bold">
                  <span className={`text-xs ${accentTextClass}`}>{step.id}</span>
                  <span className="text-[9px] text-slate-500">// READY</span>
                </div>
                <div className="text-white font-display font-black text-sm uppercase tracking-widest mb-1">
                  {step.title}
                </div>
                <p className="text-xs text-[#8A9BC4] leading-relaxed font-mono mt-1.5">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Availability CTA */}
        <div className="mt-16">
          <div className="p-8 rounded-2xl bg-[#080D1F] border border-white/5 relative overflow-hidden text-center max-w-4xl mx-auto">
            {/* Glowing sweep overlay */}
            <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent ${getViaColorClass(accentColor)} to-transparent opacity-55 animate-pulse`} />
            
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getAccentBgClass(accentColor)} animate-ping`} />
                <span className="text-[10px] font-mono font-black uppercase text-white tracking-widest">
                  Currently available for new engagements
                </span>
              </div>
              
              <h3 className="text-lg sm:text-2xl font-display font-black text-white uppercase tracking-wider leading-none">
                Freelance · Contract · Full-Time · Remote
              </h3>

              {/* Pricing & Engagement Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-left font-mono text-[11px] max-w-3xl mx-auto border-t border-b border-white/5 py-5 my-2">
                <div className="p-3.5 rounded bg-white/[0.01] border border-white/[0.03]">
                  <span className="block text-[#8A9BC4] text-[9px] uppercase font-bold tracking-widest">// STARTING FROM</span>
                  <span className="block text-white font-extrabold text-sm mt-1">₦70,000</span>
                  <span className="block text-slate-500 text-[9px] mt-0.5">Basic 4-page website</span>
                </div>
                <div className="p-3.5 rounded bg-white/[0.01] border border-white/[0.03]">
                  <span className="block text-[#8A9BC4] text-[9px] uppercase font-bold tracking-widest">// TIMELINE</span>
                  <span className="block text-white font-extrabold text-sm mt-1">DYNAMIC</span>
                  <span className="block text-slate-500 text-[9px] mt-0.5">Project-dependent scope</span>
                </div>
                <div className="p-3.5 rounded bg-white/[0.01] border border-white/[0.03]">
                  <span className="block text-[#8A9BC4] text-[9px] uppercase font-bold tracking-widest">// RETAINERS</span>
                  <span className="block text-white font-extrabold text-sm mt-1">AVAILABLE</span>
                  <span className="block text-slate-500 text-[9px] mt-0.5">Ongoing support plans</span>
                </div>
                <div className="p-3.5 rounded bg-white/[0.01] border border-white/[0.03]">
                  <span className="block text-[#8A9BC4] text-[9px] uppercase font-bold tracking-widest">// PRICING MODEL</span>
                  <span className="block text-white font-extrabold text-xs mt-1.5 leading-snug">CUSTOM</span>
                  <span className="block text-slate-500 text-[9px] mt-0.5">No fixed public rates</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button 
                  onClick={scrollToContact}
                  className={`px-6 py-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all duration-300 ${ctaBtnColorClass} shadow-md`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start a Conversation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
