import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, Github, Linkedin, Twitter, MessageSquare, Compass, ArrowUpRight, Sparkles, Command, Globe, Activity, Cpu } from 'lucide-react';
import Logo from '../shared/Logo';
import { playClickSound, getAccentHex, getAccentTextClass, getAccentBgClass, getAccentBorderClass } from '../../utils';

interface FooterSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  onOpenAdmin?: () => void;
  availabilityStatus?: string;
}

export default function FooterSection({ accentColor, onOpenAdmin, availabilityStatus }: FooterSectionProps) {
  const isGreen = accentColor === 'green';
  const textAccentClass = getAccentTextClass(accentColor);
  const borderAccentClass = getAccentBorderClass(accentColor);
  const accentHex = getAccentHex(accentColor);

  const getOpacityRgba = (color: typeof accentColor, opacity: number) => {
    switch (color) {
      case 'green': return `rgba(57, 255, 20, ${opacity})`;
      case 'cyan': return `rgba(0, 212, 255, ${opacity})`;
      case 'pink': return `rgba(255, 0, 127, ${opacity})`;
      case 'purple': return `rgba(189, 0, 255, ${opacity})`;
      case 'yellow': return `rgba(255, 230, 0, ${opacity})`;
      default: return `rgba(57, 255, 20, ${opacity})`;
    }
  };

  const getBadgeClasses = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'bg-[#39FF14]/5 border-[#39FF14]/15 text-[#39FF14]';
      case 'cyan': return 'bg-[#00D4FF]/5 border-[#00D4FF]/15 text-[#00D4FF]';
      case 'pink': return 'bg-[#FF007F]/5 border-[#FF007F]/15 text-[#FF007F]';
      case 'purple': return 'bg-[#BD00FF]/5 border-[#BD00FF]/15 text-[#BD00FF]';
      case 'yellow': return 'bg-[#FFE600]/5 border-[#FFE600]/15 text-[#FFE600]';
      default: return 'bg-[#39FF14]/5 border-[#39FF14]/15 text-[#39FF14]';
    }
  };

  // Back to top function
  const scrollToTop = () => {
    playClickSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Easter egg: Konami code check
  const [konamiProgress, setKonamiProgress] = useState<number>(0);
  const [easterEggActive, setEasterEggActive] = useState<boolean>(false);
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expected = konamiSequence[konamiProgress];
      if (e.key === expected) {
        const next = konamiProgress + 1;
        setKonamiProgress(next);
        if (next === konamiSequence.length) {
          setEasterEggActive(true);
          playClickSound('success');
          setKonamiProgress(0);
        }
      } else {
        setKonamiProgress(e.key === 'ArrowUp' ? 1 : 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiProgress]);

  // Command prompt emulator lines
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'IKONICITY CORE PORTFOLIO DECK (V1.0.0)',
    'Type "help" to list protocols and access nodes.'
  ]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const trimmed = currentInput.trim().toLowerCase();
    let reply = `Command not recognized: "${trimmed}". Type "help" or "ls" for lists.`;

    if (trimmed === 'help') {
      reply = 'Available protocols: "about", "skills", "projects", "contact", "clear", "matrix".';
    } else if (trimmed === 'about') {
      reply = 'Eban Godwin Ikoni - Electronics & Computer Engineer specialized in full-stack web and systems architectures.';
    } else if (trimmed === 'skills') {
      reply = 'TypeScript, React, Node.js, Express, Hono, C#, Python, Solidity, Web3 integration.';
    } else if (trimmed === 'projects') {
      reply = 'Type "projects list" inside sub-screens, or inspect standard Projects deck.';
    } else if (trimmed === 'contact') {
      reply = 'Email routing link: ikonicityairban@gmail.com.';
    } else if (trimmed === 'clear') {
      setTerminalLines([]);
      setCurrentInput('');
      return;
    } else if (trimmed === 'matrix') {
      reply = 'Transmitting subnet coordinates... Matrix code overrides injected successfully.';
    }

    setTerminalLines(prev => [...prev, `> ${currentInput}`, reply]);
    setCurrentInput('');
    playClickSound('synth');
  };

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines]);

  return (
    <footer 
      className="relative w-full bg-[#050816] mt-16 border-t overflow-hidden transition-all duration-300"
      style={{
        borderColor: getOpacityRgba(accentColor, 0.12)
      }}
    >
      
      {/* Absolute top neon line that fades out at edges */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70 pointer-events-none z-10 transition-all duration-300" 
        style={{
          background: `linear-gradient(to right, transparent 5%, ${accentHex} 50%, transparent 95%)`,
          boxShadow: `0 0 15px ${accentHex}`
        }}
      />

      {/* Decorative ambient backdrop light spot */}
      <div 
        className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-[120px] pointer-events-none opacity-20 transition-all duration-500"
        style={{
          background: accentHex
        }}
      />

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* COLUMN 1: BRAND COCKPIT */}
          <div className="space-y-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors relative group/card">
            <div className="absolute top-3 right-4 font-mono text-[7px] text-[#4A5A80] tracking-widest uppercase">
              SYS // CARD_01
            </div>

            <div className="flex items-center gap-3">
              <Logo size={40} showText={false} glow={true} accentColor={accentColor} />
              <div className="text-left">
                <span className="font-display font-black text-white text-base tracking-[0.25em] leading-none uppercase block">
                  AIRBAN
                </span>
                <span className="text-[8px] font-mono text-[#8A9BC4] uppercase block mt-1 tracking-wider">
                  SYSTEM PORTFOLIO OS
                </span>
              </div>
            </div>

            <p className="font-mono text-[11px] text-[#8A9BC4] leading-relaxed">
              We engineer secure, high-latency-immune full-stack systems and automated intelligent workflows.
            </p>

            {/* Pulsing Availability widget synced */}
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg w-fit border transition-all ${
              availabilityStatus === 'busy' 
                ? 'bg-amber-400/5 border-amber-400/15 text-amber-400' 
                : getBadgeClasses(accentColor)
            }`}>
              <div className="relative flex h-1.5 w-1.5 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  availabilityStatus === 'busy' ? 'bg-amber-400' : getAccentBgClass(accentColor)
                }`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  availabilityStatus === 'busy' ? 'bg-amber-400' : getAccentBgClass(accentColor)
                }`}></span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
                {availabilityStatus === 'busy' ? 'BUSY ON CORE BINDINGS' : 'AVAILABLE FOR RECRUIT'}
              </span>
            </div>
          </div>

          {/* COLUMN 2: INTERNAL LINKS */}
          <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors relative group/card">
            <div className="absolute top-3 right-4 font-mono text-[7px] text-[#4A5A80] tracking-widest uppercase">
              SECT // CARD_02
            </div>

            <span className="block font-mono text-[9px] tracking-widest font-bold uppercase" style={{ color: accentHex }}>
              &gt;_ DECK COMPASS
            </span>
            <ul className="space-y-2.5 font-accent text-xs font-semibold text-[#8A9BC4]" style={{ fontFamily: "'Syne', sans-serif" }}>
              {[
                { name: 'Cockpit Deck', href: '#home' },
                { name: 'Core Biography', href: '#about' },
                { name: 'Weaponry / Skills', href: '#skills' },
                { name: 'Systems Registry', href: '#projects' },
                { name: 'Work Records', href: '#experience' }
              ].map((link, idx) => (
                <li key={idx}>
                  <motion.a 
                    whileHover={{ x: 4, color: '#FFFFFF' }}
                    onClick={() => playClickSound('hover')}
                    href={link.href} 
                    className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-30" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: SELECTED PROTOCOLS */}
          <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors relative group/card">
            <div className="absolute top-3 right-4 font-mono text-[7px] text-[#4A5A80] tracking-widest uppercase">
              CASE // CARD_03
            </div>

            <span className="block font-mono text-[9px] tracking-widest font-bold uppercase" style={{ color: accentHex }}>
              &gt;_ SELECTED WORK
            </span>
            <ul className="space-y-2.5 font-accent text-xs font-semibold text-[#8A9BC4]" style={{ fontFamily: "'Syne', sans-serif" }}>
              {[
                { name: 'Geek Creations', id: 'geek_creations' },
                { name: 'iCatholic Igbo App', id: 'icatholic' },
                { name: 'Biddo Auctions Web3', id: 'biddo' },
                { name: 'Oyadrop Automation', id: 'oyadrop' },
                { name: 'Giga Agent WhatsApp', id: 'whatsapp' }
              ].map((link, idx) => (
                <li key={idx}>
                  <motion.a 
                    whileHover={{ x: 4, color: '#FFFFFF' }}
                    onClick={() => playClickSound('hover')}
                    href="#projects" 
                    className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-30" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: TRANSMIT PULL */}
          <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors relative group/card">
            <div className="absolute top-3 right-4 font-mono text-[7px] text-[#4A5A80] tracking-widest uppercase">
              COMMS // CARD_04
            </div>

            <span className="block font-mono text-[9px] tracking-widest font-bold uppercase" style={{ color: accentHex }}>
              &gt;_ SECURE RELAY
            </span>
            
            <p className="font-mono text-[10px] text-[#8A9BC4] leading-relaxed">
              Inquire regarding bespoke system developments, enterprise automations, or technical leadership.
            </p>

            <div className="space-y-2 pt-2">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playClickSound('success');
                }}
                href="#contact"
                className="w-full text-center py-2.5 border text-[10px] font-accent font-extrabold uppercase tracking-widest transition-all duration-300 block cursor-pointer rounded-lg px-2"
                style={{
                  borderColor: getOpacityRgba(accentColor, 0.25),
                  color: accentHex,
                  fontFamily: "'Syne', sans-serif"
                }}
              >
                Relay New Project ↗
              </motion.a>
            </div>
          </div>

        </div>

        {/* BOTTOM METADATA RAIL */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <span className="font-mono text-[10px] text-[#4A5A80]">
              © {new Date().getFullYear()} EBAN GODWIN IKONI.
            </span>
            <div className="hidden sm:block h-3 w-[1px] bg-white/5" />
            <span className="font-mono text-[9px] text-[#4A5A80] uppercase tracking-widest">
              SECURED DEPLOYMENT CODENAME: AIRBAN_OVEN
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* System Admin Trigger */}
            {onOpenAdmin && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  playClickSound('success');
                  onOpenAdmin();
                }}
                className="w-9 h-9 border border-white/5 rounded-xl flex items-center justify-center text-[#8A9BC4] hover:bg-white/[0.02] transition-colors cursor-pointer"
                title="Open system core logs terminal"
                aria-label="Admin console"
              >
                <Cpu className="w-4 h-4" />
              </motion.button>
            )}

            {/* Scroll to topmost cockpit helper */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={scrollToTop}
              className="w-9 h-9 border border-white/5 rounded-xl flex items-center justify-center text-[#8A9BC4] hover:bg-white/[0.02] transition-all cursor-pointer"
              title="Return to topmost cockpit deck"
              aria-label="Scroll to top"
              style={{
                borderColor: getOpacityRgba(accentColor, 0.15)
              }}
            >
              <ChevronUp className={`w-4 h-4 ${textAccentClass}`} />
            </motion.button>
          </div>
        </div>

      </div>

      {/* EASTER EGG KONAMI TERMINAL FLYOUT */}
      <AnimatePresence>
        {easterEggActive && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="fixed bottom-0 left-0 right-0 h-[240px] z-[99] bg-[#050816] border-t p-6 flex flex-col justify-between font-mono shadow-[0_-15px_40px_rgba(57,255,20,0.15)] text-left"
            style={{
              borderColor: accentHex,
              boxShadow: `0 -15px 40px ${getOpacityRgba(accentColor, 0.15)}`
            }}
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-[#8A9BC4] uppercase tracking-widest font-extrabold font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                SYSTEM ACCESS TERMINAL COCKPIT Override_
              </span>
              <button 
                onClick={() => setEasterEggActive(false)}
                className="text-white hover:text-red-400 hover:scale-110 font-bold transition-all px-2 py-0.5 border border-white/10 rounded cursor-pointer"
              >
                CLOSE [ESC]
              </button>
            </div>

            {/* Screen Logs Output */}
            <div className="flex-grow overflow-y-auto font-mono text-[11px] leading-relaxed text-[#CAD5EE] my-3 space-y-1 scrollbar-thin">
              {terminalLines.map((line, idx) => (
                <div key={idx} className={line.startsWith('>') ? `${textAccentClass} font-bold` : 'text-[#8A9BC4]'}>
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Action bar */}
            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <span className={`font-mono text-xs font-bold leading-none self-center ${textAccentClass}`}>
                &gt;_ 
              </span>
              <input 
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Inquire about system metrics... (about, skills, contact, clear)"
                className="flex-grow bg-white/5 text-xs text-[#E5E9F0] border-0 placeholder:text-[#4A5A80] focus:ring-1 p-2 rounded focus:ring-white/10 outline-none"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
