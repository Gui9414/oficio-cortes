import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { agendamentoService } from '../services/agendamentoService';
import { Calendar, Check, User, Phone, ArrowLeft } from 'lucide-react';
import './Agendamento.css';

const Agendamento = () => {
  const { barbeiros, servicos, buscarHorariosDisponiveis } = useApp();
  const navigate = useNavigate();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Buscar horários quando data e barbeiro forem selecionados
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

  const confirmarAgendamento = async () => {
    // Validações
    if (!nomeCompleto || !telefone || !servicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    if (telefone.replace(/\D/g, '').length < 10) {
      setErro('Digite um telefone válido');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      await agendamentoService.criarPublico({
        nomeCliente: nomeCompleto,
        telefoneCliente: telefone.replace(/\D/g, ''),
        barbeiroId: barbeiroSelecionado?.id || barbeiros[0]?.id,
        servicoId: servicoSelecionado.id,
        servico: servicoSelecionado.nome,
        data: dataSelecionada,
        horario: horarioSelecionado
      });

      setSucesso(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
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
        <div className="sucesso-container">
          <div className="sucesso-icone">
            <Check size={64} />
          </div>
          <h2>Agendamento Confirmado!</h2>
          <p>Seu horário foi agendado com sucesso.</p>
          <p>Você receberá uma confirmação em breve.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agendamento-page-new">
      {/* Header com gradiente azul */}
      <div className="agendamento-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-content">
          <h1>Novo agendamento</h1>
          <p>Preencha todos os campos</p>
          <p>para agendar um novo horário.</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="agendamento-form">
        {erro && <div className="alert alert-erro">{erro}</div>}

        {/* Nome do Cliente */}
        <input
          type="text"
          className="form-input"
          placeholder="Nome do cliente"
          value={nomeCompleto}
          onChange={(e) => setNomeCompleto(e.target.value)}
        />

        {/* Telefone */}
        <div className="form-input phone-input">
          <span className="flag-icon">🇧🇷</span>
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            maxLength={15}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, '');
              if (valor.length > 11) valor = valor.slice(0, 11);
              let formatado = '';
              if (valor.length > 0) formatado = '(' + valor.substring(0, 2);
              if (valor.length >= 3) formatado += ') ' + valor.substring(2, 7);
              if (valor.length >= 8) formatado += '-' + valor.substring(7, 11);
              setTelefone(formatado);
            }}
          />
        </div>

        {/* Selecionar Serviço */}
        <select
          className="form-input"
          value={servicoSelecionado?.id || ''}
          onChange={(e) => {
            const servico = servicos.find(s => String(s.id) === e.target.value);
            setServicoSelecionado(servico);
            // Auto-selecionar primeiro barbeiro se não selecionado
            if (!barbeiroSelecionado && barbeiros.length > 0) {
              setBarbeiroSelecionado(barbeiros[0]);
            }
          }}
        >
          <option value="">Selecione um serviço</option>
          {servicos.map(servico => (
            <option key={servico.id} value={servico.id}>
              {servico.nome} - R$ {servico.preco}
            </option>
          ))}
        </select>

        {/* Selecionar Data */}
        <input
          type="date"
          className="form-input"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          min={dataMinima}
          max={dataMaxima}
          placeholder="Selecione uma data"
        />

        {/* Selecionar Horário */}
        {dataSelecionada && (
          <div className="horarios-section">
            {carregando ? (
              <div className="loading"></div>
            ) : horariosDisponiveis.length > 0 ? (
              <select
                className="form-input"
                value={horarioSelecionado}
                onChange={(e) => setHorarioSelecionado(e.target.value)}
              >
                <option value="">Selecione um horário</option>
                {horariosDisponiveis.map(horario => (
                  <option key={horario} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
            ) : (
              <p className="sem-horarios">Nenhum horário disponível para esta data</p>
            )}
          </div>
        )}

        {/* Botão Agendar */}
        <button 
          className="btn-agendar" 
          onClick={confirmarAgendamento}
          disabled={carregando}
        >
          {carregando ? <div className="loading"></div> : 'AGENDAR'}
        </button>
      </div>
    </div>
  );
};

export default Agendamento;
