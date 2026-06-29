import React, { useState } from 'react';
import { GameProgress, Level, TableSchema } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, ShieldAlert, Sparkles, X, 
  Terminal, Award, BookOpen, ChevronRight, Play, 
  Database, RefreshCw, Cpu, CheckCircle
} from 'lucide-react';
import { fetchProgressReport, fetchGeneratedCase } from '../utils/aiApi';

interface AiCoachAndLabProps {
  progress: GameProgress;
  onPlayCustomLevel: (level: Level) => void;
  onClose: () => void;
}

export default function AiCoachAndLab({
  progress,
  onPlayCustomLevel,
  onClose
}: AiCoachAndLabProps) {
  const [activeTab, setActiveTab] = useState<'coach' | 'lab'>('coach');

  // Tab 1: Learning Coach States
  const [reportText, setReportText] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Tab 2: Case Generator Lab States
  const [selectedConcept, setSelectedConcept] = useState('INNER JOIN');
  const [selectedDifficulty, setSelectedDifficulty] = useState('MEDIUM');
  const [selectedTheme, setSelectedTheme] = useState('BLOCKCHAIN LEDGER ANOMALY');
  const [generatedCase, setGeneratedCase] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to format raw markdown/text reports beautifully
  const renderFormattedReport = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
        const title = trimmed.replace(/^#+\s*/, '');
        return (
          <h4 key={idx} className="text-sm font-mono font-extrabold text-blue-400 mt-5 mb-2 uppercase tracking-widest border-b border-[#30363D] pb-1 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span>{title}</span>
          </h4>
        );
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const bulletContent = trimmed.replace(/^[-*]\s*/, '');
        // Highlight bold text inside bullet point
        const parts = bulletContent.split('**');
        return (
          <li key={idx} className="list-none pl-4 relative text-xs text-gray-300 mb-2 leading-relaxed">
            <span className="absolute left-0 top-1 text-blue-500 font-bold">•</span>
            <span>
              {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold font-mono">{part}</strong> : part)}
            </span>
          </li>
        );
      }
      if (trimmed === '') return <div key={idx} className="h-2" />;
      
      const parts = trimmed.split('**');
      return (
        <p key={idx} className="text-xs text-gray-300 leading-relaxed mb-2 font-sans">
          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-blue-300 font-semibold">{part}</strong> : part)}
        </p>
      );
    });
  };

  // Compile Progress report from AI Learning Coach
  const handleCompileReport = async () => {
    setIsReportLoading(true);
    setReportText(null);
    try {
      const report = await fetchProgressReport({
        completedLevels: progress.completedLevels,
        attemptsCount: progress.attemptsCount,
        hintsUsedCount: progress.hintsUsedCount,
        statistics: progress.statistics
      });
      setReportText(report);
    } catch (err: any) {
      setReportText(`Forensic Report Compiler Error: ${err.message || 'Offline linkage'}`);
    } finally {
      setIsReportLoading(false);
    }
  };

  // Synthesize new Custom Case
  const handleGenerateCase = async () => {
    setIsGenerating(true);
    setGeneratedCase(null);
    try {
      const result = await fetchGeneratedCase({
        concept: selectedConcept,
        difficulty: selectedDifficulty,
        theme: selectedTheme
      });
      setGeneratedCase(result);
    } catch (err: any) {
      alert(`Synthetic Case Generator failure: ${err.message || 'Check your API parameters.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Launch the synthesized case inside the SQLite engine
  const handleLaunchCase = () => {
    if (!generatedCase) return;

    // Standardize databaseSchema from AI JSON response into Level array of TableSchema objects
    const formattedSchema: TableSchema[] = Object.keys(generatedCase.databaseSchema).map(tableName => {
      return {
        name: tableName,
        columns: generatedCase.databaseSchema[tableName].map((col: any) => ({
          name: col.name,
          type: col.type,
          description: col.description || `Synthetic grid column ${col.name}`
        }))
      };
    });

    const levelToLoad: Level = {
      id: 999, // Static custom level identifier
      title: generatedCase.title || 'Case File Synthetic Range',
      concept: generatedCase.concept || selectedConcept,
      story: generatedCase.story || 'Custom generated case story setting.',
      objective: generatedCase.objective || 'Complete custom DB task.',
      databaseSchema: formattedSchema,
      hints: generatedCase.hints || ['Verify constraints.', 'Check selections.'],
      initialQuery: generatedCase.initialQuery || 'SELECT * FROM suspects LIMIT 5;',
      expectedQuery: generatedCase.expectedQuery || 'SELECT * FROM suspects;',
      sqlSetup: generatedCase.sqlSetup // Setup SQLite creation/seeding script
    };

    onPlayCustomLevel(levelToLoad);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      
      {/* Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#0D1117] border border-[#30363D] rounded-2xl flex flex-col overflow-hidden max-h-[90vh] shadow-2xl drop-shadow-[0_0_15px_rgba(59,130,246,0.1)] font-sans text-gray-200"
      >
        
        {/* Header bar */}
        <div className="p-4 border-b border-[#30363D] bg-[#161B22] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-md font-mono font-bold tracking-wider text-white">DFA COGNITIVE TRAINING LABORATORY</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Strategic Forensic Coach & Synthetic Case Range</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white transition border border-transparent hover:border-[#30363D] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection links */}
        <div className="grid grid-cols-2 border-b border-[#30363D] bg-[#090C10] font-mono text-xs">
          <button 
            onClick={() => setActiveTab('coach')}
            className={`py-3.5 text-center border-r border-[#30363D] transition ${activeTab === 'coach' ? 'bg-[#0D1117] text-blue-400 font-bold border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            🕵️‍♂️ COGNITIVE TRAINING AUDIT (PROGRESS ANALYSIS)
          </button>
          <button 
            onClick={() => setActiveTab('lab')}
            className={`py-3.5 text-center transition ${activeTab === 'lab' ? 'bg-[#0D1117] text-blue-400 font-bold border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            🔬 PRACTICE SCENARIO RANGE (SYNTHETIC RANGE)
          </button>
        </div>

        {/* Content canvas */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Cognitive Training Coach */}
            {activeTab === 'coach' && (
              <motion.div 
                key="coach"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start space-x-3">
                  <Cpu className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-blue-300 font-mono uppercase">Forensic Performance Optimization</h5>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      The Cognitive Performance Auditor connects directly to your local file telemetry (completed cases, total query attempts, used clues). Launch the diagnostic suite to compile a personal audit showing strengths, weaknesses, and a recommended roadmap.
                    </p>
                  </div>
                </div>

                <div className="border border-[#30363D] bg-[#161B22]/30 rounded-xl overflow-hidden shadow-inner">
                  <div className="h-8 border-b border-[#30363D] flex items-center justify-between px-4 bg-[#0D1117] font-mono text-[10px] text-gray-500">
                    <span>COGNITIVE REGISTER: OPERATIVE_DIAGNOSTICS</span>
                    <span className="text-green-500">READY</span>
                  </div>
                  
                  <div className="p-5 min-h-[160px] flex flex-col justify-center">
                    {reportText ? (
                      <div className="font-sans leading-relaxed text-gray-300 space-y-4">
                        {renderFormattedReport(reportText)}
                      </div>
                    ) : (
                      !isReportLoading && (
                        <div className="text-center py-6 font-mono text-xs text-gray-500 space-y-3">
                          <Terminal className="w-8 h-8 text-[#30363D] mx-auto animate-pulse" />
                          <div>
                            <p className="font-semibold uppercase tracking-wider text-gray-400">Diagnostic ledger empty</p>
                            <p className="text-[10px] text-gray-600 mt-1">Tap the trigger below to audit your SQL history database.</p>
                          </div>
                        </div>
                      )
                    )}

                    {isReportLoading && (
                      <div className="text-center py-10 space-y-4 font-mono text-xs text-blue-400">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                        <div className="space-y-1">
                          <p className="font-bold tracking-widest animate-pulse">COMPILING OPERATIVE FORENSICS HISTORY...</p>
                          <p className="text-[9px] text-gray-600 uppercase">Extracting state vectors from user ledger stream</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!isReportLoading && (
                  <button
                    onClick={handleCompileReport}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500/20 text-white font-mono font-bold text-xs rounded-xl tracking-wider transition cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>COMPILE COGNITIVE PROGRESS REPORT</span>
                  </button>
                )}
              </motion.div>
            )}

            {/* Tab 2: Practice Scenario Generator */}
            {activeTab === 'lab' && (
              <motion.div 
                key="lab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-4 bg-[#161B22]/50 border border-[#30363D] rounded-xl text-xs space-y-4">
                  <div className="flex items-start space-x-3">
                    <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="font-mono font-bold text-emerald-400 uppercase tracking-tight text-xs">SYNTHETIC VIRTUAL SCENARIOS GENERATOR</h5>
                      <p className="text-gray-400 leading-relaxed font-sans">
                        Configure a unique interactive database. The local rule-based compiler will formulate the story, seed tables with realistic mock forensic files inside an isolated sandbox, and configure matching test objectives.
                      </p>
                    </div>
                  </div>

                  {/* Dropdown controls */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">SQL TARGET Concept</label>
                      <select 
                        value={selectedConcept}
                        onChange={(e) => setSelectedConcept(e.target.value)}
                        className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/60 transition cursor-pointer"
                      >
                        <option value="INNER JOIN">INNER JOIN</option>
                        <option value="LEFT JOIN / RIGHT JOIN">LEFT/RIGHT JOIN</option>
                        <option value="GROUP BY & COUNT">GROUP BY Aggregations</option>
                        <option value="HAVING Constraints">HAVING Constraints</option>
                        <option value="SUBQUERIES / NESTED SQL">SUBQUERIES</option>
                        <option value="LIKE and String Wildcards">LIKE String Filters</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">CRIME RIGOR Difficulty</label>
                      <select 
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/60 transition cursor-pointer"
                      >
                        <option value="EASY">EASY (Level 1-10 equivalence)</option>
                        <option value="MEDIUM">MEDIUM (Level 11-30 equivalence)</option>
                        <option value="HARD">HARD (Level 31-50 equivalence)</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">ATMOSPHERIC THEME PROFILE</label>
                      <select 
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/60 transition cursor-pointer"
                      >
                        <option value="BLOCKCHAIN CRYPTO FRAUD">Crypto Coin Ledger Theft</option>
                        <option value="ROGUE SECURITY DRONE OVERRIDES">Rogue Weapon Drone Log File</option>
                        <option value="AI MAINFRAME MEMORY DRIFTS">Core AI Mainframe Intrusion</option>
                        <option value="QUANTUM KEY EXCHANGE AUDIT">Darknet Antiquities Auction</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isGenerating && (
                  <div className="text-center py-12 space-y-4 font-mono text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl animate-pulse">
                    <Cpu className="w-10 h-10 animate-spin mx-auto text-emerald-500" />
                    <div className="space-y-1">
                      <p className="font-bold tracking-widest">SYNTHESIZING VIRTUAL CASE MODEL...</p>
                      <p className="text-[9px] text-gray-500 uppercase">Generating schemas, populating SQLite tables, formulating expected SQL matrix</p>
                    </div>
                  </div>
                )}

                {generatedCase && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-5 space-y-4"
                  >
                    <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs">
                      <CheckCircle className="w-4 h-4 animate-bounce" />
                      <span className="font-bold uppercase tracking-wider">SYNTHETIC SCENARIO SYNTHESIS SUCCESS</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Title</span>
                        <h4 className="text-md font-bold text-white uppercase tracking-tight font-mono">{generatedCase.title}</h4>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Dossier Briefing</span>
                        <p className="text-xs text-gray-300 font-sans leading-relaxed">{generatedCase.story}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Objective Goal</span>
                        <p className="text-xs text-emerald-300 italic font-mono">"{generatedCase.objective}"</p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Generated Tables Schema</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[10px]">
                          {Object.keys(generatedCase.databaseSchema).map((tableName, tIdx) => (
                            <div key={tIdx} className="border border-[#30363D] bg-black/30 rounded p-2.5">
                              <span className="text-blue-400 font-bold uppercase block">{tableName}</span>
                              <div className="mt-1 space-y-0.5 text-gray-400">
                                {generatedCase.databaseSchema[tableName].map((col: any, cIdx: number) => (
                                  <div key={cIdx} className="flex justify-between">
                                    <span>{col.name}</span>
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">{col.type}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleLaunchCase}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 text-white font-mono font-bold text-xs rounded-xl tracking-wider transition cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10"
                    >
                      <Play className="w-4 h-4" />
                      <span>BOOT SYNTHETIC CASE PROTOCOL</span>
                    </button>
                  </motion.div>
                )}

                {!isGenerating && !generatedCase && (
                  <button
                    onClick={handleGenerateCase}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 text-white font-mono font-bold text-xs rounded-xl tracking-wider transition cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>SYNTHESIZE NEW DYNAMIC LEVEL</span>
                  </button>
                )}
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </motion.div>
    </div>
  );
}
