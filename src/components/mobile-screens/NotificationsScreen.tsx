import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle, Info, XCircle, AlertCircle } from 'lucide-react';

interface NotificationsScreenProps {
  setCurrentScreen: (screen: any) => void;
  notifications?: any[];
}

export default function NotificationsScreen({
  setCurrentScreen,
  notifications = []
}: NotificationsScreenProps) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'info':
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'error': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'info':
      default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return new Date(ts).toLocaleDateString('id-ID');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => setCurrentScreen('home')} className="p-1.5 bg-slate-50 text-slate-600 rounded-lg shadow-2xs">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-xs text-slate-800">Notifikasi</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 pb-24">
        {notifications.length === 0 ? (
          <div className="text-center p-8 text-slate-400">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-[10px] font-bold">Belum ada notifikasi baru.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="bg-white p-3 rounded-2xl shadow-3xs border border-slate-50 flex gap-3">
              <div className={`p-2 rounded-xl h-fit border ${getStyle(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div>
                <h5 className="font-bold text-[11px] text-slate-800">{notif.title}</h5>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                <span className="text-[8px] font-bold text-slate-400 mt-1 block">{formatTime(notif.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
