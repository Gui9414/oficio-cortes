import Servico from './models/Servico.js';
import Produto from './models/Produto.js';

// Serviços mock
const servicosMock = [
  { nome: 'Corte Clássico', preco: 45, duracao: 30, descricao: 'Corte tradicional masculino', ativo: true },
  { nome: 'Corte + Barba', preco: 70, duracao: 45, descricao: 'Corte de cabelo e barba', ativo: true },
  { nome: 'Barba', preco: 35, duracao: 20, descricao: 'Barba desenhada e aparada', ativo: true },
  { nome: 'Platinado', preco: 150, duracao: 90, descricao: 'Descoloração total dos fios', ativo: true }
];

// Produtos mock
const produtosMock = [
  {
    nome: 'Pomada Modeladora',
    preco: 35.90,
    categoria: 'pomada',
    descricao: 'Pomada de alta fixação',
    estoque: 10,
    ativo: true
  },
  {
    nome: 'Shampoo Premium',
    preco: 45.00,
    categoria: 'cuidados',
    descricao: 'Shampoo para barba e cabelo',
    estoque: 15,
    ativo: true
  }
];

async function seedMock() {
  // Serviços
  const countServicos = await Servico.countDocuments();
  if (countServicos === 0) {
    await Servico.insertMany(servicosMock);
    console.log('Serviços mock inseridos!');
  } else {
    console.log('Serviços já existem no banco.');
  }

  // Produtos
  const countProdutos = await Produto.countDocuments();
  if (countProdutos === 0) {
    await Produto.insertMany(produtosMock);
    console.log('Produtos mock inseridos!');
  } else {
    console.log('Produtos já existem no banco.');
  }

  process.exit();
}

import { connectDB } from './config/database-mongo.js';
connectDB().then(seedMock);