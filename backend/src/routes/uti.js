const express = require('express');
const router = express.Router();
const utiController = require('../controllers/utiController');

// GET /api/uti/movimentacoes - Listar todas as movimentações da UTI
router.get('/movimentacoes', utiController.getAllMovimentacoes);

// POST /api/uti/consumo - Registrar consumo na UTI
router.post('/consumo', utiController.registrarConsumo);

// GET /api/uti/relatorio - Relatório de consumo da UTI
router.get('/relatorio', utiController.getRelatorioConsumo);

module.exports = router;
