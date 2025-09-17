require("dotenv").config();
const express = require("express");
const app = express();
const pacientesRoutes = require("./routes/pacientes");

app.use(express.json());

// Rutas base
app.use("/pacientes", pacientesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
