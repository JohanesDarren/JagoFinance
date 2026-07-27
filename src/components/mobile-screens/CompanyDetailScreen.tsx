import React from 'react';
import { ArrowLeft, Building2, Camera, FileText, Activity, CreditCard, ChevronRight, CheckCircle2, History } from 'lucide-react';
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
  
  const approvedTx = companyTransactions.filter(t => t.status === 'Approved');
  const totalApprovedAmount = approvedTx.reduce((sum, t) => sum + t.amount, 0);
  const totalApprovedCount = approvedTx.length;

  const pendingTx = companyTransactions.filter(t => t.status === 'Pending');
  const pendingCount = pendingTx.length;
  const pendingAmount = pendingTx.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden font-sans">
      
      {/* Premium Header */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-xl z-20">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('companies')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-950 shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Afiliasi</span>
          <h2 className="font-black text-blue-950 text-[14px] truncate max-w-[150px]">{company.name}</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200">
          <Building2 className="w-5 h-5 text-blue-950" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
        
        {/* Banner Premium Light */}
        <div className="px-5 mb-6 pt-2">
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 text-blue-950 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">
            {/* Geometric Concentric Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-blue-900/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white/50 rounded-2xl flex items-center justify-center backdrop-blur-md border border-blue-900/10 shadow-sm">
                  <Building2 className="w-6 h-6 text-blue-700" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    Verified
                  </span>
                </div>
              </div>
              
              <h3 className="font-black font-display text-[26px] tracking-tight leading-tight max-w-[85%]">{company.name}</h3>
              <p className="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Company ID: {company.id?.substring(0,8) || 'CMP-2983'}</p>
            </div>
          </div>
        </div>

        <div className="px-5 space-y-6">
          
          {/* Action Buttons (Bento Style) */}
          <div className="space-y-3">
             <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Kirim Pengajuan Baru</span>
             <div className="grid grid-cols-2 gap-4">
               <motion.button 
                 whileTap={{ scale: 0.97 }}
                 onClick={() => handleOpenScanner('reimburse', company.id)}
                 className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 text-center group hover:border-slate-200 hover:bg-slate-50 transition-colors h-36"
               >
                 <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-blue-700 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors">
                   <Camera className="w-7 h-7" />
                 </div>
                 <div>
                   <span className="text-[14px] font-black text-blue-950 block">Scan OCR</span>
                 </div>
               </motion.button>
               
               <motion.button 
                 whileTap={{ scale: 0.97 }}
                 onClick={() => handleOpenForm('reimburse')} 
                 className="bg-white p-5 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center gap-4 text-center group hover:border-slate-200 transition-colors h-36"
               >
                 <div className="w-14 h-14 bg-slate-50 text-blue-700 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors border border-slate-100">
                   <FileText className="w-7 h-7" />
                 </div>
                 <div>
                   <span className="text-[14px] font-black text-blue-950 block">Input Manual</span>
                 </div>
               </motion.button>
             </div>
          </div>

          {/* User Specific Stats (Bento Style) */}
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Statistik Anda
            </span>
            
            {/* Total Approved Card */}
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-4">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Reimbursement (Selesai)</p>
                  <p className="font-black text-blue-950 text-2xl tracking-tight leading-none">Rp {totalApprovedAmount.toLocaleString('id-ID')}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500">Frekuensi Disetujui</span>
                <span className="text-[13px] font-black text-blue-950 bg-white px-3 py-1 rounded-full shadow-sm">{totalApprovedCount} kali pencairan</span>
              </div>
              
            </div>

            {/* Pending / Processing Card */}
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-4">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                  <History className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Dalam Proses Review</p>
                  <p className="font-black text-blue-950 text-2xl tracking-tight leading-none">Rp {pendingAmount.toLocaleString('id-ID')}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500">Jumlah Dokumen</span>
                <span className="text-[13px] font-black text-blue-950 bg-white px-3 py-1 rounded-full shadow-sm">{pendingCount} dokumen</span>
              </div>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
