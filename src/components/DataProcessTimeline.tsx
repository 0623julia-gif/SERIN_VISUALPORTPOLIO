import React from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export const DataProcessTimeline: React.FC = () => {
  return (
    <div className="space-y-24 py-12 px-6 max-w-5xl mx-auto">
      {/* Step 01 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <div className="text-neon-blue font-black text-2xl">01</div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Data Selection</h2>
          <p className="text-[14px] text-zinc-500 leading-relaxed">
            Why this data? Exploring the intersection of urban mobility and emotional resonance. 
            Selected 1.2M data points from metropolitan transit logs to identify patterns of 'invisible' movement.
          </p>
        </div>
        <div className="aspect-square glass rounded-xl flex items-center justify-center p-6">
          <div className="w-full h-full border border-dashed border-white/10 rounded-full animate-pulse flex items-center justify-center">
             <div className="text-[8px] tracking-[0.5em] opacity-20">DATA SOURCE A-1</div>
          </div>
        </div>
      </section>

      {/* Step 02 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 font-mono text-[9px] text-zinc-600 overflow-hidden h-[300px] glass-dark p-4 rounded-lg">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap opacity-40">
              {`{ "id": "${Math.random().toString(36).substr(2, 9)}", "val": ${Math.random().toFixed(4)} }`}
            </div>
          ))}
        </div>
        <div className="order-1 md:order-2 space-y-4">
          <div className="text-neon-blue font-black text-2xl">02</div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Collection & Refinement</h2>
          <p className="text-[14px] text-zinc-500 leading-relaxed">
            Raw data is noise. Refinement involves filtering outliers and normalizing temporal variance. 
            The process of cleaning is as aesthetic as the final form.
          </p>
        </div>
      </section>

      {/* Step 03 */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-neon-blue font-black text-2xl">03</div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Visual Logic</h2>
        </div>
        <div className="relative aspect-video glass rounded-xl overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            <rect width="100%" height="100%" fill="url(#grid)" className="opacity-10" />
            <motion.path
              d="M 100 200 Q 400 50 700 200 T 1300 200"
              stroke="#001AFF"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[8px] tracking-[0.8em] font-bold opacity-20 uppercase">Geometric Transformation</div>
          </div>
        </div>
      </section>

      {/* Step 04 */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-neon-blue font-black text-2xl">04</div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Final Output</h2>
        </div>
        <div className="h-[350px] w-full glass-dark p-6 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#444" fontSize={10} />
              <YAxis stroke="#444" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: '#001AFF' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#001AFF" 
                strokeWidth={2} 
                dot={{ fill: '#001AFF', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
