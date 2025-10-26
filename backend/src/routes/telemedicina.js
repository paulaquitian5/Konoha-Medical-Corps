const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Telemedicine = require("../models/telemedicinaModels");
const Paciente = require("../models/pacienteModels");

// Recibimos el objeto io desde index.js para emitir eventos
module.exports = (io) => {

  /**
   * POST /api/telemedicine
   * -> El ninja envía sus datos vitales actuales
   */
  router.post("/", async (req, res) => {
    try {
      const { missionId, ninjaId, vitals, ubicacion } = req.body;

      if (!missionId || !ninjaId || !vitals) {
        return res.status(400).json({
          exito: false,
          mensaje: "Faltan campos requeridos (missionId, ninjaId o vitals)"
        });
      }

      if (!mongoose.Types.ObjectId.isValid(ninjaId)) {
        return res.status(400).json({ exito: false, mensaje: "ID de ninja inválido" });
      }

      const ninja = await Paciente.findById(ninjaId);
      if (!ninja) {
        return res.status(404).json({ exito: false, mensaje: "Ninja no encontrado" });
      }

      const data = new Telemedicine({ missionId, ninjaId, vitals, ubicacion });
      const saved = await data.save();

      // Enviamos el evento en tiempo real a los médicos suscritos a esa misión
      io.to(missionId).emit("telemedicine_update", saved);

      res.status(201).json({
        exito: true,
        mensaje: "Datos vitales enviados y transmitidos en tiempo real",
        data: saved
      });

    } catch (error) {
      console.error("Error POST /api/telemedicine:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error en el servidor al enviar datos vitales",
        error: error.message
      });
    }
  });

  /**
   * GET /api/telemedicine/:missionId
   * -> Consulta todos los registros de telemedicina asociados a una misión
   */
  router.get("/:missionId", async (req, res) => {
    try {
      const { missionId } = req.params;

      const registros = await Telemedicine.find({ missionId })
        .populate("ninjaId", "nombre apellido aldea rango")
        .sort({ timestamp: -1 });

      if (!registros.length) {
        return res.status(404).json({
          exito: false,
          mensaje: "No hay registros de telemedicina para esta misión"
        });
      }

      res.json({
        exito: true,
        total: registros.length,
        data: registros
      });

    } catch (error) {
      console.error("Error GET /api/telemedicine/:missionId:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error en el servidor al obtener registros de telemedicina",
        error: error.message
      });
    }
  });

  return router;
};
