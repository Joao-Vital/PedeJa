const express = require('express');
const router = express.Router();

router.get('/tela-inicial', (req, res) => {
    if (!req.session.usuario_id) {
        res.redirect('/login');
    } else {
        res.render('telaInicial', { usuario_nome: req.session.usuario_nome });
    }
});

module.exports = router;