import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Monitor, Smartphone, Plus, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { EditableText } from './EditableText';
import type { GameHistory } from '../types';
import { ALL_GAMES } from '../data/games';

interface PlayHistoryProps {
  isEditing: boolean;
  history: GameHistory;
  setHistory: (h: GameHistory) => void;
  onViewAll?: () => void;
}

export const PlayHistory = ({ isEditing, history, setHistory }: PlayHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'PC' | 'Mobile' | 'Console'>('PC');
  
  const allGamesCount = ALL_GAMES.length; // 289
  
  const renderDashboardRow = (title: string, icon: React.ReactNode, dataKey: keyof GameHistory) => {
    const items = history[dataKey] || [];
    return (
      <div className="flex flex-col bg-white border border-black/5 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 group/board min-h-[320px]">
        <div className="flex flex-col mb-4 pb-4 border-b border-black/5 group-hover/board:border-black/10 transition-colors">
          <div className="flex items-center gap-3 text-[#2C2C2C] mb-2">
             <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-[#2C2C2C] border border-black/5 group-hover/board:bg-[#0047BB] group-hover/board:text-white transition-colors duration-300 shadow-sm shrink-0">
               {icon}
             </div>
             <span className="font-display font-bold tracking-tight text-xl">{title}</span>
          </div>
          <div className="flex items-center justify-between">
             <span className="px-3 py-1 bg-zinc-100 rounded-lg font-mono text-xs font-bold text-[#0047BB]">{ALL_GAMES.filter(g => g.category.toLowerCase().includes(dataKey === 'pc' ? 'pc' : dataKey)).length} TITLES</span>
             {isEditing && (
              <button onClick={() => { const h = {...history}; h[dataKey].push({ id: Date.now().toString(), name: "새 항목", hours: 0 }); setHistory(h); }}
                className="w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors rounded-full text-xs" title="항목 추가">
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-0 flex-1 mt-2">
          {items.slice(0, 3).map((game, idx) => (
            <div key={game.id} className="group relative flex items-center justify-between py-3 px-2 border-b border-black/5 hover:border-[#0047BB]/20 hover:bg-zinc-50 transition-colors h-[56px] flex-none">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 bottom-auto h-[60%] w-[3px] bg-[#0047BB] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r z-10 w-[3px]"></div>
              
              <div className="flex items-center gap-3 min-w-0 pr-4 pl-3 relative z-10">
                 <span className="text-[10px] font-bold text-[#0047BB]/60 group-hover:text-[#0047BB] uppercase tracking-widest shrink-0 truncate w-16">{game.genre}</span>
                 <h4 className="font-bold text-sm text-[#2C2C2C] truncate">
                   <EditableText value={game.title || ""} onSave={(v) => { const h = {...history}; h[dataKey][idx].title = v; setHistory(h); }} isEditing={isEditing} />
                 </h4>
              </div>
              {game.playTime && (
                 <span className="font-mono text-[10px] text-zinc-400 group-hover:text-zinc-600 font-bold shrink-0 relative z-10 pr-2">{game.playTime}</span>
              )}
               {isEditing && (
                  <button onClick={() => { const h = {...history}; h[dataKey].splice(idx, 1); setHistory(h); }} className="text-zinc-300 hover:text-red-500 transition-colors p-1 relative z-20">
                    <X className="w-3 h-3" />
                  </button>
                )}
            </div>
          ))}
          {items.length > 3 && !isEditing && (
            <div className="text-center pt-2 mt-auto">
              <span className="text-[10px] font-bold text-zinc-300 tracking-[0.2em] uppercase">+ {items.length - 3} TITLES HIDDEN</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentTabGames = ALL_GAMES.filter(g => g.category === activeTab);

  // Stagger animation for the chips
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.02 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const chipVariants = {
    hidden: { opacity: 0, y: -40, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <section id="play-history" className="py-[120px] lg:py-[160px] px-6 md:px-12 relative min-h-screen flex flex-col justify-center bg-[#FFFFFF] border-t border-black/5">
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col h-full">
        <div className="mb-8 flex flex-col lg:flex-row justify-between lg:items-end gap-6 border-b border-black/5 pb-6">
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#0047BB] font-sans text-[11px] font-bold tracking-widest uppercase mb-3 block">04. 플레이 이력</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex flex-col gap-1 items-start mt-2">
              <span className="text-xl md:text-2xl text-zinc-400 font-display font-medium tracking-tight">방대한 플레이 경험이 만든</span>
              <span className="text-5xl md:text-6xl lg:text-[5rem] font-display font-black tracking-tighter text-[#2C2C2C] leading-none">인사이트</span>
            </motion.h2>
          </div>
          <p className="text-zinc-500 text-sm leading-[1.6] lg:text-right font-medium max-w-sm">플랫폼과 장르를 넘나드는 심층 분석 데이터베이스입니다.</p>
        </div>

        <div className="bg-[#0047BB] text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 w-full border border-black/5 relative overflow-hidden mb-6 z-20">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] object-cover bg-repeat bg-[size:100px_100px]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"}}></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md w-full md:w-auto justify-center">
               <Gamepad2 className="w-6 h-6 text-white/90" />
               <div className="text-left">
                  <span className="block text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1">Total Analyzed</span>
                  <span className="text-3xl font-display font-bold text-white tracking-tight leading-none">{allGamesCount}</span>
               </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-md text-white/80 font-medium text-[14px] leading-relaxed hidden lg:block text-center md:text-left relative z-10 mx-auto">
             다양한 플랫폼 및 장르 분석을 통해 트렌디한 감각과 심층적인 수준의 역량을 증명합니다.
          </div>

          {!isEditing && !isExpanded && (
            <button onClick={() => setIsExpanded(true)}
              className="w-full md:w-auto py-4 px-8 bg-white text-[#0047BB] rounded-xl font-bold tracking-widest text-sm uppercase hover:bg-zinc-100 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-3 shrink-0 relative z-10 hover:-translate-y-0.5">
              전체 목록 보기 <ArrowRight className="w-4 h-4" />
            </button>
          )}
          
          {!isEditing && isExpanded && (
            <button onClick={() => setIsExpanded(false)}
              className="w-full md:w-auto py-4 px-8 bg-black/20 text-white rounded-xl font-bold tracking-widest text-sm uppercase hover:bg-black/30 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-3 shrink-0 relative z-10">
              <ArrowLeft className="w-4 h-4" /> 대시보드로 돌아가기
            </button>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div key="dashboard" 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 shrink-0 z-10">
              {renderDashboardRow("PC / Mainline", <Monitor className="w-6 h-6" />, "pc")}
              {renderDashboardRow("Console / Others", <Gamepad2 className="w-6 h-6" />, "console")}
              {renderDashboardRow("Mobile", <Smartphone className="w-6 h-6" />, "mobile")}
            </motion.div>
          ) : (
            <motion.div key="expanded"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col bg-zinc-50 border border-black/5 rounded-3xl p-6 md:p-8 shadow-inner overflow-hidden min-h-[500px] z-10">
              
              <div className="flex flex-wrap gap-3 mb-8 pb-4 border-b border-black/5 justify-center md:justify-start">
                {[{id: 'PC', label: 'PC / Mainline', icon: Monitor},
                  {id: 'Console', label: 'Console / Others', icon: Gamepad2},
                  {id: 'Mobile', label: 'Mobile', icon: Smartphone}].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as 'PC'|'Console'|'Mobile')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm tracking-tight transition-all duration-300 ${activeTab === tab.id ? 'bg-[#0047BB] text-white shadow-md' : 'bg-white text-zinc-500 border border-black/5 hover:border-black/10 hover:bg-zinc-100/50'}`}>
                    <tab.icon className={`w-4 h-4 \${activeTab === tab.id ? 'text-white' : 'text-zinc-400'}`} />
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] \${activeTab === tab.id ? 'bg-white/20' : 'bg-zinc-100 text-[#0047BB]'}`}>
                       {ALL_GAMES.filter(g => g.category === tab.id).length}
                    </span>
                  </button>
                ))}
              </div>

              <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" key={activeTab}
                className="flex flex-wrap gap-2 md:gap-3 content-start">
                {currentTabGames.map((game, i) => (
                  <motion.div key={game.id + '-' + i} variants={chipVariants}
                    className="flex flex-col group relative bg-white border border-black/5 px-4 py-3 rounded-lg shadow-sm hover:shadow-md hover:border-[#0047BB]/30 transition-all duration-300">
                     <span className="text-[9px] font-bold text-[#0047BB]/70 uppercase tracking-widest mb-1">{game.genre}</span>
                     <div className="flex items-center gap-3">
                        <span className="font-bold text-[#2C2C2C] text-sm group-hover:text-[#0047BB] transition-colors">{game.title}</span>
                        {game.company && <span className="text-[10px] text-zinc-400 font-medium px-1.5 py-0.5 bg-zinc-50 rounded">{game.company}</span>}
                     </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-auto pt-8 flex justify-end">
                <span className="text-xs font-medium text-zinc-400 tracking-wide font-sans">
                   * 실제 분석한 플레이 이력은 <strong className="text-[#0047BB]">{allGamesCount}종 이상</strong>입니다.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
