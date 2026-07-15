import React from 'react';
import { 
  Plus, BookMarked, FileText
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function LedgerScreen(props: WebScreenProps) {
  const {
    transactions, employees, setShowManualModal, setSelectedLedgerReceipt, branches
  } = props;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/30 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] border border-white/30 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <BookMarked className="w-8 h-8 text-blue-100" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight">Buku Kas & Ledger Finansial</h2>
            <p className="text-indigo-100 mt-3 text-base max-w-xl font-medium">Buku besar historis kas perseroan yang mencatat seluruh aktivitas <span className="font-bold text-white">in & out</span> secara hierarkis dan immutable.</p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <button 
            onClick={() => setShowManualModal(true)}
            className="p-4 px-8 bg-white text-indigo-700 hover:bg-slate-50 hover:text-indigo-900 font-black text-sm rounded-[1.5rem] flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" strokeWidth="2.5" /> Entri Manual Ledger
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden p-6 pb-8">
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left text-[15px] border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-400 text-[12px] font-black uppercase tracking-widest px-4">
                <th className="p-4 pl-8">Tanggal Ledger</th>
                <th className="p-4">Ref ID</th>
                <th className="p-4">Merchant / Sumber Kas</th>
                <th className="p-4">Kategori Akun</th>
                <th className="p-4">Operator / Validator</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Debit (Masuk)</th>
                <th className="p-4 text-right">Kredit (Keluar)</th>
                <th className="p-4 pr-8 text-right">Bukti</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-bold">
              {transactions.filter(t => t.status === 'Approved').map((t) => {
                const isIncome = t.type === 'income';
                return (
                  <tr key={t.id} className="bg-white hover:bg-slate-50 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 border border-slate-100 group rounded-[2rem] overflow-hidden">
                    <td className="p-5 pl-8 rounded-l-[2rem] font-mono text-sm text-slate-400 group-hover:text-slate-600 transition-colors font-semibold">{t.date}</td>
                    <td className="p-5 font-mono text-xs text-slate-400 bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-200 px-3 py-1.5 my-4 mx-2 inline-block rounded-xl transition-colors">{t.id.substring(0, 8)}...</td>
                    <td className="p-5 font-black text-slate-900 max-w-[200px] truncate text-base group-hover:text-indigo-600 transition-colors">
                      {t.merchant}
                      {branches && t.branchId && (
                        <div className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded inline-block">
                          {branches.find(b => b.id === t.branchId)?.name || "Cabang Pusat"}
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      <span className="bg-indigo-50/50 text-indigo-700 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">{t.category}</span>
                    </td>
                    <td className="p-5 text-slate-700 text-[15px]">{employees.find(e => e.id === t.employeeId)?.name || "Unknown"}</td>
                    <td className="p-5">
                      <span className="inline-flex items-center text-[10px] tracking-widest font-black uppercase px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span> POSTED
                      </span>
                    </td>
                    <td className="p-5 font-mono font-black text-base text-right">
                      {isIncome ? <span className="text-emerald-500 drop-shadow-sm">+Rp {t.amount.toLocaleString('id-ID')}</span> : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="p-5 font-mono font-black text-base text-right">
                      {!isIncome ? <span className="text-rose-500 drop-shadow-sm">-Rp {t.amount.toLocaleString('id-ID')}</span> : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="p-5 rounded-r-[2rem] pr-8 text-right">
                      {t.receiptUrl ? (
                        <button 
                          onClick={() => setSelectedLedgerReceipt(t.receiptUrl || null)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-100 hover:border-transparent rounded-[1rem] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                          <FileText className="w-4 h-4 shrink-0" strokeWidth="2.5" /> Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300 font-bold italic mr-6">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
