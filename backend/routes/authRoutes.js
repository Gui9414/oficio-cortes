import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Barbeiro from '../models/Barbeiro.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Gerar JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { nome, telefone, senha } = req.body;

    // Verificar se usuário já existe
    const usuarioExiste = await Usuario.findOne({ telefone });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'Telefone já cadastrado' });
    }

    // Criar usuário
    const usuario = await Usuario.create({
      nome,
      telefone,
      senha
    });

    // Gerar token
    const token = gerarToken(usuario._id);

    res.status(201).json({
      user: {
        id: usuario._id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        tipo: usuario.tipo
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { telefone, senha } = req.body;

    // Buscar usuário com senha
    const usuario = await Usuario.findOne({ telefone }).select('+senha');

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ message: 'Usuário inativo' });
    }

    // Gerar token
    const token = gerarToken(usuario._id);

    res.json({
      user: {
        id: usuario._id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        tipo: usuario.tipo
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Buscar perfil do usuário logado
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Atualizar perfil do usuário logado
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { nome } = req.body;

    const usuario = await Usuario.findById(req.user._id);
    
    if (nome) usuario.nome = nome;

    await usuario.save();

    res.json({
      id: usuario._id,
      nome: usuario.nome,
      telefone: usuario.telefone,
      tipo: usuario.tipo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
