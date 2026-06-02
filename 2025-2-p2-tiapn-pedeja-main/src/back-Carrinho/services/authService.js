const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../errors/HttpError');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'pedeja-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

function normalizeEmail(email) {
  return email?.trim().toLowerCase();
}

function sanitizeUser(user) {
  const tipoNormalizado = normalizeTipoUsuario(user.TipoUsuario);
  return {
    id: user.UsuarioId,
    email: user.Email,
    tipoUsuario: tipoNormalizado,
    perfilCriado: Boolean(user.PerfilCriado),
    ativo: Boolean(user.Ativo),
    dataCadastro: user.DataCadastro,
    ultimoLogin: user.UltimoLogin,
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.UsuarioId,
      email: user.Email,
      tipo: normalizeTipoUsuario(user.TipoUsuario),
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function validatePassword(password) {
  if (password.length < 6) {
    throw new HttpError(400, 'A senha deve conter ao menos 6 caracteres.');
  }
}

function normalizeTipoUsuario(tipo) {
  const value = tipo?.toString().trim().toLowerCase();
  if (!value) {
    return 'cliente';
  }

  const allowed = ['cliente', 'usuario', 'administrador'];
  if (allowed.includes(value)) {
    return value;
  }

  return 'cliente';
}

async function register({ email, senha, confirmarSenha, tipoUsuario }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !senha || !confirmarSenha) {
    throw new HttpError(400, 'Email, senha e confirmação são obrigatórios.');
  }

  if (senha !== confirmarSenha) {
    throw new HttpError(400, 'As senhas não coincidem.');
  }

  validatePassword(senha);
  const tipoNormalizado = normalizeTipoUsuario(tipoUsuario);

  const existing = await userRepository.findByEmail(normalizedEmail);
  if (existing) {
    throw new HttpError(409, 'Já existe um usuário cadastrado com esse email.');
  }

  const hashedPassword = await bcrypt.hash(senha, 10);
  const createdUser = await userRepository.createUser({
    email: normalizedEmail,
    senhaHash: hashedPassword,
    tipoUsuario: tipoNormalizado,
  });

  const token = generateToken(createdUser);
  return {
    message: 'Usuário criado com sucesso.',
    user: sanitizeUser(createdUser),
    token,
  };
}

async function login({ email, senha }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !senha) {
    throw new HttpError(400, 'Email e senha são obrigatórios.');
  }

  const user = await userRepository.findByEmail(normalizedEmail);
  if (!user || !user.Ativo) {
    throw new HttpError(401, 'Credenciais inválidas.');
  }

  const isPasswordValid = await bcrypt.compare(senha, user.SenhaHash);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Credenciais inválidas.');
  }

  await userRepository.updateLastLogin(user.UsuarioId);
  const token = generateToken(user);
  return {
    message: 'Login efetuado com sucesso.',
    user: sanitizeUser(user),
    token,
  };
}

module.exports = {
  register,
  login,
};
