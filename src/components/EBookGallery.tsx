import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface EBookGalleryProps {
  images: string[];
}

export const EBookGallery = ({ images }: EBookGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!images || images.length === 0) return null;

  const paginate = (newDirection: number) => {
    if (currentIndex + newDirection >= 0 && currentIndex + newDirection < images.length) {
      setDirection(newDirection);
      setCurrentIndex(currentIndex + newDirection);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: direction > 0 ? 'left' : 'right',
    }),
    center: {
      zIndex: 1,
      rotateY: 0,
      opacity: 1,
      transformOrigin: 'center',
    },
    exit: (direction: number) => ({
      zIndex: 0,
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: direction < 0 ? 'left' : 'right',
    }),
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden group shadow-inner">
      <div className="absolute inset-0 flex items-center justify-center perspective-2000">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: "spring", stiffness: 150, damping: 20 },
              opacity: { duration: 0.3 }
            }}
            className="absolute w-full h-full p-4 flex items-center justify-center bg-white shadow-inner"
            onClick={() => paginate(1)}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border border-black/5 bg-zinc-50">
              <img
                src={images[currentIndex]}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                alt={`Gallery image ${currentIndex + 1}`}
              />
              {/* Paper texture overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Overlays (Invisible but clickable) */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-30 cursor-pointer" onClick={(e) => { e.stopPropagation(); paginate(-1); }}></div>
      <div className="absolute inset-y-0 right-0 w-1/4 z-30 cursor-pointer" onClick={(e) => { e.stopPropagation(); paginate(1); }}></div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); paginate(-1); }}
          disabled={currentIndex === 0}
          className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-[#0047BB] shadow-lg border border-black/5 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <div className="px-6 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/20 text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl">
          {currentIndex + 1} <span className="mx-2 text-white/30">/</span> {images.length}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); paginate(1); }}
          disabled={currentIndex === images.length - 1}
          className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-[#0047BB] shadow-lg border border-black/5 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Page Hint */}
      <div className="absolute top-8 right-8 z-40">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          <Maximize2 className="w-3 h-3" /> Click to turn
        </div>
      </div>
    </div>
  );
};
