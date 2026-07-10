import React from 'react';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';

interface ForgotScreenProps {
  forgotEmail: string;
  setForgotEmail: (val: string) => void;
  forgotSuccess: boolean;
  handleForgotSubmit: (e: React.FormEvent) => void;
  setCurrentScreen: (screen: any) => void;
}

export default function ForgotScreen({
  forgotEmail,
  setForgotEmail,
  forgotSuccess,
  handleForgotSubmit,
  setCurrentScreen
}: ForgotScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6">
      <div>
        <button 
          onClick={() => setCurrentScreen('auth')}
          className="p-1.5 bg-white text-slate-500 rounded-lg shadow-2xs border border-slate-100 flex items-center gap-1 text-[11px] mt-2 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </button>
        
        <h3 className="text-lg font-bold text-slate-900 font-display">Lupa Kata Sandi</h3>
        <p className="text-xs text-slate-500 mt-1">Masukkan alamat email terdaftar Anda untuk memicu pengiriman kode verifikasi pengaturan ulang.</p>
      </div>

      <form onSubmit={handleForgotSubmit} className="space-y-4 my-auto">
        {forgotSuccess ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Tautan Terkirim!</strong>
              <p className="mt-1 text-[10px] text-emerald-600">Periksa kotak masuk {forgotEmail} Anda untuk melanjutkan pengaturan ulang kata sandi.</p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Anda</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none" 
                placeholder="nama@jagoai.id"
                required
              />
            </div>
          </div>
        )}

        {!forgotSuccess && (
          <button 
            type="submit"
            className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl hover:bg-opacity-95 transition-all"
          >
            Kirim Tautan Atur Ulang
          </button>
        )}
      </form>

      <div className="text-center text-[10px] text-slate-400">
        <span className="cursor-pointer font-medium hover:underline" onClick={() => setCurrentScreen('auth')}>Kembali ke login</span>
      </div>
    </div>
  );
}
