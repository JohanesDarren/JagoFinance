import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, ArrowRight, Sparkles, LayoutGrid, 
  Cpu, CloudCog, Banknote, BookMarked, User,
  Globe, ArrowUpRight, PlayCircle, ShieldCheck, Zap, ChevronRight
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onLoginClick: () => void;
}

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  key?: React.Key | null;
}
const SpotlightCard = ({ children, className = "", ...props }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-colors shadow-sm hover:shadow-md ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.05), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const { scrollY, scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatic feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-7 h-7 text-cyan-500" />,
      title: 'AI Receipt Scanner',
      description: 'Ekstraksi otomatis seketika. Hermes AI membaca ribuan struk tanpa entri manual dengan akurasi 99.9%.',
      color: 'from-cyan-50 to-blue-50',
      border: 'border-cyan-200',
      glow: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]'
    },
    {
      icon: <Cpu className="w-7 h-7 text-emerald-500" />,
      title: 'Automated Webhooks',
      description: 'Push notification real-time dari Payment Gateway langsung tersinkronisasi ke ledger Anda.',
      color: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      glow: 'shadow-[0_0_30px_rgba(52,211,153,0.15)]'
    },
    {
      icon: <CloudCog className="w-7 h-7 text-fuchsia-500" />,
      title: 'SaaS Tracking',
      description: 'Pantau pengeluaran cloud & subscription. Cegah autodebet siluman secara proaktif.',
      color: 'from-fuchsia-50 to-pink-50',
      border: 'border-fuchsia-200',
      glow: 'shadow-[0_0_30px_rgba(232,121,249,0.15)]'
    },
    {
      icon: <Banknote className="w-7 h-7 text-amber-500" />,
      title: 'Mass Payroll API',
      description: 'Penggajian massal instan yang terhubung langsung ke API Bank komersial tanpa hambatan.',
      color: 'from-amber-50 to-orange-50',
      border: 'border-amber-200',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]'
    },
    {
      icon: <LayoutGrid className="w-7 h-7 text-violet-500" />,
      title: 'Multi-Tenant OS',
      description: 'Satu sentralisasi kas untuk semua sub-produk dan unit bisnis startup Anda dengan akses RBAC.',
      color: 'from-violet-50 to-purple-50',
      border: 'border-violet-200',
      glow: 'shadow-[0_0_30px_rgba(167,139,250,0.15)]'
    },
    {
      icon: <BookMarked className="w-7 h-7 text-rose-500" />,
      title: 'Real-time Ledger',
      description: 'Buku besar dengan debit/kredit yang rapi, transparan, dan siap diaudit kapan saja.',
      color: 'from-rose-50 to-red-50',
      border: 'border-rose-200',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-600 font-sans selection:bg-cyan-100 selection:text-cyan-900 relative overflow-hidden">
      
      {/* INJECT CUSTOM PREMIUM FONTS & CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        /* Smooth Aurora Background Light */
        .aurora-bg {
          background: #fafafa;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: -20;
          overflow: hidden;
        }
        
        .aurora-blob {
          position: absolute;
          filter: blur(120px);
          opacity: 0.6;
          animation: float 20s infinite ease-in-out alternate;
          border-radius: 50%;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 10%) scale(1.1); }
          66% { transform: translate(-5%, 5%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        /* Glassmorphism utility */
        .premium-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 30px 60px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1);
        }

        /* Text Gradients */
        .text-gradient-primary {
          background: linear-gradient(135deg, #0f172a 0%, #4338ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .text-gradient-accent {
          background: linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Marquee Animation */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
      `}} />

      {/* Aurora Ambient Background Light */}
      <div className="aurora-bg">
        <div className="aurora-blob bg-cyan-200/50 w-[600px] h-[600px] top-[-20%] left-[-10%]" style={{ animationDelay: '0s' }}></div>
        <div className="aurora-blob bg-violet-200/50 w-[800px] h-[800px] top-[20%] right-[-20%]" style={{ animationDelay: '-5s' }}></div>
        <div className="aurora-blob bg-blue-200/40 w-[500px] h-[500px] bottom-[-20%] left-[20%]" style={{ animationDelay: '-10s' }}></div>
      </div>
      
      {/* Noise Overlay for texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[-15] mix-blend-multiply" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* Modern Floating Header */}
      <header className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[92%] max-w-6xl rounded-full ${scrolled ? 'top-4 bg-white/80 backdrop-blur-xl border border-slate-200 py-3 px-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]' : 'top-6 bg-transparent border-transparent py-3 px-6'}`}>
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">
              Jago<span className="text-gradient-accent">Finance</span>
            </span>
          </motion.div>
          
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hidden md:flex items-center gap-8 text-[14px] font-bold text-slate-500 font-jakarta">
            <a href="#platform" className="hover:text-slate-900 transition-colors">Platform</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">Workflow</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          </motion.nav>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <button 
              onClick={onLoginClick}
              className="relative overflow-hidden group flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-[14px] transition-all hover:scale-[1.02] active:scale-95 font-jakarta shadow-md hover:shadow-lg hover:shadow-slate-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <User className="w-4 h-4 relative z-10 text-white" />
              <span className="relative z-10">Buka Portal</span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center justify-center text-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 bg-white/40 border border-slate-200/60 px-5 py-2 rounded-full text-xs font-bold text-slate-800 backdrop-blur-xl mb-10 hover:bg-white/60 transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600">
            <Zap className="w-3 h-3" />
          </div>
          <span>JagoFinance OS 2.0 Telah Hadir</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.9] font-outfit max-w-5xl"
        >
          <span className="text-slate-900">Otomasi Keuangan.</span><br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">Kini Digerakkan AI.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-lg sm:text-xl text-slate-500 font-medium max-w-3xl leading-relaxed font-jakarta"
        >
          Tinggalkan entri manual. Kelola arus kas, rekonsiliasi seketika, dan lakukan payroll massal dengan infrastruktur finansial yang didesain khusus untuk enterprise modern.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold text-[15px] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.12)] font-jakarta overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center gap-2">Mulai Eksplorasi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </button>
          
          <button className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white/60 border border-slate-200/80 hover:bg-white text-slate-700 px-10 py-4 rounded-full font-bold text-[15px] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md font-jakarta">
            <PlayCircle className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" /> 
            <span>Lihat Demo Interaktif</span>
          </button>
        </motion.div>
      </section>

      {/* Dashboard Preview UI - Ultra Premium Light Mode */}
      <section className="relative z-20 px-6 max-w-[1400px] mx-auto pb-32">
        <motion.div 
          style={{ scale: scaleProgress }}
          initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, type: 'spring', damping: 25 }}
          className="rounded-[2.5rem] sm:rounded-[3rem] p-3 sm:p-5 overflow-hidden bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_20px_80px_rgba(0,0,0,0.04)]"
        >
          <div className="bg-white/80 rounded-[2rem] sm:rounded-[2.5rem] border border-white overflow-hidden relative shadow-2xl ring-1 ring-slate-100 backdrop-blur-xl">
            {/* Minimal macOS-style header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/50 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">jago-finance-os-v2.0.1</div>
            </div>

            {/* Dashboard Content Fake */}
            <div className="p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 relative overflow-hidden">
              {/* Animated Glow in Light Card */}
              <div className="absolute -top-1/2 left-1/4 w-[800px] h-[800px] bg-cyan-100/40 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8s]"></div>
              
              <div className="col-span-1 lg:col-span-7 space-y-10 relative z-10">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] font-jakarta mb-4">Live Consolidated Balance</h3>
                  <div className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tighter font-mono flex items-baseline gap-2">
                    <span className="text-slate-400 text-4xl font-light">Rp</span> 12.450<span className="text-slate-400">.000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-7 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(52,211,153,0.12)] transition-shadow cursor-pointer shadow-sm">
                    <div className="absolute top-0 right-0 p-6"><ArrowUpRight className="w-6 h-6 text-emerald-500 opacity-30 group-hover:opacity-100 transition-opacity" /></div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-jakarta">Inbound Revenue</div>
                    <div className="text-4xl font-bold text-emerald-500 font-mono">+ 450.0M</div>
                    <div className="mt-5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '75%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"></motion.div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-7 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(251,113,133,0.12)] transition-shadow cursor-pointer shadow-sm">
                    <div className="absolute top-0 right-0 p-6"><ArrowRight className="w-6 h-6 text-rose-500 opacity-30 group-hover:opacity-100 transition-opacity" /></div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-jakarta">Outbound Expenses</div>
                    <div className="text-4xl font-bold text-slate-900 font-mono">- 128.4M</div>
                    <div className="mt-5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '35%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-rose-500 to-rose-400"></motion.div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-5 space-y-5 relative z-10 lg:pl-10 lg:border-l lg:border-slate-100">
                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] font-jakarta mb-6 flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  AI Agents Activity
                </div>
                
                <AnimatePresence mode="wait">
                  {[
                    { id: 1, icon: Zap, title: "Hermes AI Engine", desc: "Processed 128 receipts instantly.", color: "text-amber-500", bg: "bg-white", border: "border-slate-100", iconBg: "bg-amber-50" },
                    { id: 2, icon: Globe, title: "Webhook Sync", desc: "Midtrans gateway synced 12s ago.", color: "text-cyan-500", bg: "bg-white", border: "border-slate-100", iconBg: "bg-cyan-50" },
                    { id: 3, icon: ShieldCheck, title: "Automated Payroll", desc: "45 employees disbursed safely.", color: "text-emerald-500", bg: "bg-white", border: "border-slate-100", iconBg: "bg-emerald-50" }
                  ].map((item, idx) => (
                    <motion.div 
                      key={`${item.id}-${activeFeature}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                      className={`flex gap-5 p-5 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-sm transition-all duration-500 ${idx !== activeFeature % 3 ? 'opacity-40 grayscale scale-[0.98]' : 'scale-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 border border-white shadow-sm`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="font-bold text-slate-900 text-[15px] font-outfit tracking-wide">{item.title}</div>
                        <div className="text-slate-500 text-[13px] mt-1 font-jakarta">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </section>



      {/* Bento Grid Features - Premium Style */}
      <section id="features" className="py-32 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 font-outfit">
            Dibangun untuk <span className="text-gradient-primary">Kecepatan.</span><br/> 
            Didesain untuk <span className="text-gradient-accent">Skala.</span>
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-jakarta">
            Semua alat krusial yang dibutuhkan tim finance, dalam satu platform yang super ringan dan berkinerja tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <SpotlightCard key={idx}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center border ${feature.border} mb-8 ${feature.glow} relative z-10`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10 font-outfit">{feature.title}</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed relative z-10 font-jakarta">
                {feature.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Workflow Section - Sticky Scroll effect */}
      <section id="workflow" className="py-32 px-6 relative z-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-start">
          <div className="lg:w-1/2 lg:sticky top-32 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-outfit">
              Sistem yang bekerja<br/> <span className="text-slate-400">di balik layar.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed font-jakarta">
              Workflow JagoFinance tidak membutuhkan intervensi manual. Hubungkan API, tetapkan rules, dan biarkan sistem memproses ribuan mutasi secara real-time.
            </p>
            <button className="flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
              Lihat Dokumentasi API <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="lg:w-1/2 space-y-8">
            {[
              { num: '01', title: 'Koneksikan Gateway', desc: 'Integrasi webhook instan hanya dengan 1 klik ke sistem pembayaran Anda.' },
              { num: '02', title: 'AI Ekstraksi Data', desc: 'Setiap struk, invoice, dan mutasi bank yang masuk dipetakan secara otomatis oleh sistem.' },
              { num: '03', title: 'Ledger Real-time', desc: 'Buku besar otomatis diperbarui. Laporan keuangan siap saji untuk audit kapan pun dibutuhkan.' },
              { num: '04', title: 'Approval Multi-layer', desc: 'Alur persetujuan pencairan dana secara otomatis diarahkan ke Manajer atau Direktur terkait.' }
            ].map((step, i) => (
              <SpotlightCard key={i} className="flex gap-6 group cursor-pointer bg-slate-50 hover:bg-white border-slate-200">
                <div className="text-4xl font-black text-slate-200 font-mono group-hover:text-cyan-500 transition-colors">{step.num}</div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">{step.title}</h4>
                  <p className="text-slate-500 text-[15px] leading-relaxed font-jakarta">{step.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50 to-white pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] font-outfit">
            Masa depan finance <br/> dimulai hari ini.
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed font-jakarta">
            Berhenti menghabiskan waktu pada entri manual. Bergabung dengan startup elit yang menggunakan JagoFinance.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-[16px] shadow-xl shadow-slate-900/20 transition-all hover:scale-105 flex items-center justify-center gap-2 font-jakarta"
            >
              Akses Sistem Sekarang <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white pt-10 pb-10 px-6 border-t border-slate-200 font-jakarta relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <Building2 className="w-5 h-5 text-slate-900" />
            <span className="text-lg font-bold tracking-tight text-slate-900 font-outfit">
              JagoFinance
            </span>
          </div>
          <div className="flex gap-8 text-[14px] font-bold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Platform</a>
            <a href="#" className="hover:text-slate-900 transition-colors">API Docs</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
          <div className="text-[13px] text-slate-400 font-medium">
            © 2026 PT JagoAI School Indonesia.
          </div>
        </div>
      </footer>
    </div>
  );
}
