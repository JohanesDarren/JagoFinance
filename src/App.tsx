/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Laptop, Smartphone, RefreshCw, Sparkles, HelpCircle, 
  ArrowRight, ShieldCheck, CheckCircle, Info, ChevronRight, BookOpen, ArrowLeft, LogOut
} from 'lucide-react';
import MobileAppSimulator from './components/MobileAppSimulator';
import WebDashboard from './components/WebDashboard';
import LoginPage from './components/LoginPage';
import { Transaction, ConnectedApp, Subscription, Employee } from './types';

export default function App() {
  // portal role selector ('staff' / 'finance' / null)
  const [userRole, setUserRole] = useState<'staff' | 'finance' | null>(null);
  
  
  // Real-time server-synced database states
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Default simulated staff identities for quick demo
  const [staffEmail, setStaffEmail] = useState('afrisyadwiky@gmail.com');

  // Unified walkthrough guide visibility state
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(true);

  // 1. Fetch data from backend on mount
  const fetchFinancialData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await fetch('/api/financial-data');
      if (!response.ok) {
        throw new Error('API server unreachable.');
      }
      const data = await response.json();
      
      setCashBalance(data.cashBalance);
      setTransactions(data.transactions);
      setEmployees(data.employees);
      setConnectedApps(data.connectedApps);
      setSubscriptions(data.subscriptions);
    } catch (error) {
      console.error('Error fetching backend session data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // 2. Action: Approve reimbursement
  const handleApproveReimbursement = async (
    transactionId: string,
    recipientName?: string,
    bankName?: string,
    bankAccount?: string,
    transferReceiptUrl?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/reimburse/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, recipientName, bankName, bankAccount, transferReceiptUrl })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        await fetchFinancialData(true);
        return true;
      } else {
        throw new Error(resData.error || 'Gagal menyetujui reimbursement.');
      }
    } catch (error: any) {
      console.error("Approval error:", error);
      throw error; // Propagate up to show on web dashboard
    }
  };

  // 3. Action: Reject reimbursement
  const handleRejectReimbursement = async (transactionId: string, rejectReason: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/reimburse/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, rejectReason })
      });
      
      if (response.ok) {
        await fetchFinancialData(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 4. Action: Add Manual Book ledger transaction
  const handleManualLedgerEntry = async (formData: any): Promise<any> => {
    try {
      const response = await fetch('/api/ledger/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        await fetchFinancialData(true);
        return { success: true };
      }
      return { success: false, error: resData.error, message: resData.message };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: 'Koneksi gagal', message: err.message };
    }
  };

  // 5. Action: Toggle connected API status
  const handleToggleConnectedApp = async (appId: string) => {
    try {
      const response = await fetch('/api/connected-apps/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId })
      });
      if (response.ok) {
        await fetchFinancialData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Action: Configure webhook
  const handleSaveWebhook = async (appId: string, data: any) => {
    try {
      const response = await fetch('/api/connected-apps/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, ...data })
      });
      if (response.ok) {
        await fetchFinancialData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Action: Run payroll generator mass
  const handlePayrollGenerate = async (division: string): Promise<any> => {
    try {
      const response = await fetch('/api/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ division })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        await fetchFinancialData(true);
        return { success: true, message: resData.message };
      }
      return { success: false, error: resData.error || 'Sistem payroll gagal diproses.' };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: 'Hubungan Mandiri API gagal.' };
    }
  };

  // Callback to refresh from children widgets
  const forceRefresh = () => {
    fetchFinancialData(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {!userRole ? (
        /* Unified Gateway LoginPage */
        <LoginPage onSelectRole={(role) => setUserRole(role)} />
      ) : userRole === 'finance' ? (
        /* Render FULL screen Backoffice Web Dashboard */
        <div className="w-full h-screen overflow-hidden flex flex-col bg-white">
          <WebDashboard 
            transactions={transactions}
            cashBalance={cashBalance}
            employees={employees}
            connectedApps={connectedApps}
            subscriptions={subscriptions}
            onRefreshData={forceRefresh}
            onApprove={handleApproveReimbursement}
            onReject={handleRejectReimbursement}
            onManualLedger={handleManualLedgerEntry}
            onToggleApp={handleToggleConnectedApp}
            onWebhookSave={handleSaveWebhook}
            onPayrollGenerate={handlePayrollGenerate}
            isLoading={isLoading}
            onLogout={() => setUserRole(null)}
          />
        </div>
      ) : (
        /* Render Mobile App inside Simulated iPhone Layout block frame centered full-view */
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 relative">
          
          {/* Elegant Floating Sign Out button */}
          <button
            onClick={() => setUserRole(null)}
            className="absolute top-6 left-6 z-40 flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-100 hover:text-white text-xs font-bold p-3 px-5 rounded-2xl border border-slate-700 shadow-lg backdrop-blur-md transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Kembali ke Pilihan Portal (Logout)</span>
          </button>

          <MobileAppSimulator 
            transactions={transactions}
            cashBalance={cashBalance}
            onRefreshData={forceRefresh}
            staffEmail={staffEmail}
          />

          {/* Simulated identity controls floating helper inside staff view */}
          <div className="absolute bottom-6 right-6 bg-slate-800/90 text-slate-200 p-4 rounded-2xl border border-slate-700 shadow-xl max-w-xs space-y-2 hidden lg:block backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 inline-block text-indigo-400" /> Demo Staff Controller
            </span>
            
            <div className="space-y-1 text-xs">
              <p className="text-[11px] text-slate-400 leading-snug">Ubah identitas email karyawan di bawah ini untuk mensimulasikan login di hp:</p>
              <select 
                value={staffEmail} 
                onChange={(e) => {
                  setStaffEmail(e.target.value);
                  alert(`Demo email beralih ke ${e.target.value}. Silakan Sign In ulang di handphone.`);
                }}
                className="w-full mt-1.5 p-2 bg-slate-900 border border-slate-705 text-white rounded-xl text-[11px] outline-none"
              >
                <option value="afrisyadwiky@gmail.com">Afrisya Dwiky (Operations PM)</option>
                <option value="fitri@jagoai.id">Fitri Astuti (UI/UX Designer)</option>
                <option value="rizky@jagoai.id">Rizky Ramadhan (Senior AI Eng)</option>
              </select>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
