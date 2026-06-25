import React, { useState, useEffect } from 'react';
import { 
  Laptop, Smartphone, RefreshCw, Sparkles, HelpCircle, 
  ArrowRight, ShieldCheck, CheckCircle, Info, ChevronRight, BookOpen, ArrowLeft, LogOut
} from 'lucide-react';
import MobileAppSimulator from './components/MobileAppSimulator';
import WebDashboard from './components/WebDashboard';
import LoginPage from './components/LoginPage';
import { Transaction, ConnectedApp, Subscription, Employee } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';

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

  // Supabase states
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  // --- Database Column Mappers (Postgres snake_case <-> Frontend camelCase) ---
  const mapTxFromDb = (dbTx: any): Transaction => ({
    id: dbTx.id,
    date: dbTx.created_at ? dbTx.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    merchant: dbTx.merchant,
    category: dbTx.category,
    amount: Number(dbTx.amount),
    notes: dbTx.notes || '',
    status: dbTx.status === 'approved' ? 'Approved' : dbTx.status === 'rejected' ? 'Rejected' : 'Pending',
    receiptUrl: dbTx.receipt_url || '',
    type: dbTx.type,
    staffName: dbTx.staff_name || '',
    staffEmail: dbTx.staff_email || '',
    rejectReason: dbTx.reject_reason || '',
    timeline: dbTx.timeline || [],
    recipientName: dbTx.recipient_name || '',
    bankName: dbTx.bank_name || '',
    bankAccount: dbTx.bank_account || '',
    transferReceiptUrl: dbTx.transfer_receipt_url || ''
  });

  const mapEmployeeFromDb = (dbEmp: any): Employee => ({
    id: dbEmp.id,
    name: dbEmp.name,
    email: dbEmp.email,
    role: dbEmp.role,
    division: dbEmp.division,
    salary: Number(dbEmp.salary),
    bankAccount: dbEmp.bank_account || '',
    bankName: dbEmp.bank_name || ''
  });

  const mapAppFromDb = (dbApp: any): ConnectedApp => ({
    id: dbApp.id,
    name: dbApp.name,
    description: dbApp.description || '',
    status: dbApp.status,
    apiKey: dbApp.api_key || '',
    webhookUrl: dbApp.webhook_url || '',
    monthlyRevenue: Number(dbApp.monthly_revenue || 0),
    paymentGateway: dbApp.payment_gateway || ''
  });

  const mapSubFromDb = (dbSub: any): Subscription => ({
    id: dbSub.id,
    name: dbSub.name,
    cost: Number(dbSub.cost),
    cycle: dbSub.cycle,
    nextBilling: dbSub.next_billing || '',
    category: dbSub.category,
    status: dbSub.status
  });

  // 1. Fetch data from backend on mount
  const fetchFinancialData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch user profile and company info
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*, companies(*)')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          setProfile(profileData);
          setCompany(profileData.companies);
          setCashBalance(profileData.companies.current_balance);

          const companyId = profileData.company_id;
          
          // Fetch transactions
          const { data: txs } = await supabase
            .from('transactions')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });
          setTransactions(txs ? txs.map(mapTxFromDb) : []);

          // Fetch employees
          const { data: emps } = await supabase
            .from('employees')
            .select('*')
            .eq('company_id', companyId);
          setEmployees(emps ? emps.map(mapEmployeeFromDb) : []);

          // Fetch connected apps
          const { data: apps } = await supabase
            .from('connected_apps')
            .select('*')
            .eq('company_id', companyId);
          setConnectedApps(apps ? apps.map(mapAppFromDb) : []);

          // Fetch subscriptions
          const { data: subs } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('company_id', companyId);
          setSubscriptions(subs ? subs.map(mapSubFromDb) : []);

          setIsLoading(false);
          setIsRefreshing(false);
          return;
        }
      }

      // Fallback sandbox offline mode
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
    if (!isSupabaseConfigured()) {
      fetchFinancialData();
      return;
    }

    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchFinancialData();
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        fetchFinancialData(true);
      } else {
        setProfile(null);
        setCompany(null);
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real-time listener for postgres transaction table changes
  useEffect(() => {
    if (!isSupabaseConfigured() || !company) return;

    const companyId = company.id;
    console.log(`Subscribing to real-time changes for company ${companyId}`);

    const channel = supabase
      .channel(`realtime-changes-${companyId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `company_id=eq.${companyId}` },
        async (payload) => {
          console.log('Real-time transaction change received:', payload);
          
          // Re-fetch transactions
          const { data: txs } = await supabase
            .from('transactions')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });
          if (txs) setTransactions(txs.map(mapTxFromDb));

          // Re-fetch company balance
          const { data: coData } = await supabase
            .from('companies')
            .select('current_balance')
            .eq('id', companyId)
            .single();
          if (coData) setCashBalance(coData.current_balance);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [company]);

  // 2. Action: Approve reimbursement
  const handleApproveReimbursement = async (
    transactionId: string,
    recipientName?: string,
    bankName?: string,
    bankAccount?: string,
    transferReceiptUrl?: string
  ): Promise<boolean> => {
    try {
      if (isSupabaseConfigured() && company) {
        const tx = transactions.find(t => t.id === transactionId);
        if (!tx) throw new Error('Transaksi tidak ditemukan.');
        
        if (cashBalance < tx.amount) {
          throw new Error(`Saldo Kas Tidak Cukup: Saldo kas saat ini tidak cukup untuk mencairkan reimburse senilai Rp ${tx.amount.toLocaleString('id-ID')}.`);
        }

        const newBalance = cashBalance - tx.amount;

        const { error: coErr } = await supabase
          .from('companies')
          .update({ current_balance: newBalance })
          .eq('id', company.id);
        if (coErr) throw coErr;

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const { error: txErr } = await supabase
          .from('transactions')
          .update({
            status: 'approved',
            recipient_name: recipientName || tx.staffName,
            bank_name: bankName || '',
            bank_account: bankAccount || '',
            transfer_receipt_url: transferReceiptUrl || '',
            timeline: [
              { label: 'Diajukan', date: tx.timeline?.[0]?.date || timestamp, done: true },
              { label: 'Sedang di-review', date: tx.timeline?.[1]?.date || timestamp, done: true },
              { label: 'Disetujui', date: timestamp, done: true },
              { label: 'Dana Cair', date: timestamp, done: true }
            ]
          })
          .eq('id', transactionId);
        if (txErr) throw txErr;

        setCashBalance(newBalance);
        await fetchFinancialData(true);
        return true;
      } else {
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
      }
    } catch (error: any) {
      console.error("Approval error:", error);
      throw error;
    }
  };

  // 3. Action: Reject reimbursement
  const handleRejectReimbursement = async (transactionId: string, rejectReason: string): Promise<boolean> => {
    try {
      if (isSupabaseConfigured() && company) {
        const tx = transactions.find(t => t.id === transactionId);
        if (!tx) throw new Error('Transaksi tidak ditemukan.');
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const { error: txErr } = await supabase
          .from('transactions')
          .update({
            status: 'rejected',
            reject_reason: rejectReason,
            timeline: [
              { label: 'Diajukan', date: tx.timeline?.[0]?.date || timestamp, done: true },
              { label: 'Sedang di-review', date: tx.timeline?.[1]?.date || timestamp, done: true },
              { label: 'Ditolak', date: timestamp, done: true },
              { label: 'Dana Cair', date: '--', done: false }
            ]
          })
          .eq('id', transactionId);
        if (txErr) throw txErr;

        await fetchFinancialData(true);
        return true;
      } else {
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
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 4. Action: Add Manual Book ledger transaction
  const handleManualLedgerEntry = async (formData: any): Promise<any> => {
    try {
      if (isSupabaseConfigured() && company) {
        const { merchant, category, amount, notes, type, receiptUrl } = formData;
        const amt = Number(amount);
        let newBalance = cashBalance;

        if (type === 'expense_manual') {
          if (cashBalance < amt) {
            return { 
              success: false, 
              error: 'Saldo Kas Tidak Cukup', 
              message: 'Saldo kas saat ini tidak mencukupi untuk mencatat transaksi pengeluaran manual ini.' 
            };
          }
          newBalance -= amt;
        } else if (type === 'income') {
          newBalance += amt;
        }

        // Update company balance
        const { error: coErr } = await supabase
          .from('companies')
          .update({ current_balance: newBalance })
          .eq('id', company.id);
        if (coErr) throw coErr;

        // Insert transaction
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const { error: txErr } = await supabase
          .from('transactions')
          .insert([{
            company_id: company.id,
            merchant,
            category,
            amount: amt,
            notes: notes || '',
            status: 'approved',
            type,
            receipt_url: receiptUrl || '',
            staff_name: 'CEO Admin',
            staff_email: 'ceo@jagoai.id',
            timeline: [{ label: 'Pencatatan Buku Kas', date: timestamp, done: true }]
          }]);
        if (txErr) throw txErr;

        setCashBalance(newBalance);
        await fetchFinancialData(true);
        return { success: true };
      } else {
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
      }
    } catch (err: any) {
      console.error(err);
      return { success: false, error: 'Koneksi gagal', message: err.message };
    }
  };

  // 5. Action: Toggle connected API status
  const handleToggleConnectedApp = async (appId: string) => {
    try {
      if (isSupabaseConfigured() && company) {
        const app = connectedApps.find(a => a.id === appId);
        if (!app) throw new Error('Aplikasi tidak ditemukan.');
        const newStatus = app.status === 'active' ? 'inactive' : 'active';
        const monthlyRev = newStatus === 'active' ? Math.floor(80000000 + Math.random() * 90000000) : 0;

        const { error } = await supabase
          .from('connected_apps')
          .update({
            status: newStatus,
            monthly_revenue: monthlyRev
          })
          .eq('id', appId);
        if (error) throw error;

        await fetchFinancialData(true);
      } else {
        const response = await fetch('/api/connected-apps/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId })
        });
        if (response.ok) {
          await fetchFinancialData(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Action: Configure webhook
  const handleSaveWebhook = async (appId: string, data: any) => {
    try {
      if (isSupabaseConfigured() && company) {
        const randomApiKey = 'jg_live_' + [...Array(24)].map(() => (Math.random() * 36 | 0).toString(36)).join('');
        const { error } = await supabase
          .from('connected_apps')
          .update({
            webhook_url: data.webhookUrl,
            payment_gateway: data.paymentGateway,
            api_key: randomApiKey,
            status: 'active',
            monthly_revenue: Math.floor(100000000 + Math.random() * 80000000)
          })
          .eq('id', appId);
        if (error) throw error;

        await fetchFinancialData(true);
      } else {
        const response = await fetch('/api/connected-apps/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId, ...data })
        });
        if (response.ok) {
          await fetchFinancialData(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Action: Run payroll generator mass
  const handlePayrollGenerate = async (division: string): Promise<any> => {
    try {
      if (isSupabaseConfigured() && company) {
        const targetEmployees = division === 'Semua' 
          ? employees 
          : employees.filter(e => e.division === division);

        if (targetEmployees.length === 0) {
          return { success: false, error: 'Tidak ada karyawan di divisi terpilih.' };
        }

        let totalDeduct = 0;
        targetEmployees.forEach(e => totalDeduct += e.salary);

        if (cashBalance < totalDeduct) {
          return {
            success: false,
            error: 'Saldo Kas Tidak Cukup',
            message: `Saldo kas (Rp ${cashBalance.toLocaleString('id-ID')}) tidak cukup untuk membayarkan total gaji massal sebesar Rp ${totalDeduct.toLocaleString('id-ID')} untuk ${targetEmployees.length} karyawan.`
          };
        }

        const newBalance = cashBalance - totalDeduct;

        // Update company balance
        const { error: coErr } = await supabase
          .from('companies')
          .update({ current_balance: newBalance })
          .eq('id', company.id);
        if (coErr) throw coErr;

        // Batch insert transactions
        const dateStr = new Date().toISOString().split('T')[0];
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        
        const newTxs = targetEmployees.map(e => ({
          company_id: company.id,
          merchant: `Gaji Bulanan - ${e.name} (${e.division})`,
          category: 'Gaji Karyawan',
          amount: e.salary,
          notes: `Pembayaran Payroll via transfer ke Rekening ${e.bankName} ${e.bankAccount}.`,
          status: 'approved',
          type: 'expense_manual',
          staff_name: 'Finance Lead',
          staff_email: 'finance@jagoai.id',
          timeline: [{ label: 'Payroll Ditransfer', date: timestamp, done: true }]
        }));

        const { error: txErr } = await supabase
          .from('transactions')
          .insert(newTxs);
        if (txErr) throw txErr;

        setCashBalance(newBalance);
        await fetchFinancialData(true);
        return { success: true, message: `Slip Gaji berhasil diterbitkan dan ditransfer untuk ${targetEmployees.length} karyawan.` };
      } else {
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
      }
    } catch (err: any) {
      console.error(err);
      return { success: false, error: 'Hubungan Mandiri API gagal.' };
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setProfile(null);
    setCompany(null);
    setUserRole(null);
  };

  // Callback to refresh from children widgets
  const forceRefresh = () => {
    fetchFinancialData(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {!userRole ? (
        /* Unified Gateway LoginPage */
        <LoginPage 
          onSelectRole={(role) => setUserRole(role)}
          onAuthSuccess={(sess, profileData) => {
            setSession(sess);
            setProfile(profileData);
            setCompany(profileData.companies);
            setCashBalance(profileData.companies.current_balance);
            if (profileData.role === 'admin') {
              setUserRole('finance');
            } else {
              setUserRole('staff');
            }
          }}
        />
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
            onLogout={handleLogout}
            companyName={company?.name}
            subscriptionTier={company?.subscription_tier}
          />
        </div>
      ) : (
        /* Render Mobile App inside Simulated iPhone Layout block frame centered full-view */
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 relative">
          
          {/* Elegant Floating Sign Out button */}
          <button
            onClick={handleLogout}
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
            currentUserProfile={profile}
            onLogout={handleLogout}
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
