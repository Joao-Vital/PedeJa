const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const { closePool } = require('./config/database');

const envPath = process.env.DOTENV_FILE || '.env';
dotenv.config({ path: path.resolve(__dirname, envPath) });

const app = express();
const PORT = Number(process.env.PORT || 3333);
const FRONT_DIR = path.resolve(__dirname, '../front');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:3333', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    console.warn(`[CORS] Origem bloqueada: ${origin}`);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);

app.use(express.static(FRONT_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONT_DIR, 'index.html'));
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

async function shutdown(signal) {
  console.info(`\nRecebido ${signal}. Encerrando servidor...`);
  server.close(async () => {
    await closePool().catch((err) => console.error('Erro ao fechar pool SQL:', err));
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
