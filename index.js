const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const cron = require('node-cron');
const express = require('express');
const app = express();
app.use(express.json()); // Untuk menerima data dalam format JSON

// Koneksi ke MongoDB
mongoose.connect('mongodb+srv://arsyadheroku1:2skDJolHPwb7HOAM@jadwaltv.v0bwjz9.mongodb.net/?retryWrites=true&w=majority&appName=jadwaltv', { useNewUrlParser: true, useUnifiedTopology: true });

// Definisi skema untuk jadwal TV
const scheduleSchema = new mongoose.Schema({
  channel: String,
  schedule: [{
    time: String,
    title: String
  }]
});

// Model untuk jadwal TV
const Schedule = mongoose.model('Schedule', scheduleSchema);

// Fungsi untuk melakukan scraping berdasarkan URL
const scrapeChannel = async (channel, url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    let schedule = [];

    $('tbody tr').each((i, elem) => {
      const time = $(elem).find('td').first().text().trim();
      const title = $(elem).find('td').last().text().trim();

      if (time !== 'Jam' && title !== 'Acara') {
        schedule.push({ time, title });
      }
    });

    return { channel, schedule };
  } catch (error) {
    console.error(`Terjadi kesalahan saat scraping channel ${channel}:`, error);
  }
};

// Fungsi utama untuk menjalankan scraping pada keempat channel
const main = async () => {
  const channels = [
    { name: 'SCTV', url: 'https://www.jadwaltv.net/channel/sctv' },
    { name: 'Indosiar', url: 'https://www.jadwaltv.net/channel/indosiar' },
    { name: 'ANTV', url: 'https://www.jadwaltv.net/channel/antv' },
    { name: 'GTV', url: 'https://www.jadwaltv.net/channel/gtv' },
    { name: 'Inews', url: 'https://www.jadwaltv.net/channel/inewstv' },
    { name: 'Kompas', url: 'https://www.jadwaltv.net/channel/kompastv' },
    { name: 'Metro', url: 'https://www.jadwaltv.net/channel/metrotv'},
    { name: 'MNCTV', url: 'https://www.jadwaltv.net/channel/mnctv'},
    { name: 'Moji', url: 'https://www.jadwaltv.net/channel/moji'},
    { name: 'Net', url: 'https://www.jadwaltv.net/channel/nettv'},
    { name: 'RCTI', url: 'https://www.jadwaltv.net/channel/rcti'},
    { name: 'RTV', url: 'https://www.jadwaltv.net/channel/rtv'},
    { name: 'Trans7', url: 'https://www.jadwaltv.net/channel/trans7'},
    { name: 'TransTV', url: 'https://www.jadwaltv.net/channel/transtv'},
    { name: 'TVONE', url: 'https://www.jadwaltv.net/channel/tvone'},
    { name: 'TVRI', url: 'https://www.jadwaltv.net/channel/tvri'}
  ];

for (const { name, url } of channels) {
  const result = await scrapeChannel(name, url);
  if (result && result.schedule.length > 0) {
    // Membuat atau memperbarui dokumen di MongoDB
    try {
      await Schedule.findOneAndUpdate({ channel: result.channel }, { schedule: result.schedule }, { upsert: true }).exec();
      console.log(`Jadwal acara TV untuk channel ${result.channel} telah disimpan ke database`);
    } catch (err) {
      console.error('Terjadi kesalahan saat menyimpan ke database:', err);
    }
  }
}
};

// Mengatur cron job untuk menjalankan fungsi main setiap hari jam 1 pagi WIB
cron.schedule('0 18 * * *', () => {
console.log('Memulai proses scraping...');
main();
}, {
scheduled: true,
timezone: "Asia/Jakarta"
});

// Jalankan fungsi utama untuk pertama kali
main();

// Endpoint untuk mendapatkan semua data
app.get('/api/jadwal', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint untuk menambahkan data baru
app.post('/api/jadwal', async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Tambahkan endpoint untuk Update dan Delete sesuai kebutuhan

// Definisikan port dan jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});