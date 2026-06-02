const jwt = require('jsonwebtoken');
const HttpError = require('../errors/HttpError');

const JWT_SECRET = process.env.JWT_SECRET || 'pedeja-dev-secret';

function extractToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  return authHeader.trim();
}

module.exports = function authMiddleware(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new HttpError(401, 'Token de autenticação ausente.');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }

    return next(new HttpError(401, 'Token inválido ou expirado.'));
  }
};
