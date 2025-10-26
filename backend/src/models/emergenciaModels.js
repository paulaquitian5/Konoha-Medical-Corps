const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true
  },
  missionId: {
    type: String,
    required: false,
    default: "N/A"
  },
  tipoAlerta: {
    type: String,
    enum: ["chakra", "vitales", "temperatura", "presion", "otros"],
    default: "otros"
  },
  nivel: {
    type: String,
    enum: ["moderado", "alto", "crítico"],
    default: "moderado"
  },
  descripcion: {
    type: String,
    required: true
  },
  atendido: {
    type: Boolean,
    default: false
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Emergency", EmergencySchema);
