import React from 'react';
import { FileText, ChevronRight, Download, LogOut, CheckCircle2, Building, Mail, Wallet, UserCircle } from 'lucide-react';
import { Transaction } from '../../types';
import { motion } from 'motion/react';

interface ProfileScreenProps {
  staffName: string;
  employeeEmail: string;
  setCurrentScreen: (screen: any) => void;
  setSelectedTx: (tx: Transaction | null) => void;
  onLogout?: () => void;
  setIsLogged: (logged: boolean) => void;
  avatarUrl?: string;
  bankName?: string;
  bankAccount?: string;
}

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

export default function ProfileScreen({
  staffName,
  employeeEmail,
  setCurrentScreen,
  setSelectedTx,
  onLogout,
  setIsLogged,
  avatarUrl,
  bankName,
  bankAccount
}: ProfileScreenProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Animated Abstract Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-100 to-transparent pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-300/40 rounded-[4rem] blur-3xl rotate-45"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-20 -left-20 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl"
        />
      </div>

      <div className="p-4 pt-6 flex justify-center items-center relative z-10">
        <span className="text-sm font-black font-display text-slate-800 tracking-wider uppercase">Akun & Payroll</span>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 p-4 pb-24 overflow-y-auto space-y-4 relative z-10"
      >
        {/* Profile Card (Glassmorphism) */}
        <motion.div 
          variants={fadeUp}
          className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col justify-center items-center text-center relative overflow-hidden"
        >
          {/* Top colored banner inside card */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="relative z-10 pt-2"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-white p-1 shadow-lg shadow-indigo-100/50">
              <img 
                src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                alt="Avatar profile large" 
                className="w-full h-full rounded-[1.75rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </motion.div>

          <div className="relative z-10 mt-5">
            <h5 className="font-black text-xl text-slate-800 leading-tight">{staffName}</h5>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold mt-2 border border-indigo-100">
              <Building className="w-3 h-3" />
              <span>Operations Division</span>
            </div>
          </div>

          <div className="w-full bg-slate-50/80 rounded-[1.5rem] p-4 text-left space-y-3 mt-6 relative z-10 border border-slate-100/50 shadow-inner">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> Email Kantor</span>
              <span className="font-bold text-slate-700">{employeeEmail}</span>
            </div>
            <div className="h-px w-full bg-slate-200/50"></div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-slate-400" /> Rekening Pribadi</span>
              <span className="font-bold text-slate-800 flex items-center gap-2">
                {bankName || '-'} 
                <span className="font-mono text-indigo-700 bg-white shadow-sm px-2 py-1 rounded-md text-[10px]">{bankAccount || '-'}</span>
              </span>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('edit-profile')}
            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider rounded-[1.25rem] hover:bg-slate-50 transition-colors relative z-10 shadow-sm mt-4 flex items-center justify-center gap-2"
          >
            <UserCircle className="w-4 h-4" /> Edit Profil
          </motion.button>
        </motion.div>

        {/* Action List Section */}
        <div className="space-y-3 mt-6">
          <motion.span variants={fadeUp} className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Navigasi Utama</motion.span>
          
          {/* History Navigation Button */}
          <motion.button 
            variants={fadeUp}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentScreen('history');
              setSelectedTx(null);
            }}
            className="w-full bg-white/80 backdrop-blur-md p-4 rounded-[1.5rem] border border-white shadow-md shadow-slate-200/40 flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h6 className="font-bold text-[15px] text-slate-800 group-hover:text-indigo-700 transition-colors">Riwayat Pengajuan</h6>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Pantau status transaksi & klaim</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </div>
          </motion.button>

          {/* Payslip History Button */}
          <motion.button 
            variants={fadeUp}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('payslip-history')}
            className="w-full bg-white/80 backdrop-blur-md p-4 rounded-[1.5rem] border border-white shadow-md shadow-slate-200/40 flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h6 className="font-bold text-[15px] text-slate-800 group-hover:text-emerald-700 transition-colors">Riwayat Slip Gaji</h6>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Unduh slip gaji bulanan (PDF)</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </div>
          </motion.button>
        </div>

        {/* Logout Button */}
        <motion.button 
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (onLogout) onLogout();
            else setIsLogged(false);
          }}
          className="w-full bg-rose-50 text-rose-600 p-4 rounded-[1.5rem] border border-rose-100 shadow-sm flex items-center justify-center gap-2 font-bold text-[13px] mt-8 hover:bg-rose-100 hover:border-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun Karyawan
        </motion.button>

      </motion.div>
    </div>
  );
}
