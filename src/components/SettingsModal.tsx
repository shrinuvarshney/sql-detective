import { useState } from 'react';
import { GameProgress, GameSettings } from '../types';
import { X, Volume2, VolumeX, ShieldAlert, Check, RefreshCw, Eye } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  progress: GameProgress;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  settings,
  progress,
  onToggleSound,
  onResetProgress,
  onClose
}: SettingsModalProps) {
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    onResetProgress();
    setResetConfirm(false);
    onClose();
  };

  return (
    <div id="settings-modal" className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Semi-transparent overlay backdrop */}
      <div 
        id="settings-modal-overlay" 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" 
      />

      {/* Main Settings Panel Content */}
      <div className="relative w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-2xl z-10 text-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#30363D] pb-4 mb-5">
          <h3 className="text-lg font-display font-extrabold tracking-tight text-white flex items-center space-x-2">
            <span>AGENCY SYSTEM PARAMETERS</span>
          </h3>
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262D] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="space-y-6">
          {/* Sound toggle item */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-200 block font-mono">SOUND CHORD SYNTH</span>
              <span className="text-xs text-gray-500 font-sans block mt-0.5">Synthesize tactical alerts and success chords</span>
            </div>
            <button
              id="btn-toggle-sound"
              onClick={onToggleSound}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-mono font-medium transition cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20'
                  : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:bg-gray-800'
              }`}
            >
              {settings.soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>MUTE</span>
                </>
              )}
            </button>
          </div>

          {/* Theme item (Readonly cosmetic description) */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-200 block font-mono">THEME SPECTRUM</span>
              <span className="text-xs text-gray-500 font-sans block mt-0.5">High-contrast environment optimal for hackers</span>
            </div>
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D] text-xs font-mono text-gray-400">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>COSMIC COAL</span>
            </div>
          </div>

          {/* Reset Progress Section with double-safety confirmation */}
          <div className="border-t border-[#30363D] pt-5">
            <span className="text-sm font-semibold text-gray-200 block font-mono">CLEAR ACCREDITATIONS</span>
            <span className="text-xs text-gray-500 font-sans block mt-0.5">
              Permanently wipe completed database cases and scores from local state.
            </span>
            
            <button
              id="btn-reset-progress"
              onClick={handleReset}
              className={`w-full flex items-center justify-center space-x-2 mt-4 py-2.5 px-4 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                resetConfirm
                  ? 'bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30'
                  : 'bg-transparent border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/5'
              }`}
            >
              {resetConfirm ? (
                <>
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                  <span>CONFIRM IRREVERSIBLE WIPE</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RESET LOCAL SAVE</span>
                </>
              )}
            </button>
            {resetConfirm && (
              <button
                id="btn-cancel-reset"
                onClick={() => setResetConfirm(false)}
                className="w-full text-center text-[10px] font-mono text-gray-500 hover:underline mt-2 cursor-pointer"
              >
                Cancel resetting progress
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer info bar */}
        <div className="mt-8 text-[10px] font-mono text-gray-600 text-center uppercase tracking-widest border-t border-[#21262D] pt-4">
          SQL DETECTIVE LOCAL CASE ENGINE v1.0.0
        </div>
      </div>
    </div>
  );
}
