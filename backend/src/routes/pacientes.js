const express = require("express");
const router = express.Router();
const Paciente = require("../models/pacienteModels");

// ============================
// 🩺 GESTIÓN DE PACIENTES SHINOBI
// ============================

// Crear un nuevo paciente
router.post("/", async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    const savedPaciente = await paciente.save();

    res.status(201).json({
      exito: true,
      mensaje: "Paciente creado correctamente",
      paciente: savedPaciente
    });
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(400).json({
      exito: false,
      mensaje: "Error al crear paciente",
      error: error.message
    });
  }
});

// Obtener todos los pacientes
router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.find().select("-__v").sort({ nombre: 1 });

    res.json({
      exito: true,
      total: pacientes.length,
      pacientes
    });
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener pacientes",
      error: error.message
    });
  }
});

// Obtener resumen médico de un paciente
router.get("/:id/resumen", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);

    if (!paciente) {
      return res.status(404).json({
        exito: false,
        mensaje: "Paciente no encontrado"
      });
    }

    // Llama al método personalizado del modelo
    const resumen = paciente.getResumenMedico
      ? paciente.getResumenMedico()
      : {
        nombre: paciente.nombre,
        aldea: paciente.aldea,
        chakra: paciente.chakra || {},
        estado: paciente.estado
      };

    res.json({
      exito: true,
      resumen
    });
  } catch (error) {
    console.error("Error al obtener resumen médico:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener resumen médico",
      error: error.message
    });
  }
});

// ✅ Verificar estabilidad del chakra de un paciente
router.get("/:id/chakra/estable", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);

    if (!paciente || !paciente.chakra) {
      return res.status(404).json({
        exito: false,
        mensaje: "Paciente o datos de chakra no encontrados"
      });
    }

    // Obtenemos el valor numérico de estabilidad
    const valorEstabilidad = paciente.chakra.estabilidad ?? null;

    if (valorEstabilidad === null) {
      return res.status(400).json({
        exito: false,
        mensaje: "El campo 'estabilidad' no está definido para este paciente"
      });
    }

    // 🔹 Definimos el rango de estabilidad
    // Puedes ajustar estos límites si quieres ser más estricto
    const estable = valorEstabilidad >= 0.9 && valorEstabilidad <= 1.1;

    res.json({
      exito: true,
      estable,
      valorEstabilidad
    });

  } catch (error) {
    console.error("Error al verificar estabilidad:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al verificar estabilidad del chakra",
      error: error.message
    });
  }
});


// Obtener paciente por ID
router.get("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id).select("-__v");

    if (!paciente) {
      return res.status(404).json({
        exito: false,
        mensaje: "Paciente no encontrado"
      });
    }

    res.json({
      exito: true,
      paciente
    });
  } catch (error) {
    console.error("Error al obtener paciente:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener paciente",
      error: error.message
    });
  }
});

// Actualizar paciente por ID
router.put("/:id", async (req, res) => {
  try {
    const pacienteActualizado = await Paciente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!pacienteActualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: "Paciente no encontrado"
      });
    }

    res.json({
      exito: true,
      mensaje: "Paciente actualizado correctamente",
      paciente: pacienteActualizado
    });
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    res.status(400).json({
      exito: false,
      mensaje: "Error al actualizar paciente",
      error: error.message
    });
  }
});

// Eliminar paciente por ID
router.delete("/:id", async (req, res) => {
  try {
    const pacienteEliminado = await Paciente.findByIdAndDelete(req.params.id);

    if (!pacienteEliminado) {
      return res.status(404).json({
        exito: false,
        mensaje: "Paciente no encontrado"
      });
    }

    res.json({
      exito: true,
      mensaje: "Paciente eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al eliminar paciente",
      error: error.message
    });
  }
});

module.exports = router;