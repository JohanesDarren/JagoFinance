import React from 'react';
import { 
  Users, Sparkles, CheckCircle, AlertTriangle, Play, UserPlus, Mail, Loader2, Banknote
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function PayrollScreen(props: WebScreenProps) {
  const {
    employees, payrollDivision, setPayrollDivision, payrollMessage,
    handleMassPayroll, onInviteEmployee, companies
  } = props;

  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteLoading, setInviteLoading] = React.useState(false);
  const [inviteMessage, setInviteMessage] = React.useState<{success: boolean, message: string} | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-white text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-indigo-100/50">
            <Users className="w-8 h-8" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black font-display text-slate-900 tracking-tight">Manajemen Tim & Gaji</h2>
            <p className="text-base text-slate-500 mt-2 font-medium">Manajemen database staf PT JagoAI. Terbitkan dan transfer payroll bulanan massal dengan sekali klik rasa bank.</p>
          </div>
        </div>
      </div>

      {/* Mass Payroll Generator Control Center panel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 rounded-[3rem] shadow-2xl shadow-indigo-900/30 border border-slate-700/50 space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-brand/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-black tracking-widest uppercase mb-4 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Generator Otomatis
            </div>
            <h4 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
              Pemrosesan Payroll Massal
            </h4>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-xl font-medium">Sistem akan merekam pengeluaran gaji ke kas ledger, mengurangi dana kas, dan menerbitkan invoice pembayaran ke Mandiri API gateway secara serentak.</p>
          </div>
        </div>

        {payrollMessage && (
          <div className={`relative z-10 p-5 px-6 rounded-2xl text-sm font-bold border shadow-xl animate-in slide-in-from-bottom-2 flex items-center gap-4 ${
            payrollMessage.type === 'success' 
              ? 'bg-emerald-500/20 backdrop-blur-md text-emerald-100 border-emerald-500/40' 
              : 'bg-rose-500/20 backdrop-blur-md text-rose-100 border-rose-500/40'
          }`}>
            {payrollMessage.type === 'success' ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-rose-400" />}
            {payrollMessage.text}
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-end mt-6 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-sm">
          <div className="flex-1 space-y-3 w-full">
            <label className="text-[11px] uppercase font-black tracking-[0.2em] text-indigo-200 block">Pilih Divisi Pembayaran</label>
            <div className="relative">
              <select 
                value={payrollDivision}
                onChange={(e) => setPayrollDivision(e.target.value)}
                className="w-full pl-6 pr-12 py-4 bg-white/10 backdrop-blur-md text-white rounded-[1.5rem] border border-white/20 outline-none focus:border-indigo-400 focus:bg-white/20 text-[15px] font-bold cursor-pointer transition-all shadow-inner appearance-none"
              >
                <option value="Semua" className="text-slate-900 font-bold">Semua Karyawan ({employees.length} Staff)</option>
                <option value="Engineering" className="text-slate-900 font-bold">Divisi Engineering</option>
                <option value="Product" className="text-slate-900 font-bold">Divisi Product</option>
                <option value="Operations" className="text-slate-900 font-bold">Divisi Operations</option>
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-indigo-200"></div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleMassPayroll}
            className="p-4 px-10 bg-gradient-to-r from-brand to-indigo-500 hover:from-brand hover:to-indigo-400 text-white font-black text-[15px] rounded-[1.5rem] flex items-center justify-center gap-3 transition-all w-full md:w-auto shadow-xl hover:shadow-2xl hover:shadow-brand/40 border border-indigo-400/30 hover:-translate-y-1"
          >
            <Play className="w-5 h-5 fill-white/20" /> Terbitkan & Bayar Payroll Massal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Invite New Employee Panel */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 lg:col-span-1 flex flex-col justify-between h-full">
          <div>
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-inner mb-6">
              <UserPlus className="w-7 h-7" strokeWidth="2.5" />
            </div>
            <h3 className="font-black font-display text-slate-900 text-2xl tracking-tight">Undang Karyawan</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">Masukkan email karyawan yang telah melakukan registrasi mandiri untuk menghubungkan akun mereka ke perusahaan Anda.</p>
          </div>
          
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!inviteEmail || !onInviteEmployee) return;
              setInviteLoading(true);
              const res = await onInviteEmployee(inviteEmail);
              setInviteMessage(res);
              setInviteLoading(false);
              if (res.success) setInviteEmail('');
              setTimeout(() => setInviteMessage(null), 5000);
            }}
            className="w-full flex flex-col gap-4 mt-8 relative"
          >
            <div className="relative w-full">
              <Mail className="absolute left-5 top-4 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="email.karyawan@contoh.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[15px] font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={inviteLoading}
              className="w-full px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              {inviteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Kirim Undangan</span>}
            </button>

            {inviteMessage && (
              <div className={`absolute top-[105%] left-0 right-0 p-4 rounded-[1.25rem] text-sm font-bold shadow-lg border animate-in slide-in-from-top-2 z-10 ${
                inviteMessage.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {inviteMessage.message}
              </div>
            )}
          </form>
        </div>

        {/* Employee directories listings */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden pb-6 p-6 lg:col-span-2">
          <div className="p-4 pb-6 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-2xl font-display tracking-tight px-2">Direktori Staf</h3>
            <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-black shadow-sm border border-indigo-100">
              Total {employees.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[15px] border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-400 font-black uppercase tracking-widest text-[12px] px-4">
                  <th className="p-4 pl-6">Karyawan</th>
                  <th className="p-4">Divisi & Peran</th>
                  <th className="p-4">Gaji Pokok / Bln</th>
                  <th className="p-4 pr-6 text-right">Rekening</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 font-semibold">
                {employees.map((emp) => (
                  <tr key={emp.id} className="bg-white hover:bg-slate-50 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 border border-slate-100 group rounded-[2rem] overflow-hidden">
                    <td className="p-5 pl-6 rounded-l-[2rem]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-100 to-brand/10 text-brand flex items-center justify-center font-black text-lg shadow-sm border border-brand/10 group-hover:bg-brand group-hover:text-white transition-colors duration-500">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="leading-tight">
                          <span className="font-black text-slate-900 block text-base group-hover:text-brand transition-colors">{emp.name}</span>
                          <span className="text-xs text-slate-400 font-mono font-semibold block mt-1">{emp.email} • ID: {emp.id.substring(0,6)}...</span>
                        </div>
                      </div>
                      {companies && emp.companyId && (
                        <div className="mt-3">
                          <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest font-black">
                            {companies.find(b => b.id === emp.companyId)?.name || "Cabang Pusat"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="bg-slate-50 text-slate-700 px-4 py-1.5 rounded-full text-xs font-black border border-slate-200/60 shadow-sm capitalize">{emp.division}</span>
                        <span className="text-sm text-slate-500 font-bold ml-1">{emp.role}</span>
                      </div>
                    </td>
                    <td className="p-5 font-mono font-black text-slate-900 text-lg">Rp {emp.salary.toLocaleString('id-ID')}</td>
                    <td className="p-5 rounded-r-[2rem] pr-6">
                      <div className="flex items-center justify-end gap-3 p-3 px-4 rounded-[1rem] w-max ml-auto group-hover:bg-indigo-50 transition-colors border border-transparent group-hover:border-indigo-100">
                        <div className="text-right leading-tight">
                          <span className="font-black text-sm text-slate-900 block group-hover:text-indigo-900">{emp.bankName}</span>
                          <span className="font-mono text-xs text-slate-500 block mt-0.5 group-hover:text-indigo-700">{emp.bankAccount}</span>
                        </div>
                        <Banknote className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" strokeWidth="2" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

