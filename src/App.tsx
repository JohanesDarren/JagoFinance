import React, { useState, useEffect } from 'react';
import { 
  Laptop, Smartphone, RefreshCw, Sparkles, HelpCircle, 
  ArrowRight, ShieldCheck, CheckCircle, Info, ChevronRight, BookOpen, ArrowLeft, LogOut
} from 'lucide-react';
import MobileAppSimulator from './components/MobileAppSimulator';
import WebDashboard from './components/WebDashboard';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import { Transaction, ConnectedApp, Subscription, Employee, Branch } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const DUMMY_BRANCHES: Branch[] = [
  { id: '1', name: 'Cabang Jakarta Pusat', location: 'Jakarta', managerName: 'Budi Santoso', status: 'active' },
  { id: '2', name: 'Cabang Surabaya', location: 'Surabaya', managerName: 'Siti Aminah', status: 'active' },
  { id: '3', name: 'Cabang Bandung', location: 'Bandung', managerName: 'Agus Salim', status: 'inactive' }
];

const DUMMY_APPS: ConnectedApp[] = [
  { id: '1', name: 'Gojek API', description: 'Integrasi Transportasi & Makanan', status: 'connected', apiKey: 'gjk-123', webhookUrl: 'https://jagoai.com/webhook/gojek', monthlyRevenue: 15000000, paymentGateway: 'Midtrans' },
  { id: '2', name: 'Tokopedia API', description: 'Integrasi E-commerce', status: 'disconnected', apiKey: '', webhookUrl: '', monthlyRevenue: 0, paymentGateway: 'Xendit' },
  { id: '3', name: 'Xero', description: 'Sistem Akuntansi', status: 'connected', apiKey: 'xro-999', webhookUrl: 'https://jagoai.com/webhook/xero', monthlyRevenue: 0, paymentGateway: 'None' }
];

const DUMMY_SUBSCRIPTIONS: Subscription[] = [
  { id: '1', name: 'Google Workspace', cost: 1500000, cycle: 'monthly', nextBilling: '2026-08-01', category: 'Software', status: 'active' },
  { id: '2', name: 'AWS Cloud', cost: 5000000, cycle: 'monthly', nextBilling: '2026-08-05', category: 'Infrastructure', status: 'active' },
  { id: '3', name: 'Canva Pro', cost: 150000, cycle: 'monthly', nextBilling: '2026-07-20', category: 'Design', status: 'active' }
];

const DUMMY_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Budi Santoso', email: 'budi@jagoai.com', role: 'manager', division: 'Jakarta', salary: 15000000, bankAccount: '123456789', bankName: 'BCA' },
  { id: '2', name: 'Siti Aminah', email: 'siti@jagoai.com', role: 'manager', division: 'Surabaya', salary: 12000000, bankAccount: '987654321', bankName: 'Mandiri' },
  { id: '3', name: 'Andi', email: 'andi@jagoai.com', role: 'staff', division: 'Jakarta', salary: 6000000, bankAccount: '1122334455', bankName: 'BNI' }
];

const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: 'TX-001', date: '2026-07-10', merchant: 'Gojek', category: 'Transportasi', amount: 50000, notes: 'Meeting klien', status: 'Approved', receiptUrl: '', type: 'outbound', employeeId: '3' },
  { id: 'TX-002', date: '2026-07-12', merchant: 'AWS', category: 'Infrastructure', amount: 5000000, notes: 'Tagihan bulanan', status: 'Approved', receiptUrl: '', type: 'outbound', employeeId: '1' },
  { id: 'TX-003', date: '2026-07-14', merchant: 'Kopi Kenangan', category: 'Konsumsi', amount: 100000, notes: 'Snack tim', status: 'Pending', receiptUrl: '', type: 'outbound', employeeId: '3' },
  { id: 'TX-004', date: '2026-07-15', merchant: 'Deposit Tokopedia', category: 'Penjualan', amount: 15000000, notes: 'Pendapatan Q3', status: 'Approved', receiptUrl: '', type: 'inbound', employeeId: '2' }
];

const DUMMY_BALANCE = 150000000;

export default function App() {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  // portal role selector ('staff' / 'finance' / null)
  const [userRole, setUserRole] = useState<'staff' | 'finance' | null>(null);
  
  // Real-time server-synced database states
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Supabase states
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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
    employeeId: dbTx.employee_id || ''
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
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          setProfile(profileData);

          // Fetch global finance settings for balance
          const { data: financeData } = await supabase
            .from('finance_settings')
            .select('current_balance')
            .eq('id', 1)
            .single();
          if (financeData && financeData.current_balance > 0) {
            setCashBalance(financeData.current_balance);
          } else {
            setCashBalance(DUMMY_BALANCE);
          }
          
          // Fetch transactions
          const { data: txs } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });
          setTransactions(txs && txs.length > 0 ? txs.map(mapTxFromDb) : DUMMY_TRANSACTIONS);

          // Fetch employees
          const { data: emps } = await supabase
            .from('employees')
            .select('*');
          setEmployees(emps && emps.length > 0 ? emps.map(mapEmployeeFromDb) : DUMMY_EMPLOYEES);

          // Fetch connected apps
          const { data: apps } = await supabase
            .from('connected_apps')
            .select('*');
          setConnectedApps(apps && apps.length > 0 ? apps.map(mapAppFromDb) : DUMMY_APPS);

          // Fetch subscriptions
          const { data: subs } = await supabase
            .from('subscriptions')
            .select('*');
          setSubscriptions(subs && subs.length > 0 ? subs.map(mapSubFromDb) : DUMMY_SUBSCRIPTIONS);

          // Fetch branches
          const { data: brnchs } = await supabase
            .from('branches')
            .select('*');
          
          if (brnchs && brnchs.length > 0) {
            setBranches(brnchs.map((b: any) => ({
              id: b.id,
              name: b.name,
              location: b.location,
              managerName: b.manager_name || b.managerName,
              status: b.status
            })));
          } else {
            setBranches(DUMMY_BRANCHES);
          }

          setIsLoading(false);
          setIsRefreshing(false);
          return;
        }
      } else {
        const response = await fetch('/api/financial-data');
        if (response.ok) {
          const data = await response.json();
          setCashBalance(data.cashBalance || 0);
          setTransactions(data.transactions || []);
          setEmployees(data.employees && data.employees.length > 0 ? data.employees : INITIAL_EMPLOYEES);
          setConnectedApps(data.connectedApps || []);
          setSubscriptions(data.subscriptions || []);
          setBranches(data.branches || []);
        }
      }
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
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real-time listener for postgres transaction table changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    console.log(`Subscribing to real-time changes`);

    const channel = supabase
      .channel(`realtime-changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        async (payload) => {
          console.log('Real-time transaction change received:', payload);
          
          // Re-fetch transactions
          const { data: txs } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });
          if (txs) setTransactions(txs.map(mapTxFromDb));

          // Re-fetch global balance
          const { data: fsData } = await supabase
            .from('finance_settings')
            .select('current_balance')
            .eq('id', 1)
            .single();
          if (fsData) setCashBalance(fsData.current_balance);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
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
      if (isSupabaseConfigured()) {
        const tx = transactions.find(t => t.id === transactionId);
        if (!tx) throw new Error('Transaksi tidak ditemukan.');
        
        if (cashBalance < tx.amount) {
          throw new Error(`Saldo Kas Tidak Cukup: Saldo kas saat ini tidak cukup untuk mencairkan reimburse senilai Rp ${tx.amount.toLocaleString('id-ID')}.`);
        }

        const newBalance = cashBalance - tx.amount;

        const { error: fsErr } = await supabase
          .from('finance_settings')
          .update({ current_balance: newBalance })
          .eq('id', 1);
        if (fsErr) throw fsErr;

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const { error: txErr } = await supabase
          .from('transactions')
          .update({
            status: 'approved'
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
      if (isSupabaseConfigured()) {
        const tx = transactions.find(t => t.id === transactionId);
        if (!tx) throw new Error('Transaksi tidak ditemukan.');
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const { error: txErr } = await supabase
          .from('transactions')
          .update({
            status: 'rejected'
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
      if (isSupabaseConfigured()) {
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

        // Update global balance
        const { error: fsErr } = await supabase
          .from('finance_settings')
          .update({ current_balance: newBalance })
          .eq('id', 1);
        if (fsErr) throw fsErr;

        // Insert transaction
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const { error: txErr } = await supabase
          .from('transactions')
          .insert([{
            merchant,
            category,
            amount: amt,
            notes: notes || '',
            status: 'approved',
            type,
            receipt_url: receiptUrl || '',
            employee_id: profile?.id || null
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
      if (isSupabaseConfigured()) {
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
      if (isSupabaseConfigured()) {
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

  const handleSaveBranch = async (branchData: Partial<Branch>) => {
    try {
      if (isSupabaseConfigured()) {
        const isUpdate = !!branchData.id;
        if (isUpdate) {
          const { error } = await supabase
            .from('branches')
            .update({
              name: branchData.name,
              location: branchData.location,
              manager_name: branchData.managerName,
              status: branchData.status
            })
            .eq('id', branchData.id);
          if (error) {
            console.error("Supabase Error Update Branch:", error);
            // Fallback for if table is not created or snake_case fails
            alert(`Gagal update: ${error.message}`);
            return false;
          }
        } else {
          const { error } = await supabase
            .from('branches')
            .insert([{
              name: branchData.name,
              location: branchData.location,
              manager_name: branchData.managerName,
              status: branchData.status || 'active'
            }]);
          if (error) {
            console.error("Supabase Error Insert Branch:", error);
            alert(`Gagal simpan: ${error.message}`);
            return false;
          }
        }
        await fetchFinancialData(true);
        return true;
      } else {
        const isUpdate = !!branchData.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `/api/branches/${branchData.id}` : '/api/branches';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(branchData)
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

  // 7. Action: Run payroll generator mass
  const handlePayrollGenerate = async (division: string): Promise<any> => {
    try {
      if (isSupabaseConfigured()) {
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

        // Update global balance
        const { error: coErr } = await supabase
          .from('finance_settings')
          .update({ current_balance: newBalance })
          .eq('id', 1);
        if (coErr) throw coErr;

        // Batch insert transactions
        const dateStr = new Date().toISOString().split('T')[0];
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        
        const newTxs = targetEmployees.map(e => ({
          employee_id: e.id,
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

  // 8. Action: Invite Employee (Assign company_id)
  const handleInviteEmployee = async (inviteEmail: string): Promise<{success: boolean, message: string}> => {
    try {
      if (isSupabaseConfigured() && profile) {
        // Find profile by email first
        const { data: targetProfile, error: searchErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', inviteEmail)
          .single();

        if (searchErr || !targetProfile) {
          return { success: false, message: `Email ${inviteEmail} belum terdaftar di sistem. Minta karyawan mendaftar akun terlebih dahulu.` };
        }

        if (targetProfile.company_id) {
          return { success: false, message: `Karyawan dengan email ${inviteEmail} sudah terhubung ke suatu perusahaan.` };
        }

        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ company_id: profile.company_id })
          .eq('id', targetProfile.id);

        if (updateErr) throw updateErr;
        
        await fetchFinancialData(true);
        return { success: true, message: `Undangan berhasil. Akun ${inviteEmail} kini terhubung ke perusahaan Anda.` };
      } else {
        // Offline Fallback Mock
        const targetEmpIndex = employees.findIndex(e => e.email === inviteEmail);
        if (targetEmpIndex === -1) {
          return { success: false, message: `Email ${inviteEmail} belum mendaftar. (Mode Offline Mock)` };
        }

        const targetEmp = employees[targetEmpIndex];
        if (targetEmp.companyId) {
          return { success: false, message: `Karyawan ${inviteEmail} sudah terhubung ke perusahaan lain.` };
        }
        
        // Mutate array for mock (simulating backend)
        const updatedEmployees = [...employees];
        updatedEmployees[targetEmpIndex] = {
          ...targetEmp,
          companyId: profile?.company_id || 'COMP-JAGOAI',
          status: 'active'
        };
        setEmployees(updatedEmployees);

        return { success: true, message: `Undangan simulasi berhasil. Akun ${inviteEmail} kini terhubung!` };
      }
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || 'Gagal mengundang karyawan.' };
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setProfile(null);
    setUserRole(null);
  };

  // Callback to refresh from children widgets
  const forceRefresh = () => {
    fetchFinancialData(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {!userRole ? (
        showLanding ? (
          <LandingPage onLoginClick={() => setShowLanding(false)} />
        ) : (
          /* Unified Gateway LoginPage */
          <LoginPage 
            onSelectRole={(role) => setUserRole(role)}
            onAuthSuccess={(sess, profileData) => {
              setSession(sess);
              setProfile(profileData);
              
              if (profileData.role === 'admin' || profileData.role === 'super_admin') {
                setUserRole('finance');
              } else {
                setUserRole('staff');
              }
            }}
            onBack={() => setShowLanding(true)}
          />
        )
      ) : userRole === 'finance' ? (
        /* Render FULL screen Backoffice Web Dashboard */
        <div className="w-full h-screen overflow-hidden flex flex-col bg-white">
          <WebDashboard 
            transactions={transactions}
            cashBalance={cashBalance}
            employees={employees}
            connectedApps={connectedApps}
            subscriptions={subscriptions}
            branches={branches}
            onRefreshData={() => fetchFinancialData(true)}
            onApprove={handleApproveReimbursement}
            onReject={handleRejectReimbursement}
            onManualLedger={handleManualLedgerEntry}
            onToggleApp={handleToggleConnectedApp}
            onWebhookSave={handleSaveWebhook}
            onPayrollGenerate={handlePayrollGenerate}
            onSaveBranch={handleSaveBranch}
            isLoading={isLoading}
            onLogout={handleLogout}
            onInviteEmployee={handleInviteEmployee}
            userRole={profile?.role as 'super_admin' | 'admin' | null}
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
            currentUserProfile={profile}
            onLogout={handleLogout}
          />
        </div>
      )}

    </div>
  );
}
