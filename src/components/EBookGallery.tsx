import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EBookGalleryProps {
  images: string[];
  onPageChange?: (index: number) => void;
  initialIndex?: number;
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

export const EBookGallery = ({ images, onPageChange, initialIndex = 0 }: EBookGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentIndex);
    }
  }, [currentIndex, onPageChange]);

  if (!images || images.length === 0) return null;

  const paginate = (newDirection: number) => {
    const next = currentIndex + newDirection;
    if (next >= 0 && next < images.length) {
      setDirection(newDirection);
      setCurrentIndex(next);
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div className="w-full h-full relative select-none bg-white touch-none">
      {/* Image viewer — fills all available space */}
      <div className="relative w-full h-full group/viewer flex items-center justify-center overflow-hidden">
        {/* Left arrow */}
        {images.length > 1 && (
          <button
            onClick={() => paginate(-1)}
            disabled={!hasPrev}
            className={`absolute left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all duration-300 ${
              hasPrev
                ? 'bg-white/90 backdrop-blur-md text-[#0047BB] border-black/5 hover:scale-110 cursor-pointer opacity-0 group-hover/viewer:opacity-100'
                : 'opacity-0 pointer-events-none border-transparent'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right arrow */}
        {images.length > 1 && (
          <button
            onClick={() => paginate(1)}
            disabled={!hasNext}
            className={`absolute right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              hasNext
                ? 'bg-[#0047BB] text-white border border-[#0047BB] hover:scale-110 cursor-pointer'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <motion.div
              animate={hasNext ? { x: [0, 4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.div>
          </button>
        )}

        {/* Image - draggable/swipeable */}
        <div className="h-full w-full flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.img
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                duration: 0.15, // Faster animation as requested
                ease: [0.25, 0.1, 0.25, 1.0] // Snappier ease
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold && hasNext) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold && hasPrev) {
                  paginate(-1);
                }
              }}
              src={images[currentIndex]}
              alt={`기획서 ${currentIndex + 1}페이지`}
              className="max-h-full max-w-full object-contain block cursor-grab active:cursor-grabbing"
              referrerPolicy="no-referrer"
              draggable={false}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
