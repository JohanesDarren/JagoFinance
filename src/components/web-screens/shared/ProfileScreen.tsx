import React, { useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Briefcase, Shield, Key, Camera, Upload, X, Check, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { WebScreenProps } from './WebScreenProps';
import { supabase } from '../../../lib/supabase';

export default function ProfileScreen(props: WebScreenProps) {
  const { onLogout, userProfile, companies } = props;

  const [profileData, setProfileData] = React.useState({
    name: [userProfile?.full_name, userProfile?.surname].filter(Boolean).join(' ') || 'Admin',
    email: userProfile?.email || '',
    phone: '+62',
    location: 'Kantor Pusat',
    avatar_url: userProfile?.avatar_url || ''
  });

  // Sync state if userProfile changes (e.g. initial load)
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: [userProfile.full_name, userProfile.surname].filter(Boolean).join(' ') || 'Admin',
        email: userProfile.email || '',
        phone: '+62',
        location: 'Kantor Pusat',
        avatar_url: userProfile.avatar_url || ''
      });
    }
  }, [userProfile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // --- Password Change Logic ---
  const [pwdStep, setPwdStep] = React.useState<'idle' | 'request_otp' | 'verify_otp' | 'update_pwd' | 'success'>('idle');
  const [otpCode, setOtpCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [pwdIsLoading, setPwdIsLoading] = React.useState(false);
  const [pwdError, setPwdError] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);

  const checkPasswordStrength = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const noSpace = !/\s/.test(pass) && pass.length > 0;
    
    const names = profileData.name.toLowerCase().split(' ');
    let notNameEmail = true;
    if (pass.length > 0 && pass.toLowerCase().includes(profileData.email.split('@')[0].toLowerCase())) notNameEmail = false;
    names.forEach(n => {
      if (n.length > 3 && pass.toLowerCase().includes(n)) notNameEmail = false;
    });
    if (pass.length === 0) notNameEmail = false;

    const checks = [minLength, hasUpper, hasLower, hasNumber, noSpace, notNameEmail];
    const score = checks.filter(Boolean).length;
    let strength = 'Rendah';
    let color = 'bg-rose-500';
    if (score >= 6) { strength = 'Kuat'; color = 'bg-emerald-500'; }
    else if (score >= 4) { strength = 'Sedang'; color = 'bg-amber-500'; }

    return { minLength, hasUpper, hasLower, hasNumber, noSpace, notNameEmail, score, strength, color, total: 6 };
  };

  const handleRequestOTP = async () => {
    setPwdIsLoading(true); setPwdError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profileData.email);
      if (error) throw error;
      setPwdStep('verify_otp');
    } catch (err: any) {
      setPwdError(err.message || 'Gagal mengirim kode.');
    } finally {
      setPwdIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode) { setPwdError('Masukkan kode OTP.'); return; }
    setPwdIsLoading(true); setPwdError('');
    try {
      const { error } = await supabase.auth.verifyOtp({ email: profileData.email, token: otpCode, type: 'recovery' });
      if (error) throw error;
      setPwdStep('update_pwd');
    } catch (err: any) {
      setPwdError(err.message || 'Kode OTP tidak valid.');
    } finally {
      setPwdIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    const strength = checkPasswordStrength(newPassword);
    if (strength.score < 6) {
      setPwdError('Kata sandi belum memenuhi semua syarat.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setPwdIsLoading(true); setPwdError('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwdStep('success');
      setOtpCode(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Gagal mengubah kata sandi.');
    } finally {
      setPwdIsLoading(false);
    }
  };


  // Photo change logic
  const [showPhotoSource, setShowPhotoSource] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setShowPhotoSource(false);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfileData({ ...profileData, avatar_url: dataUrl });
        stopCamera();
      }
    }
  };

  const handleSave = async () => {
    if (!userProfile?.id) return;
    setIsSaving(true);
    try {
      const names = profileData.name.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const { error } = await supabase
        .from('users')
        .update({
          full_name: firstName,
          surname: lastName,
          email: profileData.email,
          avatar_url: profileData.avatar_url
        })
        .eq('id', userProfile.id);

      if (error) throw error;
      
      // Update successful
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // We should ideally call onRefreshData here, but App.tsx might need to re-fetch profile.
      if (props.onRefreshData) props.onRefreshData();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="relative group/avatar cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-500 bg-indigo-50 flex items-center justify-center">
              {profileData.avatar_url ? (
                <img 
                  src={profileData.avatar_url}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-indigo-400" />
              )}
            </div>
            <div 
              className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
              onClick={() => setShowPhotoSource(true)}
            >
              <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center">Ubah<br/>Foto</span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                handlePhotoChange(e);
                setShowPhotoSource(false);
              }}
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-black tracking-widest uppercase mb-3 shadow-inner">
              <Shield className="w-3.5 h-3.5 text-brand" />
              {userProfile?.role === 'super_admin' ? 'Super Administrator' : userProfile?.role === 'admin_corp' ? 'Admin Cabang' : 'Karyawan'}
            </div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">{profileData.name}</h2>
            <p className="text-slate-300 mt-2 text-base max-w-xl font-medium">Pengaturan profil akun, keamanan, dan preferensi notifikasi dashboard.</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Info Personal */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 lg:col-span-2">
          <h3 className="font-black font-display text-slate-900 text-2xl tracking-tight mb-8">Informasi Personal</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <User className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Alamat Email</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nomor Telepon</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith('+62')) {
                        setProfileData({ ...profileData, phone: val });
                      } else if (val === '+6' || val === '+' || val === '') {
                        setProfileData({ ...profileData, phone: '+62' });
                      } else {
                        setProfileData({ ...profileData, phone: '+62' + val.replace(/^\+?6?2?/, '') });
                      }
                    }}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Lokasi Kantor</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                {saveSuccess && (
                  <span className="text-emerald-500 font-bold text-sm animate-in fade-in zoom-in duration-300">
                    Berhasil disimpan!
                  </span>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-4 bg-brand text-white font-black text-[15px] rounded-[1.5rem] hover:bg-brand/90 transition-all shadow-xl hover:shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Pekerjaan & Keamanan */}
        <div className="space-y-8 lg:col-span-1">
          
          <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
            <h3 className="font-black font-display text-slate-900 text-xl tracking-tight mb-6">Detail Pekerjaan</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100/50">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Perusahaan</span>
                  <p className="font-black text-slate-900 mt-0.5">
                    {userProfile?.role === 'super_admin' 
                      ? 'JagoFinance' 
                      : (companies?.find(c => c.id === userProfile?.company_id)?.name || 'Pusat / Tidak Terhubung')
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100/50">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jabatan / Role</span>
                  <p className="font-black text-slate-900 mt-0.5">
                    {userProfile?.role === 'super_admin' ? 'Super Administrator' : userProfile?.role === 'admin_corp' ? 'Admin Cabang' : 'Karyawan'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
            <h3 className="font-black font-display text-slate-900 text-xl tracking-tight mb-6">Keamanan Akun</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setPwdStep('request_otp')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] hover:bg-slate-100 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Key className="w-5 h-5 text-slate-400 group-hover:text-slate-700" />
                  <span className="font-bold text-slate-800">Ubah Kata Sandi</span>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: Photo Source Picker */}
      {showPhotoSource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setShowPhotoSource(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-6 font-display">Ubah Foto Profil</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={startCamera}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-brand/30 hover:bg-brand/5 transition-all text-slate-600 hover:text-brand"
              >
                <Camera className="w-8 h-8" />
                <span className="text-xs font-bold">Gunakan Kamera</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-brand/30 hover:bg-brand/5 transition-all text-slate-600 hover:text-brand"
              >
                <Upload className="w-8 h-8" />
                <span className="text-xs font-bold">Upload File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Webcam Capture */}
      {showCamera && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-4 w-full max-w-lg flex flex-col items-center relative animate-in zoom-in-95 duration-200">
            <button onClick={stopCamera} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full z-10">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-4 font-display self-start px-4">Ambil Foto</h3>
            
            <div className="w-full relative aspect-square bg-slate-900 rounded-[1.5rem] overflow-hidden mb-6 border border-slate-100">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]" 
              />
              {/* Overlay grid for guidance */}
              <div className="absolute inset-0 border-[40px] border-black/40 rounded-[1.5rem] pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full border-2 border-white/50 border-dashed"></div>
              </div>
            </div>
            
            <button 
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-[0_0_0_4px_theme(colors.slate.200)] flex items-center justify-center hover:bg-slate-300 transition-colors focus:outline-none"
            >
              <div className="w-14 h-14 bg-white rounded-full shadow-sm"></div>
            </button>
            <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">Ambil Gambar</p>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}

      {/* MODAL: Password Flow */}
      {pwdStep !== 'idle' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setPwdStep('idle'); setPwdError(''); setOtpCode(''); setNewPassword(''); setConfirmPassword(''); }} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {pwdStep === 'request_otp' && (
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative mt-2">
                  <div className="absolute inset-0 bg-brand/20 blur-2xl rounded-full scale-150"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-brand text-white rounded-[2rem] shadow-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <Mail className="w-10 h-10" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight mb-3">Verifikasi Keamanan</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Kami perlu memastikan ini benar-benar Anda.<br/>
                    Kode OTP akan dikirimkan ke <strong className="text-slate-800">{profileData.email}</strong>
                  </p>
                </div>
                {pwdError && <div className="p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl border border-rose-100 flex items-center gap-3 w-full text-left"><AlertCircle className="w-5 h-5 shrink-0"/>{pwdError}</div>}
                <button 
                  onClick={handleRequestOTP} disabled={pwdIsLoading}
                  className="w-full py-4 bg-brand text-white font-black text-[15px] rounded-[1.5rem] hover:bg-brand/90 transition-all shadow-xl hover:shadow-brand/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-brand"
                >
                  {pwdIsLoading ? 'Mengirim Kode...' : 'Kirim Kode OTP'}
                </button>
              </div>
            )}

            {pwdStep === 'verify_otp' && (
              <div className="flex flex-col items-center text-center space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight mb-3">Masukkan Kode OTP</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Silakan periksa kotak masuk email Anda dan masukkan kode otentikasi.
                  </p>
                </div>
                <div className="w-full relative group">
                  <div className="absolute inset-0 bg-brand/5 blur-xl rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input 
                    type="text" maxLength={8} placeholder="••••••"
                    value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="relative w-full bg-slate-50 border-2 border-slate-100 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 rounded-[1.5rem] font-black text-center text-4xl text-slate-800 tracking-[0.25em] placeholder-slate-300 py-6 outline-none transition-all"
                  />
                </div>
                {pwdError && <div className="p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl border border-rose-100 flex items-center gap-3 w-full text-left"><AlertCircle className="w-5 h-5 shrink-0"/>{pwdError}</div>}
                <button 
                  onClick={handleVerifyOTP} disabled={pwdIsLoading || otpCode.length < 6}
                  className="w-full py-4 bg-brand text-white font-black text-[15px] rounded-[1.5rem] hover:bg-brand/90 transition-all shadow-xl hover:shadow-brand/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-brand"
                >
                  {pwdIsLoading ? 'Memverifikasi...' : 'Konfirmasi Kode'}
                </button>
              </div>
            )}

            {pwdStep === 'update_pwd' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight mb-2">Buat Kata Sandi Baru</h3>
                  <p className="text-slate-500 font-medium">Pastikan kata sandi baru Anda kuat dan belum pernah digunakan sebelumnya.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="flex items-center p-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/10 transition-all">
                      <Key className="w-5 h-5 text-slate-400 shrink-0 mr-4 group-focus-within:text-brand transition-colors" />
                      <input 
                        type={showPwd ? "text" : "password"} placeholder="Ketik kata sandi baru"
                        value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800 placeholder-slate-400"
                      />
                      <button onClick={() => setShowPwd(!showPwd)} className="text-slate-400 hover:text-brand transition-colors p-1">
                        {showPwd ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className={`flex items-center p-4 bg-slate-50 border-2 rounded-[1.5rem] transition-all focus-within:bg-white focus-within:ring-4 ${
                      confirmPassword.length > 0 
                        ? (confirmPassword === newPassword ? 'border-emerald-200 focus-within:border-emerald-500 focus-within:ring-emerald-500/10' : 'border-rose-200 focus-within:border-rose-500 focus-within:ring-rose-500/10')
                        : 'border-slate-100 focus-within:border-brand focus-within:ring-brand/10'
                    }`}>
                      <Key className="w-5 h-5 text-slate-400 shrink-0 mr-4 group-focus-within:text-brand transition-colors" />
                      <input 
                        type={showPwd ? "text" : "password"} placeholder="Ulangi kata sandi baru"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800 placeholder-slate-400"
                      />
                      {confirmPassword.length > 0 && (
                        <div className="shrink-0 ml-2 animate-in zoom-in duration-300">
                          {confirmPassword === newPassword ? (
                            <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><Check className="w-4 h-4 stroke-[3]" /></div>
                          ) : (
                            <div className="bg-rose-100 text-rose-600 p-1 rounded-full"><X className="w-4 h-4 stroke-[3]" /></div>
                          )}
                        </div>
                      )}
                    </div>
                    {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                      <p className="text-rose-500 text-xs font-bold mt-2 ml-2 animate-in slide-in-from-top-1">Kombinasi kata sandi tidak cocok.</p>
                    )}
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="p-5 bg-white border-2 border-slate-100 shadow-sm rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Kekuatan Sandi</span>
                    <span className={`text-[11px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${checkPasswordStrength(newPassword).color.replace('bg-', 'bg-').replace('500', '100')} ${checkPasswordStrength(newPassword).color.replace('bg-', 'text-')}`}>
                      {checkPasswordStrength(newPassword).strength}
                    </span>
                  </div>
                  <div className="flex gap-1.5 mb-5 h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div className={`h-full rounded-full ${checkPasswordStrength(newPassword).color} transition-all duration-500 ease-out`} style={{ width: `${(checkPasswordStrength(newPassword).score / 6) * 100}%` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] font-bold text-slate-400">
                    <div className={`flex items-center gap-2 transition-colors ${checkPasswordStrength(newPassword).minLength ? 'text-emerald-600' : ''}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${checkPasswordStrength(newPassword).minLength ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent'}`}><Check className="w-2.5 h-2.5 stroke-[4]" /></div>
                      Min. 8 karakter
                    </div>
                    <div className={`flex items-center gap-2 transition-colors ${checkPasswordStrength(newPassword).hasUpper ? 'text-emerald-600' : ''}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${checkPasswordStrength(newPassword).hasUpper ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent'}`}><Check className="w-2.5 h-2.5 stroke-[4]" /></div>
                      1 huruf besar
                    </div>
                    <div className={`flex items-center gap-2 transition-colors ${checkPasswordStrength(newPassword).hasLower ? 'text-emerald-600' : ''}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${checkPasswordStrength(newPassword).hasLower ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent'}`}><Check className="w-2.5 h-2.5 stroke-[4]" /></div>
                      1 huruf kecil
                    </div>
                    <div className={`flex items-center gap-2 transition-colors ${checkPasswordStrength(newPassword).hasNumber ? 'text-emerald-600' : ''}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${checkPasswordStrength(newPassword).hasNumber ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent'}`}><Check className="w-2.5 h-2.5 stroke-[4]" /></div>
                      1 angka (0-9)
                    </div>
                    <div className={`flex items-center gap-2 transition-colors ${checkPasswordStrength(newPassword).noSpace ? 'text-emerald-600' : ''}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${checkPasswordStrength(newPassword).noSpace ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent'}`}><Check className="w-2.5 h-2.5 stroke-[4]" /></div>
                      Tanpa spasi
                    </div>
                    <div className={`flex items-center gap-2 transition-colors ${checkPasswordStrength(newPassword).notNameEmail ? 'text-emerald-600' : ''}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${checkPasswordStrength(newPassword).notNameEmail ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent'}`}><Check className="w-2.5 h-2.5 stroke-[4]" /></div>
                      Bukan nama/email
                    </div>
                  </div>
                </div>

                {pwdError && <div className="p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl border border-rose-100 flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0"/>{pwdError}</div>}
                
                <button 
                  onClick={handleUpdatePassword} disabled={pwdIsLoading || checkPasswordStrength(newPassword).score < 6 || confirmPassword !== newPassword}
                  className="w-full py-4 bg-brand text-white font-black text-[15px] rounded-[1.5rem] hover:bg-brand/90 transition-all shadow-xl hover:shadow-brand/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-brand"
                >
                  {pwdIsLoading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                </button>
              </div>
            )}

            {pwdStep === 'success' && (
              <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center">
                    <Check className="w-12 h-12 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 font-display tracking-tight mb-3">Berhasil!</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Kata sandi Anda telah berhasil diubah.<br/>
                    Gunakan kata sandi baru ini untuk login berikutnya.
                  </p>
                </div>
                <button 
                  onClick={() => setPwdStep('idle')} 
                  className="w-full mt-4 py-4 bg-emerald-500 text-white font-black text-[15px] rounded-[1.5rem] hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

