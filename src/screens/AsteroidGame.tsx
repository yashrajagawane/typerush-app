import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Screen } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Target, Rocket, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

interface Asteroid {
  id: string;
  word: string;
  typed: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
}

interface GameState {
  asteroids: Asteroid[];
  particles: Particle[];
  health: number;
  score: number;
  wave: number;
  combo: number;
  gameOver: boolean;
}

const WORDS_POOL = [
  'space', 'orbit', 'meteor', 'galaxy', 'planet', 'comet', 'star', 'nebula', 'cosmos', 
  'gravity', 'apollo', 'lunar', 'solar', 'eclipse', 'rocket', 'shuttle', 'station', 
  'astronaut', 'voyager', 'nova', 'pulsar', 'quasar', 'asteroid', 'defense', 'shield'
];

export function AsteroidGame({ navigate }: { navigate: (screen: Screen) => void }) {
  const { updateStats } = useStore();
  
  const [gameState, setGameState] = useState<GameState>({
    asteroids: [],
    particles: [],
    health: 3,
    score: 0,
    wave: 1,
    combo: 0,
    gameOver: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  
  // Stats tracking for end of game
  const statsRef = useRef({
    totalStrokes: {} as Record<string, number>,
    mistakes: {} as Record<string, number>,
    startTime: Date.now(),
    errors: 0,
    wordsCompleted: 0
  });

  useEffect(() => {
    playSound('start');
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let spawnTimer = 0;
    
    const tick = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      animationFrameId = requestAnimationFrame(tick);

      if (deltaTime > 100) return;

      setGameState(prev => {
        if (prev.gameOver) return prev;

        let nextAsteroids = prev.asteroids.map(a => ({
          ...a,
          x: a.x + a.vx * (deltaTime / 16.66),
          y: a.y + a.vy * (deltaTime / 16.66)
        }));
        
        let nextHealth = prev.health;
        let nextCombo = prev.combo;
        let nextGameOver = prev.gameOver;
        let nextWave = prev.wave;
        let particles = [...prev.particles];

        // Collision logic (distance from center 50,50)
        // Let's say center is 50,50. Distance squared.
        // We consider it hit if distance < 5 (roughly 5% of screen width)
        const hitRadiusSq = 5 * 5;
        
        const crashed = nextAsteroids.filter(a => {
          const dx = 50 - a.x;
          const dy = 50 - a.y;
          return (dx * dx + dy * dy) < hitRadiusSq;
        });

        if (crashed.length > 0) {
          nextHealth = Math.max(0, nextHealth - crashed.length);
          nextCombo = 0;
          playSound('error');
          if (nextHealth === 0) {
            nextGameOver = true;
          }
        }
        
        // Remove crashed asteroids
        if (crashed.length > 0) {
           nextAsteroids = nextAsteroids.filter(a => {
             const dx = 50 - a.x;
             const dy = 50 - a.y;
             return (dx * dx + dy * dy) >= hitRadiusSq;
           });
        }
        
        if (prev.score > nextWave * 500) {
          nextWave += 1;
          playSound('levelUp');
        }

        spawnTimer += deltaTime;
        const spawnRate = Math.max(800, 2500 - (nextWave * 150));
        
        if (spawnTimer >= spawnRate) {
          spawnTimer = 0;
          if (nextAsteroids.length < 3 + nextWave) {
            const word = WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)];
            
            // Random edge (0: top, 1: right, 2: bottom, 3: left)
            const edge = Math.floor(Math.random() * 4);
            let startX = 50;
            let startY = 50;
            
            if (edge === 0) { startX = Math.random() * 100; startY = -10; }
            else if (edge === 1) { startX = 110; startY = Math.random() * 100; }
            else if (edge === 2) { startX = Math.random() * 100; startY = 110; }
            else { startX = -10; startY = Math.random() * 100; }
            
            const dx = 50 - startX;
            const dy = 50 - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Speed increases with wave
            const speed = 0.05 + (nextWave * 0.015);
            
            nextAsteroids.push({
              id: Math.random().toString(),
              word,
              typed: '',
              x: startX,
              y: startY,
              vx: (dx / dist) * speed,
              vy: (dy / dist) * speed
            });
          }
        }

        // Clean up old particles simply by letting a separate timeout handle it or just clear them all every N frames
        // Actually, let's not use complex particles in this state. Just relying on the DOM structure.
        if (Math.random() < 0.05) particles = []; // simple clear

        return {
          ...prev,
          asteroids: nextAsteroids,
          health: nextHealth,
          wave: nextWave,
          combo: nextCombo,
          gameOver: nextGameOver,
          particles
        };
      });
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState.gameOver) return;
    
    const key = e.key.toLowerCase();
    if (key.length !== 1 || !/[a-z]/.test(key)) return;

    statsRef.current.totalStrokes[key] = (statsRef.current.totalStrokes[key] || 0) + 1;

    setGameState(prev => {
      // Find active asteroid (one that has been partially typed)
      const activeAsteroid = prev.asteroids.find(a => a.typed.length > 0);
      
      let targetAsteroid = activeAsteroid;
      
      // If none active, find one starting with the key
      if (!targetAsteroid) {
        targetAsteroid = prev.asteroids.find(a => a.word.startsWith(key));
      }

      if (targetAsteroid) {
        const expectedChar = targetAsteroid.word[targetAsteroid.typed.length];
        
        if (key === expectedChar) {
          playSound('type');
          const newTyped = targetAsteroid.typed + key;
          
          if (newTyped === targetAsteroid.word) {
            // Destroyed!
            playSound('word');
            statsRef.current.wordsCompleted += 1;
            
            return {
              ...prev,
              asteroids: prev.asteroids.filter(a => a.id !== targetAsteroid!.id),
              score: prev.score + (10 * (prev.combo + 1)),
              combo: prev.combo + 1,
              particles: [...prev.particles, { id: Math.random().toString(), x: targetAsteroid.x, y: targetAsteroid.y }]
            };
          } else {
            // Partially typed
            return {
              ...prev,
              asteroids: prev.asteroids.map(a => 
                a.id === targetAsteroid!.id ? { ...a, typed: newTyped } : a
              )
            };
          }
        } else {
          // Wrong key
          playSound('error');
          statsRef.current.mistakes[expectedChar] = (statsRef.current.mistakes[expectedChar] || 0) + 1;
          statsRef.current.errors += 1;
          return {
            ...prev,
            combo: 0
          };
        }
      } else {
        // No matching asteroid
        playSound('error');
        statsRef.current.errors += 1;
        return {
          ...prev,
          combo: 0
        };
      }
    });
  };

  useEffect(() => {
    if (gameState.gameOver) {
      const durationMin = (Date.now() - statsRef.current.startTime) / 60000;
      const wpm = Math.round((statsRef.current.wordsCompleted) / durationMin) || 0;
      
      const totalKeys = Object.values(statsRef.current.totalStrokes).reduce((a, b) => a + b, 0);
      const accuracy = totalKeys > 0 ? Math.round(((totalKeys - statsRef.current.errors) / totalKeys) * 100) : 0;

      updateStats({
        wpm,
        accuracy,
        errors: statsRef.current.errors,
        time: durationMin * 60,
        xpEarned: Math.floor(gameState.score / 2),
        combo: gameState.combo,
        isNewBest: false
      }, statsRef.current.mistakes, statsRef.current.totalStrokes);
    }
  }, [gameState.gameOver]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full relative" onClick={() => inputRef.current?.focus()}>
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button onClick={() => navigate('games')} className="text-gray-400 hover:text-white transition-colors">
          ← Back to Games
        </button>
        
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <Target className="text-amber-400 w-5 h-5" />
            <span className="text-xl font-bold text-white font-mono">{gameState.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400 w-5 h-5" />
            <span className="text-xl font-bold text-white font-mono">x{gameState.combo}</span>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={cn("w-6 h-6 transition-all", i < gameState.health ? "text-red-500 fill-red-500" : "text-gray-700")} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black/80 rounded-3xl border border-white/10 relative overflow-hidden shadow-[inset_0_0_100px_rgba(245,158,11,0.05)]">
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 -left-[9999px]"
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
        />

        {/* Central Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className={cn(
              "absolute inset-0 bg-amber-500 rounded-full blur-xl transition-opacity duration-300",
              gameState.health === 3 ? "opacity-30" : gameState.health === 2 ? "opacity-10" : "opacity-0"
            )} />
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center relative z-10 border-2 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-colors duration-300",
              gameState.health === 3 ? "bg-amber-900 border-amber-400" : 
              gameState.health === 2 ? "bg-orange-900 border-orange-500" : 
              gameState.health === 1 ? "bg-red-900 border-red-500 animate-pulse" : 
              "bg-gray-900 border-gray-700"
            )}>
              <Rocket className={cn("w-8 h-8", gameState.health > 0 ? "text-amber-400" : "text-gray-600")} />
            </div>
          </div>
        </div>

        {/* Asteroids */}
        <AnimatePresence>
          {gameState.asteroids.map(asteroid => {
            const isActive = asteroid.typed.length > 0;
            return (
              <motion.div
                key={asteroid.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, left: `${asteroid.x}%`, top: `${asteroid.y}%` }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.1 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className={cn(
                  "px-4 py-2 rounded-xl border backdrop-blur-md whitespace-nowrap text-lg font-mono font-bold transition-colors shadow-lg",
                  isActive 
                    ? "bg-amber-900/80 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-110" 
                    : "bg-gray-900/80 border-gray-600 text-gray-300"
                )}>
                  <span className="text-amber-400">{asteroid.typed}</span>
                  <span>{asteroid.word.slice(asteroid.typed.length)}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Explosions */}
        {gameState.particles.map(p => (
          <div 
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-xl animate-ping pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}

        {/* Game Over Screen */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#111116] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center"
            >
              <h2 className="text-4xl font-bold text-red-500 mb-2">CORE BREACH</h2>
              <p className="text-gray-400 mb-6">Wave {gameState.wave} Reached</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                  <span className="text-gray-400">Final Score</span>
                  <span className="text-2xl font-bold text-white font-mono">{gameState.score}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                  <span className="text-gray-400">Words Typed</span>
                  <span className="text-2xl font-bold text-amber-400 font-mono">{statsRef.current.wordsCompleted}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setGameState({
                      asteroids: [],
                      particles: [],
                      health: 3,
                      score: 0,
                      wave: 1,
                      combo: 0,
                      gameOver: false,
                    });
                    statsRef.current = {
                      totalStrokes: {},
                      mistakes: {},
                      startTime: Date.now(),
                      errors: 0,
                      wordsCompleted: 0
                    };
                    inputRef.current?.focus();
                  }}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
