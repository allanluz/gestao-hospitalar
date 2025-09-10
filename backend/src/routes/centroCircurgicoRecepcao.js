const express = require('express');
const router = express.Router();
const recepcaoController = require('../controllers/centroCircurgicoRecepcaoController');

// Rotas básicas CRUD
router.get('/', recepcaoController.listar);
router.get('/:id', recepcaoController.obter);
router.post('/', recepcaoController.criar);
router.put('/:id', recepcaoController.atualizar);
router.delete('/:id', recepcaoController.excluir);

// Rotas especializadas
router.get('/buscar/:numeroInternacao', recepcaoController.buscarPorInternacao);

module.exports = router;
