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
  companyName?: string;
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
  bankAccount,
  companyName
}: ProfileScreenProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden font-sans">
      
      {/* Clean Header Area */}
      <div className="px-5 pt-8 pb-4 flex justify-between items-center relative z-10 sticky top-0 bg-white/90 backdrop-blur-xl">
        <h1 className="text-2xl font-black text-blue-950 tracking-tight">Profil Saya</h1>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-950 shadow-sm border border-slate-200">
          <UserCircle className="w-5 h-5" />
        </div>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 p-5 pb-28 overflow-y-auto space-y-5 relative z-10 custom-scrollbar"
      >
        {/* Profile Bento Card */}
        <motion.div 
          variants={fadeUp}
          className="bg-slate-50 p-6 rounded-[2.5rem] flex flex-col justify-center items-center text-center relative overflow-hidden"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="relative z-10"
          >
            <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-sm">
              <img 
                src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                alt="Avatar profile large" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full border-4 border-slate-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </motion.div>

          <div className="relative z-10 mt-5">
            <h5 className="font-black text-2xl text-blue-950 tracking-tight leading-none">{staffName}</h5>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 rounded-full text-[11px] font-bold mt-3 shadow-sm">
              <Building className="w-3.5 h-3.5" />
              <span>Operations Division</span>
            </div>
          </div>
        </motion.div>

        {/* Info Grid (Bento style) */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-[2rem] flex flex-col gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mb-2 shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
            <span className="font-bold text-blue-950 text-[13px] truncate">{employeeEmail}</span>
          </div>

          <div className="bg-slate-50 p-5 rounded-[2rem] flex flex-col gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mb-2 shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rekening</span>
            <span className="font-bold text-blue-950 text-[13px] truncate">{bankName} - {bankAccount}</span>
          </div>
        </motion.div>

        {/* Edit Profile Button */}
        <motion.button 
          variants={fadeUp}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentScreen('edit-profile')}
          className="w-full py-4 bg-blue-950 text-white font-bold text-[12px] uppercase tracking-widest rounded-[1.5rem] hover:bg-black transition-colors flex items-center justify-center gap-2"
        >
          <UserCircle className="w-5 h-5" /> Pengaturan Profil
        </motion.button>

        {/* Action List Section */}
        <div className="space-y-4 mt-8 pt-4 border-t border-slate-100">
          <motion.span variants={fadeUp} className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Navigasi Utama</motion.span>
          

          {/* Payslip History Button */}
          <motion.button 
            variants={fadeUp}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('payslip-history')}
            className="w-full bg-white p-4 rounded-[2rem] border-2 border-slate-50 flex items-center justify-between text-left group hover:border-slate-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-blue-950 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h6 className="font-black text-[15px] text-blue-950">Riwayat Slip Gaji</h6>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">Unduh dokumen PDF</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-blue-950 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>

        {/* Logout Button */}
        <motion.button 
          variants={fadeUp}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (onLogout) onLogout();
            else setIsLogged(false);
          }}
          className="w-full bg-rose-50 text-rose-600 p-4 rounded-[1.5rem] flex items-center justify-center gap-2 font-black text-[13px] mt-8 hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </motion.button>

      </motion.div>
    </div>
  );
}
