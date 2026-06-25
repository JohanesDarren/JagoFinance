import { supabase, isSupabaseConfigured } from './supabase';

export interface ScanResult {
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
  companyId?: string
): Promise<ScanResult> => {
  let receiptUrl = '';

  // 1. If Supabase is active, upload to private bucket 'receipts'
  if (isSupabaseConfigured() && companyId) {
    try {
      // Convert base64 to binary ArrayBuffer
      const base64Data = fileBase64.includes('base64,') ? fileBase64.split('base64,')[1] : fileBase64;
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const fileExt = fileName.split('.').pop() || 'jpg';
      const storagePath = `${companyId}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      // Upload binary to Supabase private storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('receipts')
        .upload(storagePath, bytes.buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (uploadErr) {
        console.error("Supabase Storage upload failed:", uploadErr);
      } else {
        // Create signed URL for 1 year
        const { data: signedData, error: signedErr } = await supabase.storage
          .from('receipts')
          .createSignedUrl(storagePath, 60 * 60 * 24 * 365); // 365 days

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

  // Fallback to local base64 if upload fails or sandbox mode
  if (!receiptUrl) {
    receiptUrl = fileBase64.startsWith('data:') ? fileBase64 : `data:${mimeType};base64,${fileBase64}`;
  }

  // 2. Trigger OCR/Gemini Scan on Node Server (which holds the GEMINI_API_KEY securely)
  const cleanBase64 = fileBase64.includes('base64,') ? fileBase64.split('base64,')[1] : fileBase64;

  const response = await fetch('/api/scan-receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: cleanBase64,
      mimeType,
      fileName
    })
  });

  if (!response.ok) {
    throw new Error('Gagal menghubungi API scan server.');
  }

  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || 'Scan OCR gagal.');
  }

  return {
    merchant: resData.extracted.merchant,
    date: resData.extracted.date,
    category: resData.extracted.category,
    amount: Number(resData.extracted.amount),
    notes: resData.extracted.notes || '',
    receiptUrl
  };
};
