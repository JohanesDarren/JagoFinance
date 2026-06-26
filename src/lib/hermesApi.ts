import { supabase, isSupabaseConfigured } from './supabase';

export interface ScanResult {
  id?: string;
  merchant: string;
  date: string;
  category: string;
  amount: number;
  notes: string;
  receiptUrl: string;
}

export const scanReceiptAndUpload = async (
  fileBase64: string,
  fileName: string,
  mimeType: string,
  employeeId?: string
): Promise<ScanResult> => {
  let receiptUrl = '';

  // 1. If Supabase is active, upload to private bucket 'receipts'
  if (isSupabaseConfigured()) {
    try {
      const base64Data = fileBase64.includes('base64,') ? fileBase64.split('base64,')[1] : fileBase64;
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const fileExt = fileName.split('.').pop() || 'jpg';
      const storagePath = `single-tenant/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('receipts')
        .upload(storagePath, bytes.buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (uploadErr) {
        console.error("Supabase Storage upload failed:", uploadErr);
      } else {
        const { data: signedData, error: signedErr } = await supabase.storage
          .from('receipts')
          .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

        if (signedErr) {
          console.error("Signed URL creation failed:", signedErr);
        } else if (signedData) {
          receiptUrl = signedData.signedUrl;
        }
      }
    } catch (err) {
      console.error("Error during Supabase Storage operations:", err);
    }
  }

  if (!receiptUrl) {
    receiptUrl = fileBase64.startsWith('data:') ? fileBase64 : `data:${mimeType};base64,${fileBase64}`;
  }

  // 2. Call the new Hermes Orchestration Endpoint
  const response = await fetch('/api/transactions/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      receiptUrl,
      employeeId
    })
  });

  if (!response.ok) {
    throw new Error('Gagal memproses transaksi melalui Hermes AI server.');
  }

  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || 'Proses transaksi gagal.');
  }

  // Map backend transaction back to expected frontend shape if it still needs it
  const tx = resData.transaction;
  return {
    id: tx.id,
    merchant: tx.merchant,
    date: tx.date,
    category: tx.category,
    amount: Number(tx.amount),
    notes: tx.notes || '',
    receiptUrl
  };
};
