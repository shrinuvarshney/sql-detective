import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldAlert, Play, ArrowRight, CheckCircle2, 
  Database, Code, Sparkles, Trophy, HelpCircle, Compass, 
  Map, UserCheck, Lock, ChevronRight, Server, Search, Globe, Flame
} from 'lucide-react';

interface LandingPageProps {
  user: any;
  onStartInvestigation: () => void;
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
}

export default function LandingPage({
  user,
  onStartInvestigation,
  onOpenDashboard,
  onOpenAuth
}: LandingPageProps) {
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationText, setSimulationText] = useState('');
  const [simulationState, setSimulationState] = useState<'typing' | 'running' | 'success'>('typing');

  // Interactive SQL Simulation Logic
  const sqlQuery = "SELECT node_ip, breach_point, threat_level FROM security_logs WHERE payload LIKE '%malware_compromise%' ORDER BY threat_level DESC LIMIT 3;";

  useEffect(() => {
    let timer: any;
    if (simulationState === 'typing') {
      if (simulationText.length < sqlQuery.length) {
        timer = setTimeout(() => {
          setSimulationText(sqlQuery.substring(0, simulationText.length + 1));
        }, 35);
      } else {
        timer = setTimeout(() => {
          setSimulationState('running');
        }, 1500);
      }
    } else if (simulationState === 'running') {
      timer = setTimeout(() => {
        setSimulationState('success');
      }, 2000);
    } else if (simulationState === 'success') {
      timer = setTimeout(() => {
        // Reset the loop
        setSimulationText('');
        setSimulationState('typing');
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [simulationText, simulationState]);

  return (
    <div id="landing-page" className="min-h-screen bg-[#0D1117] text-[#E6EDF3] font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Visual cyber mesh background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-20 -left-40 w-[600px] h-[600px] bg-green-500/2 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -right-40 w-[600px] h-[600px] bg-blue-500/2 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-30 w-full h-16 border-b border-[#30363D] bg-[#0D1117]/85 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-md shadow-blue-500/5">
            <Terminal className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-tight text-white uppercase flex items-center">
              SQL DETECTIVE <span className="text-blue-500 font-mono text-[9px] ml-1.5 border border-blue-500/20 bg-blue-500/5 px-1 py-0.2 rounded font-bold uppercase">v0.5.0</span>
            </span>
            <span className="text-[8px] font-mono text-gray-500 uppercase block tracking-wider -mt-0.5">CYBER DIGITAL FORENSICS</span>
          </div>
        </div>

        <div className="flex items-center space-x-3.5">
          {/* Internal links for scannability */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-gray-400 font-semibold uppercase">
            <a href="#story" className="hover:text-white transition">Briefing</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#roadmap" className="hover:text-white transition">Roadmap</a>
            <a href="#simulation" className="hover:text-white transition">Preview</a>
          </nav>

          <div className="h-4 w-[1px] bg-[#30363D] hidden md:block" />

          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg font-bold uppercase tracking-wider hidden sm:inline-flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1"></span>
                CONNECTED
              </span>
              <button
                id="btn-nav-dashboard"
                onClick={onOpenDashboard}
                className="py-1.5 px-3.5 bg-[#161B22] border border-[#30363D] text-[#C9D1D9] hover:text-white rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5 uppercase tracking-wider hover:border-blue-500/45"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>DASHBOARD</span>
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-auth"
              onClick={onOpenAuth}
              className="py-1.5 px-4 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5 uppercase tracking-wider"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>TERMINAL LOGIN</span>
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle decorative chip */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-blue-500/5 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-blue-400 tracking-wider uppercase mb-6"
        >
          <Flame className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
          <span>Interactive SQLite Forensics RPG Simulator</span>
        </motion.div>

        {/* Display Typography pair */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase max-w-4xl"
        >
          CRACK CORPORATE SYSTEM INTRUSIONS WITH <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.15)]">REAL SQL QUERIES</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm md:text-base text-gray-400 max-w-2xl font-sans leading-relaxed"
        >
          Step into the cyber-forensic suit of a digital investigator. Analyze breach payloads, trace money launderers, and bypass security firewalls using actual in-memory SQLite tables. No dry lectures — purely mission-based investigative puzzles.
        </motion.p>

        {/* Main Hero Call-to-Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
        >
          <button
            id="btn-hero-play"
            onClick={onStartInvestigation}
            className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-mono font-bold tracking-wider uppercase shadow-lg shadow-green-900/15 transition transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Play className="w-4 h-4 fill-current text-white shrink-0" />
            <span>START INVESTIGATION</span>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </button>

          {user ? (
            <button
              id="btn-hero-dashboard"
              onClick={onOpenDashboard}
              className="w-full sm:w-auto px-8 py-4 bg-[#161B22] border border-[#30363D] text-[#C9D1D9] hover:text-white rounded-xl text-sm font-mono font-bold tracking-wider uppercase hover:bg-[#1C2128] hover:border-blue-500/40 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>ACCESS HQ DASHBOARD</span>
            </button>
          ) : (
            <button
              id="btn-hero-learn-more"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 bg-[#161B22] border border-[#30363D] text-[#C9D1D9] hover:text-white rounded-xl text-sm font-mono font-bold tracking-wider uppercase hover:bg-[#1C2128] hover:border-blue-500/40 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>REGISTER OPERATIVE</span>
            </button>
          )}
        </motion.div>

        {/* Active connection log footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 font-mono text-[9px] text-gray-500 flex items-center space-x-4 uppercase tracking-widest"
        >
          <span>GRID SECURE // STABLE_LATENCY</span>
          <span>•</span>
          <span>SQLite 3 RUNTIME ATTACHED</span>
          <span>•</span>
          <span>50 TOTAL THREAT CASEFILES</span>
        </motion.div>

      </section>

      {/* INTERACTIVE SQL SIMULATION TRAILER */}
      <section id="simulation" className="py-12 md:py-20 px-4 md:px-8 border-y border-[#30363D] bg-[#161B22]/10 relative">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-white">LIVE SIMULATED SYSTEM BREACH</h2>
            <p className="text-xs text-gray-400 mt-1 font-mono uppercase tracking-widest">Observe the forensic query engine trace suspect servers in real-time</p>
          </div>

          {/* Simulated IDE Terminal Container */}
          <div className="border border-[#30363D] bg-[#161B22]/75 rounded-2xl overflow-hidden shadow-2xl relative backdrop-blur">
            {/* Top title-bar */}
            <div className="h-10 bg-[#161B22] border-b border-[#30363D] px-4 flex items-center justify-between shrink-0 font-mono text-xs text-[#8B949E]">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-2">cyber_forensics_ide : query.sql</span>
              </div>
              <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded font-bold uppercase">LIVE DEMO</span>
            </div>

            {/* Editor Workspace Mock */}
            <div className="p-4 bg-[#0D1117]/95 font-mono text-xs md:text-sm min-h-[160px] flex flex-col justify-between">
              <div>
                <span className="text-gray-500 select-none mr-3">01</span>
                <span className="text-purple-400 font-semibold">-- FORENSICS DECRYPTION PAYLOAD</span>
              </div>
              <div className="mt-2.5 flex items-start">
                <span className="text-gray-500 select-none mr-3 mt-0.5">02</span>
                <span className="text-white break-all whitespace-pre-wrap flex-1">
                  {simulationText}
                  <span className="w-2 h-4.5 bg-blue-500 inline-block animate-pulse ml-0.5 align-middle" />
                </span>
              </div>

              {/* Status footer for editor simulation */}
              <div className="mt-6 pt-3 border-t border-[#30363D]/40 flex items-center justify-between text-[10px] text-gray-500 uppercase">
                <span>SQL PARSER COMPILER: v2.4</span>
                <span className="flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${simulationState === 'typing' ? 'bg-amber-500 animate-pulse' : simulationState === 'running' ? 'bg-blue-500 animate-spin' : 'bg-green-500'}`} />
                  <span className="font-bold">{simulationState === 'typing' ? 'WRITING QUEUE' : simulationState === 'running' ? 'QUERY RUNNING' : 'MATCH DETECTED'}</span>
                </span>
              </div>
            </div>

            {/* Simulation Results grid output */}
            <div className="p-4 bg-[#161B22]/50 border-t border-[#30363D] min-h-[160px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {simulationState === 'typing' && (
                  <motion.div 
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6 text-center text-gray-500 font-mono space-y-2"
                  >
                    <Search className="w-7 h-7 text-gray-600 animate-pulse" />
                    <p className="text-[10px] uppercase tracking-wider">Awaiting query compilation from forensics lab...</p>
                  </motion.div>
                )}

                {simulationState === 'running' && (
                  <motion.div 
                    key="running"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6 text-center text-blue-400 font-mono space-y-2"
                  >
                    <Server className="w-7 h-7 text-blue-500 animate-spin" />
                    <p className="text-[10px] uppercase tracking-wider font-bold">Scanning SQLite indexes & matching log payloads...</p>
                  </motion.div>
                )}

                {simulationState === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Success notification banner */}
                    <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] rounded-lg font-mono font-bold flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="uppercase tracking-widest animate-pulse">MATCH SECURED: payload match found in 3 corporate nodes!</span>
                    </div>

                    {/* Table records representation */}
                    <div className="border border-[#30363D] bg-[#0D1117] rounded-xl overflow-hidden font-mono text-[10px] shadow-inner">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#161B22] border-b border-[#30363D] text-gray-500">
                            <th className="px-3 py-1.5 uppercase font-bold tracking-wider border-r border-[#30363D]/50">node_ip</th>
                            <th className="px-3 py-1.5 uppercase font-bold tracking-wider border-r border-[#30363D]/50">breach_point</th>
                            <th className="px-3 py-1.5 uppercase font-bold tracking-wider">threat_level</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#30363D]/40 text-gray-200">
                            <td className="px-3 py-1.5 border-r border-[#30363D]/30">192.168.22.84</td>
                            <td className="px-3 py-1.5 border-r border-[#30363D]/30 text-red-400 font-bold">/api/v1/auth/compromise</td>
                            <td className="px-3 py-1.5 text-amber-500 font-bold">98/100</td>
                          </tr>
                          <tr className="border-b border-[#30363D]/40 text-gray-200">
                            <td className="px-3 py-1.5 border-r border-[#30363D]/30">10.0.155.12</td>
                            <td className="px-3 py-1.5 border-r border-[#30363D]/30 text-red-400 font-bold">/admin/billing/delete_logs</td>
                            <td className="px-3 py-1.5 text-amber-500 font-bold">87/100</td>
                          </tr>
                          <tr className="text-gray-200">
                            <td className="px-3 py-1.5 border-r border-[#30363D]/30">172.16.8.99</td>
                            <td className="px-3 py-1.5 border-r border-[#30363D]/30 text-red-400 font-bold">/ssh/remote_shell_exec</td>
                            <td className="px-3 py-1.5 text-amber-500 font-bold">75/100</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onStartInvestigation}
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-blue-400 hover:text-blue-300 group transition"
            >
              <span>RUN YOUR FIRST DETECTIVE QUERY NOW</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </section>

      {/* STORY BRIEFING OVERVIEW */}
      <section id="story" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/5 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CLASSIFIED INTELLIGENCE DOSSIER</span>
            </div>

            <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
              THE STORY: CRISIS IN THE MAINFRAME
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              Corporate ecosystems worldwide are facing the largest coordinated server intrusion in digital history. Backdoors are being planted, ledger files are being laundered, and high-value system assets are vanishing into darknet addresses.
            </p>

            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              As a special analyst at the **Digital Forensics Agency (DFA)**, you are dispatched directly into these systems. With access to the raw internal database backups of compromised terminals, your query window is the only filter that can separate innocent employee data from the footprints of high-profile hackers.
            </p>

            <div className="border border-[#30363D] bg-[#161B22]/40 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2">
              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">TACTICAL WEAPON SPECIFICATIONS</h4>
              <p className="italic text-gray-400 text-[11px]">
                "The SQLite shell represents the ultimate cyber magnifier. Standard queries expose patterns, JOINS trace foreign-key wallets, aggregates extract exact financial damages, and subqueries capture the elusive root processes."
              </p>
            </div>
          </div>

          {/* Dossier Visual Mockup */}
          <div className="lg:col-span-5 border border-[#30363D] bg-[#161B22]/50 rounded-2xl p-6 font-mono space-y-5 shadow-xl relative overflow-hidden backdrop-blur">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3 text-gray-500 text-[10px]">
              <span>DFA CASEFILE DIRECTORY</span>
              <span className="text-amber-500 font-semibold animate-pulse">AMBER THREAT GRID</span>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex justify-between border-b border-[#30363D]/40 pb-1.5">
                <span className="text-gray-500 uppercase font-bold text-[9px]">PROJECT STATUS:</span>
                <span className="text-blue-400 font-bold">ACTIVE INTRUSION</span>
              </div>
              <div className="flex justify-between border-b border-[#30363D]/40 pb-1.5">
                <span className="text-gray-500 uppercase font-bold text-[9px]">TARGET MAINFRAME:</span>
                <span className="text-white">COSMO_SYS_99</span>
              </div>
              <div className="flex justify-between border-b border-[#30363D]/40 pb-1.5">
                <span className="text-gray-500 uppercase font-bold text-[9px]">AUTHORIZED RANKS:</span>
                <span className="text-emerald-400 font-semibold">ALL DFA AGENTS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase font-bold text-[9px]">FORENSICS PROTOCOL:</span>
                <span className="text-white font-bold">SQLITE-STANDALONE</span>
              </div>
            </div>

            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-center space-y-2">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block">INTEL THREAT CAMPAIGNS</span>
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <span className="block text-lg font-bold text-blue-400">01</span>
                  <span className="text-[8px] text-gray-500 uppercase">Database Logs</span>
                </div>
                <div className="w-[1px] h-6 bg-[#30363D]" />
                <div className="text-center">
                  <span className="block text-lg font-bold text-indigo-400">02</span>
                  <span className="text-[8px] text-gray-500 uppercase">Decryption</span>
                </div>
                <div className="w-[1px] h-6 bg-[#30363D]" />
                <div className="text-center">
                  <span className="block text-lg font-bold text-emerald-400">03</span>
                  <span className="text-[8px] text-gray-500 uppercase">Financials</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GAMEPLAY FEATURES BENTO GRID */}
      <section id="features" className="py-20 px-4 md:px-8 border-t border-[#30363D] bg-[#161B22]/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-14">
            <div className="inline-flex items-center space-x-1.5 text-[9px] font-mono font-bold text-blue-400 bg-blue-500/5 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>DFA CAPABILITIES AUDIT</span>
            </div>
            <h2 className="font-display font-black text-3xl uppercase tracking-tight text-white">GAMEPLAY SPECIFICATIONS</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto mt-2">Explore the highly immersive forensic tools engineered directly inside the SQL Detective platform</p>
          </div>

          {/* Bento-style Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1: 50 Case Files */}
            <div className="md:col-span-8 border border-[#30363D] bg-[#161B22]/60 hover:bg-[#161B22] hover:border-blue-500/30 transition duration-300 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-4">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">50 Progressive Forensic Threat Campaigns</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Navigate through five immersive story chapters spanning 50 meticulously graded SQL levels. Progress seamlessly from basic conditional selection queries to nested subqueries and composite logical mainframe bypass codes.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono font-semibold">
                <span className="px-2 py-0.5 bg-[#0D1117] border border-[#30363D] text-gray-400 rounded-lg uppercase">Basic Queries</span>
                <span className="px-2 py-0.5 bg-[#0D1117] border border-[#30363D] text-gray-400 rounded-lg uppercase">GROUP BY Filter</span>
                <span className="px-2 py-0.5 bg-[#0D1117] border border-[#30363D] text-gray-400 rounded-lg uppercase">Subqueries</span>
              </div>
            </div>

            {/* Feature 2: Intel Hints */}
            <div className="md:col-span-4 border border-[#30363D] bg-[#161B22]/60 hover:bg-[#161B22] hover:border-amber-500/25 transition duration-300 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">Multi-Layer Intelligence Bank</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Stuck on an isolated threat server? Deduct earned Evidence Points (EP) to unlock multi-layered cryptographic hints, providing target tables, column clues, and syntax guidance sequentially.
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold mt-6">EP RESOURCES LEDGER</span>
            </div>

            {/* Feature 3: Schema Inspector */}
            <div className="md:col-span-4 border border-[#30363D] bg-[#161B22]/60 hover:bg-[#161B22] hover:border-emerald-500/25 transition duration-300 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">Interactive Schema Inspector</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Browse relational structures inside active sandboxed terminals. Simply click table schemas or fields to inject them instantly into your SQL cursor selection box.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold mt-6">DYNAMIC SQL RUNTIME</span>
            </div>

            {/* Feature 4: RPG Dossier Upgrades */}
            <div className="md:col-span-8 border border-[#30363D] bg-[#161B22]/60 hover:bg-[#161B22] hover:border-blue-500/30 transition duration-300 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-4">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">Operative Ranks, Avatars & Dossiers</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Earn credits, gather Evidence Points, and accumulate experience on every successful compilation check. Build your official operative dossier, unlock achievements, and level up to command higher security ranks. Spend credits in the Academy Store to purchase rare operative badges and profile avatars.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono font-semibold">
                <span className="px-2 py-0.5 bg-[#0D1117] border border-[#30363D] text-gray-400 rounded-lg uppercase">Earn Ledger Credits</span>
                <span className="px-2 py-0.5 bg-[#0D1117] border border-[#30363D] text-gray-400 rounded-lg uppercase">Unlock 8 Rare Avatars</span>
                <span className="px-2 py-0.5 bg-[#0D1117] border border-[#30363D] text-gray-400 rounded-lg uppercase">Academy Promotion system</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* LEARNING ROADMAP SECTION */}
      <section id="roadmap" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-1.5 text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Map className="w-3.5 h-3.5 text-indigo-400" />
            <span>DFA ACADEMY SYLLABUS</span>
          </div>
          <h2 className="font-display font-black text-3xl uppercase tracking-tight text-white">THE LEARNING ROADMAP</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto mt-2">Our sequential training grid guides you cleanly from database recruit to elite cryptographic master</p>
        </div>

        {/* Linear/branching Roadmap Visualization */}
        <div className="space-y-8 max-w-3xl mx-auto relative before:absolute before:left-4 md:before:left-1/2 before:top-4 before:bottom-4 before:w-[1px] before:bg-[#30363D]">
          
          {/* Phase 1 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#161B22] border-2 border-blue-500 flex items-center justify-center text-blue-400 font-mono text-xs font-bold z-10 shadow-lg shadow-blue-500/10">
              01
            </div>
            <div className="pl-12 md:pl-0 md:w-[45%] md:text-right">
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest">CHAPTER 1 (LVLS 1-10)</span>
              <h3 className="text-base font-bold text-white uppercase mt-0.5">Database Breaches</h3>
              <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                Master the fundamental query commands: filtering row sets with standard conditional queries, exact patterns (`LIKE`), logical sorting order, and index limit rules.
              </p>
            </div>
            <div className="hidden md:block w-[45%]" />
          </div>

          {/* Phase 2 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#161B22] border-2 border-purple-500 flex items-center justify-center text-purple-400 font-mono text-xs font-bold z-10 shadow-lg shadow-purple-500/10">
              02
            </div>
            <div className="hidden md:block w-[45%]" />
            <div className="pl-12 md:pl-0 md:w-[45%] md:text-left">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">CHAPTER 2 (LVLS 11-20)</span>
              <h3 className="text-base font-bold text-white uppercase mt-0.5">Shadow Traces</h3>
              <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                Hone analytical skills by aggregate counts and grouping log patterns. Learn how to combine logs using `GROUP BY` and evaluate aggregates using `HAVING`.
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#161B22] border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold z-10 shadow-lg shadow-emerald-500/10">
              03
            </div>
            <div className="pl-12 md:pl-0 md:w-[45%] md:text-right">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">CHAPTER 3 (LVLS 21-30)</span>
              <h3 className="text-base font-bold text-white uppercase mt-0.5">Financial Forensics</h3>
              <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                Connect split transactions across networks. Perform standard table joining operations (`INNER JOIN`, `LEFT JOIN`) to reconstruct missing cyber logs and coin wallet histories.
              </p>
            </div>
            <div className="hidden md:block w-[45%]" />
          </div>

          {/* Phase 4 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#161B22] border-2 border-amber-500 flex items-center justify-center text-amber-400 font-mono text-xs font-bold z-10 shadow-lg shadow-amber-500/10">
              04
            </div>
            <div className="hidden md:block w-[45%]" />
            <div className="pl-12 md:pl-0 md:w-[45%] md:text-left">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">CHAPTER 4 (LVLS 31-40)</span>
              <h3 className="text-base font-bold text-white uppercase mt-0.5">Mainframe Intrusion</h3>
              <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                Construct powerful nested expressions. Isolate rogue database server threads using aggregate subqueries, conditional existence filters (`EXISTS`), and membership parameters (`IN`).
              </p>
            </div>
          </div>

          {/* Phase 5 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#161B22] border-2 border-red-500 flex items-center justify-center text-red-400 font-mono text-xs font-bold z-10 shadow-lg shadow-red-500/10 animate-pulse">
              05
            </div>
            <div className="pl-12 md:pl-0 md:w-[45%] md:text-right">
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest">CHAPTER 5 (LVLS 41-50)</span>
              <h3 className="text-base font-bold text-white uppercase mt-0.5">The Crypt Overlord</h3>
              <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                Tackle composite scenarios that test the ultimate limits of SQLite databases. Build intricate, compound statements to completely seal the mainframe gateway once and for all.
              </p>
            </div>
            <div className="hidden md:block w-[45%]" />
          </div>

        </div>
      </section>

      {/* SCREENSHOTS / GAMEPLAY PREVIEW */}
      <section className="py-20 px-4 md:px-8 border-t border-[#30363D] bg-[#161B22]/15">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-3xl uppercase tracking-tight text-white">THE WORKSPACE INTERFACE</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto mt-2">Engineered directly for code efficiency, security analysis, and high-contrast execution checks</p>
          </div>

          {/* Screenshot columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Visual Screen 1 */}
            <div className="border border-[#30363D] bg-[#161B22]/80 rounded-2xl p-4 shadow-xl font-mono">
              <div className="flex items-center space-x-2 border-b border-[#30363D]/65 pb-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-white font-bold uppercase">MODULE 01: DATABASE SCHEMA EXPLORER</span>
              </div>
              
              <div className="space-y-3 bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-xs">
                <div className="flex items-center justify-between text-[#8B949E] border-b border-[#30363D]/40 pb-2">
                  <span className="font-bold flex items-center space-x-1.5"><Database className="w-3.5 h-3.5 text-blue-400" /> <span>security_logs</span></span>
                  <span className="text-[9px]">5 COLUMNS FOUND</span>
                </div>
                <div className="space-y-2 pl-2">
                  <div className="flex justify-between hover:bg-[#161B22] p-1 rounded transition">
                    <span className="text-[#C9D1D9]">log_id</span>
                    <span className="text-gray-500 italic">INTEGER (PRIMARY KEY)</span>
                  </div>
                  <div className="flex justify-between hover:bg-[#161B22] p-1 rounded transition">
                    <span className="text-[#C9D1D9]">timestamp</span>
                    <span className="text-gray-500 italic">TEXT</span>
                  </div>
                  <div className="flex justify-between hover:bg-[#161B22] p-1 rounded transition">
                    <span className="text-[#C9D1D9]">server_ip</span>
                    <span className="text-gray-500 italic">TEXT</span>
                  </div>
                  <div className="flex justify-between hover:bg-[#161B22] p-1 rounded transition">
                    <span className="text-[#C9D1D9]">payload</span>
                    <span className="text-gray-500 italic">TEXT</span>
                  </div>
                  <div className="flex justify-between hover:bg-[#161B22] p-1 rounded transition">
                    <span className="text-[#C9D1D9]">status</span>
                    <span className="text-gray-500 italic">TEXT</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3 italic text-center">Interactive grid: Simply click column keywords to inject them into the code buffer instantly.</p>
            </div>

            {/* Visual Screen 2 */}
            <div className="border border-[#30363D] bg-[#161B22]/80 rounded-2xl p-4 shadow-xl font-mono">
              <div className="flex items-center space-x-2 border-b border-[#30363D]/65 pb-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-white font-bold uppercase">MODULE 02: COGNITIVE INTEL HINTS</span>
              </div>

              <div className="space-y-3 bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-xs">
                <div className="flex items-center justify-between text-amber-400 border-b border-[#30363D]/40 pb-2">
                  <span className="font-bold flex items-center space-x-1.5"><HelpCircle className="w-3.5 h-3.5" /> <span>SECURE ACADEMY INTEL</span></span>
                  <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 px-1.5 rounded">3/3 DECIPHERED</span>
                </div>
                <div className="space-y-3 pl-1 text-[11px] leading-relaxed">
                  <div className="p-2.5 rounded bg-amber-500/5 border border-amber-500/15">
                    <span className="text-amber-500 font-bold block mb-1">TABLE CLUE:</span>
                    <span>Intruder trails reside entirely inside the `security_logs` catalog.</span>
                  </div>
                  <div className="p-2.5 rounded bg-amber-500/5 border border-amber-500/15">
                    <span className="text-amber-500 font-bold block mb-1">COLUMN CLUE:</span>
                    <span>Inspect payload field values matching compromise parameters.</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3 italic text-center">Acquire tactical evidence points to systematically bypass complex levels.</p>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA FOOTER */}
      <section className="py-24 px-4 md:px-8 bg-[#0D1117] border-t border-[#30363D] relative flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10 max-w-2xl space-y-6">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">READY TO OVERRIDE THE GATEWAY?</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            Corporate mainframe COGNITIVE_GATE_99 is compromised. DFA operatives have synchronized standard indexes. We need your analytical compiler queries online.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
            <button
              id="btn-footer-start"
              onClick={onStartInvestigation}
              className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white shrink-0" />
              <span>START INVESTIGATION</span>
            </button>

            {user ? (
              <button
                id="btn-footer-dashboard"
                onClick={onOpenDashboard}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#161B22] border border-[#30363D] text-[#C9D1D9] hover:text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#1C2128] transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>OPEN DASHBOARD</span>
              </button>
            ) : (
              <button
                id="btn-footer-auth"
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#161B22] border border-[#30363D] text-[#C9D1D9] hover:text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#1C2128] transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>TERMINAL LOGIN</span>
              </button>
            )}
          </div>
        </div>

        {/* Outer footer credits */}
        <div className="mt-20 border-t border-[#30363D]/50 pt-8 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-gray-600 uppercase tracking-widest gap-4 z-10">
          <span>SECURE AGENCY PORTAL // SEC-GRID-00</span>
          <div className="flex flex-col items-center sm:items-end gap-1.5">
            <span>© DFA DIGITAL FORENSICS SYSTEMS LTD.</span>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="text-[10px] font-sans font-bold text-gray-400 drop-shadow-[0_0_3px_rgba(59,130,246,0.35)] hover:text-white hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.95)] cursor-default transition-all duration-300 select-none normal-case tracking-normal"
            >
              — Shrinu Varshney
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
