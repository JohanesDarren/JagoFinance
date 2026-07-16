import React from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Briefcase, Shield, Key
} from 'lucide-react';
import { WebScreenProps } from './WebScreenProps';

export default function ProfileScreen(props: WebScreenProps) {
  const { onLogout } = props;

  const [profileData, setProfileData] = React.useState({
    name: 'Alex Sterling',
    email: 'alex.sterling@jagoai.com',
    phone: '+62 812 3456 7890',
    location: 'SCBD, Jakarta Selatan'
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
              alt="Alex Sterling Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-black tracking-widest uppercase mb-3 shadow-inner">
              <Shield className="w-3.5 h-3.5 text-brand" />
              Eksekutif Finance
            </div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">{profileData.name}</h2>
            <p className="text-slate-300 mt-2 text-base max-w-xl font-medium">Pengaturan profil akun, keamanan, dan preferensi notifikasi dashboard.</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Info Personal */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 lg:col-span-2">
          <h3 className="font-black font-display text-slate-900 text-2xl tracking-tight mb-8">Informasi Personal</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <User className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Alamat Email</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nomor Telepon</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Lokasi Kantor</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] shadow-inner focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800" 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                {saveSuccess && (
                  <span className="text-emerald-500 font-bold text-sm animate-in fade-in zoom-in duration-300">
                    Berhasil disimpan!
                  </span>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-4 bg-brand text-white font-black text-[15px] rounded-[1.5rem] hover:bg-brand/90 transition-all shadow-xl hover:shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Pekerjaan & Keamanan */}
        <div className="space-y-8 lg:col-span-1">
          
          <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
            <h3 className="font-black font-display text-slate-900 text-xl tracking-tight mb-6">Detail Pekerjaan</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100/50">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Perusahaan</span>
                  <p className="font-black text-slate-900 mt-0.5">PT JagoAI Inovasi</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100/50">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jabatan / Role</span>
                  <p className="font-black text-slate-900 mt-0.5">Eksekutif Finance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
            <h3 className="font-black font-display text-slate-900 text-xl tracking-tight mb-6">Keamanan Akun</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] hover:bg-slate-100 hover:border-slate-300 transition-all group">
                <div className="flex items-center gap-4">
                  <Key className="w-5 h-5 text-slate-400 group-hover:text-slate-700" />
                  <span className="font-bold text-slate-800">Ubah Kata Sandi</span>
                </div>
              </button>
              
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-[1.5rem] hover:bg-rose-600 hover:text-white transition-all font-black shadow-sm"
              >
                Logout dari Sistem
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
