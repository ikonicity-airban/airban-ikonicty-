import { motion } from 'motion/react';
import { getAccentHex, getAccentTextClass, getAccentBgClass } from '../../utils';

interface SectionDividerProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  label: string;
  sourceSector?: string;
  targetSector?: string;
}

export default function SectionDivider({ accentColor, label, sourceSector, targetSector }: SectionDividerProps) {
  const accentColorHex = getAccentHex(accentColor);
  const textAccentClass = getAccentTextClass(accentColor);
  const bgAccentClass = getAccentBgClass(accentColor);
  const getBorderAccentClassWithOpacity20 = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/20';
      case 'cyan': return 'border-[#00D4FF]/20';
      case 'pink': return 'border-[#FF007F]/20';
      case 'purple': return 'border-[#BD00FF]/20';
      case 'yellow': return 'border-[#FFE600]/20';
      default: return 'border-[#39FF14]/20';
    }
  };
  const borderAccentClass = getBorderAccentClassWithOpacity20(accentColor);

  return (
    <div className="w-full relative py-8 overflow-hidden select-none" id={`divider-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Absolute background grid marker */}
      <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none opacity-20">
        <span className="font-mono text-[8px] text-slate-500">[LAT_LOG_LOCKED]</span>
        <span className="font-mono text-[8px] text-slate-500">[FRQ_BAND_STABLE]</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative flex items-center">
        {/* Left Side: Sector Transition Status */}
        {sourceSector && targetSector ? (
          <div className="hidden md:flex items-center gap-2 font-mono text-[8.5px] font-bold text-slate-500 mr-6 bg-slate-950/40 border border-white/5 px-2 py-1 rounded-sm">
            <span className={textAccentClass}>{sourceSector}</span>
            <span>⇄</span>
            <span>{targetSector}</span>
          </div>
        ) : null}

        {/* Laser alignment line */}
        <div className="flex-1 h-[1px] relative bg-linear-to-r from-transparent via-white/10 to-transparent">
          {/* Pulsing signal dot running along the laser axis */}
          <motion.div 
            className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${bgAccentClass} blur-xs`}
            animate={{ 
              left: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </div>

        {/* Center: HUD Sector Lock Indicator */}
        <div className="mx-6 flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] font-extrabold bg-slate-950/80 px-4 py-1.5 border border-white/10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <span className={`w-1.5 h-1.5 rounded-full ${bgAccentClass} animate-ping`} style={{ animationDuration: '2.5s' }} />
          <span className={`w-1 h-1 rounded-full ${bgAccentClass} absolute`} />
          <span className="text-white">{label}</span>
          <span className={textAccentClass}>// SEC_ALIGN</span>
        </div>

        {/* Right Laser alignment line */}
        <div className="flex-1 h-[1px] relative bg-linear-to-r from-transparent via-white/10 to-transparent">
          {/* Signal dot travelling in reverse logic */}
          <motion.div 
            className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${bgAccentClass} blur-xs`}
            animate={{ 
              right: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "linear",
              delay: 1.7
            }}
          />
        </div>

        {/* Tech decorative crosshairs */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-[8.5px] text-slate-500 ml-6">
          <span>COORDS:</span>
          <span className="text-white">[E-024 // N-309]</span>
        </div>
      </div>
    </div>
  );
}
