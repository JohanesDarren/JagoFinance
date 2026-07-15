import React from 'react';
import { 
  Search, ShieldAlert, CheckCircle, XCircle, Filter, AlertTriangle, Eye 
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function ApprovalsScreen(props: WebScreenProps) {
  const {
    transactions, employees, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter, setSplitViewTx, setShowRejectForm, setRejectReasonText,
    pendingApprovals, branches
  } = props;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-brand to-indigo-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-brand/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/30 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black tracking-widest uppercase mb-4">
              <ShieldAlert className="w-3.5 h-3.5" />
              Sistem Audit
            </div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight">Area Persetujuan Klaim</h2>
            <p className="text-indigo-100 mt-3 text-base max-w-2xl font-medium">Lakukan validasi keabsahan struk fisik dan sinkronkan dengan JagoFinance Hermes AI. Lindungi cashflow dari fraudulent transactions.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-8 py-5 rounded-[2rem] border border-white/20 shadow-inner flex flex-col items-center justify-center min-w-[200px]">
            <div className="text-[11px] font-black text-indigo-200 uppercase tracking-[0.25em] mb-1">Menunggu Audit</div>
            <div className="text-5xl font-black font-mono mt-1 flex items-baseline gap-2">
              {pendingApprovals.length} <span className="text-lg font-bold opacity-70">klaim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search & Filter Bar */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Merchant atau Nama Staff..."
            className="w-full pl-14 pr-6 py-4 text-[15px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-[1.75rem] outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 focus:bg-white font-medium transition-all shadow-inner"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-slate-400" />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-6 py-4 text-[15px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-[1.75rem] focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none cursor-pointer w-full font-bold text-slate-700 transition-all appearance-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="relative w-full md:w-56">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-6 py-4 text-[15px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-[1.75rem] focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none cursor-pointer w-full font-bold text-slate-700 transition-all appearance-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Operasional">Operasional</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Server">Server</option>
              <option value="Gaji Karyawan">Gaji Gaji</option>
            </select>
          </div>
        </div>
      </div>

      {/* General datatable */}
      {(() => {
        const filtered = transactions.filter(t => {
          if (t.type === 'income') return false;

          const matchSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (employees.find(e => e.id === t.employeeId)?.name || "Unknown").toLowerCase().includes(searchTerm.toLowerCase());
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
          <div className="overflow-x-auto pb-6">
            <table className="w-full text-left text-[15px] border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-400 text-[12px] font-black uppercase tracking-widest px-4">
                  <th className="p-4 pl-8">Tanggal</th>
                  <th className="p-4">Staf / ID</th>
                  <th className="p-4">Merchant / Supplier</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Jumlah Biaya</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-8 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 font-bold">
                {filtered.map((t) => (
                  <tr key={t.id} className="bg-white hover:bg-slate-50/80 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 border border-slate-100 hover:border-slate-200 group rounded-[2rem] overflow-hidden">
                    <td className="p-6 pl-8 rounded-l-[2rem] text-slate-500 font-mono text-sm font-semibold">{t.date}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg shadow-inner border border-slate-200 group-hover:bg-brand group-hover:text-white transition-colors duration-500">
                          {(employees.find(e => e.id === t.employeeId)?.name || "U")[0]}
                        </div>
                        <div className="leading-tight">
                          <span className="font-black text-slate-900 block text-base group-hover:text-brand transition-colors">{employees.find(e => e.id === t.employeeId)?.name || "Unknown"}</span>
                          <span className="text-xs text-slate-400 font-mono font-semibold block mt-1">{t.employeeId}</span>
                        </div>
                      </div>
                      {branches && t.branchId && (
                        <div className="mt-3">
                          <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest font-black">
                            {branches.find(b => b.id === t.branchId)?.name || "Cabang Pusat"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-6 font-black text-slate-900 truncate max-w-[200px] text-base">{t.merchant}</td>
                    <td className="p-6">
                      <span className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs font-black shadow-sm">{t.category}</span>
                    </td>
                    <td className="p-6 font-mono font-black text-slate-900 text-lg">Rp {t.amount.toLocaleString('id-ID')}</td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full shadow-sm border ${
                        t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        t.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {t.status === 'Approved' && <CheckCircle className="w-4 h-4" strokeWidth="3" />}
                        {t.status === 'Rejected' && <XCircle className="w-4 h-4" strokeWidth="3" />}
                        {t.status === 'Pending' && <span className="relative flex h-2.5 w-2.5 mr-0.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span></span>}
                        {t.status}
                      </span>
                    </td>
                    <td className="p-6 pr-8 text-right rounded-r-[2rem]">
                      <button 
                        onClick={() => {
                          setSplitViewTx(t);
                          setShowRejectForm(false);
                          setRejectReasonText('');
                        }}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black text-sm rounded-2xl hover:bg-slate-900 hover:text-white inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <Eye className="w-4 h-4" strokeWidth="2.5" />
                        <span>Tinjau</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

    </div>
  );
}
