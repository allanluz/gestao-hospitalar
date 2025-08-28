const express = require('express');
const router = express.Router();
const funcionariosController = require('../controllers/funcionariosController');

// GET /api/funcionarios - Listar todos os funcionários
router.get('/', funcionariosController.getAllFuncionarios);

// GET /api/funcionarios/:id - Buscar funcionário por ID
router.get('/:id', funcionariosController.getFuncionarioById);

// POST /api/funcionarios - Criar novo funcionário
router.post('/', funcionariosController.createFuncionario);

// PUT /api/funcionarios/:id - Atualizar funcionário
router.put('/:id', funcionariosController.updateFuncionario);

// DELETE /api/funcionarios/:id - Deletar funcionário
router.delete('/:id', funcionariosController.deleteFuncionario);

module.exports = router;
