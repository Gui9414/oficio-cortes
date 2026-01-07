import React, { useState, useEffect } from 'react';
import { agendamentoService } from '../services/agendamentoService';
import { Calendar, Clock, Scissors, X } from 'lucide-react';
import './MeusAgendamentos.css';

const MeusAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    setCarregando(true);
    try {
      const data = await agendamentoService.meus();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) {
      return;
    }

    try {
      await agendamentoService.cancelar(id);
      carregarAgendamentos();
    } catch (error) {
      alert('Erro ao cancelar agendamento');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendente: { texto: 'Pendente', classe: 'badge-pendente' },
      confirmado: { texto: 'Confirmado', classe: 'badge-confirmado' },
      concluido: { texto: 'Concluído', classe: 'badge-concluido' },
      cancelado: { texto: 'Cancelado', classe: 'badge-cancelado' }
    };
    return badges[status] || badges.pendente;
  };

  // Separar agendamentos por status
  const agendamentosAtivos = agendamentos.filter(a => ['pendente', 'confirmado'].includes(a.status));
  const agendamentosHistorico = agendamentos.filter(a => ['concluido', 'cancelado'].includes(a.status));

  return (
    <div className="meus-agendamentos-page">
      <div className="container">
        <h1 className="page-title">Meus Agendamentos</h1>

        {carregando ? (
          <div className="loading-container">
            <div className="loading"></div>
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            {/* Agendamentos Ativos */}
            {agendamentosAtivos.length > 0 && (
              <section className="agendamentos-section">
                <h2>Próximos Agendamentos</h2>
                <div className="agendamentos-grid">
                  {agendamentosAtivos.map(agendamento => (
                    <div key={agendamento._id} className="agendamento-card card">
                      <div className="card-header">
                        <span className={`badge ${getStatusBadge(agendamento.status).classe}`}>
                          {getStatusBadge(agendamento.status).texto}
                        </span>
                        {agendamento.status === 'confirmado' && (
                          <button
                            className="btn-cancelar-card"
                            onClick={() => handleCancelar(agendamento._id)}
                            title="Cancelar agendamento"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <div className="card-body">
                        <div className="info-row">
                          <Calendar />
                          <span>
                            {new Date(agendamento.data).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="info-row">
                          <Clock />
                          <span>{agendamento.horario}</span>
                        </div>

                        <div className="info-row">
                          <Scissors />
                          <span>{agendamento.servico.nome}</span>
                        </div>

                        <div className="preco-row">
                          <strong>Valor:</strong>
                          <span className="preco">R$ {agendamento.servico.preco.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Histórico */}
            {agendamentosHistorico.length > 0 && (
              <section className="agendamentos-section">
                <h2>Histórico</h2>
                <div className="historico-lista">
                  {agendamentosHistorico.map(agendamento => (
                    <div key={agendamento._id} className="historico-item card">
                      <div className="historico-data">
                        <Calendar />
                        <span>{new Date(agendamento.data).toLocaleDateString('pt-BR')}</span>
                        <span>{agendamento.horario}</span>
                      </div>
                      <div className="historico-info">
                        <span>{agendamento.servico.nome}</span>
                        <span className="preco">R$ {agendamento.servico.preco.toFixed(2)}</span>
                      </div>
                      <span className={`badge ${getStatusBadge(agendamento.status).classe}`}>
                        {getStatusBadge(agendamento.status).texto}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sem agendamentos */}
            {agendamentos.length === 0 && (
              <div className="sem-agendamentos card">
                <Calendar />
                <p>Você ainda não tem agendamentos</p>
                <a href="/agendamento" className="btn btn-primary">
                  Fazer Agendamento
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MeusAgendamentos;


