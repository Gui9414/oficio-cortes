import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Coluna 1 - Logo e Descrição */}
          <div className="footer-coluna">
            <h3 className="footer-logo">OFÍCIO CORTES</h3>
            <p className="footer-descricao">
              Barbearia premium com serviços de alta qualidade. 
              Tradição, estilo e modernidade em um só lugar.
            </p>
            <div className="footer-social">
              <a href="https://linkdireto.co/oficiocortes" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/5511918474607" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div className="footer-coluna">
            <h4>Links Rápidos</h4>
            <ul className="footer-links">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/agendamento">Agendar Horário</Link></li>
              <li><Link to="/loja">Loja</Link></li>
              <li><Link to="/localizacao">Localização</Link></li>
            </ul>
          </div>

          {/* Coluna 3 - Horários */}
          <div className="footer-coluna">
            <h4>Horário de Funcionamento</h4>
            <ul className="footer-horarios">
              <li><span>Segunda a Sexta</span> <strong>09:00 - 20:00</strong></li>
              <li><span>Sábado</span> <strong>09:00 - 18:00</strong></li>
              <li><span>Domingo</span> <strong>Fechado</strong></li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div className="footer-coluna">
            <h4>Contato</h4>
            <ul className="footer-contato">
              <li>
                <MapPin size={18} />
                <span>Rua Joaquim Leal, 73<br />Vila Curuçá Velha - São Paulo - SP<br />CEP 08031-590</span>
              </li>
              <li>
                <Phone size={18} />
                <a href="tel:+5511918474607">(11) 91847-4607</a>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:contato@oficiocortes.com">contato@oficiocortes.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {anoAtual} Ofício Cortes. Todos os direitos reservados.</p>
          <p className="footer-dev">
            Desenvolvido com <span className="heart">♥</span> por Guilherme Gonçalves
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
