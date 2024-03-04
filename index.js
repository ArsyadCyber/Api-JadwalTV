const express = require('express');
const app = express();
const fs = require ('fs');
const { main } = require('./scrape'); // Pastikan path benar
const port = process.env.PORT || 3000;

// Middleware untuk parsing JSON dan handling CORS
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Endpoint untuk mendapatkan jadwal TV
app.get('/api/jadwal', (req, res) => {
  fs.readFile('jadwaltv.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Terjadi kesalahan saat membaca file');
    } else {
      res.send(data);
    }
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
    main(); // Memanggil fungsi scraping saat server menyala
});
