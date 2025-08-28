const fs = require('fs');
const path = require('path');

const movimentacaoPath = path.join(__dirname, '../data/movimentacao-uti.json');
const estoquePath = path.join(__dirname, '../data/estoque.json');

const readMovimentacao = () => {
  try {
    const data = fs.readFileSync(movimentacaoPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeMovimentacao = (data) => {
  fs.writeFileSync(movimentacaoPath, JSON.stringify(data, null, 2));
};

const readEstoque = () => {
  try {
    const data = fs.readFileSync(estoquePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeEstoque = (data) => {
  fs.writeFileSync(estoquePath, JSON.stringify(data, null, 2));
};

// Listar todas as movimentações da UTI
const getAllMovimentacoes = (req, res) => {
  try {
    const movimentacoes = readMovimentacao();
    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar movimentações da UTI' });
  }
};

// Registrar consumo na UTI
const registrarConsumo = (req, res) => {
  try {
    const { itemId, quantidade, responsavel, observacoes } = req.body;
    
    // Verificar estoque
    const estoque = readEstoque();
    const itemIndex = estoque.findIndex(i => i.id === parseInt(itemId));
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item não encontrado no estoque' });
    }
    
    if (estoque[itemIndex].quantidade < parseInt(quantidade)) {
      return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
    }
    
    // Atualizar estoque
    estoque[itemIndex].quantidade -= parseInt(quantidade);
    writeEstoque(estoque);
    
    // Registrar movimentação
    const movimentacoes = readMovimentacao();
    const newId = movimentacoes.length > 0 ? Math.max(...movimentacoes.map(m => m.id)) + 1 : 1;
    
    const novaMovimentacao = {
      id: newId,
      itemId: parseInt(itemId),
      nomeItem: estoque[itemIndex].nome,
      quantidade: parseInt(quantidade),
      tipo: 'saida',
      dataMovimentacao: new Date().toISOString(),
      responsavel,
      observacoes
    };
    
    movimentacoes.push(novaMovimentacao);
    writeMovimentacao(movimentacoes);
    
    res.status(201).json({
      message: 'Consumo registrado com sucesso',
      movimentacao: novaMovimentacao,
      estoqueAtual: estoque[itemIndex].quantidade
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar consumo' });
  }
};

// Relatório de consumo da UTI
const getRelatorioConsumo = (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const movimentacoes = readMovimentacao();
    
    let movimentacoesFiltradas = movimentacoes;
    
    if (dataInicio && dataFim) {
      movimentacoesFiltradas = movimentacoes.filter(m => {
        const dataMovimentacao = new Date(m.dataMovimentacao);
        return dataMovimentacao >= new Date(dataInicio) && dataMovimentacao <= new Date(dataFim);
      });
    }
    
    // Agrupar por item
    const consumoPorItem = {};
    movimentacoesFiltradas.forEach(mov => {
      if (mov.tipo === 'saida') {
        if (!consumoPorItem[mov.nomeItem]) {
          consumoPorItem[mov.nomeItem] = {
            item: mov.nomeItem,
            totalConsumido: 0,
            movimentacoes: []
          };
        }
        consumoPorItem[mov.nomeItem].totalConsumido += mov.quantidade;
        consumoPorItem[mov.nomeItem].movimentacoes.push(mov);
      }
    });
    
    res.json({
      resumo: Object.values(consumoPorItem),
      totalMovimentacoes: movimentacoesFiltradas.length,
      periodo: { dataInicio, dataFim }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};

module.exports = {
  getAllMovimentacoes,
  registrarConsumo,
  getRelatorioConsumo
};
