const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');

// Rotas de movimentações
router.get('/', movimentacaoController.listarMovimentacoes);
router.get('/estatisticas', movimentacaoController.obterEstatisticas);
router.get('/estoque-farmacia', movimentacaoController.obterEstoqueFarmacia);
router.get('/:id', movimentacaoController.obterMovimentacao);

router.post('/requisicao', movimentacaoController.criarRequisicao);
router.put('/:id/aprovar', movimentacaoController.aprovarRequisicao);
router.put('/:id/transferir', movimentacaoController.iniciarTransferencia);
router.put('/:id/receber', movimentacaoController.confirmarRecebimento);
router.put('/:id/rejeitar', movimentacaoController.rejeitarRequisicao);

module.exports = router;
