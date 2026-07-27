import React from 'react';
import { 
  LayoutGrid, CreditCard, Cpu, Users, ShieldAlert, TrendingUp, BookOpen, MessageSquare, Menu, Sparkles, Building2
} from 'lucide-react';
import { Transaction } from '../types';
import { motion } from 'motion/react';

interface WebSidebarProps {
  userRole: 'super_admin' | 'admin_corp';
  activeTab: string;
  setActiveTab: (tab: any) => void;
  pendingApprovals: Transaction[];
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
}

export default function WebSidebar({
  userRole,
  activeTab,
  setActiveTab,
  pendingApprovals,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}: WebSidebarProps) {
  return (
    <aside className={`${isSidebarCollapsed ? 'w-[5.5rem]' : 'w-72'} m-4 h-[calc(100vh-2rem)] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-between select-none shrink-0 z-50 transition-all duration-300 relative overflow-hidden border border-slate-100/50`}>
      
      {/* Logo Brand Header Block */}
      <div className={`p-6 pb-6 flex items-center ${isSidebarCollapsed ? 'flex-col gap-4 justify-center px-0' : 'justify-between'} transition-all`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="p-2.5 bg-blue-950 text-white rounded-2xl flex items-center justify-center shadow-lg w-12 h-12 shadow-blue-950/20 shrink-0 mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Sparkles className="w-6 h-6 shrink-0 relative z-10" />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300 whitespace-nowrap">
              <span className="font-black font-display text-blue-950 text-xl tracking-tight block leading-none mt-1">JagoFinance</span>
            </div>
          )}
        </div>
        
        {/* Toggle Button Inline */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 shadow-sm transition-all shrink-0 z-50`}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Items list */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {userRole === 'super_admin' ? (
          <>
            <div className={`pb-2 pt-2 transition-all ${isSidebarCollapsed ? 'text-center' : 'px-2'}`}>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase truncate">
                {isSidebarCollapsed ? 'SA' : 'Super Admin'}
              </p>
            </div>
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Sistem Global' },
              { id: 'subscriptions', icon: CreditCard, label: 'Langganan SaaS' },
              { id: 'integrations', icon: Cpu, label: 'Integrasi Sistem' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <motion.div layoutId="websidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap relative z-10">{item.label}</span>}
              </button>
            ))}

            <div className={`pb-2 pt-6 mt-2 transition-all ${isSidebarCollapsed ? 'text-center' : 'px-2'}`}>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase truncate">
                {isSidebarCollapsed ? 'MP' : 'Manajemen'}
              </p>
            </div>

            {[
              { id: 'companies', icon: Building2, label: 'Perusahaan' },
              { id: 'admin_corp', icon: Users, label: 'Admin Perusahaan' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <motion.div layoutId="websidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap relative z-10">{item.label}</span>}
              </button>
            ))}

            <button 
              onClick={() => setActiveTab('approvals')}
              className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden mt-2 ${isSidebarCollapsed ? 'justify-center' : ''} ${
                activeTab === 'approvals' ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title={isSidebarCollapsed ? 'Klaim Seluruh Perusahaan' : undefined}
            >
              {activeTab === 'approvals' && <motion.div layoutId="websidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
              <div className="relative shrink-0 z-10">
                <ShieldAlert className={`w-5 h-5 ${activeTab === 'approvals' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {isSidebarCollapsed && pendingApprovals.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {pendingApprovals.length}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden relative z-10">
                  <span className="whitespace-nowrap truncate mr-2">Persetujuan Klaim</span>
                  {pendingApprovals.length > 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${activeTab === 'approvals' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                      {pendingApprovals.length}
                    </span>
                  )}
                </div>
              )}
            </button>

            {[
              { id: 'inbound', icon: TrendingUp, label: 'Uang Masuk' },
              { id: 'ledger', icon: BookOpen, label: 'Buku Kas' },
              { id: 'employees', icon: Users, label: 'Karyawan' },
              { id: 'payroll', icon: CreditCard, label: 'Payroll Massal' },
              { id: 'broadcast', icon: MessageSquare, label: 'Pengumuman' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <motion.div layoutId="websidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap truncate relative z-10">{item.label}</span>}
              </button>
            ))}
          </>
        ) : (
          <>
            <div className={`pb-2 pt-2 transition-all ${isSidebarCollapsed ? 'text-center' : 'px-2'}`}>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase truncate">
                {isSidebarCollapsed ? 'OP' : 'Operasional'}
              </p>
            </div>
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Dashboard Utama' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <motion.div layoutId="websidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap relative z-10">{item.label}</span>}
              </button>
            ))}

            <button 
              onClick={() => setActiveTab('approvals')}
              className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden mt-2 ${isSidebarCollapsed ? 'justify-center' : ''} ${
                activeTab === 'approvals' ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title={isSidebarCollapsed ? 'Persetujuan Klaim' : undefined}
            >
              {activeTab === 'approvals' && <motion.div layoutId="websidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
              <div className="relative shrink-0 z-10">
                <ShieldAlert className={`w-5 h-5 ${activeTab === 'approvals' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {isSidebarCollapsed && pendingApprovals.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {pendingApprovals.length}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden relative z-10">
                  <span className="whitespace-nowrap truncate mr-2">Persetujuan Klaim</span>
                  {pendingApprovals.length > 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${activeTab === 'approvals' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                      {pendingApprovals.length}
                    </span>
                  )}
                </div>
              )}
            </button>

            {[
              { id: 'inbound', icon: TrendingUp, label: 'Uang Masuk' },
              { id: 'ledger', icon: BookOpen, label: 'Buku Kas' },
              { id: 'employees', icon: Users, label: 'Kelola Karyawan' },
              { id: 'payroll', icon: CreditCard, label: 'Payroll Massal' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all group overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <motion.div layoutId="websidebar-active" className="absolute inset-0 bg-blue-950 rounded-2xl z-0" />}
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap truncate relative z-10">{item.label}</span>}
              </button>
            ))}
          </>
        )}
      </nav>

    </aside>
  );
}
