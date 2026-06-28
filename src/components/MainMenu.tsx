import { GameProgress, GameSettings } from '../types';
import { Terminal, ShieldAlert, Award, PlayCircle, Layers, Settings, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface MainMenuProps {
  progress: GameProgress;
  settings: GameSettings;
  onStart: () => void;
  onContinue: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onSelectLevel: (id: number) => void;
}

export default function MainMenu({
  progress,
  settings,
  onStart,
  onContinue,
  onOpenLevelSelect,
  onOpenSettings,
}: MainMenuProps) {
  const hasProgress = progress.completedLevels.length > 0;

  return (
    <div id="main-menu" className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117] text-white overflow-hidden relative px-4 py-8 select-none">
      
      {/* Background Tech Hex Grid / Visuals */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

      {/* Main Title Shield/Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center mb-10 text-center z-10"
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 mb-4 shadow-lg shadow-blue-500/5">
          <Terminal className="w-10 h-10 animate-pulse text-blue-500" />
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white mb-2 uppercase drop-shadow">
          SQL <span className="text-blue-500 font-bold">Detective</span>
        </h1>
        <p className="text-sm font-mono tracking-[0.2em] text-gray-500 uppercase">
          CYBER DATABASE INVESTIGATION DIVISION
        </p>
      </motion.div>

      {/* Main Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col space-y-4 w-full max-w-sm z-10"
      >
        <button
          id="btn-start-investigation"
          onClick={onStart}
          className="flex items-center justify-center space-x-3 w-full py-4 px-6 rounded-xl text-base font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/10 cursor-pointer"
        >
          <PlayCircle className="w-5 h-5" />
          <span>START INVESTIGATION</span>
        </button>

        {hasProgress && (
          <button
            id="btn-continue-investigation"
            onClick={onContinue}
            className="flex items-center justify-center space-x-3 w-full py-4 px-6 rounded-xl text-base font-mono font-bold text-[#E6EDF3] bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 text-green-400" />
            <span>CONTINUE CASEFILE</span>
          </button>
        )}

        <button
          id="btn-level-select"
          onClick={onOpenLevelSelect}
          className="flex items-center justify-center space-x-3 w-full py-3.5 px-6 rounded-xl text-sm font-mono font-medium text-gray-300 hover:text-white bg-[#161B22]/80 hover:bg-[#161B22] border border-[#30363D] transition duration-150 cursor-pointer"
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span>LEVEL SELECT</span>
        </button>

        <button
          id="btn-open-settings"
          onClick={onOpenSettings}
          className="flex items-center justify-center space-x-3 w-full py-3.5 px-6 rounded-xl text-sm font-mono font-medium text-gray-300 hover:text-white bg-[#161B22]/80 hover:bg-[#161B22] border border-[#30363D] transition duration-150 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>AGENCY SETTINGS</span>
        </button>
      </motion.div>

      {/* Global Progress Dashboard Stats overlay */}
      {hasProgress && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-around w-full max-w-sm mt-12 p-4 bg-[#161B22]/60 border border-[#30363D] rounded-xl backdrop-blur z-10"
        >
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">RANK STATUS</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-mono font-semibold text-gray-200">
                {progress.completedLevels.length === 15 ? 'Elite Crypt Master' : progress.completedLevels.length >= 11 ? 'Master Detective' : progress.completedLevels.length >= 7 ? 'Senior Agent' : progress.completedLevels.length >= 4 ? 'Field Officer' : 'Junior Analyst'}
              </span>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-[#30363D]" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">TOTAL CREDITS</span>
            <span className="text-sm font-mono font-bold text-blue-400 mt-1">
              {progress.totalScore} pts
            </span>
          </div>
          <div className="w-[1px] h-8 bg-[#30363D]" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">COMPLETED</span>
            <span className="text-sm font-mono font-semibold text-gray-200 mt-1">
              {progress.completedLevels.length} / 15
            </span>
          </div>
        </motion.div>
      )}

      {/* Branding footer */}
      <div className="absolute bottom-4 text-[10px] font-mono text-gray-600 tracking-widest uppercase">
        SECURE CONNECTED PORTAL // SEC-GRID-00
      </div>
    </div>
  );
}
