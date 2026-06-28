import { useState } from 'react';
import { Level, GameProgress } from '../types';
import { levels } from '../levels/levelsData';
import { CheckCircle2, Lock, ArrowLeft, Play, ShieldAlert } from 'lucide-react';

interface LevelSelectProps {
  progress: GameProgress;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

const CHAPTERS = [
  { id: 1, title: 'Chapter 1', name: 'Standard Intrusion', range: [1, 10], theme: 'blue' },
  { id: 2, title: 'Chapter 2', name: 'Decryption Protocol', range: [11, 20], theme: 'indigo' },
  { id: 3, title: 'Chapter 3', name: 'Financial Forensics', range: [21, 30], theme: 'emerald' },
  { id: 4, title: 'Chapter 4', name: 'Network Intrusion', range: [31, 40], theme: 'purple' },
  { id: 5, title: 'Chapter 5', name: 'Mainframe Override', range: [41, 50], theme: 'amber' }
];

export default function LevelSelect({
  progress,
  onSelectLevel,
  onBack
}: LevelSelectProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);

  const isLevelUnlocked = (id: number): boolean => {
    if (id === 1) return true;
    // Allow starting Chapter 2, 3, 4, 5 if the user completed the previous chapter, 
    // or keep strict sequential progression. Strict sequential is best, but let's unlock chapter starters
    // if the user finished the previous chapter's final level.
    return progress.completedLevels.includes(id - 1);
  };

  const activeChapter = CHAPTERS.find(c => c.id === selectedChapterId) || CHAPTERS[0];

  const filteredLevels = levels.filter(lvl => 
    lvl.id >= activeChapter.range[0] && lvl.id <= activeChapter.range[1]
  );

  const getChapterColorClass = (chapterId: number, active: boolean) => {
    const ch = CHAPTERS.find(c => c.id === chapterId);
    if (!ch) return '';
    if (active) {
      if (ch.theme === 'blue') return 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15';
      if (ch.theme === 'indigo') return 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/15';
      if (ch.theme === 'emerald') return 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/15';
      if (ch.theme === 'purple') return 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/15';
      if (ch.theme === 'amber') return 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/15';
    }
    return 'text-gray-400 hover:text-white hover:bg-[#30363D]/35';
  };

  const getLevelBorderClass = (completed: boolean, unlocked: boolean, theme: string) => {
    if (completed) return 'border-green-500/20 bg-green-500/5 hover:border-green-500/40 hover:bg-green-500/10';
    if (!unlocked) return 'border-[#30363D]/40 opacity-40 cursor-not-allowed';
    
    if (theme === 'blue') return 'border-[#30363D] hover:border-blue-500/40 hover:bg-blue-500/5';
    if (theme === 'indigo') return 'border-[#30363D] hover:border-indigo-500/40 hover:bg-indigo-500/5';
    if (theme === 'emerald') return 'border-[#30363D] hover:border-emerald-500/40 hover:bg-emerald-500/5';
    if (theme === 'purple') return 'border-[#30363D] hover:border-purple-500/40 hover:bg-purple-500/5';
    if (theme === 'amber') return 'border-[#30363D] hover:border-amber-500/40 hover:bg-amber-500/5';
    return 'border-[#30363D] hover:border-blue-500/40 hover:bg-blue-500/5';
  };

  const getLevelIconClass = (completed: boolean, unlocked: boolean, theme: string) => {
    if (completed) return 'bg-green-500/10 text-green-400';
    if (!unlocked) return 'bg-gray-800/45 text-gray-600';
    
    if (theme === 'blue') return 'bg-blue-500/10 text-blue-400';
    if (theme === 'indigo') return 'bg-indigo-500/10 text-indigo-400';
    if (theme === 'emerald') return 'bg-emerald-500/10 text-emerald-400';
    if (theme === 'purple') return 'bg-purple-500/10 text-purple-400';
    if (theme === 'amber') return 'bg-amber-500/10 text-amber-400';
    return 'bg-blue-500/10 text-blue-400';
  };

  const getLevelBadgeClass = (theme: string) => {
    if (theme === 'blue') return 'text-[#58A6FF] border-[#30363D]';
    if (theme === 'indigo') return 'text-indigo-400 border-indigo-500/30';
    if (theme === 'emerald') return 'text-emerald-400 border-emerald-500/30';
    if (theme === 'purple') return 'text-purple-400 border-purple-500/30';
    if (theme === 'amber') return 'text-amber-400 border-amber-500/30';
    return 'text-[#58A6FF] border-[#30363D]';
  };

  return (
    <div id="level-select" className="flex flex-col min-h-screen bg-[#0D1117] text-gray-100 p-6 md:p-12 relative select-none">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

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
              Explore 50 challenging cases categorized by threat sectors
            </p>
          </div>
        </div>

        {/* Chapter Selection Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#161B22]/55 p-2 rounded-2xl border border-[#30363D]">
          {CHAPTERS.map((ch) => {
            const isActive = ch.id === selectedChapterId;
            return (
              <button
                key={ch.id}
                id={`tab-chapter-${ch.id}`}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer border border-transparent ${getChapterColorClass(ch.id, isActive)}`}
              >
                <div className="text-center">
                  <span className="block opacity-65 text-[8px] uppercase tracking-widest">{ch.title}</span>
                  <span className="block truncate mt-0.5">{ch.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chapter Informational Header */}
        <div className="mb-6 p-4 rounded-xl bg-[#161B22]/60 border border-[#30363D] text-xs font-mono text-gray-400 flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <span className="font-bold uppercase block text-white">{activeChapter.title}: {activeChapter.name} (Cases {activeChapter.range[0]}-{activeChapter.range[1]})</span>
            <span>Decrypt active server directories, money transfers, and network protocol breaches. Complete cases sequentially to crack the override.</span>
          </div>
        </div>

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
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${getLevelBorderClass(completed, unlocked, activeChapter.theme)}`}
              >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  {/* Status Indicator Badge */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${getLevelIconClass(completed, unlocked, activeChapter.theme)}`}>
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : unlocked ? (
                      <Play className="w-4 h-4 fill-current" />
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
                      <span className={`text-[10px] font-mono bg-[#161B22] font-semibold border px-1.5 py-0.5 rounded uppercase ${getLevelBadgeClass(activeChapter.theme)}`}>
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
                    <span className="text-xs font-mono group-hover:translate-x-1 transition-transform">
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
