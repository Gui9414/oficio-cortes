import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';
import './Localizacao.css';

const Localizacao = () => {
  const unidade = {
    nome: 'Ofício Cortes',
    endereco: 'Rua Joaquim Leal, 73',
    bairro: 'Vila Curuçá Velha',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '08031-590',
    telefone: '(11) 91847-4607',
    whatsapp: '5511918474607',
    horarios: [
      { dias: 'Segunda a Sexta', horario: '08:00 - 17:00' },
      { dias: 'Sábado', horario: '08:00 - 17:00' },
      { dias: 'Domingo', horario: 'Fechado' }
    ],
    coordenadas: {
      lat: -23.4987,
      lng: -46.5121
    }
  };

  return (
    <div className="localizacao-page">
      <div className="container">
        <h1 className="page-title">Nossa Localização</h1>
        <p className="page-subtitle">Venha nos visitar!</p>

        <div className="localizacao-content">
          {/* Informações */}
          <div className="info-card card">
            <h2>{unidade.nome}</h2>

            <div className="info-item">
              <MapPin size={24} className="info-icon" />
              <div>
                <p className="info-label">Endereço</p>
                <p className="info-value">
                  {unidade.endereco}<br />
                  {unidade.bairro} - {unidade.cidade}/{unidade.estado}<br />
                  CEP: {unidade.cep}
                </p>
              </div>
            </div>

            <div className="info-item">
              <Phone size={24} className="info-icon" />
              <div>
                <p className="info-label">Telefone</p>
                <p className="info-value">
                  <a href={`tel:${unidade.telefone.replace(/\D/g, '')}`}>
                    {unidade.telefone}
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <Clock size={24} className="info-icon" />
              <div>
                <p className="info-label">Horários</p>
                <div className="horarios-lista">
                  {unidade.horarios.map((h, index) => (
                    <div key={index} className="horario-item">
                      <span>{h.dias}:</span>
                      <strong>{h.horario}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <a 
              href={`https://wa.me/${unidade.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-whatsapp"
            >
              💬 Falar no WhatsApp
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=Rua+Joaquim+Leal+73+Vila+Curuçá+Velha+São+Paulo+SP+08031-590`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Navigation size={20} /> Ver no Google Maps
            </a>
          </div>

          {/* Mapa */}
          <div className="mapa-container card">
            <iframe
              title="Localização Ofício Cortes"
              src={`https://www.google.com/maps?q=Rua+Joaquim+Leal+73+Vila+Curuçá+Velha+São+Paulo+SP+08031-590&hl=pt-BR&z=16&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Foto da Unidade */}
        <div className="unidade-foto card">
          <div className="foto-placeholder">
            <MapPin size={64} />
            <p>Foto da Unidade</p>
          </div>
        </div>

        {/* Futuras Unidades */}
        <div className="futuras-unidades">
          <h2>Em Breve</h2>
          <p>Estamos expandindo! Em breve, novas unidades Ofício Cortes estarão disponíveis para melhor atendê-lo.</p>
        </div>
      </div>
    </div>
  );
};

export default Localizacao;
