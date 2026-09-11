import React, { useState } from 'react';
import { ShieldAlert, X, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; name: string }) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Success
    const userName = mode === 'signup' ? name : (email.split('@')[0] || 'User');
    onLoginSuccess({
      email,
      name: userName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      
      <div className="relative w-full max-w-md bg-[#1c1f26] border border-[#2a2e35] rounded-xl shadow-2xl p-6 sm:p-7 text-left overflow-hidden">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#181b1f] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs text-[#94a3b8]">
              {mode === 'login' 
                ? 'Sign in to access your saved analyses' 
                : 'Join ClearClause for unlimited document audits'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-[#181b1f] p-1 border border-[#2a2e35] mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              mode === 'login'
                ? 'bg-[#1c1f26] text-white border border-[#2a2e35]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#1c1f26] text-white border border-[#2a2e35]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#181b1f] border border-[#2a2e35] focus-within:border-[#3b82f6]">
                <UserIcon className="w-4 h-4 text-[#94a3b8]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-transparent text-xs text-[#f1f5f9] placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#181b1f] border border-[#2a2e35] focus-within:border-[#3b82f6]">
              <Mail className="w-4 h-4 text-[#94a3b8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-transparent text-xs text-[#f1f5f9] placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#94a3b8]">
                Password
              </label>
              {mode === 'login' && (
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setErrorMsg('Password reset instructions sent to email.');
                  }}
                  className="text-[11px] text-[#3b82f6] hover:underline"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#181b1f] border border-[#2a2e35] focus-within:border-[#3b82f6]">
              <Lock className="w-4 h-4 text-[#94a3b8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs text-[#f1f5f9] placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Sign up terms checkbox */}
          {mode === 'signup' && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#2a2e35] bg-[#181b1f] text-[#3b82f6] focus:ring-[#3b82f6]"
              />
              <label htmlFor="agree-terms" className="text-[11px] text-[#94a3b8] leading-tight">
                I agree to the ClearClause terms and privacy policy.
              </label>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-red-500/30 text-[#ef4444] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-5 pt-3.5 border-t border-[#2a2e35] text-center text-xs text-[#94a3b8]">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                className="text-[#3b82f6] hover:underline font-semibold cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className="text-[#3b82f6] hover:underline font-semibold cursor-pointer"
              >
                Login
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
