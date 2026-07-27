import React, { useRef, useState } from 'react';
import { Bell, AlertCircle, Image as ImageIcon, Sparkles, ChevronRight, CheckCircle2, ScanLine, Clock, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Wifi, MoreHorizontal, User, LogOut } from 'lucide-react';
import { Transaction } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface HomeScreenProps {
  staffName: string;
  sisaLimit: number;
  limitPercentage: number;
  totalApproved: number;
  limitMax: number;
  staffTransactions: Transaction[];
  setCurrentScreen: (screen: any) => void;
  handleOpenScanner: (type: 'reimburse' | 'cash_advance') => void;
  handleOpenForm?: (type: 'reimburse' | 'cash_advance', imageBase64?: string, imageName?: string) => void;
  handleOpenDetail: (tx: Transaction) => void;
  avatarUrl?: string;
  hasNewNotifications?: boolean;
  setHasNewNotifications?: (val: boolean) => void;
  handleLogout?: () => void;
}

// Framer Motion variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function HomeScreen({
  staffName,
  sisaLimit,
  limitPercentage,
  totalApproved,
  limitMax,
  staffTransactions,
  setCurrentScreen,
  handleOpenScanner,
  handleOpenForm,
  handleOpenDetail,
  avatarUrl,
  hasNewNotifications,
  handleLogout
}: HomeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      if (handleOpenForm) {
        handleOpenForm('reimburse', base64Data, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-5 md:p-8 space-y-8 pb-28 h-full overflow-y-auto bg-[#F8FAFC] relative w-full overflow-x-hidden font-sans custom-scrollbar">
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-7 relative z-10"
      >

        {/* Welcome Banner / Global Stats */}
        <div className="mt-2 w-full">
          <div className="bg-blue-950 text-white px-6 py-8 rounded-[2rem] shadow-lg relative overflow-hidden">
            {/* Safe background decoration that won't interfere */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-blue-900 pointer-events-none z-0"></div>
            
            <div className="relative z-10 flex flex-col w-full h-full justify-center">
              <p className="text-blue-200 text-xs md:text-sm leading-relaxed font-medium">
                Pantau seluruh pengajuan reimburse & kasbon Anda.
              </p>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-blue-300">Total Pengajuan</span>
                  <span className="text-3xl font-black font-display text-white leading-none mt-1">{staffTransactions.length}</span>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-white">{staffTransactions.filter(t => t.status === 'Approved').length}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-sm font-bold text-white">{staffTransactions.filter(t => t.status === 'Pending').length}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <span className="text-sm font-bold text-white">{staffTransactions.filter(t => t.status === 'Rejected').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List (Inspiration 1, 2) */}
        <motion.div variants={fadeUp} className="space-y-4 pt-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[17px] font-black text-blue-950 tracking-tight">Transactions</h2>
            <button 
              onClick={() => setCurrentScreen('history')}
              className="text-[11px] font-bold uppercase tracking-widest text-blue-700 hover:text-blue-950 transition-colors"
            >
              See all
            </button>
          </div>

          <div className="space-y-3">
            {staffTransactions.length === 0 ? (
              <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-slate-300" />
                </div>
                <h4 className="font-black text-blue-950 text-sm mb-1">Belum Ada Transaksi</h4>
                <p className="text-xs font-medium text-slate-400">Transaksi bulan ini akan muncul di sini.</p>
              </div>
            ) : (
              staffTransactions.slice(0, 4).map((tx) => (
                <motion.div
                  key={tx.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenDetail(tx)}
                  className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm flex items-center gap-4 cursor-pointer group"
                >
                  {/* Modern Icon with specific colors */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'reimburse' || (tx.type as string) === 'reimbursement' 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-blue-50 text-blue-700'
                  }`}>
                    {tx.type === 'reimburse' || (tx.type as string) === 'reimbursement' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[15px] text-blue-950 truncate">{tx.merchant}</h4>
                    <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">
                      {tx.category} • {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Hari ini'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-[15px] text-blue-950 block">
                      -Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 ${
                      tx.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      tx.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {tx.status === 'Approved' ? 'Selesai' :
                       tx.status === 'Rejected' ? 'Ditolak' : 'Proses'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
