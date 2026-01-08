import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { auth } from '../config/firebase';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Observar mudanças no estado de autenticação do Firebase
    try {
      if (!auth) {
        console.warn('⚠️ Firebase Auth não inicializado');
        setLoading(false);
        return;
      }
      
      const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userData = await authService.getProfile();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              nome: userData.nome || 'Usuário',
              telefone: userData.telefone || '',
              tipo: userData.role || 'cliente',
              ...userData
            });
          } catch (err) {
            console.error('Erro ao carregar dados do usuário:', err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Erro ao inicializar auth observer:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setUser(null);
    }
  };

  const login = async (email, senha) => {
    try {
      const data = await authService.login(email, senha);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (nome, email, senha, telefone) => {
    try {
      const data = await authService.register(nome, email, senha, telefone);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.tipo === 'admin' || user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
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
