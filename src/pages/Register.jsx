import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import './Login.css';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '');
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

  const validarFormulario = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    if (nome.length < 3) {
      setErro('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErro('Digite um email válido');
      return false;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    const telefoneLimpo = telefone.replace(/\D/g, '');
    const resultado = await register(nome, email, senha, telefoneLimpo);

    if (resultado.success) {
      navigate('/');
    } else {
      setErro(resultado.error || 'Erro ao criar conta');
    }

    setCarregando(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>CRIAR CONTA</h1>
            <p>Cadastre-se para agendar seu horário</p>
          </div>

          {erro && (
            <div className="alert alert-erro">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="nome">
                <User size={18} /> Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

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
              <label htmlFor="telefone">
                <Phone size={18} /> Telefone (opcional)
              </label>
              <input
                type="tel"
                id="telefone"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength="15"
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">
                <Lock size={18} /> Senha
              </label>
              <input
                type="password"
                id="senha"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">
                <Lock size={18} /> Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
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
                  <UserPlus size={20} /> Criar Conta
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login">Faça login aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
