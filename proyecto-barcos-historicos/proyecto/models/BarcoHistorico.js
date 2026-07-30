const mongoose = require("mongoose");

const barcoHistoricoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  pais: {
    type: String,
    required: true,
    trim: true
  },
  añoConstruccion: {
    type: Number,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    trim: true
  },
  funcionPrincipal: {
    type: String,
    required: true,
    trim: true
  },
  longitudMetros: {
    type: Number
  },
  tripulacion: {
    type: Number
  },
  hechoHistorico: {
    type: String,
    trim: true
  },
  estadoActual: {
    type: String,
    trim: true
  },
  imagenUrl: {
    type: String,
    trim: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BarcoHistorico", barcoHistoricoSchema);
