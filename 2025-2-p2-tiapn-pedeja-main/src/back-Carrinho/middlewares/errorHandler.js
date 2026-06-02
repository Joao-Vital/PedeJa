const HttpError = require('../errors/HttpError');

function formatError(err) {
  if (err instanceof HttpError) {
    return {
      message: err.message,
      details: err.details || null,
    };
  }

  return {
    message: 'Erro interno no servidor. Tente novamente mais tarde.',
  };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  if (statusCode >= 500) {
    console.error('[API ERROR]', err);
  }
  res.status(statusCode).json(formatError(err));
}

module.exports = errorHandler;
