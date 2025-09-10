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

// Buscar paciente por número de internação
const getPacienteByInternacao = (req, res) => {
  try {
    const pacientes = readData();
    const numeroInternacao = req.params.numeroInternacao;
    
    const paciente = pacientes.find(p => 
      p.internacoes && p.internacoes.some(i => i.numeroInternacao === numeroInternacao)
    );
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado para esta internação' });
    }
    
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar paciente por internação' });
  }
};

// Buscar pacientes (busca por nome, CPF, número de internação)
const searchPacientes = (req, res) => {
  try {
    const pacientes = readData();
    const query = req.query.q?.toLowerCase() || '';
    
    if (!query) {
      return res.json([]);
    }
    
    const resultados = pacientes.filter(paciente => {
      // Buscar por nome
      if (paciente.nome.toLowerCase().includes(query)) return true;
      
      // Buscar por CPF
      if (paciente.cpf.includes(query)) return true;
      
      // Buscar por número de internação
      if (paciente.internacoes && paciente.internacoes.some(i => 
        i.numeroInternacao.toLowerCase().includes(query)
      )) return true;
      
      return false;
    });
    
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
};

// Obter internações ativas
const getInternacoesAtivas = (req, res) => {
  try {
    const pacientes = readData();
    const internacoesAtivas = [];
    
    pacientes.forEach(paciente => {
      if (paciente.internacoes) {
        paciente.internacoes.forEach(internacao => {
          if (internacao.status === 'ativa') {
            internacoesAtivas.push({
              ...internacao,
              paciente: {
                id: paciente.id,
                nome: paciente.nome,
                cpf: paciente.cpf,
                tipoSanguineo: paciente.tipoSanguineo,
                alergias: paciente.alergias
              }
            });
          }
        });
      }
    });
    
    res.json(internacoesAtivas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar internações ativas' });
  }
};

// Atualizar status do paciente
const updateStatusPaciente = (req, res) => {
  try {
    const pacientes = readData();
    const index = pacientes.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    pacientes[index].statusAtual = req.body.status;
    writeData(pacientes);
    
    res.json(pacientes[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do paciente' });
  }
};

module.exports = {
  getAllPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
  getPacienteByInternacao,
  searchPacientes,
  getInternacoesAtivas,
  updateStatusPaciente
};
