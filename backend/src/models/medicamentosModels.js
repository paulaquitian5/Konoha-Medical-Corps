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
  },
  // 🚨 CAMPOS AÑADIDOS PARA LA VALIDACIÓN DEL FARMACÉUTICO 🚨
  status: {
    type: String,
    enum: ['pending', 'valid', 'invalid'], // Solo acepta estos 3 estados
    default: 'pending' // Una receta nueva siempre está pendiente de validar
  },
  observacionesFarmaceutico: {
    type: String,
    default: null
  }

});
module.exports = mongoose.model("Receta", RecetaSchema);
