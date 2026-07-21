import React from 'react';
import { Transaction, ConnectedApp, Subscription, Employee, Company } from '../../../types';

export interface WebScreenProps {
  transactions: Transaction[];
  cashBalance: number;
  employees: Employee[];
  connectedApps: ConnectedApp[];
  subscriptions: Subscription[];
  companies?: Company[];
  admins?: any[];
  userProfile?: any;
  userRole?: string;
  onSaveCompany?: (company: Partial<Company>) => Promise<boolean>;
  onDeleteCompany?: (id: string) => Promise<boolean>;
  onRefreshData: () => void;
  onApprove: (id: string, recipientName?: string, bankName?: string, bankAccount?: string, transferReceiptUrl?: string) => Promise<boolean>;
  onReject: (id: string, reason: string) => Promise<boolean>;
  onManualLedger: (formData: any) => Promise<any>;
  onToggleApp: (id: string) => Promise<void>;
  onWebhookSave: (id: string, data: any) => Promise<void>;
  onPayrollGenerate: (division: string) => Promise<any>;
  isLoading: boolean;
  onLogout?: () => void;
  onInviteEmployee?: (email: string) => Promise<{success: boolean, message: string}>;

  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  
  splitViewTx: Transaction | null;
  setSplitViewTx: (tx: Transaction | null) => void;
  setActiveTab?: (tab: any) => void;
  
  rejectReasonText: string;
  setRejectReasonText: (val: string) => void;
  showRejectForm: boolean;
  setShowRejectForm: (val: boolean) => void;
  
  showManualModal: boolean;
  setShowManualModal: (val: boolean) => void;
  
  showWebhookModal: ConnectedApp | null;
  setShowWebhookModal: (app: ConnectedApp | null) => void;
  
  selectedLedgerReceipt: string | null;
  setSelectedLedgerReceipt: (val: string | null) => void;
  
  approveRecipientName: string;
  setApproveRecipientName: (val: string) => void;
  approveBankName: string;
  setApproveBankName: (val: string) => void;
  approveBankAccount: string;
  setApproveBankAccount: (val: string) => void;
  approveReceiptBase64: string;
  setApproveReceiptBase64: (val: string) => void;
  
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  
  webhookUrl: string;
  setWebhookUrl: (val: string) => void;
  webhookGateway: string;
  setWebhookGateway: (val: string) => void;
  
  manualMerchant: string;
  setManualMerchant: (val: string) => void;
  manualCategory: string;
  setManualCategory: (val: string) => void;
  manualType: 'income' | 'expense_manual';
  setManualType: (val: 'income' | 'expense_manual') => void;
  manualAmount: number;
  setManualAmount: (val: number) => void;
  manualNotes: string;
  setManualNotes: (val: string) => void;
  manualReceiptBase64: string;
  setManualReceiptBase64: (val: string) => void;
  isDraggingManual: boolean;
  setIsDraggingManual: (val: boolean) => void;
  
  payrollDivision: string;
  setPayrollDivision: (val: string) => void;
  payrollMessage: { type: 'success' | 'error'; text: string } | null;
  setPayrollMessage: (val: { type: 'success' | 'error'; text: string } | null) => void;
  
  errorMessage: { name: string; text: string } | null;
  setErrorMessage: (val: { name: string; text: string } | null) => void;
  
  totalInflowThisMonth: number;
  totalOutflowThisMonth: number;
  averageMonthlyBurn: number;
  runwayMonths: number;
  categorySummary: { [key: string]: number };
  categoryEntries: [string, number][];
  totalExpenseAllocated: number;
  
  handleExportCSV: () => void;
  isSubmittingApproval: boolean;
  handleApproveAction: (id: string, recipientName?: string, bankName?: string, bankAccount?: string, transferReceiptUrl?: string) => Promise<void>;
  handleRejectAction: (id: string) => Promise<void>;
  handleManualPost: (e: React.FormEvent) => Promise<void>;
  handleSaveWebhook: (e: React.FormEvent) => Promise<void>;
  handleMassPayroll: () => Promise<void>;
  openWebhookSetup: (app: ConnectedApp) => void;
  pendingApprovals: Transaction[];
}
