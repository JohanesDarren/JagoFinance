import React, { useState } from 'react';
import { 
  Smartphone, Laptop, ShieldCheck, Sparkles, BookOpen, 
  ArrowRight, Landmark, ArrowUpRight, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface LoginPageProps {
  onSelectRole: (role: 'staff' | 'finance') => void;
}

export default function LoginPage({ onSelectRole }: LoginPageProps) {
  const [hoveredCard, setHoveredCard] = useState<'staff' | 'finance' | null>(null);

  // Pre-filled credentials description for high authenticity
  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1800ad]/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#3b82f6]/10 blur-[150px] pointer-events-none" />

      {/* Top Brand Area */}
      <header className="p-6 lg:px-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1800ad] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#1800ad]/30">
            <BookOpen className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block leading-none">Jago Keuangan AI</span>
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase block mt-1">Multi-Portal Enterprise</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE BETA 2.0
          </span>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl w-full mx-auto px-6 py-10 flex flex-col items-center justify-center z-10 flex-grow">
        
        {/* Pitch Display Typography */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-extrabold tracking-widest px-3.5 py-1.5 rounded-full uppercase border border-[#1800ad]/30">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Expense Automator
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            Akses Dua Portal <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">Jago Keuangan AI</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto pt-1 font-sans">
            Solusi otomatisasi reimburse, kas bon, dan pembiayaan operasional real-time. Pilih peran login Anda untuk memulai uji coba ekosistem dual-portal.
          </p>
        </div>

        {/* Dual Portal Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Karyawan / Staff Portal */}
          <div 
            onClick={() => onSelectRole('staff')}
            onMouseEnter={() => setHoveredCard('staff')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group bg-slate-900/40 border transition-all duration-300 p-8 rounded-3xl cursor-pointer relative overflow-hidden backdrop-blur-sm shadow-xl hover:shadow-2xl flex flex-col justify-between min-h-[350px] ${
              hoveredCard === 'staff' 
                ? 'border-indigo-500 bg-[#0e1022]/60 -translate-y-1' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Icon Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${
                  hoveredCard === 'staff' ? 'bg-indigo-600/20 text-indigo-400 scale-105' : 'bg-slate-800/80 text-slate-300'
                }`}>
                  <Smartphone className="w-7 h-7" />
                </div>
                <span className="text-[10px] text-indigo-400/90 bg-indigo-500/15 font-bold tracking-widest px-2.5 py-1 rounded-md uppercase font-display">SIMULATOR HP</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-display">Karyawan / Staf Lapangan</h3>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  Simulasikan alur klaim karyawan secara mobile. Lakukan foto struk menggunakan OCR otomatis, ajukan permohonan kas bon instan, dan pantau status reimbursement langsung dari handphone.
                </p>
              </div>

              {/* Bullet checklist highlights */}
              <ul className="space-y-1.5 pt-2 text-[11px] text-slate-300 font-semibold font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Teknologi OCR Parser Struk (Instan)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Pengajuan Cash Advance (Kas Bon)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Histori Status & Notifikasi Real-time</span>
                </li>
              </ul>
            </div>

            {/* Bottom Button */}
            <div className="pt-6">
              <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 group-hover:scale-[1.01] transition-all text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20">
                <span>Masuk Portal Staf Biasa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Card 2: Direksi / Finance Team */}
          <div 
            onClick={() => onSelectRole('finance')}
            onMouseEnter={() => setHoveredCard('finance')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group bg-slate-900/40 border transition-all duration-300 p-8 rounded-3xl cursor-pointer relative overflow-hidden backdrop-blur-sm shadow-xl hover:shadow-2xl flex flex-col justify-between min-h-[350px] ${
              hoveredCard === 'finance' 
                ? 'border-[#0000a0] bg-[#090a2a]/60 -translate-y-1' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Icon Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${
                  hoveredCard === 'finance' ? 'bg-[#0000a0]/35 text-[#5c5cff] scale-105' : 'bg-slate-800/80 text-slate-300'
                }`}>
                  <Laptop className="w-7 h-7" />
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/15 font-bold tracking-widest px-2.5 py-1 rounded-md uppercase font-display">DASHBOARD WEB</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-display">Backoffice Eksekutif & Finance</h3>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  Masuk ke pusat kendali korporasi super lengkap. Verifikasi & setujui reimburse dalam satu klik, monitoring arus kas, kendalikan limit anggaran, kelola data payroll, serta integrasi API.
                </p>
              </div>

              {/* Bullet checklist highlights */}
              <ul className="space-y-1.5 pt-2 text-[11px] text-slate-300 font-semibold font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-450 shrink-0" />
                  <span>Satu-Klik Verifikasi Pembukuan Finansial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-450 shrink-0" />
                  <span>Buku Kas Kas Besar (Buku Kas Ledger)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-450 shrink-0" />
                  <span>Kalkulator Gaji & Audit Endpoint Terbuka</span>
                </li>
              </ul>
            </div>

            {/* Bottom Button */}
            <div className="pt-6">
              <button className="w-full py-3.5 bg-[#1a1aff] hover:bg-[#3333ff] group-hover:scale-[1.01] transition-all text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#1800ad]/40">
                <span>Masuk Portal Executive Finance</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Tips Panel */}
        <div className="mt-12 bg-indigo-950/20 border border-slate-800/80 rounded-2xl p-4 flex gap-3 text-xs text-slate-450 leading-relaxed max-w-2xl w-full">
          <Landmark className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="font-medium font-sans">
            <span className="text-white font-bold block">💡 Skenario Pengujian Sinkronisasi Dual-Portal:</span>
            Gunakan tab browser yang sama! Buka Portal Staff untuk melampirkan berkas pengeluaran, maka pengajuan Anda akan langsung muncul seketika di Portal Finance untuk diperiksa dan didebet saldonya.
          </p>
        </div>

      </main>

      {/* Footer copyright */}
      <footer className="p-6 border-t border-slate-900 text-center text-[10px] text-slate-500 z-10 font-medium">
        © 2026 PT JagoAI School Indonesia • Layanan Multi-level Otomasi Keuangan Digital Cerdas. All rights reserved.
      </footer>

    </div>
  );
}
