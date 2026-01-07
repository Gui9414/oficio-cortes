import api from './api';

export const authService = {
  // Fazer login
  async login(telefone, senha) {
    try {
      const response = await api.post('/auth/login', { telefone, senha });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Telefone ou senha incorretos');
    }
  },

  // Registrar novo usuário
  async register(nome, telefone, senha) {
    try {
      const response = await api.post('/auth/register', { nome, telefone, senha });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar conta');
    }
  },

  // Buscar perfil do usuário logado
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  },

  // Atualizar perfil
  async updateProfile(dados) {
    try {
      const response = await api.put('/auth/profile', dados);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  // Fazer logout (limpar token)
  logout() {
    localStorage.removeItem('token');
  }
};
