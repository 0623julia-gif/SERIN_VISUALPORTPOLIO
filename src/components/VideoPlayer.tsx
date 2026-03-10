import React from 'react';
import { motion } from 'motion/react';
import { Play, Grid3X3 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  layoutId?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, layoutId }) => {
  const [showGrid, setShowGrid] = useState(false);

  return (
    <motion.div 
      layoutId={layoutId}
      className="relative group aspect-video bg-zinc-900 overflow-hidden rounded-lg border border-white/10"
    >
      <video
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Grid Overlay */}
      <motion.div 
        initial={false}
        animate={{ opacity: showGrid ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={cn(
            "p-2 rounded-full backdrop-blur-md border transition-colors",
            showGrid ? "bg-electric-blue border-electric-blue text-white" : "bg-black/50 border-white/20 text-white/70"
          )}
        >
          <Grid3X3 size={18} />
        </button>
      </div>
    </motion.div>
  );
};
