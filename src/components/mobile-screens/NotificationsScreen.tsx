import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

interface NotificationsScreenProps {
  setCurrentScreen: (screen: any) => void;
}

export default function NotificationsScreen({
  setCurrentScreen
}: NotificationsScreenProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => setCurrentScreen('home')} className="p-1.5 bg-slate-50 text-slate-600 rounded-lg shadow-2xs">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-xs text-slate-800">Notifikasi</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 pb-24">
        <div className="bg-white p-3 rounded-2xl shadow-3xs border border-indigo-50 flex gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-slate-800">Review AI Berhasil</h5>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Sistem AI JagoKeuangan mendeteksi struk Anda yang tertunda sudah berhasil masuk antrian audit admin.</p>
            <span className="text-[8px] font-bold text-slate-400 mt-1 block">Baru saja</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-3xs border border-slate-50 flex gap-3 opacity-70">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-slate-800">Reimburse Disetujui</h5>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Pengajuan Rp 142.000 (Starbucks Coffee) telah disetujui dan ditransfer.</p>
            <span className="text-[8px] font-bold text-slate-400 mt-1 block">2 jam yang lalu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
