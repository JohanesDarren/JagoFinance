import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, User, CreditCard, ArrowLeft, Camera, CheckCircle, 
  AlertCircle, Loader2, Calendar, DollarSign, X, FileText, 
  ChevronRight, Image, Search, Lock, Mail, ArrowUpRight, ArrowRight,
  Check, Download, Maximize2, Sparkles, LogOut, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { scanReceiptAndUpload } from '../lib/hermesApi';

interface MobileAppSimulatorProps {
  transactions: Transaction[];
  cashBalance: number;
  onRefreshData: () => void;
  currentUserProfile?: any;
  onLogout?: () => void;
}

export default function MobileAppSimulator({ 
  transactions, 
  cashBalance, 
  onRefreshData,
  currentUserProfile,
  onLogout
}: MobileAppSimulatorProps) {
  
  // Mobile Router/State
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'forgot' | 'home' | 'scanner' | 'ai-loading' | 'form' | 'success' | 'history' | 'detail' | 'profile' | 'edit-profile' | 'avatar-camera' | 'avatar-gallery' | 'notifications'>('auth');
  
  // Authentication credentials
  const [email, setEmail] = useState(currentUserProfile?.email || '');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(!!currentUserProfile);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [subTier, setSubTier] = useState<'free' | 'pro'>('free');

  useEffect(() => {
    if (currentUserProfile) {
      setEmail(currentUserProfile.email || '');
      setIsLogged(true);
      setCurrentScreen('home');
      setSubTier('pro'); // default to pro for single tenant
    } else {
      setIsLogged(false);
      setCurrentScreen('auth');
      setSubTier('free');
    }
  }, [currentUserProfile]);

  // Scanner States
  const [cameraActive, setCameraActive] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanImageName, setScanImageName] = useState<string>('');
  const [scannedData, setScannedData] = useState<{
    merchant: string;
    date: string;
    category: string;
    amount: number;
    notes: string;
  } | null>(null);

  // Form State
  const [formMerchant, setFormMerchant] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState('Operasional');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formNotes, setFormNotes] = useState('');
  const [formItems, setFormItems] = useState<any[]>([]);
  const [formType, setFormType] = useState<'reimburse' | 'cash_advance'>('reimburse');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History / Filter States
  const [historyTab, setHistoryTab] = useState<'Semua' | 'Pending' | 'Selesai'>('Semua');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [zoomReceipt, setZoomReceipt] = useState(false);

  // Profile / Notification banner
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    fullName: currentUserProfile?.full_name || '',
    phone: '',
    email: currentUserProfile?.email || '',
    bankName: 'Mandiri',
    bankAccount: '5540982738',
    accountHolder: currentUserProfile?.full_name || ''
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Remaining list calculations for specific employee
  const employeeEmail = (currentUserProfile?.email || email).trim();
  const staffName = currentUserProfile?.full_name || employeeEmail.split('@')[0]
    .split('.')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const staffTransactions = transactions.filter(t => t.employeeId === currentUserProfile?.id);
  const limitMax = 15000000; // Rp 15.000.000 Limit Bulanan
  
  // Calculate approved and pending payments
  const totalApproved = staffTransactions
    .filter(t => t.status === 'Approved' && t.type === 'reimburse')
    .reduce((sum, t) => sum + t.amount, 0);
  const sisaLimit = Math.max(0, limitMax - totalApproved);
  const limitPercentage = (sisaLimit / limitMax) * 100;

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoginError('');
    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        // Fetch user profile
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*, companies(*)')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profileData) {
          throw new Error('Karyawan tidak memiliki profil yang terdaftar.');
        }

        if (profileData.role !== 'employee') {
          throw new Error('Akses ditolak. Portal ini hanya untuk karyawan lapangan.');
        }

        setIsLogged(true);
        setCurrentScreen('home');
        // Let App.tsx know that a user logged in successfully
        if (onRefreshData) onRefreshData();
      } else {
        // Mock offline bypass login
        setIsLogged(true);
        setCurrentScreen('home');
        onRefreshData();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setCurrentScreen('auth');
      }, 3000);
    }
  };

  // 3. Initiate Scanner
  const handleOpenScanner = (typeOption: 'reimburse' | 'cash_advance') => {
    if (subTier === 'free') {
      setShowPaywall(true);
      return;
    }
    setFormType(typeOption);
    setScanImage(null);
    setScanImageName('');
    setScannedData(null);
    setCurrentScreen('scanner');
  };

  const triggerOcrScan = async (base64Data: string, fileName: string, fileType: string) => {
    setCurrentScreen('ai-loading');
    try {
      setScanImage(base64Data);
      setScanImageName(fileName);

      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data, fileName, mimeType: fileType })
      });
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error || 'Gagal mengekstrak data');

      const extracted = resData.extracted;
      setFormMerchant(extracted.merchant || '');
      setFormDate(extracted.date || new Date().toISOString().split('T')[0]);
      setFormCategory(extracted.category || 'Operasional');
      setFormAmount(extracted.amount || 0);
      setFormNotes(extracted.notes || '');
      setFormItems(extracted.items || []);
      
      setCurrentScreen('form');
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Gagal memproses struk.');
      setCurrentScreen('dashboard');
    }
  };

  // 5. Handle File Upload from Gallery (Convert to Base64 & Send to Server)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      await triggerOcrScan(base64Data, file.name, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormItems(newItems);
    const total = newItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    setFormAmount(total);
  };

  const addManualItem = () => {
    setFormItems([...formItems, { id: Math.random().toString(), name: '', price: 0, quantity: 1 }]);
  };
  
  const removeItem = (index: number) => {
    const newItems = formItems.filter((_, i) => i !== index);
    setFormItems(newItems);
    const total = newItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    setFormAmount(total);
  };

  // 6. Form Submission back to DB
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMerchant || !formAmount) {
      setFormError('Merchant dan Nominal wajib diisi');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');

    try {
      let finalReceiptUrl = scanImage || '';
      if (finalReceiptUrl.startsWith('data:') && isSupabaseConfigured()) {
        const { uploadReceipt } = await import('../lib/hermesApi');
        finalReceiptUrl = await uploadReceipt(scanImage!, scanImageName, 'image/jpeg');
      }

      if (isSupabaseConfigured() && currentUserProfile) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const { error } = await supabase
          .from('transactions')
          .insert([{
            employee_id: currentUserProfile.id,
            merchant: formMerchant,
            category: formCategory,
            amount: Number(formAmount),
            notes: formNotes,
            status: 'pending',
            receipt_url: finalReceiptUrl,
            type: formType
          }]);

        if (error) throw error;
        
        setIsSubmitting(false);
        setCurrentScreen('success');
        onRefreshData();
      } else {
        const response = await fetch('/api/reimburse/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchant: formMerchant,
            date: formDate,
            category: formCategory,
            amount: Number(formAmount),
            notes: formNotes,
            receiptUrl: finalReceiptUrl,
            employeeId: currentUserProfile?.id,
            type: formType
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setIsSubmitting(false);
          setCurrentScreen('success');
          onRefreshData();
        } else {
          setFormError(data.error || 'Gagal mengirim pengajuan.');
          setIsSubmitting(false);
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Hubungan ke server terputus. Coba lagi.');
      setIsSubmitting(false);
    }
  };

  const handleOpenDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    setCurrentScreen('detail');
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 lg:px-4">
      
      {/* Smartphone frame container */}
      <div className="relative w-[360px] h-[720px] bg-slate-900 rounded-[48px] iphone-bezel p-[11px] overflow-hidden select-none border-[3px] border-slate-800">
        
        {/* Notch simulation */}
        <div className="absolute top-[16px] left-1/2 transform -translate-x-1/2 w-[110px] h-[25px] bg-slate-900 rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
          <div className="w-12 h-1 rounded-full bg-slate-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950"></div>
        </div>

        {/* Smartphone Shell Content */}
        <div className="w-full h-full bg-[#f8f9fe] rounded-[38px] overflow-hidden flex flex-col relative text-slate-800 font-sans">
          
          {/* Top Status Bar (Time, Wifi, Battery) */}
          <div className="h-10 pt-4 px-6 flex justify-between items-center text-[11px] font-semibold text-slate-600 bg-[#f8f9fe] z-40">
            <span>15:09 GMT</span>
            <div className="flex items-center gap-1.5">
              <span>LTE</span>
              <div className="w-4 h-2 border border-slate-600 rounded-sm p-0.5 flex items-center">
                <div className="w-2 h-full bg-slate-600 rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Screen Switcher */}
          <div className="flex-1 overflow-y-auto pb-16 flex flex-col">
            
            {/* SCREEN 1: LOGIN (AUTH) */}
            {currentScreen === 'auth' && (
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
                    className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
                    id="mobile_signin_btn"
                  >
                    <span>Masuk sebagai Staff</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="text-center text-[10px] text-slate-400">
                  <span>Authorized staff only • JagoAI group © 2026</span>
                </div>
              </div>
            )}

            {/* SCREEN 2: FORGOT PASSWORD */}
            {currentScreen === 'forgot' && (
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <button 
                    onClick={() => setCurrentScreen('auth')}
                    className="p-1.5 bg-white text-slate-500 rounded-lg shadow-2xs border border-slate-100 flex items-center gap-1 text-[11px] mt-2 mb-6"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                  </button>
                  
                  <h3 className="text-lg font-bold text-slate-900 font-display">Lupa Kata Sandi</h3>
                  <p className="text-xs text-slate-500 mt-1">Masukkan alamat email terdaftar Anda untuk memicu pengiriman kode verifikasi pengaturan ulang.</p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4 my-auto">
                  {forgotSuccess ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-100 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Tautan Terkirim!</span>
                        Silakan periksa kotak masuk email Anda {forgotEmail || 'terdaftar'} untuk melanjutkan.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Terdaftar</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none" 
                          placeholder="nama@jagoai.id"
                        />
                      </div>
                    </div>
                  )}

                  {!forgotSuccess && (
                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl hover:bg-opacity-95 transition-all"
                    >
                      Kirim Tautan Atur Ulang
                    </button>
                  )}
                </form>

                <div className="text-center text-[10px] text-slate-400">
                  <span className="cursor-pointer font-medium hover:underline" onClick={() => setCurrentScreen('auth')}>Kembali ke login</span>
                </div>
              </div>
            )}

            {/* SCREEN 3: HOME DASHBOARD */}
            {currentScreen === 'home' && (
              <div className="p-4 space-y-5 pb-24 h-full overflow-y-auto bg-slate-50 relative">
                
                {/* Top subtle gradient blob */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-indigo-100/60 to-transparent pointer-events-none"></div>

                {/* Header (Sapaan, notification bell, profile photo) */}
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                        alt="Profile avatar" 
                        className="w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold">Selamat pagi,</p>
                      <h4 className="text-sm font-black text-slate-800 tracking-tight">{staffName}</h4>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Ring alarm notification click */}
                    <button 
                      onClick={() => setCurrentScreen('notifications')}
                      className="relative p-2.5 text-slate-600 bg-white rounded-full shadow-sm hover:shadow transition-all border border-slate-100"
                    >
                      <Bell className="w-4 h-4" />
                      <div className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border border-white rounded-full"></div>
                    </button>
                  </div>
                </div>

                {/* Reimburse Limit Card (Glassy/Modern) */}
                <div className="bg-gradient-to-br from-indigo-600 via-brand to-violet-600 text-white p-5 rounded-[24px] shadow-xl shadow-indigo-200 relative overflow-hidden z-10">
                  {/* Decorative Elements */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-100 block opacity-90">Sisa Limit Reimburse</span>
                      <h3 className="text-2xl font-black font-display tracking-tight mt-1">Rp {sisaLimit.toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="text-[9px] bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-bold text-white shadow-sm">Bulan Ini</div>
                  </div>

                  {/* Limit Progression bar */}
                  <div className="mt-5 relative z-10">
                    <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${limitPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-indigo-100 mt-2 font-medium">
                      <span>Terpakai: <span className="font-bold text-white">Rp {totalApproved.toLocaleString('id-ID')}</span></span>
                      <span>Kuota: <span className="font-bold text-white">Rp {limitMax.toLocaleString('id-ID')}</span></span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons (Reimburse & Cash Advance) */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <button 
                    onClick={() => handleOpenScanner('reimburse')}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand transition-all text-left flex flex-col justify-between h-24 relative overflow-hidden group"
                    id="mobile_action_reimburse"
                  >
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors"></div>
                    <div className="p-2 bg-indigo-50 text-brand rounded-xl w-max mb-1 relative z-10">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="relative z-10">
                      <span className="font-black text-xs text-slate-800 block leading-snug">Reimburse</span>
                      <span className="text-[9px] text-slate-500 font-medium">Scan struk instan</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleOpenScanner('cash_advance')}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand transition-all text-left flex flex-col justify-between h-24 relative overflow-hidden group"
                    id="mobile_action_cashadvance"
                  >
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-violet-50 rounded-full group-hover:bg-violet-100 transition-colors"></div>
                    <div className="p-2 bg-violet-50 text-violet-700 rounded-xl w-max mb-1 relative z-10">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="relative z-10">
                      <span className="font-black text-xs text-slate-800 block leading-snug">Cash Advance</span>
                      <span className="text-[9px] text-slate-500 font-medium">Pinjaman kas muka</span>
                    </div>
                  </button>
                </div>

                {/* Recent Activity Portion (3 pengajuan terakhir) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Aktivitas Terakhir</span>
                    <button 
                      onClick={() => setCurrentScreen('history')}
                      className="text-[10px] text-brand hover:underline font-semibold"
                    >
                      Sisa ({staffTransactions.length})
                    </button>
                  </div>

                  {staffTransactions.length === 0 ? (
                    /* Empty States specifically for employee */
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center space-y-2 text-slate-500 shadow-sm mt-2">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">Belum ada pengajuan reimburse bulan ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {staffTransactions.slice(0, 3).map((tx) => (
                        <div 
                          key={tx.id}
                          onClick={() => handleOpenDetail(tx)}
                          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow hover:border-brand/30 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black w-10 h-10 flex items-center justify-center">
                              {tx.merchant.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-bold text-[11px] text-slate-800 tracking-tight leading-3 truncate w-[130px]">{tx.merchant}</h5>
                              <p className="text-[9px] text-slate-500 font-medium mt-1">{tx.date} • {tx.category}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-mono text-xs font-black text-slate-800 block">Rp {tx.amount.toLocaleString('id-ID')}</span>
                            <span className={`inline-block text-[8px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                              tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                              tx.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visual Guidelines Banner */}
                <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl text-[9px] text-brand flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold block">Integrasi Scanner AI</span>
                    Gunakan kamera ponsel untuk mengambil foto struk cetak. AI jagoAI secara otomatis mendeteksi kategori dan total tagihan tanpa salah ketik.
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 4: CAPTURE RECEIPT (GUIDELINE OVERLAY SCREEN) */}
            {currentScreen === 'scanner' && (
              <div className="flex-1 bg-black flex flex-col relative">
                
                {/* Header back */}
                <div className="p-4 flex justify-between items-center text-white z-20">
                  <button 
                    onClick={() => setCurrentScreen('home')}
                    className="p-1.5 bg-white/20 rounded-lg text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-xs text-white">Scanner Nota AI</span>
                  <div className="w-7 h-7"></div>
                </div>

                {/* Animated guidline overlay panel */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
                  
                  {/* Guide text overlay */}
                  <span className="absolute top-4 text-[9px] bg-slate-950/80 text-indigo-200 px-3 py-1 rounded-full text-center tracking-wider font-semibold z-20 uppercase">
                    Posisikan struk dalam kotak panduan
                  </span>

                  {/* Rectangle Scanner Sight Guides */}
                  <div className="w-[250px] h-[340px] border-2 border-dashed border-indigo-400 rounded-2xl relative flex items-center justify-center p-3 overflow-hidden bg-slate-900/60 z-10 shadow-lg shadow-black/80">
                    
                    {/* Laser line effect scan */}
                    <motion.div 
                      animate={{ top: ['0%', '98%', '0%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-brand shadow-[0_0_15px_rgba(99,102,241,1)] w-full z-20"
                    />
                    
                    {/* Corner decorators overlay */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-light"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-light"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-light"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-light"></div>

                    {/* Guidelines hint icon */}
                    <div className="text-center text-indigo-200 space-y-2 z-10 p-4">
                      <Camera className="w-10 h-10 mx-auto text-indigo-400 opacity-60" />
                      <p className="text-[8px] leading-snug">Foto struk belanjamu di kafe, restoran, jalan tol, bensin, atau server cloud.</p>
                    </div>
                  </div>
                </div>

                {/* Camera Controller buttons */}
                <div className="p-4 bg-slate-950 space-y-3 z-20 text-white border-t border-slate-900">

                  {/* Manual file upload & Capture triggers */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-xl hover:bg-slate-800 font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>Unggah dari Galeri</span>
                    </button>
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 5: AI PROCESSING STATE (SHIMMER TRANSITION PAGE) */}
            {currentScreen === 'ai-loading' && (
              <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-950 text-white">
                <div className="space-y-6 text-center">
                  
                  {/* Circle loading system or logo */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                    <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold font-display uppercase tracking-widest text-indigo-300">jagoAI OCR Engine</h4>
                    <p className="text-[10px] text-slate-400 font-medium animate-pulse">AI sedang mengekstrak data struk...</p>
                  </div>

                  {/* Skeleton/Shimmer blocks representing extracted field names */}
                  <div className="w-[200px] mx-auto bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 space-y-2.5 text-left">
                    <div className="flex justify-between items-center">
                      <div className="h-2 bg-slate-800 w-16 rounded-full shimmer-brand-active"></div>
                      <div className="h-2 bg-slate-800 w-20 rounded-full shimmer-active"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-2 bg-slate-800 w-12 rounded-full shimmer-brand-active"></div>
                      <div className="h-2 bg-slate-800 w-24 rounded-full shimmer-active"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-2 bg-slate-800 w-20 rounded-full shimmer-brand-active"></div>
                      <div className="h-2 bg-slate-800 w-14 rounded-full shimmer-active"></div>
                    </div>
                  </div>

                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">Menganalisis Kategori & Nominal Pajak</span>
                </div>
              </div>
            )}

            {/* SCREEN 6: REVIEW & EDIT FORM */}
            {currentScreen === 'form' && (
              <div className="p-4 space-y-4">
                
                {/* Header return */}
                <div className="flex justify-between items-center mb-1">
                  <button 
                    onClick={() => setCurrentScreen('scanner')}
                    className="p-1 text-slate-500 bg-white border border-slate-100 rounded-lg shadow-2xs flex items-center text-[10px]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Ulangi
                  </button>
                  <span className="text-xs font-bold font-display text-slate-800">Verifikasi Hasil AI</span>
                  <div className="w-8"></div>
                </div>

                {/* Mini Receipt Preview */}
                {scanImage && (
                  <div className="bg-slate-100 rounded-xl relative overflow-hidden h-24 border border-dashed border-slate-200">
                    <img src={scanImage} alt="Scanned file preview" className="w-full h-full object-cover blur-[0.5px] opacity-85" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                      <div className="text-white">
                        <span className="text-[8px] uppercase tracking-wider bg-indigo-600 px-1.5 py-0.5 rounded-full inline-block font-semibold">Tipe: {formType === 'reimburse' ? 'Reimburse' : 'Cash Advance'}</span>
                        <h6 className="text-[9px] font-mono mt-1 opacity-90 truncate w-[250px]">{scanImageName || 'reimburse_invoice.png'}</h6>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Form */}
                <form onSubmit={handleFormSubmit} className="space-y-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-3xs">
                  
                  {formError && (
                    <div className="p-2.5 bg-rose-50 text-rose-800 text-[10px] rounded-lg border border-rose-100">
                      <span className="font-semibold block mb-0.5">Penyerahan Gagal</span>
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Nama Merchant / Toko</label>
                    <input 
                      type="text" 
                      value={formMerchant}
                      onChange={(e) => setFormMerchant(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none font-semibold text-slate-850"
                      placeholder="Masukkan nama merchant"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tanggal Nota</label>
                      <input 
                        type="date" 
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pilih Kategori</label>
                      <select 
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                      >
                        <option value="Operasional">Operasional</option>
                        <option value="Transportasi">Transportasi</option>
                        <option value="Server">Server</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Utilitas & Kantor">Utilitas & Kantor</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Nominal Tagihan (IDR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">Rp</span>
                      <input 
                        type="number" 
                        value={formAmount || ''}
                        onChange={(e) => setFormAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none font-mono font-bold text-slate-800"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Line Items Section */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Produk Terdeteksi</label>
                      <button 
                        type="button" 
                        onClick={addManualItem}
                        className="text-[9px] font-bold text-brand bg-indigo-50 px-2 py-1 rounded-md"
                      >
                        + Tambah Manual
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formItems.map((item, idx) => (
                        <div key={item.id || idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex gap-2 items-center relative">
                          <button 
                            type="button" 
                            onClick={() => removeItem(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-rose-100 text-rose-600 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="flex-1 space-y-1">
                            <input 
                              type="text" 
                              value={item.name}
                              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                              className="w-full text-[10px] bg-white border border-slate-200 rounded px-2 py-1 font-semibold"
                              placeholder="Nama Produk"
                            />
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <span className="absolute left-1.5 top-1 text-[9px] font-bold text-slate-500">Rp</span>
                                <input 
                                  type="number" 
                                  value={item.price}
                                  onChange={(e) => handleItemChange(idx, 'price', Number(e.target.value))}
                                  className="w-full pl-6 pr-2 py-1 text-[10px] bg-white border border-slate-200 rounded font-mono"
                                  placeholder="Harga"
                                />
                              </div>
                              <div className="w-16 relative">
                                <span className="absolute left-1.5 top-1 text-[9px] font-bold text-slate-500">x</span>
                                <input 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                                  className="w-full pl-5 pr-2 py-1 text-[10px] bg-white border border-slate-200 rounded text-center"
                                  placeholder="Qty"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {formItems.length === 0 && (
                        <div className="text-[9px] text-slate-400 italic text-center py-2">Belum ada item produk terdeteksi.</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Catatan Tambahan (Opsional)</label>
                    <textarea 
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                      placeholder="Contoh: Beli kopi untuk meeting klien PT Sentosa..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengirim Data...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Kirim ke Tim Keuangan</span>
                      </>
                    )}
                  </button>
                </form>

              </div>
            )}

            {/* SCREEN 7: SUCCESS STATE SCREEN */}
            {currentScreen === 'success' && (
              <div className="flex-1 flex flex-col justify-between p-6 bg-[#f8f9fe]">
                
                <div className="text-center my-auto space-y-4">
                  
                  {/* Ring check layout wrapper */}
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold font-display text-slate-900 leading-tight">Pengajuan Berhasil!</h3>
                    <p className="text-xs text-slate-500 px-4">Nota struk belanja Anda telah direkam dan diajukan ke tim Finance PT JagoAI.</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-100 text-left text-[9px] text-slate-500 space-y-1 inline-block">
                    <span className="font-bold text-[10px] text-slate-700 block">⚡ Audit AI Dimulai:</span>
                    <p>Status pengajuan saat ini <b>Pending (Dalam Review)</b>. Anda dapat memantau status persetujuan, chat penolakan, atau pencairan langsung secara real-time pada tab Riwayat.</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setCurrentScreen('home');
                    onRefreshData();
                  }}
                  className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl hover:bg-opacity-95 transition-all"
                >
                  Kembali ke Beranda
                </button>

              </div>
            )}

            {/* SCREEN 8: RIWAYAT / TRANSACTION HISTORY */}
            {currentScreen === 'history' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentScreen('home')}
                    className="p-1 px-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Beranda
                  </button>
                  <span className="text-xs font-bold font-display text-slate-800">Riwayat Pengajuan</span>
                  <div className="w-8"></div>
                </div>

                {/* Tab Controller Filter Tab Bar Navigation */}
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[10px] font-bold">
                  {(['Semua', 'Pending', 'Selesai'] as const).map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setHistoryTab(tab)}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                        historyTab === tab 
                          ? 'bg-white text-brand shadow-3xs' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Filter list */}
                {(() => {
                  const filtered = staffTransactions.filter(t => {
                    if (historyTab === 'Semua') return true;
                    if (historyTab === 'Pending') return t.status === 'Pending';
                    return t.status === 'Approved' || t.status === 'Rejected';
                  });

                  return filtered.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-2 text-slate-500 mt-2">
                      <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400">Tidak ada pengajuan ditemukan.</p>
                        <p className="text-[8px] text-slate-400 mt-0.5">Filter aktif: Tab {historyTab}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1.5">
                      {filtered.map((t) => (
                        <div 
                          key={t.id}
                          onClick={() => handleOpenDetail(t)}
                          className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs hover:border-slate-200 transition-all flex justify-between items-center cursor-pointer"
                        >
                          <div>
                            <span className="text-[8px] text-slate-400 block">{t.date}</span>
                            <h6 className="font-bold text-[10px] text-slate-800 truncate w-[160px] leading-snug">{t.merchant}</h6>
                            <span className="text-[8px] uppercase font-bold tracking-wider text-indigo-500 inline-block mt-0.5">{t.category}</span>
                          </div>

                          <div className="text-right flex flex-col items-end">
                            <span className="font-mono text-[9px] font-bold text-slate-700 block">Rp {t.amount.toLocaleString('id-ID')}</span>
                            <span className={`inline-block text-[7px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                              t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              t.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

              </div>
            )}

            {/* SCREEN 9: DETAIL VIEW & TIMELINE VERTICAL TRACKER */}
            {currentScreen === 'detail' && selectedTx && (
              <div className="p-4 space-y-4">
                
                {/* Header back history */}
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => {
                      setSelectedTx(null);
                      setCurrentScreen('history');
                    }}
                    className="p-1 px-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Riwayat
                  </button>
                  <span className="text-xs font-bold font-display text-slate-800">Detail Status Klaim</span>
                  <div className="w-8"></div>
                </div>

                {/* Expense basic detail card */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-4xs space-y-2 relative">
                  
                  {/* Status Tag floating */}
                  <span className={`absolute top-3.5 right-3.5 text-[8px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTx.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    selectedTx.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {selectedTx.status}
                  </span>

                  <div>
                    <span className="text-[9px] font-semibold text-indigo-500 uppercase tracking-widest block">{selectedTx.category} • {selectedTx.type.toUpperCase().replace(/_/g, ' ')}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">{selectedTx.merchant}</h4>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tanggal Invoice: {selectedTx.date}</span>
                  </div>

                  <div className="b-t border-slate-150 py-2">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">TOTAL REIMBURSE</span>
                    <span className="text-sm font-bold font-mono tracking-tight text-brand">Rp {selectedTx.amount.toLocaleString('id-ID')}</span>
                  </div>

                  {selectedTx.notes && (
                    <p className="text-[9px] text-slate-500 bg-slate-50 p-2 rounded-lg leading-relaxed italic">
                      "{selectedTx.notes}"
                    </p>
                  )}

                  {/* Rejection Notification box */}
                  {selectedTx.status === 'Rejected' && selectedTx.rejectReason && (
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-[9px] text-rose-800 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-rose-900"><AlertCircle className="w-3 h-3 text-rose-700" /> Alasan Penolakan Finance:</span>
                      <p className="italic">"{selectedTx.rejectReason}"</p>
                    </div>
                  )}
                </div>

                {/* Struk Image Box Zoomable */}
                {selectedTx.receiptUrl && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Unggahan Bukti Nota</span>
                    
                    <div className="bg-slate-100 rounded-xl relative overflow-hidden h-24 border border-slate-200">
                      <img src={selectedTx.receiptUrl} alt="Receipt proof file" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setZoomReceipt(true)}
                        className="absolute bottom-2 right-2 p-1.5 bg-slate-950/70 text-white rounded-lg hover:bg-slate-950 transition-all shadow-xs"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Zoom Receipt Modal Mock Overlay */}
                <AnimatePresence>
                  {zoomReceipt && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-4"
                    >
                      <div className="flex justify-between items-center pt-8 text-white">
                        <span className="text-xs font-semibold text-slate-300">Zoom Bukti Struk</span>
                        <button 
                          onClick={() => setZoomReceipt(false)}
                          className="p-1 px-1.5 bg-white/20 rounded-lg text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1 flex justify-center items-center py-6">
                        <img 
                          src={selectedTx.receiptUrl} 
                          alt="Expanded receipt preview" 
                          className="max-w-full max-h-[460px] object-contain rounded-lg shadow-xl"
                        />
                      </div>

                      <span className="text-center text-[10px] text-slate-400 pb-4">
                        Ketuk tombol silang di kanan atas untuk menutup zoom.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* STATUS TRACKER VERTICAL */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-4xs space-y-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Status Transaksi</span>
                  
                  <div className="space-y-4 relative pl-5 border-l border-indigo-100 ml-1.5 py-1">
                    <div className="relative text-[10px]">
                      <div className={`absolute -left-[25px] top-0.5 w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                        selectedTx.status === 'Approved' ? 'bg-emerald-500 border-emerald-500' : 
                        selectedTx.status === 'Rejected' ? 'bg-rose-500 border-rose-500' : 
                        'bg-amber-500 border-amber-500'
                      }`}>
                        {selectedTx.status === 'Approved' && <Check className="w-2 h-2 text-white stroke-[3]" />}
                        {selectedTx.status === 'Rejected' && <X className="w-2 h-2 text-white stroke-[3]" />}
                      </div>
                      <div className="leading-snug">
                        <span className={`font-bold block ${
                          selectedTx.status === 'Approved' ? 'text-emerald-600' :
                          selectedTx.status === 'Rejected' ? 'text-rose-600' :
                          'text-amber-600'
                        }`}>
                          {selectedTx.status === 'Approved' ? 'Disetujui & Dana Cair' :
                           selectedTx.status === 'Rejected' ? 'Ditolak' :
                           'Sedang Direview'}
                        </span>
                        <span className="text-[8px] text-slate-400">
                          {selectedTx.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 10: PORTFOLIO & PAYROLL DETAIL */}
            {currentScreen === 'profile' && (
              <div className="p-4 space-y-4 pb-24 h-full overflow-y-auto bg-slate-50/50">
                
                <div className="flex justify-center items-center mb-2">
                  <span className="text-sm font-black font-display text-slate-800 tracking-tight">Akun & Payroll</span>
                </div>

                {/* Profile section block card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50/20"></div>
                  
                  <div className="relative z-10 pt-2">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                      alt="Avatar profile large" 
                      className="w-20 h-20 rounded-full border-[3px] border-white shadow-md object-cover"
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">✓</div>
                  </div>

                  <div className="relative z-10">
                    <h5 className="font-black text-sm text-slate-800 leading-tight">{staffName}</h5>
                    <p className="text-[10px] text-brand font-bold mt-1">Project Manager • Operations</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">ID Karyawan: EMP-003</p>
                  </div>

                  <div className="w-full bg-slate-50 rounded-2xl p-3.5 text-left space-y-2.5 mt-2 relative z-10 border border-slate-100/50">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">Email Kantor</span>
                      <span className="font-semibold text-slate-700 text-right">{employeeEmail}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">Bank Rekening</span>
                      <span className="font-bold text-slate-800 text-right">Mandiri <span className="font-mono text-brand bg-indigo-50 px-1.5 py-0.5 rounded ml-1">5540982738</span></span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentScreen('edit-profile')}
                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-[10px] rounded-xl hover:bg-slate-50 transition-colors relative z-10 shadow-xs mt-1"
                  >
                    Edit Profil
                  </button>
                </div>

                {/* History Navigation Button */}
                <button 
                  onClick={() => {
                    setCurrentScreen('history');
                    setSelectedTx(null);
                  }}
                  className="w-full bg-white p-3.5 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between text-left hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="font-bold text-sm text-slate-800">Riwayat Pengajuan</h6>
                      <p className="text-[10px] text-slate-400">Pantau status transaksi & klaim</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Payroll Payslip Card listings */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Unduh Slip Gaji (PDF)</span>
                  
                  <div className="space-y-1.5">
                    {[
                      { period: 'Mei 2026', desc: 'Gaji Pokok PM', amount: 18000000 },
                      { period: 'April 2026', desc: 'Gaji Pokok PM', amount: 18000000 },
                      { period: 'Maret 2026', desc: 'Gaji Pokok PM + THR', amount: 36000000 }
                    ].map((ps, idx) => (
                      <div 
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-4xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                            <FileText className="w-4 h-4 text-brand" />
                          </div>
                          <div>
                            <h6 className="font-bold text-[10px] text-slate-800 leading-tight">{ps.period}</h6>
                            <p className="text-[8px] text-slate-400 mt-0.5">{ps.desc} • Mandiri</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => alert(`Simulasi mengunduh Slip Gaji PDF JagoAI Periode ${ps.period} senilai Rp ${ps.amount.toLocaleString('id-ID')}!`)}
                          className="p-1 px-2 bg-indigo-50 text-indigo-700 hover:bg-brand hover:text-white rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Download className="w-3 h-3" />
                          <span>Minta PDF</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={() => {
                    if (onLogout) onLogout();
                    else setIsLogged(false);
                  }}
                  className="w-full bg-rose-50 text-rose-600 p-3.5 rounded-2xl border border-rose-100 shadow-3xs flex items-center justify-center gap-2 font-bold text-xs mt-6 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Akun
                </button>

              </div>
            )}

            {/* SCREEN 11: EDIT PROFILE */}
            {currentScreen === 'edit-profile' && (
              <div className="p-4 space-y-4 pb-24 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setCurrentScreen('profile')}
                    className="p-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold font-display text-slate-800">Edit Profil</span>
                  <div className="w-8"></div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <img 
                        src={editProfileData.avatarImage}
                        alt="Avatar profile" 
                        className="w-16 h-16 rounded-full border-4 border-indigo-50 object-cover opacity-80"
                      />
                      <button 
                        onClick={() => setShowAvatarPicker(true)}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full text-white"
                      >
                        <Camera className="w-4 h-4" />
                        <span className="text-[7px] font-bold mt-0.5">UBAH</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showAvatarPicker && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-slate-900/40 z-40 rounded-[40px]"
                          onClick={() => setShowAvatarPicker(false)}
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: 100 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 100 }}
                          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-6 space-y-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-800 text-sm">Ubah Foto Profil</h4>
                            <button onClick={() => setShowAvatarPicker(false)} className="p-1 text-slate-400 bg-slate-100 rounded-full">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => {
                                setShowAvatarPicker(false);
                                setCurrentScreen('avatar-camera');
                              }}
                              className="flex flex-col items-center justify-center p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 space-y-2 active:bg-indigo-100 transition-colors"
                            >
                              <Camera className="w-6 h-6" />
                              <span className="text-[10px] font-bold">Kamera</span>
                            </button>
                            <button 
                              onClick={() => {
                                setShowAvatarPicker(false);
                                setCurrentScreen('avatar-gallery');
                              }}
                              className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 space-y-2 active:bg-slate-100 transition-colors"
                            >
                              <Image className="w-6 h-6" />
                              <span className="text-[10px] font-bold">Galeri</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={editProfileData.fullName}
                        onChange={(e) => setEditProfileData({...editProfileData, fullName: e.target.value})}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={editProfileData.email}
                        onChange={(e) => setEditProfileData({...editProfileData, email: e.target.value})}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Nomor Handphone (WhatsApp)</label>
                      <input 
                        type="tel" 
                        value={editProfileData.phone}
                        onChange={(e) => setEditProfileData({...editProfileData, phone: e.target.value})}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                      />
                      <p className="text-[9px] text-slate-400 mt-1 italic">* Pastikan nomor ini adalah nomor WhatsApp yang aktif untuk menerima notifikasi.</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <h6 className="text-[10px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Informasi Rekening</h6>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Bank</label>
                          <input 
                            type="text" 
                            value={editProfileData.bankName}
                            onChange={(e) => setEditProfileData({...editProfileData, bankName: e.target.value})}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Nomor Rekening</label>
                          <input 
                            type="text" 
                            value={editProfileData.bankAccount}
                            onChange={(e) => setEditProfileData({...editProfileData, bankAccount: e.target.value})}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl font-mono focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Pemilik Rekening</label>
                          <input 
                            type="text" 
                            value={editProfileData.accountHolder}
                            onChange={(e) => setEditProfileData({...editProfileData, accountHolder: e.target.value})}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      // Simulasikan penyimpanan
                      setCurrentScreen('profile');
                    }}
                    className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl shadow-xs mt-4 flex justify-center items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 12: AVATAR CAMERA */}
            {currentScreen === 'avatar-camera' && (
              <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
                <div className="absolute top-6 left-4 right-4 flex justify-between z-10 text-white">
                  <button onClick={() => setCurrentScreen('edit-profile')} className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')`}}></div>
                  <div className="w-64 h-64 rounded-full border-2 border-white/50 border-dashed relative z-10 bg-slate-900/40 backdrop-blur-md overflow-hidden flex items-center justify-center">
                     <div className="w-full h-full bg-cover bg-center opacity-40" style={{backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')`}}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <span className="text-white/70 text-xs bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Arahkan wajah ke dalam lingkaran</span>
                  </div>
                </div>
                <div className="h-32 bg-black/80 flex items-center justify-center pb-4 z-10">
                  <button 
                    onClick={() => {
                      setEditProfileData({...editProfileData, avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'});
                      setCurrentScreen('edit-profile');
                    }}
                    className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-slate-900"></div>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 13: AVATAR GALLERY */}
            {currentScreen === 'avatar-gallery' && (
              <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <button onClick={() => setCurrentScreen('edit-profile')} className="p-1.5 bg-slate-50 text-slate-600 rounded-lg">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-800">Pilih Foto dari Galeri</span>
                </div>
                <div className="flex-1 p-1 overflow-y-auto grid grid-cols-3 gap-1">
                  {[
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
                  ].map((url, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setEditProfileData({...editProfileData, avatarImage: url});
                        setCurrentScreen('edit-profile');
                      }}
                      className="aspect-square relative group"
                    >
                      <img src={url} alt={`Gallery item ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors"></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 14: NOTIFICATIONS */}
            {currentScreen === 'notifications' && (
              <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
                <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
                  <button onClick={() => setCurrentScreen('home')} className="p-1.5 bg-slate-50 text-slate-600 rounded-lg shadow-2xs">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-800">Notifikasi</span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 pb-24">
                  <div className="bg-white p-3 rounded-2xl shadow-3xs border border-indigo-50 flex gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-slate-800">Review AI Berhasil</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Sistem AI JagoKeuangan mendeteksi struk Anda yang tertunda sudah berhasil masuk antrian audit admin.</p>
                      <span className="text-[8px] font-bold text-slate-400 mt-1 block">Baru saja</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-3xs border border-slate-50 flex gap-3 opacity-70">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-slate-800">Reimburse Disetujui</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Pengajuan Rp 142.000 (Starbucks Coffee) telah disetujui dan ditransfer.</p>
                      <span className="text-[8px] font-bold text-slate-400 mt-1 block">2 jam yang lalu</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Native Smartphone App Bar Navigation (Only when logged) */}
          {isLogged && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-150 rounded-b-[38px] px-10 flex justify-between items-center z-40">
              <button 
                onClick={() => {
                  setCurrentScreen('home');
                  setSelectedTx(null);
                }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'home' ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[8px] font-bold">Home</span>
              </button>

              {/* Central Floating Camera quick action */}
              <button 
                onClick={() => handleOpenScanner('reimburse')}
                className="w-10 h-10 -mt-6 bg-brand text-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md shadow-brand/40 z-50 border-2 border-white"
              >
                <Camera className="w-5 h-5" />
              </button>

              <button 
                onClick={() => {
                  setCurrentScreen('profile');
                  setSelectedTx(null);
                }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'profile' ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <User className="w-4 h-4" />
                <span className="text-[8px] font-bold">Profil</span>
              </button>
            </div>
          )}

          {/* PAYWALL OVERLAY DI DALAM HP */}
          {showPaywall && (
            <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-6 text-white select-none rounded-[38px]">
              <div className="flex justify-between items-center mt-4">
                <span className="text-[9px] bg-amber-500/20 text-amber-400 font-extrabold tracking-widest px-2.5 py-1 rounded-md uppercase">PRO FEATURE</span>
                <button 
                  onClick={() => setShowPaywall(false)}
                  className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 my-auto text-center">
                <div className="inline-flex p-4 bg-indigo-600/20 text-indigo-400 rounded-3xl animate-pulse">
                  <Sparkles className="w-9 h-9" />
                </div>
                <h3 className="text-base font-black tracking-tight font-display text-white">Upgrade ke Jago Finance Pro</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Klaim pengeluaran instan dengan <strong>Hermes AI OCR Scanner</strong>. Foto struk belanjamu, AI akan mengisi nominal, merchant, dan kategori otomatis.
                </p>

                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl space-y-2 text-left text-[10px]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>1,000 scans AI receipt per bulan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Kecepatan OCR &lt; 5 detik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Auto-kategori akuntansi pintar</span>
                  </div>
                </div>

                <div className="py-1">
                  <span className="text-xl font-black font-mono">Rp 240.000</span>
                  <span className="text-[9px] text-slate-400 font-bold"> / bulan</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <button 
                  onClick={async () => {
                    try {
                      if (isSupabaseConfigured() && currentUserProfile) {
                        const { error } = await supabase
                          .from('companies')
                          .update({ subscription_tier: 'pro' })
                          .eq('id', currentUserProfile.company_id);
                        if (error) throw error;
                      }
                      setSubTier('pro');
                      setShowPaywall(false);
                      // Trigger scanner open after successful upgrade
                      setScanImage(null);
                      setScanImageName('');
                      setScannedData(null);
                      setCurrentScreen('scanner');
                      if (onRefreshData) onRefreshData();
                    } catch (err) {
                      alert("Gagal melakukan upgrade.");
                    }
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                >
                  <span>Upgrade ke Pro (Simulasi)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[8px] text-slate-500 text-center font-medium">Batal kapan saja • Uji coba bebas risiko 7 hari</p>
              </div>
            </div>
          )}

          {/* Smartphone Bezel Bottom Handle overlay */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-[110px] h-1.5 bg-slate-900 rounded-full z-50"></div>

        </div>
      </div>

    </div>
  );
}
