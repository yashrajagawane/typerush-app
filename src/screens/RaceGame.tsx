import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Screen, LessonResult } from '../types';
import { useTypingEngine } from '../lib/typingEngine';
import { motion } from 'motion/react';
import { CarFront, Zap, Trophy, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const RACE_TEXT = "The neon lights reflect off the wet pavement as you accelerate into the night. Speed is everything here, but precision is what keeps you alive. Focus on the next turn and never look back.";

export function RaceGame({ navigate }: { navigate: (screen: Screen) => void }) {
  const { updateStats } = useStore();
  const [aiProgress, setAiProgress] = useState(0); // 0 to 1
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);

  const { state, inputRef, handleKeyDown, currentWpm, currentAccuracy } = useTypingEngine(RACE_TEXT, (res) => {
    const xpTotal = res.wpm * 2 + res.combo * 5;
    const finalResult = {
      ...res,
      xpEarned: xpTotal,
      isNewBest: false 
    };
    setLastResult(finalResult);
    setShowResult(true);
    updateStats(finalResult, res.mistakes, res.totalStrokes);
  });

  const playerProgress = Math.min(1, state.cursorIndex / RACE_TEXT.length);

  // AI progression
  useEffect(() => {
    if (state.status === 'running') {
      const currentAiSpeed = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 55 : 80;
      const interval = setInterval(() => {
        setAiProgress(prev => {
          // AI types at `currentAiSpeed` WPM => `currentAiSpeed * 5` chars per minute => `(currentAiSpeed * 5) / 60` chars per sec
          const charsPerSec = (currentAiSpeed * 5) / 60;
          const charsPerMs = charsPerSec / 1000;
          const newProg = prev + (charsPerMs * 100) / RACE_TEXT.length;
          return Math.min(1, newProg);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [state.status, difficulty]);

  // Keep input focused
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
    const isWin = playerProgress >= aiProgress;
    
    return (
      <div className="max-w-2xl mx-auto mt-20 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex gap-2 text-yellow-400">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className={cn("w-12 h-12", i < (isWin ? 3 : 1) ? "fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "opacity-30")} />
          ))}
        </div>
        
        <div>
          <h2 className={cn("text-5xl font-bold mb-2", isWin ? "text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" : "text-red-400")}>
            {isWin ? 'YOU WIN!' : 'SECOND PLACE'}
          </h2>
          <p className="text-purple-400 font-medium text-lg">+{lastResult.xpEarned} XP Earned</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-4">
            <div className="text-cyan-400/80 text-sm mb-1">Speed</div>
            <div className="text-3xl font-bold text-white">{lastResult.wpm}</div>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-4">
            <div className="text-cyan-400/80 text-sm mb-1">Accuracy</div>
            <div className="text-3xl font-bold text-white">{lastResult.accuracy}%</div>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-4">
            <div className="text-cyan-400/80 text-sm mb-1">Combo</div>
            <div className="text-3xl font-bold text-white">{lastResult.combo}</div>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-4">
            <div className="text-cyan-400/80 text-sm mb-1">Errors</div>
            <div className="text-3xl font-bold text-white">{lastResult.errors}</div>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm mt-8">
          <button onClick={() => {
            navigate('games');
          }} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all">
            Back
          </button>
          <button onClick={() => {
            setShowResult(false);
            setAiProgress(0);
            // Engine will reset automatically? We need a way to force engine reset.
            // For now, let's just go back to games screen to re-mount.
            navigate('dashboard');
            setTimeout(() => navigate('race-game'), 10);
          }} className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            Race Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full relative" onClick={() => inputRef.current?.focus()}>
      <div className="flex justify-between items-center absolute -top-4 -left-4 w-[calc(100%+2rem)] z-10 pr-4">
        <button onClick={() => navigate('games')} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400">Difficulty:</span>
          <div className="flex bg-black/50 border border-white/10 rounded-lg p-1">
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                onClick={(e) => {
                  e.stopPropagation();
                  setDifficulty(d);
                }}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all capitalize",
                  difficulty === d 
                    ? d === 'easy' ? "bg-green-500/20 text-green-400" : d === 'medium' ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Race Track Header */}
      <div className="mt-8 mb-12 bg-black/50 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
        
        {/* Opponent Track */}
        <div className="relative h-12 mb-4 border-b border-white/5 flex items-center">
          <div className="absolute left-0 w-full h-[2px] bg-red-500/20 border-b border-dashed border-red-500/50" />
          <motion.div 
            className="absolute z-10 text-red-500 flex flex-col items-center drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            animate={{ left: `calc(${aiProgress * 100}% - 24px)` }}
            transition={{ ease: "linear", duration: 0.1 }}
          >
            <span className="text-[10px] font-bold mb-1 opacity-80">AI Opponent</span>
            <CarFront className="w-8 h-8" />
          </motion.div>
        </div>

        {/* Player Track */}
        <div className="relative h-12 flex items-center">
           <div className="absolute left-0 w-full h-[2px] bg-cyan-500/20 border-b border-dashed border-cyan-500/50" />
          <motion.div 
            className="absolute z-20 text-cyan-400 flex flex-col items-center drop-shadow-[0_0_15px_rgba(34,211,238,1)]"
            animate={{ left: `calc(${playerProgress * 100}% - 24px)` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <CarFront className="w-10 h-10" />
            <span className="text-[10px] font-bold mt-1 opacity-80">YOU</span>
          </motion.div>
        </div>
        
        {/* Finish Line */}
        <div className="absolute right-6 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)] opacity-50" />
      </div>

      {/* HUD */}
      <div className="flex justify-between items-end mb-8">
        <div className="flex gap-6">
          <div className="text-left">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Speed
            </div>
            <div className="text-3xl font-bold text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{currentWpm}</div>
          </div>
          <div className="text-left">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-purple-400" /> Combo
            </div>
            <div className="text-3xl font-bold text-purple-400 font-mono drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">x{state.combo}</div>
          </div>
        </div>

        {state.combo > 10 && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black italic text-cyan-400 tracking-widest drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]"
          >
            ON FIRE! 🔥
          </motion.div>
        )}
      </div>

      {/* Typing Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glitch/Speed Lines Effect in BG */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)'}} />
             
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 -left-[9999px]"
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
        />
        
        <div className="text-2xl md:text-4xl font-mono leading-relaxed tracking-wide whitespace-pre-wrap select-none relative z-10">
          {RACE_TEXT.split('').map((char, i) => {
            let statusClass = "text-gray-600";
            let isCursor = i === state.cursorIndex;
            
            if (i < state.cursorIndex) {
              const typedChar = state.typedText[i];
              if (typedChar === char) {
                statusClass = "text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"; 
              } else {
                statusClass = "text-red-400 bg-red-900/40 rounded-sm"; 
              }
            }

            return (
              <span key={i} className={cn("relative transition-colors duration-75", statusClass)}>
                {char === ' ' && statusClass.includes('red') ? '_' : char}
                {isCursor && (
                  <motion.span 
                    layoutId="cursor-race"
                    className="absolute left-0 bottom-0 w-full h-[4px] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
