import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Sparkles, ArrowRight, Lock, Mail, ArrowLeft, User, Eye, EyeOff, CheckCircle2, XCircle, Building2, Check, BarChart3, PieChart
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onSelectRole: (role: 'super_admin' | 'admin_corp' | 'karyawan' | any) => void;
  onAuthSuccess?: (session: any, profile: any) => void;
  onBack?: () => void;
}

export default function LoginPage({ onSelectRole, onAuthSuccess, onBack }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [surname, setSurname] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password requirements state
  const [pwdReqs, setPwdReqs] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    noSpace: false,
    notNameEmail: false,
  });

  const isSupabase = isSupabaseConfigured();

  // Validate password continuously
  useEffect(() => {
    if (isSignUp) {
      setPwdReqs({
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        noSpace: password.length > 0 && !/\s/.test(password),
        notNameEmail: password.length > 0 && 
                      (!email || !password.toLowerCase().includes(email.split('@')[0].toLowerCase())) && 
                      (!fullName || !password.toLowerCase().includes(fullName.split(' ')[0].toLowerCase()))
      });
    }
  }, [password, email, fullName, isSignUp]);

  const getStrengthLabel = () => {
    if (!password) return { label: 'Belum ada', color: 'text-slate-400', bg: 'bg-slate-100', bar: 'w-0' };
    const validCount = Object.values(pwdReqs).filter(Boolean).length;
    if (validCount <= 2) return { label: 'Lemah', color: 'text-rose-600', bg: 'bg-rose-100', bar: 'w-1/3 bg-rose-500' };
    if (validCount <= 5) return { label: 'Sedang', color: 'text-amber-600', bg: 'bg-amber-100', bar: 'w-2/3 bg-amber-500' };
    return { label: 'Kuat', color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'w-full bg-emerald-500' };
  };

  const strength = getStrengthLabel();
  const allReqsMet = Object.values(pwdReqs).every(Boolean);
  const passwordsMatch = password === confirmPassword;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }

    if (isSignUp) {
      if (!allReqsMet) {
        setErrorMsg('Harap penuhi semua persyaratan kata sandi sebelum mendaftar.');
        return;
      }
      if (!passwordsMatch) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok.');
        return;
      }
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!isSupabase) {
        setTimeout(() => {
          if (email.includes('super')) {
            if (onAuthSuccess) onAuthSuccess({}, { role: 'super_admin', full_name: 'Super Admin' });
            onSelectRole('super_admin');
          } else if (email.includes('admin')) {
            if (onAuthSuccess) onAuthSuccess({}, { role: 'admin_corp', full_name: 'Admin' });
            onSelectRole('admin_corp');
          } else {
            if (onAuthSuccess) onAuthSuccess({}, { role: 'karyawan', full_name: 'Staff' });
            onSelectRole('karyawan');
          }
        }, 1000);
        return;
      }

      if (isSignUp) {
        if (!fullName || !surname) throw new Error('Nama Lengkap dan Nama Belakang wajib diisi.');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        const user = signUpData.user;
        if (!user) throw new Error('Registrasi gagal. Silakan coba lagi.');

        const profileRole = 'karyawan'; 
        const { error: profileError } = await supabase.from('users').insert([
          { id: user.id, full_name: fullName, surname: surname, role: profileRole, company_id: '00000000-0000-0000-0000-000000000001' }
        ]);

        if (profileError) throw profileError;

        setSuccessMsg('Registrasi berhasil! Silakan login.');
        setIsSignUp(false);
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        const user = signInData.user;
        if (!user) throw new Error('Login gagal.');

        const { data: profileData, error: profileError } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (profileError) throw new Error('Profil pengguna tidak ditemukan.');

        let profileRole = profileData.role; 
        setSuccessMsg('Login berhasil! Mengalihkan...');
        if (onAuthSuccess) onAuthSuccess(signInData.session, profileData);
        onSelectRole(profileRole);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const ReqItem = ({ met, text }: { met: boolean, text: string }) => (
    <div className={`flex items-center gap-2 text-[11px] transition-all duration-300 ${met ? 'text-emerald-600' : 'text-slate-500'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors shadow-sm ${met ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        {met && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <span className={met ? 'line-through opacity-60 font-medium' : 'font-medium'}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdfa] flex font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      
      {/* Animated Light Orbs (Moved to root for full page effect) */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-blue-300/20 blur-[100px] pointer-events-none animate-pulse duration-[6s]"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-teal-300/20 blur-[100px] pointer-events-none animate-pulse duration-[8s] delay-700"></div>

      {/* LEFT SIDE - LIGHT THEME IMMERSIVE DECORATION */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-transparent flex-col justify-between p-12 z-10 border-r border-slate-100/50">

        {/* Floating Abstract 3D Glass Cards */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        <div className="absolute inset-0 pointer-events-none z-0">
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }} 
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[20%] right-[10%] w-64 h-40 bg-white/40 backdrop-blur-xl border border-white/80 rounded-[2rem] shadow-[0_8px_32px_rgba(31,38,135,0.05)] flex flex-col p-6"
           >
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
               <BarChart3 className="w-5 h-5" />
             </div>
             <div className="w-24 h-2 bg-slate-200 rounded-full mb-2"></div>
             <div className="w-16 h-2 bg-slate-200 rounded-full"></div>
           </motion.div>

           <motion.div 
             animate={{ y: [0, 25, 0], rotate: [0, -3, 0] }} 
             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[25%] left-[10%] w-56 h-56 bg-white/50 backdrop-blur-xl border border-white/80 rounded-[2rem] shadow-[0_8px_32px_rgba(31,38,135,0.06)] flex flex-col items-center justify-center p-6"
           >
             <div className="w-16 h-16 rounded-full border-[6px] border-teal-100 border-t-teal-500 mb-4 animate-spin duration-[3s]"></div>
             <div className="w-20 h-2 bg-slate-200 rounded-full mb-2"></div>
             <div className="w-12 h-2 bg-slate-200 rounded-full"></div>
           </motion.div>
        </div>

        {/* Brand */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative z-10 flex items-center gap-3 w-fit cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">
            Jago<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Finance</span>
          </span>
        </motion.div>

        {/* Copy / Graphic */}
        <div className="relative z-10 max-w-xl mb-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-6 cursor-default"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">Platform Finansial Generasi Baru</span>
            </motion.div>

            <h1 className="text-[3.5rem] font-black text-slate-900 leading-[1.05] tracking-tight mb-6 font-outfit">
              Otomatisasi <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Keuangan Anda.</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-10 font-jakarta max-w-md">
              Hilangkan pekerjaan manual. Kelola arus kas, rekonsiliasi, dan operasional lintas cabang dalam satu ekosistem super-app pintar.
            </p>
            
            <div className="flex items-center gap-4 bg-white/70 border border-white rounded-2xl p-4 shadow-sm backdrop-blur-md w-max">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-blue-500 shadow-sm"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-cyan-400 to-teal-500 shadow-sm"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-500 shadow-sm"></div>
              </div>
              <div className="text-sm font-medium text-slate-500 font-jakarta">
                Dipercaya <strong className="text-slate-900 font-bold">50+</strong> enterprise besar
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-[45%] flex flex-col relative bg-transparent z-20">
        
        {/* Top Header */}
        <header className="px-8 py-6 sm:px-12 flex justify-between items-center w-full z-10">
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {onBack && (
              <button 
                onClick={onBack}
                className="group flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-full text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Kembali</span>
              </button>
            )}
            {isSupabase ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-4 py-2.5 rounded-full shadow-sm border border-indigo-100">
                <ShieldCheck className="w-4 h-4" /> Live Base
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-4 py-2.5 rounded-full shadow-sm border border-amber-100">
                ⚠️ Offline
              </span>
            )}
          </div>
        </header>

        {/* Main Form Content */}
        <main className="w-full max-w-[460px] mx-auto px-8 py-10 flex-grow flex flex-col justify-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3 font-outfit">
              {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang'}
            </h2>
            <p className="text-[15px] text-slate-500 font-jakarta">
              {isSignUp ? 'Daftarkan diri Anda untuk akses penuh' : 'Masuk menggunakan kredensial perusahaan Anda'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {errorMsg ? (
              <motion.div key="error" initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-8 p-4 bg-rose-50 border border-rose-100/50 text-rose-600 text-[13px] rounded-2xl font-bold flex items-center gap-3 shadow-sm">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            ) : successMsg ? (
              <motion.div key="success" initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-8 p-4 bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-[13px] rounded-2xl font-bold flex items-center gap-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, height: 'auto', scale: 1 }} 
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.div whileTap={{ scale: 0.98 }} className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Nama Depan" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] border-2 border-transparent rounded-full text-[14px] text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-200 focus:shadow-[0_4px_25px_rgba(99,102,241,0.12)] hover:bg-slate-100/80 transition-all font-jakarta font-medium"
                      required
                    />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }} className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Nama Belakang" 
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] border-2 border-transparent rounded-full text-[14px] text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-200 focus:shadow-[0_4px_25px_rgba(99,102,241,0.12)] hover:bg-slate-100/80 transition-all font-jakarta font-medium"
                      required
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.98 }} className="relative group"
            >
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="email" 
                placeholder="Alamat Email Akses" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-slate-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] border-2 border-transparent rounded-full text-[14px] text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-200 focus:shadow-[0_4px_25px_rgba(99,102,241,0.12)] hover:bg-slate-100/80 transition-all font-jakarta font-medium"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.98 }} className="relative group"
            >
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi Utama" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-14 py-4 bg-slate-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] border-2 border-transparent rounded-full text-[14px] text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-200 focus:shadow-[0_4px_25px_rgba(99,102,241,0.12)] hover:bg-slate-100/80 transition-all font-jakarta font-medium"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>
              
            {/* Password Requirements UI for Sign Up (Animated Dropdown) */}
            <AnimatePresence>
              {isSignUp && password.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -20 }} 
                  animate={{ opacity: 1, height: 'auto', y: 0 }} 
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                  className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kekuatan Sandi</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${strength.color} ${strength.bg}`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div className={`h-full ${strength.bar} transition-all duration-500 ease-out`}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    <ReqItem met={pwdReqs.length} text="Min. 8 karakter" />
                    <ReqItem met={pwdReqs.upper} text="1 huruf besar (A-Z)" />
                    <ReqItem met={pwdReqs.lower} text="1 huruf kecil (a-z)" />
                    <ReqItem met={pwdReqs.number} text="1 angka (0-9)" />
                    <ReqItem met={pwdReqs.noSpace} text="Tanpa spasi" />
                    <ReqItem met={pwdReqs.notNameEmail} text="Bukan nama/email" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Password UI for Sign Up */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  whileTap={{ scale: 0.98 }} 
                  className="relative group"
                >
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Kata Sandi" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-12 pr-24 py-4 bg-slate-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] border-2 rounded-full text-[14px] text-slate-900 placeholder-slate-400 outline-none transition-all font-jakarta font-medium ${
                      confirmPassword.length > 0 
                        ? passwordsMatch 
                          ? 'border-emerald-200 focus:bg-white focus:border-emerald-300 focus:shadow-[0_4px_25px_rgba(16,185,129,0.15)] bg-white' 
                          : 'border-rose-200 focus:bg-white focus:border-rose-300 focus:shadow-[0_4px_25px_rgba(244,63,94,0.15)] bg-white'
                        : 'border-transparent focus:bg-white focus:border-indigo-200 focus:shadow-[0_4px_25px_rgba(99,102,241,0.12)] hover:bg-slate-200/80'
                    }`}
                    required
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {confirmPassword.length > 0 && (
                      <div className={`p-1 rounded-full shadow-sm ${passwordsMatch ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {passwordsMatch ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />}
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <button 
                type="submit" 
                disabled={loading || (isSignUp && (!allReqsMet || !passwordsMatch))}
                className={`w-full py-4 mt-6 text-white font-bold text-[15px] rounded-full flex items-center justify-center gap-3 transition-all duration-300 ${
                  loading || (isSignUp && (!allReqsMet || !passwordsMatch))
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:scale-[0.98]'
                }`}
              >
                <span>{loading ? 'Memproses...' : isSignUp ? 'Daftar Sekarang' : 'Masuk ke Portal'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <span className="text-[14px] text-slate-500 font-jakarta">
              {isSignUp ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
            </span>
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
                setSuccessMsg('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-[14px] text-indigo-600 hover:text-indigo-800 transition-colors font-bold group relative"
            >
              {isSignUp ? 'Masuk di sini' : 'Registrasi Karyawan'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </button>
          </motion.div>
        </main>
      </div>
      
    </div>
  );
}
