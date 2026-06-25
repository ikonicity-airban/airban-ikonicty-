import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Info, Layers, Cpu, Mail, Sparkles } from 'lucide-react';
import { playClickSound, getAccentTextClass, getAccentBgClass } from '../../utils';

interface ScrollProgressHUDProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

interface NavSection {
  id: string;
  label: string;
  code: string;
  icon: React.ReactNode;
}

export default function ScrollProgressHUD({ accentColor }: ScrollProgressHUDProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const textAccentClass = getAccentTextClass(accentColor);
  const bgAccentClass = getAccentBgClass(accentColor);

  const getBorderAccentClassWithOpacity40 = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/40';
      case 'cyan': return 'border-[#00D4FF]/40';
      case 'pink': return 'border-[#FF007F]/40';
      case 'purple': return 'border-[#BD00FF]/40';
      case 'yellow': return 'border-[#FFE600]/40';
      default: return 'border-[#39FF14]/40';
    }
  };
  const borderAccentClass = getBorderAccentClassWithOpacity40(accentColor);

  const getShadowGlowClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_12px_#39FF14]';
      case 'cyan': return 'shadow-[0_0_12px_#00D4FF]';
      case 'pink': return 'shadow-[0_0_12px_#FF007F]';
      case 'purple': return 'shadow-[0_0_12px_#BD00FF]';
      case 'yellow': return 'shadow-[0_0_12px_#FFE600]';
      default: return 'shadow-[0_0_12px_#39FF14]';
    }
  };
  const shadowGlowClass = getShadowGlowClass(accentColor);

  const sections: NavSection[] = [
    { id: 'home', label: 'Home Deck', code: 'SEC_000', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'History Narrative', code: 'SEC_001', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills Blueprint', code: 'SEC_003', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects Bento', code: 'SEC_004', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Capabilities Map', code: 'SEC_005', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'transmit', label: 'Contact Terminal', code: 'SEC_008', icon: <Mail className="w-3.5 h-3.5" /> }
  ];

  // Scroll percent calculations
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section visibility intersecting observer calculation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Center-weighted viewport trigger
      threshold: 0
    };

    const targetElements = sections.map(s => document.getElementById(s.id)).filter(Boolean);

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    targetElements.forEach(el => observer.observe(el!));

    return () => {
      targetElements.forEach(el => observer.unobserve(el!));
    };
  }, []);

  const handleSmoothScroll = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* 1. HORIZONTAL HUD STATUS BAR - TOP FLOATING */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#0c122b] z-50 pointer-events-none">
        <motion.div 
          className={`h-full ${bgAccentClass} ${shadowGlowClass}`}
          style={{ width: `${scrollProgress}%` }}
          layoutDependency={scrollProgress}
        />
      </div>

      {/* Numerical precise progress box */}
      <div className="fixed top-6 right-6 z-40 hidden md:block font-mono text-[8px] bg-slate-950/80 border border-white/5 backdrop-blur-md px-2.5 py-1 rounded text-[#8A9BC4] pointer-events-none select-none">
        SCR_TELEMETRY: <span className="font-bold text-white pl-1">{Math.round(scrollProgress)}%</span>
      </div>

      {/* 2. DOCK COCKPIT INDEX PANEL - VERTICAL SIDE LIST */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-40 hidden xl:flex flex-col gap-4 font-mono pointer-events-none select-none">
        <div className="relative p-4 md:p-5 rounded-3xl bg-slate-950/80 boundary-lock border border-white/5 backdrop-blur-md pointer-events-auto flex flex-col space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          
          <div className="border-b border-white/10 pb-2 text-center">
            <span className="block text-[7.5px] text-slate-500 font-bold uppercase tracking-widest font-mono">SECTOR_OS</span>
            <span className={`block text-[8px] font-black uppercase tracking-wide tracking-wider pt-0.5 ${textAccentClass}`}>COCKPIT</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {sections.map((section) => {
              const active = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    playClickSound('synth');
                    handleSmoothScroll(section.id);
                  }}
                  onMouseEnter={() => playClickSound('hover')}
                  className="flex items-center gap-3.5 group cursor-pointer text-left focus:outline-hidden hover:translate-x-1.5 transition-transform duration-200"
                  title={section.label}
                >
                  {/* Ledger circle index */}
                  <div className="relative flex items-center justify-center">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? `${bgAccentClass} scale-125 ${shadowGlowClass}` : 'bg-slate-700/80 group-hover:bg-slate-400'}`} />
                    {active && (
                      <span className={`absolute w-3 h-3 rounded-full border ${borderAccentClass} animate-ping`} style={{ animationDuration: '2.4s' }} />
                    )}
                  </div>

                  {/* Text descriptions */}
                  <div className="flex flex-col leading-none">
                    <span className={`text-[9px] font-bold transition-all ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {section.code}
                    </span>
                    <span className={`text-[7px] uppercase tracking-wide transition-all ${active ? textAccentClass : 'text-slate-600 group-hover:text-slate-500'}`}>
                      {section.id}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick scroll status flag */}
          <div className="pt-2 border-t border-white/10 text-center font-mono text-[6.5px] text-slate-500 font-bold uppercase tracking-widest-sm animate-pulse">
            SYSTEM TRACKING
          </div>
        </div>
      </div>
    </>
  );
}
