const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModels');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_konoha';

/**
 * Middleware para verificar el token JWT
 */
const verificarToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'No se proporcionó token de acceso'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido o expirado'
      });
    }

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Verificar estado del usuario
    if (usuario.estado !== 'activo') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Cuenta suspendida o inactiva'
      });
    }

    // Agregar usuario al objeto req
    req.usuario = {
      id: usuario._id,
      username: usuario.username,
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      rol: usuario.rol,
      hospitalId: usuario.hospitalId
    };

    next();
  } catch (error) {
    console.error('Error en verificación de token:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno al validar token',
      error: error.message
    });
  }
};

/**
 * Middleware para verificar permisos de administrador
 */
const esAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      exito: false,
      mensaje: 'Se requiere autenticación previa'
    });
  }

  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      exito: false,
      mensaje: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }

  next();
};

/**
 * Middleware para verificar permisos de médico o superior
 */
const esMedico = (req, res, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      exito: false,
      mensaje: 'Se requiere autenticación previa'
    });
  }

  if (!['admin', 'medico'].includes(req.usuario.rol)) {
    return res.status(403).json({
      exito: false,
      mensaje: 'Acceso denegado. Se requieren permisos de médico o administrador'
    });
  }

  next();
};

/**
 * Middleware para verificar si el usuario es propietario del recurso
 */
const esPropietario = (getIdCallback) => {
  return async (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(500).json({
          exito: false,
          mensaje: 'Se requiere autenticación previa'
        });
      }

      // Si es admin o médico, permitir acceso
      if (['admin', 'medico'].includes(req.usuario.rol)) {
        return next();
      }

      // Obtener el ID del propietario del recurso
      const propietarioId = await getIdCallback(req);

      if (propietarioId && propietarioId.toString() === req.usuario.id.toString()) {
        return next();
      }

      return res.status(403).json({
        exito: false,
        mensaje: 'Acceso denegado. No eres propietario de este recurso'
      });
    } catch (error) {
      console.error('Error al verificar propiedad del recurso:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al verificar propiedad del recurso',
        error: error.message
      });
    }
  };
};

module.exports = { verificarToken, esAdmin, esMedico, esPropietario };
