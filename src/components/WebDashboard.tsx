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
  LayoutGrid, BookOpen, FileText, MessageSquare, Wallet, Cpu, Settings, GraduationCap, LogOut, Bell, ChevronDown, ChevronLeft, User
} from 'lucide-react';
import { Transaction, ConnectedApp, Subscription, Employee, Company } from '../types';
import WebSidebar from './WebSidebar';
import OverviewScreenAdmin from './web-screens/admin-cabang/OverviewScreen';
import ApprovalsScreen from './web-screens/admin-cabang/ApprovalsScreen';
import InboundScreen from './web-screens/admin-cabang/InboundScreen';
import LedgerScreen from './web-screens/admin-cabang/LedgerScreen';
import PayrollScreen from './web-screens/admin-cabang/PayrollScreen';

import OverviewScreenSuperAdmin from './web-screens/super-admin/OverviewScreen';
import IntegrationsScreen from './web-screens/super-admin/IntegrationsScreen';
import SubscriptionsScreen from './web-screens/super-admin/SubscriptionsScreen';
import BranchAdminManagementScreen from './web-screens/super-admin/BranchAdminManagementScreen';
import BroadcastScreen from './web-screens/super-admin/BroadcastScreen';
import EmployeeManagementScreen from './web-screens/super-admin/EmployeeManagementScreen';
import CompanyManagementScreen from './web-screens/super-admin/CompanyManagementScreen';

import ProfileScreen from './web-screens/shared/ProfileScreen';

interface WebDashboardProps {
  transactions: Transaction[];
  cashBalance: number;
  employees: Employee[];
  connectedApps: ConnectedApp[];
  subscriptions: Subscription[];
  companies?: Company[];
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
  onInviteEmployee?: (email: string) => Promise<{success: boolean, message: string}>;
  userRole?: 'super_admin' | 'admin_corp' | null;
  onAddAdmin?: (adminData: any) => Promise<boolean>;
  onDeleteAdmin?: (id: string) => Promise<boolean>;
  admins?: any[];
  userProfile?: any;
  onSaveCompany?: (company: Partial<Company>) => Promise<boolean>;
  onDeleteCompany?: (id: string) => Promise<boolean>;
}

export default function WebDashboard({
  transactions,
  cashBalance,
  employees,
  connectedApps,
  subscriptions,
  companies,
  onRefreshData,
  onApprove,
  onReject,
  onManualLedger,
  onToggleApp,
  onWebhookSave,
  onPayrollGenerate,
  isLoading,
  onLogout,
  onInviteEmployee,
  userRole = 'admin_corp',
  onAddAdmin,
  onDeleteAdmin,
  admins,
  userProfile,
  onSaveCompany,
  onDeleteCompany
}: WebDashboardProps) {

  // Active Sub-Menu Route within web dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'inbound' | 'integrations' | 'ledger' | 'subscriptions' | 'payroll' | 'employees' | 'profile' | 'companies' | 'broadcast'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
        emp => emp.email.toLowerCase() === splitViewTx.employeeId.toLowerCase() ||
               emp.name.toLowerCase() === (employees.find(e => e.id === splitViewTx.employeeId)?.name || "Unknown").toLowerCase()
      );

      if (splitViewTx.status === 'Approved') {
        // If already approved, show approved details
        setApproveRecipientName((employees.find(e => e.id === splitViewTx.employeeId)?.name || "Unknown"));
        setApproveBankName(splitViewTx.bankName || (matchedEmp ? matchedEmp.bankName : ''));
        setApproveBankAccount(splitViewTx.bankAccount || (matchedEmp ? matchedEmp.bankAccount : ''));
        setApproveReceiptBase64('');
      } else {
        // If pending, load matched employee bank credentials as default, or pre-fill with staffName
        setApproveRecipientName(matchedEmp ? matchedEmp.name : (employees.find(e => e.id === splitViewTx.employeeId)?.name || "Unknown"));
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
      csvContent += `${t.id},${t.date},"${t.merchant}","${t.employeeId}",${t.amount},${t.status}\n`;
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
        if (userRole === 'super_admin') {
          alert('Notifikasi email berhasil dikirim ke karyawan bersangkutan dari sistem pusat.');
        }
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
        <WebSidebar 
          userRole={userRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingApprovals={pendingApprovals}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {/* Content Panel Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          
          {/* Top Header with Profile and Notifications */}
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white p-4 px-6 rounded-[2rem] shadow-sm mb-8 z-20 sticky top-0">
            <div>
              <h1 className="text-xl font-black font-display text-slate-900 tracking-tight capitalize">
                {activeTab === 'overview' ? 'Dashboard Utama' :
                 activeTab === 'approvals' ? 'Persetujuan Klaim' :
                 activeTab === 'inbound' ? 'Arus Uang Masuk' :
                 activeTab === 'ledger' ? 'Buku Kas' :
                 activeTab === 'subscriptions' ? 'Langganan SaaS' :
                 activeTab === 'integrations' ? 'Integrasi Sistem' :
                 activeTab === 'employees' ? 'Kelola Karyawan' :
                 activeTab === 'payroll' ? 'Manajemen Gaji' :
                 activeTab === 'profile' ? 'Profil Akun' : activeTab}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Profile Dropdown Trigger */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="block text-xs font-black text-slate-800 leading-tight truncate max-w-[100px]">{userProfile?.full_name || 'Admin'}</span>
                    <span className="block text-[10px] text-indigo-600 font-bold tracking-widest uppercase mt-0.5">{userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin_corp' ? 'Admin' : 'Karyawan'}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">Profil Akun</span>
                    </button>
                    <div className="h-px w-full bg-slate-100"></div>
                    <button 
                      onClick={() => { setShowProfileMenu(false); if(onLogout) onLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-bold text-rose-600">Keluar Sistem</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

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
              {/* === SUPER ADMIN SCREENS === */}
              {userRole === 'super_admin' && activeTab === 'overview' && (
                <OverviewScreenSuperAdmin {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals, admins
                }} />
              )}
              {userRole === 'super_admin' && activeTab === 'subscriptions' && (
                <SubscriptionsScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {userRole === 'super_admin' && activeTab === 'integrations' && (
                <IntegrationsScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}


              {userRole === 'super_admin' && activeTab === 'admin_corp' && (
                <BranchAdminManagementScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals,
                  onAddAdmin, onDeleteAdmin, admins, companies
                }} />
              )}
              {userRole === 'super_admin' && activeTab === 'companies' && (
                <CompanyManagementScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals,
                  companies, onSaveCompany, onDeleteCompany
                }} />
              )}
              {userRole === 'super_admin' && activeTab === 'employees' && (
                <EmployeeManagementScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals,
                  companies, onSaveCompany, onDeleteCompany
                }} />
              )}
              {userRole === 'super_admin' && activeTab === 'broadcast' && (
                <BroadcastScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}

              {/* === ADMIN CABANG SCREENS === */}
              {userRole !== 'super_admin' && activeTab === 'overview' && (
                <OverviewScreenAdmin {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {activeTab === 'approvals' && (
                <ApprovalsScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {activeTab === 'inbound' && (
                <InboundScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {activeTab === 'ledger' && (
                <LedgerScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {activeTab === 'payroll' && (
                <PayrollScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}

              {/* === SHARED SCREENS === */}
              {activeTab === 'profile' && (
                <ProfileScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals, userProfile, companies
                }} />
              )}
            </>
          )}
        </main>
      </div>
{/* MODAL 1: B-3.2 Persetujuan Split-View Modal */}
      {splitViewTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white/90 backdrop-blur-2xl w-full max-w-5xl h-[720px] max-h-[92vh] rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95" style={{ animationDuration: '0.3s' }}>
            
            {/* Split Modal Head */}
            <div className="px-8 py-5 border-b border-slate-200/50 flex justify-between items-center bg-white/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center border border-indigo-100 text-brand shadow-inner shadow-indigo-100/50">
                  <ShieldAlert className="w-6 h-6" strokeWidth="2.5" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand/80 block mb-0.5">Persetujuan Reimburse AI</span>
                  <h3 className="font-black text-xl text-slate-900 font-display tracking-tight leading-none">Split-View Audit <span className="text-slate-400 font-mono text-lg font-bold ml-1">#{splitViewTx.id}</span></h3>
                </div>
              </div>
              <button 
                onClick={() => setSplitViewTx(null)}
                className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 rounded-full flex items-center justify-center transition-all shadow-sm relative z-10 hover:rotate-90"
              >
                <X className="w-5 h-5" strokeWidth="2.5" />
              </button>
            </div>

            {/* Split body: 2 segments */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Receipt image zoomed */}
              <div className="w-1/2 bg-slate-50/50 border-r border-slate-200/50 p-6 flex flex-col justify-between overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dokumen Struk Fisik</span>
                  <span className="text-[10px] bg-white border border-slate-200 shadow-sm text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-wider">Auto-Scanned</span>
                </div>
                
                <div className="flex-1 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 relative p-3 group flex items-center justify-center">
                  {splitViewTx.receiptUrl ? (
                    <img 
                      src={splitViewTx.receiptUrl} 
                      alt="Review receipt document" 
                      className="w-full h-full object-contain rounded-[1.5rem] group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                        <XCircle className="w-8 h-8 text-slate-300" strokeWidth="2" />
                      </div>
                      <span className="text-xs font-black text-slate-500">Struk tidak tersedia</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Extraction Results verification */}
              <div className="w-1/2 p-8 flex flex-col overflow-y-auto space-y-6 bg-white/40">
                
                <div className="space-y-5">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-brand/5 rounded-2xl border border-indigo-100/50 flex items-start gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-[0.85rem] bg-white text-brand flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                      <Info className="w-4 h-4" strokeWidth="2.5" />
                    </div>
                    <div className="text-xs text-indigo-900/80 leading-relaxed pt-0.5">
                      <span className="font-black block text-indigo-950 mb-0.5 text-[13px]">Status Scan Hermes AI</span>
                      Kategori dan pengeluaran berhasil divalidasi keabsahannya tanpa selisih pajak.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 relative group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Merek Toko / Supplier</label>
                      <div className="font-black text-slate-800 text-sm bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm transition-colors group-hover:border-indigo-200">{splitViewTx.merchant}</div>
                    </div>

                    <div className="relative group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Tanggal Transaksi</label>
                      <div className="font-bold text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-200 font-mono text-sm shadow-sm transition-colors group-hover:border-indigo-200">{splitViewTx.date}</div>
                    </div>
                    
                    <div className="relative group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Kategori</label>
                      <div className="font-bold text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-sm truncate transition-colors group-hover:border-indigo-200">{splitViewTx.category}</div>
                    </div>

                    <div className="col-span-2 relative">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Nominal Pengajuan (IDR)</label>
                      <div className="font-black text-brand font-mono text-2xl bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 shadow-inner flex items-center justify-between">
                        <span>Rp</span>
                        <span>{splitViewTx.amount.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {splitViewTx.notes && (
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Catatan Pengaju</label>
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 italic leading-relaxed">"{splitViewTx.notes}"</div>
                      </div>
                    )}
                  </div>
                  {/* Rincian Rekening Penerima & Bukti Transfer Section */}
                  <div className="border-t border-slate-200/60 pt-6 space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Wallet className="w-3 h-3 text-slate-600" />
                      </div>
                      Transfer & Pencairan
                    </h4>
                    
                    {splitViewTx.status === 'Approved' ? (
                      <div className="space-y-4 text-xs">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Nama Penerima</span>
                            <span className="font-black text-slate-900 text-sm">{(employees.find(e => e.id === splitViewTx.employeeId)?.name || "Unknown")}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Bank</span>
                            <span className="font-bold text-slate-800">{splitViewTx.bankName || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Nomor Rekening</span>
                            <span className="font-bold text-slate-800 font-mono text-sm">{splitViewTx.bankAccount || '-'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-2">Bukti Transfer Resmi</span>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-slate-500 font-medium text-xs">
                            Klaim ini telah disetujui dan dicairkan.
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Inputs for Pending status
                      <div className="space-y-5 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 relative group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Penerima Dana</label>
                            <div className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 shadow-sm truncate">
                              {approveRecipientName || '-'}
                            </div>
                          </div>
                          <div className="relative group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Nama Bank</label>
                            <div className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 shadow-sm truncate">
                              {approveBankName || '-'}
                            </div>
                          </div>
                          <div className="relative group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">No. Rekening</label>
                            <div className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 font-mono shadow-sm truncate">
                              {approveBankAccount || '-'}
                            </div>
                          </div>
                        </div>

                        {/* Upload Bukti Transfer Widget */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between ml-1">
                            <span>Unggah Bukti Transfer</span>
                            <span className="text-[9px] text-rose-500 font-bold bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">*Wajib</span>
                          </label>
                          
                          {approveReceiptBase64 ? (
                            <div className="border border-brand bg-indigo-50/50 p-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-sm border border-indigo-100">
                                  <img src={approveReceiptBase64} alt="Preview transfer" className="object-cover w-full h-full rounded-lg" />
                                </div>
                                <div>
                                  <span className="font-black text-xs text-slate-900 block truncate max-w-[150px]">Bukti_Transfer_Reimburse.png</span>
                                  <span className="text-[10px] text-emerald-600 block font-black flex items-center gap-1 mt-0.5">
                                    <CheckCircle className="w-3.5 h-3.5" /> Berhasil Diunggah
                                  </span>
                                </div>
                              </div>
                              <button 
                                onClick={() => setApproveReceiptBase64('')}
                                className="w-9 h-9 rounded-full bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all shadow-sm border border-slate-200 hover:border-rose-200"
                                title="Hapus File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={`border-2 border-dashed rounded-[1.5rem] p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group ${
                                isDragging 
                                  ? 'border-brand bg-indigo-50/50 scale-[0.99]' 
                                  : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-brand shadow-sm'
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
                              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:shadow-inner text-slate-400 group-hover:text-brand flex items-center justify-center transition-all shadow-sm">
                                <Plus className="w-6 h-6" />
                              </div>
                              <div className="text-xs text-slate-600 font-bold mt-1 leading-snug">
                                Drag & Drop bukti transfer atau <span className="text-brand block mt-0.5">Cari File dari Perangkat</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning warning: safe balance deduction preview */}
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <div className="bg-amber-50 p-4 rounded-[1.25rem] border border-amber-200 text-xs mb-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5" strokeWidth="2.5" />
                      </div>
                      <span className="font-bold text-amber-900">Sisa Kas Cabang Setelah Pencairan</span>
                    </div>
                    <span className="font-black font-mono text-amber-900 text-[13px] bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
                      Rp {(cashBalance - splitViewTx.amount).toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Actions area inside modal */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    
                    {showRejectForm ? (
                      <div className="w-full bg-rose-50/50 p-4 rounded-2xl border border-rose-200 animate-in slide-in-from-bottom-2">
                        <label className="text-[10px] font-black text-rose-800 uppercase tracking-widest block mb-2 ml-1">Alasan Penolakan</label>
                        <input 
                          type="text" 
                          required
                          value={rejectReasonText}
                          onChange={(e) => setRejectReasonText(e.target.value)}
                          placeholder="Jelaskan alasan klaim ini ditolak..."
                          className="w-full p-3.5 text-sm bg-white border border-rose-200 rounded-[1.25rem] outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 font-medium mb-3 shadow-sm text-slate-800"
                          id="web_reject_reason_input"
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRejectAction(splitViewTx.id)}
                            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-rose-600/20"
                            id="web_reject_confirm_btn"
                          >
                            Konfirmasi Tolak
                          </button>
                          <button 
                            onClick={() => setShowRejectForm(false)}
                            className="py-3 px-5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl text-xs font-black transition-colors shadow-sm"
                          >
                            Batal
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
                                  alert("Harap unggah bukti transfer terlebih dahulu untuk memproses persetujuan.");
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
                              className={`flex-1 py-3.5 text-white font-black text-sm rounded-[1.25rem] shadow-sm transition-all flex items-center justify-center gap-2 group ${
                                approveReceiptBase64 && !isSubmittingApproval
                                  ? 'bg-gradient-to-r from-brand to-indigo-600 hover:shadow-lg hover:shadow-indigo-600/20 hover:-translate-y-0.5 cursor-pointer' 
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              }`}
                              id="web_approve_btn"
                            >
                              <CheckCircle className="w-5 h-5 shrink-0" strokeWidth="2.5" />
                              {isSubmittingApproval ? "Memproses..." : "Approve & Cairkan"}
                            </button>
                            <button 
                              disabled={isSubmittingApproval}
                              onClick={() => setShowRejectForm(true)}
                              className="py-3.5 px-6 bg-white border-2 border-slate-200 text-slate-500 font-black text-sm rounded-[1.25rem] hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all disabled:opacity-40"
                              id="web_reject_btn"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="w-full text-center text-sm py-4 bg-slate-50 rounded-2xl text-slate-500 font-black border border-slate-200">
                            Status Klaim: {splitViewTx.status}
                          </div>
                        )}
                      </>
                    )}
                  </div>
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
                    value={manualAmount }
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
                <h3 className="font-bold text-sm text-slate-850 font-display">Webhook Configurator ΓÇó {showWebhookModal.name}</h3>
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

