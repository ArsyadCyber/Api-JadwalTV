const express = require('express');
const app = express();
const { main } = require('./scrape'); // Pastikan ini sesuai dengan lokasi file index.js Anda

// Panggil fungsi main untuk menjalankan scraping saat server dimulai
main();

app.get('/api/jadwal', (req, res) => {
  const fs = require('fs');

  // Membaca file jadwaltv.json dan mengirimkan isi sebagai response
  fs.readFile('jadwaltv.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading schedule file');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// Vercel akan mengatur port secara otomatis
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});

module.exports = app;
