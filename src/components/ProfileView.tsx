import React, { useState } from 'react';
import { GameProgress, GameSettings } from '../types';
import { 
  ArrowLeft, Edit, Check, Lock, Unlock, Sparkles, Zap, Brain, 
  Crown, Award, CheckCircle2, Cpu, Coins, Key, Terminal, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileViewProps {
  progress: GameProgress;
  onUpdateProfile: (username: string, avatarId: string) => void;
  onPurchaseAvatar: (avatarId: string, cost: number) => boolean;
  onBack: () => void;
  triggerSound: (type: 'click' | 'success' | 'wrong' | 'complete') => void;
}

interface AvatarItem {
  id: string;
  emoji: string;
  label: string;
  color: string;
  cost: number;
  reqLevel: number;
  description: string;
}

const AVATARS: AvatarItem[] = [
  { id: 'detective_classic', emoji: '🕵️‍♂️', label: 'Classic Detective', color: 'border-blue-500/35 text-blue-400 bg-blue-500/5', cost: 0, reqLevel: 1, description: 'Veteran investigator specializing in traditional crime scene deduction.' },
  { id: 'analyst_cyber', emoji: '👩‍💻', label: 'Cyber Analyst', color: 'border-indigo-500/35 text-indigo-400 bg-indigo-500/5', cost: 0, reqLevel: 1, description: 'Highly skilled digital technician trained to extract meaning from databases.' },
  { id: 'agent_field', emoji: '🕴️', label: 'Field Agent', color: 'border-emerald-500/35 text-emerald-400 bg-emerald-500/5', cost: 0, reqLevel: 1, description: 'Rapid responder proficient in physical secure facility intrusions.' },
  { id: 'technician_net', emoji: '💻', label: 'Net Tech', color: 'border-cyan-500/35 text-cyan-400 bg-cyan-500/5', cost: 0, reqLevel: 1, description: 'Low-level mainframe engineer skilled in quick local subnets analysis.' },
  { id: 'hacker_shadow', emoji: '🥷', label: 'Hacker Shadow', color: 'border-purple-500/35 text-purple-400 bg-purple-500/5', cost: 200, reqLevel: 3, description: 'Silent database phantom operating behind layers of proxied nodes.' },
  { id: 'forensics_chief', emoji: '👮‍♀️', label: 'Chief Forensics', color: 'border-rose-500/35 text-rose-400 bg-rose-500/5', cost: 400, reqLevel: 6, description: 'Director of the Division, possessing deep mastery over file traces.' },
  { id: 'ai_overlord', emoji: '🤖', label: 'Mainframe Overlord', color: 'border-amber-500/35 text-amber-400 bg-amber-500/5', cost: 600, reqLevel: 10, description: 'Classified cybernetic mastermind node designed to isolate query flaws instantly.' },
  { id: 'crypt_master', emoji: '👑', label: 'Crypt Master', color: 'border-yellow-500/35 text-yellow-400 bg-yellow-500/5', cost: 800, reqLevel: 15, description: 'Sovereign of decrypts, wielding the absolute authority of the blockchain.' }
];

const ACHIEVEMENTS_LIST = [
  { id: 'first_case', title: 'First Decryption', description: 'Crack your first security database case.', icon: CheckCircle2, xp: 50, credits: 50 },
  { id: 'chapter_1', title: 'Standard Cleared', description: 'Complete Chapter 1 (Standard Intrusion).', icon: Key, xp: 150, credits: 150 },
  { id: 'chapter_2', title: 'Decryption Cleared', description: 'Complete Chapter 2 (Decryption Protocol).', icon: Lock, xp: 200, credits: 200 },
  { id: 'chapter_3', title: 'Financial Cleared', description: 'Complete Chapter 3 (Financial Forensics).', icon: Coins, xp: 250, credits: 250 },
  { id: 'chapter_4', title: 'Network Cleared', description: 'Complete Chapter 4 (Network Intrusion).', icon: Cpu, xp: 300, credits: 300 },
  { id: 'chapter_5', title: 'Mainframe Override', description: 'Complete Chapter 5 (All 50 Levels).', icon: Award, xp: 500, credits: 500 },
  { id: 'streak_3', title: 'Consistent Eye', description: 'Reach a 3-day active database access streak.', icon: Zap, xp: 100, credits: 100 },
  { id: 'unsparing', title: 'Pure Analyst', description: 'Complete any case on the first attempt with 0 hints.', icon: Brain, xp: 100, credits: 100 },
  { id: 'collector', title: 'Avatar Collector', description: 'Unlock 3 premium operative avatars.', icon: Sparkles, xp: 100, credits: 100 },
  { id: 'tycoon', title: 'Agency Tycoon', description: 'Earn 1,000 total credits in your ledger.', icon: Crown, xp: 100, credits: 100 }
];

export default function ProfileView({
  progress,
  onUpdateProfile,
  onPurchaseAvatar,
  onBack,
  triggerSound
}: ProfileViewProps) {
  const [username, setUsername] = useState(progress.username || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(progress.selectedAvatar || 'detective_classic');
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements'>('profile');

  const xpToNextLevel = progress.level * 500;
  const xpPercentage = Math.min(100, Math.floor((progress.xp / xpToNextLevel) * 100));

  const handleSaveProfile = () => {
    onUpdateProfile(username, selectedAvatarId);
    setIsEditingUsername(false);
    triggerSound('success');
  };

  const handleSelectAvatar = (avatar: AvatarItem) => {
    const isUnlocked = progress.unlockedAvatars.includes(avatar.id) || progress.level >= avatar.reqLevel;
    if (isUnlocked) {
      setSelectedAvatarId(avatar.id);
      onUpdateProfile(username, avatar.id);
      triggerSound('click');
    }
  };

  const handlePurchase = (avatar: AvatarItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (progress.credits < avatar.cost) {
      triggerSound('wrong');
      return;
    }
    const success = onPurchaseAvatar(avatar.id, avatar.cost);
    if (success) {
      setSelectedAvatarId(avatar.id);
      onUpdateProfile(username, avatar.id);
    }
  };

  const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId) || AVATARS[0];

  return (
    <div id="profile-view" className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans select-none overflow-y-auto">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15 pointer-events-none" />
      <div className="fixed top-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="h-14 border-b border-[#30363D] bg-[#161B22]/90 backdrop-blur sticky top-0 flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center space-x-4">
          <button
            id="btn-back-profile"
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-mono text-[#8B949E] hover:text-white bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HQ</span>
          </button>
          <div className="h-4 w-[1px] bg-[#30363D]" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-blue-400 uppercase">OPERATIVE DOSSIER</h2>
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400">
            <Coins className="w-3.5 h-3.5" />
            <span className="font-bold">{progress.credits} CREDITS</span>
          </div>
          <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-bold">{progress.evidencePoints} EVIDENCE PTS</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-6 md:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Left Column: Profile Summary & Level Card (4 cols) */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-[#161B22]/70 border border-[#30363D] rounded-2xl p-6 relative overflow-hidden shadow-xl backdrop-blur">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            
            {/* Selected Avatar Large Render */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-[#0D1117] border-2 border-blue-500 flex items-center justify-center text-5xl shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-105">
                  {selectedAvatar.emoji}
                </div>
                <div className="absolute inset-0 rounded-full bg-blue-500/20 filter blur-md transform scale-105 animate-pulse" />
              </div>

              {/* Username Edit Form */}
              <div className="w-full flex flex-col items-center space-y-2">
                {isEditingUsername ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={18}
                      className="bg-[#0D1117] border border-blue-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-mono text-center outline-none"
                      placeholder="Agent Username"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors cursor-pointer"
                      title="Save Username"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold tracking-tight text-white font-mono uppercase">{progress.username || 'AGENT'}</h3>
                    <button
                      onClick={() => {
                        setIsEditingUsername(true);
                        triggerSound('click');
                      }}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="Edit Username"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">{selectedAvatar.label}</span>
              </div>
            </div>

            {/* Academy Rank and Level */}
            <div className="mt-8 pt-6 border-t border-[#30363D]/60 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#8B949E] uppercase">ACADEMY RANK:</span>
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  {progress.completedLevels.length === 50 ? 'Elite Crypt Master' : progress.completedLevels.length >= 41 ? 'Chief Architect' : progress.completedLevels.length >= 31 ? 'Master Detective' : progress.completedLevels.length >= 21 ? 'Senior Agent' : progress.completedLevels.length >= 11 ? 'Special Agent' : progress.completedLevels.length >= 4 ? 'Field Officer' : 'Junior Analyst'}
                </span>
              </div>

              {/* Experience Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold font-mono text-gray-200">LEVEL {progress.level}</span>
                  <span className="text-xs font-mono text-[#8B949E]">{progress.xp} / {xpToNextLevel} XP</span>
                </div>
                <div className="w-full bg-[#0D1117] rounded-full h-2.5 border border-[#30363D] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-blue-500 h-full rounded-full shadow-lg shadow-blue-500/40"
                  />
                </div>
              </div>

              {/* Daily Streak Counter */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 font-mono">DAILY ACTIVE STREAK</h4>
                    <p className="text-[10px] text-gray-400">Keep solving to increase rewards</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-amber-400 font-mono">{progress.streak} DAYS</span>
              </div>
            </div>
          </div>

          {/* Core Game Statistics */}
          <div className="bg-[#161B22]/70 border border-[#30363D] rounded-2xl p-6 shadow-xl backdrop-blur space-y-4">
            <h4 className="text-xs font-mono text-blue-400 font-bold tracking-widest uppercase">CASE STATISTICAL LOGS</h4>
            
            <div className="grid grid-cols-2 gap-4 text-center font-mono">
              <div className="bg-[#0D1117] border border-[#30363D] p-3 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">CASES CRACKED</span>
                <span className="text-lg font-bold text-emerald-400">{progress.completedLevels.length}</span>
              </div>
              <div className="bg-[#0D1117] border border-[#30363D] p-3 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">HINTS UNLOCKED</span>
                <span className="text-lg font-bold text-amber-400">{progress.statistics?.hintsUnlocked || 0}</span>
              </div>
              <div className="bg-[#0D1117] border border-[#30363D] p-3 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">TOTAL QUERIES</span>
                <span className="text-lg font-bold text-blue-400">{progress.statistics?.totalAttempts || progress.completedLevels.length}</span>
              </div>
              <div className="bg-[#0D1117] border border-[#30363D] p-3 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">CREDITS SPENT</span>
                <span className="text-lg font-bold text-purple-400">{progress.statistics?.creditsSpent || 0} cr</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Tabbed Panel - Avatars Selection or Achievements (8 cols) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-[#161B22]/70 border border-[#30363D] rounded-2xl overflow-hidden shadow-xl backdrop-blur flex flex-col h-full">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-[#30363D] bg-[#161B22]">
              <button
                onClick={() => { setActiveTab('profile'); triggerSound('click'); }}
                className={`flex-1 py-4 text-center text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${activeTab === 'profile' ? 'border-blue-500 text-white bg-blue-500/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/10'}`}
              >
                CUSTOM OPERATIVE AVATARS
              </button>
              <button
                onClick={() => { setActiveTab('achievements'); triggerSound('click'); }}
                className={`flex-1 py-4 text-center text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${activeTab === 'achievements' ? 'border-blue-500 text-white bg-blue-500/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/10'}`}
              >
                SERVICE ACHIEVEMENTS ({progress.achievements.length}/{ACHIEVEMENTS_LIST.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              
              {/* TAB 1: Avatars Grid */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold font-mono text-gray-200 mb-1">OPERATIVE IDENTITY MATRIX</h4>
                    <p className="text-xs text-[#8B949E]">Standard issue profiles are free. Premium holographic avatars require credits or promotion thresholds.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AVATARS.map((avatar) => {
                      const isUnlocked = progress.unlockedAvatars.includes(avatar.id) || progress.level >= avatar.reqLevel;
                      const isSelected = selectedAvatarId === avatar.id;
                      const hasEnoughCredits = progress.credits >= avatar.cost;

                      return (
                        <div
                          key={avatar.id}
                          onClick={() => handleSelectAvatar(avatar)}
                          className={`flex items-start space-x-4 p-4 rounded-xl border transition-all relative ${isSelected ? 'border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5' : isUnlocked ? 'border-[#30363D] hover:border-[#8B949E]/50 bg-black/20 cursor-pointer' : 'border-dashed border-[#30363D] bg-[#0D1117] opacity-60'}`}
                        >
                          <div className="w-14 h-14 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center text-3xl shrink-0">
                            {avatar.emoji}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-mono font-bold text-gray-200">{avatar.label}</span>
                              {isSelected && (
                                <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-mono font-semibold">SELECTED</span>
                              )}
                              {!isUnlocked && avatar.cost > 0 && (
                                <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded uppercase font-mono">LOCKED</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 leading-normal font-sans">{avatar.description}</p>
                            
                            {/* Unlock Action Button */}
                            {!isUnlocked && (
                              <div className="pt-2 flex items-center justify-between">
                                <div className="text-[10px] font-mono text-gray-500 flex items-center space-x-1">
                                  <Lock className="w-3 h-3" />
                                  <span>REQ LEVEL {avatar.reqLevel} OR CREDITS</span>
                                </div>
                                <button
                                  onClick={(e) => handlePurchase(avatar, e)}
                                  disabled={!hasEnoughCredits}
                                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded flex items-center space-x-1.5 transition ${hasEnoughCredits ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                >
                                  <Unlock className="w-3 h-3" />
                                  <span>BUY FOR {avatar.cost}cr</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Achievements List */}
              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold font-mono text-gray-200 mb-1">DECORATIONS OF HONOR</h4>
                    <p className="text-xs text-[#8B949E]">Crack case objectives to claim service decorations and unlock extra credit buffers.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACHIEVEMENTS_LIST.map((ach) => {
                      const isUnlocked = progress.achievements.includes(ach.id);
                      const IconComponent = ach.icon;

                      return (
                        <div
                          key={ach.id}
                          className={`flex items-start space-x-4 p-4 rounded-xl border transition-all ${isUnlocked ? 'border-amber-500/30 bg-amber-500/5 shadow-md shadow-amber-500/5' : 'border-[#30363D] bg-[#0D1117] opacity-50'}`}
                        >
                          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${isUnlocked ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' : 'border-[#30363D] text-gray-500 bg-[#161B22]'}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>

                          <div className="flex-1 space-y-1 font-mono">
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-bold ${isUnlocked ? 'text-amber-400' : 'text-gray-400'}`}>{ach.title}</span>
                              {isUnlocked ? (
                                <span className="text-[9px] bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-bold">COMPLETED</span>
                              ) : (
                                <span className="text-[9px] bg-gray-800 text-gray-500 border border-[#30363D] px-2 py-0.5 rounded">CLASSIFIED</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 leading-normal font-sans">{ach.description}</p>
                            
                            <div className="flex items-center space-x-3 pt-1 text-[10px] text-gray-500">
                              <span className="text-blue-400">+{ach.xp} XP</span>
                              <span>•</span>
                              <span className="text-emerald-400">+{ach.credits} CREDITS</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

      </main>

      {/* Decorative Footer */}
      <footer className="h-10 border-t border-[#30363D] bg-[#0D1117] flex items-center justify-center text-[10px] font-mono text-gray-600 shrink-0 uppercase tracking-widest mt-8">
        HOLOGRAPHIC LEDGER SYNCHRONIZED // STATUS_GREEN
      </footer>
    </div>
  );
}
