const mongoose = require('mongoose');
const MedicoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del médico es obligatorio"],
    trim: true
  },
  codigo: {
    type: String,
    required: [true, "El código del médico es obligatorio"], // simula la firma digital
    trim: true,
    unique: true
  },
  sello: {
    type: String,
    required: [true, "El sello del médico es obligatorio"], // simula el sello profesional
    trim: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Medico", MedicoSchema);