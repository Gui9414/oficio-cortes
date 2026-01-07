import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import agendamentoRoutes from './routes/agendamentoRoutes.js';
import barbeiroRoutes from './routes/barbeiroRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import configuracaoRoutes from './routes/configuracaoRoutes.js';
import { startNotificationScheduler } from './services/notificationService.js';

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/barbeiros', barbeiroRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/configuracoes', configuracaoRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});

// Conectar ao banco de dados e iniciar servidor
const iniciarServidor = async () => {
  try {
    await connectDB();
    console.log('✅ Conectado ao MongoDB');

    // Iniciar agendador de notificações
    startNotificationScheduler();
    console.log('✅ Agendador de notificações iniciado');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
