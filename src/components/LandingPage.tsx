import React, { useState, useEffect } from 'react';
import { 
  Building2, ArrowRight, ShieldCheck, Zap, Sparkles, LayoutGrid, 
  Wallet, Cpu, CloudCog, Banknote, BookMarked, User, ChevronRight,
  BarChart3, Globe, LineChart, Server, MessageCircle, Star, Search, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      title: 'AI Receipt Scanner',
      description: 'Ekstraksi otomatis seketika. Hermes AI membaca ribuan struk tanpa entri manual.',
      color: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-600" />,
      title: 'Automated Webhooks',
      description: 'Push notification real-time dari Payment Gateway langsung ke dashboard Anda.',
      color: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      icon: <CloudCog className="w-6 h-6 text-purple-600" />,
      title: 'SaaS Tracking',
      description: 'Pantau pengeluaran cloud & subscription. Cegah autodebet siluman.',
      color: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      icon: <Banknote className="w-6 h-6 text-blue-600" />,
      title: 'Mass Payroll API',
      description: 'Penggajian massal instan yang terhubung langsung ke API Bank komersial.',
      color: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-orange-600" />,
      title: 'Multi-Tenant',
      description: 'Satu sentralisasi kas untuk semua sub-produk dan unit bisnis startup Anda.',
      color: 'bg-orange-50',
      border: 'border-orange-100'
    },
    {
      icon: <BookMarked className="w-6 h-6 text-rose-600" />,
      title: 'Real-time Ledger',
      description: 'Buku besar dengan debit/kredit yang rapi, transparan, dan siap diaudit.',
      color: 'bg-rose-50',
      border: 'border-rose-100'
    }
  ];

  const faqs = [
    {
      q: "Apakah JagoFinance terintegrasi dengan Bank Mandiri & BCA?",
      a: "Ya! JagoFinance memiliki integrasi native dengan API Corporate Banking dari Bank Mandiri (Kopra) dan BCA (KlikBCA Bisnis) untuk eksekusi payroll massal langsung dari dashboard."
    },
    {
      q: "Bagaimana cara kerja Hermes AI Scanner?",
      a: "Staff Anda cukup memfoto struk menggunakan aplikasi mobile kami. Hermes AI akan mendeteksi merchant, tanggal, total, dan kategori pengeluaran dengan tingkat akurasi 99.4%, sehingga staf finance hanya perlu meng-klik 'Approve'."
    },
    {
      q: "Apakah data finansial perusahaan saya aman?",
      a: "Sangat aman. Kami menggunakan enkripsi AES-256 untuk data at rest, sertifikasi ISO 27001, dan database yang sepenuhnya terisolasi (multi-tenant) di server enterprise."
    },
    {
      q: "Bisakah saya menyambungkan Payment Gateway kustom (Midtrans/Xendit)?",
      a: "Tentu. Fitur 'Automated Webhooks' kami memungkinkan Anda menerima push notification webhook langsung dari Midtrans, Xendit, atau Stripe, dan mutasi kas akan langsung masuk ke ledger tanpa delay."
    }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-600 font-sans selection:bg-indigo-500/20 selection:text-indigo-900 relative overflow-hidden">
      
      {/* Light Space Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <motion.div 
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-100/60 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-100/60 rounded-full blur-[120px]"
        />
      </div>

      {/* Modern Floating Header */}
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-5xl rounded-full ${scrolled ? 'bg-white/80 backdrop-blur-xl border border-black/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.04)] py-3 px-6' : 'bg-transparent border-transparent py-4 px-6'}`}>
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              jago<span className="text-indigo-600">Finance</span>
            </span>
          </motion.div>
          
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">Workflow</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </motion.nav>

          <motion.button 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onClick={onLoginClick}
            className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)]"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </motion.button>
        </div>
      </header>

      {/* Minimalist Hero Section */}
      <section className="pt-48 pb-20 px-6 relative z-10 min-h-[95vh] flex flex-col justify-center items-center text-center">
        <motion.div 
          initial="hidden" animate="show" variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-10 relative"
        >
          {/* Subtle glowing pill */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/60 border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-indigo-600 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> JagoFinance OS 2.0 is now live
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-8xl font-medium tracking-tighter text-slate-900 leading-[1.05]">
            Otomasi Keuangan.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 font-bold">
              Kini Digerakkan AI.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Tinggalkan entri manual. Kelola arus kas, rekonsiliasi seketika, dan lakukan payroll massal dengan infrastruktur finansial yang didesain untuk startup modern.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-[15px] hover:scale-105 transition-transform shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              Mulai Gratis <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full font-semibold text-[15px] shadow-sm transition-colors"
            >
              Jadwalkan Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Abstract UI */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 40, damping: 20, delay: 0.4 }}
          className="w-full max-w-5xl mx-auto mt-24 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl -z-10 rounded-full h-40"></div>
          <div className="bg-white/60 backdrop-blur-2xl border border-slate-200/60 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-2 sm:p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-6 py-4 bg-slate-50/80 border-b border-slate-100">
                <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20"></div>
              </div>
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 md:col-span-2 space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Kas Aktif (IDR)</div>
                      <div className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight">Rp 4.500.000.000</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-5 gap-5 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200"><ArrowUpRight className="w-5 h-5" /></div>
                      <div className="flex-1"><div className="h-2.5 w-1/3 bg-slate-200 rounded-full"></div></div>
                      <div className="font-mono text-emerald-600 font-bold text-[15px]">+ 25.0M</div>
                    </div>
                    <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-5 gap-5 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 border border-rose-200"><ArrowRight className="w-5 h-5" /></div>
                      <div className="flex-1"><div className="h-2.5 w-1/4 bg-slate-200 rounded-full"></div></div>
                      <div className="font-mono text-rose-600 font-bold text-[15px]">- 8.4M</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 hover:shadow-lg transition-shadow duration-300">
                    <Sparkles className="w-6 h-6 text-indigo-600 mb-4" />
                    <div className="text-[15px] font-medium text-indigo-900 leading-relaxed">AI Scanner memproses 12 struk otomatis hari ini.</div>
                  </div>
                  <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100 hover:shadow-lg transition-shadow duration-300">
                    <Cpu className="w-6 h-6 text-purple-600 mb-4" />
                    <div className="text-[15px] font-medium text-purple-900 leading-relaxed">Webhook tersinkronisasi dalam 0.2 detik.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-200/60 bg-white/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200">
          {[
            { value: "10M+", label: "Transaksi Diproses" },
            { value: "99.9%", label: "SLA Uptime" },
            { value: "0s", label: "Delay Sinkronisasi" },
            { value: "50+", label: "Klien Enterprise" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-light text-slate-900 mb-2">{stat.value}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mb-24 text-center md:text-left">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-medium text-slate-900 tracking-tight mb-6">
              Dibangun untuk kecepatan.<br/> Didesain untuk skala.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-xl max-w-2xl">Semua alat krusial yang dibutuhkan tim finance, dalam satu platform yang super ringan dan elegan.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className={`bg-white p-10 rounded-[2.5rem] border ${feature.border} shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden group hover:-translate-y-1`}>
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center border ${feature.border} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Minimal Workflow */}
      <section id="how-it-works" className="py-32 px-6 relative z-10 border-t border-slate-200/60 bg-gradient-to-b from-transparent to-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="md:w-1/2 space-y-8">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-medium text-slate-900 tracking-tight leading-[1.1]">
              Lupakan sinkronisasi manual.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-xl leading-relaxed">
              Workflow JagoFinance berjalan transparan di balik layar. Anda cukup fokus pada keputusan strategis perusahaan.
            </motion.p>
            
            <div className="space-y-8 pt-8">
              {[
                { title: 'Koneksikan Gateway', desc: 'Integrasi webhook instan hanya dengan 1 klik.' },
                { title: 'AI Membaca Data', desc: 'Struk, invoice, dan mutasi dipetakan secara otomatis.' },
                { title: 'Ledger Diperbarui', desc: 'Laporan keuangan siap saji secara real-time.' }
              ].map((step, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-900 text-lg font-bold font-mono shrink-0 shadow-sm group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors">0{i+1}</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-slate-500 font-medium text-[15px]">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:w-1/2 w-full">
            <div className="bg-white rounded-[3rem] border border-slate-200/80 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
              <div className="bg-slate-50/80 rounded-[2.5rem] p-8 md:p-10 space-y-5 border border-slate-100">
                {[
                  { icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', title: 'Webhook Triggered', subtitle: 'Midtrans / Xendit' },
                  { icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200', title: 'Data Processed', subtitle: 'Hermes AI Engine' },
                  { icon: BookMarked, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200', title: 'Ledger Posted', subtitle: 'Main Account' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-slate-900 text-[15px] font-bold">{item.title}</div>
                      <div className="text-slate-500 text-sm font-medium mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Minimal */}
      <section className="py-32 px-6 relative z-10 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-medium text-slate-900 tracking-tight leading-[1.05]">
            Mulai otomatisasi <br className="hidden md:block"/> keuangan Anda.
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan puluhan startup modern lain yang telah menyederhanakan pembukuan kas mereka bersama JagoFinance.
          </p>
          <div className="pt-4 flex justify-center">
            <button 
              onClick={onLoginClick}
              className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-[17px] shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-transform hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.2)] flex items-center gap-3"
            >
              Buka Portal JagoFinance <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              jago<span className="text-indigo-600">Finance</span>
            </span>
          </div>
          <div className="flex gap-8 text-[15px] font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
