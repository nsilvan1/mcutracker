const https = require('https');

// URLs de backdrop para verificar
const backdropUrls = [
  'https://image.tmdb.org/t/p/original/wdwcOBMkt3zmPxGMDbssmhxMrP.jpg', // Capitão América: Guerra Civil
  'https://image.tmdb.org/t/p/original/57vVjteucIF3bGnZj6PmaoJRScw.jpg', // WandaVision
  'https://image.tmdb.org/t/p/original/oO6D9yzQHF0FXjx3BPMLW1OyqCQ.jpg', // Ms. Marvel
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
    };

    const req = https.request(options, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode === 200 });
    });

    req.on('error', () => {
      resolve({ url, status: 'ERROR', ok: false });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT', ok: false });
    });

    req.end();
  });
}

async function checkAllUrls() {
  console.log('Verificando URLs de backdrop...\n');
  
  for (const url of backdropUrls) {
    const result = await checkUrl(url);
    const status = result.ok ? '✅ OK' : `❌ ${result.status}`;
    console.log(`${status} - ${url.split('/').pop()}`);
  }
}

checkAllUrls();

