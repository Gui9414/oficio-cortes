import api from './api';

export const agendamentoService = {
  // Criar agendamento público (sem login)
  async criarPublico(dados) {
    try {
      // Corrigido para endpoint compatível com backend atual
      const response = await api.post('/agendamentos', dados);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar agendamento');
    }
  },

  // Criar novo agendamento
  async criar(dados) {
    try {
      const response = await api.post('/agendamentos', dados);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar agendamento');
    }
  },

  // Buscar agendamentos do usuário logado
  async meus() {
    try {
      const response = await api.get('/agendamentos/meus');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos');
    }
  },

  // Buscar agendamento por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar agendamento');
    }
  },

  // Cancelar agendamento
  async cancelar(id) {
    try {
      const response = await api.delete(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao cancelar agendamento');
    }
  },

  // Buscar horários disponíveis para um barbeiro em uma data
  async buscarHorariosDisponiveis(barbeiroId, data) {
    try {
      const response = await api.get(`/agendamentos/horarios-disponiveis`, {
        params: { barbeiroId, data }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar horários');
    }
  },

  // Admin - Buscar todos os agendamentos
  async listarTodos(filtros = {}) {
    try {
      const response = await api.get('/agendamentos', { params: filtros });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos');
    }
  },

  // Admin - Atualizar status do agendamento
  async atualizarStatus(id, status) {
    try {
      const response = await api.patch(`/agendamentos/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar status');
    }
  }
};
