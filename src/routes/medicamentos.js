const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Receta = require("../models/medicamentosModels");
const Paciente = require("../models/pacienteModels");
const { verificarToken } = require("./validar_token"); 

// Generar firma digital simulada
function generarFirmaDigital(doctorId, pacienteId, timestamp) {
  const base = `${doctorId}-${pacienteId}-${timestamp}`;
  return Buffer.from(base).toString("base64");
}

// Crear receta médica
router.post("/", verificarToken, async (req, res) => {
  try {
    const { patientId, medicamentos, observaciones } = req.body;

    if (!patientId || !medicamentos?.length) {
      return res.status(400).json({ exito: false, mensaje: "Datos incompletos para crear receta" });
    }

    const paciente = await Paciente.findById(patientId);
    if (!paciente) {
      return res.status(404).json({ exito: false, mensaje: "Paciente no encontrado" });
    }

    const timestamp = Date.now();
    const firmaDigital = generarFirmaDigital(req.usuario.id, patientId, timestamp);

    const receta = new Receta({
      patientId,
      doctorId: req.usuario.id,
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

// Consultar recetas de un paciente
router.get("/:patientId", verificarToken, async (req, res) => {
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

// Automatizar pedido de medicamentos
router.post("/order", verificarToken, async (req, res) => {
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
