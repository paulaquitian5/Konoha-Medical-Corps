const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app); // <-- Crea el servidor HTTP base
const io = new Server(server, {
  cors: { origin: "*", methods: "*"} 
});
const port = 3000;

// ==========================
// 🧩 Middlewares 
// ==========================
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://konoha-medical-corps-frontend.onrender.com']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones sin origin (como Postman o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

// ==========================
// 🚏 Rutas
// ==========================

const pacientesRoutes = require('./routes/pacientes'); 
const telemedicinaRoutes = require('./routes/telemedicina');
const diagnosticoRoutes = require('./routes/diagnostico');
const emergenciaRoutes = require('./routes/emergencia');
const medicamentosRoutes = require('./routes/medicamentos');
const medicoRoutes = require('./routes/medico');

require('dotenv').config();

app.use('/api/pacientes', pacientesRoutes); 
app.use('/api/telemedicina', telemedicinaRoutes(io));
app.use('/api/diagnostico', diagnosticoRoutes);
app.use('/api/emergencia', emergenciaRoutes(io));
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/medicos', medicoRoutes);

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
// ⚙️ Conexión a la base de datos
// ==========================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conexión a MongoDB Atlas exitosa'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// ==========================
// 🚀 Servidor activo
// ==========================
server.listen(port, () => {
  console.log(`🔥 Servidor Shinobi escuchando en el puerto ${port}`);
});
 