import React, { useState, useEffect } from 'react';
import { 
  Shield, UserPlus, Mail, CheckCircle, Activity,
  Briefcase, X, MapPin, Eye, EyeOff, Check
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';
import { INITIAL_BRANCHES } from '../../../utils/mockData';

export default function BranchAdminManagementScreen(props: WebScreenProps & { onAddAdmin?: (adminData: any) => Promise<boolean>, admins?: any[] }) {
  const { employees, onAddAdmin, admins } = props;
  const branches = props.branches || INITIAL_BRANCHES;
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
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

  // Map admins from users table passed down via props
  const adminList = (admins || []).map(admin => {
    const branch = branches.find(b => b.id === admin.branch_id);
    return {
      id: admin.id,
      name: admin.full_name || 'Tanpa Nama',
      branchName: branch?.name || 'Tidak diketahui',
      branchId: admin.branch_id,
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
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Kelola Admin Cabang</h2>
            <p className="text-slate-300 mt-3 text-base max-w-xl font-medium">Manajemen hak akses admin untuk setiap cabang. Admin cabang dapat mengelola kas dan menyetujui klaim di cabangnya masing-masing.</p>
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
                  <h3 className="font-black text-xl text-slate-800 font-display">Tambah Admin Cabang</h3>
                  <p className="text-xs text-slate-500 font-medium">Beri akses dashboard ke manager cabang.</p>
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
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Nama Lengkap</label>
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

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Tugaskan ke Cabang</label>
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
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
                disabled={isSubmitting || !inviteEmail || !inviteName || !allReqsMet || !passwordsMatch || !selectedBranch}
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    if (onAddAdmin) {
                      const success = await onAddAdmin({ 
                        email: inviteEmail, 
                        name: inviteName, 
                        password: invitePassword, 
                        branchId: selectedBranch 
                      });
                      if (!success) {
                        alert("Gagal menambahkan admin cabang. Silakan coba lagi.");
                        return;
                      }
                    }
                    
                    setToastMessage(`Admin Cabang ${inviteEmail} berhasil ditambahkan!`);
                    setShowInviteModal(false);
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
                {isSubmitting ? 'Menyimpan...' : 'Tambah Admin Cabang'}
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
