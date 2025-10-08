const mongoose = require("mongoose");

// Subesquema para los datos del chakra
const ChakraDataSchema = new mongoose.Schema({
  nivel: { type: Number, required: true },
  tipo: { type: String, enum: ['fuego', 'agua', 'tierra', 'viento', 'rayo', 'yin', 'yang'], required: true },
  estabilidad: { type: Number, default: 1.0 } // 1.0 = estable
}, { _id: false });

// Esquema principal de diagnóstico
const DiagnosticSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: [true, "El patientId es obligatorio"]
  },
  chakra: ChakraDataSchema,
  result: { 
    type: String, 
    enum: ["normal", "posible_bloqueo", "riesgo_critico", "indeterminado"], 
    default: "indeterminado" 
  },
  explanation: {
    type: String,
    default: ""
  },
  confidence: {
    type: Number,
    default: 0
  },
  origin: {
    type: String,
    enum: ["auto", "manual"],
    default: "auto"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});


module.exports = mongoose.model("Diagnostic", DiagnosticSchema);
