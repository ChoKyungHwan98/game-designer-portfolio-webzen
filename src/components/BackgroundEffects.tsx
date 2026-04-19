import React, { useMemo } from 'react';
import { motion } from 'motion/react';

const DUST_COUNT = 40;
const SYMBOL_COUNT = 15;

const SVGS = [
  // Cross (X)
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Plus (+)
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Square
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.5" rx="1.5" />
  </svg>,
  // Diamond
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l9 9-9 9-9-9 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>,
  // Node Connection
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="12" r="2.5" fill="currentColor" />
    <circle cx="18" cy="12" r="2.5" fill="currentColor" />
    <path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // Arrow
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Checkbox
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.5" rx="1.5" />
    <path d="M9 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
];

export const BackgroundEffects = React.memo(() => {
  // 먼지 파티클 생성
  const dustParticles = useMemo(() => {
    return Array.from({ length: DUST_COUNT }).map((_, i) => ({
      id: `dust-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1.5, // 1.5px ~ 3.5px
      opacity: Math.random() * 0.4 + 0.2, // 0.2 ~ 0.6 (더욱 선명하게)
      duration: Math.random() * 20 + 10, // 10s ~ 30s (조금 더 빠르게 움직임)
      delay: Math.random() * -40,
      xOffset: (Math.random() - 0.5) * 150,
      yOffset: (Math.random() - 0.5) * 150,
    }));
  }, []);

  // 스케치 기호 파티클 생성
  const sketchSymbols = useMemo(() => {
    return Array.from({ length: SYMBOL_COUNT }).map((_, i) => ({
      id: `symbol-${i}`,
      svg: SVGS[Math.floor(Math.random() * SVGS.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 24 + 16, // 16px ~ 40px (더 크게)
      rotate: Math.random() * 360,
      opacity: Math.random() * 0.25 + 0.15, // 0.15 ~ 0.4 (확실히 보이게)
      duration: Math.random() * 25 + 20, // 20s ~ 45s (속도 약간 증가)
      delay: Math.random() * -60,
      xOffset: (Math.random() - 0.5) * 200,
      yOffset: (Math.random() - 0.5) * 200,
      rotationDir: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.7 ? '#0047BB' : '#3f3f46', // 로열블루 또는 진한 아연색
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden print:hidden opacity-100 mix-blend-multiply">
      {/* 1. Dust Motes Layer */}
      {dustParticles.map((dust) => (
        <motion.div
          key={dust.id}
          className="absolute rounded-full bg-zinc-400"
          style={{
            left: dust.left,
            top: dust.top,
            width: dust.size,
            height: dust.size,
            opacity: dust.opacity,
          }}
          animate={{
            x: [0, dust.xOffset, 0],
            y: [0, dust.yOffset, 0],
            opacity: [dust.opacity, dust.opacity * 1.5, dust.opacity],
          }}
          transition={{
            duration: dust.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dust.delay,
          }}
        />
      ))}

      {/* 2. Sketch Symbols Layer */}
      {sketchSymbols.map((symbol) => (
        <motion.div
          key={symbol.id}
          className="absolute flex items-center justify-center"
          style={{
            left: symbol.left,
            top: symbol.top,
            width: symbol.size,
            height: symbol.size,
            opacity: symbol.opacity,
            color: symbol.color,
          }}
          animate={{
            x: [0, symbol.xOffset, 0],
            y: [0, symbol.yOffset, 0],
            rotate: [symbol.rotate, symbol.rotate + (180 * symbol.rotationDir)],
          }}
          transition={{
            duration: symbol.duration,
            repeat: Infinity,
            ease: "linear",
            delay: symbol.delay,
          }}
        >
          {symbol.svg}
        </motion.div>
      ))}
    </div>
  );
});
