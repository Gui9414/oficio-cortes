import mongoose from 'mongoose';

const barbeiroSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  foto: {
    type: String,
    default: null
  },
  horarioFuncionamento: {
    segunda: { inicio: String, fim: String, ativo: { type: Boolean, default: true } },
    terca: { inicio: String, fim: String, ativo: { type: Boolean, default: true } },
    quarta: { inicio: String, fim: String, ativo: { type: Boolean, default: true } },
    quinta: { inicio: String, fim: String, ativo: { type: Boolean, default: true } },
    sexta: { inicio: String, fim: String, ativo: { type: Boolean, default: true } },
    sabado: { inicio: String, fim: String, ativo: { type: Boolean, default: true } },
    domingo: { inicio: String, fim: String, ativo: { type: Boolean, default: false } }
  },
  horariosCustomizados: [{
    data: Date,
    horarios: [String], // Lista de horários personalizados para aquele dia
    bloqueado: Boolean // Se true, dia totalmente bloqueado
  }],
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Horário padrão ao criar barbeiro
barbeiroSchema.pre('save', function(next) {
  if (!this.horarioFuncionamento.segunda.inicio) {
    const horarioPadrao = { inicio: '09:00', fim: '20:00', ativo: true };
    this.horarioFuncionamento = {
      segunda: { ...horarioPadrao },
      terca: { ...horarioPadrao },
      quarta: { ...horarioPadrao },
      quinta: { ...horarioPadrao },
      sexta: { ...horarioPadrao },
      sabado: { inicio: '09:00', fim: '18:00', ativo: true },
      domingo: { inicio: '', fim: '', ativo: false }
    };
  }
  next();
});

const Barbeiro = mongoose.model('Barbeiro', barbeiroSchema);

export default Barbeiro;
