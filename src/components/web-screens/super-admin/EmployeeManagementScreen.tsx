import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Search, Building2, Mail, Shield, Eye, X, Wallet, Building, CircleUserRound, ShieldCheck, ShieldAlert, Loader2, Image as ImageIcon } from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';
import { Employee } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { SERVICE_ROLE_KEY } from '../../../adminKey';

export default function EmployeeManagementScreen(props: WebScreenProps) {
  const { employees, companies, userRole, userProfile } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showRejectBankModal, setShowRejectBankModal] = useState(false);
  const [rejectBankReason, setRejectBankReason] = useState('');

  const handleValidateBank = async (employeeId: string, currentStatus: boolean) => {
    setIsValidating(true);
    try {
      const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      
      const { error } = await supabaseAdmin
        .from('users')
        .update({ bank_validated: !currentStatus })
        .eq('id', employeeId);
      
      if (error) throw error;
      
      if (selectedEmployee) {
        setSelectedEmployee({ ...selectedEmployee, bank_validated: !currentStatus, bank_rejection_reason: null as any });
      }
      
      if (props.onRefreshData) {
        props.onRefreshData();
      }
    } catch (err: any) {
      alert('Gagal memperbarui status validasi: ' + err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRejectBank = async () => {
    if (!selectedEmployee || !rejectBankReason.trim()) return;
    
    setIsValidating(true);
    try {
      const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          bank_validated: false,
          bank_rejection_reason: rejectBankReason 
        })
        .eq('id', selectedEmployee.id);
      
      if (error) throw error;
      
      setSelectedEmployee({ ...selectedEmployee, bank_validated: false, bank_rejection_reason: rejectBankReason });
      setShowRejectBankModal(false);
      setRejectBankReason('');
      
      if (props.onRefreshData) {
        props.onRefreshData();
      }
    } catch (err: any) {
      alert('Gagal menolak validasi: ' + err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    // If admin_corp, only show employees from their own company
    if (userRole === 'admin_corp' && userProfile?.company_id) {
      if (emp.companyId !== userProfile.company_id) return false;
    }

    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.division?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For super_admin using the company filter dropdown
    const matchesCompany = (userRole === 'super_admin' && selectedCompany !== 'all') ? emp.companyId === selectedCompany : true;
    
    return matchesSearch && matchesCompany;
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
          {userRole === 'super_admin' && (
            <div className="w-full md:w-72 relative">
              <Building2 className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 z-10" />
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[15px] font-bold outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner appearance-none text-slate-700 relative z-0 cursor-pointer"
              >
                <option value="all">Semua Perusahaan</option>
                {companies?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-10">
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-slate-400"></div>
              </div>
            </div>
          )}
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[15px] border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-400 font-black uppercase tracking-widest text-[12px] px-4">
                <th className="p-4 pl-6">Data Karyawan</th>
                <th className="p-4">Perusahaan</th>
                <th className="p-4">Peran & Divisi</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-semibold">
              {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => {
                const companyName = companies?.find(c => c.id === emp.companyId)?.name || "Pusat / Unassigned";
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
                        <span className="text-xs font-black text-slate-600 truncate max-w-[120px]">{companyName}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-sm font-black text-slate-800">{emp.role}</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{emp.division}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="text-xs font-black">Aktif</span>
                      </div>
                    </td>
                    <td className="p-5 rounded-r-[2rem] pr-6 text-right">
                      <button 
                        onClick={() => setSelectedEmployee(emp)}
                        className="p-2.5 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
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

      {/* Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center relative z-10">
              <h3 className="font-black text-xl text-slate-800 font-display">Informasi Karyawan</h3>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 relative z-10">
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-md mb-4">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEmployee.name)}&background=e0e7ff&color=4f46e5&size=200`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{selectedEmployee.name}</h4>
                <p className="text-slate-500 font-medium">{selectedEmployee.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-xs font-black">Status: Aktif</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                    <CircleUserRound className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Role & Divisi</span>
                    <span className="font-bold text-slate-800">{selectedEmployee.role} ΓÇó {selectedEmployee.division || 'Unassigned'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Perusahaan</span>
                    <span className="font-bold text-slate-800">{companies?.find(c => c.id === selectedEmployee.companyId)?.name || 'Pusat / Unassigned'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Informasi Rekening</span>
                      <span className="font-bold text-slate-800 truncate block">{selectedEmployee.bankName || 'Belum diisi'} - {selectedEmployee.bankAccount || 'Belum diisi'}</span>
                      <span className="text-xs text-slate-500 font-medium block truncate mb-1">{selectedEmployee.bank_account_holder || 'Pemilik: Belum diisi'}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${selectedEmployee.bank_validated ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {selectedEmployee.bank_validated ? <ShieldCheck className="w-2.5 h-2.5" /> : <ShieldAlert className="w-2.5 h-2.5" />}
                          {selectedEmployee.bank_validated ? 'Sudah divalidasi' : 'Belum tervalidasi'}
                        </div>
                      </div>
                    </div>
                    {selectedEmployee.bank_rejection_reason && (
                      <div className="mt-2 p-2 bg-rose-50 border border-rose-100 rounded-lg">
                        <span className="text-[9px] font-bold text-rose-500 block">Alasan Penolakan:</span>
                        <span className="text-xs text-rose-700">{selectedEmployee.bank_rejection_reason}</span>
                      </div>
                    )}
                  </div>

                  {selectedEmployee.bank_passbook_url && (
                    <div className="mt-2 bg-white p-2 rounded-xl border border-slate-200 shadow-inner overflow-hidden">
                      <span className="text-[10px] font-bold text-slate-500 mb-1 block">Foto Buku Rekening:</span>
                      <img src={selectedEmployee.bank_passbook_url} alt="Buku Rekening" className="w-full aspect-video object-cover rounded-lg border border-slate-100" />
                    </div>
                  )}

                  {(selectedEmployee.bankAccount && selectedEmployee.bankName) && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleValidateBank(selectedEmployee.id, selectedEmployee.bank_validated || false)}
                        disabled={isValidating}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          selectedEmployee.bank_validated 
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : (selectedEmployee.bank_validated ? <X className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />)}
                        {isValidating ? 'Memproses...' : (selectedEmployee.bank_validated ? 'Batalkan Validasi' : 'Validasi')}
                      </button>
                      {!selectedEmployee.bank_validated && (
                        <button
                          onClick={() => setShowRejectBankModal(true)}
                          className="flex-1 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 bg-rose-500 text-white hover:bg-rose-600"
                        >
                          <X className="w-4 h-4" />
                          Tolak
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="w-full py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Bank Validation Modal */}
      {showRejectBankModal && selectedEmployee && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 relative">
            <h3 className="font-black text-lg text-slate-800 mb-2">Tolak Validasi Rekening</h3>
            <p className="text-sm text-slate-500 mb-4">Masukkan alasan penolakan agar karyawan dapat memperbaikinya.</p>
            
            <textarea
              value={rejectBankReason}
              onChange={(e) => setRejectBankReason(e.target.value)}
              placeholder="Contoh: Foto buku rekening buram, nama tidak sesuai..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-400 focus:bg-white transition-all min-h-[100px] resize-none"
            ></textarea>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectBankModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleRejectBank}
                disabled={!rejectBankReason.trim() || isValidating}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 text-sm"
              >
                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim Penolakan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
