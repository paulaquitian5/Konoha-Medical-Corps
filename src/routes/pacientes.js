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