import mongoose from 'mongoose';

const horarioSchema = new mongoose.Schema({
  dia: { type: String, required: true }, // segunda, terca, etc
  abertura: { type: String, required: true }, // '08:00'
  fechamento: { type: String, required: true }, // '18:00'
  ativo: { type: Boolean, default: true }
});

export default mongoose.model('Horario', horarioSchema);