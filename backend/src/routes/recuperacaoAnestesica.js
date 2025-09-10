const express = require('express');
const router = express.Router();
const recuperacaoController = require('../controllers/recuperacaoAnestesicaController');

// Rotas básicas CRUD
router.get('/', recuperacaoController.listar);
router.get('/:id', recuperacaoController.obter);
router.post('/', recuperacaoController.criar);
router.put('/:id', recuperacaoController.atualizar);

// Rotas especializadas
router.post('/:id/sinais-vitais', recuperacaoController.adicionarSinaisVitais);
router.post('/:id/aldrete-kroulik', recuperacaoController.calcularAldreteKroulik);
router.get('/pacientes/em-recuperacao', recuperacaoController.pacientesEmRecuperacao);

module.exports = router;
