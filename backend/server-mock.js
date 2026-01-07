// SERVIDOR MOCK TEMPORÁRIO - Use enquanto configura o MongoDB
// Execute: node backend/server-mock.js

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Dados mock
const mockUser = {
  id: '1',
  nome: 'Admin Teste',
  email: 'admin@oficiocortes.com',
  role: 'admin',
  telefone: '(11) 99999-9999'
};

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.mock';

const mockBarbeiros = [
  {
    id: '1',
    nome: 'Guilherme Gonçalves Vieira',
    especialidade: 'Cortes Clássicos e Modernos',
    foto: '/logo oficio.svg',
    ativo: true
  }
];

const mockProdutos = [
  {
    id: '1',
    nome: 'Pomada Modeladora Premium',
    descricao: 'Pomada de alta fixação',
    preco: 45.00,
    categoria: 'pomada',
    estoque: 25,
    ativo: true,
    destaque: true
  },
  {
    id: '2',
    nome: 'Óleo para Barba',
    descricao: 'Óleo nutritivo',
    preco: 38.00,
    categoria: 'creme',
    estoque: 30,
    ativo: true
  }
];

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor MOCK funcionando - Configure o MongoDB!' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@oficiocortes.com' && password === 'admin123') {
    res.json({ token: mockToken, user: mockUser });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({ token: mockToken, user: { ...mockUser, ...req.body } });
});

app.get('/api/auth/me', (req, res) => {
  res.json(mockUser);
});

app.get('/api/barbeiros', (req, res) => {
  res.json(mockBarbeiros);
});

app.get('/api/produtos', (req, res) => {
  res.json(mockProdutos);
});

app.get('/api/agendamentos', (req, res) => {
  res.json([]);
});

app.post('/api/agendamentos', (req, res) => {
  res.json({ 
    message: 'Agendamento criado (MOCK)', 
    agendamento: { id: '1', ...req.body } 
  });
});

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada (servidor MOCK)' });
});

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║                                                    ║');
  console.log('║     ⚠️  SERVIDOR MOCK TEMPORÁRIO  ⚠️               ║');
  console.log('║                                                    ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor MOCK rodando na porta ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log('');
  console.log('⚠️  ATENÇÃO: Este é um servidor temporário!');
  console.log('📋 Configure o MongoDB Atlas seguindo:');
  console.log('   COMO_CONFIGURAR_MONGODB.md');
  console.log('');
  console.log('🔐 Login de teste:');
  console.log('   Email: admin@oficiocortes.com');
  console.log('   Senha: admin123');
  console.log('');
  console.log('✅ Depois de configurar o MongoDB:');
  console.log('   1. Pare este servidor (Ctrl+C)');
  console.log('   2. Execute: npm run seed');
  console.log('   3. Execute: npm run server:dev');
  console.log('');
});
