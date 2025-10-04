const fs = require('fs');
const path = require('path');
const codigoService = require('../services/codigoService');

const dataPath = path.join(__dirname, '../data/medicamentos.json');

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

// Listar todos os medicamentos
const getAllMedicamentos = (req, res) => {
  try {
    const medicamentos = readData();
    res.json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
};

// Buscar medicamento por ID
const getMedicamentoById = (req, res) => {
  try {
    const medicamentos = readData();
    const medicamento = medicamentos.find(m => m.id === parseInt(req.params.id));
    
    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }
    
    res.json(medicamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamento' });
  }
};

// Criar novo medicamento
const createMedicamento = (req, res) => {
  try {
    const medicamentos = readData();
    const newId = medicamentos.length > 0 ? Math.max(...medicamentos.map(m => m.id)) + 1 : 1;
    
    const newMedicamento = {
      id: newId,
      ...req.body,
      codigoBarras: null,
      qrCode: null,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    
    medicamentos.push(newMedicamento);
    writeData(medicamentos);
    
    res.status(201).json(newMedicamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar medicamento' });
  }
};

// Atualizar medicamento
const updateMedicamento = (req, res) => {
  try {
    const medicamentos = readData();
    const index = medicamentos.findIndex(m => m.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }
    
    medicamentos[index] = { 
      ...medicamentos[index], 
      ...req.body,
      atualizadoEm: new Date().toISOString()
    };
    writeData(medicamentos);
    
    res.json(medicamentos[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar medicamento' });
  }
};

// Deletar medicamento
const deleteMedicamento = (req, res) => {
  try {
    const medicamentos = readData();
    const index = medicamentos.findIndex(m => m.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }
    
    medicamentos.splice(index, 1);
    writeData(medicamentos);
    
    res.json({ message: 'Medicamento removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover medicamento' });
  }
};

// Buscar medicamentos (busca por nome, princípio ativo, lote)
const searchMedicamentos = (req, res) => {
  try {
    const medicamentos = readData();
    const query = req.query.q?.toLowerCase() || '';
    
    if (!query) {
      return res.json([]);
    }
    
    const resultados = medicamentos.filter(medicamento => {
      return (
        medicamento.nome?.toLowerCase().includes(query) ||
        medicamento.principioAtivo?.toLowerCase().includes(query) ||
        medicamento.lote?.toLowerCase().includes(query) ||
        medicamento.fabricante?.toLowerCase().includes(query)
      );
    });
    
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
};

// Gerar etiqueta para medicamento
const gerarEtiqueta = async (req, res) => {
  try {
    const medicamentos = readData();
    const index = medicamentos.findIndex(m => m.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }
    
    const medicamento = medicamentos[index];
    
    // Gerar códigos completos
    const etiqueta = await codigoService.gerarEtiquetaCompleta(medicamento, 'MEDICAMENTO');
    
    // Atualizar medicamento com os códigos
    medicamentos[index] = {
      ...medicamento,
      codigoBarras: etiqueta.codigoSimples,
      qrCode: etiqueta.codigoCompleto,
      etiquetaGeradaEm: etiqueta.geradoEm,
      atualizadoEm: new Date().toISOString()
    };
    
    writeData(medicamentos);
    
    res.json({
      medicamento: medicamentos[index],
      etiqueta: {
        qrCodeImage: etiqueta.qrCode,
        codigoBarrasImage: etiqueta.codigoBarras,
        codigoBarrasTexto: etiqueta.codigoSimples,
        qrCodeTexto: etiqueta.codigoCompleto
      }
    });
  } catch (error) {
    console.error('Erro ao gerar etiqueta:', error);
    res.status(500).json({ error: 'Erro ao gerar etiqueta' });
  }
};

// Obter QR Code de um medicamento
const getQRCode = async (req, res) => {
  try {
    const medicamentos = readData();
    const medicamento = medicamentos.find(m => m.id === parseInt(req.params.id));
    
    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }
    
    // Se já tem QR Code armazenado, retornar
    if (medicamento.qrCode) {
      const qrCodeImage = await codigoService.gerarQRCode(medicamento.qrCode);
      return res.json({ 
        qrCode: qrCodeImage,
        texto: medicamento.qrCode 
      });
    }
    
    // Senão, gerar novo
    const codigo = codigoService.gerarCodigoUnico('MEDICAMENTO', medicamento.id, {
      nome: medicamento.nome,
      lote: medicamento.lote
    });
    
    const qrCodeImage = await codigoService.gerarQRCode(codigo);
    
    res.json({ 
      qrCode: qrCodeImage,
      texto: codigo 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
};

// Obter código de barras de um medicamento
const getCodigoBarras = async (req, res) => {
  try {
    const medicamentos = readData();
    const medicamento = medicamentos.find(m => m.id === parseInt(req.params.id));
    
    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }
    
    // Se já tem código de barras armazenado, retornar
    if (medicamento.codigoBarras) {
      const codigoBarrasImage = codigoService.gerarCodigoBarras(medicamento.codigoBarras);
      return res.json({ 
        codigoBarras: codigoBarrasImage,
        texto: medicamento.codigoBarras 
      });
    }
    
    // Senão, gerar novo
    const codigo = codigoService.gerarCodigoUnico('MEDICAMENTO', medicamento.id);
    const codigoBarrasImage = codigoService.gerarCodigoBarras(codigo);
    
    res.json({ 
      codigoBarras: codigoBarrasImage,
      texto: codigo 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar código de barras' });
  }
};

// Buscar medicamento por código (QR ou Barras)
const getMedicamentoByCodigo = (req, res) => {
  try {
    const { codigo } = req.params;
    const medicamentos = readData();
    
    // Extrair informações do código
    const info = codigoService.extrairInformacoes(codigo);
    
    if (!info || info.tipo !== 'MEDICAMENTO') {
      return res.status(400).json({ error: 'Código inválido' });
    }
    
    // Buscar medicamento pelo ID extraído do código
    const medicamento = medicamentos.find(m => m.id === parseInt(info.id));
    
    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }
    
    // Validar se o código ainda é válido (comparar com o armazenado)
    const codigoValido = medicamento.codigoBarras === codigo || 
                         medicamento.qrCode === codigo ||
                         codigo.includes(`MEDICAMENTO-${medicamento.id}`);
    
    if (!codigoValido) {
      return res.status(400).json({ error: 'Código não corresponde ao medicamento' });
    }
    
    res.json(medicamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamento por código' });
  }
};

// Listar medicamentos por categoria
const getMedicamentosByCategoria = (req, res) => {
  try {
    const { categoria } = req.params;
    const medicamentos = readData();
    
    const resultados = medicamentos.filter(m => 
      m.categoria?.toLowerCase() === categoria.toLowerCase()
    );
    
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamentos por categoria' });
  }
};

// Verificar estoque baixo
const getEstoqueBaixo = (req, res) => {
  try {
    const medicamentos = readData();
    
    const estoqueBaixo = medicamentos.filter(m => 
      m.quantidade <= m.estoqueMinimo
    );
    
    res.json(estoqueBaixo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamentos com estoque baixo' });
  }
};

// Verificar medicamentos próximos ao vencimento
const getProximosVencimento = (req, res) => {
  try {
    const medicamentos = readData();
    const diasLimite = parseInt(req.query.dias) || 30;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + diasLimite);
    
    const proximosVencer = medicamentos.filter(m => {
      if (!m.dataValidade) return false;
      const dataValidade = new Date(m.dataValidade);
      return dataValidade <= dataLimite && dataValidade >= new Date();
    });
    
    res.json(proximosVencer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamentos próximos ao vencimento' });
  }
};

module.exports = {
  getAllMedicamentos,
  getMedicamentoById,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
  searchMedicamentos,
  gerarEtiqueta,
  getQRCode,
  getCodigoBarras,
  getMedicamentoByCodigo,
  getMedicamentosByCategoria,
  getEstoqueBaixo,
  getProximosVencimento
};
