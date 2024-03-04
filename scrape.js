const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const cron = require('node-cron');

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

  let tvSchedule = {};

  for (const { name, url } of channels) {
    const result = await scrapeChannel(name, url);
    if (result && result.schedule.length > 0) {
      tvSchedule[result.channel] = result.schedule;
    }
  }

  fs.writeFile('jadwaltv.json', JSON.stringify(tvSchedule, null, 2), (err) => {
    if (err) {
      console.error('Terjadi kesalahan saat menyimpan file:', err);
    } else {
      console.log('Jadwal acara TV telah disimpan ke file jadwaltv.json');
    }
  });
};

// Mengatur cron job untuk menjalankan fungsi main setiap hari jam 1 pagi WIB
cron.schedule('0 18 * * *', () => {
  console.log('Memulai proses scraping...');
  main();
}, {
  scheduled: true,
  timezone: "Asia/Jakarta"
});

module.exports = { main };

// Jalankan fungsi utama untuk pertama kali
main();