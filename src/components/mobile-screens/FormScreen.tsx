import React from 'react';
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
    <div className="p-4 space-y-4">
      
      {/* Header return */}
      <div className="flex justify-between items-center mb-1">
        <button 
          onClick={() => setCurrentScreen('scanner')}
          className="p-1 text-slate-500 bg-white border border-slate-100 rounded-lg shadow-2xs flex items-center text-[10px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Ulangi
        </button>
        <span className="text-xs font-bold font-display text-slate-800">Verifikasi Hasil AI</span>
        <div className="w-8"></div>
      </div>

      {/* Mini Receipt Preview */}
      {scanImage && (
        <div className="bg-slate-900 rounded-2xl relative overflow-hidden h-28 border border-slate-800 shadow-xl">
          <img src={scanImage} alt="Scanned file preview" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex items-end p-4">
            <div className="text-white w-full">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold mb-1 block">Tipe Pengajuan</span>
                  <h6 className="text-sm font-semibold truncate w-[200px]">{formType === 'reimburse' ? 'Reimbursement' : 'Cash Advance'}</h6>
                </div>
                <Receipt className="w-5 h-5 text-indigo-400 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>

        {formError && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 flex items-start gap-2">
            <X className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
            <div>
              <span className="font-bold block mb-0.5">Penyerahan Gagal</span>
              <span>{formError}</span>
            </div>
          </div>
        )}

        <div className="relative z-10">
          <label className="block text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest mb-1.5">Nama Merchant / Toko</label>
          <input 
            type="text" 
            value={formMerchant}
            onChange={(e) => setFormMerchant(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none font-semibold text-slate-800 transition-all"
            placeholder="Masukkan nama merchant"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div>
            <label className="block text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest mb-1.5">Tanggal Nota</label>
            <input 
              type="date" 
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none font-medium text-slate-700 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest mb-1.5">Pilih Kategori</label>
            <select 
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none font-medium text-slate-700 transition-all appearance-none"
            >
              <option value="Infrastruktur & Cloud">Infrastruktur & Cloud</option>
              <option value="Operasional & Alat">Operasional & Alat</option>
              <option value="Pemasaran & Branding">Pemasaran & Branding</option>
              <option value="Konsumsi">Konsumsi</option>
              <option value="Transportasi & Logistik">Transportasi & Logistik</option>
              <option value="Lain-lain / Darurat">Lain-lain / Darurat</option>
            </select>
          </div>
        </div>

        {/* Total Nominal moved to bottom */}

        {/* Line Items Section */}
        <div className="pt-4 mt-2 border-t border-slate-100 relative z-10">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest">Produk Terdeteksi</label>
            <button 
              type="button" 
              onClick={addManualItem}
              className="text-[10px] font-bold text-brand bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Manual
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {formItems.map((item, idx) => (
                <motion.div 
                  key={item.id || idx}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.9, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex gap-3 items-center relative group hover:border-brand/30 hover:shadow-md transition-all"
                >
                  <button 
                    type="button" 
                    onClick={() => removeItem(idx)}
                    className="absolute -top-2 -right-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      className="w-full text-xs bg-slate-50 focus:bg-white border border-transparent focus:border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-700 outline-none transition-all"
                      placeholder="Nama Produk"
                    />
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-2.5 top-1.5 text-[10px] font-bold text-slate-400">Rp</span>
                        <input 
                          type="text" 
                          value={formatRupiah(item.price)}
                          onFocus={handlePriceFocus}
                          onChange={(e) => {
                             const raw = e.target.value.replace(/[^0-9]/g, '');
                             handleItemChange(idx, 'price', Number(raw));
                          }}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-transparent focus:border-slate-200 rounded-lg font-mono outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div className="w-20 relative">
                        <span className="absolute left-2.5 top-1.5 text-[10px] font-bold text-slate-400">x</span>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full pl-6 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-transparent focus:border-slate-200 rounded-lg text-center font-bold outline-none transition-all"
                          placeholder="Qty"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {formItems.length === 0 && (
              <div className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Belum ada item produk terdeteksi.
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <label className="block text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest mb-1.5">Total Nominal Tagihan (IDR)</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-sm font-bold text-slate-400">Rp</span>
            <input 
              type="text" 
              value={formatRupiah(formAmount)}
              readOnly
              className="w-full pl-10 pr-4 py-2.5 text-base bg-slate-100 border border-slate-200 rounded-xl outline-none font-mono font-bold text-slate-500 cursor-not-allowed transition-all"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="relative z-10 pt-2">
          <label className="block text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest mb-1.5">Catatan Tambahan (Opsional)</label>
          <textarea 
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all resize-none"
            placeholder="Contoh: Beli kopi untuk meeting klien PT Sentosa..."
          />
        </div>

        <div className="pt-4 relative z-10">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 transition-all text-center flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses Data...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Simpan Pengajuan Reimburse</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
