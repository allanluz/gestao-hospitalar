const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatoriosController');

// Dashboard Executivo
router.get('/dashboard', relatoriosController.obterDashboardExecutivo);

// Relatórios específicos
router.get('/prescricoes-nao-dispensadas', relatoriosController.obterPrescricoesNaoDispensadas);
router.get('/medicamentos-nao-dispensados', relatoriosController.obterMedicamentosNaoDispensados);

// Análises
router.get('/analise-consumo', relatoriosController.obterAnaliseConsumo);
router.get('/performance-dispensacao', relatoriosController.obterPerformanceDispensacao);

// Exportação
router.get('/exportar', relatoriosController.exportarDados);

module.exports = router;
