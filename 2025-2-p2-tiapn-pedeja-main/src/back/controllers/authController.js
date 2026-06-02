const bcrypt = require("bcrypt");
const pool = require("../database");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios"
    });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT 
        usuarioid,
        email,
        senhahash,
        tipousuario,
        ativo,
        perfilcriado
      FROM usuarios
      WHERE email = $1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Email ou senha inválidos"
      });
    }

    const usuario = rows[0];

    if (!usuario.ativo) {
      return res.status(403).json({
        message: "Usuário desativado"
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhahash);

    if (!senhaValida) {
      return res.status(401).json({
        message: "Email ou senha inválidos"
      });
    }

    await pool.query(
      "UPDATE usuarios SET ultimologin = NOW() WHERE usuarioid = $1",
      [usuario.usuarioid]
    );

    res.json({
      message: "Login realizado com sucesso",
      usuario: {
        usuarioid: usuario.usuarioid,
        email: usuario.email,
        tipo: usuario.tipousuario,
        perfilCriado: usuario.perfilcriado
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      message: "Erro interno no servidor"
    });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: "Logout realizado com sucesso" });
};
