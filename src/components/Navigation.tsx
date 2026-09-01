import React, { useState } from 'react';
import { useStore } from '../store';
import { Screen } from '../types';
import { Home, BookOpen, Gamepad2, BarChart3, User, Volume2, VolumeX, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation({
  currentScreen,
  setCurrentScreen,
}: {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}) {
  const { profile, setProfile } = useStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const navItems: { id: Screen; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const toggleSound = () => {
    setProfile(p => ({ ...p, soundEnabled: !p.soundEnabled }));
  };

  // Mobile Bottom Nav
  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/5 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 text-xs transition-colors relative',
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute inset-0 bg-white/5 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 z-10 transition-colors", isActive ? "text-purple-400" : "")} />
              <span className="z-10 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Desktop Sidebar
  const DesktopNav = () => (
    <motion.div 
      initial={false}
      animate={{ width: isMinimized ? 80 : 256 }}
      className="hidden md:flex flex-col bg-[#111116] border-r border-white/5 p-4 h-full shrink-0 relative overflow-visible z-20"
    >
      {/* Subtle ambient glow behind nav */}
      <div className="absolute top-0 left-0 w-full h-64 bg-purple-500/5 blur-[80px] pointer-events-none overflow-hidden" />
      
      {/* Minimize Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -right-3 top-6 bg-[#1a1a24] border border-white/10 rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-white/10 z-50 shadow-lg"
      >
        {isMinimized ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>
      
      <div className={cn("flex items-center mb-10 mt-2 px-2 relative z-10", isMinimized ? "justify-center" : "space-x-3")}>
        <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <span className="text-white font-black text-lg">T</span>
        </div>
        <AnimatePresence mode="popLayout">
          {!isMinimized && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-bold tracking-wider text-white whitespace-nowrap"
            >
              TYPE<span className="text-purple-400">RUSH</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="space-y-3 flex-1 relative z-10 overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={cn(
                'flex items-center w-full py-3.5 rounded-xl transition-all relative group',
                isMinimized ? 'justify-center px-0' : 'px-4 space-x-4',
                isActive
                  ? 'text-white bg-purple-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
              title={isMinimized ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="desktop-nav-indicator"
                  className="absolute left-0 w-1.5 h-10 bg-purple-500 rounded-r-full shadow-[0_0_15px_rgba(168,85,247,1)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <item.icon
                className={cn('w-5 h-5 shrink-0 transition-colors z-10', isActive ? 'text-purple-400' : 'group-hover:text-purple-300')}
              />
              <AnimatePresence mode="popLayout">
                {!isMinimized && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-semibold z-10 tracking-wide text-sm whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto relative z-10 pt-6 border-t border-white/5 overflow-x-hidden">
        <button
          onClick={toggleSound}
          className={cn(
            "flex items-center w-full py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 group",
            isMinimized ? "justify-center px-0" : "px-4 space-x-4"
          )}
          title={isMinimized ? (profile.soundEnabled ? 'Sound On' : 'Sound Off') : undefined}
        >
          {profile.soundEnabled ? (
            <Volume2 className="w-5 h-5 shrink-0 group-hover:text-cyan-400 transition-colors" />
          ) : (
            <VolumeX className="w-5 h-5 shrink-0 group-hover:text-red-400 transition-colors" />
          )}
          <AnimatePresence mode="popLayout">
            {!isMinimized && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-semibold tracking-wide text-sm whitespace-nowrap overflow-hidden"
              >
                {profile.soundEnabled ? 'Sound On' : 'Sound Off'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
}
