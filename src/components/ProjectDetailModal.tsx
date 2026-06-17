import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShieldAlert, Cpu, Database, Terminal, Globe, Calendar } from 'lucide-react';
import { Project } from '../types';
import { getAccentHex, getAccentTextClass, getAccentBgClass, getAccentBorderClass } from '../utils';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

export default function ProjectDetailModal({ isOpen, onClose, project, accentColor }: ProjectDetailModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'specs' | 'diagnostics'>('specs');

  const textAccent = getAccentTextClass(accentColor);
  const bgAccent = getAccentBgClass(accentColor);

  const getBorderAccentWithOpacity30 = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/30';
      case 'cyan': return 'border-[#00D4FF]/30';
      case 'pink': return 'border-[#FF007F]/30';
      case 'purple': return 'border-[#BD00FF]/30';
      case 'yellow': return 'border-[#FFE600]/30';
      default: return 'border-[#39FF14]/30';
    }
  };
  const borderAccent = getBorderAccentWithOpacity30(accentColor);

  const getGlowShadow = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_20px_rgba(57,255,20,0.15)]';
      case 'cyan': return 'shadow-[0_0_20px_rgba(0,212,255,0.15)]';
      case 'pink': return 'shadow-[0_0_20px_rgba(255,0,127,0.15)]';
      case 'purple': return 'shadow-[0_0_20px_rgba(189,0,255,0.15)]';
      case 'yellow': return 'shadow-[0_0_20px_rgba(255,230,0,0.15)]';
      default: return 'shadow-[0_0_20px_rgba(57,255,20,0.15)]';
    }
  };
  const glowShadow = getGlowShadow(accentColor);

  const getAccentHoverBg15Class = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'hover:bg-[#39FF14]/15';
      case 'cyan': return 'hover:bg-[#00D4FF]/15';
      case 'pink': return 'hover:bg-[#FF007F]/15';
      case 'purple': return 'hover:bg-[#BD00FF]/15';
      case 'yellow': return 'hover:bg-[#FFE600]/15';
      default: return 'hover:bg-[#39FF14]/15';
    }
  };

  // Backdoor key to disable scrolling behind modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Hydrate simulated diagnostic stream log
      if (project) {
        setLogs([
          `>> INITIALIZING SPEC_LINK DECK ON PIN: ${project.id.toUpperCase()}`,
          `>> HANDSHAKE CONFIRMED // ALLOCATING SYSTEM BUS PORT: 3000`,
          `>> STREAM DECRYPT: COMPLETE [1024-BIT BITPACKS]`,
          `>> INTEGRITY DIAGNOSTIC: STABLE`
        ]);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Ambient Backdrop Overlay blur */}
          <motion.div
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Core Content Modal Container */}
          <motion.div
            className={`relative w-full max-w-2xl bg-[#060a16] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between text-left ${glowShadow}`}
            initial={{ scale: 0.93, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            id={`modal-project-${project.id}`}
          >
            {/* Top header strip detailing telemetry */}
            <div className={`p-4 border-b border-white/5 bg-slate-950/40 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${bgAccent} animate-ping`} />
                <span className="text-white font-bold">NODE_LOCK_ON: {project.id}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 hidden sm:inline">TX_MODE: SECURE STREAM</span>
                <button 
                  onClick={onClose}
                  className="text-white hover:text-red-400 font-black cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors text-[10px]"
                >
                  CLOSE [X]
                </button>
              </div>
            </div>

            {/* Main Interactive Deck */}
            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto max-h-[75vh]">
              {/* Project Image Banner */}
              {project.image && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 group/img">
                  {/* Image scanline effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full top-0 left-0 animate-[scanline_4s_linear_infinite] pointer-events-none z-10 opacity-40 md:opacity-60" />
                  <img
                    src={project.image}
                    alt={`${project.title} system interface`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-102"
                  />
                  {/* Subtle vignette/glitch shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none opacity-80" />
                  <span className="absolute bottom-3 right-3 font-mono text-[7px] text-white/50 px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 tracking-wider uppercase">
                    SYS_FEED_LOCKED: SCREEN_CAP_01
                  </span>
                </div>
              )}

              {/* Project Title Block & Sub-system Category */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/5 ${textAccent}`}>
                    {project.tag.toUpperCase()}
                  </span>
                  <span className="text-slate-500 font-mono text-[9.5px]">| STATUS: {project.status.toUpperCase()}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight leading-none">
                  {project.title}
                </h3>
                <p className={`text-xs md:text-sm font-mono mt-1 font-bold ${textAccent}`}>
                  {project.subtitle}
                </p>
              </div>

              {/* Specs and Diagnostics Navigation Control */}
              <div className="flex border-b border-white/5 font-mono text-[10px] uppercase">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-4 py-2 border-b-2 font-bold cursor-pointer transition-colors ${activeTab === 'specs' ? `${getAccentBorderClass(accentColor)} text-white` : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  [01] Architectural Specs
                </button>
                <button
                  onClick={() => setActiveTab('diagnostics')}
                  className={`px-4 py-2 border-b-2 font-bold cursor-pointer transition-colors ${activeTab === 'diagnostics' ? `${getAccentBorderClass(accentColor)} text-white` : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  [02] System Diagnostics
                </button>
              </div>

              {activeTab === 'specs' ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Detailed Description */}
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-3">
                    <span className="text-[8.5px] tracking-widest text-[#8A9BC4] uppercase font-mono block font-bold">// ARCHITECTURAL SPECIFICATION OVERVIEW</span>
                    <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack mapping */}
                  <div className="space-y-2.5">
                    <span className="text-[8.5px] tracking-widest text-slate-500 uppercase font-mono block font-bold">// COMPILED SYSTEM MODULES & API BUSES</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((techItem, index) => (
                        <span 
                          key={index} 
                          className={`text-[9px] font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300 hover:border-white/25 transition-all flex items-center gap-1.5`}
                        >
                          <Cpu className={`w-3 h-3 ${textAccent}`} />
                          {techItem.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Static Mock Design Node Topology Chart map */}
                  <div className="border border-white/5 bg-slate-950 p-4 rounded-xl font-mono text-[9px] text-[#8A9BC4] space-y-2.5">
                    <div className="flex items-center justify-between text-slate-500 border-b border-white/5 pb-1.5">
                      <span>SYSTEM ARCHITECTURE NODE TOPOLOGY</span>
                      <span className={textAccent}>OS_LEVEL: STABLE</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold">[SRC-INTEG]</span>
                        <span>───▶ [SEC_BUS:3000] ───▶ [TRANS_ENCODER] ─────</span>
                        <span className={textAccent}>[COMPILER ONLINE]</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">            └───▶ [LOCAL_DB:SYNC] ───▶ [FIREBASE COLL] ─</span>
                        <span className="text-emerald-400 font-bold">[AUTONOMOUS]</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 font-mono text-[10px] bg-slate-950 p-5 rounded-xl border border-white/5 overflow-hidden relative min-h-[180px] select-all">
                  <span className="absolute top-2 right-2 text-[7.5px] text-red-500 font-bold uppercase animate-pulse">● CAPTURE RECORDING LIVE</span>
                  <div className="text-slate-500 border-b border-white/5 pb-2 uppercase tracking-widest text-[8.5px] font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-white" />
                    <span>COCKPIT_TERMINAL // LOGS DISPATCH</span>
                  </div>
                  <div className="space-y-1.5 leading-none pt-1">
                    {logs.map((logLine, index) => (
                      <div key={index} className="flex gap-2 min-h-[14px]">
                        <span className="text-slate-600">[{index + 1}]</span>
                        <span className={index === logs.length - 1 ? 'text-white' : 'text-[#8A9BC4]'}>{logLine}</span>
                      </div>
                    ))}
                    <motion.div 
                      className="inline-block w-1.5 h-3 bg-white"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer containing direct resource access triggers */}
            <div className="p-6 bg-slate-950/50 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <span className="font-mono text-[8.5px] text-[#8A9BC4] uppercase text-left">
                {project.meta}
              </span>

              <div className="flex items-center gap-3">
                {project.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 font-mono text-[10px] font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all border ${idx === 0 ? `${borderAccent} ${bgAccent}/10 text-white ${getAccentHoverBg15Class(accentColor)}` : 'border-white/5 bg-white/5 text-[#8A9BC4] hover:text-white hover:bg-white/10'}`}
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
