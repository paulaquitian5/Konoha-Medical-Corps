const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModels');
const { verificarToken } = require('./validar_token');

// ====================================
//  OBTENER TODOS LOS USUARIOS - SOLO ADMIN
// ====================================
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-hashedPassword');
    res.json({ exito: true, total: usuarios.length, usuarios });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener usuarios', error: error.message });
  }
});

// ====================================
//  OBTENER USUARIO POR ID
// ====================================
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-hashedPassword');
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    res.json({ exito: true, usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener usuario', error: error.message });
  }
});

// ====================================
//  ACTUALIZAR USUARIO
// ====================================
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.hashedPassword) data.hashedPassword = await bcrypt.hash(data.hashedPassword, 10);

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    }).select('-hashedPassword');

    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

    res.json({ exito: true, mensaje: 'Usuario actualizado correctamente', usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al actualizar usuario', error: error.message });
  }
});

// ====================================
//  ELIMINAR USUARIO
// ====================================
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    res.json({ exito: true, mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;
