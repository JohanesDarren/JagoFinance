import React from 'react';
import { ArrowLeft, FileText, Download, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface PayslipHistoryScreenProps {
  setCurrentScreen: (screen: any) => void;
}

export default function PayslipHistoryScreen({ setCurrentScreen }: PayslipHistoryScreenProps) {
  const payslips = [
    { period: 'Mei 2026', desc: 'Gaji Pokok PM', amount: 18000000 },
    { period: 'April 2026', desc: 'Gaji Pokok PM', amount: 18000000 },
    { period: 'Maret 2026', desc: 'Gaji Pokok PM + THR', amount: 36000000 }
  ];

  const handleDownloadPDF = (ps: typeof payslips[0]) => {
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SLIP GAJI KARYAWAN', 105, 20, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('PT. Jago Finance Teknologi', 105, 28, { align: 'center' });
    
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(11);
    doc.text(`Periode Gaji: ${ps.period}`, 20, 50);
    doc.text(`Keterangan: ${ps.desc}`, 20, 60);
    doc.text(`Metode Pembayaran: Transfer Bank (Mandiri)`, 20, 70);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Gaji Bersih: Rp ${ps.amount.toLocaleString('id-ID')}`, 20, 90);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text(`Dokumen ini dicetak otomatis dari sistem JagoFinance pada ${new Date().toLocaleString('id-ID')}.`, 20, 110);
    
    doc.save(`Slip_Gaji_${ps.period.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="p-4 space-y-4">
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
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Unduh Slip Gaji (PDF)</span>
        
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
                className="bg-white p-3 rounded-2xl border border-slate-100 shadow-4xs flex items-center justify-between hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                    <FileText className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h6 className="font-bold text-xs text-slate-800 leading-tight">{ps.period}</h6>
                    <p className="text-[9px] text-slate-500 mt-0.5">{ps.desc} • Mandiri</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDownloadPDF(ps)}
                  className="p-1.5 px-3 bg-indigo-50 text-indigo-700 hover:bg-brand hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
