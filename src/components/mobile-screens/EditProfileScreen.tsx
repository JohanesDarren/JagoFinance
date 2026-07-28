import React, { useRef, useState } from 'react';
import { ArrowLeft, Camera, X, Image, CheckCircle, Loader2, UploadCloud, ShieldCheck, ShieldAlert, User, Mail, Phone, Building2, CreditCard as CardIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditProfileScreenProps {
  editProfileData: any;
  setEditProfileData: (data: any) => void;
  showAvatarPicker: boolean;
  setShowAvatarPicker: (show: boolean) => void;
  setCurrentScreen: (screen: any) => void;
  handleSaveProfile?: () => void;
  isSaving?: boolean;
}

export default function EditProfileScreen({
  editProfileData,
  setEditProfileData,
  showAvatarPicker,
  setShowAvatarPicker,
  setCurrentScreen,
  isSaving
}: EditProfileScreenProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const passbookInputRef = useRef<HTMLInputElement>(null);
  const [showPassbookPreview, setShowPassbookPreview] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditProfileData({ ...editProfileData, avatarImage: reader.result as string });
      setShowAvatarPicker(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePassbookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditProfileData({ ...editProfileData, bankPassbookUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-x-hidden font-sans">
      {/* Modern Header */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-xl z-20">
        <button 
          onClick={() => setCurrentScreen('profile')}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-blue-950 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-black text-blue-950 tracking-tight">Edit Profil</h1>
        <div className="w-10 h-10"></div> {/* Spacer for perfect centering */}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 custom-scrollbar space-y-6">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[1.75rem] overflow-hidden border-4 border-white shadow-md bg-slate-100">
              <img 
                src={editProfileData.avatarImage}
                alt="Avatar profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={() => setShowAvatarPicker(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-950 text-white rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white hover:bg-blue-900 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Foto Profil</p>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-5">
          
          {/* Data Pribadi */}
          <div>
            <h2 className="text-sm font-black text-blue-950 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Data Pribadi
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editProfileData.fullName}
                  onChange={(e) => setEditProfileData({...editProfileData, fullName: e.target.value})}
                  className="w-full px-4 pt-6 pb-2 text-[14px] font-bold text-blue-950 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Pribadi</label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={editProfileData.email}
                  onChange={(e) => setEditProfileData({...editProfileData, email: e.target.value})}
                  className="w-full pl-4 pr-12 pt-6 pb-2 text-[14px] font-bold text-blue-950 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">No. WhatsApp</label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <Phone className="w-5 h-5" />
                </div>
                <input 
                  type="tel" 
                  value={editProfileData.phone}
                  onChange={(e) => setEditProfileData({...editProfileData, phone: e.target.value})}
                  placeholder="081234567890"
                  className="w-full pl-4 pr-12 pt-6 pb-2 text-[14px] font-bold text-blue-950 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-6 -mx-6"></div>

          {/* Informasi Rekening */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-blue-950 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                Rekening Pencairan
              </h2>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${editProfileData.bankValidated ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {editProfileData.bankValidated ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                {editProfileData.bankValidated ? 'Tervalidasi' : 'Belum Valid'}
              </div>
            </div>

            <div className="space-y-4">
              {editProfileData.bank_rejection_reason && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h6 className="text-[13px] font-black text-rose-950">Validasi Ditolak</h6>
                    <p className="text-[11px] font-medium text-rose-700 mt-1 leading-relaxed">{editProfileData.bank_rejection_reason}</p>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Bank</label>
                <input 
                  type="text" 
                  value={editProfileData.bankName}
                  onChange={(e) => setEditProfileData({...editProfileData, bankName: e.target.value})}
                  className="w-full px-4 pt-6 pb-2 text-[14px] font-bold text-blue-950 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Contoh: BCA / Mandiri"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Rekening</label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <CardIcon className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  value={editProfileData.bankAccount}
                  onChange={(e) => setEditProfileData({...editProfileData, bankAccount: e.target.value})}
                  className="w-full pl-4 pr-12 pt-6 pb-2 text-[15px] font-black font-mono text-blue-950 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Pemilik Rekening</label>
                <input 
                  type="text" 
                  value={editProfileData.accountHolder}
                  onChange={(e) => setEditProfileData({...editProfileData, accountHolder: e.target.value})}
                  className="w-full px-4 pt-6 pb-2 text-[14px] font-bold text-blue-950 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={passbookInputRef}
                  onChange={handlePassbookChange}
                  className="hidden"
                />
                
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {editProfileData.bankPassbookUrl ? (
                      <div 
                        onClick={() => setShowPassbookPreview(true)}
                        className="w-10 h-10 rounded-xl overflow-hidden cursor-pointer shadow-sm border border-slate-200 group relative"
                      >
                        <img src={editProfileData.bankPassbookUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                          <span className="text-[8px] font-bold text-white uppercase">Lihat</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-400">
                        <Image className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-[12px] font-bold text-blue-950">Foto Buku Rekening</h4>
                      <p className="text-[10px] font-medium text-slate-500">
                        {editProfileData.bankPassbookUrl ? 'Sudah diupload' : 'Format JPG/PNG'}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => passbookInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-[11px] rounded-xl active:bg-blue-100 transition-colors"
                  >
                    {editProfileData.bankPassbookUrl ? 'Ganti Foto' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 z-30 pb-safe">
        <button 
          onClick={() => {
            if (handleSaveProfile) {
              handleSaveProfile();
            } else {
              setCurrentScreen('profile');
            }
          }}
          disabled={isSaving}
          className={`w-full h-14 ${isSaving ? 'bg-slate-300' : 'bg-blue-950 hover:bg-blue-900'} text-white font-black text-[15px] rounded-[1.25rem] shadow-[0_8px_20px_rgb(0,0,0,0.1)] flex justify-center items-center gap-2 active:scale-95 transition-all`}
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          {isSaving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Modern Avatar Picker Bottom Sheet */}
      <AnimatePresence>
        {showAvatarPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 z-40 backdrop-blur-sm"
              onClick={() => setShowAvatarPicker(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-2xl z-50 p-6 pb-safe space-y-6"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-black text-blue-950 text-[17px] tracking-tight">Ubah Foto Profil</h4>
                <button onClick={() => setShowAvatarPicker(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={galleryInputRef} 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                />
                <button 
                  onClick={() => {
                    setShowAvatarPicker(false);
                    setCurrentScreen('avatar-camera');
                  }}
                  className="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-100 rounded-3xl text-blue-800 space-y-3 active:bg-blue-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-[13px] font-black tracking-tight">Buka Kamera</span>
                </button>
                <button 
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-3xl text-slate-700 space-y-3 active:bg-slate-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                    <Image className="w-6 h-6 text-slate-600" />
                  </div>
                  <span className="text-[13px] font-black tracking-tight">Pilih Galeri</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Passbook Preview Modal */}
      <AnimatePresence>
        {showPassbookPreview && editProfileData.bankPassbookUrl && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 z-50 backdrop-blur-md flex flex-col"
            >
              <div className="p-4 flex justify-between items-center z-10 pt-safe">
                <span className="text-white font-bold text-sm tracking-wide ml-2">Detail Buku Rekening</span>
                <button 
                  onClick={() => setShowPassbookPreview(false)} 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={editProfileData.bankPassbookUrl}
                  alt="Passbook Preview"
                  className="w-full max-h-[70vh] object-contain rounded-2xl"
                />
              </div>
              <div className="p-6 pb-safe">
                <button 
                  onClick={() => {
                    setShowPassbookPreview(false);
                    passbookInputRef.current?.click();
                  }}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-colors border border-white/10"
                >
                  Ganti Foto
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
