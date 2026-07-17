import React from 'react';
import {
  Radio, Webhook, Settings, Cpu
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function IntegrationsScreen(props: WebScreenProps) {
  const {
    connectedApps, onToggleApp, openWebhookSetup
  } = props;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-brand/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Cpu className="w-8 h-8 text-indigo-300" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Koneksi API Produk</h2>
            <p className="text-slate-300 mt-3 text-base max-w-xl font-medium">Sambungkan produk SaaS internal JagoAI ke dashboard keuangan untuk pelaporan kas otomatis secara real-time lewat Webhook.</p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-[1.5rem] border border-white/10 flex items-center gap-4 shadow-inner">
            <Radio className="w-7 h-7 text-emerald-400" strokeWidth="2.5" />
            <div>
              <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Status Node</div>
              <div className="text-lg font-black font-mono"><span className="text-emerald-400">{connectedApps.filter(a => a.status === 'active').length}</span> / {connectedApps.length} Aktif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration settings connected apps grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {connectedApps.map((app) => (
          <div key={app.id} className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-100 transition-all duration-500 group flex flex-col relative overflow-hidden">

            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full pointer-events-none group-hover:scale-[2] transition-transform duration-700"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Webhook className="w-7 h-7 text-indigo-600" strokeWidth="2.5" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 font-display leading-tight group-hover:text-brand transition-colors">{app.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono font-semibold">ID: {app.id}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-1 relative z-10">
              {app.description}
            </p>

            <div className="bg-slate-50 p-5 rounded-[1.5rem] text-sm space-y-4 mb-8 relative z-10 border border-slate-100 group-hover:border-indigo-100/50 group-hover:bg-indigo-50/30 transition-colors">
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Payment Gateway</span>
                <span className="font-black text-slate-800 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 text-xs">{app.paymentGateway || 'Belum Terhubung'}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Inflow Bulan Ini</span>
                <span className="font-mono font-black text-emerald-600 text-base">Rp {app.monthlyRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 relative z-10 mt-auto">
              {/* Connection Status Toggle indicator click */}
              <button
                onClick={() => onToggleApp(app.id)}
                className={`flex-1 py-4 text-xs font-black rounded-[1.5rem] transition-all border shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 ${app.status === 'active'
                    ? 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:shadow-emerald-900/5'
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
              >
                {app.status === 'active' ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Node Aktif
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                    Node Mati
                  </>
                )}
              </button>

              <button
                onClick={() => openWebhookSetup(app)}
                className="flex-1 py-4 bg-indigo-600 text-white hover:bg-brand rounded-[1.5rem] text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <Settings className="w-4 h-4" strokeWidth="2.5" /> Konfigurasi
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

