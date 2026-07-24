import React from 'react';
import { ArrowLeft, Building2, Users, Camera, FileText, ChevronRight, Activity, PieChart } from 'lucide-react';
import { Company, Transaction } from '../../types';
import { motion } from 'motion/react';

interface CompanyDetailScreenProps {
  company: Company;
  setCurrentScreen: (screen: string) => void;
  staffTransactions: Transaction[];
  handleOpenScanner: (type: 'reimburse' | 'cash_advance', specificCompanyId?: string) => void;
  handleOpenForm: (type: 'reimburse' | 'cash_advance', imageBase64?: string, imageName?: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CompanyDetailScreen({ 
  company, 
  setCurrentScreen, 
  staffTransactions,
  handleOpenScanner,
  handleOpenForm
}: CompanyDetailScreenProps) {
  
  // Filter transactions for this specific company
  const companyTransactions = staffTransactions; // In a real app with M:N schema, this would be staffTransactions.filter(t => t.companyId === company.id)
  
  const totalApproved = companyTransactions
    .filter(t => t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = companyTransactions.filter(t => t.status === 'Pending').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center gap-3 relative z-10 bg-white border-b border-slate-100">
        <button 
          onClick={() => setCurrentScreen('companies')}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 overflow-hidden">
          <h2 className="font-bold text-slate-800 truncate">{company.name}</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Dashboard Perusahaan</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Banner */}
        <div className="bg-indigo-600 p-6 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight leading-tight">{company.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-100 text-[10px] font-bold uppercase rounded-md border border-emerald-400/20">Active Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 -mt-4 relative z-20">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenScanner('reimburse', company.id)}
              className="bg-white p-4 rounded-[1.5rem] shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center gap-2 text-center"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Scan Struk</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenForm('reimburse')} // Ideally passes companyId if backend supported it easily
              className="bg-white p-4 rounded-[1.5rem] shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center gap-2 text-center"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Input Manual</span>
            </motion.button>
          </div>

          {/* Stats Summary */}
          <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Aktivitas Anda (Bulan Ini)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 mb-1">Total Disetujui</p>
                <p className="font-black text-emerald-600 text-lg">Rp {totalApproved.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 mb-1">Menunggu Review</p>
                <p className="font-black text-amber-500 text-lg">{pendingCount} Pengajuan</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
