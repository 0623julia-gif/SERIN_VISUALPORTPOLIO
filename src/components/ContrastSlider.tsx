import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface ContrastSliderProps {
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
}

export const ContrastSlider: React.FC<ContrastSliderProps> = ({ 
  leftImage, 
  rightImage,
  leftLabel = "SKELETON",
  rightLabel = "FINAL OUTPUT"
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden cursor-ew-resize select-none border border-white/10"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Right Image (Final) */}
      <div className="absolute inset-0">
        <img src={rightImage} className="w-full h-full object-cover" alt="Final" referrerPolicy="no-referrer" />
        <div className="absolute bottom-4 right-4 text-[10px] tracking-[0.2em] font-bold opacity-50">{rightLabel}</div>
      </div>

      {/* Left Image (Skeleton) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div className="w-[100vw] h-full relative">
           <img 
            src={leftImage} 
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" 
            alt="Skeleton" 
            referrerPolicy="no-referrer"
            style={{ width: containerRef.current?.clientWidth }}
          />
          <div className="absolute inset-0 bg-electric-blue/10 backdrop-blur-[2px]" />
          <div className="absolute bottom-4 left-4 text-[10px] tracking-[0.2em] font-bold text-electric-blue">{leftLabel}</div>
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-px bg-white z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white bg-black flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white" />
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
