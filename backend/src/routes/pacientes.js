const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

// GET /api/pacientes - Listar todos os pacientes
router.get('/', pacientesController.getAllPacientes);

// GET /api/pacientes/search - Buscar pacientes por termo
router.get('/search', pacientesController.searchPacientes);

// GET /api/pacientes/internacoes/ativas - Obter internações ativas
router.get('/internacoes/ativas', pacientesController.getInternacoesAtivas);

// GET /api/pacientes/internacao/:numeroInternacao - Buscar paciente por número de internação
router.get('/internacao/:numeroInternacao', pacientesController.getPacienteByInternacao);

// GET /api/pacientes/:id - Buscar paciente por ID
router.get('/:id', pacientesController.getPacienteById);

// POST /api/pacientes - Criar novo paciente
router.post('/', pacientesController.createPaciente);

// PUT /api/pacientes/:id - Atualizar paciente
router.put('/:id', pacientesController.updatePaciente);

// PATCH /api/pacientes/:id/status - Atualizar status do paciente
router.patch('/:id/status', pacientesController.updateStatusPaciente);

// DELETE /api/pacientes/:id - Deletar paciente
router.delete('/:id', pacientesController.deletePaciente);

module.exports = router;
