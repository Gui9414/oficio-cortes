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
import Register from './pages/Register';
import Agendamento from './pages/Agendamento';
import AdminDashboard from './pages/AdminDashboardNovo';
import AdminConfiguracoes from './pages/AdminConfiguracoes';
import Loja from './pages/Loja';
import Localizacao from './pages/Localizacao';
import MeuPerfil from './pages/MeuPerfil';
import MeusAgendamentos from './pages/MeusAgendamentos';

// Componente de rota protegida
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log('App renderizando...');
  
  return (
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
                <Route path="/cadastro" element={<Register />} />
                <Route path="/loja" element={<Loja />} />
                <Route path="/localizacao" element={<Localizacao />} />
                
                {/* Rotas protegidas - Cliente */}
                <Route path="/agendamento" element={
                  <ProtectedRoute>
                    <Agendamento />
                  </ProtectedRoute>
                } />
                <Route path="/meu-perfil" element={
                  <ProtectedRoute>
                    <MeuPerfil />
                  </ProtectedRoute>
                } />
                <Route path="/meus-agendamentos" element={
                  <ProtectedRoute>
                    <MeusAgendamentos />
                  </ProtectedRoute>
                } />
                
                {/* Rotas protegidas - Admin */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/configuracoes" element={
                  <ProtectedRoute adminOnly>
                    <AdminConfiguracoes />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
