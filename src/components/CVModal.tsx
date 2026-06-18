import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Code2, 
  Cpu, 
  Sparkles,
  Layers,
  Terminal,
  Settings
} from 'lucide-react';
import { playClickSound, handleDownloadCV, getAccentTextClass, getAccentBgClass } from '../utils';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

export default function CVModal({ isOpen, onClose, accentColor }: CVModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isGreen = accentColor === 'green';
  const textAccent = getAccentTextClass(accentColor);
  const bgAccent = getAccentBgClass(accentColor);

  const getAccentHexColor = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return '#16a34a';
      case 'cyan': return '#0891b2';
      case 'pink': return '#db2777';
      case 'purple': return '#9333ea';
      case 'yellow': return '#ca8a04';
      default: return '#16a34a';
    }
  };
  const accentColorHex = getAccentHexColor(accentColor);

  const getBorderAccent = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/30';
      case 'cyan': return 'border-[#00D4FF]/30';
      case 'pink': return 'border-[#FF007F]/30';
      case 'purple': return 'border-[#BD00FF]/30';
      case 'yellow': return 'border-[#FFE600]/30';
      default: return 'border-[#39FF14]/30';
    }
  };

  const getBorderAccentStrong = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]';
      case 'cyan': return 'border-[#00D4FF]';
      case 'pink': return 'border-[#FF007F]';
      case 'purple': return 'border-[#BD00FF]';
      case 'yellow': return 'border-[#FFE600]';
      default: return 'border-[#39FF14]';
    }
  };

  const getGlowShadow = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_25px_rgba(57,255,20,0.15)]';
      case 'cyan': return 'shadow-[0_0_25px_rgba(0,212,255,0.15)]';
      case 'pink': return 'shadow-[0_0_25px_rgba(255,0,127,0.15)]';
      case 'purple': return 'shadow-[0_0_25px_rgba(189,0,255,0.15)]';
      case 'yellow': return 'shadow-[0_0_25px_rgba(255,230,0,0.15)]';
      default: return 'shadow-[0_0_25px_rgba(57,255,20,0.15)]';
    }
  };

  const getPrintHeaderColor = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return '#1E9E06';
      case 'cyan': return '#0083B0';
      case 'pink': return '#D8006B';
      case 'purple': return '#9D00D8';
      case 'yellow': return '#B2A000';
      default: return '#1E9E06';
    }
  };

  const getPrintBorderColor = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return '#5aff40';
      case 'cyan': return '#4cd9ff';
      case 'pink': return '#ff4099';
      case 'purple': return '#df40ff';
      case 'yellow': return '#ffea40';
      default: return '#5aff40';
    }
  };

  const borderAccent = getBorderAccent(accentColor);
  const borderAccentStrong = getBorderAccentStrong(accentColor);
  const glowShadow = getGlowShadow(accentColor);
  
  const hColorLeft = textAccent;

  const getComplementaryAccent = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'text-[#50E4FF]'; // cyan
      case 'cyan': return 'text-[#85FF50]'; // green
      case 'pink': return 'text-[#BD00FF]'; // purple
      case 'purple': return 'text-[#FF007F]'; // pink
      case 'yellow': return 'text-[#FF007F]'; // pink
      default: return 'text-[#50E4FF]';
    }
  };
  const hColorRight = getComplementaryAccent(accentColor);

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    playClickSound('success');
    
    // Hold original styles reference for restoration in finally block
    const stylesheets = Array.from(document.querySelectorAll('style'));
    const originalContents = stylesheets.map(style => style.textContent || '');
    const originalFetch = window.fetch;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      // Temporarily transform all oklch() color functions in document stylesheets to standard rgb()/rgba() colors.
      // This prevents html2canvas's CSS parser from throwing "unsupported color function oklch" errors!
      const processOklchText = (cssText: string) => {
        return cssText.replace(/oklch\s*\(([^)]+)\)/gi, (match, inner) => {
          try {
            const parts = inner.trim().split(/[\s/]+/).filter(Boolean);
            const lStr = parts[0];
            const cStr = parts[1];
            const hStr = parts[2];

            let L = parseFloat(lStr);
            if (lStr.includes('%')) L /= 100;

            const C = parseFloat(cStr);
            const H = parseFloat(hStr) || 0;

            let r = 0, g = 0, b = 0;

            if (C < 0.04) {
              // Gray/slate colors
              if (L >= 0.95) { r = 248; g = 250; b = 252; }
              else if (L >= 0.90) { r = 241; g = 245; b = 249; }
              else if (L >= 0.82) { r = 226; g = 232; b = 240; }
              else if (L >= 0.72) { r = 203; g = 213; b = 225; }
              else if (L >= 0.60) { r = 148; g = 163; b = 184; }
              else if (L >= 0.50) { r = 100; g = 116; b = 139; }
              else if (L >= 0.42) { r = 71; g = 85; b = 105; }
              else if (L >= 0.34) { r = 51; g = 65; b = 85; }
              else if (L >= 0.25) { r = 30; g = 41; b = 59; }
              else if (L >= 0.15) { r = 15; g = 23; b = 42; }
              else { r = 2; g = 6; b = 23; }
            } else {
              // Approximate colored hues (green, cyan, blue, purple, etc.)
              if (H >= 120 && H < 170) {
                r = 57 * L * 2; g = 255 * L; b = 20 * L * 2;
              } else if (H >= 170 && H < 220) {
                r = 0; g = 212 * L; b = 255 * L;
              } else if (H >= 220 && H < 280) {
                r = 59 * L * 2; g = 130 * L; b = 246 * L;
              } else if (H >= 280 && H < 340) {
                r = 168 * L * 2; g = 85 * L; b = 247 * L;
              } else {
                r = 239 * L * 2; g = 110 * L; b = 15 * L * 2;
              }
            }

            r = Math.max(0, Math.min(255, Math.round(r)));
            g = Math.max(0, Math.min(255, Math.round(g)));
            b = Math.max(0, Math.min(255, Math.round(b)));

            let alpha = 1;
            if (parts.length > 3) {
              const aStr = parts[3];
              if (aStr && !aStr.includes('var(')) {
                let aVal = parseFloat(aStr);
                if (aStr.includes('%')) aVal /= 100;
                if (!isNaN(aVal)) {
                  alpha = aVal;
                }
              }
            }

            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } catch (e) {
            return 'rgb(0, 0, 0)';
          }
        });
      };

      // Override window.fetch to capture CSS files fetched by html2canvas and sanitize any oklch() color codes
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : (input && (input as Request).url) ? (input as Request).url : '';
        if (url && (url.includes('.css') || url.endsWith('.css') || url.includes('/assets/'))) {
          try {
            const response = await originalFetch(input, init);
            if (response.ok) {
              const originalText = await response.text();
              const processedText = processOklchText(originalText);
              return new Response(processedText, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });
            }
          } catch (err) {
            console.warn('Failed to intercept and sanitize color function inside fetch style asset:', url, err);
          }
        }
        return originalFetch(input, init);
      };

      stylesheets.forEach(style => {
        if (style.textContent && style.textContent.toLowerCase().includes('oklch')) {
          style.textContent = processOklchText(style.textContent);
        }
      });

      const container = document.getElementById('printable-cv-page-container');
      if (!container) {
        throw new Error('CV printable container not found');
      }

      const pages = container.querySelectorAll('.print-page');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Temporarily override styles for clean and professional print capture
      const cachedStyles: { border: string; boxShadow: string; borderRadius: string; padding: string }[] = [];
      pages.forEach((pageEl) => {
        const el = pageEl as HTMLElement;
        cachedStyles.push({
          border: el.style.border,
          boxShadow: el.style.boxShadow,
          borderRadius: el.style.borderRadius,
          padding: el.style.padding
        });
        el.style.border = 'none';
        el.style.boxShadow = 'none';
        el.style.borderRadius = '0';
        el.style.padding = '1.8cm 1.5cm';
      });

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;
        const canvas = await html2canvas(pageEl, {
          scale: 2.2, // Retina-level sharp text rendering
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      // Restore original layout screen preview styles
      pages.forEach((pageEl, idx) => {
        const el = pageEl as HTMLElement;
        const cached = cachedStyles[idx];
        if (cached) {
          el.style.border = cached.border;
          el.style.boxShadow = cached.boxShadow;
          el.style.borderRadius = cached.borderRadius;
          el.style.padding = cached.padding;
        }
      });

      // Construct a high-precision filename with current local timezone timestamp to keep downloads distinct
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_` +
                        `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      pdf.save(`Eban_Godwin_Ikoni_Resume_${timestamp}.pdf`);
    } catch (err) {
      console.error('High fidelity PDF compilation encountered an issue. Falling back to synthetic export:', err);
      handleDownloadCV(); // fallback to standard fast synthetic downloader
    } finally {
      window.fetch = originalFetch;
      // ALWAYS restore original stylesheets to prevent affecting main portfolio rendering
      stylesheets.forEach((style, idx) => {
        if (originalContents[idx] !== undefined) {
          style.textContent = originalContents[idx];
        }
      });
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    playClickSound('success');
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop overlay blur */}
        <motion.div
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* CSS Injection to cleanly print only the CV container with nice margins and hide all background UI */}
        <span dangerouslySetInnerHTML={{__html: `
          <style>
            @media print {
              /* Hide all background website elements totally */
              body > * {
                display: none !important;
              }
              body {
                background: white !important;
                color: #0d1527 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              /* Only display printable resume element */
              #printable-cv-page-container {
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                background: white !important;
                overflow: visible !important;
              }
              .print-page {
                display: block !important;
                width: 210mm !important;
                height: 297mm !important;
                page-break-after: always !important;
                break-after: page !important;
                box-sizing: border-box !important;
                padding: 1.8cm 1.5cm !important;
                background: white !important;
                color: #111827 !important;
                position: relative !important;
                overflow: hidden !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              .print-page:last-child {
                page-break-after: avoid !important;
                break-after: avoid !important;
              }
              .no-print {
                display: none !important;
              }
              @page {
                size: A4 portrait;
                margin: 0cm;
              }
            }
          </style>
        `}} />

        {/* Modal Window */}
        <motion.div
          className={`relative w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-[#050814] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between text-left ${glowShadow}`}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        >
          {/* Top Control strip */}
          <div className="p-3 sm:p-4 border-b border-white/5 bg-slate-950/50 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider no-print">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${bgAccent} animate-ping`} />
              <span className="text-white font-bold hidden xs:inline">SECURE SYSTEMS VERIFIED // CURRICULUM VITAE</span>
              <span className="text-white font-bold xs:hidden">CV VIEWER</span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#08152e] hover:bg-slate-900 text-white rounded border border-white/10 hover:border-white/20 transition-all cursor-pointer text-[10px]"
              >
                <Printer className={`w-3.5 h-3.5 ${textAccent}`} />
                <span className="hidden sm:inline">PRINT / SAVE PDF</span>
              </button>

              {/* Download high-fidelity PDF with timestamp */}
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#08152e] hover:bg-slate-900 text-white rounded border border-white/10 hover:border-white/20 transition-all cursor-pointer text-[10px] ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isDownloading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-[#00D4FF] animate-spin shrink-0" />
                    <span>COMPILING...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#00D4FF]" />
                    <span>DOWNLOAD PDF</span>
                  </>
                )}
              </button>

              <button 
                onClick={onClose}
                className="text-white hover:text-red-400 font-extrabold cursor-pointer bg-red-950/20 px-2.5 py-1.5 rounded transition-colors text-[10.5px] border border-red-500/10 hover:border-red-500/30"
              >
                [X]
              </button>
            </div>
          </div>

          {/* Core scrollable Resume Page */}
          <div className="flex-1 overflow-y-auto bg-[#03060f]/60 p-4 sm:p-8 flex flex-col items-center">
            
            <div 
              id="printable-cv-page-container"
              className="flex flex-col gap-8 pb-12 w-full items-center"
            >
              
              {/* PAGE 1 */}
              <div className="print-page relative bg-white text-slate-800 shadow-2xl p-8 sm:p-12 w-full max-w-[210mm] min-h-[297mm] flex flex-col justify-between rounded-lg select-text font-sans border border-slate-200">
                <div>
                  {/* HEADER AREA */}
                  <div className="mb-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                      EBAN GODWIN IKONI
                    </h1>
                    <h2 className="text-[11px] sm:text-[12.5px] tracking-[0.25em] font-extrabold uppercase mt-1.5" style={{ color: accentColorHex }}>
                      SOFTWARE ENGINEER | PROBLEM SOLVER
                    </h2>
                    
                    {/* Contacts & Links Stack */}
                    <div className="text-[10.5px] sm:text-[11.5px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1 mt-3 select-text font-sans border-t border-slate-100 pt-3">
                      <span>ikonicityairban@gmail.com</span>
                      <span className="text-slate-300">|</span>
                      <span>+234 816 986 2852</span>
                      <span className="text-slate-300">|</span>
                      <span>Enugu, Nigeria · Remote Worldwide</span>
                    </div>
                    <div className="text-[10.5px] sm:text-[11.5px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1 mt-1 font-sans">
                      <a href="https://github.com/ikonicity-airban" target="_blank" rel="noreferrer" className="hover:underline text-slate-700">github.com/ikonicity-airban</a>
                      <span className="text-slate-300">|</span>
                      <a href="https://linkedin.com/in/eban-godwin-ikoni" target="_blank" rel="noreferrer" className="hover:underline text-slate-700">linkedin.com/in/eban-godwin-ikoni</a>
                      <span className="text-slate-300">|</span>
                      <a href="https://airban-ikonicity.vercel.app" target="_blank" rel="noreferrer" className="hover:underline text-slate-700">airban-ikonicity.vercel.app</a>
                    </div>
                  </div>

                  {/* Horizontal dividing bar */}
                  <div className="h-[1px] w-full my-4" style={{ backgroundColor: `${accentColorHex}40` }} />

                  {/* Summary paragraph */}
                  <div className="text-[11.5px] sm:text-[12.5px] leading-relaxed text-slate-700 font-sans mb-6">
                    Full-Stack Software Engineer with 4+ years of experience designing and shipping production systems across education, fintech, blockchain, e-commerce, and enterprise automation. Background in Electronics and Computer Engineering with a focus on algorithmic problem-solving. Comfortable owning a problem end-to-end — architecture, debugging, deployment — across React/Next.js, Node.js, Python, and cloud infrastructure. Built and maintains a mobile app serving 70,000+ active users, led platform development for a blockchain-focused organization, and currently operates independently through Airban Ikonicity.
                  </div>

                  {/* PROFESSIONAL EXPERIENCE */}
                  <div className="mb-4">
                    <h3 className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.10em] uppercase text-slate-900">
                      PROFESSIONAL EXPERIENCE
                    </h3>
                    <div className="h-[2px] w-full mt-1" style={{ backgroundColor: accentColorHex }} />
                  </div>

                  <div className="space-y-5">
                    {/* Job 1 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                          Freelance Software Engineer <span className="font-light text-slate-300">—</span> <span className="text-slate-500 font-semibold">The Seventh Legion</span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-900 shrink-0">2025 — Present</p>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans italic mt-0.5 mb-2">Rapid Development Studio · Remote</p>
                      
                      <ul className="space-y-1.5 pl-1.5">
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          <span className="font-bold text-slate-900">Built and deployed Oyadrop</span> — a logistics and courier platform for goods shipment across Nigeria, integrating Google Maps for live tracking and Paystack for payments.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          <span className="font-bold text-slate-900">Built and deployed EB Pathway</span> — a full-stack immigration case-management platform with role-based workflows spanning Finance, Research, Support, and Super Admin layers.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Convert generated UI designs and wireframes into fully functional, production-ready platforms.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Most deliverables for this organization are covered under NDA; public work limited to the two projects above.
                        </li>
                      </ul>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 mt-2 font-sans">
                        <strong className="tracking-wider uppercase font-extrabold text-[9px] mr-1.5" style={{ color: accentColorHex }}>STACK</strong> React · Next.js · TypeScript · Google Maps API · Paystack · DigitalOcean · Docker
                      </p>
                    </div>

                    {/* Job 2 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                          Freelance Software Consultant & Developer <span className="font-light text-slate-300">—</span> <span className="text-slate-500 font-semibold">PWorld Concepts</span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-900 shrink-0">2024 — Present</p>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans italic mt-0.5 mb-2">Software Consultancy · Nsukka, Nigeria</p>
                      
                      <ul className="space-y-1.5 pl-1.5">
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          <span className="font-bold text-slate-900">Core contributor to iCatholic Igbo</span> — a Catholic missal, prayer guide, and media platform now serving 70,000+ users across iOS and Android.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Own feature delivery from the data layer up — data structures, algorithm design, and integration logic.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Performed deep debugging and architectural refactoring on a large, untyped JavaScript codebase — high-precision work where small errors carried high risk.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Ongoing role managing platform stability, bug fixes, and technical guidance.
                        </li>
                      </ul>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 mt-2 font-sans">
                        <strong className="tracking-wider uppercase font-extrabold text-[9px] mr-1.5" style={{ color: accentColorHex }}>STACK</strong> React Native (Expo) · JavaScript · TypeScript
                      </p>
                    </div>

                    {/* Job 3 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                          Lead Software Developer &rarr; Software Engineer <span className="font-light text-slate-300">—</span> <span className="text-slate-500 font-semibold">SOFE Group</span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-900 shrink-0">2023 — Present</p>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans italic mt-0.5 mb-2">Blockchain-Focused Youth Empowerment Organization · Hybrid</p>
                      
                      <ul className="space-y-1.5 pl-1.5">
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          <span className="font-bold text-slate-900">Served as Dev Lead</span> during the platform's foundational build — owned technical direction, architecture decisions, and delivery.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Designed and built the main public platform at sofegroup.com from zero to a fully operational product.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Built Telegram cryptocurrency airdrop bots handling automated reward distribution.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Engineered WhatsApp automation systems in both Python and TypeScript for internal operations.
                        </li>
                      </ul>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 mt-2 font-sans">
                        <strong className="tracking-wider uppercase font-extrabold text-[9px] mr-1.5" style={{ color: accentColorHex }}>STACK</strong> Next.js · TypeScript · Python · Telegram Bot API · WhatsApp Automation (Baileys + Meta API)
                      </p>
                    </div>

                    {/* Job 4 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                          Frontend Engineer <span className="font-light text-slate-300">—</span> <span className="text-slate-500 font-semibold">Blaitware</span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-900 shrink-0">Early 2023 — Late 2023</p>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans italic mt-0.5 mb-2">Software Engineering Firm · Remote Contract</p>
                      
                      <ul className="space-y-1.5 pl-1.5">
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          <span className="font-bold text-slate-900">Core frontend engineer on RabbAi</span> — an AI-powered exam preparation platform for WAEC, NECO, and JAMB candidates.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Built the student dashboard, score-tracking interface, and real-time chatbot UI.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Integrated AI features at a time when stable SDKs were largely unavailable, requiring first-principles implementation.
                        </li>
                      </ul>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 mt-2 font-sans">
                        <strong className="tracking-wider uppercase font-extrabold text-[9px] mr-1.5" style={{ color: accentColorHex }}>STACK</strong> React · Python (FastAPI) · Docker
                      </p>
                    </div>

                    {/* Job 5 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                          Frontend Engineer <span className="font-light text-slate-300">—</span> <span className="text-slate-500 font-semibold">Automated Cafe</span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-900 shrink-0">2022</p>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans italic mt-0.5 mb-2">Technology Company · On-site Contract</p>
                      
                      <ul className="space-y-1.5 pl-1.5">
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          <span className="font-bold text-slate-900">Designed and developed the frontend for Heartzibah Shop</span>, a client storefront selling baby wares, household utensils, appliances, and food supplies.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Translated business requirements directly into production UI with no formal design handoff.
                        </li>
                        <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                          <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                          Delivered a complete, responsive shopping interface within a short engagement window.
                        </li>
                      </ul>
                      {/* Carryover stack is rendered at top of page 2 in user specs, let's keep it here on screen too but make sure it flows logically */}
                      <p className="text-[10px] sm:text-[11px] text-slate-600 mt-2 font-sans">
                        <strong className="tracking-wider uppercase font-extrabold text-[9px] mr-1.5" style={{ color: accentColorHex }}>STACK</strong> React · CSS · JavaScript
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              {/* PAGE 2 */}
              <div className="print-page relative bg-white text-slate-800 shadow-2xl p-8 sm:p-12 w-full max-w-[210mm] min-h-[297mm] flex flex-col justify-between rounded-lg select-text font-sans border border-slate-200">
                <div>
                  
                  {/* Carryover Stack header from Job 5 */}
                  <p className="text-[11px] sm:text-[12px] text-slate-400 font-mono tracking-wider italic mb-4">
                    STACK React · CSS · JavaScript
                  </p>

                  {/* Wisdom Internet Services job */}
                  <div>
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                        Computer Analyst & Operator <span className="font-light text-slate-300">—</span> <span className="text-slate-500 font-semibold">Wisdom Internet Services</span>
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-900 shrink-0">2019 — 2022</p>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans italic mt-0.5 mb-2">Cyber Café · University of Nigeria, Nsukka Campus</p>
                    
                    <ul className="space-y-1.5 pl-1.5">
                      <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                        <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                        Managed computer systems and network infrastructure; diagnosed and resolved hardware, software, and connectivity issues for daily operations.
                      </li>
                      <li className="relative pl-4 text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                        <span className="absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColorHex }} />
                        Gained advanced proficiency in Microsoft Word, Excel, and PowerPoint, supporting document-heavy academic and administrative work.
                      </li>
                    </ul>
                  </div>

                  {/* CORE SKILLS & STACK */}
                  <div className="mt-6 mb-4">
                    <h3 className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.10em] uppercase text-slate-900">
                      CORE SKILLS & STACK
                    </h3>
                    <div className="h-[2px] w-full mt-1" style={{ backgroundColor: accentColorHex }} />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Col 1 */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-[10px] font-extrabold tracking-wider uppercase mb-1" style={{ color: accentColorHex }}>
                          LANGUAGES
                        </h4>
                        <p className="text-[10.5px] sm:text-[11.5px] text-slate-700 leading-relaxed">
                          TypeScript, JavaScript, Python, Rust, C#, Java, Solidity, C
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-extrabold tracking-wider uppercase mb-1" style={{ color: accentColorHex }}>
                          CLOUD & DEVOPS
                        </h4>
                        <p className="text-[10.5px] sm:text-[11.5px] text-slate-700 leading-relaxed">
                          Docker, Firebase, DigitalOcean, AWS, CI/CD, Linux
                        </p>
                      </div>
                    </div>

                    {/* Col 2 */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-[10px] font-extrabold tracking-wider uppercase mb-1" style={{ color: accentColorHex }}>
                          FRONTEND
                        </h4>
                        <p className="text-[10.5px] sm:text-[11.5px] text-slate-700 leading-relaxed">
                          React, Next.js, React Native (Expo), Tailwind CSS
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-extrabold tracking-wider uppercase mb-1" style={{ color: accentColorHex }}>
                          BLOCKCHAIN
                        </h4>
                        <p className="text-[10.5px] sm:text-[11.5px] text-slate-700 leading-relaxed">
                          Solidity, Ethers.js, ICP, Foundry, Smart Contracts
                        </p>
                      </div>
                    </div>

                    {/* Col 3 */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-[10px] font-extrabold tracking-wider uppercase mb-1" style={{ color: accentColorHex }}>
                          BACKEND
                        </h4>
                        <p className="text-[10.5px] sm:text-[11.5px] text-slate-700 leading-relaxed">
                          Node.js, Bun, Hono, Express, FastAPI, NestJS, .NET
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-extrabold tracking-wider uppercase mb-1" style={{ color: accentColorHex }}>
                          AI & AUTOMATION
                        </h4>
                        <p className="text-[10.5px] sm:text-[11.5px] text-slate-700 leading-relaxed">
                          AI Agent Integration, LLM Workflows, WhatsApp/Telegram Bots
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EDUCATION & CERTIFICATIONS */}
                  <div className="mt-6 mb-4">
                    <h3 className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.10em] uppercase text-slate-900">
                      EDUCATION & CERTIFICATIONS
                    </h3>
                    <div className="h-[2px] w-full mt-1" style={{ backgroundColor: accentColorHex }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[12px] font-bold text-slate-900 leading-tight">
                        B.Eng. Electronics & Computer Engineering
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">University of Nigeria, Nsukka</p>
                      <p className="text-[10px] font-mono mt-1 font-bold" style={{ color: accentColorHex }}>2018 — 2023 · Software Engineering & Embedded Systems</p>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-700 leading-relaxed">
                      <p>&bull; IBM Introduction to Software Engineering</p>
                      <p>&bull; Full-Stack Engineering (TypeScript) &mdash; Codedamn</p>
                      <p>&bull; Responsive Web Design &mdash; FreeCodeCamp</p>
                      <p>&bull; JavaScript Algorithms & Data Structures &mdash; FreeCodeCamp</p>
                      <p>&bull; Rust &mdash; coddy.tech &middot; Multi-language &mdash; Sololearn</p>
                    </div>
                  </div>

                  {/* SELECTED PROJECTS */}
                  <div className="mt-6 mb-3">
                    <h3 className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.10em] uppercase text-slate-900">
                      SELECTED PROJECTS
                    </h3>
                    <div className="h-[2px] w-full mt-1" style={{ backgroundColor: accentColorHex }} />
                  </div>

                  <div className="space-y-3.5">
                    {/* Project 1 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[11.5px] sm:text-[12.5px] font-extrabold text-slate-900 leading-tight">
                          Geek Creations <span className="font-light text-slate-300">—</span> <span className="text-slate-600 font-semibold text-[11px]">Founder & Full-Stack Engineer</span>
                        </p>
                        <p className="text-[9.5px] font-mono font-bold text-slate-900 shrink-0 uppercase tracking-wider">Ongoing</p>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed pl-1.5">
                        &bull; Nigerian Print-on-Demand platform letting users customize and order branded merchandise through a live online editor. Accepts fiat, card, and cryptocurrency payments via gateway, with local and global delivery.
                      </p>
                      <p className="text-[9.5px] text-slate-500 mt-0.5 pl-1.5">
                        <span className="font-extrabold uppercase mr-1 text-[8.5px]" style={{ color: accentColorHex }}>STACK</span> React · Fabric.js · Shopify Storefront API · Crypto Payment Gateway — geekcreations.vercel.app
                      </p>
                    </div>

                    {/* Project 2 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[11.5px] sm:text-[12.5px] font-extrabold text-slate-900 leading-tight">
                          Biddo <span className="font-light text-slate-300">—</span> <span className="text-slate-600 font-semibold text-[11px]">Full-Stack Engineer</span>
                        </p>
                        <p className="text-[9.5px] font-mono font-bold text-slate-900 shrink-0 uppercase tracking-wider">Live</p>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed pl-1.5">
                        &bull; Real-time property auction platform with live buyer-seller communication, location tracking, and property heatmaps. Currently serving its active user base in production.
                      </p>
                      <p className="text-[9.5px] text-slate-500 mt-0.5 pl-1.5">
                        <span className="font-extrabold uppercase mr-1 text-[8.5px]" style={{ color: accentColorHex }}>STACK</span> Next.js · Express.js · Docker · DigitalOcean — web.biddo.info
                      </p>
                    </div>

                    {/* Project 3 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[11.5px] sm:text-[12.5px] font-extrabold text-slate-900 leading-tight">
                          ESTC &mdash; Enugu State Tourism <span className="font-light text-slate-300">—</span> <span className="text-slate-600 font-semibold text-[11px]">Full-Stack Engineer (Solo)</span>
                        </p>
                        <p className="text-[9.5px] font-mono font-bold text-slate-900 shrink-0 uppercase tracking-wider">Live</p>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed pl-1.5">
                        &bull; Tourism discovery and booking platform showcasing tour sites, packages, and services across Enugu State, built end-to-end from data modeling to deployment.
                      </p>
                      <p className="text-[9.5px] text-slate-500 mt-0.5 pl-1.5">
                        <span className="font-extrabold uppercase mr-1 text-[8.5px]" style={{ color: accentColorHex }}>STACK</span> React (Vite) · Firebase — vite-tour.netlify.app
                      </p>
                    </div>

                    {/* Project 4 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[11.5px] sm:text-[12.5px] font-extrabold text-slate-900 leading-tight">
                          WAPlug <span className="font-light text-slate-300">—</span> <span className="text-slate-600 font-semibold text-[11px]">Founder & Engineer</span>
                        </p>
                        <p className="text-[9.5px] font-mono font-bold text-slate-900 shrink-0 uppercase tracking-wider">Live SaaS</p>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed pl-1.5">
                        &bull; WhatsApp automation SaaS providing auto-reply, broadcast, chatbot, and group moderation (spam and language filtering) for real businesses. Built on an unofficial WebSocket-based library alongside the official Meta API.
                      </p>
                      <p className="text-[9.5px] text-slate-500 mt-0.5 pl-1.5">
                        <span className="font-extrabold uppercase mr-1 text-[8.5px]" style={{ color: accentColorHex }}>STACK</span> Node.js · Baileys · Meta WhatsApp Business API — plugins-wa.onrender.com
                      </p>
                    </div>

                    {/* Project 5 */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-[11.5px] sm:text-[12.5px] font-extrabold text-slate-900 leading-tight">
                          iNextAI <span className="font-light text-slate-300">—</span> <span className="text-slate-600 font-semibold text-[11px]">Feature Contributor</span>
                        </p>
                        <p className="text-[9.5px] font-mono font-bold text-slate-900 shrink-0 uppercase tracking-wider">Live</p>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed pl-1.5">
                        &bull; Contributed feature-level development to an emotion-aware AI crypto trading platform on the Internet Computer, combining market analysis with trading-psychology tracking.
                      </p>
                      <p className="text-[9.5px] text-slate-500 mt-0.5 pl-1.5">
                        <span className="font-extrabold uppercase mr-1 text-[8.5px]" style={{ color: accentColorHex }}>STACK</span> Internet Computer (ICP) · Internet Identity · Web3
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer link line */}
                <div className="text-center italic mt-4 text-[10px] text-slate-400 font-sans border-t border-slate-100 pt-3">
                  Full project case studies and live links available at airban-ikonicity.vercel.app
                </div>
              </div>

            </div>

          </div>

          {/* Persistent Footer telemetry bar */}
          <div className="p-3 bg-slate-950/40 border-t border-white/5 flex items-center justify-between text-[#8A9BC4] font-mono text-[8.5px] tracking-wider no-print">
            <span>RESUME COMPILER STACK // SECURE V2 CONTRACT BIND</span>
            <span>A4 PRINT COMPLIANT [595x841 PT]</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
