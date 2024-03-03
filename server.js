const express = require('express');
const app = express();
const port = 3000; // Port yang akan digunakan
const { main } = require('./index');

const fs = require('fs');

const readSchedule = () => {
  const jsonData = fs.readFileSync('jadwaltv.json');
  return JSON.parse(jsonData);
};

app.get('/api/jadwal', (req, res) => {
  const schedule = readSchedule();
  res.json(schedule);
});

main();

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
