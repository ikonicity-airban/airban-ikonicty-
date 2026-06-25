import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAccentHex, getAccentTextClass, getAccentBgClass, getAccentRgba } from '../../utils';

interface Testimonial {
  id: string;
  source: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  initials: string;
}

const defaultTestimonialsData: Testimonial[] = [
  {
    id: "01",
    source: "PWorld Concepts",
    name: "Dr. Pascal",
    title: "Executive Director",
    company: "PWorld Concepts",
    quote: "Working with Eban on iCatholic Igbo was a turning point for the project. He came into a complex, untyped codebase and delivered clean, reliable features without breaking anything. His debugging process is methodical and his communication is straightforward.",
    initials: "DP"
  },
  {
    id: "02",
    source: "SOFE Group",
    name: "Engr. Shedrack",
    title: "Engineering Lead / Systems Architect",
    company: "SOFE Group",
    quote: "Eban led the development of our main platform from the ground up. He made strong technical decisions under pressure, shipped on time, and continued to contribute well beyond the lead role. He's the kind of engineer who owns the problem.",
    initials: "ES"
  },
  {
    id: "03",
    source: "Geek Creations",
    name: "Glowrya",
    title: "Product Owner",
    company: "Geek Creations",
    quote: "He doesn't just build what you ask for — he asks the right questions first. The platform he's building for us handles payment complexity that most developers would have pushed back on. Reliable, thorough, and genuinely invested.",
    initials: "GL"
  }
];

interface TestimonialsSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  dbTestimonials?: any[];
}

export default function TestimonialsSection({ accentColor, dbTestimonials }: TestimonialsSectionProps) {
  const testimonialsToUse: Testimonial[] = dbTestimonials && dbTestimonials.length > 0
    ? dbTestimonials
        .filter(t => t.isVisible !== false)
        .map((t, idx) => ({
          id: t.id || String(idx),
          source: t.company || '',
          name: t.authorName,
          title: t.authorRole || 'Client partner',
          company: t.company || 'Partner',
          quote: t.quote,
          initials: t.authorName ? t.authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'CL'
        }))
    : defaultTestimonialsData;

  const [activeIndex, setActiveIndex] = useState(0); 
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsToUse.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === testimonialsToUse.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance behavior (4s interval) - pause on hover, auto-advance OFF on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile || isHovered || testimonialsToUse.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, activeIndex, testimonialsToUse.length]);

  // Handle Touch Swipes for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = touchStartX.current - currentX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const textAccentClass = getAccentTextClass(accentColor);
  const accentHex = getAccentHex(accentColor);

  const getBorderActiveCard = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/40 shadow-[0_8px_40px_rgba(57,255,20,0.15)] z-20';
      case 'cyan': return 'border-[#00D4FF]/40 shadow-[0_8px_40px_rgba(0,212,255,0.15)] z-20';
      case 'pink': return 'border-[#FF007F]/40 shadow-[0_8px_40px_rgba(255,0,127,0.15)] z-20';
      case 'purple': return 'border-[#BD00FF]/40 shadow-[0_8px_40px_rgba(189,0,255,0.15)] z-20';
      case 'yellow': return 'border-[#FFE600]/40 shadow-[0_8px_40px_rgba(255,230,0,0.15)] z-20';
      default: return 'border-[#39FF14]/40 shadow-[0_8px_40px_rgba(57,255,20,0.15)] z-20';
    }
  };

  const getBorderHoverCard = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'hover:border-[#39FF14]/15';
      case 'cyan': return 'hover:border-[#00D4FF]/15';
      case 'pink': return 'hover:border-[#FF007F]/15';
      case 'purple': return 'hover:border-[#BD00FF]/15';
      case 'yellow': return 'hover:border-[#FFE600]/15';
      default: return 'hover:border-[#39FF14]/15';
    }
  };

  const getArrowBtnHover = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'hover:border-[#39FF14] hover:text-[#39FF14]';
      case 'cyan': return 'hover:border-[#00D4FF] hover:text-[#00D4FF]';
      case 'pink': return 'hover:border-[#FF007F] hover:text-[#FF007F]';
      case 'purple': return 'hover:border-[#BD00FF] hover:text-[#BD00FF]';
      case 'yellow': return 'hover:border-[#FFE600] hover:text-[#FFE600]';
      default: return 'hover:border-[#39FF14] hover:text-[#39FF14]';
    }
  };

  const getDividerBg = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'bg-[#39FF14]/15';
      case 'cyan': return 'bg-[#00D4FF]/15';
      case 'pink': return 'bg-[#FF007F]/15';
      case 'purple': return 'bg-[#BD00FF]/15';
      case 'yellow': return 'bg-[#FFE600]/15';
      default: return 'bg-[#39FF14]/15';
    }
  };

  const getAvatarBorder = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'bg-[#39FF14]/10 border-[#39FF14]/20';
      case 'cyan': return 'bg-[#00D4FF]/10 border-[#00D4FF]/20';
      case 'pink': return 'bg-[#FF007F]/10 border-[#FF007F]/20';
      case 'purple': return 'bg-[#BD00FF]/10 border-[#BD00FF]/20';
      case 'yellow': return 'bg-[#FFE600]/10 border-[#FFE600]/20';
      default: return 'bg-[#39FF14]/10 border-[#39FF14]/20';
    }
  };

  const getDotIndicatorClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]';
      case 'cyan': return 'bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]';
      case 'pink': return 'bg-[#FF007F] shadow-[0_0_8px_#FF007F]';
      case 'purple': return 'bg-[#BD00FF] shadow-[0_0_8px_#BD00FF]';
      case 'yellow': return 'bg-[#FFE600] shadow-[0_0_8px_#FFE600]';
      default: return 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]';
    }
  };

  const getMobileCardBorder = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/25';
      case 'cyan': return 'border-[#00D4FF]/25';
      case 'pink': return 'border-[#FF007F]/25';
      case 'purple': return 'border-[#BD00FF]/25';
      case 'yellow': return 'border-[#FFE600]/25';
      default: return 'border-[#39FF14]/25';
    }
  };

  // Get ordered indices so that active card is in middle on desktop
  const getVisibleOrder = () => {
    const len = testimonialsToUse.length;
    const leftIdx = (activeIndex - 1 + len) % len;
    const centerIdx = activeIndex;
    const rightIdx = (activeIndex + 1) % len;
    return [leftIdx, centerIdx, rightIdx];
  };

  const visibleOrder = getVisibleOrder();

  return (
    <section 
      id="testimonials" 
      className="py-24 border-t border-white/5 relative z-20 overflow-hidden bg-[#050816]/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background neon lights */}
      <div 
        className="absolute left-0 bottom-0 w-[50vw] aspect-square rounded-full pointer-events-none z-0 filter blur-[140px] opacity-[0.03]"
        style={{
          background: `radial-gradient(circle, ${getAccentRgba(accentColor, 0.4)} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-20 text-left">
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-[0.25em] font-extrabold ${textAccentClass} block mb-2`}>
              &gt;_ SECTOR_006 // CLIENT REVIEWS
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-none font-display uppercase">
              What People Say
            </h2>
          </div>
          <p className="text-xs text-[#CAD5EE] max-w-sm leading-relaxed font-mono">
            Vouched engineering outcomes delivered to key project organizers and system architects.
          </p>
        </div>

        {/* ─── DESKTOP CAROUSEL (Visible on md and above) ─── */}
        <div className="hidden md:flex flex-col items-center justify-center relative py-12">
          
          {/* Main Cards Row */}
          <div className="flex items-center justify-center gap-6 min-h-[380px]">
            {/* Prev Trigger Button */}
            <button 
              onClick={prevSlide}
              className={`w-10 h-10 rounded-full border border-[#1A2544] flex items-center justify-center text-[#8A9BC4] ${getArrowBtnHover(accentColor)} transition-all cursor-pointer shrink-0`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Render 3 cards. Center is active. */}
            <div className="flex items-center justify-center gap-6 overflow-visible w-[1200px]">
              {visibleOrder.map((cardIdx, visiblePosition) => {
                if (cardIdx >= testimonialsToUse.length) return null;
                const item = testimonialsToUse[cardIdx];
                const isCenter = visiblePosition === 1;

                return (
                  <motion.div
                    key={`${item.id}-${visiblePosition}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: isCenter ? 1 : 0.65, 
                      scale: isCenter ? 1.03 : 1.0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`w-[380px] shrink-0 bg-[#080D1F] rounded-xl p-8 relative flex flex-col justify-between text-left h-[340px] border transition-all duration-200 ${
                      isCenter 
                        ? `${getBorderActiveCard(accentColor)}` 
                        : `border-[#1A2544] ${getBorderHoverCard(accentColor)} z-10 opacity-70`
                    }`}
                  >
                    {/* Big quotation mark in background */}
                    <span className="absolute top-4 left-6 font-display text-[5.5rem] leading-none opacity-15 select-none pointer-events-none" style={{ color: accentHex }}>
                      "
                    </span>

                    {/* Quote text */}
                    <div className="relative z-10 pt-4">
                      <p className="font-mono text-[0.88rem] leading-relaxed text-[#F0F4FF] line-clamp-6">
                        {item.quote}
                      </p>
                    </div>

                    {/* Bottom identity stack with Divider */}
                    <div className="space-y-4">
                      <div className={`h-[1px] w-full ${getDividerBg(accentColor)}`} />
                      
                      <div className="flex items-center gap-3.5">
                        {/* Circle Avatar placeholder */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getAvatarBorder(accentColor)}`}>
                          <span className="font-accent font-black text-xs uppercase" style={{ color: accentHex }}>
                            {item.initials}
                          </span>
                        </div>

                        {/* Text Metadata */}
                        <div className="min-w-0">
                          <h4 className="font-accent font-bold text-[#F0F4FF] text-[14px] leading-tight truncate">
                            {item.name}
                          </h4>
                          <p className="font-mono text-[#8A9BC4] text-[11px] leading-tight mt-0.5 truncate">
                            {item.title}
                          </p>
                          <p className="font-mono text-[11px] leading-none mt-1 font-semibold tracking-wider uppercase" style={{ color: accentHex }}>
                            {item.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Next Trigger Button */}
            <button 
              onClick={nextSlide}
              className={`w-10 h-10 rounded-full border border-[#1A2544] flex items-center justify-center text-[#8A9BC4] ${getArrowBtnHover(accentColor)} transition-all cursor-pointer shrink-0`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {testimonialsToUse.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 transition-all duration-200 cursor-pointer ${
                  idx === activeIndex 
                    ? getDotIndicatorClass(accentColor) 
                    : 'bg-[#1A2544]'
                }`}
                style={{ borderRadius: '0px' }} // square dot
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ─── MOBILE CAROUSEL (Visible on sm/mobile) ─── */}
        <div className="md:hidden flex flex-col items-center justify-center relative py-6">
          <div 
            className="w-full relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              {testimonialsToUse.length > 0 && activeIndex < testimonialsToUse.length && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className={`w-full bg-[#080D1F] border rounded-xl p-8 relative flex flex-col justify-between text-left h-[350px] ${getMobileCardBorder(accentColor)}`}
                >
                  {/* Big quotation mark */}
                  <span className="absolute top-4 left-6 font-display text-[4.5rem] leading-none opacity-15 select-none pointer-events-none" style={{ color: accentHex }}>
                    "
                  </span>

                  {/* Quote text */}
                  <div className="relative z-10 pt-4">
                    <p className="font-mono text-[0.85rem] leading-relaxed text-[#F0F4FF] line-clamp-7">
                      {testimonialsToUse[activeIndex].quote}
                    </p>
                  </div>

                  {/* Bottom identity stack */}
                  <div className="space-y-4">
                    <div className={`h-[1px] w-full ${getDividerBg(accentColor)}`} />
                    
                    <div className="flex items-center gap-3.5">
                      {/* Circle Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getAvatarBorder(accentColor)}`}>
                        <span className="font-accent font-black text-xs uppercase" style={{ color: accentHex }}>
                          {testimonialsToUse[activeIndex].initials}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="min-w-0">
                        <h4 className="font-accent font-bold text-[#F0F4FF] text-[13px] leading-tight truncate">
                          {testimonialsToUse[activeIndex].name}
                        </h4>
                        <p className="font-mono text-[#8A9BC4] text-[11px] leading-tight mt-0.5 truncate">
                          {testimonialsToUse[activeIndex].title}
                        </p>
                        <p className="font-mono text-[10px] leading-none mt-1 font-semibold tracking-wider uppercase" style={{ color: accentHex }}>
                          {testimonialsToUse[activeIndex].company}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swipe Hint */}
          <p className="text-[9px] font-mono text-[#CAD5EE]/40 uppercase tracking-widest mt-4">
            ← SWIPE TO ROTATE COMMS →
          </p>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {testimonialsToUse.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 transition-all duration-200 cursor-pointer ${
                  idx === activeIndex 
                    ? getDotIndicatorClass(accentColor) 
                    : 'bg-[#1A2544]'
                }`}
                style={{ borderRadius: '0px' }} // square dot
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
