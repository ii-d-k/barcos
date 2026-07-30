const BarcoHistorico = require("../models/BarcoHistorico");

// GET /api/barcos
const obtenerBarcos = async (req, res) => {
  try {
    const barcos = await BarcoHistorico.find({ usuario: req.usuario.id }).sort({ fechaRegistro: -1 });
    res.json(barcos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los barcos.", error: error.message });
  }
};

// GET /api/barcos/:id
const obtenerBarcoPorId = async (req, res) => {
  try {
    const barco = await BarcoHistorico.findOne({ _id: req.params.id, usuario: req.usuario.id });
    if (!barco) {
      return res.status(404).json({ mensaje: "Barco no encontrado." });
    }
    res.json(barco);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el barco.", error: error.message });
  }
};

// POST /api/barcos
const crearBarco = async (req, res) => {
  try {
    const nuevoBarco = new BarcoHistorico({
      ...req.body,
      usuario: req.usuario.id
    });

    const barcoGuardado = await nuevoBarco.save();
    res.status(201).json(barcoGuardado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el barco.", error: error.message });
  }
};

// PUT /api/barcos/:id
const actualizarBarco = async (req, res) => {
  try {
    const barcoActualizado = await BarcoHistorico.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!barcoActualizado) {
      return res.status(404).json({ mensaje: "Barco no encontrado." });
    }

    res.json(barcoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el barco.", error: error.message });
  }
};

// DELETE /api/barcos/:id
const eliminarBarco = async (req, res) => {
  try {
    const barcoEliminado = await BarcoHistorico.findOneAndDelete({ _id: req.params.id, usuario: req.usuario.id });

    if (!barcoEliminado) {
      return res.status(404).json({ mensaje: "Barco no encontrado." });
    }

    res.json({ mensaje: "Barco eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el barco.", error: error.message });
  }
};

module.exports = {
  obtenerBarcos,
  obtenerBarcoPorId,
  crearBarco,
  actualizarBarco,
  eliminarBarco
};
