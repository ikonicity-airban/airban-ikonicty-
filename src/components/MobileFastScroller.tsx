import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Info, 
  Code2, 
  Layers, 
  Briefcase, 
  Cpu, 
  Award, 
  Star, 
  Send,
  Settings
} from 'lucide-react';
import { playClickSound, getAccentHex, getAccentTextClass, getAccentBgClass, getAccentBorderClass } from '../utils';

interface MobileFastScrollerProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  onSettingsClick?: () => void;
}

interface ScrollerItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: any;
}

export default function MobileFastScroller({ accentColor, onSettingsClick }: MobileFastScrollerProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  
  const railRef = useRef<HTMLDivElement>(null);

  const themeColor = getAccentHex(accentColor);
  const textAccentClass = getAccentTextClass(accentColor);
  const bgAccentClass = getAccentBgClass(accentColor);
  
  const getBorderAccentClassWithOpacity30 = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/30';
      case 'cyan': return 'border-[#00D4FF]/30';
      case 'pink': return 'border-[#FF007F]/30';
      case 'purple': return 'border-[#BD00FF]/30';
      case 'yellow': return 'border-[#FFE600]/30';
      default: return 'border-[#39FF14]/30';
    }
  };
  const borderAccentClass = getBorderAccentClassWithOpacity30(accentColor);

  const items: ScrollerItem[] = [
    { id: 'settings', label: 'SYSTEM CONFIG', shortLabel: 'SETTINGS', icon: Settings },
    { id: 'home', label: 'HOME DECK', shortLabel: 'HOME', icon: Home },
    { id: 'about', label: 'HISTORY NARRATIVE', shortLabel: 'ABOUT', icon: Info },
    { id: 'skills', label: 'SKILLS BLUEPRINT', shortLabel: 'SKILLS', icon: Code2 },
    { id: 'projects', label: 'PROJECTS BENTO', shortLabel: 'PROJECTS', icon: Layers },
    { id: 'experience', label: 'CHRONICLES INDEX', shortLabel: 'CAREER', icon: Briefcase },
    { id: 'services', label: 'CAPABILITIES MAP', shortLabel: 'SERVICES', icon: Cpu },
    { id: 'certifications', label: 'SYSTEM CREDENTIALS', shortLabel: 'CERTS', icon: Award },
    { id: 'testimonials', label: 'FEEDBACK RECORDS', shortLabel: 'REVIEWS', icon: Star },
    { id: 'contact', label: 'CONTACT COCKPIT', shortLabel: 'CONTACT', icon: Send },
  ];

  // Monitor scroll for settings show/hide state
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersecting Observer to detect current active section on ordinary scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -45% 0px', // Center-weighted viewport trigger
      threshold: 0
    };

    const targetElements = items
      .filter(item => item.id !== 'settings')
      .map(item => document.getElementById(item.id))
      .filter(Boolean);

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // If user is dragging the fast scroller, let dragging handle the temporary visual highlight
      if (isDragging) return;

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
  }, [isDragging]);

  // Handler to smoothly scroll to elements
  const scrollToSection = (id: string, playSynth = true) => {
    if (id === 'settings') {
      if (playSynth) {
        playClickSound('click');
      }
      onSettingsClick?.();
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      if (playSynth) {
        playClickSound('synth');
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  // Drag calculation: finds which item is closest to drag coordinates
  const handleTouchSelection = (clientY: number) => {
    if (!railRef.current) return;
    
    const rect = railRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const height = rect.height;
    
    // Normalize percentage
    let percentage = relativeY / height;
    percentage = Math.max(0, Math.min(1, percentage));
    
    // Determine the active item based on percentage distribution
    const index = Math.floor(percentage * items.length);
    const targetIndex = Math.max(0, Math.min(items.length - 1, index));
    const targetItem = items[targetIndex];

    if (targetItem) {
      if (draggedLabel !== targetItem.shortLabel) {
        setDraggedLabel(targetItem.shortLabel);
        if (targetItem.id === 'settings') {
          onSettingsClick?.();
        } else {
          scrollToSection(targetItem.id, false);
        }
        // Soft trigger audio click ticks for dial speed select
        playClickSound('hover');
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleTouchSelection(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleTouchSelection(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDraggedLabel(null);
  };

  return (
    <div className="fixed right-2.5 top-1/2 -translate-y-1/2 z-40 md:hidden flex flex-col items-center select-none">
      
      {/* 1. SECTOR FLOATING BUBBLE OVERLAY */}
      <AnimatePresence>
        {isDragging && draggedLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute right-14 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div 
              className="px-4 py-2 border rounded-xl shadow-2xl flex items-center gap-2 bg-[#050816]/95 backdrop-blur-md"
              style={{ 
                borderColor: themeColor,
                boxShadow: `0 0 20px ${themeColor}1a`
              }}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full animate-ping" 
                style={{ backgroundColor: themeColor }}
              />
              <span className="text-[10px] font-mono font-black tracking-widest text-white uppercase whitespace-nowrap">
                {draggedLabel}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE RAIL CONTROL PANEL CONTAINER */}
      <div 
        ref={railRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex flex-col items-center justify-between py-4 px-1.5 h-[330px] w-9 relative touch-none pointer-events-auto"
      >
        {/* Subtle timeline track line indicator behind icons */}
        <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-[1px] bg-white/10 pointer-events-none" />

        {items.map((item, idx) => {
          const active = activeSection === item.id;
          const activeIndex = items.findIndex(i => i.id === activeSection);
          const scrolledPast = idx < activeIndex;
          const Icon = item.icon;
          
          if (item.id === 'settings') {
            const isVisible = scrollY === 0;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound('click');
                  onSettingsClick?.();
                }}
                className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 focus:outline-none cursor-pointer z-10 ${
                  isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
                }`}
                style={{
                  backgroundColor: 'transparent'
                }}
              >
                <Icon className="w-3.5 h-3.5 text-[#8A9BC4] hover:text-white transition-colors" />
              </button>
            );
          }

          let iconClass = "w-3.5 h-3.5 transition-all duration-300 ";
          let iconStyle = {};
          
          if (active) {
            iconClass += `${textAccentClass} scale-110`;
            const getDropShadowByColor = (color: typeof accentColor) => {
              switch (color) {
                case 'green': return 'drop-shadow(0 0 8px rgba(57,255,20,0.5))';
                case 'cyan': return 'drop-shadow(0 0 8px rgba(0,212,255,0.5))';
                case 'pink': return 'drop-shadow(0 0 8px rgba(255,0,127,0.5))';
                case 'purple': return 'drop-shadow(0 0 8px rgba(189,0,255,0.5))';
                case 'yellow': return 'drop-shadow(0 0 8px rgba(255,230,0,0.5))';
                default: return 'drop-shadow(0 0 8px rgba(57,255,20,0.5))';
              }
            };
            iconStyle = {
              filter: getDropShadowByColor(accentColor)
            };
          } else if (scrolledPast) {
            iconClass += "scale-100";
            iconStyle = { color: '#aaaaaa' };
          } else {
            iconClass += "text-[#8A9BC4] opacity-50";
          }
          
          return (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id);
              }}
              className="relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 focus:outline-none cursor-pointer z-10"
              style={{
                backgroundColor: active ? `${themeColor}12` : 'transparent'
              }}
            >
              <Icon 
                className={iconClass}
                style={iconStyle}
                strokeWidth={active ? 1.5 : 2}
                fill={active ? "currentColor" : "none"}
              />

              {/* Dynamic scroll indicator outline */}
              {active && (
                <motion.div
                  layoutId="activeCircleOutline"
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: themeColor }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Speed Dial instructions label tag */}
      <span className="absolute -bottom-5 right-0 text-[6.5px] font-mono text-slate-500 uppercase tracking-widest leading-none pointer-events-none select-none text-right whitespace-nowrap">
        ⚡ SLIDE TO ZOOM
      </span>
    </div>
  );
}
