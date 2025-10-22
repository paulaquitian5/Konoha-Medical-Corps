const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    unique: true,
    trim: true
  },

  nombreCompleto: {
    type: String,
    required: [true, "El nombre completo es obligatorio"],
    trim: true
  },

  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Proporciona un email válido"]
  },

  telefono: {
    type: String,
    trim: true,
    default: ""
  },

  hashedPassword: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: 6,
    select: false
  },

  rol: {
    type: String,
    enum: ["medico", "admin", "rescatista", "ninja"],
    default: "ninja"
  },

  tecnicasDominadas: [
    {
      tecnicaId: { type: mongoose.Schema.Types.ObjectId, ref: "Tecnica" },
      nivel: { type: String, enum: ["básico", "intermedio", "avanzado", "maestro"], default: "básico" }
    }
  ],

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    default: null
  },

  estado: {
    type: String,
    enum: ["activo", "inactivo", "suspendido"],
    default: "activo"
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


// ===============================
// 🔐 Encriptar contraseña
// ===============================
UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("hashedPassword")) return next();
  this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
  next();
});


// ===============================
// 🔍 Comparar contraseñas
// ===============================
UsuarioSchema.methods.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.hashedPassword);
};


// ===============================
// 🔎 Datos públicos (seguridad)
// ===============================
UsuarioSchema.methods.getInfoPublica = function () {
  return {
    id: this._id,
    username: this.username,
    nombreCompleto: this.nombreCompleto,
    email: this.email,
    rol: this.rol,
    hospitalId: this.hospitalId,
    estado: this.estado
  };
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
