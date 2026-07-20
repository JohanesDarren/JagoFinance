import React from 'react';
import { 
  Search, ShieldAlert, CheckCircle, XCircle, Filter, AlertTriangle, Eye 
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function ApprovalsScreen(props: WebScreenProps) {
  const {
    transactions, employees, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter, setSplitViewTx, setShowRejectForm, setRejectReasonText,
    pendingApprovals
  } = props;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-brand/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <ShieldAlert className="w-8 h-8 text-indigo-300" strokeWidth="2.5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-[10px] font-black tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Sistem Audit
            </div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Area Persetujuan Klaim</h2>
            <p className="text-slate-300 mt-3 text-base max-w-xl font-medium">Lakukan validasi keabsahan struk fisik dan sinkronkan dengan JagoFinance Hermes AI. Lindungi cashflow dari fraudulent transactions.</p>
          </div>
        </div>
        
        <div className="relative z-10 shrink-0">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl min-w-[220px] relative overflow-hidden group-hover:bg-white/10 transition-colors duration-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/20 blur-2xl rounded-full"></div>
            <p className="text-[11px] font-black text-indigo-300 uppercase tracking-widest mb-2">Menunggu Audit</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white font-mono">{pendingApprovals.length}</span>
              <span className="text-indigo-200 font-bold text-lg">klaim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search & Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-3 items-center sticky top-4 z-20">
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" strokeWidth="2.5" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Merchant atau Nama Staff..."
            className="w-full pl-14 pr-6 py-4.5 text-[15px] bg-slate-50/50 hover:bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 focus:bg-white font-semibold text-slate-700 transition-all placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" strokeWidth="2.5" />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-11 pr-6 py-4.5 text-[14px] bg-slate-50/50 hover:bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none cursor-pointer w-full font-bold text-slate-700 transition-all appearance-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="relative w-full md:w-56 group">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-6 py-4.5 text-[14px] bg-slate-50/50 hover:bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none cursor-pointer w-full font-bold text-slate-700 transition-all appearance-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Infrastruktur & Cloud">Infrastruktur & Cloud</option>
              <option value="Operasional & Alat">Operasional & Alat</option>
              <option value="Pemasaran & Branding">Pemasaran & Branding</option>
              <option value="Konsumsi">Konsumsi</option>
              <option value="Transportasi & Logistik">Transportasi & Logistik</option>
              <option value="Lain-lain / Darurat">Lain-lain / Darurat</option>
            </select>
          </div>
        </div>
      </div>

      {/* General datatable */}
      {(() => {
        const filtered = transactions.filter(t => {
          if (t.type === 'income') return false;

          const matchSearch = t.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (employees.find(e => e.id === t.employeeId)?.name || "Unknown")?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchStatus = statusFilter === 'Semua' ? true : t.status === statusFilter;
          const matchCategory = categoryFilter === 'Semua' ? true : t.category === categoryFilter;

          return matchSearch && matchStatus && matchCategory;
        });

        return filtered.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-100">
              <AlertTriangle className="w-12 h-12 text-slate-400" strokeWidth="1.5" />
            </div>
            <div>
              <h5 className="font-black text-slate-900 text-2xl font-display tracking-tight">Tidak Ada Transaksi Cocok</h5>
              <p className="text-slate-500 mt-2 font-medium">Coba sesuaikan kata pencarian atau bersihkan filter Anda.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-6">
            {filtered.map((t) => (
              <div key={t.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 group flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
                {/* Accent line for pending */}
                {t.status === 'Pending' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>}
                
                <div className="flex items-center gap-5 flex-1 pl-2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-black text-xl shadow-inner group-hover:from-indigo-500 group-hover:to-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all duration-500 shrink-0">
                    {(employees.find(e => e.id === t.employeeId)?.name || "U")[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{employees.find(e => e.id === t.employeeId)?.name || "Unknown"}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-slate-400 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{t.employeeId}</span>

                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Merchant & Kategori</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800 text-base truncate max-w-[150px] lg:max-w-[200px]">{t.merchant}</span>
                    <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{t.category}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Tanggal & Jumlah</span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono font-black text-slate-900 text-xl tracking-tight">Rp {t.amount.toLocaleString('id-ID')}</span>
                    <span className="text-[11px] font-bold text-slate-400">{t.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${
                    t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    t.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {t.status === 'Approved' && <CheckCircle className="w-4 h-4" strokeWidth="3" />}
                    {t.status === 'Rejected' && <XCircle className="w-4 h-4" strokeWidth="3" />}
                    {t.status === 'Pending' && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>}
                    <span className="text-xs font-black uppercase tracking-wider">{t.status}</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSplitViewTx(t);
                      setShowRejectForm(false);
                      setRejectReasonText('');
                    }}
                    className="w-12 h-12 rounded-full bg-white border-2 border-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300"
                    title="Tinjau Klaim"
                  >
                    <Eye className="w-5 h-5" strokeWidth="2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

    </div>
  );
}

