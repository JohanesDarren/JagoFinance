const fs = require('fs');
let data = fs.readFileSync('src/utils/mockData.ts', 'utf8');
data = data.replace(/staffName:.*?\n/g, "employeeId: '123',\n");
data = data.replace(/staffEmail:.*?\n/g, '');
data = data.replace(/transferReceiptUrl:.*?\n/g, '');
data = data.replace(/timeline: \[\s*\{[\s\S]*?\]/g, '');
// Clean up trailing commas before closing braces that might happen
data = data.replace(/,\s*\}/g, '\n  }');
fs.writeFileSync('src/utils/mockData.ts', data);
