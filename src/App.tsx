import { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import SettingsModal from './components/SettingsModal';
import GameScreen from './components/GameScreen';
import AuthScreen from './components/AuthScreen';
import ProfileView from './components/ProfileView';
import LandingPage from './components/LandingPage';
import { useGameState } from './hooks/useGameState';
import { levels } from './levels/levelsData';
import { getDatabase } from './database/dbManager';
import { Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'menu' | 'level-select' | 'game' | 'profile' | 'auth'>('landing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<'menu' | 'game'>('menu');

  const {
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
    logout
  } = useGameState();

  // Pre-initialize SQL database in the background on app load
  useEffect(() => {
    getDatabase().catch((err) => {
      console.error("Failed to load in-memory SQLite database:", err);
    });
  }, []);

  // Sync view states when auth state loads or changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        if (view === 'landing' || view === 'auth') {
          setView('menu');
        }
      } else {
        if (view !== 'landing' && view !== 'auth') {
          setView('landing');
        }
      }
    }
  }, [user, authLoading]);

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

  const handleStartInvestigationFromLanding = () => {
    if (user) {
      // Already logged in - skip auth and open game immediately
      setView('game');
      triggerSound('click');
    } else {
      setRedirectAfterAuth('game');
      setView('auth');
      triggerSound('click');
    }
  };

  const handleOpenDashboardFromLanding = () => {
    if (user) {
      setView('menu');
      triggerSound('click');
    } else {
      setRedirectAfterAuth('menu');
      setView('auth');
      triggerSound('click');
    }
  };

  const handleOpenAuthFromLanding = () => {
    setRedirectAfterAuth('menu');
    setView('auth');
    triggerSound('click');
  };

  const handleAuthSuccess = () => {
    triggerSound('success');
    if (redirectAfterAuth === 'game') {
      setView('game');
    } else {
      setView('menu');
    }
  };

  // 1. Loading state for Firebase Auth handshake
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-gray-100 flex flex-col items-center justify-center relative p-6 select-none font-mono">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
        <div className="z-10 flex flex-col items-center space-y-4">
          <Cpu className="w-10 h-10 text-blue-500 animate-spin" />
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold tracking-wider text-white">SECURE COGNITIVE ACCESS HANDSHAKE</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Synchronizing cloud records and agent profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100 selection:bg-blue-500/30 selection:text-white">
      {view === 'landing' && (
        <LandingPage
          user={user}
          onStartInvestigation={handleStartInvestigationFromLanding}
          onOpenDashboard={handleOpenDashboardFromLanding}
          onOpenAuth={handleOpenAuthFromLanding}
        />
      )}

      {view === 'auth' && (
        <AuthScreen
          onSuccess={handleAuthSuccess}
          onBack={() => {
            setView('landing');
            triggerSound('click');
          }}
        />
      )}

      {view === 'menu' && user && (
        <MainMenu
          progress={progress}
          settings={settings}
          user={user}
          onLogout={logout}
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
          onOpenProfile={() => {
            setView('profile');
            triggerSound('click');
          }}
        />
      )}

      {view === 'level-select' && user && (
        <LevelSelect
          progress={progress}
          onSelectLevel={handleLevelSelected}
          onBack={() => {
            setView('menu');
            triggerSound('click');
          }}
        />
      )}

      {view === 'game' && user && (
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
          spendEvidencePointsForHint={spendEvidencePointsForHint}
          registerAttempt={registerAttempt}
          completeLevel={completeLevel}
        />
      )}

      {view === 'profile' && user && (
        <ProfileView
          progress={progress}
          onUpdateProfile={updateProfile}
          onPurchaseAvatar={purchaseAvatar}
          onBack={() => {
            setView('menu');
            triggerSound('click');
          }}
          triggerSound={triggerSound}
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
