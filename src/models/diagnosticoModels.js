const mongoose = require("mongoose");

const ChakraDataSchema = new mongoose.Schema({
  tipo: {
    type: String,
    trim: true },
  capacidad: {
    type: String,
    enum: ["Baja", "Normal", "Alta"],
    default: "Normal" },
  fluctuacion: {
    type: String,
    trim: true },
  metrics: {//(telemetría del chakra)
    potencia: {
        type: Number,
        default: null },     // ej. 0-100
    variabilidad: {
        type: Number,
        default: null }, // ej. 0-100
    temperatura: {
        type: Number,
        default: null }   
  }
}, { _id: false });

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
    default: "" },
  confidence: {
    type: Number,
    default: 0 }, // 0..1
  origin: {
    type: String,
    enum: ["auto", "manual"],
    default: "auto" },
  createdAt: {
    type: Date,
    default: Date.now }
}, {
  timestamps: false
});

module.exports = mongoose.model("Diagnostic", DiagnosticSchema);
