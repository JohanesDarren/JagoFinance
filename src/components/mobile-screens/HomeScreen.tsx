import React from 'react';
import { Bell, Camera, CreditCard, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';

interface HomeScreenProps {
  staffName: string;
  sisaLimit: number;
  limitPercentage: number;
  totalApproved: number;
  limitMax: number;
  staffTransactions: Transaction[];
  setCurrentScreen: (screen: any) => void;
  handleOpenScanner: (type: 'reimburse' | 'cash_advance') => void;
  handleOpenDetail: (tx: Transaction) => void;
}

export default function HomeScreen({
  staffName,
  sisaLimit,
  limitPercentage,
  totalApproved,
  limitMax,
  staffTransactions,
  setCurrentScreen,
  handleOpenScanner,
  handleOpenDetail
}: HomeScreenProps) {
  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 h-full overflow-y-auto bg-slate-50 relative w-full">
      
      {/* Top subtle gradient blob */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-100/60 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header (Sapaan, notification bell, profile photo) */}
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Profile avatar" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-500 font-bold">Selamat pagi,</p>
              <h4 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">{staffName}</h4>
            </div>
          </div>
          
          <div className="flex gap-2">
            {/* Ring alarm notification click */}
            <button 
              onClick={() => setCurrentScreen('notifications')}
              className="relative p-3 text-slate-600 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-slate-100"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <div className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reimburse Limit Card (Glassy/Modern) */}
          <div className="bg-gradient-to-br from-indigo-600 via-brand to-violet-600 text-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-indigo-200 relative overflow-hidden z-10">
            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-indigo-100 block opacity-90">Sisa Limit Reimburse</span>
                <h3 className="text-3xl md:text-4xl font-black font-display tracking-tight mt-2">Rp {sisaLimit.toLocaleString('id-ID')}</h3>
              </div>
              <div className="text-[10px] md:text-xs bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-white shadow-sm">Bulan Ini</div>
            </div>

            {/* Limit Progression bar */}
            <div className="mt-8 relative z-10">
              <div className="w-full bg-black/20 h-2 md:h-3 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${limitPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm text-indigo-100 mt-3 font-medium">
                <span>Terpakai: <span className="font-bold text-white">Rp {totalApproved.toLocaleString('id-ID')}</span></span>
                <span>Kuota: <span className="font-bold text-white">Rp {limitMax.toLocaleString('id-ID')}</span></span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons (Reimburse & Cash Advance) */}
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <button 
              onClick={() => handleOpenScanner('reimburse')}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-brand transition-all text-left flex flex-col justify-between h-full min-h-[140px] relative overflow-hidden group"
              id="mobile_action_reimburse"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors"></div>
              <div className="p-2 bg-indigo-50 text-brand rounded-xl w-max mb-1 relative z-10">
                <Camera className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="relative z-10">
                <span className="font-black text-sm md:text-base text-slate-800 block leading-snug">Reimburse</span>
                <span className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 md:mt-2 block">Scan struk instan</span>
              </div>
            </button>

            <button 
              onClick={() => handleOpenScanner('cash_advance')}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-brand transition-all text-left flex flex-col justify-between h-full min-h-[140px] relative overflow-hidden group"
              id="mobile_action_cashadvance"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-violet-50 rounded-full group-hover:bg-violet-100 transition-colors"></div>
              <div className="p-2 bg-violet-50 text-violet-700 rounded-xl w-max mb-1 relative z-10">
                <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="relative z-10">
                <span className="font-black text-sm md:text-base text-slate-800 block leading-snug">Cash Advance</span>
                <span className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 md:mt-2 block">Pinjaman kas muka</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-3 relative z-10">
        {/* Recent Activity Portion (3 pengajuan terakhir) */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Aktivitas Terakhir</span>
          <button 
            onClick={() => setCurrentScreen('history')}
            className="text-xs md:text-sm text-brand hover:underline font-semibold"
          >
            Lihat Semua ({staffTransactions.length})
          </button>
        </div>

        {staffTransactions.length === 0 ? (
          /* Empty States specifically for employee */
          <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 text-center space-y-3 text-slate-500 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm md:text-base font-medium text-slate-400">Belum ada pengajuan reimburse bulan ini.</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {staffTransactions.slice(0, 3).map((tx) => (
              <div 
                key={tx.id}
                onClick={() => handleOpenDetail(tx)}
                className="bg-white p-4 md:p-5 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-brand/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl text-sm md:text-base font-black w-12 h-12 md:w-14 md:h-14 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                    {tx.merchant.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm md:text-base text-slate-800 tracking-tight truncate w-[160px] md:w-[300px]">{tx.merchant}</h5>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-mono text-sm md:text-base font-black text-slate-800 block">Rp {tx.amount.toLocaleString('id-ID')}</span>
                  <span className={`inline-block text-[10px] md:text-xs font-bold px-3 py-1 rounded-lg mt-1 md:mt-2 ${
                    tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                    tx.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visual Guidelines Banner */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 md:p-5 rounded-2xl text-xs md:text-sm text-brand flex items-start gap-3 mt-4">
          <div className="w-5 h-5 mt-0.5 shrink-0 bg-indigo-200 rounded-full flex items-center justify-center text-xs text-indigo-700 font-bold">i</div>
          <div className="leading-relaxed">
            <span className="font-bold block mb-1">Integrasi Scanner AI</span>
            Gunakan kamera untuk mengambil foto struk cetak. AI JagoFinance akan mendeteksi kategori dan total tagihan tanpa salah ketik secara otomatis.
          </div>
        </div>
      </div>
    </div>
  );
}
