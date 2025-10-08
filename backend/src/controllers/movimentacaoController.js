const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const MOVIMENTACOES_FILE = path.join(DATA_DIR, 'movimentacoes-medicamentos.json');
const ESTOQUE_CENTRAL_FILE = path.join(DATA_DIR, 'medicamentos.json');
const ESTOQUE_FARMACIA_FILE = path.join(DATA_DIR, 'estoque-farmacia.json');

// Função auxiliar para ler arquivos JSON
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Função auxiliar para escrever arquivos JSON
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Gerar ID único para movimentações
function gerarIdMovimentacao() {
  return `MOV${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Listar todas as movimentações com filtros
exports.listarMovimentacoes = async (req, res) => {
  try {
    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);
    const { tipo, status, dataInicio, dataFim, medicamentoId } = req.query;

    let resultado = [...movimentacoes];

    // Filtro por tipo (requisicao, transferencia)
    if (tipo) {
      resultado = resultado.filter(m => m.tipo === tipo);
    }

    // Filtro por status (pendente, aprovada, em_transito, recebida, rejeitada)
    if (status) {
      resultado = resultado.filter(m => m.status === status);
    }

    // Filtro por medicamento
    if (medicamentoId) {
      resultado = resultado.filter(m => m.medicamentoId === medicamentoId);
    }

    // Filtro por período
    if (dataInicio) {
      resultado = resultado.filter(m => new Date(m.dataSolicitacao) >= new Date(dataInicio));
    }
    if (dataFim) {
      resultado = resultado.filter(m => new Date(m.dataSolicitacao) <= new Date(dataFim));
    }

    // Ordenar por data mais recente
    resultado.sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    res.status(500).json({ erro: 'Erro ao listar movimentações' });
  }
};

// Obter uma movimentação específica
exports.obterMovimentacao = async (req, res) => {
  try {
    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);
    const movimentacao = movimentacoes.find(m => m.id === req.params.id);

    if (!movimentacao) {
      return res.status(404).json({ erro: 'Movimentação não encontrada' });
    }

    res.json(movimentacao);
  } catch (error) {
    console.error('Erro ao obter movimentação:', error);
    res.status(500).json({ erro: 'Erro ao obter movimentação' });
  }
};

// Criar requisição de medicamento (Farmácia solicita ao Estoque Central)
exports.criarRequisicao = async (req, res) => {
  try {
    const { medicamentoId, medicamentoNome, quantidade, justificativa, solicitante } = req.body;

    // Validações
    if (!medicamentoId || !quantidade || !solicitante) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    if (quantidade <= 0) {
      return res.status(400).json({ erro: 'Quantidade deve ser maior que zero' });
    }

    // Verificar disponibilidade no estoque central
    const estoqueCentral = await readJsonFile(ESTOQUE_CENTRAL_FILE);
    const medicamento = estoqueCentral.find(m => m.id === medicamentoId);

    if (!medicamento) {
      return res.status(404).json({ erro: 'Medicamento não encontrado no estoque central' });
    }

    if (medicamento.quantidade < quantidade) {
      return res.status(400).json({ 
        erro: 'Quantidade insuficiente no estoque central',
        disponivel: medicamento.quantidade,
        solicitado: quantidade
      });
    }

    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);

    const novaRequisicao = {
      id: gerarIdMovimentacao(),
      tipo: 'requisicao',
      medicamentoId,
      medicamentoNome: medicamentoNome || medicamento.nome,
      quantidade,
      justificativa: justificativa || '',
      solicitante,
      dataSolicitacao: new Date().toISOString(),
      status: 'pendente',
      origem: 'estoque_central',
      destino: 'farmacia',
      lote: medicamento.lote || '',
      validade: medicamento.validade || '',
      observacoes: []
    };

    movimentacoes.push(novaRequisicao);
    await writeJsonFile(MOVIMENTACOES_FILE, movimentacoes);

    res.status(201).json(novaRequisicao);
  } catch (error) {
    console.error('Erro ao criar requisição:', error);
    res.status(500).json({ erro: 'Erro ao criar requisição' });
  }
};

// Aprovar requisição (Gestor do Estoque Central)
exports.aprovarRequisicao = async (req, res) => {
  try {
    const { aprovadoPor, observacao } = req.body;

    if (!aprovadoPor) {
      return res.status(400).json({ erro: 'Aprovador não informado' });
    }

    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);
    const index = movimentacoes.findIndex(m => m.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Movimentação não encontrada' });
    }

    const movimentacao = movimentacoes[index];

    if (movimentacao.status !== 'pendente') {
      return res.status(400).json({ erro: 'Apenas movimentações pendentes podem ser aprovadas' });
    }

    // Atualizar status
    movimentacao.status = 'aprovada';
    movimentacao.aprovadoPor = aprovadoPor;
    movimentacao.dataAprovacao = new Date().toISOString();

    if (observacao) {
      movimentacao.observacoes.push({
        data: new Date().toISOString(),
        usuario: aprovadoPor,
        texto: observacao
      });
    }

    movimentacoes[index] = movimentacao;
    await writeJsonFile(MOVIMENTACOES_FILE, movimentacoes);

    res.json(movimentacao);
  } catch (error) {
    console.error('Erro ao aprovar requisição:', error);
    res.status(500).json({ erro: 'Erro ao aprovar requisição' });
  }
};

// Iniciar transferência (Estoque Central separa e envia)
exports.iniciarTransferencia = async (req, res) => {
  try {
    const { responsavelExpedicao, lote, validade } = req.body;

    if (!responsavelExpedicao) {
      return res.status(400).json({ erro: 'Responsável pela expedição não informado' });
    }

    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);
    const index = movimentacoes.findIndex(m => m.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Movimentação não encontrada' });
    }

    const movimentacao = movimentacoes[index];

    if (movimentacao.status !== 'aprovada') {
      return res.status(400).json({ erro: 'Apenas movimentações aprovadas podem ser transferidas' });
    }

    // Baixar do estoque central
    const estoqueCentral = await readJsonFile(ESTOQUE_CENTRAL_FILE);
    const medicamentoIndex = estoqueCentral.findIndex(m => m.id === movimentacao.medicamentoId);

    if (medicamentoIndex === -1) {
      return res.status(404).json({ erro: 'Medicamento não encontrado no estoque central' });
    }

    if (estoqueCentral[medicamentoIndex].quantidade < movimentacao.quantidade) {
      return res.status(400).json({ erro: 'Quantidade insuficiente no estoque central' });
    }

    // Atualizar estoque central
    estoqueCentral[medicamentoIndex].quantidade -= movimentacao.quantidade;
    await writeJsonFile(ESTOQUE_CENTRAL_FILE, estoqueCentral);

    // Atualizar movimentação
    movimentacao.status = 'em_transito';
    movimentacao.responsavelExpedicao = responsavelExpedicao;
    movimentacao.dataExpedicao = new Date().toISOString();

    if (lote) movimentacao.lote = lote;
    if (validade) movimentacao.validade = validade;

    movimentacao.observacoes.push({
      data: new Date().toISOString(),
      usuario: responsavelExpedicao,
      texto: `Transferência iniciada. Quantidade: ${movimentacao.quantidade}`
    });

    movimentacoes[index] = movimentacao;
    await writeJsonFile(MOVIMENTACOES_FILE, movimentacoes);

    res.json(movimentacao);
  } catch (error) {
    console.error('Erro ao iniciar transferência:', error);
    res.status(500).json({ erro: 'Erro ao iniciar transferência' });
  }
};

// Confirmar recebimento (Farmácia recebe)
exports.confirmarRecebimento = async (req, res) => {
  try {
    const { recebidoPor, quantidadeRecebida, observacao } = req.body;

    if (!recebidoPor) {
      return res.status(400).json({ erro: 'Responsável pelo recebimento não informado' });
    }

    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);
    const index = movimentacoes.findIndex(m => m.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Movimentação não encontrada' });
    }

    const movimentacao = movimentacoes[index];

    if (movimentacao.status !== 'em_transito') {
      return res.status(400).json({ erro: 'Apenas movimentações em trânsito podem ser recebidas' });
    }

    const qtdRecebida = quantidadeRecebida || movimentacao.quantidade;

    // Adicionar ao estoque da farmácia
    const estoqueFarmacia = await readJsonFile(ESTOQUE_FARMACIA_FILE);
    const medicamentoIndex = estoqueFarmacia.findIndex(m => m.medicamentoId === movimentacao.medicamentoId);

    if (medicamentoIndex === -1) {
      // Criar novo item no estoque da farmácia
      estoqueFarmacia.push({
        id: `FAR${Date.now()}`,
        medicamentoId: movimentacao.medicamentoId,
        medicamentoNome: movimentacao.medicamentoNome,
        quantidade: qtdRecebida,
        lote: movimentacao.lote,
        validade: movimentacao.validade,
        dataEntrada: new Date().toISOString(),
        localizacao: 'Farmácia Principal'
      });
    } else {
      // Incrementar quantidade existente
      estoqueFarmacia[medicamentoIndex].quantidade += qtdRecebida;
      estoqueFarmacia[medicamentoIndex].dataUltimaMovimentacao = new Date().toISOString();
    }

    await writeJsonFile(ESTOQUE_FARMACIA_FILE, estoqueFarmacia);

    // Atualizar movimentação
    movimentacao.status = 'recebida';
    movimentacao.recebidoPor = recebidoPor;
    movimentacao.dataRecebimento = new Date().toISOString();
    movimentacao.quantidadeRecebida = qtdRecebida;

    if (qtdRecebida !== movimentacao.quantidade) {
      movimentacao.divergencia = true;
      movimentacao.quantidadeDivergente = movimentacao.quantidade - qtdRecebida;
    }

    movimentacao.observacoes.push({
      data: new Date().toISOString(),
      usuario: recebidoPor,
      texto: observacao || `Recebimento confirmado. Quantidade: ${qtdRecebida}`
    });

    movimentacoes[index] = movimentacao;
    await writeJsonFile(MOVIMENTACOES_FILE, movimentacoes);

    res.json(movimentacao);
  } catch (error) {
    console.error('Erro ao confirmar recebimento:', error);
    res.status(500).json({ erro: 'Erro ao confirmar recebimento' });
  }
};

// Rejeitar requisição
exports.rejeitarRequisicao = async (req, res) => {
  try {
    const { rejeitadoPor, motivo } = req.body;

    if (!rejeitadoPor || !motivo) {
      return res.status(400).json({ erro: 'Dados incompletos para rejeição' });
    }

    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);
    const index = movimentacoes.findIndex(m => m.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Movimentação não encontrada' });
    }

    const movimentacao = movimentacoes[index];

    if (movimentacao.status !== 'pendente') {
      return res.status(400).json({ erro: 'Apenas movimentações pendentes podem ser rejeitadas' });
    }

    movimentacao.status = 'rejeitada';
    movimentacao.rejeitadoPor = rejeitadoPor;
    movimentacao.dataRejeicao = new Date().toISOString();
    movimentacao.motivoRejeicao = motivo;

    movimentacao.observacoes.push({
      data: new Date().toISOString(),
      usuario: rejeitadoPor,
      texto: `Requisição rejeitada. Motivo: ${motivo}`
    });

    movimentacoes[index] = movimentacao;
    await writeJsonFile(MOVIMENTACOES_FILE, movimentacoes);

    res.json(movimentacao);
  } catch (error) {
    console.error('Erro ao rejeitar requisição:', error);
    res.status(500).json({ erro: 'Erro ao rejeitar requisição' });
  }
};

// Obter estatísticas de movimentações
exports.obterEstatisticas = async (req, res) => {
  try {
    const movimentacoes = await readJsonFile(MOVIMENTACOES_FILE);
    const estoqueFarmacia = await readJsonFile(ESTOQUE_FARMACIA_FILE);

    const estatisticas = {
      totalMovimentacoes: movimentacoes.length,
      pendentes: movimentacoes.filter(m => m.status === 'pendente').length,
      aprovadas: movimentacoes.filter(m => m.status === 'aprovada').length,
      emTransito: movimentacoes.filter(m => m.status === 'em_transito').length,
      recebidas: movimentacoes.filter(m => m.status === 'recebida').length,
      rejeitadas: movimentacoes.filter(m => m.status === 'rejeitada').length,
      comDivergencia: movimentacoes.filter(m => m.divergencia === true).length,
      totalItensEstoqueFarmacia: estoqueFarmacia.reduce((acc, item) => acc + item.quantidade, 0),
      tiposEstoqueFarmacia: estoqueFarmacia.length,
      movimentacoesRecentes: movimentacoes
        .sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao))
        .slice(0, 5)
        .map(m => ({
          id: m.id,
          medicamentoNome: m.medicamentoNome,
          quantidade: m.quantidade,
          status: m.status,
          dataSolicitacao: m.dataSolicitacao
        }))
    };

    res.json(estatisticas);
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ erro: 'Erro ao obter estatísticas' });
  }
};

// Obter estoque da farmácia
exports.obterEstoqueFarmacia = async (req, res) => {
  try {
    const estoqueFarmacia = await readJsonFile(ESTOQUE_FARMACIA_FILE);
    
    // Ordenar por quantidade (menor para maior) para destacar itens em falta
    const estoqueOrdenado = estoqueFarmacia.sort((a, b) => a.quantidade - b.quantidade);

    res.json(estoqueOrdenado);
  } catch (error) {
    console.error('Erro ao obter estoque da farmácia:', error);
    res.status(500).json({ erro: 'Erro ao obter estoque da farmácia' });
  }
};
