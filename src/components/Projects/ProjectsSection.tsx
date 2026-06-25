import { useState, useMemo, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ChevronRight, Server, PhoneCall, Globe, Truck, Users, Search, Code, Cpu, ShieldAlert, X } from 'lucide-react';
import { portfolioData } from '../../data';
import { Project } from '../../types';
import ProjectDetailModal from './ProjectDetailModal';
import { playClickSound, getAccentHex, getAccentTextClass, getAccentBgClass, getAccentBorderClass } from '../../utils';

interface ProjectsSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  dbProjects?: any[];
}

function ProjectsSection({ accentColor, dbProjects }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [hoveredPid, setHoveredPid] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Slider Mouse Drag State
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDraggingTabs, setIsDraggingTabs] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsMouseDown(true);
    setIsDraggingTabs(false);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
    setTimeout(() => {
      setIsDraggingTabs(false);
    }, 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !tabsRef.current) return;
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed scaling factor
    if (Math.abs(x - startX) > 5) {
      setIsDraggingTabs(true);
    }
    tabsRef.current.scrollLeft = scrollLeft - walk;
  };

  const accentTextClass = getAccentTextClass(accentColor);
  const bgAccentClass = getAccentBgClass(accentColor);
  const borderAccentClass = getAccentBorderClass(accentColor);
  
  const getAccentBorderHoverClass = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'hover:border-[#39FF14]/30';
      case 'cyan': return 'hover:border-[#00D4FF]/30';
      case 'pink': return 'hover:border-[#FF007F]/30';
      case 'purple': return 'hover:border-[#BD00FF]/30';
      case 'yellow': return 'hover:border-[#FFE600]/30';
      default: return 'hover:border-[#39FF14]/30';
    }
  };
  const accentBorderHoverClass = getAccentBorderHoverClass(accentColor);

  const getFocusClasses = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'focus:border-[#39FF14] focus:ring-[#39FF14]/20';
      case 'cyan': return 'focus:border-[#00D4FF] focus:ring-[#00D4FF]/20';
      case 'pink': return 'focus:border-[#FF007F] focus:ring-[#FF007F]/20';
      case 'purple': return 'focus:border-[#BD00FF] focus:ring-[#BD00FF]/20';
      case 'yellow': return 'focus:border-[#FFE600] focus:ring-[#FFE600]/20';
      default: return 'focus:border-[#39FF14] focus:ring-[#39FF14]/20';
    }
  };

  // Parse project source: if dbProjects exists and isn't empty, use formatted db projects. Otherwise use static data.
  const projectsToUse: Project[] = useMemo(() => {
    return dbProjects && dbProjects.length > 0
      ? dbProjects.map((p, idx) => {
          const idVal = p.slug || p.id;
          let roleVal = p.role;
          if (idVal === 'geek-creations' && roleVal) {
            roleVal = roleVal.replace(/Founder/gi, 'Lead Developer');
          }
          return {
            id: idVal,
            title: p.title,
            subtitle: p.description,
            tag: roleVal,
            description: p.longDesc || p.description,
            status: p.status,
            logoText: p.title.slice(0, 2).toUpperCase(),
            tech: p.stack || [],
            links: [
              { label: 'Live Site', url: p.liveUrl || '#' },
              { label: 'Repo', url: p.repoUrl || '#' }
            ],
            meta: p.year ? `YEAR: ${p.year} // DB_SYNC` : `TX_RATE: 1.8s // DB_SYNC`
          };
        })
      : portfolioData.projects;
  }, [dbProjects]);

  // Extract unique tags/categories for filter pills
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    projectsToUse.forEach(p => {
      if (p.tag) tags.add(p.tag);
    });
    return ['all', ...Array.from(tags)];
  }, [projectsToUse]);

  // Handle fuzzy search & tag selection filter
  const filteredProjects = useMemo(() => {
    return projectsToUse.filter(project => {
      const matchTag = selectedTag === 'all' || project.tag === selectedTag;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchTag;

      const matchText = 
        project.title.toLowerCase().includes(query) ||
        project.subtitle.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tag.toLowerCase().includes(query) ||
        project.tech.some(t => t.toLowerCase().includes(query));

      return matchTag && matchText;
    });
  }, [projectsToUse, searchQuery, selectedTag]);

  const handleOpenDetail = (project: Project) => {
    playClickSound('synth');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const renderStatus = (statusStr: string) => {
    const isLive = statusStr.includes('Live') || statusStr.includes('🟢');
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[8.5px] font-mono uppercase font-bold ${isLive ? 'border-[#39FF14]/30 bg-[#39FF14]/5 text-[#39FF14]' : 'border-amber-400/30 bg-amber-400/5 text-amber-300'}`}>
        <span className={`w-1 h-1 rounded-full ${isLive ? 'bg-[#39FF14] animate-pulse' : 'bg-amber-400'} inline-block`} />
        {statusStr}
      </span>
    );
  };

  // Check if current view matches default search parameters so we can display Bento Layout.
  // We prefer the beautifully planned Bento view for defaults to satisfy pixel perfection.
  const isDefaultView = searchQuery === '' && selectedTag === 'all';

  // Find standard bento slots for default layout mapping
  const geekCreations = useMemo(() => projectsToUse.find(p => p.id === 'geek-creations') || projectsToUse[0], [projectsToUse]);
  const icatholicIgbo = useMemo(() => projectsToUse.find(p => p.id === 'icatholic-igbo') || projectsToUse[1], [projectsToUse]);
  const biddo = useMemo(() => projectsToUse.find(p => p.id === 'biddo') || projectsToUse[2], [projectsToUse]);
  const standardProjects = useMemo(() => projectsToUse.filter(
    p => p.id !== geekCreations?.id && p.id !== icatholicIgbo?.id && p.id !== biddo?.id
  ), [projectsToUse, geekCreations, icatholicIgbo, biddo]);

  return (
    <section id="projects" className="py-24 border-t border-white/5 relative z-20">
      <motion.div 
        className="max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 text-left">
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-[0.25em] font-extrabold ${accentTextClass} block mb-1`}>
              &gt;_ SECTOR_004 // PRODUCTION SYSTEMS DECK
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight font-display uppercase">
              Project Deployments Bento
            </h2>
          </div>
          <p className="text-xs text-[#8A9BC4] max-w-sm font-mono uppercase">
            A real bento mapping representing high-performance custom engines and commercial software architectures.
          </p>
        </div>

        {/* SMART COCKPIT SEARCH BAR & FILTER CONSOLE */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch font-mono">
            {/* Input wrap */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Search className={`w-3.5 h-3.5 ${accentTextClass} opacity-60`} />
              </div>
              <input
                type="text"
                placeholder="LAUNCH SMART CRYPTO_QUERY... (E.g. Next.js, Web3, iOS, Python)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-slate-950/75 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-hidden ${getFocusClasses(accentColor)} focus:ring-1 transition-all uppercase tracking-wide`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                {searchQuery ? (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-[7.5px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded">SYS_READY</span>
                )}
              </div>
            </div>

            {/* Quick telemetry counter */}
            <div className={`p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between md:justify-start gap-4 text-[9px] min-w-[140px]`}>
              <span className="text-slate-500">MATCH_NODES:</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={filteredProjects.length}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`font-black text-white px-2 py-0.5 rounded-sm bg-white/5 ${accentTextClass}`}
                >
                  {filteredProjects.length} / {projectsToUse.length}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Tag Pills (Horizontal slide-to-scroll carousel track) */}
          <div className="relative w-full overflow-hidden">
            {/* Visual gradient indicators suggesting off-screen content, using the primary background color */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050816] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050816] to-transparent pointer-events-none z-10" />

            <div 
              ref={tabsRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseLeave={handleMouseLeaveOrUp}
              onMouseMove={handleMouseMove}
              className={`flex flex-row flex-nowrap gap-2 overflow-x-auto scrollbar-none py-2 px-1 select-none scroll-smooth ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              {availableTags.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      if (!isDraggingTabs) {
                        playClickSound('click');
                        setSelectedTag(tag);
                      }
                    }}
                    onMouseEnter={() => playClickSound('hover')}
                    className={`px-3.5 py-2.5 rounded-lg border text-[8.5px] font-mono uppercase font-bold tracking-wider cursor-pointer transition-all shrink-0 select-none ${isActive ? `${borderAccentClass} ${bgAccentClass}/10 text-white shadow-[0_0_12px_rgba(57,255,20,0.1)]` : 'border-white/5 bg-slate-950/25 text-slate-400 hover:text-white hover:border-white/10 hover:bg-slate-950/45'}`}
                  >
                    {tag === 'all' ? '● ALL DEPLOYMENTS' : tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE PRESENTATION FLOW */}
        {isDefaultView ? (
          /* BENTO GRID (Upper Section: Ratios 4:4 Left and 2:2 Top/Bottom Right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8 font-sans">
            
            {/* LEFT CONTAINER Slot: GEEK CREATIONS */}
            {geekCreations && (
              <div 
                className={`lg:col-span-8 relative rounded-3xl p-6 md:p-8 bg-[#080D1F] border border-white/5 ${accentBorderHoverClass} hover:shadow-[0_0_25px_rgba(57,255,20,0.04)] transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-fit md:min-h-[420px] cursor-pointer`}
                onMouseEnter={() => {
                  setHoveredPid(geekCreations.id);
                  playClickSound('hover');
                }}
                onMouseLeave={() => setHoveredPid(null)}
                onClick={() => handleOpenDetail(geekCreations)}
              >
                {/* Scanline Sweep overlay on hover */}
                {hoveredPid === geekCreations.id && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39FF14]/5 to-transparent h-1/2 w-full top-0 left-0 animate-[scanline_2s_linear_infinite]" />
                )}

                <div>
                  <div className="flex flex-wrap gap-4 items-start sm:items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.01] border border-white/10 flex items-center justify-center font-display font-black text-[#39FF14] text-xs">
                        {geekCreations.logoText}
                      </div>
                      <div>
                        <span className="block text-[8px] text-[#8A9BC4] uppercase tracking-wider font-mono">PRIMARY FEATURE CARD [4:4]</span>
                        <span className="block text-white font-bold text-xs uppercase font-mono leading-tight">{geekCreations.tag}</span>
                      </div>
                    </div>
                    {renderStatus(geekCreations.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 space-y-3.5 text-left">
                      <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase leading-tight group-hover:text-[#39FF14] transition-colors">
                        {geekCreations.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#39FF14] font-mono leading-relaxed font-bold">
                        {geekCreations.subtitle}
                      </p>
                      <p className="text-xs text-[#8A9BC4] leading-relaxed max-w-2xl font-normal pt-2">
                        {geekCreations.description}
                      </p>
                    </div>
                    {geekCreations.image && (
                      <div className="md:col-span-5 relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-slate-950/40">
                        <img
                          src={geekCreations.image}
                          alt={geekCreations.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080D1F]/50 to-transparent" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4 mt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {geekCreations.tech.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-2.5 py-1 rounded bg-white/[0.02] border border-white/5 text-[#8A9BC4]">
                        {t.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 items-center justify-between font-mono text-[9px] text-[#8A9BC4]">
                    <span className="break-all">{geekCreations.meta}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(geekCreations);
                        }}
                        className="inline-flex items-center gap-1 font-bold text-white hover:text-[#39FF14] transition-colors px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[9.5px]"
                      >
                        INSPECT SPECT_DECK
                        <ChevronRight className="w-3 h-3 text-[#39FF14]" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* RIGHT CONTAINER COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6 justify-between items-stretch">
              
              {/* Top Right Slot: iCATHOLIC IGBO */}
              {icatholicIgbo && (
                <div 
                  className={`rounded-3xl p-6 bg-[#080D1F] border border-white/5 ${accentBorderHoverClass} hover:shadow-[0_0_25px_rgba(57,255,20,0.04)] transition-all duration-300 flex flex-col justify-between group overflow-hidden flex-1 cursor-pointer`}
                  onMouseEnter={() => {
                    setHoveredPid(icatholicIgbo.id);
                    playClickSound('hover');
                  }}
                  onMouseLeave={() => setHoveredPid(null)}
                  onClick={() => handleOpenDetail(icatholicIgbo)}
                >
                  <div>
                    <div className="flex flex-wrap gap-2 items-start sm:items-center justify-between mb-4">
                      <span className="text-[8px] text-[#8A9BC4] uppercase tracking-wider font-mono">BENTO_SLOT [2:2]</span>
                      {renderStatus(icatholicIgbo.status)}
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="block text-[9.5px] text-[#00D4FF] font-mono leading-normal uppercase tracking-wide font-bold">{icatholicIgbo.tag}</span>
                      <h3 className="text-lg md:text-xl font-display font-black text-white uppercase group-hover:text-[#39FF14] transition-colors pt-1 leading-tight">
                        {icatholicIgbo.title}
                      </h3>
                      {icatholicIgbo.image && (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-950/40 my-3">
                          <img
                            src={icatholicIgbo.image}
                            alt={icatholicIgbo.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080D1F]/50 to-transparent" />
                        </div>
                      )}
                      <p className="text-[10px] text-[#8A9BC4] leading-relaxed pt-1.5 font-normal">
                        {icatholicIgbo.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 space-y-4 font-sans">
                    <div className="flex flex-wrap gap-1">
                      {icatholicIgbo.tech.map((t, idx) => (
                        <span key={idx} className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/[0.02] border border-white/5 text-[#8A9BC4]">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-between font-mono text-[8px] text-[#8A9BC4]">
                      <span className="break-all">{icatholicIgbo.meta}</span>
                      <span className="text-white hover:text-[#39FF14] font-black group-hover:underline shrink-0">SPEC_VIEW ▶</span>
                    </div>
                  </div>

                </div>
              )}

              {/* Bottom Right Slot: BIDDO */}
              {biddo && (
                <div 
                  className={`rounded-3xl p-6 bg-[#080D1F] border border-white/5 ${accentBorderHoverClass} hover:shadow-[0_0_25px_rgba(57,255,20,0.04)] transition-all duration-300 flex flex-col justify-between group overflow-hidden flex-1 cursor-pointer`}
                  onMouseEnter={() => {
                    setHoveredPid(biddo.id);
                    playClickSound('hover');
                  }}
                  onMouseLeave={() => setHoveredPid(null)}
                  onClick={() => handleOpenDetail(biddo)}
                >
                  <div>
                    <div className="flex flex-wrap gap-2 items-start sm:items-center justify-between mb-4">
                      <span className="text-[8px] text-[#8A9BC4] uppercase tracking-wider font-mono">BENTO_SLOT [2:2]</span>
                      {renderStatus(biddo.status)}
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="block text-[9.5px] text-emerald-400 font-mono leading-normal uppercase tracking-wide font-bold">{biddo.tag}</span>
                      <h3 className="text-lg md:text-xl font-display font-black text-white uppercase group-hover:text-[#39FF14] transition-colors pt-1 leading-tight">
                        {biddo.title}
                      </h3>
                      {biddo.image && (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-950/40 my-3">
                          <img
                            src={biddo.image}
                            alt={biddo.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080D1F]/50 to-transparent" />
                        </div>
                      )}
                      <p className="text-[10px] text-[#8A9BC4] leading-relaxed pt-1.5 font-normal">
                        {biddo.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 space-y-4 font-sans">
                    <div className="flex flex-wrap gap-1">
                      {biddo.tech.map((t, idx) => (
                        <span key={idx} className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/[0.02] border border-white/5 text-[#8A9BC4]">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-between font-mono text-[8px] text-[#8A9BC4]">
                      <span className="break-all">{biddo.meta}</span>
                      <span className="text-white hover:text-[#39FF14] font-black group-hover:underline shrink-0">SPEC_VIEW ▶</span>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        ) : null}

        {/* PROJECTS CONTAINER */}
        <div>
          {/* Conditional Subtitle changes depending on searching state */}
          <span className="block text-left font-mono text-[8.5px] uppercase text-slate-500 tracking-widest mb-4">
            {isDefaultView ? '// STANDARD SYSTEM IMPLEMENTATIONS REGISTER' : '// ACTIVE SYSTEM QUERY DECK MATCHES'}
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(isDefaultView ? standardProjects : filteredProjects).map((p) => (
              <div 
                key={p.id}
                className={`rounded-2xl p-5 bg-[#080D1F] border border-white/5 ${accentBorderHoverClass} hover:shadow-[0_0_15px_rgba(57,255,20,0.02)] transition-all duration-300 flex flex-col justify-between group text-left relative overflow-hidden cursor-pointer`}
                onMouseEnter={() => {
                  setHoveredPid(p.id);
                  playClickSound('hover');
                }}
                onMouseLeave={() => setHoveredPid(null)}
                onClick={() => handleOpenDetail(p)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-6.5 h-6.5 rounded bg-white/[0.01] border border-white/5 flex items-center justify-center font-display font-black text-[#39FF14] text-[8.5px]">
                      {p.logoText}
                    </div>
                    {renderStatus(p.status)}
                  </div>

                  {p.image && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-950 mb-3.5">
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104 pr-[1px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080D1F]/60 via-transparent to-transparent opacity-85" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="block text-[8px] font-mono text-slate-400 font-bold uppercase tracking-wide">{p.tag}</span>
                    <h4 className="text-sm font-display font-black text-white uppercase group-hover:text-[#39FF14] transition-colors leading-tight">{p.title}</h4>
                    <p className="text-[10.5px] text-[#8A9BC4] leading-relaxed font-normal">{p.subtitle}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {p.tech.map((t, idx) => (
                      <span key={idx} className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.01] border border-white/5 text-[#8A9BC4]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between font-mono text-[7.5px] text-[#8A9BC4]">
                    <span>{p.meta}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(p);
                      }}
                      className="text-white hover:text-[#39FF14] font-black hover:underline cursor-pointer"
                    >
                      INSPECT [▶]
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {/* Empty Matches state for query */}
            {!isDefaultView && filteredProjects.length === 0 && (
              <div className="col-span-full border border-dashed border-white/10 rounded-2xl p-16 text-center font-mono space-y-3 bg-slate-950/20">
                <ShieldAlert className="w-8 h-8 mx-auto text-amber-500 animate-pulse" />
                <span className="block text-white uppercase text-[10px] font-bold tracking-widest">
                  CRITICAL FAULT: NO INTERSECTING TRANSMISSION NODES
                </span>
                <p className="text-[9.5px] text-slate-500 max-w-sm mx-auto uppercase">
                  No core projects currently match query "{searchQuery.toUpperCase()}" under the "{selectedTag.toUpperCase()}" scope configuration.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('all');
                  }}
                  className={`mt-2 inline-block text-[9px] uppercase font-black px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-[#39FF14]`}
                >
                  DE-ALLOCATE QUERY FILTER
                </button>
              </div>
            )}
          </div>
        </div>

      </motion.div>

      {/* FULL SPECS DETAIL DISPATCH MODAL */}
      <ProjectDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        accentColor={accentColor}
      />
    </section>
  );
}

export default memo(ProjectsSection);
