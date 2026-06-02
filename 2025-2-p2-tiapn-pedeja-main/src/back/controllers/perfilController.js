const pool = require("../database");

exports.createPerfil = async (req, res) => {
  const {
    usuario_id,
    primeiro_nome,
    sobrenome,
    cpf,
    cep,
    endereco,
    numero,
    complemento,
    telefone,
    instagram,
    facebook
  } = req.body;

  try {
    // Verifica se já existe perfil
    const existePerfil = await pool.query(
      "SELECT 1 FROM PerfisUsuario WHERE UsuarioId = $1",
      [usuario_id]
    );

    if (existePerfil.rows.length > 0) {
      return res.status(400).json({
        message: "Perfil já cadastrado"
      });
    }

    // Cria o perfil
    await pool.query(
      `
      INSERT INTO PerfisUsuario (
        UsuarioId,
        PrimeiroNome,
        Sobrenome,
        CPF,
        CEP,
        Endereco,
        Numero,
        Complemento,
        Telefone,
        Instagram,
        Facebook
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        usuario_id,
        primeiro_nome,
        sobrenome,
        cpf,
        cep,
        endereco,
        numero,
        complemento,
        telefone,
        instagram,
        facebook
      ]
    );

    // Marca que o usuário tem perfil
    await pool.query(
      "UPDATE Usuarios SET PerfilCriado = TRUE WHERE UsuarioId = $1",
      [usuario_id]
    );

    res.status(201).json({
      message: "Perfil criado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    res.status(500).json({
      message: "Erro interno ao criar perfil"
    });
  }
};
