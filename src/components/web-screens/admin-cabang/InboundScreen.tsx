import React from 'react';
import { 
  Sparkles, ArrowDownToLine, ArrowDownLeft
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function InboundScreen(props: WebScreenProps) {
  const {
    transactions, totalInflowThisMonth, handleExportCSV, companies
  } = props;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-900/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] border border-white/30 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <ArrowDownLeft className="w-8 h-8 text-emerald-100" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight">Arus Kas Masuk <span className="font-light opacity-80">(Inbound)</span></h2>
            <p className="text-emerald-50 mt-3 text-base max-w-xl font-medium">Laporan uang masuk langsung yang diterima secara otomatis dari billing webhook produk SaaS AI.</p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <button 
            onClick={handleExportCSV}
            className="p-4 px-8 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-black text-sm rounded-[1.5rem] flex items-center justify-center gap-2 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <ArrowDownToLine className="w-5 h-5" strokeWidth="2.5" /> Unduh Laporan CSV
          </button>
        </div>
      </div>

      {/* Inbound log table */}
      {(() => {
        const inboundTxs = transactions.filter(t => t.type === 'income');

        return (
          <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-emerald-50/50 to-transparent border-b border-emerald-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-sm relative">
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-emerald-100/30 to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-inner border border-emerald-200/50">
                  <Sparkles className="w-6 h-6" strokeWidth="2.5" />
                </div>
                <div>
                  <h3 className="font-black text-emerald-900 font-display text-xl tracking-tight">Pemasukan Otomatis Terdeteksi</h3>
                  <p className="text-emerald-700/70 text-xs font-bold mt-0.5 uppercase tracking-widest">via Webhook Gateway</p>
                </div>
              </div>

              <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-emerald-100 shadow-sm font-black text-slate-800 text-base flex items-center gap-3 relative z-10">
                Total Bulan Ini: <span className="text-emerald-600 font-mono text-xl">Rp {totalInflowThisMonth.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="overflow-x-auto pb-6 p-6">
              <table className="w-full text-left text-[15px] border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-slate-400 text-[12px] font-black uppercase tracking-widest px-4">
                    <th className="p-4 pl-8">Tanggal Inflow</th>
                    <th className="p-4">ID Aliran</th>
                    <th className="p-4">Asal Produk AI</th>
                    <th className="p-4">Detail Node / Klien</th>
                    <th className="p-4 text-right">Jumlah Pemasukan</th>
                    <th className="p-4 pr-8 text-right">Saluran / PG</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-bold">
                  {inboundTxs.map((t) => (
                    <tr key={t.id} className="bg-white hover:bg-emerald-50/50 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-100 group rounded-[2rem] overflow-hidden">
                      <td className="p-5 pl-8 rounded-l-[2rem] font-mono text-sm text-slate-400 group-hover:text-slate-600 transition-colors font-semibold">{t.date}</td>
                      <td className="p-5 font-mono text-xs text-brand font-black bg-brand/5 group-hover:bg-brand/10 border border-transparent group-hover:border-brand/20 px-3 py-1.5 my-4 rounded-xl inline-block mx-2 transition-colors">{t.id}</td>
                      <td className="p-5 font-black text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                        {t.merchant}
                        {companies && t.employeeId && (
                          <div className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded inline-block">
                            {"Cabang Pusat"}
                          </div>
                        )}
                      </td>
                      <td className="p-5 font-mono text-xs text-slate-500 font-semibold">{t.employeeId}</td>
                      <td className="p-5 font-mono font-black text-emerald-600 text-lg text-right">Rp {t.amount.toLocaleString('id-ID')}</td>
                      <td className="p-5 rounded-r-[2rem] pr-8 text-right">
                        <span className="bg-emerald-50 text-emerald-700 font-black text-[10px] px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">Otomatis / PG</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

