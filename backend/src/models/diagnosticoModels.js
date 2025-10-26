const mongoose = require("mongoose");

// Subesquema para los datos del chakra
// Subesquema para los datos del chakra
const ChakraDataSchema = new mongoose.Schema({
  nivel: { type: Number }, // opcional, por si algún diagnóstico manual lo usa
  tipo: {
    type: String,
    enum: ['fuego', 'agua', 'tierra', 'viento', 'rayo', 'yin', 'yang'],
    required: true
  },
  capacidad: { type: String, enum: ['baja', 'normal', 'alta'] },
  fluctuacion: { type: Number },
  metrics: {
    potencia: Number,
    variabilidad: Number,
    temperatura: Number
  },
  estabilidad: { type: Number, default: 1.0 }
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
  }
}, {
  timestamps: true
});


module.exports = mongoose.model("Diagnostic", DiagnosticSchema);
