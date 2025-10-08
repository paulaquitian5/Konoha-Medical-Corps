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
    const { patientId, chakra, result, explanation, confidence, origin } = req.body;

    // Validar datos mínimos
    if (!patientId || !chakra) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Faltan datos obligatorios: patientId o chakra'
      });
    }

    // Crear el nuevo diagnóstico
    const nuevoDiagnostico = new Diagnostico({
      patientId,
      chakra,
      result: result || 'indeterminado',
      explanation: explanation || '',
      confidence: confidence || 0,
      origin: origin || 'auto'
    });

    // Guardar en la base de datos
    const diagnosticoGuardado = await nuevoDiagnostico.save();

    res.status(201).json({
      exito: true,
      mensaje: 'Diagnóstico generado correctamente',
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
 * GET /api/diagnostico/:patientId
 * -> Retorna el diagnóstico más reciente del paciente
 */
router.get('/:patientId', async (req, res) => {
  try {
    const diagnosticos = await Diagnostico.find({ patientId: req.params.patientId });

    if (!diagnosticos || diagnosticos.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No se encontraron diagnósticos para este paciente'
      });
    }

    res.json({
      exito: true,
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
