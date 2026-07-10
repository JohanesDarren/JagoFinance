import React from 'react';
import { Sparkles, Mail, Lock, ChevronRight } from 'lucide-react';

interface AuthScreenProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loginError: string;
  isSubmitting: boolean;
  handleLogin: (e: React.FormEvent) => void;
  setCurrentScreen: (screen: any) => void;
}

export default function AuthScreen({
  email,
  setEmail,
  password,
  setPassword,
  loginError,
  isSubmitting,
  handleLogin,
  setCurrentScreen
}: AuthScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6">
      <div className="text-center mt-8">
        <div className="inline-flex p-3 bg-indigo-50 text-indigo-700 rounded-2xl mb-3">
          <Sparkles className="w-8 h-8 text-brand" />
        </div>
        <h2 className="text-xl font-bold font-display text-brand">Jago Keuangan</h2>
        <p className="text-xs text-slate-500 mt-1">Sistem Klaim Mandiri & Reimburse AI</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 my-auto">
        {loginError && (
          <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] rounded-xl font-medium">
            {loginError}
          </div>
        )}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Karyawan</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none" 
              placeholder="nama@jagoai.id"
              required
              id="mobile_email_input"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
            <button 
              type="button" 
              onClick={() => setCurrentScreen('forgot')}
              className="text-[11px] font-medium text-brand hover:underline"
            >
              Lupa?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none" 
              placeholder="••••••••"
              required
              id="mobile_password_input"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-opacity-95 transition-all text-center flex items-center justify-center gap-1.5 disabled:opacity-70"
          id="mobile_signin_btn"
        >
          <span>{isSubmitting ? 'Memproses...' : 'Masuk sebagai Staff'}</span>
          {!isSubmitting && <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="text-center text-[10px] text-slate-400">
        <span>Authorized staff only • JagoAI group © 2026</span>
      </div>
    </div>
  );
}
