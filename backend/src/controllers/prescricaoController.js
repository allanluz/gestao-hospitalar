const fs = require('fs');
const path = require('path');

const prescricoesPath = path.join(__dirname, '../data/prescricoes.json');

// Funções auxiliares para leitura e escrita
const readPrescricoes = () => {
  try {
    const data = fs.readFileSync(prescricoesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler prescrições:', error);
    return [];
  }
};

const writePrescricoes = (data) => {
  fs.writeFileSync(prescricoesPath, JSON.stringify(data, null, 2));
};

// Gerar número de prescrição único
const gerarNumeroPrescricao = () => {
  const prescricoes = readPrescricoes();
  const ano = new Date().getFullYear();
  const mes = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Contar prescrições do mês atual
  const prescricoesMes = prescricoes.filter(p => 
    p.numeroPrescricao.startsWith(`${ano}/${mes}/`)
  );
  
  const numero = String(prescricoesMes.length + 1).padStart(3, '0');
  return `${ano}/${mes}/${numero}`;
};

// GET - Listar todas as prescrições
exports.listarPrescricoes = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const { status, pacienteId, prescritorId, dataInicio, dataFim } = req.query;

    let resultado = prescricoes;

    // Filtros
    if (status) {
      resultado = resultado.filter(p => p.status === status);
    }

    if (pacienteId) {
      resultado = resultado.filter(p => p.pacienteId === pacienteId);
    }

    if (prescritorId) {
      resultado = resultado.filter(p => p.prescritorId === prescritorId);
    }

    if (dataInicio && dataFim) {
      resultado = resultado.filter(p => {
        const dataPrescricao = new Date(p.dataHoraPrescricao);
        return dataPrescricao >= new Date(dataInicio) && dataPrescricao <= new Date(dataFim);
      });
    }

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao listar prescrições',
      detalhes: error.message 
    });
  }
};

// GET - Buscar prescrição por ID
exports.buscarPrescricao = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const prescricao = prescricoes.find(p => p.id === req.params.id);

    if (!prescricao) {
      return res.status(404).json({ erro: 'Prescrição não encontrada' });
    }

    res.json(prescricao);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao buscar prescrição',
      detalhes: error.message 
    });
  }
};

// GET - Buscar prescrições pendentes de um paciente
exports.buscarPrescricoesPendentes = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const { pacienteId } = req.params;

    const prescricoesPendentes = prescricoes.filter(p => 
      p.pacienteId === pacienteId && 
      (p.status === 'pendente' || p.status === 'parcial')
    );

    res.json(prescricoesPendentes);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao buscar prescrições pendentes',
      detalhes: error.message 
    });
  }
};

// POST - Criar nova prescrição
exports.criarPrescricao = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const {
      pacienteId,
      pacienteNome,
      prescritorId,
      prescritorNome,
      prescritorCRM,
      setorOrigem,
      validadeHoras,
      observacoes,
      medicamentos,
      criadoPor
    } = req.body;

    // Validações
    if (!pacienteId || !pacienteNome) {
      return res.status(400).json({ erro: 'Paciente é obrigatório' });
    }

    if (!prescritorId || !prescritorNome || !prescritorCRM) {
      return res.status(400).json({ erro: 'Prescritor completo é obrigatório' });
    }

    if (!medicamentos || medicamentos.length === 0) {
      return res.status(400).json({ erro: 'Pelo menos um medicamento deve ser prescrito' });
    }

    // Validar cada medicamento
    for (const med of medicamentos) {
      if (!med.medicamentoId || !med.medicamentoNome || !med.dose || !med.via || !med.frequencia) {
        return res.status(400).json({ 
          erro: 'Dados incompletos do medicamento',
          medicamento: med.medicamentoNome || 'desconhecido'
        });
      }
    }

    // Criar ID único
    const novoId = `PRESC-${String(prescricoes.length + 1).padStart(3, '0')}`;
    const numeroPrescricao = gerarNumeroPrescricao();
    const dataHora = new Date().toISOString();

    // Processar medicamentos
    const medicamentosProcessados = medicamentos.map(med => ({
      medicamentoId: med.medicamentoId,
      medicamentoNome: med.medicamentoNome,
      dose: med.dose,
      via: med.via,
      frequencia: med.frequencia,
      duracao: med.duracao || 'contínuo',
      quantidadeTotal: med.quantidadeTotal || 0,
      quantidadeDispensada: 0,
      statusItem: 'pendente',
      observacoes: med.observacoes || '',
      urgente: med.urgente || false,
      dispensacoes: []
    }));

    const novaPrescricao = {
      id: novoId,
      numeroPrescricao,
      pacienteId,
      pacienteNome,
      prescritorId,
      prescritorNome,
      prescritorCRM,
      dataHoraPrescricao: dataHora,
      setorOrigem: setorOrigem || '',
      status: 'pendente',
      validadeHoras: validadeHoras || 24,
      observacoes: observacoes || '',
      medicamentos: medicamentosProcessados,
      criadoPor: criadoPor || prescritorNome,
      criadoEm: dataHora,
      atualizadoEm: dataHora
    };

    prescricoes.push(novaPrescricao);
    writePrescricoes(prescricoes);

    res.status(201).json({
      mensagem: 'Prescrição criada com sucesso',
      prescricao: novaPrescricao
    });
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao criar prescrição',
      detalhes: error.message 
    });
  }
};

// PUT - Atualizar prescrição (apenas observações e status)
exports.atualizarPrescricao = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const index = prescricoes.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Prescrição não encontrada' });
    }

    const prescricao = prescricoes[index];

    // Não permitir edição de prescrições canceladas ou dispensadas
    if (prescricao.status === 'cancelada' || prescricao.status === 'dispensada') {
      return res.status(400).json({ 
        erro: 'Não é possível editar prescrições canceladas ou totalmente dispensadas' 
      });
    }

    // Permitir apenas atualização de observações
    const { observacoes } = req.body;

    prescricao.observacoes = observacoes || prescricao.observacoes;
    prescricao.atualizadoEm = new Date().toISOString();

    prescricoes[index] = prescricao;
    writePrescricoes(prescricoes);

    res.json({
      mensagem: 'Prescrição atualizada com sucesso',
      prescricao
    });
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao atualizar prescrição',
      detalhes: error.message 
    });
  }
};

// PUT - Cancelar prescrição
exports.cancelarPrescricao = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const index = prescricoes.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Prescrição não encontrada' });
    }

    const prescricao = prescricoes[index];

    // Verificar se já foi cancelada
    if (prescricao.status === 'cancelada') {
      return res.status(400).json({ erro: 'Prescrição já está cancelada' });
    }

    // Verificar se já foi totalmente dispensada
    if (prescricao.status === 'dispensada') {
      return res.status(400).json({ 
        erro: 'Não é possível cancelar prescrição já dispensada' 
      });
    }

    const { motivoCancelamento } = req.body;

    if (!motivoCancelamento) {
      return res.status(400).json({ erro: 'Motivo do cancelamento é obrigatório' });
    }

    prescricao.status = 'cancelada';
    prescricao.dataCancelamento = new Date().toISOString();
    prescricao.motivoCancelamento = motivoCancelamento;
    prescricao.atualizadoEm = new Date().toISOString();

    prescricoes[index] = prescricao;
    writePrescricoes(prescricoes);

    res.json({
      mensagem: 'Prescrição cancelada com sucesso',
      prescricao
    });
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao cancelar prescrição',
      detalhes: error.message 
    });
  }
};

// GET - Estatísticas de prescrições
exports.obterEstatisticas = (req, res) => {
  try {
    const prescricoes = readPrescricoes();

    const estatisticas = {
      total: prescricoes.length,
      pendentes: prescricoes.filter(p => p.status === 'pendente').length,
      parciais: prescricoes.filter(p => p.status === 'parcial').length,
      dispensadas: prescricoes.filter(p => p.status === 'dispensada').length,
      canceladas: prescricoes.filter(p => p.status === 'cancelada').length,
      urgentes: prescricoes.filter(p => 
        p.medicamentos.some(m => m.urgente === true) && 
        (p.status === 'pendente' || p.status === 'parcial')
      ).length,
      expiradas: prescricoes.filter(p => {
        if (p.status !== 'pendente' && p.status !== 'parcial') return false;
        const dataExpiracao = new Date(p.dataHoraPrescricao);
        dataExpiracao.setHours(dataExpiracao.getHours() + p.validadeHoras);
        return new Date() > dataExpiracao;
      }).length
    };

    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao obter estatísticas',
      detalhes: error.message 
    });
  }
};

// GET - Prescrições por prescritor
exports.listarPorPrescritor = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const { prescritorId } = req.params;

    const prescricoesPrescritor = prescricoes.filter(p => 
      p.prescritorId === prescritorId
    );

    res.json(prescricoesPrescritor);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao listar prescrições do prescritor',
      detalhes: error.message 
    });
  }
};

// GET - Prescrições por paciente
exports.listarPorPaciente = (req, res) => {
  try {
    const prescricoes = readPrescricoes();
    const { pacienteId } = req.params;

    const prescricoesPaciente = prescricoes
      .filter(p => p.pacienteId === pacienteId)
      .sort((a, b) => new Date(b.dataHoraPrescricao) - new Date(a.dataHoraPrescricao));

    res.json(prescricoesPaciente);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao listar prescrições do paciente',
      detalhes: error.message 
    });
  }
};
