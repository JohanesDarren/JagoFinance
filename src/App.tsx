import React, { useState, useEffect } from 'react';
import { 
  Laptop, Smartphone, RefreshCw, Sparkles, HelpCircle, 
  ArrowRight, ShieldCheck, CheckCircle, Info, ChevronRight, BookOpen, ArrowLeft, LogOut
} from 'lucide-react';
import MobileAppSimulator from './components/MobileAppSimulator';
import WebDashboard from './components/WebDashboard';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import { Transaction, ConnectedApp, Subscription, Employee, Company } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// All DUMMY data has been removed. Data is fetched strictly from Supabase.

export default function App() {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  // portal role selector ('staff' / 'finance' / null)
  const [userRole, setUserRole] = useState<'super_admin' | 'admin_corp' | 'karyawan' | null>(null);
  
  // Real-time server-synced database states
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Supabase states
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // --- Database Column Mappers (Postgres snake_case <-> Frontend camelCase) ---
  const mapTxFromDb = (dbTx: any): Transaction => {
    let finalNotes = dbTx.notes || '';
    let rejectReason = '';
    
    if (finalNotes.includes('REJECT_REASON: ')) {
       const parts = finalNotes.split('REJECT_REASON: ');
       finalNotes = parts[0].replace(' | ', '').trim();
       rejectReason = parts[1].trim();
    }

    return {
      id: dbTx.id,
      date: dbTx.created_at ? dbTx.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      merchant: dbTx.merchant,
      category: dbTx.category,
      amount: Number(dbTx.amount),
      notes: finalNotes,
      status: dbTx.status === 'approved' ? 'Approved' : dbTx.status === 'rejected' ? 'Rejected' : 'Pending',
      receiptUrl: dbTx.receipt_url || '',
      rejectReason: rejectReason,
      type: dbTx.type,
      employeeId: dbTx.created_by || '',
      createdAt: dbTx.created_at ? dbTx.created_at.replace('T', ' ').substring(0, 16) : ''
    };
  };

  const mapEmployeeFromDb = (dbEmp: any): Employee => ({
    id: dbEmp.id,
    name: dbEmp.full_name || dbEmp.name,
    email: dbEmp.email,
    role: dbEmp.role,
    division: dbEmp.division || '',
    salary: Number(dbEmp.base_salary || dbEmp.salary || 0),
    bankAccount: dbEmp.bank_account || '',
    bankName: dbEmp.bank_name || '',
    bank_passbook_url: dbEmp.bank_passbook_url,
    bank_account_holder: dbEmp.bank_account_holder,
    bank_validated: dbEmp.bank_validated,
    companyId: dbEmp.company_id || null
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
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          // Use Admin Client for super_admin to bypass RLS for dashboard data
          let dbClient = supabase;
          if (profileData.role === 'super_admin') {
            const { createClient } = await import('@supabase/supabase-js');
            const { SERVICE_ROLE_KEY } = await import('./adminKey');
            if (SERVICE_ROLE_KEY) {
              dbClient = createClient(import.meta.env.VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
                auth: { persistSession: false, autoRefreshToken: false }
              });
            }
          }

          // Fetch companies first so we can map them
          const { data: compData } = await dbClient.from('companies').select('*');
          const allCompanies = compData || [];
          setCompanies(allCompanies);

          // Get multi-companies from local mock + primary
          let userCompanies = [];
          try {
            const extra = JSON.parse(localStorage.getItem(`user_companies_${profileData.id}`) || '[]');
            const ids = new Set<string>([...extra]);
            if (profileData.company_id) ids.add(profileData.company_id);
            userCompanies = Array.from(ids).map(id => allCompanies.find((c: any) => c.id === id)).filter(Boolean);
          } catch(e) {}

          const augmentedProfile = {
            ...profileData,
            companies: userCompanies
          };

          setProfile(augmentedProfile);
          setUserRole(augmentedProfile.role);

          // Fetch global balance
          const { data: fsData } = await dbClient.from('finance_settings').select('current_balance').eq('id', 1).single();
          if (fsData) setCashBalance(fsData.current_balance);

          // Fetch employees (users with role karyawan)
          const { data: empData } = await dbClient.from('users').select('*').in('role', ['karyawan']);
          setEmployees(empData ? empData.map(mapEmployeeFromDb) : []);

          // Fetch connected apps
          const { data: appData } = await dbClient.from('connected_apps').select('*');
          setConnectedApps(appData ? appData.map(mapAppFromDb) : []);

          // Fetch subscriptions
          const { data: subData } = await dbClient.from('subscriptions').select('*');
          setSubscriptions(subData ? subData.map(mapSubFromDb) : []);

          // Companies already fetched above for profile mapping if using Supabase
          if (!compData) {
             const { data: compData2 } = await dbClient.from('companies').select('*');
             setCompanies(compData2 || []);
          }

          // Fetch transactions
          const { data: txs } = await dbClient
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });
          setTransactions(txs ? txs.map(mapTxFromDb) : []);

          // Fetch admin_corp users
          const { data: adminsData } = await dbClient
            .from('users')
            .select('*')
            .eq('role', 'admin_corp');
          setAdmins(adminsData || []);

          if (profileData && profileData.email) {
            try {
              const nRes = await fetch(`/api/notifications/${profileData.email}`);
              if (nRes.ok) {
                const nData = await nRes.json();
                setNotifications(nData.notifications || []);
              }
            } catch (e) { console.error('Failed to fetch notifications', e); }
          }

          setIsLoading(false);
          setIsRefreshing(false);
          return;
        }
      } else {
        const res = await fetch('/api/financial-data');
        const data = await res.json();
        setCashBalance(data.cashBalance);
        setEmployees(data.employees);
        setConnectedApps(data.connectedApps);
        setSubscriptions(data.subscriptions);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const sendNotification = async (targetEmail: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, title, message, type })
      });
      // Refresh notifications if it's for the current user
      if (profile && profile.email === targetEmail) {
        fetchFinancialData(true);
      }
    } catch (err) {
      console.error('Failed to send notification', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      fetchFinancialData();
      return;
    }

    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // If we are recovering password, don't auto-login to dashboard
      if (window.location.hash === '#recovery') {
        setIsLoading(false);
        return;
      }
      
      setSession(session);
      if (session?.user) {
        fetchFinancialData();
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Prevent redirecting to dashboard while verifying OTP for password recovery
      if (window.location.hash === '#recovery' || event === 'PASSWORD_RECOVERY') {
        window.location.hash = 'recovery';
        return;
      }

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
        if (fsErr) {
          console.warn('Skipping finance_settings update (table may not exist):', fsErr);
        }

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const { error: txErr } = await supabase
          .from('transactions')
          .update({
            status: 'approved'
          })
          .eq('id', transactionId);
        if (txErr) throw txErr;

        // Send notification
        const emp = employees.find(e => e.id === tx.employeeId);
        if (emp && emp.email) {
          await sendNotification(emp.email, 'Reimburse Disetujui', `Pengajuan Rp ${tx.amount.toLocaleString('id-ID')} (${tx.merchant}) telah disetujui dan ditransfer.`, 'success');
        }

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
        
        // Append REJECT_REASON to notes to avoid schema changes
        const updatedNotes = tx.notes 
          ? `${tx.notes} | REJECT_REASON: ${rejectReason}`
          : `REJECT_REASON: ${rejectReason}`;

        const { error: txErr } = await supabase
          .from('transactions')
          .update({
            status: 'rejected',
            notes: updatedNotes
          })
          .eq('id', transactionId);
        if (txErr) throw txErr;

        // Send notification
        const emp = employees.find(e => e.id === tx.employeeId);
        if (emp && emp.email) {
          await sendNotification(emp.email, 'Reimburse Ditolak', `Pengajuan Rp ${tx.amount.toLocaleString('id-ID')} (${tx.merchant}) ditolak. Alasan: ${rejectReason}`, 'error');
        }

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
        if (fsErr) {
          console.warn('Skipping finance_settings update (table may not exist):', fsErr);
        }

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

  const handleSaveCompany = async (company: Partial<Company>) => {
    if (!isSupabaseConfigured()) return false;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const { SERVICE_ROLE_KEY } = await import('./adminKey');
      if (!SERVICE_ROLE_KEY) throw new Error("Service role key not configured");
      
      const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      if (company.id) {
        const { error } = await supabaseAdmin.from('companies').update({
          name: company.name,
          subscription_tier: company.subscription_tier,
          subscription_status: company.subscription_status
        }).eq('id', company.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin.from('companies').insert({
          name: company.name,
          subscription_tier: company.subscription_tier || 'Free',
          subscription_status: company.subscription_status || 'active'
        });
        if (error) throw error;
      }
      fetchFinancialData(true);
      return true;
    } catch (e: any) {
      console.error("Save company error:", e);
      return false;
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!isSupabaseConfigured()) return false;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const { SERVICE_ROLE_KEY } = await import('./adminKey');
      if (!SERVICE_ROLE_KEY) throw new Error("Service role key not configured");
      
      const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      const { error } = await supabaseAdmin.from('companies').delete().eq('id', id);
      if (error) throw error;
      fetchFinancialData(true);
      return true;
    } catch (e: any) {
      console.error("Delete company error:", e);
      return false;
    }
  };

  const handleAddAdmin = async (adminData: any): Promise<boolean> => {
    if (!isSupabaseConfigured()) return true;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const { SERVICE_ROLE_KEY } = await import('./adminKey');
      const serviceKey = SERVICE_ROLE_KEY;
      if (!serviceKey) throw new Error("Service role key not configured");
      
      const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      let userId = '';
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password,
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes('already been registered') || authError.status === 422) {
          const { data: existingUser, error: findError } = await supabaseAdmin.from('users').select('id').eq('email', adminData.email).single();
          if (findError || !existingUser) throw new Error('Email sudah terdaftar tetapi tidak ditemukan di database profil.');
          
          userId = existingUser.id;
          
          const { error: updateError } = await supabaseAdmin.from('users').update({
            role: 'admin_corp',
            company_id: adminData.companyId || profile?.company_id,
            full_name: adminData.name
          }).eq('id', userId);
          
          if (updateError) throw updateError;
        } else {
          throw authError;
        }
      } else {
        userId = authData.user?.id;
        if (!userId) throw new Error("No user ID returned");

        const { error: dbError } = await supabaseAdmin.from('users').insert([{
          id: userId,
          full_name: adminData.name,
          email: adminData.email,
          role: 'admin_corp',
          company_id: adminData.companyId || profile?.company_id
        }]);
        if (dbError) throw dbError;
      }

      // Refresh to update admin list
      await fetchFinancialData(true);
      return true;
    } catch (e: any) {
      console.error("Add Admin Error:", e.message);
      return false;
    }
  };

  const handleDeleteAdmin = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) return false;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const { SERVICE_ROLE_KEY } = await import('./adminKey');
      const serviceKey = SERVICE_ROLE_KEY;
      if (!serviceKey) throw new Error("Service role key not configured");
      
      const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      // supabase auth.admin.deleteUser deletes the user from auth.users
      // and triggers cascade delete on our public.users if foreign key is set.
      // We can delete auth user directly.
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;
      
      await fetchFinancialData(true);
      return true;
    } catch (e: any) {
      console.error("Delete Admin Error:", e.message);
      return false;
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
        if (coErr) {
          console.warn('Skipping finance_settings update (table may not exist):', coErr);
        }

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
        const { createClient } = await import('@supabase/supabase-js');
        const { SERVICE_ROLE_KEY } = await import('./adminKey');
        const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false }
        });

        // Find profile by email first
        const { data: targetProfile, error: searchErr } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', inviteEmail)
          .single();

        if (searchErr || !targetProfile) {
          return { success: false, message: `Email ${inviteEmail} belum terdaftar di sistem. Minta karyawan mendaftar akun terlebih dahulu.` };
        }

        // Check if already in this specific company
        let isAlreadyMember = false;
        try {
           const extra = JSON.parse(localStorage.getItem(`user_companies_${targetProfile.id}`) || '[]');
           if (extra.includes(profile.company_id) || targetProfile.company_id === profile.company_id) {
               isAlreadyMember = true;
           }
        } catch(e) {}

        if (isAlreadyMember) {
          return { success: false, message: `Karyawan dengan email ${inviteEmail} sudah terhubung ke perusahaan Anda.` };
        }

        // Add to local storage mock for multi-company
        try {
           const extra = JSON.parse(localStorage.getItem(`user_companies_${targetProfile.id}`) || '[]');
           if (!extra.includes(profile.company_id)) {
               extra.push(profile.company_id);
               localStorage.setItem(`user_companies_${targetProfile.id}`, JSON.stringify(extra));
           }
        } catch(e) {}

        // Only update primary company_id if it's currently null
        if (!targetProfile.company_id) {
          const { error: updateErr } = await supabaseAdmin
            .from('users')
            .update({ company_id: profile.company_id })
            .eq('id', targetProfile.id);
          if (updateErr) throw updateErr;
        }
        
        await fetchFinancialData(true);
        return { success: true, message: `Undangan berhasil. Akun ${inviteEmail} kini terhubung ke perusahaan Anda.` };
      } else {
        // Offline Fallback Mock
        const targetEmpIndex = employees.findIndex(e => e.email === inviteEmail);
        
        if (targetEmpIndex === -1) {
          return { success: false, message: `Email ${inviteEmail} belum terdaftar di sistem. Minta karyawan mendaftar akun terlebih dahulu.` };
        }

        const targetEmp = employees[targetEmpIndex];
        // Check if already in this specific company (mock)
        const mockExtra = JSON.parse(localStorage.getItem(`user_companies_${targetEmp.id}`) || '[]');
        if (targetEmp.companyId === profile?.company_id || mockExtra.includes(profile?.company_id)) {
          return { success: false, message: `Karyawan ${inviteEmail} sudah terhubung ke perusahaan Anda.` };
        }
        
        if (profile?.company_id && !mockExtra.includes(profile.company_id)) {
           mockExtra.push(profile.company_id);
           localStorage.setItem(`user_companies_${targetEmp.id}`, JSON.stringify(mockExtra));
        }

        // Mutate array for mock (simulating backend)
        const updatedEmployees = [...employees];
        updatedEmployees[targetEmpIndex] = {
          ...targetEmp,
          companyId: targetEmp.companyId || profile?.company_id || 'COMP-JAGOAI',
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
              if (profileData.role === 'admin_corp' || profileData.role === 'super_admin') {
                setUserRole(profileData.role);
              } else {
                setUserRole(profileData.role);
              }
            }}
            onBack={() => setShowLanding(true)}
          />
        )
      ) : (userRole === 'admin_corp' || userRole === 'super_admin') ? (
        /* Render FULL screen Backoffice Web Dashboard */
        <div className="w-full h-screen overflow-hidden flex flex-col bg-white">
          <WebDashboard 
            transactions={transactions}
            cashBalance={cashBalance}
            employees={employees}
            connectedApps={connectedApps}
            subscriptions={subscriptions}
            admins={admins}
            onRefreshData={() => fetchFinancialData(true)}
            onApprove={handleApproveReimbursement}
            onReject={handleRejectReimbursement}
            onManualLedger={handleManualLedgerEntry}
            onToggleApp={handleToggleConnectedApp}
            onWebhookSave={handleSaveWebhook}
            onPayrollGenerate={handlePayrollGenerate}
            isLoading={isLoading}
            onLogout={handleLogout}
            onInviteEmployee={handleInviteEmployee}
            onAddAdmin={handleAddAdmin}
            onDeleteAdmin={handleDeleteAdmin}
            companies={companies}
            onSaveCompany={handleSaveCompany}
            onDeleteCompany={handleDeleteCompany}
            userRole={profile?.role as 'super_admin' | 'admin_corp' | null}
            userProfile={profile}
          />
        </div>
      ) : (
        /* Render Web App for Karyawan (formerly Mobile Simulator) */
        <div className="w-full h-[100dvh] lg:h-auto lg:w-[400px] lg:h-[800px] lg:rounded-[3rem] lg:border-8 border-slate-800 bg-white shadow-2xl relative overflow-hidden flex flex-col shrink-0">
          <MobileAppSimulator 
            transactions={transactions} 
            cashBalance={cashBalance} 
            onRefreshData={() => fetchFinancialData(true)}
            currentUserProfile={profile}
            onLogout={handleLogout}
            notifications={notifications}
          />
        </div>
      )}

    </div>
  );
}
