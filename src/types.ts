/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'reimburse' | 'cash_advance' | 'income' | 'expense_manual';
export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected';



export interface Company {
  id: string;
  name: string;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
}

export interface LineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  notes?: string;
  status: TransactionStatus;
  receiptUrl?: string; // Base64 or mock URL
  rejectReason?: string;
  type: TransactionType;
  employeeId: string;
  createdAt?: string;
  items?: LineItem[];
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  cycle: 'bulanan' | 'tahunan';
  nextBilling: string;
  category: string;
  status: 'active' | 'warning' | 'on_hold';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  division: string;
  salary: number;
  bankAccount: string;
  bankName: string;
  bank_passbook_url?: string;
  bank_account_holder?: string;
  bank_validated?: boolean;
  bank_rejection_reason?: string;
  companyId?: string | null;
  status?: 'active' | 'unassigned';
}

export interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  apiKey: string;
  webhookUrl: string;
  monthlyRevenue: number;
  paymentGateway: string;
}
