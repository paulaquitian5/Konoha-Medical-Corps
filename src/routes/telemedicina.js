const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Telemedicine = require("../models/telemedicinaModels");
const Paciente = require("../models/pacienteModels");

module.exports = (io) => {
  /**
   * POST /api/telemedicine
   * -> El paciente (ninja) envía sus signos vitales simulados
   */
  router.post("/", async (req, res) => {
    try {
      const { missionId, ninjaId, vitals, ubicacion } = req.body;

      // Validación de campos requeridos
      if (!missionId || !ninjaId || !vitals) {
        return res.status(400).json({
          exito: false,
          mensaje: "Faltan campos requeridos (missionId, ninjaId o vitals)"
        });
      }

      // Validar ID del paciente
      if (!mongoose.Types.ObjectId.isValid(ninjaId)) {
        return res.status(400).json({ exito: false, mensaje: "ID de ninja inválido" });
      }

      const ninja = await Paciente.findById(ninjaId);
      if (!ninja) {
        return res.status(404).json({ exito: false, mensaje: "Ninja no encontrado" });
      }

      // Extraer y validar datos vitales
      const { pulso, presion, nivel_chakra, oxigenacion, temperatura, estado_general } = vitals;

      if (typeof pulso !== "number" || pulso <= 0) {
        return res.status(400).json({ exito: false, mensaje: "El pulso debe ser un número positivo" });
      }

      if (nivel_chakra < 0 || nivel_chakra > 100) {
        return res.status(400).json({ exito: false, mensaje: "El nivel de chakra debe estar entre 0 y 100" });
      }

      if (oxigenacion < 0 || oxigenacion > 100) {
        return res.status(400).json({ exito: false, mensaje: "La oxigenación debe estar entre 0 y 100" });
      }

      if (!["Estable", "Fatigado", "Crítico"].includes(estado_general)) {
        return res.status(400).json({
          exito: false,
          mensaje: "El estado_general debe ser uno de ['Estable', 'Fatigado', 'Crítico']"
        });
      }

      // Crear y guardar el registro
      const data = new Telemedicine({
        missionId,
        ninjaId,
        vitals: { pulso, presion, nivel_chakra, oxigenacion, temperatura, estado_general },
        ubicacion,
        timestamp: new Date()
      });

      const saved = await data.save();

      // Emitir evento en tiempo real
      io.to(missionId).emit("telemedicine_update", saved);

      res.status(201).json({
        exito: true,
        mensaje: "Datos vitales recibidos, validados y almacenados correctamente",
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
   * -> Obtiene todos los registros asociados a una misión
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
