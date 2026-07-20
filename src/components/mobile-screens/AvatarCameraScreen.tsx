import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Camera as CameraIcon } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        setErrorMsg('Gagal mengakses kamera: ' + err.message);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Handle mirroring if it's front camera
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Data = canvas.toDataURL('image/jpeg', 0.8);
        setEditProfileData({...editProfileData, avatarImage: base64Data});
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setCurrentScreen('edit-profile');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
      <div className="absolute top-6 left-4 right-4 flex justify-between z-10 text-white">
        <button onClick={() => setCurrentScreen('edit-profile')} className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        {errorMsg ? (
          <div className="text-white text-sm text-center p-4">{errorMsg}</div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover -scale-x-100" 
            />
            <div className="absolute inset-0 bg-black/40"></div>
            
            <div className="w-64 h-64 rounded-full border-2 border-white/50 border-dashed relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               {/* Transparent center to see the video */}
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-between py-12 z-20 pointer-events-none">
              <span className="text-white/90 font-medium text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Posisikan wajah Anda di dalam lingkaran</span>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>
      <div className="h-32 bg-black/80 flex items-center justify-center pb-4 z-10 relative">
        <button 
          onClick={handleCapture}
          disabled={!!errorMsg}
          className={`w-16 h-16 rounded-full bg-white border-4 ${errorMsg ? 'border-slate-500 opacity-50' : 'border-slate-300'} flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
        >
          <div className={`w-12 h-12 rounded-full border-2 ${errorMsg ? 'border-slate-500' : 'border-slate-900'} flex items-center justify-center`}>
            {!errorMsg && <CameraIcon className="w-5 h-5 text-slate-800" />}
          </div>
        </button>
      </div>
    </div>
  );
}
