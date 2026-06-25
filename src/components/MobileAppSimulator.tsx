/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Bell, User, CreditCard, ArrowLeft, Camera, CheckCircle, 
  AlertCircle, Loader2, Calendar, DollarSign, X, FileText, 
  ChevronRight, Image, Search, Lock, Mail, ArrowUpRight, 
  Check, Download, Maximize2, Sparkles, LogOut, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';

interface MobileAppSimulatorProps {
  transactions: Transaction[];
  cashBalance: number;
  onRefreshData: () => void;
  staffEmail: string;
}

export default function MobileAppSimulator({ 
  transactions, 
  cashBalance, 
  onRefreshData,
  staffEmail
}: MobileAppSimulatorProps) {
  
  // Mobile Router/State
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'forgot' | 'home' | 'scanner' | 'ai-loading' | 'form' | 'success' | 'history' | 'detail' | 'profile'>('auth');
  
  // Authentication credentials
  const [email, setEmail] = useState(staffEmail || 'afrisyadwiky@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLogged, setIsLogged] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

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
  const [formType, setFormType] = useState<'reimburse' | 'cash_advance'>('reimburse');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History / Filter States
  const [historyTab, setHistoryTab] = useState<'Semua' | 'Pending' | 'Selesai'>('Semua');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [zoomReceipt, setZoomReceipt] = useState(false);

  // Profile / Notification banner
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Remaining list calculations for specific employee
  const employeeEmail = email.trim();
  const staffName = employeeEmail.split('@')[0]
    .split('.')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const staffTransactions = transactions.filter(t => t.staffEmail === employeeEmail);
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
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLogged(true);
      setCurrentScreen('home');
      onRefreshData();
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
    setFormType(typeOption);
    setScanImage(null);
    setScanImageName('');
    setScannedData(null);
    setCurrentScreen('scanner');
  };

  // 4. Load Predefined Sample Receipts for OCR scanner
  const handleSelectSample = async (sampleName: string, sampleUrl: string) => {
    setScanImage(sampleUrl);
    setScanImageName(sampleName);
    
    // Convert sample to base64 if possible or just trigger process
    setCurrentScreen('ai-loading');
    
    try {
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: "SIMULATED_MOCK_IMAGE_BASE64", 
          mimeType: "image/jpeg",
          fileName: sampleName
        }),
      });
      const data = await response.json();
      if (data.success) {
        setScannedData(data.extracted);
        setFormMerchant(data.extracted.merchant);
        setFormDate(data.extracted.date);
        setFormCategory(data.extracted.category);
        setFormAmount(data.extracted.amount);
        setFormNotes(data.extracted.notes || '');
        setCurrentScreen('form');
      } else {
        throw new Error(data.error || 'Ekstraksi gagal');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback
      setFormMerchant(sampleName.split('.')[0].toUpperCase());
      setFormDate(new Date().toISOString().split('T')[0]);
      setFormCategory('Operasional');
      setFormAmount(120000);
      setFormNotes('Ekstraksi struk cadangan lokal.');
      setCurrentScreen('form');
    }
  };

  // 5. Handle File Upload from Gallery (Convert to Base64 & Send to Server)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setScanImage(reader.result as string);
      setCurrentScreen('ai-loading');

      try {
        const response = await fetch('/api/scan-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: base64String, 
            mimeType: file.type,
            fileName: file.name
          }),
        });
        const data = await response.json();
        if (data.success) {
          setScannedData(data.extracted);
          setFormMerchant(data.extracted.merchant);
          setFormDate(data.extracted.date);
          setFormCategory(data.extracted.category);
          setFormAmount(data.extracted.amount);
          setFormNotes(data.extracted.notes || '');
          setCurrentScreen('form');
        } else {
          throw new Error('OCR API Error');
        }
      } catch (err) {
        // Fallback offline scan
        setFormMerchant(file.name.split('.')[0].toUpperCase().replace(/[-_]/g, ' '));
        setFormDate(new Date().toISOString().split('T')[0]);
        setFormCategory('Operasional');
        setFormAmount(85000);
        setFormNotes('Ekstraksi lokal aman (Offline Fallback)');
        setCurrentScreen('form');
      }
    };
    reader.readAsDataURL(file);
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
      const response = await fetch('/api/reimburse/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: formMerchant,
          date: formDate,
          category: formCategory,
          amount: Number(formAmount),
          notes: formNotes,
          receiptUrl: scanImage,
          staffName,
          staffEmail: employeeEmail,
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
    } catch (err) {
      setFormError('Hubungan ke server terputus. Coba lagi.');
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
              <div className="p-4 space-y-4">
                
                {/* Header (Sapaan, notification bell, profile photo) */}
                <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                        alt="Profile avatar" 
                        className="w-9 h-9 rounded-full border-2 border-brand object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Selamat datang,</p>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">{staffName}</h4>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5">
                    {/* Ring alarm notification click */}
                    <button 
                      onClick={() => setNotificationOpen(!notificationOpen)}
                      className="relative p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <Bell className="w-4 h-4" />
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-600 rounded-full"></div>
                    </button>
                    
                    <button 
                      onClick={() => setIsLogged(false)}
                      className="p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                    </button>
                  </div>
                </div>

                {/* Simulated notification dropdown banner */}
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-brand text-white p-2.5 rounded-xl text-[10px] space-y-1 relative"
                    >
                      <div className="flex justify-between items-center font-semibold">
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Notifikasi Sistem</span>
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setNotificationOpen(false)} />
                      </div>
                      <p className="text-white/80 text-[9px]">Sistem AI JagoKeuangan mendeteksi struk Anda yang tertunda sudah berhasil masuk antrian audit admin.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reimburse Limit Card */}
                <div className="bg-brand text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
                  {/* Absolute subtle background sphere decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6"></div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">SISA LIMIT REIMBURSE</span>
                      <h3 className="text-lg font-bold font-mono tracking-tight mt-0.5">Rp {sisaLimit.toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full font-medium">Bulan Ini</div>
                  </div>

                  {/* Limit Progression bar */}
                  <div className="mt-4">
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-white h-full rounded-full transition-all duration-500" 
                        style={{ width: `${limitPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-white/80 mt-1.5">
                      <span>Terpakai: Rp {totalApproved.toLocaleString('id-ID')}</span>
                      <span>Kuota: Rp {limitMax.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons (Reimburse & Cash Advance) */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleOpenScanner('reimburse')}
                    className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-all text-left flex flex-col justify-between h-20 relative overflow-hidden"
                    id="mobile_action_reimburse"
                  >
                    <div className="p-1.5 bg-indigo-50 text-brand rounded-lg w-max mb-1">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[11px] block leading-snug">Ajukan Reimburse</span>
                      <span className="text-[8px] text-indigo-500">Scan struk instan AI</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleOpenScanner('cash_advance')}
                    className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-all text-left flex flex-col justify-between h-20 relative overflow-hidden"
                    id="mobile_action_cashadvance"
                  >
                    <div className="p-1.5 bg-violet-50 text-violet-700 rounded-lg w-max mb-1">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[11px] block leading-snug">Request Advance</span>
                      <span className="text-[8px] text-purple-500">Injeksi modal kas di muka</span>
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
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center space-y-1 text-slate-500">
                      <AlertCircle className="w-7 h-7 mx-auto text-slate-300" />
                      <p className="text-[10px] font-medium text-slate-400">Belum ada pengajuan reimburse bulan ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {staffTransactions.slice(0, 3).map((tx) => (
                        <div 
                          key={tx.id}
                          onClick={() => handleOpenDetail(tx)}
                          className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold w-7 h-7 flex items-center justify-center">
                              {tx.merchant.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-bold text-[10px] text-slate-800 tracking-tight leading-3 truncate w-[140px]">{tx.merchant}</h5>
                              <p className="text-[8px] text-slate-400 mt-0.5">{tx.date} • {tx.category}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-mono text-[10px] font-bold text-slate-700 block">Rp {tx.amount.toLocaleString('id-ID')}</span>
                            <span className={`inline-block text-[7px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                              tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              tx.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
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
                    <div className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_12px_#503eff] animate-bounce w-full" style={{ animationDuration: '3s' }}></div>
                    
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

                {/* Camera Controller buttons / Sample selection */}
                <div className="p-4 bg-slate-950 space-y-3 z-20 text-white border-t border-slate-900">
                  <div className="space-y-1.5 text-center">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Atau Pilih Sampel Struk Cepat</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleSelectSample('starbucks_coffee.jpg', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60')}
                        className="bg-slate-900 hover:bg-slate-800 p-1 rounded-lg text-[9px] flex flex-col items-center border border-slate-800"
                      >
                        <span className="font-semibold block truncate w-full">Starbucks</span>
                        <span className="text-[7px] text-indigo-400">Rp 142k</span>
                      </button>

                      <button 
                        onClick={() => handleSelectSample('soto_kudus_menara.jpg', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60')}
                        className="bg-slate-900 hover:bg-slate-800 p-1 rounded-lg text-[9px] flex flex-col items-center border border-slate-800"
                      >
                        <span className="font-semibold block truncate w-full">Soto Kudus</span>
                        <span className="text-[7px] text-indigo-400">Rp 95k</span>
                      </button>

                      <button 
                        onClick={() => handleSelectSample('taxi_operational.jpg', 'https://images.unsplash.com/photo-1518112166137-839070a7df84?w=500&auto=format&fit=crop&q=60')}
                        className="bg-slate-900 hover:bg-slate-800 p-1 rounded-lg text-[9px] flex flex-col items-center border border-slate-800"
                      >
                        <span className="font-semibold block truncate w-full">Grab Taxi</span>
                        <span className="text-[7px] text-indigo-400">Rp 68k</span>
                      </button>
                    </div>
                  </div>

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

                {/* TIMELINE TRACKER VERTICAL */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-4xs space-y-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Progres Pelacakan Dana</span>
                  
                  <div className="space-y-4 relative pl-5 border-l border-indigo-100 ml-1.5 py-1">
                    
                    {selectedTx.timeline.map((step, idx) => {
                      // Adjust status rejection rendering dynamically
                      let stepName = step.label;
                      if (step.label === 'Disetujui/Ditolak') {
                        stepName = selectedTx.status === 'Rejected' ? 'Ditolak' : 'Disetujui';
                      }

                      const valActive = step.done || step.active;

                      return (
                        <div key={idx} className="relative text-[10px]">
                          
                          {/* Inner timeline point circle */}
                          <div className={`absolute -left-[25px] top-0.5 w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                            step.done 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : selectedTx.status === 'Rejected' && step.label.includes('Disetujui/Ditolak')
                                ? 'bg-rose-500 border-rose-500'
                                : 'bg-white border-indigo-200'
                          }`}>
                            {step.done && <Check className="w-2 h-2 text-white stroke-[3]" />}
                            {selectedTx.status === 'Rejected' && step.label.includes('Disetujui/Ditolak') && <X className="w-2 h-2 text-white stroke-[3]" />}
                          </div>

                          <div className="leading-snug">
                            <span className={`font-bold block ${
                              step.done 
                                ? 'text-slate-800' 
                                : selectedTx.status === 'Rejected' && step.label.includes('Disetujui/Ditolak')
                                  ? 'text-rose-600'
                                  : 'text-slate-400'
                            }`}>{stepName}</span>
                            <span className="text-[8px] text-slate-400">{step.date || 'Menunggu verifikasi'}</span>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 10: PORTFOLIO & PAYROLL DETAIL */}
            {currentScreen === 'profile' && (
              <div className="p-4 space-y-4">
                
                {/* Header mock */}
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentScreen('home')}
                    className="p-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold font-display text-slate-800">Profil & Payroll Gaji</span>
                  <div className="w-8"></div>
                </div>

                {/* Profile section block card */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col justify-center items-center text-center space-y-2">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                      alt="Avatar profile large" 
                      className="w-16 h-16 rounded-full border-4 border-indigo-50 object-cover"
                    />
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">✓</div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-slate-800 leading-tight">{staffName}</h5>
                    <p className="text-[9px] text-indigo-600 font-semibold mt-0.5">Project Manager • Operations</p>
                    <p className="text-[8px] text-slate-400">ID Karyawan: EMP-003</p>
                  </div>

                  <div className="w-full border-t border-slate-100 pt-3 text-left space-y-1.5 pt-2">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-slate-450 font-medium">Email Kantor</span>
                      <span className="font-mono text-slate-705 text-right">{employeeEmail}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-slate-450 font-medium">Bank Rekening</span>
                      <span className="font-semibold text-slate-705 text-right text-brand">Mandiri (5540982738)</span>
                    </div>
                  </div>
                </div>

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

              </div>
            )}

          </div>

          {/* Bottom Native Smartphone App Bar Navigation (Only when logged) */}
          {isLogged && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-150 rounded-b-[38px] px-6 flex justify-between items-center z-40">
              <button 
                onClick={() => {
                  setCurrentScreen('home');
                  setSelectedTx(null);
                }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'home' ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[8px] font-bold">Klaim</span>
              </button>

              <button 
                onClick={() => {
                  setCurrentScreen('history');
                  setSelectedTx(null);
                }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'history' || currentScreen === 'detail' ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[8px] font-bold">History</span>
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

          {/* Smartphone Bezel Bottom Handle overlay */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-[110px] h-1.5 bg-slate-900 rounded-full z-50"></div>

        </div>
      </div>

    </div>
  );
}
