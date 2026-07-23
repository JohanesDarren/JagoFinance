import React, { useRef } from 'react';
import { Bell, AlertCircle, Image as ImageIcon, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
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
}

// Framer Motion variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
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
  setHasNewNotifications
}: HomeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="p-4 md:p-8 space-y-6 pb-24 h-full overflow-y-auto bg-slate-50 relative w-full overflow-x-hidden">
      
      {/* Animated Top Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/40 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-0 -right-20 w-80 h-80 bg-violet-400/30 rounded-full blur-[80px]"
        />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-6 relative z-10"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="relative cursor-pointer"
              onClick={() => setCurrentScreen('profile')}
            >
              <div className="rounded-[1.25rem] bg-slate-200 border-2 border-white shadow-md overflow-hidden transition-transform">
                <img 
                  src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                  alt="Profile" 
                  className="w-12 h-12 md:w-16 md:h-16 object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            </motion.div>
            <div>
              <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Selamat pagi,</p>
              <h4 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">{staffName}</h4>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentScreen('notifications');
                if (setHasNewNotifications) setHasNewNotifications(false);
              }}
              className="relative p-3 text-slate-600 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md transition-all border border-white"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              {hasNewNotifications && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"
                />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Limit & Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Reimburse Limit Card (Glassy/Modern) */}
          <motion.div 
            variants={fadeUp}
            className="bg-gradient-to-br from-indigo-900 via-indigo-700 to-violet-800 text-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 relative overflow-hidden z-10"
          >
            {/* Animated Shimmer */}
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
            />
            
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-indigo-200 block opacity-90 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sisa Limit Reimburse
                </span>
                <h3 className="text-3xl md:text-4xl font-black font-display tracking-tight mt-2 text-white">Rp {sisaLimit.toLocaleString('id-ID')}</h3>
              </div>
              <div className="text-[10px] md:text-xs bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl font-bold text-white shadow-sm">Bulan Ini</div>
            </div>

            {/* Limit Progression bar */}
            <div className="mt-8 relative z-10">
              <div className="w-full bg-black/30 h-2 md:h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${limitPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full"
                />
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm text-indigo-200 mt-3 font-medium">
                <span>Terpakai: <span className="font-bold text-white">Rp {totalApproved.toLocaleString('id-ID')}</span></span>
                <span>Kuota: <span className="font-bold text-white">Rp {limitMax.toLocaleString('id-ID')}</span></span>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div variants={fadeUp} className="relative z-10">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 flex items-center gap-6 group overflow-hidden"
              id="mobile_action_reimburse"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-600/30 relative z-10 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
                <ImageIcon className="w-8 h-8" />
              </div>
              
              <div className="relative z-10 flex-1 text-left">
                <span className="font-black text-xl text-slate-800 block leading-tight mb-1">Ajukan Reimburse</span>
                <span className="text-sm text-slate-500 font-medium line-clamp-2">Upload bukti struk & cairan dana</span>
              </div>
              
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Recent Activity Portion */}
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="flex justify-between items-center mt-6">
            <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand"></span> Aktivitas Terakhir
            </span>
            <button 
              onClick={() => setCurrentScreen('history')}
              className="text-xs md:text-sm text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Lihat Semua
            </button>
          </div>

          {staffTransactions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[2rem] border border-white shadow-xl shadow-slate-200/40 text-center space-y-3 text-slate-500"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-white shadow-inner">
                <AlertCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h5 className="font-black text-lg text-slate-700">Belum ada aktivitas</h5>
              <p className="text-sm font-medium text-slate-400 max-w-[200px] mx-auto">Pengajuan reimburse bulan ini masih kosong.</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {staffTransactions.slice(0, 3).map((tx, idx) => (
                  <motion.div 
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenDetail(tx)}
                    className="bg-white/80 backdrop-blur-md p-4 rounded-[1.5rem] border border-white shadow-md shadow-slate-200/40 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 rounded-2xl text-lg font-black flex items-center justify-center group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white shadow-inner border border-white transition-all duration-300 shrink-0">
                        {tx.merchant.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-bold text-[15px] text-slate-800 tracking-tight truncate max-w-[140px] sm:max-w-[200px] group-hover:text-indigo-600 transition-colors">{tx.merchant}</h5>
                        <p className="text-[11px] text-slate-400 font-bold mt-0.5 tracking-wide">{tx.date} • {tx.category}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-mono text-[15px] font-black text-slate-800 block">Rp {tx.amount.toLocaleString('id-ID')}</span>
                      <span className={`inline-flex items-center justify-center text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg mt-1 border ${
                        tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        tx.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Visual Guidelines Banner */}
        <motion.div variants={fadeUp} className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-white p-5 rounded-[2rem] text-sm text-indigo-900 flex items-start gap-4 shadow-lg shadow-indigo-100/50">
          <div className="w-8 h-8 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="leading-relaxed">
            <span className="font-black block mb-1">Tips Pengajuan</span>
            Pastikan foto nota / struk Anda terlihat jelas (tidak buram) dan terpotong rapi agar verifikasi AI lebih instan.
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
