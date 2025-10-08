const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app); // <-- Crea el servidor HTTP base
const io = new Server(server, {
  cors: { origin: "*" } // <-- Permite conexión desde cualquier cliente
});
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
const telemedicinaRoutes = require('./routes/telemedicina');
const diagnosticoRoutes = require('./routes/diagnostico');

require('dotenv').config();

app.use('/api/pacientes', pacientesRoutes); 
app.use('/api/telemedicina', telemedicinaRoutes(io));
app.use('/api/diagnostico', diagnosticoRoutes);

// ==========================
// 🟢 WebSocket
// ==========================

io.on("connection", (socket) => {
  console.log("🟢 Nuevo cliente conectado:", socket.id);

  // Un médico o ninja se une a una sala (por missionId)
  socket.on("join_mission", (missionId) => {
    socket.join(missionId);
    console.log(`⚔️ Usuario ${socket.id} se unió a la misión ${missionId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

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
