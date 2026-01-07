import express from 'express';
import Agendamento from '../models/Agendamento.js';
import Barbeiro from '../models/Barbeiro.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { enviarNotificacaoConfirmacao } from '../services/notificationService.js';

const router = express.Router();

// Serviços disponíveis (pode vir do banco depois)
const servicos = [
  { id: 1, nome: 'Corte Clássico', preco: 45, duracao: 30 },
  { id: 2, nome: 'Corte + Barba', preco: 70, duracao: 45 },
  { id: 3, nome: 'Barba', preco: 35, duracao: 20 },
  { id: 4, nome: 'Corte Premium', preco: 60, duracao: 45 },
  { id: 5, nome: 'Tratamento Capilar', preco: 80, duracao: 60 },
];

// @route   POST /api/agendamentos
// @desc    Criar novo agendamento
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { barbeiroId, servicoId, data, horario } = req.body;

    // Buscar serviço
    const servico = servicos.find(s => s.id === parseInt(servicoId));
    if (!servico) {
      return res.status(400).json({ message: 'Serviço não encontrado' });
    }

    // Verificar se já existe agendamento nesse horário
    const agendamentoExiste = await Agendamento.findOne({
      barbeiro: barbeiroId,
      data: new Date(data),
      horario,
      status: { $ne: 'cancelado' }
    });

    if (agendamentoExiste) {
      return res.status(400).json({ message: 'Horário já ocupado' });
    }

    // Criar agendamento
    const agendamento = await Agendamento.create({
      cliente: req.user._id,
      barbeiro: barbeiroId,
      servico: {
        nome: servico.nome,
        preco: servico.preco,
        duracao: servico.duracao
      },
      data: new Date(data),
      horario,
      status: 'confirmado'
    });

    // Enviar notificação de confirmação
    await enviarNotificacaoConfirmacao(agendamento);

    res.status(201).json(agendamento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/agendamentos/meus
// @desc    Buscar agendamentos do usuário logado
// @access  Private
router.get('/meus', protect, async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ cliente: req.user._id })
      .populate('barbeiro')
      .sort({ data: 1, horario: 1 });

    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/agendamentos/horarios-disponiveis
// @desc    Buscar horários disponíveis
// @access  Public
router.get('/horarios-disponiveis', async (req, res) => {
  try {
    const { barbeiroId, data } = req.query;

    // Buscar barbeiro
    const barbeiro = await Barbeiro.findById(barbeiroId);
    if (!barbeiro) {
      return res.status(404).json({ message: 'Barbeiro não encontrado' });
    }

    // Buscar agendamentos do dia
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const agendamentos = await Agendamento.find({
      barbeiro: barbeiroId,
      data: { $gte: dataInicio, $lte: dataFim },
      status: { $ne: 'cancelado' }
    });

    // Gerar horários disponíveis (a cada 30 minutos)
    const horariosOcupados = agendamentos.map(a => a.horario);
    const horariosDisponiveis = [];
    
    // Horário de funcionamento padrão (pode vir do banco)
    const inicio = 9; // 9h
    const fim = 20; // 20h

    for (let hora = inicio; hora < fim; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        if (!horariosOcupados.includes(horario)) {
          horariosDisponiveis.push(horario);
        }
      }
    }

    res.json(horariosDisponiveis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/agendamentos
// @desc    Listar todos os agendamentos (Admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { data, status } = req.query;
    const filtro = {};

    if (data) {
      const dataInicio = new Date(data);
      dataInicio.setHours(0, 0, 0, 0);
      
      const dataFim = new Date(data);
      dataFim.setHours(23, 59, 59, 999);

      filtro.data = { $gte: dataInicio, $lte: dataFim };
    }

    if (status) {
      filtro.status = status;
    }

    const agendamentos = await Agendamento.find(filtro)
      .populate('cliente', 'nome telefone')
      .populate('barbeiro')
      .sort({ data: 1, horario: 1 });

    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/agendamentos/:id
// @desc    Cancelar agendamento
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id);

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    // Verificar se é o cliente ou admin
    if (agendamento.cliente.toString() !== req.user._id.toString() && req.user.tipo !== 'barbeiro') {
      return res.status(403).json({ message: 'Sem permissão' });
    }

    agendamento.status = 'cancelado';
    await agendamento.save();

    res.json({ message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
