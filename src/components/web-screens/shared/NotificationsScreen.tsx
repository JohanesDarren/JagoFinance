/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Transaction, Employee } from '../../../types';
import { Bell, CheckCircle, FileText, Wallet, Clock, CheckCircle2 } from 'lucide-react';

interface NotificationsScreenProps {
  transactions: Transaction[];
  employees: Employee[];
  onNavigate: (tab: 'approvals' | 'employees') => void;
}

type FilterStatus = 'Semua' | 'Belum Dibaca' | 'Sudah Dibaca';

export default function NotificationsScreen({ transactions, employees, onNavigate }: NotificationsScreenProps) {
  const [filter, setFilter] = useState<FilterStatus>('Semua');

  // Derive notifications from transactions and employees
  const notifications = useMemo(() => {
    const items: any[] = [];
    
    // 1. Transactions (Reimburse & Cash Advance)
    const relevantTransactions = transactions.filter(t => t.type === 'reimburse' || (t.type as string) === 'reimbursement' || t.type === 'cash_advance');
    relevantTransactions.forEach(t => {
      const empName = employees.find(e => e.id === t.employeeId)?.name || 'Karyawan';
      const isUnread = t.status === 'Pending';
      
      items.push({
        id: `tx-${t.id}`,
        type: 'reimburse',
        title: t.type === 'cash_advance' ? 'Pengajuan Cash Advance' : 'Pengajuan Reimburse',
        message: isUnread 
          ? `${empName} mengajukan klaim sebesar Rp ${(t.amount || 0).toLocaleString('id-ID')} dan menunggu persetujuan.`
          : `Klaim dari ${empName} sebesar Rp ${(t.amount || 0).toLocaleString('id-ID')} telah ${t.status === 'Approved' ? 'disetujui' : 'ditolak'}.`,
        date: new Date(t.date),
        isUnread,
        action: () => onNavigate('approvals')
      });
    });

    // 2. Bank Info Verifications
    const bankUpdateEmployees = employees.filter(e => e.bank_passbook_url);
    bankUpdateEmployees.forEach(e => {
      const isUnread = e.bank_validated === false || e.bank_validated == null;
      
      // Attempt to estimate a date (since Employee doesn't have an update_date field, we use a fallback)
      const date = new Date(); 
      if (!isUnread) {
        date.setDate(date.getDate() - 1); // Mock older date for read ones
      }

      items.push({
        id: `bank-${e.id}`,
        type: 'bank_update',
        title: 'Verifikasi Rekening Bank',
        message: isUnread 
          ? `${e.name} memperbarui informasi rekening dan butuh verifikasi.`
          : `Informasi rekening ${e.name} telah diverifikasi.`,
        date: date,
        isUnread,
        action: () => onNavigate('employees')
      });
    });

    // Sort by Date Descending
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, employees]);

  // Apply Filter
  const filteredNotifications = useMemo(() => {
    if (filter === 'Belum Dibaca') return notifications.filter(n => n.isUnread);
    if (filter === 'Sudah Dibaca') return notifications.filter(n => !n.isUnread);
    return notifications;
  }, [notifications, filter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Premium Header */}
      <div className="relative rounded-[2rem] p-8 overflow-hidden bg-white border border-slate-100 shadow-sm group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 opacity-100 transition-opacity duration-700"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 translate-x-1/3 -translate-y-1/3 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-violet-400 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 -translate-x-1/3 translate-y-1/3 mix-blend-multiply"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center relative shadow-xl shadow-indigo-200 ring-1 ring-white/50">
              <Bell className="w-8 h-8 text-white drop-shadow-md" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Pusat Notifikasi
            </h1>
            <p className="text-slate-500 font-medium">Lihat seluruh riwayat pengajuan, persetujuan, dan aktivitas sistem Anda.</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-full max-w-lg mx-auto md:mx-0 relative z-10 backdrop-blur-xl">
        {(['Semua', 'Belum Dibaca', 'Sudah Dibaca'] as FilterStatus[]).map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50' 
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              {tab}
              {tab === 'Belum Dibaca' && (
                <span className={`inline-flex items-center justify-center text-[10px] w-5 h-5 rounded-full font-black ${
                  isActive ? 'bg-white text-indigo-600 shadow-sm' : 'bg-rose-500 text-white shadow-sm'
                }`}>
                  {notifications.filter(n => n.isUnread).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {filteredNotifications.map((notif, index) => (
              <div 
                key={notif.id}
                onClick={notif.action}
                className={`p-6 flex items-start gap-5 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                  notif.isUnread ? 'bg-indigo-50/40 hover:bg-indigo-50/80' : 'bg-white hover:bg-slate-50/80'
                }`}
              >
                {/* Unread indicator line */}
                {notif.isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-violet-500"></div>
                )}
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                  notif.type === 'reimburse' 
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 text-amber-500' 
                    : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 text-emerald-500'
                }`}>
                  {notif.type === 'reimburse' ? <FileText className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1.5 gap-2 sm:gap-0">
                    <h3 className={`text-base font-bold truncate ${notif.isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notif.title}
                    </h3>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white shadow-sm border border-slate-100 px-3 py-1.5 rounded-xl shrink-0">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {notif.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${notif.isUnread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                    {notif.message}
                  </p>
                </div>

                {!notif.isUnread && (
                  <div className="hidden md:flex shrink-0 w-10 h-10 rounded-full bg-slate-50 items-center justify-center text-slate-400 self-center transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {notif.isUnread && (
                  <div className="shrink-0 self-center hidden md:block">
                    <span className="w-3 h-3 bg-brand rounded-full block shadow-[0_0_12px_rgba(79,70,229,0.6)] animate-pulse"></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak Ada Notifikasi</h3>
            <p className="text-slate-500 font-medium max-w-sm">
              {filter === 'Belum Dibaca' 
                ? 'Semua pekerjaan Anda sudah selesai. Tidak ada notifikasi yang membutuhkan tindakan.'
                : 'Belum ada riwayat aktivitas yang tercatat dalam sistem.'}
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
}
