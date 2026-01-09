import mongoose from 'mongoose';

const agendamentoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    // Pode ser ObjectId (usuário logado) ou Object (dados diretos)
  },
  barbeiro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbeiro',
    required: true
  },
  servico: {
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    duracao: { type: Number, required: true } // em minutos
  },
  data: {
    type: Date,
    required: true
  },
  horario: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido']
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'concluido', 'cancelado'],
    default: 'pendente'
  },
  notificacoes: {
    confirmacao: { type: Boolean, default: false },
    lembrete: { type: Boolean, default: false }
  },
  observacoes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index para buscar agendamentos por data e horário
agendamentoSchema.index({ barbeiro: 1, data: 1, horario: 1 });

const Agendamento = mongoose.model('Agendamento', agendamentoSchema);

export default Agendamento;
