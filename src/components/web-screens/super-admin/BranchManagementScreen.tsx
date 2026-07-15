import React, { useState } from 'react';
import { 
  Building2, Users, MapPin, Plus, CheckCircle, Activity,
  Briefcase, X, Loader2
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';
import { Branch } from '../../../types';
import { INITIAL_BRANCHES } from '../../../utils/mockData';

export default function BranchManagementScreen(props: WebScreenProps) {
  const { employees, transactions, onSaveBranch } = props;
  
  const branches = props.branches || INITIAL_BRANCHES;

  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({ name: '', location: '', managerName: '', status: 'active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingBranch(null);
    setFormData({ name: '', location: '', managerName: '', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({ 
      name: branch.name, 
      location: branch.location, 
      managerName: branch.managerName, 
      status: branch.status 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveBranch) return;
    
    setIsSubmitting(true);
    const success = await onSaveBranch({
      ...(editingBranch ? { id: editingBranch.id } : {}),
      ...formData
    });
    
    if (success) {
      setShowModal(false);
    }
    setIsSubmitting(false);
  };
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-brand/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Building2 className="w-8 h-8 text-emerald-300" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Kelola Cabang</h2>
            <p className="text-slate-300 mt-3 text-base max-w-xl font-medium">Manajemen data cabang perseroan, pemantauan status aktivitas, dan ringkasan metrik setiap lokasi operasi bisnis.</p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <button 
            onClick={openCreateModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 font-bold"
          >
            <Plus className="w-6 h-6" strokeWidth="2.5" />
            <span>Tambah Cabang Baru</span>
          </button>
        </div>
      </div>

      {/* Grid Cabang */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {branches.map(branch => {
          // Calculate metrics for this branch
          const branchEmployees = employees.filter(e => e.branchId === branch.id);
          const branchTransactions = transactions.filter(t => t.branchId === branch.id);
          
          const totalIn = branchTransactions.filter(t => t.type === 'income' && t.status === 'Approved').reduce((s, t) => s + t.amount, 0);
          const totalOut = branchTransactions.filter(t => (t.type === 'reimburse' || t.type === 'expense_manual') && t.status === 'Approved').reduce((s, t) => s + t.amount, 0);

          return (
            <div key={branch.id} className={`bg-white rounded-3xl p-6 border ${branch.status === 'inactive' ? 'border-rose-100 opacity-70' : 'border-slate-150'} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl ${branch.status === 'inactive' ? 'bg-rose-50' : 'bg-slate-50'} border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner`}>
                  <MapPin className="w-6 h-6" />
                </div>
                {branch.status === 'active' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    <Activity className="w-3 h-3" /> Aktif
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-200">
                    Nonaktif
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold font-display text-slate-800 mb-1">{branch.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Manajer: {branch.managerName}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Karyawan</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-xl">
                    <Users className="w-5 h-5 text-indigo-500" />
                    {branchEmployees.length}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Transaksi</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    {branchTransactions.length}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Uang Masuk</span>
                  <span className="font-bold text-emerald-600">Rp {totalIn.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Uang Keluar</span>
                  <span className="font-bold text-rose-600">Rp {totalOut.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => openEditModal(branch)}
                  className="flex-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  Edit Cabang
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black font-display text-xl text-slate-800">
                {editingBranch ? 'Edit Data Cabang' : 'Buat Cabang Baru'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth="3" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Nama Cabang</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                  placeholder="Mis. Cabang Jakarta Pusat"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Nama Manajer</label>
                <input 
                  type="text"
                  required
                  value={formData.managerName}
                  onChange={e => setFormData({...formData, managerName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                  placeholder="Mis. John Doe"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Lokasi / Alamat</label>
                <textarea 
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all resize-none h-24"
                  placeholder="Alamat lengkap operasional cabang..."
                />
              </div>

              {editingBranch && (
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Status Operasional</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                  >
                    <option value="active">Aktif (Beroperasi)</option>
                    <option value="inactive">Nonaktif (Berhenti Beroperasi)</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-2xl transition-colors shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan</>
                  ) : (
                    'Simpan Cabang'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
