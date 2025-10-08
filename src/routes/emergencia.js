const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Emergency = require("../models/emergenciaModels");
const Paciente = require("../models/pacienteModels");

module.exports = (io) => {
  /**
   * POST /api/emergencia/alert
   * -> Crear una alerta de emergencia (manual o automática)
   */
  router.post("/alert", async (req, res) => {
    try {
      const { patientId, missionId, tipoAlerta, nivel, descripcion } = req.body;

      if (!patientId || !descripcion) {
        return res.status(400).json({
          exito: false,
          mensaje: "Faltan campos requeridos (patientId o descripcion)"
        });
      }

      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ exito: false, mensaje: "ID de paciente inválido" });
      }

      const paciente = await Paciente.findById(patientId);
      if (!paciente) {
        return res.status(404).json({ exito: false, mensaje: "Paciente no encontrado" });
      }

      const alerta = new Emergency({
        patientId,
        missionId,
        tipoAlerta,
        nivel: nivel || "critico",
        descripcion
      });

      const saved = await alerta.save();

      // Emitimos la alerta a todos los médicos conectados
      io.emit("emergencia_alert", {
        alertaId: saved._id,
        patientId: saved.patientId,
        missionId: saved.missionId,
        tipoAlerta: saved.tipoAlerta,
        nivel: saved.nivel,
        descripcion: saved.descripcion,
        creadoEn: saved.creadoEn
      });

      res.status(201).json({
        exito: true,
        mensaje: "🚨 Alerta de emergencia generada",
        data: saved
      });

    } catch (error) {
      console.error("Error POST /api/emergencia/alert:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error del servidor al crear alerta",
        error: error.message
      });
    }
  });

  /**
   * GET /api/emergencia/status
   * -> Consultar todos los pacientes críticos (nivel = 'critico' y no atendido)
   */
  router.get("/status", async (req, res) => {
    try {
      const criticos = await Emergency.find({ nivel: "critico", atendido: false })
        .populate("patientId", "nombre apellido aldea rango estado")
        .sort({ creadoEn: -1 });

      if (!criticos.length) {
        return res.status(200).json({
          exito: true,
          mensaje: "No hay pacientes en estado crítico actualmente",
          total: 0,
          data: []
        });
      }

      res.json({
        exito: true,
        total: criticos.length,
        data: criticos
      });

    } catch (error) {
      console.error("Error GET /api/emergencia/status:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al obtener estado de emergencias",
        error: error.message
      });
    }
  });

  /**
   * PUT /api/emergencia
   * /:id/atender
   * -> Marcar una alerta como atendida
   */
  router.put("/:id/atender", async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ exito: false, mensaje: "ID de alerta inválido" });
      }

      const alerta = await Emergency.findByIdAndUpdate(
        id,
        { atendido: true },
        { new: true }
      );

      if (!alerta) {
        return res.status(404).json({ exito: false, mensaje: "Alerta no encontrada" });
      }

      // Notificar en tiempo real que fue atendida
      io.emit("emergencia_resolved", { alertaId: alerta._id });

      res.json({
        exito: true,
        mensaje: "✅ Alerta marcada como atendida",
        data: alerta
      });

    } catch (error) {
      console.error("Error PUT /api/emergencia/:id/atender:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al actualizar estado de alerta",
        error: error.message
      });
    }
  });

  return router;
};
