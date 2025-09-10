const { v4: uuidv4 } = require("uuid");

const createPaciente = (req, res) => {
  try {
    const {
      uniqueId,
      nombre,
      apellido,
      aldea,
      clan,
      rango,
      fechaNacimiento,
      sexo,
      estado,
      grupoSanguineo,
      contact,
      chakra
    } = req.body;

    if (!nombre || !apellido || !fechaNacimiento) {
      return res.status(400).json({
        error: {
          code: "INVALID_INPUT",
          message: "Faltan campos obligatorios",
          details: { field: "nombre, apellido, fechaNacimiento" },
          timestamp: new Date().toISOString()
        }
      });
    }

    const idPaciente = uuidv4();
    const createdAt = new Date().toISOString();

    res.status(201).json({
      idPaciente,
      nombre,
      apellido,
      createdAt
    });

  } catch (err) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Error en el servidor",
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = { createPaciente };
