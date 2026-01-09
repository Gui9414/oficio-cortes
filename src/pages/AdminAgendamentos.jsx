import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminAgendamentos.css';

const cancelarAgendamento = async (id, onSuccess) => {
  try {
    await api.put(`/agendamentos/${id}/status`, { status: 'cancelado' });
    if (onSuccess) onSuccess();
  } catch (error) {
    alert('Erro ao cancelar agendamento');
  }
};

const AdminAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState('dia');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarAgendamentos();
  }, [filtro, data]);

  const carregarAgendamentos = async () => {
    setCarregando(true);
    let url = '/agendamentos';
    if (filtro === 'dia') url += `?data=${data}`;
    // Para semana/mês, pode-se implementar lógica de range de datas
    try {
      const response = await api.get(url);
      setAgendamentos(response.data);
    } catch (error) {
      setAgendamentos([]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="admin-agendamentos-page">
      <h1>Agendamentos</h1>
      <div className="agendamentos-filtros">
        <select value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="dia">Dia</option>
          <option value="semana">Semana</option>
          <option value="mes">Mês</option>
        </select>
        <input type="date" value={data} onChange={e => setData(e.target.value)} />
      </div>
      {carregando ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="agendamentos-lista">
          {agendamentos.length === 0 ? (
            <p>Nenhum agendamento encontrado.</p>
          ) : (
            agendamentos.map(ag => (
              <div key={ag._id} className="agendamento-card">
                <div className="agendamento-info">
                  <strong>{ag.nomeCliente || ag.cliente?.nome || 'Cliente'}</strong>
                  <span>Telefone: {ag.telefoneCliente || ag.cliente?.telefone || '-'}</span>
                  <span>Serviço: {ag.servico || '-'}</span>
                  {ag.status !== 'cancelado' && (
                    <button
                      className="btn-cancelar-agendamento"
                      onClick={async () => {
                        await cancelarAgendamento(ag._id, () => carregarAgendamentos());
                      }}
                    >
                      Cancelar Agendamento
                    </button>
                  )}
                  {ag.status === 'cancelado' && (
                    <span className="agendamento-cancelado">Agendamento cancelado</span>
                  )}
                </div>
                <div className="agendamento-horario">
                  <span>{ag.data}</span>
                  <span>{ag.horario}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAgendamentos;
