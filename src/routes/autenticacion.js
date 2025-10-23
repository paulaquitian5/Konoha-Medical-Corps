const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModels');
const { verificarToken } = require('./validar_token');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_konoha';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// ====================================
//  REGISTRO - Público
// ====================================
router.post('/registro', async (req, res) => {
  try {
    const { username, nombreCompleto, email, hashedPassword, rol, telefono } = req.body;

    if (!username || !nombreCompleto || !email || !hashedPassword) {
      return res.status(400).json({ exito: false, mensaje: 'Todos los campos obligatorios deben ser completados' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ exito: false, mensaje: 'El email ya está registrado' });
    }

    const nuevoUsuario = new Usuario({
      username,
      nombreCompleto,
      email,
      hashedPassword, // se encripta en el pre-save del modelo
      telefono: telefono || '',
      rol: rol || 'ninja'
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, rol: nuevoUsuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado correctamente',
      usuario: nuevoUsuario.getInfoPublica(),
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// ====================================
//  LOGIN - Público
// ====================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+hashedPassword');
    if (!usuario) return res.status(401).json({ exito: false, mensaje: 'Credenciales inválidas' });

    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida) return res.status(401).json({ exito: false, mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    usuario.ultima_conexion = Date.now();
    await usuario.save();

    res.json({ exito: true, mensaje: 'Inicio de sesión exitoso', usuario: usuario.getInfoPublica(), token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

// ====================================
//  PERFIL DEL USUARIO - Privado
// ====================================
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    res.json({ exito: true, usuario: usuario.getInfoPublica() });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener perfil', error: error.message });
  }
});

// ====================================
//  CAMBIAR PASSWORD - Privado
// ====================================
router.put('/cambiar-password', verificarToken, async (req, res) => {
  try {
    const { password_actual, nueva_password } = req.body;

    const usuario = await Usuario.findById(req.usuario.id).select('+hashedPassword');
    const passwordValida = await usuario.compararPassword(password_actual);

    if (!passwordValida) return res.status(401).json({ exito: false, mensaje: 'La contraseña actual es incorrecta' });

    usuario.hashedPassword = nueva_password;
    await usuario.save();

    res.json({ exito: true, mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al cambiar contraseña', error: error.message });
  }
});

// ====================================
//  VERIFICAR TOKEN - Público
// ====================================
router.post('/verificar', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ exito: false, mensaje: 'Token inválido' });

    res.json({ exito: true, mensaje: 'Token válido', usuario: usuario.getInfoPublica() });
  } catch (error) {
    res.status(401).json({ exito: false, mensaje: 'Token inválido o expirado', error: error.message });
  }
});

// ====================================
//  LOGOUT - Privado
// ====================================
router.post('/logout', verificarToken, async (req, res) => {
  try {
    await Usuario.findByIdAndUpdate(req.usuario.id, { ultima_conexion: Date.now() });
    res.json({ exito: true, mensaje: 'Sesión cerrada correctamente' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al cerrar sesión', error: error.message });
  }
});

module.exports = router;
