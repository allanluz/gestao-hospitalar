const express = require('express');
const router = express.Router();
const dispensacaoController = require('../controllers/dispensacaoController');

// Rotas de dispensações
router.get('/', dispensacaoController.listarDispensacoes);
router.get('/estatisticas', dispensacaoController.obterEstatisticas);
router.get('/pendentes', dispensacaoController.listarDispensacoesPendentes);
router.get('/prescricao/:prescricaoId', dispensacaoController.listarPorPrescricao);
router.get('/paciente/:pacienteId', dispensacaoController.listarPorPaciente);
router.get('/:id', dispensacaoController.obterDispensacao);

router.post('/', dispensacaoController.dispensarMedicamento);
router.put('/:id/administrar', dispensacaoController.confirmarAdministracao);
router.put('/:id/cancelar', dispensacaoController.cancelarDispensacao);

module.exports = router;
