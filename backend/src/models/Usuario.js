const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Proporciona un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6,
    select: false
  },
  foto_perfil: {
    type: String,
    default: 'default-avatar.jpg'
  },
  biografia: {
    type: String,
    default: '',
    required: [true, 'La biografía es obligatoria'],
  },
  seguidores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  siguiendo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  publicaciones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publicacion'
  }],
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  rol: {
    type: String,
    enum: ['usuario', 'moderador', 'administrador'],
    default: 'usuario'
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  ultima_conexion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Método para comparar contraseñas
UsuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para obtener información pública del usuario
UsuarioSchema.methods.getInfoPublica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    foto_perfil: this.foto_perfil,
    biografia: this.biografia,
    seguidores: this.seguidores.length,
    siguiendo: this.siguiendo.length,
    publicaciones: this.publicaciones.length
  };
};

module.exports = mongoose.model('Usuario', UsuarioSchema);