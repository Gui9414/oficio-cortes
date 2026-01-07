import express from 'express';
import Produto from '../models/Produto.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

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

// @route   POST /api/produtos
// @desc    Criar novo produto
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const produto = new Produto({
      nome: req.body.nome,
      preco: req.body.preco,
      estoque: req.body.estoque || 0,
      descricao: req.body.descricao,
      categoria: req.body.categoria || 'outros',
      imagem: req.body.imagem,
      ativo: true
    });

    const novoProduto = await produto.save();
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/produtos/:id
// @desc    Atualizar produto
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    produto.nome = req.body.nome || produto.nome;
    produto.preco = req.body.preco || produto.preco;
    produto.estoque = req.body.estoque !== undefined ? req.body.estoque : produto.estoque;
    produto.descricao = req.body.descricao || produto.descricao;
    produto.categoria = req.body.categoria || produto.categoria;
    produto.imagem = req.body.imagem || produto.imagem;
    produto.ativo = req.body.ativo !== undefined ? req.body.ativo : produto.ativo;

    const produtoAtualizado = await produto.save();
    res.json(produtoAtualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/produtos/:id
// @desc    Deletar produto
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await produto.deleteOne();
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
