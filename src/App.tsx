/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MatrixGame } from './screens/MatrixGame';
import { useStore } from './store';
import { Navigation } from './components/Navigation';
import { Dashboard } from './screens/Dashboard';
import { LessonsScreen } from './screens/Lessons';
import { GamesScreen } from './screens/Games';
import { RaceGame } from './screens/RaceGame';
import { ZombieGame } from './screens/ZombieGame';
import { DailyChallenge } from './screens/DailyChallenge';
import { ProgressScreen } from './screens/Progress';
import { ProfileScreen } from './screens/Profile';

import { AsteroidGame } from './screens/AsteroidGame';

export default function App() {
  const { currentScreen, setCurrentScreen } = useStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard navigate={setCurrentScreen} />;
      case 'lessons':
        return <LessonsScreen navigate={setCurrentScreen} />;
      case 'games':
        return <GamesScreen navigate={setCurrentScreen} />;
      case 'race-game':
        return <RaceGame navigate={setCurrentScreen} />;
      case 'zombie-game':
        return <ZombieGame navigate={setCurrentScreen} />;
      case 'matrix-game':
        return <MatrixGame navigate={setCurrentScreen} />;
      case 'asteroid-game':
        return <AsteroidGame navigate={setCurrentScreen} />;
      case 'daily-challenge':
        return <DailyChallenge navigate={setCurrentScreen} />;
      case 'progress':
        return <ProgressScreen navigate={setCurrentScreen} />;
      case 'profile':
        return <ProfileScreen navigate={setCurrentScreen} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              <p>This screen is under construction.</p>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="px-6 py-2 bg-purple-600 rounded-lg text-white font-medium mt-4 hover:bg-purple-500 transition-colors"
              >
                Go Back Home
              </button>
            </div>
          </div>
        );
    }
  };


  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0c] text-white flex flex-col md:flex-row selection:bg-purple-500/30">
      <Navigation currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      <main className="flex-1 overflow-y-auto p-4 relative">
        {/* Subtle background glow */}
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 h-full">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

