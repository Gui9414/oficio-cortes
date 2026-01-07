import express from 'express';
import { auth, adminOnly } from '../middleware/authMiddleware.js';
import Configuracao from '../models/Configuracao.js';
import Produto from '../models/Produto.js';

const router = express.Router();

// Obter configurações (público)
router.get('/', async (req, res) => {
  try {
    const horarios = await Configuracao.findOne({ tipo: 'horarios' });
    const servicos = await Configuracao.findOne({ tipo: 'servicos' });
    const geral = await Configuracao.findOne({ tipo: 'geral' });

    res.json({
      horarios: horarios || {},
      servicos: servicos || { servicos: [] },
      geral: geral || {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar configurações', error: error.message });
  }
});

// Atualizar horários de funcionamento (admin)
router.put('/horarios', auth, adminOnly, async (req, res) => {
  try {
    const config = await Configuracao.findOneAndUpdate(
      { tipo: 'horarios' },
      { 
        tipo: 'horarios',
        horariosFuncionamento: req.body.horariosFuncionamento 
      },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar horários', error: error.message });
  }
});

// Atualizar serviços (admin)
router.put('/servicos', auth, adminOnly, async (req, res) => {
  try {
    const config = await Configuracao.findOneAndUpdate(
      { tipo: 'servicos' },
      { 
        tipo: 'servicos',
        servicos: req.body.servicos 
      },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar serviços', error: error.message });
  }
});

// Adicionar novo serviço (admin)
router.post('/servicos', auth, adminOnly, async (req, res) => {
  try {
    const config = await Configuracao.findOne({ tipo: 'servicos' });
    const novoServico = {
      id: Date.now().toString(),
      ...req.body,
      ativo: true
    };

    if (config) {
      config.servicos.push(novoServico);
      await config.save();
    } else {
      await Configuracao.create({
        tipo: 'servicos',
        servicos: [novoServico]
      });
    }

    res.status(201).json(novoServico);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar serviço', error: error.message });
  }
});

// Atualizar um serviço específico (admin)
router.put('/servicos/:id', auth, adminOnly, async (req, res) => {
  try {
    const config = await Configuracao.findOne({ tipo: 'servicos' });
    const servicoIndex = config.servicos.findIndex(s => s.id === req.params.id);
    
    if (servicoIndex === -1) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    config.servicos[servicoIndex] = {
      ...config.servicos[servicoIndex].toObject(),
      ...req.body
    };
    await config.save();

    res.json(config.servicos[servicoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar serviço', error: error.message });
  }
});

// Deletar serviço (admin)
router.delete('/servicos/:id', auth, adminOnly, async (req, res) => {
  try {
    const config = await Configuracao.findOne({ tipo: 'servicos' });
    config.servicos = config.servicos.filter(s => s.id !== req.params.id);
    await config.save();

    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover serviço', error: error.message });
  }
});

// Atualizar informações gerais (admin)
router.put('/geral', auth, adminOnly, async (req, res) => {
  try {
    const config = await Configuracao.findOneAndUpdate(
      { tipo: 'geral' },
      { 
        tipo: 'geral',
        informacoes: req.body.informacoes 
      },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar informações', error: error.message });
  }
});

export default router;
