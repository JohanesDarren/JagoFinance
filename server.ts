/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
// Load environment variables
dotenv.config();

// Standard Mock Data imports
import { 
  INITIAL_CASH_BALANCE, 
  INITIAL_EMPLOYEES, 
  INITIAL_CONNECTED_APPS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_TRANSACTIONS
} from './src/utils/mockData.js';
import { Transaction, ConnectedApp, Subscription, Employee, Company } from './src/types';
import { extractWithHermesMock } from './src/services/hermesMock.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
// Stateful Server Database in Memory for the session
let db = {
  cashBalance: INITIAL_CASH_BALANCE,
  employees: [...INITIAL_EMPLOYEES],
  connectedApps: [...INITIAL_CONNECTED_APPS],
  subscriptions: [...INITIAL_SUBSCRIPTIONS],
  transactions: [...INITIAL_TRANSACTIONS],
  notifications: [] as any[]
};

// Start Server Setup
async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;


  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // --- API Endpoints ---
  
  // 1. Get All Session Data
  app.get('/api/financial-data', (req, res) => {
    try {
      res.json(db);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. Submit Reimburse / Cash Advance
  app.post('/api/reimburse/submit', (req, res) => {
    try {
      const { merchant, date, category, amount, notes, receiptUrl, staffName, staffEmail, type } = req.body;
      
      if (!merchant || !amount) {
        return res.status(400).json({ error: 'Merchant dan nominal nominal wajib diisi.' });
      }

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newTx: Transaction = {
        id: `TX-${Math.floor(100 + Math.random() * 900)}`,
        date: date || new Date().toISOString().split('T')[0],
        merchant,
        category: category || 'Operasional',
        amount: Number(amount),
        notes: notes || '',
        status: 'Pending',
        receiptUrl: receiptUrl || MOCK_RECEIPT_FALLBACK(),
        type: type || 'reimburse',
        employeeId: 'admin'
      };

      db.transactions = [newTx, ...db.transactions];
      res.json({ success: true, transaction: newTx });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Approve Reimburse (And Deduct Balance)
  app.post('/api/reimburse/approve', (req, res) => {
    try {
      const { transactionId, recipientName, bankName, bankAccount, transferReceiptUrl } = req.body;
      const txIndex = db.transactions.findIndex(t => t.id === transactionId);

      if (txIndex === -1) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
      }

      const tx = db.transactions[txIndex];
      
      if (tx.status !== 'Pending') {
        return res.status(400).json({ error: 'Transaksi sudah diproses sebelumnya.' });
      }

      // Safeguard error state: Insufficient balance
      if (db.cashBalance < tx.amount) {
        return res.status(400).json({ 
          error: 'Saldo Kas Tidak Cukup', 
          message: `Saldo kas saat ini (Rp ${db.cashBalance.toLocaleString('id-ID')}) tidak cukup untuk mencairkan reimburse senilai Rp ${tx.amount.toLocaleString('id-ID')}. Silakan lakukan injeksi dana manual terlebih dahulu.`
        });
      }

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      db.cashBalance -= tx.amount;
      
      // Update transaction status
      db.transactions[txIndex] = {
        ...tx,
        status: 'Approved'
      };

      res.json({ success: true, balance: db.cashBalance, transaction: db.transactions[txIndex] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. Reject Reimburse
  app.post('/api/reimburse/reject', (req, res) => {
    try {
      const { transactionId, rejectReason } = req.body;
      
      if (!rejectReason) {
        return res.status(400).json({ error: 'Alasan penolakan wajib disertakan.' });
      }

      const txIndex = db.transactions.findIndex(t => t.id === transactionId);

      if (txIndex === -1) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
      }

      const tx = db.transactions[txIndex];
      if (tx.status !== 'Pending') {
        return res.status(400).json({ error: 'Transaksi sudah diproses sebelumnya.' });
      }

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      
      db.transactions[txIndex] = {
        ...tx,
        status: 'Rejected'
      };

      res.json({ success: true, transaction: db.transactions[txIndex] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 5. Add Manual Entry (Cash Ledger)
  app.post('/api/ledger/manual', (req, res) => {
    try {
      const { merchant, category, amount, notes, type, receiptUrl } = req.body;
      
      if (!merchant || !amount || !type) {
        return res.status(400).json({ error: 'Mohon isi Field Merchant, Nominal, dan Tipe transaksi.' });
      }

      const amt = Number(amount);
      if (type === 'expense_manual') {
        // Safe lock
        if (db.cashBalance < amt) {
          return res.status(400).json({ 
            error: 'Saldo Kas Tidak Cukup', 
            message: 'Saldo kas saat ini tidak mencukupi untuk mencatat transaksi pengeluaran manual ini.' 
          });
        }
        db.cashBalance -= amt;
      } else if (type === 'income') {
        db.cashBalance += amt;
      }

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newTx: Transaction = {
        id: `TX-MAN-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        merchant,
        category,
        amount: amt,
        notes: notes || '',
        status: 'Approved',
        type,
        receiptUrl: receiptUrl || '',
        employeeId: 'admin'
      };

      db.transactions = [newTx, ...db.transactions];
      res.json({ success: true, cashBalance: db.cashBalance, transaction: newTx });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 6. Connect / Disconnect Connected App
  app.post('/api/connected-apps/toggle', (req, res) => {
    try {
      const { appId } = req.body;
      const appIndex = db.connectedApps.findIndex(a => a.id === appId);

      if (appIndex === -1) {
        return res.status(404).json({ error: 'Aplikasi tidak ditemukan.' });
      }

      const connectedApp = db.connectedApps[appIndex];
      const newStatus = connectedApp.status === 'active' ? 'inactive' : 'active';
      
      db.connectedApps[appIndex] = {
        ...connectedApp,
        status: newStatus,
        monthlyRevenue: newStatus === 'active' ? Math.floor(80000000 + Math.random() * 90000000) : 0
      };

      res.json({ success: true, app: db.connectedApps[appIndex] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 7. Configure app webhook
  app.post('/api/connected-apps/webhook', (req, res) => {
    try {
      const { appId, webhookUrl, paymentGateway } = req.body;
      const appIndex = db.connectedApps.findIndex(a => a.id === appId);

      if (appIndex === -1) {
        return res.status(404).json({ error: 'Aplikasi tidak ditemukan.' });
      }

      const randomApiKey = 'jg_live_' + [...Array(24)].map(() => (Math.random() * 36 | 0).toString(36)).join('');
      db.connectedApps[appIndex] = {
        ...db.connectedApps[appIndex],
        webhookUrl,
        paymentGateway,
        apiKey: randomApiKey,
        status: 'active',
        monthlyRevenue: Math.floor(100000000 + Math.random() * 80000000)
      };

      res.json({ success: true, app: db.connectedApps[appIndex] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 8. Mass-issue payroll slip
  app.post('/api/payroll/generate', (req, res) => {
    try {
      const { division } = req.body;
      const targetEmployees = division === 'Semua' 
        ? db.employees 
        : db.employees.filter(e => e.division === division);

      if (targetEmployees.length === 0) {
        return res.status(400).json({ error: 'Tidak ada karyawan di divisi terpilih.' });
      }

      let totalDeduct = 0;
      targetEmployees.forEach(e => totalDeduct += e.salary);

      if (db.cashBalance < totalDeduct) {
        return res.status(400).json({
          error: 'Saldo Kas Tidak Cukup',
          message: `Saldo kas (Rp ${db.cashBalance.toLocaleString('id-ID')}) tidak cukup untuk membayarkan total gaji massal sebesar Rp ${totalDeduct.toLocaleString('id-ID')} untuk ${targetEmployees.length} karyawan.`
        });
      }

      db.cashBalance -= totalDeduct;

      const dateStr = new Date().toISOString().split('T')[0];
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Record payroll entries on cash ledger
      targetEmployees.forEach(e => {
        db.transactions.push({
          id: `TX-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          date: dateStr,
          merchant: `Gaji Bulanan - ${e.name} (${e.division})`,
          category: 'Gaji Karyawan',
          amount: e.salary,
          notes: `Pembayaran Payroll via transfer ke Rekening ${e.bankName} ${e.bankAccount}.`,
          status: 'Approved',
          type: 'expense_manual',
          employeeId: 'admin'
        });
      });

      res.json({ 
        success: true, 
        message: `Slip Gaji berhasil diterbitkan dan ditransfer untuk ${targetEmployees.length} karyawan.`,
        deducted: totalDeduct,
        cashBalance: db.cashBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });



  // 9. AI SCANNER ENDPOINT (Receipt Extractor using Server-Side Gemini API)
  app.post('/api/scan-receipt', async (req, res) => {
    try {
      const { image, mimeType, fileName } = req.body;

      if (!image) {
        return res.status(400).json({ error: 'Image data is required.' });
      }

      const cleanMime = mimeType || 'image/jpeg';

      // Verify key in server side
      const apiKey = process.env.OCRSPACE_API_KEY || 'K87082730388957'; // Use user's key if env not set
      
      console.log(`OCR.space API config detected. Invoking text extraction...`);
      
      // Ensure base64Data has prefix since OCR.space requires it if using base64Image param
      let base64Param = image;
      if (!image.startsWith('data:image')) {
        base64Param = `data:${cleanMime};base64,${image}`;
      }
      
      const formData = new FormData();
      formData.append('apikey', apiKey);
      formData.append('base64Image', base64Param);
      formData.append('OCREngine', '2'); // Engine 2 is often better for receipts
      formData.append('scale', 'true');

      const url = `https://api.ocr.space/parse/image`;

      const ocrResponse = await fetch(url, {
        method: 'POST',
        body: formData as any
      });

      if (!ocrResponse.ok) {
        throw new Error(`OCR.space API error: ${ocrResponse.status}`);
      }

      const ocrResult = await ocrResponse.json();
      console.log(`OCR.space extracted result:`, ocrResult);
      
      if (ocrResult.IsErroredOnProcessing || !ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
        throw new Error(ocrResult.ErrorMessage?.[0] || 'Gagal mengekstrak teks dari gambar.');
      }

      const parsedText = ocrResult.ParsedResults[0].ParsedText || '';
      const lines = parsedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // Smart Heuristic Extraction from Raw Text
      let extractedMerchant = 'Merchant Tidak Diketahui';
      let extractedDate = new Date().toISOString().split('T')[0];
      let extractedAmount = 0;
      
      if (lines.length > 0) {
        // Assume first line is merchant
        extractedMerchant = lines[0];
      }
      
      // Find Date (DD/MM/YYYY or similar)
      const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/;
      for (const line of lines) {
        const match = line.match(dateRegex);
        if (match) {
          let year = match[3];
          if (year.length === 2) year = '20' + year;
          // Basic validation, assume DD/MM/YYYY
          extractedDate = `${year}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
          break;
        }
      }
      
      // Find Amount (look for TOTAL, AMOUNT, or biggest number at the bottom)
      let maxNumber = 0;
      let totalLineIndex = lines.length;
      let absoluteTotalLineIndex = lines.length;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toUpperCase();
        
        // Find the FIRST total line (usually placed after the items) to stop item extraction
        if (i > 4 && /(SUB\s*TOTAL|TOTAL QTY|TOTAL|BAYAR|CASH|KEMBALI)/i.test(line)) {
            totalLineIndex = Math.min(totalLineIndex, i);
        }
        // Find the absolute total line (stops at TUNAI/CASH/KEMBALI or TOTAL without SUB) to allow capturing PPN
        if (i > 4 && /(TOTAL|BAYAR|CASH|KEMBALI|TUNAI)/i.test(line) && !/SUB\s*TOTAL/i.test(line)) {
            absoluteTotalLineIndex = Math.min(absoluteTotalLineIndex, i);
        }
        
        // At the same time, find the max amount for the total (still scanning all lines)
        const numericMatch = line.match(/[\d\.,]+/g);
        if (numericMatch) {
          for (const numStr of numericMatch) {
            const cleanNum = parseInt(numStr.replace(/[^\d]/g, ''));
            if (!isNaN(cleanNum) && cleanNum > maxNumber && cleanNum < 100000000 && cleanNum % 100 === 0) {
              maxNumber = cleanNum;
            }
          }
        }
      }
      extractedAmount = maxNumber;

      // Extract Items (Per Produk) - State Machine Approach
      let extractedItems: any[] = [];
      let pendingItemName = '';
      
      for (let i = 1; i < Math.min(lines.length, totalLineIndex); i++) {
        const line = lines[i];
        
        // Skip common footer/header noise (Removed TAX/PAJAK/DISKON so they can be captured)
        if (/TOTAL|SUBTOTAL|CASH|KEMBALI|CHANGE|TELP|TLP|NPWP|JL\.|JI\.|JALAN|NO\.|FAKTUR|TANGGAL|DATE|WAKTU|TIME|KODE|KASIR|PELANGGAN/i.test(line)) continue;
        
        // Exclude lines that look strictly like dates/times to avoid misinterpreting 2026 as Rp2.026
        if (/^\s*\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4}\s*$/.test(line) || /^\s*\d{2}:\d{2}(:\d{2})?\s*$/.test(line)) {
            continue;
        }
        
        const numStrs = line.match(/[\d\.,]+/g);
        let maxNumberInLine = 0;
        let qty = 1;
        let possibleNumbers: number[] = [];
        
        if (numStrs) {
          for (const numStr of numStrs) {
            const cleanNum = parseInt(numStr.replace(/[^\d]/g, ''));
            if (!isNaN(cleanNum)) {
               possibleNumbers.push(cleanNum);
               // Assume prices are > 1000 in IDR context and end with 00 (filters out postal codes)
               if (cleanNum > maxNumberInLine && cleanNum < 100000000 && cleanNum >= 1000 && cleanNum % 100 === 0) {
                   maxNumberInLine = cleanNum;
               }
            }
          }
        }
        
        // Clean text
        const textOnly = line.replace(/[\d\.,]+/g, ' ').replace(/[^a-zA-Z\s]/g, '').replace(/Rp|IDR/ig, '').trim();
        const hasText = textOnly.length >= 3;

        if (maxNumberInLine >= 1000) {
          // Found a valid price in this line
          // Look for quantity (small number < 100)
          const smallNumbers = possibleNumbers.filter(n => n > 0 && n < 100);
          if (smallNumbers.length > 0) qty = smallNumbers[0];
          
          let finalName = '';
          if (hasText && pendingItemName) {
             finalName = pendingItemName + ' ' + textOnly; // Combine them! e.g. "Indomie Goreng lusin x"
             pendingItemName = '';
          } else if (hasText) {
             finalName = textOnly;
             pendingItemName = '';
          } else if (pendingItemName) {
             finalName = pendingItemName;
             pendingItemName = '';
          } else {
             finalName = 'Item ' + (extractedItems.length + 1);
          }
          
          extractedItems.push({
            name: finalName,
            price: Math.floor(maxNumberInLine / qty), // normalize unit price so UI qty math works
            quantity: qty
          });
        } else if (hasText) {
          // No price, but found text. It might be an item name whose price is on the next line!
          if (pendingItemName) {
             pendingItemName += ' ' + textOnly;
          } else {
             pendingItemName = textOnly;
          }
        }
      }

      // Mathematical overflow cleanup (if a subtotal got mistakenly captured as an item)
      let currentSum = extractedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      if (currentSum > maxNumber && maxNumber > 0) {
         let unnamedItems = extractedItems
             .map((it, idx) => ({...it, originalIndex: idx}))
             .filter(it => /^Item \d+$/.test(it.name))
             .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity));
             
         for (let uItem of unnamedItems) {
             if (currentSum > maxNumber) {
                currentSum -= (uItem.price * uItem.quantity);
                extractedItems[uItem.originalIndex] = null;
             }
         }
         extractedItems = extractedItems.filter(it => it !== null);
      }

      // Sum of State Machine
      const smSum = extractedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);

      // COLUMNAR FALLBACK for POS like Pawoon
      if (extractedItems.length === 0 || (extractedAmount > 0 && smSum < extractedAmount * 0.4)) {
         let cNames: {text: string, index: number}[] = [];
         let cQtys: {qty: number, index: number}[] = [];
         let cPrices: {price: number, index: number}[] = [];
         
         for(let i=0; i<lines.length; i++) {
            let line = lines[i];
            if (/CASH|KEMBALI|CHANGE|TELP|TLP|NPWP|JL\.|JI\.|JALAN|NO\.|FAKTUR|TANGGAL|DATE|WAKTU|TIME|KODE|KASIR|PELANGGAN|WIFI|PASS/i.test(line)) continue;
            if (/^\s*\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4}\s*$/.test(line) || /^\s*\d{2}:\d{2}(:\d{2})?\s*$/.test(line)) continue;
            
            let priceMatches = line.match(/[\d\.,]+/g);
            let foundPrice = false;
            if (priceMatches) {
               for (let pm of priceMatches) {
                   let cleanP = parseInt(pm.replace(/[^\d]/g, ''));
                   if (cleanP >= 1000 && cleanP < 100000000 && cleanP % 100 === 0) {
                      cPrices.push({price: cleanP, index: i});
                      foundPrice = true;
                      break;
                   }
               }
            }
            if (foundPrice) continue;
            
            let qtyMatch = line.match(/^x?\s*(\d+)\s*x?$/i);
            if (qtyMatch && parseInt(qtyMatch[1]) < 100 && i < absoluteTotalLineIndex) {
               cQtys.push({qty: parseInt(qtyMatch[1]), index: i});
               continue;
            }
            
            const textOnly = line.replace(/[\d\.,]+/g, ' ').replace(/[^a-zA-Z\s]/g, '').trim();
            if (textOnly.length >= 3 && i > 4 && i < absoluteTotalLineIndex) {
               if (!/pawoon|resto|terima|kasih|wifi|powered/i.test(textOnly)) {
                 cNames.push({text: textOnly, index: i});
               }
            }
         }
         
         if (cNames.length > 0) {
           let lastObjIndex = cNames[cNames.length - 1].index;
           let validPrices = cPrices.filter(p => p.index > lastObjIndex).map(p => p.price);
           let validQtys = cQtys.map(q => q.qty);
           
           let fallbackItems: any[] = [];
           let qIdx = 0;
           let fbAmount = 0;
           
           for(let i=0; i<cNames.length; i++) {
              let name = cNames[i].text;
              let p = validPrices[i] || 0;
              
              if (/SUB\s*TOTAL/i.test(name)) continue;
              if (/TOTAL/i.test(name) && !/SUB/i.test(name)) {
                 fbAmount = p;
                 continue;
              }
              
              let q = 1;
              if (!/PPN|PAJAK|TAX|DISKON/i.test(name) && qIdx < cQtys.length) {
                 q = cQtys[qIdx].qty;
                 qIdx++;
              }
              
              fallbackItems.push({
                 name: name,
                 price: Math.floor(p / q),
                 quantity: q
              });
           }
           
           let fbSum = fallbackItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
           if (fbSum > smSum) {
              extractedItems = fallbackItems;
           }
         }
      }

      if (extractedItems.length === 0) {
        extractedItems = [{ name: 'Total Belanja (Auto)', price: extractedAmount, quantity: 1 }];
      }
      
      // Override exact extractedAmount with sum of all verified items to guarantee perfect mathematical match
      let exactFinalAmount = extractedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      if (exactFinalAmount > 0) {
        extractedAmount = exactFinalAmount;
      }

      const parsed = {
        merchant: extractedMerchant,
        date: extractedDate,
        category: 'Operasional',
        amount: extractedAmount,
        notes: 'Hasil scan teks: ' + lines.slice(1, 3).join(' '),
        items: extractedItems
      };

      res.json({ 
        success: true, 
        extracted: parsed, 
        aiMethod: 'OCR.space (Advanced Heuristics)' 
      });

    } catch (error: any) {
      console.error("Gemini Scan Error:", error);
      // Fallback with visual warning to client
      res.status(200).json({ 
        success: true, 
        extracted: generateSmartMockReceipt(req.body.fileName, req.body.image),
        aiMethod: 'Local Shimmer Safe-Extractor (OCR Core Recovery)',
        error: error.message,
        warning: `AI OCR Gagal: ${error.message}. Sistem mendarat darurat menggunakan scan heuristik.`
      });
    }
  });

  // --- End of API Endpoints ---

  // 10. AI Transaction Processing Endpoint
  app.post('/api/transactions/process', async (req, res) => {
  try {
    const { receiptUrl, employeeId } = req.body;

    if (!receiptUrl) {
      return res.status(400).json({ error: 'Missing receiptUrl' });
    }

    console.log(`Processing receipt for employee ${employeeId || 'unknown'}: ${receiptUrl}`);

    // 1. Call Hermes AI Mock Service to extract data
    const extractedData = await extractWithHermesMock(receiptUrl);

    // Get employee's company_id and email
    let companyId = null;
    let employeeEmail = null;
    if (employeeId) {
      const { data: user } = await supabaseAdmin.from('users').select('company_id, email').eq('id', employeeId).single();
      companyId = user?.company_id || null;
      employeeEmail = user?.email || null;
    }

    // 2. Insert into Supabase transactions table using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert([
        {
          created_by: employeeId || null,
          company_id: companyId,
          merchant: extractedData.merchant,
          category: extractedData.category,
          amount: extractedData.amount,
          notes: extractedData.notes,
          type: 'reimbursement',
          status: 'pending',
          receipt_url: receiptUrl
        }
      ])
      .select()
      .single();

      if (error) {
        console.error('Supabase Insert Error:', error);
        throw new Error('Gagal menyimpan transaksi ke database.');
      }

      // Add Notification
      if (employeeEmail) {
        db.notifications.push({
          id: Math.random().toString(36).substring(7),
          email: employeeEmail,
          title: 'Pengajuan Diterima',
          message: 'Pengajuan reimburse diterima sistem, tinggal menunggu admin untuk dicek.',
          type: 'info',
          timestamp: Date.now()
        });
      }

      res.json({ success: true, transaction: data });
    } catch (error: any) {
      console.error('Transaction Processing Error:', error);
      res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server.' });
    }
  });
  // 11. Generic Employee Transaction Proxy to bypass RLS
  app.post('/api/transactions/employee', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin.from('transactions').insert([req.body]).select().single();
      if (error) throw error;
      res.json({ success: true, transaction: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/transactions/employee/:id', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin.from('transactions').update(req.body).eq('id', req.params.id).select().single();
      if (error) throw error;
      res.json({ success: true, transaction: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Notifications API ---
  app.get('/api/notifications/:email', (req, res) => {
    const userNotifs = db.notifications
      .filter(n => n.email === req.params.email)
      .sort((a, b) => b.timestamp - a.timestamp);
    res.json({ notifications: userNotifs });
  });

  app.post('/api/notifications', (req, res) => {
    const { email, title, message, type } = req.body;
    const notif = {
      id: Math.random().toString(36).substring(7),
      email,
      title,
      message,
      type: type || 'info', // 'info' | 'success' | 'warning'
      timestamp: Date.now()
    };
    db.notifications.push(notif);
    res.json({ success: true, notification: notif });
  });

  app.delete('/api/transactions/employee/:id', async (req, res) => {
    try {
      const { error } = await supabaseAdmin.from('transactions').delete().eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware or production static folder serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 and port 3001 (or env PORT)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jago Keuangan Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

// Helpers for Mock Fallbacks
function MOCK_RECEIPT_FALLBACK(): string {
  const images = [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1518112166137-839070a7df84?w=500&auto=format&fit=crop&q=60'
  ];
  return images[Math.floor(Math.random() * images.length)];
}

function generateSmartMockReceipt(fileName: string = '', base64: string = ''): any {
  // Return empty data instead of dummy data so the user can fill it manually
  return {
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Infrastruktur & Cloud',
    amount: 0,
    notes: '',
    items: [{ id: Math.random().toString(36).substr(2, 9), name: '', price: 0, quantity: 1 }]
  };
}

startServer();
