const express = require('express');
const router = express.Router();
const medicamentosController = require('../controllers/medicamentosController');

// Rotas básicas CRUD
router.get('/', medicamentosController.getAllMedicamentos);
router.get('/search', medicamentosController.searchMedicamentos);
router.get('/categoria/:categoria', medicamentosController.getMedicamentosByCategoria);
router.get('/estoque-baixo', medicamentosController.getEstoqueBaixo);
router.get('/proximos-vencimento', medicamentosController.getProximosVencimento);
router.get('/:id', medicamentosController.getMedicamentoById);
router.post('/', medicamentosController.createMedicamento);
router.put('/:id', medicamentosController.updateMedicamento);
router.delete('/:id', medicamentosController.deleteMedicamento);

// Rotas de etiquetas e códigos
router.post('/:id/gerar-etiqueta', medicamentosController.gerarEtiqueta);
router.get('/:id/etiqueta/qrcode', medicamentosController.getQRCode);
router.get('/:id/etiqueta/barcode', medicamentosController.getCodigoBarras);
router.get('/codigo/:codigo', medicamentosController.getMedicamentoByCodigo);

module.exports = router;
