// Setup minimal AI service architecture
// with graceful fallback for MVP

import { LessonResult } from "../types";

export interface AIResponse {
  exercises: string[];
  encouragement: string;
}

export async function generateAdaptivePractice(
  mistakes: Record<string, number>, 
  currentWpm: number, 
  accuracy: number
): Promise<AIResponse> {
  
  // Safe Fallback logic if API isn't set up yet or fails
  const weakKeys = Object.entries(mistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const defaultEncouragement = accuracy < 90 
    ? "Focus on accuracy first. Speed will follow naturally!"
    : "Great accuracy! Try pushing your speed a little more.";

  let fallbackExercises = [
    "practice makes perfect",
    "keep your hands on the home row",
    "speed comes with time"
  ];

  if (weakKeys.includes('r') || weakKeys.includes('t')) {
    fallbackExercises = ["rest right round", "train track true", "tree root rust"];
  } else if (weakKeys.includes('e') || weakKeys.includes('i')) {
    fallbackExercises = ["even either engine", "iron ice item", "eight items exist"];
  }

  // Determine if we should attempt actual API call
  // This uses the environment variable injected by AI Studio
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || ''; // Usually server side, but we mock for now
  
  if (apiKey) {
    try {
      // In a real full-stack setup, this would fetch from our /api/generate endpoint
      // We'll stick to the fallback for the client MVP to guarantee it works.
      console.log('Would call AI API here with keys:', weakKeys);
    } catch (e) {
      console.error('AI generation failed, using fallback', e);
    }
  }

  return {
    exercises: fallbackExercises,
    encouragement: defaultEncouragement
  };
}
