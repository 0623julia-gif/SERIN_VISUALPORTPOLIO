/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LiquidGradient from './components/ui/flow-gradient-hero-section';
import { Bento3Section } from './components/ui/bento-monochrome-1';
import { CategoryCard } from './components/CategoryCard';
import { ProjectMap } from './components/ProjectMap';
import { DataProcessTimeline } from './components/DataProcessTimeline';
import { ContrastSlider } from './components/ContrastSlider';
import { VideoPlayer } from './components/VideoPlayer';
import { ArrowLeft, ChevronDown, Upload } from 'lucide-react';

type View = 'home' | 'category' | 'project' | 'weekly-detail';

interface WeekEntry {
  week: string;
  content: string;
  images?: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  variant: string;
  meta: string;
  statLabel: string;
  statValue: string;
  mainImage?: string;
  weeks?: WeekEntry[];
}

const INITIAL_PROJECTS: Project[] = [];

const ImageUploader = ({ 
  onUpload, 
  currentImage, 
  label = "Upload Graphic",
  className = "" 
}: { 
  onUpload: (base64: string) => void, 
  currentImage?: string, 
  label?: string,
  className?: string
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className={`relative group cursor-pointer overflow-hidden flex items-center justify-center transition-all ${className}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      {currentImage ? (
        <>
          <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload size={24} className="text-white" />
          </div>
        </>
      ) : (
        <div className="text-white/20 flex flex-col items-center gap-2">
          <Upload size={24} />
          <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
        </div>
      )}
    </div>
  );
};

const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  message 
}: { 
  isOpen: boolean, 
  onConfirm: () => void, 
  onCancel: () => void, 
  message: string 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass p-12 rounded-[40px] max-w-md w-full text-center space-y-8 border border-white/20"
      >
        <h3 className="text-2xl font-black tracking-tighter uppercase">{message}</h3>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 glass rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/10"
          >
            No
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-4 bg-white text-black rounded-full text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-transform"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const WeeklyLogItem: React.FC<{ 
  week: WeekEntry, 
  onSave: (content: string, images: string[]) => void 
}> = ({ 
  week, 
  onSave 
}) => {
  const [content, setContent] = useState(week.content);
  const [images, setImages] = useState(week.images || []);
  const [isSaved, setIsSaved] = useState(true);

  const handleContentChange = (val: string) => {
    setContent(val);
    setIsSaved(false);
  };

  const handleImageUpload = (img: string) => {
    setImages([img]);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSave(content, images);
    setIsSaved(true);
  };

  return (
    <div className="glass p-20 rounded-[40px] border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-16 relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 blur-[100px] -z-10 group-hover:bg-neon-blue/10 transition-colors duration-700" />
      
      <div className="md:col-span-3">
        <div className="sticky top-40 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-50">Active Phase</span>
          </div>
          <div className="text-7xl font-black tracking-tighter text-white/5 group-hover:text-neon-blue/20 transition-colors duration-700">
            {week.week.split(' ')[1]}
          </div>
          <h3 className="text-2xl font-black tracking-tighter uppercase">{week.week}</h3>
          <div className="h-[1px] w-full bg-white/5" />
          <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Milestone Tracking</div>
        </div>
      </div>

      <div className="md:col-span-9 space-y-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black tracking-widest uppercase opacity-40">Process Narrative</h4>
            {!isSaved && <span className="text-[9px] font-black text-neon-orange uppercase tracking-widest animate-pulse">Unsaved Changes</span>}
          </div>
          <div className="relative">
            <textarea 
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full p-10 bg-white/5 rounded-3xl border border-white/5 focus:border-neon-blue/30 focus:bg-white/[0.07] outline-none text-white/80 resize-none h-48 text-lg font-medium transition-all placeholder:text-white/10"
              placeholder="Describe the week's logical flow, challenges, and breakthroughs..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black tracking-widest uppercase opacity-40">Visual Artifacts</h4>
          <div className="grid grid-cols-1 gap-6">
            <ImageUploader 
              currentImage={images[0]}
              onUpload={handleImageUpload}
              className="aspect-video glass rounded-3xl border border-white/5 border-dashed border-2"
              label="Upload Primary Asset"
            />
          </div>
        </div>

        <div className="pt-8 flex justify-end gap-4">
          <button 
            onClick={() => {
              setContent(week.content);
              setImages(week.images || []);
              setIsSaved(true);
            }}
            className="px-8 py-3 glass rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/10 opacity-40 hover:opacity-100"
          >
            Reset
          </button>
          <button 
            onClick={handleSave}
            className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
              isSaved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white text-black hover:scale-105'
            }`}
          >
            {isSaved ? 'Saved ✓' : 'Save Week'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('kim_serin_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('kim_serin_projects', JSON.stringify(projects));
  }, [projects]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setView('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWeeklyDetailClick = () => {
    setView('weekly-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addMockProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: `New ${selectedCategory} Project`,
      category: selectedCategory || 'Visual Design',
      year: new Date().getFullYear().toString(),
      description: 'A newly created project demonstrating the dynamic system capability.',
      variant: ['orbit', 'relay', 'wave', 'spark', 'loop'][Math.floor(Math.random() * 5)],
      meta: 'New',
      statLabel: 'Status',
      statValue: 'Live',
      weeks: Array.from({ length: 15 }).map((_, i) => ({
        week: `Week ${(i + 1).toString().padStart(2, '0')}`,
        content: '',
        images: []
      }))
    };
    setProjects([...projects, newProject]);
    handleProjectClick(newProject);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setProjectToDelete(null);
    if (selectedProject?.id === id) {
      setView('category');
    }
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const updateWeek = (weekLabel: string, content: string, images: string[]) => {
    if (!selectedProject) return;
    const updatedWeeks = selectedProject.weeks?.map(w => 
      w.week === weekLabel ? { ...w, content, images } : w
    );
    updateProject({ ...selectedProject, weeks: updatedWeeks });
  };

  const goBack = () => {
    if (view === 'weekly-detail') setView('project');
    else if (view === 'project') setView('category');
    else setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen selection:bg-neon-orange selection:text-white">
      {/* New Liquid Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <LiquidGradient 
          title="" 
          showPauseButton={true}
          ctaText=""
        />
      </div>
      
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 pb-20 px-6"
          >
            {/* Hero Section */}
            <section className="h-[75vh] flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-[8vw] font-black tracking-tighter leading-[0.85] uppercase mix-blend-difference">
                  KIM SERIN
                  <br />
                  <span className="text-neon-blue">VISUAL DESIGN</span>
                </h1>
                <p className="text-[11px] font-bold tracking-[0.5em] opacity-60 uppercase">
                  CONNECTIVITY of VISUAL and INFORMATION
                </p>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-24 opacity-20"
              >
                <ChevronDown size={24} />
              </motion.div>
            </section>

            {/* Identity Brief */}
            <section className="max-w-3xl mx-auto my-32 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-tight uppercase">
                데이터의 체계성과 심미적 조형성의
                <br />
                조화를 추구하는 디자이너 김세린입니다.
              </h2>
              <div className="w-12 h-[2px] bg-neon-orange mx-auto" />
            </section>

            {/* Category Navigation */}
            <section className="max-w-7xl mx-auto mt-32 px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <CategoryCard 
                  number="01" 
                  title="Visual Design" 
                  graphic={<div className="w-full h-full bg-neon-blue/10 graphic-bg" />}
                  onClick={() => handleCategoryClick('Visual Design')}
                />
                <CategoryCard 
                  number="02" 
                  title="Motion Graphics" 
                  graphic={<div className="w-full h-full bg-neon-orange/10 graphic-bg" />}
                  onClick={() => handleCategoryClick('Motion Graphics')}
                />
                <CategoryCard 
                  number="03" 
                  title="DATA VISUALIZATION" 
                  graphic={<div className="w-full h-full bg-white/10 graphic-bg" />}
                  onClick={() => handleCategoryClick('DATA VISUALIZATION')}
                />
              </div>
            </section>
          </motion.main>
        )}

        {view === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="pt-32 pb-32 px-6"
          >
            <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 glass">
              <button onClick={goBack} className="flex items-center gap-2 text-[11px] font-bold tracking-tighter uppercase hover:text-neon-blue transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <div className="text-[10px] font-black tracking-widest uppercase opacity-40">{selectedCategory}</div>
            </nav>

            <div className="max-w-[1400px] mx-auto glass rounded-[64px] p-12 md:p-24 shadow-2xl">
              <header className="mb-16 flex flex-col items-start gap-8">
                <div className="space-y-6">
                  <h1 className="text-[7vw] font-black tracking-tighter leading-none uppercase">{selectedCategory}</h1>
                  <p className="text-[15px] opacity-50 max-w-2xl leading-relaxed">
                    Exploring the boundaries of {selectedCategory?.toLowerCase()} through rigorous logic and organic form.
                  </p>
                </div>
                <div className="flex gap-6">
                  <button 
                    onClick={addMockProject}
                    className="px-6 py-3 glass rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/10 text-neon-blue"
                  >
                    + Create Post
                  </button>
                </div>
              </header>

              <div className="space-y-12">
                <Bento3Section 
                  posts={projects
                    .filter(p => p.category === selectedCategory)
                    .map(p => ({ ...p, onDetail: handleProjectClick, onDelete: () => setProjectToDelete(p.id) }))
                  } 
                />
              </div>
            </div>
          </motion.div>
        )}

        {view === 'project' && selectedProject && (
          <motion.div
            key="project"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-32 px-6"
          >
            <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 glass">
              <button onClick={goBack} className="flex items-center gap-2 text-[11px] font-bold tracking-tighter uppercase hover:text-neon-blue transition-colors">
                <ArrowLeft size={16} /> Back to Archive
              </button>
              <div className="text-[10px] font-black tracking-widest uppercase opacity-40">{selectedProject.title}</div>
            </nav>

            <div className="max-w-[1400px] mx-auto glass rounded-[64px] p-12 md:p-24 shadow-2xl">
              <div className="space-y-12">
                <header className="space-y-6 relative">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-neon-blue border border-white/10">
                      {selectedProject.meta}
                    </span>
                    <span className="text-[11px] font-bold opacity-40 uppercase tracking-widest">
                      {selectedProject.year}
                    </span>
                  </div>
                  <input 
                    type="text"
                    value={selectedProject.title}
                    onChange={(e) => updateProject({ ...selectedProject, title: e.target.value })}
                    className="w-full bg-transparent text-[8vw] font-black tracking-tighter leading-[0.85] uppercase outline-none focus:text-neon-blue transition-colors"
                  />
                  <button 
                    onClick={() => setProjectToDelete(selectedProject.id)}
                    className="absolute top-0 right-0 p-4 glass rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    Delete Project
                  </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-12">
                    <ImageUploader 
                      currentImage={selectedProject.mainImage}
                      onUpload={(img) => updateProject({ ...selectedProject, mainImage: img })}
                      className="glass rounded-2xl aspect-video border border-white/10"
                    />
                    
                    <div className="glass p-24 rounded-3xl space-y-16 border border-white/10">
                      <div className="space-y-8">
                        <div className="flex justify-between items-center">
                          <h2 className="text-4xl font-black tracking-tighter uppercase">Project Narrative</h2>
                          <button 
                            onClick={handleWeeklyDetailClick}
                            className="px-8 py-3 glass rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/10 text-neon-blue"
                          >
                            View Weekly Details
                          </button>
                        </div>
                        <textarea 
                          value={selectedProject.description}
                          onChange={(e) => updateProject({ ...selectedProject, description: e.target.value })}
                          className="w-full bg-transparent text-xl text-white/70 leading-relaxed font-medium outline-none resize-none h-32 focus:text-white transition-colors"
                        />
                      </div>

                      <div className="space-y-10 pt-16 border-t border-white/5">
                        <h3 className="text-sm font-black tracking-widest uppercase opacity-40">Weekly Progress</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {selectedProject.weeks?.map((w, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="aspect-square glass rounded-xl overflow-hidden border border-white/5">
                                {w.images && w.images.length > 0 ? (
                                  <img src={w.images[0]} alt={w.week} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center opacity-10">
                                    <Upload size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="text-[9px] font-black tracking-widest uppercase text-center opacity-30">{w.week}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
                        <div>
                          <input 
                            value={selectedProject.statLabel}
                            onChange={(e) => updateProject({ ...selectedProject, statLabel: e.target.value })}
                            className="bg-transparent text-[10px] font-black tracking-widest uppercase opacity-30 mb-2 outline-none w-full"
                          />
                          <input 
                            value={selectedProject.statValue}
                            onChange={(e) => updateProject({ ...selectedProject, statValue: e.target.value })}
                            className="bg-transparent text-4xl font-black tracking-tighter uppercase text-neon-orange outline-none w-full"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] font-black tracking-widest uppercase opacity-30 mb-2">Platform</div>
                          <div className="text-4xl font-black tracking-tighter uppercase">Web/Mobile</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-6 sticky top-32">
                      <h3 className="text-sm font-black tracking-widest uppercase opacity-40">Process Insights</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-[10px] font-bold uppercase opacity-40 mb-1">01 Discovery</div>
                          <div className="text-xs font-medium">Identifying core data signals and mapping user intent.</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-[10px] font-bold uppercase opacity-40 mb-1">02 Synthesis</div>
                          <div className="text-xs font-medium">Translating complex information into visual primitives.</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-[10px] font-bold uppercase opacity-40 mb-1">03 Delivery</div>
                          <div className="text-xs font-medium">Iterative refinement of the visual system.</div>
                        </div>
                      </div>
                      <button className="w-full py-4 bg-white text-black rounded-xl font-black text-[10px] tracking-widest uppercase hover:scale-[1.02] transition-transform">
                        Download Case Study
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {view === 'weekly-detail' && selectedProject && (
          <motion.div
            key="weekly-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-32 pb-32 px-6"
          >
            <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 glass">
              <button onClick={goBack} className="flex items-center gap-2 text-[11px] font-bold tracking-tighter uppercase hover:text-neon-blue transition-colors">
                <ArrowLeft size={16} /> Back to Project
              </button>
              <div className="text-[10px] font-black tracking-widest uppercase opacity-40">{selectedProject.title} / Weekly Log</div>
            </nav>

            <div className="max-w-[1200px] mx-auto glass rounded-[64px] p-12 md:p-24 shadow-2xl">
              <div className="space-y-16">
                <header className="space-y-4">
                  <h1 className="text-5xl font-black tracking-tighter uppercase">Weekly Process Log</h1>
                  <p className="text-sm opacity-40 uppercase tracking-widest">A comprehensive 15-week breakdown of the logical flow.</p>
                </header>

                <div className="space-y-12">
                  {selectedProject.weeks?.map((w, i) => (
                    <WeeklyLogItem 
                      key={`${selectedProject.id}-${w.week}`} 
                      week={w} 
                      onSave={(content, images) => updateWeek(w.week, content, images)} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={!!projectToDelete}
        message="Are you sure you want to delete this project?"
        onConfirm={() => projectToDelete && deleteProject(projectToDelete)}
        onCancel={() => setProjectToDelete(null)}
      />

      <footer className="max-w-7xl mx-auto mb-12 glass rounded-[32px] py-12 px-6 text-center space-y-3">
        <div className="text-lg font-black tracking-tighter uppercase opacity-80">KIM SERIN</div>
        <p className="text-[9px] opacity-20 tracking-[0.4em] uppercase">© 2026. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
