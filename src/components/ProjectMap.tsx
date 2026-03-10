import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Node {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  graphic: React.ReactNode;
}

const projects: Node[] = [
  { id: '1', title: 'Visual Rhythm', category: 'Visual Design', x: 20, y: 30, graphic: <div className="w-full h-full bg-neon-blue/20 graphic-bg" /> },
  { id: '2', title: 'Kinetic Flow', category: 'Motion Graphics', x: 45, y: 20, graphic: <div className="w-full h-full bg-neon-orange/20 graphic-bg" /> },
  { id: '3', title: 'Data Pulse', category: 'Data Viz', x: 70, y: 40, graphic: <div className="w-full h-full bg-white/10 graphic-bg" /> },
  { id: '4', title: 'Organic Logic', category: 'Experimental', x: 35, y: 65, graphic: <div className="w-full h-full bg-neon-blue/10 graphic-bg" /> },
  { id: '5', title: 'Grid Theory', category: 'Visual Design', x: 60, y: 75, graphic: <div className="w-full h-full bg-neon-orange/10 graphic-bg" /> },
];

export const ProjectMap: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] bg-black/40 backdrop-blur-sm overflow-hidden border-y border-white/5">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {projects.map((p1, i) => 
          projects.slice(i + 1).map((p2) => {
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist > 45) return null;
            return (
              <motion.path
                key={`${p1.id}-${p2.id}`}
                d={`M ${p1.x}% ${p1.y}% Q ${(p1.x + p2.x) / 2}% ${(p1.y + p2.y) / 2 - 5}% ${p2.x}% ${p2.y}%`}
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.1"
                fill="none"
              />
            );
          })
        )}
      </svg>

      {projects.map((node) => (
        <motion.button
          key={node.id}
          className="absolute w-2 h-2 rounded-full bg-white/50 z-10"
          style={{ left: `${node.x}%`, top: `${node.y}%`, x: '-50%', y: '-50%' }}
          whileHover={{ scale: 3, backgroundColor: '#001AFF' }}
          onHoverStart={() => setHoveredNode(node)}
          onHoverEnd={() => setHoveredNode(null)}
          onClick={() => onSelect(node.id)}
        />
      ))}

      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
          >
            <div className="relative w-1/3 aspect-video glass overflow-hidden rounded-xl">
              <div className="w-full h-full">
                {hoveredNode.graphic}
              </div>
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-black tracking-tighter uppercase">{hoveredNode.title}</h3>
                <p className="text-xs font-medium opacity-50 tracking-widest">{hoveredNode.category}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
