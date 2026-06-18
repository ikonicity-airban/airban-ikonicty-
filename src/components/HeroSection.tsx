import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Download } from 'lucide-react';
// @ts-ignore
import robotAvatar from '../assets/images/hero-avatar.png';
import { handleDownloadCV, playClickSound, getAccentHex, getAccentTextClass, getAccentBgClass, getAccentBorderClass, getAccentRgba } from '../utils';

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

interface HeroSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  videoUrl: string;
  heroBgVideoUrl?: string;
  availabilityStatus?: string;
  isMuted?: boolean;
  onDownloadCVClick?: () => void;
  isBooting?: boolean;
}

export default function HeroSection({ accentColor, videoUrl, heroBgVideoUrl, availabilityStatus, isMuted = true, onDownloadCVClick, isBooting = false }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [flickerActive, setFlickerActive] = useState(false);
  const [showShowreel, setShowShowreel] = useState(false);
  const [activeSubtextIndex, setActiveSubtextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const defaultBgVideo = "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709867/vecteezy_neon-city-ai-generated-ai-generative_31698896_w8zwsf_1_bdio5w.mp4";
  const bgVideoLoopToUse = heroBgVideoUrl || defaultBgVideo;
  const [currentBgVideo, setCurrentBgVideo] = useState(bgVideoLoopToUse);

  // Keep state sync in place when prop changes
  useEffect(() => {
    setCurrentBgVideo(bgVideoLoopToUse);
  }, [bgVideoLoopToUse]);

  // Rotate subtexts swap animation every 4 seconds once booted
  useEffect(() => {
    if (isBooting) return;
    const timer = setInterval(() => {
      setActiveSubtextIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, [isBooting]);

  // Safe background video play & browser autoplay blocker workaround
  useEffect(() => {
    let isActive = true;
    const videoElement = bgVideoRef.current;

    if (videoElement) {
      videoElement.muted = !!isMuted;
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (!isActive) return;
          // Ignore interruption errors due to unmounting or source changes
          if (err.name === 'AbortError' || err.message?.includes('interrupted')) {
            console.debug("Video play was aborted or interrupted by user/system action.", err.message);
            return;
          }
          console.warn("Autoplay / play was blocked. Retrying with force-mute.", err);
          if (videoElement && bgVideoRef.current === videoElement) {
            videoElement.muted = true;
            videoElement.play().catch((playErr) => {
              if (!isActive) return;
              if (playErr.name === 'AbortError' || playErr.message?.includes('interrupted')) {
                console.debug("Video second play attempt was aborted or interrupted.", playErr.message);
                return;
              }
              // Safely log as notice/warning, NEVER use console.error to avoid failing deployment/healthcheck policies
              console.warn("Autoplay failed completely under current browser restrictions.", playErr.message || playErr);
            });
          }
        });
      }
    }

    return () => {
      isActive = false;
    };
  }, [currentBgVideo, isMuted]);

  const handleVideoError = () => {
    console.warn("Hero background video failed to load. Falling back to robust public Cloudinary ambient vector loop.");
    // Switch to highly reliable public Cloudinary demo loop if current is not already that
    const fallbackUrl = "https://res.cloudinary.com/demo/video/upload/q_auto,vc_h264/docs/ambient_video.mp4";
    if (currentBgVideo !== fallbackUrl) {
      setCurrentBgVideo(fallbackUrl);
    }
  };

  // Monitor scroll for Parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Random flicker trigger every 12-20s for cyber-immersion
  useEffect(() => {
    const triggerFlicker = () => {
      setFlickerActive(true);
      setTimeout(() => setFlickerActive(false), 150);
      setTimeout(() => {
        setFlickerActive(true);
        setTimeout(() => setFlickerActive(false), 80);
      }, 250);
    };

    const interval = setInterval(() => {
      triggerFlicker();
    }, 14000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, []);

  // Drift floating particles on canvas (Max 40, size 1px, slow drift)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 850;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 20 : 40;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: -(Math.random() * 0.25 + 0.08),
      alpha: Math.random() * 0.18 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const getDotColorRGB = (color: typeof accentColor) => {
        switch (color) {
          case 'green': return '57, 255, 20';
          case 'cyan': return '0, 212, 255';
          case 'pink': return '255, 0, 127';
          case 'purple': return '189, 0, 255';
          case 'yellow': return '255, 230, 0';
          default: return '57, 255, 20';
        }
      };
      const dotColor = getDotColorRGB(accentColor);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Reset if out of boundaries
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${p.alpha})`;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, [accentColor]);

  // Design tokens aligned with Two-Accent rules and User requests
  const primaryColorHex = getAccentHex(accentColor);
  const getGlowShadowStyle = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_24px_rgba(57,255,20,0.5)]';
      case 'cyan': return 'shadow-[0_0_24px_rgba(0,212,255,0.5)]';
      case 'pink': return 'shadow-[0_0_24px_rgba(255,0,127,0.5)]';
      case 'purple': return 'shadow-[0_0_24px_rgba(189,0,255,0.5)]';
      case 'yellow': return 'shadow-[0_0_24px_rgba(255,230,0,0.5)]';
      default: return 'shadow-[0_0_24px_rgba(57,255,20,0.5)]';
    }
  };
  const glowShadowStyle = getGlowShadowStyle(accentColor);

  const getSolidAccentColor = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return '#2EC413';
      case 'cyan': return '#00A8CC';
      case 'pink': return '#D8006C';
      case 'purple': return '#9A00D0';
      case 'yellow': return '#D4BE00';
      default: return '#2EC413';
    }
  };

  const textAccentClass = getAccentTextClass(accentColor);
  const borderAccentClass = getAccentBorderClass(accentColor);
  const bgAccentClass = getAccentBgClass(accentColor);
  
  // Parallax calculations
  const charParallaxY = scrollY * 0.15;
  const colOpacity = Math.max(0, 1 - scrollY * 0.003);
  const gridParallaxTranslateY = -scrollY * 0.12;

  const handleScrollToWork = () => {
    playClickSound('click');
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToContact = () => {
    playClickSound('click');
    document.getElementById('transmit')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCVClick = () => {
    playClickSound('success');
    if (onDownloadCVClick) {
      onDownloadCVClick();
    } else {
      handleDownloadCV();
    }
  };

  if (isBooting) {
    return (
      <div id="home" className="min-h-screen bg-[#050816] w-full relative z-30" />
    );
  }

  return (
    <section 
      id="home"
      className="relative z-30 min-h-screen w-full bg-[#050816] overflow-visible flex flex-col justify-between"
      style={{ contentVisibility: 'auto' }}
    >
      {/* 1. LOOPABLE BACKGROUND VIDEO BACKDROP - OMITTED FOR NOW TO PREVENT DEVICE CRASHES AND ENSURE ULTRA-SMOOTH CANVAS PERFORMANCE */}
      {/* 
      {currentBgVideo && (
        <video
          ref={bgVideoRef}
          key={currentBgVideo}
          src={currentBgVideo}
          autoPlay
          loop
          muted 
          playsInline
          onError={handleVideoError}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none"
        />
      )}
      */}

      {/* ─── GRAND HERO HEADER BACKDROP TEXT WITH SCROLL PARALLAX ─── */}
      <div 
        className="absolute inset-x-0 top-[20%] md:top-[12%] flex flex-col items-center justify-center select-none pointer-events-none z-1 overflow-hidden"
        style={{ 
          transform: `translateY(${scrollY * 0.45}px)`,
          opacity: Math.max(0, 0.90 - scrollY * 0.003)
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 0.90, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-extrabold uppercase select-none tracking-tighter"
          style={{
            fontFamily: "'Syne', sans-serif"
          }}
        >
          <div 
            style={{ 
              fontSize: isMobile ? '16vw' : '14vw',
              lineHeight: '0.9',
              fontWeight: 800,
              background: `linear-gradient(to bottom, ${primaryColorHex} 10%, #050816 95%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 35px ${getAccentRgba(accentColor, 0.35)})`
            }}
          >
            Airban
          </div>
          <div 
            style={{ 
              fontSize: isMobile ? '11.5vw' : '10vw',
              lineHeight: '0.85',
              marginTop: '-1.5vw',
              fontWeight: 800,
              background: 'linear-gradient(to bottom, #FFFFFF 20%, #64748B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.2))'
            }}
          >
            Ikonicity
          </div>
        </motion.div>
      </div>

      {/* Noise/Grain texture overlay using SVG feTurbulence (Layer 3) */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.025] mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.25 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Radial Gradient Glow Behind Character (Layer 1) */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-[60vw] max-w-[800px] aspect-square rounded-full pointer-events-none z-0 filter blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${getAccentRgba(accentColor, 0.07)} 0%, transparent 70%)`,
        }}
      />

      {/* Secondary Glow Top-Right (Layer 2) */}
      <div 
        className="absolute top-[10%] right-[20%] w-[45vw] aspect-square rounded-full pointer-events-none z-0 filter blur-[90px]"
        style={{
          background: `radial-gradient(circle, ${getAccentRgba(accentColor, 0.05)} 0%, transparent 65%)`,
        }}
      />

      {/* Grid Floor Layer (Perspective bottom 35% with parallax scroll, hidden on mobile) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none overflow-hidden z-0 hidden md:block"
        style={{
          perspective: '600px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="w-full h-[200%] origin-bottom transition-transform duration-75"
          style={{
            backgroundImage: `linear-gradient(to right, ${primaryColorHex}0d 1px, transparent 1px),
                              linear-gradient(to bottom, ${primaryColorHex}0d 1px, transparent 1px)`,
            backgroundSize: '45px 45px',
            transform: `rotateX(68deg) scale(1.6) translateY(${gridParallaxTranslateY}px)`,
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>


      {/* 2. THREE-COLUMN DESKTOP COMPOSITION & STACKED MOBILE ENGINE */}
      
      {/* ─── DESKTOP LAYOUT (md:block hidden) ─── */}
      <div className="hidden md:block w-full max-w-7xl mx-auto px-6 relative min-h-screen z-10 pointer-events-none">
        
        {/* CHARACTER IMAGE: Centered Horizontally, Bottom Aligned, 90vh */}
        <motion.div
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 24,
            mass: 0.95,
            delay: 0.75,
          }}
          className="hero-avatar pointer-events-auto"
          style={{
            transform: `translateX(-50%) translateY(${charParallaxY}px)`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img 
            src={robotAvatar} 
            alt="Eban Godwin Ikoni Character Portrait"
            referrerPolicy="no-referrer"
            loading="eager"
            className="h-full w-auto object-contain brightness-[1.08] contrast-[1.03] filter saturate-[0.95]"
          />
        </motion.div>

        {/* LEFT COLUMN CONTENT: Absolute, left 5%, vertically centered */}
        <div 
          className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[30%] flex flex-col space-y-16 text-left pointer-events-auto"
          style={{ opacity: colOpacity }}
        >
          {/* Identity Block */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            <span className="font-display font-black text-[#CAD5EE] block text-[9.5px] uppercase tracking-[0.25em]">
              // IDENTITY
            </span>
            <h1 
              className="font-black tracking-tight leading-[0.95] uppercase flex flex-col pt-1"
              style={{ 
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontFamily: "'Syne', sans-serif"
              }}
            >
              <span
                style={{
                  background: `linear-gradient(135deg, ${primaryColorHex} 25%, #050816 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Airban
              </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 10%, #8A9BC4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ikonicity
              </span>
            </h1>
            <p 
              className={`font-accent font-black leading-normal ${textAccentClass}`}
              style={{ 
                fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                WebkitTextStroke: '1px #000000',
              }}
            >
              Full-Stack Engineer
            </p>
          </motion.div>

          {/* Bullet Point Block 2: 60% down - Animated Swap (One at a time) */}
          <div className="min-h-[110px] flex items-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeSubtextIndex === 0 ? (
                <motion.div 
                  key="problem-solver"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative pl-7 text-left group w-full"
                >
                  {/* 6px circle bullet */}
                  <span 
                    className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      backgroundColor: getAccentHex(accentColor),
                      boxShadow: `0 0 8px ${getAccentHex(accentColor)}`
                    }}
                  />
                  
                  {/* Optional horizontally connecting neon line */}
                  <div 
                    className="absolute left-2 top-2 w-[60px] h-[1px] opacity-40 group-hover:w-[75px] transition-all duration-300" 
                    style={{ backgroundColor: getAccentHex(accentColor) }}
                  />
                  
                  <h3 className="font-accent font-bold text-[#F0F4FF] text-[15px] leading-none mb-1.5 pl-[68px]">
                    Problem Solver
                  </h3>
                  <p className="font-mono text-[#8A9BC4] text-[12px] leading-relaxed pl-[68px]">
                    Engineering solutions from first principles.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="systems-builder"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative pl-7 text-left group w-full"
                >
                  {/* 6px circle bullet */}
                  <span 
                    className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      backgroundColor: getAccentHex(accentColor),
                      boxShadow: `0 0 8px ${getAccentHex(accentColor)}`
                    }}
                  />
                  
                  {/* Optional horizontally connecting neon line */}
                  <div 
                    className="absolute left-2 top-2 w-[60px] h-[1px] opacity-40 group-hover:w-[75px] transition-all duration-300" 
                    style={{ backgroundColor: getAccentHex(accentColor) }}
                  />
                  
                  <h3 className="font-accent font-bold text-[#F0F4FF] text-[15px] leading-none mb-1.5 pl-[68px]">
                    Systems Builder
                  </h3>
                  <p className="font-mono text-[#8A9BC4] text-[12px] leading-relaxed pl-[68px]">
                    From architecture to production deployment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN CONTENT: Absolute, right 5%, vertically centered */}
        <div 
          className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[30%] flex flex-col space-y-16 text-left pointer-events-auto"
          style={{ opacity: colOpacity }}
        >
          {/* Display Label Block 1 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h2 
              className="text-[#F0F4FF] font-display font-black leading-none uppercase"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
            >
              Building Intelligent<br />
              <span className={textAccentClass}>Systems</span>
            </h2>
            <p className="font-mono text-[12.5px] leading-relaxed text-[#CAD5EE] max-w-sm">
              Scalable platforms, AI automation, and software that solves complex problems.
            </p>
          </motion.div>

          {/* CTA Buttons Block 2 - Replaced watch reels with Download CV */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.35 }}
              className="flex items-center gap-4.5"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScrollToWork}
                onMouseEnter={() => playClickSound('hover')}
                className="px-8 py-3.5 text-[#050816] font-accent font-extrabold text-[9.5px] uppercase tracking-widest rounded-[4px] cursor-pointer transition-all duration-300 hover:brightness-105"
                style={{
                  backgroundColor: getSolidAccentColor(accentColor),
                  boxShadow: `0 0 12px ${getAccentRgba(accentColor, 0.2)}`,
                  fontFamily: "'Syne', sans-serif"
                }}
              >
                Explore My Work
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCVClick}
                onMouseEnter={() => playClickSound('hover')}
                className="px-8 py-3.5 bg-transparent border font-accent font-extrabold text-[9.5px] uppercase tracking-widest rounded-[4px] cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group"
                style={{
                  borderColor: getSolidAccentColor(accentColor),
                  color: getSolidAccentColor(accentColor),
                  backgroundColor: 'transparent',
                  fontFamily: "'Syne', sans-serif"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = `${getAccentRgba(accentColor, 0.08)}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                <span>Download CV</span>
              </motion.button>
            </motion.div>

            {/* Availability Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.45 }}
              className="flex items-center gap-2 pl-1"
            >
              <span className="relative flex h-2 w-2">
                <span 
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    availabilityStatus === 'busy' ? 'bg-amber-400' : ''
                  }`} 
                  style={{ backgroundColor: availabilityStatus === 'busy' ? undefined : getAccentHex(accentColor) }}
                />
                <span 
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    availabilityStatus === 'busy' ? 'bg-amber-400' : ''
                  }`} 
                  style={{ backgroundColor: availabilityStatus === 'busy' ? undefined : getAccentHex(accentColor) }}
                />
              </span>
              <span className="font-mono text-[11px] font-bold text-[#8A9BC4] uppercase tracking-wider">
                ● {availabilityStatus === 'busy' ? 'Busy building systems' : 'Available for work'}
              </span>
            </motion.div>
          </div>
        </div>

      </div>


      {/* ─── MOBILE LAYOUT (md:hidden block) ─── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="md:hidden flex flex-col items-center justify-start text-center px-6 pt-0 pb-36 min-h-screen relative z-10 space-y-0"
      >
        
        {/* Identity label above the hero avatar with exactly 2rem margin top and bottom */}
        <motion.span 
          variants={itemVariants}
          className="font-mono text-[8px] tracking-[0.3em] text-[#8A9BC4] block font-black mt-8 mb-8"
        >
          // IDENTITY
        </motion.span>

        {/* Character image / Avatar above text (86vw width) with parallax scroll translation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 24,
            mass: 0.95,
            delay: 0.75,
          }}
          className="relative w-[99vw] flex items-center justify-center overflow-hidden !mt-0 !mb-0"
        >
          <div 
            className="relative w-full flex items-center justify-center"
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
          >
            {/* Central circular glow backdrop */}
            <div 
              className="absolute inset-0 m-auto w-[212px] h-[212px] rounded-full border filter blur-md animate-pulse" 
              style={{ 
                borderColor: `${getAccentHex(accentColor)}26`, 
                backgroundColor: `${getAccentHex(accentColor)}0d` 
              }}
            />
            
            <img 
              src={robotAvatar} 
              alt="Airban Ikonicity Portrait" 
              className="w-full h-auto object-contain z-10"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                filter: `drop-shadow(0 0 20px ${getAccentRgba(accentColor, 0.15)})`
              }}
            />
          </div>
        </motion.div>

        {/* Identity block directly below the character image with 0px top margin/padding */}
        <motion.div 
          variants={itemVariants}
          className="relative w-full space-y-4 px-2 !mt-0 !pt-0 flex flex-col items-center z-20"
        >
          <p 
            className="font-accent font-black text-[16.5px] uppercase tracking-widest -mt-10 pt-0"
            style={{ 
              color: getSolidAccentColor(accentColor),
              WebkitTextStroke: '1px #000000',
            }}
          >
            Full-Stack Engineer
          </p>

          {/* CTA Buttons brought directly underneath the Full-Stack Developer text on mobile */}
          <div className="flex flex-col gap-2.5 w-full max-w-xs mx-auto mt-2">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleScrollToWork}
              onMouseEnter={() => playClickSound('hover')}
              className="w-full py-2.5 text-[#050816] font-accent font-extrabold text-[9.5px] uppercase tracking-widest rounded cursor-pointer"
              style={{
                backgroundColor: getSolidAccentColor(accentColor),
              }}
            >
              Explore My Work
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadCVClick}
              onMouseEnter={() => playClickSound('hover')}
              className="w-full py-2.5 bg-transparent border text-[9.5px] font-accent font-extrabold uppercase tracking-widest rounded flex items-center justify-center gap-2 group cursor-pointer transition-all"
              style={{
                borderColor: getSolidAccentColor(accentColor),
                color: getSolidAccentColor(accentColor),
              }}
            >
              <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
              <span>Download CV</span>
            </motion.button>
          </div>

          <div className="pt-2 text-left max-w-xs mx-auto min-h-[55px] relative overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeSubtextIndex === 0 ? (
                <motion.div 
                  key="problem-solver-mobile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex gap-2.5 items-start w-full"
                >
                  <span 
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: getAccentHex(accentColor) }}
                  />
                  <div>
                    <h4 className="font-accent font-bold text-white text-[12px]">Problem Solver</h4>
                    <p className="font-mono text-[10px] text-[#8A9BC4]">Engineering solutions from first principles.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="systems-builder-mobile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex gap-2.5 items-start w-full"
                >
                  <span 
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: getAccentHex(accentColor) }}
                  />
                  <div>
                    <h4 className="font-accent font-bold text-white text-[12px]">Systems Builder</h4>
                    <p className="font-mono text-[10px] text-[#8A9BC4]">From architecture to production deployment.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Col stacks BELOW */}
        <motion.div 
          variants={itemVariants}
          className="w-full space-y-4 px-2 mt-4 pb-12"
        >
          <h2 className="text-white text-lg font-display font-black leading-tight uppercase">
            Building Intelligent <span className={textAccentClass}>Systems</span>
          </h2>
          <p className="font-mono text-[11px] text-[#CAD5EE] max-w-sm mx-auto leading-relaxed">
            Scalable platforms, AI automation, and software that solves complex problems.
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="relative flex h-2 w-2">
              <span 
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  availabilityStatus === 'busy' ? 'bg-amber-400' : ''
                }`} 
                style={{ backgroundColor: availabilityStatus === 'busy' ? undefined : getAccentHex(accentColor) }}
              />
              <span 
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  availabilityStatus === 'busy' ? 'bg-amber-400' : ''
                }`} 
                style={{ backgroundColor: availabilityStatus === 'busy' ? undefined : getAccentHex(accentColor) }}
              />
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8A9BC4] uppercase tracking-wider">
              {availabilityStatus === 'busy' ? 'Busy building systems' : 'Available for work'}
            </span>
          </div>
        </motion.div>

      </motion.div>


      {/* 3. BOTTOM FLUSH OVERLAPPING STAT BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 1.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full absolute bottom-0 left-0 right-0 z-40 transform translate-y-1/2 mb-10 md:mb-0"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div 
            className="py-3 sm:py-0 h-auto sm:h-24 bg-[#080D1F]/95 backdrop-blur-[12px] rounded-2xl border flex items-center justify-around overflow-visible shadow-[0_15px_30px_rgba(5,8,22,0.95)]"
            style={{ borderColor: getAccentRgba(accentColor, 0.15) }}
          >
            
            {/* Top Glow bar line */}
            <div 
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-45" 
              style={{ backgroundImage: `linear-gradient(to right, transparent, ${getAccentHex(accentColor)}, transparent)` }}
            />
            
            {[
              { num: "4+", label: "Years Experience" },
              { num: "70,000+", label: "Users Reached" },
              { num: "10+", label: "Systems Shipped" }
            ].map((st, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-center relative px-1.5 text-center h-full">
                
                {/* 1px vertical divider green indicator line centered */}
                {i > 0 && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-10" 
                    style={{ backgroundColor: `${getAccentHex(accentColor)}33` }}
                  />
                )}

                <span className={`block font-display font-black leading-none ${textAccentClass}`}
                  style={{ fontSize: 'clamp(1.1rem, 3vw, 2.3rem)' }}
                >
                  {st.num}
                </span>
                
                <span className="block font-mono text-[8px] xs:text-[9.5px] text-[#CAD5EE] uppercase font-bold tracking-wider sm:tracking-widest mt-1 text-center leading-tight">
                  {st.label}
                </span>

              </div>
            ))}

          </div>
        </div>
      </motion.div>





      {/* SHOWREEL POPUP VIDEO MODAL */}
      <AnimatePresence>
        {showShowreel && videoUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050816]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowShowreel(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-4xl w-full aspect-video bg-[#080D1F] border shadow-2xl rounded-2xl overflow-hidden"
              style={{ borderColor: `${getAccentHex(accentColor)}40` }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowShowreel(false)}
                className="absolute top-4 right-4 bg-[#050816]/80 text-[#CAD5EE] hover:text-white border border-white/5 w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-sm z-10 transition-colors cursor-pointer"
              >
                ✕
              </button>
              
              <iframe
                title="Watch Airban Godwin Showreel"
                src={videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') 
                  ? videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1'
                  : videoUrl
                }
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
