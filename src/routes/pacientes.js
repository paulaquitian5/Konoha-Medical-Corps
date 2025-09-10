const express = require("express");
const router = express.Router();
const { createPaciente } = require("../controllers/pacientesController");

// POST /pacientes
router.post("/", createPaciente);

module.exports = router;
