import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface SphereProps {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  isDataMode: boolean;
  index: number;
}

const FloatingSphere: React.FC<SphereProps> = ({ color, size, initialX, initialY, isDataMode, index }) => {
  // Random movement for organic mode
  const [randomPos, setRandomPos] = useState({ x: initialX, y: initialY });

  useEffect(() => {
    if (isDataMode) return;

    const move = () => {
      setRandomPos({
        x: Math.random() * 120 - 10,
        y: Math.random() * 120 - 10,
      });
    };

    move();
    const interval = setInterval(move, 10000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, [isDataMode]);

  // Grid position for data mode
  const gridX = (index % 10) * 8 + 14;
  const gridY = Math.floor(index / 10) * 8 + 14;

  return (
    <motion.div
      animate={{
        x: isDataMode ? `${gridX}vw` : `${randomPos.x}vw`,
        y: isDataMode ? `${gridY}vh` : `${randomPos.y}vh`,
        scale: isDataMode ? 0.02 : 1.5,
        opacity: isDataMode ? 1 : 0.4,
      }}
      transition={{
        duration: isDataMode ? 2 : 15,
        ease: isDataMode ? [0.16, 1, 0.3, 1] : "linear",
        delay: isDataMode ? index * 0.005 : 0,
      }}
      className="absolute rounded-full blur-[120px]"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        left: -size / 2,
        top: -size / 2,
      }}
    />
  );
};

const GrainTexture = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none mix-blend-overlay">
    <filter id="grainy">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grainy)" />
  </svg>
);

interface LiquidGlassBackgroundProps {
  children?: React.ReactNode;
  isDataMode?: boolean;
  onModeToggle?: () => void;
}

export const LiquidGlassBackground: React.FC<LiquidGlassBackgroundProps> = ({ 
  children, 
  isDataMode: externalIsDataMode,
  onModeToggle 
}) => {
  const [internalIsDataMode, setInternalIsDataMode] = useState(false);
  const isDataMode = externalIsDataMode !== undefined ? externalIsDataMode : internalIsDataMode;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Elastic physics for the bubble
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const bubbleX = useSpring(mouseX, springConfig);
  const bubbleY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // For data mode, we generate 100 points.
  const dataPoints = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    color: i % 3 === 0 ? '#0070f3' : i % 3 === 1 ? '#7928ca' : '#ff4d4d',
    size: 400,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050510] cursor-none">
      {/* Background Layer: Organic Spheres */}
      <div className="absolute inset-0 pointer-events-none">
        {dataPoints.map((p, i) => (
          <FloatingSphere
            key={p.id}
            index={i}
            color={p.color}
            size={p.size}
            initialX={p.x}
            initialY={p.y}
            isDataMode={isDataMode}
          />
        ))}
      </div>

      {/* Liquid Glass Bubble Layer */}
      <motion.div
        className="absolute pointer-events-none z-20 rounded-full border border-white/20 overflow-hidden"
        style={{
          x: bubbleX,
          y: bubbleY,
          width: 400,
          height: 400,
          left: -200,
          top: -200,
          backdropFilter: 'blur(40px) saturate(150%)',
          WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        }}
      >
        <GrainTexture />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-30 h-full w-full pointer-events-none">
        {children}
      </div>

      {/* Custom Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[100] pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
};
