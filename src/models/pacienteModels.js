const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  phone: {
    type: String,
    trim: true },
  address: {
    type: String,
    trim: true }
}, { _id: false });

const ChakraSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, "El tipo de chakra es obligatorio"], trim: true },
  capacidad: {
    type: String,
    enum: ["Baja", "Normal", "Alta"],
    default: "Normal" },
  fluctuacion: {
    type: String,
    trim: true }
}, { _id: false });

const PacienteSchema = new mongoose.Schema({
  uniqueId: {
  type: String,
  trim: true},
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    trim: true },
  aldea: {
    type: String, 
    trim: true },
  clan: {
    type: String,
    trim: true },
  rango: {
    type: String,
    trim: true },
  fechaNacimiento: {
    type: Date,
    required: [true, "La fecha de nacimiento es obligatoria"] },
  sexo: {
    type: String,
    enum: ["Masculino", "Femenino", "Otro"],
    default: "Masculino" },
  estado: {
    type: String,
    enum: ["Activo", "Fallecido", "Inactivo"],
    default: "Activo" },
  grupoSanguineo: {
    type: String,
    trim: true },
  contact: ContactSchema,
  chakra: ChakraSchema
}, { timestamps: true }); 

PacienteSchema.methods.getResumenMedico = function() {
  return {
    id: this._id,
    nombreCompleto: `${this.nombre} ${this.apellido}`,
    aldea: this.aldea,
    rango: this.rango,
    estado: this.estado,
    chakra: this.chakra,
    grupoSanguineo: this.grupoSanguineo
  };
};

PacienteSchema.methods.chakraEstable = function() {
  return this.chakra.fluctuacion?.toLowerCase() === "estable";
};

module.exports = mongoose.model("Paciente", PacienteSchema);
