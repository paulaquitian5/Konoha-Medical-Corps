const mongoose = require("mongoose");

const MedicamentoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del medicamento es obligatorio"],
    trim: true
  },
  dosis: {
    type: String,
    required: [true, "La dosis es obligatoria"],
    trim: true
  },
  frecuencia: {
    type: String,
    required: [true, "La frecuencia es obligatoria"],
    trim: true
  },
  duracion: {
    type: String,
    default: "Indefinido"
  }
}, { _id: false });

const RecetaSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  medicamentos: [MedicamentoSchema],
  observaciones: {
    type: String,
    default: ""
  },
  firmaDigital: {
    type: String, // firma simulada en esta versión
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  pedidoAutomatico: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Receta", RecetaSchema);
