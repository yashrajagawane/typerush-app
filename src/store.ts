import React, { useState, useEffect } from 'react';
import { UserStats, UserProfile, Screen, LessonResult } from './types';
import { ACHIEVEMENTS } from './data';

const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  bestWpm: 0,
  averageWpm: 0,
  accuracy: 100,
  totalWords: 0,
  totalChars: 0,
  totalTime: 0,
  streak: 0,
  lastPlayed: null,
  activeDays: [],
  lastDailyChallenge: null,
  mistypedKeys: {},
  totalKeyStrokes: {},
  achievements: []
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Guest Player',
  avatar: '👤',
  keyboardTheme: 'default',
  soundEnabled: true,
};

let memoryStats = DEFAULT_STATS;
try {
  const saved = localStorage.getItem('typerush_stats');
  if (saved) memoryStats = { ...DEFAULT_STATS, ...JSON.parse(saved) };
} catch(e) {}

let memoryProfile = DEFAULT_PROFILE;
try {
  const saved = localStorage.getItem('typerush_profile');
  if (saved) memoryProfile = { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
} catch(e) {}

let currentScreen: Screen = 'dashboard';

const listeners = new Set<() => void>();
function notify() { listeners.forEach(l => l()); }

export function getProfile() {
  return memoryProfile;
}

export function useStore() {
  const [tick, setTick] = useState(0);
  
  useEffect(() => {
    const update = () => setTick(t => t + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const setProfile = (updater: React.SetStateAction<UserProfile>) => {
    memoryProfile = typeof updater === 'function' ? updater(memoryProfile) : updater;
    localStorage.setItem('typerush_profile', JSON.stringify(memoryProfile));
    notify();
  };

  const setCurrentScreen = (screen: Screen) => {
    currentScreen = screen;
    notify();
  };

  const updateStats = (result: LessonResult, mistyped: Record<string, number>, totalStrokes: Record<string, number>, isDailyChallenge?: boolean) => {
    const newStats = { ...memoryStats };
    
    // Update WPM
    if (result.wpm > newStats.bestWpm) {
      newStats.bestWpm = result.wpm;
    }
    
    const totalSessions = newStats.totalTime > 0 ? 2 : 1; 
    newStats.averageWpm = Math.round((newStats.averageWpm * (totalSessions - 1) + result.wpm) / totalSessions);
    
    // Update totals
    newStats.totalTime += result.time;
    newStats.totalChars += (result.wpm * 5 * (result.time / 60)); 
    newStats.totalWords += Math.round(result.wpm * (result.time / 60));
    
    // Update Accuracy
    const totalHistoricalChars = newStats.totalChars;
    const recentChars = result.wpm * 5 * (result.time / 60);
    newStats.accuracy = Math.round(((newStats.accuracy * (totalHistoricalChars - recentChars)) + (result.accuracy * recentChars)) / totalHistoricalChars) || result.accuracy;

    // Update XP & Level
    const streakMultiplier = Math.min(3, 1 + (memoryStats.streak * 0.1));
    const boostedXp = Math.round(result.xpEarned * streakMultiplier);
    newStats.xp += boostedXp;
    
    const xpNeeded = newStats.level * 1000;
    if (newStats.xp >= xpNeeded) {
      newStats.level += 1;
      newStats.xp -= xpNeeded;
    }

    // Update Streak
    const today = new Date().toDateString();
    
    if (isDailyChallenge) {
      newStats.lastDailyChallenge = today;
    }
    
    if (!newStats.activeDays) newStats.activeDays = [];
    if (!newStats.activeDays.includes(today)) {
      newStats.activeDays.push(today);
    }

    if (memoryStats.lastPlayed !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (memoryStats.lastPlayed === yesterday.toDateString()) {
        newStats.streak += 1;
      } else {
        newStats.streak = 1;
      }
      newStats.lastPlayed = today;
    }

    // Update Mistyped Keys
    Object.entries(mistyped).forEach(([key, count]) => {
      newStats.mistypedKeys[key] = (newStats.mistypedKeys[key] || 0) + count;
    });
    Object.entries(totalStrokes).forEach(([key, count]) => {
      newStats.totalKeyStrokes[key] = (newStats.totalKeyStrokes[key] || 0) + count;
    });

    // Check achievements
    ACHIEVEMENTS.forEach(ach => {
      if (!newStats.achievements.includes(ach.id) && ach.condition(newStats)) {
        newStats.achievements.push(ach.id);
      }
    });

    memoryStats = newStats;
    localStorage.setItem('typerush_stats', JSON.stringify(memoryStats));
    notify();
  };

  return {
    stats: memoryStats,
    profile: memoryProfile,
    setProfile,
    currentScreen,
    setCurrentScreen,
    updateStats
  };
}
