import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGlobalSound } from './audio';

interface TypingEngineState {
  originalText: string;
  typedText: string;
  cursorIndex: number;
  errors: number;
  mistakes: Record<string, number>;
  totalKeyStrokes: Record<string, number>;
  startTime: number | null;
  endTime: number | null;
  status: 'idle' | 'running' | 'finished';
  combo: number;
  maxCombo: number;
}

export function useTypingEngine(targetText: string, onFinish?: (result: any) => void) {
  const playSound = useGlobalSound();
  const [state, setState] = useState<TypingEngineState>({
    originalText: targetText,
    typedText: '',
    cursorIndex: 0,
    errors: 0,
    mistakes: {},
    totalKeyStrokes: {},
    startTime: null,
    endTime: null,
    status: 'idle',
    combo: 0,
    maxCombo: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset engine when target text changes
  useEffect(() => {
    setState({
      originalText: targetText,
      typedText: '',
      cursorIndex: 0,
      errors: 0,
      mistakes: {},
      totalKeyStrokes: {},
      startTime: null,
      endTime: null,
      status: 'idle',
      combo: 0,
      maxCombo: 0,
    });
    inputRef.current?.focus();
  }, [targetText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.status === 'finished') return;
    
    // Ignore meta keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'Tab') {
      return;
    }

    // Start timer on first key press
    if (state.status === 'idle') {
      playSound('start');
      setState(s => ({ ...s, status: 'running', startTime: Date.now() }));
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      setState(s => {
        if (s.cursorIndex > 0) {
          const newTypedText = s.typedText.slice(0, -1);
          return { ...s, typedText: newTypedText, cursorIndex: s.cursorIndex - 1, combo: 0 };
        }
        return s;
      });
      return;
    }

    // Only accept characters of length 1
    if (e.key.length === 1) {
      e.preventDefault();
      
      const expectedChar = targetText[state.cursorIndex];
      const isCorrect = e.key === expectedChar;
      
      if (isCorrect) {
        if (e.key === ' ') {
          playSound('word');
        } else {
          playSound('type');
        }
      } else {
        playSound('error');
      }

      setState(s => {
        const newTypedText = s.typedText + e.key;
        const newCursor = s.cursorIndex + 1;
        let newErrors = s.errors;
        let newCombo = s.combo;
        const newMistakes = { ...s.mistakes };
        const newStrokes = { ...s.totalKeyStrokes };

        newStrokes[expectedChar] = (newStrokes[expectedChar] || 0) + 1;

        if (!isCorrect) {
          newErrors++;
          newCombo = 0;
          newMistakes[expectedChar] = (newMistakes[expectedChar] || 0) + 1;
        } else {
          newCombo++;
        }

        const isFinished = newCursor >= targetText.length;
        
        const newState = {
          ...s,
          typedText: newTypedText,
          cursorIndex: newCursor,
          errors: newErrors,
          mistakes: newMistakes,
          totalKeyStrokes: newStrokes,
          combo: newCombo,
          maxCombo: Math.max(s.maxCombo, newCombo),
          status: isFinished ? 'finished' as const : s.status,
          endTime: isFinished ? Date.now() : null
        };

        if (isFinished && onFinish) {
          // Play level up or success sound based on performance, we use success for now
          playSound('success');
          // Calculate final stats
          const duration = (Date.now() - (s.startTime || Date.now())) / 60000; // in minutes
          const wpm = Math.max(0, Math.round(((newCursor - newErrors) / 5) / duration));
          const accuracy = Math.round(((newCursor - newErrors) / newCursor) * 100);
          
          setTimeout(() => {
            onFinish({
              wpm: isNaN(wpm) || !isFinite(wpm) ? 0 : wpm,
              accuracy: isNaN(accuracy) ? 0 : accuracy,
              errors: newErrors,
              time: Math.round(duration * 60),
              mistakes: newMistakes,
              totalStrokes: newStrokes,
              combo: newState.maxCombo
            });
          }, 0);
        }

        return newState;
      });
    }
  }, [state.status, state.cursorIndex, targetText, onFinish, playSound]);

  // Derived current WPM for active gameplay
  const currentDuration = state.startTime ? (Date.now() - state.startTime) / 60000 : 0;
  const currentWpm = currentDuration > 0 ? Math.max(0, Math.round(((state.cursorIndex - state.errors) / 5) / currentDuration)) : 0;
  const currentAccuracy = state.cursorIndex > 0 ? Math.max(0, Math.round(((state.cursorIndex - state.errors) / state.cursorIndex) * 100)) : 100;

  return {
    state,
    inputRef,
    handleKeyDown,
    currentWpm: isFinite(currentWpm) ? currentWpm : 0,
    currentAccuracy
  };
}
