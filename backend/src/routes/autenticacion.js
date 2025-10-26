const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { verificarToken } = require('./validar_token');

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'konecta-secret-key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/**
 * @route   POST /api/auth/registro
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */



router.post('/registro', async (req, res) => {
  try {
    const { nombre, apellido, email, password, biografia, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !password|| !biografia ) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Todos los campos son obligatorios'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      password,
      biografia,
      rol: rol || 'usuario'
    });

    // Guardar usuario (la encriptación de contraseña se hace en el middleware pre-save del modelo)
    await nuevoUsuario.save();

    // Generar token de autenticación
    const token = jwt.sign(
      { id: nuevoUsuario._id, rol: nuevoUsuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Responder sin incluir la contraseña
    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        foto_perfil: nuevoUsuario.foto_perfil,
        rol: nuevoUsuario.rol
      },
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión y obtener token
 * @access  Público
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obligatorios
    if (!email || !password) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario e incluir el campo password que normalmente está excluido
    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar si la cuenta está activa
    if (usuario.estado !== 'activo') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Cuenta suspendida o inactiva. Contacte al administrador.'
      });
    }

    // Verificar contraseña
    const esPasswordValida = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Actualizar última conexión
    usuario.ultima_conexion = Date.now();
    await usuario.save();

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Responder con información del usuario y token
    res.json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil,
        rol: usuario.rol
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/perfil
 * @desc    Obtener información del usuario autenticado
 * @access  Privado
 */
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    // El middleware verificarToken ya añadió el usuario a req
    const usuario = await Usuario.findById(req.usuario.id)
      .populate('seguidores', 'nombre apellido foto_perfil')
      .populate('siguiendo', 'nombre apellido foto_perfil');

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      exito: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil,
        biografia: usuario.biografia,
        seguidores: usuario.seguidores,
        siguiendo: usuario.siguiendo,
        cantidad_publicaciones: usuario.publicaciones.length,
        fecha_registro: usuario.fecha_registro,
        ultima_conexion: usuario.ultima_conexion,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener información del perfil',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión (cliente invalida token)
 * @access  Privado
 */
router.post('/logout', verificarToken, async (req, res) => {
  try {
    // Actualizar última conexión
    await Usuario.findByIdAndUpdate(req.usuario.id, {
      ultima_conexion: Date.now()
    });

    // En el cliente se debe eliminar el token
    res.json({
      exito: true,
      mensaje: 'Sesión cerrada correctamente'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cerrar sesión',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/verificar
 * @desc    Verificar si el token es válido
 * @access  Público
 */
router.post('/verificar', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No se proporcionó token'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Verificar que el usuario existe y está activo
      const usuario = await Usuario.findById(decoded.id);
      if (!usuario || usuario.estado !== 'activo') {
        return res.status(401).json({
          exito: false,
          mensaje: 'Token inválido o usuario no disponible'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Token válido',
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          foto_perfil: usuario.foto_perfil,
          rol: usuario.rol
        }
      });

    } catch (error) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido o expirado'
      });
    }

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al verificar token',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/auth/cambiar-password
 * @desc    Cambiar contraseña de usuario
 * @access  Privado
 */
router.put('/cambiar-password', verificarToken, async (req, res) => {
  try {
    const { password_actual, nueva_password } = req.body;

    // Validar campos
    if (!password_actual || !nueva_password) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Todos los campos son obligatorios'
      });
    }

    if (nueva_password.length < 6) {
      return res.status(400).json({
        exito: false,
        mensaje: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener usuario con contraseña
    const usuario = await Usuario.findById(req.usuario.id).select('+password');

    // Verificar contraseña actual
    const esPasswordValida = await bcrypt.compare(password_actual, usuario.password);
    if (!esPasswordValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña
    usuario.password = nueva_password;
    await usuario.save();

    res.json({
      exito: true,
      mensaje: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cambiar contraseña',
      error: error.message
    });
  }
});

module.exports = router;