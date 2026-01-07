import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: 0
  },
  categoria: {
    type: String,
    enum: ['creme', 'minoxidil', 'pomada', 'acessorio', 'outro'],
    required: true
  },
  imagem: {
    type: String,
    default: null
  },
  desconto: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  estoque: {
    type: Number,
    default: 0,
    min: 0
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;
