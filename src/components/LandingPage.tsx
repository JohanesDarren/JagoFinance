import React, { useState, useEffect } from 'react';
import { 
  Building2, ArrowRight, Sparkles, LayoutGrid, 
  Cpu, CloudCog, Banknote, BookMarked, User,
  Globe, ArrowUpRight, PlayCircle, ShieldCheck, Send
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setContactSent(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSent(false), 5000);
    }
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      title: 'AI Receipt Scanner',
      description: 'Ekstraksi otomatis seketika. Hermes AI membaca ribuan struk tanpa entri manual dengan akurasi 99.4%.',
      color: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      title: 'Automated Webhooks',
      description: 'Push notification real-time dari Payment Gateway langsung tersinkronisasi ke dashboard Anda.',
      color: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      icon: <CloudCog className="w-6 h-6 text-purple-400" />,
      title: 'SaaS Tracking',
      description: 'Pantau pengeluaran cloud & subscription. Cegah autodebet siluman secara proaktif.',
      color: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      icon: <Banknote className="w-6 h-6 text-blue-400" />,
      title: 'Mass Payroll API',
      description: 'Penggajian massal instan yang terhubung langsung ke API Bank komersial tanpa hambatan.',
      color: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-orange-400" />,
      title: 'Multi-Tenant',
      description: 'Satu sentralisasi kas untuk semua sub-produk dan unit bisnis startup Anda dengan akses RBAC.',
      color: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      icon: <BookMarked className="w-6 h-6 text-rose-400" />,
      title: 'Real-time Ledger',
      description: 'Buku besar dengan debit/kredit yang rapi, transparan, dan siap diaudit kapan saja.',
      color: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      
      {/* INJECT CUSTOM PREMIUM FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-space { font-family: 'Space Grotesk', monospace; }
        
        .mesh-bg {
          background-color: #030712;
          background-image: 
            radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,20%,0.3) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,20%,0.3) 0, transparent 50%);
        }

        .glass-card {
          background: rgba(17, 24, 39, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}} />

      {/* Ambient Deep Space Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 mesh-bg">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        <motion.div 
          style={{ y: y1 }}
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px]"
        />
        <motion.div 
          style={{ y: y2 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[140px]"
        />
      </div>

      {/* Modern Floating Header */}
      <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[92%] max-w-6xl rounded-full ${scrolled ? 'bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-3 px-6' : 'bg-transparent border-transparent py-4 px-6'}`}>
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[14px] flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-outfit">
              Jago<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Finance</span>
            </span>
          </motion.div>
          
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="hidden md:flex items-center gap-10 text-[14px] font-semibold text-slate-300 font-jakarta">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Klien</a>
          </motion.nav>

          <motion.button 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onClick={onLoginClick}
            className="group flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-jakarta"
          >
            <User className="w-4 h-4" />
            <span>Portal Login</span>
          </motion.button>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10 min-h-screen flex flex-col justify-center items-center text-center font-jakarta">
        <motion.div 
          initial="hidden" animate="show" variants={staggerContainer}
          className="max-w-5xl mx-auto space-y-8 relative z-20"
        >
          {/* Subtle glowing pill */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-xs font-bold text-indigo-300 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            JagoFinance OS 2.0 is now live
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-[5.5rem] font-black tracking-tight text-white leading-[1.05] font-outfit">
            Otomasi Keuangan.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 drop-shadow-sm">
              Kini Digerakkan AI.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            Tinggalkan entri manual. Kelola arus kas, rekonsiliasi seketika, dan lakukan payroll massal dengan infrastruktur finansial yang didesain untuk startup modern.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-[15px] hover:scale-105 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)]"
            >
              Mulai Eksplorasi <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-[15px] backdrop-blur-sm transition-all hover:scale-105"
            >
              <PlayCircle className="w-5 h-5" /> Lihat Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Abstract Dashboard Preview UI */}
        <motion.div 
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 30, damping: 20, delay: 0.6 }}
          className="w-full max-w-5xl mx-auto mt-24 relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
          
          <div className="glass-card rounded-t-[2.5rem] p-4 sm:p-6 shadow-[0_-20px_80px_rgba(79,70,229,0.15)] overflow-hidden relative group border-b-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="bg-slate-900/90 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative">
              {/* Fake Window Header */}
              <div className="flex items-center gap-2 px-6 py-4 bg-slate-800/50 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              
              {/* Fake App Body */}
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 md:col-span-2 space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 font-jakarta">Total Kas Aktif (IDR)</div>
                      <div className="text-4xl md:text-6xl font-black text-white tracking-tight font-space">
                        Rp 12.450.000.000
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-16 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center px-5 gap-5 backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><ArrowUpRight className="w-5 h-5" /></div>
                      <div className="flex-1"><div className="h-2.5 w-1/3 bg-slate-700 rounded-full"></div></div>
                      <div className="font-space text-emerald-400 font-bold text-[15px]">+ 450.0M</div>
                    </div>
                    <div className="h-16 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center px-5 gap-5 backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400"><ArrowRight className="w-5 h-5" /></div>
                      <div className="flex-1"><div className="h-2.5 w-1/4 bg-slate-700 rounded-full"></div></div>
                      <div className="font-space text-rose-400 font-bold text-[15px]">- 128.4M</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="bg-indigo-500/10 p-6 rounded-3xl border border-indigo-500/20 backdrop-blur-md">
                    <Sparkles className="w-6 h-6 text-indigo-400 mb-4" />
                    <div className="text-[15px] font-medium text-indigo-200 leading-relaxed font-jakarta">AI Scanner memproses 128 struk otomatis hari ini.</div>
                  </div>
                  <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
                    <div className="text-[15px] font-medium text-emerald-200 leading-relaxed font-jakarta">Payroll 45 karyawan tereksekusi aman via API.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y border-white/10 bg-white/5 backdrop-blur-md relative z-10 font-jakarta">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {[
            { value: "10M+", label: "Transaksi Diproses" },
            { value: "99.9%", label: "SLA Uptime" },
            { value: "0.2s", label: "Delay Sinkronisasi" },
            { value: "50+", label: "Klien Enterprise" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-space">{stat.value}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 relative z-10 font-jakarta">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mb-20 text-center md:text-left">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 font-outfit">
              Dibangun untuk kecepatan.<br/> Didesain untuk skala.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-xl max-w-2xl">Semua alat krusial yang dibutuhkan tim finance, dalam satu platform yang super ringan dan elegan.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp} 
                className={`glass-card p-8 rounded-[2.5rem] border ${feature.border} hover:bg-white/5 transition-all duration-500 relative overflow-hidden group hover:-translate-y-2`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center border ${feature.border} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10 font-outfit">{feature.title}</h3>
                <p className="text-slate-400 text-[15px] font-medium leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Minimal Workflow */}
      <section id="how-it-works" className="py-32 px-6 relative z-10 border-t border-white/10 bg-slate-900/30 font-jakarta">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="md:w-1/2 space-y-8">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-outfit">
              Lupakan sinkronisasi manual.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-xl leading-relaxed">
              Workflow JagoFinance berjalan transparan di balik layar. Anda cukup fokus pada keputusan strategis perusahaan.
            </motion.p>
            
            <div className="space-y-6 pt-8">
              {[
                { title: 'Koneksikan Gateway', desc: 'Integrasi webhook instan hanya dengan 1 klik ke Xendit/Midtrans.' },
                { title: 'AI Membaca Data', desc: 'Struk, invoice, dan mutasi dipetakan secara otomatis oleh sistem.' },
                { title: 'Ledger Diperbarui', desc: 'Laporan keuangan siap saji secara real-time untuk audit.' }
              ].map((step, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white text-xl font-bold font-space shrink-0 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors">0{i+1}</div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1.5 font-outfit">{step.title}</h4>
                    <p className="text-slate-400 font-medium text-[15px]">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:w-1/2 w-full">
            <div className="glass-card rounded-[3rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
              <div className="bg-slate-900/80 rounded-[2.5rem] p-8 md:p-10 space-y-5 border border-white/5">
                {[
                  { icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', title: 'Webhook Triggered', subtitle: 'Midtrans / Xendit' },
                  { icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', title: 'Data Processed', subtitle: 'Hermes AI Engine' },
                  { icon: BookMarked, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'Ledger Posted', subtitle: 'Main Account' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center`}>
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-white text-[16px] font-bold font-outfit">{item.title}</div>
                      <div className="text-slate-400 text-sm font-medium mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 relative z-10 font-jakarta border-t border-white/10 bg-gradient-to-b from-[#030712] to-slate-900/40">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 font-outfit">
              Punya Pertanyaan?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              Tim spesialis kami siap membantu Anda memahami bagaimana JagoFinance dapat mengoptimalkan kas perusahaan Anda.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
            
            {contactSent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-outfit">Pesan Terkirim!</h3>
                <p className="text-slate-400">Terima kasih telah menghubungi kami. Tim kami akan segera membalas email Anda dalam waktu 1x24 jam.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all font-jakarta"
                      placeholder="Cth: Budi Santoso"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Email Perusahaan</label>
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all font-jakarta"
                      placeholder="budi@perusahaan.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Pesan / Pertanyaan</label>
                  <textarea 
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all font-jakarta resize-none"
                    placeholder="Halo, saya ingin bertanya tentang fitur payroll massal..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all shadow-lg shadow-indigo-500/25 mt-4"
                >
                  <Send className="w-5 h-5" /> Kirim Pesan
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Minimal */}
      <section className="py-32 px-6 relative z-10 border-t border-white/10 font-jakarta">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[150px] -z-10 rounded-t-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] font-outfit">
            Mulai otomatisasi <br className="hidden md:block"/> keuangan Anda.
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan puluhan startup modern lain yang telah menyederhanakan pembukuan kas mereka bersama JagoFinance.
          </p>
          <div className="pt-8 flex justify-center">
            <button 
              onClick={onLoginClick}
              className="bg-white hover:bg-slate-100 text-slate-900 px-10 py-5 rounded-full font-bold text-[17px] shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center gap-3"
            >
              Buka Portal JagoFinance <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#030712] pt-20 pb-10 px-6 border-t border-white/10 font-jakarta">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight text-white font-outfit">
              Jago<span className="text-indigo-400">Finance</span>
            </span>
          </div>
          <div className="flex gap-8 text-[15px] font-bold text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
