const express = require('express');
const router = express.Router();
const assistenciaController = require('../controllers/assistenciaIntraOperatoriaController');

// Rotas básicas CRUD
router.get('/', assistenciaController.listar);
router.get('/:id', assistenciaController.obter);
router.post('/', assistenciaController.criar);
router.put('/:id', assistenciaController.atualizar);
router.delete('/:id', assistenciaController.excluir);

// Rotas especializadas
router.get('/relatorio/periodo', assistenciaController.relatorioPorPeriodo);

module.exports = router;
