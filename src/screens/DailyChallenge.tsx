import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Screen, LessonResult } from '../types';
import { useTypingEngine } from '../lib/typingEngine';
import { DAILY_CHALLENGES } from '../data';
import { motion } from 'motion/react';
import { Zap, Calendar, Star, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export function DailyChallenge({ navigate }: { navigate: (screen: Screen) => void }) {
  const { updateStats } = useStore();
  
  // Use today's date to pick a challenge
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const challengeText = DAILY_CHALLENGES[dayIndex % DAILY_CHALLENGES.length];

  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);

  const { state, inputRef, handleKeyDown, currentWpm, currentAccuracy } = useTypingEngine(challengeText, (res) => {
    // Large XP bonus for daily challenge
    const xpTotal = res.wpm * 3 + res.accuracy * 2 + 200; 
    const finalResult = {
      ...res,
      xpEarned: xpTotal,
      isNewBest: false 
    };
    setLastResult(finalResult);
    setShowResult(true);
    updateStats(finalResult, res.mistakes, res.totalStrokes, true);
  });

  useEffect(() => {
    if (!showResult && state.status !== 'finished') {
      const interval = setInterval(() => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showResult, state.status, inputRef]);

  if (showResult && lastResult) {
    const stars = lastResult.accuracy >= 98 ? 3 : (lastResult.accuracy >= 90 ? 2 : 1);
    
    return (
      <div className="max-w-2xl mx-auto mt-20 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex gap-2 text-yellow-400">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className={cn("w-12 h-12", i < stars ? "fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "opacity-30")} />
          ))}
        </div>
        
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Challenge Complete!</h2>
          <p className="text-emerald-400 font-medium text-lg">+{lastResult.xpEarned} XP Earned</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-4">
            <div className="text-emerald-400/80 text-sm mb-1">Speed</div>
            <div className="text-2xl font-bold text-white">{lastResult.wpm} <span className="text-sm text-gray-500">WPM</span></div>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-4">
            <div className="text-emerald-400/80 text-sm mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-white">{lastResult.accuracy}%</div>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-4">
            <div className="text-emerald-400/80 text-sm mb-1">Combo</div>
            <div className="text-2xl font-bold text-white">{lastResult.combo}</div>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-4">
            <div className="text-emerald-400/80 text-sm mb-1">Errors</div>
            <div className="text-2xl font-bold text-white">{lastResult.errors}</div>
          </div>
        </div>

        <button onClick={() => navigate('dashboard')} className="w-full max-w-sm py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full relative" onClick={() => inputRef.current?.focus()}>
      <button onClick={() => navigate('dashboard')} className="absolute -top-4 -left-4 text-gray-400 hover:text-white flex items-center gap-2 text-sm z-10">
        ← Back
      </button>

      {/* Header */}
      <div className="mt-6 mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="text-emerald-400" /> Daily Challenge
          </h2>
          <p className="text-gray-400">Complete today's quote for a massive XP bonus.</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Speed</div>
            <div className="text-3xl font-bold text-white font-mono">{currentWpm}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Accuracy</div>
            <div className={cn("text-3xl font-bold font-mono", currentAccuracy > 90 ? "text-emerald-400" : "text-yellow-400")}>
              {currentAccuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="flex-1 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-12 shadow-2xl relative">
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 -left-[9999px]"
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
        />
        
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${(state.cursorIndex / challengeText.length) * 100}%` }}
          />
        </div>

        <div className="text-3xl md:text-5xl font-serif italic leading-relaxed tracking-wide whitespace-pre-wrap select-none text-center relative z-10 py-10">
          <span className="absolute -top-8 -left-4 text-8xl text-white/5 font-serif pointer-events-none">"</span>
          {challengeText.split('').map((char, i) => {
            let statusClass = "text-gray-600";
            let isCursor = i === state.cursorIndex;
            
            if (i < state.cursorIndex) {
              const typedChar = state.typedText[i];
              if (typedChar === char) {
                statusClass = "text-emerald-100 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]";
              } else {
                statusClass = "text-red-400 bg-red-900/40 rounded-sm"; 
              }
            }

            return (
              <span key={i} className={cn("relative transition-colors duration-150", statusClass)}>
                {char === ' ' && statusClass.includes('red') ? '_' : char}
                {isCursor && (
                  <motion.span 
                    layoutId="cursor-daily"
                    className="absolute left-0 bottom-0 w-full h-[3px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                )}
              </span>
            );
          })}
          <span className="absolute -bottom-16 -right-4 text-8xl text-white/5 font-serif pointer-events-none">"</span>
        </div>
      </div>
    </div>
  );
}
