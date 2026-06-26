export interface HermesExtractionResult {
  merchant: string;
  date: string;
  category: string;
  amount: number;
  notes: string;
}

export const extractWithHermesMock = async (imageUrl: string): Promise<HermesExtractionResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Determine mock output based on some simple heuristics from imageUrl (if any),
  // otherwise fallback to a generic response.
  const urlLower = imageUrl.toLowerCase();
  
  if (urlLower.includes('starbucks') || urlLower.includes('coffee')) {
    return {
      merchant: 'Starbucks Coffee',
      date: new Date().toISOString().split('T')[0],
      category: 'Operasional',
      amount: 142000,
      notes: 'Pembelian kopi untuk meeting'
    };
  } else if (urlLower.includes('grab') || urlLower.includes('transport')) {
    return {
      merchant: 'Grab Transport',
      date: new Date().toISOString().split('T')[0],
      category: 'Transportasi',
      amount: 68000,
      notes: 'Transportasi meeting klien'
    };
  } else {
    return {
      merchant: 'Toko Serba Ada',
      date: new Date().toISOString().split('T')[0],
      category: 'Lainnya',
      amount: 150000,
      notes: 'Pembelian barang'
    };
  }
};
