import mongoose from 'mongoose';

const configuracaoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    unique: true,
    enum: ['horarios', 'servicos', 'geral']
  },
  horariosFuncionamento: {
    segunda: { abertura: String, fechamento: String, ativo: Boolean },
    terca: { abertura: String, fechamento: String, ativo: Boolean },
    quarta: { abertura: String, fechamento: String, ativo: Boolean },
    quinta: { abertura: String, fechamento: String, ativo: Boolean },
    sexta: { abertura: String, fechamento: String, ativo: Boolean },
    sabado: { abertura: String, fechamento: String, ativo: Boolean },
    domingo: { abertura: String, fechamento: String, ativo: Boolean }
  },
  servicos: [{
    id: String,
    nome: String,
    preco: Number,
    duracao: Number,
    ativo: Boolean,
    descricao: String
  }],
  informacoes: {
    telefone: String,
    whatsapp: String,
    instagram: String,
    endereco: {
      rua: String,
      numero: String,
      bairro: String,
      cidade: String,
      estado: String,
      cep: String,
      coordenadas: {
        lat: Number,
        lng: Number
      }
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Configuracao', configuracaoSchema);
