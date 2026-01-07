import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado ao carregar a aplicação
    const token = localStorage.getItem('token');
    if (token) {
      // Para sistema mock, restaurar dados do usuário admin diretamente
      if (token === 'mock-jwt-token-admin-12345') {
        setUser({
          _id: '1',
          nome: 'Admin',
          email: 'admin@oficiocortes.com',
          telefone: '11918474607',
          tipo: 'admin'
        });
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (telefone, senha) => {
    try {
      const data = await authService.login(telefone, senha);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (nome, telefone, senha) => {
    try {
      const data = await authService.register(nome, telefone, senha);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAdmin = () => {
    return user?.tipo === 'admin' || user?.tipo === 'barbeiro';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
