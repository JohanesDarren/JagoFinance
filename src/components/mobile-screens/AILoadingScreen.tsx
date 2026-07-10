import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AILoadingScreen() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-950 text-white">
      <div className="space-y-6 text-center">
        
        {/* Circle loading system or logo */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold font-display uppercase tracking-widest text-indigo-300">jagoAI OCR Engine</h4>
          <p className="text-[10px] text-slate-400 font-medium animate-pulse">AI sedang mengekstrak data struk...</p>
        </div>

        {/* Skeleton/Shimmer blocks representing extracted field names */}
        <div className="w-[200px] mx-auto bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 space-y-2.5 text-left">
          <div className="flex justify-between items-center">
            <div className="h-2 bg-slate-800 w-16 rounded-full shimmer-brand-active"></div>
            <div className="h-2 bg-slate-800 w-20 rounded-full shimmer-active"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-2 bg-slate-800 w-12 rounded-full shimmer-brand-active"></div>
            <div className="h-2 bg-slate-800 w-24 rounded-full shimmer-active"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-2 bg-slate-800 w-20 rounded-full shimmer-brand-active"></div>
            <div className="h-2 bg-slate-800 w-14 rounded-full shimmer-active"></div>
          </div>
        </div>

        <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">Menganalisis Kategori & Nominal Pajak</span>
      </div>
    </div>
  );
}
