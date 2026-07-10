import React from 'react';
import { ArrowLeft, X, Loader2, CheckCircle } from 'lucide-react';

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
        <div className="bg-slate-100 rounded-xl relative overflow-hidden h-24 border border-dashed border-slate-200">
          <img src={scanImage} alt="Scanned file preview" className="w-full h-full object-cover blur-[0.5px] opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
            <div className="text-white">
              <span className="text-[8px] uppercase tracking-wider bg-indigo-600 px-1.5 py-0.5 rounded-full inline-block font-semibold">Tipe: {formType === 'reimburse' ? 'Reimburse' : 'Cash Advance'}</span>
              <h6 className="text-[9px] font-mono mt-1 opacity-90 truncate w-[250px]">{scanImageName || 'reimburse_invoice.png'}</h6>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleFormSubmit} className="space-y-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-3xs">
        
        {formError && (
          <div className="p-2.5 bg-rose-50 text-rose-800 text-[10px] rounded-lg border border-rose-100">
            <span className="font-semibold block mb-0.5">Penyerahan Gagal</span>
            {formError}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Nama Merchant / Toko</label>
          <input 
            type="text" 
            value={formMerchant}
            onChange={(e) => setFormMerchant(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none font-semibold text-slate-850"
            placeholder="Masukkan nama merchant"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tanggal Nota</label>
            <input 
              type="date" 
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pilih Kategori</label>
            <select 
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            >
              <option value="Operasional">Operasional</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Server">Server</option>
              <option value="Marketing">Marketing</option>
              <option value="Utilitas & Kantor">Utilitas & Kantor</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Nominal Tagihan (IDR)</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">Rp</span>
            <input 
              type="number" 
              value={formAmount || ''}
              onChange={(e) => setFormAmount(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none font-mono font-bold text-slate-800"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Line Items Section */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Produk Terdeteksi</label>
            <button 
              type="button" 
              onClick={addManualItem}
              className="text-[9px] font-bold text-brand bg-indigo-50 px-2 py-1 rounded-md"
            >
              + Tambah Manual
            </button>
          </div>

          <div className="space-y-2">
            {formItems.map((item, idx) => (
              <div key={item.id || idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex gap-2 items-center relative">
                <button 
                  type="button" 
                  onClick={() => removeItem(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-100 text-rose-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="flex-1 space-y-1">
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    className="w-full text-[10px] bg-white border border-slate-200 rounded px-2 py-1 font-semibold"
                    placeholder="Nama Produk"
                  />
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-1.5 top-1 text-[9px] font-bold text-slate-500">Rp</span>
                      <input 
                        type="number" 
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, 'price', Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1 text-[10px] bg-white border border-slate-200 rounded font-mono"
                        placeholder="Harga"
                      />
                    </div>
                    <div className="w-16 relative">
                      <span className="absolute left-1.5 top-1 text-[9px] font-bold text-slate-500">x</span>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full pl-5 pr-2 py-1 text-[10px] bg-white border border-slate-200 rounded text-center"
                        placeholder="Qty"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {formItems.length === 0 && (
              <div className="text-[9px] text-slate-400 italic text-center py-2">Belum ada item produk terdeteksi.</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Catatan Tambahan (Opsional)</label>
          <textarea 
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            placeholder="Contoh: Beli kopi untuk meeting klien PT Sentosa..."
          />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-brand text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Mengirim Data...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Kirim ke Tim Keuangan</span>
            </>
          )}
        </button>
      </form>

    </div>
  );
}
