import React from 'react';
import { 
  CheckCircle, AlertTriangle, CloudCog
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function SubscriptionsScreen(props: WebScreenProps) {
  const {
    subscriptions
  } = props;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-purple-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-purple-900/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <CloudCog className="w-8 h-8 text-fuchsia-100" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight">Tagihan & Langganan SaaS</h2>
            <p className="text-fuchsia-100 mt-3 text-base max-w-xl font-medium">Pelacakan pengeluaran berulang otomatis (AWS, OpenAI API, SaaS) lengkap dengan notifikasi pencegah kegagalan pembayaran.</p>
          </div>
        </div>
      </div>

      {/* Active listings cards */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden pb-6 p-6">
        <div className="p-8 bg-gradient-to-r from-purple-50/50 to-transparent border-b border-purple-100/50 flex flex-col md:flex-row justify-between md:items-center gap-6 text-sm relative">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-purple-100/30 to-transparent pointer-events-none"></div>

          <span className="font-black text-purple-900 font-display text-2xl flex items-center gap-4 relative z-10 tracking-tight">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-[1.25rem] flex items-center justify-center shadow-inner border border-purple-200/50">
              <CheckCircle className="w-6 h-6" strokeWidth="2.5" />
            </div>
            Daftar Langganan Aktif ({subscriptions.length})
          </span>
          
          {subscriptions.filter(s=>s.status==='warning').length > 0 && (
            <span className="text-sm bg-rose-50 text-rose-700 px-6 py-4 rounded-[1.5rem] font-black flex items-center gap-3 border border-rose-200 shadow-sm animate-pulse relative z-10">
              <AlertTriangle className="w-5 h-5 text-rose-500" strokeWidth="2.5" /> 
              Pembaruan Menjelang: {subscriptions.filter(s=>s.status==='warning').length} Tagihan
            </span>
          )}
        </div>

        <div className="overflow-x-auto pb-4 p-6">
          <table className="w-full text-left text-[15px] border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-400 font-black uppercase tracking-widest text-[12px] px-4">
                <th className="p-4 pl-8">Layanan SaaS / Vendor</th>
                <th className="p-4">Kategori Akun</th>
                <th className="p-4 text-right">Biaya Berulang</th>
                <th className="p-4">Siklus</th>
                <th className="p-4">Jatuh Tempo Pembayaran</th>
                <th className="p-4 pr-8 text-right">Status Tagihan</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-bold">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="bg-white hover:bg-slate-50/50 transition-all shadow-sm hover:shadow-xl hover:shadow-purple-900/5 border border-slate-100 group rounded-[2rem] overflow-hidden">
                  <td className="p-5 pl-8 rounded-l-[2rem]">
                    <div className="leading-tight">
                      <span className="font-black text-slate-900 block text-base group-hover:text-purple-600 transition-colors">{sub.name}</span>
                      <span className="text-xs text-slate-400 font-mono block mt-1 font-semibold">ID: {sub.id}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-xs font-black border border-slate-200/60 shadow-sm inline-block">{sub.category}</span>
                  </td>
                  <td className="p-5 font-mono font-black text-rose-500 text-lg text-right">Rp {sub.cost.toLocaleString('id-ID')}</td>
                  <td className="p-5 capitalize text-slate-500 font-black text-sm">{sub.cycle}</td>
                  <td className="p-5 font-mono text-sm font-black text-slate-800">{sub.nextBilling}</td>
                  <td className="p-5 rounded-r-[2rem] pr-8 text-right">
                    {sub.status === 'warning' ? (
                      <span className="bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 px-5 py-2.5 rounded-[1rem] text-xs font-black inline-flex items-center gap-2 border border-rose-200 uppercase tracking-widest shadow-sm">
                        <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
                        <span>Hampir Jatuh Tempo</span>
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-5 py-2.5 rounded-[1rem] text-xs font-black inline-flex items-center gap-2 border border-emerald-200 uppercase tracking-widest shadow-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" strokeWidth="2.5" />
                        <span>Otomatis (Lancar)</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

