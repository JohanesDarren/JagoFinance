import React, { useMemo } from 'react';
import { motion } from 'motion/react';
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
    employees, setSplitViewTx, pendingApprovals, companies, transactions
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen pb-20">
      
      {/* INJECT CUSTOM PREMIUM FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-space { font-family: 'Space Grotesk', monospace; }
        
        .premium-glass {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.03);
        }
        
        .mesh-bg {
          background-color: #fafafa;
          background-image: 
            radial-gradient(at 0% 0%, hsla(253,16%,7%,0.02) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,30%,0.02) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,30%,0.02) 0, transparent 50%);
        }
      `}} />

      {/* Ambient background for the whole page */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-10 right-20 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse duration-[7s]"></div>
      <div className="absolute top-40 left-10 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[10s]"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="font-jakarta space-y-8 md:space-y-12 px-2 md:px-4 max-w-7xl mx-auto pt-6"
      >

        {/* --- HEADER --- */}
        <motion.div variants={itemVariants} className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="w-full xl:w-auto">
            <div className="inline-flex items-center gap-2 mb-4 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white shadow-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[11px] font-bold text-slate-600 tracking-widest uppercase font-outfit">Sistem Terpadu Aktif</span>
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-outfit font-black text-slate-900 tracking-tight leading-tight">
              Selamat datang,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">JagoAI Global.</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <button className="h-14 px-8 flex-1 sm:flex-none rounded-full bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex items-center justify-center gap-2 border border-slate-100">
              <Activity className="w-5 h-5 text-indigo-500 shrink-0" /> Monitor
            </button>
            <button className="h-14 px-8 flex-1 sm:flex-none rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_15px_30px_rgba(15,23,42,0.3)] hover:-translate-y-1">
              Unduh Laporan
            </button>
          </div>
        </motion.div>

        {/* --- HERO METRICS (PILL CARDS) --- */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Card 1: Balance (Ultra Dark Pill) */}
          <div className="relative overflow-hidden bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.2)] group hover:-translate-y-1 transition-all duration-500">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-indigo-500/40 to-cyan-500/0 rounded-full blur-[50px] group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-8">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
                <DollarSign className="w-7 h-7 text-indigo-300" strokeWidth="2.5" />
              </div>
              <span className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-white tracking-widest uppercase font-outfit border border-white/10">Likuiditas</span>
            </div>
            
            <div className="relative z-10">
              <span className="text-slate-400 font-medium text-sm">Total Saldo Kas</span>
              <div className="font-space font-bold text-3xl lg:text-4xl mt-2 tracking-tight truncate flex items-baseline gap-1">
                <span className="text-xl text-slate-500 font-sans">Rp</span>
                {cashBalance.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Card 2: Inflow (Glass Pill) */}
          <div className="relative overflow-hidden premium-glass rounded-[2.5rem] p-8 group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(52,211,153,0.15)] cursor-pointer">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/20 rounded-full blur-[50px] group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-8">
              <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center border border-emerald-100 shadow-sm group-hover:rotate-6 transition-transform">
                <TrendingUp className="w-7 h-7 text-emerald-500" strokeWidth="2.5" />
              </div>
              <span className="bg-emerald-50 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-600 tracking-widest uppercase font-outfit border border-emerald-100">Bulan Ini</span>
            </div>
            
            <div className="relative z-10">
              <span className="text-slate-500 font-medium text-sm">Pemasukan Ops</span>
              <div className="font-space font-bold text-3xl lg:text-4xl mt-2 tracking-tight text-slate-900 truncate flex items-baseline gap-1">
                <span className="text-xl text-slate-400 font-sans">Rp</span>
                {totalInflowThisMonth.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Card 3: Outflow (Glass Pill) */}
          <div className="relative overflow-hidden premium-glass rounded-[2.5rem] p-8 group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(251,113,133,0.15)] cursor-pointer">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-300/20 rounded-full blur-[50px] group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-8">
              <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center border border-rose-100 shadow-sm group-hover:-rotate-6 transition-transform">
                <TrendingDown className="w-7 h-7 text-rose-500" strokeWidth="2.5" />
              </div>
              <span className="bg-rose-50 px-4 py-1.5 rounded-full text-xs font-bold text-rose-600 tracking-widest uppercase font-outfit border border-rose-100">Burn Rate</span>
            </div>
            
            <div className="relative z-10">
              <span className="text-slate-500 font-medium text-sm">Pengeluaran & Klaim</span>
              <div className="font-space font-bold text-3xl lg:text-4xl mt-2 tracking-tight text-slate-900 truncate flex items-baseline gap-1">
                <span className="text-xl text-slate-400 font-sans">Rp</span>
                {totalOutflowThisMonth.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Card 4: Users (Glass Pill) */}
          <div className="relative overflow-hidden premium-glass rounded-[2.5rem] p-8 group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] cursor-pointer">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-300/20 rounded-full blur-[50px] group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-8">
              <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center border border-indigo-100 shadow-sm group-hover:rotate-6 transition-transform">
                <Eye className="w-7 h-7 text-indigo-500" strokeWidth="2.5" />
              </div>
              <span className="bg-indigo-50 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-600 tracking-widest uppercase font-outfit border border-indigo-100">Sistem</span>
            </div>
            
            <div className="relative z-10">
              <span className="text-slate-500 font-medium text-sm">Total Pengguna</span>
              <div className="font-space font-bold text-3xl lg:text-4xl mt-2 tracking-tight text-slate-900 truncate flex items-baseline gap-1">
                {(props.admins?.length || 0) + (props.employees?.length || 0)}
                <span className="text-lg text-slate-400 font-sans ml-2">Akun Aktif</span>
              </div>
            </div>
          </div>

        </motion.div>

        {/* --- MAIN GRAPHIC CHART & DONUT --- */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 premium-glass rounded-[3rem] p-8 md:p-10 flex flex-col group overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-outfit font-black text-slate-900 tracking-tight">Arus Kas 6 Bulan</h3>
                <p className="text-slate-500 text-sm mt-1">Tren pendapatan vs biaya operasional</p>
              </div>
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 font-outfit">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div> Pemasukan
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 font-outfit">
                  <div className="w-4 h-1.5 rounded-full bg-rose-400"></div> Pengeluaran
                </div>
              </div>
            </div>
            
            {/* The SVG Graphic */}
            <div className="w-full h-[250px] md:h-[320px] mt-auto relative">
              <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#fb7185" />
                  </linearGradient>
                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Aesthetic Grid */}
                {[0, 60, 120, 180].map((y, i) => (
                  <g key={y}>
                    <line x1="45" y1={y} x2="590" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 3 ? "" : "4 6"} />
                    <text x="35" y={y + 4} className="text-[11px] fill-slate-400 font-space font-bold" textAnchor="end">
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
                    <rect key={`bar-${i}`} x={x - 16} y={y} width="32" height={h} fill="url(#barGrad)" rx="16" className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                  );
                })}

                {/* Line */}
                <path 
                  d={`M ${chartData.months.map((m, i) => `${90 + (i * 85)} ${chartData.scaleY(m.outflow)}`).join(' L ')}`}
                  fill="none" 
                  stroke="url(#lineGrad)" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  filter="url(#softGlow)"
                />
                
                {/* Dots */}
                {chartData.months.map((m, i) => (
                  <circle key={`pt-${i}`} cx={90 + (i * 85)} cy={chartData.scaleY(m.outflow)} r="6" fill="#fff" stroke="#f43f5e" strokeWidth="3" className="hover:r-8 hover:stroke-[4px] transition-all duration-300 cursor-pointer drop-shadow-md" />
                ))}

                {/* Axis Labels */}
                {chartData.months.map((m, i) => (
                  <text key={`lbl-${i}`} x={90 + (i * 85)} y="212" textAnchor="middle" className="text-[11px] font-outfit font-bold fill-slate-500 uppercase tracking-widest">{m.label}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Minimalist Donut Chart */}
          <div className="premium-glass rounded-[3rem] p-8 md:p-10 flex flex-col justify-between items-center group overflow-hidden">
            <div className="w-full text-center">
              <h3 className="text-2xl font-outfit font-black text-slate-900 tracking-tight">Alokasi Biaya</h3>
              <p className="text-slate-500 text-sm mt-1">Distribusi pengeluaran aktif</p>
            </div>

            <div className="relative w-56 h-56 my-8 shrink-0 drop-shadow-2xl">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {categoryEntries.length === 0 ? (
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#f1f5f9" strokeWidth="22" />
                ) : (
                  categoryEntries.map(([cat, val], idx) => {
                    const percent = val / (totalExpenseAllocated || 1);
                    const strokeDash = `${percent * 226.19} ${226.19}`; // 2 * pi * 36
                    const strokeOffset = -accumulatedAngle;
                    accumulatedAngle += percent * 226.19;
                    const colors = ['#6366f1', '#06b6d4', '#f43f5e', '#a855f7', '#fbbf24'];
                    return (
                      <circle 
                        key={idx} cx="50" cy="50" r="36" fill="none" 
                        stroke={colors[idx % colors.length]} strokeWidth="22" 
                        strokeDasharray={strokeDash} strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 hover:strokeWidth-[26px] cursor-pointer"
                      />
                    );
                  })
                )}
                {/* Center Cutout for aesthetic */}
                <circle cx="50" cy="50" r="25" fill="#ffffff" opacity="0.8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-outfit font-black text-slate-400 tracking-widest uppercase mb-1">Total</span>
                <span className="font-space font-bold text-slate-900 text-xl truncate max-w-[90px]">
                  {totalOutflowThisMonth >= 1000000 ? `${(totalOutflowThisMonth/1000000).toFixed(1)}M` : '0'}
                </span>
              </div>
            </div>

            <div className="w-full space-y-3">
              {categoryEntries.slice(0, 3).map(([cat, val], idx) => {
                const colors = ['bg-[#6366f1]', 'bg-[#06b6d4]', 'bg-[#f43f5e]'];
                return (
                  <div key={cat} className="flex justify-between items-center bg-white/60 p-3 rounded-2xl border border-white shadow-sm hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length]} shrink-0 shadow-inner`}></div>
                      <span className="text-sm font-bold text-slate-700 truncate">{cat}</span>
                    </div>
                    <span className="text-sm font-space font-bold text-slate-900 ml-2 shrink-0">{(val/1000000).toFixed(1)}M</span>
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>

        {/* --- LIST WIDGETS --- */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Aesthetic Pending Action List */}
          <div className="premium-glass rounded-[3rem] p-8 md:p-10 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-outfit font-black text-slate-900 tracking-tight">Antrian Verifikasi</h3>
                <p className="text-slate-500 text-sm mt-1">Klaim staf yang butuh tinjauan</p>
              </div>
              <div className="w-12 h-12 rounded-[1.2rem] bg-amber-100 text-amber-600 flex items-center justify-center font-outfit font-black text-lg shrink-0 border border-amber-200">
                {pendingApprovals.length}
              </div>
            </div>

            <div className="space-y-4">
              {pendingApprovals.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-white/40 rounded-[2rem] border border-dashed border-slate-200">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
                  <span className="font-bold text-base text-center text-slate-600">Semua antrian bersih.</span>
                </div>
              ) : (
                pendingApprovals.slice(0, 4).map((tx, i) => (
                  <motion.div 
                    key={tx.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-[1.5rem] bg-white/80 border border-white hover:bg-white transition-all shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] gap-4 sm:gap-0 cursor-pointer group"
                    onClick={() => setSplitViewTx(tx)}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                      <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-50 border border-indigo-100 text-indigo-600 font-outfit font-black flex items-center justify-center text-sm shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        {(employees.find(e => e.id === tx.employeeId)?.name || "U")[0]}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-bold text-base text-slate-900 block truncate">{employees.find(e => e.id === tx.employeeId)?.name || "Unknown"}</span>
                        <span className="text-xs text-slate-500 font-medium mt-1 block truncate">{tx.category} • {tx.merchant}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-space font-bold text-slate-900 text-base shrink-0">Rp {tx.amount.toLocaleString('id-ID')}</span>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white group-hover:bg-indigo-500 transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Minimalist Top App List */}
          <div className="premium-glass rounded-[3rem] p-8 md:p-10 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-outfit font-black text-slate-900 tracking-tight">Performa Integrasi</h3>
                <p className="text-slate-500 text-sm mt-1">Top revenue bulan ini</p>
              </div>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0 bg-indigo-50 px-4 py-2 rounded-full">Lihat Semua</button>
            </div>

            <div className="space-y-4">
              {topApps.slice(0, 4).map((app, idx) => (
                <motion.div 
                  key={app.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-[1.5rem] bg-white/80 border border-white hover:bg-white transition-all shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] gap-4 sm:gap-0"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                    <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-xl bg-slate-50 border border-slate-100 shrink-0`}>
                      {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '💎'}
                    </div>
                    <div className="overflow-hidden">
                      <h6 className="font-bold text-base text-slate-900 truncate">{app.name}</h6>
                      <span className="text-xs font-bold text-emerald-500 mt-1 block flex items-center gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Aktif
                      </span>
                    </div>
                  </div>
                  <span className="font-space font-bold text-base text-slate-900 shrink-0 self-end sm:self-auto bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    {app.monthlyRevenue > 0 ? `Rp ${(app.monthlyRevenue/1000000).toFixed(1)}M` : '-'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}

