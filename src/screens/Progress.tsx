import React from 'react';
import { useStore } from '../store';
import { Screen } from '../types';
import { BarChart3, Clock, Keyboard, Target, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function ProgressScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const { stats } = useStore();

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  // Find most mistyped keys
  const getWorstKeys = () => {
    const errorRates = Object.keys(stats.mistypedKeys).map(key => {
      const errors = stats.mistypedKeys[key];
      const total = stats.totalKeyStrokes[key] || 1;
      return { key, errorRate: errors / total, errors, total };
    }).filter(k => k.total > 5) // Minimum threshold
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5);
      
    return errorRates;
  };

  const worstKeys = getWorstKeys();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Performance</h1>
          <p className="text-gray-400">Detailed statistics and analysis of your typing journey.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
          <BarChart3 className="text-purple-400" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Core Stats Overview */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
             <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" /> Global Accuracy
             </div>
             <div className="text-5xl font-bold text-white mb-4">{stats.accuracy}%</div>
             <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${stats.accuracy}%` }} />
             </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
             <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> Speed Profile
             </div>
             <div className="flex justify-between items-end mt-4">
               <div>
                 <div className="text-sm text-gray-500 mb-1">Average</div>
                 <div className="text-3xl font-bold text-white">{stats.averageWpm} <span className="text-sm font-normal text-gray-500">WPM</span></div>
               </div>
               <div className="text-right">
                 <div className="text-sm text-purple-400 mb-1">Best</div>
                 <div className="text-3xl font-bold text-purple-400">{stats.bestWpm} <span className="text-sm font-normal text-purple-400/50">WPM</span></div>
               </div>
             </div>
          </div>
        </div>

        {/* Lifetime Totals */}
        <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Lifetime Totals</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Keyboard className="w-5 h-5" /></div>
                <span className="text-gray-400">Total Keystrokes</span>
              </div>
              <div className="text-3xl font-bold text-white pl-12">{stats.totalChars.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><BookOpen className="w-5 h-5" /></div>
                <span className="text-gray-400">Words Typed</span>
              </div>
              <div className="text-3xl font-bold text-white pl-12">{stats.totalWords.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Clock className="w-5 h-5" /></div>
                <span className="text-gray-400">Practice Time</span>
              </div>
              <div className="text-3xl font-bold text-white pl-12">{formatTime(stats.totalTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weakness Analysis */}
      <div className="bg-red-900/10 border border-red-500/20 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="text-red-400" /> Focus Areas
        </h3>
        <p className="text-gray-400 text-sm mb-6">Keys with the highest error rates. Practice these specifically to improve your overall accuracy.</p>
        
        {worstKeys.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {worstKeys.map((item, i) => (
              <motion.div 
                key={item.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-black/40 border border-red-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 right-0 bg-red-500/20" style={{ height: `${item.errorRate * 100}%`}} />
                <div className="text-3xl font-mono font-bold text-white mb-2 relative z-10 uppercase">
                  {item.key === ' ' ? 'SPC' : item.key}
                </div>
                <div className="text-sm font-bold text-red-400 relative z-10">
                  {Math.round((1 - item.errorRate) * 100)}% Acc
                </div>
                <div className="text-xs text-gray-500 relative z-10">
                  {item.errors} errors
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Keep practicing! We need more data to analyze your weak points.
          </div>
        )}
      </div>
    </div>
  );
}

// Need BookOpen icon
import { BookOpen } from 'lucide-react';
