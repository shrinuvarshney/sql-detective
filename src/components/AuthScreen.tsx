import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../database/firebase';
import { Terminal, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
  onBack?: () => void;
}

export default function AuthScreen({ onSuccess, onBack }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setInfo(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    if (!email || (mode !== 'forgot-password' && !password)) {
      setError('Please fill in all required credentials.');
      setLoading(false);
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        setInfo('Account registered successfully! Secure connection established.');
        setTimeout(() => onSuccess(), 1500);
      } else if (mode === 'forgot-password') {
        await sendPasswordResetEmail(auth, email);
        setInfo('Password reset link sent! Check your secure decryption terminal (email).');
        setMode('login');
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Authorization failed. Check secure terminal connection.';
      if (err.code === 'auth/user-not-found') errMsg = 'No intelligence operative registered with this email.';
      else if (err.code === 'auth/wrong-password') errMsg = 'Incorrect password. Decryption sequence failed.';
      else if (err.code === 'auth/email-already-in-use') errMsg = 'Operator email already exists in our registries.';
      else if (err.code === 'auth/weak-password') errMsg = 'Password is too vulnerable. Must be at least 6 characters.';
      else if (err.code === 'auth/invalid-email') errMsg = 'Invalid email structure.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google Single Sign-In Handshake Failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-white overflow-hidden relative px-4 select-none">
      {/* Background Tech Hex Grid / Visuals */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B22_1px,transparent_1px),linear-gradient(to_bottom,#161B22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-[#161B22]/70 border border-[#30363D] rounded-2xl p-6 md:p-8 backdrop-blur shadow-2xl z-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-4 left-4 text-gray-500 hover:text-white text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors bg-[#0D1117] border border-[#30363D] px-2 py-0.5 rounded"
          >
            <span>← RETURN</span>
          </button>
        )}
        {/* Brand Shield Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
            <Terminal className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-extrabold tracking-tight uppercase">
            SQL <span className="text-blue-500 font-bold">Detective</span>
          </h2>
          <span className="text-[9px] font-mono tracking-widest text-[#8B949E] uppercase mt-1">
            Secure Intelligence Authentication Portal
          </span>
        </div>

        {/* Message Boxes */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{info}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">OPERATIVE EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@agency.hq"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot-password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">ACCESS PASSWORD</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot-password'); clearMessages(); }}
                    className="text-[10px] font-mono text-blue-400 hover:underline hover:text-blue-300"
                  >
                    FORGOT PASS?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <span>{loading ? 'INITIATING HANDSHAKE...' : mode === 'login' ? 'AUTHORIZE OPERATIVE' : mode === 'register' ? 'CREATE PROFILE' : 'SEND RESET LINK'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#30363D]" /></div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase"><span className="bg-[#161B22] px-2 text-gray-500">OR</span></div>
        </div>

        {/* Google SSO */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 bg-[#0D1117] hover:bg-[#1C2128] border border-[#30363D] text-[#C9D1D9] hover:text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          {/* Custom SVG Google Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>SIGN IN WITH GOOGLE</span>
        </button>

        {/* Footer Mode Switcher */}
        <div className="mt-6 text-center text-xs font-mono text-gray-500">
          {mode === 'login' ? (
            <p>
              NEW OPERATIVE?{' '}
              <button onClick={() => { setMode('register'); clearMessages(); }} className="text-blue-400 hover:underline hover:text-blue-300 font-bold">
                REGISTER KEY
              </button>
            </p>
          ) : (
            <p>
              ALREADY REGISTERED?{' '}
              <button onClick={() => { setMode('login'); clearMessages(); }} className="text-blue-400 hover:underline hover:text-blue-300 font-bold">
                LOGIN OPERATIVE
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
