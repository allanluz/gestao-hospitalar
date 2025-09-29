const express = require('express');
const router = express.Router();
const assistenciaController = require('../controllers/assistenciaIntraOperatoriaController');

// Rotas b�sicas CRUD
router.get('/', assistenciaController.listar);
router.get('/:id', assistenciaController.obter);
router.post('/', assistenciaController.criar);
router.put('/:id', assistenciaController.atualizar);
router.patch('/:id', assistenciaController.atualizar);
router.delete('/:id', assistenciaController.excluir);

// Rotas especializadas
router.get('/relatorio/periodo', assistenciaController.relatorioPorPeriodo);

module.exports = router;
