import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useStore } from '../store';

interface VirtualKeyboardProps {
  targetKey: string;
  pressedKey?: string; // Optional real-time pressed key
}

const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

const FINGER_ZONES: Record<string, string> = {
  // Left Pinky
  '`': 'pinky-l', '1': 'pinky-l', 'q': 'pinky-l', 'a': 'pinky-l', 'z': 'pinky-l', 'Shift': 'pinky-l', 'Caps': 'pinky-l', 'Tab': 'pinky-l',
  // Left Ring
  '2': 'ring-l', 'w': 'ring-l', 's': 'ring-l', 'x': 'ring-l',
  // Left Middle
  '3': 'middle-l', 'e': 'middle-l', 'd': 'middle-l', 'c': 'middle-l',
  // Left Index
  '4': 'index-l', '5': 'index-l', 'r': 'index-l', 't': 'index-l', 'f': 'index-l', 'g': 'index-l', 'v': 'index-l', 'b': 'index-l',
  // Thumbs
  'Space': 'thumb',
  // Right Index
  '6': 'index-r', '7': 'index-r', 'y': 'index-r', 'u': 'index-r', 'h': 'index-r', 'j': 'index-r', 'n': 'index-r', 'm': 'index-r',
  // Right Middle
  '8': 'middle-r', 'i': 'middle-r', 'k': 'middle-r', ',': 'middle-r',
  // Right Ring
  '9': 'ring-r', 'o': 'ring-r', 'l': 'ring-r', '.': 'ring-r',
  // Right Pinky
  '0': 'pinky-r', '-': 'pinky-r', '=': 'pinky-r', 'p': 'pinky-r', '[': 'pinky-r', ']': 'pinky-r', '\\': 'pinky-r', ';': 'pinky-r', "'": 'pinky-r', '/': 'pinky-r', 'Enter': 'pinky-r', 'Backspace': 'pinky-r',
};

const ZONE_COLORS = {
  'pinky-l': 'bg-pink-500/20 border-pink-500/40 text-pink-200',
  'ring-l': 'bg-rose-500/20 border-rose-500/40 text-rose-200',
  'middle-l': 'bg-orange-500/20 border-orange-500/40 text-orange-200',
  'index-l': 'bg-yellow-500/20 border-yellow-500/40 text-yellow-200',
  'thumb': 'bg-purple-500/20 border-purple-500/40 text-purple-200',
  'index-r': 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200',
  'middle-r': 'bg-blue-500/20 border-blue-500/40 text-blue-200',
  'ring-r': 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200',
  'pinky-r': 'bg-violet-500/20 border-violet-500/40 text-violet-200',
};

export function VirtualKeyboard({ targetKey, pressedKey }: VirtualKeyboardProps) {
  const { profile } = useStore();
  const theme = profile.keyboardTheme || 'default';
  
  const normalizedTarget = targetKey === ' ' ? 'Space' : targetKey.toLowerCase();
  
  // To handle uppercase requirements
  const needsShift = targetKey.length === 1 && targetKey >= 'A' && targetKey <= 'Z' && targetKey !== 'Space';

  const getZoneColor = (zone: string) => {
    if (theme === 'neon-blue') return 'bg-cyan-900/40 border-cyan-500/30 text-cyan-100';
    if (theme === 'crimson-red') return 'bg-rose-900/40 border-rose-500/30 text-rose-100';
    if (theme === 'cyber-gold') return 'bg-amber-900/40 border-amber-500/30 text-amber-100';
    return ZONE_COLORS[zone as keyof typeof ZONE_COLORS];
  };

  const getTargetGlow = () => {
    if (theme === 'neon-blue') return 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] bg-cyan-500/40 border-cyan-400';
    if (theme === 'crimson-red') return 'ring-2 ring-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.6)] bg-rose-500/40 border-rose-400';
    if (theme === 'cyber-gold') return 'ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] bg-amber-500/40 border-amber-400';
    return 'ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.6)] bg-white/20';
  };

  return (
    <div className="flex flex-col gap-1.5 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl max-w-4xl mx-auto shadow-2xl">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center">
          {row.map((key, keyIndex) => {
            const isTarget = key.toLowerCase() === normalizedTarget || (needsShift && key === 'Shift');
            const zone = FINGER_ZONES[key] || 'pinky-r';
            const colorClasses = getZoneColor(zone);
            
            let widthClass = 'w-10 sm:w-12 md:w-14';
            if (key === 'Backspace') widthClass = 'w-16 sm:w-20 md:w-24';
            if (key === 'Tab' || key === '\\') widthClass = 'w-14 sm:w-16 md:w-20';
            if (key === 'Caps' || key === 'Enter') widthClass = 'w-16 sm:w-20 md:w-24';
            if (key === 'Shift') widthClass = 'w-20 sm:w-28 md:w-32';
            if (key === 'Space') widthClass = 'w-64 sm:w-96 md:w-[28rem]';

            return (
              <div
                key={`${key}-${keyIndex}`}
                className={cn(
                  'h-10 sm:h-12 md:h-14 rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium border-b-4 transition-all duration-150',
                  widthClass,
                  colorClasses,
                  isTarget ? cn('-translate-y-1', getTargetGlow()) : 'opacity-70'
                )}
              >
                {key === 'Space' ? 'Space' : key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
