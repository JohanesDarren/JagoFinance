import dotenv from 'dotenv';
dotenv.config();

async function testOCR() {
  try {
    const apiKey = process.env.FREEOCR_API_KEY;
    if (!apiKey) {
      console.log("No API key found in .env");
      return;
    }

    // create a dummy image (just a tiny valid pixel or we can use a sample base64)
    // Here is a valid 1x1 transparent png base64
    const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1elFAAAAAElFTkSuQmCC";
    const buffer = Buffer.from(base64Image, 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });
    
    const formData = new FormData();
    formData.append('image', blob, 'test.png');
    
    const fields = ['Merchant', 'Date', 'Amount'];
    const queryParams = fields.map(f => `fields=${encodeURIComponent(f)}`).join('&');
    const url = `https://freeocr.ai/api/v1/platform/extract?${queryParams}`;

    console.log("Sending request to:", url);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}
testOCR();
