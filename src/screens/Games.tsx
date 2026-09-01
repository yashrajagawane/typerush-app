import React from 'react';
import { Screen } from '../types';
import { motion } from 'motion/react';
import { CarFront, Skull, Trophy, Play, Code, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';

export function GamesScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  
  const games = [
    {
      id: 'race-game',
      title: 'Neon Race',
      description: 'Type fast to keep your vehicle ahead. Mistakes slow you down. Can you beat the AI?',
      icon: CarFront,
      color: 'from-blue-600 to-cyan-500',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]',
      border: 'border-cyan-500/30 group-hover:border-cyan-400',
      accent: 'text-cyan-400'
    },
    {
      id: 'zombie-game',
      title: 'Zombie Defense',
      description: 'Type words to shoot incoming zombies. Don\'t let them reach the barricade!',
      icon: Skull,
      color: 'from-red-600 to-orange-500',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_50px_rgba(239,68,68,0.5)]',
      border: 'border-red-500/30 group-hover:border-red-400',
      accent: 'text-red-400'
    },
    {
      id: 'matrix-game',
      title: 'Matrix Drop',
      description: 'Hack the mainframe. Type the falling access codes before they bypass your firewall.',
      icon: Code,
      color: 'from-green-600 to-emerald-500',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]',
      border: 'border-emerald-500/30 group-hover:border-emerald-400',
      accent: 'text-emerald-400'
    },
    {
      id: 'asteroid-game',
      title: 'Asteroid Defender',
      description: 'Protect your central core! Type the words on incoming asteroids to blast them before they crash.',
      icon: Rocket,
      color: 'from-yellow-600 to-amber-500',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_50px_rgba(245,158,11,0.5)]',
      border: 'border-amber-500/30 group-hover:border-amber-400',
      accent: 'text-amber-400'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Arcade Games</h1>
          <p className="text-gray-400">Put your skills to the test in these high-stakes typing games.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
          <Trophy className="text-purple-400" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        {games.map((game, idx) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "group relative flex flex-col justify-between p-8 rounded-3xl border bg-black/40 backdrop-blur-sm cursor-pointer transition-all duration-300 overflow-hidden",
              game.border,
              game.glow
            )}
            onClick={() => navigate(game.id as Screen)}
          >
            {/* Background elements */}
            <div className={cn("absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] bg-gradient-to-br opacity-20 group-hover:opacity-40 transition-opacity duration-500", game.color)} />
            
            <div className="relative z-10">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-xl", game.color)}>
                <game.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">{game.title}</h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                {game.description}
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110", game.accent)}>
                <Play fill="currentColor" />
              </div>
              <span className={cn("font-bold uppercase tracking-wider", game.accent)}>Play Now</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
