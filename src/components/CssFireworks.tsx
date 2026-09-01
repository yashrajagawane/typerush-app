import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function CssFireworks({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (!show) return null;

  // We generate multiple fireworks at different positions
  const fireworks = Array.from({ length: 3 });

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {show && fireworks.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 40}%`,
            }}
          >
            {/* Create CSS sparks */}
            {Array.from({ length: 12 }).map((_, sparkIdx) => {
              const angle = (sparkIdx * 30) * (Math.PI / 180);
              const tx = Math.cos(angle) * 100;
              const ty = Math.sin(angle) * 100;
              
              return (
                <motion.div
                  key={sparkIdx}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ 
                    x: tx, 
                    y: ty, 
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 1 + Math.random() * 0.5,
                    ease: "easeOut",
                    delay: i * 0.4
                  }}
                  className={cn(
                    "absolute w-2 h-2 rounded-full",
                    ['bg-emerald-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-purple-400'][Math.floor(Math.random() * 4)]
                  )}
                  style={{
                    boxShadow: '0 0 10px currentColor'
                  }}
                />
              );
            })}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
