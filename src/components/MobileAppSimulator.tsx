import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, User, CreditCard, ArrowLeft, Camera, CheckCircle, 
  AlertCircle, Loader2, Calendar, DollarSign, X, FileText, 
  ChevronRight, Image, Search, Lock, Mail, ArrowUpRight, ArrowRight,
  Check, Download, Maximize2, Sparkles, LogOut, Settings, Info, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';
import AuthScreen from './mobile-screens/AuthScreen';
import ForgotScreen from './mobile-screens/ForgotScreen';
import HomeScreen from './mobile-screens/HomeScreen';
import ScannerScreen from './mobile-screens/ScannerScreen';
import AILoadingScreen from './mobile-screens/AILoadingScreen';
import FormScreen from './mobile-screens/FormScreen';
import SuccessScreen from './mobile-screens/SuccessScreen';
import HistoryScreen from './mobile-screens/HistoryScreen';
import DetailScreen from './mobile-screens/DetailScreen';
import ProfileScreen from './mobile-screens/ProfileScreen';
import EditProfileScreen from './mobile-screens/EditProfileScreen';
import AvatarCameraScreen from './mobile-screens/AvatarCameraScreen';
import AvatarGalleryScreen from './mobile-screens/AvatarGalleryScreen';
import NotificationsScreen from './mobile-screens/NotificationsScreen';
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
          .from('users')
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
              <AuthScreen
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loginError={loginError}
                handleLogin={handleLogin}
                setCurrentScreen={setCurrentScreen}
                isSubmitting={isSubmitting}
              />
            )}

            {/* SCREEN 2: FORGOT PASSWORD */}
            {currentScreen === 'forgot' && (
              <ForgotScreen
                setCurrentScreen={setCurrentScreen}
                forgotEmail={forgotEmail}
                setForgotEmail={setForgotEmail}
                forgotSuccess={forgotSuccess}
                handleForgotSubmit={handleForgotSubmit}
              />
            )}

            {/* SCREEN 3: HOME DASHBOARD */}
            {currentScreen === 'home' && (
              <HomeScreen
                staffName={staffName}
                sisaLimit={sisaLimit}
                limitPercentage={limitPercentage}
                totalApproved={totalApproved}
                limitMax={limitMax}
                handleOpenScanner={handleOpenScanner}
                setCurrentScreen={setCurrentScreen}
                staffTransactions={staffTransactions}
                handleOpenDetail={handleOpenDetail}
              />
            )}

            {/* SCREEN 4: CAPTURE RECEIPT */}
            {currentScreen === 'scanner' && (
              <ScannerScreen
                setCurrentScreen={setCurrentScreen}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
              />
            )}

            {/* SCREEN 5: AI PROCESSING STATE */}
            {currentScreen === 'ai-loading' && (
              <AILoadingScreen />
            )}

            {/* SCREEN 6: REVIEW & EDIT FORM */}
            {currentScreen === 'form' && (
              <FormScreen
                setCurrentScreen={setCurrentScreen}
                scanImage={scanImage}
                scanImageName={scanImageName}
                formType={formType}
                formError={formError}
                formMerchant={formMerchant}
                setFormMerchant={setFormMerchant}
                formDate={formDate}
                setFormDate={setFormDate}
                formCategory={formCategory}
                setFormCategory={setFormCategory}
                formAmount={formAmount}
                setFormAmount={setFormAmount}
                formItems={formItems}
                handleItemChange={handleItemChange}
                addManualItem={addManualItem}
                removeItem={removeItem}
                formNotes={formNotes}
                setFormNotes={setFormNotes}
                isSubmitting={isSubmitting}
                handleFormSubmit={handleFormSubmit}
              />
            )}

            {/* SCREEN 7: SUCCESS STATE SCREEN */}
            {currentScreen === 'success' && (
              <SuccessScreen
                setCurrentScreen={setCurrentScreen}
                onRefreshData={onRefreshData}
              />
            )}

            {/* SCREEN 8: RIWAYAT / TRANSACTION HISTORY */}
            {currentScreen === 'history' && (
              <HistoryScreen
                setCurrentScreen={setCurrentScreen}
                historyTab={historyTab}
                setHistoryTab={setHistoryTab}
                staffTransactions={staffTransactions}
                handleOpenDetail={handleOpenDetail}
              />
            )}

            {/* SCREEN 9: DETAIL VIEW */}
            {currentScreen === 'detail' && selectedTx && (
              <DetailScreen
                selectedTx={selectedTx}
                setSelectedTx={setSelectedTx}
                setCurrentScreen={setCurrentScreen}
                zoomReceipt={zoomReceipt}
                setZoomReceipt={setZoomReceipt}
              />
            )}

            {/* SCREEN 10: PORTFOLIO & PAYROLL DETAIL */}
            {currentScreen === 'profile' && (
              <ProfileScreen
                staffName={staffName}
                employeeEmail={employeeEmail}
                setCurrentScreen={setCurrentScreen}
                setSelectedTx={setSelectedTx}
                onLogout={onLogout}
                setIsLogged={setIsLogged}
              />
            )}

            {/* SCREEN 11: EDIT PROFILE */}
            {currentScreen === 'edit-profile' && (
              <EditProfileScreen
                editProfileData={editProfileData}
                setEditProfileData={setEditProfileData}
                showAvatarPicker={showAvatarPicker}
                setShowAvatarPicker={setShowAvatarPicker}
                setCurrentScreen={setCurrentScreen}
              />
            )}

            {/* SCREEN 12: AVATAR CAMERA */}
            {currentScreen === 'avatar-camera' && (
              <AvatarCameraScreen
                setCurrentScreen={setCurrentScreen}
                editProfileData={editProfileData}
                setEditProfileData={setEditProfileData}
              />
            )}

            {/* SCREEN 13: AVATAR GALLERY */}
            {currentScreen === 'avatar-gallery' && (
              <AvatarGalleryScreen
                setCurrentScreen={setCurrentScreen}
                editProfileData={editProfileData}
                setEditProfileData={setEditProfileData}
              />
            )}

            {/* SCREEN 14: NOTIFICATIONS */}
            {currentScreen === 'notifications' && (
              <NotificationsScreen
                setCurrentScreen={setCurrentScreen}
              />
            )}
            {/* SCREEN 15: UNASSIGNED COMPANY LOCK */}
            {currentScreen === 'unassigned' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 mt-16">
                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center shadow-inner relative border border-rose-100">
                  <Lock className="w-10 h-10" />
                  <div className="absolute top-0 right-0 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm -mr-2 -mt-2">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 mb-2 font-display tracking-tight">Portal Terkunci</h2>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Akun <strong>{employeeEmail}</strong> belum dihubungkan dengan profil perusahaan mana pun.
                  </p>
                </div>
                <div className="w-full bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-left flex items-start gap-3 shadow-sm">
                  <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-indigo-800 leading-relaxed">
                    Silakan hubungi HRD atau Admin Cabang perusahaan Anda untuk mengundang email ini melalui Dashboard Utama.
                  </p>
                </div>
                <button 
                  onClick={() => {
                     setIsLogged(false);
                     setCurrentScreen('auth');
                     if (onLogout) onLogout();
                  }}
                  className="w-full py-4 mt-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari Akun
                </button>
              </div>
            )}
          </div>

          {/* Bottom Native Smartphone App Bar Navigation (Only when logged) */}
          {isLogged && currentScreen !== 'unassigned' && (
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

