const mongoose = require("mongoose");

const VitalSignsSchema = new mongoose.Schema({
  pulso: {
    type: Number,
    required: true
  },             // latidos por minuto
  presion: {
    type: String,
    default: "Normal"
  },        // ej: "120/80"
  nivel_chakra: {
    type: Number,
    min: 0,
    max: 100
  },    // porcentaje del chakra actual
  oxigenacion: {
    type: Number,
    min: 0,
    max: 100
  },     // % SpO2
  temperatura: {
    type: Number
  },     // grados Celsius
  estado_general: {
    type: String,
    enum: ["Estable", "Fatigado", "Crítico"],
    default: "Estable"
  }
}, { _id: false });

const TelemedicineSchema = new mongoose.Schema({
  missionId: {
    type: String,
    required: [true, "El missionId es obligatorio"],
    trim: true
  },
  ninjaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true,
    validate: {
      validator: function (v) {
        return v !== null;
      },
      message: "El ninjaId no puede ser null"
    }
  },
  vitals: VitalSignsSchema,
  ubicacion: {
    lat: { type: Number },
    lon: { type: Number }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Telemedicine", TelemedicineSchema);
