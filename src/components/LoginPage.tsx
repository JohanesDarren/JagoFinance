import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Laptop, ShieldCheck, Sparkles, BookOpen, 
  ArrowRight, Landmark, CheckCircle2, Lock, Mail, ArrowLeft, Building2, User
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_CONNECTED_APPS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CASH_BALANCE 
} from '../utils/mockData';

interface LoginPageProps {
  onSelectRole: (role: 'staff' | 'finance') => void;
  onAuthSuccess?: (session: any, profile: any) => void;
}

export default function LoginPage({ onSelectRole, onAuthSuccess }: LoginPageProps) {
  const [hoveredCard, setHoveredCard] = useState<'staff' | 'finance' | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<'staff' | 'finance'>('staff');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [surname, setSurname] = useState('');
  const [nationalId, setNationalId] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isSupabase = isSupabaseConfigured();

  const handleCardClick = (role: 'staff' | 'finance') => {
    if (!isSupabase) {
      // Offline fallback: Direct portal selection without credentials
      onSelectRole(role);
    } else {
      setAuthRole(role);
      setShowAuthModal(true);
      setIsSignUp(false);
      setErrorMsg('');
      setSuccessMsg('');
    }
  };

  // The offline logic seedCompanyData function is obsolete in single tenant, we will keep it but remove company references if called
  const seedCompanyData = async () => {
    try {
      console.log(`Seeding database for single tenant...`);
      // Update global balance
      await supabase
        .from('finance_settings')
        .upsert([{ id: 1, current_balance: INITIAL_CASH_BALANCE }]);
    } catch (err) {
      console.error('Error seeding data:', err);
    }
  };

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
      if (isSignUp) {
        // --- SIGN UP ---
        if (authRole === 'finance') {
          throw new Error('Registrasi untuk role Executive Finance dinonaktifkan.');
        }

        if (!fullName || !surname || !nationalId) {
          throw new Error('Nama Lengkap, Nama Belakang, dan Nomor KTP wajib diisi.');
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
        const profileRole = authRole === 'finance' ? 'admin' : 'employee';
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: fullName,
              surname: surname,
              national_id: nationalId,
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

        // Fetch User Profile to verify role access
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error('Profil pengguna tidak ditemukan.');
        }

        const profileRole = profileData.role; // 'admin' or 'employee'
        
        // Validation: Verify they log into the appropriate portal
        if (authRole === 'finance' && profileRole !== 'admin') {
          throw new Error('Akses ditolak. Portal ini hanya untuk administrator / tim keuangan.');
        }
        if (authRole === 'staff' && profileRole !== 'employee') {
          throw new Error('Akses ditolak. Portal ini hanya untuk staf biasa.');
        }

        setSuccessMsg('Login berhasil! Mengalihkan...');
        if (onAuthSuccess) {
          onAuthSuccess(signInData.session, profileData);
        }
        onSelectRole(authRole);
        setShowAuthModal(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1800ad]/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#3b82f6]/10 blur-[150px] pointer-events-none" />

      {/* Top Brand Area */}
      <header className="p-6 lg:px-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1800ad] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#1800ad]/30">
            <BookOpen className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block leading-none">Jago Keuangan AI</span>
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase block mt-1">Multi-Portal Enterprise</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSupabase ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> SUPABASE LIVE CONNECTED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 shadow-md">
              ⚠️ SANDBOX OFFLINE MODE
            </span>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl w-full mx-auto px-6 py-10 flex flex-col items-center justify-center z-10 flex-grow">
        
        {/* Pitch Display Typography */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-extrabold tracking-widest px-3.5 py-1.5 rounded-full uppercase border border-[#1800ad]/30">
            <Sparkles className="w-3.5 h-3.5" /> Automasi Kas & Pengeluaran
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            Portal <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">Jago Keuangan</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto pt-1 font-sans">
            Pilih portal sesuai peran Anda untuk melanjutkan.
          </p>
        </div>

        {/* Dual Portal Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Karyawan / Staf Portal */}
          <div 
            onClick={() => handleCardClick('staff')}
            onMouseEnter={() => setHoveredCard('staff')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group bg-slate-900/40 border transition-all duration-300 p-8 rounded-3xl cursor-pointer relative overflow-hidden backdrop-blur-sm shadow-xl hover:shadow-2xl flex flex-col justify-between min-h-[350px] ${
              hoveredCard === 'staff' 
                ? 'border-indigo-500 bg-[#0e1022]/60 -translate-y-1' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Icon Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${
                  hoveredCard === 'staff' ? 'bg-indigo-600/20 text-indigo-400 scale-105' : 'bg-slate-800/80 text-slate-300'
                }`}>
                  <Smartphone className="w-7 h-7" />
                </div>
                <span className="text-[10px] text-indigo-400/90 bg-indigo-500/15 font-bold tracking-widest px-2.5 py-1 rounded-md uppercase font-display">SIMULATOR HP</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-display">Portal Karyawan</h3>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  Ajukan kas bon dan klaim reimburse dengan mudah.
                </p>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6">
              <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 group-hover:scale-[1.01] transition-all text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20">
                <span>Masuk Portal Staf Biasa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Card 2: Direksi / Finance Team */}
          <div 
            onClick={() => handleCardClick('finance')}
            onMouseEnter={() => setHoveredCard('finance')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group bg-slate-900/40 border transition-all duration-300 p-8 rounded-3xl cursor-pointer relative overflow-hidden backdrop-blur-sm shadow-xl hover:shadow-2xl flex flex-col justify-between min-h-[350px] ${
              hoveredCard === 'finance' 
                ? 'border-[#0000a0] bg-[#090a2a]/60 -translate-y-1' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Icon Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${
                  hoveredCard === 'finance' ? 'bg-[#0000a0]/35 text-[#5c5cff] scale-105' : 'bg-slate-800/80 text-slate-300'
                }`}>
                  <Laptop className="w-7 h-7" />
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/15 font-bold tracking-widest px-2.5 py-1 rounded-md uppercase font-display">DASHBOARD WEB</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-display">Executive Finance</h3>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  Pusat monitoring kas, persetujuan klaim, dan manajemen payroll perusahaan.
                </p>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6">
              <button className="w-full py-3.5 bg-[#1a1aff] hover:bg-[#3333ff] group-hover:scale-[1.01] transition-all text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#1800ad]/40">
                <span>Masuk Portal Executive Finance</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Tips Panel */}
        <div className="mt-12 bg-indigo-950/20 border border-slate-800/80 rounded-2xl p-4 flex gap-3 text-xs text-slate-450 leading-relaxed max-w-2xl w-full">
          <Landmark className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="font-medium font-sans">
            <span className="text-white font-bold block">💡 Skenario Pengujian Sinkronisasi Dual-Portal:</span>
            {isSupabase ? (
              <span>Gunakan database Supabase yang sama! Login sebagai Karyawan untuk mengupload struk, maka pengajuan Anda akan muncul di Dashboard Admin secara real-time karena database terintegrasi secara live.</span>
            ) : (
              <span>Gunakan tab browser yang sama! Buka Portal Staff untuk melampirkan berkas pengeluaran, maka pengajuan Anda akan langsung muncul seketika di Portal Finance untuk diperiksa dan didebet saldonya.</span>
            )}
          </p>
        </div>

      </main>

      {/* Auth Modal (Only active when Supabase is configured) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
            {/* Top Glow Decor */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${authRole === 'finance' ? 'bg-[#1a1aff]' : 'bg-indigo-600'}`} />
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 ${
                authRole === 'finance' ? 'text-amber-400 bg-amber-500/15' : 'text-indigo-400 bg-indigo-500/15'
              }`}>
                {authRole === 'finance' ? 'Pusat Keuangan' : 'Staf Karyawan'}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {isSignUp ? 'Buat Akun Baru' : 'Masuk ke Akun Anda'}
              </h3>
              <p className="text-xs text-slate-450 mt-1">
                {isSignUp 
                  ? 'Isi formulir di bawah ini untuk menginisiasi organisasi baru.' 
                  : 'Silakan masukkan kredensial yang valid untuk melanjutkan.'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Nama Depan</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Budi" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Nama Belakang</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Santoso" 
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Nomor KTP (National ID)</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="16 Digit NIK KTP" 
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                </>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Kantor</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    placeholder="nama@perusahaan.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 mt-2 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                  loading 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : authRole === 'finance'
                      ? 'bg-[#1a1aff] hover:bg-[#3333ff] shadow-[#1800ad]/25'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
                }`}
              >
                <span>{loading ? 'Memproses...' : isSignUp ? 'Registrasi Akun Baru' : 'Login Sekarang'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {authRole === 'staff' && (
              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <button 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-slate-450 hover:text-white transition-all"
                >
                  {isSignUp ? 'Sudah memiliki akun? Login di sini' : 'Belum memiliki akun? Registrasi di sini'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="p-6 border-t border-slate-900 text-center text-[10px] text-slate-500 z-10 font-medium">
        © 2026 PT JagoAI School Indonesia • Layanan Multi-level Otomasi Keuangan Digital Cerdas. All rights reserved.
      </footer>

    </div>
  );
}
