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
  function generarSignosPorEstado(estado) {
    switch (estado) {
      case "crítico":
        return {
          pulso: Math.floor(Math.random() * (160 - 130) + 130),
          presion: "80/50",
          nivel_chakra: Math.floor(Math.random() * 20),
          oxigenacion: Math.floor(Math.random() * (85 - 70) + 70),
          temperatura: (Math.random() * (39 - 38) + 38).toFixed(1),
          estado_general: "Crítico"
        };
      case "urgente":
        return {
          pulso: Math.floor(Math.random() * (120 - 100) + 100),
          presion: "100/70",
          nivel_chakra: Math.floor(Math.random() * (60 - 30) + 30),
          oxigenacion: Math.floor(Math.random() * (94 - 85) + 85),
          temperatura: (Math.random() * (38 - 37) + 37).toFixed(1),
          estado_general: "Urgente"
        };
      default: // estable
        return {
          pulso: Math.floor(Math.random() * (90 - 60) + 60),
          presion: "120/80",
          nivel_chakra: Math.floor(Math.random() * (100 - 80) + 80),
          oxigenacion: Math.floor(Math.random() * (100 - 96) + 96),
          temperatura: (Math.random() * (37 - 36) + 36).toFixed(1),
          estado_general: "Estable"
        };
    }
  }

  router.post("/", async (req, res) => {
    try {
      let { missionId, ninjaId, vitals, ubicacion, estado } = req.body;

      /*if (!missionId || !ninjaId || !vitals) {
        return res.status(400).json({
          exito: false,
          mensaje: "Faltan campos requeridos (missionId, ninjaId o vitals)"
        });*/
      if (!ninjaId || !vitals) {
        return res.status(400).json({
          exito: false,
          mensaje: "Faltan campos requeridos (ninjaId o vitals)"
        });
      }

      // Si no viene missionId, usamos uno por defecto
      const mission = missionId || "M-TEST";

      if (!mongoose.Types.ObjectId.isValid(ninjaId)) {
        return res.status(400).json({ exito: false, mensaje: "ID de ninja inválido" });
      }

      const ninja = await Paciente.findById(ninjaId);
      if (!ninja) {
        return res.status(404).json({ exito: false, mensaje: "Ninja no encontrado" });
      }
      // 🔹 Generar signos vitales automáticamente según el estado
      vitals = generarSignosPorEstado(estado);
      console.log("Estado recibido:", estado);
      const data = new Telemedicine({ missionId: mission, ninjaId, vitals, ubicacion });
      const saved = await data.save();

      // Enviamos el evento en tiempo real a los médicos suscritos a esa misión
      io.to(mission).emit("telemedicine_update", saved);

      res.status(201).json({
        exito: true,
        mensaje: `Registro creado para estado ${estado}`,
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

      /*const registros = await Telemedicine.find({ missionId })
        .populate("ninjaId", "nombre apellido aldea rango")
        .sort({ timestamp: -1 });*/
      const registros = await Telemedicine.find({ missionId })
        .populate("ninjaId", "nombre apellido aldea rango currentCondition") // <- esto transforma ObjectId en objeto
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
        error: error.message,
        // enviar stack solo en desarrollo
        ...(process.env.NODE_ENV !== "production" && { stack: error.stack })
      });
    }
  });
  // 🔁 Simulación automática de actualización de signos vitales
  setInterval(async () => {
    try {
      // Traemos todos los registros de telemedicina
      const registros = await Telemedicine.find().populate("ninjaId", "nombre apellido aldea rango");

      for (const registro of registros) {
        // Determinar el estado actual a partir del vital guardado
        const estadoActual = registro.vitals.estado_general?.toLowerCase() || "estable";

        // Generar nuevos signos vitales según el estado
        const nuevosSignos = generarSignosPorEstado(estadoActual);

        // Actualizar el documento
        registro.vitals = nuevosSignos;
        await registro.save();

        // Enviar actualización en tiempo real a los clientes conectados
        io.to(registro.missionId).emit("telemedicine_update", registro);

        console.log(`✅ Signos actualizados para ${registro.ninjaId?.nombre || "Desconocido"} (${estadoActual})`);
      }
    } catch (error) {
      console.error("⚠️ Error al actualizar signos vitales automáticamente:", error.message);
    }
  }, 10000); // cada 10 segundos

  return router;
};
