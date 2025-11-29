const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pacientesRoutes = require('./src/routes/pacientes');
const funcionariosRoutes = require('./src/routes/funcionarios');
const estoqueRoutes = require('./src/routes/estoque');
const utiRoutes = require('./src/routes/uti');
const centroCircurgicoRoutes = require('./src/routes/centroCircurgico');
const medicamentosRoutes = require('./src/routes/medicamentos');

// Novas rotas do fluxo hospitalar
const centroCircurgicoRecepcaoRoutes = require('./src/routes/centroCircurgicoRecepcao');
const assistenciaIntraOperatoriaRoutes = require('./src/routes/assistenciaIntraOperatoria');
const recuperacaoAnestesicaRoutes = require('./src/routes/recuperacaoAnestesica');
const controleInfeccaoRoutes = require('./src/routes/controleInfeccao');
const custeioRoutes = require('./src/routes/custeio');
const materiaisRoutes = require('./src/routes/materiais');
const prescricoesRoutes = require('./src/routes/prescricoes');
const movimentacoesRoutes = require('./src/routes/movimentacoes');
const dispensacoesRoutes = require('./src/routes/dispensacoes');
const relatoriosRoutes = require('./src/routes/relatorios');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração de CORS para produção
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas existentes
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/uti', utiRoutes);
app.use('/api/centro-cirurgico', centroCircurgicoRoutes);

// Novas rotas do fluxo hospitalar
app.use('/api/centro-cirurgico-recepcao', centroCircurgicoRecepcaoRoutes);
app.use('/api/assistencia-intra-operatoria', assistenciaIntraOperatoriaRoutes);
app.use('/api/recuperacao-anestesica', recuperacaoAnestesicaRoutes);
app.use('/api/controle-infeccao', controleInfeccaoRoutes);
app.use('/api/custeio', custeioRoutes);
app.use('/api/materiais', materiaisRoutes);

// Rotas do sistema de gestÃ£o de medicamentos
app.use('/api/prescricoes', prescricoesRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);
app.use('/api/dispensacoes', dispensacoesRoutes);
app.use('/api/relatorios', relatoriosRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Sistema de Gerenciamento Hospitalar - API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de dashboard atualizada
app.get('/api/dashboard', (req, res) => {
  try {
    const pacientes = require('./src/data/pacientes.json');
    const funcionarios = require('./src/data/funcionarios.json');
    const estoque = require('./src/data/estoque.json');
    
    // Dados do fluxo hospitalar
    const recepcoes = require('./src/data/centro-cirurgico-recepcao.json');
    const recuperacoes = require('./src/data/recuperacao-anestesica.json');
    const controlesCCIH = require('./src/data/controle-infeccao-hospitalar.json');
    const custeios = require('./src/data/custeio-cirurgico.json');
    
    const totalPacientes = pacientes.length;
    const totalFuncionarios = funcionarios.length;
    const totalItensEstoque = estoque.reduce((total, item) => total + item.quantidade, 0);
    const itensEstoqueBaixo = estoque.filter(item => item.quantidade < item.estoqueMinimo).length;
    
    // Estatï¿½sticas do Centro Cirï¿½rgico
    const recepcoesPendentes = recepcoes.recepcoes.filter(r => r.status === 'ativo').length;
    const pacientesEmRecuperacao = recuperacoes.recuperacoes.filter(r => 
      !r.prescricaoMedica || !r.prescricaoMedica.altaHorario
    ).length;
    const cirurgiasHoje = controlesCCIH.controles.filter(c => {
      const hoje = new Date().toISOString().split('T')[0];
      return c.dataCirurgia === hoje;
    }).length;
    
    // Anï¿½lise financeira do mï¿½s atual
    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();
    const custeiosMesAtual = custeios.custeios.filter(c => {
      const dataCusteio = new Date(c.data);
      return dataCusteio.getMonth() + 1 === mesAtual && dataCusteio.getFullYear() === anoAtual;
    });
    
    const custoTotalMes = custeiosMesAtual.reduce((sum, c) => sum + c.somaTotal.custo, 0);
    const receitaTotalMes = custeiosMesAtual.reduce((sum, c) => sum + c.somaTotal.venda, 0);

    res.json({
      // Dados originais
      totalPacientes,
      totalFuncionarios,
      totalItensEstoque,
      itensEstoqueBaixo,
      
      // Novos dados do Centro Cirï¿½rgico
      centroCircurgico: {
        recepcoesPendentes,
        pacientesEmRecuperacao,
        cirurgiasHoje,
        cirurgiasMes: custeiosMesAtual.length
      },
      
      // Dados financeiros
      financeiro: {
        custoTotalMes: custoTotalMes.toFixed(2),
        receitaTotalMes: receitaTotalMes.toFixed(2),
        margemMes: (receitaTotalMes - custoTotalMes).toFixed(2)
      },
      
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sistema de Gerenciamento Hospitalar - API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      status: '/api/status',
      dashboard: '/api/dashboard',
      pacientes: '/api/pacientes',
      funcionarios: '/api/funcionarios',
      estoque: '/api/estoque',
      medicamentos: '/api/medicamentos',
      prescricoes: '/api/prescricoes',
      dispensacoes: '/api/dispensacoes',
      relatorios: '/api/relatorios'
    }
  });
});

// Handler de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`?? Sistema de Gerenciamento Hospitalar`);
  console.log(`?? Servidor rodando na porta ${PORT}`);
  console.log(`?? API disponível em http://localhost:${PORT}/api`);
  console.log(`?? Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
