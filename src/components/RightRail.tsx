import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface RightRailProps {
  view: string;
  onNavClick: (id: string) => void;
  activeSection: string;
}

export const RightRail = ({ view, onNavClick, activeSection }: RightRailProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsVisible(window.pageYOffset > 500); };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/90 backdrop-blur-md border border-black/10 rounded-xl flex items-center justify-center text-[#2C2C2C] hover:bg-zinc-50 hover:border-[#0047BB] transition-all shadow-md print:hidden"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
