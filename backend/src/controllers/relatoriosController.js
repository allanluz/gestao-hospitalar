const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Função auxiliar para ler arquivo JSON
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler ${filename}:`, error);
    return filename === 'estoque-farmacia.json' ? {} : [];
  }
}

// Função auxiliar para calcular diferença de dias
function diasEntre(data1, data2) {
  const diff = new Date(data2) - new Date(data1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Dashboard Executivo - Visão Geral Completa
 */
exports.obterDashboardExecutivo = async (req, res) => {
  try {
    const prescricoes = await readJsonFile('prescricoes.json');
    const movimentacoes = await readJsonFile('movimentacoes.json');
    const dispensacoes = await readJsonFile('dispensacoes.json');
    const estoqueFarmacia = await readJsonFile('estoque-farmacia.json');
    const medicamentos = await readJsonFile('medicamentos.json');

    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // ===== PRESCRIÇÕES =====
    const totalPrescricoes = prescricoes.length;
    const prescricoesPendentes = prescricoes.filter(p => p.status === 'pendente').length;
    const prescricoesDispensadas = prescricoes.filter(p => p.status === 'dispensada').length;
    const prescricoesCanceladas = prescricoes.filter(p => p.status === 'cancelada').length;
    const prescricoesDoMes = prescricoes.filter(p => new Date(p.dataPrescricao) >= inicioMes).length;

    // ===== DISPENSAÇÕES =====
    const totalDispensacoes = dispensacoes.length;
    const dispensacoesPendentes = dispensacoes.filter(d => d.status === 'dispensada').length;
    const dispensacoesAdministradas = dispensacoes.filter(d => d.status === 'administrada').length;
    const dispensacoesComAtraso = dispensacoes.filter(d => d.atrasoMinutos && d.atrasoMinutos > 15).length;
    const dispensacoesDoMes = dispensacoes.filter(d => new Date(d.dataDispensacao) >= inicioMes).length;

    // Calcular tempo médio de dispensação
    let tempoMedioDispensacao = 0;
    if (dispensacoes.length > 0) {
      const tempos = dispensacoes
        .filter(d => d.status === 'administrada')
        .map(d => {
          const prescricao = prescricoes.find(p => p.id === d.prescricaoId);
          if (prescricao) {
            return diasEntre(prescricao.dataPrescricao, d.dataAdministracao);
          }
          return 0;
        });
      
      if (tempos.length > 0) {
        tempoMedioDispensacao = (tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1);
      }
    }

    // ===== MOVIMENTAÇÕES =====
    const totalMovimentacoes = movimentacoes.length;
    const movimentacoesEntrada = movimentacoes.filter(m => m.tipo === 'entrada').length;
    const movimentacoesSaida = movimentacoes.filter(m => m.tipo === 'saida').length;
    const movimentacoesDoMes = movimentacoes.filter(m => new Date(m.data) >= inicioMes).length;

    // ===== ESTOQUE FARMÁCIA =====
    const totalItensEstoque = Object.keys(estoqueFarmacia).length;
    const estoqueTotal = Object.values(estoqueFarmacia).reduce((sum, item) => sum + item.quantidade, 0);
    const medicamentosAbaixoMinimo = Object.values(estoqueFarmacia).filter(
      item => item.quantidade < (item.estoqueMinimo || 10)
    ).length;

    // Medicamentos próximos ao vencimento (30 dias)
    const proximosVencimento = Object.entries(estoqueFarmacia)
      .filter(([_, item]) => {
        if (item.validade) {
          const diasRestantes = diasEntre(new Date(), new Date(item.validade));
          return diasRestantes >= 0 && diasRestantes <= 30;
        }
        return false;
      })
      .map(([medicamentoId, item]) => {
        const med = medicamentos.find(m => m.id === medicamentoId);
        return {
          medicamentoId,
          medicamentoNome: med?.nome || 'Desconhecido',
          quantidade: item.quantidade,
          validade: item.validade,
          diasRestantes: diasEntre(new Date(), new Date(item.validade))
        };
      })
      .sort((a, b) => a.diasRestantes - b.diasRestantes);

    // ===== ALERTAS E INDICADORES =====
    const alertas = [];

    if (prescricoesPendentes > 0) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Prescrições Pendentes',
        mensagem: `${prescricoesPendentes} prescrição(ões) aguardando dispensação`,
        prioridade: prescricoesPendentes > 5 ? 'alta' : 'media'
      });
    }

    if (dispensacoesPendentes > 0) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Dispensações Aguardando Administração',
        mensagem: `${dispensacoesPendentes} medicamento(s) dispensado(s) aguardando administração`,
        prioridade: dispensacoesPendentes > 10 ? 'alta' : 'media'
      });
    }

    if (medicamentosAbaixoMinimo > 0) {
      alertas.push({
        tipo: 'danger',
        titulo: 'Estoque Baixo',
        mensagem: `${medicamentosAbaixoMinimo} medicamento(s) abaixo do estoque mínimo`,
        prioridade: 'alta'
      });
    }

    if (proximosVencimento.length > 0) {
      alertas.push({
        tipo: 'danger',
        titulo: 'Medicamentos Próximos ao Vencimento',
        mensagem: `${proximosVencimento.length} medicamento(s) vencem em até 30 dias`,
        prioridade: 'alta'
      });
    }

    if (dispensacoesComAtraso > 0) {
      const percentualAtraso = ((dispensacoesComAtraso / dispensacoesAdministradas) * 100).toFixed(1);
      alertas.push({
        tipo: 'warning',
        titulo: 'Atrasos na Administração',
        mensagem: `${percentualAtraso}% das administrações com atraso > 15min`,
        prioridade: percentualAtraso > 20 ? 'alta' : 'media'
      });
    }

    // ===== RESPOSTA =====
    res.json({
      resumo: {
        prescricoes: {
          total: totalPrescricoes,
          pendentes: prescricoesPendentes,
          dispensadas: prescricoesDispensadas,
          canceladas: prescricoesCanceladas,
          doMes: prescricoesDoMes,
          taxaDispensacao: totalPrescricoes > 0 
            ? ((prescricoesDispensadas / totalPrescricoes) * 100).toFixed(1)
            : '0.0'
        },
        dispensacoes: {
          total: totalDispensacoes,
          pendentes: dispensacoesPendentes,
          administradas: dispensacoesAdministradas,
          comAtraso: dispensacoesComAtraso,
          doMes: dispensacoesDoMes,
          tempoMedio: `${tempoMedioDispensacao} dias`,
          taxaAdministracao: totalDispensacoes > 0
            ? ((dispensacoesAdministradas / totalDispensacoes) * 100).toFixed(1)
            : '0.0'
        },
        movimentacoes: {
          total: totalMovimentacoes,
          entradas: movimentacoesEntrada,
          saidas: movimentacoesSaida,
          doMes: movimentacoesDoMes
        },
        estoque: {
          totalItens: totalItensEstoque,
          quantidadeTotal: estoqueTotal,
          abaixoMinimo: medicamentosAbaixoMinimo,
          proximosVencimento: proximosVencimento.length
        }
      },
      alertas,
      proximosVencimento: proximosVencimento.slice(0, 10),
      indicadores: {
        eficienciaDispensacao: totalPrescricoes > 0
          ? ((prescricoesDispensadas / totalPrescricoes) * 100).toFixed(1)
          : '0.0',
        tempoMedioDispensacao: `${tempoMedioDispensacao} dias`,
        taxaAtraso: dispensacoesAdministradas > 0
          ? ((dispensacoesComAtraso / dispensacoesAdministradas) * 100).toFixed(1)
          : '0.0',
        rotatividade: movimentacoesDoMes
      }
    });
  } catch (error) {
    console.error('Erro ao gerar dashboard executivo:', error);
    res.status(500).json({ error: 'Erro ao gerar dashboard executivo' });
  }
};

/**
 * Relatório de Prescrições Não Dispensadas
 */
exports.obterPrescricoesNaoDispensadas = async (req, res) => {
  try {
    const { dataInicio, dataFim, prescritor, setor } = req.query;

    const prescricoes = await readJsonFile('prescricoes.json');
    const dispensacoes = await readJsonFile('dispensacoes.json');

    // Filtrar prescrições pendentes ou parcialmente dispensadas
    let prescricoesNaoDispensadas = prescricoes.filter(p => 
      p.status === 'pendente' || p.status === 'parcial'
    );

    // Aplicar filtros
    if (dataInicio) {
      prescricoesNaoDispensadas = prescricoesNaoDispensadas.filter(p =>
        new Date(p.dataPrescricao) >= new Date(dataInicio)
      );
    }

    if (dataFim) {
      prescricoesNaoDispensadas = prescricoesNaoDispensadas.filter(p =>
        new Date(p.dataPrescricao) <= new Date(dataFim)
      );
    }

    if (prescritor) {
      prescricoesNaoDispensadas = prescricoesNaoDispensadas.filter(p =>
        p.prescritor.toLowerCase().includes(prescritor.toLowerCase())
      );
    }

    if (setor) {
      prescricoesNaoDispensadas = prescricoesNaoDispensadas.filter(p =>
        p.setor && p.setor.toLowerCase().includes(setor.toLowerCase())
      );
    }

    // Calcular métricas para cada prescrição
    const prescricoesComMetricas = prescricoesNaoDispensadas.map(p => {
      const diasEspera = diasEntre(p.dataPrescricao, new Date());
      
      // Verificar quantos medicamentos foram dispensados
      const medicamentosDispensados = dispensacoes.filter(d => d.prescricaoId === p.id).length;
      const totalMedicamentos = p.medicamentos ? p.medicamentos.length : 0;
      
      // Criticidade baseada no tempo de espera
      let criticidade = 'baixa';
      if (diasEspera >= 3) criticidade = 'alta';
      else if (diasEspera >= 1) criticidade = 'media';

      return {
        ...p,
        diasEspera,
        medicamentosDispensados,
        totalMedicamentos,
        pendentes: totalMedicamentos - medicamentosDispensados,
        criticidade
      };
    });

    // Ordenar por criticidade e dias de espera
    prescricoesComMetricas.sort((a, b) => {
      const criticidadeOrder = { alta: 3, media: 2, baixa: 1 };
      if (criticidadeOrder[b.criticidade] !== criticidadeOrder[a.criticidade]) {
        return criticidadeOrder[b.criticidade] - criticidadeOrder[a.criticidade];
      }
      return b.diasEspera - a.diasEspera;
    });

    // Estatísticas
    const stats = {
      total: prescricoesComMetricas.length,
      criticas: prescricoesComMetricas.filter(p => p.criticidade === 'alta').length,
      medias: prescricoesComMetricas.filter(p => p.criticidade === 'media').length,
      baixas: prescricoesComMetricas.filter(p => p.criticidade === 'baixa').length,
      tempoMedioEspera: prescricoesComMetricas.length > 0
        ? (prescricoesComMetricas.reduce((sum, p) => sum + p.diasEspera, 0) / prescricoesComMetricas.length).toFixed(1)
        : '0.0'
    };

    res.json({
      prescricoes: prescricoesComMetricas,
      estatisticas: stats
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de prescrições não dispensadas:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};

/**
 * Relatório de Medicamentos Não Dispensados (Estoque Parado)
 */
exports.obterMedicamentosNaoDispensados = async (req, res) => {
  try {
    const { diasMinimo = 7 } = req.query;

    const estoqueFarmacia = await readJsonFile('estoque-farmacia.json');
    const dispensacoes = await readJsonFile('dispensacoes.json');
    const medicamentos = await readJsonFile('medicamentos.json');

    const hoje = new Date();
    const dataLimite = new Date(hoje.getTime() - (parseInt(diasMinimo) * 24 * 60 * 60 * 1000));

    const medicamentosParados = [];

    for (const [medicamentoId, itemEstoque] of Object.entries(estoqueFarmacia)) {
      if (itemEstoque.quantidade === 0) continue;

      // Buscar última dispensação deste medicamento
      const ultimaDispensacao = dispensacoes
        .filter(d => d.medicamentoId === medicamentoId)
        .sort((a, b) => new Date(b.dataDispensacao) - new Date(a.dataDispensacao))[0];

      const dataUltimaMovimentacao = ultimaDispensacao 
        ? new Date(ultimaDispensacao.dataDispensacao)
        : itemEstoque.dataUltimaMovimentacao 
          ? new Date(itemEstoque.dataUltimaMovimentacao)
          : null;

      // Se não há movimentação ou a última foi antes do limite
      if (!dataUltimaMovimentacao || dataUltimaMovimentacao < dataLimite) {
        const diasParado = dataUltimaMovimentacao 
          ? diasEntre(dataUltimaMovimentacao, hoje)
          : null;

        const med = medicamentos.find(m => m.id === medicamentoId);
        
        // Calcular risco de vencimento
        let riscoVencimento = 'baixo';
        let diasParaVencer = null;
        if (itemEstoque.validade) {
          diasParaVencer = diasEntre(hoje, new Date(itemEstoque.validade));
          if (diasParaVencer < 0) riscoVencimento = 'vencido';
          else if (diasParaVencer <= 30) riscoVencimento = 'alto';
          else if (diasParaVencer <= 60) riscoVencimento = 'medio';
        }

        // Estimativa de perda financeira (se houver custo)
        const custoEstimado = med && med.custoUnitario 
          ? (med.custoUnitario * itemEstoque.quantidade).toFixed(2)
          : null;

        medicamentosParados.push({
          medicamentoId,
          medicamentoNome: med?.nome || 'Desconhecido',
          quantidade: itemEstoque.quantidade,
          lote: itemEstoque.lote,
          validade: itemEstoque.validade,
          diasParado,
          ultimaMovimentacao: dataUltimaMovimentacao,
          riscoVencimento,
          diasParaVencer,
          custoEstimado
        });
      }
    }

    // Ordenar por risco e dias parado
    medicamentosParados.sort((a, b) => {
      const riscoOrder = { vencido: 4, alto: 3, medio: 2, baixo: 1 };
      if (riscoOrder[b.riscoVencimento] !== riscoOrder[a.riscoVencimento]) {
        return riscoOrder[b.riscoVencimento] - riscoOrder[a.riscoVencimento];
      }
      return (b.diasParado || 0) - (a.diasParado || 0);
    });

    // Estatísticas
    const stats = {
      total: medicamentosParados.length,
      quantidadeTotal: medicamentosParados.reduce((sum, m) => sum + m.quantidade, 0),
      riscoAlto: medicamentosParados.filter(m => m.riscoVencimento === 'alto' || m.riscoVencimento === 'vencido').length,
      riscoMedio: medicamentosParados.filter(m => m.riscoVencimento === 'medio').length,
      riscoBaixo: medicamentosParados.filter(m => m.riscoVencimento === 'baixo').length,
      perdaEstimada: medicamentosParados
        .filter(m => m.custoEstimado)
        .reduce((sum, m) => sum + parseFloat(m.custoEstimado), 0)
        .toFixed(2)
    };

    res.json({
      medicamentos: medicamentosParados,
      estatisticas: stats,
      parametros: {
        diasMinimo: parseInt(diasMinimo)
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de medicamentos não dispensados:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};

/**
 * Análise de Consumo de Medicamentos
 */
exports.obterAnaliseConsumo = async (req, res) => {
  try {
    const { periodo = 30 } = req.query;

    const dispensacoes = await readJsonFile('dispensacoes.json');
    const medicamentos = await readJsonFile('medicamentos.json');

    const hoje = new Date();
    const dataInicio = new Date(hoje.getTime() - (parseInt(periodo) * 24 * 60 * 60 * 1000));

    // Filtrar dispensações administradas no período
    const dispensacoesPeriodo = dispensacoes.filter(d => 
      d.status === 'administrada' && 
      new Date(d.dataAdministracao) >= dataInicio
    );

    // Agrupar por medicamento
    const consumoPorMedicamento = {};

    dispensacoesPeriodo.forEach(d => {
      if (!consumoPorMedicamento[d.medicamentoId]) {
        const med = medicamentos.find(m => m.id === d.medicamentoId);
        consumoPorMedicamento[d.medicamentoId] = {
          medicamentoId: d.medicamentoId,
          medicamentoNome: d.medicamentoNome || med?.nome || 'Desconhecido',
          quantidadeTotal: 0,
          numeroDispensacoes: 0,
          pacientesAtendidos: new Set()
        };
      }

      consumoPorMedicamento[d.medicamentoId].quantidadeTotal += d.quantidade;
      consumoPorMedicamento[d.medicamentoId].numeroDispensacoes += 1;
      consumoPorMedicamento[d.medicamentoId].pacientesAtendidos.add(d.pacienteId);
    });

    // Converter para array e adicionar médias
    const consumo = Object.values(consumoPorMedicamento).map(item => ({
      ...item,
      pacientesAtendidos: item.pacientesAtendidos.size,
      mediaPorDispensacao: (item.quantidadeTotal / item.numeroDispensacoes).toFixed(2),
      mediaDiaria: (item.quantidadeTotal / parseInt(periodo)).toFixed(2)
    }));

    // Ordenar por quantidade total
    consumo.sort((a, b) => b.quantidadeTotal - a.quantidadeTotal);

    const top10 = consumo.slice(0, 10);

    const stats = {
      totalMedicamentos: consumo.length,
      totalDispensacoes: dispensacoesPeriodo.length,
      quantidadeTotal: consumo.reduce((sum, m) => sum + m.quantidadeTotal, 0),
      mediaDiaria: (dispensacoesPeriodo.length / parseInt(periodo)).toFixed(1),
      periodo: parseInt(periodo)
    };

    res.json({
      consumo,
      top10,
      estatisticas: stats
    });
  } catch (error) {
    console.error('Erro ao gerar análise de consumo:', error);
    res.status(500).json({ error: 'Erro ao gerar análise' });
  }
};

/**
 * Análise de Performance de Dispensação
 */
exports.obterPerformanceDispensacao = async (req, res) => {
  try {
    const { periodo = 30 } = req.query;

    const dispensacoes = await readJsonFile('dispensacoes.json');

    const hoje = new Date();
    const dataInicio = new Date(hoje.getTime() - (parseInt(periodo) * 24 * 60 * 60 * 1000));

    const dispensacoesPeriodo = dispensacoes.filter(d => 
      new Date(d.dataDispensacao) >= dataInicio
    );

    // Análise por farmacêutico
    const porFarmaceutico = {};
    dispensacoesPeriodo.forEach(d => {
      if (!porFarmaceutico[d.farmaceutico]) {
        porFarmaceutico[d.farmaceutico] = {
          farmaceutico: d.farmaceutico,
          totalDispensacoes: 0,
          administradas: 0,
          pendentes: 0,
          canceladas: 0
        };
      }

      porFarmaceutico[d.farmaceutico].totalDispensacoes += 1;
      if (d.status === 'administrada') porFarmaceutico[d.farmaceutico].administradas += 1;
      if (d.status === 'dispensada') porFarmaceutico[d.farmaceutico].pendentes += 1;
      if (d.status === 'cancelada') porFarmaceutico[d.farmaceutico].canceladas += 1;
    });

    const performanceFarmaceuticos = Object.values(porFarmaceutico).map(item => ({
      ...item,
      taxaSucesso: item.totalDispensacoes > 0
        ? ((item.administradas / item.totalDispensacoes) * 100).toFixed(1)
        : '0.0'
    })).sort((a, b) => b.totalDispensacoes - a.totalDispensacoes);

    // Análise por enfermeiro
    const porEnfermeiro = {};
    dispensacoesPeriodo.filter(d => d.enfermeiro).forEach(d => {
      if (!porEnfermeiro[d.enfermeiro]) {
        porEnfermeiro[d.enfermeiro] = {
          enfermeiro: d.enfermeiro,
          totalAdministracoes: 0,
          comAtraso: 0,
          noHorario: 0
        };
      }

      porEnfermeiro[d.enfermeiro].totalAdministracoes += 1;
      if (d.atrasoMinutos && d.atrasoMinutos > 15) {
        porEnfermeiro[d.enfermeiro].comAtraso += 1;
      } else {
        porEnfermeiro[d.enfermeiro].noHorario += 1;
      }
    });

    const performanceEnfermeiros = Object.values(porEnfermeiro).map(item => ({
      ...item,
      taxaPontualidade: item.totalAdministracoes > 0
        ? ((item.noHorario / item.totalAdministracoes) * 100).toFixed(1)
        : '0.0'
    })).sort((a, b) => b.totalAdministracoes - a.totalAdministracoes);

    // Análise temporal
    const porDiaSemana = {};
    const porHora = {};
    
    dispensacoesPeriodo.forEach(d => {
      const data = new Date(d.dataDispensacao);
      const diaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][data.getDay()];
      const hora = data.getHours();

      porDiaSemana[diaSemana] = (porDiaSemana[diaSemana] || 0) + 1;
      porHora[hora] = (porHora[hora] || 0) + 1;
    });

    res.json({
      farmaceuticos: performanceFarmaceuticos,
      enfermeiros: performanceEnfermeiros,
      temporal: {
        porDiaSemana,
        porHora
      },
      periodo: parseInt(periodo)
    });
  } catch (error) {
    console.error('Erro ao gerar análise de performance:', error);
    res.status(500).json({ error: 'Erro ao gerar análise' });
  }
};

/**
 * Exportar Dados
 */
exports.exportarDados = async (req, res) => {
  try {
    const { tipo, formato = 'json' } = req.query;

    let dados = [];
    let nomeArquivo = 'dados';

    switch (tipo) {
      case 'prescricoes':
        dados = await readJsonFile('prescricoes.json');
        nomeArquivo = 'prescricoes';
        break;
      case 'dispensacoes':
        dados = await readJsonFile('dispensacoes.json');
        nomeArquivo = 'dispensacoes';
        break;
      case 'movimentacoes':
        dados = await readJsonFile('movimentacoes.json');
        nomeArquivo = 'movimentacoes';
        break;
      case 'estoque':
        const estoque = await readJsonFile('estoque-farmacia.json');
        dados = Object.entries(estoque).map(([id, item]) => ({ medicamentoId: id, ...item }));
        nomeArquivo = 'estoque-farmacia';
        break;
      default:
        return res.status(400).json({ error: 'Tipo de dados inválido' });
    }

    if (formato === 'csv') {
      if (dados.length === 0) {
        return res.status(404).json({ error: 'Nenhum dado encontrado' });
      }

      const headers = Object.keys(dados[0]);
      const csvRows = [headers.join(',')];

      dados.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvRows.push(values.join(','));
      });

      const csv = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}.csv"`);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}.json"`);
      res.json(dados);
    }
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    res.status(500).json({ error: 'Erro ao exportar dados' });
  }
};
