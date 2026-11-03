require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const orderTerjemahan = require('./routes/orderTerjemahan');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.DB_URI || process.env.MONGODB_URI;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server Express.js berjalan!');
});

// ---------- Route per modul ----------
app.use('/orderTerjemahan', orderTerjemahan);

// ---------- Handler 404 dan error handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Koneksi MongoDB & Jalankan Server ----------
if (!mongoUri) {
  console.warn('B_URI (atau MONGODB_URI) belum diatur di .env; server berjalan tanpa koneksi MongoDB.');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ Terhubung ke MongoDB'))
    .catch((err) => {
      console.error('Gagal terhubung ke MongoDB:', err.message);
    });
}

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));