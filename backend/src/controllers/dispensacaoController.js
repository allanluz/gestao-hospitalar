const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DISPENSACOES_FILE = path.join(DATA_DIR, 'dispensacoes.json');
const PRESCRICOES_FILE = path.join(DATA_DIR, 'prescricoes.json');
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

// Gerar ID único para dispensações
function gerarIdDispensacao() {
  return `DISP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Validar escaneamento de códigos para dispensação
exports.validarEscaneamento = async (req, res) => {
  try {
    const { pacienteId, medicamentoId } = req.body;

    if (!pacienteId || !medicamentoId) {
      return res.status(400).json({ 
        erro: 'IDs do paciente e medicamento são obrigatórios',
        valido: false
      });
    }

    // Buscar prescrições do paciente
    const prescricoes = await readJsonFile(PRESCRICOES_FILE);
    const prescricoesPaciente = prescricoes.filter(p => 
      p.pacienteId === pacienteId && 
      (p.status === 'pendente' || p.status === 'parcial')
    );

    if (prescricoesPaciente.length === 0) {
      return res.status(404).json({ 
        erro: 'Nenhuma prescrição pendente encontrada para este paciente',
        valido: false,
        tipo: 'sem_prescricao'
      });
    }

    // Verificar se o medicamento está em alguma prescrição do paciente
    let prescricaoEncontrada = null;
    let medicamentoEncontrado = null;

    for (const prescricao of prescricoesPaciente) {
      const medicamento = prescricao.medicamentos.find(m => 
        m.medicamentoId === medicamentoId && 
        (m.status === 'pendente' || m.status === 'parcial')
      );
      
      if (medicamento) {
        prescricaoEncontrada = prescricao;
        medicamentoEncontrado = medicamento;
        break;
      }
    }

    if (!prescricaoEncontrada || !medicamentoEncontrado) {
      return res.status(403).json({ 
        erro: `Medicamento não prescrito para este paciente ou já dispensado`,
        valido: false,
        tipo: 'medicamento_nao_prescrito',
        detalhe: {
          pacienteNome: prescricoesPaciente[0].pacienteNome,
          prescricoesAbertas: prescricoesPaciente.length
        }
      });
    }

    // Verificar estoque
    const estoqueFarmacia = await readJsonFile(ESTOQUE_FARMACIA_FILE);
    const itemEstoque = estoqueFarmacia.find(e => e.medicamentoId === medicamentoId);

    if (!itemEstoque) {
      return res.status(404).json({ 
        erro: 'Medicamento não encontrado no estoque da farmácia',
        valido: false,
        tipo: 'sem_estoque'
      });
    }

    if (itemEstoque.quantidade < medicamentoEncontrado.quantidade) {
      return res.status(400).json({ 
        erro: `Estoque insuficiente. Disponível: ${itemEstoque.quantidade}, Necessário: ${medicamentoEncontrado.quantidade}`,
        valido: false,
        tipo: 'estoque_insuficiente',
        detalhe: {
          disponivel: itemEstoque.quantidade,
          necessario: medicamentoEncontrado.quantidade
        }
      });
    }

    // Validação bem-sucedida
    res.json({
      valido: true,
      mensagem: '✅ Validação bem-sucedida! Dispensação liberada.',
      dados: {
        prescricaoId: prescricaoEncontrada.id,
        prescricaoData: prescricaoEncontrada.dataPrescricao,
        prescritor: prescricaoEncontrada.medico,
        pacienteId: prescricaoEncontrada.pacienteId,
        pacienteNome: prescricaoEncontrada.pacienteNome,
        medicamentoId: medicamentoEncontrado.medicamentoId,
        medicamentoNome: medicamentoEncontrado.nome,
        quantidade: medicamentoEncontrado.quantidade,
        posologia: medicamentoEncontrado.posologia,
        via: medicamentoEncontrado.via,
        frequencia: medicamentoEncontrado.frequencia,
        lote: itemEstoque.lote,
        validade: itemEstoque.validade,
        estoqueDisponivel: itemEstoque.quantidade
      }
    });
  } catch (error) {
    console.error('Erro ao validar escaneamento:', error);
    res.status(500).json({ 
      erro: 'Erro ao validar escaneamento',
      valido: false
    });
  }
};

// Listar todas as dispensações com filtros
exports.listarDispensacoes = async (req, res) => {
  try {
    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    const { prescricaoId, status, dataInicio, dataFim, pacienteNome } = req.query;

    let resultado = [...dispensacoes];

    // Filtro por prescrição
    if (prescricaoId) {
      resultado = resultado.filter(d => d.prescricaoId === prescricaoId);
    }

    // Filtro por status (pendente, dispensada, administrada, cancelada)
    if (status) {
      resultado = resultado.filter(d => d.status === status);
    }

    // Filtro por paciente
    if (pacienteNome) {
      resultado = resultado.filter(d => 
        d.pacienteNome.toLowerCase().includes(pacienteNome.toLowerCase())
      );
    }

    // Filtro por período
    if (dataInicio) {
      resultado = resultado.filter(d => new Date(d.dataDispensacao) >= new Date(dataInicio));
    }
    if (dataFim) {
      resultado = resultado.filter(d => new Date(d.dataDispensacao) <= new Date(dataFim));
    }

    // Ordenar por data mais recente
    resultado.sort((a, b) => new Date(b.dataDispensacao) - new Date(a.dataDispensacao));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar dispensações:', error);
    res.status(500).json({ erro: 'Erro ao listar dispensações' });
  }
};

// Obter uma dispensação específica
exports.obterDispensacao = async (req, res) => {
  try {
    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    const dispensacao = dispensacoes.find(d => d.id === req.params.id);

    if (!dispensacao) {
      return res.status(404).json({ erro: 'Dispensação não encontrada' });
    }

    res.json(dispensacao);
  } catch (error) {
    console.error('Erro ao obter dispensação:', error);
    res.status(500).json({ erro: 'Erro ao obter dispensação' });
  }
};

// Dispensar medicamento (1ª verificação - Farmacêutico)
exports.dispensarMedicamento = async (req, res) => {
  try {
    const {
      prescricaoId,
      medicamentoId,
      medicamentoNome,
      quantidade,
      pacienteId,
      pacienteNome,
      farmaceutico,
      lote,
      validade,
      observacao
    } = req.body;

    // Validações
    if (!prescricaoId || !medicamentoId || !quantidade || !pacienteId || !farmaceutico) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    if (quantidade <= 0) {
      return res.status(400).json({ erro: 'Quantidade deve ser maior que zero' });
    }

    // Verificar prescrição
    const prescricoes = await readJsonFile(PRESCRICOES_FILE);
    const prescricao = prescricoes.find(p => p.id === prescricaoId);

    if (!prescricao) {
      return res.status(404).json({ erro: 'Prescrição não encontrada' });
    }

    if (prescricao.status === 'cancelada') {
      return res.status(400).json({ erro: 'Prescrição cancelada' });
    }

    // Verificar disponibilidade no estoque da farmácia
    const estoqueFarmacia = await readJsonFile(ESTOQUE_FARMACIA_FILE);
    const itemEstoque = estoqueFarmacia.find(e => e.medicamentoId === medicamentoId);

    if (!itemEstoque) {
      return res.status(404).json({ erro: 'Medicamento não disponível no estoque da farmácia' });
    }

    if (itemEstoque.quantidade < quantidade) {
      return res.status(400).json({ 
        erro: 'Quantidade insuficiente no estoque da farmácia',
        disponivel: itemEstoque.quantidade,
        solicitado: quantidade
      });
    }

    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);

    const novaDispensacao = {
      id: gerarIdDispensacao(),
      prescricaoId,
      medicamentoId,
      medicamentoNome: medicamentoNome || itemEstoque.medicamentoNome,
      quantidade,
      pacienteId,
      pacienteNome,
      lote: lote || itemEstoque.lote,
      validade: validade || itemEstoque.validade,
      status: 'dispensada', // Aguardando 2ª verificação
      
      // 1ª Verificação (Farmacêutico)
      farmaceutico,
      dataDispensacao: new Date().toISOString(),
      
      // 2ª Verificação (Enfermeiro) - ainda não realizada
      enfermeiro: null,
      dataAdministracao: null,
      
      // Controle
      horarioPrescrito: null, // Será preenchido na administração
      horarioRealAdministracao: null,
      
      observacoes: observacao ? [
        {
          data: new Date().toISOString(),
          usuario: farmaceutico,
          texto: observacao,
          tipo: 'dispensacao'
        }
      ] : []
    };

    dispensacoes.push(novaDispensacao);
    await writeJsonFile(DISPENSACOES_FILE, dispensacoes);

    // NÃO baixa do estoque ainda - só na 2ª verificação (administração)

    res.status(201).json(novaDispensacao);
  } catch (error) {
    console.error('Erro ao dispensar medicamento:', error);
    res.status(500).json({ erro: 'Erro ao dispensar medicamento' });
  }
};

// Confirmar administração (2ª verificação - Enfermeiro)
exports.confirmarAdministracao = async (req, res) => {
  try {
    const { enfermeiro, horarioPrescrito, observacao } = req.body;

    if (!enfermeiro) {
      return res.status(400).json({ erro: 'Enfermeiro responsável não informado' });
    }

    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    const index = dispensacoes.findIndex(d => d.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Dispensação não encontrada' });
    }

    const dispensacao = dispensacoes[index];

    if (dispensacao.status !== 'dispensada') {
      return res.status(400).json({ erro: 'Apenas dispensações pendentes podem ser administradas' });
    }

    // Verificar novamente o estoque (pode ter mudado)
    const estoqueFarmacia = await readJsonFile(ESTOQUE_FARMACIA_FILE);
    const estoqueIndex = estoqueFarmacia.findIndex(e => e.medicamentoId === dispensacao.medicamentoId);

    if (estoqueIndex === -1) {
      return res.status(404).json({ erro: 'Medicamento não encontrado no estoque' });
    }

    if (estoqueFarmacia[estoqueIndex].quantidade < dispensacao.quantidade) {
      return res.status(400).json({ 
        erro: 'Quantidade insuficiente no estoque',
        disponivel: estoqueFarmacia[estoqueIndex].quantidade,
        necessario: dispensacao.quantidade
      });
    }

    // BAIXAR DO ESTOQUE DA FARMÁCIA
    estoqueFarmacia[estoqueIndex].quantidade -= dispensacao.quantidade;
    estoqueFarmacia[estoqueIndex].dataUltimaMovimentacao = new Date().toISOString();
    await writeJsonFile(ESTOQUE_FARMACIA_FILE, estoqueFarmacia);

    // Atualizar dispensação
    const horarioReal = new Date().toISOString();
    dispensacao.status = 'administrada';
    dispensacao.enfermeiro = enfermeiro;
    dispensacao.dataAdministracao = horarioReal;
    dispensacao.horarioPrescrito = horarioPrescrito || null;
    dispensacao.horarioRealAdministracao = horarioReal;

    // Calcular atraso (se horário prescrito foi informado)
    if (horarioPrescrito) {
      const prescrito = new Date(horarioPrescrito);
      const real = new Date(horarioReal);
      const atrasoMinutos = Math.floor((real - prescrito) / (1000 * 60));
      
      if (atrasoMinutos > 0) {
        dispensacao.atrasoMinutos = atrasoMinutos;
      }
    }

    dispensacao.observacoes.push({
      data: horarioReal,
      usuario: enfermeiro,
      texto: observacao || `Medicamento administrado ao paciente ${dispensacao.pacienteNome}`,
      tipo: 'administracao'
    });

    dispensacoes[index] = dispensacao;
    await writeJsonFile(DISPENSACOES_FILE, dispensacoes);

    // Atualizar status da prescrição
    const prescricoes = await readJsonFile(PRESCRICOES_FILE);
    const prescricaoIndex = prescricoes.findIndex(p => p.id === dispensacao.prescricaoId);
    
    if (prescricaoIndex !== -1) {
      const prescricao = prescricoes[prescricaoIndex];
      
      // Verificar se há medicamentos ainda pendentes
      const dispensacoesDaPrescricao = dispensacoes.filter(d => d.prescricaoId === prescricao.id);
      const todasAdministradas = dispensacoesDaPrescricao.every(d => d.status === 'administrada');
      
      if (todasAdministradas && prescricao.status !== 'dispensada') {
        prescricao.status = 'dispensada';
        await writeJsonFile(PRESCRICOES_FILE, prescricoes);
      }
    }

    res.json(dispensacao);
  } catch (error) {
    console.error('Erro ao confirmar administração:', error);
    res.status(500).json({ erro: 'Erro ao confirmar administração' });
  }
};

// Cancelar dispensação
exports.cancelarDispensacao = async (req, res) => {
  try {
    const { canceladoPor, motivo } = req.body;

    if (!canceladoPor || !motivo) {
      return res.status(400).json({ erro: 'Responsável e motivo são obrigatórios' });
    }

    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    const index = dispensacoes.findIndex(d => d.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Dispensação não encontrada' });
    }

    const dispensacao = dispensacoes[index];

    if (dispensacao.status === 'administrada') {
      return res.status(400).json({ erro: 'Não é possível cancelar uma dispensação já administrada' });
    }

    if (dispensacao.status === 'cancelada') {
      return res.status(400).json({ erro: 'Dispensação já está cancelada' });
    }

    dispensacao.status = 'cancelada';
    dispensacao.canceladoPor = canceladoPor;
    dispensacao.dataCancelamento = new Date().toISOString();
    dispensacao.motivoCancelamento = motivo;

    dispensacao.observacoes.push({
      data: new Date().toISOString(),
      usuario: canceladoPor,
      texto: `Dispensação cancelada. Motivo: ${motivo}`,
      tipo: 'cancelamento'
    });

    dispensacoes[index] = dispensacao;
    await writeJsonFile(DISPENSACOES_FILE, dispensacoes);

    res.json(dispensacao);
  } catch (error) {
    console.error('Erro ao cancelar dispensação:', error);
    res.status(500).json({ erro: 'Erro ao cancelar dispensação' });
  }
};

// Obter dispensações pendentes (aguardando 2ª verificação)
exports.listarDispensacoesPendentes = async (req, res) => {
  try {
    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    
    const pendentes = dispensacoes
      .filter(d => d.status === 'dispensada') // Dispensada mas não administrada
      .sort((a, b) => new Date(a.dataDispensacao) - new Date(b.dataDispensacao)); // Mais antigas primeiro

    res.json(pendentes);
  } catch (error) {
    console.error('Erro ao listar pendentes:', error);
    res.status(500).json({ erro: 'Erro ao listar pendentes' });
  }
};

// Obter dispensações por prescrição
exports.listarPorPrescricao = async (req, res) => {
  try {
    const { prescricaoId } = req.params;
    
    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    const resultado = dispensacoes
      .filter(d => d.prescricaoId === prescricaoId)
      .sort((a, b) => new Date(b.dataDispensacao) - new Date(a.dataDispensacao));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar por prescrição:', error);
    res.status(500).json({ erro: 'Erro ao listar por prescrição' });
  }
};

// Obter dispensações por paciente
exports.listarPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    
    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    const resultado = dispensacoes
      .filter(d => d.pacienteId === pacienteId)
      .sort((a, b) => new Date(b.dataDispensacao) - new Date(a.dataDispensacao));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar por paciente:', error);
    res.status(500).json({ erro: 'Erro ao listar por paciente' });
  }
};

// Obter estatísticas de dispensações
exports.obterEstatisticas = async (req, res) => {
  try {
    const dispensacoes = await readJsonFile(DISPENSACOES_FILE);
    const estoqueFarmacia = await readJsonFile(ESTOQUE_FARMACIA_FILE);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dispensacoesHoje = dispensacoes.filter(d => {
      const data = new Date(d.dataDispensacao);
      data.setHours(0, 0, 0, 0);
      return data.getTime() === hoje.getTime();
    });

    const administradasHoje = dispensacoesHoje.filter(d => d.status === 'administrada');

    // Calcular atrasos
    const comAtraso = dispensacoes.filter(d => d.atrasoMinutos && d.atrasoMinutos > 15);
    
    // Medicamentos mais dispensados
    const contagemMedicamentos = {};
    dispensacoes.forEach(d => {
      if (d.status === 'administrada') {
        contagemMedicamentos[d.medicamentoNome] = (contagemMedicamentos[d.medicamentoNome] || 0) + d.quantidade;
      }
    });

    const topMedicamentos = Object.entries(contagemMedicamentos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nome, quantidade]) => ({ nome, quantidade }));

    const estatisticas = {
      totalDispensacoes: dispensacoes.length,
      pendentesAdministracao: dispensacoes.filter(d => d.status === 'dispensada').length,
      administradas: dispensacoes.filter(d => d.status === 'administrada').length,
      canceladas: dispensacoes.filter(d => d.status === 'cancelada').length,
      dispensacoesHoje: dispensacoesHoje.length,
      administradasHoje: administradasHoje.length,
      comAtraso: comAtraso.length,
      taxaAdministracao: dispensacoes.length > 0 
        ? ((dispensacoes.filter(d => d.status === 'administrada').length / dispensacoes.length) * 100).toFixed(1) 
        : 0,
      estoqueFarmacia: {
        totalItens: estoqueFarmacia.reduce((acc, item) => acc + item.quantidade, 0),
        tiposMedicamentos: estoqueFarmacia.length
      },
      topMedicamentos,
      dispensacoesRecentes: dispensacoes
        .sort((a, b) => new Date(b.dataDispensacao) - new Date(a.dataDispensacao))
        .slice(0, 5)
        .map(d => ({
          id: d.id,
          medicamentoNome: d.medicamentoNome,
          pacienteNome: d.pacienteNome,
          quantidade: d.quantidade,
          status: d.status,
          dataDispensacao: d.dataDispensacao
        }))
    };

    res.json(estatisticas);
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ erro: 'Erro ao obter estatísticas' });
  }
};
