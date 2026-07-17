import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';

interface HistoryScreenProps {
  setCurrentScreen: (screen: any) => void;
  historyTab: 'Semua' | 'Pending' | 'Selesai';
  setHistoryTab: (tab: 'Semua' | 'Pending' | 'Selesai') => void;
  staffTransactions: Transaction[];
  handleOpenDetail: (tx: Transaction) => void;
}

export default function HistoryScreen({
  setCurrentScreen,
  historyTab,
  setHistoryTab,
  staffTransactions,
  handleOpenDetail
}: HistoryScreenProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentScreen('home')}
          className="p-1 px-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda
        </button>
        <span className="text-xs font-bold font-display text-slate-800">Riwayat Pengajuan</span>
        <div className="w-8"></div>
      </div>

      {/* Tab Controller Filter Tab Bar Navigation */}
      <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[10px] font-bold">
        {(['Semua', 'Pending', 'Selesai'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setHistoryTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              historyTab === tab 
                ? 'bg-white text-brand shadow-3xs' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter list */}
      {(() => {
        const filtered = staffTransactions.filter(t => {
          if (historyTab === 'Semua') return true;
          if (historyTab === 'Pending') return t.status === 'Pending';
          return t.status === 'Approved' || t.status === 'Rejected';
        });

        return filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-2 text-slate-500 mt-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Tidak ada pengajuan ditemukan.</p>
              <p className="text-[8px] text-slate-400 mt-0.5">Filter aktif: Tab {historyTab}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 pt-1.5">
            {filtered.map((t) => (
              <div 
                key={t.id}
                onClick={() => handleOpenDetail(t)}
                className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs hover:border-slate-200 transition-all flex justify-between items-center cursor-pointer"
              >
                <div>
                  <span className="text-[8px] text-slate-400 block">{t.date}</span>
                  <h6 className="font-bold text-[10px] text-slate-800 truncate w-[160px] leading-snug">{t.merchant}</h6>
                  <span className="text-[8px] uppercase font-bold tracking-wider text-indigo-500 inline-block mt-0.5">{t.category}</span>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="font-mono text-[9px] font-bold text-slate-700 block">Rp {t.amount.toLocaleString('id-ID')}</span>
                  <span className={`inline-block text-[7px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                    t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    t.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

    </div>
  );
}
