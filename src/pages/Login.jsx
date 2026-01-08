import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Validações simples
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos');
      setCarregando(false);
      return;
    }

    if (!email.includes('@')) {
      setErro('Por favor, insira um email válido');
      setCarregando(false);
      return;
    }

    const resultado = await login(email, senha);

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
              <label htmlFor="email">
                <Mail size={18} /> Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                minLength="6"
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
