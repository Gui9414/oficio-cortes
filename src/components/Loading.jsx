import React from 'react';
import './Loading.css';

const Loading = ({ mensagem = 'Carregando...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-mensagem">{mensagem}</p>
    </div>
  );
};

export default Loading;
