import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Maximize2, X, Check, Edit2, Trash2, FileText, Calendar, Wallet, ScanLine, Tag } from 'lucide-react';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden font-sans"
    >
      
      {/* Premium Header */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-xl z-20">
        <button 
          onClick={() => {
            setSelectedTx(null);
            setCurrentScreen('history');
          }}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-950 shadow-sm border border-slate-200 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-black text-blue-950 tracking-tight">Detail Transaksi</h1>
        <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-2 custom-scrollbar space-y-5">
        
        {/* Main Digital Receipt Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Amount Section */}
          <div className="text-center pb-6 border-b border-dashed border-slate-200 relative z-10">
            <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100/50 shadow-sm">
              <ScanLine className="w-6 h-6" />
            </div>
            <h4 className="text-[22px] font-black text-blue-950 leading-tight mb-2 tracking-tight">{selectedTx.merchant}</h4>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              selectedTx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
              selectedTx.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
              'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>
              {selectedTx.status === 'Approved' && <Check className="w-3 h-3" />}
              {selectedTx.status === 'Rejected' && <X className="w-3 h-3" />}
              {selectedTx.status === 'Pending' && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
              {selectedTx.status === 'Approved' ? 'SELESAI' : selectedTx.status === 'Rejected' ? 'DITOLAK' : 'PROSES'}
            </div>

            <div className="mt-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Nominal</span>
              <span className="text-4xl font-black font-display tracking-tighter text-blue-950">Rp {selectedTx.amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Details Section */}
          <div className="py-6 space-y-4 border-b border-dashed border-slate-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-[12px] font-bold text-slate-500">Tipe Pengajuan</span>
              </div>
              <span className="text-[12px] font-black text-blue-950 uppercase">{selectedTx.type === 'reimburse' || (selectedTx.type as string) === 'reimbursement' ? 'Reimbursement' : 'Cash Advance'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-[12px] font-bold text-slate-500">Kategori</span>
              </div>
              <span className="text-[12px] font-black text-blue-950">{selectedTx.category}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-[12px] font-bold text-slate-500">Tanggal Invoice</span>
              </div>
              <span className="text-[12px] font-black text-blue-950">{selectedTx.date}</span>
            </div>
          </div>

          {/* Line Items Section */}
          {selectedTx.items && selectedTx.items.length > 0 && (
            <div className="py-6 border-b border-dashed border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Detail Produk / Item</span>
              <div className="space-y-4">
                {selectedTx.items.map((item, idx) => (
                  <div key={item.id || idx} className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-blue-950 leading-tight">{item.name}</span>
                      <span className="text-[11px] font-bold text-slate-400 mt-1">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <span className="text-[13px] font-black text-blue-950">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedTx.notes && (
            <div className="pt-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Catatan Tambahan</span>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                  "{selectedTx.notes}"
                </p>
              </div>
            </div>
          )}

          {/* Rejection Notification box */}
          {selectedTx.status === 'Rejected' && selectedTx.rejectReason && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h6 className="font-black text-[12px] text-rose-900 uppercase tracking-widest mb-1">Alasan Penolakan</h6>
                <p className="text-[12px] font-bold text-rose-700 leading-snug">"{selectedTx.rejectReason}"</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tracking Status Timeline */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <span className="text-[12px] font-black text-blue-950 uppercase tracking-widest block mb-5">Tracking Status</span>
          
          <div className="space-y-6 relative pl-4 border-l-2 border-slate-100 ml-3 py-1">
            {/* Step 1: Pengajuan */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-5 h-5 rounded-full bg-white border-[3px] border-emerald-500 flex items-center justify-center z-10">
                <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[4]" />
              </div>
              <div className="leading-snug pl-2">
                <span className="font-black text-[13px] block text-blue-950">
                  Pengajuan Terkirim
                </span>
                <span className="text-[11px] font-bold text-slate-400 block mt-1">
                  {selectedTx.createdAt || selectedTx.date}
                </span>
              </div>
            </div>

            {/* Step 2: Status Akhir */}
            <div className="relative">
              <div className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center z-10 border-[3px] bg-white ${
                selectedTx.status === 'Approved' ? 'border-emerald-500 text-emerald-500' : 
                selectedTx.status === 'Rejected' ? 'border-rose-500 text-rose-500' : 
                'border-amber-500 text-amber-500'
              }`}>
                {selectedTx.status === 'Approved' && <Check className="w-2.5 h-2.5 stroke-[4] text-emerald-500" />}
                {selectedTx.status === 'Rejected' && <X className="w-2.5 h-2.5 stroke-[4] text-rose-500" />}
                {selectedTx.status === 'Pending' && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>}
              </div>
              <div className="leading-snug pl-2">
                <span className={`font-black text-[13px] block ${
                  selectedTx.status === 'Approved' ? 'text-emerald-700' : 
                  selectedTx.status === 'Rejected' ? 'text-rose-700' : 'text-amber-700'
                }`}>
                  {selectedTx.status === 'Approved' ? 'Disetujui Perusahaan' : 
                   selectedTx.status === 'Rejected' ? 'Ditolak Perusahaan' : 'Menunggu Review Admin'}
                </span>
                <span className="text-[11px] font-bold text-slate-400 block mt-1">
                  {selectedTx.status === 'Pending' ? 'Sedang diproses...' : 'Selesai'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons (Edit / Delete if Pending) */}
        {selectedTx.status === 'Pending' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {onEditClick && (
              <button 
                onClick={() => onEditClick(selectedTx)}
                className="bg-white text-blue-700 py-3.5 rounded-2xl border border-slate-200 font-bold text-[13px] flex justify-center items-center gap-2 active:scale-95 transition-all shadow-sm hover:bg-slate-50"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            )}
            {onDeleteClick && (
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="bg-rose-50 text-rose-600 py-3.5 rounded-2xl border border-rose-100 font-bold text-[13px] flex justify-center items-center gap-2 active:scale-95 transition-all shadow-sm hover:bg-rose-100"
              >
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
            )}
          </motion.div>
        )}

        {/* Bukti Nota Button */}
        {selectedTx.receiptUrl && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <button 
              onClick={() => setZoomReceipt(true)}
              className="w-full bg-blue-950 text-white p-4 rounded-[1.25rem] font-bold text-[14px] flex justify-between items-center shadow-lg hover:bg-blue-900 active:scale-95 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Lihat Bukti Struk/Nota
              </div>
              <Maximize2 className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Receipt Modal */}
      <AnimatePresence>
        {zoomReceipt && selectedTx.receiptUrl && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 z-50 backdrop-blur-md"
              onClick={() => setZoomReceipt(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute inset-4 z-50 flex flex-col pointer-events-none"
            >
              <div className="flex justify-end mb-4 pointer-events-auto">
                <button 
                  onClick={() => setZoomReceipt(false)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm border border-white/20 active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl relative pointer-events-auto">
                <img 
                  src={selectedTx.receiptUrl} 
                  alt="Receipt Fullscreen" 
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 z-50 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <div className="absolute inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl pointer-events-auto border border-slate-100"
              >
                <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mb-5 mx-auto border border-rose-100">
                  <Trash2 className="w-6 h-6 text-rose-500" />
                </div>
                
                <h3 className="text-xl font-black text-blue-950 text-center mb-2 tracking-tight">Hapus Pengajuan?</h3>
                <p className="text-[13px] text-slate-500 text-center leading-relaxed mb-6 px-2">
                  Apakah Anda yakin ingin menghapus pengajuan {selectedTx.type === 'reimburse' ? 'reimburse' : 'kasbon'} ini? Data yang telah dihapus tidak dapat dikembalikan.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="py-3.5 rounded-2xl font-bold text-[13px] text-slate-500 bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => {
                      setShowDeleteModal(false);
                      if (onDeleteClick) onDeleteClick(selectedTx);
                    }}
                    className="py-3.5 rounded-2xl font-bold text-[13px] text-white bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all shadow-md shadow-rose-500/20"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
