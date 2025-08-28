const express = require('express');
const router = express.Router();
const centroCircurgicoController = require('../controllers/centroCircurgicoController');

// GET /api/centro-cirurgico/movimentacoes - Listar todas as movimentações do Centro Cirúrgico
router.get('/movimentacoes', centroCircurgicoController.getAllMovimentacoes);

// POST /api/centro-cirurgico/consumo - Registrar consumo no Centro Cirúrgico
router.post('/consumo', centroCircurgicoController.registrarConsumo);

// GET /api/centro-cirurgico/relatorio - Relatório de consumo do Centro Cirúrgico
router.get('/relatorio', centroCircurgicoController.getRelatorioConsumo);

module.exports = router;
