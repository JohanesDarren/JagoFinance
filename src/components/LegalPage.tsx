import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShieldCheck, FileText, Info, Database, Settings, 
  RefreshCw, Activity, UserCircle, AlertTriangle, Ban 
} from 'lucide-react';
import { motion } from 'motion/react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export default function LegalPage({ type, onBack }: LegalPageProps) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Kebijakan Privasi' : 'Syarat & Ketentuan';
  const subtitle = isPrivacy 
    ? 'Komitmen kami dalam melindungi dan mengelola data pribadi Anda.'
    : 'Aturan dan panduan dalam menggunakan platform JagoFinance.';
    
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const SectionCard = ({ icon: Icon, title, children, delay }: { icon: any, title: string, children: React.ReactNode, delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgba(31,38,135,0.04)] mb-6 hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-shadow duration-300 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
      <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-blue-50 flex items-center justify-center shrink-0 border border-indigo-100/50 shadow-sm group-hover:rotate-3 transition-transform">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit">{title}</h3>
          <div className="text-slate-600 font-jakarta leading-relaxed text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdfa] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      
      {/* Animated Light Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-blue-300/20 blur-[100px] pointer-events-none animate-pulse duration-[6s] -z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-teal-300/20 blur-[100px] pointer-events-none animate-pulse duration-[8s] delay-700 -z-0"></div>
      <div className="fixed top-[40%] right-[10%] w-[30%] h-[40%] rounded-full bg-indigo-300/10 blur-[80px] pointer-events-none animate-pulse duration-[10s] delay-500 -z-0"></div>

      {/* Floating Abstract Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none -z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Floating Header */}
      <header className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[92%] max-w-4xl rounded-full flex items-center justify-between ${scrolled ? 'top-4 bg-white/80 backdrop-blur-xl border border-slate-200 py-3 px-4 sm:px-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]' : 'top-6 bg-transparent border-transparent py-3 px-2 sm:px-4'}`}>
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-100 shadow-sm text-slate-600 hover:text-slate-900 rounded-full text-sm font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
            {isPrivacy ? <ShieldCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <span className="font-bold text-slate-800 tracking-tight pr-2 hidden sm:block">{title}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-12 w-full flex-grow relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-white border border-white shadow-sm mb-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-cyan-50 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity duration-500"></div>
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
              {isPrivacy ? <ShieldCheck className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 font-outfit">
            {title}
          </h1>
          <p className="text-lg text-slate-500 font-jakarta max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-2">
          {isPrivacy ? (
            <>
              <SectionCard icon={Info} title="Pendahuluan" delay={0.1}>
                <p>Selamat datang di <strong>JagoFinance</strong>. Kami sangat menghargai privasi Anda dan berkomitmen penuh untuk melindungi data pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini dirancang secara transparan untuk menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi berharga Anda di dalam ekosistem platform kami.</p>
              </SectionCard>
              
              <SectionCard icon={Database} title="Informasi yang Kami Kumpulkan" delay={0.2}>
                <p>Untuk memberikan pengalaman layanan yang optimal, kami dapat mengumpulkan berbagai data pribadi Anda, yang meliputi namun tidak terbatas pada:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-1">•</span> Profil identitas (Nama lengkap, alamat email, dan nomor telepon).</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-1">•</span> Informasi pekerjaan (Perusahaan, divisi, jabatan, dan struktur pelaporan).</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-1">•</span> Data finansial operasional terkait klaim atau penggajian.</li>
                </ul>
              </SectionCard>
              
              <SectionCard icon={Settings} title="Penggunaan Informasi" delay={0.3}>
                <p>Informasi yang kami kumpulkan didedikasikan sepenuhnya untuk operasional layanan, termasuk di antaranya:</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <strong className="text-slate-800 block mb-1">Operasional Utama</strong>
                    Menyediakan, memelihara, dan memastikan stabilitas layanan JagoFinance secara real-time.
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <strong className="text-slate-800 block mb-1">Pemrosesan Keuangan</strong>
                    Memvalidasi dan memproses transaksi seperti klaim reimburse dan pencairan payroll.
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <strong className="text-slate-800 block mb-1">Pengembangan Produk</strong>
                    Menganalisis penggunaan untuk meningkatkan pengalaman dan fitur UI/UX.
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <strong className="text-slate-800 block mb-1">Kepatuhan Hukum</strong>
                    Memenuhi kewajiban standar regulasi keamanan dan hukum yang berlaku.
                  </div>
                </div>
              </SectionCard>
              
              <SectionCard icon={ShieldCheck} title="Keamanan Data" delay={0.4}>
                <p>Kami memprioritaskan arsitektur keamanan tingkat tinggi (Enterprise-Grade Security). Kami menerapkan perlindungan kriptografi pada transaksi dan lapisan kredensial Anda, serta memonitor infrastruktur kami dari potensi akses tidak sah, modifikasi, atau kebocoran data. Data Anda tersimpan secara terenkripsi dalam pusat data dengan sertifikasi keamanan terkemuka.</p>
              </SectionCard>
              
              <SectionCard icon={RefreshCw} title="Perubahan Kebijakan" delay={0.5}>
                <p>Demi beradaptasi dengan perkembangan regulasi teknologi, kami berhak untuk memperbarui Kebijakan Privasi ini sewaktu-waktu. Segala bentuk perubahan krusial akan dikomunikasikan secara transparan melalui notifikasi langsung pada dasbor platform atau melalui email resmi terdaftar Anda.</p>
              </SectionCard>
            </>
          ) : (
            <>
              <SectionCard icon={Info} title="Pendahuluan" delay={0.1}>
                <p>Dengan mengakses atau menggunakan platform <strong>JagoFinance</strong>, Anda menyatakan telah membaca, memahami, dan secara sah setuju untuk terikat oleh Syarat dan Ketentuan ini. Apabila Anda merasa tidak menyetujui salah satu bagian dari ketentuan ini, Anda dipersilakan untuk menghentikan penggunaan layanan kami.</p>
              </SectionCard>

              <SectionCard icon={Activity} title="Penggunaan Layanan" delay={0.2}>
                <p>Ekosistem JagoFinance dirancang khusus untuk memfasilitasi otomasi dan manajemen operasional keuangan internal perusahaan (seperti sistem reimburse dan penggajian terintegrasi). Anda berjanji untuk:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-1">✓</span> Menggunakan layanan hanya untuk kepentingan bisnis dan tujuan yang sah.</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-1">✓</span> Tidak menyalahgunakan celah keamanan untuk merugikan sistem atau pihak lain.</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-1">✓</span> Mematuhi regulasi keuangan hukum yang berlaku di yurisdiksi Anda.</li>
                </ul>
              </SectionCard>

              <SectionCard icon={UserCircle} title="Akun Pengguna" delay={0.3}>
                <p>Keamanan akun dimulai dari Anda. Anda bertanggung jawab penuh untuk memelihara kerahasiaan kata sandi, OTP, dan kredensial akses lainnya. Segala bentuk aktivitas transaksi yang bersumber dari akun Anda akan dianggap sebagai tindakan yang sah dan menjadi tanggung jawab absolut Anda. Anda diwajibkan untuk mendaftarkan informasi identitas yang akurat dan terkini.</p>
              </SectionCard>

              <SectionCard icon={AlertTriangle} title="Pembatasan Tanggung Jawab" delay={0.4}>
                <p>JagoFinance menyediakan infrastruktur platform dengan basis <em>"as-is"</em> (sebagaimana adanya) tanpa jaminan absolut terbebas dari malfungsi pihak ketiga (seperti gangguan gateway pembayaran). Kami tidak memikul tanggung jawab atas kerugian langsung, insidental, atau konsekuensial, termasuk kerugian finansial yang diakibatkan oleh <em>human error</em> (kesalahan input nominal/rekening oleh Anda) saat menggunakan platform.</p>
              </SectionCard>

              <SectionCard icon={Ban} title="Penghentian Layanan" delay={0.5}>
                <p>Untuk menjaga integritas ekosistem bagi seluruh pengguna, kami memiliki otoritas penuh untuk menangguhkan atau secara permanen menghentikan akses Anda ke platform kapan saja, tanpa kewajiban pemberitahuan sebelumnya, apabila sistem kami mendeteksi atau mencurigai adanya pelanggaran Syarat dan Ketentuan, manipulasi data, atau aktivitas penipuan.</p>
              </SectionCard>
            </>
          )}
        </div>
      </main>
      
      <footer className="py-8 relative z-10 text-center">
        <p className="text-slate-400 text-sm font-jakarta flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} <a href="https://jagoai.dev/" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-500 hover:text-slate-700 transition-colors">JagoAI</a>. Seluruh hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}
