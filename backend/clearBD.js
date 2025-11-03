require('dotenv').config();
const mongoose = require('mongoose');
const Paciente = require('./src/models/pacienteModels');
const Telemedicine = require('./src/models/telemedicinaModels');

const MONGO_URI = process.env.MONGODB_URI;

async function clearDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    await Paciente.deleteMany({});
    console.log('Pacientes borrados');

    await Telemedicine.deleteMany({});
    console.log('Registros de telemedicina borrados');

    process.exit(0);
  } catch (error) {
    console.error('Error borrando la base de datos:', error);
    process.exit(1);
  }
}

clearDatabase();

