const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/estoque.json');

const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const getAllItens = (req, res) => {
  try {
    const estoque = readData();
    res.json(estoque);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar itens do estoque' });
  }
};

const getItemById = (req, res) => {
  try {
    const estoque = readData();
    const item = estoque.find(i => i.id === parseInt(req.params.id));
    
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar item' });
  }
};

const createItem = (req, res) => {
  try {
    const estoque = readData();
    const newId = estoque.length > 0 ? Math.max(...estoque.map(i => i.id)) + 1 : 1;
    
    const newItem = {
      id: newId,
      ...req.body
    };
    
    estoque.push(newItem);
    writeData(estoque);
    
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar item' });
  }
};

const updateItem = (req, res) => {
  try {
    const estoque = readData();
    const index = estoque.findIndex(i => i.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    estoque[index] = { ...estoque[index], ...req.body };
    writeData(estoque);
    
    res.json(estoque[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

const deleteItem = (req, res) => {
  try {
    const estoque = readData();
    const index = estoque.findIndex(i => i.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    estoque.splice(index, 1);
    writeData(estoque);
    
    res.json({ message: 'Item removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover item' });
  }
};

// Movimentação de estoque
const movimentarEstoque = (req, res) => {
  try {
    const { itemId, quantidade, tipo, responsavel, observacoes } = req.body;
    const estoque = readData();
    const itemIndex = estoque.findIndex(i => i.id === parseInt(itemId));
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    if (tipo === 'entrada') {
      estoque[itemIndex].quantidade += parseInt(quantidade);
    } else if (tipo === 'saida') {
      if (estoque[itemIndex].quantidade < parseInt(quantidade)) {
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
      }
      estoque[itemIndex].quantidade -= parseInt(quantidade);
    }
    
    writeData(estoque);
    
    res.json({ 
      message: 'Movimentação realizada com sucesso',
      item: estoque[itemIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao movimentar estoque' });
  }
};

// Relatório de estoque baixo
const getEstoqueBaixo = (req, res) => {
  try {
    const estoque = readData();
    const estoqueBaixo = estoque.filter(item => item.quantidade < item.estoqueMinimo);
    res.json(estoqueBaixo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar itens com estoque baixo' });
  }
};

module.exports = {
  getAllItens,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  movimentarEstoque,
  getEstoqueBaixo
};
