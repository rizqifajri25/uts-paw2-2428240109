require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');   // tambahkan di antara require lainnya

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const orderTerjemahan = require('./routes/orderTerjemahan');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.DB_URI || process.env.MONGODB_URI;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server Express.js berjalan!');
});

// ---------- Route per modul ----------
app.use('/mahasiswa', orderTerjemahan);

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

if (!mongoUri) {
  console.warn('DB_URI (atau MONGODB_URI) belum diatur; server berjalan tanpa koneksi MongoDB.');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('Terhubung ke MongoDB'))
    .catch((err) => {
      console.error('Gagal terhubung ke MongoDB:', err.message);
    });
}

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));