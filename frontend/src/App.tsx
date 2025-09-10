import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
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
    </Router>
  );
}

export default App;
