import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Scissors, Star, MapPin, Clock, Calendar, Trash2 } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [removendo, setRemovendo] = useState(null);
  
  const isAdmin = user?.tipo === 'admin';

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await api.get('/configuracoes/servicos');
      if (Array.isArray(response.data)) {
        setServicos(response.data.filter(s => s.ativo));
      } else {
        setServicos([]);
      }
    } catch (error) {
      setServicos([]);
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const removerServico = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este serviço?')) return;

    setRemovendo(id);
    try {
      await api.delete(`/configuracoes/servicos/${id}`);
      setServicos(prevServicos => prevServicos.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      alert('Erro ao remover serviço');
    } finally {
      setRemovendo(null);
    }
  };

  const depoimentos = [
    {
      id: 1,
      nome: 'Carlos Silva',
      texto: 'Melhor barbearia da região! Atendimento impecável e profissionais excelentes.',
      avaliacao: 5
    },
    {
      id: 2,
      nome: 'João Santos',
      texto: 'Ambiente top, sempre saio satisfeito. Recomendo demais!',
      avaliacao: 5
    },
    {
      id: 3,
      nome: 'Pedro Oliveira',
      texto: 'Profissionais altamente capacitados. O Guilherme é fera!',
      avaliacao: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title fade-in">
            BEM-VINDO À
            <span className="hero-destaque">BARBEARIA OFÍCIO CORTES</span>
          </h1>
          <p className="hero-subtitle fade-in">
            Tradição, Estilo e Modernidade em um Só Lugar
          </p>
          <div className="hero-buttons fade-in">
            <Link to="/agendamento" className="btn btn-primary">
              <Scissors size={20} /> Agendar Horário
            </Link>
            <Link to="/loja" className="btn btn-secondary">
              Ver Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="section sobre">
        <div className="container">
          <h2 className="section-title">Sobre a Barbearia</h2>
          <div className="sobre-content">
            <div className="sobre-texto">
              <p>
                A <strong>Barbearia Ofício Cortes</strong> é mais do que uma barbearia - é um espaço
                onde tradição encontra modernidade. Fundada com o propósito de oferecer
                uma experiência premium em cuidados masculinos, combinamos técnicas
                clássicas com tendências contemporâneas.
              </p>
              <p>
                Nossa missão é proporcionar não apenas um corte de cabelo, mas uma
                experiência completa de cuidado e bem-estar. Cada detalhe é pensado
                para que você saia daqui renovado e confiante.
              </p>
              <div className="sobre-stats">
                <div className="stat-item">
                  <h3>3+</h3>
                  <p>Anos de Experiência</p>
                </div>
                <div className="stat-item">
                  <h3>500+</h3>
                  <p>Clientes Satisfeitos</p>
                </div>
                <div className="stat-item">
                  <h3>4.5</h3>
                  <p>Avaliação Média</p>
                </div>
              </div>
            </div>
            <div className="sobre-imagem">
              <div className="placeholder-image">
                <span style={{fontSize: '4rem'}}>�</span>
                <p>EM CONSTRUÇÃO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="section servicos bg-dark">
        <div className="container">
          <h2 className="section-title">Nossos Serviços</h2>
          <div className="servicos-grid">
            {servicos.length === 0 ? (
              <p style={{textAlign: 'center', color: '#888', gridColumn: '1 / -1'}}>Nenhum serviço cadastrado</p>
            ) : (
              servicos.map(servico => (
                <div key={servico._id || servico.id} className="servico-card card" style={{position: 'relative'}}>
                  {isAdmin && (
                    <button
                      onClick={() => removerServico(servico._id || servico.id)}
                      disabled={removendo === (servico._id || servico.id)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: removendo === (servico._id || servico.id) ? 0.5 : 1,
                        zIndex: 10
                      }}
                      title="Remover serviço"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="servico-icone">
                    <Scissors size={48} />
                  </div>
                  <h3>{servico.nome}</h3>
                  <p className="servico-preco">R$ {servico.preco?.toFixed(2)}</p>
                  <p style={{fontSize: '0.85rem', color: '#888', marginBottom: '1rem'}}>{servico.duracao} min</p>
                  <Link to="/agendamento" className="btn btn-secondary">
                    Agendar Agora
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="section depoimentos bg-dark">
        <div className="container">
          <h2 className="section-title">O Que Nossos Clientes Dizem</h2>
          <div className="depoimentos-grid">
            {depoimentos.map(depoimento => (
              <div key={depoimento.id} className="depoimento-card card">
                <div className="depoimento-estrelas">
                  {[...Array(depoimento.avaliacao)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="depoimento-texto">"{depoimento.texto}"</p>
                <p className="depoimento-autor">- {depoimento.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para Transformar seu Visual?</h2>
            <p>Agende seu horário agora e experimente o melhor da barbearia premium</p>
            <div className="cta-buttons">
              <Link to="/agendamento" className="btn btn-primary">
                <Clock size={20} /> Agendar Agora
              </Link>
              <a href="https://wa.me/5511918474607" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Localização Rápida */}
      <section className="section localizacao-rapida">
        <div className="container">
          <h2 className="section-title">Onde Estamos</h2>
          <div className="localizacao-content">
            <div className="localizacao-info">
              <MapPin size={48} className="localizacao-icon" />
              <h3>Vila Curuçá Velha</h3>
              <p>São Paulo - SP</p>
              <Link to="/localizacao" className="btn btn-secondary">
                Ver no Mapa
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
