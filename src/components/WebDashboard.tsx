/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Sparkles, 
  Search, ShieldAlert, CheckCircle, XCircle, FileSpreadsheet, 
  Link, ArrowRightLeft, CreditCard, Users, Plus, SlidersHorizontal, 
  Trash2, Play, AlertTriangle, Eye, ArrowUpRight, Check, X, Info,
  LayoutGrid, BookOpen, FileText, MessageSquare, Wallet, Cpu, Settings, GraduationCap, LogOut
} from 'lucide-react';
import { Transaction, ConnectedApp, Subscription, Employee } from '../types';

interface WebDashboardProps {
  transactions: Transaction[];
  cashBalance: number;
  employees: Employee[];
  connectedApps: ConnectedApp[];
  subscriptions: Subscription[];
  onRefreshData: () => void;
  onApprove: (
    id: string,
    recipientName?: string,
    bankName?: string,
    bankAccount?: string,
    transferReceiptUrl?: string
  ) => Promise<boolean>;
  onReject: (id: string, reason: string) => Promise<boolean>;
  onManualLedger: (formData: any) => Promise<any>;
  onToggleApp: (id: string) => Promise<void>;
  onWebhookSave: (id: string, data: any) => Promise<void>;
  onPayrollGenerate: (division: string) => Promise<any>;
  isLoading: boolean;
  onLogout?: () => void;
  companyName?: string;
  subscriptionTier?: string;
}

export default function WebDashboard({
  transactions,
  cashBalance,
  employees,
  connectedApps,
  subscriptions,
  onRefreshData,
  onApprove,
  onReject,
  onManualLedger,
  onToggleApp,
  onWebhookSave,
  onPayrollGenerate,
  isLoading,
  onLogout,
  companyName = 'PT JagoAI School',
  subscriptionTier = 'free'
}: WebDashboardProps) {

  // Active Sub-Menu Route within web dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'inbound' | 'integrations' | 'ledger' | 'subscriptions' | 'payroll'>('overview');

  // Search & Filter state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Modal active states
  const [splitViewTx, setSplitViewTx] = useState<Transaction | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState<ConnectedApp | null>(null);
  const [selectedLedgerReceipt, setSelectedLedgerReceipt] = useState<string | null>(null);

  // Bank Account & Receipt states for approval
  const [approveRecipientName, setApproveRecipientName] = useState('');
  const [approveBankName, setApproveBankName] = useState('');
  const [approveBankAccount, setApproveBankAccount] = useState('');
  const [approveReceiptBase64, setApproveReceiptBase64] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    if (splitViewTx) {
      // Find matching employee by email or name
      const matchedEmp = employees.find(
        emp => emp.email.toLowerCase() === splitViewTx.staffEmail.toLowerCase() ||
               emp.name.toLowerCase() === splitViewTx.staffName.toLowerCase()
      );

      if (splitViewTx.status === 'Approved') {
        // If already approved, show approved details
        setApproveRecipientName(splitViewTx.recipientName || splitViewTx.staffName);
        setApproveBankName(splitViewTx.bankName || (matchedEmp ? matchedEmp.bankName : ''));
        setApproveBankAccount(splitViewTx.bankAccount || (matchedEmp ? matchedEmp.bankAccount : ''));
        setApproveReceiptBase64(splitViewTx.transferReceiptUrl || '');
      } else {
        // If pending, load matched employee bank credentials as default, or pre-fill with staffName
        setApproveRecipientName(matchedEmp ? matchedEmp.name : splitViewTx.staffName);
        setApproveBankName(matchedEmp ? matchedEmp.bankName : '');
        setApproveBankAccount(matchedEmp ? matchedEmp.bankAccount : '');
        setApproveReceiptBase64('');
      }
    } else {
      setApproveRecipientName('');
      setApproveBankName('');
      setApproveBankAccount('');
      setApproveReceiptBase64('');
    }
  }, [splitViewTx, employees]);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Check file size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran berkas terlalu besar. Maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setApproveReceiptBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleManualFileUpload = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran berkas terlalu besar. Maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setManualReceiptBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Webhook form states
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookGateway, setWebhookGateway] = useState('Xendit');

  // Manual Transaction entry states
  const [manualMerchant, setManualMerchant] = useState('');
  const [manualCategory, setManualCategory] = useState('Operasional');
  const [manualType, setManualType] = useState<'income' | 'expense_manual'>('expense_manual');
  const [manualAmount, setManualAmount] = useState(0);
  const [manualNotes, setManualNotes] = useState('');
  const [manualReceiptBase64, setManualReceiptBase64] = useState('');
  const [isDraggingManual, setIsDraggingManual] = useState(false);
  
  // Payroll form states
  const [payrollDivision, setPayrollDivision] = useState('Semua');
  const [payrollMessage, setPayrollMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Global custom error and alert state
  const [errorMessage, setErrorMessage] = useState<{ name: string; text: string } | null>(null);

  // Math Metrics Aggregates
  const totalInflowThisMonth = transactions
    .filter(t => t.type === 'income' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflowThisMonth = transactions
    .filter(t => (t.type === 'reimburse' || t.type === 'expense_manual') && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  // Net burn estimation and Runway computation (Safe Division)
  const averageMonthlyBurn = totalOutflowThisMonth || 95000000;
  const runwayMonths = Math.min(99, Math.max(1, Math.round(cashBalance / averageMonthlyBurn)));

  // Calculated categories breakdown for Pie Chart representation
  const categorySummary: { [key: string]: number } = {};
  transactions
    .filter(t => t.status === 'Approved' && t.type !== 'income')
    .forEach(t => {
      categorySummary[t.category] = (categorySummary[t.category] || 0) + t.amount;
    });

  const categoryEntries = Object.entries(categorySummary).sort((a, b) => b[1] - a[1]);
  const totalExpenseAllocated = categoryEntries.reduce((sum, e) => sum + e[1], 0) || 1;

  // Pie chart calculation helper loops
  let accumulatedAngle = 0;

  // CSV Exporter
  const handleExportCSV = () => {
    const inboundTx = transactions.filter(t => t.type === 'income');
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID Transaksi,Tanggal,Nama Produk / Sumber,Inbound User,Nominal,Status\n';

    inboundTx.forEach(t => {
      csvContent += `${t.id},${t.date},"${t.merchant}","${t.staffEmail}",${t.amount},${t.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jagoai_laporan_masuk_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Approval Process Triggers
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  const handleApproveAction = async (
    id: string,
    recipientName?: string,
    bankName?: string,
    bankAccount?: string,
    transferReceiptUrl?: string
  ) => {
    try {
      setIsSubmittingApproval(true);
      const res = await onApprove(id, recipientName, bankName, bankAccount, transferReceiptUrl);
      if (res) {
        setSplitViewTx(null);
        setErrorMessage(null);
      }
    } catch (err: any) {
      setErrorMessage({
        name: err.name || 'Gagal Menyetujui Reimburse',
        text: err.message || 'Persetujuan ditolak oleh sistem karena kas perseroan tidak mencukupi untuk pembayaran ini.'
      });
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const handleRejectAction = async (id: string) => {
    if (!rejectReasonText.trim()) return;
    const res = await onReject(id, rejectReasonText);
    if (res) {
      setSplitViewTx(null);
      setRejectReasonText('');
      setShowRejectForm(false);
    }
  };

  // Submit manual book entry
  const handleManualPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMerchant || !manualAmount) return;

    try {
      const res = await onManualLedger({
        merchant: manualMerchant,
        category: manualCategory,
        amount: Number(manualAmount),
        notes: manualNotes,
        type: manualType,
        receiptUrl: manualReceiptBase64
      });
      
      if (res.success) {
        setShowManualModal(false);
        setManualMerchant('');
        setManualAmount(0);
        setManualNotes('');
        setManualReceiptBase64('');
        setErrorMessage(null);
      } else {
        setErrorMessage({ name: res.error || 'Gagal', text: res.message || 'Transaksi gagal diposting.' });
      }
    } catch (err: any) {
      setErrorMessage({ name: 'Saldo Kas Tidak Cukup', text: err.message || 'Saldo saat ini tidak cukup.' });
    }
  };

  // Save Webhook settings
  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showWebhookModal || !webhookUrl) return;

    await onWebhookSave(showWebhookModal.id, {
      webhookUrl,
      paymentGateway: webhookGateway
    });

    setShowWebhookModal(null);
    setWebhookUrl('');
  };

  // Trigger mass salary payout
  const handleMassPayroll = async () => {
    setPayrollMessage(null);
    try {
      const res = await onPayrollGenerate(payrollDivision);
      if (res.success) {
        setPayrollMessage({ type: 'success', text: res.message });
        setTimeout(() => setPayrollMessage(null), 5000);
      } else {
        setPayrollMessage({ type: 'error', text: res.error || 'Sistem penarikan payroll massal bermasalah.' });
      }
    } catch (err: any) {
      setPayrollMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Proses payroll diblokir karena kas tidak cukup melakukan mass-transfer.' 
      });
    }
  };

  const openWebhookSetup = (app: ConnectedApp) => {
    setShowWebhookModal(app);
    setWebhookUrl(app.webhookUrl || 'https://api.perusahaan.com/jagoai/listener');
    setWebhookGateway(app.paymentGateway || 'Xendit');
  };

  const pendingApprovals = transactions.filter(t => t.status === 'Pending' && t.type === 'reimburse');

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans select-none">
      
      {/* Visual Error Indicators / Overlay Warnings state */}
      {errorMessage && (
        <div className="bg-rose-600 text-white p-3.5 px-6 flex justify-between items-center text-xs shadow-md font-sans">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider block">{errorMessage.name}</span>
              <span>{errorMessage.text}</span>
            </div>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Internal Nav Grid System */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Nav Panels */}
        <aside className="w-80 bg-white flex flex-col justify-between border-r border-slate-150 select-none shrink-0 z-10">
          
          {/* Logo Brand Header Block */}
          <div className="p-6 pb-7 border-b border-slate-100 flex items-center gap-4">
            <div className="p-2.5 bg-[#0000a0]/95 text-white rounded-2xl flex items-center justify-center shadow-lg w-12 h-12 shadow-[#0000a0]/20 shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#050630] text-lg lg:text-xl tracking-tight block leading-none">JagoAiFinance</span>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border shrink-0 ${
                  subscriptionTier === 'pro'
                    ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}>
                  {subscriptionTier}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-extrabold tracking-wider block uppercase mt-1 truncate max-w-[140px]" title={companyName}>{companyName}</span>
            </div>
          </div>

          {/* Navigation Items list */}
          <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
            {/* 1. overview */}
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left py-3.5 px-6 text-[13px] sm:text-sm font-bold font-display flex items-center gap-4 transition-all relative ${
                activeTab === 'overview' 
                  ? 'bg-indigo-50/60 text-[#1800ad]' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              {activeTab === 'overview' && (
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
              )}
              <LayoutGrid className={`w-5 h-5 shrink-0 ${activeTab === 'overview' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
              <span>Eksekutif Overview</span>
            </button>

            {/* 2. approvals */}
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`w-full text-left py-3.5 px-6 text-[13px] sm:text-sm font-bold font-display flex items-center justify-between transition-all relative ${
                activeTab === 'approvals' 
                  ? 'bg-indigo-50/60 text-[#1800ad]' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-4">
                {activeTab === 'approvals' && (
                  <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
                )}
                <CheckCircle className={`w-5 h-5 shrink-0 ${activeTab === 'approvals' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                <span>Persetujuan Reimburse</span>
              </div>
              {pendingApprovals.length > 0 && (
                <span className="bg-rose-500 text-white text-[11px] px-2.5 py-0.5 rounded-full font-black animate-scaleIn">
                  {pendingApprovals.length}
                </span>
              )}
            </button>

            {/* 3. inbound */}
            <button 
              onClick={() => setActiveTab('inbound')}
              className={`w-full text-left py-3.5 px-6 text-[13px] sm:text-sm font-bold font-display flex items-center gap-4 transition-all relative ${
                activeTab === 'inbound' 
                  ? 'bg-indigo-50/60 text-[#1800ad]' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              {activeTab === 'inbound' && (
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
              )}
              <ArrowUpRight className={`w-5 h-5 shrink-0 ${activeTab === 'inbound' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
              <span>Arus Uang Masuk</span>
            </button>

            {/* 4. ledger */}
            <button 
              onClick={() => setActiveTab('ledger')}
              className={`w-full text-left py-3.5 px-6 text-[13px] sm:text-sm font-bold font-display flex items-center gap-4 transition-all relative ${
                activeTab === 'ledger' 
                  ? 'bg-indigo-50/60 text-[#1800ad]' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              {activeTab === 'ledger' && (
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
              )}
              <ArrowRightLeft className={`w-5 h-5 shrink-0 ${activeTab === 'ledger' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
              <span>Buku Kas Ledger</span>
            </button>

            {/* 5. subscriptions */}
            <button 
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full text-left py-3.5 px-6 text-[13px] sm:text-sm font-bold font-display flex items-center gap-4 transition-all relative ${
                activeTab === 'subscriptions' 
                  ? 'bg-indigo-50/60 text-[#1800ad]' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              {activeTab === 'subscriptions' && (
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
              )}
              <CreditCard className={`w-5 h-5 shrink-0 ${activeTab === 'subscriptions' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
              <span>Tagihan Langganan</span>
            </button>

            {/* 6. integrations */}
            <button 
              onClick={() => setActiveTab('integrations')}
              className={`w-full text-left py-3.5 px-6 text-[13px] sm:text-sm font-bold font-display flex items-center gap-4 transition-all relative ${
                activeTab === 'integrations' 
                  ? 'bg-indigo-50/60 text-[#1800ad]' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              {activeTab === 'integrations' && (
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
              )}
              <Link className={`w-5 h-5 shrink-0 ${activeTab === 'integrations' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
              <span>Koneksi Produk API</span>
            </button>

            {/* 7. payroll */}
            <button 
              onClick={() => setActiveTab('payroll')}
              className={`w-full text-left py-3.5 px-6 text-[13px] sm:text-sm font-bold font-display flex items-center gap-4 transition-all relative ${
                activeTab === 'payroll' 
                  ? 'bg-indigo-50/60 text-[#1800ad]' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              {activeTab === 'payroll' && (
                <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
              )}
              <Users className={`w-5 h-5 shrink-0 ${activeTab === 'payroll' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
              <span>Karyawan & Gaji</span>
            </button>
          </nav>

          {/* Profile Card Footer block exactly like the design */}
          <div className="p-5 border-t border-slate-100 bg-white space-y-4">
            {/* Keadaan Finansial Kas Status indicator nested inside with high-precision design */}
            <div className="bg-slate-50 p-3 px-4.5 rounded-2xl flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">Kas Operasional</span>
              <span className="font-mono font-black text-slate-800 text-sm">Rp {cashBalance.toLocaleString('id-ID')}</span>
            </div>

             <div 
               onClick={() => {
                 if (onLogout) onLogout();
               }}
               className="bg-[#f8f9fe] border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-rose-50/50 hover:border-rose-100 group/profile transition-all"
               title="Klik untuk Log Out"
             >
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-3xs">
                   <img 
                     src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                     alt="Alex Sterling Avatar"
                     className="w-full h-full object-cover"
                     referrerPolicy="no-referrer"
                   />
                 </div>
                 <div>
                   <span className="font-extrabold text-sm text-slate-800 block group-hover/profile:text-rose-700 transition-colors">Alex Sterling</span>
                   <span className="text-[10px] text-[#4f46e5] font-black tracking-widest uppercase block mt-1 group-hover/profile:text-rose-500/70 transition-colors">EKSEKUTIF FINANCE</span>
                 </div>
               </div>
               <LogOut className="w-5 h-5 text-slate-400 group-hover/profile:text-rose-600 transition-all group-hover/profile:translate-x-0.5" />
             </div>
          </div>
        </aside>

        {/* Content Panel Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          
          {/* SKELETON LOADING STATE */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl shimmer-active"></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 h-72 bg-white border border-slate-100 rounded-2xl shimmer-active"></div>
                <div className="h-72 bg-white border border-slate-100 rounded-2xl shimmer-active"></div>
              </div>
            </div>
          ) : (
            <>
              {/* SCREEN B-2: EXECUTIVE MAIN OVERVIEW VIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Top Dashboard Head */}
                  <div className="flex justify-between items-center pb-2 bg-slate-50/50">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900 select-all">Executive Cockpit</h2>
                      <p className="text-sm text-slate-550 mt-1.5">Status neraca digital PT JagoAI yang terintegrasi real-time.</p>
                    </div>
                  </div>

                  {/* 4 Hero Stats Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs hover:shadow-2xs transition-all relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-slate-450 uppercase font-black tracking-wider block">Saldo Kas Saat Ini</span>
                          <h3 className="text-xl lg:text-2xl font-extrabold font-mono tracking-tight mt-2 text-brand">Rp {cashBalance.toLocaleString('id-ID')}</h3>
                        </div>
                        <div className="p-3.5 bg-indigo-50 text-brand rounded-2xl w-12 h-12 flex items-center justify-center shrink-0">
                          <DollarSign className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-slate-500">
                        <span className="text-emerald-600 font-extrabold">100% Likuid</span> • Escrow Gateway Aman
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs hover:shadow-2xs transition-all relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-slate-450 uppercase font-black tracking-wider block">Total Pemasukan (Mei)</span>
                          <h3 className="text-xl lg:text-2xl font-extrabold font-mono tracking-tight mt-2 text-emerald-600">Rp {totalInflowThisMonth.toLocaleString('id-ID')}</h3>
                        </div>
                        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl w-12 h-12 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-slate-500">
                        <span className="text-emerald-600 font-extrabold">+{connectedApps.filter(a=>a.status==='active').length} App</span> Stream otomatis
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs hover:shadow-2xs transition-all relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-slate-450 uppercase font-black tracking-wider block">Total Pengeluaran (Mei)</span>
                          <h3 className="text-xl lg:text-2xl font-extrabold font-mono tracking-tight mt-2 text-rose-600">Rp {totalOutflowThisMonth.toLocaleString('id-ID')}</h3>
                        </div>
                        <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl w-12 h-12 flex items-center justify-center shrink-0">
                          <TrendingDown className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-slate-500">
                        Termasuk gaji karyawan & reimburse
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs hover:shadow-2xs transition-all relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-slate-450 uppercase font-black tracking-wider block">Estimasi Runway Sisa</span>
                          <h3 className="text-xl lg:text-2xl font-extrabold mt-2 text-slate-800">{runwayMonths} Bulan</h3>
                        </div>
                        <div className="p-3.5 bg-slate-50 text-slate-600 rounded-2xl w-12 h-12 flex items-center justify-center shrink-0">
                          <Calendar className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-slate-500">
                        Asumsi burn rate: Rp {averageMonthlyBurn.toLocaleString('id-ID')}/bln
                      </div>
                    </div>
                  </div>

                  {/* Profit & Loss Chart and Expense Breakdown Grid Row info */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* B-2.1: P&L Chart custom SVG based view */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs xl:col-span-2 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base lg:text-lg font-black text-slate-900 font-display">Grafik P&L (Profit & Loss) 2026</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Pemasukan (Bar) vs Pengeluaran (Line) historis.</p>
                        </div>
                        <div className="flex items-center gap-3.5 text-xs font-bold text-slate-600">
                          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#1800ad] rounded-xs"></span> Pemasukan</span>
                          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-rose-500 inline-block"></span> Pengeluaran</span>
                        </div>
                      </div>

                      {/* Custom SVG Line & Column Chart */}
                      <div className="w-full h-56 pt-2">
                        <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
                          {/* Horizontal guideline paths */}
                          <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="40" y1="70" x2="580" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="40" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="40" y1="170" x2="580" y2="170" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="40" y1="200" x2="580" y2="200" stroke="#cbd5e1" strokeWidth="1" />

                          {/* Left y-axis notes values */}
                          <text x="-5" y="24" className="text-[10.5px] fill-slate-450 font-mono font-semibold">Rp 500jt</text>
                          <text x="-5" y="74" className="text-[10.5px] fill-slate-450 font-mono font-semibold">Rp 300jt</text>
                          <text x="-5" y="124" className="text-[10.5px] fill-slate-450 font-mono font-semibold">Rp 100jt</text>
                          <text x="5" y="174" className="text-[10.5px] fill-slate-450 font-mono font-semibold">Rp 0jt</text>

                          {/* Data sets for last 6 months (Jan - Jun) */}
                          {/* Income Columns / Expense Lines */}
                          {/* January */}
                          <rect x="75" y="60" width="28" height="140" fill="#1800ad" rx="4" className="hover:opacity-85 transition-all text-neutral-100" />
                          {/* February */}
                          <rect x="165" y="80" width="28" height="120" fill="#1800ad" rx="4" />
                          {/* March */}
                          <rect x="255" y="50" width="28" height="150" fill="#1800ad" rx="4" />
                          {/* April */}
                          <rect x="345" y="45" width="28" height="155" fill="#1800ad" rx="4" />
                          {/* May */}
                          <rect x="435" y="75" width="28" height="125" fill="#1800ad" rx="4" />
                          {/* June (Proj) */}
                          <rect x="525" y="65" width="28" height="135" fill="#1800ad" rx="4" opacity="0.6" strokeDasharray="3" />

                          {/* Line tracker path for Expenses */}
                          <path 
                            d="M 90 140 L 180 150 L 270 120 L 360 135 L 450 160 L 540 145" 
                            fill="none" 
                            stroke="#f43f5e" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                          
                          {/* Highlight circles onto line path */}
                          <circle cx="90" cy="140" r="4.5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="180" cy="150" r="4.5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="270" cy="120" r="4.5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="360" cy="135" r="4.5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="450" cy="160" r="4.5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="540" cy="145" r="4.5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />

                          {/* X-axis labels names */}
                          <text x="80" y="216" className="text-[11.5px] font-black text-slate-550 fill-slate-550">Jan</text>
                          <text x="170" y="216" className="text-[11.5px] font-black text-slate-550 fill-slate-550">Feb</text>
                          <text x="260" y="216" className="text-[11.5px] font-black text-slate-550 fill-slate-550">Mar</text>
                          <text x="350" y="216" className="text-[11.5px] font-black text-slate-550 fill-slate-550">Apr</text>
                          <text x="440" y="216" className="text-[11.5px] font-black text-slate-550 fill-slate-550">Mei</text>
                          <text x="530" y="216" className="text-[11.5px] font-black text-slate-550 fill-slate-550">Jun*</text>
                        </svg>
                      </div>
                    </div>

                    {/* B-2.2: Expense Breakdown SVG Pie Donut Chart */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs space-y-4">
                      <div>
                        <h4 className="text-base lg:text-lg font-black text-slate-900 font-display">Alokasi Biaya Terporsi</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Distribusi pengeluaran riil berdasarkan tipe.</p>
                      </div>

                      {/* Donut Chart representation */}
                      <div className="flex flex-col items-center justify-center space-y-4 py-2">
                        <div className="relative w-36 h-36">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            {categoryEntries.length === 0 ? (
                               <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                            ) : (
                              categoryEntries.map(([cat, val], idx) => {
                                const percent = val / totalExpenseAllocated;
                                const strokeDash = `${percent * 238.76} ${238.76}`;
                                const strokeOffset = -accumulatedAngle;
                                accumulatedAngle += percent * 238.76;

                                // Unique hex colors per index
                                const colors = ['#1800ad', '#3b82f6', '#f43f5e', '#a855f7', '#fbbf24', '#06b6d4'];
                                const activeColor = colors[idx % colors.length];

                                return (
                                  <circle 
                                    key={idx}
                                    cx="50" 
                                    cy="50" 
                                    r="38" 
                                    fill="none" 
                                    stroke={activeColor} 
                                    strokeWidth="20" 
                                    strokeDasharray={strokeDash}
                                    strokeDashoffset={strokeOffset}
                                  />
                                );
                              })
                            )}
                            <circle cx="50" cy="50" r="26" fill="#ffffff" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-slate-450 uppercase tracking-widest font-extrabold">TOTAL</span>
                            <span className="text-sm font-black font-mono">Rp {totalOutflowThisMonth.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* Pie Chart Legend detail list */}
                        <div className="w-full space-y-2 pt-2 text-xs">
                          {categoryEntries.length === 0 ? (
                            <div className="text-center text-slate-400 italic">Belum ada pengeluaran disetujui.</div>
                          ) : (
                            categoryEntries.slice(0, 3).map(([cat, val], idx) => {
                              const colors = ['bg-brand', 'bg-blue-500', 'bg-rose-500', 'bg-purple-500', 'bg-amber-500'];
                              return (
                                <div key={cat} className="flex justify-between items-center text-slate-700">
                                  <div className="flex items-center gap-2 font-bold">
                                    <span className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`}></span>
                                    <span>{cat}</span>
                                  </div>
                                  <span className="font-extrabold font-mono">Rp {val.toLocaleString('id-ID')}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Pending Approvals Table and Product Leaderboard widget */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* B-3.1: Pending Action mini widget */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs xl:col-span-2 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-black text-slate-900 font-display">Verifikasi Klaim Tertunda</h4>
                          <p className="text-xs text-slate-500">Pengajuan staf yang butuh pertimbangan audit mendesak.</p>
                        </div>
                        <span className="text-xs font-extrabold bg-amber-50 text-amber-800 p-1.5 px-3 rounded-full border border-amber-200">Pending audit: {pendingApprovals.length}</span>
                      </div>

                      {pendingApprovals.length === 0 ? (
                        /* Empty state */
                        <div className="p-10 text-center bg-slate-50 border border-slate-150 border-dashed rounded-2xl space-y-3 text-slate-500">
                          <CheckCircle className="w-10 h-10 text-slate-300 mx-auto" strokeWidth="1.5" />
                          <div>
                            <span className="text-sm font-extrabold text-slate-700 block">Semua Beres!</span>
                            <span className="text-xs text-slate-400">Tidak ada pengajuan klaim staf yang tertunda di antrian hari ini.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm bg-white rounded-xl overflow-hidden">
                            <thead>
                              <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 text-[11px] font-black uppercase tracking-wider">
                                <th className="p-4">Staff</th>
                                <th className="p-4">Merchant / Toko</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Nominal</th>
                                <th className="p-4 text-right">Tindakan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                              {pendingApprovals.slice(0, 4).map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-all font-semibold">
                                  <td className="p-4">
                                    <div className="leading-tight">
                                      <span className="font-extrabold text-slate-900 block text-[13.5px]">{tx.staffName}</span>
                                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{tx.staffEmail}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 font-bold text-slate-800 truncate max-w-[140px] text-[13px]">{tx.merchant}</td>
                                  <td className="p-4">
                                    <span className="text-[11px] bg-slate-100 text-slate-700 p-1.5 px-3 rounded-xl font-black">{tx.category}</span>
                                  </td>
                                  <td className="p-4 font-mono font-black text-slate-900 text-[13.5px]">Rp {tx.amount.toLocaleString('id-ID')}</td>
                                  <td className="p-4 text-right">
                                    <button 
                                      onClick={() => setSplitViewTx(tx)}
                                      className="p-2 px-4 bg-brand text-white text-xs font-black rounded-xl hover:opacity-90 inline-flex items-center gap-1.5 transition-all shadow-sm"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>Split Review</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* B-2.3: Revenue Leaderboard Widget */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs space-y-4">
                      <div>
                        <h4 className="text-base font-black text-slate-900 font-display">Peringkat Pemasukan Produk</h4>
                        <p className="text-xs text-slate-500">Kontribusi revenue terbesar oleh jagoAI bulan ini.</p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {connectedApps.map((app, idx) => {
                          const rankings = ['🥇', '🥈', '🥉'];
                          return (
                            <div key={app.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{rankings[idx] || '🔹'}</span>
                                <div>
                                  <h6 className="font-extrabold text-xs sm:text-sm text-slate-850 leading-tight">{app.name}</h6>
                                  <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full inline-block mt-1.5 ${
                                    app.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                                  }`}>{app.status === 'active' ? 'AKTIF' : 'NON-AKTIF'}</span>
                                </div>
                              </div>
                              <span className="font-mono text-sm font-black text-slate-800">Rp {app.monthlyRevenue.toLocaleString('id-ID')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* SCREEN B-3: APPROVAL SPLIT VIEW DATA TABLE */}
              {activeTab === 'approvals' && (
                <div className="space-y-6">
                  
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900">Area Persetujuan Tim Keuangan</h2>
                    <p className="text-sm text-slate-500 mt-1.5">Audit keabsahan struk fisik di bawah ini menggunakan integrasi AI Scanner secara adil.</p>
                  </div>

                  {/* Global Search & Filter Bar */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari berdasarkan Merchant atau Nama Staff..."
                        className="w-full pl-11 pr-5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand focus:ring-1 focus:ring-brand font-semibold"
                      />
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-3 px-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:border-brand focus:ring-1 focus:ring-brand outline-none cursor-pointer w-full font-bold text-slate-700"
                      >
                        <option value="Semua">Status: Semua</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-3 px-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:border-brand focus:ring-1 focus:ring-brand outline-none cursor-pointer w-full font-bold text-slate-700"
                      >
                        <option value="Semua">Kategori: Semua</option>
                        <option value="Operasional">Operasional</option>
                        <option value="Transportasi">Transportasi</option>
                        <option value="Server">Server</option>
                        <option value="Gaji Karyawan">Gaji Gaji</option>
                      </select>
                    </div>
                  </div>

                  {/* General datatable */}
                  {(() => {
                    const filtered = transactions.filter(t => {
                      if (t.type === 'income') return false; // Hide income streams on reclaim area

                      const matchSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                          t.staffName.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchStatus = statusFilter === 'Semua' ? true : t.status === statusFilter;
                      const matchCategory = categoryFilter === 'Semua' ? true : t.category === categoryFilter;

                      return matchSearch && matchStatus && matchCategory;
                    });

                    return filtered.length === 0 ? (
                      <div className="bg-white p-14 rounded-3xl border border-slate-100 shadow-3xs text-center space-y-4">
                        <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto" strokeWidth="1.5" />
                        <div>
                          <h5 className="font-extrabold text-slate-700 text-base">Tidak Ada Transaksi Cocok</h5>
                          <p className="text-sm text-slate-400 mt-1">Coba sesuaikan kata pencarian atau bersihkan filter Anda.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-3xs overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="bg-slate-50 text-slate-600 border-b border-indigo-20 font-black uppercase text-[10.5px] tracking-wider">
                                <th className="p-5">Tanggal</th>
                                <th className="p-5">ID / Staff</th>
                                <th className="p-5">Merchant / Supplier</th>
                                <th className="p-5">Kategori</th>
                                <th className="p-5">Jumlah Biaya</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Panel Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                              {filtered.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                                  <td className="p-5 text-slate-500 font-mono text-xs">{t.date}</td>
                                  <td className="p-5">
                                    <div className="leading-tight">
                                      <span className="font-black text-slate-900 block text-sm sm:text-[14.5px]">{t.staffName}</span>
                                      <span className="text-xs text-slate-400 font-mono block mt-0.5">{t.staffEmail}</span>
                                    </div>
                                  </td>
                                  <td className="p-5 font-extrabold text-slate-850 truncate max-w-[165px] text-sm sm:text-[14px]">{t.merchant}</td>
                                  <td className="p-5">
                                    <span className="bg-indigo-50 text-indigo-700 p-1.5 px-3 rounded-xl text-xs font-black">{t.category}</span>
                                  </td>
                                  <td className="p-5 font-mono font-black text-slate-900 text-sm sm:text-[15px]">Rp {t.amount.toLocaleString('id-ID')}</td>
                                  <td className="p-5">
                                    <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full ${
                                      t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                      t.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                      'bg-amber-50 text-amber-700 border border-amber-100'
                                    }`}>
                                      {t.status}
                                    </span>
                                  </td>
                                  <td className="p-5 text-right">
                                    <button 
                                      onClick={() => {
                                        setSplitViewTx(t);
                                        setShowRejectForm(false);
                                        setRejectReasonText('');
                                      }}
                                      className="p-2 px-4 bg-brand text-white font-black text-xs sm:text-sm rounded-xl hover:opacity-90 inline-flex items-center gap-1.5 transition-all shadow-sm"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>Tinjau</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              )}

              {/* SCREEN B-4: AUTOMATED INBOUND REVENUE STREAMS */}
              {activeTab === 'inbound' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900">Arus Kas Masuk (Automated Streams)</h2>
                      <p className="text-sm text-slate-500 mt-1.5">Laporan uang masuk langsung yang diterima secara otomatis dari billing webhook produk.</p>
                    </div>

                    <button 
                      onClick={handleExportCSV}
                      className="p-3 px-5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <FileSpreadsheet className="w-5 h-5" /> Unduh Format CSV
                    </button>
                  </div>

                  {/* Inbound log table */}
                  {(() => {
                    const inboundTxs = transactions.filter(t => t.type === 'income');

                    return (
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-3xs overflow-hidden">
                        <div className="p-5 bg-indigo-50/50 border-b border-indigo-100/50 flex justify-between items-center text-sm">
                          <span className="font-extrabold text-brand font-display flex items-center gap-2 text-sm sm:text-[14.5px]"><Sparkles className="w-5 h-5" /> Pemasukan Otomatis Terdeteksi</span>
                          <span className="font-black text-emerald-600 text-sm sm:text-base">Total: Rp {totalInflowThisMonth.toLocaleString('id-ID')}</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm bg-white">
                            <thead>
                              <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 font-extrabold uppercase text-[10.5px] tracking-wider">
                                <th className="p-5">Tanggal Inflow</th>
                                <th className="p-5">ID Aliran</th>
                                <th className="p-5">Asal Produk AI</th>
                                <th className="p-5">Klien / Detail Node Billing</th>
                                <th className="p-5">Jumlah Pemasukan</th>
                                <th className="p-5">Saluran / PG</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                              {inboundTxs.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-all font-semibold">
                                  <td className="p-5 font-mono text-xs text-slate-450">{t.date}</td>
                                  <td className="p-5 font-mono text-xs text-brand font-extrabold">{t.id}</td>
                                  <td className="p-5 font-black text-slate-900 text-sm sm:text-[14.5px]">{t.merchant}</td>
                                  <td className="p-5 font-mono text-xs text-slate-500">{t.staffEmail}</td>
                                  <td className="p-5 font-mono font-black text-emerald-600 text-sm sm:text-[15.5px]">Rp {t.amount.toLocaleString('id-ID')}</td>
                                  <td className="p-5">
                                    <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">Otomatis / PG</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              )}

              {/* SCREEN B-5: PRODUCT API CONNECTIONS / INTEGRATION */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900">Koneksi Produk API jagoAI</h2>
                    <p className="text-sm text-slate-500 mt-1.5">Sambungkan produk SaaS internal Anda ke dashboard keuangan untuk pelaporan kas berkala otomatis.</p>
                  </div>

                  {/* Integration settings connected apps grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {connectedApps.map((app) => (
                      <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3xs hover:shadow-2xs transition-all space-y-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-extrabold text-base sm:text-lg text-slate-850 font-display leading-tight">{app.name}</h3>
                            <p className="text-[10.5px] text-slate-400 mt-1 font-semibold">ID: {app.id}</p>
                          </div>

                          {/* Connection Status Toggle indicator click */}
                          <button 
                            onClick={() => onToggleApp(app.id)}
                            className={`p-1.5 px-4 text-xs font-black rounded-full transition-all border ${
                              app.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-3xs' 
                                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200 hover:text-slate-600'
                            }`}
                          >
                            {app.status === 'active' ? '● Aktif' : '○ Mati'}
                          </button>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {app.description}
                        </p>

                        <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-2">
                          <div className="flex justify-between items-center text-slate-550 font-bold">
                            <span>Payment Gateway</span>
                            <span className="font-black text-slate-800">{app.paymentGateway || 'Belum Terhubung'}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-550 font-bold">
                            <span>Inflow Mei</span>
                            <span className="font-mono font-black text-slate-800 text-[13px]">Rp {app.monthlyRevenue.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* Webhook endpoint Setup Trigger */}
                        <div className="pt-2 flex gap-2">
                          <button 
                            onClick={() => openWebhookSetup(app)}
                            className="flex-1 py-3 bg-indigo-50 text-indigo-700 hover:bg-brand hover:text-white rounded-2xl text-xs sm:text-sm font-black font-display transition-all text-center flex items-center justify-center gap-1.5"
                          >
                            <Link className="w-4 h-4" /> Configure Webhook
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* SCREEN B-6: MANUAL ENTRY & MASTER TRANSACTIONS */}
              {activeTab === 'ledger' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900">Buku Kas & Ledger Finansial</h2>
                      <p className="text-sm text-slate-500 mt-1.5">Buku besar historis kas perseroan yang mencatat seluruh aktivitas in & out secara hierarkis.</p>
                    </div>

                    <button 
                      onClick={() => setShowManualModal(true)}
                      className="p-3 px-5 bg-brand hover:opacity-90 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Plus className="w-5 h-5" /> Entri Manual Ledger
                    </button>
                  </div>

                  {/* Ledger Table */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-3xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm bg-white">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 font-extrabold uppercase text-[10.5px] tracking-wider">
                            <th className="p-5">Tanggal Ledger</th>
                            <th className="p-5">Ref ID</th>
                            <th className="p-5">Merchant / Sumber Kas</th>
                            <th className="p-5">Kategori Akun</th>
                            <th className="p-5">Operator / Validator</th>
                            <th className="p-5">Status</th>
                            <th className="p-5">Debit (Masuk)</th>
                            <th className="p-5">Kredit (Keluar)</th>
                            <th className="p-5">Bukti</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-750 font-semibold">
                          {transactions.filter(t => t.status === 'Approved').map((t) => {
                            const isIncome = t.type === 'income';
                            return (
                              <tr key={t.id} className="hover:bg-slate-50/50 transition-all font-semibold">
                                <td className="p-5 font-mono text-xs text-slate-450">{t.date}</td>
                                <td className="p-5 font-mono text-xs text-slate-400">{t.id}</td>
                                <td className="p-5 font-black text-slate-900 max-w-[200px] truncate text-sm sm:text-[14.5px]">{t.merchant}</td>
                                <td className="p-5">
                                  <span className="bg-indigo-50 text-indigo-700 p-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider">{t.category}</span>
                                </td>
                                <td className="p-5 text-slate-650 text-xs sm:text-sm">{t.staffName}</td>
                                <td className="p-5">
                                  <span className="inline-block text-[9.5px] tracking-wider font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-250">POSTED</span>
                                </td>
                                <td className="p-5 font-mono font-black text-emerald-600 text-sm sm:text-[14.5px]">
                                  {isIncome ? `+Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                                </td>
                                <td className="p-5 font-mono font-black text-rose-600 text-sm sm:text-[14.5px]">
                                  {!isIncome ? `-Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                                </td>
                                <td className="p-5">
                                  {t.receiptUrl || t.transferReceiptUrl ? (
                                    <button 
                                      onClick={() => setSelectedLedgerReceipt(t.receiptUrl || t.transferReceiptUrl || null)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-150 rounded-xl transition-all border border-indigo-150/65 cursor-pointer shadow-3xs"
                                    >
                                      <FileText className="w-3.5 h-3.5 shrink-0 text-indigo-600" /> Lihat Bukti
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-slate-400 font-bold italic">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* SCREEN B-7: SUBSCRIPTION TRACKING SYSTEM */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-6">
                  
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900">Tagihan & Langganan Cloud (SaaS)</h2>
                    <p className="text-sm text-slate-500 mt-1.5 font-medium">Pelacakan pengeluaran berulang (AWS, OpenAI API, SaaS) lengkap dengan notifikasi pencegah kegagalan payment.</p>
                  </div>

                  {/* Active listings cards */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-3xs overflow-hidden">
                    <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-sm">
                      <span className="font-extrabold text-slate-800">Daftar Langganan Aktif ({subscriptions.length})</span>
                      <span className="text-xs bg-amber-50 text-amber-800 p-1.5 px-3 rounded-full font-bold flex items-center gap-1.5 border border-amber-200"><AlertTriangle className="w-4 h-4 text-amber-600" /> Pembaruan Menjelang: {subscriptions.filter(s=>s.status==='warning').length} Tagihan</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm bg-white">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 font-extrabold uppercase tracking-wider text-[10.5px] p-5">
                            <th className="p-5">Layanan SaaS / Vendor</th>
                            <th className="p-5">Kategori Akun</th>
                            <th className="p-5">Biaya Berulang</th>
                            <th className="p-5">Siklus</th>
                            <th className="p-5">Jatuh Tempo Pembayaran</th>
                            <th className="p-5">Fase Alaram</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-705 font-semibold">
                          {subscriptions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50 transition-all font-semibold">
                              <td className="p-5">
                                <div className="leading-tight">
                                  <span className="font-black text-slate-900 block text-sm sm:text-[14.5px]">{sub.name}</span>
                                  <span className="text-xs text-slate-400 font-mono block mt-0.5">ID: {sub.id}</span>
                                </div>
                              </td>
                              <td className="p-5">
                                <span className="bg-slate-100 text-slate-700 p-1.5 px-3 rounded-xl text-xs font-black">{sub.category}</span>
                              </td>
                              <td className="p-5 font-mono font-black text-rose-600 text-sm sm:text-[15.5px]">Rp {sub.cost.toLocaleString('id-ID')}</td>
                              <td className="p-5 capitalize text-slate-600 font-bold">{sub.cycle}</td>
                              <td className="p-5 font-mono text-[13px] font-black text-slate-700">{sub.nextBilling}</td>
                              <td className="p-5">
                                {sub.status === 'warning' ? (
                                  <span className="bg-rose-50 text-rose-800 px-3 py-1 rounded-xl text-[10.5px] font-black flex items-center gap-1.5 w-max border border-rose-200 uppercase tracking-wide">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Hampir Jatuh Tempo</span>
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl text-[10.5px] font-black flex items-center gap-1.5 w-max border border-emerald-250 uppercase tracking-wide">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Lancar (Auto-debet)</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* SCREEN B-8: EMPLOYEE DIRECTORY & PAYROLL MASS GENERATOR */}
              {activeTab === 'payroll' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900">Manajemen Tim & Gaji Karyawan</h2>
                      <p className="text-sm text-slate-500 mt-1.5 font-medium">Manajemen database staf PT JagoAI. Terbitkan dan transfer payroll bulanan massal dengan sekali klik rasa bank.</p>
                    </div>
                  </div>

                  {/* Mass Payroll Generator Control Center panel */}
                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-sm border border-slate-800 space-y-6">
                    <div>
                      <h4 className="text-base sm:text-lg font-black font-display text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-light" /> Pemrosesan Payroll Massal Otomatis</h4>
                      <p className="text-xs sm:text-[13px] text-slate-400 mt-1.5 leading-relaxed">Sistem akan merekam pengeluaran gaji ke kas ledger, mengurangi dana kas, dan menerbitkan invoice pembayaran ke Mandiri API gateway secara serentak.</p>
                    </div>

                    {payrollMessage && (
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border ${
                        payrollMessage.type === 'success' 
                          ? 'bg-emerald-950/60 text-emerald-200 border-emerald-800' 
                          : 'bg-rose-950/60 text-rose-200 border-rose-800'
                      }`}>
                        {payrollMessage.text}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-5 items-end">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10.5px] uppercase font-black tracking-widest text-slate-400 block">Pilih Divisi Pembayaran</label>
                        <select 
                          value={payrollDivision}
                          onChange={(e) => setPayrollDivision(e.target.value)}
                          className="w-full p-3.5 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none focus:border-indigo-400 text-xs sm:text-sm font-bold cursor-pointer"
                        >
                          <option value="Semua">Semua Karyawan (4 Staff)</option>
                          <option value="Engineering">Divisi Engineering</option>
                          <option value="Product">Divisi Product</option>
                          <option value="Operations">Divisi Operations</option>
                        </select>
                      </div>

                      <button 
                        onClick={handleMassPayroll}
                        className="p-3.5 px-8 bg-brand-light hover:bg-[#2510c4] active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all w-full md:w-auto shadow-md"
                      >
                        <Play className="w-4 h-4" /> Terbitkan & Bayar Payroll Massal
                      </button>
                    </div>
                  </div>

                  {/* Employee directories listings */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-3xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm bg-white">
                        <thead>
                          <tr className="bg-slate-50 text-slate-650 border-b border-slate-100 font-extrabold uppercase tracking-wider text-[10.5px] p-5">
                            <th className="p-5">Karyawan</th>
                            <th className="p-5">Jabatan (Role)</th>
                            <th className="p-5">Divisi</th>
                            <th className="p-5">Gaji Pokok / Bln</th>
                            <th className="p-5">Informasi Rekening Bank</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                          {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50/50 transition-all font-semibold">
                              <td className="p-5">
                                <div className="leading-tight">
                                  <span className="font-extrabold text-slate-900 block text-sm sm:text-[14.5px]">{emp.name}</span>
                                  <span className="text-xs text-slate-450 font-mono block mt-1">ID: {emp.id} • {emp.email}</span>
                                </div>
                              </td>
                              <td className="p-5 text-slate-700 text-xs sm:text-sm font-semibold">{emp.role}</td>
                              <td className="p-5 capitalize text-slate-600 font-bold text-xs sm:text-sm">{emp.division}</td>
                              <td className="p-5 font-mono font-black text-slate-900 text-sm sm:text-[14.5px]">Rp {emp.salary.toLocaleString('id-ID')}</td>
                              <td className="p-5">
                                <span className="font-mono text-xs text-brand font-black bg-indigo-50/70 p-2 px-3 rounded-xl inline-block">
                                  {emp.bankName} - {emp.bankAccount}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}


            </>
          )}

        </main>

      </div>

      {/* MODAL 1: B-3.2 Persetujuan Split-View Modal */}
      {splitViewTx && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[680px] max-h-[92vh] rounded-3xl shadow-xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in" style={{ animationDuration: '0.2s' }}>
            
            {/* Split Modal Head */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600">Double-Entry Verification AI</span>
                <h3 className="font-bold text-sm text-slate-850 font-display">Split-View Persetujuan Reimburse • #{splitViewTx.id}</h3>
              </div>
              <button 
                onClick={() => setSplitViewTx(null)}
                className="p-1 px-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split body: 2 segments */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Receipt image zoomed */}
              <div className="w-1/2 bg-slate-100 border-r border-slate-150 p-4 flex flex-col justify-between overflow-y-auto">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-center">FOTO STRUK FISIK (DARI PILOT)</span>
                
                <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xs border border-slate-200 relative p-1">
                  {splitViewTx.receiptUrl ? (
                    <img 
                      src={splitViewTx.receiptUrl} 
                      alt="Review receipt document" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center text-slate-400 gap-1.5">
                      <XCircle className="w-8 h-8 opacity-40 text-rose-500" />
                      <span className="text-[10px] font-semibold text-slate-500">Bukti struk tidak tersedia digital.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Extraction Results verification */}
              <div className="w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
                
                <div className="space-y-3.5">
                  <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-2 text-[10px]">
                    <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Status Scan jagoAI:</span>
                      Kategori dan pengeluaran berhasil divalidasi keabsahannya tanpa selisih pajak.
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Merek Toko / Supplier</label>
                      <span className="font-bold text-slate-850 text-sm block bg-slate-50 p-2 rounded-lg border border-slate-150">{splitViewTx.merchant}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Tanggal Invoice</label>
                        <span className="font-bold text-slate-700 block bg-slate-50 p-2 rounded-lg border border-slate-150 font-mono text-[10px]">{splitViewTx.date}</span>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Kategori Pengeluaran</label>
                        <span className="font-bold text-slate-700 block bg-slate-50 p-2 rounded-lg border border-slate-150">{splitViewTx.category}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Rincian Nominal Ganti Rugi (IDR)</label>
                      <span className="font-bold text-brand font-mono text-base block bg-indigo-50/30 p-2 rounded-lg border border-indigo-20">{splitViewTx.amount.toLocaleString('id-ID')} IDR</span>
                    </div>

                    {splitViewTx.notes && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Catatan Pengaju</label>
                        <span className="block bg-slate-50 p-2 rounded-lg border border-slate-150 italic text-[11px] text-slate-650 leading-relaxed">"{splitViewTx.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Rincian Rekening Penerima & Bukti Transfer Section */}
                  <div className="border-t border-slate-150/80 pt-4 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-brand" /> Informasi Rekening & Bukti Transfer
                    </h4>
                    
                    {splitViewTx.status === 'Approved' ? (
                      // Read-only / Success snapshot for already approved transactions
                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3.5">
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Nama Penerima</span>
                            <span className="font-extrabold text-slate-900 text-[13.5px]">{splitViewTx.recipientName || splitViewTx.staffName}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Bank</span>
                            <span className="font-bold text-slate-800 text-[13px]">{splitViewTx.bankName || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Nomor Rekening</span>
                            <span className="font-bold text-slate-800 font-mono text-[13px]">{splitViewTx.bankAccount || '-'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1.5">Bukti Transfer Resmi</span>
                          {splitViewTx.transferReceiptUrl ? (
                            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 relative max-h-48 flex items-center justify-center p-1.5 shadow-3xs">
                              <img 
                                src={splitViewTx.transferReceiptUrl || approveReceiptBase64} 
                                alt="Transfer Proof" 
                                className="max-h-40 object-contain rounded-xl hover:scale-[1.02] transition duration-200 cursor-pointer"
                                onClick={() => {
                                  const w = window.open();
                                  if (w) {
                                    w.document.write(`<img src="${splitViewTx.transferReceiptUrl || approveReceiptBase64}" style="max-width:100%; height:auto;" />`);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <span className="text-slate-450 italic text-[11.5px] block bg-slate-50 p-3 rounded-xl border border-slate-150">Bukti transfer tidak diunggah saat persetujuan ini.</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Inputs for Pending status
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">Nama Penerima Rekening</label>
                            <input 
                              type="text"
                              value={approveRecipientName}
                              onChange={(e) => setApproveRecipientName(e.target.value)}
                              placeholder="Masukkan nama penerima..."
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-850 focus:bg-white transition-all text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">Nama Bank</label>
                            <input 
                              type="text"
                              value={approveBankName}
                              onChange={(e) => setApproveBankName(e.target.value)}
                              placeholder="Contoh: BCA, Mandiri"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-850 focus:bg-white transition-all text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">Nomor Rekening</label>
                            <input 
                              type="text"
                              value={approveBankAccount}
                              onChange={(e) => setApproveBankAccount(e.target.value)}
                              placeholder="Contoh: 70123849"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-850 focus:bg-white transition-all text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Upload Bukti Transfer Widget */}
                        <div className="space-y-2">
                          <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block">Unggah Bukti Transfer <span className="text-rose-500 font-medium">*Wajib</span></label>
                          
                          {approveReceiptBase64 ? (
                            <div className="border border-indigo-150 bg-indigo-50/20 p-3 rounded-2xl flex items-center justify-between shadow-3xs animate-in fade-in">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 border border-slate-200 rounded-xl bg-white overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-3xs">
                                  <img src={approveReceiptBase64} alt="Preview transfer" className="object-contain w-full h-full rounded" />
                                </div>
                                <div className="leading-snug">
                                  <span className="font-black text-xs text-slate-800 block truncate max-w-[150px]">Bukti_Transfer_Reimburse.png</span>
                                  <span className="text-[9px] text-emerald-600 block font-extrabold flex items-center gap-0.5 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Berhasil Diunggah
                                  </span>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => setApproveReceiptBase64('')}
                                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
                                title="Remove File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[90px] ${
                                isDragging 
                                  ? 'border-brand bg-indigo-50/40 scale-[0.99]' 
                                  : 'border-slate-250 bg-slate-50 hover:bg-slate-100/40 hover:border-slate-300'
                              }`}
                              onClick={() => document.getElementById('approve_transfer_file_input')?.click()}
                            >
                              <input 
                                type="file" 
                                id="approve_transfer_file_input"
                                accept="image/*"
                                className="hidden" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(e.target.files[0]);
                                  }
                                }}
                              />
                              <Plus className="w-6 h-6 text-slate-400" />
                              <div className="text-[10.5px] text-slate-600 font-extrabold leading-tight">
                                Drag & Drop bukti transfer atau <span className="text-indigo-600 font-black underline">Cari File</span>
                              </div>
                              <p className="text-[8.5px] text-slate-400 font-semibold tracking-wide">Mendukung format gambar JPEG, PNG, WEBP (Maksimal 5MB)</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning warning: safe balance deduction preview */}
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[10px] space-y-1">
                  <span className="font-bold text-amber-800 block">⚠️ Prakiraan Sisa Kas:</span>
                  <div className="flex justify-between font-mono">
                    <span>Kas Setelah Pengurangan:</span>
                    <span className="font-bold">Rp {(cashBalance - splitViewTx.amount).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Actions area inside modal */}
                <div className="pt-2 border-t border-slate-100 flex gap-3">
                  
                  {showRejectForm ? (
                    <div className="w-full space-y-2">
                      <input 
                        type="text" 
                        required
                        value={rejectReasonText}
                        onChange={(e) => setRejectReasonText(e.target.value)}
                        placeholder="Tuliskan alasan penolakan secara jelas..."
                        className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-rose-400"
                        id="web_reject_reason_input"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleRejectAction(splitViewTx.id)}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition"
                          id="web_reject_confirm_btn"
                        >
                          Konfirmasi Tolak
                        </button>
                        <button 
                          onClick={() => setShowRejectForm(false)}
                          className="py-1.5 px-3 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold"
                        >
                          Ubah Pikiran
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {splitViewTx.status === 'Pending' ? (
                        <>
                          <button 
                            disabled={!approveReceiptBase64 || isSubmittingApproval}
                            onClick={() => {
                              if (!approveReceiptBase64) {
                                alert("Harap unggah bukti transfer (Bukti Transfer) terlebih dahulu untuk memproses persetujuan.");
                                return;
                              }
                              handleApproveAction(
                                splitViewTx.id,
                                approveRecipientName,
                                approveBankName,
                                approveBankAccount,
                                approveReceiptBase64
                              );
                            }}
                            className={`flex-1 py-2.5 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                              approveReceiptBase64 && !isSubmittingApproval
                                ? 'bg-brand hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] cursor-pointer' 
                                : 'bg-slate-350 cursor-not-allowed opacity-60'
                            }`}
                            id="web_approve_btn"
                          >
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            {isSubmittingApproval ? "Memproses..." : "Approve & Cairkan Dana"}
                          </button>
                          <button 
                            disabled={isSubmittingApproval}
                            onClick={() => setShowRejectForm(true)}
                            className="py-2.5 px-4 bg-rose-50 text-rose-700 font-extrabold text-xs sm:text-sm rounded-xl hover:bg-rose-100 hover:text-rose-800 transition disabled:opacity-40"
                            id="web_reject_btn"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="w-full text-center text-xs py-2 bg-slate-100 rounded-xl text-slate-500 font-bold block">
                          Tindakan terkunci • Status klaim ini adalah {splitViewTx.status}
                        </div>
                      )}
                    </>
                  )}

                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL JOURNAL ENTRY ENTRY POPUP */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in" style={{ animationDuration: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand">Post Manual Journal Entry</span>
                <h3 className="font-bold text-sm text-slate-850 font-display">Catat Transaksi Manual Buku Kas</h3>
              </div>
              <button 
                onClick={() => setShowManualModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualPost} className="space-y-3 text-xs">
              
              <div>
                <label className="block font-bold text-slate-500 mb-0.5">Tipe Transaksi Pasca</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setManualType('expense_manual')}
                    className={`p-1.5 rounded-lg font-bold text-center transition ${
                      manualType === 'expense_manual' ? 'bg-white text-rose-600 shadow-2xs border border-rose-100' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Pengeluaran Manual
                  </button>

                  <button 
                    type="button"
                    onClick={() => setManualType('income')}
                    className={`p-1.5 rounded-lg font-bold text-center transition ${
                      manualType === 'income' ? 'bg-white text-emerald-600 shadow-2xs border border-emerald-100' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Injeksi Dana / Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-0.5">Deskripsi / Vendor / Klien</label>
                <input 
                  type="text" 
                  value={manualMerchant}
                  onChange={(e) => setManualMerchant(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand outline-none text-slate-800 font-semibold"
                  placeholder="Injeksi Modal Seed Investor / Sewa kantor kuningan..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-0.5">Kategori Rekening</label>
                  <select 
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand outline-none"
                  >
                    <option value="Operasional">Kategori: Operasional</option>
                    <option value="Server">Kategori: Server</option>
                    <option value="Investasi">Kategori: Investasi</option>
                    <option value="Utilitas & Kantor">Kategori: Utilitas & Kantor</option>
                    <option value="Pajak Korporat">Kategori: Pajak Korporat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-0.5">Total Nominal (Rp)</label>
                  <input 
                    type="number" 
                    value={manualAmount || ''}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand outline-none font-mono font-bold"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-0.5">Catatan Rapat / Memo internal</label>
                <textarea 
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand outline-none"
                  placeholder="Tulis rincian peruntukan pembukuan kas ini..."
                />
              </div>

              {/* Upload Bukti Manual Ledger */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-500 mb-0.5">Unggah Bukti Transaksi (Kuitansi / Nota) <span className="text-slate-400 font-normal">(Opsional)</span></label>
                
                {manualReceiptBase64 ? (
                  <div className="border border-indigo-150 bg-indigo-50/20 p-2.5 rounded-2xl flex items-center justify-between shadow-3xs animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 border border-slate-200 rounded-lg bg-white overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-3xs">
                        <img src={manualReceiptBase64} alt="Preview" className="object-contain w-full h-full rounded" />
                      </div>
                      <div className="leading-snug">
                        <span className="font-extrabold text-[11px] text-slate-800 block truncate max-w-[150px]">Bukti_Transaksi.png</span>
                        <span className="text-[9px] text-emerald-600 block font-bold flex items-center gap-0.5 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Berhasil Diunggah
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setManualReceiptBase64('')}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all"
                      title="Hapus Bukti"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingManual(true); }}
                    onDragLeave={() => setIsDraggingManual(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingManual(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleManualFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[80px] ${
                      isDraggingManual 
                        ? 'border-brand bg-indigo-50/40 scale-[0.99]' 
                        : 'border-slate-250 bg-slate-50 hover:bg-slate-100/40 hover:border-slate-300'
                    }`}
                    onClick={() => document.getElementById('manual_receipt_file_input')?.click()}
                  >
                    <input 
                      type="file" 
                      id="manual_receipt_file_input"
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleManualFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <Plus className="w-5 h-5 text-slate-400" />
                    <div className="text-[10px] text-slate-600 font-extrabold leading-tight">
                      Drag & Drop bukti atau <span className="text-indigo-600 font-black underline">Cari File</span>
                    </div>
                    <p className="text-[8px] text-slate-405 font-medium">JPEG, PNG, WEBP (Maks 5MB)</p>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-brand text-white font-semibold rounded-xl"
              >
                Posting Transaksi Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: WEBHOOK INTEGRATIONS SETUP MODAL */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in" style={{ animationDuration: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand">Configure API Integration</span>
                <h3 className="font-bold text-sm text-slate-850 font-display">Webhook Configurator • {showWebhookModal.name}</h3>
              </div>
              <button 
                onClick={() => setShowWebhookModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWebhook} className="space-y-4 text-xs">
              <div className="p-2.5 bg-slate-50 text-[10px] text-slate-500 rounded-xl border border-slate-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <p>Memasukkan endpoint URL di bawah ini akan secara otomatis men-generate **Secret API Key** unik untuk di-paste di source code {showWebhookModal.name}.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Target Endpoint URL (Dashboard Listener)</label>
                <input 
                  type="url" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand outline-none"
                  placeholder="https://api.jagoai.id/webhooks/listener"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Payment Gateway / Escrow Hub</label>
                <select 
                  value={webhookGateway}
                  onChange={(e) => setWebhookGateway(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand outline-none"
                >
                  <option value="Xendit">Xendit Indonesia (Standard Cepat ID)</option>
                  <option value="Midtrans">Midtrans GoTo (Keamanan Terpuji)</option>
                  <option value="Stripe">Stripe International (Multi-valas Billing)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-brand text-white font-semibold rounded-xl hover:bg-opacity-95 transition"
                >
                  Konfigurasi & Generate Key
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowWebhookModal(null)}
                  className="py-2 px-4 bg-slate-100 text-slate-500 font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: LEDGER RECEIPT PREVIEW MODAL */}
      {selectedLedgerReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in" style={{ animationDuration: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand">Bukti Lampiran Transaksi</span>
                <h3 className="font-bold text-sm text-slate-850 font-display">Tampilan Bukti Kas & Lampiran Nota</h3>
              </div>
              <button 
                onClick={() => setSelectedLedgerReceipt(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 relative max-h-[420px] flex items-center justify-center p-3 shadow-2xs">
              <img 
                src={selectedLedgerReceipt} 
                alt="Bukti Lampiran" 
                className="max-h-[380px] object-contain rounded-xl"
              />
            </div>
            
            <div className="mt-4 flex gap-2 text-xs">
              <a 
                href={selectedLedgerReceipt} 
                download="Bukti_Transaksi_Ledger.png"
                className="flex-1 py-2.5 bg-brand text-white font-extrabold rounded-xl text-center hover:opacity-95 transition"
              >
                Unduh Gambar Bukti
              </a>
              <button 
                onClick={() => setSelectedLedgerReceipt(null)}
                className="py-2.5 px-5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
