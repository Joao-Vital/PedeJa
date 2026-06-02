const express = require("express");
const router = express.Router();
const cadastroController = require("../controllers/cadastroController");

router.post("/cadastro", cadastroController.cadastrar);

module.exports = router;
