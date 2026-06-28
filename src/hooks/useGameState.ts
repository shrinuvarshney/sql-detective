import { useState, useEffect } from 'react';
import { GameProgress, GameSettings, Level } from '../types';
import { playSound } from '../utils/audio';

const STORAGE_PROGRESS_KEY = 'sql_detective_progress_v1';
const STORAGE_SETTINGS_KEY = 'sql_detective_settings_v1';

const defaultProgress: GameProgress & { attemptsCount: { [levelId: number]: number } } = {
  completedLevels: [],
  highestScore: 0,
  totalScore: 0,
  currentLevelId: 1,
  hintsUsedCount: {},
  levelScores: {},
  attemptsCount: {}
};

const defaultSettings: GameSettings = {
  soundEnabled: true,
  theme: 'dark'
};

export function useGameState() {
  const [progress, setProgress] = useState(() => {
    if (typeof window === 'undefined') return defaultProgress;
    const stored = localStorage.getItem(STORAGE_PROGRESS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate or ensure all fields exist
        return {
          ...defaultProgress,
          ...parsed
        };
      } catch (e) {
        return defaultProgress;
      }
    }
    return defaultProgress;
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    const stored = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (stored) {
      try {
        return {
          ...defaultSettings,
          ...JSON.parse(stored)
        };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Audio helper integrated with settings
  const triggerSound = (type: 'click' | 'success' | 'wrong' | 'complete') => {
    playSound(type, settings.soundEnabled);
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    triggerSound('click');
  };

  // Register an execution attempt (to track first-attempt bonus)
  const registerAttempt = (levelId: number) => {
    setProgress(prev => {
      const currentAttempts = prev.attemptsCount[levelId] || 0;
      return {
        ...prev,
        attemptsCount: {
          ...prev.attemptsCount,
          [levelId]: currentAttempts + 1
        }
      };
    });
  };

  // Use a hint
  const useHint = (levelId: number): number => {
    let finalHintNum = 0;
    setProgress(prev => {
      const currentHints = prev.hintsUsedCount[levelId] || 0;
      if (currentHints >= 3) {
        finalHintNum = 3;
        return prev;
      }
      finalHintNum = currentHints + 1;
      return {
        ...prev,
        hintsUsedCount: {
          ...prev.hintsUsedCount,
          [levelId]: finalHintNum
        }
      };
    });
    triggerSound('click');
    return finalHintNum;
  };

  // Complete a level and calculate its score
  const completeLevel = (levelId: number): { scoreEarned: number; isFirstTime: boolean } => {
    let scoreEarned = 0;
    let isFirstTime = false;

    setProgress(prev => {
      const alreadyCompleted = prev.completedLevels.includes(levelId);
      isFirstTime = !alreadyCompleted;

      if (!isFirstTime) {
        // No extra score for re-completing, just return current state
        return prev;
      }

      // Calculate score for this level completion
      // Correct Answer Base: +100
      let levelScore = 100;

      // First attempt bonus: +25 (meaning they solved it on their 1st attempt)
      const attempts = prev.attemptsCount[levelId] || 1;
      const isFirstAttempt = attempts <= 1;
      if (isFirstAttempt) {
        levelScore += 25;
      }

      // No hints used bonus: +50
      const hintsUsed = prev.hintsUsedCount[levelId] || 0;
      const noHintsUsed = hintsUsed === 0;
      if (noHintsUsed) {
        levelScore += 50;
      }

      scoreEarned = levelScore;

      const newCompleted = [...prev.completedLevels, levelId];
      const newLevelScores = { ...prev.levelScores, [levelId]: levelScore };
      const newTotalScore = prev.totalScore + levelScore;
      const newHighestScore = Math.max(prev.highestScore, newTotalScore);

      // Advance level pointer if not at max (15 levels total)
      const nextLevelId = levelId < 15 ? levelId + 1 : levelId;

      return {
        ...prev,
        completedLevels: newCompleted,
        levelScores: newLevelScores,
        totalScore: newTotalScore,
        highestScore: newHighestScore,
        currentLevelId: nextLevelId
      };
    });

    return { scoreEarned, isFirstTime };
  };

  const selectLevel = (levelId: number) => {
    setProgress(prev => ({
      ...prev,
      currentLevelId: levelId
    }));
    triggerSound('click');
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    triggerSound('click');
  };

  return {
    progress,
    settings,
    useHint,
    registerAttempt,
    completeLevel,
    selectLevel,
    resetProgress,
    toggleSound,
    triggerSound
  };
}
