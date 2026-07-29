import React, { useState, useMemo } from 'react';
import { ArrowLeft, AlertCircle, Filter, FileText, CheckCircle2, Clock, X, CalendarDays, Search } from 'lucide-react';
import { Transaction } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryScreenProps {
  setCurrentScreen: (screen: any) => void;
  historyTab: 'Semua' | 'Pending' | 'Selesai' | 'Ditolak';
  setHistoryTab: (tab: 'Semua' | 'Pending' | 'Selesai' | 'Ditolak') => void;
  staffTransactions: Transaction[];
  handleOpenDetail: (tx: Transaction) => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function HistoryScreen({
  setCurrentScreen,
  historyTab,
  setHistoryTab,
  staffTransactions,
  handleOpenDetail
}: HistoryScreenProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper for date calculations
  const getStartOfTime = (range: string) => {
    const now = new Date();
    if (range === 'Minggu Ini') {
      const day = now.getDay() || 7; // Get current day number, handling Sunday as 7
      if (day !== 1) now.setHours(-24 * (day - 1)); // Set to Monday
      now.setHours(0, 0, 0, 0);
    } else if (range === 'Bulan Ini') {
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
    } else if (range === 'Tahun Ini') {
      now.setMonth(0, 1);
      now.setHours(0, 0, 0, 0);
    }
    return now;
  };

  const filteredTransactions = useMemo(() => {
    return staffTransactions.filter(t => {
      let statusMatch = false;
      if (historyTab === 'Semua') statusMatch = true;
      else if (historyTab === 'Pending') statusMatch = t.status === 'Pending';
      else if (historyTab === 'Selesai') statusMatch = t.status === 'Approved';
      else if (historyTab === 'Ditolak') statusMatch = t.status === 'Rejected';

      if (!statusMatch) return false;

      let searchMatch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        searchMatch = t.merchant.toLowerCase().includes(query) || 
                     t.category.toLowerCase().includes(query) ||
                     t.amount.toString().includes(query);
      }
      if (!searchMatch) return false;

      if (selectedDateRange === 'Semua') return true;
      
      let txDate = new Date();
      if (t.date) {
        if (t.date.includes('-')) txDate = new Date(t.date);
        else if (t.date.includes('/')) {
          const parts = t.date.split('/');
          if (parts.length === 3) txDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
      
      const startOfTime = getStartOfTime(selectedDateRange);
      return txDate >= startOfTime;
    });
  }, [staffTransactions, historyTab, selectedDateRange, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden font-sans">
      
      {/* Modern Header - Sticky */}
      <div className="px-5 pt-8 pb-4 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-xl z-20 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-950 shadow-sm border border-slate-200 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[17px] font-black text-blue-950 tracking-tight">Riwayat Pengajuan</h1>
          <div className="w-10 h-10"></div> {/* Spacer for perfect centering */}
        </div>

        {/* Floating Tab Controls */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 font-bold relative shadow-inner overflow-x-auto hide-scrollbar">
          {(['Semua', 'Pending', 'Selesai', 'Ditolak'] as const).map((tab) => {
            const isActive = historyTab === tab;
            return (
              <button 
                key={tab}
                onClick={() => setHistoryTab(tab)}
                className={`flex-1 py-2.5 text-[11px] rounded-xl text-center transition-colors relative z-10 uppercase tracking-widest ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-blue-950'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="historyTabIndicator"
                    className="absolute inset-0 bg-blue-950 rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-4 custom-scrollbar flex flex-col space-y-6">
        
        {/* Filters & Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-blue-950 text-[13px] font-bold py-3 pl-10 pr-4 rounded-[1.25rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
          <div className="relative shrink-0">
            <select 
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-blue-950 text-[13px] font-bold py-3 pl-10 pr-10 rounded-[1.25rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all h-full"
            >
              <option value="Semua">Semua Waktu</option>
              <option value="Minggu Ini">Minggu Ini</option>
              <option value="Bulan Ini">Bulan Ini</option>
              <option value="Tahun Ini">Tahun Ini</option>
            </select>
            <CalendarDays className="w-4 h-4 text-blue-950 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 space-y-3">
          {filteredTransactions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center mt-12 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-[17px] font-black text-blue-950 mb-2">Riwayat Kosong</h2>
              <p className="text-[13px] text-slate-500 font-medium">
                Belum ada transaksi pengajuan di kategori ini.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filteredTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenDetail(tx)}
                  className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] cursor-pointer group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-white/50 ${
                      tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      tx.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {tx.status === 'Approved' ? <CheckCircle2 className="w-6 h-6" /> :
                       tx.status === 'Rejected' ? <AlertCircle className="w-6 h-6" /> :
                       <Clock className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[15px] text-blue-950 truncate group-hover:text-blue-700 transition-colors leading-tight">
                        {tx.merchant}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {tx.category}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-[15px] text-blue-950 block">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </span>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 ${
                        tx.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        tx.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {tx.status === 'Approved' ? 'Selesai' :
                         tx.status === 'Rejected' ? 'Ditolak' : 'Proses'}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-50 w-full"></div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {tx.type === 'reimburse' || (tx.type as string) === 'reimbursement' ? 'Reimbursement' : 'Cash Advance'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {tx.date || (tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
