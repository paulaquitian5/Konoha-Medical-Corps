const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModels');

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'konecta-secret-key';

/**
 * Middleware para verificar token de autenticación
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar
 */
const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'No se proporcionó token de acceso'
      });
    }
    
    try {
      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Verificar que el usuario existe y está activo
      const usuario = await Usuario.findById(decoded.id);
      if (!usuario) {
        return res.status(401).json({
          exito: false,
          mensaje: 'Usuario no encontrado'
        });
      }
      
      if (usuario.estado !== 'activo') {
        return res.status(401).json({
          exito: false,
          mensaje: 'Cuenta suspendida o inactiva'
        });
      }
      
      // Añadir información del usuario al objeto de solicitud
      req.usuario = {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      };
      
      next();
    } catch (error) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido o expirado'
      });
    }
  } catch (error) {
    console.error('Error en validación de token:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al validar token',
      error: error.message
    });
  }
};

/**
 * Middleware para verificar permisos de administrador
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar
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
 * Middleware para verificar permisos de moderador o superior
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar
 */
const esModerador = (req, res, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      exito: false,
      mensaje: 'Se requiere autenticación previa'
    });
  }
  
  if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'moderador') {
    return res.status(403).json({
      exito: false,
      mensaje: 'Acceso denegado. Se requieren permisos de moderador'
    });
  }
  
  next();
};

/**
 * Middleware para verificar si el usuario es propietario del recurso
 * @param {Function} getIdCallback - Función para obtener el ID del propietario del recurso
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
      
      // Si es admin o moderador, permitir acceso
      if (req.usuario.rol === 'admin' || req.usuario.rol === 'moderador') {
        return next();
      }
      
      // Obtener ID del propietario
      const propietarioId = await getIdCallback(req);
      
      // Verificar si el usuario es propietario
      if (propietarioId && propietarioId.toString() === req.usuario.id.toString()) {
        return next();
      }
      
      // No es propietario
      return res.status(403).json({
        exito: false,
        mensaje: 'Acceso denegado. No eres propietario de este recurso'
      });
    } catch (error) {
      console.error('Error en verificación de propietario:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al verificar propiedad del recurso',
        error: error.message
      });
    }
  };
};

module.exports = { verificarToken, esAdmin,esModerador, esPropietario};