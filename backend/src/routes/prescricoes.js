const express = require('express');
const router = express.Router();
const prescricaoController = require('../controllers/prescricaoController');

// Rotas de prescrições
router.get('/', prescricaoController.listarPrescricoes);
router.get('/estatisticas', prescricaoController.obterEstatisticas);
router.get('/prescritor/:prescritorId', prescricaoController.listarPorPrescritor);
router.get('/paciente/:pacienteId', prescricaoController.listarPorPaciente);
router.get('/paciente/:pacienteId/pendentes', prescricaoController.buscarPrescricoesPendentes);
router.get('/:id', prescricaoController.buscarPrescricao);
router.post('/', prescricaoController.criarPrescricao);
router.put('/:id', prescricaoController.atualizarPrescricao);
router.put('/:id/cancelar', prescricaoController.cancelarPrescricao);

module.exports = router;
