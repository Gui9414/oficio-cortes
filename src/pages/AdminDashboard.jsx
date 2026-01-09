import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [estatisticas, setEstatisticas] = useState({
    receitaDia: 0,
    receitaSemana: 0,
    receitaMes: 0,
    agendamentosDia: 0
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const response = await api.get(`/agendamentos?data=${hoje}`);
      
      const agendamentos = response.data || [];
      
      // Calcular estatísticas reais
      const agora = new Date();
      const inicioDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
      const inicioSemana = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - agora.getDay());
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      
      let receitaDia = 0;
      let receitaSemana = 0;
      let receitaMes = 0;
      let agendamentosDia = 0;
      
      agendamentos.forEach(agendamento => {
        const dataAgendamento = new Date(agendamento.data);
        const preco = agendamento.servico?.preco || 0;
        
        if (dataAgendamento >= inicioDia && agendamento.status === 'concluido') {
          receitaDia += preco;
          agendamentosDia++;
        }
        
        if (dataAgendamento >= inicioSemana && agendamento.status === 'concluido') {
          receitaSemana += preco;
        }
        
        if (dataAgendamento >= inicioMes && agendamento.status === 'concluido') {
          receitaMes += preco;
        }
      });
      
      setEstatisticas({
        receitaDia,
        receitaSemana,
        receitaMes,
        agendamentosDia
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Seção de Agendamentos Detalhados */}
      <div className="admin-agendamentos-section">
        <h2>Ver Agendamentos</h2>
        <p>Acompanhe todos os agendamentos por dia, semana ou mês, com detalhes do cliente e serviço.</p>
        <Link to="/admin/agendamentos" className="btn-agendamentos">Ver Agendamentos</Link>
      </div>
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <p>Bem-vindo, {user?.nome || user?.email || 'Guilherme'}!</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={32} />
          </div>
          <div className="stat-content">
            <h3>Receita Hoje</h3>
            <p className="stat-value">R$ {estatisticas.receitaDia?.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={32} />
          </div>
          <div className="stat-content">
            <h3>Receita Semana</h3>
            <p className="stat-value">R$ {estatisticas.receitaSemana?.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-content">
            <h3>Receita Mês</h3>
            <p className="stat-value">R$ {estatisticas.receitaMes?.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={32} />
          </div>
          <div className="stat-content">
            <h3>Agendamentos Hoje</h3>
            <p className="stat-value">{estatisticas.agendamentosDia}</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="quick-actions">
        <h2>Ações Rápidas</h2>
        <div className="actions-grid">
          <Link to="/admin/configuracoes" className="action-card">
            <Settings size={32} />
            <h3>Configurações</h3>
            <p>Gerenciar horários, serviços e produtos</p>
          </Link>

          <Link to="/agendamento" className="action-card">
            <Calendar size={32} />
            <h3>Novo Agendamento</h3>
            <p>Criar agendamento para cliente</p>
          </Link>

          <Link to="/loja" className="action-card">
            <Users size={32} />
            <h3>Loja</h3>
            <p>Visualizar produtos</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

