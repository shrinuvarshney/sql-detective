import React, { useState, useEffect, useRef } from 'react';
import { Level, QueryResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MessageSquare, ShieldAlert, Award, 
  HelpCircle, Sliders, Send, RefreshCw, Terminal, 
  BookOpen, ToggleLeft, ToggleRight, ArrowRight, BrainCircuit
} from 'lucide-react';
import { 
  fetchAiHint, fetchAiQueryReview, fetchStylizedStory, 
  fetchDetectiveReply, ChatMessage 
} from '../utils/aiApi';

interface AiHubSidebarProps {
  level: Level;
  userQuery: string;
  queryError: string | null;
  queryResult: QueryResult | null;
  validationMessage: string | null;
  isSuccess: boolean;
  activeBriefingStyle: 'standard' | 'cyberpunk_noir' | 'hightech_thrill' | 'retro_scifi';
  onApplyScaffold: (scaffold: string) => void;
  onStyleStory: (stylizedStory: string, styleName: 'standard' | 'cyberpunk_noir' | 'hightech_thrill' | 'retro_scifi') => void;
  onClose: () => void;
}

export default function AiHubSidebar({
  level,
  userQuery,
  queryError,
  queryResult,
  validationMessage,
  isSuccess,
  activeBriefingStyle,
  onApplyScaffold,
  onStyleStory,
  onClose
}: AiHubSidebarProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'review' | 'hints' | 'narrator' | 'scaler'>('chat');
  
  // Tab 1: Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Tab 2: Code Review States
  const [queryReview, setQueryReview] = useState<string | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // Tab 3: Interactive Hint States
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  // Tab 4: Narrative Briefing States
  const [isNarratorLoading, setIsNarratorLoading] = useState(false);

  // Tab 5: Difficulty Scaling States
  const [isAssistedMode, setIsAssistedMode] = useState(false);

  // Initialize Detective Sentinel greeting when Level changes
  useEffect(() => {
    setChatMessages([
      { 
        role: 'model', 
        content: `Greetings Agent. I am Detective Sentinel, your offline forensic advisor. \n\nI have loaded the telemetry footprint database for "${level.title}". \n\nAsk me anything about SQL syntax, table logic, or investigation guidelines, and I will coach you through. Remember: I provide guidance, but I will never write the final code for you.` 
      }
    ]);
    setQueryReview(null);
    setAiHint(null);
  }, [level]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Tab 1: Submit Detective Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsgText = chatInput.trim();
    const updatedMessages = [...chatMessages, { role: 'user' as const, content: userMsgText }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const levelContext = {
        title: level.title,
        story: level.story,
        objective: level.objective,
        schema: level.databaseSchema
      };

      const reply = await fetchDetectiveReply({
        messages: updatedMessages,
        levelContext
      });

      setChatMessages(prev => [...prev, { role: 'model' as const, content: reply }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'model' as const, content: `CRITICAL TELEMETRY ERR: ${err.message || 'Connection offline.'}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Tab 2: Trigger Forensic Code Review
  const handleTriggerReview = async () => {
    setIsReviewLoading(true);
    setQueryReview(null);
    try {
      const review = await fetchAiQueryReview({
        query: userQuery,
        isCorrect: isSuccess,
        errorMsg: queryError || validationMessage,
        objective: level.objective,
        expectedQuery: level.expectedQuery,
        schema: level.databaseSchema
      });
      setQueryReview(review);
    } catch (err: any) {
      setQueryReview(`Unable to review query: ${err.message || 'System offline error.'}`);
    } finally {
      setIsReviewLoading(false);
    }
  };

  // Tab 3: Request Draft Hint (tailored to current user query)
  const handleRequestAiHint = async () => {
    setIsHintLoading(true);
    setAiHint(null);
    try {
      const hint = await fetchAiHint({
        levelId: level.id,
        incorrectQuery: userQuery,
        errorMsg: queryError || validationMessage,
        objective: level.objective,
        story: level.story,
        schema: level.databaseSchema
      });
      setAiHint(hint);
    } catch (err: any) {
      setAiHint(`Forensic analysis error: ${err.message || 'Failed to sync with headquarters.'}`);
    } finally {
      setIsHintLoading(false);
    }
  };

  // Tab 4: Change Story Style
  const handleSelectStoryStyle = async (styleName: 'standard' | 'cyberpunk_noir' | 'hightech_thrill' | 'retro_scifi') => {
    if (styleName === 'standard') {
      onStyleStory(level.story, 'standard');
      return;
    }
    setIsNarratorLoading(true);
    try {
      const stylized = await fetchStylizedStory({
        story: level.story,
        objective: level.objective,
        style: styleName
      });
      onStyleStory(stylized, styleName);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsNarratorLoading(false);
    }
  };

  // Tab 5: Get Code Scaffold
  const generateCodeScaffold = () => {
    // Generate a beautiful, partial SQL scaffold based on level concepts
    const conceptUpper = level.concept.toUpperCase();
    let scaffold = '';
    
    if (conceptUpper.includes('JOIN')) {
      scaffold = `-- Forensics Scaffolding for INNER/LEFT JOIN\nSELECT t1.column_a, t2.column_b \nFROM table_one AS t1 \nJOIN table_two AS t2 \nON t1.key_id = t2.key_id \nWHERE ...;`;
    } else if (conceptUpper.includes('GROUP') || conceptUpper.includes('HAVING') || conceptUpper.includes('COUNT') || conceptUpper.includes('SUM')) {
      scaffold = `-- Forensics Scaffolding for Aggregate GROUP BY\nSELECT column_name, COUNT(*) AS event_count, SUM(bytes_transferred) \nFROM table_name \nWHERE ... \nGROUP BY column_name \nHAVING event_count > ...;`;
    } else if (conceptUpper.includes('WHERE') || conceptUpper.includes('LIKE') || conceptUpper.includes('LIMIT')) {
      scaffold = `-- Forensics Scaffolding for Filtering WHERE & LIKE\nSELECT * \nFROM table_name \nWHERE column_name LIKE '%pattern%' \nORDER BY column_sort DESC \nLIMIT ...;`;
    } else {
      scaffold = `-- Forensics Standard Scaffolding\nSELECT column1, column2 \nFROM table_name \nWHERE condition_here;`;
    }

    onApplyScaffold(scaffold);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#161B22]/50 font-sans border-[#30363D] relative overflow-hidden">
      
      {/* Header */}
      <div className="p-3 border-b border-[#30363D] bg-[#161B22] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">SENTINEL CO-PILOT</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-white text-[10px] font-mono border border-[#30363D] hover:bg-gray-800 px-1.5 py-0.5 rounded transition cursor-pointer"
        >
          COLLAPSE // ESC
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="grid grid-cols-5 border-b border-[#30363D] bg-[#0D1117] text-[10px] font-mono shrink-0">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`py-2 text-center border-r border-[#30363D] transition ${activeTab === 'chat' ? 'bg-[#161B22] text-blue-400 font-bold border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          title="Detective Sentinel Assistant Chat"
        >
          <MessageSquare className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>CHAT</span>
        </button>
        <button 
          onClick={() => setActiveTab('review')}
          className={`py-2 text-center border-r border-[#30363D] transition ${activeTab === 'review' ? 'bg-[#161B22] text-blue-400 font-bold border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          title="Rule-Based Forensic Code Reviewer"
        >
          <Terminal className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>REVIEW</span>
        </button>
        <button 
          onClick={() => setActiveTab('hints')}
          className={`py-2 text-center border-r border-[#30363D] transition ${activeTab === 'hints' ? 'bg-[#161B22] text-blue-400 font-bold border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          title="Progressive Draft Hints"
        >
          <HelpCircle className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>HINTS</span>
        </button>
        <button 
          onClick={() => setActiveTab('narrator')}
          className={`py-2 text-center border-r border-[#30363D] transition ${activeTab === 'narrator' ? 'bg-[#161B22] text-blue-400 font-bold border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          title="Story Briefing Theme Stylist"
        >
          <BookOpen className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>STORY</span>
        </button>
        <button 
          onClick={() => setActiveTab('scaler')}
          className={`py-2 text-center transition ${activeTab === 'scaler' ? 'bg-[#161B22] text-blue-400 font-bold border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          title="Assisted Debugging Settings"
        >
          <Sliders className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>SCALER</span>
        </button>
      </div>

      {/* Main tab canvas area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0 bg-[#0D1117]/65">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Detective Chat */}
          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex flex-col h-full min-h-0"
            >
              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 pb-4 max-h-[380px] scrollbar-thin scrollbar-thumb-gray-800">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-1.5 mb-1 text-[9px] font-mono uppercase tracking-widest text-gray-500">
                      <span>{msg.role === 'user' ? 'OPERATIVE' : 'DET. SENTINEL'}</span>
                    </div>
                    <div className={`p-3 rounded-xl max-w-[90%] text-xs font-sans leading-relaxed shadow-md border ${
                      msg.role === 'user' 
                        ? 'bg-blue-600/10 border-blue-500/20 text-blue-100 rounded-tr-none' 
                        : 'bg-[#161B22] border-[#30363D] text-[#C9D1D9] rounded-tl-none'
                    }`}>
                      {msg.content.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className={line.trim() === '' ? 'h-2' : 'mb-1 last:mb-0'}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex flex-col items-start animate-pulse">
                    <span className="text-[9px] font-mono uppercase text-gray-500 mb-1">DET. SENTINEL is thinking...</span>
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-xl text-xs text-gray-400 rounded-tl-none flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat input form */}
              <form onSubmit={handleSendChat} className="mt-auto pt-3 border-t border-[#30363D]/40 flex space-x-2 shrink-0">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Sentinel (e.g., 'What is JOIN?')..."
                  disabled={isChatLoading}
                  className="flex-1 bg-[#161B22] border border-[#30363D] hover:border-blue-500/50 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-sans transition"
                />
                <button 
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-[#161B22] disabled:text-gray-600 disabled:border-[#30363D] border border-blue-500/20 text-white p-2 rounded-lg transition shrink-0 cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 2: Forensic Query Reviewer */}
          {activeTab === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 font-mono text-xs text-gray-300"
            >
              <div className="p-3 border border-blue-500/20 bg-blue-500/5 rounded-xl space-y-2">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-blue-400">SQL SOURCE REGISTER</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded border border-[#30363D] text-[10px] text-emerald-400 font-mono overflow-x-auto whitespace-pre">
                  {userQuery || "-- No query drafted yet."}
                </div>
              </div>

              <button 
                onClick={handleTriggerReview}
                disabled={isReviewLoading || !userQuery.trim()}
                className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 hover:text-blue-300 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-2"
              >
                {isReviewLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>ANALYZING QUERY Footprints...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RUN FORENSIC SQL AUDIT</span>
                  </>
                )}
              </button>

              {queryReview && (
                <div className="p-4 bg-[#161B22]/60 border border-[#30363D] rounded-xl text-xs font-sans leading-relaxed text-gray-300 whitespace-pre-wrap">
                  {queryReview}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Smart Hint Assistant */}
          {activeTab === 'hints' && (
            <motion.div 
              key="hints"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                <p className="text-xs text-amber-300/80 leading-relaxed font-sans">
                  The standard hints reveal specific fields or syntax structures. The **Forensic Hint Analyzer** analyzes your actual incorrect draft and points out logical bugs or missing predicates in real-time.
                </p>
              </div>

              <button 
                onClick={handleRequestAiHint}
                disabled={isHintLoading || !userQuery.trim() || isSuccess}
                className={`w-full py-2.5 text-xs font-bold rounded-lg border transition flex items-center justify-center space-x-2 ${isSuccess ? 'bg-[#161B22] border-[#30363D] text-gray-600 cursor-not-allowed' : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400 hover:text-amber-300 cursor-pointer'}`}
              >
                {isHintLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>CALCULATING COGNITIVE LOGIC CLUE...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>ANALYZE MY DRAFT QUERY</span>
                  </>
                )}
              </button>

              {aiHint && (
                <div className="p-4 bg-[#161B22] border border-amber-500/20 text-amber-100 rounded-xl text-xs font-sans leading-relaxed shadow-lg">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-amber-400 mb-2 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Forensic Clue Synthesizer Output</span>
                  </div>
                  {aiHint}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Story Briefing Style */}
          {activeTab === 'narrator' && (
            <motion.div 
              key="narrator"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 font-sans text-xs"
            >
              <p className="text-gray-400 text-xs leading-relaxed">
                Choose a narrative voice profile. The local briefing engine will stylize your current case file briefing into a detailed dramatic theme!
              </p>

              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'standard', name: 'Standard DFA Briefing', desc: 'Sober military-grade digital forensics agency report.' },
                  { id: 'cyberpunk_noir', name: 'Cyberpunk Noir Style', desc: 'Rain-soaked alleys, cyber-implants, gritty hacker-detective monologues.' },
                  { id: 'hightech_thrill', name: 'High-Tech Action Style', desc: 'Urgent system sirens, ticking timers, elite cyber-espionage infiltration.' },
                  { id: 'retro_scifi', name: 'Retro Sci-Fi Style', desc: 'Magnetic tapes, blinking console lights, early space-age terminal grids.' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStoryStyle(s.id as any)}
                    disabled={isNarratorLoading}
                    className={`p-3 text-left border rounded-xl transition cursor-pointer flex flex-col space-y-1 ${activeBriefingStyle === s.id ? 'bg-blue-500/10 border-blue-500 text-blue-200' : 'bg-[#161B22] border-[#30363D] text-gray-400 hover:border-gray-500 hover:text-white'}`}
                  >
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">{s.name}</span>
                    <span className="text-[10px] opacity-75">{s.desc}</span>
                  </button>
                ))}
              </div>

              {isNarratorLoading && (
                <div className="flex items-center justify-center space-x-2 py-4 text-blue-400 animate-pulse font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>STYLIZE NARRATIVE IN MAIN BRIEFING...</span>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: Difficulty Scaling */}
          {activeTab === 'scaler' && (
            <motion.div 
              key="scaler"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 font-sans text-xs text-gray-300"
            >
              <p className="text-gray-400 text-xs leading-relaxed">
                If the current case file database is too complex or demanding, toggle Assisted Debugging to access local scaffolding support and logical checkpoints.
              </p>

              <div className="p-3 border border-[#30363D] bg-[#161B22]/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold block text-white text-xs uppercase tracking-wider">ASSISTED DEBUGGING MODE</span>
                  <span className="text-[10px] text-gray-500">Injects boilerplate SQL scaffold in your workspace.</span>
                </div>
                <button 
                  onClick={() => setIsAssistedMode(!isAssistedMode)}
                  className="text-blue-400 transition cursor-pointer"
                >
                  {isAssistedMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-600" />}
                </button>
              </div>

              <AnimatePresence>
                {isAssistedMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-2">
                      <span className="font-mono font-bold text-blue-400 text-[10px] uppercase tracking-wider block">TARGET FIELD TELEMETRY</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-400">
                        <li>Identified Main Concept: <strong className="text-blue-300 font-mono text-[10px]">{level.concept}</strong></li>
                        <li>Source Target Keys: <strong className="text-blue-300 font-mono text-[10px]">{level.hints[0] || 'Suspects'}</strong></li>
                        <li>Required Conditions: <strong className="text-blue-300 font-mono text-[10px]">{level.hints[1] || 'Age, location'}</strong></li>
                      </ul>
                    </div>

                    <button
                      onClick={generateCodeScaffold}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 border border-blue-500/20 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>INJECT BOILERPLATE SCAFFOLD</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
