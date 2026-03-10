import React from 'react';
import { motion } from 'motion/react';

interface CategoryCardProps {
  number: string;
  title: string;
  graphic: React.ReactNode;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ number, title, graphic, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group aspect-[16/10] overflow-hidden rounded-xl glass hover:bg-white/10 transition-all duration-500 text-left"
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
        {graphic}
      </div>
      
      <div className="absolute inset-0 p-8 flex flex-col justify-center z-10 gap-4">
        <div className="text-neon-blue font-black text-lg tracking-tighter leading-none">{number}</div>
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tighter uppercase leading-tight">{title}</h3>
          <div className="w-6 group-hover:w-24 h-[2px] bg-neon-orange transition-all duration-500" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </motion.button>
  );
};
