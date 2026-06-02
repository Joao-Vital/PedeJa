const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

const envFile = process.env.DOTENV_FILE || '.env';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

const dbConfig = {
  host: process.env.DB_HOST || process.env.DB_SERVER,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'postgres',
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false
  }
};

function validateConfig() {
  const required = ['DB_USER']; // Removido DB_PASSWORD dos obrigatórios
  if (!process.env.DB_HOST && !process.env.DB_SERVER) {
    required.push('DB_HOST');
  }

  const absent = required.filter((key) => !process.env[key]);
  if (absent.length) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${absent.join(', ')}`);
  }
}

let pool;

async function getPool() {
  if (!pool) {
    validateConfig();
    pool = new Pool(dbConfig);
    console.info('[PostgreSQL] Pool criado com sucesso.');
  }

  return pool;
}

async function getConnection() {
  const activePool = await getPool();
  return activePool.getConnection();
}

function buildNamedParameters(queryText, params) {
  if (!params || !params.length) {
    return { text: queryText, values: {} };
  }

  const values = {};
  params.forEach(({ name, value }) => {
    if (!name) {
      throw new Error('Cada parâmetro precisa de um atributo "name".');
    }
    const normalized = name.replace(/^@/, '');
    values[normalized] = value;
  });

  const text = queryText.replace(/@([A-Za-z0-9_]+)/g, ':$1');
  return { text, values };
}

async function query(queryText, params = []) {
  const activePool = await getPool();
  const { text, values } = buildNamedParameters(queryText, params);
  const [rows] = await activePool.execute(text, Object.keys(values).length ? values : undefined);

  return {
    recordset: Array.isArray(rows) ? rows : [],
    rowsAffected: Array.isArray(rows) ? rows.length : rows?.affectedRows || 0,
    insertId: rows?.insertId ?? null,
    raw: rows,
  };
}

async function closePool() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = null;
  console.info('[MySQL] Pool encerrado.');
}

module.exports = {
  getPool,
  getConnection,
  query,
  closePool,
};