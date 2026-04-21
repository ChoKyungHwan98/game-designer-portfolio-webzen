import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, FileText, Layout, Tag, Calendar, ScrollText, Grid, X, LayoutGrid } from 'lucide-react';
import type { Project } from '../types';
import { EBookGallery } from './EBookGallery';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  isEditing?: boolean;
  onSaveContent?: (content: string) => void;
}

type TabType = 'overview' | 'document' | 'video';

export const ProjectDetail = ({ project, onClose, isEditing, onSaveContent }: ProjectDetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentPage, setCurrentPage] = useState(0);
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '개요', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'document', label: '기획서', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'video', label: '영상', icon: <Play className="w-3.5 h-3.5" /> },
  ];

  const galleryImages = project.gallery || [project.image];

  const getTheme = () => {
    switch (activeTab) {
      case 'overview': return { bg: 'bg-white', text: 'text-zinc-900', border: 'border-zinc-200', tabActive: 'bg-white text-zinc-900', accent: '#0047BB' };
      case 'document': return { bg: 'bg-[#0047BB]', text: 'text-white', border: 'border-white/30', tabActive: 'bg-[#0047BB] text-white', accent: '#ffffff' };
      case 'video': return { bg: 'bg-[#1A1A1A]', text: 'text-white', border: 'border-white/20', tabActive: 'bg-[#1A1A1A] text-white', accent: '#0047BB' };
      default: return { bg: 'bg-white', text: 'text-zinc-900', border: 'border-zinc-200', tabActive: 'bg-white', accent: '#0047BB' };
    }
  };

  const theme = getTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex-1 flex flex-col min-h-0 bg-zinc-100 overflow-hidden rounded-4xl"
    >
      {/* Windows-style Tab Bar Header */}
      <div className="shrink-0 h-14 bg-zinc-200/50 backdrop-blur-md flex items-center px-4 border-b border-zinc-300 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabColors = {
            overview: isActive 
              ? 'bg-white text-zinc-900 shadow-sm z-30' 
              : 'bg-white/40 text-zinc-500 hover:bg-white/60 hover:text-zinc-700 z-10',
            document: isActive 
              ? 'bg-[#0047BB] text-white shadow-md z-30' 
              : 'bg-[#0047BB]/30 text-[#0047BB] hover:bg-[#0047BB]/50 hover:text-white z-10',
            video: isActive 
              ? 'bg-[#1A1A1A] text-white shadow-md z-30' 
              : 'bg-[#1A1A1A]/30 text-zinc-600 hover:bg-[#1A1A1A]/50 hover:text-white z-10',
          };

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-11 px-6 rounded-t-xl flex items-center gap-2.5 transition-all duration-300 font-display font-black text-[11px] uppercase tracking-wider relative group border-t border-x border-transparent ${isActive ? 'border-zinc-300/30' : ''} ${tabColors[tab.id]}`}
            >
              <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              {tab.label}
              {isActive && (
                <motion.div layoutId="activeTabUnderline" className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current opacity-20 rounded-full" />
              )}
            </button>
          );
        })}

        {/* Dynamic Center Page Control (Integrated into header) */}
        <div className="flex-1 flex justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 'document' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-1.5 rounded-full border border-zinc-300/50 shadow-sm"
              >
                <div className="text-[11px] font-black text-zinc-900 tracking-widest flex items-center gap-2">
                  <span>{String(currentPage + 1).padStart(2, '0')}</span>
                  <span className="text-zinc-300">/</span>
                  <span className="text-zinc-400">{String(galleryImages.length).padStart(2, '0')}</span>
                </div>
                <div className="w-px h-3 bg-zinc-200" />
                <button 
                  onClick={() => setShowThumbnailGrid(true)}
                  className="hover:text-[#0047BB] transition-colors p-1"
                  title="전체 페이지 보기"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Windows Close Button Style - Circular Hover */}
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-transparent hover:bg-[#FF4B4B] hover:text-white text-zinc-600 flex items-center justify-center transition-all duration-300 group ml-4 relative z-130"
          title="닫기"
        >
          <X className="w-5 h-5 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Content Area - Maximized Space */}
      <div className="flex-1 flex flex-col min-h-0 bg-white relative">
        <AnimatePresence mode="wait">
          {activeTab === 'document' ? (
            <motion.div key="tab-document" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden bg-zinc-50"
            >
              <EBookGallery images={galleryImages} currentIndex={currentPage} onPageChange={setCurrentPage} />
            </motion.div>
          ) : activeTab === 'video' ? (
            <motion.div key="tab-video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col p-8 bg-zinc-900"
            >
              <div className="flex-1 rounded-2xl overflow-hidden bg-black shadow-2xl relative group border border-white/5">
                <iframe src={project.videoUrl?.replace('watch?v=', 'embed/')} className="w-full h-full border-0" allowFullScreen />
              </div>
            </motion.div>
          ) : (
            <motion.div key="tab-overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto bg-[#FCFCFA] custom-scrollbar"
            >
              <div className="max-w-5xl mx-auto p-12 md:p-20">
                <div className="relative h-[450px] rounded-[3rem] overflow-hidden mb-20 shadow-2xl group border border-black/5">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12">
                    <div className="flex flex-wrap gap-3 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[11px] font-black uppercase tracking-widest shadow-sm">#{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-6xl md:text-7xl font-black text-white mb-4 leading-[0.9] tracking-tighter drop-shadow-2xl">{project.title}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                  <div className="md:col-span-2 space-y-16">
                    <section className="relative">
                      <div className="absolute -left-10 top-0 w-1.5 h-full bg-[#0047BB] opacity-20 rounded-full" />
                      <h3 className="text-3xl font-black text-[#1A1A1A] mb-10 flex items-center gap-4 tracking-tight">
                        <FileText className="w-8 h-8 text-[#0047BB]" /> 기획 의도 및 핵심 내용
                      </h3>
                      <div className="prose prose-zinc prose-xl max-w-none text-zinc-800 leading-[1.8] whitespace-pre-wrap font-medium">
                        {project.content}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-12">
                    <div className="bg-white rounded-[3rem] p-12 border border-black/5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] sticky top-10 overflow-hidden group/meta">
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#0047BB]" />
                      <div className="relative z-10">
                        <h4 className="text-[14px] font-black text-[#0047BB] uppercase tracking-[0.4em] mb-14 flex items-center gap-3">
                          <span className="w-10 h-px bg-[#0047BB]/20" />
                          Metadata
                        </h4>
                        <div className="space-y-12">
                          <div className="flex items-start gap-7 group">
                            <div className="w-14 h-14 rounded-2xl bg-[#0047BB]/5 border border-[#0047BB]/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-[#0047BB] group-hover:text-white group-hover:scale-110">
                              <Tag className="w-6 h-6 text-[#0047BB] transition-colors group-hover:text-white" />
                            </div>
                            <div className="min-w-0 flex-1 pt-2">
                              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2 leading-none">Category</p>
                              <p className="text-2xl font-black text-[#1A1A1A] tracking-tight group-hover:text-[#0047BB] transition-colors">{project.category}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-7 group">
                            <div className="w-14 h-14 rounded-2xl bg-[#0047BB]/5 border border-[#0047BB]/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-[#0047BB] group-hover:text-white group-hover:scale-110">
                              <Calendar className="w-6 h-6 text-[#0047BB] transition-colors group-hover:text-white" />
                            </div>
                            <div className="min-w-0 flex-1 pt-2">
                              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2 leading-none">Status</p>
                              <p className="text-2xl font-black text-[#1A1A1A] tracking-tight group-hover:text-[#0047BB] transition-colors">{project.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail Grid Overlay */}
      <AnimatePresence>
        {showThumbnailGrid && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-120 bg-[#1A1A1A]/95 backdrop-blur-3xl p-16 flex flex-col"
          >
            <div className="flex items-center justify-between mb-16">
              <div className="flex flex-col">
                <span className="text-[#0047BB] text-[12px] font-black tracking-[0.5em] uppercase mb-3">Navigation</span>
                <h3 className="text-white text-5xl font-black tracking-tighter">전체 페이지 개요</h3>
              </div>
              <button 
                onClick={() => setShowThumbnailGrid(false)}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:rotate-90 border border-white/10"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-10">
                {galleryImages.map((img, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    onClick={() => {
                      setCurrentPage(i);
                      setShowThumbnailGrid(false);
                    }}
                    className={`group relative aspect-3/4 rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:scale-110 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${i === currentPage ? 'border-[#0047BB] shadow-[0_0_40px_rgba(0,71,187,0.5)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <img src={img} alt={`Page ${i+1}`} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 transition-opacity duration-500 ${i === currentPage ? 'bg-[#0047BB]/20' : 'bg-black/60 opacity-0 group-hover:opacity-100'}`} />
                    <div className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-xl bg-black/80 backdrop-blur-md text-white text-[12px] font-black border border-white/10">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="shrink-0 mt-12 text-center text-white/20 text-[11px] font-black tracking-[0.5em] uppercase">
              {galleryImages.length} Pages Overview • Selection: Page {currentPage + 1}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
