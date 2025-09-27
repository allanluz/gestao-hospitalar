const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pacientesRoutes = require('./src/routes/pacientes');
const funcionariosRoutes = require('./src/routes/funcionarios');
const estoqueRoutes = require('./src/routes/estoque');
const utiRoutes = require('./src/routes/uti');
const centroCircurgicoRoutes = require('./src/routes/centroCircurgico');

// Novas rotas do fluxo hospitalar
const centroCircurgicoRecepcaoRoutes = require('./src/routes/centroCircurgicoRecepcao');
const assistenciaIntraOperatoriaRoutes = require('./src/routes/assistenciaIntraOperatoria');
const recuperacaoAnestesicaRoutes = require('./src/routes/recuperacaoAnestesica');
const controleInfeccaoRoutes = require('./src/routes/controleInfeccao');
const custeioRoutes = require('./src/routes/custeio');
const materiaisRoutes = require('./src/routes/materiais');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas existentes
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/uti', utiRoutes);
app.use('/api/centro-cirurgico', centroCircurgicoRoutes);

// Novas rotas do fluxo hospitalar
app.use('/api/centro-cirurgico-recepcao', centroCircurgicoRecepcaoRoutes);
app.use('/api/assistencia-intra-operatoria', assistenciaIntraOperatoriaRoutes);
app.use('/api/recuperacao-anestesica', recuperacaoAnestesicaRoutes);
app.use('/api/controle-infeccao', controleInfeccaoRoutes);
app.use('/api/custeio', custeioRoutes);
app.use('/api/materiais', materiaisRoutes);

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
    
    // Estat�sticas do Centro Cir�rgico
    const recepcoesPendentes = recepcoes.recepcoes.filter(r => r.status === 'ativo').length;
    const pacientesEmRecuperacao = recuperacoes.recuperacoes.filter(r => 
      !r.prescricaoMedica || !r.prescricaoMedica.altaHorario
    ).length;
    const cirurgiasHoje = controlesCCIH.controles.filter(c => {
      const hoje = new Date().toISOString().split('T')[0];
      return c.dataCirurgia === hoje;
    }).length;
    
    // An�lise financeira do m�s atual
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
      
      // Novos dados do Centro Cir�rgico
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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});
