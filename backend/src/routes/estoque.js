const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

// GET /api/estoque - Listar todos os itens do estoque
router.get('/', estoqueController.getAllItens);

// GET /api/estoque/baixo - Itens com estoque baixo
router.get('/baixo', estoqueController.getEstoqueBaixo);

// GET /api/estoque/:id - Buscar item por ID
router.get('/:id', estoqueController.getItemById);

// POST /api/estoque - Criar novo item
router.post('/', estoqueController.createItem);

// PUT /api/estoque/:id - Atualizar item
router.put('/:id', estoqueController.updateItem);

// DELETE /api/estoque/:id - Deletar item
router.delete('/:id', estoqueController.deleteItem);

// POST /api/estoque/movimentar - Movimentar estoque (entrada/saída)
router.post('/movimentar', estoqueController.movimentarEstoque);

module.exports = router;
