import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Screen } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Crosshair, XOctagon } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

interface Node {
  id: string;
  word: string;
  typed: string;
  y: number;
  xPos: number;
  speed: number;
}

interface GameState {
  nodes: Node[];
  integrity: number;
  score: number;
  level: number;
  combo: number;
  gameOver: boolean;
}

const MATRIX_WORDS = [
  'system', 'hack', 'breach', 'firewall', 'bypass', 'encrypt', 'decrypt', 'node', 
  'server', 'proxy', 'terminal', 'command', 'execute', 'root', 'access', 'denied', 
  'granted', 'malware', 'virus', 'trojan', 'packet', 'network', 'uplink', 'downlink',
  'cyber', 'matrix', 'mainframe', 'override', 'security', 'protocol', 'database'
];

export function MatrixGame({ navigate }: { navigate: (screen: Screen) => void }) {
  const { updateStats, profile } = useStore();
  
  const [gameState, setGameState] = useState<GameState>({
    nodes: [],
    integrity: 100,
    score: 0,
    level: 1,
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

        let nextNodes = prev.nodes.map(n => ({ 
          ...n, 
          y: n.y + (n.speed * (deltaTime / 16.66)) 
        }));
        
        let nextIntegrity = prev.integrity;
        let nextCombo = prev.combo;
        let nextGameOver = prev.gameOver;

        const breached = nextNodes.filter(n => n.y >= 90);
        if (breached.length > 0) {
          nextIntegrity = Math.max(0, nextIntegrity - (breached.length * 10));
          nextCombo = 0;
          playSound('error');
          if (nextIntegrity === 0) {
            nextGameOver = true;
          }
        }
        
        nextNodes = nextNodes.filter(n => n.y < 90);
        
        let nextLevel = prev.level;
        if (prev.score > nextLevel * 600) {
          nextLevel += 1;
          playSound('levelUp');
        }

        spawnTimer += deltaTime;
        const spawnRate = Math.max(700, 2000 - (nextLevel * 100));
        
        if (spawnTimer >= spawnRate) {
          spawnTimer = 0;
          if (nextNodes.length < 4 + nextLevel) {
            const word = MATRIX_WORDS[Math.floor(Math.random() * MATRIX_WORDS.length)];
            nextNodes.push({
              id: Math.random().toString(),
              word,
              typed: '',
              y: -10,
              xPos: 10 + Math.random() * 80,
              speed: 0.2 + (nextLevel * 0.05)
            });
          }
        }

        return {
          ...prev,
          nodes: nextNodes,
          integrity: nextIntegrity,
          level: nextLevel,
          combo: nextCombo,
          gameOver: nextGameOver
        };
      });
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) return;
      if (e.key === ' ' || e.key === 'Backspace') e.preventDefault();

      setGameState(prev => {
        if (prev.gameOver) return prev;

        if (e.key === 'Backspace') {
          const targeted = prev.nodes.find(n => n.typed.length > 0);
          if (targeted && targeted.typed.length > 0) {
            return {
              ...prev,
              nodes: prev.nodes.map(n => 
                n.id === targeted.id ? { ...n, typed: n.typed.slice(0, -1) } : n
              )
            };
          }
          return prev;
        }

        if (e.key.length === 1) {
          const char = e.key.toLowerCase();
          const targetedIndex = prev.nodes.findIndex(n => n.typed.length > 0);
          
          let nextScore = prev.score;
          let nextCombo = prev.combo;
          let nextNodes = [...prev.nodes];

          if (targetedIndex >= 0) {
            const n = nextNodes[targetedIndex];
            const expectedChar = n.word[n.typed.length];
            
            if (char === expectedChar) {
              playSound('type');
              const newTyped = n.typed + char;
              
              if (newTyped === n.word) {
                playSound('success');
                nextScore += (n.word.length * 10) + (nextCombo * 5);
                nextCombo += 1;
                nextNodes.splice(targetedIndex, 1);
              } else {
                nextNodes[targetedIndex] = { ...n, typed: newTyped };
              }
            } else {
              playSound('error');
              nextCombo = 0;
            }
          } else {
            // Find lowest (highest y) matching node
            const validTargets = nextNodes
              .filter(n => n.word.startsWith(char))
              .sort((a, b) => b.y - a.y);
            
            if (validTargets.length > 0) {
              playSound('type');
              const targetId = validTargets[0].id;
              
              if (validTargets[0].word.length === 1) {
                playSound('success');
                nextScore += 10 + (nextCombo * 5);
                nextCombo += 1;
                nextNodes = nextNodes.filter(n => n.id !== targetId);
              } else {
                nextNodes = nextNodes.map(n => 
                  n.id === targetId ? { ...n, typed: char } : n
                );
              }
            } else {
              playSound('error');
              nextCombo = 0;
            }
          }
          
          return {
            ...prev,
            nodes: nextNodes,
            score: nextScore,
            combo: nextCombo
          };
        }
        
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRestart = () => {
    updateStats({ wpm: 0, accuracy: 0, time: 0, xpEarned: Math.floor(gameState.score / 10) }, {}, {});
    setGameState({
      nodes: [],
      integrity: 100,
      score: 0,
      level: 1,
      combo: 0,
      gameOver: false,
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col pt-8 pb-20 md:pb-8 relative font-mono">
      <div className="flex justify-between items-center mb-8 px-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] flex items-center gap-2">
            <Terminal className="w-8 h-8" /> Matrix Drop
          </h1>
          <p className="text-emerald-700 font-bold tracking-wide uppercase">Defend the Mainframe. Type access codes.</p>
        </div>
        <button 
          onClick={() => {
            if (gameState.gameOver) updateStats({ wpm: 0, accuracy: 0, time: 0, xpEarned: Math.floor(gameState.score / 10) }, {}, {});
            navigate('games');
          }}
          className="px-6 py-2 bg-emerald-950/30 hover:bg-emerald-900/50 rounded-xl transition-colors font-medium border border-emerald-500/30 text-emerald-400"
        >
          Abort Mission
        </button>
      </div>

      <div className="flex-1 bg-black/80 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),rgba(0,0,0,0))]" />
        
        {/* HUD */}
        <div className="flex justify-between items-start mb-8 z-10">
          <div className="flex gap-4">
            <div className="bg-emerald-950/50 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <Shield className="text-emerald-500 w-6 h-6" />
              <span className={cn("text-2xl font-bold", gameState.integrity <= 30 ? "text-red-500 animate-pulse" : "text-emerald-400")}>
                {gameState.integrity}%
              </span>
            </div>
            
            <div className="bg-emerald-950/50 border border-emerald-500/30 px-6 py-3 rounded-2xl flex flex-col justify-center backdrop-blur-md">
              <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Level</span>
              <span className="text-2xl font-bold text-emerald-400 leading-none">{gameState.level}</span>
            </div>
          </div>

          <div className="flex gap-4">
            {gameState.combo > 1 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={gameState.combo}
                className="bg-emerald-950/50 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-2 backdrop-blur-md text-emerald-400"
              >
                <Crosshair className="w-5 h-5" />
                <span className="text-xl font-bold">{gameState.combo}x</span>
              </motion.div>
            )}
            
            <div className="bg-emerald-950/50 border border-emerald-500/30 px-6 py-3 rounded-2xl flex flex-col items-end backdrop-blur-md min-w-[150px]">
              <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Score</span>
              <span className="text-2xl font-bold text-emerald-400 leading-none">{gameState.score}</span>
            </div>
          </div>
        </div>

        {/* Play Area */}
        <div className="flex-1 relative border-b-2 border-emerald-500/50 shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
          
          {/* Firewall Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-500/20 blur-sm pointer-events-none" />

          <AnimatePresence>
            {gameState.nodes.map((n, idx) => {
              const isTargeted = n.typed.length > 0;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                  className="absolute"
                  style={{
                    left: `${n.xPos}%`,
                    top: `${n.y}%`,
                  }}
                >
                  <div className={cn(
                    "flex flex-col items-center transition-transform",
                    isTargeted ? "scale-110" : ""
                  )}>
                    <div className={cn(
                      "px-3 py-1.5 rounded-none border-l-2 backdrop-blur-md text-lg tracking-widest transition-colors uppercase",
                      isTargeted ? "bg-emerald-900/80 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" : "bg-black/80 border-emerald-700/50 text-emerald-700"
                    )}>
                      <span className="text-emerald-300 font-bold drop-shadow-[0_0_5px_rgba(110,231,183,0.8)]">{n.typed}</span>
                      <span className={cn(isTargeted ? "text-emerald-600" : "text-emerald-800")}>{n.word.slice(n.typed.length)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black border border-emerald-500/50 p-8 rounded-none text-center max-w-md w-full mx-4 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <XOctagon className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-emerald-400 mb-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">System Failure</h2>
              <p className="text-emerald-700 mb-8 text-lg font-bold">Mainframe Integrity Compromised.</p>
              
              <div className="bg-emerald-950/30 rounded-none p-6 mb-8 border border-emerald-500/20">
                <div className="text-sm text-emerald-600 uppercase tracking-widest font-bold mb-1">Final Score</div>
                <div className="text-5xl font-black text-emerald-400 mb-4">{gameState.score}</div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700">Security Level Reached:</span>
                  <span className="text-emerald-400 font-bold">{gameState.level}</span>
                </div>
              </div>
              
              <button
                onClick={handleRestart}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black rounded-none font-black text-lg transition-colors uppercase tracking-widest"
              >
                Reboot System
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
