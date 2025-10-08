const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const app = express();
const port = 3000;

// ==========================
// 🧩 Middlewares
// ==========================
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

// ==========================
// 🚏 Rutas
// ==========================

const pacientesRoutes = require('./routes/pacientes'); 

require('dotenv').config();

app.use('/api/pacientes', pacientesRoutes); 

// ==========================
// 🌐 Ruta general del cliente (frontend)
// ==========================
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// ==========================
// ⚙️ Conexión a la base de datos
// ==========================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conexión a MongoDB Atlas exitosa'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// ==========================
// 🚀 Servidor activo
// ==========================
app.listen(port, () => {
  console.log(`🔥 Servidor Shinobi escuchando en el puerto ${port}`);
});
