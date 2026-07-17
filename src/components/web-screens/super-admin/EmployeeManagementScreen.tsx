import React, { useState } from 'react';
import { Users, Search, MapPin, Building2, Mail, Shield } from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';

export default function EmployeeManagementScreen(props: WebScreenProps) {
  const { employees, branches } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.division.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || emp.branchId === selectedBranch;
    
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-white text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-indigo-100/50">
            <Users className="w-8 h-8" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black font-display text-slate-900 tracking-tight">Kelola Karyawan</h2>
            <p className="text-base text-slate-500 mt-2 font-medium">Manajemen data seluruh karyawan, filter berdasarkan cabang atau cari spesifik nama/email.</p>
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden pb-6 p-6">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 mt-2 p-2">
          <div className="flex-1 relative group">
            <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-brand transition-colors" />
            <input 
              type="text" 
              placeholder="Cari nama, email, atau divisi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[15px] font-semibold outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
            />
          </div>
          <div className="w-full md:w-72 relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 z-10" />
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[15px] font-bold outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner appearance-none text-slate-700 relative z-0 cursor-pointer"
            >
              <option value="all">Semua Cabang</option>
              {branches?.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-10">
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-slate-400"></div>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[15px] border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-400 font-black uppercase tracking-widest text-[12px] px-4">
                <th className="p-4 pl-6">Data Karyawan</th>
                <th className="p-4">Cabang</th>
                <th className="p-4">Peran & Divisi</th>
                <th className="p-4 pr-6">Status Akun</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-semibold">
              {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => {
                const branchName = branches?.find(b => b.id === emp.branchId)?.name || "Pusat / Unassigned";
                return (
                  <tr key={emp.id} className="bg-white hover:bg-slate-50 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 border border-slate-100 group rounded-[2rem] overflow-hidden">
                    <td className="p-5 pl-6 rounded-l-[2rem]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-100 to-brand/10 text-brand flex items-center justify-center font-black text-lg shadow-sm border border-brand/10 group-hover:bg-brand group-hover:text-white transition-colors duration-500 shrink-0">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="leading-tight">
                          <span className="font-black text-slate-900 block text-base group-hover:text-brand transition-colors">{emp.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono font-bold block mt-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-black text-slate-600 truncate max-w-[120px]">{branchName}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-sm font-black text-slate-800">{emp.role}</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{emp.division}</span>
                      </div>
                    </td>
                    <td className="p-5 rounded-r-[2rem] pr-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="text-xs font-black">Aktif</span>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold text-sm bg-slate-50 rounded-[2rem]">
                    Tidak ada data karyawan yang cocok dengan filter tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
