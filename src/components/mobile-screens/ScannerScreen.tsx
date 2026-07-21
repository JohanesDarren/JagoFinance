import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Camera, Image, RefreshCcw, ScanLine } from 'lucide-react';
import { motion } from 'motion/react';

interface ScannerScreenProps {
  setCurrentScreen: (screen: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ScannerScreen({
  setCurrentScreen,
  fileInputRef,
  handleFileUpload
}: ScannerScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Kamera gagal diakses:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Convert base64 to File object
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            // Simulate change event for handleFileUpload
            handleFileUpload({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
          });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 bg-black flex flex-col relative overflow-hidden"
    >
      
      {/* Full Screen Live Camera Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header back */}
      <div className="p-4 pt-8 flex justify-between items-center text-white z-20">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('home')}
          className="p-2.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-indigo-500/30 px-4 py-2 rounded-full shadow-lg shadow-indigo-500/20"
        >
          <ScanLine className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-xs text-white tracking-wide">Scanner AI Aktif</span>
        </motion.div>
        <div className="w-10"></div>
      </div>

      {/* Animated guidline overlay panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        
        {/* Guide text overlay */}
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute top-8 text-[11px] bg-indigo-600/90 shadow-lg shadow-indigo-600/50 backdrop-blur-sm text-white px-5 py-2 rounded-full text-center tracking-widest font-black z-20 uppercase"
        >
          Posisikan struk dalam area
        </motion.span>

        {/* Rectangle Scanner Sight Guides */}
        <div className="w-[280px] h-[380px] sm:w-[320px] sm:h-[420px] rounded-[2rem] relative flex items-center justify-center p-3 overflow-hidden bg-black/20 backdrop-blur-[2px] z-10 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]">

          {/* Laser line effect scan */}
          <motion.div 
            animate={{ top: ['0%', '98%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.8)] w-full z-20 opacity-80"
          />
          
          {/* Corner decorators overlay (Modern Reticle) */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-[2rem] z-20 opacity-80 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-[2rem] z-20 opacity-80 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-[2rem] z-20 opacity-80 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-[2rem] z-20 opacity-80 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>

          {/* Guidelines hint icon (only show if stream is not ready) */}
          {!stream && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center text-indigo-200 space-y-3 z-10 p-4"
            >
              <Camera className="w-12 h-12 mx-auto text-indigo-500" />
              <p className="text-[10px] font-bold tracking-widest uppercase">Memuat Lensa...</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Camera Controller buttons */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="p-8 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 text-white pb-12"
      >
        <div className="flex items-center justify-between max-w-sm mx-auto px-4">
          
          {/* Gallery Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-xl"
            title="Unggah dari Galeri"
          >
            <Image className="w-6 h-6" />
          </motion.button>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
          />

          {/* Shutter Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCapture}
            className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center p-2 border-[6px] border-white/30 hover:border-indigo-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            title="Jepret Foto"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)]">
            </div>
          </motion.button>

          {/* Flip Camera Button */}
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={toggleCamera}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-xl"
            title="Putar Kamera"
          >
            <RefreshCcw className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

    </motion.div>
  );
}
