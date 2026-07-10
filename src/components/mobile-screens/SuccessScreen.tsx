import React from 'react';
import { Check } from 'lucide-react';

interface SuccessScreenProps {
  setCurrentScreen: (screen: any) => void;
  onRefreshData: () => void;
}

export default function SuccessScreen({
  setCurrentScreen,
  onRefreshData
}: SuccessScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#f8f9fe]">
      
      <div className="text-center my-auto space-y-4">
        
        {/* Ring check layout wrapper */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold font-display text-slate-900 leading-tight">Pengajuan Berhasil!</h3>
          <p className="text-xs text-slate-500 px-4">Nota struk belanja Anda telah direkam dan diajukan ke tim Finance PT JagoAI.</p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-100 text-left text-[9px] text-slate-500 space-y-1 inline-block">
          <span className="font-bold text-[10px] text-slate-700 block">⚡ Audit AI Dimulai:</span>
          <p>Status pengajuan saat ini <b>Pending (Dalam Review)</b>. Anda dapat memantau status persetujuan, chat penolakan, atau pencairan langsung secara real-time pada tab Riwayat.</p>
        </div>
      </div>

      <button 
        onClick={() => {
          setCurrentScreen('home');
          onRefreshData();
        }}
        className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl hover:bg-opacity-95 transition-all"
      >
        Kembali ke Beranda
      </button>

    </div>
  );
}
