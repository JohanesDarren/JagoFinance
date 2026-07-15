import React, { useState } from 'react';
import { 
  Send, Users, MapPin, CheckCircle, MessageSquare, AlertCircle
} from 'lucide-react';
import { WebScreenProps } from '../shared/WebScreenProps';
import { INITIAL_BRANCHES } from '../../../utils/mockData';

export default function BroadcastScreen(props: WebScreenProps) {
  const { employees } = props;
  const branches = props.branches || INITIAL_BRANCHES;

  const [targetType, setTargetType] = useState<'all' | 'branch' | 'employees'>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    // Simulate sending
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setTitle('');
      setMessage('');
      setTargetType('all');
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
                  
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <MessageSquare className="w-8 h-8 text-indigo-300" strokeWidth="2.5" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-white">Broadcast Pengumuman</h2>
            <p className="text-indigo-200 mt-3 text-base max-w-xl font-medium">Kirimkan informasi atau pesan massal ke seluruh karyawan, cabang tertentu, atau grup khusus.</p>
          </div>
        </div>
      </div>

      {isSent && (
        <div className="bg-emerald-500 text-white p-5 rounded-2xl flex items-center gap-4 shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle className="w-7 h-7" />
          <div>
            <div className="font-bold">Pengumuman Berhasil Terkirim!</div>
            <div className="text-emerald-100 text-sm mt-1">Sistem sedang mendistribusikan email dan notifikasi push ke target yang dipilih.</div>
          </div>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSend} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-150 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar Settings */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Target Penerima</label>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${targetType === 'all' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="target" checked={targetType === 'all'} onChange={() => setTargetType('all')} className="hidden" />
                  <Users className={`w-5 h-5 ${targetType === 'all' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm">Seluruh Karyawan (Semua Cabang)</span>
                </label>
                
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${targetType === 'branch' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="target" checked={targetType === 'branch'} onChange={() => setTargetType('branch')} className="hidden" />
                  <MapPin className={`w-5 h-5 ${targetType === 'branch' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm">Pilih Cabang Spesifik</span>
                </label>
              </div>
            </div>

            {targetType === 'branch' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Pilih Cabang</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-sm"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Cabang --</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Editor Area */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Subjek / Judul Pesan</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Pengumuman THR 2026"
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl p-4 text-lg font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Isi Pengumuman</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tuliskan isi pesan secara mendetail..."
                required
                rows={8}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl p-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner resize-y min-h-[200px]"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>Pesan tidak dapat ditarik kembali setelah dikirim.</span>
              </div>
              
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
              >
                <span>Kirim Broadcast</span>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
