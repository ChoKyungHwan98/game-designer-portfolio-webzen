import React, { useMemo } from 'react';
import { motion } from 'motion/react';

const DUST_COUNT = 50;
const PAPER_COUNT = 12;

const PAPER_STYLES = [
  // 모눈종이 (Grid Paper)
  'bg-white border border-black/10 bg-[size:4px_4px] bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]',
  // 줄무늬 노트 (Ruled Paper)
  'bg-white border border-black/10 bg-[size:100%_8px] bg-[linear-gradient(transparent_7px,rgba(0,71,187,0.1)_1px)]',
  // 빈 종이 조각 (Plain Paper)
  'bg-[#FDFCF8] border border-black/10 shadow-sm',
];

export const BackgroundEffects = React.memo(() => {
  // 먼지 파티클 생성
  const dustParticles = useMemo(() => {
    return Array.from({ length: DUST_COUNT }).map((_, i) => ({
      id: `dust-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1.5, // 1.5px ~ 3.5px
      opacity: Math.random() * 0.3 + 0.1, // 0.1 ~ 0.4
      duration: Math.random() * 25 + 15, // 15s ~ 40s
      delay: Math.random() * -40,
      xOffset: (Math.random() - 0.5) * 150,
      yOffset: (Math.random() - 0.5) * 150,
    }));
  }, []);

  // 흩날리는 기획서 조각 파티클 생성
  const paperFragments = useMemo(() => {
    return Array.from({ length: PAPER_COUNT }).map((_, i) => ({
      id: `paper-${i}`,
      styleClass: PAPER_STYLES[Math.floor(Math.random() * PAPER_STYLES.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: Math.random() * 40 + 30, // 30px ~ 70px (너비)
      height: Math.random() * 60 + 40, // 40px ~ 100px (높이)
      rotate: Math.random() * 360,
      opacity: Math.random() * 0.2 + 0.1, // 0.1 ~ 0.3 (은은하게 떠다님)
      duration: Math.random() * 40 + 30, // 30s ~ 70s 매우 느리게
      delay: Math.random() * -60,
      xOffset: (Math.random() - 0.5) * 200,
      yOffset: (Math.random() - 0.5) * 300,
      rotationDir: Math.random() > 0.5 ? 1 : -1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden print:hidden">
      {/* 1. Dust Motes Layer (mix-blend-multiply 적용하여 배경에 스며들게) */}
      <div className="absolute inset-0 mix-blend-multiply opacity-80">
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
      </div>

      {/* 2. Paper Fragments Layer */}
      <div className="absolute inset-0">
        {paperFragments.map((paper) => (
          <motion.div
            key={paper.id}
            className={`absolute rounded-sm ${paper.styleClass}`}
            style={{
              left: paper.left,
              top: paper.top,
              width: paper.width,
              height: paper.height,
              opacity: paper.opacity,
            }}
            animate={{
              x: [0, paper.xOffset, 0],
              y: [0, paper.yOffset, 0],
              rotate: [paper.rotate, paper.rotate + (90 * paper.rotationDir)],
            }}
            transition={{
              duration: paper.duration,
              repeat: Infinity,
              ease: "linear",
              delay: paper.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
});
