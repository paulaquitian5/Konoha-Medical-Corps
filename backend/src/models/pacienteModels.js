const mongoose = require("mongoose");
const { Namespace } = require("socket.io");



const ChakraSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, "El tipo de chakra es obligatorio"], trim: true
  },
  capacidad: {
    type: String,
    enum: ["Baja", "Normal", "Alta"],
    default: "Normal"
  },
  estabilidad: {
    type: Number,
    default: 1.0
  }
}, { _id: false });

const PacienteSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    trim: true
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    trim: true
  },
  aldea: {
    type: String,
    trim: true
  },
  clan: {
    type: String,
    trim: true
  },
  rango: {
    type: String,
    trim: true
  },
  fechaNacimiento: {
    type: Date,
    required: [true, "La fecha de nacimiento es obligatoria"]
  },
  sexo: {
    type: String,
    enum: ["Masculino", "Femenino", "No especificado"],
    default: "Masculino"
  },
  estado: {
    type: String,
    enum: ["Activo", "Fallecido", "Inactivo"],
    default: "Activo"
  },
  grupoSanguineo: {
    type: String,
    trim: true
  },
  chakra: ChakraSchema,
  phone: { type: String, trim: true },  // ahora directamente en el paciente
  email: { type: String, trim: true }, 
  currentCondition: {
    type: String,
    enum: ["stable", "critical", "urgent"],
    default: "stable",
  },
  emergencyContactName: { type: String, trim: true },
  emergencyContactPhone: { type: String, trim: true },
  medicalHistory: { type: String, trim: true },
}, { timestamps: true });

PacienteSchema.methods.getResumenMedico = function () {
  // Calcular edad
  const hoy = new Date();
  const nacimiento = new Date(this.fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return {
    id: this._id,
    name: `${this.nombre} ${this.apellido}`,
    age: edad,
    clan: this.clan,
    aldea: this.aldea,
    rango: this.rango,
    estado: this.estado,
    chakraType: this.chakra?.tipo,
    grupoSanguineo: this.grupoSanguineo,
    currentCondition: this.currentCondition,
    phone: this.phone || "No registrado",
    email: this.email || "No registrado", // podrías agregar este campo en el schema si quieres almacenarlo
    emergencyContactName: this.emergencyContactName || "No registrado",
    emergencyContactPhone: this.emergencyContactPhone || "No registrado",
    medicalHistory: this.medicalHistory || "Sin historial",
    createdAt: this.createdAt
  };
};

PacienteSchema.methods.chakraEstable = function () {
  return this.chakra?.estabilidad >= 1.0;
};

module.exports = mongoose.model("Paciente", PacienteSchema);
