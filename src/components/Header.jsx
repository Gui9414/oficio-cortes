import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, MapPin, Calendar, User, LogOut, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuAberto(false);
  };

  const closeMenu = () => {
    setMenuAberto(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src="/logo-oficio.svg" alt="Ofício Cortes" className="logo-img" />
            <div className="logo-texto">
              <h1>BARBEARIA</h1>
              <h1 className="logo-destaque">OFÍCIO CORTES</h1>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className={`nav ${menuAberto ? 'nav-aberto' : ''}`}>
            <Link to="/" onClick={closeMenu}>Início</Link>
            <Link to="/loja" onClick={closeMenu}>
              <ShoppingBag size={18} /> Loja
            </Link>
            <Link to="/localizacao" onClick={closeMenu}>
              <MapPin size={18} /> Localização
            </Link>
            
            {user ? (
              <>
                <Link to="/agendamento" onClick={closeMenu}>
                  <Calendar size={18} /> Agendar
                </Link>
                {isAdmin() ? (
                  <Link to="/admin" onClick={closeMenu} className="btn-admin">
                    ADM
                  </Link>
                ) : (
                  <Link to="/meus-agendamentos" onClick={closeMenu}>
                    Meus Agendamentos
                  </Link>
                )}
                <Link to="/meu-perfil" onClick={closeMenu}>
                  <User size={18} /> Perfil
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  <LogOut size={18} /> Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="btn-login">
                  Entrar
                </Link>
                <Link to="/cadastro" onClick={closeMenu}>
                  Cadastrar
                </Link>
              </>
            )}
          </nav>

          {/* Menu Hamburguer Mobile */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
