const express = require('express');
const router = express.Router();
const controleInfeccaoController = require('../controllers/controleInfeccaoController');

// Rotas básicas CRUD
router.get('/', controleInfeccaoController.listar);
router.get('/:id', controleInfeccaoController.obter);
router.post('/', controleInfeccaoController.criar);
router.put('/:id', controleInfeccaoController.atualizar);

// Rotas especializadas
router.get('/:id/risco-infeccao', controleInfeccaoController.calcularRiscoInfeccao);
router.get('/relatorio/mensal', controleInfeccaoController.relatorioMensal);

module.exports = router;
