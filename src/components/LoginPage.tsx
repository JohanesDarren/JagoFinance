import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Sparkles, BookOpen, ArrowRight, Lock, Mail, ArrowLeft, User, Eye, EyeOff, Landmark
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginPageProps {
  onSelectRole: (role: 'staff' | 'finance') => void;
  onAuthSuccess?: (session: any, profile: any) => void;
  onBack?: () => void;
}

export default function LoginPage({ onSelectRole, onAuthSuccess, onBack }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [surname, setSurname] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isSupabase = isSupabaseConfigured();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // --- FORCE MOCK LOGIN FOR DEMO ACCOUNTS (Bypasses Supabase completely) ---
      if ((email === 'diormajorie@gmail.com' || email === 'studyaccdalpa@gmail.com' || email === 'jagoai.business@gmail.com') && password === 'password') {
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess({}, { role: 'super_admin', full_name: email.split('@')[0] });
          }
          onSelectRole('finance');
        }, 500);
        return;
      }

      if (!isSupabase) {
        // Offline fallback
        setTimeout(() => {
          if ((email === 'diormajorie@gmail.com' || email === 'studyaccdalpa@gmail.com') && password === 'password') {
            if (onAuthSuccess) {
              onAuthSuccess({}, { role: 'super_admin', full_name: email.split('@')[0] });
            }
            onSelectRole('finance');
          } else if (email === 'jagoai.business@gmail.com' || email.includes('super')) {
            if (onAuthSuccess) {
              onAuthSuccess({}, { role: 'super_admin', full_name: 'Super Admin Mock' });
            }
            onSelectRole('finance');
          } else if (email.includes('admin')) {
            if (onAuthSuccess) {
              onAuthSuccess({}, { role: 'admin', full_name: 'Admin Mock' });
            }
            onSelectRole('finance');
          } else {
            if (onAuthSuccess) {
              onAuthSuccess({}, { role: 'employee', full_name: 'Staff Mock' });
            }
            onSelectRole('staff');
          }
        }, 1000);
        return;
      }

      if (isSignUp) {
        // --- SIGN UP ---
        if (!fullName || !surname) {
          throw new Error('Nama Lengkap dan Nama Belakang wajib diisi.');
        }

        // 1. Supabase auth signUp
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        const user = signUpData.user;
        if (!user) throw new Error('Registrasi gagal. Silakan coba lagi.');

        // 2. Create User Profile
        // Default register is always employee. Admin is assigned manually via DB.
        const profileRole = 'employee'; 
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: fullName,
              surname: surname,
              role: profileRole,
            },
          ]);

        if (profileError) {
          console.error("Profile creation error, cleaning up...", profileError);
          throw profileError;
        }

        setSuccessMsg('Registrasi berhasil! Silakan login menggunakan akun baru Anda.');
        setIsSignUp(false);
      } else {
        // --- SIGN IN ---
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        const user = signInData.user;
        if (!user) throw new Error('Login gagal.');

        // Fetch User Profile to get role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error('Profil pengguna tidak ditemukan.');
        }

        let profileRole = profileData.role; // 'admin' or 'employee'
        
        // --- OVERRIDE FOR SUPER ADMIN DEMO ACCOUNTS ---
        if (email === 'diormajorie@gmail.com' || email === 'studyaccdalpa@gmail.com' || email === 'jagoai.business@gmail.com') {
          profileRole = 'super_admin';
          profileData.role = 'super_admin';
        }
        
        setSuccessMsg('Login berhasil! Mengalihkan...');
        
        if (onAuthSuccess) {
          onAuthSuccess(signInData.session, profileData);
        }
        
        // Navigate based on role from database
        if (profileRole === 'admin' || profileRole === 'super_admin') {
          onSelectRole('finance');
        } else {
          onSelectRole('staff');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-200/50 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-200/40 blur-[150px] pointer-events-none" />

      {/* Top Brand Area */}
      <header className="p-6 lg:px-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <BookOpen className="w-5 h-5 text-indigo-50" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-none">Jago Keuangan AI</span>
            <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase block mt-1">Sistem Terpusat</span>
          </div>
        </div>

        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {isSupabase ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> SUPABASE LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
              ⚠️ OFFLINE MODE
            </span>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-md w-full mx-auto px-6 py-10 flex flex-col items-center justify-center z-10 flex-grow relative">
        
        <div className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 relative overflow-hidden">
          {/* Top Glow Decor */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-extrabold tracking-widest px-3.5 py-1.5 rounded-full uppercase border border-indigo-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Portal SSO Terpadu
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              {isSignUp ? 'Registrasi Akun Baru' : 'Selamat Datang Kembali'}
            </h2>
            <p className="text-xs text-slate-500">
              {isSignUp ? 'Daftarkan diri Anda untuk masuk ke sistem' : 'Sistem akan otomatis mendeteksi akses portal Anda berdasarkan role akun.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium text-center shadow-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl font-medium text-center shadow-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nama Depan</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Budi" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nama Belakang</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Santoso" 
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Akses</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="nama@perusahaan.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans shadow-sm"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3.5 mt-4 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                loading 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 hover:bg-slate-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]'
              }`}
            >
              <span>{loading ? 'Memproses...' : isSignUp ? 'Registrasi Akun Baru' : 'Masuk Sekarang'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-slate-500 hover:text-indigo-600 transition-all font-bold"
            >
              {isSignUp ? 'Sudah memiliki akun? Login di sini' : 'Belum memiliki akun? Registrasi Karyawan'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="p-6 border-t border-slate-200 text-center text-[10px] text-slate-400 z-10 font-bold">
        © 2026 PT JagoAI School Indonesia • Layanan Multi-level Otomasi Keuangan Digital Cerdas.
      </footer>

    </div>
  );
}
