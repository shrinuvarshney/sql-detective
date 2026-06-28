import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, Trophy } from 'lucide-react';

interface CaseSolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelId: number;
  levelTitle: string;
  scoreEarned: number | null;
  attemptsCount: number;
  hintsUsed: number;
  onNextCase: () => void;
  
  // Custom RPG reward details
  xpEarned: number;
  creditsEarned: number;
  epEarned: number;
  didLevelUp: boolean;
  newLevel: number;
  newAchievements?: string[];
}

const ACHIEVEMENT_DETAILS: { [key: string]: { title: string; desc: string } } = {
  first_case: { title: 'First Decryption', desc: 'Cracked your first security database case.' },
  chapter_1: { title: 'Standard Cleared', desc: 'Completed Chapter 1 (Levels 1-10).' },
  chapter_2: { title: 'Decryption Cleared', desc: 'Completed Chapter 2 (Levels 11-20).' },
  chapter_3: { title: 'Financial Cleared', desc: 'Completed Chapter 3 (Levels 21-30).' },
  chapter_4: { title: 'Network Cleared', desc: 'Completed Chapter 4 (Levels 31-40).' },
  chapter_5: { title: 'Mainframe Override', desc: 'Completed all 50 level databases.' },
  streak_3: { title: 'Consistent Eye', desc: 'Reached a 3-day active access streak.' },
  unsparing: { title: 'Pure Analyst', desc: 'Completed case on first attempt without hints.' }
};

export default function CaseSolvedModal({
  isOpen,
  onClose,
  levelId,
  levelTitle,
  scoreEarned,
  attemptsCount,
  hintsUsed,
  onNextCase,
  xpEarned,
  creditsEarned,
  epEarned,
  didLevelUp,
  newLevel,
  newAchievements = []
}: CaseSolvedModalProps) {
  if (!isOpen) return null;

  const isFirstAttempt = attemptsCount <= 1;
  const noHintsUsed = hintsUsed === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0D1117]/85 backdrop-blur-md"
        />

        {/* Modal Panel content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-md bg-[#161B22] border-2 border-green-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden z-10 font-mono"
        >
          {/* Subtle Cyber Grid accent inside */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363D_1px,transparent_1px),linear-gradient(to_bottom,#30363D_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none" />

          {/* Level Up Celebration Alert */}
          {didLevelUp && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-4 p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-center flex flex-col items-center justify-center shadow-lg shadow-amber-500/5 animate-pulse"
            >
              <Award className="w-8 h-8 text-amber-400 mb-1" />
              <h4 className="text-sm font-bold text-amber-400">OPERATIVE PROMOTED!</h4>
              <p className="text-[10px] text-gray-300">You have achieved Academy Level {newLevel}!</p>
            </motion.div>
          )}

          {/* Large Success Icon Ring */}
          <div className="flex flex-col items-center text-center relative mb-5">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-green-400 mb-3 shadow-lg shadow-green-500/10">
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.25em] mb-1">
              MISSION SOLVED
            </span>
            <h3 className="text-lg font-bold tracking-tight text-white uppercase truncate max-w-xs">
              {levelTitle.replace(/^Case File \d+ - /, '')}
            </h3>
            <span className="text-[9px] text-gray-500 uppercase mt-0.5">
              DATABASE ENTRY DECIPHERED // CASE #{levelId}
            </span>
          </div>

          {/* Scoring Ledger with RPG rewards */}
          <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 space-y-3 mb-5 relative">
            <span className="absolute top-2.5 right-3 text-[8px] text-gray-600 font-mono tracking-widest uppercase">REWARDS REPORT</span>
            <h4 className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider border-b border-[#30363D] pb-1.5 mb-2">
              RESOURCES EARNED
            </h4>

            {/* XP Gained */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-400">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                <span>Experience Points (XP)</span>
              </div>
              <span className="text-blue-400 font-bold">+{xpEarned} XP</span>
            </div>

            {/* Credits Gained */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ledger Credits</span>
              </div>
              <span className="text-emerald-400 font-bold">+{creditsEarned} cr</span>
            </div>

            {/* Evidence Points Gained */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-400">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Evidence Intel (EP)</span>
              </div>
              <span className="text-amber-400 font-bold">+{epEarned} EP</span>
            </div>

            {/* Score point stats */}
            <div className="pt-2 border-t border-[#30363D] flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Solve Score Representation</span>
              <span className="text-xs font-bold text-gray-300">+{scoreEarned || 100} PTS</span>
            </div>
          </div>

          {/* Newly Unlocked Achievements list inside Modal */}
          {newAchievements.length > 0 && (
            <div className="mb-5 p-3 bg-amber-500/5 border border-amber-500/25 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>ACHIEVEMENTS COMMENDED</span>
              </div>
              {newAchievements.map((achId) => {
                const detail = ACHIEVEMENT_DETAILS[achId] || { title: 'Service Honor', desc: 'Decorated for case performance.' };
                return (
                  <div key={achId} className="text-left font-sans">
                    <h5 className="text-xs font-bold text-gray-200 font-mono">{detail.title}</h5>
                    <p className="text-[10px] text-gray-400">{detail.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="flex flex-col space-y-2">
            <button
              id="btn-modal-next-case"
              onClick={onNextCase}
              className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2.5 shadow-lg shadow-green-900/10 cursor-pointer transition transform active:scale-[0.98]"
            >
              <span>{levelId === 50 ? 'FINISH ALL CASEFILES' : 'NEXT CASE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="btn-modal-review-query"
              onClick={onClose}
              className="w-full py-2.5 bg-[#161B22] hover:bg-[#30363D] text-gray-400 hover:text-white rounded-xl text-[10px] font-bold tracking-wider uppercase border border-[#30363D] cursor-pointer transition"
            >
              REVIEW SOLVED WORKSPACE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
