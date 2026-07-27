import React from 'react';
import { Building, ChevronRight, Lock, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Company } from '../../types';
import { motion } from 'motion/react';

interface CompaniesScreenProps {
  companies: Company[];
  setCurrentScreen: (screen: string) => void;
  setSelectedCompany: (company: Company) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function CompaniesScreen({ companies, setCurrentScreen, setSelectedCompany }: CompaniesScreenProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden font-sans">
      
      {/* Premium Header */}
      <div className="px-5 pt-8 pb-4 flex justify-between items-center relative z-10 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-xl">
        <h1 className="text-2xl font-black text-blue-950 tracking-tight">Afiliasi</h1>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-950 shadow-sm border border-slate-200">
          <Building className="w-5 h-5" />
        </div>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 px-5 pb-32 overflow-y-auto custom-scrollbar space-y-6"
      >
        {companies.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-blue-50 text-blue-950 rounded-full flex items-center justify-center mb-6 shadow-inner border border-blue-100">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-[17px] font-black text-blue-950 mb-2 tracking-tight">Belum Bergabung</h2>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
              Akun Anda belum diundang ke perusahaan manapun. Silakan hubungi Admin atau HRD perusahaan Anda.
            </p>
          </div>
        ) : (
          <>
            {/* Neo-Banking Stats Card */}
            <motion.div variants={fadeUp} className="relative group mt-2">
              <div className="bg-gradient-to-br from-white to-blue-50 text-blue-950 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">
                {/* Geometric Circular Overlays */}
                <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-blue-900/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 bg-white/50 border border-blue-900/10 px-3 py-1.5 rounded-full backdrop-blur-md mb-3 w-fit">
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      <span className="text-[10px] font-bold tracking-widest text-blue-900 uppercase">
                        Total Entitas Terhubung
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-4xl font-black font-display tracking-tight leading-none text-blue-950">{companies.length}</h3>
                      <span className="text-sm font-bold text-slate-500 ml-1">Perusahaan</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white/50 rounded-[1.25rem] flex items-center justify-center border border-blue-900/10 backdrop-blur-md shrink-0 shadow-sm">
                    <Building2 className="w-7 h-7 text-blue-700" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* List Header */}
            <div className="flex justify-between items-end px-1 pt-2">
              <span className="text-[13px] font-black uppercase tracking-widest text-slate-400">Daftar Perusahaan</span>
            </div>

            {/* Floating Bento List */}
            <div className="space-y-3">
              {companies.map((comp) => (
                <motion.button 
                  key={comp.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCompany(comp);
                    setCurrentScreen('company-detail');
                  }}
                  className="w-full bg-white p-4 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between text-left group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center group-hover:bg-blue-950 group-hover:text-white transition-colors duration-300 shrink-0 border border-blue-100/50">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h6 className="font-black text-[15px] text-blue-950 group-hover:text-blue-700 transition-colors leading-tight">{comp.name}</h6>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">Terverifikasi</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-blue-50 transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
