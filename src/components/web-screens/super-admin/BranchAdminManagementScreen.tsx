import React, { useState, useEffect } from 'react';
import { 
  Shield, UserPlus, Mail, CheckCircle, Activity,
  Briefcase, X, MapPin, Eye, EyeOff, Check, Edit2, Trash2
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';
export default function BranchAdminManagementScreen(props: WebScreenProps & { onAddAdmin?: (adminData: any) => Promise<boolean>, onDeleteAdmin?: (id: string) => Promise<boolean>, admins?: any[], companies?: any[] }) {
  const { employees, onAddAdmin, onDeleteAdmin, admins = [], companies = [] } = props;
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCompanyId, setInviteCompanyId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pwdReqs, setPwdReqs] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    noSpace: false,
    notNameEmail: false,
  });

  useEffect(() => {
    if (showInviteModal) {
      setPwdReqs({
        length: invitePassword.length >= 8,
        upper: /[A-Z]/.test(invitePassword),
        lower: /[a-z]/.test(invitePassword),
        number: /[0-9]/.test(invitePassword),
        noSpace: invitePassword.length > 0 && !/\s/.test(invitePassword),
        notNameEmail: invitePassword.length > 0 && 
                      (!inviteEmail || !invitePassword.toLowerCase().includes(inviteEmail.split('@')[0].toLowerCase())) && 
                      (!inviteName || !invitePassword.toLowerCase().includes(inviteName.split(' ')[0].toLowerCase()))
      });
    }
  }, [invitePassword, inviteEmail, inviteName, showInviteModal]);

  const getStrengthLabel = () => {
    if (!invitePassword) return { label: 'Belum ada', color: 'text-slate-400', bg: 'bg-slate-100', bar: 'w-0' };
    const validCount = Object.values(pwdReqs).filter(Boolean).length;
    if (validCount <= 2) return { label: 'Lemah', color: 'text-rose-600', bg: 'bg-rose-100', bar: 'w-1/3 bg-rose-500' };
    if (validCount <= 5) return { label: 'Sedang', color: 'text-amber-600', bg: 'bg-amber-100', bar: 'w-2/3 bg-amber-500' };
    return { label: 'Kuat', color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'w-full bg-emerald-500' };
  };

  const strength = getStrengthLabel();
  const allReqsMet = Object.values(pwdReqs).every(Boolean);
  const passwordsMatch = invitePassword === confirmPassword;

  const ReqItem = ({ met, text }: { met: boolean, text: string }) => (
    <div className={`flex items-center gap-2 text-[11px] transition-all duration-300 ${met ? 'text-emerald-600' : 'text-slate-500'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors shadow-sm ${met ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        {met && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <span className={met ? 'line-through opacity-60 font-medium' : 'font-medium'}>{text}</span>
    </div>
  );

  const adminList = (admins || []).map(admin => {
    return {
      id: admin.id,
      name: admin.full_name || 'Tanpa Nama',
      email: admin.email,
      status: 'active'
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
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Kelola Admin Perusahaan</h2>
            <p className="text-slate-300 mt-3 text-base max-w-xl font-medium">Manajemen hak akses admin. Admin perusahaan dapat mengelola kas, operasional sistem, dan menyetujui klaim seluruh karyawan.</p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <button 
            onClick={() => setShowInviteModal(true)}
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 font-bold"
          >
            <UserPlus className="w-6 h-6" strokeWidth="2.5" />
            <span>Tambah Admin Baru</span>
          </button>
        </div>
      </div>

      {/* Table Admin Cabang */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-5 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Admin</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status Akun</th>
                <th className="p-5 pr-6 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-semibold">
              {adminList.length > 0 ? adminList.map(admin => (
                <tr key={admin.id} className="bg-white hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group">
                  <td className="p-5 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shrink-0">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-slate-900 block text-base group-hover:text-indigo-600 transition-colors">{admin.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono font-bold block mt-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {admin.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    {admin.status === 'active' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-xs font-black">Aktif</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200">
                        <span className="text-xs font-black">Dicabut</span>
                      </div>
                    )}
                  </td>
                  <td className="p-5 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingAdmin(admin)}
                        className="p-2.5 bg-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Edit Admin"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={async () => {
                          if (window.confirm("Apakah Anda yakin ingin menghapus admin ini?")) {
                            if (onDeleteAdmin) {
                              const success = await onDeleteAdmin(admin.id);
                              if (success) {
                                alert("Admin berhasil dihapus.");
                              } else {
                                alert("Gagal menghapus admin.");
                              }
                            } else {
                              alert("Fitur hapus admin sedang dalam tahap pengembangan.");
                            }
                          }
                        }}
                        className="p-2.5 bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Hapus Admin"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 font-bold text-sm bg-slate-50">
                    <div className="flex flex-col items-center justify-center">
                      <Shield className="w-12 h-12 mb-3 opacity-20" />
                      Tidak ada admin yang ditemukan.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="p-8 border-b border-slate-100 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800 font-display">Tambah Admin Perusahaan</h3>
                  <p className="text-xs text-slate-500 font-medium">Beri akses dashboard ke admin perusahaan baru.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Pilih Perusahaan <span className="text-rose-500">*</span></label>
                <select
                  value={inviteCompanyId}
                  onChange={(e) => setInviteCompanyId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Perusahaan --</option>
                  {companies?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Nama Lengkap Admin <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Alamat Email</label>
                <input 
                  type="email"
                  placeholder="admin@jagoai.id"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Kata Sandi</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {invitePassword.length > 0 && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kekuatan Sandi</span>
                      <span className={`text-xs font-bold ${strength.color} bg-white px-3 py-1 rounded-full shadow-sm`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                      <div className={`h-full transition-all duration-500 ${strength.bar}`}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <ReqItem met={pwdReqs.length} text="Min. 8 karakter" />
                      <ReqItem met={pwdReqs.upper} text="1 huruf besar (A-Z)" />
                      <ReqItem met={pwdReqs.lower} text="1 huruf kecil (a-z)" />
                      <ReqItem met={pwdReqs.number} text="1 angka (0-9)" />
                      <ReqItem met={pwdReqs.noSpace} text="Tanpa spasi" />
                      <ReqItem met={pwdReqs.notNameEmail} text="Bukan nama/email" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all pr-12 ${
                      confirmPassword.length > 0 
                        ? passwordsMatch 
                          ? 'border-emerald-200 focus:ring-emerald-500' 
                          : 'border-rose-200 focus:ring-rose-500'
                        : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {confirmPassword.length > 0 && (
                      <div className="mr-1">
                        {passwordsMatch ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <X className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>


            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 relative z-10">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                disabled={isSubmitting || !inviteCompanyId || !inviteEmail || !inviteName || !allReqsMet || !passwordsMatch}
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    if (onAddAdmin) {
                      const success = await onAddAdmin({ 
                        email: inviteEmail, 
                        name: inviteName, 
                        password: invitePassword,
                        companyId: inviteCompanyId
                      });
                      if (!success) {
                        alert("Gagal menambahkan admin perusahaan. Silakan coba lagi.");
                        return;
                      }
                    }
                    
                    setToastMessage(`Admin Perusahaan ${inviteEmail} berhasil ditambahkan!`);
                    setShowInviteModal(false);
                    setInviteCompanyId('');
                    setInviteName('');
                    setInviteEmail('');
                    setInvitePassword('');
                    setConfirmPassword('');
                    setTimeout(() => setToastMessage(null), 3000);
                  } catch (e: any) {
                    alert("Error: " + e.message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Tambah Admin Perusahaan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="p-8 border-b border-slate-100 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800 font-display">Informasi Admin</h3>
                  <p className="text-xs text-slate-500 font-medium">Ubah hak akses admin perusahaan.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingAdmin(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input 
                  type="text"
                  value={editingAdmin.name}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Alamat Email</label>
                <input 
                  type="email"
                  value={editingAdmin.email}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Status Akses</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  defaultValue="active"
                >
                  <option value="active">Aktif (Diberi Akses)</option>
                  <option value="inactive">Nonaktif (Akses Dicabut)</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 relative z-10">
              <button 
                onClick={() => setEditingAdmin(null)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  // Mock save
                  setToastMessage(`Hak akses untuk ${editingAdmin.name} berhasil diperbarui.`);
                  setEditingAdmin(null);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all text-sm"
              >
                Simpan Perubahan
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

