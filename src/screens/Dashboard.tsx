import React from 'react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { getRank } from '../data';
import { motion } from 'motion/react';
import { Trophy, Zap, Target, Flame, Play, Keyboard } from 'lucide-react';
import { Screen } from '../types';
import { StreakCalendar } from '../components/StreakCalendar';
import { CssFireworks } from '../components/CssFireworks';

export function Dashboard({ navigate }: { navigate: (screen: Screen) => void }) {
  const { stats, profile } = useStore();
  const xpNeeded = stats.level * 1000;
  const progressPercent = (stats.xp / xpNeeded) * 100;

  const statCards = [
    { label: 'Avg WPM', value: stats.averageWpm, icon: Zap, color: 'text-yellow-400' },
    { label: 'Accuracy', value: `${stats.accuracy}%`, icon: Target, color: 'text-green-400' },
    { label: 'Best WPM', value: stats.bestWpm, icon: Trophy, color: 'text-purple-400' },
    { label: 'Streak', value: `${stats.streak} Days`, icon: Flame, color: 'text-orange-400' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 md:pb-0">
      <CssFireworks active={stats.lastDailyChallenge === new Date().toDateString()} />
      
      {/* Header Profile Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            {profile.avatar}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
            <div className="flex items-center gap-2 text-purple-300 font-medium tracking-wide">
              <span>Level {stats.level}</span>
              <span>•</span>
              <span>{getRank(stats.level)}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="flex justify-between text-sm mb-2 text-gray-400 font-medium">
            <span>XP Progress</span>
            <span>{stats.xp} / {xpNeeded} XP</span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              {stat.label}
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Streak Calendar */}
      <StreakCalendar />

      {/* Quick Actions */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Keyboard className="text-purple-400" /> Continue Learning
          </h2>
          <p className="text-gray-400 mb-6 text-sm">Pick up where you left off and master the home row.</p>
          <button 
            onClick={() => navigate('lessons')}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center justify-center gap-2"
          >
            <Play fill="currentColor" className="w-4 h-4" /> Start Lesson
          </button>
        </div>

        <div className={cn(
          "border rounded-3xl p-6 relative overflow-hidden group transition-all duration-500",
          stats.lastDailyChallenge === new Date().toDateString()
            ? "bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            : "bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/20"
        )}>
          {stats.lastDailyChallenge === new Date().toDateString() && (
            <div className="absolute inset-0 bg-emerald-400/10 animate-pulse pointer-events-none" />
          )}
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2 relative z-10">
            <Zap className={cn(stats.lastDailyChallenge === new Date().toDateString() ? "text-yellow-400" : "text-emerald-400")} /> 
            {stats.lastDailyChallenge === new Date().toDateString() ? 'Daily Challenge Complete! 🎉' : 'Daily Challenge'}
          </h2>
          <p className="text-gray-400 mb-6 text-sm relative z-10">
            {stats.lastDailyChallenge === new Date().toDateString()
              ? "You've earned your XP for today! Consistency is key. Come back tomorrow for a new challenge."
              : "Test your speed against today's special quote and earn bonus XP."}
          </p>
          <button 
            onClick={() => navigate('daily-challenge')}
            className={cn(
              "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 relative z-10",
              stats.lastDailyChallenge === new Date().toDateString()
                ? "bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
            )}
          >
            {stats.lastDailyChallenge === new Date().toDateString() ? 'Replay (Practice)' : 'Play Challenge'}
          </button>
        </div>
      </section>
      
    </div>
  );
}
