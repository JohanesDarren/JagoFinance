import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full bg-blue-950 relative overflow-hidden font-sans">
      
      {/* Premium Dark Background Elements */}
      <div className="absolute top-0 right-0 w-[150%] h-96 bg-gradient-to-bl from-slate-800 via-blue-950 to-transparent rounded-bl-full pointer-events-none -z-0"></div>

      <div className="flex-1 flex flex-col justify-between p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center mt-16"
        >
          <div className="inline-flex p-4 bg-white/5 text-white rounded-[1.5rem] mb-6 shadow-xl border border-white/10 relative group">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black font-display text-white tracking-tight">JagoFinance</h2>
          <p className="text-[14px] font-bold text-slate-400 mt-2 tracking-wide">Karyawan Portal</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
          onSubmit={handleLogin} 
          className="space-y-6 my-auto bg-white p-8 rounded-[2rem] shadow-2xl"
        >
          <AnimatePresence>
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-[1.25rem] font-bold text-center"
              >
                {loginError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="group relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 transition-colors pl-1">Email Karyawan</label>
            <div className={`relative rounded-[1.25rem] transition-all duration-300 border ${focusedInput === 'email' ? 'border-blue-950 shadow-sm' : 'border-slate-200'}`}>
              <Mail className={`absolute left-5 top-4 w-5 h-5 transition-colors ${focusedInput === 'email' ? 'text-blue-950' : 'text-slate-400'}`} />
              <input 
                type="email" 
                value={email}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-5 py-4 text-sm bg-transparent outline-none font-bold text-blue-950 transition-colors placeholder:font-bold placeholder:text-slate-300" 
                placeholder="nama@perusahaan.com"
                required
                id="mobile_email_input"
              />
            </div>
          </div>

          <div className="group relative">
            <div className="flex justify-between items-center mb-2 pl-1 pr-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">Kata Sandi</label>
              <button 
                type="button" 
                onClick={() => setCurrentScreen('forgot')}
                className="text-[10px] font-bold text-slate-400 hover:text-blue-950 transition-colors"
              >
                Lupa Sandi?
              </button>
            </div>
            <div className={`relative rounded-[1.25rem] transition-all duration-300 border ${focusedInput === 'password' ? 'border-blue-950 shadow-sm' : 'border-slate-200'}`}>
              <Lock className={`absolute left-5 top-4 w-5 h-5 transition-colors ${focusedInput === 'password' ? 'text-blue-950' : 'text-slate-400'}`} />
              <input 
                type="password" 
                value={password}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-5 py-4 text-sm bg-transparent outline-none font-bold text-blue-950 transition-colors placeholder:font-bold placeholder:text-slate-300" 
                placeholder="••••••••"
                required
                id="mobile_password_input"
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-blue-950 text-white font-black text-[13px] uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-blue-950/20 active:shadow-sm transition-all text-center flex items-center justify-center gap-2 disabled:opacity-70"
              id="mobile_signin_btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk Akun</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[10px] font-black tracking-widest text-slate-500 uppercase pb-4"
        >
          <span>Authorized staff only • JagoAI group © 2026</span>
        </motion.div>
      </div>
    </div>
  );
}
