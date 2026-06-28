import { useState } from 'react';
import { Level, GameProgress } from '../types';
import { levels } from '../levels/levelsData';
import { CheckCircle2, Lock, ArrowLeft, Award, Play, AlertTriangle } from 'lucide-react';

interface LevelSelectProps {
  progress: GameProgress;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export default function LevelSelect({
  progress,
  onSelectLevel,
  onBack
}: LevelSelectProps) {
  const [mode, setMode] = useState<'standard' | 'advanced'>('standard');

  const isLevelUnlocked = (id: number): boolean => {
    if (id === 1) return true;
    if (id === 11) return true; // First advanced mission unlocked by default
    return progress.completedLevels.includes(id - 1);
  };

  const filteredLevels = levels.filter(lvl => 
    mode === 'standard' ? lvl.id <= 10 : lvl.id >= 11
  );

  return (
    <div id="level-select" className="flex flex-col min-h-screen bg-[#0D1117] text-gray-100 p-6 md:p-12 relative select-none">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />

      <div className="max-w-4xl mx-auto w-full z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            id="btn-level-select-back"
            onClick={onBack}
            className="flex items-center space-x-2 text-sm font-mono text-gray-400 hover:text-white bg-[#161B22] border border-[#30363D] px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO MENU</span>
          </button>
          
          <div className="text-right">
            <span className="text-xs font-mono text-gray-500 block uppercase">ACCREDITED SCORE</span>
            <span className="text-lg font-mono font-bold text-blue-400">{progress.totalScore} PTS</span>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-white mb-2">
              SELECT DECRYPTION MISSION
            </h2>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              Level progression increases query syntax complexity
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#161B22] p-1 rounded-xl border border-[#30363D] shrink-0 self-center md:self-auto">
            <button
              id="tab-mode-standard"
              onClick={() => setMode('standard')}
              className={`py-1.5 px-4 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                mode === 'standard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              STANDARD FILES (1-10)
            </button>
            <button
              id="tab-mode-advanced"
              onClick={() => setMode('advanced')}
              className={`py-1.5 px-4 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                mode === 'advanced'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ADVANCED MODE (11-15)
            </button>
          </div>
        </div>

        {/* Modes Informational Header */}
        {mode === 'advanced' && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold uppercase block text-amber-400">ELITE CYBER-SECURITY MISSIONS</span>
              <span>These levels test deep relational theory including conditional groupings, joins, substring extracts, and combined datasets. Hints are highly limited.</span>
            </div>
          </div>
        )}

        {/* Levels Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLevels.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.id);
            const completed = progress.completedLevels.includes(lvl.id);
            const score = progress.levelScores[lvl.id] || 0;

            return (
              <button
                key={lvl.id}
                id={`level-card-${lvl.id}`}
                disabled={!unlocked}
                onClick={() => onSelectLevel(lvl.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                  completed
                    ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10'
                    : unlocked
                    ? mode === 'advanced'
                      ? 'bg-[#161B22] border-[#30363D] hover:border-amber-500/40 hover:bg-[#161B22]/80'
                      : 'bg-[#161B22] border-[#30363D] hover:border-blue-500/40 hover:bg-[#161B22]/80'
                    : 'bg-[#0D1117] border-[#30363D]/40 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  {/* Status Indicator Badge */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                    completed
                      ? 'bg-green-500/10 text-green-400'
                      : unlocked
                      ? mode === 'advanced'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-blue-500/10 text-blue-400'
                      : 'bg-gray-800/45 text-gray-600'
                  }`}>
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : unlocked ? (
                      <Play className={`w-4 h-4 ${mode === 'advanced' ? 'fill-amber-400 text-amber-400' : 'fill-blue-400 text-blue-400'}`} />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  {/* Level text */}
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-semibold text-[#8B949E] uppercase">
                        CASE {lvl.id}
                      </span>
                      <span className={`text-[10px] font-mono bg-[#161B22] font-semibold border px-1.5 py-0.5 rounded uppercase ${
                        mode === 'advanced'
                          ? 'text-amber-400 border-amber-500/30'
                          : 'text-[#58A6FF] border-[#30363D]'
                      }`}>
                        {lvl.concept}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#E6EDF3] mt-1 truncate group-hover:text-white">
                      {lvl.title.replace(/^Case File \d+ - /, '')}
                    </h3>
                  </div>
                </div>

                {/* Right metrics column */}
                <div className="flex flex-col items-end justify-center shrink-0">
                  {completed ? (
                    <div className="flex flex-col items-end font-mono">
                      <span className="text-[10px] text-green-500 uppercase tracking-wider font-bold">SOLVED</span>
                      <span className="text-xs text-[#8B949E] font-semibold mt-0.5">{score} pts</span>
                    </div>
                  ) : unlocked ? (
                    <span className={`text-xs font-mono group-hover:translate-x-1 transition-transform ${
                      mode === 'advanced' ? 'text-amber-500' : 'text-blue-500'
                    }`}>
                      DECRYPT →
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                      LOCKED
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
