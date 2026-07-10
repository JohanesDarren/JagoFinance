import React from 'react';
import { ArrowLeft, Camera, X, Image, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditProfileScreenProps {
  editProfileData: any;
  setEditProfileData: (data: any) => void;
  showAvatarPicker: boolean;
  setShowAvatarPicker: (show: boolean) => void;
  setCurrentScreen: (screen: any) => void;
}

export default function EditProfileScreen({
  editProfileData,
  setEditProfileData,
  showAvatarPicker,
  setShowAvatarPicker,
  setCurrentScreen
}: EditProfileScreenProps) {
  return (
    <div className="p-4 space-y-4 pb-24 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentScreen('profile')}
          className="p-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-bold font-display text-slate-800">Edit Profil</span>
        <div className="w-8"></div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img 
              src={editProfileData.avatarImage}
              alt="Avatar profile" 
              className="w-16 h-16 rounded-full border-4 border-indigo-50 object-cover opacity-80"
            />
            <button 
              onClick={() => setShowAvatarPicker(true)}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full text-white"
            >
              <Camera className="w-4 h-4" />
              <span className="text-[7px] font-bold mt-0.5">UBAH</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showAvatarPicker && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 z-40 rounded-[40px]"
                onClick={() => setShowAvatarPicker(false)}
              />
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-6 space-y-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-800 text-sm">Ubah Foto Profil</h4>
                  <button onClick={() => setShowAvatarPicker(false)} className="p-1 text-slate-400 bg-slate-100 rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setShowAvatarPicker(false);
                      setCurrentScreen('avatar-camera');
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 space-y-2 active:bg-indigo-100 transition-colors"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Kamera</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowAvatarPicker(false);
                      setCurrentScreen('avatar-gallery');
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 space-y-2 active:bg-slate-100 transition-colors"
                  >
                    <Image className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Galeri</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              value={editProfileData.fullName}
              onChange={(e) => setEditProfileData({...editProfileData, fullName: e.target.value})}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Email</label>
            <input 
              type="email" 
              value={editProfileData.email}
              onChange={(e) => setEditProfileData({...editProfileData, email: e.target.value})}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Nomor Handphone (WhatsApp)</label>
            <input 
              type="tel" 
              value={editProfileData.phone}
              onChange={(e) => setEditProfileData({...editProfileData, phone: e.target.value})}
              placeholder="Contoh: 081234567890"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            />
            <p className="text-[9px] text-slate-400 mt-1 italic">* Pastikan nomor ini adalah nomor WhatsApp yang aktif untuk menerima notifikasi.</p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h6 className="text-[10px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Informasi Rekening</h6>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Bank</label>
                <input 
                  type="text" 
                  value={editProfileData.bankName}
                  onChange={(e) => setEditProfileData({...editProfileData, bankName: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nomor Rekening</label>
                <input 
                  type="text" 
                  value={editProfileData.bankAccount}
                  onChange={(e) => setEditProfileData({...editProfileData, bankAccount: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl font-mono focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Pemilik Rekening</label>
                <input 
                  type="text" 
                  value={editProfileData.accountHolder}
                  onChange={(e) => setEditProfileData({...editProfileData, accountHolder: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            // Simulasikan penyimpanan
            setCurrentScreen('profile');
          }}
          className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl shadow-xs mt-4 flex justify-center items-center gap-1.5"
        >
          <CheckCircle className="w-4 h-4" />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
