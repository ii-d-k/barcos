const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

// POST /api/auth/registro
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, clave } = req.body;

    if (!nombre || !correo || !clave) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Ya existe un usuario registrado con ese correo." });
    }

    const salt = await bcrypt.genSalt(10);
    const claveCifrada = await bcrypt.hash(clave, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      clave: claveCifrada
    });

    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el usuario.", error: error.message });
  }
};

// POST /api/auth/login
const iniciarSesion = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    if (!correo || !clave) {
      return res.status(400).json({ mensaje: "Correo y clave son obligatorios." });
    }

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Credenciales invalidas." });
    }

    const claveValida = await bcrypt.compare(clave, usuario.clave);
    if (!claveValida) {
      return res.status(400).json({ mensaje: "Credenciales invalidas." });
    }

    const token = generarToken(usuario);

    res.json({
      mensaje: "Inicio de sesion exitoso.",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesion.", error: error.message });
  }
};

// GET /api/auth/perfil
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-clave");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el perfil.", error: error.message });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil
};
