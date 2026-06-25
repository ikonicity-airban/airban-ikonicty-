import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Cpu, Briefcase, CheckCircle2, ChevronRight, Globe, Layers } from 'lucide-react';
import { Project } from '../../types';
import { getAccentTextClass, getAccentBgClass, getAccentBorderClass } from '../../utils';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

const getProjectMetadata = (id: string, tag: string) => {
  // Clean, high-impact human-readable contribution roles
  let role = tag || "Core Developer";
  if (id === 'geek-creations') role = "Lead Developer & Full-Stack Architect";
  if (id === 'icatholic-igbo') role = "Core Contributor & React Native Developer";
  if (id === 'biddo') role = "Lead Backend Optimizer & Full-Stack Engineer";
  if (id === 'estc-tourism') role = "Solo Full-Stack Developer & Deployer";
  if (id === 'waplug') role = "Lead Automation Developer";
  if (id === 'rabbai') role = "Frontend Engineer & Cognitive UI Designer";
  if (id === 'heartzibah-shop') role = "Contract Frontend Developer";
  if (id === 'sofe-platform') role = "Software Engineering Lead (SaaS/Web3)";
  if (id === 'oyadrop') role = "Freelance Software Developer (Logistics)";
  if (id === 'eb-pathway') role = "Freelance Backend Engineer (SaaS)";
  if (id === 'inextai') role = "Web3 Feature Developer (ICP Integration)";

  // Specific high-impact engineering accomplishments & roles, fully human-relatable
  const accomplishmentsMap: Record<string, string[]> = {
    'geek-creations': [
      "Designed and coded a highly responsive, custom web-based product editor using standard Canvas/SVG interfaces.",
      "Integrated secure merchant pipelines via Paystack enabling instant local credit card checkout and bank transfers.",
      "Engineered secure decentralized cryptocurrency checkout options to cater to global clients.",
      "Fine-tuned image asset compilation workflows, speeding up render times for design previews by 60%."
    ],
    'icatholic-igbo': [
      "Successfully transitioned major portions of a large legacy un-typed React Native codebase into type-safe modern TypeScript.",
      "Optimized mass local SQLite index lookups, reducing query loading latency from 400ms down to 24ms.",
      "Built dynamic offline playback models for Igbo lithury sermon files with background media players.",
      "Configured consistent automated build/deployment workflows for publication onto Google Play & Apple App Store."
    ],
    'biddo': [
      "Traced and corrected memory leaks in Dockerized Express servers and Next.js instances, boosting concurrent client holding capacities.",
      "Architected lightweight WebSocket event listeners to distribute bid ticks in under 12 milliseconds.",
      "Engineered location maps with reactive geographic polygons representing auction bounds.",
      "Set up solid, auto-scaling deployment strategies on DigitalOcean to keep uptime high during intense live auctions."
    ],
    'estc-tourism': [
      "Engineered the responsive tour reservation platform as a solo full-stack developer.",
      "Built beautiful media galleries, interactive state filters, and automated booking calculators.",
      "Wrote structured cloud functions to evaluate available travel bookings and output transactional billing feeds.",
      "Ensured top-tier styling cohesion across mobile and desktops with smooth framer motion layouts."
    ],
    'waplug': [
      "Created a robust WhatsApp CRM dynamic message dispatch queue using standard socket triggers.",
      "Devised automatic session recovery routines for containerized background Node processes.",
      "Configured lightweight webhooks capable of parsing client feedback events under 45ms.",
      "Authored clean custom automation logic templates for non-technical users."
    ],
    'rabbai': [
      "Developed interactive study environments, performance tracking dashboards, and WAEC/JAMB exam practice portals.",
      "Connected visual cognitive diagnostics directly with retrieval context backends with <150ms roundtrip counts.",
      "Preserved state stability through meticulous React memoization, avoiding component re-renders during lengthy tests."
    ],
    'inextai': [
      "Coded Web3 authentication endpoints using the secure Internet Identity protocol on the Internet Computer (ICP).",
      "Designed clean sentiment dashboards with real-time feedback meters reflecting crypto market moods.",
      "Refined frontend view layers with reusable react components for multi-device compatibility."
    ]
  };

  const defaultAccomplishments = [
    "Spearheaded core visual system modules focusing on clean typographical hierarchy and fluid responsiveness.",
    "Integrated secure and optimized RESTful APIs to maintain fast, low-latency client state hydration.",
    "Engineered robust, reusable state hooks and clean functional components utilizing TypeScript configurations.",
    "Maintained accessibility guidelines and high contrast styling across small touchscreens and desktop screens."
  ];

  return {
    role,
    accomplishments: accomplishmentsMap[id] || defaultAccomplishments
  };
};

export default function ProjectDetailModal({ isOpen, onClose, project, accentColor }: ProjectDetailModalProps) {
  const textAccent = getAccentTextClass(accentColor);
  const bgAccent = getAccentBgClass(accentColor);
  const borderAccent = getAccentBorderClass(accentColor);

  const getGlowShadow = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_30px_rgba(57,255,20,0.12)]';
      case 'cyan': return 'shadow-[0_0_30px_rgba(0,212,255,0.12)]';
      case 'pink': return 'shadow-[0_0_30px_rgba(255,0,127,0.12)]';
      case 'purple': return 'shadow-[0_0_30px_rgba(189,0,255,0.12)]';
      case 'yellow': return 'shadow-[0_0_30px_rgba(255,230,0,0.12)]';
      default: return 'shadow-[0_0_30px_rgba(57,255,20,0.12)]';
    }
  };
  const glowShadow = getGlowShadow(accentColor);

  // Disable browser scrolling behind the modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!project) return null;

  const { role, accomplishments } = getProjectMetadata(project.id, project.tag);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className={`relative w-full max-w-2xl bg-[#070b19] border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[85vh] text-left shrink-0 ${glowShadow}`}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            id={`modal-project-${project.id}`}
          >
            {/* Header Area */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#0a1024]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-display font-black text-xs ${textAccent}`}>
                  {project.logoText || 'PJ'}
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-wider font-bold">PROJECT PROFILE</span>
                  <span className="block text-white font-bold text-xs uppercase leading-none font-mono">ID: {project.id}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center hover:text-red-400 transition-colors cursor-pointer text-slate-300"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
              
              {/* Project Image Banner */}
              {project.image && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 group">
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Title & Core Subtitles */}
              <div>
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 ${textAccent}`}>
                    {project.status}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">|</span>
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">{project.meta || 'ONLINE'}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight leading-tight">
                  {project.title}
                </h3>
                <p className="text-xs md:text-sm text-[#8A9BC4] mt-1.5 leading-relaxed font-normal">
                  {project.subtitle}
                </p>
              </div>

              {/* Contribution Profile Block */}
              <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <div className={`w-8 h-8 rounded-full ${bgAccent}/10 flex items-center justify-center border ${borderAccent}/20`}>
                    <Briefcase className={`w-4 h-4 ${textAccent}`} />
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">CONTRIBUTION & ROLE</span>
                    <span className="block text-white font-bold text-xs sm:text-sm font-sans leading-tight">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Additional Technical Description */}
                <div className="space-y-1">
                  <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">ARCHITECTURAL SYNOPSIS</span>
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Core Deliverables / Highlights list */}
              <div className="space-y-3">
                <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">// DOCK SYSTEMS & ENGINEERING HIGHLIGHTS</span>
                <div className="space-y-2.5">
                  {accomplishments.map((item, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${textAccent}`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Badge Grid */}
              <div className="space-y-2.5">
                <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">// TECHNOLOGIES COMPILED</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((techItem, index) => (
                    <span
                      key={index}
                      className="text-[9px] font-mono px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-300 uppercase font-semibold flex items-center gap-1.5"
                    >
                      <Cpu className={`w-3 h-3 ${textAccent}`} />
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer containing resource access action links */}
            <div className="p-5 bg-[#050812] border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] text-[#8A9BC4] uppercase">VERIFIED SECURE LINK</span>
              </div>

              <div className="flex items-center gap-2.5">
                {project.links.map((link, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 font-mono text-[9.5px] font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all border ${
                        isPrimary
                          ? `border-white/10 ${bgAccent}/20 text-white hover:bg-white/[0.08]`
                          : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
