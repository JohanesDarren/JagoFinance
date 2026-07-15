import React, { useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Sparkles, 
  Eye, CheckCircle, SlidersHorizontal, ArrowUpRight, BarChart3,
  Activity, ArrowRight, Zap, Target
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function OverviewScreen(props: WebScreenProps) {
  const {
    cashBalance, connectedApps, totalInflowThisMonth, totalOutflowThisMonth,
    averageMonthlyBurn, runwayMonths, categoryEntries, totalExpenseAllocated,
    employees, setSplitViewTx, pendingApprovals, branches, transactions
  } = props;

  let accumulatedAngle = 0;

  // Calculate dynamic chart data for the last 6 months
  const chartData = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const months = Array.from({length: 6}).map((_, i) => {
      const d = new Date(currentYear, currentMonth - 5 + i, 1);
      return {
        label: d.toLocaleString('id-ID', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        inflow: 0,
        outflow: 0
      };
    });

    if (transactions) {
      transactions.forEach(tx => {
        if (tx.status !== 'Approved') return;
        const txDate = new Date(tx.date);
        const m = months.find(m => m.month === txDate.getMonth() && m.year === txDate.getFullYear());
        if (m) {
          if (tx.type === 'income') m.inflow += tx.amount;
          else if (tx.type === 'reimburse' || tx.type === 'expense_manual') m.outflow += tx.amount;
        }
      });
    }

    const maxVal = Math.max(1000000, ...months.flatMap(m => [m.inflow, m.outflow]));
    
    return {
      months,
      maxVal,
      scaleY: (val: number) => 180 - (val / maxVal) * 140
    };
  }, [transactions]);

  const topApps = [...connectedApps].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 relative overflow-x-hidden">
      
      {/* INJECT CUSTOM PREMIUM FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-space { font-family: 'Space Grotesk', monospace; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.05);
        }
        
        .mesh-bg {
          background-color: #f6f8fb;
          background-image: 
            radial-gradient(at 0% 0%, hsla(253,16%,7%,0.03) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,30%,0.03) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,30%,0.03) 0, transparent 50%);
        }
      `}} />

      {/* Ambient background for the whole page */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] mesh-bg -z-10 pointer-events-none rounded-[3rem]"></div>

      <div className="font-jakarta space-y-6 md:space-y-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 px-2 md:px-4">
          <div className="w-full xl:w-auto">
            <div className="inline-flex items-center gap-2 mb-3 bg-indigo-50/80 px-4 py-2 rounded-full border border-indigo-100">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] md:text-[11px] font-bold text-indigo-600 tracking-widest uppercase font-outfit">Sistem Terpadu Aktif</span>
            </div>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-outfit font-black text-[#0B0F19] tracking-tight leading-tight break-words">
              Selamat datang,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">JagoAI Global.</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full xl:w-auto">
            <button className="h-12 md:h-14 px-6 md:px-8 flex-1 sm:flex-none rounded-full bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 shrink-0" /> Monitor
            </button>
            <button className="h-12 md:h-14 px-6 md:px-8 flex-1 sm:flex-none rounded-full bg-[#0B0F19] text-white font-bold hover:bg-slate-800 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 text-sm md:text-base">
              Unduh Laporan
            </button>
          </div>
        </div>

        {/* --- HERO METRICS (FLUID CARDS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          
          {/* Card 1: Balance (Dark Elegant) */}
          <div className="relative overflow-hidden bg-[#0B0F19] text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(11,15,25,0.15)] group hover:-translate-y-1 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-indigo-500/30 to-transparent rounded-full blur-[40px] md:blur-[60px] -mr-16 -mt-16 md:-mr-20 md:-mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center border border-white/10 group-hover:-rotate-6 transition-transform shrink-0">
                <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-indigo-300" strokeWidth="2.5" />
              </div>
              <span className="bg-white/10 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-white tracking-widest uppercase font-outfit border border-white/5 whitespace-nowrap">Likuiditas</span>
            </div>
            
            <div className="relative z-10">
              <span className="text-slate-400 font-medium text-xs md:text-sm">Total Saldo Kas</span>
              <div className="font-space font-bold text-3xl lg:text-4xl xl:text-5xl mt-1 md:mt-2 tracking-tight truncate">
                <span className="text-xl md:text-2xl text-slate-500 mr-1 font-sans opacity-70">Rp</span>
                {cashBalance.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Card 2: Inflow (Glass White) */}
          <div className="relative overflow-hidden glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 group hover:-translate-y-1 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-100/50 rounded-full blur-[40px] md:blur-[60px] -mr-16 -mt-16 md:-mr-20 md:-mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center border border-emerald-100 group-hover:-rotate-6 transition-transform shrink-0">
                <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" strokeWidth="2.5" />
              </div>
              <span className="bg-emerald-50 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-emerald-600 tracking-widest uppercase font-outfit border border-emerald-100 whitespace-nowrap">Bulan Ini</span>
            </div>
            
            <div className="relative z-10">
              <span className="text-slate-500 font-medium text-xs md:text-sm">Pemasukan Ops</span>
              <div className="font-space font-bold text-3xl lg:text-4xl xl:text-5xl mt-1 md:mt-2 tracking-tight text-[#0B0F19] truncate">
                <span className="text-xl md:text-2xl text-slate-400 mr-1 font-sans">Rp</span>
                {totalInflowThisMonth.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Card 3: Outflow (Glass White) */}
          <div className="relative overflow-hidden glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 group hover:-translate-y-1 transition-transform duration-500 md:col-span-2 xl:col-span-1">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-rose-100/50 rounded-full blur-[40px] md:blur-[60px] -mr-16 -mt-16 md:-mr-20 md:-mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-50 rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center border border-rose-100 group-hover:-rotate-6 transition-transform shrink-0">
                <TrendingDown className="w-6 h-6 md:w-7 md:h-7 text-rose-500" strokeWidth="2.5" />
              </div>
              <span className="bg-rose-50 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-rose-600 tracking-widest uppercase font-outfit border border-rose-100 whitespace-nowrap">Burn Rate</span>
            </div>
            
            <div className="relative z-10">
              <span className="text-slate-500 font-medium text-xs md:text-sm">Pengeluaran & Klaim</span>
              <div className="font-space font-bold text-3xl lg:text-4xl xl:text-5xl mt-1 md:mt-2 tracking-tight text-[#0B0F19] truncate">
                <span className="text-xl md:text-2xl text-slate-400 mr-1 font-sans">Rp</span>
                {totalOutflowThisMonth.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

        </div>

        {/* --- MAIN GRAPHIC CHART & DONUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col group overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-outfit font-black text-[#0B0F19]">Arus Kas 6 Bulan</h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Tren pendapatan vs biaya operasional</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-white/50 px-4 py-2 md:px-5 md:py-3 rounded-full border border-white">
                <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-600 font-outfit whitespace-nowrap">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-indigo-500"></div> Pemasukan
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-600 font-outfit whitespace-nowrap">
                  <div className="w-3 h-1 md:w-4 md:h-1.5 rounded-full bg-rose-400"></div> Pengeluaran
                </div>
              </div>
            </div>
            
            {/* The SVG Graphic */}
            <div className="w-full h-[220px] md:h-[300px] mt-auto relative">
              <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#f87171" />
                  </linearGradient>
                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Aesthetic Grid */}
                {[0, 60, 120, 180].map((y, i) => (
                  <g key={y}>
                    <line x1="45" y1={y} x2="590" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 3 ? "" : "5 5"} />
                    <text x="35" y={y + 4} className="text-[10px] md:text-[11px] fill-slate-400 font-space font-medium" textAnchor="end">
                      {i === 3 ? '0' : `${((chartData.maxVal * (180 - y) / 180) / 1000000).toFixed(0)}M`}
                    </text>
                  </g>
                ))}

                {/* Bars */}
                {chartData.months.map((m, i) => {
                  const x = 90 + (i * 85);
                  const y = chartData.scaleY(m.inflow);
                  const h = Math.max(2, 180 - y);
                  return (
                    <rect key={`bar-${i}`} x={x - 15} y={y} width="30" height={h} fill="url(#barGrad)" rx="15" className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                  );
                })}

                {/* Line */}
                <path 
                  d={`M ${chartData.months.map((m, i) => `${90 + (i * 85)} ${chartData.scaleY(m.outflow)}`).join(' L ')}`}
                  fill="none" 
                  stroke="url(#lineGrad)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  filter="url(#softGlow)"
                />
                
                {/* Dots */}
                {chartData.months.map((m, i) => (
                  <circle key={`pt-${i}`} cx={90 + (i * 85)} cy={chartData.scaleY(m.outflow)} r="5" md:r="6" fill="#fff" stroke="#f43f5e" strokeWidth="3" className="hover:r-8 transition-all duration-300 cursor-pointer" />
                ))}

                {/* Axis Labels */}
                {chartData.months.map((m, i) => (
                  <text key={`lbl-${i}`} x={90 + (i * 85)} y="210" textAnchor="middle" className="text-[10px] md:text-[12px] font-outfit font-bold fill-slate-400 uppercase tracking-widest">{m.label}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Minimalist Donut Chart */}
          <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col justify-between items-center group overflow-hidden">
            <div className="w-full text-center sm:text-left lg:text-center">
              <h3 className="text-xl md:text-2xl font-outfit font-black text-[#0B0F19]">Alokasi Biaya</h3>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Distribusi pengeluaran aktif</p>
            </div>

            <div className="relative w-40 h-40 md:w-56 md:h-56 my-6 md:my-8 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-2xl">
                {categoryEntries.length === 0 ? (
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                ) : (
                  categoryEntries.map(([cat, val], idx) => {
                    const percent = val / (totalExpenseAllocated || 1);
                    const strokeDash = `${percent * 238.76} ${238.76}`;
                    const strokeOffset = -accumulatedAngle;
                    accumulatedAngle += percent * 238.76;
                    const colors = ['#6366f1', '#38bdf8', '#f43f5e', '#a855f7', '#fcd34d'];
                    return (
                      <circle 
                        key={idx} cx="50" cy="50" r="38" fill="none" 
                        stroke={colors[idx % colors.length]} strokeWidth="20" 
                        strokeDasharray={strokeDash} strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 hover:strokeWidth-[24px] cursor-pointer"
                      />
                    );
                  })
                )}
                {/* Center Cutout for aesthetic */}
                <circle cx="50" cy="50" r="28" fill="#f8fafc" opacity="0.5" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <span className="text-[9px] md:text-[10px] font-outfit font-black text-slate-400 tracking-widest uppercase">Total</span>
                <span className="font-space font-bold text-slate-900 text-base md:text-lg truncate max-w-[80px]">
                  {totalOutflowThisMonth >= 1000000 ? `${(totalOutflowThisMonth/1000000).toFixed(1)}M` : '0'}
                </span>
              </div>
            </div>

            <div className="w-full space-y-2.5 md:space-y-3">
              {categoryEntries.slice(0, 3).map(([cat, val], idx) => {
                const colors = ['bg-[#6366f1]', 'bg-[#38bdf8]', 'bg-[#f43f5e]'];
                return (
                  <div key={cat} className="flex justify-between items-center bg-white/40 p-2 md:p-3 rounded-xl">
                    <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                      <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${colors[idx % colors.length]} shrink-0`}></div>
                      <span className="text-xs md:text-sm font-bold text-slate-700 truncate">{cat}</span>
                    </div>
                    <span className="text-xs md:text-sm font-space font-bold text-slate-900 ml-2 shrink-0">{(val/1000000).toFixed(1)}M</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* --- LIST WIDGETS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Aesthetic Pending Action List */}
          <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-outfit font-black text-[#0B0F19]">Antrian Verifikasi</h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Klaim staf yang butuh tinjauan</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-outfit font-black text-base md:text-lg shrink-0">
                {pendingApprovals.length}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {pendingApprovals.length === 0 ? (
                <div className="py-10 md:py-12 flex flex-col items-center justify-center text-slate-400">
                  <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-300 mb-3 md:mb-4" />
                  <span className="font-bold text-sm md:text-base text-center">Semua antrian bersih.</span>
                </div>
              ) : (
                pendingApprovals.slice(0, 4).map(tx => (
                  <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] bg-white/60 border border-white hover:bg-white transition-all shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto overflow-hidden">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 text-slate-600 font-outfit font-black flex items-center justify-center text-xs md:text-sm shrink-0">
                        {(employees.find(e => e.id === tx.employeeId)?.name || "U")[0]}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-bold text-sm md:text-base text-slate-900 block truncate">{employees.find(e => e.id === tx.employeeId)?.name || "Unknown"}</span>
                        <span className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5 block truncate">{tx.category} • {tx.merchant}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-space font-bold text-slate-900 text-sm md:text-base shrink-0">Rp {tx.amount.toLocaleString('id-ID')}</span>
                      <button 
                        onClick={() => setSplitViewTx(tx)}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-[#0B0F19] text-white hover:scale-110 transition-transform shrink-0"
                      >
                        <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Minimalist Top App List */}
          <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-outfit font-black text-[#0B0F19]">Performa Integrasi</h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Top revenue bulan ini</p>
              </div>
              <button className="text-xs md:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0">Lihat Semua</button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {topApps.slice(0, 4).map((app, idx) => (
                <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] bg-white/60 border border-white hover:bg-white transition-all shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] gap-4 sm:gap-0">
                  <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto overflow-hidden">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center text-lg md:text-xl bg-slate-50 border border-slate-100 shrink-0`}>
                      {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '💎'}
                    </div>
                    <div className="overflow-hidden">
                      <h6 className="font-bold text-sm md:text-base text-slate-900 truncate">{app.name}</h6>
                      <span className="text-[10px] md:text-xs font-medium text-emerald-500 mt-0.5 block flex items-center gap-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aktif
                      </span>
                    </div>
                  </div>
                  <span className="font-space font-bold text-sm md:text-base text-slate-900 shrink-0 self-end sm:self-auto">
                    {app.monthlyRevenue > 0 ? `Rp ${(app.monthlyRevenue/1000000).toFixed(1)}M` : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
