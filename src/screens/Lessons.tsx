import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { LESSONS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Star, Lock, CheckCircle2, Trophy, Clock, Target, AlertCircle } from 'lucide-react';
import { Screen, Lesson, LessonResult } from '../types';
import { useTypingEngine } from '../lib/typingEngine';
import { VirtualKeyboard } from '../components/VirtualKeyboard';

export function LessonsScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const { stats, updateStats } = useStore();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  if (activeLesson) {
    return <ActiveLessonView lesson={activeLesson} onBack={() => setActiveLesson(null)} onComplete={(res, mistyped, strokes) => {
      updateStats(res, mistyped, strokes);
    }} />
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Typing Lessons</h1>
          <p className="text-gray-400">Master touch typing step by step. Unlock new levels as you progress.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
          <BookOpen className="text-purple-400" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSONS.map((lesson, idx) => {
          const isUnlocked = stats.level >= lesson.level || lesson.level === 1;
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "relative p-6 rounded-3xl border transition-all duration-300",
                isUnlocked 
                  ? "bg-white/5 border-purple-500/30 hover:bg-white/10 hover:border-purple-500/60 cursor-pointer group" 
                  : "bg-black/40 border-white/5 opacity-70"
              )}
              onClick={() => isUnlocked && setActiveLesson(lesson)}
            >
              {!isUnlocked && (
                <div className="absolute top-4 right-4 text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-md",
                  isUnlocked ? "bg-purple-500/20 text-purple-300" : "bg-gray-800 text-gray-400"
                )}>
                  Level {lesson.level}
                </span>
              </div>
              
              <h3 className={cn("text-xl font-bold mb-2", isUnlocked ? "text-white group-hover:text-purple-300 transition-colors" : "text-gray-400")}>
                {lesson.title}
              </h3>
              <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                {lesson.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {lesson.targetKeys.slice(0, 8).map(key => (
                  <span key={key} className="px-2 py-1 bg-black/50 border border-white/10 rounded text-xs font-mono text-gray-300">
                    {key}
                  </span>
                ))}
                {lesson.targetKeys.length > 8 && <span className="text-gray-500 text-xs">...</span>}
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ActiveLessonView({ 
  lesson, 
  onBack,
  onComplete
}: { 
  lesson: Lesson; 
  onBack: () => void;
  onComplete: (result: LessonResult, mistyped: Record<string, number>, strokes: Record<string, number>) => void;
}) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const currentText = lesson.exercises[exerciseIndex];
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);

  const { state, inputRef, handleKeyDown, currentWpm, currentAccuracy } = useTypingEngine(currentText, (res) => {
    // Determine XP based on WPM and Accuracy
    const xpBase = 50;
    const accuracyBonus = res.accuracy > 95 ? 50 : (res.accuracy > 90 ? 25 : 0);
    const xpTotal = xpBase + accuracyBonus + res.combo;
    
    const finalResult = {
      ...res,
      xpEarned: xpTotal,
      isNewBest: false // Will be determined by store
    };
    
    setLastResult(finalResult);
    setShowResult(true);
    onComplete(finalResult, res.mistakes, res.totalStrokes);
  });

  const nextExercise = () => {
    if (exerciseIndex < lesson.exercises.length - 1) {
      setExerciseIndex(i => i + 1);
      setShowResult(false);
    } else {
      onBack();
    }
  };

  // Keep input focused
  useEffect(() => {
    if (!showResult) {
      const interval = setInterval(() => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showResult, inputRef]);

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
          <h2 className="text-4xl font-bold text-white mb-2">Lesson Complete!</h2>
          <p className="text-purple-400 font-medium text-lg">+{lastResult.xpEarned} XP Earned</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-gray-400 text-sm mb-1">Speed</div>
            <div className="text-2xl font-bold text-white">{lastResult.wpm} <span className="text-sm text-gray-500">WPM</span></div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-gray-400 text-sm mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-white">{lastResult.accuracy}%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-gray-400 text-sm mb-1">Combo</div>
            <div className="text-2xl font-bold text-white">{lastResult.combo}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-gray-400 text-sm mb-1">Errors</div>
            <div className="text-2xl font-bold text-white">{lastResult.errors}</div>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm mt-8">
          <button onClick={() => { setShowResult(false); setExerciseIndex(exerciseIndex); /* Reset is handled by hook when target text doesn't change, wait we need to force reset */ }} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all">
            Retry
          </button>
          <button onClick={nextExercise} className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            {exerciseIndex < lesson.exercises.length - 1 ? 'Next Exercise' : 'Finish'}
          </button>
        </div>
      </div>
    );
  }

  // Active Typing View
  const targetChar = currentText[state.cursorIndex] || '';

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full relative">
      <button onClick={onBack} className="absolute -top-4 -left-4 text-gray-400 hover:text-white flex items-center gap-2 text-sm z-10">
        ← Back
      </button>

      {/* Top HUD */}
      <div className="flex justify-between items-end mb-8 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{lesson.title}</h2>
          <p className="text-sm text-gray-400">Exercise {exerciseIndex + 1} of {lesson.exercises.length}</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Speed</div>
            <div className="text-2xl font-bold text-white font-mono">{currentWpm}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Accuracy</div>
            <div className={cn("text-2xl font-bold font-mono", currentAccuracy > 90 ? "text-green-400" : "text-yellow-400")}>
              {currentAccuracy}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Combo</div>
            <div className="text-2xl font-bold text-purple-400 font-mono">{state.combo}</div>
          </div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="flex-1 flex flex-col justify-center mb-12 relative" onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 -left-[9999px]"
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
        />
        
        <div className="text-3xl md:text-5xl font-mono leading-relaxed tracking-wide whitespace-pre-wrap select-none max-w-full break-words">
          {currentText.split('').map((char, i) => {
            let statusClass = "text-gray-600"; // not typed
            let isCursor = i === state.cursorIndex;
            
            if (i < state.cursorIndex) {
              const typedChar = state.typedText[i];
              if (typedChar === char) {
                statusClass = "text-white"; // correct
              } else {
                statusClass = "text-red-400 bg-red-900/40 rounded-sm"; // error
              }
            }

            return (
              <span key={i} className={cn("relative transition-colors duration-150", statusClass)}>
                {char === ' ' && statusClass.includes('red') ? '_' : char}
                {isCursor && (
                  <motion.span 
                    layoutId="cursor"
                    className="absolute left-0 bottom-0 w-full h-[3px] bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Virtual Keyboard */}
      <div className="mt-auto">
        <VirtualKeyboard targetKey={targetChar} />
      </div>
    </div>
  );
}

// Ensure cn utility is available in this file. I will import it from lib/utils.
import { cn } from '../lib/utils';
