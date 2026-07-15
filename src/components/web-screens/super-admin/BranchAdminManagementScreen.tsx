import React, { useState } from 'react';
import { 
  Shield, UserPlus, Mail, CheckCircle, Activity,
  Briefcase, X, MapPin
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';
import { INITIAL_BRANCHES } from '../../../utils/mockData';

export default function BranchAdminManagementScreen(props: WebScreenProps) {
  const { employees } = props;
  const branches = props.branches || INITIAL_BRANCHES;

  // We consider branch admins as employees whose role contains "Manager" or "Admin", 
  // or we just map them from the branches' managerName for the mock presentation.
  const adminList = branches.map(branch => {
    return {
      id: `ADM-${branch.id}`,
      name: branch.managerName,
      branchName: branch.name,
      branchId: branch.id,
      email: `${branch.managerName.toLowerCase().replace(/\s/g, '.')}@jagoai.id`,
      status: branch.status
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-brand/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Shield className="w-8 h-8 text-indigo-300" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Kelola Admin Cabang</h2>
            <p className="text-slate-300 mt-3 text-base max-w-xl font-medium">Manajemen hak akses admin untuk setiap cabang. Admin cabang dapat mengelola kas dan menyetujui klaim di cabangnya masing-masing.</p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 font-bold">
            <UserPlus className="w-6 h-6" strokeWidth="2.5" />
            <span>Undang Admin Baru</span>
          </button>
        </div>
      </div>

      {/* Grid Admin Cabang */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adminList.map(admin => (
          <div key={admin.id} className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between group">
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner font-black text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                {admin.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800 mb-1">{admin.name}</h3>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> {admin.email}
                  </span>
                  <span className="text-xs text-indigo-600 font-bold flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> Penanggung Jawab: {admin.branchName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
              {admin.status === 'active' ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <Activity className="w-3 h-3" /> Akun Aktif
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                  Akses Dicabut
                </span>
              )}
              
              <button className="w-full sm:w-auto px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl border border-slate-200 transition-colors">
                Ubah Akses
              </button>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}
