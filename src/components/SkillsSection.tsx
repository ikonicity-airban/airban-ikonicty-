import { motion } from 'motion/react';
import { Cpu, Terminal, GitBranch, Database, Shield, Radio } from 'lucide-react';
import { portfolioData } from '../data';
import { playClickSound, getAccentTextClass, getAccentBgClass } from '../utils';

interface SkillsSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

export default function SkillsSection({ accentColor }: SkillsSectionProps) {
  const accentTextClass = getAccentTextClass(accentColor);
  
  const getGlowShadowClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_20px_rgba(57,255,20,0.1)]';
      case 'cyan': return 'shadow-[0_0_20px_rgba(0,212,255,0.1)]';
      case 'pink': return 'shadow-[0_0_20px_rgba(255,0,127,0.1)]';
      case 'purple': return 'shadow-[0_0_20px_rgba(189,0,255,0.1)]';
      case 'yellow': return 'shadow-[0_0_20px_rgba(255,230,0,0.1)]';
      default: return 'shadow-[0_0_20px_rgba(57,255,20,0.1)]';
    }
  };
  const glowShadowClass = getGlowShadowClass(accentColor);

  const getDotAccentClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'bg-[#39FF14]/70';
      case 'cyan': return 'bg-[#00D4FF]/70';
      case 'pink': return 'bg-[#FF007F]/70';
      case 'purple': return 'bg-[#BD00FF]/70';
      case 'yellow': return 'bg-[#FFE600]/70';
      default: return 'bg-[#39FF14]/70';
    }
  };
  const dotAccentClass = getDotAccentClass(accentColor);

  const getHoverBorderAccentClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'hover:border-[#39FF14]/30';
      case 'cyan': return 'hover:border-[#00D4FF]/30';
      case 'pink': return 'hover:border-[#FF007F]/30';
      case 'purple': return 'hover:border-[#BD00FF]/30';
      case 'yellow': return 'hover:border-[#FFE600]/30';
      default: return 'hover:border-[#39FF14]/30';
    }
  };
  const hoverBorderAccentClass = getHoverBorderAccentClass(accentColor);

  // Helper icons for categories to add micro-details
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toUpperCase()) {
      case 'LANGUAGES': return <Terminal className={`w-4 h-4 ${accentTextClass}`} />;
      case 'FRONTEND': return <Cpu className="w-4 h-4 text-[#00D4FF]" />;
      case 'BACKEND': return <GitBranch className="w-4 h-4 text-emerald-400" />;
      case 'DATABASES': return <Database className="w-4 h-4 text-amber-400" />;
      case 'CLOUD & DEVOPS': return <Shield className={`w-4 h-4 ${accentTextClass}`} />;
      default: return <Radio className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 border-t border-white/5 bg-[#080D1F]/30 relative z-20">
      <motion.div 
        className="max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 text-left">
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-[0.25em] font-extrabold ${accentTextClass} block mb-1`}>
              &gt;_ SECTOR_003 // SYSTEMS BLUEPRINTS
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-none font-display uppercase">
              Skills &amp; Technologies Manifest
            </h2>
          </div>
          <p className="text-xs text-[#8A9BC4] max-w-sm font-mono uppercase">
            Surgical list of stacks organized by system execution. Zero fluff or arbitrary percentage meters.
          </p>
        </div>

        {/* Grouped, flat lists without proficiency progress bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolioData.skillsGrouped.map((group, idx) => (
            <div 
              key={idx}
              onMouseEnter={() => playClickSound('hover')}
              className={`p-5 rounded-2xl bg-[#050816] border border-white/5 hover:border-white/10 transition-all duration-300 text-left flex flex-col justify-between ${glowShadowClass}`}
            >
              <div className="space-y-4">
                {/* Title Line */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(group.category)}
                    <span className="text-xs font-mono font-black text-white uppercase tracking-wider">
                      {group.category}
                    </span>
                  </div>
                  <span className="text-[7.5px] font-mono text-slate-500 uppercase">SYS_ACT_0{idx+1}</span>
                </div>

                {/* Flat bullet points list */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {group.skills.map((skill, skillIdx) => (
                    <span 
                      key={skillIdx}
                      onClick={() => playClickSound('click')}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        playClickSound('hover');
                      }}
                      className={`inline-flex items-center text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded bg-white/[0.01] border border-white/5 text-[#8A9BC4] hover:text-white ${hoverBorderAccentClass} hover:scale-[1.04] transition-all cursor-pointer select-none`}
                    >
                      <span className={`w-1 h-1 ${dotAccentClass} rounded-full mr-2 inline-block shrink-0`} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Indicator */}
              <div className="pt-3.5 border-t border-white/5 mt-5 flex justify-between items-center text-[8px] font-mono text-slate-600 select-none">
                <span>MODULE: COMPONENT_FLOW</span>
                <span>STATUS: STABLE</span>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
