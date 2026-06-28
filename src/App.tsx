import { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import SettingsModal from './components/SettingsModal';
import GameScreen from './components/GameScreen';
import { useGameState } from './hooks/useGameState';
import { levels } from './levels/levelsData';
import { getDatabase } from './database/dbManager';

export default function App() {
  const [view, setView] = useState<'menu' | 'level-select' | 'game'>('menu');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    progress,
    settings,
    useHint,
    registerAttempt,
    completeLevel,
    selectLevel,
    resetProgress,
    toggleSound,
    triggerSound
  } = useGameState();

  // Pre-initialize SQL database in the background on app load
  useEffect(() => {
    getDatabase().catch((err) => {
      console.error("Failed to load in-memory SQLite database:", err);
    });
  }, []);

  const activeLevel = levels.find(l => l.id === progress.currentLevelId) || levels[0];

  const handleStartInvestigation = () => {
    // If they click "Start Investigation", start from Level 1
    selectLevel(1);
    setView('game');
    triggerSound('click');
  };

  const handleContinueInvestigation = () => {
    // Continue at their saved currentLevelId
    setView('game');
    triggerSound('click');
  };

  const handleLevelSelected = (levelId: number) => {
    selectLevel(levelId);
    setView('game');
    triggerSound('click');
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100 selection:bg-blue-500/30 selection:text-white">
      {view === 'menu' && (
        <MainMenu
          progress={progress}
          settings={settings}
          onStart={handleStartInvestigation}
          onContinue={handleContinueInvestigation}
          onOpenLevelSelect={() => {
            setView('level-select');
            triggerSound('click');
          }}
          onOpenSettings={() => {
            setIsSettingsOpen(true);
            triggerSound('click');
          }}
          onSelectLevel={handleLevelSelected}
        />
      )}

      {view === 'level-select' && (
        <LevelSelect
          progress={progress}
          onSelectLevel={handleLevelSelected}
          onBack={() => {
            setView('menu');
            triggerSound('click');
          }}
        />
      )}

      {view === 'game' && (
        <GameScreen
          level={activeLevel}
          progress={progress}
          settings={settings}
          onBackToMenu={() => {
            setView('menu');
            triggerSound('click');
          }}
          onToggleSound={toggleSound}
          onResetProgress={resetProgress}
          onSelectLevel={(id) => selectLevel(id)}
          useHint={useHint}
          registerAttempt={registerAttempt}
          completeLevel={completeLevel}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          progress={progress}
          onToggleSound={toggleSound}
          onResetProgress={resetProgress}
          onClose={() => {
            setIsSettingsOpen(false);
            triggerSound('click');
          }}
        />
      )}
    </div>
  );
}

