import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Screen } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, Heart, Shield, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

interface Zombie {
  id: string;
  word: string;
  typed: string;
  x: number;
  speed: number;
  lane: number;
}

interface GameState {
  zombies: Zombie[];
  health: number;
  score: number;
  wave: number;
  combo: number;
  gameOver: boolean;
}

const WORDS_POOL = [
  'attack', 'defend', 'survive', 'zombie', 'apocalypse', 'brain', 'flesh', 'undead', 
  'night', 'terror', 'horror', 'escape', 'run', 'hide', 'fight', 'weapon', 'gun', 
  'ammo', 'reload', 'headshot', 'danger', 'warning', 'scream', 'blood', 'infection',
  'virus', 'cure', 'bite', 'scratch', 'horde', 'swarm', 'panic', 'chaos', 'barricade',
  'shelter', 'safehouse', 'rescue', 'helicopter', 'evacuate', 'military', 'soldier'
];

export function ZombieGame({ navigate }: { navigate: (screen: Screen) => void }) {
  const { updateStats, profile } = useStore();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  const [gameState, setGameState] = useState<GameState>({
    zombies: [],
    health: 3,
    score: 0,
    wave: 1,
    combo: 0,
    gameOver: false,
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

      // Prevent massive jumps when tab is in background
      if (deltaTime > 100) return;

      setGameState(prev => {
        if (prev.gameOver) return prev;

        let nextZombies = prev.zombies.map(z => ({ 
          ...z, 
          x: z.x - (z.speed * (deltaTime / 16.66)) 
        }));
        
        let nextHealth = prev.health;
        let nextCombo = prev.combo;
        let nextGameOver = prev.gameOver;

        const breached = nextZombies.filter(z => z.x <= 0);
        if (breached.length > 0) {
          nextHealth = Math.max(0, nextHealth - breached.length);
          nextCombo = 0;
          playSound('error');
          if (nextHealth === 0) {
            nextGameOver = true;
          }
        }
        
        nextZombies = nextZombies.filter(z => z.x > 0);
        
        let nextWave = prev.wave;
        if (prev.score > nextWave * 500) {
          nextWave += 1;
          playSound('levelUp');
        }

        spawnTimer += deltaTime;
        const diffMultiplier = difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 1.0 : 1.5;
        const spawnRate = Math.max(800 / diffMultiplier, (2500 - (nextWave * 150)) / diffMultiplier);
        
        if (spawnTimer >= spawnRate) {
          spawnTimer = 0;
          if (nextZombies.length < 3 + nextWave) {
            const word = WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)];
            nextZombies.push({
              id: Math.random().toString(),
              word,
              typed: '',
              x: 100,
              speed: (0.15 + (nextWave * 0.05)) * diffMultiplier,
              lane: Math.floor(Math.random() * 5)
            });
          }
        }

        return {
          ...prev,
          zombies: nextZombies,
          health: nextHealth,
          wave: nextWave,
          combo: nextCombo,
          gameOver: nextGameOver
        };
      });
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [difficulty]);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (!gameState.gameOver && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [gameState.gameOver]);

  const [inputValue, setInputValue] = useState(' ');

  const processKey = (key: string, isBackspace: boolean = false) => {
    setGameState(prev => {
      if (prev.gameOver) return prev;

      if (isBackspace) {
        const targeted = prev.zombies.find(z => z.typed.length > 0);
        if (targeted && targeted.typed.length > 0) {
          return {
            ...prev,
            zombies: prev.zombies.map(z => 
              z.id === targeted.id ? { ...z, typed: z.typed.slice(0, -1) } : z
            )
          };
        }
        return prev;
      }

      if (key.length === 1) {
        const char = key.toLowerCase();
        const targetedIndex = prev.zombies.findIndex(z => z.typed.length > 0);
        
        let nextScore = prev.score;
        let nextCombo = prev.combo;
        let nextZombies = [...prev.zombies];

        if (targetedIndex >= 0) {
          const z = nextZombies[targetedIndex];
          const expectedChar = z.word[z.typed.length];
          
          if (char === expectedChar) {
            playSound('type');
            const newTyped = z.typed + char;
            
            if (newTyped === z.word) {
              playSound('success');
              nextScore += (z.word.length * 10) + (nextCombo * 5);
              nextCombo += 1;
              nextZombies.splice(targetedIndex, 1);
            } else {
              nextZombies[targetedIndex] = { ...z, typed: newTyped };
            }
          } else {
            playSound('error');
            nextCombo = 0;
          }
        } else {
          const validTargets = nextZombies
            .filter(z => z.word.startsWith(char))
            .sort((a, b) => a.x - b.x);
          
          if (validTargets.length > 0) {
            playSound('type');
            const targetId = validTargets[0].id;
            
            if (validTargets[0].word.length === 1) {
              playSound('success');
              nextScore += 10 + (nextCombo * 5);
              nextCombo += 1;
              nextZombies = nextZombies.filter(z => z.id !== targetId);
            } else {
              nextZombies = nextZombies.map(z => 
                z.id === targetId ? { ...z, typed: char } : z
              );
            }
          } else {
            playSound('error');
            nextCombo = 0;
          }
        }
        
        return {
          ...prev,
          zombies: nextZombies,
          score: nextScore,
          combo: nextCombo
        };
      }
      
      return prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      processKey('', true);
    } else if (e.key === ' ') {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === '') {
      processKey('', true);
    } else if (val.length > 1) {
      const addedChars = val.slice(1);
      for (const char of addedChars) {
        if (char !== ' ') {
          processKey(char);
        }
      }
    }
    
    e.target.value = ' ';
    setInputValue(' ');
  };

  const handleRestart = () => {
    updateStats({ wpm: 0, accuracy: 0, time: 0, xpEarned: Math.floor(gameState.score / 10) }, {}, {});
    setGameState({
      zombies: [],
      health: 3,
      score: 0,
      wave: 1,
      combo: 0,
      gameOver: false,
    });
  };

  return (
    <div 
      className="max-w-5xl mx-auto h-full flex flex-col pt-8 pb-20 md:pb-8 relative"
      onClick={focusInput}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 -z-50 pointer-events-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      
      <div className="flex justify-between items-center mb-8 px-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Zombie Defense</h1>
          <p className="text-gray-400">Type words to shoot. Don't let them reach you!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-400">Difficulty:</span>
            <div className="flex bg-black/50 border border-white/10 rounded-lg p-1">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDifficulty(d);
                    focusInput();
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
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (gameState.gameOver) updateStats({ wpm: 0, accuracy: 0, time: 0, xpEarned: Math.floor(gameState.score / 10) }, {}, {});
              navigate('games');
            }}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors font-medium border border-white/10"
          >
            Back to Games
          </button>
        </div>
      </div>

      <div className="flex-1 bg-black/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col">
        {/* Sky / Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/50 to-orange-900/20 -z-10" />
        
        {/* Moon */}
        <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-orange-200/90 blur-[2px] shadow-[0_0_50px_rgba(253,186,116,0.6)] -z-10" />

        {/* HUD */}
        <div className="flex justify-between items-start mb-8 z-10">
          <div className="flex gap-4">
            <div className="bg-red-950/50 border border-red-500/30 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <Heart className="text-red-500 w-6 h-6 fill-red-500" />
              <span className="text-2xl font-bold text-white">{gameState.health}</span>
            </div>
            
            <div className="bg-blue-950/50 border border-blue-500/30 px-6 py-3 rounded-2xl flex flex-col justify-center backdrop-blur-md">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Wave</span>
              <span className="text-2xl font-bold text-white leading-none">{gameState.wave}</span>
            </div>
          </div>

          <div className="flex gap-4">
            {gameState.combo > 1 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={gameState.combo}
                className="bg-amber-950/50 border border-amber-500/30 px-6 py-3 rounded-2xl flex items-center gap-2 backdrop-blur-md text-amber-400"
              >
                <Crosshair className="w-5 h-5" />
                <span className="text-xl font-bold">{gameState.combo}x</span>
              </motion.div>
            )}
            
            <div className="bg-slate-900/80 border border-slate-500/30 px-6 py-3 rounded-2xl flex flex-col items-end backdrop-blur-md min-w-[150px]">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Score</span>
              <span className="text-2xl font-bold text-white leading-none">{gameState.score}</span>
            </div>
          </div>
        </div>

        {/* Play Area */}
        <div className="flex-1 relative border-b-4 border-slate-800">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
          
          {/* Barricade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-800 border-r-4 border-slate-700 flex flex-col items-center justify-center gap-8">
            <Shield className={cn("w-10 h-10 transition-colors", gameState.health > 1 ? "text-slate-500" : "text-red-500")} />
            <Shield className={cn("w-10 h-10 transition-colors", gameState.health > 2 ? "text-slate-500" : "text-red-500")} />
          </div>

          <AnimatePresence>
            {gameState.zombies.map((z, idx) => {
              const isTargeted = z.typed.length > 0;
              return (
                <motion.div
                  key={z.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                  className="absolute"
                  style={{
                    left: `${z.x}%`,
                    top: `${10 + (z.lane * 15)}%`,
                  }}
                >
                  <div className={cn(
                    "flex flex-col items-center transition-transform",
                    isTargeted ? "scale-110" : ""
                  )}>
                    <div className="relative mb-2">
                      <Skull className={cn(
                        "w-12 h-12 transition-colors",
                        isTargeted ? "text-red-500" : "text-slate-400"
                      )} />
                      {isTargeted && (
                        <div className="absolute inset-0 bg-red-500/20 blur-md rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg border backdrop-blur-md shadow-xl text-lg font-mono tracking-wider transition-colors",
                      isTargeted ? "bg-red-950/80 border-red-500/50" : "bg-slate-900/80 border-slate-600/50"
                    )}>
                      <span className="text-red-400 font-bold">{z.typed}</span>
                      <span className="text-slate-200">{z.word.slice(z.typed.length)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-700 p-8 rounded-3xl text-center max-w-md w-full mx-4 shadow-2xl"
            >
              <Skull className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-2">Overrun!</h2>
              <p className="text-slate-400 mb-8 text-lg">The horde broke through your defenses.</p>
              
              <div className="bg-black/50 rounded-2xl p-6 mb-8 border border-white/5">
                <div className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Final Score</div>
                <div className="text-5xl font-black text-white mb-4">{gameState.score}</div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Waves Survived:</span>
                  <span className="text-white font-bold">{gameState.wave - 1}</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestart();
                }}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
