import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Sparkles, 
  Eye, CheckCircle, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function OverviewScreen(props: WebScreenProps) {
  const {
    transactions, cashBalance, connectedApps, totalInflowThisMonth, totalOutflowThisMonth,
    averageMonthlyBurn, runwayMonths, categoryEntries, totalExpenseAllocated,
    employees, setSplitViewTx, pendingApprovals
  } = props;

  const [hoveredCategory, setHoveredCategory] = useState<{name: string, value: number, color: string} | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number}>({ x: 0, y: 0 });

  let accumulatedAngle = 0;

  // Dynamic Chart Data logic
  const now = new Date();
  const chartMonths = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    chartMonths.push({ 
      label: d.toLocaleString('id-ID', { month: 'short' }), 
      month: d.getMonth(), 
      year: d.getFullYear(), 
      inflow: 0, 
      outflow: 0 
    });
  }

  transactions.forEach(t => {
    if (t.status !== 'Approved') return;
    const tDate = new Date(t.date);
    const m = chartMonths.find(m => m.month === tDate.getMonth() && m.year === tDate.getFullYear());
    if (m) {
      if (t.type === 'income') m.inflow += t.amount;
      else if (t.type === 'reimburse' || (t.type as string) === 'reimbursement' || t.type === 'expense_manual' || t.type === 'cash_advance') m.outflow += t.amount;
    }
  });

  const maxVal = Math.max(...chartMonths.map(m => Math.max(m.inflow, m.outflow)), 10000000); // min scale 10jt
  
  // Y goes from 170 (0) to 20 (maxVal) => height = 150
  const getY = (val: number) => 170 - ((val / maxVal) * 150);
  const getHeight = (val: number) => (val / maxVal) * 150;

  const formatYAxis = (val: number) => {
    if (val >= 1000000000) return (val/1000000000).toFixed(1) + 'M';
    if (val >= 1000000) return (val/1000000).toFixed(0) + 'jt';
    if (val >= 1000) return (val/1000).toFixed(0) + 'rb';
    return val.toString();
  };

  // Generate path for the line chart
  const pathD = chartMonths.map((m, i) => {
    const cx = 109 + (i * 85);
    const cy = getY(m.outflow);
    return `${i === 0 ? 'M' : 'L'} ${cx} ${cy}`;
  }).join(' ');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Dashboard Head */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/5 border border-brand/10 text-brand text-xs font-black tracking-widest uppercase mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            Sistem Aktif
          </div>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight">Executive Cockpit</h2>
          <p className="text-base text-slate-500 mt-2 font-medium max-w-xl">Status finansial real-time perusahaan Anda. Pantau metrik kunci, runway, dan profitabilitas dalam satu pandangan.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {props.setActiveTab && (
            <button 
              onClick={() => props.setActiveTab && props.setActiveTab('inbound')}
              className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm rounded-[1.25rem] shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Catat Uang Masuk
            </button>
          )}
        </div>
      </div>

      {/* 4 Hero Stats Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100/50 shadow-xl shadow-indigo-900/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-indigo-600 rounded-3xl w-14 h-14 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <DollarSign className="w-7 h-7" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50/80 px-3 py-1.5 rounded-2xl border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5" /> 100% Likuid
            </span>
          </div>
          
          <div className="mt-6 relative z-10">
            <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-[0.25em]">Saldo Kas Aktif</span>
            <h3 className="text-3xl font-black font-mono tracking-tight mt-2 text-slate-900">
              <span className="text-slate-400 text-2xl mr-1">Rp</span> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-900">{cashBalance.toLocaleString('id-ID')}</span>
            </h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100/50 shadow-xl shadow-emerald-900/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 text-emerald-500 rounded-3xl w-14 h-14 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> +{connectedApps.filter(a=>a.status==='active').length} App
            </span>
          </div>
          
          <div className="mt-6 relative z-10">
            <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-[0.25em]">Pemasukan Bulan Ini</span>
            <h3 className="text-3xl font-black font-mono tracking-tight mt-2 text-slate-900">
              <span className="text-slate-400 text-2xl mr-1">Rp</span> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-800">{totalInflowThisMonth.toLocaleString('id-ID')}</span>
            </h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100/50 shadow-xl shadow-rose-900/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/10 via-transparent to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="p-4 bg-gradient-to-br from-rose-50 to-white border border-rose-100 text-rose-500 rounded-3xl w-14 h-14 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <TrendingDown className="w-7 h-7" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100">
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" /> Operational
            </span>
          </div>
          
          <div className="mt-6 relative z-10">
            <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-[0.25em]">Pengeluaran Total</span>
            <h3 className="text-3xl font-black font-mono tracking-tight mt-2 text-slate-900">
              <span className="text-slate-400 text-2xl mr-1">Rp</span> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-rose-800">{totalOutflowThisMonth.toLocaleString('id-ID')}</span>
            </h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100/50 shadow-xl shadow-amber-900/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-100 text-amber-500 rounded-3xl w-14 h-14 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-7 h-7" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100">
              Burn: Rp {(averageMonthlyBurn/1000000).toFixed(0)}M
            </span>
          </div>
          
          <div className="mt-6 relative z-10">
            <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-[0.25em]">Estimasi Runway</span>
            <h3 className="text-3xl font-black font-mono tracking-tight mt-2 text-slate-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-amber-700">{runwayMonths} Bulan</span>
            </h3>
          </div>
        </div>

      </div>

      {/* Profit & Loss Chart and Expense Breakdown Grid Row info */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* P&L Chart custom SVG based view */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-2xl font-black text-slate-900 font-display tracking-tight">Grafik Profit & Loss 2026</h4>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">Histori Pemasukan (Bar) vs Pengeluaran (Line).</p>
            </div>
            <div className="flex items-center gap-5 text-sm font-bold text-slate-600 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
              <span className="flex items-center gap-2.5">
                <span className="w-4 h-4 bg-gradient-to-b from-brand to-indigo-600 rounded-lg shadow-sm"></span> Pemasukan
              </span>
              <span className="flex items-center gap-2.5">
                <span className="w-5 h-1.5 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full inline-block shadow-sm"></span> Pengeluaran
              </span>
            </div>
          </div>

          <div className="w-full h-72 pt-4">
            <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
              <line x1="50" y1="20" x2="580" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="50" y1="70" x2="580" y2="70" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="50" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="6" />
              <line x1="50" y1="170" x2="580" y2="170" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="50" y1="200" x2="580" y2="200" stroke="#e2e8f0" strokeWidth="1.5" />

              <text x="35" y="24" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">{formatYAxis(maxVal)}</text>
              <text x="35" y="74" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">{formatYAxis(maxVal * 0.66)}</text>
              <text x="35" y="124" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">{formatYAxis(maxVal * 0.33)}</text>
              <text x="35" y="174" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">0</text>

              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4338ca" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {chartMonths.map((m, i) => {
                const barHeight = getHeight(m.inflow) || 2; // Min height for visibility
                const yPos = getY(m.inflow) === 170 ? 168 : getY(m.inflow);
                const xPos = 90 + (i * 85);
                const isCurrentMonth = m.month === now.getMonth() && m.year === now.getFullYear();
                
                return (
                  <rect key={`bar-${i}`} x={xPos} y={yPos} width="38" height={barHeight} fill="url(#barGradient)" rx="4" opacity={isCurrentMonth ? "0.4" : "1"} strokeDasharray={isCurrentMonth ? "4" : "0"} stroke={isCurrentMonth ? "#4338ca" : "none"} strokeWidth={isCurrentMonth ? "2" : "0"} className="hover:opacity-60 transition-opacity cursor-pointer" />
                );
              })}

              <path 
                d={pathD} 
                fill="none" 
                stroke="#f43f5e" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {chartMonths.map((m, i) => {
                const cx = 109 + (i * 85);
                const cy = getY(m.outflow);
                return (
                  <circle key={`dot-${i}`} cx={cx} cy={cy} r="6" fill="#fff" stroke="#f43f5e" strokeWidth="3" className="hover:r-8 transition-all cursor-pointer shadow-sm" />
                );
              })}

              {chartMonths.map((m, i) => (
                <text key={`label-${i}`} x={109 + (i * 85)} y="225" textAnchor="middle" className="text-[13px] font-black text-slate-500 fill-slate-500 uppercase tracking-widest">{m.label}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Expense Breakdown SVG Pie Donut Chart */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h4 className="text-2xl font-black text-slate-900 font-display tracking-tight">Alokasi Biaya</h4>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">Distribusi pengeluaran riil.</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8 relative z-10 py-2">
            <div className="relative w-48 h-48 drop-shadow-xl">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {categoryEntries.length === 0 ? (
                   <circle cx="50" cy="50" r="36" fill="none" stroke="#f1f5f9" strokeWidth="26" />
                ) : (
                  categoryEntries.map(([cat, val], idx) => {
                    const percent = val / totalExpenseAllocated;
                    const strokeDash = `${percent * 226.19} ${226.19}`;
                    const strokeOffset = -accumulatedAngle;
                    accumulatedAngle += percent * 226.19;

                    const colors = ['#6366f1', '#3b82f6', '#f43f5e', '#a855f7', '#fbbf24', '#22d3ee'];
                    const activeColor = colors[idx % colors.length];

                    return (
                      <circle 
                        key={idx}
                        cx="50" 
                        cy="50" 
                        r="36" 
                        fill="none" 
                        stroke={activeColor} 
                        strokeWidth="28" 
                        strokeDasharray={strokeDash}
                        strokeDashoffset={strokeOffset}
                        className="transition-all hover:strokeWidth-[32px] cursor-pointer"
                        onMouseEnter={() => setHoveredCategory({ name: cat, value: val, color: activeColor })}
                        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })
                )}
                <circle cx="50" cy="50" r="22" fill="#ffffff" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-0.5">TOTAL</span>
                <span className="text-[10px] font-black font-mono text-slate-900 leading-tight">
                  Rp {totalOutflowThisMonth.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="w-full space-y-3 pt-2 text-sm">
              {categoryEntries.length === 0 ? (
                <div className="text-center text-slate-500 italic text-xs">Belum ada pengeluaran.</div>
              ) : (
                categoryEntries.slice(0, 3).map(([cat, val], idx) => {
                  const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-rose-500', 'bg-purple-500', 'bg-amber-500'];
                  return (
                    <div key={cat} className="flex justify-between items-center text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3 font-bold">
                        <span className={`w-4 h-4 rounded-full shadow-md ${colors[idx % colors.length]}`}></span>
                        <span className="text-slate-800">{cat}</span>
                      </div>
                      <span className="font-black font-mono text-slate-900">Rp {val.toLocaleString('id-ID')}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Table and Product Leaderboard widget */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Pending Action mini widget */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-2xl font-black text-slate-900 font-display tracking-tight">Verifikasi Klaim Tertunda</h4>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">Pengajuan staf yang butuh tinjauan mendesak.</p>
            </div>
            <div className="text-xs font-black bg-amber-50 text-amber-600 px-4 py-2.5 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              {pendingApprovals.length} Menunggu
            </div>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="p-16 text-center bg-slate-50/50 border-2 border-slate-200 border-dashed rounded-[2rem] space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                <CheckCircle className="w-10 h-10 text-emerald-400" strokeWidth="2" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-800 block">Semua Beres!</span>
                <span className="text-sm text-slate-500 mt-1 block">Tidak ada antrian klaim.</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-4">
                    <th className="p-4 pl-6">Staff</th>
                    <th className="p-4">Merchant</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Nominal</th>
                    <th className="p-4 pr-6 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-bold">
                  {pendingApprovals.slice(0, 4).map((tx) => (
                    <tr key={tx.id} className="bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-indigo-900/5 transition-all group rounded-2xl border border-transparent hover:border-slate-200">
                      <td className="p-4 pl-6 rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                            {(employees.find(e => e.id === tx.employeeId)?.name || "U")[0]}
                          </div>
                          <div className="leading-tight">
                            <span className="font-black text-slate-900 block text-[14px] group-hover:text-brand transition-colors">{employees.find(e => e.id === tx.employeeId)?.name || "Unknown"}</span>
                            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{tx.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-800 truncate max-w-[150px]">{tx.merchant}</td>
                      <td className="p-4">
                        <span className="text-[11px] bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full shadow-sm">{tx.category}</span>
                      </td>
                      <td className="p-4 font-mono font-black text-slate-900 text-[14px]">Rp {tx.amount.toLocaleString('id-ID')}</td>
                      <td className="p-4 pr-6 text-right rounded-r-2xl">
                        <button 
                          onClick={() => setSplitViewTx(tx)}
                          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-xl hover:bg-slate-900 hover:text-white inline-flex items-center gap-2 transition-all shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Revenue Leaderboard Widget */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
          <div>
            <h4 className="text-2xl font-black text-slate-900 font-display tracking-tight">Leaderboard App</h4>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">Kontribusi revenue tertinggi.</p>
          </div>

          <div className="space-y-4 pt-2">
            {connectedApps.map((app, idx) => {
              const rankings = ['🥇', '🥈', '🥉'];
              return (
                <div key={app.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand/30 hover:-translate-y-1 transition-all flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      {rankings[idx] || '🔹'}
                    </div>
                    <div>
                      <h6 className="font-black text-[15px] text-slate-900 leading-tight group-hover:text-brand transition-colors">{app.name}</h6>
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full inline-block mt-2 uppercase tracking-widest ${
                        app.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>{app.status === 'active' ? 'AKTIF' : 'NON-AKTIF'}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[15px] font-black text-slate-900">Rp {(app.monthlyRevenue/1000000).toFixed(1)}M</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Floating Tooltip for Pie Chart */}
      {hoveredCategory && (
        <div 
          className="fixed z-50 bg-white p-3.5 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 pointer-events-none transform -translate-x-1/2 -translate-y-[120%]"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: hoveredCategory.color }}></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{hoveredCategory.name}</span>
          </div>
          <div className="font-mono font-black text-sm text-slate-900">
            Rp {hoveredCategory.value.toLocaleString('id-ID')}
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-white border-r-[6px] border-r-transparent drop-shadow-sm"></div>
        </div>
      )}

    </div>
  );
}

