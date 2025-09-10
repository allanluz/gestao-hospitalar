import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Funcionarios from './pages/Funcionarios';
import Estoque from './pages/Estoque';
import UTI from './pages/UTI';
import CentroCircurgico from './pages/CentroCircurgico';
import RecepcaoCentroCircurgico from './pages/RecepcaoCentroCircurgico';
import AssistenciaIntraOperatoria from './pages/AssistenciaIntraOperatoria';
import RecuperacaoAnestesica from './pages/RecuperacaoAnestesica';
import ControleInfeccao from './pages/ControleInfeccao';
import CusteioCirurgico from './pages/CusteioCirurgico';

// Componente para obter o título da página
const getPageTitle = (pathname: string): string => {
  const titles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/pacientes': 'Pacientes',
    '/funcionarios': 'Funcionários',
    '/estoque': 'Estoque',
    '/uti': 'UTI',
    '/centro-cirurgico': 'Centro Cirúrgico',
    '/centro-cirurgico-recepcao': 'Recepção Centro Cirúrgico',
    '/assistencia-intra-operatoria': 'Assistência Intra-Operatória',
    '/recuperacao-anestesica': 'Recuperação Anestésica',
    '/controle-infeccao': 'Controle de Infecção Hospitalar',
    '/custeio-cirurgico': 'Custeio Cirúrgico',
  };
  return titles[pathname] || 'Hospital Manager';
};

// Layout principal da aplicação
const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detectar tamanho da tela
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      // Mobile: toggle menu open/close
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      // Desktop: toggle collapse/expand
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isMobile ? !isMobileMenuOpen : isSidebarCollapsed}
        onToggle={isMobile ? handleMobileMenuClose : handleSidebarToggle}
      />
      
      {/* Conteúdo principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile ? 'ml-0' : (isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')
      }`}>
        {/* Header */}
        <Header 
          onMenuToggle={handleSidebarToggle}
          title={getPageTitle(location.pathname)}
        />
        
        {/* Conteúdo da página */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/uti" element={<UTI />} />
            <Route path="/centro-cirurgico" element={<CentroCircurgico />} />
            <Route path="/centro-cirurgico-recepcao" element={<RecepcaoCentroCircurgico />} />
            <Route path="/assistencia-intra-operatoria" element={<AssistenciaIntraOperatoria />} />
            <Route path="/recuperacao-anestesica" element={<RecuperacaoAnestesica />} />
            <Route path="/controle-infeccao" element={<ControleInfeccao />} />
            <Route path="/custeio-cirurgico" element={<CusteioCirurgico />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
