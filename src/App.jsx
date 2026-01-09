import WhatsappButton from './components/WhatsappButton';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Layout
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Agendamento from './pages/Agendamento';
import AdminDashboard from './pages/AdminDashboard';
import AdminAgendamentos from './pages/AdminAgendamentos';
import AdminConfiguracoes from './pages/AdminConfiguracoes';
import Loja from './pages/Loja';
import Localizacao from './pages/Localizacao';

// Componente de rota protegida
import ProtectedRoute from './components/ProtectedRoute';

// ErrorBoundary para prevenir crash total
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Ops! Algo deu errado.</h1>
          <p>Por favor, recarregue a página.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}>
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  console.log('App renderizando no domínio:', window.location.hostname);
  
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/loja" element={<Loja />} />
                  <Route path="/localizacao" element={<Localizacao />} />
                  <Route path="/agendamento" element={<Agendamento />} />
                  {/* Rotas protegidas - Admin */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/agendamentos" element={
                    <ProtectedRoute>
                      <AdminAgendamentos />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/configuracoes" element={
                    <ProtectedRoute>
                      <AdminConfiguracoes />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <WhatsappButton />
              <Footer />
            </div>
          </AppProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
