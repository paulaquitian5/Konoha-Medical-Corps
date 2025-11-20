const express = require("express");
const router = express.Router();
const Medico = require("../models/medicoModels");

// Listar todos los médicos
router.get("/", async (req, res) => {
  try {
    const medicos = await Medico.find().sort({ nombre: 1 });
    res.json({ exito: true, total: medicos.length, data: medicos });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener los médicos",
      error: error.message
    });
  }
});

// Crear un médico (opcional, para inicializar)
router.post("/", async (req, res) => {
  try {
    const { nombre, codigo, sello } = req.body;

    if (!nombre || !codigo || !sello) {
      return res.status(400).json({ exito: false, mensaje: "Datos incompletos para crear médico" });
    }

    const medico = new Medico({ nombre, codigo, sello });
    const saved = await medico.save();

    res.status(201).json({ exito: true, data: saved });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: "Error al crear médico", error: error.message });
  }
});

module.exports = router;
