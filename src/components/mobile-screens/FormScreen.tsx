import React, { useState } from 'react';
import { ArrowLeft, X, Loader2, CheckCircle, Receipt, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FormScreenProps {
  setCurrentScreen: (screen: any) => void;
  scanImage: string | null;
  scanImageName: string;
  formType: 'reimburse' | 'cash_advance';
  formError: string;
  formMerchant: string;
  setFormMerchant: (val: string) => void;
  formDate: string;
  setFormDate: (val: string) => void;
  formCategory: string;
  setFormCategory: (val: string) => void;
  formAmount: number;
  setFormAmount: (val: number) => void;
  formItems: any[];
  handleItemChange: (index: number, field: string, value: string | number) => void;
  addManualItem: () => void;
  removeItem: (index: number) => void;
  formNotes: string;
  setFormNotes: (val: string) => void;
  isSubmitting: boolean;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function FormScreen({
  setCurrentScreen,
  scanImage,
  scanImageName,
  formType,
  formError,
  formMerchant,
  setFormMerchant,
  formDate,
  setFormDate,
  formCategory,
  setFormCategory,
  formAmount,
  setFormAmount,
  formItems,
  handleItemChange,
  addManualItem,
  removeItem,
  formNotes,
  setFormNotes,
  isSubmitting,
  handleFormSubmit
}: FormScreenProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const formatRupiah = (val: number | string) => {
    if (val === 0 || val === '0') return '0';
    if (!val) return '';
    const num = Number(val.toString().replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handlePriceFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden font-sans"
    >
      <div className="p-5 pt-8 space-y-6 relative z-10 overflow-y-auto pb-28 custom-scrollbar h-full">
        
        {/* Header */}
        <div className="flex justify-between items-center text-blue-950">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentScreen('scanner')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <span className="text-[13px] font-black font-display tracking-widest uppercase">Form Pengajuan</span>
          <div className="w-10"></div>
        </div>

        {/* Mini Receipt Preview (Premium Black) */}
        {scanImage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-950 rounded-[1.5rem] relative overflow-hidden h-36 border border-slate-800 shadow-2xl"
          >
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              src={scanImage} 
              alt="Scanned file preview" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-blue-950/60 to-transparent flex items-end p-5">
              <div className="text-white w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1 block">Tipe Pengajuan</span>
                    <h6 className="text-lg font-black truncate w-[200px] text-white">{formType === 'reimburse' ? 'Reimbursement' : 'Cash Advance'}</h6>
                  </div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Review Form (Clean Bento Layout) */}
        <form onSubmit={handleFormSubmit} className="space-y-4 relative overflow-hidden">
          
          <AnimatePresence>
            {formError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-rose-50 text-rose-800 text-xs rounded-[1.5rem] border border-rose-100 flex items-start gap-3 shadow-sm"
              >
                <X className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                <div>
                  <span className="font-bold block mb-1 text-sm">Penyerahan Gagal</span>
                  <span className="font-medium text-rose-700">{formError}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Merchant / Toko</label>
            <input 
              type="text" 
              value={formMerchant}
              onFocus={() => setFocusedInput('merchant')}
              onBlur={() => setFocusedInput(null)}
              onChange={(e) => setFormMerchant(e.target.value)}
              className="w-full text-lg font-black text-blue-950 bg-transparent outline-none placeholder:text-slate-300"
              placeholder="Masukkan nama merchant"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tanggal Nota</label>
              <input 
                type="date" 
                value={formDate}
                onFocus={() => setFocusedInput('date')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full text-sm font-bold text-blue-950 bg-transparent outline-none"
                required
              />
            </div>

            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200 relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kategori</label>
              <select 
                value={formCategory}
                onFocus={() => setFocusedInput('category')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full text-sm font-bold text-blue-950 bg-transparent outline-none appearance-none cursor-pointer"
              >
                <option value="Infrastruktur & Cloud">Infrastruktur & Cloud</option>
                <option value="Operasional & Alat">Operasional & Alat</option>
                <option value="Pemasaran & Branding">Pemasaran & Branding</option>
                <option value="Konsumsi">Konsumsi</option>
                <option value="Transportasi & Logistik">Transportasi & Logistik</option>
                <option value="Lain-lain / Darurat">Lain-lain / Darurat</option>
              </select>
              <div className="absolute right-4 top-[2.4rem] pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Line Items Section (Bento Style) */}
          <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Item</label>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                type="button" 
                onClick={addManualItem}
                className="text-[10px] font-black text-blue-950 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Tambah Manual
              </motion.button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {formItems.map((item, idx) => (
                  <motion.div 
                    key={item.id || idx}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.9, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pb-4 border-b border-slate-100 last:border-0 last:pb-0 relative group"
                  >
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      type="button" 
                      onClick={() => removeItem(idx)}
                      className="absolute top-1 right-0 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                    
                    <div className="space-y-3 pr-8">
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        className="w-full text-sm font-bold text-blue-950 bg-transparent outline-none placeholder:text-slate-300"
                        placeholder="Nama Produk"
                      />
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">Rp</span>
                          <input 
                            type="text" 
                            value={formatRupiah(item.price)}
                            onFocus={handlePriceFocus}
                            onChange={(e) => {
                               const raw = e.target.value.replace(/[^0-9]/g, '');
                               handleItemChange(idx, 'price', Number(raw));
                            }}
                            className="w-full pl-6 py-1 text-sm bg-transparent font-mono font-bold text-blue-950 outline-none"
                            placeholder="0"
                          />
                        </div>
                        <div className="w-20 relative border-l border-slate-200 pl-3">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">Qty</span>
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                            className="w-full pl-7 py-1 text-sm bg-transparent font-bold text-blue-950 outline-none"
                            placeholder="1"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {formItems.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[11px] text-slate-400 font-bold text-center py-6 bg-slate-50 rounded-xl"
                >
                  Belum ada item produk terdeteksi.
                </motion.div>
              )}
            </div>
          </div>

          <div className="bg-blue-950 p-6 rounded-[1.5rem] shadow-xl text-center relative overflow-hidden">
             {/* Shine effect */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
             
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Nominal Tagihan</label>
             <div className="flex justify-center items-center gap-1 relative z-10">
               <span className="text-sm font-black text-slate-500">Rp</span>
               <input 
                 type="text" 
                 value={formatRupiah(formAmount)}
                 readOnly
                 className="w-full max-w-[200px] text-3xl bg-transparent outline-none font-mono font-black text-white text-center cursor-not-allowed"
                 placeholder="0"
                 required
               />
             </div>
          </div>

          <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Catatan Tambahan (Opsional)</label>
            <textarea 
              value={formNotes}
              onFocus={() => setFocusedInput('notes')}
              onBlur={() => setFocusedInput(null)}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              className="w-full text-sm bg-transparent outline-none resize-none font-medium text-blue-950 placeholder:text-slate-300"
              placeholder="Contoh: Beli kopi untuk meeting klien..."
            />
          </div>

          <div className="pt-4">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-blue-950 text-white font-black text-[13px] uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-blue-950/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Simpan Pengajuan</span>
                </>
              )}
            </motion.button>
          </div>
        </form>

      </div>
    </motion.div>
  );
}
