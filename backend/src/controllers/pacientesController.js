const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/pacientes.json');

// Função para ler dados
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Função para escrever dados
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Listar todos os pacientes
const getAllPacientes = (req, res) => {
  try {
    const pacientes = readData();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
};

// Buscar paciente por ID
const getPacienteById = (req, res) => {
  try {
    const pacientes = readData();
    const paciente = pacientes.find(p => p.id === parseInt(req.params.id));
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
};

// Criar novo paciente
const createPaciente = (req, res) => {
  try {
    const pacientes = readData();
    const newId = pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
    
    const newPaciente = {
      id: newId,
      ...req.body
    };
    
    pacientes.push(newPaciente);
    writeData(pacientes);
    
    res.status(201).json(newPaciente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
};

// Atualizar paciente
const updatePaciente = (req, res) => {
  try {
    const pacientes = readData();
    const index = pacientes.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    pacientes[index] = { ...pacientes[index], ...req.body };
    writeData(pacientes);
    
    res.json(pacientes[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
};

// Deletar paciente
const deletePaciente = (req, res) => {
  try {
    const pacientes = readData();
    const index = pacientes.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    pacientes.splice(index, 1);
    writeData(pacientes);
    
    res.json({ message: 'Paciente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover paciente' });
  }
};

module.exports = {
  getAllPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente
};
