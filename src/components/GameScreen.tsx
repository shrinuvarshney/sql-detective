import { useState, useEffect, useRef } from 'react';
import { Level, GameProgress, GameSettings, QueryResult } from '../types';
import { runQuery, compareResults } from '../database/dbManager';
import SchemaExplorer from './SchemaExplorer';
import SqlEditor from './SqlEditor';
import { levels } from '../levels/levelsData';
import { 
  ArrowLeft, Award, HelpCircle, CheckCircle2, 
  XCircle, AlertTriangle, ShieldCheck, ChevronRight, 
  Play, Volume2, VolumeX, Eye, BookOpen, ThumbsUp
} from 'lucide-react';

interface GameScreenProps {
  level: Level;
  progress: GameProgress;
  settings: GameSettings;
  onBackToMenu: () => void;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onSelectLevel: (id: number) => void;
  useHint: (levelId: number) => number;
  registerAttempt: (levelId: number) => void;
  completeLevel: (levelId: number) => { scoreEarned: number; isFirstTime: boolean };
}

export default function GameScreen({
  level,
  progress,
  settings,
  onBackToMenu,
  onToggleSound,
  onSelectLevel,
  useHint,
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
  
  // Keep track of active revealed hints
  const hintsUsedCount = progress.hintsUsedCount[level.id] || 0;

  const monacoEditorRef = useRef<any>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev.slice(-15), `[${timestamp}] ${message}`]);
  };

  // Whenever level changes, reset state and load its initial query
  useEffect(() => {
    setUserQuery(level.initialQuery);
    setQueryResult(null);
    setQueryError(null);
    setValidationMessage(null);
    setIsSuccess(false);
    setScoreEarnedInLevel(null);
    setConsoleLogs([
      `CONNECTED SECURITY PORTAL // CASE ${level.id}`,
      `SCANNING SUSPECT DATABASES...`,
      `SECURITY RATING: ${level.id >= 11 ? 'ELITE INTEL BYPASS' : level.id >= 6 ? 'ELEVATED DETECTOR' : 'STANDARD DETECTOR'}`,
      `READY FOR STRUCTURAL SQL INPUT.`
    ]);
  }, [level]);

  const handleRunQuery = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setQueryError(null);
    setValidationMessage(null);
    addLog("COMPILING SQL WORKSPACE...");

    // 1. Register an execution attempt for score tracking
    registerAttempt(level.id);

    // 2. Execute the user's SQL query on the in-browser SQLite DB
    const playerResult = await runQuery(userQuery);

    // 3. Execute the canonical expected SQL query for comparison
    const expectedResult = await runQuery(level.expectedQuery);

    if (playerResult.error) {
      setQueryError(playerResult.error);
      setQueryResult(null);
      setIsSuccess(false);
      playSound('wrong');
      addLog(`[ERROR] SYNTAX FAULT IN SQL RUNTIME: ${playerResult.error}`);
      setIsEvaluating(false);
      return;
    }

    // Display the successful tabular data results
    setQueryResult({
      columns: playerResult.columns,
      values: playerResult.values
    });

    // 4. Compare player's results vs expectations
    const match = compareResults(playerResult, expectedResult);

    if (match.success) {
      // Correct solution!
      setIsSuccess(true);
      addLog("[SUCCESS] PARSER MATCHED! SECURITY ENVELOPE BROKEN.");
      
      // Calculate and save level score & unlock next level
      const { scoreEarned, isFirstTime } = completeLevel(level.id);
      if (isFirstTime) {
        setScoreEarnedInLevel(scoreEarned);
        playSound('complete');
      } else {
        // Already completed before, give success sound but no double score
        playSound('success');
      }
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
    // Sound playback utility linked to settings
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

  const handleRequestHint = () => {
    if (hintsUsedCount < 3) {
      useHint(level.id);
      addLog(`[INTEL] DECRYPTING LEVEL ASSISTANCE SYLLABUS (HINT REQUESTED)...`);
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
        const textToInsert = token;
        const op = { range, text: textToInsert, forceMoveMarkers: true };
        editor.executeEdits("schema-explorer", [op]);
        editor.focus();
      } else {
        setUserQuery(prev => prev + " " + token);
      }
    } else {
      setUserQuery(prev => prev + " " + token);
    }
  };

  const handleNextLevel = () => {
    if (level.id < 15) {
      onSelectLevel(level.id + 1);
    } else {
      // Completed last level! Go back to menu
      onBackToMenu();
    }
  };

  // Safe sound toggle handler
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
            <span className="font-semibold tracking-tight text-xs text-white">
              SQL DETECTIVE <span className="text-blue-400 font-mono text-[9px] ml-1">v0.4.2-alpha</span>
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
            <span className="text-[10px] text-[#8B949E] uppercase">SOLVED:</span>
            <span className="text-white font-bold">{progress.completedLevels.length}/15</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="text-[10px] text-[#8B949E] uppercase">CREDITS:</span>
            <span className="text-blue-400 font-bold">{progress.totalScore} PTS</span>
          </div>

          <div className="h-4 w-[1px] bg-[#30363D] hidden sm:block" />

          <button
            id="btn-toggle-sound-game"
            onClick={handleToggleSoundLocal}
            className="p-1 rounded bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] text-[#8B949E] hover:text-white transition cursor-pointer"
            title={settings.soundEnabled ? "Mute Synthesizer" : "Unmute Synthesizer"}
          >
            {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-[1px] bg-[#30363D]"></div>

          <div className="flex items-center space-x-1.5 text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-[#8B949E]">AGENT_LOGGED_IN</span>
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
              <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                {level.id >= 8 ? 'ADVANCED' : level.id >= 4 ? 'INTERMEDIATE' : 'BASIC'}
              </span>
            </div>
            
            <div className="p-4 space-y-3">
              <section>
                <h3 className="text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-tight italic">
                  {level.title.replace(/Case File \d+ - /, '')}
                </h3>
                <p className="text-[12px] leading-relaxed text-[#8B949E] font-sans">
                  {level.story}
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

          {/* Interactive Hints Panel */}
          <div id="hints-panel" className="border border-[#30363D] bg-[#161B22]/40 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-widest">Intel Assistance</span>
              <span className="text-[9px] font-mono text-[#8B949E] bg-[#0D1117] border border-[#30363D] px-1.5 py-0.5 rounded">
                {3 - hintsUsedCount} OF 3 HINTS REMAINING
              </span>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-[11px] text-[#8B949E] font-sans leading-relaxed">
                Accessing hints will unmask syntactic help, but solves forfeit the <strong className="text-blue-400">+50 No-Hint Bonus</strong>.
              </p>

              {/* Revealed hint displays */}
              {hintsUsedCount > 0 && (
                <div className="space-y-2">
                  {level.hints.slice(0, hintsUsedCount).map((hintText, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2.5 rounded bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-200 font-mono">
                      <span className="text-amber-500 font-bold shrink-0">HINT {index + 1}:</span>
                      <span className="leading-normal">{hintText}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Request Hint button */}
              {hintsUsedCount < 3 ? (
                <button
                  id="btn-request-hint"
                  onClick={handleRequestHint}
                  className="w-full py-2 bg-transparent border border-[#30363D] rounded hover:bg-[#30363D] transition-colors text-[10px] font-bold tracking-widest uppercase text-[#8B949E] hover:text-white cursor-pointer"
                >
                  Request Intel Hint
                </button>
              ) : (
                <div className="text-center text-[10px] font-mono text-gray-500 uppercase tracking-wider py-1 border border-dashed border-[#30363D] rounded">
                  All hints decrypted
                </div>
              )}
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
              <div className="flex items-center space-x-3 font-mono">
                <span className="text-[11px] font-bold text-[#E6EDF3]">QUERY RESULTS</span>
                {queryResult && (
                  <span className="text-[9px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-500/20">200 OK</span>
                )}
                {queryError && (
                  <span className="text-[9px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-500/20">500 ERROR</span>
                )}
                {validationMessage && (
                  <span className="text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-500/20">400 MISMATCH</span>
                )}
              </div>
              <div className="text-[10px] font-mono text-[#484F58] hidden sm:block">
                UTF-8 — COMPILED
              </div>
            </div>

            {/* Content area: Tables or Empty state */}
            <div className="flex-1 overflow-auto bg-[#0D1117]">
              {queryResult ? (
                <div className="min-w-full inline-block align-middle">
                  <table className="w-full font-mono text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#161B22] text-[#8B949E] sticky top-0 border-b border-[#30363D]">
                        {queryResult.columns.map((col, idx) => (
                          <th key={idx} className="text-left p-2.5 font-normal italic tracking-wider uppercase border-b border-[#30363D]">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[#E6EDF3] divide-y divide-[#30363D]">
                      {queryResult.values.length > 0 ? (
                        queryResult.values.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-blue-500/5 transition duration-100">
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="p-2.5 whitespace-nowrap">
                                {cell === null || cell === undefined ? (
                                  <span className="text-gray-600 italic font-bold">NULL</span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={queryResult.columns.length} className="p-8 text-center text-[11px] text-[#8B949E] uppercase tracking-wider italic">
                            Empty result set (0 rows returned)
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                !queryError && !validationMessage && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <div className="w-10 h-10 rounded-xl bg-[#161B22] flex items-center justify-center text-[#8B949E] mb-3 border border-[#30363D]">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-xs font-mono text-[#8B949E] uppercase tracking-wider">Awaiting Execution</span>
                    <p className="text-[10px] text-gray-600 font-mono mt-1 max-w-xs">
                      Compose your database query above and click "Run Query" or hit "Ctrl+Enter" to process suspect intelligence.
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Analysis/Feedback area (Sticky / Grounded at the bottom) */}
            <div className="border-t border-[#30363D] bg-[#161B22] p-4 flex flex-col shrink-0 min-h-[160px] max-h-[220px] overflow-y-auto">
              <span className="text-[10px] font-bold text-[#8B949E] mb-2 uppercase tracking-wider font-mono">System Analysis</span>
              
              {isSuccess && (
                <div id="validation-success-block" className="bg-[#0D1117] border border-green-500/30 rounded p-3.5 flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0 text-xs">✔</div>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-bold text-green-400 mb-1">CASE SOLVED</h5>
                      <p className="text-[11px] text-[#8B949E] leading-relaxed">
                        The executed query successfully solved this level. You identified the suspect information and correctly compiled the data.
                      </p>
                      
                      {scoreEarnedInLevel !== null && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 pt-2 border-t border-[#30363D] text-[10px] font-mono text-gray-500">
                          <span>Base: <strong className="text-white">+100 PTS</strong></span>
                          {(progress.attemptsCount[level.id] || 1) <= 1 && (
                            <span>First Attempt: <strong className="text-white">+25 PTS</strong></span>
                          )}
                          {(progress.hintsUsedCount[level.id] || 0) === 0 && (
                            <span>No Hints: <strong className="text-white">+50 PTS</strong></span>
                          )}
                          <span className="text-blue-400 font-bold">Total: +{scoreEarnedInLevel} CREDITS</span>
                        </div>
                      )}

                      <div className="mt-3">
                        <button
                          id="btn-next-level"
                          onClick={handleNextLevel}
                          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold shadow-lg shadow-green-900/20 transition cursor-pointer"
                        >
                          {level.id === 15 ? 'COMPLETE ALL CASES' : level.id === 10 ? 'COMPLETE STANDARD (PROCEED TO ADVANCED)' : 'PROCEED TO NEXT LEVEL'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {validationMessage && (
                <div id="validation-error-block" className="bg-[#0D1117] border border-amber-500/30 rounded p-3.5 flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 text-xs font-bold">!</div>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-bold text-amber-500 mb-1">DATA VERIFICATION FAIL</h5>
                      <p className="text-[11px] text-[#8B949E] leading-relaxed font-mono">
                        {validationMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {queryError && (
                <div id="query-sql-error-block" className="bg-[#0D1117] border border-red-500/30 rounded p-3.5 flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 text-xs font-bold">✖</div>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-bold text-red-400 mb-1">COMPILER ERROR</h5>
                      <pre className="text-[11px] text-red-300 font-mono whitespace-pre-wrap leading-normal">
                        {queryError}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {!queryResult && !queryError && !validationMessage && (
                <div className="bg-[#0D1117] border border-[#30363D] rounded p-3.5 flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">?</div>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-bold text-blue-400 mb-1">AWAITING COMPILATION</h5>
                      <p className="text-[11px] text-[#8B949E] leading-relaxed font-sans">
                        No queries have been executed yet. Formulate your investigation queries in the editor above and hit <span className="text-white font-mono bg-[#161B22] px-1 rounded">EXECUTE</span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      {/* Footer Bar: Stats */}
      <footer className="h-10 bg-[#090C10] border-t border-[#30363D] px-4 flex items-center justify-between shrink-0 font-mono text-[10px]">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-tight">
              {level.id >= 11 ? 'Advanced Mission' : 'Standard Case'}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: level.id >= 11 ? 5 : 10 }).map((_, idx) => {
                const targetId = level.id >= 11 ? 11 + idx : 1 + idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-1 rounded-full ${
                      targetId < level.id
                        ? level.id >= 11 ? 'bg-amber-500' : 'bg-blue-500'
                        : targetId === level.id
                        ? level.id >= 11 ? 'bg-amber-500 animate-pulse' : 'bg-blue-500 animate-pulse'
                        : 'bg-[#30363D]'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[11px] font-mono text-white ml-2">
              {level.id >= 11 ? `${level.id - 10}/5` : `${level.id}/10`}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-3">
            <span className="text-[#8B949E]">SCORE:</span>
            <span className="text-white font-bold">{String(progress.totalScore).padStart(5, '0')}</span>
          </div>
          <div className="flex space-x-3">
            <span className="text-[#8B949E]">HINTS:</span>
            <span className="text-orange-400">{(3 - hintsUsedCount).toString().padStart(2, '0')} AVAILABLE</span>
          </div>
          <div className="flex space-x-2 items-center border border-[#30363D] rounded-full px-2 py-0.5 bg-[#161B22] hidden sm:flex">
            <span className="text-[#8B949E]">LATENCY:</span>
            <span className="text-green-500">12ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
