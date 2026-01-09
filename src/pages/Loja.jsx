import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { lojaService } from '../services/lojaService';
import api from '../services/api';
import { Search, ShoppingCart, MessageCircle, Trash2 } from 'lucide-react';
import './Loja.css';

const Loja = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [removendo, setRemovendo] = useState(null);

  const isAdmin = user?.tipo === 'admin';

  const categorias = [
    { id: 'todos', nome: 'Todos' },
    { id: 'creme', nome: 'Cremes' },
    { id: 'minoxidil', nome: 'Minoxidil' },
    { id: 'pomada', nome: 'Pomadas' },
    { id: 'acessorio', nome: 'Acessórios' }
  ];


  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const data = await lojaService.listar();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Produtos mock para evitar tela vazia
      setProdutos([
        {
          _id: '1',
          nome: 'Pomada Modeladora',
          preco: 35.90,
          categoria: 'pomada',
          descricao: 'Pomada para modelar e fixar o cabelo',
          estoque: 15
        },
        {
          _id: '2',
          nome: 'Minoxidil 5%',
          preco: 89.90,
          categoria: 'minoxidil',
          descricao: 'Tratamento para crescimento capilar',
          estoque: 8
        },
        {
          _id: '3',
          nome: 'Creme Pós-Barba',
          preco: 24.90,
          categoria: 'creme',
          descricao: 'Hidrata e acalma a pele após o barbear',
          estoque: 12
        }
      ]);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="loja-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading"></div>
            <p>Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  const produtosFiltrados = produtos.filter(produto => {
    const matchCategoria = categoriaFiltro === 'todos' || produto.categoria === categoriaFiltro;
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       produto.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const handleComprar = (produto) => {
    // Integração futura com sistema de pagamento
    window.open(`https://wa.me/5511918474607?text=Olá! Tenho interesse no produto: ${produto.nome}`, '_blank');
  };

  const removerProduto = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return;

    setRemovendo(id);
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos(prevProdutos => prevProdutos.filter(p => p._id !== id));
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      alert('Erro ao remover produto');
    } finally {
      setRemovendo(null);
    }
  };

  return (
    <div className="loja-page" style={{background: 'linear-gradient(135deg, #232323 0%, #363636 100%)', minHeight: '100vh', color: '#B0AFAF'}}>
      <div className="container">
        {/* Header */}
        <div className="loja-header" style={{background: 'linear-gradient(135deg, #232323 0%, #363636 100%)', color: '#B0AFAF', border: '2px solid #B0AFAF'}}>
          <h1 style={{color: '#B0AFAF', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>Produtos</h1>
          <p style={{color: '#B0AFAF'}}>Produtos profissionais para o seu cuidado pessoal</p>
        </div>

        {/* Filtros e Busca */}
        <div className="loja-filtros">
          <div className="categorias">
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`categoria-btn ${categoriaFiltro === cat.id ? 'ativo' : ''}`}
                onClick={() => setCategoriaFiltro(cat.id)}
              >
                {cat.nome}
              </button>
            ))}
          </div>

          <div className="busca-container">
            <Search size={20} className="busca-icon" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Produtos */}
        {carregando ? (
          <div className="loading-container">
            <div className="loading"></div>
            <p>Carregando produtos...</p>
          </div>
        ) : produtosFiltrados.length > 0 ? (
          <div className="produtos-grid">
            {produtosFiltrados.map(produto => (
              <div key={produto._id} className="produto-card card" style={{background: 'linear-gradient(135deg, #232323, #363636)', border: '2px solid #B0AFAF', borderRadius: '12px', padding: '1.5rem', color: '#B0AFAF', boxShadow: '0 8px 24px rgba(176, 175, 175, 0.1)'}}>
                <div className="produto-imagem" style={{background: '#232323', height: '200px', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #363636'}}>
                  {produto.imagem ? (
                    <img src={produto.imagem} alt={produto.nome} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                  ) : (
                    <div className="imagem-placeholder" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#C0C0C0'}}>
                      <ShoppingCart size={48} />
                    </div>
                  )}
                </div>

                <div className="produto-info" style={{color: '#C0C0C0'}}>
                  <h3 style={{color: '#B0AFAF', marginBottom: '0.5rem', fontWeight: 'bold'}}>{produto.nome}</h3>
                  <p className="produto-descricao" style={{color: '#B0AFAF', marginBottom: '1rem', fontSize: '0.9rem'}}>{produto.descricao}</p>

                  <div className="produto-preco-container">
                    <span className="preco" style={{color: '#B0AFAF', fontWeight: 'bold', fontSize: '1.3rem'}}>R$ {produto.preco.toFixed(2)}</span>
                  </div>

                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                    <button 
                      className="btn btn-primary btn-comprar"
                      onClick={() => handleComprar(produto)}
                      style={{background: 'linear-gradient(135deg, #363636 0%, #232323 100%)', color: '#B0AFAF', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', flex: 1, fontWeight: 'bold', transition: 'all 0.3s ease'}}
                    >
                      <ShoppingCart size={16} style={{marginRight: '0.5rem'}} /> Comprar
                    </button>
                    {isAdmin && (
                      <button
                        className="btn btn-danger"
                        onClick={() => removerProduto(produto._id)}
                        disabled={removendo === produto._id}
                        style={{background: '#dc2626', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', opacity: removendo === produto._id ? 0.5 : 1}}
                        title="Remover produto"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sem-produtos" style={{textAlign: 'center', padding: '3rem', color: '#C0C0C0'}}>
            <ShoppingCart size={64} style={{marginBottom: '1rem', opacity: 0.5}} />
            <h3 style={{color: '#C0C0C0', marginBottom: '0.5rem'}}>Nenhum produto encontrado</h3>
            <p style={{color: '#D8D8D8'}}>Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loja;
