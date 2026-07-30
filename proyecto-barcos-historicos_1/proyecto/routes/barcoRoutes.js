const express = require("express");
const router = express.Router();
const {
  obtenerBarcos,
  obtenerBarcoPorId,
  crearBarco,
  actualizarBarco,
  eliminarBarco
} = require("../controllers/barcoController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", obtenerBarcos);
router.get("/:id", obtenerBarcoPorId);
router.post("/", crearBarco);
router.put("/:id", actualizarBarco);
router.delete("/:id", eliminarBarco);

module.exports = router;
