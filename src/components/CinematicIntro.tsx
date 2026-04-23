import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ALL_GAMES } from '../data/games';

interface CinematicIntroProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 4200;
const COLS = 4;
const CARD_HEIGHT = 72;
const CARD_GAP = 8;
const COL_SPEEDS = [3.6, 4.4, 3.0, 4.0]; // seconds per column

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const columns = useMemo(() => {
    const shuffled = [...ALL_GAMES].sort(() => Math.random() - 0.5);
    return Array.from({ length: COLS }, (_, i) =>
      shuffled.filter((_, idx) => idx % COLS === i)
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, TOTAL_DURATION);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[2000] bg-[#0A0A0A] overflow-hidden pointer-events-none"
    >
      {/* 게임 카드 컬럼들 */}
      <div className="absolute inset-0 flex gap-2 px-2">
        {columns.map((games, ci) => (
          <div key={ci} className="flex-1 overflow-hidden">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${CARD_GAP}px`,
                animation: `scrollUp ${COL_SPEEDS[ci]}s linear forwards`,
                willChange: 'transform',
                opacity: ci === 0 || ci === COLS - 1 ? 0.3 : 0.5,
                filter: ci === 0 || ci === COLS - 1 ? 'blur(2px)' : 'none',
              }}
            >
              {games.map((game, idx) => (
                <div
                  key={idx}
                  style={{ height: CARD_HEIGHT, flexShrink: 0 }}
                  className="rounded-lg overflow-hidden bg-zinc-900"
                >
                  {game.image ? (
                    <img
                      src={game.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center px-2">
                      <span className="text-white/20 text-[9px] font-black text-center leading-tight">
                        {game.title}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 상단/하단 페이드 */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* 중앙 Gaming DNA 텍스트 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      >
        <div className="h-px w-24 bg-blue-500 mb-4" />
        <h2 className="text-white font-display font-black text-4xl md:text-6xl tracking-[0.3em] uppercase drop-shadow-2xl">
          Gaming <span className="text-blue-500">DNA</span>
        </h2>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-zinc-500 font-mono text-xs tracking-widest uppercase">
            Analyzing History
          </span>
          <div className="w-12 h-0.5 bg-zinc-800 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-full h-full bg-blue-500"
            />
          </div>
          <span className="text-blue-500 font-mono text-xs font-bold">
            {ALL_GAMES.length}+
          </span>
        </div>
        <div className="h-px w-24 bg-blue-500 mt-4" />
      </motion.div>

      <style>{`
        @keyframes scrollUp {
          from { transform: translateY(100vh); }
          to   { transform: translateY(-100%); }
        }
      `}</style>
    </motion.div>
  );
};
