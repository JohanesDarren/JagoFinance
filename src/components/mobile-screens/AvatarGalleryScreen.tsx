import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AvatarGalleryScreenProps {
  setCurrentScreen: (screen: any) => void;
  editProfileData: any;
  setEditProfileData: (data: any) => void;
}

export default function AvatarGalleryScreen({
  setCurrentScreen,
  editProfileData,
  setEditProfileData
}: AvatarGalleryScreenProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => setCurrentScreen('edit-profile')} className="p-1.5 bg-slate-50 text-slate-600 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-xs text-slate-800">Pilih Foto dari Galeri</span>
      </div>
      <div className="flex-1 p-1 overflow-y-auto grid grid-cols-3 gap-1">
        {[
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
        ].map((url, i) => (
          <button 
            key={i}
            onClick={() => {
              setEditProfileData({...editProfileData, avatarImage: url});
              setCurrentScreen('edit-profile');
            }}
            className="aspect-square relative group"
          >
            <img src={url} alt={`Gallery item ${i}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors"></div>
          </button>
        ))}
      </div>
    </div>
  );
}
