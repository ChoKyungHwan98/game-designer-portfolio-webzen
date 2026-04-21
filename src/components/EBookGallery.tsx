import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { ChevronLeft, ChevronRight, Search, Move, MousePointer2 } from 'lucide-react';

interface EBookGalleryProps {
  images: string[];
  currentIndex: number;
  onPageChange: (index: number) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '30%' : '-30%',
    opacity: 0,
    scale: 0.98,
  }),
  center: { 
    x: 0, 
    opacity: 1, 
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '30%' : '-30%',
    opacity: 0,
    scale: 0.98,
  }),
};

export const EBookGallery = ({ images, currentIndex, onPageChange }: EBookGalleryProps) => {
  const [direction, setDirection] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showHint, setShowHint] = useState(true);
  const [showSwipeTutorial, setShowSwipeTutorial] = useState(true);
  const tutorialControls = useAnimation();

  const containerRef = useRef<HTMLDivElement>(null);
  const lastIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (currentIndex !== lastIndexRef.current) {
      setDirection(currentIndex > lastIndexRef.current ? 1 : -1);
      lastIndexRef.current = currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeTutorial(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSwipeTutorial && currentIndex === 0) {
      tutorialControls.start({
        x: [0, -40, 40, 0],
        transition: { 
          repeat: 2, 
          duration: 1.5,
          ease: "easeInOut" 
        }
      });
    }
  }, [showSwipeTutorial, currentIndex, tutorialControls]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      setZoom(prev => Math.min(Math.max(1, prev + delta), 4));
      setShowHint(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  if (!images || images.length === 0) return null;

  const paginate = (newDirection: number) => {
    if (zoom > 1) setZoom(1);
    const next = currentIndex + newDirection;
    if (next >= 0 && next < images.length) {
      onPageChange(next);
      setShowSwipeTutorial(false);
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const getDragConstraints = () => {
    if (zoom <= 1) return { left: 0, right: 0, top: 0, bottom: 0 };
    const overflow = (zoom - 1) * 400;
    return { left: -overflow, right: overflow, top: -overflow, bottom: overflow };
  };

  return (
    <div ref={containerRef} className="w-full h-full relative select-none bg-white touch-none flex flex-col">
      {/* Zoom Indicator */}
      {zoom > 1 && (
        <div className="absolute top-6 right-6 z-40 bg-black/80 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold flex items-center gap-2 border border-white/10">
          <Search className="w-3.5 h-3.5" />
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(1)} className="ml-2 hover:text-[#0047BB] transition-colors uppercase text-[9px]">Reset</button>
        </div>
      )}

      {/* Hints & Tutorials (restored) */}
      <AnimatePresence>
        {showHint && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold flex items-center gap-3 border border-white/10 pointer-events-none"
          >
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[9px]">Ctrl</kbd>
              <span>+</span>
              <div className="w-4 h-4 rounded border border-white/40 flex items-center justify-center"><div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" /></div>
              <span>Mouse Wheel to Zoom</span>
            </div>
            <div className="w-px h-3 bg-white/20" /><div className="flex items-center gap-1.5"><Move className="w-3 h-3 text-[#0047BB]" /><span>Drag to Swipe</span></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwipeTutorial && currentIndex === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-black/5"
          >
            <motion.div animate={{ x: [-100, 100, -100] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl"><MousePointer2 className="w-8 h-8 text-white rotate-[-20deg]" /></div>
              <span className="text-white font-black text-sm tracking-widest uppercase drop-shadow-lg bg-black/40 px-4 py-1 rounded-full">Swipe to Navigate</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full h-full group/viewer flex items-center justify-center overflow-hidden">
        {images.length > 1 && zoom === 1 && (
          <button onClick={() => paginate(-1)} disabled={!hasPrev}
            className={`absolute left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all duration-300 ${hasPrev ? 'bg-white/90 backdrop-blur-md text-[#0047BB] border-black/5 hover:scale-110 cursor-pointer opacity-0 group-hover/viewer:opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {images.length > 1 && zoom === 1 && (
          <button onClick={() => paginate(1)} disabled={!hasNext}
            className={`absolute right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${hasNext ? 'bg-[#0047BB] text-white border border-[#0047BB] hover:scale-110 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <motion.div animate={hasNext ? { x: [0, 4, 0] } : {}} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}><ChevronRight className="w-6 h-6" /></motion.div>
          </button>
        )}

        <div className="h-full w-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="h-full w-full flex items-center justify-center"
            >
              <motion.img
                animate={{ scale: zoom }}
                drag={true}
                dragConstraints={getDragConstraints()}
                dragElastic={0.1}
                onDragEnd={(_, { offset, velocity }) => {
                  if (zoom === 1) {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold && hasNext) paginate(1);
                    else if (swipe > swipeConfidenceThreshold && hasPrev) paginate(-1);
                  }
                }}
                src={images[currentIndex]}
                alt={`기획서 ${currentIndex + 1}페이지`}
                className={`max-h-full max-w-full object-contain block ${zoom > 1 ? 'cursor-move' : 'cursor-grab active:cursor-grabbing'}`}
                referrerPolicy="no-referrer"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
