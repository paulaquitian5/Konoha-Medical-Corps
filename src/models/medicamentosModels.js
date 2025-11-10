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
  cantidad: {
    type: Number,
    required: true
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
  medicamentos: {
    type: [MedicamentoSchema],
    required: true
  },
  observaciones: {
    type: String,
    default: "Sin observaciones"
  },
  firmaDigital: {
    hash: String,
    sello: String
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
