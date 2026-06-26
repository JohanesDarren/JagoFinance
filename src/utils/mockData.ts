/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, Subscription, Employee, ConnectedApp } from '../types';

export const INITIAL_CASH_BALANCE = 1245600000; // Rp 1.245.600.000

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "EMP-001",
    name: "Rizky Ramadhan",
    email: "rizky@jagoai.id",
    role: "Senior AI Engineer",
    division: "Engineering",
    salary: 22000000,
    bankAccount: "8839201948",
    bankName: "KB Bukopin"
  },
  {
    id: "EMP-002",
    name: "Fitri Astuti",
    email: "fitri@jagoai.id",
    role: "UI/UX Designer",
    division: "Product",
    salary: 15000000,
    bankAccount: "0092837482",
    bankName: "BCA"
  },
  {
    id: "EMP-003",
    name: "Afrisya Dwiky",
    email: "afrisyadwiky@gmail.com",
    role: "Project Manager",
    division: "Operations",
    salary: 18000000,
    bankAccount: "5540982738",
    bankName: "Mandiri"
  },
  {
    id: "EMP-004",
    name: "Ahmad Saepudin",
    email: "ahmad@jagoai.id",
    role: "DevOps Engineer",
    division: "Engineering",
    salary: 17500000,
    bankAccount: "4429381029",
    bankName: "BNI"
  }
];

export const INITIAL_CONNECTED_APPS: ConnectedApp[] = [
  {
    id: "APP-01",
    name: "UniGEO",
    description: "Multi-model geo-location parser for regional compliance",
    status: "active",
    apiKey: "jg_live_u983asj201mxz8ae719",
    webhookUrl: "https://api.jagoai.id/webhooks/unigeo",
    monthlyRevenue: 154500000,
    paymentGateway: "Midtrans"
  },
  {
    id: "APP-02",
    name: "AquaMate",
    description: "IoT liquid consumption tracker for industrial plants",
    status: "active",
    apiKey: "jg_live_a112opq883lsd1a9900",
    webhookUrl: "https://api.jagoai.id/webhooks/aquamate",
    monthlyRevenue: 112300000,
    paymentGateway: "Xendit"
  },
  {
    id: "APP-03",
    name: "AlexaAI Integrator",
    description: "Custom conversational bridging interface for Alexa smart hubs",
    status: "inactive",
    apiKey: "jg_live_e990asd182kjh32r112",
    webhookUrl: "",
    monthlyRevenue: 0,
    paymentGateway: "Stripe"
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "SUB-01",
    name: "AWS Enterprise Cloud",
    cost: 45000000, // Rp 45.000.000 / month
    cycle: "bulanan",
    nextBilling: "2026-05-24",
    category: "Server",
    status: "active"
  },
  {
    id: "SUB-02",
    name: "OpenAI API Usage",
    cost: 38200000,
    cycle: "bulanan",
    nextBilling: "2026-05-22", // Tomorrow (Alarm status)
    category: "Service API",
    status: "warning"
  },
  {
    id: "SUB-03",
    name: "Slack Pro Plan",
    cost: 4200000,
    cycle: "bulanan",
    nextBilling: "2026-06-03",
    category: "Operasional",
    status: "active"
  },
  {
    id: "SUB-04",
    name: "Vercel Hosting",
    cost: 1500000,
    cycle: "bulanan",
    nextBilling: "2026-05-23", // 2 days (Alarm status)
    category: "Server",
    status: "warning"
  },
  {
    id: "SUB-05",
    name: "Google Workspace Pro",
    cost: 3200000,
    cycle: "bulanan",
    nextBilling: "2026-06-15",
    category: "Operasional",
    status: "active"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-101",
    date: "2026-05-18",
    merchant: "Kopi Kenangan",
    category: "Operasional",
    amount: 145000,
    notes: "Meeting santai internal tim dev membahas sprint 4.",
    status: "Approved",
    type: "reimburse",
    employeeId: '123',
        receiptUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "TX-102",
    date: "2026-05-19",
    merchant: "Gojek Indonsia - Perjalanan Operasional",
    category: "Transportasi",
    amount: 85000,
    notes: "Kunjungan kerja ke kantor klien UniGEO di Tebet.",
    status: "Approved",
    type: "reimburse",
    employeeId: '123',
        receiptUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "TX-103",
    date: "2026-05-20",
    merchant: "Starbucks Thamrin",
    category: "Operasional",
    amount: 210000,
    notes: "Beli kopi untuk klien korporat dari AquaMate.",
    status: "Pending",
    type: "reimburse",
    employeeId: '123',
        receiptUrl: "/receipt-starbucks.jpg", // Preloaded base64 reference or placeholder
    
  },
  {
    id: "TX-104",
    date: "2026-05-21",
    merchant: "Soto Kudus Menara",
    category: "Operasional",
    amount: 95000,
    notes: "Makan siang dengan tim UI/UX membahas feedback layout.",
    status: "Pending",
    type: "reimburse",
    employeeId: '123',
        receiptUrl: "/receipt-soto.jpg"
  },
  {
    id: "TX-105",
    date: "2026-05-17",
    merchant: "Premium Office Stationary",
    category: "Operasional",
    amount: 320000,
    notes: "Injeksi tinta printer, kertas A4, dan pulpen kantor.",
    status: "Rejected",
    type: "reimburse",
    employeeId: '123',
        receiptUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60",
      },
  // Inbound Automated Streams (Uang Masuk)
  {
    id: "TX-INC-001",
    date: "2026-05-21",
    merchant: "UniGEO App Inbound stream",
    category: "Pemasukan Produk",
    amount: 4500000,
    notes: "Pembayaran lisensi API dari PT Sentosa Geo Solusindo.",
    status: "Approved",
    type: "income",
    employeeId: '123'
  },
  {
    id: "TX-INC-002",
    date: "2026-05-21",
    merchant: "AquaMate Smart Meter platform Billing",
    category: "Pemasukan Produk",
    amount: 3200000,
    notes: "Siklus tagihan bulanan SaaS dari PDAM Tirta Kencana.",
    status: "Approved",
    type: "income",
    employeeId: '123'
  },
  {
    id: "TX-INC-003",
    date: "2026-05-20",
    merchant: "UniGEO SaaS Inbound stream",
    category: "Pemasukan Produk",
    amount: 15200000,
    notes: "Inbound volume billing oleh Astra Digital Service.",
    status: "Approved",
    type: "income",
    employeeId: '123'
  },
  // Manual Entry Form Transaksi buku kas
  {
    id: "TX-MAN-001",
    date: "2026-05-15",
    merchant: "Injeksi Dana Investor (Angel Group)",
    category: "Investasi",
    amount: 500000000,
    notes: "Penerimaan pendanaan jembatan untuk akselerasi R&D AI Server.",
    status: "Approved",
    type: "income",
    employeeId: '123'
  },
  {
    id: "TX-MAN-002",
    date: "2026-05-16",
    merchant: "Sewa Co-Working Space Bulanan",
    category: "Utilitas & Kantor",
    amount: 12000000,
    notes: "Sewa hotdesk bulanan di WeWork Kuningan.",
    status: "Approved",
    type: "expense_manual",
    employeeId: '123'
  }
];

// Pre-defined Base64 sample receipt images for realistic scan experience
// Starbucks, Soto Kudus, Taxi, etc.
// Here we will export placeholders that are valid base64 or clean designs
export const MOCK_RECEIPT_STARBUCKS = `https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60`;
export const MOCK_RECEIPT_SOTO = `https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`;
export const MOCK_RECEIPT_TAXI = `https://images.unsplash.com/photo-1518112166137-839070a7df84?w=500&auto=format&fit=crop&q=60`;
