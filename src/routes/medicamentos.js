const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Receta = require("../models/medicamentosModels");
const Paciente = require("../models/pacienteModels");
const { verificarToken } = require("./validar_token");
const crypto = require("crypto");

// Generar firma digital segura (hash SHA256)
function generarFirmaDigital(doctorId, pacienteId, timestamp, selloBase64) {
  const crypto = require("crypto");
  const base = `${doctorId}-${pacienteId}-${timestamp}`;
  const hash = crypto.createHash("sha256").update(base).digest("hex");
  return {
    hash,
    sello: selloBase64 || null
  };
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
      firmaDigital,
      fechaCreacion: new Date(),
      pedidoAutomatico: false
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
// Validar firma digital
router.get("/validar/:firmaDigital", verificarToken, async (req, res) => {
  try {
    const { firmaDigital } = req.params;

    const receta = await Receta.findOne({ firmaDigital });
    if (!receta) {
      return res.status(404).json({ exito: false, mensaje: "Firma médica no encontrada o inválida" });
    }

    res.json({
      exito: true,
      mensaje: "Sello médico válido",
      data: {
        doctorId: receta.doctorId,
        patientId: receta.patientId,
        fecha: receta.fechaCreacion,
      }
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al validar sello médico",
      error: error.message
    });
  }
});

module.exports = router;
