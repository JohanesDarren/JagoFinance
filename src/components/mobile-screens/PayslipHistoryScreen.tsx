import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, AlertCircle, X, Printer, Building2, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PayslipHistoryScreenProps {
  setCurrentScreen: (screen: any) => void;
  staffName?: string;
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
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function PayslipHistoryScreen({ setCurrentScreen, staffName = 'Karyawan', bankName = 'Mandiri', bankAccount = '000000' }: PayslipHistoryScreenProps) {
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  const payslips = [
    { period: 'Mei 2026', desc: 'Gaji Pokok PM', amount: 18000000, allowance: 2000000, deduction: 500000 },
    { period: 'April 2026', desc: 'Gaji Pokok PM', amount: 18000000, allowance: 1500000, deduction: 300000 },
    { period: 'Maret 2026', desc: 'Gaji Pokok PM + THR', amount: 36000000, allowance: 1000000, deduction: 500000 }
  ];

  const handlePrint = () => {
    const originalTitle = document.title;
    if (selectedPayslip) {
      document.title = `Slip Gaji ${selectedPayslip.period}`;
    }
    window.print();
    document.title = originalTitle;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden font-sans"
    >
      <div className="p-5 pt-8 space-y-6 relative z-10 flex flex-col h-full pb-28 custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between text-blue-950">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentScreen('profile')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <span className="text-[13px] font-black font-display tracking-widest uppercase">Riwayat Slip Gaji</span>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-blue-950">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          
          {payslips.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm text-center space-y-4"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-[1.25rem] flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-600">Belum ada slip gaji tersedia.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {payslips.map((ps, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUp}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer group"
                  onClick={() => setSelectedPayslip(ps)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-[1rem] flex items-center justify-center text-blue-950 group-hover:bg-blue-950 group-hover:text-white transition-colors shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="font-black text-[15px] text-blue-950 leading-tight">{ps.period}</h6>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{ps.desc}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 flex items-center justify-center text-slate-300 group-hover:text-blue-950 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* HTML Payslip Modal (Premium Digital Receipt) */}
      <AnimatePresence>
        {selectedPayslip && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-blue-950/90 backdrop-blur-md flex flex-col items-center justify-center p-5 print:p-0 print:bg-white print:block"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white w-full max-w-lg rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none relative"
            >
              {/* Jagged receipt edge */}
              <div className="absolute top-16 left-4 right-4 h-1 border-t-2 border-dashed border-slate-200 print:hidden"></div>

              {/* Modal Actions (Hidden on Print) */}
              <div className="p-5 flex justify-between items-center bg-white print:hidden shrink-0 relative z-10 pb-6 border-b border-dashed border-slate-200">
                <span className="font-black tracking-widest uppercase text-blue-950 text-[11px]">Slip Gaji Elektronik</span>
                <div className="flex items-center gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint} 
                    className="h-10 px-5 bg-blue-950 text-white rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Printer className="w-4 h-4" /> Cetak / PDF
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPayslip(null)} 
                    className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Payslip Content */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white flex-1 relative print:overflow-visible text-blue-950 font-sans">
                {/* Decorative background watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Building2 className="w-64 h-64" />
                </div>

                <div className="relative z-10 space-y-8">
                  {/* Header */}
                  <div className="text-center border-b-2 border-blue-950 pb-6">
                    <h1 className="text-3xl font-black font-display tracking-tight uppercase mb-2">Slip Gaji</h1>
                    <h2 className="text-sm font-black tracking-widest uppercase">PT. Jago Finance Teknologi</h2>
                    <p className="text-[11px] font-bold text-slate-500 mt-2">Jl. Sudirman Kav 24, Jakarta Selatan, 12920</p>
                  </div>

                  {/* Employee Info */}
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-xs bg-slate-50 p-6 rounded-[1.5rem]">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Nama Karyawan</p>
                      <p className="font-bold text-blue-950 text-sm">{staffName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Periode Gaji</p>
                      <p className="font-bold text-blue-950 text-sm">{selectedPayslip.period}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Metode Pembayaran</p>
                      <p className="font-bold text-blue-950">{bankName} - {bankAccount}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Divisi / Jabatan</p>
                      <p className="font-bold text-blue-950">Operations / Product Manager</p>
                    </div>
                  </div>

                  {/* Earnings & Deductions */}
                  <div className="grid grid-cols-1 gap-8 pt-2">
                    <div className="space-y-4">
                      <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-200 pb-2">Pendapatan</h3>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span>Gaji Pokok</span>
                        <span className="font-mono">Rp {selectedPayslip.amount.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span>Tunjangan Operasional</span>
                        <span className="font-mono">Rp {selectedPayslip.allowance.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-black pt-4 border-t-2 border-blue-950">
                        <span>Total Pendapatan</span>
                        <span className="font-mono text-lg">Rp {(selectedPayslip.amount + selectedPayslip.allowance).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-200 pb-2">Potongan</h3>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span>Pajak PPh 21</span>
                        <span className="font-mono">Rp {selectedPayslip.deduction.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-black pt-4 border-t-2 border-blue-950">
                        <span>Total Potongan</span>
                        <span className="font-mono text-lg">Rp {selectedPayslip.deduction.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="mt-8 bg-blue-950 text-white p-8 rounded-[1.5rem] text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gaji Bersih Diterima</p>
                      <p className="text-4xl font-black font-mono tracking-tighter">Rp {((selectedPayslip.amount + selectedPayslip.allowance) - selectedPayslip.deduction).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-8 text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    <p>Dokumen dicetak dari sistem JagoFinance pada {new Date().toLocaleString('id-ID')}.</p>
                    <p>Dokumen ini sah dan tidak memerlukan tanda tangan basah.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
