const { query } = require('../config/database');

async function findByEmail(email) {
  const result = await query(
    `SELECT UsuarioId, Email, SenhaHash, PerfilCriado, Ativo, TipoUsuario, DataCadastro, UltimoLogin
     FROM Usuarios WHERE Email = @Email
     LIMIT 1`,
    [{ name: 'Email', value: email }]
  );
  return result.recordset[0] || null;
}

async function createUser({ email, senhaHash, tipoUsuario = 'cliente' }) {
  const insertResult = await query(
    `INSERT INTO Usuarios (Email, SenhaHash, TipoUsuario, PerfilCriado, Ativo)
     VALUES (@Email, @SenhaHash, @TipoUsuario, 0, 1)`,
    [
      { name: 'Email', value: email },
      { name: 'SenhaHash', value: senhaHash },
      { name: 'TipoUsuario', value: tipoUsuario },
    ]
  );

  if (!insertResult.insertId) {
    throw new Error('Falha ao criar usuário.');
  }

  const user = await query(
    `SELECT UsuarioId, Email, PerfilCriado, Ativo, TipoUsuario, DataCadastro, UltimoLogin
     FROM Usuarios WHERE UsuarioId = @UsuarioId`,
    [{ name: 'UsuarioId', value: insertResult.insertId }]
  );

  return user.recordset[0];
}

async function updateLastLogin(usuarioId) {
  await query(
    'UPDATE Usuarios SET UltimoLogin = CURRENT_TIMESTAMP WHERE UsuarioId = @UsuarioId',
    [{ name: 'UsuarioId', value: usuarioId }]
  );
}

module.exports = {
  findByEmail,
  createUser,
  updateLastLogin,
};
