const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/perfilController");

router.post("/perfil", perfilController.createPerfil);

module.exports = router;
