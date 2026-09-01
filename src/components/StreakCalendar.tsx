import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Calendar as CalendarIcon, Star } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { useGlobalSound } from '../lib/audio';

export function StreakCalendar() {
  const { stats } = useStore();
  const playSound = useGlobalSound();
  const [isGlowing, setIsGlowing] = useState(false);
  
  const todayStr = new Date().toDateString();

  useEffect(() => {
    if (stats.lastDailyChallenge === todayStr) {
      const lastAnim = localStorage.getItem('typerush_last_streak_anim');
      if (lastAnim !== todayStr) {
        localStorage.setItem('typerush_last_streak_anim', todayStr);
        
        // Trigger celebration
        setTimeout(() => {
          playSound('success');
          setIsGlowing(true);
          
          const end = Date.now() + 2 * 1000;
          const colors = ['#f97316', '#eab308', '#ef4444']; // Orange, Yellow, Red

          (function frame() {
            confetti({
              particleCount: 4,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0.8 },
              colors: colors
            });
            confetti({
              particleCount: 4,
              angle: 120,
              spread: 55,
              origin: { x: 1, y: 0.8 },
              colors: colors
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            } else {
              setIsGlowing(false);
            }
          }());
        }, 500); // Slight delay after mounting
      }
    }
  }, [stats.lastDailyChallenge, todayStr, playSound]);

  // Generate the last 14 days
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  // Active days lookup
  const activeDaysSet = new Set(
    (stats.activeDays || []).map(ds => new Date(ds).toDateString())
  );

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <CalendarIcon className="text-orange-400 w-5 h-5" /> Activity Streak
          </h2>
          <p className="text-gray-400 text-sm">Practice daily to build your multiplier.</p>
        </div>
        
        <div className={cn(
          "flex items-center gap-4 bg-black/40 rounded-2xl px-4 py-2 border transition-all duration-300",
          isGlowing ? "border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] scale-105" : "border-white/5"
        )}>
          <div className="flex flex-col items-center">
             <span className="text-xs text-gray-500 font-bold uppercase">Multiplier</span>
             <span className="text-lg font-bold text-white flex items-center gap-1">
               <Star className={cn("w-4 h-4 text-yellow-400", isGlowing && "animate-spin")} />
               {Math.min(3, 1 + (stats.streak * 0.1)).toFixed(1)}x
             </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
             <span className="text-xs text-gray-500 font-bold uppercase">Current</span>
             <span className="text-lg font-bold text-orange-400 flex items-center gap-1">
               <Flame className={cn("w-4 h-4", isGlowing && "animate-pulse drop-shadow-[0_0_10px_rgba(249,115,22,1)]")} />
               {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 md:grid-cols-[repeat(14,minmax(0,1fr))] gap-2">
        {days.map((date, idx) => {
          const isToday = date.toDateString() === today.toDateString();
          const isActive = activeDaysSet.has(date.toDateString());
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-xs font-medium text-gray-500 uppercase">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div 
                className={cn(
                  "w-full aspect-square rounded-xl flex items-center justify-center transition-all border",
                  isActive 
                    ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]" 
                    : "bg-black/40 border-white/5",
                  isToday && !isActive && "border-white/20 border-dashed"
                )}
              >
                {isActive ? (
                  <Flame className="w-5 h-5 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
