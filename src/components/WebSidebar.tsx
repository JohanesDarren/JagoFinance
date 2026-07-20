import React from 'react';
import { 
  LayoutGrid, CreditCard, Cpu, Users, ShieldAlert, TrendingUp, BookOpen, MessageSquare, ChevronLeft, Sparkles 
} from 'lucide-react';
import { Transaction } from '../types';

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
    <aside className={`${isSidebarCollapsed ? 'w-[5.5rem]' : 'w-80'} bg-white flex flex-col justify-between border-r border-slate-150 select-none shrink-0 z-50 transition-all duration-300 relative`}>
      
      {/* Logo Brand Header Block */}
      <div className={`p-6 pb-7 border-b border-slate-100 flex items-center ${isSidebarCollapsed ? 'flex-col gap-4 justify-center px-0' : 'justify-between'} transition-all`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} w-full`}>
          <div className="p-2.5 bg-[#0000a0]/95 text-white rounded-2xl flex items-center justify-center shadow-lg w-12 h-12 shadow-[#0000a0]/20 shrink-0 mx-auto">
            <Sparkles className="w-7 h-7 shrink-0" />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300 whitespace-nowrap flex-1">
              <span className="font-black text-[#050630] text-lg lg:text-xl tracking-tight block leading-none mt-1">JagoFinance</span>
            </div>
          )}
        </div>
        
        {/* Toggle Button explicitly inside sidebar flow */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 shadow-sm transition-transform shrink-0"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Items list */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {userRole === 'super_admin' ? (
          <>
            <div className={`pb-2 pt-4 transition-all ${isSidebarCollapsed ? 'text-center' : 'px-4'}`}>
              <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase truncate">
                {isSidebarCollapsed ? 'SA' : 'Super Admin Portal'}
              </p>
            </div>
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Sistem Global', color: 'text-[#3a00ff]', activeBg: 'bg-[#3a00ff]' },
              { id: 'subscriptions', icon: CreditCard, label: 'Langganan SaaS', color: 'text-[#1800ad]', activeBg: 'bg-purple-500' },
              { id: 'integrations', icon: Cpu, label: 'Integrasi Sistem', color: 'text-[#1800ad]', activeBg: 'bg-slate-800' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <div className={`absolute left-0 top-0 bottom-0 w-[4.5px] ${item.activeBg}`} />}
                <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? item.color : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}

            <div className={`pb-2 pt-4 border-t border-slate-100 mt-2 transition-all ${isSidebarCollapsed ? 'text-center' : 'px-4'}`}>
              <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase truncate">
                {isSidebarCollapsed ? 'MP' : 'Manajemen Perusahaan'}
              </p>
            </div>

            {[
              { id: 'companies', icon: LayoutGrid, label: 'Kelola Perusahaan', color: 'text-[#1800ad]', activeBg: 'bg-emerald-500' },
              { id: 'admin_corp', icon: Users, label: 'Kelola Admin Perusahaan', color: 'text-[#1800ad]', activeBg: 'bg-indigo-500' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <div className={`absolute left-0 top-0 bottom-0 w-[4.5px] ${item.activeBg}`} />}
                <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? item.color : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}

            <button 
              onClick={() => setActiveTab('approvals')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${isSidebarCollapsed ? 'justify-center' : ''} ${
                activeTab === 'approvals' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
              }`}
              title={isSidebarCollapsed ? 'Klaim Seluruh Perusahaan' : undefined}
            >
              {activeTab === 'approvals' && <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-rose-500" />}
              <div className="relative shrink-0">
                <ShieldAlert className={`w-5 h-5 ${activeTab === 'approvals' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                {isSidebarCollapsed && pendingApprovals.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingApprovals.length}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="whitespace-nowrap truncate mr-2">Klaim Seluruh Perusahaan</span>
                  {pendingApprovals.length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shrink-0">
                      {pendingApprovals.length}
                    </span>
                  )}
                </div>
              )}
            </button>

            {[
              { id: 'inbound', icon: TrendingUp, label: 'Uang Masuk (All)', color: 'text-[#1800ad]', activeBg: 'bg-emerald-500' },
              { id: 'ledger', icon: BookOpen, label: 'Buku Kas Perusahaan', color: 'text-[#1800ad]', activeBg: 'bg-indigo-500' },
              { id: 'employees', icon: Users, label: 'Kelola Karyawan', color: 'text-[#1800ad]', activeBg: 'bg-blue-500' },
              { id: 'payroll', icon: BookOpen, label: 'Payroll Massal', color: 'text-[#1800ad]', activeBg: 'bg-amber-500' },
              { id: 'broadcast', icon: MessageSquare, label: 'Broadcast Pengumuman', color: 'text-[#1800ad]', activeBg: 'bg-sky-500' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <div className={`absolute left-0 top-0 bottom-0 w-[4.5px] ${item.activeBg}`} />}
                <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? item.color : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
              </button>
            ))}
          </>
        ) : (
          <>
            <div className={`pb-2 pt-4 transition-all ${isSidebarCollapsed ? 'text-center' : 'px-4'}`}>
              <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase truncate">
                {isSidebarCollapsed ? 'OP' : 'Operasional Perusahaan'}
              </p>
            </div>
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Dashboard Perusahaan', color: 'text-[#3a00ff]', activeBg: 'bg-[#3a00ff]' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <div className={`absolute left-0 top-0 bottom-0 w-[4.5px] ${item.activeBg}`} />}
                <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? item.color : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}

            <button 
              onClick={() => setActiveTab('approvals')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${isSidebarCollapsed ? 'justify-center' : ''} ${
                activeTab === 'approvals' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
              }`}
              title={isSidebarCollapsed ? 'Persetujuan Klaim' : undefined}
            >
              {activeTab === 'approvals' && <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-rose-500" />}
              <div className="relative shrink-0">
                <ShieldAlert className={`w-5 h-5 ${activeTab === 'approvals' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                {isSidebarCollapsed && pendingApprovals.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingApprovals.length}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="whitespace-nowrap truncate mr-2">Persetujuan Klaim</span>
                  {pendingApprovals.length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shrink-0">
                      {pendingApprovals.length}
                    </span>
                  )}
                </div>
              )}
            </button>

            {[
              { id: 'inbound', icon: TrendingUp, label: 'Uang Masuk', color: 'text-[#1800ad]', activeBg: 'bg-emerald-500' },
              { id: 'ledger', icon: BookOpen, label: 'Buku Kas', color: 'text-[#1800ad]', activeBg: 'bg-indigo-500' },
              { id: 'employees', icon: Users, label: 'Kelola Karyawan', color: 'text-[#1800ad]', activeBg: 'bg-blue-500' },
              { id: 'payroll', icon: BookOpen, label: 'Payroll Massal', color: 'text-[#1800ad]', activeBg: 'bg-amber-500' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${isSidebarCollapsed ? 'justify-center' : ''} ${
                  activeTab === item.id ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {activeTab === item.id && <div className={`absolute left-0 top-0 bottom-0 w-[4.5px] ${item.activeBg}`} />}
                <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? item.color : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
              </button>
            ))}
          </>
        )}
      </nav>

    </aside>
  );
}

