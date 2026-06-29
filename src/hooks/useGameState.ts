import { useState, useEffect } from 'react';
import { GameProgress, GameSettings, Level } from '../types';
import { playSound } from '../utils/audio';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../database/firebase';
import { levels } from '../levels/levelsData';
import { 
  getLocalProgress, 
  saveLocalProgress, 
  clearLocalProgress, 
  getLocalSettings, 
  saveLocalSettings, 
  clearLocalSettings 
} from '../utils/localDb';

const STORAGE_PROGRESS_KEY = 'sql_detective_progress_v1';
const STORAGE_SETTINGS_KEY = 'sql_detective_settings_v1';

// Detailed error handling for Firestore following the skill guide
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  // We only throw a fatal error on true Firestore permission/security rule violations (as mandated by the security debugging guidelines).
  // Non-permission errors such as client being offline, network timeouts, or quota exceeded should be handled gracefully.
  const isPermissionError = 
    errorMessage.toLowerCase().includes('permission') || 
    errorMessage.toLowerCase().includes('denied') || 
    errorMessage.toLowerCase().includes('insufficient');

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isPermissionError) {
    console.error('Firestore Permission Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn('Firestore Non-Fatal Error (Offline/Network/Quota): ', JSON.stringify(errInfo));
  }
}

export const defaultProgress: GameProgress = {
  completedLevels: [],
  highestScore: 0,
  totalScore: 0,
  currentLevelId: 1,
  hintsUsedCount: {},
  levelScores: {},
  attemptsCount: {},
  
  // Custom RPG progression fields
  username: '',
  selectedAvatar: 'detective_classic',
  xp: 0,
  level: 1,
  credits: 100, // Starting credits for buying avatars
  evidencePoints: 20, // Starting Evidence Points for unlocking hints
  unlockedAvatars: ['detective_classic', 'analyst_cyber', 'agent_field', 'technician_net'],
  achievements: [],
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  statistics: {
    casesSolved: 0,
    hintsUnlocked: 0,
    totalAttempts: 0,
    creditsSpent: 0,
    highestStreak: 1
  }
};

const defaultSettings: GameSettings = {
  soundEnabled: true,
  theme: 'dark'
};

export function mergeProgress(local: GameProgress, remote: GameProgress): GameProgress {
  const completedLevels = Array.from(new Set([...(local.completedLevels || []), ...(remote.completedLevels || [])]));
  
  // Merge numeric metrics with Math.max
  const highestScore = Math.max(local.highestScore || 0, remote.highestScore || 0);
  const totalScore = Math.max(local.totalScore || 0, remote.totalScore || 0);
  const currentLevelId = Math.max(local.currentLevelId || 1, remote.currentLevelId || 1);
  const xp = Math.max(local.xp || 0, remote.xp || 0);
  const level = Math.max(local.level || 1, remote.level || 1);
  const credits = Math.max(local.credits || 0, remote.credits || 0);
  const evidencePoints = Math.max(local.evidencePoints || 0, remote.evidencePoints || 0);
  const streak = Math.max(local.streak || 1, remote.streak || 1);

  // Merge map-based fields
  const hintsUsedCount = { ...(local.hintsUsedCount || {}), ...(remote.hintsUsedCount || {}) };
  for (const k of Object.keys(hintsUsedCount)) {
    const key = Number(k);
    hintsUsedCount[key] = Math.max(local.hintsUsedCount?.[key] || 0, remote.hintsUsedCount?.[key] || 0);
  }

  const levelScores = { ...(local.levelScores || {}), ...(remote.levelScores || {}) };
  for (const k of Object.keys(levelScores)) {
    const key = Number(k);
    levelScores[key] = Math.max(local.levelScores?.[key] || 0, remote.levelScores?.[key] || 0);
  }

  const attemptsCount = { ...(local.attemptsCount || {}), ...(remote.attemptsCount || {}) };
  for (const k of Object.keys(attemptsCount)) {
    const key = Number(k);
    attemptsCount[key] = Math.max(local.attemptsCount?.[key] || 0, remote.attemptsCount?.[key] || 0);
  }

  // Merge arrays/string fields
  const unlockedAvatars = Array.from(new Set([...(local.unlockedAvatars || []), ...(remote.unlockedAvatars || [])]));
  const achievements = Array.from(new Set([...(local.achievements || []), ...(remote.achievements || [])]));
  const username = local.username && local.username !== '' ? local.username : (remote.username || '');
  const selectedAvatar = local.selectedAvatar || remote.selectedAvatar || 'detective_classic';

  // Dates
  const lastActiveDate = (local.lastActiveDate && remote.lastActiveDate)
    ? (local.lastActiveDate > remote.lastActiveDate ? local.lastActiveDate : remote.lastActiveDate)
    : (local.lastActiveDate || remote.lastActiveDate || new Date().toISOString().split('T')[0]);

  // Statistics
  const statistics = {
    casesSolved: Math.max(local.statistics?.casesSolved || 0, remote.statistics?.casesSolved || 0, completedLevels.length),
    hintsUnlocked: Math.max(local.statistics?.hintsUnlocked || 0, remote.statistics?.hintsUnlocked || 0),
    totalAttempts: Math.max(local.statistics?.totalAttempts || 0, remote.statistics?.totalAttempts || 0),
    creditsSpent: Math.max(local.statistics?.creditsSpent || 0, remote.statistics?.creditsSpent || 0),
    highestStreak: Math.max(local.statistics?.highestStreak || 1, remote.statistics?.highestStreak || 1, streak),
  };

  return {
    completedLevels,
    highestScore,
    totalScore,
    currentLevelId,
    hintsUsedCount,
    levelScores,
    attemptsCount,
    username,
    selectedAvatar,
    xp,
    level,
    credits,
    evidencePoints,
    unlockedAvatars,
    achievements,
    streak,
    lastActiveDate,
    statistics
  };
}

export function useGameState() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [progress, setProgress] = useState<GameProgress>(() => {
    if (typeof window === 'undefined') return defaultProgress;
    const stored = localStorage.getItem(STORAGE_PROGRESS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...defaultProgress,
          ...parsed,
          statistics: {
            ...defaultProgress.statistics,
            ...(parsed.statistics || {})
          }
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

  // Load progress and settings from IndexedDB on startup as a robust supplement
  useEffect(() => {
    async function loadFromIndexedDb() {
      const dbProgress = await getLocalProgress();
      if (dbProgress) {
        setProgress(prev => mergeProgress(prev, dbProgress));
      }
      const dbSettings = await getLocalSettings();
      if (dbSettings) {
        setSettings(prev => ({
          ...prev,
          ...dbSettings
        }));
      }
    }
    loadFromIndexedDb();
  }, []);

  // Track Firebase Authentication changes and sync database
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const path = `users/${currentUser.uid}`;
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const cloudProgress = docSnap.data() as GameProgress;
            
            // Sync Daily Streak when loading progress
            const today = new Date().toISOString().split('T')[0];
            let updatedStreak = cloudProgress.streak || 1;
            let updatedHighestStreak = cloudProgress.statistics?.highestStreak || 1;
            
            if (cloudProgress.lastActiveDate && cloudProgress.lastActiveDate !== today) {
              const lastActive = new Date(cloudProgress.lastActiveDate);
              const currentDate = new Date(today);
              const diffTime = Math.abs(currentDate.getTime() - lastActive.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                updatedStreak += 1;
              } else if (diffDays > 1) {
                updatedStreak = 1;
              }
              updatedHighestStreak = Math.max(updatedHighestStreak, updatedStreak);
            }
            
            setProgress(prevLocal => {
              const remoteParsed: GameProgress = {
                ...defaultProgress,
                ...cloudProgress,
                streak: updatedStreak,
                lastActiveDate: today,
                username: cloudProgress.username || currentUser.email?.split('@')[0] || 'Agent',
                statistics: {
                  ...defaultProgress.statistics,
                  ...(cloudProgress.statistics || {}),
                  highestStreak: updatedHighestStreak
                }
              };
              return mergeProgress(prevLocal, remoteParsed);
            });
          } else {
            // First time logging in on this account - populate cloud with any local progress
            const initialProgress: GameProgress = {
              ...progress,
              username: progress.username || currentUser.email?.split('@')[0] || 'Agent',
              lastActiveDate: new Date().toISOString().split('T')[0]
            };
            await setDoc(docRef, initialProgress);
            setProgress(initialProgress);
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, path);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync state to local storage and IndexedDB for instant offline access and maximum durability
  useEffect(() => {
    localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    saveLocalProgress(progress);
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    saveLocalSettings(settings);
  }, [settings]);

  // Sync state to Cloud Firestore when updated
  useEffect(() => {
    if (user && !authLoading) {
      const syncToCloud = async () => {
        const path = `users/${user.uid}`;
        try {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, progress);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, path);
        }
      };
      
      // Debounce slightly to avoid aggressive writes
      const timeoutId = setTimeout(syncToCloud, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [progress, user, authLoading]);

  // Audio helper integrated with settings
  const triggerSound = (type: 'click' | 'success' | 'wrong' | 'complete') => {
    playSound(type, settings.soundEnabled);
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    triggerSound('click');
  };

  // Register an execution attempt
  const registerAttempt = (levelId: number) => {
    setProgress(prev => {
      const currentAttempts = prev.attemptsCount[levelId] || 0;
      return {
        ...prev,
        attemptsCount: {
          ...prev.attemptsCount,
          [levelId]: currentAttempts + 1
        },
        statistics: {
          ...prev.statistics,
          totalAttempts: (prev.statistics.totalAttempts || 0) + 1
        }
      };
    });
  };

  // Spend Evidence Points to Unlock a Hint
  const spendEvidencePointsForHint = (levelId: number, hintIndex: number, cost: number): boolean => {
    let success = false;
    setProgress(prev => {
      const currentHints = prev.hintsUsedCount[levelId] || 0;
      // Already unlocked this level of hint or higher
      if (currentHints > hintIndex) {
        success = true;
        return prev;
      }
      if (prev.evidencePoints < cost) {
        success = false;
        return prev;
      }
      success = true;
      return {
        ...prev,
        evidencePoints: prev.evidencePoints - cost,
        hintsUsedCount: {
          ...prev.hintsUsedCount,
          [levelId]: hintIndex + 1
        },
        statistics: {
          ...prev.statistics,
          hintsUnlocked: (prev.statistics.hintsUnlocked || 0) + 1
        }
      };
    });
    if (success) triggerSound('click');
    return success;
  };

  // Buy or unlock a premium avatar
  const purchaseAvatar = (avatarId: string, cost: number): boolean => {
    let success = false;
    setProgress(prev => {
      if (prev.unlockedAvatars.includes(avatarId)) {
        success = true;
        return prev;
      }
      if (prev.credits < cost) {
        success = false;
        return prev;
      }
      
      const newUnlocked = [...prev.unlockedAvatars, avatarId];
      const achievements = [...prev.achievements];
      
      // Collector achievement: Unlock 3 premium avatars (unlocked size >= 7 because 4 are default)
      if (newUnlocked.length >= 7 && !achievements.includes('collector')) {
        achievements.push('collector');
      }

      success = true;
      return {
        ...prev,
        credits: prev.credits - cost,
        unlockedAvatars: newUnlocked,
        achievements,
        statistics: {
          ...prev.statistics,
          creditsSpent: (prev.statistics.creditsSpent || 0) + cost
        }
      };
    });
    if (success) triggerSound('success');
    return success;
  };

  // Update profile details (username & avatar selection)
  const updateProfile = (username: string, selectedAvatar: string) => {
    setProgress(prev => ({
      ...prev,
      username: username.trim() || prev.username,
      selectedAvatar: prev.unlockedAvatars.includes(selectedAvatar) ? selectedAvatar : prev.selectedAvatar
    }));
    triggerSound('click');
  };

  // Complete a level and calculate its score, rewards, XP, level up, and achievements
  const completeLevel = (levelId: number): {
    scoreEarned: number;
    xpEarned: number;
    creditsEarned: number;
    epEarned: number;
    isFirstTime: boolean;
    didLevelUp: boolean;
    newLevel: number;
    newAchievements: string[];
  } => {
    let scoreEarned = 0;
    let xpEarned = 0;
    let creditsEarned = 0;
    let epEarned = 0;
    let isFirstTime = false;
    let didLevelUp = false;
    let finalNewLevel = 1;
    let newlyUnlockedAchievements: string[] = [];

    setProgress(prev => {
      const alreadyCompleted = prev.completedLevels.includes(levelId);
      isFirstTime = !alreadyCompleted;

      if (!isFirstTime) {
        // No extra score/rewards for re-completing, just return current state
        return prev;
      }

      // 1. Score Calculation (credits score representation)
      let levelScore = 100;
      const attempts = prev.attemptsCount[levelId] || 1;
      const isFirstAttempt = attempts <= 1;
      if (isFirstAttempt) {
        levelScore += 25;
      }

      const hintsUsed = prev.hintsUsedCount[levelId] || 0;
      const noHintsUsed = hintsUsed === 0;
      if (noHintsUsed) {
        levelScore += 50;
      }
      scoreEarned = levelScore;

      // 2. XP & Credits & Evidence Points Calculation
      let levelXp = 100;
      if (isFirstAttempt) levelXp += 50; // first attempt bonus XP
      xpEarned = levelXp;

      let levelCredits = 100;
      if (noHintsUsed) levelCredits += 50; // no hint bonus Credits
      creditsEarned = levelCredits;

      let levelEp = 10;
      if (isFirstAttempt) levelEp += 5; // first attempt bonus EP
      epEarned = levelEp;

      // Update basic fields
      const newCompleted = [...prev.completedLevels, levelId];
      const newLevelScores = { ...prev.levelScores, [levelId]: levelScore };
      const newTotalScore = prev.totalScore + levelScore;
      const newHighestScore = Math.max(prev.highestScore, newTotalScore);

      // Handle XP Progression and Level Up
      let currentXp = prev.xp + levelXp;
      let userLevel = prev.level;
      let levelUpThreshold = userLevel * 500;
      
      while (currentXp >= levelUpThreshold) {
        currentXp -= levelUpThreshold;
        userLevel += 1;
        didLevelUp = true;
        levelUpThreshold = userLevel * 500;
      }
      finalNewLevel = userLevel;

      // Check Achievements
      const currentAchievements = [...prev.achievements];
      
      // Check first case solved
      if (newCompleted.length === 1 && !currentAchievements.includes('first_case')) {
        currentAchievements.push('first_case');
        newlyUnlockedAchievements.push('first_case');
      }

      // Check Chapter completions
      // Chapter 1 (Standard Intrusion): levels 1-10
      const ch1Completed = [1,2,3,4,5,6,7,8,9,10].every(id => newCompleted.includes(id));
      if (ch1Completed && !currentAchievements.includes('chapter_1')) {
        currentAchievements.push('chapter_1');
        newlyUnlockedAchievements.push('chapter_1');
      }

      // Chapter 2 (Decryption Protocol): levels 11-20
      const ch2Completed = [11,12,13,14,15,16,17,18,19,20].every(id => newCompleted.includes(id));
      if (ch2Completed && !currentAchievements.includes('chapter_2')) {
        currentAchievements.push('chapter_2');
        newlyUnlockedAchievements.push('chapter_2');
      }

      // Chapter 3 (Financial Forensics): levels 21-30
      const ch3Completed = [21,22,23,24,25,26,27,28,29,30].every(id => newCompleted.includes(id));
      if (ch3Completed && !currentAchievements.includes('chapter_3')) {
        currentAchievements.push('chapter_3');
        newlyUnlockedAchievements.push('chapter_3');
      }

      // Chapter 4 (Network Intrusion): levels 31-40
      const ch4Completed = [31,32,33,34,35,36,37,38,39,40].every(id => newCompleted.includes(id));
      if (ch4Completed && !currentAchievements.includes('chapter_4')) {
        currentAchievements.push('chapter_4');
        newlyUnlockedAchievements.push('chapter_4');
      }

      // Chapter 5 (Mainframe Override): levels 41-50
      const ch5Completed = [41,42,43,44,45,46,47,48,49,50].every(id => newCompleted.includes(id));
      if (ch5Completed && !currentAchievements.includes('chapter_5')) {
        currentAchievements.push('chapter_5');
        newlyUnlockedAchievements.push('chapter_5');
      }

      // Pure Analyst (First attempt, no hints)
      if (isFirstAttempt && noHintsUsed && !currentAchievements.includes('unsparing')) {
        currentAchievements.push('unsparing');
        newlyUnlockedAchievements.push('unsparing');
      }

      // Tycoon check (total score >= 1000 or credit savings >= 1000)
      const finalCredits = prev.credits + levelCredits;
      if (finalCredits >= 1000 && !currentAchievements.includes('tycoon')) {
        currentAchievements.push('tycoon');
        newlyUnlockedAchievements.push('tycoon');
      }

      // Streak check
      if (prev.streak >= 3 && !currentAchievements.includes('streak_3')) {
        currentAchievements.push('streak_3');
        newlyUnlockedAchievements.push('streak_3');
      }

      // Advance level pointer if not at max
      const nextLevelId = levelId < levels.length ? levelId + 1 : levelId;

      return {
        ...prev,
        completedLevels: newCompleted,
        levelScores: newLevelScores,
        totalScore: newTotalScore,
        highestScore: newHighestScore,
        currentLevelId: nextLevelId,
        xp: currentXp,
        level: userLevel,
        credits: finalCredits,
        evidencePoints: prev.evidencePoints + levelEp,
        achievements: currentAchievements,
        statistics: {
          ...prev.statistics,
          casesSolved: newCompleted.length,
          highestStreak: Math.max(prev.statistics.highestStreak || 1, prev.streak)
        }
      };
    });

    return {
      scoreEarned,
      xpEarned,
      creditsEarned,
      epEarned,
      isFirstTime,
      didLevelUp,
      newLevel: finalNewLevel,
      newAchievements: Array.from(new Set(newlyUnlockedAchievements))
    };
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
    localStorage.removeItem(STORAGE_PROGRESS_KEY);
    clearLocalProgress();
    triggerSound('click');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_PROGRESS_KEY);
    clearLocalProgress();
    triggerSound('click');
  };

  return {
    progress,
    settings,
    user,
    authLoading,
    spendEvidencePointsForHint,
    purchaseAvatar,
    updateProfile,
    registerAttempt,
    completeLevel,
    selectLevel,
    resetProgress,
    toggleSound,
    triggerSound,
    logout: handleLogout
  };
}
