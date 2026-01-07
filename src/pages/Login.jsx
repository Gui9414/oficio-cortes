import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Lock, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const formatarTelefone = (valor) => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return valor;
  };

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setTelefone(valorFormatado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Validações simples
    if (!telefone || !senha) {
      setErro('Por favor, preencha todos os campos');
      setCarregando(false);
      return;
    }

    // Remove formatação do telefone
    const telefoneLimpo = telefone.replace(/\D/g, '');

    const resultado = await login(telefoneLimpo, senha);

    if (resultado.success) {
      navigate('/');
    } else {
      setErro(resultado.error || 'Erro ao fazer login');
    }

    setCarregando(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>BEM-VINDO DE VOLTA</h1>
            <p>Entre para agendar seu horário</p>
          </div>

          {erro && (
            <div className="alert alert-erro">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="telefone">
                <Phone size={18} /> Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength="15"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">
                <Lock size={18} /> Senha
              </label>
              <input
                type="password"
                id="senha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={carregando}
            >
              {carregando ? (
                <div className="loading"></div>
              ) : (
                <>
                  <LogIn size={20} /> Entrar
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Não tem uma conta?{' '}
              <Link to="/cadastro">Cadastre-se aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
