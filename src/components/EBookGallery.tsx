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

      {/* Navigation Areas */}
      <div 
        className="absolute inset-y-0 left-0 w-1/3 z-30 cursor-pointer flex items-center justify-start px-4 md:px-8 group/navleft" 
        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: currentIndex === 0 ? 0 : 1, x: 0 }}
          className={`w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,71,187,0.2)] border border-black/5 flex items-center justify-center text-[#0047BB] transition-transform duration-300 ${currentIndex === 0 ? 'pointer-events-none' : 'group-hover/navleft:scale-110 group-hover/navleft:-translate-x-2'}`}
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 ml-[-2px]" />
        </motion.div>
      </div>

      <div 
        className="absolute inset-y-0 right-0 w-1/3 z-30 cursor-pointer flex items-center justify-end px-4 md:px-8 group/navright" 
        onClick={(e) => { e.stopPropagation(); paginate(1); }}
      >
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: currentIndex === images.length - 1 ? 0 : 1, x: 0 }}
          className={`w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#0047BB]/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,71,187,0.4)] border border-[#0047BB] flex items-center justify-center text-white transition-transform duration-300 ${currentIndex === images.length - 1 ? 'pointer-events-none' : 'group-hover/navright:scale-110 group-hover/navright:translate-x-2'}`}
        >
          {/* Animated bounce effect inside the right arrow to draw attention */}
          <motion.div
            animate={currentIndex !== images.length - 1 ? { x: [0, 5, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10 mr-[-2px]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="px-6 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/20 text-white text-xs font-black tracking-[0.3em] uppercase shadow-2xl flex items-center gap-2">
          <span>{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/30">/</span>
          <span className="text-white/70">{String(images.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
