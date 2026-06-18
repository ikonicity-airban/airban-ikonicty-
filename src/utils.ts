import { AccentColor } from './types';

/**
 * Shared Dynamic Utilities for Airban Ikonicity Portfolio
 */

/**
 * Web Audio API synthesizer for clean futuristic tactile feedback sounds
 */
export const playClickSound = (type: 'click' | 'success' | 'synth' | 'hover' = 'click') => {
  if (typeof window === 'undefined') return;
  
  // Respect ambient sound user preferences from localStorage
  const isMuted = localStorage.getItem('bg_video_muted') !== 'false';
  if (isMuted) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'hover') {
      // Very soft, high-frequency elegant tactile hover tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

      osc.start();
      osc.stop(ctx.currentTime + 0.015);
      return;
    }

    if (type === 'click') {
      // Direct, clean futuristic physical click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'success') {
      // Sleek double chime chord
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
      osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // A6

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.25);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.25);
    } else if (type === 'synth') {
      // Clean harmonic sweep tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (err) {
    // Fail silently without disrupting user experience
    console.debug('Web Audio API not supported yet or blocked by policy', err);
  }
};

/**
 * Portable function to download Eban Godwin Ikoni's custom synthetic PDF resume
 */
export const handleDownloadCV = () => {
  const pdfContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595.275 841.889] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 1200 >>
stream
BT
/F1 14 Tf
50 800 Td
(EBAN GODWIN IKONI - SOFTWARE ENGINEER) Tj
/F1 9 Tf
0 -20 Td
(Email: ikonicityairban@gmail.com | Phone: +234 816 986 2852 | Remote) Tj
0 -12 Td
(GitHub: github.com/ikonicity-airban | Web: airban-ikonicity.vercel.app) Tj
0 -20 Td
(PROFESSIONAL EXPERIENCE) Tj
0 -12 Td
(- Freelance SE - The Seventh Legion (2025 - Present): Built Oyadrop & EB Pathway) Tj
0 -12 Td
(- Freelance Consultant - PWorld Concepts: iCatholic Igbo App (70,000+ users)) Tj
0 -12 Td
(- Lead SE - SOFE Group (2023 - Present): Managed platform, automation & bots) Tj
0 -12 Td
(- Frontend Engineer - Blaitware (2023): Core frontend on RabbAi tutoring system) Tj
0 -12 Td
(- Frontend Engineer - Automated Cafe (2022): Developed Heartzibah shop frontend) Tj
0 -12 Td
(- Analyst & Operator - Wisdom Internet Services (2019 - 2022): IT systems administrator) Tj
0 -20 Td
(CORE SKILLS) Tj
0 -12 Td
(TypeScript, JavaScript, Python, Rust, React, Next.js, React Native, Node.js, Docker, Web3) Tj
0 -20 Td
(SELECTED PROJECTS) Tj
0 -12 Td
(- Geek Creations: Nigerian Print-on-Demand custom merch platform with editor) Tj
0 -12 Td
(- Biddo: Real-time property auction & live buyer-seller platform) Tj
0 -12 Td
(- ESTC: Tourism discovery and booking channel for Enugu State) Tj
0 -12 Td
(- WAPlug: WhatsApp automation SaaS with chatbot, auto-reply & broadcast) Tj
0 -12 Td
(- iNextAI: Emotion-aware AI crypto trader on Internet Computer) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000062 00000 n 
0000000119 00000 n 
0000000244 00000 n 
0000000311 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1580
%%EOF`;

  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const now = new Date();
  const pad = (num: number) => String(num).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_` +
                    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
                    
  link.download = `Eban_Godwin_Ikoni_Resume_${timestamp}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Normalizes video URLs, specifically converting Cloudinary console asset managers (asset.cloudinary.com)
 * into high-performance, direct browser-streaming delivery paths (res.cloudinary.com) with MP4 format.
 */
export const normalizeVideoUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmed = url.trim();
  const assetRegex = /https?:\/\/asset\.cloudinary\.com\/([^/]+)\/([^/]+)/i;
  const match = trimmed.match(assetRegex);
  if (match) {
    const cloudName = match[1];
    const publicId = match[2];
    // Include Cloudinary auto format and auto quality layers to prevent browser/device crash from heavy unoptimized files
    return `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${publicId}.mp4`;
  }
  
  // Also auto-inject f_auto,q_auto into raw res.cloudinary.com URLs if not already present
  if (trimmed.includes('res.cloudinary.com/') && trimmed.includes('/video/upload/') && !trimmed.includes('/f_auto,q_auto/')) {
    return trimmed.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
  }

  return trimmed;
};

export const getAccentHex = (color: AccentColor): string => {
  switch (color) {
    case 'green': return '#39FF14';
    case 'cyan': return '#00D4FF';
    case 'pink': return '#FF007F';
    case 'purple': return '#BD00FF';
    case 'yellow': return '#FFE600';
    default: return '#39FF14';
  }
};

export const getAccentTextClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'text-[#39FF14]';
    case 'cyan': return 'text-[#00D4FF]';
    case 'pink': return 'text-[#FF007F]';
    case 'purple': return 'text-[#BD00FF]';
    case 'yellow': return 'text-[#FFE600]';
    default: return 'text-[#39FF14]';
  }
};

export const getAccentBgClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'bg-[#39FF14]';
    case 'cyan': return 'bg-[#00D4FF]';
    case 'pink': return 'bg-[#FF007F]';
    case 'purple': return 'bg-[#BD00FF]';
    case 'yellow': return 'bg-[#FFE600]';
    default: return 'bg-[#39FF14]';
  }
};

export const getAccentBorderClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'border-[#39FF14]';
    case 'cyan': return 'border-[#00D4FF]';
    case 'pink': return 'border-[#FF007F]';
    case 'purple': return 'border-[#BD00FF]';
    case 'yellow': return 'border-[#FFE600]';
    default: return 'border-[#39FF14]';
  }
};

export const getViaColorClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'via-[#39FF14]';
    case 'cyan': return 'via-[#00D4FF]';
    case 'pink': return 'via-[#FF007F]';
    case 'purple': return 'via-[#BD00FF]';
    case 'yellow': return 'via-[#FFE600]';
    default: return 'via-[#39FF14]';
  }
};

export const getAccentSelectionClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'selection:bg-[#39FF14]/30 selection:text-[#39FF14]';
    case 'cyan': return 'selection:bg-[#00D4FF]/30 selection:text-[#00D4FF]';
    case 'pink': return 'selection:bg-[#FF007F]/30 selection:text-[#FF007F]';
    case 'purple': return 'selection:bg-[#BD00FF]/30 selection:text-[#BD00FF]';
    case 'yellow': return 'selection:bg-[#FFE600]/30 selection:text-[#FFE600]';
    default: return 'selection:bg-[#39FF14]/30 selection:text-[#39FF14]';
  }
};

export const getAccentHoverTextClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'hover:text-[#39FF14] group-hover:text-[#39FF14]';
    case 'cyan': return 'hover:text-[#00D4FF] group-hover:text-[#00D4FF]';
    case 'pink': return 'hover:text-[#FF007F] group-hover:text-[#FF007F]';
    case 'purple': return 'hover:text-[#BD00FF] group-hover:text-[#BD00FF]';
    case 'yellow': return 'hover:text-[#FFE600] group-hover:text-[#FFE600]';
    default: return 'hover:text-[#39FF14] group-hover:text-[#39FF14]';
  }
};

export const getAccentHoverBorderClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'hover:border-[#39FF14]';
    case 'cyan': return 'hover:border-[#00D4FF]';
    case 'pink': return 'hover:border-[#FF007F]';
    case 'purple': return 'hover:border-[#BD00FF]';
    case 'yellow': return 'hover:border-[#FFE600]';
    default: return 'hover:border-[#39FF14]';
  }
};

export const getAccentBorder30Class = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'border-[#39FF14]/30';
    case 'cyan': return 'border-[#00D4FF]/30';
    case 'pink': return 'border-[#FF007F]/30';
    case 'purple': return 'border-[#BD00FF]/30';
    case 'yellow': return 'border-[#FFE600]/30';
    default: return 'border-[#39FF14]/30';
  }
};

export const getAccentBorder50Class = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'border-[#39FF14]/50';
    case 'cyan': return 'border-[#00D4FF]/50';
    case 'pink': return 'border-[#FF007F]/50';
    case 'purple': return 'border-[#BD00FF]/50';
    case 'yellow': return 'border-[#FFE600]/50';
    default: return 'border-[#39FF14]/50';
  }
};

export const getAccentBg10Class = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'bg-[#39FF14]/10';
    case 'cyan': return 'bg-[#00D4FF]/10';
    case 'pink': return 'bg-[#FF007F]/10';
    case 'purple': return 'bg-[#BD00FF]/10';
    case 'yellow': return 'bg-[#FFE600]/10';
    default: return 'bg-[#39FF14]/10';
  }
};

export const getAccentBg5Class = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'bg-[#39FF14]/5';
    case 'cyan': return 'bg-[#00D4FF]/5';
    case 'pink': return 'bg-[#FF007F]/5';
    case 'purple': return 'bg-[#BD00FF]/5';
    case 'yellow': return 'bg-[#FFE600]/5';
    default: return 'bg-[#39FF14]/5';
  }
};

export const getAccentHoverBg10Class = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'hover:bg-[#39FF14]/10';
    case 'cyan': return 'hover:bg-[#00D4FF]/10';
    case 'pink': return 'hover:bg-[#FF007F]/10';
    case 'purple': return 'hover:bg-[#BD00FF]/10';
    case 'yellow': return 'hover:bg-[#FFE600]/10';
    default: return 'hover:bg-[#39FF14]/10';
  }
};

export const getAccentShadowClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'shadow-[0_0_15px_rgba(57,255,20,0.25)]';
    case 'cyan': return 'shadow-[0_0_15px_rgba(0,212,255,0.25)]';
    case 'pink': return 'shadow-[0_0_15px_rgba(255,0,127,0.25)]';
    case 'purple': return 'shadow-[0_0_15px_rgba(189,0,255,0.25)]';
    case 'yellow': return 'shadow-[0_0_15px_rgba(255,230,0,0.25)]';
    default: return 'shadow-[0_0_15px_rgba(57,255,20,0.25)]';
  }
};

export const getAccentShadowGlowClass = (color: AccentColor): string => {
  switch (color) {
    case 'green': return 'shadow-[0_0_25px_rgba(57,255,20,0.15)]';
    case 'cyan': return 'shadow-[0_0_25px_rgba(0,212,255,0.15)]';
    case 'pink': return 'shadow-[0_0_25px_rgba(255,0,127,0.15)]';
    case 'purple': return 'shadow-[0_0_25px_rgba(189,0,255,0.15)]';
    case 'yellow': return 'shadow-[0_0_25px_rgba(255,230,0,0.15)]';
    default: return 'shadow-[0_0_25px_rgba(57,255,20,0.15)]';
  }
};

export const getAccentRgba = (color: AccentColor, opacity: number): string => {
  switch (color) {
    case 'green': return `rgba(57, 255, 20, ${opacity})`;
    case 'cyan': return `rgba(0, 212, 255, ${opacity})`;
    case 'pink': return `rgba(255, 0, 127, ${opacity})`;
    case 'purple': return `rgba(189, 0, 255, ${opacity})`;
    case 'yellow': return `rgba(255, 230, 0, ${opacity})`;
    default: return `rgba(57, 255, 20, ${opacity})`;
  }
};


