import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, Scissors, ShoppingBag } from 'lucide-react';
import './AdminConfiguracoes.css';

const AdminConfiguracoes = () => {
  const [abaSelecionada, setAbaSelecionada] = useState('horarios');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Estado para horários
  const [horarios, setHorarios] = useState({
    segunda: { abertura: '08:00', fechamento: '17:00', ativo: true },
    terca: { abertura: '08:00', fechamento: '17:00', ativo: true },
    quarta: { abertura: '08:00', fechamento: '17:00', ativo: true },
    quinta: { abertura: '08:00', fechamento: '17:00', ativo: true },
    sexta: { abertura: '08:00', fechamento: '17:00', ativo: true },
    sabado: { abertura: '08:00', fechamento: '17:00', ativo: true },
    domingo: { abertura: '08:00', fechamento: '17:00', ativo: false }
  });

  // Estado para serviços
  const [servicos, setServicos] = useState([]);
  const [novoServico, setNovoServico] = useState({
    nome: '',
    preco: '',
    duracao: '',
    descricao: ''
  });

  // Estado para produtos
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    preco: '',
    estoque: '',
    descricao: '',
    categoria: '',
    imagem: null
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      // Carregar horários (mantém como está)
      const horariosResponse = await api.get('/configuracoes/horarios');
      if (horariosResponse.data?.horariosFuncionamento) {
        setHorarios(horariosResponse.data.horariosFuncionamento);
      }

      // Carregar serviços diretamente do endpoint MongoDB
      const servicosResponse = await api.get('/configuracoes/servicos');
      if (Array.isArray(servicosResponse.data)) {
        setServicos(servicosResponse.data);
      } else {
        setServicos([]);
      }

      // Carregar produtos
      const produtosResponse = await api.get('/produtos');
      setProdutos(produtosResponse.data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const salvarHorarios = async () => {
    setSalvando(true);
    try {
      await api.put('/configuracoes/horarios', {
        horariosFuncionamento: horarios
      });
      mostrarMensagem('sucesso', 'Horários salvos com sucesso!');
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao salvar horários');
    } finally {
      setSalvando(false);
    }
  };

  const adicionarServico = async () => {
    console.log('🔵 adicionarServico chamado');
    console.log('📝 Dados do novo serviço:', novoServico);
    
    // Validação
    if (!novoServico.nome || !novoServico.preco || !novoServico.duracao) {
      console.log('❌ Validação falhou - campos vazios');
      mostrarMensagem('erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    console.log('✅ Validação passou');
    setSalvando(true);
    
    try {
      const dadosServico = {
        nome: novoServico.nome,
        preco: parseFloat(novoServico.preco),
        duracao: parseInt(novoServico.duracao),
        descricao: novoServico.descricao
      };
      
      console.log('📡 Enviando POST para /configuracoes/servicos com:', dadosServico);
      const response = await api.post('/configuracoes/servicos', dadosServico);
      console.log('✅ Resposta recebida:', response.data);
      
      // Limpa o formulário
      setNovoServico({ nome: '', preco: '', duracao: '', descricao: '' });
      console.log('🧹 Formulário limpo');
      
      // Recarrega os dados
      await carregarConfiguracoes();
      console.log('🔄 Configurações recarregadas');
      
      mostrarMensagem('sucesso', 'Serviço adicionado com sucesso!');
      console.log('🎉 Serviço adicionado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao adicionar serviço:', error);
      console.error('Detalhes:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      mostrarMensagem('erro', `Erro ao adicionar serviço: ${error.response?.data?.message || error.message}`);
    } finally {
      setSalvando(false);
      console.log('🔄 Estado salvando resetado para false');
    }
  };

  const atualizarServico = async (id, dados) => {
    setSalvando(true);
    try {
      console.log('Atualizando serviço ID:', id, 'com dados:', dados); // Debug
      const response = await api.put(`/configuracoes/servicos/${id}`, dados);
      console.log('Serviço atualizado:', response.data); // Debug
      await carregarConfiguracoes();
      mostrarMensagem('sucesso', 'Serviço atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error); // Debug
      mostrarMensagem('erro', 'Erro ao atualizar serviço');
    } finally {
      setSalvando(false);
    }
  };

  const removerServico = async (id) => {
    console.log('🗑️ removerServico chamado com ID:', id);
    
    if (!window.confirm('Deseja realmente remover este serviço?')) {
      console.log('❌ Usuário cancelou a remoção');
      return;
    }

    console.log('✅ Confirmação recebida, iniciando remoção...');
    setSalvando(true);
    try {
      console.log('📡 Fazendo DELETE request para: /configuracoes/servicos/' + id);
      const response = await api.delete(`/configuracoes/servicos/${id}`);
      console.log('✅ Resposta recebida:', response.data);
      
      // Atualiza o estado local imediatamente
      setServicos(prevServicos => {
        const novaLista = prevServicos.filter(s => s.id !== id);
        console.log('📋 Lista atualizada. Antes:', prevServicos.length, 'Depois:', novaLista.length);
        return novaLista;
      });
      
      mostrarMensagem('sucesso', 'Serviço removido com sucesso!');
      console.log('🎉 Serviço removido com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao remover serviço:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      mostrarMensagem('erro', `Erro ao remover serviço: ${error.response?.data?.message || error.message}`);
    } finally {
      setSalvando(false);
      console.log('🔄 Estado salvando resetado');
    }
  };

  const adicionarProduto = async () => {
    if (!novoProduto.nome || !novoProduto.preco) {
      mostrarMensagem('erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setSalvando(true);
    try {
      await api.post('/produtos', {
        nome: novoProduto.nome,
        preco: parseFloat(novoProduto.preco),
        estoque: parseInt(novoProduto.estoque) || 0,
        descricao: novoProduto.descricao,
        categoria: novoProduto.categoria,
        imagem: novoProduto.imagem
      });
      
      setNovoProduto({ nome: '', preco: '', estoque: '', descricao: '', categoria: '', imagem: null });
      carregarConfiguracoes();
      mostrarMensagem('sucesso', 'Produto adicionado com sucesso!');
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao adicionar produto');
    } finally {
      setSalvando(false);
    }
  };

  const removerProduto = async (id) => {
    console.log('🗑️ removerProduto chamado com ID:', id);
    
    if (!window.confirm('Deseja realmente remover este produto?')) {
      console.log('❌ Usuário cancelou a remoção');
      return;
    }

    console.log('✅ Confirmação recebida, iniciando remoção...');
    setSalvando(true);
    try {
      console.log('📡 Fazendo DELETE request para: /produtos/' + id);
      const response = await api.delete(`/produtos/${id}`);
      console.log('✅ Resposta recebida:', response.data);
      
      // Atualiza o estado local imediatamente
      setProdutos(prevProdutos => {
        const novaLista = prevProdutos.filter(p => p._id !== id);
        console.log('📋 Lista atualizada. Antes:', prevProdutos.length, 'Depois:', novaLista.length);
        return novaLista;
      });
      
      mostrarMensagem('sucesso', 'Produto removido com sucesso!');
      console.log('🎉 Produto removido com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao remover produto:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      mostrarMensagem('erro', `Erro ao remover produto: ${error.response?.data?.message || error.message}`);
    } finally {
      setSalvando(false);
      console.log('🔄 Estado salvando resetado');
    }
  };

  const mostrarMensagem = (tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
  };

  const diasSemana = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  return (
    <div className="admin-config-page">
      <div className="container">
        <h1 className="page-title">⚙️ Configurações do Sistema</h1>

        {mensagem.texto && (
          <div className={`alert alert-${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        {/* Abas */}
        <div className="config-tabs">
          <button
            className={`tab-btn ${abaSelecionada === 'horarios' ? 'ativo' : ''}`}
            onClick={() => setAbaSelecionada('horarios')}
          >
            <Clock size={20} /> Horários
          </button>
          <button
            className={`tab-btn ${abaSelecionada === 'servicos' ? 'ativo' : ''}`}
            onClick={() => setAbaSelecionada('servicos')}
          >
            <Scissors size={20} /> Serviços
          </button>
          <button
            className={`tab-btn ${abaSelecionada === 'produtos' ? 'ativo' : ''}`}
            onClick={() => setAbaSelecionada('produtos')}
          >
            <ShoppingBag size={20} /> Produtos
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="config-content card">
          
          {/* ABA HORÁRIOS */}
          {abaSelecionada === 'horarios' && (
            <div className="horarios-config">
              <h2>Horários de Funcionamento</h2>
              <p className="config-descricao">
                Configure os horários de abertura e fechamento para cada dia da semana
              </p>

              <div className="horarios-lista">
                {Object.entries(horarios).map(([dia, config]) => (
                  <div key={dia} className="horario-item">
                    <div className="horario-dia">
                      <input
                        type="checkbox"
                        checked={config.ativo}
                        onChange={(e) => setHorarios({
                          ...horarios,
                          [dia]: { ...config, ativo: e.target.checked }
                        })}
                      />
                      <strong>{diasSemana[dia]}</strong>
                    </div>

                    {config.ativo && (
                      <div className="horario-inputs">
                        <div className="input-group">
                          <label>Abertura</label>
                          <input
                            type="time"
                            value={config.abertura}
                            onChange={(e) => setHorarios({
                              ...horarios,
                              [dia]: { ...config, abertura: e.target.value }
                            })}
                          />
                        </div>
                        <span className="horario-separador">até</span>
                        <div className="input-group">
                          <label>Fechamento</label>
                          <input
                            type="time"
                            value={config.fechamento}
                            onChange={(e) => setHorarios({
                              ...horarios,
                              [dia]: { ...config, fechamento: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {!config.ativo && (
                      <span className="horario-fechado">Fechado</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary"
                onClick={salvarHorarios}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : '💾 Salvar Horários'}
              </button>
            </div>
          )}

          {/* ABA SERVIÇOS */}
          {abaSelecionada === 'servicos' && (
            <div className="servicos-config">
              <h2>Gerenciar Serviços</h2>
              
              {/* Adicionar Novo Serviço */}
              <div className="form-adicionar">
                <h3>➕ Adicionar Novo Serviço</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome do Serviço *</label>
                    <input
                      type="text"
                      placeholder="Ex: Platinado, Luzes, etc"
                      value={novoServico.nome}
                      onChange={(e) => setNovoServico({ ...novoServico, nome: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={novoServico.preco}
                      onChange={(e) => setNovoServico({ ...novoServico, preco: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duração (min) *</label>
                    <input
                      type="number"
                      placeholder="60"
                      value={novoServico.duracao}
                      onChange={(e) => setNovoServico({ ...novoServico, duracao: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Descrição</label>
                    <textarea
                      placeholder="Descrição do serviço"
                      value={novoServico.descricao}
                      onChange={(e) => setNovoServico({ ...novoServico, descricao: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={adicionarServico}
                  disabled={salvando}
                >
                  {salvando ? 'Adicionando...' : '➕ Adicionar Serviço'}
                </button>
              </div>

              {/* Lista de Serviços */}
              <div className="servicos-lista">
                <h3>📋 Serviços Cadastrados</h3>
                {servicos.length === 0 ? (
                  <p className="lista-vazia">Nenhum serviço cadastrado</p>
                ) : (
                  servicos.map(servico => (
                    <div key={servico._id || servico.id} className="servico-item">
                      <div className="servico-info">
                        <h4>{servico.nome}</h4>
                        <p className="servico-preco">R$ {servico.preco.toFixed(2)}</p>
                        <p className="servico-duracao">⏱️ {servico.duracao} min</p>
                        {servico.descricao && <p className="servico-desc">{servico.descricao}</p>}
                      </div>
                      <div className="servico-acoes">
                        <button
                          className="btn-acao btn-ativo"
                          onClick={() => atualizarServico(servico._id || servico.id, { ...servico, ativo: !servico.ativo })}
                        >
                          {servico.ativo ? '✅ Ativo' : '❌ Inativo'}
                        </button>
                        <button
                          className="btn-acao btn-remover"
                          onClick={() => removerServico(servico._id || servico.id)}
                          disabled={salvando}
                        >
                          {salvando ? '⏳' : '🗑️'} {salvando ? 'Removendo...' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ABA PRODUTOS */}
          {abaSelecionada === 'produtos' && (
            <div className="produtos-config">
              <h2>Gerenciar Produtos</h2>
              
              {/* Adicionar Novo Produto */}
              <div className="form-adicionar">
                <h3>➕ Adicionar Novo Produto</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome do Produto *</label>
                    <input
                      type="text"
                      placeholder="Ex: Pomada Modeladora"
                      value={novoProduto.nome}
                      onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={novoProduto.preco}
                      onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estoque</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={novoProduto.estoque}
                      onChange={(e) => setNovoProduto({ ...novoProduto, estoque: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoria</label>
                    <select
                      value={novoProduto.categoria}
                      onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      <option value="pomadas">Pomadas</option>
                      <option value="shampoos">Shampoos</option>
                      <option value="barba">Barba</option>
                      <option value="perfumes">Perfumes</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Imagem do Produto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setNovoProduto({ ...novoProduto, imagem: e.target.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {novoProduto.imagem && (
                      <div className="image-preview">
                        <img src={novoProduto.imagem} alt="Preview" style={{maxWidth: '200px', maxHeight: '200px', marginTop: '10px'}} />
                      </div>
                    )}
                  </div>
                  <div className="form-group full-width">
                    <label>Descrição</label>
                    <textarea
                      placeholder="Descrição do produto"
                      value={novoProduto.descricao}
                      onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={adicionarProduto}
                  disabled={salvando}
                >
                  {salvando ? 'Adicionando...' : '➕ Adicionar Produto'}
                </button>
              </div>

              {/* Lista de Produtos */}
              <div className="produtos-lista">
                <h3>📋 Produtos Cadastrados</h3>
                {produtos.length === 0 ? (
                  <p className="lista-vazia">Nenhum produto cadastrado</p>
                ) : (
                  produtos.map(produto => (
                    <div key={produto._id} className="produto-item">
                      <div className="produto-info">
                        <h4>{produto.nome}</h4>
                        <p className="produto-preco">R$ {produto.preco.toFixed(2)}</p>
                        <p className="produto-estoque">📦 Estoque: {produto.estoque || 0}</p>
                        {produto.categoria && <span className="produto-categoria">{produto.categoria}</span>}
                        {produto.descricao && <p className="produto-desc">{produto.descricao}</p>}
                      </div>
                      <div className="produto-acoes">
                        <button
                          className="btn-acao btn-remover"
                          onClick={() => removerProduto(produto._id)}
                          disabled={salvando}
                        >
                          {salvando ? '⏳' : '🗑️'} {salvando ? 'Removendo...' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
