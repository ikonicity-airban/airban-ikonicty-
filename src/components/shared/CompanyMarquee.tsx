import { motion } from 'motion/react';
import { Flame, Sparkles, Shield, Award, BrainCircuit, Layers, Cpu, Compass } from 'lucide-react';
import { getAccentTextClass, getAccentHex } from '../../utils';

interface CompanyMarqueeProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

interface CompanyItem {
  name: string;
  icon: React.ComponentType<any>;
  tag: string;
  color: string;
}

const companies: CompanyItem[] = [
  { name: 'CodeOven Tech', icon: Flame, tag: 'SaaS & Mobile', color: '#FF5733' },
  { name: 'Geek Creations', icon: Sparkles, tag: 'Bespoke Software', color: '#9D00FF' },
  { name: 'iCatholic Igbo', icon: Cpu, tag: '70k+ Mobile'  , color: '#39FF14' },
  { name: 'SOFE Group', icon: Shield, tag: 'Enterprise Dev', color: '#00E5FF' },
  { name: 'PWorld Concepts', icon: Layers, tag: 'Architectural Tech', color: '#FFE600' },
  { name: 'The Seventh Legion', icon: Award, tag: 'Web3 Logistics', color: '#FF007F' },
  { name: 'RabbAi AI', icon: BrainCircuit, tag: 'AI EdTech Shards', color: '#8A9BC4' },
  { name: 'Wisdom Internet', icon: Compass, tag: 'Systems Analytics', color: '#007ACC' }
];

// Double/triple the list for infinite scrolling illusion
const marqueeItems = [...companies, ...companies, ...companies];

export default function CompanyMarquee({ accentColor }: CompanyMarqueeProps) {
  const accentTextClass = getAccentTextClass(accentColor);
  const accentHex = getAccentHex(accentColor);

  return (
    <div id="marquee" className="py-12 border-y border-white/5 bg-[#050816]/80 backdrop-blur-md relative overflow-hidden z-20 select-none">
      
      {/* Background glowing highlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-12 bg-white/5 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-12 bg-white/5 blur-[80px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">
          <span className={`w-1.5 h-1.5 rounded-full animate-ping`} style={{ backgroundColor: accentHex }} />
          <span>SYS_PROJ_ENTRUSTED // CORPORATE SYNERGIES</span>
        </div>
        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest hidden sm:inline">
          STATUS: VERIFIED PARTNERSHIPS
        </span>
      </div>

      {/* Mask container to fade out the edges left and right */}
      <div className="relative w-full flex items-center">
        {/* Left Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
        
        {/* Right Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track sliding continuously */}
        <motion.div 
          className="flex gap-4 sm:gap-6 pr-4 whitespace-nowrap"
          animate={{ x: [0, -1400] }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          {marqueeItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Logo Icon and Circle */}
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-colors shrink-0"
                  style={{ 
                    borderColor: `${item.color}1a`, 
                    backgroundColor: `${item.color}0a` 
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" style={{ color: item.color }} />
                </div>

                {/* Company Name and Category Tag */}
                <div className="flex flex-col text-left">
                  <span className="text-[11px] sm:text-xs font-mono font-extrabold text-white uppercase tracking-tight">
                    {item.name}
                  </span>
                  <span className="text-[8px] font-mono text-slate-400 font-medium uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
