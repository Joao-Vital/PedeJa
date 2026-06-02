const { query } = require('../config/database');

async function createProfile(data) {
  const result = await query(
    `INSERT INTO perfisusuario (UsuarioId, Nome, Sobrenome, CPF, CEP, Endereco, Numero, Complemento, Telefone, Instagram, Facebook)
     VALUES (@UsuarioId, @Nome, @Sobrenome, @CPF, @CEP, @Endereco, @Numero, @Complemento, @Telefone, @Instagram, @Facebook)`,
    [
      { name: 'UsuarioId', value: data.usuarioId },
      { name: 'Nome', value: data.nome },
      { name: 'Sobrenome', value: data.sobrenome },
      { name: 'CPF', value: data.cpf },
      { name: 'CEP', value: data.cep },
      { name: 'Endereco', value: data.endereco },
      { name: 'Numero', value: data.numero },
      { name: 'Complemento', value: data.complemento || null },
      { name: 'Telefone', value: data.telefone || null },
      { name: 'Instagram', value: data.instagram || null },
      { name: 'Facebook', value: data.facebook || null },
    ]
  );

  // Atualizar flag PerfilCriado na tabela Usuarios
  await query(
    'UPDATE Usuarios SET PerfilCriado = 1 WHERE UsuarioId = @UsuarioId',
    [{ name: 'UsuarioId', value: data.usuarioId }]
  );

  return result.insertId;
}

async function findByUserId(usuarioId) {
  const result = await query(
    'SELECT * FROM perfisusuario WHERE UsuarioId = @UsuarioId LIMIT 1',
    [{ name: 'UsuarioId', value: usuarioId }]
  );
  return result.recordset[0] || null;
}

async function updateProfile(usuarioId, data) {
  await query(
    `UPDATE perfisusuario 
     SET Nome = @Nome, Sobrenome = @Sobrenome, CPF = @CPF, CEP = @CEP, 
         Endereco = @Endereco, Numero = @Numero, Complemento = @Complemento,
         Telefone = @Telefone, Instagram = @Instagram, Facebook = @Facebook
     WHERE UsuarioId = @UsuarioId`,
    [
      { name: 'UsuarioId', value: usuarioId },
      { name: 'Nome', value: data.nome },
      { name: 'Sobrenome', value: data.sobrenome },
      { name: 'CPF', value: data.cpf },
      { name: 'CEP', value: data.cep },
      { name: 'Endereco', value: data.endereco },
      { name: 'Numero', value: data.numero },
      { name: 'Complemento', value: data.complemento || null },
      { name: 'Telefone', value: data.telefone || null },
      { name: 'Instagram', value: data.instagram || null },
      { name: 'Facebook', value: data.facebook || null },
    ]
  );
}

module.exports = {
  createProfile,
  findByUserId,
  updateProfile,
};