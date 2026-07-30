const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const conectarDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const barcoRoutes = require("./routes/barcoRoutes");

const app = express();

// Conexion a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/barcos", barcoRoutes);

// Archivos estaticos del frontend
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
