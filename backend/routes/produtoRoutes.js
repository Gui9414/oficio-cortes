import express from 'express';
import Produto from '../models/Produto.js';

const router = express.Router();

// @route   GET /api/produtos
// @desc    Listar todos os produtos ativos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = { ativo: true };

    if (categoria && categoria !== 'todos') {
      filtro.categoria = categoria;
    }

    const produtos = await Produto.find(filtro).sort({ nome: 1 });

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/produtos/:id
// @desc    Buscar produto por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
