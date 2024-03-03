const express = require('express');
const app = express();
const PORT = 3000;
const { main } = require('./index'); // Pastikan path benar

// Middleware untuk melayani file JSON
app.use('/api/jadwal', express.static('jadwaltv.json'));

// Jalankan fungsi main untuk melakukan scraping saat server dijalankan
main().then(() => {
  console.log('Scraping selesai, server siap dijalankan.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Terjadi kesalahan saat melakukan scraping:', error);
});
