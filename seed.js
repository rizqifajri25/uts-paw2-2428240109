// seed.js
// Mengisi basis data dengan 3 jenis layanan terjemahan dan 25 order terjemahan.
// Aman dijalankan berulang: data lama dihapus dulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Layanan = require('./models/prodiModel'); // Atau ubah ke ./models/layananModel jika sudah ganti nama file
const OrderTerjemahan = require('./models/mahasiswaModel'); // Atau ubah ke ./models/terjemahanModel jika sudah ganti nama file

const PEMESAN = [
  'Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gita', 'Hadi', 'Indra', 'Joko',
  'Kiki', 'Lina', 'Maya', 'Nanda', 'Oka', 'Putri', 'Qori', 'Rina', 'Sari', 'Tono',
  'Umar', 'Vina', 'Wawan', 'Yuni', 'Zaki'
];

const PASANGAN_BAHASA = [
  'Indonesia -> Inggris',
  'Inggris -> Indonesia',
  'Jepang -> Indonesia',
  'Mandarin -> Indonesia'
];

const STATUS_ORDER = ['pending', 'proses', 'selesai'];

async function main() {
  const mongoUri = process.env.DB_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('DB_URI atau MONGODB_URI belum dikonfigurasi di file .env');
  }

  await mongoose.connect(mongoUri);

  // Hapus data lama agar tidak duplikat saat dijalankan berulang
  await OrderTerjemahan.deleteMany({});
  await Layanan.deleteMany({});

  // 1. Buat data Kategori / Layanan Terjemahan
  const layananList = await Layanan.insertMany([
    { kode: 'DOC', nama: 'Terjemahan Dokumen Resmi' },
    { kode: 'ABS', nama: 'Terjemahan Abstrak / Jurnal' },
    { kode: 'SUB', nama: 'Terjemahan Subtitle / Media' },
  ]);

  // 2. Buat data Order Terjemahan (25 Data)
  const orderList = PEMESAN.map((nama, i) => ({
    namaPemesan: nama,
    nomorOrder: `TRJ-${24001 + i}`,
    bahasa: PASANGAN_BAHASA[i % PASANGAN_BAHASA.length],
    jumlahHalaman: (i % 5) + 1, // 1-5 Halaman
    status: STATUS_ORDER[i % STATUS_ORDER.length],
    prodiId: layananList[i % 3]._id, // Menghubungkan order ke jenis layanan
  }));

  await OrderTerjemahan.insertMany(orderList);

  console.log(`✅ Seed selesai: ${layananList.length} jenis layanan, ${orderList.length} order terjemahan berhasil ditambahkan.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Error Seeding:', err.message);
  process.exit(1);
});