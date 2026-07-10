import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AvatarCameraScreenProps {
  setCurrentScreen: (screen: any) => void;
  editProfileData: any;
  setEditProfileData: (data: any) => void;
}

export default function AvatarCameraScreen({
  setCurrentScreen,
  editProfileData,
  setEditProfileData
}: AvatarCameraScreenProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
      <div className="absolute top-6 left-4 right-4 flex justify-between z-10 text-white">
        <button onClick={() => setCurrentScreen('edit-profile')} className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')`}}></div>
        <div className="w-64 h-64 rounded-full border-2 border-white/50 border-dashed relative z-10 bg-slate-900/40 backdrop-blur-md overflow-hidden flex items-center justify-center">
            <div className="w-full h-full bg-cover bg-center opacity-40" style={{backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')`}}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-white/70 text-xs bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Arahkan wajah ke dalam lingkaran</span>
        </div>
      </div>
      <div className="h-32 bg-black/80 flex items-center justify-center pb-4 z-10">
        <button 
          onClick={() => {
            setEditProfileData({...editProfileData, avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'});
            setCurrentScreen('edit-profile');
          }}
          className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        >
          <div className="w-12 h-12 rounded-full border-2 border-slate-900"></div>
        </button>
      </div>
    </div>
  );
}
