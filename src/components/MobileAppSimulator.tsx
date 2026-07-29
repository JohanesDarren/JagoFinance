import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, Building, Lock, CreditCard, Camera, User, FileText, 
  Settings, LogOut, ArrowRight, ArrowLeft, Clock, Search, 
  MapPin, Check, Plus, AlertCircle, ScanLine, Wallet, Image, X,
  Trash2, ShieldAlert, Sparkles, Building2, Info, Menu
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
import PayslipHistoryScreen from './mobile-screens/PayslipHistoryScreen';
import CompaniesScreen from './mobile-screens/CompaniesScreen';
import CompanyDetailScreen from './mobile-screens/CompanyDetailScreen';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { scanReceiptAndUpload } from '../lib/hermesApi';

interface MobileAppSimulatorProps {
  transactions: Transaction[];
  cashBalance: number;
  onRefreshData: () => void;
  currentUserProfile?: any;
  onLogout?: () => void;
  notifications?: any[];
}

export default function MobileAppSimulator({ 
  transactions, 
  cashBalance, 
  onRefreshData,
  currentUserProfile,
  onLogout,
  notifications = []
}: MobileAppSimulatorProps) {
  
  // Mobile Router/State
  const [historyTab, setHistoryTab] = useState<'Semua' | 'Pending' | 'Selesai' | 'Ditolak'>('Semua');
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'forgot' | 'home' | 'scanner' | 'ai-loading' | 'form' | 'success' | 'history' | 'detail' | 'profile' | 'edit-profile' | 'avatar-camera' | 'avatar-gallery' | 'notifications' | 'payslip-history' | 'companies' | 'company-detail'>(currentUserProfile ? 'home' : 'auth');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedTxIds, setDeletedTxIds] = useState<Set<string>>(new Set());
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [formCompanyId, setFormCompanyId] = useState<string | undefined>(undefined);
  
  // Authentication credentials
  const [email, setEmail] = useState(currentUserProfile?.email || '');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(!!currentUserProfile);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [subTier, setSubTier] = useState<'free' | 'pro'>('free');

  const isProfileComplete = currentUserProfile && currentUserProfile.full_name && currentUserProfile.bank_account && currentUserProfile.phone;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => {
    if (currentUserProfile) {
      setEmail(currentUserProfile.email || '');
      setIsLogged(true);
      setSubTier('pro'); 
      if (!isProfileComplete) {
        setCurrentScreen('edit-profile');
      }
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
  const [formAmount, setFormAmount] = useState<number | string>(0);
  const [formNotes, setFormNotes] = useState('');
  const [formItems, setFormItems] = useState<any[]>([]);
  const [formType, setFormType] = useState<'reimburse' | 'cash_advance'>('reimburse');
  const [formError, setFormError] = useState('');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // History / Filter States
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [zoomReceipt, setZoomReceipt] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(notifications.length > 0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setHasNewNotifications(true);
    } else {
      setHasNewNotifications(false);
    }
  }, [notifications]);

  // Profile / Notification banner
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    fullName: [currentUserProfile?.full_name, currentUserProfile?.surname].filter(Boolean).join(' ') || '',
    phone: '',
    email: currentUserProfile?.email || '',
    bankName: '',
    bankAccount: '',
    accountHolder: '',
    bankPassbookUrl: '',
    bankValidated: false,
    bank_rejection_reason: ''
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (currentUserProfile) {
      setEditProfileData(prev => ({
        ...prev,
        fullName: [currentUserProfile.full_name, currentUserProfile.surname].filter(Boolean).join(' ') || prev.fullName,
        email: currentUserProfile.email || prev.email,
        phone: currentUserProfile.phone || prev.phone,
        bankName: currentUserProfile.bank_name || prev.bankName,
        bankAccount: currentUserProfile.bank_account || prev.bankAccount,
        accountHolder: currentUserProfile.bank_account_holder || prev.accountHolder,
        avatarImage: currentUserProfile.avatar_url || prev.avatarImage,
        bankPassbookUrl: currentUserProfile.bank_passbook_url || prev.bankPassbookUrl,
        bankValidated: currentUserProfile.bank_validated || false,
        bank_rejection_reason: currentUserProfile.bank_rejection_reason || ''
      }));
    }
  }, [currentUserProfile]);

  const handleSaveProfile = async () => {
    if (!currentUserProfile || !isSupabaseConfigured()) {
      setCurrentScreen('profile');
      return;
    }
    
    setIsSavingProfile(true);
    try {
      const names = editProfileData.fullName.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const { error } = await supabase
        .from('users')
        .update({
          full_name: firstName,
          surname: lastName,
          email: editProfileData.email,
          phone: editProfileData.phone,
          bank_name: editProfileData.bankName,
          bank_account: editProfileData.bankAccount,
          bank_account_holder: editProfileData.accountHolder,
          bank_passbook_url: editProfileData.bankPassbookUrl,
          bank_validated: false, 
          avatar_url: editProfileData.avatarImage,
        })
        .eq('id', currentUserProfile.id);

      if (error) throw error;
      
      if (onRefreshData) onRefreshData();
      
      setCurrentScreen('profile');
    } catch (err: any) {
      alert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const employeeEmail = (currentUserProfile?.email || email).trim();
  const staffName = currentUserProfile?.full_name || employeeEmail.split('@')[0]
    .split('.')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const staffTransactions = transactions
    .filter(t => t.employeeId === (currentUserProfile?.id || 'admin'))
    .filter(t => !deletedTxIds.has(t.id));
  
  const getDynamicLimit = () => {
    try {
      const companyId = currentUserProfile?.company_id || 'default';
      const stored = localStorage.getItem(`company_limit_${companyId}`);
      if (stored) return parseInt(stored, 10);
    } catch(e) {}
    return 15000000;
  };
  const limitMax = getDynamicLimit();
  
  const totalApproved = staffTransactions
    .filter(t => t.status === 'Approved' && t.type === 'reimburse')
    .reduce((sum, t) => sum + t.amount, 0);
  const sisaLimit = Math.max(0, limitMax - totalApproved);
  const limitPercentage = (sisaLimit / limitMax) * 100;

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (onRefreshData) onRefreshData();
      } else {
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

  const handleOpenScanner = (typeOption: 'reimburse' | 'cash_advance') => {
    if (subTier === 'free') {
      setShowPaywall(true);
      return;
    }
    setFormType(typeOption);
    setScanImage(null);
    setScanImageName('');
    setScannedData(null);
    setEditingTx(null);
    setFormMerchant('');
    setFormAmount(0);
    setFormCategory('Infrastruktur & Cloud');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormItems([]);
    setFormError('');
    setCurrentScreen('scanner');
  };

  const handleOpenManualForm = (typeOption: 'reimburse' | 'cash_advance') => {
    setFormType(typeOption);
    setScanImage(null);
    setScanImageName('');
    setScannedData(null);
    setEditingTx(null);
    setFormMerchant('');
    setFormAmount(0);
    setFormCategory('Infrastruktur & Cloud');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormItems([]);
    setFormError('');
    setCurrentScreen('form');
  };

  const handleOpenForm = (type: 'reimburse' | 'cash_advance' = 'reimburse', imageBase64?: string, imageName?: string, specificCompanyId?: string) => {
    if (imageBase64) {
      setFormCompanyId(specificCompanyId);
      triggerOcrScan(imageBase64, imageName || 'upload.png', 'image/png');
      return;
    }

    setFormType(type);
    setFormCompanyId(specificCompanyId);
    setScanImage(null);
    setScanImageName('');
    setScannedData(null);
    setEditingTx(null);
    setFormMerchant('');
    setFormAmount(0);
    setFormCategory('Infrastruktur & Cloud');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormItems([]);
    setCurrentScreen('form');
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
    setFormType(tx.type as 'reimburse' | 'cash_advance');
    setScanImage(tx.receiptUrl || null);
    setScanImageName(tx.receiptUrl ? 'struk_terlampir.png' : '');
    setFormMerchant(tx.merchant);
    setFormAmount(tx.amount.toString());
    setFormCategory(tx.category || 'Infrastruktur & Cloud');
    setFormDate(tx.date && tx.date.includes('-') && tx.date.split('-').length === 3 ? tx.date : new Date().toISOString().split('T')[0]);
    setFormNotes(tx.notes || '');
    setFormItems(tx.items || []);
    setCurrentScreen('form');
  };

  const handleDeleteTransaction = async (tx: Transaction) => {
    try {
      setDeletedTxIds(prev => new Set(prev).add(tx.id));
      if (isSupabaseConfigured()) {
        const res = await fetch(`/api/transactions/employee/${tx.id}`, { method: 'DELETE' });
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.error || 'Gagal menghapus pengajuan');
        }
      } else {
        await new Promise(r => setTimeout(r, 300));
      }
      
      setCurrentScreen('history');
      onRefreshData();
    } catch (err: any) {
      alert('Gagal menghapus pengajuan: ' + err.message);
    }
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
      if (resData.extracted.items) {
        setFormItems(resData.extracted.items);
      }
      
      setFormError('');
      setCurrentScreen('form');
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Gagal memproses struk.');
      setCurrentScreen('form');
    }
  };

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

      const fullNotes = `${formNotes} | DATE: ${formDate} | ITEMS: ${JSON.stringify(formItems)}`;

      if (isSupabaseConfigured() && currentUserProfile) {
        if (editingTx) {
          const res = await fetch(`/api/transactions/employee/${editingTx.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              company_id: formCompanyId || currentUserProfile.company_id,
              merchant: formMerchant,
              category: formCategory,
              amount: Number(formAmount),
              notes: fullNotes,
              receipt_url: finalReceiptUrl
            })
          });
          if (!res.ok) {
            const resData = await res.json();
            throw new Error(resData.error || 'Gagal mengupdate pengajuan');
          }
        } else {
          const res = await fetch(`/api/transactions/employee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              created_by: currentUserProfile.id,
              company_id: formCompanyId || currentUserProfile.company_id,
              merchant: formMerchant,
              category: formCategory,
              amount: Number(formAmount),
              notes: fullNotes,
              status: 'pending',
              receipt_url: finalReceiptUrl,
              type: formType === 'reimburse' ? 'reimbursement' : formType
            })
          });
          if (!res.ok) {
            const resData = await res.json();
            throw new Error(resData.error || 'Gagal menyimpan pengajuan');
          }
        }
      } else {
        const url = editingTx ? `/api/reimburse/edit` : `/api/reimburse/submit`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingTx?.id,
            merchant: formMerchant,
            date: formDate,
            category: formCategory,
            amount: Number(formAmount),
            notes: fullNotes,
            receiptUrl: finalReceiptUrl,
            staffName: currentUserProfile?.full_name || 'Admin',
            staffEmail: currentUserProfile?.email || 'admin@jagofinance.id',
            type: formType
          })
        });
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.error || 'Gagal mengirim pengajuan.');
        }
      }

      onRefreshData();
      setIsSubmitting(false);
      setEditingTx(null);
      setCurrentScreen('success');
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
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden text-blue-950 font-sans">
      {/* Desktop Sidebar (Only when logged) */}
      {isLogged && currentScreen !== 'unassigned' && currentScreen !== 'scanner' && isProfileComplete && (
        <aside className={`hidden md:flex ${isSidebarCollapsed ? 'w-[5.5rem]' : 'w-72'} m-4 h-[calc(100vh-2rem)] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex-col z-20 shrink-0 transition-all duration-300 relative overflow-hidden border border-slate-100/50`}>
          <div className={`p-6 pb-6 flex items-center ${isSidebarCollapsed ? 'flex-col gap-4 justify-center px-0' : 'justify-between'} transition-all`}>
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="p-2.5 bg-blue-950 text-white rounded-2xl flex items-center justify-center shadow-lg w-12 h-12 shadow-blue-950/20 shrink-0 relative overflow-hidden group">
                <Sparkles className="w-6 h-6 shrink-0 relative z-10" />
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden transition-all duration-300 whitespace-nowrap">
                  <span className="font-black font-display text-blue-950 text-xl tracking-tight block leading-none mt-1">JagoFinance</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 shadow-sm transition-all shrink-0 z-50"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => { if(isProfileComplete) { setCurrentScreen('home'); setSelectedTx(null); } }}
              className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${currentScreen === 'home' ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'} ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {currentScreen === 'home' && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
              <CreditCard className={`w-5 h-5 shrink-0 relative z-10 ${currentScreen === 'home' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {!isSidebarCollapsed && <span className="whitespace-nowrap relative z-10">Home</span>}
            </button>
            <button 
              onClick={() => { if(isProfileComplete) { setCurrentScreen('companies'); setSelectedTx(null); } }}
              className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${currentScreen === 'companies' || currentScreen === 'company-detail' ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'} ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {(currentScreen === 'companies' || currentScreen === 'company-detail') && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
              <Building className={`w-5 h-5 shrink-0 relative z-10 ${currentScreen === 'companies' || currentScreen === 'company-detail' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {!isSidebarCollapsed && <span className="whitespace-nowrap relative z-10">Perusahaan</span>}
            </button>
            <button 
              onClick={() => { if(isProfileComplete) { setCurrentScreen('history'); setSelectedTx(null); } }}
              className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${currentScreen === 'history' || currentScreen === 'detail' ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'} ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {(currentScreen === 'history' || currentScreen === 'detail') && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
              <FileText className={`w-5 h-5 shrink-0 relative z-10 ${currentScreen === 'history' || currentScreen === 'detail' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {!isSidebarCollapsed && <span className="whitespace-nowrap relative z-10">Riwayat Pengajuan</span>}
            </button>

          </nav>
          
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0 overflow-y-auto">
        
        {/* Global Header */}
        {isLogged && !['auth', 'scanner', 'unassigned', 'forgot', 'success', 'ai-loading', 'avatar-camera'].includes(currentScreen) && (
          <div className="px-5 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-xl border-b border-slate-200/50">
            <div className="flex-1">
              {currentScreen === 'home' ? (
                <div className="flex flex-col gap-1">
                  <h2 className="text-[17px] font-black text-blue-950 tracking-tight leading-none">
                    Halo, {staffName.split(' ')[0]}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '')}
                  </p>
                </div>
              ) : (
                <div className="h-8"></div>
              )}
            </div>
            
            <div className="flex gap-3">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentScreen('notifications');
                  setHasNewNotifications(false);
                }}
                className="relative w-11 h-11 flex items-center justify-center text-blue-950 border border-slate-200 bg-white rounded-full transition-all shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {hasNewNotifications && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"
                  />
                )}
              </motion.button>

              <div className="relative hidden md:block">
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                    <img 
                      src={currentUserProfile?.avatar_url || editProfileData.avatarImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={() => setShowProfileMenu(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-14 w-48 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 py-2 z-[70] overflow-hidden"
                      >
                        <button 
                          onClick={() => { setShowProfileMenu(false); setCurrentScreen('profile'); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-blue-950">Profil Saya</span>
                        </button>
                        <div className="h-px bg-slate-100 my-1 mx-2"></div>
                        <button 
                          onClick={() => { 
                            setShowProfileMenu(false); 
                            setIsLogged(false);
                            setCurrentScreen('auth');
                            if (onLogout) onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 transition-colors text-left group"
                        >
                          <LogOut className="w-4 h-4 text-rose-500 group-hover:text-rose-600" />
                          <span className="text-sm font-bold text-rose-600 group-hover:text-rose-700">Keluar</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
            
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
              staffTransactions={staffTransactions}
              setCurrentScreen={setCurrentScreen}
              handleOpenScanner={handleOpenScanner}
              handleOpenForm={handleOpenForm}
              handleOpenDetail={handleOpenDetail}
              avatarUrl={currentUserProfile?.avatar_url}
              hasNewNotifications={hasNewNotifications}
              setHasNewNotifications={setHasNewNotifications}
              handleLogout={() => {
                 setIsLogged(false);
                 setCurrentScreen('auth');
                 if (onLogout) onLogout();
              }}
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
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteTransaction}
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
                avatarUrl={currentUserProfile?.avatar_url}
                bankName={currentUserProfile?.bank_name || editProfileData.bankName}
                bankAccount={currentUserProfile?.bank_account || editProfileData.bankAccount}
                companyName={currentUserProfile?.companies?.name || 'Jago Finance'}
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
                handleSaveProfile={handleSaveProfile}
                isSaving={isSavingProfile}
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
                notifications={notifications}
              />
            )}
            
            {/* SCREEN 15: PAYSLIP HISTORY */}
            {currentScreen === 'payslip-history' && (
              <PayslipHistoryScreen
                setCurrentScreen={setCurrentScreen}
                staffName={staffName}
                bankName={currentUserProfile?.bank_name || editProfileData.bankName || 'Mandiri'}
                bankAccount={currentUserProfile?.bank_account || editProfileData.bankAccount || '000000'}
              />
            )}

            {/* SCREEN 15: COMPANIES */}
            {currentScreen === 'companies' && (
              <CompaniesScreen
                companies={currentUserProfile?.companies || []}
                setCurrentScreen={setCurrentScreen}
                setSelectedCompany={setSelectedCompany}
              />
            )}

            {/* SCREEN 16: COMPANY DETAIL */}
            {currentScreen === 'company-detail' && selectedCompany && (
              <CompanyDetailScreen
                company={selectedCompany}
                setCurrentScreen={setCurrentScreen}
                staffTransactions={staffTransactions}
                handleOpenScanner={handleOpenScanner}
                handleOpenForm={handleOpenForm}
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
                <div className="w-full bg-blue-50 border border-blue-100 p-4 rounded-2xl text-left flex items-start gap-3 shadow-sm">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
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

          {/* BOTTOM NAVIGATION FOR MOBILE */}
          {isLogged && currentScreen !== 'unassigned' && currentScreen !== 'scanner' && isProfileComplete && (
            <div className="md:hidden absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-xl border border-white rounded-[2rem] pt-2 pb-2 z-40 px-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
              <div className="flex justify-between items-center max-w-sm mx-auto h-14 relative px-1">
                
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 transition-colors z-10 ${currentScreen === 'home' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'} ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CreditCard className={`w-5 h-5 mb-0.5 ${currentScreen === 'home' ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className={`text-[9px] ${currentScreen === 'home' ? 'font-black' : 'font-bold'}`}>Home</span>
                  {currentScreen === 'home' && <motion.div layoutId="bottomnav-active" className="absolute -bottom-1 w-1 h-1 bg-blue-700 rounded-full" />}
                </button>

                <button 
                  onClick={() => { if(isProfileComplete) setCurrentScreen('companies'); }}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 transition-colors z-10 ${currentScreen === 'companies' || currentScreen === 'company-detail' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'} ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Building className={`w-5 h-5 mb-0.5 ${currentScreen === 'companies' || currentScreen === 'company-detail' ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className={`text-[9px] ${currentScreen === 'companies' || currentScreen === 'company-detail' ? 'font-black' : 'font-bold'}`}>Afiliasi</span>
                  {(currentScreen === 'companies' || currentScreen === 'company-detail') && <motion.div layoutId="bottomnav-active" className="absolute -bottom-1 w-1 h-1 bg-blue-700 rounded-full" />}
                </button>

                {/* Empty Space for Center Button */}
                <div className="w-14 h-12 opacity-0 pointer-events-none"></div>

                <button 
                  onClick={() => { if(isProfileComplete) setCurrentScreen('history'); }}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 transition-colors z-10 ${currentScreen === 'history' || currentScreen === 'detail' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'} ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FileText className={`w-5 h-5 mb-0.5 ${currentScreen === 'history' || currentScreen === 'detail' ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className={`text-[9px] ${currentScreen === 'history' || currentScreen === 'detail' ? 'font-black' : 'font-bold'}`}>Riwayat</span>
                  {(currentScreen === 'history' || currentScreen === 'detail') && <motion.div layoutId="bottomnav-active" className="absolute -bottom-1 w-1 h-1 bg-blue-700 rounded-full" />}
                </button>

                <button 
                  onClick={() => { if(isProfileComplete) setCurrentScreen('profile'); }}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 transition-colors z-10 ${currentScreen === 'profile' || currentScreen === 'edit-profile' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'} ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <User className={`w-5 h-5 mb-0.5 ${currentScreen === 'profile' || currentScreen === 'edit-profile' ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className={`text-[9px] ${currentScreen === 'profile' || currentScreen === 'edit-profile' ? 'font-black' : 'font-bold'}`}>Profil</span>
                  {(currentScreen === 'profile' || currentScreen === 'edit-profile') && <motion.div layoutId="bottomnav-active" className="absolute -bottom-1 w-1 h-1 bg-blue-700 rounded-full" />}
                </button>

                {/* Floating Center Button (Absolute) */}
                <button 
                  onClick={() => { if(isProfileComplete) setShowActionSheet(true); }}
                  className={`w-14 h-14 bg-blue-950 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-950/30 border-4 border-white absolute left-1/2 -translate-x-1/2 -top-6 hover:bg-blue-900 hover:scale-105 active:scale-95 transition-all ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* FAB Action Sheet */}
          <AnimatePresence>
            {showActionSheet && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/60 z-[100] backdrop-blur-sm"
                  onClick={() => setShowActionSheet(false)}
                />
                <motion.div 
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 pb-12 z-[101] shadow-2xl"
                >
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                  <h3 className="font-black text-blue-950 text-lg mb-4">Buat Pengajuan Baru</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => { setShowActionSheet(false); handleOpenScanner('reimburse'); }}
                      className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all font-bold text-left"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <ScanLine className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-[15px]">Scan Reimburse (AI)</span>
                        <span className="text-[11px] font-medium text-blue-500">Otomatis baca struk belanja</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => { setShowActionSheet(false); handleOpenManualForm('reimburse'); }}
                      className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all font-bold text-left"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                        <Receipt className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-[15px]">Reimburse Manual</span>
                        <span className="text-[11px] font-medium text-slate-500">Isi form tanpa scan nota</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setShowActionSheet(false); handleOpenManualForm('cash_advance'); }}
                      className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all font-bold text-left"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                        <Wallet className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-[15px]">Pengajuan Kasbon</span>
                        <span className="text-[11px] font-medium text-slate-500">Minta dana di awal / DP</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {showPaywall && (
            <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-6 text-white select-none">
              <div className="flex justify-between items-center mt-4">
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-extrabold tracking-widest px-2.5 py-1 rounded-md uppercase">PRO FEATURE</span>
                <button 
                  onClick={() => setShowPaywall(false)}
                  className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 my-auto text-center">
                <div className="inline-flex p-4 bg-blue-700/20 text-blue-500 rounded-3xl animate-pulse">
                  <Sparkles className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-black tracking-tight font-display text-white">Upgrade ke Jago Finance Pro</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Klaim pengeluaran instan dengan <strong>Hermes AI OCR Scanner</strong>. Foto struk belanjamu, AI akan mengisi nominal, merchant, dan kategori otomatis.
                </p>

                <div className="bg-blue-950/60 border border-slate-800 p-4 rounded-2xl space-y-3 text-left text-sm max-w-sm mx-auto">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1,000 scans AI receipt per bulan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kecepatan OCR &lt; 5 detik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Auto-kategori akuntansi pintar</span>
                  </div>
                </div>

                <div className="py-2">
                  <span className="text-2xl font-black font-mono">Rp 240.000</span>
                  <span className="text-xs text-slate-400 font-bold"> / bulan</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 max-w-sm mx-auto w-full">
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
                  className="w-full py-4 bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-700/30 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                >
                  <span>Upgrade ke Pro (Simulasi)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-slate-500 text-center font-medium">Batal kapan saja • Uji coba bebas risiko 7 hari</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

