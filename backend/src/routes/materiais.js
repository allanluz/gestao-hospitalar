const express = require('express');
const router = express.Router();
const materiaisController = require('../controllers/materiaisController');

// Rotas para materiais
router.get('/', materiaisController.getMateriais);
router.get('/categorias', materiaisController.getCategorias);
router.get('/estatisticas', materiaisController.getEstatisticas);
router.get('/:id', materiaisController.getMaterialById);
router.post('/', materiaisController.createMaterial);
router.put('/:id', materiaisController.updateMaterial);
router.delete('/:id', materiaisController.deleteMaterial);

module.exports = router;