import React, { useState, useRef } from 'react';
import { User, Phone, Edit, Save, Camera, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import './MeuPerfil.css';

const MeuPerfil = () => {
  const { user, loadUser } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.nome || '');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [fotoPerfil, setFotoPerfil] = useState(user?.foto || null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const fileInputRef = useRef(null);

  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limite
        setMensagem({ texto: 'Imagem muito grande. Máximo 5MB.', tipo: 'erro' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
        setFotoPerfil(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverFoto = () => {
    setFotoPerfil(null);
    setPreviewFoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim()) {
      setMensagem({ texto: 'Nome não pode estar vazio', tipo: 'erro' });
      return;
    }

    setCarregando(true);
    setMensagem({ texto: '', tipo: '' });

    try {
      await authService.updateProfile({ 
        nome, 
        foto: fotoPerfil 
      });
      await loadUser();
      setMensagem({ texto: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
      setEditando(false);
    } catch (error) {
      setMensagem({ texto: 'Erro ao atualizar perfil', tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = () => {
    setNome(user?.nome || '');
    setEditando(false);
    setMensagem({ texto: '', tipo: '' });
  };

  return (
    <div className="perfil-page">
      <div className="container">
        <h1 className="page-title">Meu Perfil</h1>

        <div className="perfil-card card">
          {/* Avatar com Upload */}
          <div className="perfil-avatar-container">
            <div className="perfil-avatar" onClick={() => editando && fileInputRef.current?.click()}>
              {(previewFoto || fotoPerfil || user?.foto) ? (
                <img 
                  src={previewFoto || fotoPerfil || user?.foto} 
                  alt="Foto de perfil" 
                  className="avatar-img"
                />
              ) : (
                <User size={64} />
              )}
              {editando && (
                <div className="avatar-overlay">
                  <Camera size={24} />
                  <span>Alterar Foto</span>
                </div>
              )}
            </div>
            
            {editando && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFotoChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div className="avatar-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} /> Escolher Foto
                  </button>
                  {(fotoPerfil || previewFoto) && (
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-sm"
                      onClick={handleRemoverFoto}
                    >
                      Remover
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Informações */}
          <div className="perfil-info">
            {mensagem.texto && (
              <div className={`alert alert-${mensagem.tipo}`}>
                {mensagem.texto}
              </div>
            )}

            <div className="info-group">
              <label>
                <User /> Nome
              </label>
              {editando ? (
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome"
                />
              ) : (
                <p>{user?.nome}</p>
              )}
            </div>

            <div className="info-group">
              <label>
                📱 Telefone
              </label>
              <p>{user?.telefone?.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}</p>
              <small className="info-hint">Telefone não pode ser alterado</small>
            </div>

            <div className="info-group">
              <label>Tipo de Conta</label>
              <p className="tipo-conta">
                {user?.tipo === 'barbeiro' ? '👨‍💼 Barbeiro (Admin)' : '👤 Cliente'}
              </p>
            </div>

            {/* Botões */}
            <div className="perfil-acoes">
              {editando ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleSalvar}
                    disabled={carregando}
                  >
                    {carregando ? (
                      <div className="loading"></div>
                    ) : (
                      <>
                        <Save /> Salvar
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelar}
                    disabled={carregando}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setEditando(true)}
                >
                  <Edit /> Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="info-adicional card">
          <h3>Informações da Conta</h3>
          <div className="info-lista">
            <div className="info-item">
              <strong>Data de Cadastro:</strong>
              <span>
                {user?.criadoEm ? new Date(user.criadoEm).toLocaleDateString('pt-BR') : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <strong>Status:</strong>
              <span className="status-ativo">Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;



