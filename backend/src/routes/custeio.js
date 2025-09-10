const express = require('express');
const router = express.Router();
const custeioController = require('../controllers/custeioController');

// Rotas básicas CRUD
router.get('/', custeioController.listar);
router.get('/:id', custeioController.obter);
router.post('/', custeioController.criar);
router.put('/:id', custeioController.atualizar);

// Rotas especializadas
router.post('/:id/material', custeioController.adicionarMaterial);
router.get('/relatorio/financeiro', custeioController.relatorioFinanceiro);
router.get('/materiais/disponiveis', custeioController.materiaisDisponiveis);

module.exports = router;
