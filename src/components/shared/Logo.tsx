import React from 'react';
import { AccentColor } from '../../types';
import { getAccentHex } from '../../utils';

interface LogoProps {
  size?: number; // width and height of the symbol
  showText?: boolean;
  glow?: boolean;
  accentColor?: AccentColor;
}

export default function Logo({ size = 48, showText = true, glow = true, accentColor = 'green' }: LogoProps) {
  const themeHex = getAccentHex(accentColor);
  
  return (
    <div className="flex flex-col items-center justify-center select-none font-sans">
      <div 
        className="relative group transition-transform duration-500 hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Glow backdrop */}
        {glow && (
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
            style={{ backgroundColor: `${themeHex}26` }}
          />
        )}
        
        {/* SVG Doodle of Airban (A-I Fusion Tech Signature) */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-contain"
          stroke={themeHex}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            filter: `drop-shadow(0 0 8px ${themeHex}aa)`
          }}
        >
          {/* Faint futuristic technical alignment grid in background */}
          <path d="M15,50 L85,50 M50,15 L50,85" stroke={`${themeHex}18`} strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="50" cy="50" r="38" stroke={`${themeHex}22`} strokeWidth="1" strokeDasharray="2 3" />
          
          {/* Main Stylized Hand-Drawn "A" / "I" Cyberpunk Doodle */}
          {/* The Outer Left Leg */}
          <path 
            d="M 28 80 L 50 22" 
            strokeWidth="4"
          />
          {/* The Outer Right Leg */}
          <path 
            d="M 50 22 L 72 80" 
            strokeWidth="4"
          />
          
          {/* Symmetrical Base Platforms */}
          <path d="M 20 80 L 36 80" strokeWidth="4.5" />
          <path d="M 64 80 L 80 80" strokeWidth="4.5" />

          {/* Central Vertical 'I' Pillar element representing hard tech core */}
          <path 
            d="M 50 21 L 50 80" 
            strokeWidth="3.5"
            strokeDasharray="16 6 16"
          />

          {/* Circuit connection point node on top of the pillar */}
          <circle cx="50" cy="22" r="4.5" fill={themeHex} stroke="none" />
          
          {/* Horizontal cross-node brace of the A */}
          <path d="M 37 56 L 63 56" strokeWidth="3" />
          <circle cx="50" cy="56" r="3.5" fill="#050816" stroke={themeHex} strokeWidth="2" />
          
          {/* Stylized geometric vector sparks/doodle trails on flanking sides */}
          <path d="M 15 35 L 25 40" strokeWidth="1.5" stroke={`${themeHex}88`} />
          <path d="M 85 35 L 75 40" strokeWidth="1.5" stroke={`${themeHex}88`} />
          <path d="M 20 62 L 12 65" strokeWidth="1.5" stroke={`${themeHex}88`} />
          <path d="M 80 62 L 88 65" strokeWidth="1.5" stroke={`${themeHex}88`} />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col items-center mt-3 text-center">
          {/* Symmetrical technical geometric data lines inside emblem */}
          <div 
            className="flex items-center justify-center gap-1.5 text-[8px] md:text-[9px] font-mono tracking-[0.55em] font-bold uppercase mt-1"
            style={{ color: themeHex }}
          >
            <span className="w-5 h-[1px]" style={{ backgroundColor: `${themeHex}66` }} />
            <span>AIRBAN DOODLE</span>
            <span className="w-5 h-[1px]" style={{ backgroundColor: `${themeHex}66` }} />
          </div>
        </div>
      )}
    </div>
  );
}
