const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session && req.session.usuario_id) {
        res.redirect('/tela-inicial'); // Redireciona para a tela inicial
    } else {
        res.redirect('/login'); // Redireciona para a página de login
    }
});

module.exports = router;