const bcrypt = require("bcrypt");
const pool = require("../database");

function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

exports.cadastrar = async (req, res) => {
  const { email, senha, confirmarSenha } = req.body;

  if (!email || !senha || !confirmarSenha) {
    return res.status(400).json({
      message: "Preencha todos os campos"
    });
  }

  if (!emailValido(email)) {
    return res.status(400).json({
      message: "Email inválido"
    });
  }

  if (senha !== confirmarSenha) {
    return res.status(400).json({
      message: "As senhas não conferem"
    });
  }

  try {
    const { rows } = await pool.query(
      'SELECT 1 FROM "usuarios" WHERE "email" = $1',
      [email]
    );

    if (rows.length > 0) {
      return res.status(409).json({
        message: "Email já cadastrado"
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO "usuarios" ("email", "senhahash", "tipousuario") VALUES ($1, $2, $3)',
      [email, senhaHash, 'cliente']
    );

    return res.status(201).json({
      message: "Cadastro realizado com sucesso"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro interno no servidor"
    });
  }
};
