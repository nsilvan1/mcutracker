const https = require('https');

const API_KEY = '1f54bd990f1cdfb230adb312546d765d';

function fetchTMDB(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function findBackdropUrls() {
  try {
    console.log('Buscando URLs dos backdrops no TMDB...\n');

    // Capitão América: Guerra Civil
    console.log('1. Capitão América: Guerra Civil (movie/271110):');
    const civilWarData = await fetchTMDB(`https://api.themoviedb.org/3/movie/271110/images?api_key=${API_KEY}`);
    if (civilWarData.backdrops && civilWarData.backdrops.length > 0) {
      const backdrop = civilWarData.backdrops[0];
      console.log(`   URL: https://image.tmdb.org/t/p/original${backdrop.file_path}`);
    }

    // Ms. Marvel
    console.log('\n2. Ms. Marvel (tv/92782):');
    const msmarvelData = await fetchTMDB(`https://api.themoviedb.org/3/tv/92782/images?api_key=${API_KEY}`);
    if (msmarvelData.backdrops && msmarvelData.backdrops.length > 0) {
      const backdrop = msmarvelData.backdrops[0];
      console.log(`   URL: https://image.tmdb.org/t/p/original${backdrop.file_path}`);
    }

  } catch (error) {
    console.error('Erro:', error.message);
  }
}

findBackdropUrls();

