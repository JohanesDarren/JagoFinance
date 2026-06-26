/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'reimburse' | 'cash_advance' | 'income' | 'expense_manual';
export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected';



export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  notes?: string;
  status: TransactionStatus;
  receiptUrl?: string; // Base64 or mock URL
  type: TransactionType;
  employeeId: string;
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
