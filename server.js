const express = require('express');
const app = express();
const { main } = require('./index'); // Pastikan path benar

// Middleware untuk melayani file JSON
app.use('/api/jadwal', express.static('jadwaltv.json'));

// Jalankan fungsi main untuk melakukan scraping saat server dijalankan
main().then(() => {
  console.log('Scraping selesai.');
}).catch(error => {
  console.error('Terjadi kesalahan saat melakukan scraping:', error);
});

module.exports = app; // Ekspor aplikasi untuk Vercel
