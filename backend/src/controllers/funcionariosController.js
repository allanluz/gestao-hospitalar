const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/funcionarios.json');

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

const getAllFuncionarios = (req, res) => {
  try {
    const funcionarios = readData();
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
};

const getFuncionarioById = (req, res) => {
  try {
    const funcionarios = readData();
    const funcionario = funcionarios.find(f => f.id === parseInt(req.params.id));
    
    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    res.json(funcionario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
};

const createFuncionario = (req, res) => {
  try {
    const funcionarios = readData();
    const newId = funcionarios.length > 0 ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    
    const newFuncionario = {
      id: newId,
      ...req.body
    };
    
    funcionarios.push(newFuncionario);
    writeData(funcionarios);
    
    res.status(201).json(newFuncionario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
};

const updateFuncionario = (req, res) => {
  try {
    const funcionarios = readData();
    const index = funcionarios.findIndex(f => f.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    funcionarios[index] = { ...funcionarios[index], ...req.body };
    writeData(funcionarios);
    
    res.json(funcionarios[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
};

const deleteFuncionario = (req, res) => {
  try {
    const funcionarios = readData();
    const index = funcionarios.findIndex(f => f.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    funcionarios.splice(index, 1);
    writeData(funcionarios);
    
    res.json({ message: 'Funcionário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover funcionário' });
  }
};

module.exports = {
  getAllFuncionarios,
  getFuncionarioById,
  createFuncionario,
  updateFuncionario,
  deleteFuncionario
};
