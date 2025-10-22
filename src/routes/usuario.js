const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModels');
const jwt = require('jsonwebtoken');
const { verificarToken } = require('./validar_token');

const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta_konoha";

// ===============================
//  Crear un nuevo usuario (registro)
// ===============================
router.post("/", async (req, res) => {
  try {
    const { username, nombreCompleto, email, telefono, hashedPassword, rol, tecnicasDominadas, hospitalId } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ exito: false, mensaje: "El email ya está registrado" });
    }

    const nuevoUsuario = new Usuario({
      username,
      nombreCompleto,
      email,
      telefono,
      hashedPassword,
      rol,
      tecnicasDominadas,
      hospitalId
    });

    await nuevoUsuario.save();

    res.status(201).json({
      exito: true,
      mensaje: "Usuario creado correctamente",
      usuario: nuevoUsuario.getInfoPublica()
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error del servidor al crear usuario",
      error: error.message
    });
  }
});


// ===============================
//  Login (autenticación con JWT)
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario y forzar que traiga la contraseña
    const usuario = await Usuario.findOne({ email }).select("+hashedPassword");

    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const passwordValido = await bcrypt.compare(password, usuario.hashedPassword);
    if (!passwordValido) {
      return res.status(401).json({ exito: false, mensaje: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      SECRET_KEY,
      { expiresIn: "4h" }
    );

    usuario.ultima_conexion = new Date();
    await usuario.save();

    res.json({
      exito: true,
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: usuario.getInfoPublica()
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error en el servidor durante el login",
      error: error.message
    });
  }
});


// ===============================
//  Obtener todos los usuarios
// ===============================
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-hashedPassword");
    res.json({ exito: true, total: usuarios.length, usuarios });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener usuarios",
      error: error.message
    });
  }
});


// ===============================
//  Obtener usuario por ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-hashedPassword");

    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado" });
    }

    res.json({ exito: true, usuario });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener usuario",
      error: error.message
    });
  }
});


// ===============================
//  Actualizar usuario
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const data = { ...req.body };

    // Si intenta cambiar contraseña, la ciframos antes
    if (data.hashedPassword) {
      data.hashedPassword = await bcrypt.hash(data.hashedPassword, 10);
    }

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    }).select("-hashedPassword");

    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado" });
    }

    res.json({ exito: true, mensaje: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al actualizar usuario",
      error: error.message
    });
  }
});


// ===============================
//  Eliminar usuario
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado" });
    }

    res.json({ exito: true, mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al eliminar usuario",
      error: error.message
    });
  }
});


module.exports = router;