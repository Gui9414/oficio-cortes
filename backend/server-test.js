import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Dados mock
const servicos = [
  { id: '1', nome: 'Corte Clássico', preco: 45, duracao: 30, ativo: true },
  { id: '2', nome: 'Corte + Barba', preco: 70, duracao: 45, ativo: true }
];

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

app.get('/api/configuracoes', (req, res) => {
  res.json({
    servicos: { servicos }
  });
});

app.delete('/api/configuracoes/servicos/:id', (req, res) => {
  console.log('DELETE solicitado para serviço ID:', req.params.id);
  const index = servicos.findIndex(s => s.id === req.params.id);
  console.log('Índice encontrado:', index);

  if (index > -1) {
    const servicoRemovido = servicos.splice(index, 1)[0];
    console.log('Serviço removido:', servicoRemovido);
    res.json({ message: 'Serviço removido com sucesso', servicoRemovido });
  } else {
    res.status(404).json({ message: 'Serviço não encontrado' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
});