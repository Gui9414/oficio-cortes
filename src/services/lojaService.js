import api from './api';

export const lojaService = {
  // Listar todos os produtos
  async listar(filtros = {}) {
    try {
      const response = await api.get('/produtos', { params: filtros });
      return response.data;
    } catch (error) {
      // Retorna produtos de exemplo se der erro
      return [
        {
          id: 1,
          nome: 'Creme para Barbear Premium',
          descricao: 'Creme de alta qualidade para um barbear suave e confortável',
          preco: 49.90,
          categoria: 'creme',
          imagem: null,
          desconto: null
        },
        {
          id: 2,
          nome: 'Minoxidil 5% - Crescimento Capilar',
          descricao: 'Solução para crescimento de barba e cabelo',
          preco: 89.90,
          categoria: 'minoxidil',
          imagem: null,
          desconto: 10
        },
        {
          id: 3,
          nome: 'Pomada Modeladora Fixação Forte',
          descricao: 'Pomada profissional com fixação forte e brilho médio',
          preco: 39.90,
          categoria: 'pomada',
          imagem: null,
          desconto: null
        },
        {
          id: 4,
          nome: 'Kit Pente e Escova Profissional',
          descricao: 'Kit completo para cuidados diários',
          preco: 59.90,
          categoria: 'acessorio',
          imagem: null,
          desconto: 15
        }
      ];
    }
  },

  // Buscar produto por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar produto');
    }
  }
};
