import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Scissors, DollarSign, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminCalendar.css';

const AdminCalendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dataAtual, setDataAtual] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [estatisticas, setEstatisticas] = useState({
    totalDia: 0,
    receitaDia: 0,
    totalSemana: 0,
    receitaSemana: 0
  });

  useEffect(() => {
    carregarAgendamentos();
  }, [dataAtual]);

  const carregarAgendamentos = async () => {
    setCarregando(true);
    try {
      const dataFormatada = dataAtual.toISOString().split('T')[0];
      const response = await api.get(`/agendamentos?data=${dataFormatada}`);
      const agendamentosOrdenados = response.data.sort((a, b) => 
        a.horario.localeCompare(b.horario)
      );
      setAgendamentos(agendamentosOrdenados);
      
      // Calcular estatísticas do dia
      const total = agendamentosOrdenados.length;
      const receita = agendamentosOrdenados.reduce((acc, ag) => acc + ag.servico.preco, 0);
      
      // Calcular estatísticas da semana
      const inicioSemana = getStartOfWeek(dataAtual);
      const fimSemana = getEndOfWeek(dataAtual);
      
      setEstatisticas({ 
        totalDia: total, 
        receitaDia: receita,
        totalSemana: 0,
        receitaSemana: 0
      });
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    } finally {
      setCarregando(false);
    }
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (6 - day);
    return new Date(d.setDate(diff));
  };

  const getDiasSemanaPadrao = () => {
    const hoje = new Date(dataAtual);
    const diaSemana = hoje.getDay();
    const primeiroDia = new Date(hoje);
    primeiroDia.setDate(hoje.getDate() - diaSemana);
    
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(primeiroDia);
      dia.setDate(primeiroDia.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const diasSemana = getDiasSemanaPadrao();
  const primeiroDia = diasSemana[0];
  const ultimoDia = diasSemana[6];

  const formatarPeriodoSemana = () => {
    const opcoes = { day: '2-digit', month: 'short', year: 'numeric' };
    const inicio = primeiroDia.toLocaleDateString('pt-BR', opcoes);
    const fim = ultimoDia.toLocaleDateString('pt-BR', opcoes);
    return `${inicio} à ${fim}`;
  };

  const mudarSemana = (direcao) => {
    const novaData = new Date(dataAtual);
    novaData.setDate(novaData.getDate() + (direcao * 7));
    setDataAtual(novaData);
  };

  const selecionarDia = (dia) => {
    setDataAtual(new Date(dia));
  };

  const isDiaAtual = (dia) => {
    const hoje = new Date();
    return dia.toDateString() === hoje.toDateString();
  };

  const isDiaSelecionado = (dia) => {
    return dia.toDateString() === dataAtual.toDateString();
  };

  const getNomeDia = (dia) => {
    const nomes = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    return nomes[dia.getDay()];
  };

  return (
    <div className="admin-calendar-modern">
      {/* Header */}
      <div className="calendar-header-top">
        <div className="header-greeting">
          <h1>Olá, {user?.nome || 'Guilherme'}</h1>
          <p>Você está no seu calendário</p>
        </div>
      </div>

      {/* Navegação de Semana */}
      <div className="week-navigation">
        <button className="btn-nav-week" onClick={() => mudarSemana(-1)}>
          <ChevronLeft size={20} />
        </button>
        <div className="week-period">
          <Calendar size={18} />
          <span>{formatarPeriodoSemana()}</span>
        </div>
        <button className="btn-nav-week" onClick={() => mudarSemana(1)}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dias da Semana */}
      <div className="week-days-grid">
        {diasSemana.map((dia, index) => (
          <div
            key={index}
            className={`day-card ${isDiaSelecionado(dia) ? 'selected' : ''} ${isDiaAtual(dia) ? 'today' : ''}`}
            onClick={() => selecionarDia(dia)}
          >
            <div className="day-name">{getNomeDia(dia)}</div>
            <div className="day-number">{dia.getDate().toString().padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-cards-row">
        <div className="stat-card-modern today">
          <div className="stat-header">
            <h3>Hoje</h3>
          </div>
          <div className="stat-values">
            <div className="stat-value-item">
              <span className="stat-icon">R$</span>
              <span className="stat-number">{estatisticas.receitaDia.toFixed(2)}</span>
            </div>
            <div className="stat-count">{estatisticas.totalDia}</div>
          </div>
        </div>

        <div className="stat-card-modern week">
          <div className="stat-header">
            <h3>Esta semana</h3>
          </div>
          <div className="stat-values">
            <div className="stat-value-item">
              <span className="stat-icon">R$</span>
              <span className="stat-number">{estatisticas.receitaSemana.toFixed(2)}</span>
            </div>
            <div className="stat-count">{estatisticas.totalSemana}</div>
          </div>
        </div>
      </div>

      {/* Timeline de Agendamentos */}
      <div className="timeline-area">
        {carregando ? (
          <div className="loading-center">
            <div className="loading"></div>
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="empty-timeline">
            <p className="time-label">09:00</p>
            <p className="time-label">10:00</p>
          </div>
        ) : (
          <div className="timeline-list">
            {agendamentos.map((agendamento) => (
              <div key={agendamento._id} className={`timeline-appointment status-${agendamento.status}`}>
                <div className="appointment-time">
                  <Clock size={16} />
                  <span>{agendamento.horario}</span>
                </div>
                <div className="appointment-details">
                  <div className="detail-row">
                    <User size={16} />
                    <strong>
                      {typeof agendamento.cliente === 'object' && agendamento.cliente.nome 
                        ? agendamento.cliente.nome 
                        : agendamento.cliente?.nome || 'Cliente'}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <Phone size={16} />
                    <span>
                      {typeof agendamento.cliente === 'object' && agendamento.cliente.telefone
                        ? agendamento.cliente.telefone
                        : agendamento.cliente?.telefone || 'Sem telefone'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <Scissors size={16} />
                    <span>{agendamento.servico.nome}</span>
                    <span className="price">R$ {agendamento.servico.preco.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão Novo Agendamento */}
      <button className="btn-new-schedule" onClick={() => navigate('/agendamento')}>
        <span>Novo Agendamento</span>
        <div className="btn-arrow">→</div>
      </button>
    </div>
  );
};

export default AdminCalendar;
