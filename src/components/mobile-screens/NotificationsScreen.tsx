import React from 'react';
import { ArrowLeft, CheckCircle, Info, XCircle, AlertCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsScreenProps {
  setCurrentScreen: (screen: any) => void;
  notifications?: any[];
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeRight = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function NotificationsScreen({
  setCurrentScreen,
  notifications = []
}: NotificationsScreenProps) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'info':
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100';
      case 'error': return 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100';
      case 'warning': return 'bg-amber-50 text-amber-600 shadow-sm border border-amber-100';
      case 'info':
      default: return 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100';
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden font-sans"
    >
      <div className="p-5 pt-8 pb-28 flex-1 flex flex-col relative z-10 overflow-y-auto custom-scrollbar h-full space-y-6">

        {notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm text-center space-y-4 mt-6"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-[1.25rem] flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-600">Belum ada notifikasi baru.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {notifications.map(notif => (
                <motion.div 
                  key={notif.id} 
                  variants={fadeRight}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex gap-4 cursor-pointer group transition-colors hover:border-slate-300`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getStyle(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h5 className="font-black text-[14px] text-blue-950 leading-tight">{notif.title}</h5>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0 whitespace-nowrap mt-0.5">{formatTime(notif.timestamp)}</span>
                    </div>
                    <p className="text-[12px] font-bold text-slate-500 leading-relaxed">{notif.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
