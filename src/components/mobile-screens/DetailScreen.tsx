import React from 'react';
import { ArrowLeft, AlertCircle, Maximize2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../../types';

interface DetailScreenProps {
  selectedTx: Transaction;
  setSelectedTx: (tx: Transaction | null) => void;
  setCurrentScreen: (screen: any) => void;
  zoomReceipt: boolean;
  setZoomReceipt: (zoom: boolean) => void;
  onEditClick?: (tx: Transaction) => void;
  onDeleteClick?: (tx: Transaction) => void;
}

export default function DetailScreen({
  selectedTx,
  setSelectedTx,
  setCurrentScreen,
  zoomReceipt,
  setZoomReceipt,
  onEditClick,
  onDeleteClick
}: DetailScreenProps) {
  return (
    <div className="p-4 space-y-4">
      
      {/* Header back history */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            setSelectedTx(null);
            setCurrentScreen('history');
          }}
          className="p-1 px-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs text-[10px] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Riwayat
        </button>
        <span className="text-xs font-bold font-display text-slate-800">Detail Status Klaim</span>
        <div className="w-8"></div>
      </div>

      {/* Expense basic detail card */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-4xs space-y-2 relative">
        
        {/* Status Tag floating */}
        <span className={`absolute top-3.5 right-3.5 text-[8px] font-bold px-2 py-0.5 rounded-full ${
          selectedTx.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
          selectedTx.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
          'bg-amber-50 text-amber-700 border border-amber-100'
        }`}>
          {selectedTx.status}
        </span>

        <div>
          <span className="text-[9px] font-semibold text-indigo-500 uppercase tracking-widest block">{selectedTx.category} • {selectedTx.type.toUpperCase().replace(/_/g, ' ')}</span>
          <h4 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">{selectedTx.merchant}</h4>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tanggal Invoice: {selectedTx.date}</span>
        </div>

        <div className="b-t border-slate-150 py-2">
          <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">TOTAL REIMBURSE</span>
          <span className="text-sm font-bold font-mono tracking-tight text-brand">Rp {selectedTx.amount.toLocaleString('id-ID')}</span>
        </div>

        {selectedTx.notes && (
          <p className="text-[9px] text-slate-500 bg-slate-50 p-2 rounded-lg leading-relaxed italic">
            "{selectedTx.notes}"
          </p>
        )}

        {/* Rejection Notification box */}
        {selectedTx.status === 'Rejected' && selectedTx.rejectReason && (
          <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-[9px] text-rose-800 space-y-1">
            <span className="font-bold flex items-center gap-1 text-rose-900"><AlertCircle className="w-3 h-3 text-rose-700" /> Alasan Penolakan Finance:</span>
            <p className="italic">"{selectedTx.rejectReason}"</p>
          </div>
        )}
      </div>

      {/* Struk Image Box Zoomable */}
      {selectedTx.receiptUrl && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Unggahan Bukti Nota</span>
          
          <div className="bg-slate-100 rounded-xl relative overflow-hidden h-24 border border-slate-200">
            <img src={selectedTx.receiptUrl} alt="Receipt proof file" className="w-full h-full object-cover" />
            <button 
              onClick={() => setZoomReceipt(true)}
              className="absolute bottom-2 right-2 p-1.5 bg-slate-950/70 text-white rounded-lg hover:bg-slate-950 transition-all shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Zoom Receipt Modal Mock Overlay */}
      <AnimatePresence>
        {zoomReceipt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-4"
          >
            <div className="flex justify-between items-center pt-8 text-white">
              <span className="text-xs font-semibold text-slate-300">Zoom Bukti Struk</span>
              <button 
                onClick={() => setZoomReceipt(false)}
                className="p-1 px-1.5 bg-white/20 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex justify-center items-center py-6">
              <img 
                src={selectedTx.receiptUrl} 
                alt="Expanded receipt preview" 
                className="max-w-full max-h-[460px] object-contain rounded-lg shadow-xl"
              />
            </div>

            <span className="text-center text-[10px] text-slate-400 pb-4">
              Ketuk tombol silang di kanan atas untuk menutup zoom.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATUS TRACKER VERTICAL */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-4xs space-y-3">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Status Transaksi</span>
        
        <div className="space-y-4 relative pl-5 border-l border-indigo-100 ml-1.5 py-1">
          <div className="relative text-[10px]">
            <div className={`absolute -left-[25px] top-0.5 w-3 h-3 rounded-full border-2 flex items-center justify-center ${
              selectedTx.status === 'Approved' ? 'bg-emerald-500 border-emerald-500' : 
              selectedTx.status === 'Rejected' ? 'bg-rose-500 border-rose-500' : 
              'bg-amber-500 border-amber-500'
            }`}>
              {selectedTx.status === 'Approved' && <Check className="w-2 h-2 text-white stroke-[3]" />}
              {selectedTx.status === 'Rejected' && <X className="w-2 h-2 text-white stroke-[3]" />}
            </div>
            <div className="leading-snug">
              <span className={`font-bold block ${
                selectedTx.status === 'Approved' ? 'text-emerald-600' :
                selectedTx.status === 'Rejected' ? 'text-rose-600' :
                'text-amber-600'
              }`}>
                {selectedTx.status === 'Approved' ? 'Disetujui & Dana Cair' :
                 selectedTx.status === 'Rejected' ? 'Ditolak' :
                 'Sedang Direview'}
              </span>
              <span className="text-[8px] text-slate-400">
                {selectedTx.date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS (Ubah / Hapus) HANYA JIKA PENDING */}
      {selectedTx.status === 'Pending' && (
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => {
              if (onEditClick) onEditClick(selectedTx);
            }}
            className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-1.5"
          >
            Ubah
          </button>
          
          <button 
            onClick={() => {
              if (onDeleteClick) onDeleteClick(selectedTx);
            }}
            className="flex-1 py-3 bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs rounded-xl shadow-xs hover:bg-rose-100 transition-all text-center flex items-center justify-center gap-1.5"
          >
            Hapus
          </button>
        </div>
      )}

    </div>
  );
}
