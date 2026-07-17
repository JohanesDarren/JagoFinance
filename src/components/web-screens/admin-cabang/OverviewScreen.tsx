import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Sparkles, 
  Eye, CheckCircle, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function OverviewScreen(props: WebScreenProps) {
  const {
    cashBalance, connectedApps, totalInflowThisMonth, totalOutflowThisMonth,
    averageMonthlyBurn, runwayMonths, categoryEntries, totalExpenseAllocated,
    employees, setSplitViewTx, pendingApprovals
  } = props;

  let accumulatedAngle = 0;

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

              <text x="35" y="24" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">500jt</text>
              <text x="35" y="74" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">300jt</text>
              <text x="35" y="124" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">100jt</text>
              <text x="35" y="174" className="text-[11px] fill-slate-400 font-mono font-bold" textAnchor="end">0</text>

              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4338ca" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              <rect x="90" y="60" width="38" height="140" fill="url(#barGradient)" rx="10" className="hover:opacity-85 transition-opacity cursor-pointer" />
              <rect x="175" y="80" width="38" height="120" fill="url(#barGradient)" rx="10" className="hover:opacity-85 transition-opacity cursor-pointer" />
              <rect x="260" y="50" width="38" height="150" fill="url(#barGradient)" rx="10" className="hover:opacity-85 transition-opacity cursor-pointer" />
              <rect x="345" y="45" width="38" height="155" fill="url(#barGradient)" rx="10" className="hover:opacity-85 transition-opacity cursor-pointer" />
              <rect x="430" y="75" width="38" height="125" fill="url(#barGradient)" rx="10" className="hover:opacity-85 transition-opacity cursor-pointer" />
              <rect x="515" y="65" width="38" height="135" fill="url(#barGradient)" rx="10" opacity="0.4" strokeDasharray="4" stroke="#4338ca" strokeWidth="2" className="hover:opacity-60 transition-opacity cursor-pointer" />

              <path 
                d="M 109 140 L 194 150 L 279 120 L 364 135 L 449 160 L 534 145" 
                fill="none" 
                stroke="#f43f5e" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {[109, 194, 279, 364, 449, 534].map((cx, i) => (
                <circle key={i} cx={cx} cy={[140, 150, 120, 135, 160, 145][i]} r="6" fill="#fff" stroke="#f43f5e" strokeWidth="3" className="hover:r-8 transition-all cursor-pointer shadow-sm" />
              ))}

              {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'].map((m, i) => (
                <text key={i} x={109 + (i * 85)} y="225" textAnchor="middle" className="text-[13px] font-black text-slate-500 fill-slate-500 uppercase tracking-widest">{m}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Expense Breakdown SVG Pie Donut Chart */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[3rem] shadow-xl shadow-slate-900/30 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h4 className="text-2xl font-black font-display tracking-tight">Alokasi Biaya</h4>
            <p className="text-sm text-slate-400 mt-1.5 font-medium">Distribusi pengeluaran riil.</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8 relative z-10 py-2">
            <div className="relative w-48 h-48 drop-shadow-2xl">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {categoryEntries.length === 0 ? (
                   <circle cx="50" cy="50" r="36" fill="none" stroke="#334155" strokeWidth="26" />
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
                      />
                    );
                  })
                )}
                <circle cx="50" cy="50" r="22" fill="#1e293b" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-0.5">TOTAL</span>
                <span className="text-sm font-black font-mono text-white">Rp {(totalOutflowThisMonth/1000000).toFixed(1)}M</span>
              </div>
            </div>

            <div className="w-full space-y-3 pt-2 text-sm">
              {categoryEntries.length === 0 ? (
                <div className="text-center text-slate-500 italic text-xs">Belum ada pengeluaran.</div>
              ) : (
                categoryEntries.slice(0, 3).map(([cat, val], idx) => {
                  const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-rose-500', 'bg-purple-500', 'bg-amber-500'];
                  return (
                    <div key={cat} className="flex justify-between items-center text-slate-300 bg-slate-800/50 px-4 py-3 rounded-2xl border border-slate-700/50 hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-3 font-bold">
                        <span className={`w-4 h-4 rounded-full shadow-md ${colors[idx % colors.length]}`}></span>
                        <span>{cat}</span>
                      </div>
                      <span className="font-black font-mono text-white">Rp {val.toLocaleString('id-ID')}</span>
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

    </div>
  );
}

