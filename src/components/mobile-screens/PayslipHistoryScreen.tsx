import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, AlertCircle, X, Printer, Building2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PayslipHistoryScreenProps {
  setCurrentScreen: (screen: any) => void;
  staffName?: string;
  bankName?: string;
  bankAccount?: string;
}

export default function PayslipHistoryScreen({ setCurrentScreen, staffName = 'Karyawan', bankName = 'Mandiri', bankAccount = '000000' }: PayslipHistoryScreenProps) {
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  const payslips = [
    { period: 'Mei 2026', desc: 'Gaji Pokok PM', amount: 18000000, allowance: 2000000, deduction: 500000 },
    { period: 'April 2026', desc: 'Gaji Pokok PM', amount: 18000000, allowance: 1500000, deduction: 300000 },
    { period: 'Maret 2026', desc: 'Gaji Pokok PM + THR', amount: 36000000, allowance: 1000000, deduction: 500000 }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-4 h-full relative">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => setCurrentScreen('profile')}
          className="p-1 px-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Profil
        </button>
        <span className="text-xs font-bold font-display text-slate-800">Riwayat Slip Gaji</span>
        <div className="w-8"></div>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Daftar Slip Gaji</span>
        
        {payslips.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-2 text-slate-500 mt-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-[10px] font-semibold text-slate-400">Belum ada slip gaji tersedia.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payslips.map((ps, idx) => (
              <div 
                key={idx}
                className="bg-white p-3 rounded-2xl border border-slate-100 shadow-4xs flex items-center justify-between hover:border-brand/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelectedPayslip(ps)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs group-hover:bg-brand group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h6 className="font-bold text-xs text-slate-800 leading-tight group-hover:text-brand transition-colors">{ps.period}</h6>
                    <p className="text-[9px] text-slate-500 mt-0.5">{ps.desc}</p>
                  </div>
                </div>

                <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-brand transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HTML Payslip Modal */}
      <AnimatePresence>
        {selectedPayslip && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 print:p-0 print:bg-white print:block"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none"
            >
              {/* Modal Actions (Hidden on Print) */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden shrink-0">
                <span className="font-bold text-slate-800 text-sm">Slip Gaji HTML</span>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrint} className="p-2 bg-indigo-50 text-indigo-700 hover:bg-brand hover:text-white rounded-xl transition-colors flex items-center gap-2 text-xs font-bold px-4">
                    <Printer className="w-4 h-4" /> Cetak / PDF
                  </button>
                  <button onClick={() => setSelectedPayslip(null)} className="p-2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Payslip Content */}
              <div className="p-6 md:p-8 overflow-y-auto bg-white flex-1 relative print:overflow-visible">
                {/* Decorative background watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Building2 className="w-64 h-64" />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="text-center border-b-2 border-slate-800 pb-4">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Slip Gaji Karyawan</h1>
                    <h2 className="text-base font-bold text-brand mt-1">PT. JAGO FINANCE TEKNOLOGI</h2>
                    <p className="text-xs text-slate-500 mt-1">Jl. Sudirman Kav 24, Jakarta Selatan, Indonesia 12920</p>
                  </div>

                  {/* Employee Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-500 mb-1">Nama Karyawan</p>
                      <p className="font-bold text-slate-800 text-sm">{staffName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Periode Gaji</p>
                      <p className="font-bold text-slate-800 text-sm">{selectedPayslip.period}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Metode Pembayaran</p>
                      <p className="font-bold text-slate-800">{bankName} - {bankAccount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Divisi / Jabatan</p>
                      <p className="font-bold text-slate-800">Operations / Product Manager</p>
                    </div>
                  </div>

                  {/* Earnings & Deductions */}
                  <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs border-b border-slate-200 pb-2">Pendapatan</h3>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Gaji Pokok</span>
                        <span className="font-mono font-medium">Rp {selectedPayslip.amount.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Tunjangan Operasional</span>
                        <span className="font-mono font-medium">Rp {selectedPayslip.allowance.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-100 text-emerald-700">
                        <span>Total Pendapatan</span>
                        <span className="font-mono">Rp {(selectedPayslip.amount + selectedPayslip.allowance).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs border-b border-slate-200 pb-2">Potongan</h3>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Pajak PPh 21</span>
                        <span className="font-mono font-medium text-rose-600">Rp {selectedPayslip.deduction.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-100 text-rose-700">
                        <span>Total Potongan</span>
                        <span className="font-mono">Rp {selectedPayslip.deduction.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Gaji Bersih Diterima</p>
                    <p className="text-3xl font-black text-brand font-mono">Rp {((selectedPayslip.amount + selectedPayslip.allowance) - selectedPayslip.deduction).toLocaleString('id-ID')}</p>
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-8 text-[10px] text-slate-400 font-medium italic">
                    <p>Dokumen ini dicetak otomatis dari sistem JagoFinance pada {new Date().toLocaleString('id-ID')}.</p>
                    <p>Pihak manajemen JagoFinance menyatakan bahwa dokumen ini sah dan tidak memerlukan tanda tangan basah.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
