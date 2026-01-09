
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="novo-header">
      <div className="header-inner">
        <Link to="/" className="logo novo-logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo-oficio.png" alt="Ofício Cortes" className="logo-img novo-logo-img" />
        </Link>
        <nav className={`novo-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}><span>Início</span></Link>
          <Link to="/loja" className="nav-link" onClick={() => setMenuOpen(false)}><span>Loja</span></Link>
          <Link to="/localizacao" className="nav-link" onClick={() => setMenuOpen(false)}><span>Localização</span></Link>
          <Link to="/agendamento" className="nav-link" onClick={() => setMenuOpen(false)}><span>Agendar</span></Link>
          {user && (
            <>
              <Link to="/admin" className="nav-link nav-admin" onClick={() => setMenuOpen(false)}>Adm</Link>
              <button className="btn-logout novo-logout" onClick={handleLogout}><span>Sair</span></button>
            </>
          )}
          {!user && (
            <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </nav>
        <button className={`novo-menu-toggle${menuOpen ? ' open' : ''}`} aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
