import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

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
  origin: ["http://localhost:3000", "https://seusite.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Dados mock em memória (sem banco de dados)
const usuarios = [
  {
    _id: '1',
    nome: 'Admin',
    email: 'admin@oficiocortes.com',
    telefone: '11918474607',
    senha: '$2a$10$YourHashedPasswordHere', // admin123
    tipo: 'admin',
    createdAt: new Date()
  }
];

const barbeiros = [
  {
    id: '1',
    _id: '1',
    nome: 'Guilherme',
    bio: 'Barbeiro profissional com 5 anos de experiência',
    especialidades: ['Corte Clássico', 'Barba', 'Platinado'],
    ativo: true
  }
];

const servicos = [
  { id: '1', nome: 'Corte Clássico', preco: 45, duracao: 30, ativo: true },
  { id: '2', nome: 'Corte + Barba', preco: 70, duracao: 45, ativo: true },
  { id: '3', nome: 'Barba', preco: 35, duracao: 20, ativo: true },
  { id: '4', nome: 'Platinado', preco: 150, duracao: 90, ativo: true }
];

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

// Array vazio - apenas agendamentos reais feitos pelo site aparecerão
const agendamentos = [];

// Rotas de Autenticação
app.post('/api/auth/login', (req, res) => {
  const { telefone, senha, email } = req.body;
  
  // Aceita tanto telefone quanto email
  const loginEmail = email || (telefone === '11918474607' ? 'admin@oficiocortes.com' : `${telefone}@oficiocortes.com`);
  const loginTelefone = telefone || '11918474607';
  
  // Login admin
  if ((loginEmail === 'admin@oficiocortes.com' || loginTelefone === '11918474607') && senha === 'admin123') {
    res.json({
      token: 'mock-jwt-token-admin-12345',
      user: {
        _id: '1',
        nome: 'Admin',
        email: 'admin@oficiocortes.com',
        telefone: '11918474607',
        tipo: 'admin'
      }
    });
  } 
  // Login cliente de teste
  else if (loginTelefone && senha) {
    const usuario = usuarios.find(u => u.telefone === loginTelefone);
    if (usuario && senha === '123456') {
      res.json({
        token: `mock-jwt-token-${usuario._id}`,
        user: usuario
      });
    } else {
      res.status(401).json({ message: 'Telefone ou senha incorretos' });
    }
  }
  else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const novoUsuario = {
    _id: Date.now().toString(),
    ...req.body,
    tipo: 'cliente',
    createdAt: new Date()
  };
  usuarios.push(novoUsuario);
  
  res.status(201).json({
    token: 'mock-jwt-token-12345',
    user: novoUsuario
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    _id: '1',
    nome: 'Admin',
    email: 'admin@oficiocortes.com',
    telefone: '11918474607',
    tipo: 'admin'
  });
});

// Rotas de Barbeiros
app.get('/api/barbeiros', (req, res) => {
  res.json(barbeiros);
});

app.get('/api/barbeiros/:id/horarios', (req, res) => {
  const { data } = req.query;
  const horarios = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];
  res.json(horarios);
});

// Rotas de Produtos
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.post('/api/produtos', (req, res) => {
  const novoProduto = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

app.delete('/api/produtos/:id', (req, res) => {
  console.log('DELETE produto solicitado para ID:', req.params.id);
  console.log('Produtos disponíveis:', produtos.map(p => ({ id: p._id, nome: p.nome })));
  
  const index = produtos.findIndex(p => p._id === req.params.id);
  console.log('Índice encontrado para produto:', index);
  
  if (index > -1) {
    const produtoRemovido = produtos.splice(index, 1)[0];
    console.log('Produto removido:', produtoRemovido);
    res.json({ message: 'Produto removido com sucesso', produtoRemovido });
  } else {
    console.log('Produto não encontrado');
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

// Rotas de Agendamentos
app.get('/api/agendamentos', (req, res) => {
  res.json(agendamentos);
});

app.post('/api/agendamentos', (req, res) => {
  // Validação básica dos dados recebidos
  const { nomeCliente, telefoneCliente, servicoId, data, horario } = req.body;
  if (!nomeCliente || !telefoneCliente || !servicoId || !data || !horario) {
    return res.status(400).json({ message: 'Dados obrigatórios ausentes.' });
  }
  // Buscar nome do serviço pelo id
  let servicoAgendado = servicos.find(s => s.id === servicoId);
  const novoAgendamento = {
    _id: Date.now().toString(),
    nomeCliente,
    telefoneCliente,
    servicoId,
    servico: servicoAgendado ? servicoAgendado.nome : '-',
    data,
    horario,
    status: 'pendente',
    createdAt: new Date()
  };
  agendamentos.push(novoAgendamento);
  res.status(201).json(novoAgendamento);
});

app.put('/api/agendamentos/:id/status', (req, res) => {
  const { status } = req.body;
  const agendamento = agendamentos.find(a => a._id === req.params.id);
  
  if (!agendamento) {
    return res.status(404).json({ message: 'Agendamento não encontrado' });
  }
  
  agendamento.status = status;
  res.json(agendamento);
});

app.get('/api/agendamentos/meus', (req, res) => {
  res.json(agendamentos);
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
  
  while (horaAtual < horaFim || (horaAtual === horaFim && minAtual < minFim)) {
    const horarioStr = `${String(horaAtual).padStart(2, '0')}:${String(minAtual).padStart(2, '0')}`;
    
    // Verificar se já existe agendamento neste horário
    const agendamentoExistente = agendamentos.find(
      a => a.data === data && a.horario === horarioStr && a.status !== 'cancelado'
    );
    
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
});

// Rotas de Configurações
app.get('/api/configuracoes', (req, res) => {
  res.json({
    horarios: {
      horariosFuncionamento
    },
    servicos: { servicos },
    geral: {}
  });
});

app.put('/api/configuracoes/horarios', (req, res) => {
  if (req.body.horariosFuncionamento) {
    horariosFuncionamento = req.body.horariosFuncionamento;
  }
  res.json({ message: 'Horários atualizados', horariosFuncionamento });
});

app.post('/api/configuracoes/servicos', (req, res) => {
  console.log('🔵 POST /api/configuracoes/servicos recebido');
  console.log('📦 Body recebido:', req.body);
  
  const novoServico = {
    id: Date.now().toString(),
    ...req.body,
    ativo: true
  };
  
  console.log('✅ Novo serviço criado:', novoServico);
  servicos.push(novoServico);
  console.log('📋 Total de serviços agora:', servicos.length);
  
  res.status(201).json(novoServico);
  console.log('✉️ Resposta enviada com sucesso');
});

app.put('/api/configuracoes/servicos/:id', (req, res) => {
  const index = servicos.findIndex(s => s.id === req.params.id);
  if (index > -1) {
    servicos[index] = { ...servicos[index], ...req.body };
    res.json(servicos[index]);
  } else {
    res.status(404).json({ message: 'Serviço não encontrado' });
  }
});

app.delete('/api/configuracoes/servicos/:id', (req, res) => {
  console.log('DELETE solicitado para serviço ID:', req.params.id);
  console.log('Serviços disponíveis:', servicos.map(s => ({ id: s.id, nome: s.nome })));
  
  const index = servicos.findIndex(s => s.id === req.params.id);
  console.log('Índice encontrado:', index);
  
  if (index > -1) {
    const servicoRemovido = servicos.splice(index, 1)[0];
    console.log('Serviço removido:', servicoRemovido);
    res.json({ message: 'Serviço removido com sucesso', servicoRemovido });
  } else {
    console.log('Serviço não encontrado');
    res.status(404).json({ message: 'Serviço não encontrado' });
  }
});

// Rota para estatísticas do dashboard
app.get('/api/dashboard/stats', (req, res) => {
  const hoje = new Date().toISOString().split('T')[0];
  const ontem = new Date(Date.now() - 1*86400000).toISOString().split('T')[0];
  const seteDiasAtras = new Date(Date.now() - 7*86400000).toISOString().split('T')[0];
  const quatorzeDiasAtras = new Date(Date.now() - 14*86400000).toISOString().split('T')[0];
  const trintaDiasAtras = new Date(Date.now() - 30*86400000).toISOString().split('T')[0];
  const sessentaDiasAtras = new Date(Date.now() - 60*86400000).toISOString().split('T')[0];

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
  console.log('   Email: admin@oficiocortes.com');
  console.log('   Senha: admin123\n');
  console.log('✅ Pronto para usar!\n');
});
