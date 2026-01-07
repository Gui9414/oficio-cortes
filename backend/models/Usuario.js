import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    unique: true,
    match: [/^\d{11}$/, 'Telefone inválido (deve ter 11 dígitos)']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6,
    select: false // Não retorna a senha por padrão nas consultas
  },
  tipo: {
    type: String,
    enum: ['cliente', 'barbeiro'],
    default: 'cliente'
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
