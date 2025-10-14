const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Paciente = require("../models/pacienteModels");
const Diagnostico = require("../models/diagnosticoModels");

/**
 * analyzeChakra(chakra)
 * Simula un análisis automático del chakra.
 * - Recibe un objeto chakra (tipo, capacidad, fluctuacion, metrics)
 * - Devuelve { result, confidence, explanation }
 */
function analyzeChakra(chakra) {
  // Valores por defecto
  const result = {
    result: "indeterminado",
    confidence: 0.0,
    explanation: "Análisis automático preliminar."
  };

  if (!chakra) {
    result.result = "indeterminado";
    result.confidence = 0.2;
    result.explanation = "No se proporcionaron datos de chakra completos.";
    return result;
  }

  // Heurística simple:
  // - capacidad Alta + potencia alta => normal
  // - capacidad Baja o variabilidad alta => posible_bloqueo
  // - temperatura anormal o variabilidad muy alta => riesgo_critico
  const potencia = chakra.metrics?.potencia ?? null;
  const variabilidad = chakra.metrics?.variabilidad ?? null;
  const temperatura = chakra.metrics?.temperatura ?? null;
  const capacidad = (chakra.capacidad || "").toLowerCase();

  // Regla: riesgo crítico
  if ((variabilidad !== null && variabilidad >= 85) ||
    (temperatura !== null && (temperatura < 30 || temperatura > 45))) {
    result.result = "riesgo_critico";
    result.confidence = 0.92;
    result.explanation = "Variabilidad o temperatura fuera de rangos seguros — riesgo crítico.";
    return result;
  }

  // Regla: posible bloqueo
  if (capacidad === "baja" || (variabilidad !== null && variabilidad >= 50)) {
    result.result = "posible_bloqueo";
    result.confidence = 0.75;
    result.explanation = "Capacidad baja o variabilidad elevada sugiere bloqueo de chakra.";
    return result;
  }

  // Regla: normal (si potencia alta y capacidad alta)
  if ((capacidad === "alta" || capacidad === "normal") && (potencia !== null && potencia >= 60) && (variabilidad !== null && variabilidad < 50)) {
    result.result = "normal";
    result.confidence = 0.88;
    result.explanation = "Patrón de chakra dentro de rangos esperados.";
    return result;
  }

  // Caso por defecto — baja confianza
  result.result = "indeterminado";
  result.confidence = 0.45;
  result.explanation = "Patrón no concluyente — se requiere más telemetría o revisión médica.";
  return result;
}

/**
 * POST /api/diagnostico
 * Body: { patientId, chakra: { tipo, capacidad, fluctuacion, metrics } }
 * -> Analiza y guarda un diagnóstico
 */
router.post('/', async (req, res) => {
  try {
    const { patientId, chakra, origin } = req.body;

    if (!patientId || !chakra) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Faltan datos obligatorios: patientId o chakra'
      });
    }

    // 🔹 Caso 1: diagnóstico automático
    let resultData = {};
    if (!origin || origin === 'auto') {
      resultData = analyzeChakra(chakra);
    }

    // 🔹 Caso 2: diagnóstico manual
    const nuevoDiagnostico = new Diagnostico({
      patientId,
      chakra,
      result: req.body.result || resultData.result,
      explanation: req.body.explanation || resultData.explanation,
      confidence: req.body.confidence || resultData.confidence,
      origin: origin || 'auto'
    });

    const diagnosticoGuardado = await nuevoDiagnostico.save();
    res.status(201).json({
      exito: true,
      mensaje: origin === 'manual'
        ? 'Diagnóstico manual registrado correctamente'
        : 'Diagnóstico automático generado correctamente',
      diagnostico: diagnosticoGuardado
    });
  } catch (error) {
    console.error('Error al generar diagnóstico:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor al generar diagnóstico',
      error: error.message
    });
  }
});


/**
 * ============================================================
 * GET /api/diagnosticos
 * -> Lista de todos los diagnósticos registrados
 * ============================================================
 */
router.get('/', async (req, res) => {
  try {
    const diagnosticos = await Diagnostico.find().populate('patientId', 'nombre apellido'); // si quieres traer info del paciente
    res.json({
      exito: true,
      total: diagnosticos.length,
      diagnosticos
    });
  } catch (error) {
    console.error('Error al obtener diagnósticos:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener diagnósticos',
      error: error.message
    });
  }
});

/**
 * ============================================================
 * GET /api/diagnosticos/paciente/:id
 * -> Devuelve todos los diagnósticos de un paciente específico
 * ============================================================
 */
router.get('/paciente/:id', async (req, res) => {
  try {
    const diagnosticos = await Diagnostico.find({ patientId: req.params.id }).sort({ createdAt: -1 });

    if (!diagnosticos.length) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No se encontraron diagnósticos para este paciente'
      });
    }

    res.json({
      exito: true,
      total: diagnosticos.length,
      diagnosticos
    });
  } catch (error) {
    console.error('Error al obtener diagnósticos por paciente:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener diagnósticos del paciente',
      error: error.message
    });
  }
});

/**
 * ============================================================
 * GET /api/diagnosticos/paciente/:id/ultimo
 * -> Muestra el diagnóstico más reciente del paciente
 * ============================================================
 */
router.get('/paciente/:id/ultimo', async (req, res) => {
  try {
    const ultimo = await Diagnostico.findOne({ patientId: req.params.id }).sort({ createdAt: -1 });

    if (!ultimo) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No se encontró ningún diagnóstico para este paciente'
      });
    }

    res.json({
      exito: true,
      diagnostico: ultimo
    });
  } catch (error) {
    console.error('Error al obtener el último diagnóstico:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el último diagnóstico del paciente',
      error: error.message
    });
  }
});

/**
 * ============================================================
 * PUT /api/diagnosticos/:id
 * -> Permite editar un diagnóstico existente
 * ============================================================
 */
router.put('/:id', async (req, res) => {
  try {
    const diagnosticoActualizado = await Diagnostico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // retorna el diagnóstico actualizado
    );

    if (!diagnosticoActualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Diagnóstico no encontrado'
      });
    }

    res.json({
      exito: true,
      mensaje: 'Diagnóstico actualizado correctamente',
      diagnostico: diagnosticoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar diagnóstico:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar diagnóstico',
      error: error.message
    });
  }
});

/**
 * DELETE /api/diagnostico/:id
 * -> Elimina un diagnóstico específico por su ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const diagnosticoEliminado = await Diagnostico.findByIdAndDelete(req.params.id);

    if (!diagnosticoEliminado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Diagnóstico no encontrado'
      });
    }

    res.json({
      exito: true,
      mensaje: 'Diagnóstico eliminado correctamente',
      diagnostico: diagnosticoEliminado
    });

  } catch (error) {
    console.error('Error al eliminar diagnóstico:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor al eliminar diagnóstico',
      error: error.message
    });
  }
});

module.exports = router;
