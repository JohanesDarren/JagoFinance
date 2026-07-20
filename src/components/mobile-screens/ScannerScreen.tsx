import React from 'react';
import { ArrowLeft, Camera, Image, RefreshCcw, Circle } from 'lucide-react';
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
  return (
    <div className="flex-1 bg-black flex flex-col relative">
      
      {/* Header back */}
      <div className="p-4 flex justify-between items-center text-white z-20">
        <button 
          onClick={() => setCurrentScreen('home')}
          className="p-1.5 bg-white/20 rounded-lg text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-xs text-white">Scanner Nota AI</span>
        <div className="w-7 h-7"></div>
      </div>

      {/* Animated guidline overlay panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        
        {/* Guide text overlay */}
        <span className="absolute top-4 text-[9px] bg-slate-950/80 text-indigo-200 px-3 py-1 rounded-full text-center tracking-wider font-semibold z-20 uppercase">
          Posisikan struk dalam kotak panduan
        </span>

        {/* Rectangle Scanner Sight Guides */}
        <div className="w-[250px] h-[340px] border-2 border-dashed border-indigo-400 rounded-2xl relative flex items-center justify-center p-3 overflow-hidden bg-slate-900/60 z-10 shadow-lg shadow-black/80">
          
          {/* Laser line effect scan */}
          <motion.div 
            animate={{ top: ['0%', '98%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-0.5 bg-brand shadow-[0_0_15px_rgba(99,102,241,1)] w-full z-20"
          />
          
          {/* Corner decorators overlay */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-light"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-light"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-light"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-light"></div>

          {/* Guidelines hint icon */}
          <div className="text-center text-indigo-200 space-y-2 z-10 p-4">
            <Camera className="w-10 h-10 mx-auto text-indigo-400 opacity-60" />
            <p className="text-[8px] leading-snug">Foto struk belanjamu di kafe, restoran, jalan tol, bensin, atau server cloud.</p>
          </div>
        </div>
      </div>

      {/* Camera Controller buttons */}
      <div className="p-8 bg-slate-950/90 backdrop-blur-xl z-20 text-white border-t border-slate-900 pb-12">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          
          {/* Gallery Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md"
            title="Unggah dari Galeri"
          >
            <Image className="w-5 h-5" />
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
          />

          {/* Shutter Button (Mock Capture) */}
          <button 
            onClick={() => {
              // Simulasi jepret -> Buka file picker karena kita di browser
              fileInputRef.current?.click();
            }}
            className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center p-1 border-4 border-slate-700/50 hover:border-slate-500 transition-all active:scale-95"
            title="Jepret Foto"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {/* Optional inner icon or empty */}
            </div>
          </button>

          {/* Flip Camera Button */}
          <button 
            className="w-12 h-12 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md"
            title="Putar Kamera"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
