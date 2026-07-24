import React from 'react';
import { Building, ChevronRight, Lock, Sparkles, Building2 } from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="p-4 pt-6 flex justify-between items-center relative z-10 bg-white border-b border-slate-100">
        <span className="text-sm font-black font-display text-slate-800 tracking-wider uppercase">Perusahaan Anda</span>
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Building className="w-4 h-4" />
        </div>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 p-4 pb-24 overflow-y-auto space-y-4"
      >
        {companies.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 mt-16">
            <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center">
              <Lock className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2 font-display tracking-tight">Belum Bergabung</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">
                Akun Anda belum diundang ke perusahaan manapun. Silakan hubungi Admin atau HRD perusahaan Anda untuk mengundang email Anda.
              </p>
            </div>
          </div>
        ) : (
          <>
            <motion.div variants={fadeUp} className="bg-indigo-600 p-5 rounded-3xl text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-black tracking-tight relative z-10">Total Perusahaan: {companies.length}</h3>
              <p className="text-indigo-100 text-sm mt-1 relative z-10">Pilih perusahaan untuk melihat detail atau mengajukan klaim spesifik.</p>
            </motion.div>

            <div className="space-y-3 mt-4">
              {companies.map((comp) => (
                <motion.button 
                  key={comp.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCompany(comp);
                    setCurrentScreen('company-detail');
                  }}
                  className="w-full bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h6 className="font-bold text-[15px] text-slate-800 group-hover:text-indigo-700 transition-colors">{comp.name}</h6>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md">Aktif</span>
                        <span className="text-[10px] font-medium text-slate-400">Terdaftar</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
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
