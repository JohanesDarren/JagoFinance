import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Camera, Image, RefreshCcw, ScanLine, X } from 'lucide-react';
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
      <div className="p-5 pt-8 flex justify-between items-center text-white z-20">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('home')}
          className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 bg-[#517493] px-4 py-1.5 rounded-full shadow-lg"
        >
          <ScanLine className="w-4 h-4 text-white" />
          <span className="font-bold text-[11px] text-white tracking-wide uppercase">AI Scanner</span>
        </motion.div>
        <div className="w-12 h-12"></div> {/* Spacer for balance */}
      </div>

      {/* Animated guidline overlay panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        
        {/* Rectangle Scanner Sight Guides */}
        <div className="w-[300px] h-[400px] sm:w-[340px] sm:h-[460px] relative flex items-center justify-center p-3 z-10 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">

          {/* Laser line effect scan */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-0.5 bg-[#517493] shadow-[0_0_10px_#517493] w-full z-20"
          />
          
          {/* Corner decorators overlay (Minimalist Reticle) */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#517493] z-20"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-[#517493] z-20"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-[#517493] z-20"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#517493] z-20"></div>

          {/* Guidelines hint icon (only show if stream is not ready) */}
          {!stream && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center text-white/50 space-y-3 z-10 p-4"
            >
              <Camera className="w-10 h-10 mx-auto" />
              <p className="text-[10px] font-bold tracking-widest uppercase">Memuat Kamera...</p>
            </motion.div>
          )}
        </div>
        
        {/* Guide text overlay */}
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mt-8 text-[12px] text-white font-medium tracking-wide text-center z-20"
        >
          Posisikan struk dalam area
        </motion.span>
      </div>

      {/* Camera Controller buttons */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="p-8 pt-6 bg-black z-20 text-white pb-12"
      >
        <div className="flex items-center justify-between max-w-sm mx-auto px-4">
          
          {/* Gallery Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            title="Unggah dari Galeri"
          >
            <Image className="w-5 h-5 text-white" />
          </motion.button>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
          />

          {/* Shutter Button (iOS Style) */}
          <motion.button 
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            onClick={handleCapture}
            className="w-20 h-20 rounded-full bg-transparent flex items-center justify-center p-1 border-4 border-white transition-all"
            title="Jepret Foto"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            </div>
          </motion.button>

          {/* Flip Camera Button */}
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={toggleCamera}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            title="Putar Kamera"
          >
            <RefreshCcw className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>

    </motion.div>
  );
}
