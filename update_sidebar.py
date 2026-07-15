import re

with open("src/components/WebDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

sidebar_replacement = """
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {userRole === 'super_admin' ? (
              <>
                <div className="px-4 pb-2 pt-4">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Super Admin Portal</p>
                </div>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'overview' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'overview' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-[#3a00ff]" />
                  )}
                  <LayoutGrid className={`w-5 h-5 shrink-0 ${activeTab === 'overview' ? 'text-[#3a00ff]' : 'text-slate-400'}`} />
                  <span>Sistem Global</span>
                </button>

                <button 
                  onClick={() => setActiveTab('subscriptions')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'subscriptions' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'subscriptions' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-purple-500" />
                  )}
                  <CreditCard className={`w-5 h-5 shrink-0 ${activeTab === 'subscriptions' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                  <span>Langganan SaaS</span>
                </button>

                <button 
                  onClick={() => setActiveTab('integrations')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'integrations' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'integrations' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-slate-800" />
                  )}
                  <Cpu className={`w-5 h-5 shrink-0 ${activeTab === 'integrations' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                  <span>Integrasi Sistem</span>
                </button>
              </>
            ) : (
              <>
                <div className="px-4 pb-2 pt-4">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Operasional Cabang</p>
                </div>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'overview' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'overview' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-[#3a00ff]" />
                  )}
                  <LayoutGrid className={`w-5 h-5 shrink-0 ${activeTab === 'overview' ? 'text-[#3a00ff]' : 'text-slate-400'}`} />
                  <span>Dashboard Cabang</span>
                </button>

                <button 
                  onClick={() => setActiveTab('approvals')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'approvals' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'approvals' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-rose-500" />
                  )}
                  <ShieldAlert className={`w-5 h-5 shrink-0 ${activeTab === 'approvals' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span>Persetujuan Klaim</span>
                    {pendingApprovals.length > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-rose-200">
                        {pendingApprovals.length}
                      </span>
                    )}
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('inbound')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'inbound' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'inbound' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-emerald-500" />
                  )}
                  <TrendingUp className={`w-5 h-5 shrink-0 ${activeTab === 'inbound' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                  <span>Uang Masuk</span>
                </button>

                <button 
                  onClick={() => setActiveTab('ledger')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'ledger' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'ledger' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-indigo-500" />
                  )}
                  <BookOpen className={`w-5 h-5 shrink-0 ${activeTab === 'ledger' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                  <span>Buku Kas</span>
                </button>

                <button 
                  onClick={() => setActiveTab('payroll')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    activeTab === 'payroll' ? 'bg-[#f0ebff] text-[#1800ad]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === 'payroll' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-amber-500" />
                  )}
                  <Users className={`w-5 h-5 shrink-0 ${activeTab === 'payroll' ? 'text-[#1800ad]' : 'text-slate-400'}`} />
                  <span>Karyawan & Gaji</span>
                </button>
              </>
            )}
          </nav>
"""

# Now find the nav element in the file and replace it.
start_index = content.find('<nav className="flex-1 py-6 space-y-2 overflow-y-auto">')
end_index = content.find('</nav>', start_index) + 6

if start_index != -1 and end_index != -1:
    new_content = content[:start_index] + sidebar_replacement.strip() + content[end_index:]
    with open("src/components/WebDashboard.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Could not find nav element")
