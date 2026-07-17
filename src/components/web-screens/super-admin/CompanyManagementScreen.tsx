import React, { useState } from 'react';
import { 
  Building2, Plus, Edit2, Trash2, CheckCircle, Search, Save, X, Activity, XCircle
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';
import { Company } from '../../../types';

export default function CompanyManagementScreen(props: WebScreenProps) {
  const { companies = [], onSaveCompany, onDeleteCompany } = props;
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    subscription_tier: 'Free',
    subscription_status: 'active'
  });
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (company?: Company) => {
    if (company) {
      setEditingId(company.id);
      setFormData(company);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        subscription_tier: 'Free',
        subscription_status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !onSaveCompany) return;
    setIsSubmitting(true);
    
    try {
      const success = await onSaveCompany(formData);
      if (success) {
        setToastMessage(`Perusahaan ${formData.name} berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`);
        handleCloseModal();
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert("Gagal menyimpan data perusahaan.");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!onDeleteCompany) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus perusahaan "${name}"? Seluruh data terkait perusahaan ini mungkin akan ikut terhapus.`)) {
      const success = await onDeleteCompany(id);
      if (success) {
        setToastMessage(`Perusahaan ${name} berhasil dihapus!`);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert("Gagal menghapus perusahaan.");
      }
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-brand/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Building2 className="w-8 h-8 text-indigo-300" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Kelola Perusahaan</h2>
            <p className="text-slate-300 mt-3 text-base max-w-xl font-medium">Manajemen data perusahaan klien (tenant). Anda dapat menambah, mengubah, atau menghapus perusahaan dari sistem.</p>
          </div>
        </div>

        <div className="relative z-10 shrink-0 flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-[1.5rem] text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 transition-all w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3.5 rounded-[1.5rem] flex items-center gap-3 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 font-bold"
          >
            <Plus className="w-5 h-5" strokeWidth="2.5" />
            <span>Tambah Perusahaan</span>
          </button>
        </div>
      </div>

      {/* Table Perusahaan */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-5 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Perusahaan</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tier & Status</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tanggal Terdaftar</th>
                <th className="p-5 pr-6 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-semibold">
              {filteredCompanies.length > 0 ? filteredCompanies.map(company => (
                <tr key={company.id} className="bg-white hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group">
                  <td className="p-5 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shrink-0">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-slate-900 block text-base group-hover:text-indigo-600 transition-colors line-clamp-1" title={company.name}>{company.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{company.subscription_tier}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        company.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {company.subscription_status}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-sm font-bold text-slate-600">{new Date(company.created_at).toLocaleDateString('id-ID')}</span>
                  </td>
                  <td className="p-5 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(company)}
                        className="p-2.5 bg-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Edit Perusahaan"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(company.id, company.name)}
                        className="p-2.5 bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Hapus Perusahaan"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold text-sm bg-slate-50">
                    <div className="flex flex-col items-center justify-center">
                      <Building2 className="w-12 h-12 mb-3 opacity-20" />
                      Tidak ada perusahaan yang ditemukan.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="p-8 border-b border-slate-100 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  {editingId ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800 font-display">
                    {editingId ? 'Edit Perusahaan' : 'Tambah Perusahaan Baru'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Lengkapi detail perusahaan klien.</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Nama Perusahaan</label>
                <input 
                  type="text"
                  placeholder="Contoh: PT. Jago Tech"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Tier Langganan (SaaS)</label>
                <select 
                  value={formData.subscription_tier || 'Free'}
                  onChange={(e) => setFormData({...formData, subscription_tier: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Free">Free</option>
                  <option value="Starter">Starter</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>


            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 relative z-10">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                disabled={isSubmitting || !formData.name}
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-50 backdrop-blur-md border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500" strokeWidth="2.5" />
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}

