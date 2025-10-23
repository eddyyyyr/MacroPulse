const fs = require('fs');
const https = require('https');
const path = require('path');

const TARGETS = [
  'EURO FX', 'BRITISH POUND STERLING', 'JAPANESE YEN', 'SWISS FRANC',
  'CANADIAN DOLLAR', 'AUSTRALIAN DOLLAR', 'MEXICAN PESO',
  'E-MINI S&P 500', 'NASDAQ-100 STOCK INDEX (E-MINI)', 'DJIA', 'RUSSELL 2000',
  'NIKKEI STOCK AVERAGE', 'MSCI EMERGING MARKETS INDEX',
  'GOLD', 'SILVER', 'CRUDE OIL WTI', 'NATURAL GAS', 'COPPER', 'SOYBEANS', 'CORN', 'WHEAT'
];

const COT_URL = 'https://www.cftc.gov/files/dea/futures/deacot.txt';

function fetchCOTFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseSection(section) {
  const lines = section.trim().split('\n');
  const header = lines[0].trim();
  const instrument = header.replace(/FUTURES ONLY REPORTS - /, '').trim();
  const netLine = lines.find(line => line.includes('NET POSITIONS'));
  const netMatch = netLine?.match(/-?\d+/g) || [];
  const net = parseInt(netMatch[0]) || 0;
  return { instrument, net };
}

(async () => {
  const raw = await fetchCOTFile(COT_URL);
  const blocks = raw.split('\n\n');
  const result = {};
  const date = new Date().toISOString().split('T')[0];

  for (const block of blocks) {
    const target = TARGETS.find(name => block.includes(name));
    if (target) {
      const parsed = parseSection(block);
      result[parsed.instrument] = { net: parsed.net };
    }
  }

  const outputPath = path.join(__dirname, '../data/cot/');
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(path.join(outputPath, `${date}.json`), JSON.stringify({ date, ...result }, null, 2));
  console.log('✅ COT data parsed and saved.');
})();
