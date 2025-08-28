const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

// GET /api/pacientes - Listar todos os pacientes
router.get('/', pacientesController.getAllPacientes);

// GET /api/pacientes/:id - Buscar paciente por ID
router.get('/:id', pacientesController.getPacienteById);

// POST /api/pacientes - Criar novo paciente
router.post('/', pacientesController.createPaciente);

// PUT /api/pacientes/:id - Atualizar paciente
router.put('/:id', pacientesController.updatePaciente);

// DELETE /api/pacientes/:id - Deletar paciente
router.delete('/:id', pacientesController.deletePaciente);

module.exports = router;
