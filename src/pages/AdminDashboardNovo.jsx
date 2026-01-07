import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Users, Settings, TrendingUp, 
  ShoppingBag, BarChart3, PlusCircle, Eye, DollarSign,
  Activity, Star, ChevronRight, Check
} from 'lucide-react';
import api from '../services/api';
import './AdminDashboardPremium.css';

const AdminDashboard = () => {
  const [estatisticas, setEstatisticas] = useState({
    receitaHoje: 0,
    receitaSemana: 0,
    receitaMes: 0,
    agendamentosHoje: 0,
    agendamentosSemana: 0,
    clientesAtivos: 0,
    avaliacaoMedia: 0,
    vendasProdutos: 0,
    crescimentoDia: 0,
    crescimentoSemana: 0,
    crescimentoMes: 0,
    crescimentoAgendamentos: 0
  });

  const [agendamentosRecentes, setAgendamentosRecentes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
    carregarAgendamentos();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setEstatisticas(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setCarregando(false);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      const response = await api.get('/agendamentos');
      const hoje = new Date().toISOString().split('T')[0];
      const agendamentosHoje = response.data
        .filter(a => a.data === hoje)
        .sort((a, b) => a.horario.localeCompare(b.horario))
        .slice(0, 5);
      setAgendamentosRecentes(agendamentosHoje);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const marcarComoConcluido = async (id) => {
    try {
      await api.put(`/agendamentos/${id}/status`, { status: 'concluido' });
      await carregarAgendamentos();
      await carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
    }
  };

  if (carregando) {
    return (
      <div className="admin-dashboard">
        <div className="admin-header-premium">
          <div className="header-content">
            <div className="header-text">
              <h1>Carregando...</h1>
              <p>Obtendo dados do sistema</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Premium */}
      <div className="admin-header-premium">
        <div className="header-content">
          <div className="header-text">
            <h1>Painel Administrativo</h1>
            <p>Bem-vindo ao centro de controle do Ofício Cortes</p>
          </div>
          <div className="header-stats-mini">
            <div className="mini-stat">
              <TrendingUp size={20} />
              <span>
                {estatisticas.crescimentoSemana >= 0 ? '+' : ''}
                {estatisticas.crescimentoSemana}% esta semana
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas Premium */}
      <div className="stats-grid-premium">
        <div className="stat-card-premium primary">
          <div className="stat-header">
            <div className="stat-icon">
              <DollarSign size={28} />
            </div>
            <div className={`stat-trend ${estatisticas.crescimentoDia >= 0 ? 'positive' : 'negative'}`}>
              {estatisticas.crescimentoDia >= 0 ? '+' : ''}{estatisticas.crescimentoDia}%
            </div>
          </div>
          <div className="stat-content">
            <h3>Receita Hoje</h3>
            <p className="stat-value">R$ {estatisticas.receitaHoje?.toFixed(2)}</p>
            <span className="stat-subtitle">Agendamentos concluídos</span>
          </div>
        </div>

        <div className="stat-card-premium secondary">
          <div className="stat-header">
            <div className="stat-icon">
              <BarChart3 size={28} />
            </div>
            <div className={`stat-trend ${estatisticas.crescimentoSemana >= 0 ? 'positive' : 'negative'}`}>
              {estatisticas.crescimentoSemana >= 0 ? '+' : ''}{estatisticas.crescimentoSemana}%
            </div>
          </div>
          <div className="stat-content">
            <h3>Receita Semana</h3>
            <p className="stat-value">R$ {estatisticas.receitaSemana?.toFixed(2)}</p>
            <span className="stat-subtitle">Últimos 7 dias</span>
          </div>
        </div>

        <div className="stat-card-premium accent">
          <div className="stat-header">
            <div className="stat-icon">
              <TrendingUp size={28} />
            </div>
            <div className={`stat-trend ${estatisticas.crescimentoMes >= 0 ? 'positive' : 'negative'}`}>
              {estatisticas.crescimentoMes >= 0 ? '+' : ''}{estatisticas.crescimentoMes}%
            </div>
          </div>
          <div className="stat-content">
            <h3>Receita Mês</h3>
            <p className="stat-value">R$ {estatisticas.receitaMes?.toFixed(2)}</p>
            <span className="stat-subtitle">Últimos 30 dias</span>
          </div>
        </div>

        <div className="stat-card-premium info">
          <div className="stat-header">
            <div className="stat-icon">
              <Calendar size={28} />
            </div>
            <div className={`stat-trend ${estatisticas.crescimentoAgendamentos >= 0 ? 'positive' : 'negative'}`}>
              {estatisticas.crescimentoAgendamentos >= 0 ? '+' : ''}{estatisticas.crescimentoAgendamentos}%
            </div>
          </div>
          <div className="stat-content">
            <h3>Agendamentos Hoje</h3>
            <p className="stat-value">{estatisticas.agendamentosHoje}</p>
            <span className="stat-subtitle">{estatisticas.agendamentosSemana} esta semana</span>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="dashboard-grid">
        {/* Ações Rápidas Premium */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Ações Rápidas</h2>
            <span className="section-subtitle">Acesso direto às principais funções</span>
          </div>
          <div className="quick-actions-premium">
            <Link to="/agendamento" className="action-card-premium primary">
              <div className="action-icon">
                <PlusCircle size={32} />
              </div>
              <div className="action-content">
                <h3>Novo Agendamento</h3>
                <p>Agendar cliente rapidamente</p>
                <ChevronRight size={20} className="action-arrow" />
              </div>
            </Link>

            <Link to="/loja" className="action-card-premium secondary">
              <div className="action-icon">
                <ShoppingBag size={32} />
              </div>
              <div className="action-content">
                <h3>Gerenciar Loja</h3>
                <p>Produtos e vendas</p>
                <ChevronRight size={20} className="action-arrow" />
              </div>
            </Link>

            <Link to="/admin/relatorios" className="action-card-premium accent">
              <div className="action-icon">
                <BarChart3 size={32} />
              </div>
              <div className="action-content">
                <h3>Relatórios</h3>
                <p>Análises detalhadas</p>
                <ChevronRight size={20} className="action-arrow" />
              </div>
            </Link>

            <Link to="/admin/configuracoes" className="action-card-premium info">
              <div className="action-icon">
                <Settings size={32} />
              </div>
              <div className="action-content">
                <h3>Configurações</h3>
                <p>Horários e serviços</p>
                <ChevronRight size={20} className="action-arrow" />
              </div>
            </Link>
          </div>
        </div>

        {/* Agendamentos Recentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Agendamentos Recentes</h2>
            <Link to="/agendamentos" className="section-link">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="appointments-list">
            {agendamentosRecentes.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                Nenhum agendamento para hoje
              </p>
            ) : (
              agendamentosRecentes.map(agendamento => (
                <div key={agendamento._id} className="appointment-item">
                  <div className="appointment-time">
                    <Clock size={16} />
                    {agendamento.horario}
                  </div>
                  <div className="appointment-details">
                    <h4>{agendamento.cliente}</h4>
                    <span>{agendamento.servico} - R$ {agendamento.valor?.toFixed(2)}</span>
                  </div>
                  <div className={`appointment-status ${agendamento.status}`}>
                    {agendamento.status === 'confirmado' && 'Confirmado'}
                    {agendamento.status === 'pendente' && 'Pendente'}
                    {agendamento.status === 'concluido' && 'Concluído'}
                  </div>
                  {(agendamento.status === 'confirmado' || agendamento.status === 'pendente') && (
                    <button 
                      className="btn-concluir"
                      onClick={() => marcarComoConcluido(agendamento._id)}
                      title="Marcar como concluído"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Métricas Adicionais */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Performance</h2>
            <span className="section-subtitle">Indicadores de qualidade</span>
          </div>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon">
                <Users size={24} />
              </div>
              <div className="metric-data">
                <h3>{estatisticas.clientesAtivos}</h3>
                <span>Clientes Ativos</span>
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-icon">
                <Star size={24} />
              </div>
              <div className="metric-data">
                <h3>{estatisticas.avaliacaoMedia}</h3>
                <span>Avaliação Média</span>
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-icon">
                <ShoppingBag size={24} />
              </div>
              <div className="metric-data">
                <h3>R$ {estatisticas.vendasProdutos}</h3>
                <span>Vendas Produtos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;