import React from 'react';
import './WhatsappButton.css';

const WhatsappButton = () => (
  <a
    href="https://wa.link/kp92kw"
    className="whatsapp-float"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco no WhatsApp"
  >
     <img src="/whatsapp-icon.svg" alt="WhatsApp" className="whatsapp-icon-img" width={48} height={48} />
  </a>
);

export default WhatsappButton;
