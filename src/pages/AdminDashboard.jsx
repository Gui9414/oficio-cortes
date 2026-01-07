import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Settings } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [estatisticas, setEstatisticas] = useState({
    receitaDia: 450,
    receitaSemana: 2100,
    receitaMes: 8500,
    agendamentosDia: 12
  });
  const [carregando, setCarregando] = useState(false);

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
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <p>Bem-vindo ao painel de controle do Ofício Cortes</p>
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
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="estatisticas-grid">
          <div className="estat-card card">
            <div className="estat-icone">
              <FaDollarSign />
            </div>
            <div className="estat-info">
              <p className="estat-label">Receita do Dia</p>
              <h2 className="estat-valor">R$ {estatisticas.receitaDia.toFixed(2)}</h2>
            </div>
          </div>

          <div className="estat-card card">
            <div className="estat-icone">
              <Calendar />
            </div>
            <div className="estat-info">
              <p className="estat-label">Receita da Semana</p>
              <h2 className="estat-valor">R$ {estatisticas.receitaSemana.toFixed(2)}</h2>
            </div>
          </div>

          <div className="estat-card card">
            <div className="estat-icone">
              <Clock />
            </div>
            <div className="estat-info">
              <p className="estat-label">Receita do Mês</p>
              <h2 className="estat-valor">R$ {estatisticas.receitaMes.toFixed(2)}</h2>
            </div>
          </div>

          <div className="estat-card card">
            <div className="estat-icone">
              <Users />
            </div>
            <div className="estat-info">
              <p className="estat-label">Agendamentos Hoje</p>
              <h2 className="estat-valor">{estatisticas.agendamentosDia}</h2>
            </div>
          </div>
        </div>

        {/* Filtro de Data */}
        <div className="filtro-data">
          <label>
            <Calendar /> Filtrar por Data
          </label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>

        {/* Lista de Agendamentos */}
        <div className="agendamentos-container card">
          <h2>Agendamentos</h2>
          
          {carregando ? (
            <div className="loading-container">
              <div className="loading"></div>
            </div>
          ) : agendamentos.length > 0 ? (
            <div className="agendamentos-lista">
              {agendamentos.map(agendamento => (
                <div key={agendamento._id} className="agendamento-item">
                  <div className="agendamento-info">
                    <div className="agendamento-horario">
                      <Clock />
                      <strong>{formatarHorario(agendamento.horario)}</strong>
                    </div>
                    <div className="agendamento-detalhes">
                      <p className="cliente-nome">
                        <Users /> {agendamento.cliente.nome}
                      </p>
                      <p className="servico-nome">
                        {agendamento.servico.nome}
                      </p>
                      <p className="servico-preco">
                        R$ {agendamento.servico.preco.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="agendamento-acoes">
                    <span className={`badge ${getStatusBadge(agendamento.status).classe}`}>
                      {getStatusBadge(agendamento.status).texto}
                    </span>
                    
                    {agendamento.status === 'confirmado' && (
                      <div className="acoes-buttons">
                        <button
                          className="btn-acao btn-concluir"
                          onClick={() => handleAtualizarStatus(agendamento._id, 'concluido')}
                          title="Marcar como concluído"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn-acao btn-cancelar"
                          onClick={() => handleAtualizarStatus(agendamento._id, 'cancelado')}
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="sem-agendamentos">Nenhum agendamento para esta data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

