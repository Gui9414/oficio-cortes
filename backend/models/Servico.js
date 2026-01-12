import mongoose from 'mongoose';


const servicoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  duracao: { type: Number, required: true }, // minutos
  descricao: { type: String, default: '' },
  ativo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Servico', servicoSchema);