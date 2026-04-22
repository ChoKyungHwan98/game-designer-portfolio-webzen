import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, MousePointer2 } from 'lucide-react';
import { EditableText } from './EditableText';
import { ProjectDetail } from './ProjectDetail';
import type { Project } from '../types';

interface PortfolioProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  setView: (v: any) => void;
  onBack: () => void;
  initialProjectId?: number | null;
}

export const Portfolio = ({ isEditing, projects, setProjects, onBack, initialProjectId }: PortfolioProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (initialProjectId != null) {
      const target = projects.find(p => p.id === initialProjectId);
      if (target) setSelectedProject(target);
    }
    window.scrollTo(0, 0);
  }, [initialProjectId, projects]);

  const categories = ['전체', ...Array.from(new Set(projects.flatMap(p => p.roles)))];
  const [activeCategory, setActiveCategory] = useState('전체');

  const filteredProjects = activeCategory === '전체'
    ? projects
    : projects.filter(p => p.roles && p.roles.includes(activeCategory));

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{background: 'rgba(0,71,187,0.04)'}}></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full blur-[100px]" style={{background: 'rgba(80,0,20,0.03)'}}></div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-black/5 p-8 md:p-12 lg:p-16 min-h-[80vh]">

        {/* Minimalist Editorial Filter Bar */}
        <div className="flex flex-col items-center mb-16 relative">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-b border-zinc-100 pb-4 w-full max-w-4xl">
            {categories.map((category) => {
              const count = category === '전체' 
                ? projects.length 
                : projects.filter(p => p.roles && p.roles.includes(category)).length;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative py-2 transition-all duration-300 group flex items-center gap-2.5 ${
                    isActive ? 'text-[#0047BB]' : 'text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.2em] leading-none transition-transform duration-500">
                    {category}
                  </span>
                  <span className={`relative z-10 text-[10px] font-black transition-colors duration-300 ${
                    isActive ? 'text-[#0047BB]/50' : 'text-zinc-300 group-hover:text-zinc-500'
                  }`}>
                    {String(count).padStart(2, '0')}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryLine"
                      className="absolute bottom-[-17px] left-0 right-0 h-[3px] bg-[#0047BB] rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Polished Project Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-zinc-100 cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-500"
              >
                {/* Card Image */}
                <div className="aspect-[16/10] overflow-hidden relative bg-zinc-50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                  <div className="absolute top-5 left-5 z-10 flex flex-wrap gap-1.5">
                    {project.roles.map(role => (
                      <span key={role} className="px-2.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-[9px] font-black uppercase tracking-[0.1em]">{role}</span>
                    ))}
                  </div>

                  {/* Hover icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0047BB] shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="text-xl lg:text-2xl font-display font-black tracking-tight text-zinc-900 group-hover:text-[#0047BB] transition-colors leading-tight">
                      {project.title}
                    </h4>
                    {project.status && (
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border tracking-tighter ${
                         project.status === '미출시' ? 'bg-zinc-50 text-zinc-400 border-zinc-100' : 'bg-blue-50 text-[#0047BB] border-blue-100'
                       }`}>
                         {project.status}
                       </span>
                    )}
                  </div>

                  <p className="text-zinc-500 text-[14px] leading-relaxed mb-8 line-clamp-2 font-medium">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        </div>
      </motion.section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-100">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
              <div className="absolute inset-0 flex items-center justify-center p-0 md:p-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.97 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                  className="w-[98vw] md:w-[95vw] h-[98vh] md:h-[95vh] max-w-[1600px] bg-bg-main md:rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden relative pointer-events-auto flex flex-col"
                >

                {/* Content - height fills modal, scroll managed per-tab */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <ProjectDetail
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                    isEditing={isEditing}
                    onSaveContent={(c) => {
                      const p = [...projects];
                      const i = p.findIndex(pp => pp.id === selectedProject.id);
                      if (i !== -1) { p[i].content = c; setProjects(p); setSelectedProject({ ...selectedProject, content: c }); }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
