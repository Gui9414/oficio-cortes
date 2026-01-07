import api from './api';

export const barbeiroService = {
  // Listar todos os barbeiros
  async listar() {
    try {
      const response = await api.get('/barbeiros');
      return response.data;
    } catch (error) {
      // Se der erro, retorna barbeiro padrão
      return [{
        id: 1,
        nome: 'Guilherme Gonçalves Vieira',
        bio: 'Barbeiro profissional com mais de 5 anos de experiência. Especialista em cortes clássicos e modernos.',
        foto: null,
        ativo: true
      }];
    }
  },

  // Buscar barbeiro por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/barbeiros/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar barbeiro');
    }
  },

  // Atualizar perfil do barbeiro (admin)
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/barbeiros/${id}`, dados);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar barbeiro');
    }
  },

  // Upload de foto do barbeiro
  async uploadFoto(id, arquivo) {
    try {
      const formData = new FormData();
      formData.append('foto', arquivo);
      
      const response = await api.post(`/barbeiros/${id}/foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload da foto');
    }
  },

  // Buscar estatísticas do barbeiro (admin)
  async estatisticas(periodo = 'dia') {
    try {
      const response = await api.get('/barbeiros/estatisticas', {
        params: { periodo }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar estatísticas');
    }
  }
};
