import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Monitor, Smartphone, Gamepad2, Search } from 'lucide-react';
import { ALL_GAMES } from '../data/games';
import type { GameHistory } from '../types';

interface GameHistoryViewProps {
  onBack: () => void;
  // Included props to avoid breaking App.tsx injection
  history?: GameHistory;
  setHistory?: (h: GameHistory) => void;
  isEditing?: boolean;
}

export const GameHistoryView = ({ onBack }: GameHistoryViewProps) => {
  const [activeTab, setActiveTab] = useState<'PC' | 'Mobile' | 'Console'>('PC');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredGames = ALL_GAMES.filter(g => {
    const matchesTab = g.category === activeTab;
    const matchesSearch = searchQuery === '' || 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (g.company && g.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      g.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-[120px] px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 md:py-6 border-y border-black/5 mb-12 -mx-6 px-6 md:-mx-12 md:px-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-[190px] h-[46px] flex items-center justify-center gap-3 bg-zinc-100/80 hover:bg-white hover:shadow-md border border-black/5 rounded-full text-zinc-500 hover:text-[#0047BB] transition-all duration-300 group font-sans tracking-tight text-sm font-bold"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.div>
            <span>메인으로 돌아가기</span>
          </button>
          <div className="hidden sm:flex items-center gap-3 w-[110px]">
            <div className="w-px h-4 bg-black/10 shrink-0"></div>
            <span className="text-[11px] font-black tracking-widest text-zinc-300 uppercase truncate">Insights</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tighter text-[#2C2C2C] leading-tight">
             플레이 이력
          </h2>
          <p className="mt-4 text-zinc-400 text-sm font-medium max-w-xl">
            아래 리스트는 플레이한 게임의 일부이며, 실제 플레이 이력은 {ALL_GAMES.length}종 이상입니다.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white border border-black/5 p-4 rounded-2xl shadow-sm md:ml-auto">
          <div className="text-center px-4 border-r border-black/5">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Analzyed</span>
            <span className="text-2xl font-display font-bold text-[#0047BB]">{ALL_GAMES.length}</span>
          </div>
          <div className="text-center px-4 border-r border-black/5">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">PC/Console</span>
            <span className="text-2xl font-display font-bold text-[#2C2C2C]">
              {ALL_GAMES.filter(g => g.category === 'PC' || g.category === 'Console').length}
            </span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Mobile</span>
            <span className="text-2xl font-display font-bold text-[#2C2C2C]">
               {ALL_GAMES.filter(g => g.category === 'Mobile').length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-zinc-50 border border-black/5 rounded-3xl p-6 md:p-10 shadow-inner min-h-[600px]">
        
        <div className="flex flex-col xl:flex-row xl:items-center gap-6 mb-10 pb-6 border-b border-black/5 sticky top-[100px] z-20 bg-zinc-50/90 backdrop-blur-md pt-2">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {[{id: 'PC', label: 'PC / Mainline', icon: Monitor},
              {id: 'Console', label: 'Console / Others', icon: Gamepad2},
              {id: 'Mobile', label: 'Mobile', icon: Smartphone}].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as 'PC'|'Console'|'Mobile'); setSearchQuery(''); }}
                className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-bold text-[14px] tracking-tight transition-all duration-300 ${activeTab === tab.id ? 'bg-[#0047BB] text-white shadow-xl shadow-[#0047BB]/20 -translate-y-1' : 'bg-white text-zinc-500 border border-black/5 hover:border-black/10 hover:bg-zinc-100 hover:-translate-y-0.5'}`}>
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-zinc-400'}`} />
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-zinc-100 text-[#0047BB]'}`}>
                   {ALL_GAMES.filter(g => g.category === tab.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-md xl:ml-auto group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#0047BB] transition-colors" />
             <input 
               type="text" 
               placeholder="게임 제목, 장르, 개발사 검색..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white border border-black/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0047BB]/10 focus:border-[#0047BB]/30 transition-all placeholder:text-zinc-300 shadow-sm"
             />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" key={activeTab + searchQuery}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 content-start">
            {filteredGames.slice(0, 500).map((game, i) => (
              <motion.div 
                key={game.id + '-' + i} 
                variants={chipVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex flex-col group relative bg-white border border-black/5 px-5 py-4 rounded-2xl shadow-sm hover:shadow-xl hover:bg-[#0047BB]/[0.02] hover:border-[#0047BB]/20 transition-all duration-300 h-[100px] justify-between overflow-hidden"
              >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <span className="text-[9px] font-black text-[#0047BB]/60 uppercase tracking-widest block mb-1">{game.genre}</span>
                      <h4 className="font-bold text-[#2C2C2C] text-[15px] group-hover:text-[#0047BB] transition-colors line-clamp-1">{game.title}</h4>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      {game.company ? (
                        <span className="text-[10px] text-zinc-400 font-bold px-2 py-0.5 bg-zinc-50 rounded-md border border-black/5 group-hover:bg-white transition-colors truncate max-w-[120px]">
                          {game.company}
                        </span>
                      ) : <div />}
                      
                      <AnimatePresence>
                        {game.playTime && (
                          <motion.span 
                            initial={{ opacity: 0, x: 10 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            className="absolute right-0 bottom-0 text-[10px] font-mono text-[#0047BB] font-bold opacity-0 group-hover:opacity-100 transition-all bg-white pl-2"
                          >
                            {game.playTime}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Decorative background label for hover depth */}
                  <div className="absolute -bottom-2 -right-2 text-[40px] font-black text-black/[0.02] uppercase pointer-events-none group-hover:text-[#0047BB]/[0.03] transition-colors leading-none">
                    {game.category}
                  </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
             <Search className="w-12 h-12 mb-4 opacity-10" />
             <p className="text-sm font-medium">검색 결과가 없습니다.</p>
          </div>
        )}
        
      </div>
    </motion.section>
  );
};
