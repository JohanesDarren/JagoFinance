# Product Requirements Document (PRD)

## Document Info

| Field | Value |
| --- | --- |
| **Project Name** | JagoFinance (SaaS UMKM) |
| **Version** | v1.1 |
| **Status** | Draft |
| **Author** | Tim Product |
| **Team** | JagoAI Engineering |
| **Created** | 2026-07-16 |
| **Last Updated** | 2026-07-16 |
| **Target Launch** | Q3 2026 |

---

## 1. Overview

### 1.1 Problem Statement
UMKM di Indonesia seringkali kesulitan dalam mengelola dan melacak arus kas (cash flow), proses reimbursement karyawan, serta pembayaran gaji (payroll) secara terpusat. Proses manual menggunakan buku kas fisik atau spreadsheet rentan terhadap kesalahan input, tidak real-time, dan memakan waktu lama. Hal ini menyebabkan pemilik usaha tidak memiliki visibilitas data keuangan yang baik untuk scale bisnis mereka.

**Core Pain Points:**
- Pemilik UMKM kesulitan memantau pengeluaran harian dan persetujuan reimburse karyawan.
- Perhitungan dan eksekusi payroll memakan waktu dan berisiko salah transfer.
- Pemantauan tagihan langganan (subscriptions) dan pendapatan dari integrasi e-commerce/aplikasi pihak ketiga belum terintegrasi di satu tempat.

### 1.2 Proposed Solution
JagoFinance adalah platform SaaS (Software as a Service) manajemen keuangan B2B yang dirancang khusus untuk UMKM. Platform ini menggabungkan Web Dashboard untuk pemilik usaha/admin finance dan Web App Responsif (Mobile Web/PWA) untuk karyawan (untuk pengajuan reimburse), ditenagai oleh Supabase untuk sinkronisasi data real-time antar perangkat.

### 1.3 Value Proposition

| Untuk | Yang | Kami menawarkan | Tidak seperti | Karena |
| --- | --- | --- | --- | --- |
| Pemilik UMKM | Memiliki problem proses keuangan manual | JagoFinance | BukuWarung / Excel | Menggabungkan cash flow, approval reimburse, dan payroll massal dalam satu sistem terintegrasi |

### 1.4 Competitive Landscape

| Kompetitor | Kelebihan Mereka | Kelemahan Mereka | Differensiasi Kita |
| --- | --- | --- | --- |
| Jurnal by Mekari | Sangat komprehensif, standar akuntansi | Terlalu kompleks dan mahal untuk UMKM kecil | UI/UX modern, fokus pada workflow operasional sederhana (reimburse & payroll) |
| Manual / Excel | Gratis, familiar | Error-prone, tidak real-time, tidak bisa kolaborasi | Real-time Supabase, otentikasi aman, role-based access untuk tiap perusahaan |

**Positioning Statement:**
"JagoFinance adalah platform manajemen keuangan untuk pemilik UMKM yang ingin efisiensi dan transparansi arus kas, tidak seperti pencatatan Excel yang rawan error, kami menawarkan sistem real-time terintegrasi dengan workflow persetujuan untuk seluruh tim."

### 1.5 Monetization Model
**Model Bisnis:** Subscription (SaaS)

| Tier | Harga | Fitur yang Diakses | Batasan |
| --- | --- | --- | --- |
| Free | Gratis | Fitur dasar kas, Reimburse manual | Max 1 Admin, 3 Staff, max 50 transaksi/bulan |
| Starter | Rp 99.000/bulan | Semua Free + Payroll Generator | Max 3 Admin, 15 Staff |
| Pro | Rp 249.000/bulan | Semua Starter + App Integrations, Priority Support | Unlimited Users & Transactions |
| Enterprise | Custom | SLA, Dedicated Account Manager, Custom API | - |

**Revenue Assumptions:**
- Target MRR bulan ke-6: Rp 50.000.000
- Target paying customer bulan ke-3: 100 UMKM
- Expected conversion Free-to-Paid: 5%

**Catatan untuk Feature Gating:**
- Fitur Payroll Generator dan App Integrations harus di-flag dengan label [PAID].
- Paywall UI wajib masuk ke MVP agar pengguna Free tier melihat Call to Action (CTA) untuk upgrade.

### 1.6 Assumptions

| ID | Asumsi | Dampak jika Salah | Verifikasi By |
| --- | --- | --- | --- |
| A-01 | Karyawan UMKM dapat mengakses via browser smartphone (Mobile Web Android/iOS) | Harus segera develop aplikasi native, timeline mundur | Riset / Survey UMKM |
| A-02 | UMKM bersedia membayar langganan bulanan | Produk tidak laku, perlu pivot model bisnis | Validasi ke UMKM target |
| A-03 | Pemilik UMKM butuh akses web untuk rekapitulasi data | Kesulitan jika hanya ada aplikasi mobile | User Research |

---

## 2. Goals & Success Metrics

### 2.1 Goals (In Scope)
- [x] Menyediakan sistem multi-tenant (setiap UMKM memiliki `company_id` sendiri).
- [x] Membangun Web Dashboard untuk overview saldo, transaksi, dan payroll.
- [x] Menyediakan Mobile App Simulator untuk karyawan mengajukan reimburse.
- [x] Mengimplementasikan Paywall / Upgrade UI (Subscription Billing).

### 2.2 Non-Goals (Out of Scope)
- Integrasi ke sistem perbankan nasional secara langsung (Direct Bank Transfer API) ditunda ke fase berikutnya.
- Aplikasi native Android & iOS (fokus pada Mobile Web App responsif / PWA terlebih dahulu agar bisa diakses di semua perangkat).

### 2.3 MVP Boundary

**Yang MASUK MVP (harus selesai sebelum launch):**

| Feature | Alasan Masuk MVP |
| --- | --- |
| Authentication & Multi-tenancy | Gate utama, memisahkan data antar UMKM |
| Real-time Dashboard | Core value untuk visibilitas saldo |
| Reimbursement Flow | Core feature interaksi staff dan pemilik usaha |
| Paywall / Upgrade CTA | Wajib ada karena ini adalah produk SaaS |

**Yang TIDAK masuk MVP:**

| Feature | Alasan Ditunda | Target Fase |
| --- | --- | --- |
| Auto-Transfer Bank | Kompleksitas regulasi & keamanan API | Phase 2 |
| Multi-language | User base awal difokuskan di Indonesia | Phase 3 |

### 2.4 Product Metrics (Business KPI)

| Metrik | Baseline | Target (30 hari) | Target (90 hari) | Cara Ukur |
| --- | --- | --- | --- | --- |
| Daily Active Users (DAU) | - | 50 UMKM | 200 UMKM | Supabase Analytics |
| Monthly Active Users (MAU) | - | 80 UMKM | 300 UMKM | Supabase Analytics |
| Feature Adoption Rate | - | > 60% pakai fitur Reimburse | > 80% | Event Tracking (PostHog/Mixpanel) |
| Free-to-Paid Conversion | - | > 2% | > 5% | Payment Gateway Dashboard |
| Retention Rate (D30) | - | > 40% | > 60% | Cohort Analysis |
| Churn Rate | - | < 10% | < 5% | Subscription Analytics |
| Monthly Recurring Revenue (MRR) | - | Rp 5.000.000 | Rp 50.000.000 | Stripe/Midtrans Dashboard |
| Customer Acquisition Cost (CAC) | - | < Rp 50.000 / user | < Rp 30.000 / user | Ads/Marketing Spend Tracker |

### 2.5 Technical Metrics (Engineering KPI)

| Metrik | Target | Cara Ukur |
| --- | --- | --- |
| API Response Time (p95) | < 500ms | APM / Supabase Logs |
| API Error Rate (5xx) | < 0.5% | Server Monitoring |
| Database Query Time (avg) | < 100ms | DB Monitoring / Slow Query Log |
| Frontend Load Time (FCP) | < 1.5 detik | Lighthouse / Web Vitals |
| App Cold Start Time | < 3 detik | Performance Profiler |
| App Crash Rate | < 0.1% | Sentry / Firebase Crashlytics |
| Backend Uptime | > 99.9% | Uptime Robot / Pingdom |

---

## 3. User & Stakeholder

### 3.1 Target Users

**Persona 1: Pemilik UMKM / Admin Finance**
- **Nama:** Budi (Pemilik Kedai Kopi)
- **Tech Savvy:** Medium
- **Goals:** Memantau arus kas harian, menyetujui reimburse kasbon, menggaji karyawan bulanan.
- **Frustrations:** Banyak nota hilang, catatan keuangan berantakan.
- **Device:** Web / Desktop / Tablet

**Persona 2: Staff / Karyawan UMKM**
- **Nama:** Andi (Barista)
- **Tech Savvy:** High
- **Goals:** Bisa minta reimburse beli bahan baku mendadak pakai HP.
- **Frustrations:** Reimburse sering lupa dibayar bos karena tidak dicatat.
- **Device:** Mobile Web (Browser Android / iOS)

### 3.2 Stakeholders

| Role | Nama/Tim | Kepentingan |
| --- | --- | --- |
| Product Owner | [Nama PO] | Decision maker fitur SaaS |
| Tech Lead | [Nama Tech Lead] | Arsitektur multi-tenant, payment gateway |

### 3.3 RACI Matrix

| Aktivitas | Product Owner | Tech Lead | Developer | Designer | QA |
| --- | --- | --- | --- | --- | --- |
| Mendefinisikan requirements | A | C | C | C | I |
| Prioritas fitur & MVP scope | A | C | I | I | I |
| Keputusan arsitektur | C | A | C | I | I |
| Pemilihan tech stack | C | A | C | I | I |
| Implementasi backend | I | C | A | I | I |
| Implementasi frontend | I | C | A | R | I |
| UI/UX design | C | I | I | A | I |
| Code review | I | A | R | I | I |
| Testing & QA | I | C | C | I | A |
| Deployment ke staging | I | A | R | I | C |
| Deployment ke production | A | C | R | I | C |
| Dokumentasi API | I | C | A | I | I |
| Demo ke stakeholder | A | C | I | C | I |

---

## 4. Features & Requirements

### 4.1 Feature Priority (MoSCoW)
- **P0 (Must Have):** Wajib ada (Auth, Multi-tenant, Dashboard, Reimburse, Paywall).
- **P1 (Should Have):** Penting (Payroll Generator).

### 4.2 Feature List

| ID | Feature | Priority | Tier | Status | PIC | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | Login & Pendaftaran | P0 | Free | Todo | - | Email + Password, Setup Perusahaan |
| F-02 | Web Dashboard | P0 | Free | Todo | - | Overview Arus Kas |
| F-03 | Pengajuan Reimbursement | P0 | Free | Todo | - | Mobile to Web approval |
| F-04 | Payroll Massal | P1 | Starter | Todo | - | [PAID] Generate slip gaji & rekapan |
| F-05 | Integrasi Aplikasi (Webhook) | P2 | Pro | Backlog | - | [PAID] Monitor pendapatan API/Channel |
| F-06 | Upgrade / Paywall UI | P0 | Free | Todo | - | Wajib ada CTA Upgrade SaaS |
| F-07 | Super Admin - Global Dashboard | P0 | Free | Todo | - | Overview Arus Kas Seluruh Cabang |
| F-08 | Super Admin - Global Reimbursement & Approvals | P0 | Free | Todo | - | Persetujuan klaim seluruh cabang |
| F-09 | Super Admin - Global Inbound & Ledger (Buku Kas) | P0 | Free | Todo | - | Uang masuk & buku kas global |
| F-10 | Super Admin - Branch Management (Kelola Cabang) | P0 | Free | Todo | - | Kelola informasi seluruh cabang |
| F-11 | Super Admin - Global Payroll & Employees | P1 | Starter | Todo | - | [PAID] Gaji & daftar karyawan global |
| F-12 | Super Admin - Broadcast Notifications | P1 | Starter | Todo | - | Pengumuman ke cabang/karyawan |
| F-13 | Karyawan - Dashboard & Profile | P0 | Free | Todo | - | Ringkasan info personal karyawan |
| F-14 | Karyawan - Histori & Status Klaim (Tracking) | P0 | Free | Todo | - | Melacak riwayat klaim reimburse |
| F-15 | Karyawan - Slip Gaji (Payslip Download) | P1 | Starter | Todo | - | [PAID] Akses download slip gaji PDF |
| F-16 | Karyawan - Inbox & Notifikasi | P1 | Starter | Todo | - | Menerima pesan broadcast/status klaim |
| F-17 | Contact Us Landing Page | P2 | Free | Done | AI | Formulir pertanyaan untuk pengunjung |
| F-18 | Edit Profil Pengguna | P1 | Free | Done | AI | Update info personal di ProfileScreen |

### 4.3 Functional Requirements

**F-01: Authentication**

Deskripsi: User bisa register, login, dan logout dari aplikasi.

Requirements:
-	☐ User bisa register dengan email dan password
-	☐ User bisa login dengan Google OAuth
-	☐ Session tersimpan (auto-login) selama 7 hari via refresh token
-	☐ Forgot password via email reset link
-	☐ Logout menghapus local session dan revoke refresh token di server
-	☐ Password di-hash dengan bcrypt sebelum disimpan

Acceptance Criteria:
- Given user berada di halaman login, When memasukkan kredensial yang valid, Then sistem mengarahkan ke dashboard dan membuat local session aktif.
- Given user menekan logout, Then session dihapus sepenuhnya dan user kembali ke halaman login.
- Given user meminta reset password, Then email berisi link reset terkirim.


**F-02: Web Dashboard**

Deskripsi: Halaman utama (dashboard) untuk overview arus kas cabang/perusahaan secara real-time.

Requirements:
-	☐ Menampilkan saldo saat ini secara agregat per entitas (cabang/pusat)
-	☐ Menampilkan metrik uang masuk dan keluar secara cepat
-	☐ Menampilkan aktivitas/transaksi terbaru

Acceptance Criteria:
- Dashboard berhasil memuat data dengan latency minimal, dan metrik saldo merefleksikan nilai ledger terkini secara presisi.


**F-03: Pengajuan Reimbursement**

Deskripsi: Fitur bagi karyawan untuk mengajukan klaim pengeluaran operasional.

Requirements:
-	☐ Karyawan mengisi form pengajuan (nominal, tanggal, kategori, rincian)
-	☐ Karyawan wajib mengunggah/melampirkan dokumen bukti (struk/nota/invoice)
-	☐ Klaim masuk ke antrean persetujuan (pending approvals)

Acceptance Criteria:
- Setelah disubmit, pengajuan otomatis muncul di dashboard pihak berwenang dan karyawan dapat memantau status persetujuan.


**F-04: Payroll Massal**

Deskripsi: Fitur berbayar (Paid) untuk manajemen penggajian karyawan.

Requirements:
-	☐ Admin dapat mengatur basis gaji karyawan
-	☐ Sistem dapat mengeksekusi pendistribusian gaji ke seluruh karyawan dalam satu klik
-	☐ Sistem otomatis mencatat beban gaji ke dalam riwayat pengeluaran (buku kas)

Acceptance Criteria:
- Klik generate payroll akan memotong saldo kas perusahaan dan mencatatkan bukti pengeluaran spesifik per nama karyawan.


**F-05: Integrasi Aplikasi (Webhook)**

Deskripsi: Fitur berbayar (Paid) untuk integrasi dengan platform pihak ketiga (seperti Payment Gateway) untuk sinkronisasi otomatis.

Requirements:
-	☐ User mendapatkan URL webhook endpoint spesifik yang bisa disambungkan ke sistem eksternal
-	☐ Sistem dapat menangkap payload JSON ketika ada transaksi pembayaran masuk
-	☐ Sistem otomatis menerjemahkan payload tersebut sebagai inflow dan memperbarui saldo kas

Acceptance Criteria:
- Apabila sistem eksternal mengirim HTTP trigger, mutasi kas masuk akan seketika tercatat di ledger tanpa perlu refresh manual.


**F-06: Upgrade / Paywall UI**

Deskripsi: User dengan tier Free yang mencoba mengakses fitur berbayar (misal Payroll) akan melihat halaman penawaran upgrade.

Requirements:
-	☐ Menampilkan perbandingan paket (Starter vs Pro)
-	☐ Integrasi ke Payment Gateway (Midtrans) untuk memproses subscription
-	☐ Auto-upgrade status tier UMKM setelah pembayaran sukses

Acceptance Criteria:
- Saat pembayaran sukses, tier pengguna otomatis naik dan fitur berbayar terbuka tanpa perlu re-login.


**F-07: Super Admin - Global Dashboard**

Deskripsi: Super admin dapat memantau ringkasan (overview) arus kas secara keseluruhan dari seluruh cabang.

Requirements:
-	☐ Menampilkan total uang masuk dan keluar gabungan dari semua cabang
-	☐ Menampilkan statistik dan tren pengeluaran harian/bulanan agregat
-	☐ Mampu mem-filter data (date range) secara global maupun per cabang

Acceptance Criteria:
- Semua metrik keuangan di dashboard langsung ter-update secara real-time (sinkron) jika terjadi perubahan kas pada salah satu cabang.


**F-08: Super Admin - Global Reimbursement & Approvals**

Deskripsi: Super admin melihat keseluruhan persetujuan klaim reimburse dari seluruh cabang beserta sistem notifikasi email.

Requirements:
-	☐ Menampilkan daftar lengkap pending, approved, dan rejected claims lintas cabang dalam satu tabel terpusat
-	☐ Super admin memiliki hak untuk melakukan persetujuan (override) langsung dari halaman ini
-	☐ Sistem mengirimkan email notification otomatis ke karyawan yang mengajukan ketika status klaim disetujui atau ditolak

Acceptance Criteria:
- Saat klaim di-Approve, notifikasi berhasil terkirim ke email pengaju dengan rincian status pembayaran dan nomor referensi.


**F-09: Super Admin - Global Inbound & Ledger (Buku Kas)**

Deskripsi: Visibilitas arus kas masuk dan pencatatan buku besar (ledger) seluruh cabang.

Requirements:
-	☐ Halaman Uang Masuk menampilkan rincian/histori penerimaan dana (Inflow) dari seluruh cabang
-	☐ Halaman Buku Kas (Ledger) mencatat riwayat lengkap mutasi Debit/Kredit lintas cabang
-	☐ Dapat mem-filter buku kas berdasarkan kategori, cabang, atau merchant

Acceptance Criteria:
- Super admin dapat mengekspor data buku kas (CSV/PDF) yang merepresentasikan data global seluruh cabang.


**F-10: Super Admin - Branch Management (Kelola Cabang)**

Deskripsi: Modul terpusat untuk mengelola daftar dan pengaturan seluruh unit cabang bisnis.

Requirements:
-	☐ Super admin dapat menambah (create) cabang baru ke dalam sistem
-	☐ Super admin dapat mengubah (update/edit) informasi detail cabang (nama, kode, lokasi, kontak)
-	☐ Super admin dapat me-nonaktifkan (deactivate) cabang
-	☐ Super admin dapat menugaskan Admin Cabang ke cabang tertentu

Acceptance Criteria:
- Saat cabang baru dibuat, cabang tersebut langsung terdaftar sebagai tenant yang sah dan dapat dialokasikan anggaran secara sistem.


**F-11: Super Admin - Global Payroll & Employees**

Deskripsi: Modul manajemen SDM & Payroll terpusat untuk melihat dan memproses gaji.

Requirements:
-	☐ Menampilkan seluruh entitas karyawan dari seluruh cabang dalam satu direktori
-	☐ Menampilkan informasi basis gaji (salary) dari setiap karyawan
-	☐ Mendukung proses eksekusi pencairan gaji masal (Mass Payroll) secara lintas cabang maupun spesifik per cabang

Acceptance Criteria:
- Sistem mampu memisahkan laporan beban gaji per masing-masing cabang untuk analisis keuangan.


**F-12: Super Admin - Broadcast Notifications**

Deskripsi: Super admin memiliki fitur untuk mengirimkan informasi/pengumuman penting kepada entitas lain.

Requirements:
-	☐ Dapat mengirim pesan broadcast (email/in-app) ke seluruh cabang (global)
-	☐ Dapat mengirim broadcast hanya ke sebagian/beberapa cabang spesifik yang dipilih
-	☐ Dapat mengirim pesan ke seluruh karyawan (perusahaan secara keseluruhan)
-	☐ Dapat mengirim pesan ke beberapa karyawan secara spesifik/perseorangan

Acceptance Criteria:
- Target recipient menerima notifikasi (in-app alert atau email) tanpa delay lebih dari beberapa detik setelah broadcast ditekan.


**F-13: Karyawan - Dashboard & Profile**

Deskripsi: Halaman beranda khusus untuk role Karyawan yang menampilkan ringkasan informasi personal.

Requirements:
-	☐ Menampilkan informasi profil karyawan (Nama, Cabang, Jabatan)
-	☐ Menampilkan sisa kuota / limit reimburse bulanan (jika ada)
-	☐ Menampilkan ringkasan jumlah klaim yang pending dan approved bulan ini

Acceptance Criteria:
- Saat karyawan login, sistem otomatis memuat dashboard khusus karyawan yang responsif diakses via HP.


**F-14: Karyawan - Histori & Status Klaim (Tracking)**

Deskripsi: Fitur bagi karyawan untuk melacak riwayat klaim reimburse yang pernah diajukan.

Requirements:
-	☐ Menampilkan daftar histori pengajuan klaim (tanggal, nominal, tujuan)
-	☐ Menampilkan status terkini dari setiap klaim (Pending, Approved, Rejected)
-	☐ Karyawan dapat melihat detail penolakan (alasan reject) jika klaim ditolak

Acceptance Criteria:
- Karyawan dapat melihat update status secara real-time apabila Admin mengubah status klaim mereka.


**F-15: Karyawan - Slip Gaji (Payslip Download)**

Deskripsi: Akses transparansi penggajian untuk karyawan agar dapat melihat slip gaji.

Requirements:
-	☐ Menampilkan riwayat penggajian bulanan yang telah dieksekusi (Payroll)
-	☐ Menampilkan rincian slip gaji (Gaji pokok, potongan, tunjangan)
-	☐ Menyediakan fitur download slip gaji dalam format PDF

Acceptance Criteria:
- File PDF slip gaji berhasil terunduh dengan format yang rapi dan mencantumkan nama perusahaan serta periode gaji.


**F-16: Karyawan - Inbox & Notifikasi**

Deskripsi: Kotak masuk (inbox) bagi karyawan untuk menerima pesan broadcast atau notifikasi persetujuan.

Requirements:
-	☐ Karyawan dapat menerima dan membaca pesan broadcast dari Super Admin / Admin Cabang
-	☐ Terdapat indikator unread (belum dibaca) untuk pesan baru
-	☐ Sistem menyimpan riwayat notifikasi persetujuan/penolakan reimburse

Acceptance Criteria:
- Pesan broadcast langsung muncul di inbox karyawan setelah Super Admin menekan tombol kirim.


**F-17: Contact Us Landing Page**

Deskripsi: Formulir bagi pengunjung landing page untuk mengirimkan pertanyaan ke tim JagoFinance.

Requirements:
-	☐ Terdapat form input Nama, Email, dan Pesan
-	☐ Terdapat validasi input (wajib diisi)
-	☐ Menampilkan pesan sukses setelah submit

Acceptance Criteria:
- Pengunjung yang mensubmit form akan melihat notifikasi sukses secara langsung pada UI.


**F-18: Edit Profil Pengguna**

Deskripsi: Fitur di halaman profil untuk mengubah informasi personal pengguna.

Requirements:
-	☐ Field nama, email, telepon, dan lokasi dapat diubah (editable)
-	☐ Terdapat tombol Simpan Perubahan
-	☐ Menampilkan indikator loading dan sukses saat disimpan

Acceptance Criteria:
- Saat menekan Simpan Perubahan, perubahan data direfleksikan di UI (termasuk nama profil) dan status tersimpan muncul.


---

### 4.4 Non-Functional Requirements

| Kategori | Requirement | Target | Priority |
| --- | --- | --- | --- |
| **Performance** | Web App Load Time (LCP) | < 2.5 detik (menggunakan CDN & optimasi build Vite) | P0 |
| **Performance** | Query Response Time | < 200ms untuk kalkulasi/agregasi ledger & arus kas | P0 |
| **Availability** | Supabase Services | > 99.9% SLA uptime untuk Auth & Postgres | P0 |
| **Security** | Isolasi Data Antar Tenant | Wajib menggunakan *Row Level Security* (RLS) di Postgres berdasarkan `company_id` | P0 |
| **Security** | Autentikasi & Sesi | Supabase Auth (JWT access token 1 jam, refresh token 7 hari) | P0 |
| **Security** | HTTPS & Enkripsi | Koneksi database dienkripsi (TLS) & App via HTTPS Wajib | P0 |
| **Auditability** | Financial Audit Trail | Setiap perubahan arus kas dan payroll wajib merekam *actor* (user) & *timestamp* | P0 |
| **Scalability** | Concurrent Connections | Mampu menangani minimal 5.000 *concurrent users* per node tanpa degradasi | P1 |
| **Compatibility** | Desktop Browser | Mendukung versi stabil Chrome, Safari, Firefox, Edge (2 tahun terakhir) | P0 |
| **Compatibility** | Mobile Web (PWA ready) | Responsif diukur hingga minimal lebar layar 360px (Mobile-first Dashboard) | P0 |
| **Reliability** | Database Backup | Point-in-Time Recovery (PITR) harian aktif untuk mencegah data loss | P1 |
| **Offline** | Offline Capability | Tidak (Aplikasi finansial dan approval wajib sinkron real-time, offline diblokir) | P2 |

---

## 5. User Stories

**Epic 1: SaaS Onboarding & Subscription**
| ID | User Story | Priority | Story Points |
| --- | --- | --- | --- |
| US-01 | As a UMKM owner, I want to register my company so that I can create a workspace for my team. | P0 | 3 |
| US-02 | As a Free user, I want to see upgrade options when I click Payroll so that I know how to access premium features. | P0 | 3 |
| US-03 | As a Pro user, I want my subscription to automatically renew so that I don't lose access. | P1 | 5 |

---

## 6. Technical Architecture

### 6.1 Tech Stack
- **Frontend:** React + TypeScript + Vite, Tailwind CSS.
- **Backend & Database:** Supabase (Auth, Postgres, Realtime, Edge Functions untuk Webhook Payment).
- **Payment Gateway:** Midtrans (untuk langganan bulanan).

### 6.3 Database Schema (PostgreSQL via Supabase)

**Tabel Utama (Multi-tenant with Row Level Security):**

1. **`companies` (Tenants)**
   - id (VARCHAR, PK) -> Misal 'COMP-KOPIBUDI'
   - name (VARCHAR)
   - subscription_tier (VARCHAR) -> 'Free', 'Starter', 'Pro'
   - subscription_status (VARCHAR) -> 'active', 'past_due'

2. **`profiles`**
   - id (UUID, PK) -> references auth.users
   - role (VARCHAR) -> 'staff', 'admin', 'super_admin'
   - company_id (VARCHAR) -> references companies(id)

3. **`transactions`**
   - id (UUID, PK)
   - company_id (VARCHAR) -> references companies(id)
   - type (VARCHAR)
   - status (VARCHAR)
   - amount (DECIMAL)
   - merchant, category, notes, receipt_url (VARCHAR)

*(Catatan: RLS Supabase WAJIB diatur menggunakan `auth.jwt() -> 'user_metadata' ->> 'company_id'` agar data antar UMKM tidak bocor.)*

---

## 7. Coding Standards
- **Multi-tenancy Rule:** Setiap query ke tabel transaksi, karyawan, dll harus menyertakan validasi RLS `company_id`.

## 10. Data Privacy & Compliance
- **Sensitif Data:** Mengelola data transaksi ribuan UMKM mensyaratkan tingkat enkripsi yang ketat.
- **Isolation:** Kebocoran data transaksi dari satu UMKM ke UMKM lain (tenant bleed) adalah fatal. Pastikan RLS Supabase diuji secara komprehensif.

## 14. Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Kebocoran Data (Cross-tenant access) | Low | Critical | Terapkan Supabase RLS yang ketat, lakukan security audit sebelum rilis. |
| Pengguna gagal melakukan pembayaran subscription | Medium | High | Gunakan payment gateway yang stabil (Midtrans) & sediakan manual bank transfer fallback. |

---

## 17. Changelog
| Versi | Tanggal | Perubahan | Author |
| --- | --- | --- | --- |
| v1.0 | 2026-07-16 | Initial Draft Internal PRD | Antigravity |
| v1.1 | 2026-07-16 | Pivot ke SaaS UMKM Business Model, tambah Pricing Tier & Multi-tenancy | Antigravity |
