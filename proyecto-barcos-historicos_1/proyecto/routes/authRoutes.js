const express = require("express");
const router = express.Router();
const { registrarUsuario, iniciarSesion, obtenerPerfil } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registro", registrarUsuario);
router.post("/login", iniciarSesion);
router.get("/perfil", authMiddleware, obtenerPerfil);

module.exports = router;
