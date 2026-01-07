import express from 'express';
import Barbeiro from '../models/Barbeiro.js';
import Usuario from '../models/Usuario.js';
import Agendamento from '../models/Agendamento.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   GET /api/barbeiros
// @desc    Listar todos os barbeiros ativos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const barbeiros = await Barbeiro.find({ ativo: true })
      .populate('usuario', 'nome');

    const barbeirosFormatados = barbeiros.map(b => ({
      id: b._id,
      nome: b.usuario.nome,
      bio: b.bio,
      foto: b.foto,
      ativo: b.ativo
    }));

    res.json(barbeirosFormatados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/barbeiros/estatisticas
// @desc    Buscar estatísticas do barbeiro
// @access  Private/Admin
router.get('/estatisticas', protect, adminOnly, async (req, res) => {
  try {
    const { periodo = 'dia' } = req.query;
    
    // Buscar barbeiro do usuário logado
    const barbeiro = await Barbeiro.findOne({ usuario: req.user._id });
    if (!barbeiro) {
      return res.status(404).json({ message: 'Barbeiro não encontrado' });
    }

    // Calcular datas
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    let dataInicio;
    switch (periodo) {
      case 'semana':
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case 'mes':
        dataInicio = new Date(hoje);
        dataInicio.setMonth(hoje.getMonth() - 1);
        break;
      default: // dia
        dataInicio = hoje;
    }

    // Buscar agendamentos concluídos
    const agendamentos = await Agendamento.find({
      barbeiro: barbeiro._id,
      data: { $gte: dataInicio },
      status: 'concluido'
    });

    // Calcular receita total
    const receitaTotal = agendamentos.reduce((total, agend) => {
      return total + agend.servico.preco;
    }, 0);

    // Contar agendamentos do dia
    const agendamentosDia = await Agendamento.countDocuments({
      barbeiro: barbeiro._id,
      data: { $gte: hoje },
      status: { $ne: 'cancelado' }
    });

    res.json({
      periodo,
      receitaTotal,
      totalAgendamentos: agendamentos.length,
      agendamentosDia
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/barbeiros/:id/foto
// @desc    Upload de foto do barbeiro
// @access  Private/Admin
router.post('/:id/foto', protect, adminOnly, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    const barbeiro = await Barbeiro.findById(req.params.id);
    if (!barbeiro) {
      return res.status(404).json({ message: 'Barbeiro não encontrado' });
    }

    // Salvar caminho da foto
    barbeiro.foto = `/uploads/${req.file.filename}`;
    await barbeiro.save();

    res.json({ foto: barbeiro.foto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/barbeiros/:id
// @desc    Atualizar perfil do barbeiro
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { bio, horarioFuncionamento } = req.body;

    const barbeiro = await Barbeiro.findById(req.params.id);
    if (!barbeiro) {
      return res.status(404).json({ message: 'Barbeiro não encontrado' });
    }

    if (bio !== undefined) barbeiro.bio = bio;
    if (horarioFuncionamento) barbeiro.horarioFuncionamento = horarioFuncionamento;

    await barbeiro.save();

    res.json(barbeiro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
