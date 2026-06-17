import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'motion/react';
import { portfolioData } from '../data';
import { playClickSound, getAccentHex, getAccentTextClass, getAccentBorderClass } from '../utils';
import { Gauge, Compass, Activity, Terminal, Cpu } from 'lucide-react';

interface AboutSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

interface RoadMilestoneCardProps {
  node: typeof portfolioData.timelineData[0];
  index: number;
  scrollYProgress: any;
  isMobile: boolean;
  step: number;
  N: number;
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  accentTextClass: string;
  accentBorderClass: string;
}

function sanitizeInputRange(arr: number[]): number[] {
  // Clamp values strictly between 0 and 1
  const clamped = arr.map(v => Math.max(0, Math.min(1, v)));
  // Resolve any non-strictly-increasing elements
  for (let i = 1; i < clamped.length; i++) {
    if (clamped[i] <= clamped[i - 1]) {
      clamped[i] = clamped[i - 1] + 0.0001;
    }
  }
  // Ensure we didn't push past 1.0 at the end
  if (clamped[clamped.length - 1] > 1) {
    clamped[clamped.length - 1] = 1;
    for (let i = clamped.length - 2; i >= 0; i--) {
      if (clamped[i] >= clamped[i + 1]) {
        clamped[i] = clamped[i + 1] - 0.0001;
      }
    }
  }
  return clamped;
}

function RoadMilestoneCard({ 
  node, 
  index, 
  scrollYProgress, 
  isMobile, 
  step, 
  N, 
  accentColor, 
  accentTextClass, 
  accentBorderClass 
}: RoadMilestoneCardProps) {
  const isEven = index % 2 === 0;
  const center = 0.05 + index * step;
  
  // Calculate raw Z depth: starts close (positive z), is beautifully in focus (z=0), and slowly moves farther away into deep background (negative z)
  const z = useTransform(
    scrollYProgress,
    sanitizeInputRange([
      center - 0.45 * step,
      center - 0.25 * step,
      center + 0.1 * step,
      center + 0.35 * step
    ]),
    [320, 100, -180, -1500],
    { clamp: true }
  );

  // Set precise fade timing: starts invisible, quickly fades in as it appears full-width, remains full opacity while scrolling active zone, and fades out as it dissolves deep in the background
  const opacity = useTransform(
    scrollYProgress,
    sanitizeInputRange([
      center - 0.45 * step,
      center - 0.25 * step,
      center + 0.1 * step,
      center + 0.35 * step
    ]),
    [0.0, 1.0, 1.0, 0.0],
    { clamp: true }
  );

  // Discrete structural scale transformation: appearing full size at first (1.0), and shrinking down as it recedes (0.15)
  const scale = useTransform(
    scrollYProgress,
    sanitizeInputRange([
      center - 0.45 * step,
      center - 0.25 * step,
      center + 0.1 * step,
      center + 0.35 * step
    ]),
    [0.75, 1.0, 0.75, 0.15],
    { clamp: true }
  );

  // No overlapping lateral offsets — keeping cards perfectly centered for cinematic highway alignment
  const x = useTransform(
    scrollYProgress,
    sanitizeInputRange([center - 0.5 * step, center, center + 0.5 * step]),
    [0, 0, 0],
    { clamp: true }
  );

  const yVal = isMobile ? -50 : -80; // Sit cleanly above the rotated grid plane
  const primaryAccentHex = getAccentHex(accentColor);
  
  return (
    <motion.div
      style={{
        opacity,
        scale,
        x,
        y: yVal,
        z,
        transformStyle: 'preserve-3d',
      }}
      className="absolute h-fit w-[280px] md:w-[350px] pointer-events-auto select-none"
    >
      <div 
        onClick={() => playClickSound('click')}
        onMouseEnter={() => playClickSound('hover')}
        className={`p-5 rounded-2xl bg-[#050918]/98 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden cursor-pointer hover:border-white/35 active:scale-[0.99] select-none ${accentBorderClass} border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.95),inset_0_1px_4px_rgba(255,255,255,0.2)]`}
      >
        {/* Hologram aesthetic line indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold uppercase py-0.5 px-2 rounded bg-white/5 border border-white/10 text-white leading-none">
              {node.period}
            </span>
            <span className="text-[8px] font-mono tracking-widest text-[#8A9BC4] uppercase">
              // ROAD_NODE_0{index + 1}
            </span>
          </div>
          <span className="text-[8px] font-mono tracking-wider text-slate-500 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            LIVE
          </span>
        </div>

        <h3 className="text-sm md:text-base font-display font-black text-white uppercase tracking-tight leading-tight mb-1">
          {node.role}
        </h3>

        <div className={`font-mono text-[10px] font-black uppercase tracking-wider ${accentTextClass}`}>
          {node.company}
        </div>

        <p className="text-[10px] md:text-xs text-[#8A9BC4] leading-relaxed mt-4 font-sans font-normal border-t border-dashed border-white/5 pt-3.5">
          {index === 0 && "Acquired basic framework and architectural patterns across signal logic, operational systems, and network communication block modules."}
          {index === 1 && "Configured digital communication terminals, handled custom remote server nodes, automated file delivery routines, and managed secure data processing."}
          {index === 2 && "Wrote initial technical modules. Graduated directly from fundamental procedural execution setups to rich modern reactive programming flows."}
          {index === 3 && "Engineered clean responsive frontpage UI layouts, decoupled state machines, and designed fluid web flows with optimized performance."}
          {index === 4 && "Built high-performance user grids and customized retrieval setups to interface robustly with RabbAi cognitive tutoring agents."}
          {index === 5 && "Supervised full product life cycles. Led engineering deployments, engineered high-density Telegram integrations and secure WhatsApp CRM communication pipes."}
          {index === 6 && "Optimized audio playing elements, eliminated platform sound memory leaks, and refined database querying systems inside a 70,000+ user application."}
          {index === 7 && "Shipped automation backends to compile role-based workflow applications and resolved memory constraints on cloud instances."}
          {index === 8 && "Spearheading modern engineering tasks. Shifting print-on-demand custom editors towards streamlined Shopify pipelines and container deployments."}
        </p>

        {/* Bottom decorative glowing runner */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${primaryAccentHex}, transparent)`,
            boxShadow: `0 0 10px ${primaryAccentHex}`
          }}
        />
      </div>
    </motion.div>
  );
}

export default function AboutSection({ accentColor }: AboutSectionProps) {
  const [isInView, setIsInView] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [, setRandomTick] = useState(0);

  const [activePillar, setActivePillar] = useState(0);

  // Autonomous continuous loop for Philosophy Pillars carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % portfolioData.philosophyPillars.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activePillar]);

  const pillarsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pillarScroll } = useScroll({
    target: pillarsRef,
    offset: ["start end", "end start"]
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3D Roadmap Scrollytelling Setup
  const roadScrollTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: roadScrollYProgress } = useScroll({
    target: roadScrollTrackRef,
    offset: ["start start", "end end"]
  });

  const roadBgY = useTransform(roadScrollYProgress, [0, 1], ["0px", "-2400px"]);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [scrollingSpeed, setScrollingSpeed] = useState(120);

  const N = portfolioData.timelineData.length;
  const step = 0.90 / (N - 1);

  useMotionValueEvent(roadScrollYProgress, "change", (latestVal) => {
    let bestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < N; i++) {
      const center = 0.05 + i * step;
      const diff = Math.abs(latestVal - center);
      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = i;
      }
    }
    if (bestIndex !== activeCardIndex) {
      setActiveCardIndex(bestIndex);
    }
  });

  // Dynamic Speedometer scroll tracker
  useEffect(() => {
    let lastPos = window.scrollY;
    let lastT = Date.now();
    
    const handleScroll = () => {
      const currPos = window.scrollY;
      const currT = Date.now();
      const dt = Math.max(1, currT - lastT);
      const dp = Math.abs(currPos - lastPos);
      
      const velocity = dp / dt;
      const targetSpeed = Math.min(280, 120 + Math.floor(velocity * 90));
      
      setScrollingSpeed(prev => {
        return Math.floor(prev + (targetSpeed - prev) * 0.15);
      });
      
      lastPos = currPos;
      lastT = currT;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const decay = setInterval(() => {
      setScrollingSpeed(prev => {
        if (prev > 120) return Math.max(120, prev - 4);
        return 120;
      });
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(decay);
    };
  }, [scrollingSpeed]);

  // Map vertical scroll of the philosophies card container to horizontal translation (right to left)
  const xTrack = useTransform(pillarScroll, [0, 0.85], [120, -360]);

  const accentTextClass = getAccentTextClass(accentColor);
  const accentBorderClass = getAccentBorderClass(accentColor);

  // Concat all texts to design a single integrated animation stream
  const paragraphs = portfolioData.aboutNarrative;
  const quote = portfolioData.pullQuote;
  const segments = [...paragraphs, quote];
  
  // Pre-calculate cumulative lengths
  const segmentLengths = segments.map(s => s.length);
  const cumulativeLengths: number[] = [];
  let currentSum = 0;
  for (const len of segmentLengths) {
    cumulativeLengths.push(currentSum);
    currentSum += len;
  }
  const totalLength = currentSum;

  useEffect(() => {
    if (!isInView) return;

    const charsPerTick = 7; // Speed of decryption
    const intervalTime = 16; // 60fps update matching
    
    const interval = setInterval(() => {
      setGlobalProgress(prev => {
        if (prev >= totalLength + 15) {
          clearInterval(interval);
          return totalLength + 15;
        }
        return prev + charsPerTick;
      });
      // Force scrambler re-renders on trailing edge
      setRandomTick(t => t + 1);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isInView, totalLength]);

  // Helper to slice paragraph stream correctly based on global progress meter
  const getRenderParts = (index: number) => {
    const text = segments[index];
    const startOffset = cumulativeLengths[index];
    const progressInSegment = globalProgress - startOffset;

    if (progressInSegment <= 0) {
      return { revealed: "", scrambled: "" };
    }

    const revealedLength = Math.min(text.length, progressInSegment);
    const revealed = text.slice(0, revealedLength);

    // Matrix glitch glyph symbols
    const scrambleChars = "✕▢▰▱▲▼○●✦✧░▒▓█▄▀■";
    const scrambleCount = Math.min(index === 0 ? 3 : 2, text.length - revealedLength);
    const scrambled = Array.from({ length: scrambleCount }, () => 
      scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
    ).join("");

    return { revealed, scrambled };
  };

  return (
    <section id="about" className="py-20 border-t border-white/5 relative z-10 bg-[#050816]">
      <motion.div 
        className="max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        onViewportEnter={() => setIsInView(true)}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        {/* Narratives Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0a0f26] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_3px_rgba(255,255,255,0.12)] relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <span className={`text-[10px] uppercase font-mono tracking-[0.25em] font-extrabold ${accentTextClass} block`}>
                &gt;_ SECTOR_001 // NARRATIVE DECK
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight leading-none text-white uppercase">
                The Journey of Eban Godwin Ikoni
              </h2>

              {/* Narrative Paragraphs with Unified Text Scramble Sweeps */}
              <div className="text-xs sm:text-sm text-[#8A9BC4] space-y-4 font-normal leading-relaxed">
                {paragraphs.map((_, index) => {
                  const { revealed, scrambled } = getRenderParts(index);
                  return (
                    <p 
                      key={index} 
                      className={index === 0 ? `text-white font-bold text-sm sm:text-base border-l-2 pl-3.5 ${getAccentBorderClass(accentColor)}` : ""}
                    >
                      <span>{revealed}</span>
                      <span className={`${getAccentTextClass(accentColor)} font-mono tracking-wider ml-0.5`}>
                        {scrambled}
                      </span>
                    </p>
                  );
                })}
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-4 mt-4">
              <blockquote className={`italic border-l-2 ${getAccentBorderClass(accentColor)} pl-4 text-white text-xs sm:text-sm font-mono tracking-wide py-2 bg-white/[0.01] rounded-r-xl`}>
                "
                {(() => {
                  const { revealed, scrambled } = getRenderParts(paragraphs.length);
                  return (
                    <>
                      <span>{revealed}</span>
                      <span className={`${getAccentTextClass(accentColor)} ml-0.5`}>{scrambled}</span>
                    </>
                  );
                })()}
                "
              </blockquote>
            </div>
          </div>

          {/* Philosophy & Active Pursuits Column */}
          <div className="lg:col-span-5 relative flex flex-col gap-6">
            
            {/* Philosophy Pillars */}
            <div 
              ref={pillarsRef}
              className={`p-6 rounded-2xl bg-[#0a0f26] border border-white/10 flex flex-col justify-between transition-all group overflow-hidden min-h-[190px] hover:border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_3px_rgba(255,255,255,0.12)]`}
              style={{ color: getAccentHex(accentColor) }}
            >
              <div>
                <span className={`text-[9px] font-mono font-black ${accentTextClass} tracking-widest uppercase mb-1`}>[ SYSTEM PHILOSOPHIES ]</span>
                <h3 className="text-sm font-display font-black text-white tracking-wider mb-4 uppercase">Three Philosophy Pillars</h3>
              </div>
              
              <div className="relative overflow-hidden w-full min-h-[90px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activePillar}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="space-y-1.5 font-mono text-left w-full shrink-0"
                  >
                    <span className="block text-white font-bold text-xs uppercase tracking-wide">
                      {portfolioData.philosophyPillars[activePillar].title}
                    </span>
                    <span className="block text-xs font-mono text-[#8A9BC4] leading-none mb-1 select-none">
                      {portfolioData.philosophyPillars[activePillar].tagline}
                    </span>
                    <span className="block text-[11px] text-[#8A9BC4] leading-normal">
                      {portfolioData.philosophyPillars[activePillar].description}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center justify-start gap-2.5 mt-4 pt-2 border-t border-white/5">
                {portfolioData.philosophyPillars.map((_, idx) => {
                  const isActive = idx === activePillar;
                  return (
                    <button
                      key={idx}
                      id={`philosophy-dot-${idx}`}
                      onClick={() => {
                        playClickSound('click');
                        setActivePillar(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${isActive ? 'w-6 bg-current' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                      style={{ color: isActive ? getAccentHex(accentColor) : undefined }}
                      aria-label={`Go to philosophy pillar ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Currently Status */}
            <div className="p-6 rounded-2xl bg-[#0a0f26] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_3px_rgba(255,255,255,0.12)] space-y-4 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-full min-h-[200px]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: getAccentHex(accentColor) }} />
                <h3 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                  ACTIVE PURSUITS // ENGAGEMENT DIAL
                </h3>
              </div>
              
              <div className="space-y-3.5 text-xs font-mono">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-extrabold">&gt;_ BUILDING</span>
                  <span className="col-span-2 text-white font-bold">{(portfolioData as any).currently?.building}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-extrabold">&gt;_ MAINTAINING</span>
                  <span className="col-span-2 text-white font-bold">{(portfolioData as any).currently?.maintaining}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-extrabold">&gt;_ CONSULTING</span>
                  <span className="col-span-2 text-white font-bold">{(portfolioData as any).currently?.consulting}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-extrabold">&gt;_ OPEN TO</span>
                  <span className="col-span-2 text-[#8A9BC4]">{(portfolioData as any).currently?.openTo}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Row 2: Symmetric Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          {/* Card 1: Lagos-Nsukka Link / Location Radar */}
          <div className="relative w-full aspect-video md:aspect-auto md:h-full min-h-[190px] rounded-2xl bg-[#0a0f26] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_3px_rgba(255,255,255,0.12)] flex flex-col justify-between p-6 overflow-hidden transition-all hover:border-white/20">
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ backgroundColor: `${getAccentHex(accentColor)}03` }}
            />
            <div className="absolute top-3 left-4 font-mono text-[8px] text-[#8A9BC4] flex items-center gap-1.5 tracking-wider uppercase">
              <span 
                className="w-1.5 h-1.5 rounded-full animate-ping" 
                style={{ backgroundColor: getAccentHex(accentColor) }}
              />
              LAGOS_NSUKKA_LINK: ACTIVE
            </div>
            
            <svg 
              className="w-20 h-20 opacity-30 absolute right-3 bottom-3" 
              viewBox="0 0 200 200"
              style={{ color: getAccentHex(accentColor) }}
            >
              <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" fill="none" />
              <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" fill="none" />
              <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
              <line x1="15" y1="100" x2="185" y2="100" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
              <line x1="100" y1="100" x2="160" y2="40" stroke="currentColor" strokeWidth="1.5" className="origin-center animate-[spin_4s_linear_infinite]" />
            </svg>
            
            <div className="text-left font-mono text-[9px] text-[#8A9BC4] space-y-1 w-full relative z-10 pl-1 mt-6">
              <span className="block text-white font-bold tracking-widest uppercase text-[10.5px]">SOLVE COMPLEX ISSUES</span>
              <span className="block text-[10px] text-white mt-1.5 select-none leading-relaxed">
                "Solve the complex problems no one wants to face. Then teach others how."
              </span>
              <span className="block text-slate-500 font-mono text-[7.5px] pt-1.5">GEO: 6.8561° N, 7.3958° E · UPTIME: 100%</span>
            </div>
          </div>

          {/* Card 2: Beyond the terminal / Personal touch */}
          <div className="p-6 rounded-2xl bg-[#0a0f26]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_3px_rgba(255,255,255,0.12)] flex flex-col justify-between hover:border-white/20 transition-all duration-300 min-h-[190px]">
            <div>
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: getAccentHex(accentColor) }} />
                <h3 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                  BEYOND CODE // COMPOSITION
                </h3>
              </div>
              <div className="text-[11px] leading-relaxed text-[#8A9BC4] font-sans mt-3">
                {(portfolioData as any).beyondCode}
              </div>
            </div>
            <div className="text-[8px] text-slate-500 font-mono mt-3 uppercase tracking-wider">// PERSISTENT FOCUS OUTSIDE CODE</div>
          </div>

          {/* Card 3: What I Don't Build */}
          <div className="p-6 rounded-2xl bg-[#0a0f26]/95 border border-red-500/15 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_3px_rgba(255,255,255,0.12)] flex flex-col justify-between hover:border-red-500/25 transition-all duration-300 min-h-[190px]">
            <div>
              <div className="flex items-center gap-2 border-b border-red-500/5 pb-3 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block animate-pulse" />
                <h3 className="text-xs font-black tracking-widest uppercase text-red-500 font-mono">
                  BOUNDARIES // DECLINED SCOPE
                </h3>
              </div>
              <div className="text-[11px] leading-relaxed text-[#8A9BC4] uppercase font-mono mt-3">
                {(portfolioData as any).whatIDontBuild}
              </div>
            </div>
            <div className="text-[8px] text-red-500/60 font-black mt-3 uppercase tracking-wider">// SCAM / ESCROWS ALWAYS DISCARDED</div>
          </div>

        </div>
      </motion.div>

      {/* Roadmap descending visual 3D Scrollytelling highway */}
      <div className="max-w-7xl mx-auto px-6 relative mt-20 pt-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <span className={`text-[10px] uppercase font-mono tracking-[0.25em] font-extrabold ${accentTextClass} block mb-1 animate-pulse`}>
                &gt;_ SECTOR_002 // HISTORICAL ROADMAP
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none font-display uppercase">
                Engineering Roadmap
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#8A9BC4] max-w-sm">
              An immersive 3D scroll-driven highway capturing chronological milestones and organizational growth. Scroll down the section to accelerate.
            </p>
          </div>

          {/* Interactive 3D Scroll Highway container wrapper */}
          <div ref={roadScrollTrackRef} className="relative w-full h-[600vh]">
            
            {/* Sticky Viewport frame */}
            <div className="sticky top-[10vh] h-[75vh] md:h-[80vh] w-full rounded-2xl border border-white/10 bg-[#030510] overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.85)] flex flex-col justify-end">
              
              {/* Scanlines overlays on the visual cockpit */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,22,35,0)_97%,rgba(0,0,0,0.45)_97%)] bg-[size:100%_4px] pointer-events-none z-30 opacity-15" />
              <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-20" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(3,5,16,0.95) 90%)' }} />

              {/* Infinite Aurora horizon glows */}
              <div 
                className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] rounded-full filter blur-[100px] opacity-20 pointer-events-none z-0"
                style={{
                  background: `radial-gradient(circle, ${getAccentHex(accentColor)} 0%, transparent 70%)`
                }}
              />

              {/* 3D Camera Stage Wrapper */}
              <div 
                style={{ 
                  perspective: '1000px', 
                  perspectiveOrigin: '50% 35%',
                  transformStyle: 'preserve-3d'
                }}
                className="relative w-full h-full flex flex-col justify-end overflow-hidden z-10 animate-fade-in"
              >
                
                {/* Simulated Tilted Road Surface Plane */}
                <motion.div
                  style={{
                    transform: 'rotateX(77deg) translateZ(-160px)',
                    transformOrigin: '50% 100%',
                  }}
                  className="absolute bottom-0 left-[3%] right-[3%] h-[160%] overflow-hidden bg-[#05081f]/40 border-x border-[#CAD5EE]/10"
                >
                  {/* Neon road grids */}
                  <motion.div 
                    className="absolute inset-0 opacity-80"
                    style={{
                      backgroundImage: `
                        linear-gradient(to bottom, ${getAccentHex(accentColor)}35 2px, transparent 2px),
                        linear-gradient(to right, ${getAccentHex(accentColor)}45 2px, transparent 2px)
                      `,
                      backgroundSize: '50px 50px',
                      backgroundPositionY: roadBgY
                    }}
                  />

                  {/* Horizontal light cutoff fade near coordinates */}
                  <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#030510] via-[#030510]/80 to-transparent z-10" />

                  {/* Glowing lane stripes on extreme edges */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 w-[4px]"
                    style={{
                      background: `linear-gradient(to bottom, transparent 15%, ${getAccentHex(accentColor)})`,
                      boxShadow: `0 0 25px ${getAccentHex(accentColor)}`
                    }}
                  />
                  <div 
                    className="absolute top-0 bottom-0 right-0 w-[4px]"
                    style={{
                      background: `linear-gradient(to bottom, transparent 15%, ${getAccentHex(accentColor)})`,
                      boxShadow: `0 0 25px ${getAccentHex(accentColor)}`
                    }}
                  />

                  {/* Middle highway white dashed lines */}
                  <motion.div 
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[4px] z-0 opacity-90" 
                    style={{
                      backgroundImage: `linear-gradient(to bottom, ${getAccentHex(accentColor)} 0%, ${getAccentHex(accentColor)} 50%, transparent 50%, transparent 100%)`,
                      backgroundSize: '4px 60px',
                      backgroundPositionY: roadBgY
                    }}
                  />
                  
                </motion.div>

                {/* Vertical milestone cards layer (stands upright, sister element to road) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible select-none">
                  {portfolioData.timelineData.map((node, index) => (
                    <RoadMilestoneCard 
                      key={index}
                      node={node}
                      index={index}
                      scrollYProgress={roadScrollYProgress}
                      isMobile={isMobile}
                      step={step}
                      N={N}
                      accentColor={accentColor}
                      accentTextClass={accentTextClass}
                      accentBorderClass={`hover:${accentBorderClass}/30`}
                    />
                  ))}
                </div>

              </div>

              {/* Cockpit HUD Dashboard Grid Overlays (Diagnostic telemetries) */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex items-center justify-between pointer-events-none z-20 font-mono select-none text-[10px] md:text-xs">
                
                {/* Speedometer hud panel */}
                <div className="flex items-center gap-3 bg-[#060a1f]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-[#8A9BC4]">
                  <Gauge className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <div className="text-left leading-none">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500">VECTOR SPEED</span>
                    <span className="text-sm font-bold text-white tracking-tight">{scrollingSpeed} <span className="text-[9px] text-[#8A9BC4] font-normal">KM/H</span></span>
                  </div>
                </div>

                {/* Center visual stage tracker HUD */}
                <div className="hidden lg:flex flex-col items-center gap-1.5 bg-[#060a1f]/85 backdrop-blur-md px-5 py-2 rounded-xl border border-white/5 text-slate-400">
                  <div className="flex items-center gap-5">
                    {portfolioData.timelineData.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === activeCardIndex 
                            ? 'w-6' 
                            : 'w-2 bg-white/10'
                        }`}
                        style={{
                          backgroundColor: idx === activeCardIndex ? getAccentHex(accentColor) : undefined,
                          boxShadow: idx === activeCardIndex ? `0 0 10px ${getAccentHex(accentColor)}` : undefined
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] tracking-[0.2em] text-white/40 uppercase">AUTO-STEERING CORRELATION METRIC</span>
                </div>

                {/* Location / Division locator hud panel */}
                <div className="flex items-center gap-3 bg-[#060a1f]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-[#8A9BC4] text-right">
                  <div className="text-right leading-none">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500">STAGE ACTIVE YEAR</span>
                    <span className="text-xs md:text-sm font-bold tracking-wider uppercase text-white truncate max-w-[120px] inline-block">
                      {portfolioData.timelineData[activeCardIndex]?.period || "2025"}
                    </span>
                  </div>
                  <Compass className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>

              {/* Dynamic Year HUD Watermark */}
              <div className="absolute top-6 left-6 font-display font-black text-white/5 text-4xl sm:text-6xl tracking-tighter select-none pointer-events-none uppercase">
                {portfolioData.timelineData[activeCardIndex]?.period.split(" ")[0]}
              </div>

              <div className="absolute top-6 right-6 font-mono text-[9px] text-slate-500 text-right select-none pointer-events-none leading-none space-y-1 hidden sm:block">
                <div>SYS.GRID: ACTIVE // 48.09 GHz</div>
                <div>AUTOPILOT: DEPLOYED (RUN_OK)</div>
                <div>DEPTH: {Math.round(roadScrollYProgress.get() * 4132)} FT</div>
              </div>

            </div>
          </div>
        </div>

    </section>
  );
}
