import React from 'react';
import { FileText, ChevronRight, Download, LogOut } from 'lucide-react';
import { Transaction } from '../../types';

interface ProfileScreenProps {
  staffName: string;
  employeeEmail: string;
  setCurrentScreen: (screen: any) => void;
  setSelectedTx: (tx: Transaction | null) => void;
  onLogout?: () => void;
  setIsLogged: (logged: boolean) => void;
}

export default function ProfileScreen({
  staffName,
  employeeEmail,
  setCurrentScreen,
  setSelectedTx,
  onLogout,
  setIsLogged
}: ProfileScreenProps) {
  return (
    <div className="p-4 space-y-4 pb-24 h-full overflow-y-auto bg-slate-50/50">
      
      <div className="flex justify-center items-center mb-2">
        <span className="text-sm font-black font-display text-slate-800 tracking-tight">Akun & Payroll</span>
      </div>

      {/* Profile section block card */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50/20"></div>
        
        <div className="relative z-10 pt-2">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="Avatar profile large" 
            className="w-20 h-20 rounded-full border-[3px] border-white shadow-md object-cover"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">✓</div>
        </div>

        <div className="relative z-10">
          <h5 className="font-black text-sm text-slate-800 leading-tight">{staffName}</h5>
          <p className="text-[10px] text-brand font-bold mt-1">Project Manager • Operations</p>
          <p className="text-[9px] text-slate-400 font-medium mt-1">ID Karyawan: EMP-003</p>
        </div>

        <div className="w-full bg-slate-50 rounded-2xl p-3.5 text-left space-y-2.5 mt-2 relative z-10 border border-slate-100/50">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-medium">Email Kantor</span>
            <span className="font-semibold text-slate-700 text-right">{employeeEmail}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-medium">Bank Rekening</span>
            <span className="font-bold text-slate-800 text-right">Mandiri <span className="font-mono text-brand bg-indigo-50 px-1.5 py-0.5 rounded ml-1">5540982738</span></span>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('edit-profile')}
          className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-[10px] rounded-xl hover:bg-slate-50 transition-colors relative z-10 shadow-xs mt-1"
        >
          Edit Profil
        </button>
      </div>

      {/* History Navigation Button */}
      <button 
        onClick={() => {
          setCurrentScreen('history');
          setSelectedTx(null);
        }}
        className="w-full bg-white p-3.5 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between text-left hover:border-slate-200 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h6 className="font-bold text-sm text-slate-800">Riwayat Pengajuan</h6>
            <p className="text-[10px] text-slate-400">Pantau status transaksi & klaim</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Payroll Payslip Card listings */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Unduh Slip Gaji (PDF)</span>
        
        <div className="space-y-1.5">
          {[
            { period: 'Mei 2026', desc: 'Gaji Pokok PM', amount: 18000000 },
            { period: 'April 2026', desc: 'Gaji Pokok PM', amount: 18000000 },
            { period: 'Maret 2026', desc: 'Gaji Pokok PM + THR', amount: 36000000 }
          ].map((ps, idx) => (
            <div 
              key={idx}
              className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-4xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                  <FileText className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <h6 className="font-bold text-[10px] text-slate-800 leading-tight">{ps.period}</h6>
                  <p className="text-[8px] text-slate-400 mt-0.5">{ps.desc} • Mandiri</p>
                </div>
              </div>

              <button 
                onClick={() => alert(`Simulasi mengunduh Slip Gaji PDF JagoAI Periode ${ps.period} senilai Rp ${ps.amount.toLocaleString('id-ID')}!`)}
                className="p-1 px-2 bg-indigo-50 text-indigo-700 hover:bg-brand hover:text-white rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Minta PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={() => {
          if (onLogout) onLogout();
          else setIsLogged(false);
        }}
        className="w-full bg-rose-50 text-rose-600 p-3.5 rounded-2xl border border-rose-100 shadow-3xs flex items-center justify-center gap-2 font-bold text-xs mt-6 hover:bg-rose-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Keluar Akun
      </button>

    </div>
  );
}
