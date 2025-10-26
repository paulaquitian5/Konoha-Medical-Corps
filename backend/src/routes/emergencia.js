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
   * GET /api/emergencias
   * -> Devuelve la lista completa de emergencias registradas
   */
  router.get("/", async (req, res) => {
    try {
      const emergencias = await Emergency.find()
        .populate("patientId", "nombre apellido aldea rango")
        .sort({ creadoEn: -1 });

      res.json({
        exito: true,
        total: emergencias.length,
        data: emergencias
      });
    } catch (error) {
      console.error("Error GET /api/emergencias:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al obtener emergencias",
        error: error.message
      });
    }
  });

  /**
   * GET /api/emergencias/paciente/:id
   * -> Muestra todas las emergencias relacionadas con un paciente específico
   */
  router.get("/paciente/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ exito: false, mensaje: "ID de paciente inválido" });
      }

      const emergencias = await Emergency.find({ patientId: id })
        .sort({ creadoEn: -1 });

      if (emergencias.length === 0) {
        return res.status(404).json({
          exito: false,
          mensaje: "No se encontraron emergencias para este paciente"
        });
      }

      res.json({
        exito: true,
        total: emergencias.length,
        data: emergencias
      });
    } catch (error) {
      console.error("Error GET /api/emergencias/paciente/:id:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al obtener emergencias por paciente",
        error: error.message
      });
    }
  });

  /**
   * GET /api/emergencias/criticas
   * -> Devuelve únicamente las emergencias con nivel “crítico”
   */
  router.get("/criticas", async (req, res) => {
    try {
      const criticas = await Emergency.find({ nivel: "crítico" })
        .populate("patientId", "nombre apellido aldea rango")
        .sort({ creadoEn: -1 });

      res.json({
        exito: true,
        total: criticas.length,
        data: criticas
      });
    } catch (error) {
      console.error("Error GET /api/emergencias/criticas:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al obtener emergencias críticas",
        error: error.message
      });
    }
  });

  /**
   * PUT /api/emergencias/:id
   * -> Actualizar descripción o estado de atención
   */
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { descripcion, atendido } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ exito: false, mensaje: "ID inválido" });
      }

      const actualizada = await Emergency.findByIdAndUpdate(
        id,
        { descripcion, atendido },
        { new: true }
      );

      if (!actualizada) {
        return res.status(404).json({ exito: false, mensaje: "Emergencia no encontrada" });
      }

      res.json({
        exito: true,
        mensaje: "Emergencia actualizada correctamente",
        data: actualizada
      });
    } catch (error) {
      console.error("Error PUT /api/emergencias/:id:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al actualizar emergencia",
        error: error.message
      });
    }
  });

  /**
   * DELETE /api/emergencias/:id
   * -> Elimina una emergencia (uso administrativo o de pruebas)
   */
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ exito: false, mensaje: "ID inválido" });
      }

      const eliminada = await Emergency.findByIdAndDelete(id);

      if (!eliminada) {
        return res.status(404).json({ exito: false, mensaje: "Emergencia no encontrada" });
      }

      res.json({
        exito: true,
        mensaje: "Emergencia eliminada correctamente",
        data: eliminada
      });
    } catch (error) {
      console.error("Error DELETE /api/emergencias/:id:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al eliminar emergencia",
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
