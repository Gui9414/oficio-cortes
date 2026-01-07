import React, { createContext, useContext, useState, useEffect } from 'react';
import { agendamentoService } from '../services/agendamentoService';
import { barbeiroService } from '../services/barbeiroService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBarbeiros();
    loadServicos();
  }, []);

  const loadBarbeiros = async () => {
    try {
      setLoading(true);
      const data = await barbeiroService.listar();
      setBarbeiros(data);
    } catch (error) {
      console.error('Erro ao carregar barbeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServicos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/configuracoes');
      const data = await response.json();
      if (data.servicos?.servicos) {
        const servicosAtivos = data.servicos.servicos.filter(s => s.ativo);
        setServicos(servicosAtivos);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const buscarHorariosDisponiveis = async (barbeiroId, data) => {
    try {
      setLoading(true);
      const horariosDisponiveis = await agendamentoService.buscarHorariosDisponiveis(barbeiroId, data);
      setHorarios(horariosDisponiveis);
      return horariosDisponiveis;
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const value = {
    barbeiros,
    servicos,
    horarios,
    loading,
    loadBarbeiros,
    loadServicos,
    buscarHorariosDisponiveis
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
