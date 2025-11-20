const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Receta = require("../models/medicamentosModels");
const Paciente = require("../models/pacienteModels");
const medicos = require("../data/medicos"); // listado fijo de médicos

// Generar firma digital simulada
function generarFirmaDigital(doctorId, pacienteId, timestamp) {
  const base = `${doctorId}-${pacienteId}-${timestamp}`;
  return Buffer.from(base).toString("base64");
}

// Crear receta médica (sin login)
router.post("/", async (req, res) => {
  try {
    const { patientId, medicamentos, observaciones } = req.body;

    if (!patientId || !medicamentos?.length) {
      return res.status(400).json({ exito: false, mensaje: "Datos incompletos para crear receta" });
    }

    const paciente = await Paciente.findById(patientId);
    if (!paciente) {
      return res.status(404).json({ exito: false, mensaje: "Paciente no encontrado" });
    }

    // ⬇️ Doctor genérico (no importa cuál, porque el frontend ya maneja eso)
    const doctorId = 1;
    const timestamp = Date.now();
    const firmaDigital = generarFirmaDigital(doctorId, patientId, timestamp);

    const receta = new Receta({
      patientId,
      doctorId,
      medicamentos,
      observaciones,
      firmaDigital
    });

    const saved = await receta.save();

    res.status(201).json({
      exito: true,
      mensaje: "Receta creada exitosamente",
      data: saved
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error en el servidor al crear receta",
      error: error.message
    });
  }
});

// 🚨 NUEVA RUTA: Consultar TODAS las recetas (sin login/filtro, ideal para el farmacéutico) 🚨
router.get("/", async (req, res) => {
  try {
    // 💡 Recomendación: En un entorno de producción, aquí aplicarías filtros (ej: status='pending').
    // Por ahora, traemos todas las recetas.
    const recetas = await Receta.find({}).sort({ fechaCreacion: -1 });
    const recetasConNombre = await Promise.all(
      recetas.map(async (r) => {
        const paciente = await Paciente.findById(r.patientId);
        return {
          ...r._doc,
          pacienteNombre: paciente ? paciente.nombre : "Desconocido",
        };
      })
    );

    res.json({
      exito: true,
      total: recetasConNombre.length,
      data: recetasConNombre
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al consultar todas las recetas",
      error: error.message
    });
  }
});
// 🚨 RUTA AÑADIDA: Actualizar estado de validación 🚨
router.put("/:id/status", async (req, res) => {
  try {
    const { status, observacionesFarmaceutico } = req.body;
    const recetaId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(recetaId)) {
      return res.status(400).json({ exito: false, mensaje: "ID de receta inválido" });
    }

    if (!status || (status !== 'valid' && status !== 'invalid')) {
      return res.status(400).json({ exito: false, mensaje: "Estado inválido. Debe ser 'valid' o 'invalid'." });
    }

    const updatedReceta = await Receta.findByIdAndUpdate(
      recetaId,
      {
        status: status,
        observacionesFarmaceutico: observacionesFarmaceutico || null
      },
      { new: true }
    );

    if (!updatedReceta) {
      return res.status(404).json({ exito: false, mensaje: "Receta no encontrada" });
    }

    res.json({
      exito: true,
      mensaje: `Receta actualizada a estado: ${status}`,
      data: updatedReceta
    });

  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al actualizar el estado de la receta",
      error: error.message
    });
  }
});
// Consultar recetas de un paciente (sin login)
router.get("/:patientId", async (req, res) => {
  try {
    const recetas = await Receta.find({ patientId: req.params.patientId }).sort({ fechaCreacion: -1 });
    res.json({ exito: true, total: recetas.length, data: recetas });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al consultar recetas del paciente",
      error: error.message
    });
  }
});
// 🚨 NUEVA RUTA: Consultar TODAS las recetas
router.get("/:patientId", async (req, res) => {
  try {
    const recetas = await Receta.find({ patientId: req.params.patientId }).sort({ fechaCreacion: -1 });
    const paciente = await Paciente.findById(req.params.patientId);

    const recetasConNombre = await Promise.all(
      recetas.map(async (r) => {
        const paciente = await Paciente.findById(r.patientId);
        return {
          ...r._doc,
          pacienteNombre: paciente ? paciente.nombre : "Desconocido",
        };
      })
    );


    res.json({ exito: true, total: recetas.length, data: recetasConNombre });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al consultar recetas del paciente",
      error: error.message
    });
  }
});

// Automatizar pedido de medicamentos (sin login)
router.post("/order", async (req, res) => {
  try {
    const { recetaId } = req.body;

    if (!recetaId || !mongoose.Types.ObjectId.isValid(recetaId)) {
      return res.status(400).json({ exito: false, mensaje: "ID de receta inválido" });
    }

    const receta = await Receta.findById(recetaId);
    if (!receta) {
      return res.status(404).json({ exito: false, mensaje: "Receta no encontrada" });
    }

    receta.pedidoAutomatico = true;
    await receta.save();

    console.log(`📦 Pedido automático generado para receta ${recetaId}`);

    res.json({
      exito: true,
      mensaje: "Pedido automático enviado al almacén",
      recetaId: recetaId
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al procesar pedido de medicamentos",
      error: error.message
    });
  }
});

module.exports = router;