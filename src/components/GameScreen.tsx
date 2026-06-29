import { useState, useEffect, useRef } from 'react';
import { Level, GameProgress, GameSettings, QueryResult } from '../types';
import { runQuery, compareResults, executeSetup } from '../database/dbManager';
import SchemaExplorer from './SchemaExplorer';
import SqlEditor from './SqlEditor';
import CaseSolvedModal from './CaseSolvedModal';
import AiHubSidebar from './AiHubSidebar';
import { levels } from '../levels/levelsData';
import { 
  ArrowLeft, Award, CheckCircle2, 
  XCircle, AlertTriangle, ShieldCheck, 
  Volume2, VolumeX, Eye, Zap, Sparkles, BrainCircuit
} from 'lucide-react';

interface GameScreenProps {
  level: Level;
  progress: GameProgress;
  settings: GameSettings;
  onBackToMenu: () => void;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onSelectLevel: (id: number) => void;
  spendEvidencePointsForHint: (levelId: number, hintIndex: number, cost: number) => boolean;
  registerAttempt: (levelId: number) => void;
  completeLevel: (levelId: number) => {
    scoreEarned: number;
    xpEarned: number;
    creditsEarned: number;
    epEarned: number;
    isFirstTime: boolean;
    didLevelUp: boolean;
    newLevel: number;
    newAchievements: string[];
  };
}

export default function GameScreen({
  level,
  progress,
  settings,
  onBackToMenu,
  onToggleSound,
  onSelectLevel,
  spendEvidencePointsForHint,
  registerAttempt,
  completeLevel
}: GameScreenProps) {
  const [userQuery, setUserQuery] = useState(level.initialQuery);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [scoreEarnedInLevel, setScoreEarnedInLevel] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSolvedModalOpen, setIsSolvedModalOpen] = useState(false);

  // AI-powered features states
  const [isAiHubOpen, setIsAiHubOpen] = useState(false);
  const [activeBriefingStyle, setActiveBriefingStyle] = useState<'standard' | 'cyberpunk_noir' | 'hightech_thrill' | 'retro_scifi'>('standard');
  const [stylizedStory, setStylizedStory] = useState<string | null>(null);
  
  // Store rewards for displaying in modal
  const [lastRewards, setLastRewards] = useState<{
    xpEarned: number;
    creditsEarned: number;
    epEarned: number;
    didLevelUp: boolean;
    newLevel: number;
    newAchievements: string[];
  } | null>(null);

  const hintsUsedCount = progress.hintsUsedCount[level.id] || 0;

  const monacoEditorRef = useRef<any>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev.slice(-15), `[${timestamp}] ${message}`]);
  };

  // Reset local query input state whenever active level changes
  useEffect(() => {
    setUserQuery(level.initialQuery);
    setQueryResult(null);
    setQueryError(null);
    setValidationMessage(null);
    setIsSuccess(false);
    setScoreEarnedInLevel(null);
    setLastRewards(null);
    setStylizedStory(null);
    setActiveBriefingStyle('standard');

    if (level.sqlSetup) {
      executeSetup(level.sqlSetup)
        .then(() => {
          addLog(`SYNTHETIC DYNAMIC VIRTUAL SCHEMA DEPLOYED SUCCESSFULLY.`);
        })
        .catch((err) => {
          addLog(`SYNTHETIC SCHEMA ERROR: ${err.message}`);
        });
    }
    
    // Welcome log entry
    setConsoleLogs([
      `[${new Date().toLocaleTimeString()}] INGESTED SECURE NODE DB: ${level.title}`,
      `[${new Date().toLocaleTimeString()}] CONTEXT ALGORITHM: ${level.concept} STATEMENT RESOLUTION IS MANDATORY.`,
      `[${new Date().toLocaleTimeString()}] WAITING FOR SOLVER COMPILER SUBMISSION...`
    ]);
  }, [level]);

  const handleNextLevel = () => {
    setIsSolvedModalOpen(false);
    
    // If we've completed all levels (50 total)
    if (level.id >= 50) {
      addLog("ALL DATABASES SECURED. YOU ARE AN ELITE MASTER ARCHITECT!");
      onBackToMenu();
      return;
    }

    // Load next level
    onSelectLevel(level.id + 1);
  };

  // Evaluate query
  const handleRunQuery = async () => {
    if (isEvaluating) return;
    setIsEvaluating(false);
    setQueryError(null);
    setValidationMessage(null);
    setIsSuccess(false);

    const queryToRun = userQuery.trim();
    if (!queryToRun) {
      setQueryError("Empty query submitted. Please write a valid SQL statement.");
      addLog("[WARN] EMPTY QUEUE DETECTED. COMPILER SUBSTATION HALTED.");
      return;
    }

    setIsEvaluating(true);
    addLog(`RUNNING SOLVER QUEUE ON INTERNAL SQLite CLIENT...`);

    // Increment attempts count
    registerAttempt(level.id);

    // 1. Get raw expected result query output
    const expectedResult = await runQuery(level.expectedQuery);
    if (expectedResult.error) {
      console.error("System configuration error: Expected Query Failed!", expectedResult.error);
      setQueryError("Agency database config error. Contact administrator.");
      setIsEvaluating(false);
      return;
    }

    // 2. Execute player's query
    const playerResult = await runQuery(queryToRun);

    // 3. Process execution outputs
    if (playerResult.error) {
      setQueryError(playerResult.error);
      playSound('wrong');
      addLog(`[ERROR] SYNTAX FAULT IN SQL RUNTIME: ${playerResult.error}`);
      setIsEvaluating(false);
      return;
    }

    // Display successful tabular data output
    setQueryResult({
      columns: playerResult.columns,
      values: playerResult.values
    });

    // 4. Compare player results against expected expectations
    const match = compareResults(playerResult, expectedResult);

    if (match.success) {
      // Correct solution!
      setIsSuccess(true);
      addLog("[SUCCESS] PARSER MATCHED! SECURITY ENVELOPE BROKEN.");
      
      // Calculate and save level score & unlock next level
      const rewards = completeLevel(level.id);
      setScoreEarnedInLevel(rewards.scoreEarned);
      setLastRewards(rewards);
      
      if (rewards.isFirstTime) {
        playSound('complete');
      } else {
        playSound('success');
      }

      // Show Case Solved Modal!
      setIsSolvedModalOpen(true);
    } else {
      // Incorrect solution
      setValidationMessage(match.reason || 'Query output does not match expected result records.');
      setIsSuccess(false);
      playSound('wrong');
      addLog("[WARN] EVALUATOR REGISTRY REJECTED. DATA INTEGRITY MISMATCH.");
    }

    setIsEvaluating(false);
  };

  const playSound = (type: 'click' | 'success' | 'wrong' | 'complete') => {
    if (settings.soundEnabled && (window as any).initSqlJs) {
      import('../utils/audio').then(mod => {
        mod.playSound(type, true);
      });
    }
  };

  const handleResetQuery = () => {
    setUserQuery(level.initialQuery);
    setQueryResult(null);
    setQueryError(null);
    setValidationMessage(null);
    setIsSuccess(false);
    playSound('click');
    addLog("REVERTED WORKSPACE QUERY ENGINE.");
  };

  const handleRequestHint = (hintIndex: number, cost: number) => {
    const success = spendEvidencePointsForHint(level.id, hintIndex, cost);
    if (success) {
      addLog(`[INTEL] DECRYPTED HINT LEVEL ${hintIndex + 1}. DEDUCTED -${cost} EP.`);
    } else {
      addLog(`[WARN] INSUFFICIENT EVIDENCE POINTS. REQUIRE ${cost} EP.`);
      playSound('wrong');
    }
  };

  const handleInsertToken = (token: string) => {
    playSound('click');
    addLog(`INSERTED SYMBOL: ${token}`);
    if (monacoEditorRef.current) {
      const editor = monacoEditorRef.current;
      const position = editor.getPosition();
      if (position) {
        const range = {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        };
        editor.executeEdits("my-source", [
          {
            range: range,
            text: token,
            forceMoveMarkers: true
          }
        ]);
        editor.focus();
      }
    } else {
      setUserQuery(prev => prev + token);
    }
  };

  const handleToggleSoundLocal = () => {
    onToggleSound();
    playSound('click');
  };

  return (
    <div id="game-screen" className="flex flex-col min-h-screen bg-[#0D1117] text-[#E6EDF3] select-none font-sans">
      
      {/* Top Navigation Control Bar */}
      <header className="h-12 border-b border-[#30363D] bg-[#161B22] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <button
            id="btn-back-menu"
            onClick={onBackToMenu}
            className="flex items-center space-x-1.5 text-xs font-mono text-[#8B949E] hover:text-white bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] px-2.5 py-1 rounded transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HQ MENU</span>
          </button>
          
          <div className="h-4 w-[1px] bg-[#30363D]" />

          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">SQL</span>
            </div>
            <span className="font-semibold tracking-tight text-xs text-white uppercase">
              SQL DETECTIVE <span className="text-blue-400 font-mono text-[9px] ml-1">v0.5.0</span>
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#30363D] hidden md:block" />

          <span className="text-xs font-mono text-[#8B949E] uppercase tracking-wider hidden md:block">
            {level.title}
          </span>
        </div>

        {/* Global Stats indicators */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="text-[10px] text-[#8B949E] uppercase">CRACKED:</span>
            <span className="text-white font-bold">{progress.completedLevels.length}/50</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="text-[10px] text-[#8B949E] uppercase">CREDITS:</span>
            <span className="text-emerald-400 font-bold">{progress.credits} cr</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="text-[10px] text-[#8B949E] uppercase">EVIDENCE:</span>
            <span className="text-amber-400 font-bold">{progress.evidencePoints} EP</span>
          </div>

          <div className="h-4 w-[1px] bg-[#30363D] hidden sm:block" />

          <button
            onClick={() => setIsAiHubOpen(!isAiHubOpen)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition border cursor-pointer ${isAiHubOpen ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold drop-shadow-[0_0_3px_rgba(59,130,246,0.35)]' : 'bg-[#0D1117] hover:bg-[#30363D] border-[#30363D] text-[#8B949E] hover:text-white'}`}
            title="Toggle Sentinel Co-Pilot Terminal"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiHubOpen ? 'text-blue-400 animate-spin' : 'text-gray-400'}`} />
            <span className="text-[10px] uppercase font-mono tracking-tight">SENTINEL CO-PILOT</span>
            <span className="relative flex h-1.5 w-1.5 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
          </button>

          <button
            id="btn-toggle-sound-game"
            onClick={handleToggleSoundLocal}
            className="p-1 rounded bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] text-[#8B949E] hover:text-white transition cursor-pointer"
            title={settings.soundEnabled ? "Mute Sound" : "Unmute Sound"}
          >
            {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-[1px] bg-[#30363D]"></div>

          <div className="flex items-center space-x-1.5 text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[#8B949E] font-bold">Lvl {progress.level} AGENT</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-88px)]">
        
        {/* LEFT COLUMN/SIDEBAR: Case info + Database schemas + Hints */}
        <aside className="w-full lg:w-[320px] border-b lg:border-b-0 lg:border-r border-[#30363D] bg-[#0D1117] flex flex-col shrink-0 overflow-y-auto p-4 space-y-4">
          
          {/* Briefing Case Card */}
          <div id="briefing-card" className="border border-[#30363D] bg-[#161B22]/40 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-widest">Case File #00{level.id}</span>
              <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-mono font-bold">
                {level.id >= 41 ? 'OVERLORD' : level.id >= 31 ? 'ADVANCED' : level.id >= 21 ? 'INTERMEDIATE' : level.id >= 11 ? 'OPERATIONAL' : 'BASIC'}
              </span>
            </div>
            
            <div className="p-4 space-y-3">
              <section>
                <h3 className="text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-tight italic">
                  {level.title.replace(/Case File \d+ - /, '')}
                </h3>
                <p className="text-[12px] leading-relaxed text-[#8B949E] font-sans">
                  {stylizedStory || level.story}
                </p>
              </section>

              <section className="bg-blue-500/5 border border-blue-500/20 rounded p-3">
                <h4 className="text-[10px] font-bold mb-1 uppercase tracking-wider text-[#E6EDF3] border-b border-[#30363D]/40 pb-0.5">Objective</h4>
                <p className="text-[11px] text-[#8B949E] italic font-mono leading-relaxed">
                  "{level.objective}"
                </p>
              </section>
            </div>
          </div>

          {/* Decipher / Hacker Logs Terminal Grid */}
          <div className="border border-blue-500/15 bg-blue-950/5 rounded-xl overflow-hidden shadow-lg font-mono">
            <div className="p-2.5 bg-blue-950/25 border-b border-[#30363D] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider font-mono">GRID DECIPHER CONSOLE</span>
              </div>
              <span className="text-[8px] font-mono text-blue-500/60 font-semibold uppercase tracking-widest hidden sm:inline">SEC-LOG-88</span>
            </div>
            <div className="p-3 bg-black/50 h-28 overflow-y-auto text-[10px] text-blue-300 space-y-1.5 scrollbar-thin scrollbar-thumb-blue-900/40">
              {consoleLogs.map((log, index) => (
                <div key={index} className="leading-relaxed whitespace-pre-wrap font-mono break-all opacity-85 hover:opacity-100 transition-opacity">
                  <span className="text-blue-500 mr-1.5 font-bold">&gt;</span>{log}
                </div>
              ))}
            </div>
          </div>

          {/* Table Schema Explorer */}
          <SchemaExplorer schema={level.databaseSchema} onTokenClick={handleInsertToken} />

          {/* Interactive Evidence Hints Panel */}
          <div id="hints-panel" className="border border-[#30363D] bg-[#161B22]/40 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-widest">EVIDENCE BANK INTEL</span>
              <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                {progress.evidencePoints} EP AVAILABLE
              </span>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-[11px] text-[#8B949E] font-sans leading-relaxed">
                Spend Evidence Points to unlock case files hint layers sequentially.
              </p>

              <div className="space-y-3 mt-2 font-mono">
                {/* Hint 1: Table clue */}
                {hintsUsedCount >= 1 ? (
                  <div className="flex items-start space-x-2 p-2.5 rounded bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-200">
                    <span className="text-amber-500 font-bold shrink-0">TABLE:</span>
                    <span className="leading-normal">{level.hints[0]}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequestHint(0, 3)}
                    className="w-full py-2 bg-[#161B22] border border-[#30363D] hover:border-amber-500/30 hover:bg-amber-500/5 rounded transition text-[10px] font-bold tracking-widest uppercase text-amber-400 hover:text-amber-300 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>DECRYPT TABLE CLUE</span>
                    <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[8px]">3 EP</span>
                  </button>
                )}

                {/* Hint 2: Column clue */}
                {hintsUsedCount >= 2 ? (
                  <div className="flex items-start space-x-2 p-2.5 rounded bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-200">
                    <span className="text-amber-500 font-bold shrink-0">COLUMNS:</span>
                    <span className="leading-normal">{level.hints[1]}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequestHint(1, 4)}
                    disabled={hintsUsedCount < 1}
                    className={`w-full py-2 border rounded transition text-[10px] font-bold tracking-widest uppercase flex items-center justify-center space-x-2 ${hintsUsedCount >= 1 ? 'bg-[#161B22] border-[#30363D] hover:border-amber-500/30 hover:bg-amber-500/5 text-amber-400 hover:text-amber-300 cursor-pointer' : 'bg-[#161B22]/40 border-[#30363D]/20 text-gray-600 cursor-not-allowed'}`}
                  >
                    <span>DECRYPT COLUMN CLUE</span>
                    <span className="bg-amber-500/10 text-amber-400/70 px-1.5 py-0.5 rounded text-[8px]">4 EP</span>
                  </button>
                )}

                {/* Hint 3: SQL Keyword Clue */}
                {hintsUsedCount >= 3 ? (
                  <div className="flex items-start space-x-2 p-2.5 rounded bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-200">
                    <span className="text-amber-500 font-bold shrink-0">SYNTAX:</span>
                    <span className="leading-normal">{level.hints[2]}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequestHint(2, 5)}
                    disabled={hintsUsedCount < 2}
                    className={`w-full py-2 border rounded transition text-[10px] font-bold tracking-widest uppercase flex items-center justify-center space-x-2 ${hintsUsedCount >= 2 ? 'bg-[#161B22] border-[#30363D] hover:border-amber-500/30 hover:bg-amber-500/5 text-amber-400 hover:text-amber-300 cursor-pointer' : 'bg-[#161B22]/40 border-[#30363D]/20 text-gray-600 cursor-not-allowed'}`}
                  >
                    <span>DECRYPT SYNTAX CLUE</span>
                    <span className="bg-amber-500/10 text-amber-400/70 px-1.5 py-0.5 rounded text-[8px]">5 EP</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </aside>

        {/* RIGHT COLUMN: Code Editor + Dynamic Results Panel */}
        <section className="flex-1 flex flex-col overflow-hidden bg-[#0D1117]">
          
          {/* Top Panel: SQL Editor */}
          <div className="flex-1 p-4 flex flex-col min-h-[300px] max-h-[50%] border-b border-[#30363D]">
            <SqlEditor
              value={userQuery}
              onChange={setUserQuery}
              onRun={handleRunQuery}
              onReset={handleResetQuery}
              isLoading={isEvaluating}
              editorRefProp={monacoEditorRef}
            />
          </div>

          {/* Bottom Panel: Tabbed Query Results with table grid */}
          <div id="results-panel" className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* Panel Tabs / Title bar */}
            <div className="h-9 border-b border-[#30363D] flex items-center justify-between px-4 bg-[#0D1117] shrink-0">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-widest font-semibold">OUTPUT EVALUATION REGISTER</span>
              </div>
            </div>

            {/* Results Output Canvas */}
            <div className="flex-1 overflow-auto p-4 bg-[#0D1117]">
              
              {/* Errors panel */}
              {queryError && (
                <div id="panel-error-output" className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-start space-x-3 text-red-400 font-mono text-xs">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider text-red-500 mb-1">SQL PROCESS FAILURE</h5>
                    <p className="leading-relaxed whitespace-pre-wrap">{queryError}</p>
                  </div>
                </div>
              )}

              {/* Validation Warning Messages (Not matching actual result) */}
              {validationMessage && !queryError && (
                <div id="panel-validation-warning" className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl flex items-start space-x-3 text-amber-300 font-mono text-xs mb-4">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider text-amber-500 mb-1">DATA AUDIT WARNING</h5>
                    <p className="leading-relaxed">{validationMessage}</p>
                  </div>
                </div>
              )}

              {/* Correct Success Alert */}
              {isSuccess && (
                <div id="panel-success-output" className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl flex items-start space-x-3 text-emerald-400 font-mono text-xs mb-4">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider text-emerald-500 mb-1">DATA INTEGRITY COMPLIANT</h5>
                    <p className="leading-relaxed">The SQL parser query matched the records exactly. Case solved!</p>
                  </div>
                </div>
              )}

              {/* Dynamic SQL records Table view */}
              {queryResult ? (
                <div className="border border-[#30363D] bg-[#161B22]/30 rounded-xl overflow-hidden font-mono text-[11px] shadow-lg max-w-full">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#161B22]/90 border-b border-[#30363D] text-[#8B949E]">
                          {queryResult.columns.map((col, idx) => (
                            <th key={idx} className="px-4 py-2 font-bold uppercase tracking-wider border-r border-[#30363D]/50 last:border-0">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.values.length > 0 ? (
                          queryResult.values.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-[#30363D]/50 hover:bg-[#161B22]/40 transition last:border-0">
                              {row.map((val, valIdx) => (
                                <td key={valIdx} className="px-4 py-2 border-r border-[#30363D]/30 last:border-0 truncate max-w-[200px]" title={String(val)}>
                                  {val === null ? <span className="text-gray-600 italic">NULL</span> : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={queryResult.columns.length} className="px-4 py-6 text-center text-gray-500 italic">
                              Query succeeded, but returned 0 rows of data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-2 border-t border-[#30363D]/60 bg-[#161B22]/10 text-[9px] text-[#8B949E] text-right">
                    {queryResult.values.length} RECORD(S) RETRIEVED SECURELY
                  </div>
                </div>
              ) : (
                !queryError && !validationMessage && (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-[#8B949E] font-mono space-y-3">
                    <Eye className="w-10 h-10 text-[#30363D] animate-pulse" />
                    <div>
                      <p className="text-xs font-semibold">WORKSPACE READY</p>
                      <p className="text-[10px] text-gray-600 mt-1 uppercase">Execute standard SQL query to render output matrix streams...</p>
                    </div>
                  </div>
                )
              )}

            </div>
          </div>

        </section>

        {isAiHubOpen && (
          <aside className="w-full lg:w-[350px] border-t lg:border-t-0 lg:border-l border-[#30363D] bg-[#0D1117] flex flex-col shrink-0 overflow-hidden h-full">
            <AiHubSidebar
              level={level}
              userQuery={userQuery}
              queryError={queryError}
              queryResult={queryResult}
              validationMessage={validationMessage}
              isSuccess={isSuccess}
              activeBriefingStyle={activeBriefingStyle}
              onApplyScaffold={(scaffold: string) => {
                setUserQuery(scaffold);
                addLog("APPLIED CYBERNETIC BOILERPLATE CODE SCAFFOLD.");
              }}
              onStyleStory={(stylized: string, styleName) => {
                setStylizedStory(stylized);
                setActiveBriefingStyle(styleName);
                addLog(`RECONFIGURED STORY NARRATIVE INTERFACE: [${styleName.toUpperCase()}]`);
              }}
              onClose={() => setIsAiHubOpen(false)}
            />
          </aside>
        )}
      </main>

      {/* Footer Bar: Stats */}
      <footer className="h-10 bg-[#090C10] border-t border-[#30363D] px-4 flex items-center justify-between shrink-0 font-mono text-[10px]">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-tight">
              {level.id >= 41 ? 'Mainframe Override' : level.id >= 31 ? 'Network Intrusion' : level.id >= 21 ? 'Financial Forensics' : level.id >= 11 ? 'Decryption Protocol' : 'Standard Intrusion'}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: 10 }).map((_, idx) => {
                const chapterNumber = Math.ceil(level.id / 10);
                const targetId = (chapterNumber - 1) * 10 + 1 + idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-1 rounded-full ${
                      targetId < level.id
                        ? chapterNumber === 5 ? 'bg-amber-500' : chapterNumber === 4 ? 'bg-purple-500' : chapterNumber === 3 ? 'bg-emerald-500' : chapterNumber === 2 ? 'bg-indigo-500' : 'bg-blue-500'
                        : targetId === level.id
                        ? 'bg-white animate-pulse'
                        : 'bg-[#30363D]'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[11px] font-mono text-white ml-2">
              {((level.id - 1) % 10) + 1}/10
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-3">
            <span className="text-[#8B949E]">LEDGER:</span>
            <span className="text-white font-bold">{progress.credits} cr</span>
          </div>
          <div className="flex space-x-3">
            <span className="text-[#8B949E]">EVIDENCE:</span>
            <span className="text-amber-400 font-bold">{progress.evidencePoints} EP</span>
          </div>
          <div className="flex space-x-2 items-center border border-[#30363D] rounded-full px-2 py-0.5 bg-[#161B22] hidden sm:flex">
            <span className="text-[#8B949E]">LATENCY:</span>
            <span className="text-green-500">12ms</span>
          </div>
        </div>
      </footer>

      <CaseSolvedModal
        isOpen={isSolvedModalOpen}
        onClose={() => setIsSolvedModalOpen(false)}
        levelId={level.id}
        levelTitle={level.title}
        scoreEarned={scoreEarnedInLevel}
        attemptsCount={progress.attemptsCount[level.id] || 1}
        hintsUsed={hintsUsedCount}
        onNextCase={handleNextLevel}
        xpEarned={lastRewards?.xpEarned || 100}
        creditsEarned={lastRewards?.creditsEarned || 100}
        epEarned={lastRewards?.epEarned || 10}
        didLevelUp={lastRewards?.didLevelUp || false}
        newLevel={lastRewards?.newLevel || 1}
        newAchievements={lastRewards?.newAchievements}
      />
    </div>
  );
}
