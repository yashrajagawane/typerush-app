import React, { useState } from 'react';
import { useStore } from '../store';
import { Screen, UserProfile } from '../types';
import { ACHIEVEMENTS, getRank } from '../data';
import { User, Edit2, Check, Award, Trophy, Star, Keyboard, Volume2, VolumeX, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const AVATARS = ['👤', '🚀', '👽', '🤖', '👻', '👾', '🦊', '🐱', '🦄', '⚡', '🔥', '💎'];

const THEMES = [
  { id: 'default', name: 'Rainbow Default', color: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' },
  { id: 'neon-blue', name: 'Neon Blue', color: 'bg-cyan-500' },
  { id: 'crimson-red', name: 'Crimson Red', color: 'bg-rose-500' },
  { id: 'cyber-gold', name: 'Cyber Gold', color: 'bg-amber-500' },
];

export function ProfileScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const { profile, setProfile, stats } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);

  const saveProfile = () => {
    setProfile(p => ({ ...p, name: editName }));
    setIsEditing(false);
  };

  const setTheme = (theme: UserProfile['keyboardTheme']) => {
    setProfile(p => ({ ...p, keyboardTheme: theme }));
  };
  
  const toggleSound = () => {
    setProfile(p => ({ ...p, soundEnabled: !p.soundEnabled }));
  };

  const currentRank = getRank(stats.level);
  const nextRankLevel = stats.level < 5 ? 5 : (stats.level < 10 ? 10 : (stats.level < 20 ? 20 : (stats.level < 30 ? 30 : 50)));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 md:pb-0">
      
      {/* Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Selector */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
              {profile.avatar}
            </div>
            
            {/* Simple avatar picker dropdown on hover */}
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 rounded-2xl p-4 grid-cols-4 gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20 hidden md:grid shadow-2xl w-64">
              {AVATARS.map(a => (
                <button 
                  key={a} 
                  onClick={() => setProfile(p => ({ ...p, avatar: a }))}
                  className={cn("w-12 h-12 flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 transition-colors", profile.avatar === a && "bg-purple-500/30 border border-purple-500/50")}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-black/50 border border-purple-500/50 rounded-xl px-4 py-2 text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 w-64"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveProfile()}
                  />
                  <button onClick={saveProfile} className="p-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30">
                    <Check className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-white">{profile.name}</h1>
                  <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-purple-400 transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold tracking-wide mt-2">
              <Star className="w-4 h-4" /> {currentRank}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Settings & Personalization */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Palette className="text-purple-400" /> Customization
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3 block flex items-center gap-2">
                <Keyboard className="w-4 h-4" /> Keyboard Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      profile.keyboardTheme === t.id 
                        ? "bg-white/10 border-white/30 text-white" 
                        : "bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded-full", t.color)} />
                    <span className="text-sm font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3 block">
                Audio Settings
              </label>
              <button
                onClick={toggleSound}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all w-full",
                  profile.soundEnabled 
                    ? "bg-purple-900/20 border-purple-500/30 text-purple-300" 
                    : "bg-black/30 border-white/5 text-gray-400 hover:bg-white/5"
                )}
              >
                {profile.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="font-medium">{profile.soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Disabled'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Level & XP */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-10 translate-x-1/4 -translate-y-1/4" />
          <h2 className="text-xl font-bold text-white mb-6 text-center">Rank Progression</h2>
          
          <div className="flex justify-between w-full max-w-sm mb-2 px-1">
            <span className="font-bold text-purple-400">Level {stats.level}</span>
            <span className="font-bold text-gray-500">Level {nextRankLevel}</span>
          </div>
          
          <div className="w-full max-w-sm h-4 bg-black/50 rounded-full overflow-hidden border border-white/5 mb-4 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(stats.level / nextRankLevel) * 100}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 relative"
            >
               <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent" />
            </motion.div>
          </div>
          <p className="text-gray-400 text-sm text-center">
            {stats.level < 50 ? `Keep practicing to reach ${getRank(nextRankLevel)}!` : "You have reached the maximum rank!"}
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="text-purple-400" /> Achievements
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = stats.achievements.includes(ach.id);
            return (
              <div 
                key={ach.id}
                className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden",
                  isUnlocked 
                    ? "bg-gradient-to-br from-yellow-900/30 to-amber-900/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                    : "bg-black/40 border-white/5 opacity-50 grayscale"
                )}
              >
                {isUnlocked && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
                )}
                
                <div className="text-4xl mb-3 drop-shadow-md relative z-10">{ach.icon}</div>
                <h3 className={cn("font-bold mb-1 relative z-10", isUnlocked ? "text-yellow-400" : "text-gray-400")}>
                  {ach.title}
                </h3>
                <p className="text-xs text-gray-500 relative z-10">{ach.description}</p>
                
                {isUnlocked && (
                  <div className="absolute top-2 right-2 text-yellow-500">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
