const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pacientesRoutes = require('./src/routes/pacientes');
const funcionariosRoutes = require('./src/routes/funcionarios');
const estoqueRoutes = require('./src/routes/estoque');
const utiRoutes = require('./src/routes/uti');
const centroCircurgicoRoutes = require('./src/routes/centroCircurgico');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/uti', utiRoutes);
app.use('/api/centro-cirurgico', centroCircurgicoRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Sistema de Gerenciamento Hospitalar - API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de dashboard
app.get('/api/dashboard', (req, res) => {
  const pacientes = require('./src/data/pacientes.json');
  const funcionarios = require('./src/data/funcionarios.json');
  const estoque = require('./src/data/estoque.json');
  
  const totalPacientes = pacientes.length;
  const totalFuncionarios = funcionarios.length;
  const totalItensEstoque = estoque.reduce((total, item) => total + item.quantidade, 0);
  const itensEstoqueBaixo = estoque.filter(item => item.quantidade < item.estoqueMinimo).length;

  res.json({
    totalPacientes,
    totalFuncionarios,
    totalItensEstoque,
    itensEstoqueBaixo,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});
