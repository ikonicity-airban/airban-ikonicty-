import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Code2, 
  Cpu, 
  Sparkles,
  Layers,
  Terminal,
  Settings
} from 'lucide-react';
import { playClickSound, handleDownloadCV, getAccentTextClass, getAccentBgClass } from '../utils';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

export default function CVModal({ isOpen, onClose, accentColor }: CVModalProps) {
  
  // Disable background scrolling when modal is open
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

  if (!isOpen) return null;

  const isGreen = accentColor === 'green';
  const textAccent = getAccentTextClass(accentColor);
  const bgAccent = getAccentBgClass(accentColor);

  const getBorderAccent = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/30';
      case 'cyan': return 'border-[#00D4FF]/30';
      case 'pink': return 'border-[#FF007F]/30';
      case 'purple': return 'border-[#BD00FF]/30';
      case 'yellow': return 'border-[#FFE600]/30';
      default: return 'border-[#39FF14]/30';
    }
  };

  const getBorderAccentStrong = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]';
      case 'cyan': return 'border-[#00D4FF]';
      case 'pink': return 'border-[#FF007F]';
      case 'purple': return 'border-[#BD00FF]';
      case 'yellow': return 'border-[#FFE600]';
      default: return 'border-[#39FF14]';
    }
  };

  const getGlowShadow = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_25px_rgba(57,255,20,0.15)]';
      case 'cyan': return 'shadow-[0_0_25px_rgba(0,212,255,0.15)]';
      case 'pink': return 'shadow-[0_0_25px_rgba(255,0,127,0.15)]';
      case 'purple': return 'shadow-[0_0_25px_rgba(189,0,255,0.15)]';
      case 'yellow': return 'shadow-[0_0_25px_rgba(255,230,0,0.15)]';
      default: return 'shadow-[0_0_25px_rgba(57,255,20,0.15)]';
    }
  };

  const getPrintHeaderColor = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return '#1E9E06';
      case 'cyan': return '#0083B0';
      case 'pink': return '#D8006B';
      case 'purple': return '#9D00D8';
      case 'yellow': return '#B2A000';
      default: return '#1E9E06';
    }
  };

  const getPrintBorderColor = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return '#5aff40';
      case 'cyan': return '#4cd9ff';
      case 'pink': return '#ff4099';
      case 'purple': return '#df40ff';
      case 'yellow': return '#ffea40';
      default: return '#5aff40';
    }
  };

  const borderAccent = getBorderAccent(accentColor);
  const borderAccentStrong = getBorderAccentStrong(accentColor);
  const glowShadow = getGlowShadow(accentColor);
  
  const hColorLeft = textAccent;

  const getComplementaryAccent = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'text-[#50E4FF]'; // cyan
      case 'cyan': return 'text-[#85FF50]'; // green
      case 'pink': return 'text-[#BD00FF]'; // purple
      case 'purple': return 'text-[#FF007F]'; // pink
      case 'yellow': return 'text-[#FF007F]'; // pink
      default: return 'text-[#50E4FF]';
    }
  };
  const hColorRight = getComplementaryAccent(accentColor);

  const handlePrint = () => {
    playClickSound('success');
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop overlay blur */}
        <motion.div
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* CSS Injection to cleanly print only the CV container with nice margins and hide all background UI */}
        <span dangerouslySetInnerHTML={{__html: `
          <style>
            @media print {
              /* Hide all background website elements totally */
              body > * {
                display: none !important;
              }
              body {
                background: white !important;
                color: #0d1527 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              /* Only display printable resume element */
              #printable-cv-page-container {
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 2.5cm 2cm !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                background: white !important;
                color: #111827 !important;
                overflow: visible !important;
              }
              /* Force columns ratio in print */
              .print-columns-wrapper {
                display: flex !important;
                flex-direction: row !important;
                gap: 2.5rem !important;
                width: 100% !important;
              }
              .print-col-30 {
                flex: 0 0 30% !important;
                max-width: 30% !important;
                width: 30% !important;
              }
              .print-col-70 {
                flex: 0 0 70% !important;
                max-width: 70% !important;
                width: 70% !important;
              }
              /* Header color custom print attributes */
              .print-header-bg {
                background-color: #0f172a !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color: white !important;
              }
              .print-section-header {
                color: ${getPrintHeaderColor(accentColor)} !important;
                border-bottom: 2px solid ${getPrintBorderColor(accentColor)} !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print-bullet-point {
                color: ${getPrintHeaderColor(accentColor)} !important;
              }
              .no-print {
                display: none !important;
              }
              /* Technical tag print styling */
              .print-badge {
                border: 1px solid #cbd5e1 !important;
                background-color: #f1f5f9 !important;
                color: #334155 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                size: A4 portrait;
                margin: 0cm;
              }
            }
          </style>
        `}} />

        {/* Modal Window */}
        <motion.div
          className={`relative w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-[#050814] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between text-left ${glowShadow}`}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        >
          {/* Top Control strip */}
          <div className="p-3 sm:p-4 border-b border-white/5 bg-slate-950/50 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider no-print">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${bgAccent} animate-ping`} />
              <span className="text-white font-bold hidden xs:inline">SECURE SYSTEMS VERIFIED // CURRICULUM VITAE</span>
              <span className="text-white font-bold xs:hidden">CV VIEWER</span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#08152e] hover:bg-slate-900 text-white rounded border border-white/10 hover:border-white/20 transition-all cursor-pointer text-[10px]"
              >
                <Printer className={`w-3.5 h-3.5 ${textAccent}`} />
                <span className="hidden sm:inline">PRINT / SAVE PDF</span>
              </button>

              {/* Download raw fallback PDF */}
              <button
                onClick={() => {
                  playClickSound('success');
                  handleDownloadCV();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#08152e] hover:bg-slate-900 text-white rounded border border-white/10 hover:border-white/20 transition-all cursor-pointer text-[10px]"
              >
                <Download className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span className="hidden sm:inline">COMPAT-PDF</span>
              </button>

              <button 
                onClick={onClose}
                className="text-white hover:text-red-400 font-extrabold cursor-pointer bg-red-950/20 px-2.5 py-1.5 rounded transition-colors text-[10.5px] border border-red-500/10 hover:border-red-500/30"
              >
                [X]
              </button>
            </div>
          </div>

          {/* Core scrollable Resume Page */}
          <div className="flex-1 overflow-y-auto bg-[#03060f]/60 p-4 sm:p-8 md:p-12">
            
            <div 
              id="printable-cv-page-container"
              className="bg-[#080d1e] border border-white/5 rounded-xl shadow-2xl p-5 sm:p-10 text-[#d1d5db] font-sans overflow-hidden max-w-4xl mx-auto"
            >
              
              {/* HEADER INFORMATION BLOCK */}
              <div className="print-header-bg border-b border-slate-800 pb-6 mb-8 bg-[#0b1228]/80 -mx-5 sm:-mx-10 -mt-5 sm:-mt-10 p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-display select-text">
                    Eban Godwin Ikoni
                  </h1>
                  <p className={`text-sm tracking-[0.2em] uppercase font-mono font-bold mt-1.5 ${textAccent}`}>
                    Full-Stack Software Engineer
                  </p>
                  <p className="text-xs text-slate-400 font-medium italic mt-2 max-w-md line-clamp-2 md:line-clamp-none">
                    "I don't specialize in frameworks. I specialize in problems."
                  </p>
                </div>

                {/* Main contact details formatted nicely */}
                <div className="flex flex-col gap-2.5 text-xs text-slate-300 font-mono self-stretch md:self-auto justify-center bg-slate-950/40 md:bg-transparent p-3 rounded md:p-0 border border-white/5 md:border-none w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#8A9BC4] shrink-0" />
                    <a href="mailto:ikonicityairban@gmail.com" className="hover:underline text-white font-semibold">
                      ikonicityairban@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#8A9BC4] shrink-0" />
                    <a href="tel:08169862852" className="hover:underline text-white font-semibold">
                      08169862852
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8A9BC4] shrink-0" />
                    <span className="text-white font-semibold">Nsukka, Enugu State, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="w-3.5 h-3.5 text-[#8A9BC4] shrink-0" />
                    <a href="https://github.com/ikonicity-airban" target="_blank" rel="noreferrer" className="hover:underline text-white font-semibold">
                      github.com/ikonicity-airban
                    </a>
                  </div>
                </div>
              </div>


              {/* TWO COLUMN CONTENT STRUCTURE (Flex Ratio 0.3 Left & 0.7 Right) */}
              <div className="print-columns-wrapper flex flex-col md:flex-row gap-8 lg:gap-10">
                
                {/* ─── COLUMN 1: LEFT MINOR DETAILS (Flex 0.30/30%) ─── */}
                <div className="print-col-30 flex-1 md:flex-[0_0_31%] space-y-8 select-text">
                  
                  {/* Contacts Summary Section for Print fallback */}
                  <div className="space-y-4">
                    <h3 className="print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Contact Info</span>
                    </h3>
                    <div className="space-y-2 text-xs font-mono">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">// Email</p>
                        <p className="text-white font-medium">ikonicityairban@gmail.com</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">// Phone</p>
                        <p className="text-white font-medium">+234 816 986 2852</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">// Address</p>
                        <p className="text-white font-medium">Enugu State, Nigeria</p>
                      </div>
                    </div>
                  </div>

                  {/* Core Technical skills */}
                  <div className="space-y-4">
                    <h3 className={`print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2`}>
                      <Code2 className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Core Skills</span>
                    </h3>
                    
                    <div className="space-y-3.5">
                      <div>
                        <h4 className={`text-[10px] uppercase font-bold tracking-wider mb-1.5 ${hColorLeft}`}>
                          Languages
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {["TypeScript", "JavaScript", "Python", "Rust", "Solidity", "C", "C#"].map(s => (
                            <span key={s} className="print-badge bg-[#0a1124] text-[10px] font-mono text-[#CAD5EE] px-2 py-0.5 rounded border border-white/5 font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-[10px] uppercase font-bold tracking-wider mb-1.5 ${hColorLeft}`}>
                          Frontend Engine
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {["React", "Next.js", "React Native", "Tailwind CSS", "Framer Motion", "Three.js"].map(s => (
                            <span key={s} className="print-badge bg-[#0a1124] text-[10px] font-mono text-[#CAD5EE] px-2 py-0.5 rounded border border-white/5 font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-[10px] uppercase font-bold tracking-wider mb-1.5 ${hColorLeft}`}>
                          Backend & DB
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {["Node.js", "Bun", "Express", "Hono", "FastAPI", "PostgreSQL", "SQLite", "Redis"].map(s => (
                            <span key={s} className="print-badge bg-[#0a1124] text-[10px] font-mono text-[#CAD5EE] px-2 py-0.5 rounded border border-white/5 font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-[10px] uppercase font-bold tracking-wider mb-1.5 ${hColorLeft}`}>
                          AI & Web3 Automation
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {["AI Agents", "LLM Pipelines", "WhatsApp Automations", "Solidity Core"].map(s => (
                            <span key={s} className="print-badge bg-[#0a1124] text-[10px] font-mono text-[#CAD5EE] px-2 py-0.5 rounded border border-white/5 font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-[10px] uppercase font-bold tracking-wider mb-1.5 ${hColorLeft}`}>
                          DevOps & Cloud
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {["Docker", "Nginx", "CI/CD", "AWS", "DigitalOcean"].map(s => (
                            <span key={s} className="print-badge bg-[#0a1124] text-[10px] font-mono text-[#CAD5EE] px-2 py-0.5 rounded border border-white/5 font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications Block */}
                  <div className="space-y-4">
                    <h3 className="print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Certificates</span>
                    </h3>
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <h4 className="font-semibold text-white leading-tight">
                          Professional Data Architect & AI Specialty
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">Google / Coursera · 2024</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white leading-tight">
                          Advanced Systems & Security Protocols
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">Google / Coursera · 2023</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white leading-tight">
                          Applied Software Engineering Career Path
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">FreeCodeCamp · 2022</p>
                      </div>
                    </div>
                  </div>

                  {/* Educational Degree */}
                  <div className="space-y-4">
                    <h3 className="print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Education</span>
                    </h3>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-white uppercase leading-tight text-[11px]">
                        B.Eng. Electronics & Computer Engineering
                      </h4>
                      <p className="text-[#8A9BC4] text-[11px]">University of Nigeria, Nsukka</p>
                      <p className="text-[10px] font-mono text-slate-400 italic">Class of 2018 – 2023</p>
                    </div>
                  </div>

                  {/* Languages Block */}
                  <div className="space-y-4">
                    <h3 className="print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2">
                      <Languages className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Languages</span>
                    </h3>
                    <div className="space-y-1 font-mono text-xs text-white">
                      <p className="flex justify-between">
                        <span>English</span>
                        <span className="text-[#8A9BC4]">Professional</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Igbo</span>
                        <span className="text-[#8A9BC4]">Native Speaker</span>
                      </p>
                    </div>
                  </div>

                </div>


                {/* ─── COLUMN 2: RIGHT MAJOR DETAILS (Flex 0.70/70%) ─── */}
                <div className="print-col-70 flex-1 md:flex-[0_0_65%] space-y-8 select-text">
                  
                  {/* Executive Professional Summary */}
                  <div className="space-y-3">
                    <h3 className={`print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2`}>
                      <Sparkles className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Executive Summary</span>
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300">
                      High-impact Full-Stack Software Engineer with a solid background in Electronics & Computer Engineering. Specialized in architecting and shipping complex automated systems, AI workflow optimizations, and high-performance cross-platform mobile engines. Adept at diving beneath surface-level frameworks to resolve architectural bottlenecks, critical memory leaks, and core system optimizations. Shipped production code serving over 70,000+ active users.
                    </p>
                  </div>

                  {/* Employment History Narrative */}
                  <div className="space-y-5">
                    <h3 className={`print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2`}>
                      <Briefcase className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Professional Experience</span>
                    </h3>

                    <div className="space-y-5">
                      
                      {/* Job 1 */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <h4 className={`text-[13.5px] font-black uppercase text-white tracking-wide`}>
                            Founder & Lead Systems Engineer
                          </h4>
                          <span className="font-mono text-[10.5px] text-[#8A9BC4] max-w-max bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
                            2024 – PRESENT
                          </span>
                        </div>
                        <h5 className="font-mono text-xs text-[#E2E8F0] mb-2 px-1 border-l-2 border-slate-500 font-bold">
                          CodeOven Technologies Inc. & Geek Creations
                        </h5>
                        <ul className="list-disc pl-4 text-[12px] text-slate-300 space-y-1.5">
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Designed and engineered a customizable Shopfy Creator API canvas interface allowing users to draft print merchandise orders smoothly.
                          </li>
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Coordinated transactional ledger handoff loops integrating bank gateways and decentralized smart contract coin transfers.
                          </li>
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Programmed headless backend Docker pipelines bridging WhatsApp chat nodes with local client CRM notification routes, moving over 15,000 requests/day.
                          </li>
                        </ul>
                      </div>

                      {/* Job 2 */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <h4 className="text-[13.5px] font-black uppercase text-white tracking-wide">
                            Freelance Software Consultant
                          </h4>
                          <span className="font-mono text-[10.5px] text-[#8A9BC4] max-w-max bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
                            2024 – PRESENT
                          </span>
                        </div>
                        <h5 className="font-mono text-xs text-[#E2E8F0] mb-2 px-1 border-l-2 border-slate-500 font-bold">
                          PWorld Concepts (iCatholic Igbo Mobile Application)
                        </h5>
                        <ul className="list-disc pl-4 text-[12px] text-slate-300 space-y-1.5">
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Refactored untyped, legacy React Native codebase to TypeScript, ensuring strict structural type integrity.
                          </li>
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Implemented robust SQLite schema migration and state managers, enabling flawless offline capability for 70k+ users.
                          </li>
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Optimized cross-platform media audio service handlers to reduce initialization playback latencies by 42%.
                          </li>
                        </ul>
                      </div>

                      {/* Job 3 */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <h4 className="text-[13.5px] font-black uppercase text-white tracking-wide">
                            Lead Developer & Software Engineer
                          </h4>
                          <span className="font-mono text-[10.5px] text-[#8A9BC4] max-w-max bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
                            2023 – 2024
                          </span>
                        </div>
                        <h5 className="font-mono text-xs text-[#E2E8F0] mb-2 px-1 border-l-2 border-slate-500 font-bold">
                          SOFE Group
                        </h5>
                        <ul className="list-disc pl-4 text-[12px] text-slate-300 space-y-1.5">
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Supervised a developers' squad designing active organizational assets and blockchain-focused portal interfaces.
                          </li>
                          <li>
                            <span className={`print-bullet-point ${textAccent} font-black mr-1`}>•</span>
                            Configured real-time webhook listener layers and automated multi-sig Telegram bot commands to secure token management.
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>

                  {/* Key Shipped Engineering Projects */}
                  <div className="space-y-4">
                    <h3 className={`print-section-header font-display font-black text-sm uppercase tracking-wider pb-1.5 border-b border-white/10 text-white flex items-center gap-2`}>
                      <Layers className="w-4 h-4 text-[#8A9BC4]" />
                      <span>Featured Systems & Deployments</span>
                    </h3>

                    <div className="space-y-4">
                      
                      {/* Project 1 */}
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-white uppercase flex items-center gap-1.5">
                          <span>Biddo Property Auction Engine</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">| Node · Next.js · Docker</span>
                        </h4>
                        <p className="text-[11.5px] text-slate-300 leading-normal mt-1">
                          A high-concurrency property bidding suite mapping instant communication layers and user activity heatmaps. Eradicated memory leaks in Node/Next container clusters running on DigitalOcean, boosting uptime and performance.
                        </p>
                      </div>

                      {/* Project 2 */}
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-white uppercase flex items-center gap-1.5">
                          <span>RabbAi Cognitive prep platform</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">| Python · FastAPI</span>
                        </h4>
                        <p className="text-[11.5px] text-slate-300 leading-normal mt-1">
                          An AI exam engine providing simulated testing environments for regional curricula. Architected retrieval contexts and fast-dispatch API vectors, capping average request response at 145ms.
                        </p>
                      </div>

                      {/* Project 3 */}
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-white uppercase flex items-center gap-1.5">
                          <span>Oyadrop Route Handler</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">| React · Google Maps API</span>
                        </h4>
                        <p className="text-[11.5px] text-slate-300 leading-normal mt-1">
                          A logistics pipeline deploying optimal transit dispatch routines over local maps layouts, integrated with secure Paystack gateway processing.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Persistent Footer telemetry bar */}
          <div className="p-3 bg-slate-950/40 border-t border-white/5 flex items-center justify-between text-[#8A9BC4] font-mono text-[8.5px] tracking-wider no-print">
            <span>RESUME COMPILER STACK // SECURE V2 CONTRACT BIND</span>
            <span>A4 PRINT COMPLIANT [595x841 PT]</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
