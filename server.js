const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('uploads'));
app.use(express.json());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/upload', upload.array('files'), (req, res) => {
  const files = req.files.map(f => ({
    name: f.originalname,
    url: `${req.protocol}://${req.get('host')}/${f.filename}`
  }));
  res.json({ message: 'ගොනු උඩුගත කරන ලදි!', files });
});

app.get('/files', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) return res.status(500).json({ error: 'ගොනු ලැයිස්තුගත කළ නොහැක' });
    const fileList = files.map(f => ({
      name: f,
      url: `${req.protocol}://${req.get('host')}/${f}`
    }));
    res.json(fileList);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 සේවාදායකය ක්‍රියාත්මක වෙයි: http://localhost:${PORT}`);
});
