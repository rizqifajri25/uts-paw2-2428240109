const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.DB_URI || process.env.MONGODB_URI;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
}));
app.use(express.json());

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