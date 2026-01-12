import Horario from './models/Horario.js';
dotenv.config();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database-mongo.js';

dotenv.config();

// Conectar ao MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares

// Segurança: Helmet para headers
app.use(helmet());

// Segurança: Limite de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Segurança: CORS restrito
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://oficiocortes.com",
    "https://www.oficiocortes.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());




import Servico from './models/Servico.js';
import Usuario from './models/Usuario.js';
import Barbeiro from './models/Barbeiro.js';
import Agendamento from './models/Agendamento.js';

let horariosFuncionamento = {
  segunda: { abertura: '08:00', fechamento: '18:00', ativo: true },
  terca: { abertura: '08:00', fechamento: '18:00', ativo: true },
  quarta: { abertura: '08:00', fechamento: '18:00', ativo: true },
  quinta: { abertura: '08:00', fechamento: '18:00', ativo: true },
  sexta: { abertura: '08:00', fechamento: '18:00', ativo: true },
  sabado: { abertura: '08:00', fechamento: '17:00', ativo: true },
  domingo: { abertura: '08:00', fechamento: '14:00', ativo: false }
};

const produtos = [
  { 
    _id: '1', 
    nome: 'Pomada Modeladora', 
    preco: 35.90, 
    categoria: 'pomada',
    descricao: 'Pomada de alta fixação',
    estoque: 10
  },
  { 
    _id: '2', 
    nome: 'Shampoo Premium', 
    preco: 45.00, 
    categoria: 'cuidados',
    descricao: 'Shampoo para barba e cabelo',
    estoque: 15
  }
];




// Rotas de Autenticação (MongoDB)
app.post('/api/auth/login', async (req, res) => {
  const { telefone, senha, email } = req.body;
  try {
    // Admin fixo
    if ((email === 'gui5herme84@Gmail.com' || telefone === '11918474607') && senha === 'Oficio@Cortes#9X7!R') {
      return res.json({
        token: 'mock-jwt-token-admin-12345',
        user: {
          _id: '1',
          nome: 'Admin',
          email: 'gui5herme84@Gmail.com',
          telefone: '11918474607',
          tipo: 'admin'
        }
      });
    }
    // Cliente
    const usuario = await Usuario.findOne({ telefone });
    if (usuario && senha === '123456') {
      return res.json({
        token: `mock-jwt-token-${usuario._id}`,
        user: usuario
      });
    }
    return res.status(401).json({ message: 'Telefone ou senha incorretos' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao autenticar', error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const novoUsuario = new Usuario({ ...req.body, tipo: 'cliente', createdAt: new Date() });
    await novoUsuario.save();
    res.status(201).json({
      token: `mock-jwt-token-${novoUsuario._id}`,
      user: novoUsuario
    });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  // Simples: retorna admin fixo
  res.json({
    _id: '1',
    nome: 'Admin',
    email: 'gui5herme84@Gmail.com',
    telefone: '11918474607',
    tipo: 'admin'
  });
});

// Rotas de Barbeiros (MongoDB)
app.get('/api/barbeiros', async (req, res) => {
  try {
    const barbeiros = await Barbeiro.find();
    res.json(barbeiros);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar barbeiros', error: err.message });
  }
});

app.get('/api/barbeiros/:id/horarios', async (req, res) => {
  // TODO: Implementar horários por barbeiro se necessário
  res.json(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']);
});

// Rotas de Produtos com persistência MongoDB
import Produto from './models/Produto.js';

// Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: err.message });
  }
});

// Criar novo produto
app.post('/api/produtos', async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar produto', error: err.message });
  }
});

// Deletar produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const produtoRemovido = await Produto.findByIdAndDelete(req.params.id);
    if (produtoRemovido) {
      res.json({ message: 'Produto removido com sucesso', produtoRemovido });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover produto', error: err.message });
  }
});


// Rotas de Agendamentos (MongoDB)
app.get('/api/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error: err.message });
  }
});

app.post('/api/agendamentos', async (req, res) => {
  const { nomeCliente, telefoneCliente, servicoId, data, horario } = req.body;
  if (!nomeCliente || !telefoneCliente || !servicoId || !data || !horario) {
    return res.status(400).json({ message: 'Dados obrigatórios ausentes.' });
  }
  try {
    const servicoAgendado = await Servico.findById(servicoId);
    const novoAgendamento = new Agendamento({
      nomeCliente,
      telefoneCliente,
      servicoId,
      servico: servicoAgendado ? servicoAgendado.nome : '-',
      data,
      horario,
      status: 'pendente',
      createdAt: new Date()
    });
    await novoAgendamento.save();
    res.status(201).json(novoAgendamento);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar agendamento', error: err.message });
  }
});

app.put('/api/agendamentos/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const agendamento = await Agendamento.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json(agendamento);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar status', error: err.message });
  }
});

app.get('/api/agendamentos/meus', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error: err.message });
  }
});

// Buscar horários disponíveis
app.get('/api/agendamentos/horarios-disponiveis', (req, res) => {
  const { barbeiroId, data } = req.query;
  
  if (!data) {
    return res.status(400).json({ message: 'Data é obrigatória' });
  }

  // Descobrir dia da semana
  const dataSelecionada = new Date(data + 'T00:00:00');
  const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const diaSemana = diasSemana[dataSelecionada.getDay()];
  
  const horarioDia = horariosFuncionamento[diaSemana];
  
  // Se o dia não está ativo, retorna array vazio
  if (!horarioDia || !horarioDia.ativo) {
    return res.json([]);
  }

  // Gerar slots de 30 em 30 minutos
  const horarios = [];
  const [horaInicio, minInicio] = horarioDia.abertura.split(':').map(Number);
  const [horaFim, minFim] = horarioDia.fechamento.split(':').map(Number);
  let horaAtual = horaInicio;
  let minAtual = minInicio;
  (async () => {
    while (horaAtual < horaFim || (horaAtual === horaFim && minAtual < minFim)) {
      const horarioStr = `${String(horaAtual).padStart(2, '0')}:${String(minAtual).padStart(2, '0')}`;
      // Verificar se já existe agendamento neste horário (MongoDB)
      const agendamentoExistente = await Agendamento.findOne({ data, horario: horarioStr, status: { $ne: 'cancelado' } });
      if (!agendamentoExistente) {
        horarios.push(horarioStr);
      }
      // Incrementar 30 minutos
      minAtual += 30;
      if (minAtual >= 60) {
        minAtual = 0;
        horaAtual += 1;
      }
    }
    res.json(horarios);
  })();
});


// Rotas de Horários (persistência MongoDB)
// Listar horários
app.get('/api/configuracoes/horarios', async (req, res) => {
  try {
    const horarios = await Horario.find();
    res.json(horarios);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar horários', error: err.message });
  }
});

// Atualizar todos os horários (substitui todos)
app.put('/api/configuracoes/horarios', async (req, res) => {
  try {
    if (req.body.horariosFuncionamento) {
      // Remove todos e insere os novos
      await Horario.deleteMany({});
      await Horario.insertMany(Object.entries(req.body.horariosFuncionamento).map(([dia, h]) => ({ dia, ...h })));
    }
    const horarios = await Horario.find();
    res.json({ message: 'Horários atualizados', horarios });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar horários', error: err.message });
  }
});


// Criar novo serviço
app.post('/api/configuracoes/servicos', async (req, res) => {
  try {
    const servico = new Servico({ ...req.body, ativo: true });
    await servico.save();
    res.status(201).json(servico);
  } catch (err) {
    console.error('Erro ao criar serviço:', err);
    res.status(500).json({ message: 'Erro ao criar serviço', error: err.message });
  }
});


// Atualizar serviço
app.put('/api/configuracoes/servicos/:id', async (req, res) => {
  try {
    const servico = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    res.json(servico);
  } catch (err) {
    console.error('Erro ao atualizar serviço:', err);
    res.status(500).json({ message: 'Erro ao atualizar serviço', error: err.message });
  }
});


// Deletar serviço
app.delete('/api/configuracoes/servicos/:id', async (req, res) => {
  try {
    const servicoRemovido = await Servico.findByIdAndDelete(req.params.id);
    if (!servicoRemovido) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    res.json({ message: 'Serviço removido com sucesso', servicoRemovido });
  } catch (err) {
    console.error('Erro ao remover serviço:', err);
    res.status(500).json({ message: 'Erro ao remover serviço', error: err.message });
  }
});

// Listar todos os serviços
app.get('/api/configuracoes/servicos', async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (err) {
    console.error('Erro ao buscar serviços:', err);
    res.status(500).json({ message: 'Erro ao buscar serviços', error: err.message });
  }
});

// Rota para estatísticas do dashboard
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(Date.now() - 1*86400000).toISOString().split('T')[0];
    const seteDiasAtras = new Date(Date.now() - 7*86400000).toISOString().split('T')[0];
    const quatorzeDiasAtras = new Date(Date.now() - 14*86400000).toISOString().split('T')[0];
    const trintaDiasAtras = new Date(Date.now() - 30*86400000).toISOString().split('T')[0];
    const sessentaDiasAtras = new Date(Date.now() - 60*86400000).toISOString().split('T')[0];

    const agendamentos = await Agendamento.find();

    // === RECEITA HOJE (apenas agendamentos CONCLUÍDOS) ===
    const receitaHoje = agendamentos
      .filter(a => a.data === hoje && a.status === 'concluido')
      .reduce((total, a) => total + (a.valor || 0), 0);

    // Receita ontem para comparação
    const receitaOntem = agendamentos
      .filter(a => a.data === ontem && a.status === 'concluido')
      .reduce((total, a) => total + (a.valor || 0), 0);
    
    const crescimentoDia = receitaOntem > 0 ? ((receitaHoje - receitaOntem) / receitaOntem * 100) : (receitaHoje > 0 ? 100 : 0);

    // === RECEITA SEMANA (últimos 7 dias - apenas concluídos) ===
    const receitaSemana = agendamentos
      .filter(a => a.data >= seteDiasAtras && a.status === 'concluido')
      .reduce((total, a) => total + (a.valor || 0), 0);

    // Receita semana anterior (7-14 dias atrás)
    const receitaSemanaAnterior = agendamentos
      .filter(a => a.data >= quatorzeDiasAtras && a.data < seteDiasAtras && a.status === 'concluido')
      .reduce((total, a) => total + (a.valor || 0), 0);
    
    const crescimentoSemana = receitaSemanaAnterior > 0 ? ((receitaSemana - receitaSemanaAnterior) / receitaSemanaAnterior * 100) : (receitaSemana > 0 ? 100 : 0);

    // === RECEITA MÊS (últimos 30 dias - apenas concluídos) ===
    const receitaMes = agendamentos
      .filter(a => a.data >= trintaDiasAtras && a.status === 'concluido')
      .reduce((total, a) => total + (a.valor || 0), 0);

    // Receita mês anterior (30-60 dias atrás)
    const receitaMesAnterior = agendamentos
      .filter(a => a.data >= sessentaDiasAtras && a.data < trintaDiasAtras && a.status === 'concluido')
      .reduce((total, a) => total + (a.valor || 0), 0);
    
    const crescimentoMes = receitaMesAnterior > 0 ? ((receitaMes - receitaMesAnterior) / receitaMesAnterior * 100) : (receitaMes > 0 ? 100 : 0);

    // === AGENDAMENTOS ===
    // Agendamentos hoje (TODOS os agendamentos do dia, não só concluídos)
    const agendamentosHoje = agendamentos
      .filter(a => a.data === hoje).length;

    // Agendamentos da semana
    const agendamentosSemana = agendamentos
      .filter(a => a.data >= seteDiasAtras).length;

    // Agendamentos semana anterior
    const agendamentosSemanaAnterior = agendamentos
      .filter(a => a.data >= quatorzeDiasAtras && a.data < seteDiasAtras).length;
    
    const crescimentoAgendamentos = agendamentosSemanaAnterior > 0 
      ? ((agendamentosSemana - agendamentosSemanaAnterior) / agendamentosSemanaAnterior * 100) 
      : (agendamentosSemana > 0 ? 100 : 0);

    // Clientes ativos (clientes com agendamentos nos últimos 30 dias)
    const clientesAtivos = [...new Set(
      agendamentos
        .filter(a => a.data >= trintaDiasAtras)
        .map(a => a.cliente)
    )].length;

    // Avaliação média (simulada)
    const avaliacaoMedia = 4.8;

    // Vendas de produtos do mês (apenas produtos realmente vendidos - atualmente 0)
    const vendasProdutos = 0;

    res.json({
      receitaHoje,
      receitaSemana,
      receitaMes,
      agendamentosHoje,
      agendamentosSemana,
      clientesAtivos,
      avaliacaoMedia,
      vendasProdutos,
      // Percentuais de crescimento
      crescimentoDia: Math.round(crescimentoDia),
      crescimentoSemana: Math.round(crescimentoSemana),
      crescimentoMes: Math.round(crescimentoMes),
      crescimentoAgendamentos: Math.round(crescimentoAgendamentos)
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando (Firebase Ready)' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                                                    ║');
  console.log('║     🔥 SERVIDOR FIREBASE READY 🔥                 ║');
  console.log('║                                                    ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api\n`);
  console.log('🔐 Login de teste:');
  console.log('   Email: gui5herme84@Gmail.com');
  console.log('   Senha: admin123\n');
  console.log('✅ Pronto para usar!\n');
});
