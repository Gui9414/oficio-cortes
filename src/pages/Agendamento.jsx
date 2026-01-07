import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { agendamentoService } from '../services/agendamentoService';
import { Calendar, Check } from 'lucide-react';
import './Agendamento.css';

const Agendamento = () => {
  const { user } = useAuth();
  const { barbeiros, servicos, buscarHorariosDisponiveis } = useApp();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState(1);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Buscar horários quando data for selecionada
  useEffect(() => {
    if (dataSelecionada && barbeiroSelecionado) {
      carregarHorarios();
    }
  }, [dataSelecionada, barbeiroSelecionado]);

  const carregarHorarios = async () => {
    setCarregando(true);
    const horarios = await buscarHorariosDisponiveis(barbeiroSelecionado.id, dataSelecionada);
    setHorariosDisponiveis(horarios);
    setCarregando(false);
  };

  const proximaEtapa = () => {
    setErro('');
    if (etapa === 1 && !barbeiroSelecionado) {
      setErro('Selecione um barbeiro');
      return;
    }
    if (etapa === 2 && !servicoSelecionado) {
      setErro('Selecione um serviço');
      return;
    }
    if (etapa === 3 && (!dataSelecionada || !horarioSelecionado)) {
      setErro('Selecione uma data e horário');
      return;
    }
    setEtapa(etapa + 1);
  };

  const etapaAnterior = () => {
    setErro('');
    setEtapa(etapa - 1);
  };

  const confirmarAgendamento = async () => {
    setCarregando(true);
    setErro('');

    try {
      await agendamentoService.criar({
        barbeiroId: barbeiroSelecionado.id,
        servicoId: servicoSelecionado.id,
        data: dataSelecionada,
        horario: horarioSelecionado
      });

      setSucesso(true);
      setTimeout(() => {
        navigate('/meus-agendamentos');
      }, 2000);
    } catch (error) {
      setErro(error.message || 'Erro ao criar agendamento');
    } finally {
      setCarregando(false);
    }
  };

  // Data mínima é hoje
  const dataMinima = new Date().toISOString().split('T')[0];
  
  // Data máxima é 30 dias no futuro
  const dataMaxima = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  if (sucesso) {
    return (
      <div className="agendamento-page">
        <div className="container">
          <div className="sucesso-container">
            <div className="sucesso-icone">
              <Check size={64} />
            </div>
            <h2>Agendamento Confirmado!</h2>
            <p>Seu horário foi agendado com sucesso.</p>
            <p>Você receberá uma confirmação e um lembrete antes do horário.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agendamento-page">
      <div className="container">
        <h1 className="page-title">Agendar Horário</h1>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={`progress-step ${etapa >= 1 ? 'active' : ''} ${etapa > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Barbeiro</span>
          </div>
          <div className={`progress-line ${etapa > 1 ? 'completed' : ''}`}></div>
          <div className={`progress-step ${etapa >= 2 ? 'active' : ''} ${etapa > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Serviço</span>
          </div>
          <div className={`progress-line ${etapa > 2 ? 'completed' : ''}`}></div>
          <div className={`progress-step ${etapa >= 3 ? 'active' : ''} ${etapa > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span>Data e Hora</span>
          </div>
          <div className={`progress-line ${etapa > 3 ? 'completed' : ''}`}></div>
          <div className={`progress-step ${etapa >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Confirmação</span>
          </div>
        </div>

        {erro && <div className="alert alert-erro">{erro}</div>}

        {/* Etapa 1 - Selecionar Barbeiro */}
        {etapa === 1 && (
          <div className="etapa-content fade-in">
            <h2>Escolha seu Barbeiro</h2>
            <div className="barbeiros-grid">
              {barbeiros.map(barbeiro => (
                <div
                  key={barbeiro.id}
                  className={`barbeiro-card card ${barbeiroSelecionado?.id === barbeiro.id ? 'selecionado' : ''}`}
                  onClick={() => setBarbeiroSelecionado(barbeiro)}
                >
                  <div className="barbeiro-nome-btn">
                    <button className="btn-nome-barbeiro">
                      {barbeiro.nome}
                    </button>
                  </div>
                  {barbeiro.bio && <p className="barbeiro-bio">{barbeiro.bio}</p>}
                  {barbeiroSelecionado?.id === barbeiro.id && (
                    <div className="check-icon">
                      <Check size={32} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="etapa-buttons">
              <button className="btn btn-primary" onClick={proximaEtapa}>
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Etapa 2 - Selecionar Serviço */}
        {etapa === 2 && (
          <div className="etapa-content fade-in">
            <h2>Escolha o Serviço</h2>
            <div className="servicos-grid">
              {servicos.map(servico => (
                <div
                  key={servico.id}
                  className={`servico-card card ${servicoSelecionado?.id === servico.id ? 'selecionado' : ''}`}
                  onClick={() => setServicoSelecionado(servico)}
                >
                  <h3>{servico.nome}</h3>
                  <p className="servico-preco">R$ {servico.preco},00</p>
                  <p className="servico-duracao">
                    ⏱️ {servico.duracao} minutos
                  </p>
                  {servicoSelecionado?.id === servico.id && (
                    <div className="check-icon">
                      <Check size={32} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="etapa-buttons">
              <button className="btn btn-secondary" onClick={etapaAnterior}>
                Voltar
              </button>
              <button className="btn btn-primary" onClick={proximaEtapa}>
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Etapa 3 - Selecionar Data e Horário */}
        {etapa === 3 && (
          <div className="etapa-content fade-in">
            <h2>Escolha Data e Horário</h2>
            
            <div className="data-hora-container">
              <div className="data-selector">
                <label>
                  📅 Selecione a Data
                </label>
                <input
                  type="date"
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                  min={dataMinima}
                  max={dataMaxima}
                />
              </div>

              {dataSelecionada && (
                <div className="horarios-container">
                  <label>
                    ⏰ Horários Disponíveis
                  </label>
                  {carregando ? (
                    <div className="loading"></div>
                  ) : horariosDisponiveis.length > 0 ? (
                    <div className="horarios-grid">
                      {horariosDisponiveis.map(horario => (
                        <button
                          key={horario}
                          className={`horario-btn ${horarioSelecionado === horario ? 'selecionado' : ''}`}
                          onClick={() => setHorarioSelecionado(horario)}
                        >
                          {horario}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="sem-horarios">Nenhum horário disponível para esta data</p>
                  )}
                </div>
              )}
            </div>

            <div className="etapa-buttons">
              <button className="btn btn-secondary" onClick={etapaAnterior}>
                Voltar
              </button>
              <button className="btn btn-primary" onClick={proximaEtapa}>
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Etapa 4 - Confirmação */}
        {etapa === 4 && (
          <div className="etapa-content fade-in">
            <h2>Confirme seu Agendamento</h2>
            
            <div className="confirmacao-card card">
              <div className="confirmacao-item">
                <strong>Barbeiro:</strong>
                <span>{barbeiroSelecionado?.nome}</span>
              </div>
              <div className="confirmacao-item">
                <strong>Serviço:</strong>
                <span>{servicoSelecionado?.nome}</span>
              </div>
              <div className="confirmacao-item">
                <strong>Preço:</strong>
                <span>R$ {servicoSelecionado?.preco},00</span>
              </div>
              <div className="confirmacao-item">
                <strong>Data:</strong>
                <span>{new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="confirmacao-item">
                <strong>Horário:</strong>
                <span>{horarioSelecionado}</span>
              </div>
              <div className="confirmacao-item">
                <strong>Duração:</strong>
                <span>{servicoSelecionado?.duracao} minutos</span>
              </div>
            </div>

            <div className="etapa-buttons">
              <button className="btn btn-secondary" onClick={etapaAnterior}>
                Voltar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={confirmarAgendamento}
                disabled={carregando}
              >
                {carregando ? <div className="loading"></div> : 'Confirmar Agendamento'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agendamento;
