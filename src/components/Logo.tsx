import React from 'react';
// @ts-ignore
import brandLogo from '../assets/images/airban_logo_asset_1780203778311.png';
import { AccentColor } from '../types';
import { getAccentHex } from '../utils';

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
        
        {/* Render the actual high-fidelity logo image asset provided by user */}
        <img 
          src={brandLogo}
          alt="Airban Ikonicity Logo"
          className="w-full h-full object-contain transition-all duration-300 pointer-events-none"
          style={{
            filter: `drop-shadow(0 0 12px ${themeHex}66)`
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col items-center mt-3 text-center">
          {/* Symmetrical technical geometric data lines inside emblem */}
          <div 
            className="flex items-center justify-center gap-1.5 text-[8px] md:text-[9px] font-mono tracking-[0.55em] font-bold uppercase mt-1"
            style={{ color: themeHex }}
          >
            <span className="w-5 h-[1px]" style={{ backgroundColor: `${themeHex}66` }} />
            <span>AUTHENTIC BRAND</span>
            <span className="w-5 h-[1px]" style={{ backgroundColor: `${themeHex}66` }} />
          </div>
        </div>
      )}
    </div>
  );
}
