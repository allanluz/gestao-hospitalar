import React, { useState, useEffect } from 'react';
import { relatorioService } from '../services/relatorioService';
import type {
  DashboardExecutivo,
  PrescricaoNaoDispensada,
  MedicamentoNaoDispensado,
  ConsumoMedicamento,
  PerformanceDispensacao
} from '../types/relatorio';

type AbaAtiva = 'dashboard' | 'prescricoes' | 'estoque' | 'consumo' | 'performance';

const RelatoriosGerenciais: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('dashboard');
  const [carregando, setCarregando] = useState(false);
  
  // Estados dos dados
  const [dashboard, setDashboard] = useState<DashboardExecutivo | null>(null);
  const [prescricoesNaoDispensadas, setPrescricoesNaoDispensadas] = useState<any>(null);
  const [medicamentosNaoDispensados, setMedicamentosNaoDispensados] = useState<any>(null);
  const [analiseConsumo, setAnaliseConsumo] = useState<any>(null);
  const [performanceDispensacao, setPerformanceDispensacao] = useState<PerformanceDispensacao | null>(null);

  // Filtros
  const [periodo, setPeriodo] = useState(30);
  const [diasMinimo, setDiasMinimo] = useState(7);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setCarregando(true);
      const data = await relatorioService.obterDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      alert('Erro ao carregar dashboard');
    } finally {
      setCarregando(false);
    }
  };

  const carregarPrescricoesNaoDispensadas = async () => {
    try {
      setCarregando(true);
      const data = await relatorioService.obterPrescricoesNaoDispensadas();
      setPrescricoesNaoDispensadas(data);
    } catch (error) {
      console.error('Erro ao carregar prescrições:', error);
      alert('Erro ao carregar prescrições não dispensadas');
    } finally {
      setCarregando(false);
    }
  };

  const carregarMedicamentosNaoDispensados = async () => {
    try {
      setCarregando(true);
      const data = await relatorioService.obterMedicamentosNaoDispensados(diasMinimo);
      setMedicamentosNaoDispensados(data);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      alert('Erro ao carregar medicamentos não dispensados');
    } finally {
      setCarregando(false);
    }
  };

  const carregarAnaliseConsumo = async () => {
    try {
      setCarregando(true);
      const data = await relatorioService.obterAnaliseConsumo(periodo);
      setAnaliseConsumo(data);
    } catch (error) {
      console.error('Erro ao carregar análise de consumo:', error);
      alert('Erro ao carregar análise de consumo');
    } finally {
      setCarregando(false);
    }
  };

  const carregarPerformanceDispensacao = async () => {
    try {
      setCarregando(true);
      const data = await relatorioService.obterPerformanceDispensacao(periodo);
      setPerformanceDispensacao(data);
    } catch (error) {
      console.error('Erro ao carregar performance:', error);
      alert('Erro ao carregar performance de dispensação');
    } finally {
      setCarregando(false);
    }
  };

  const handleExportar = async (tipo: 'prescricoes' | 'dispensacoes' | 'movimentacoes' | 'estoque', formato: 'json' | 'csv') => {
    try {
      await relatorioService.exportarDados(tipo, formato);
      alert(`Dados exportados com sucesso em formato ${formato.toUpperCase()}!`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleChangeAba = (aba: AbaAtiva) => {
    setAbaAtiva(aba);
    
    // Carregar dados da aba se ainda não foram carregados
    if (aba === 'prescricoes' && !prescricoesNaoDispensadas) {
      carregarPrescricoesNaoDispensadas();
    } else if (aba === 'estoque' && !medicamentosNaoDispensados) {
      carregarMedicamentosNaoDispensados();
    } else if (aba === 'consumo' && !analiseConsumo) {
      carregarAnaliseConsumo();
    } else if (aba === 'performance' && !performanceDispensacao) {
      carregarPerformanceDispensacao();
    }
  };

  const getCorAlerta = (tipo: string) => {
    switch (tipo) {
      case 'danger': return 'bg-red-100 border-red-400 text-red-700';
      case 'warning': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'info': return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'success': return 'bg-green-100 border-green-400 text-green-700';
      default: return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const getCorCriticidade = (criticidade: string) => {
    switch (criticidade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCorRisco = (risco: string) => {
    switch (risco) {
      case 'vencido': return 'bg-red-600 text-white';
      case 'alto': return 'bg-red-100 text-red-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'baixo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Relatórios Gerenciais</h1>
        <p className="text-gray-600">Análises e indicadores do sistema de gestão de medicamentos</p>
      </div>

      {/* Abas de Navegação */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => handleChangeAba('dashboard')}
            className={`px-4 py-2 font-medium ${
              abaAtiva === 'dashboard'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📈 Dashboard
          </button>
          <button
            onClick={() => handleChangeAba('prescricoes')}
            className={`px-4 py-2 font-medium ${
              abaAtiva === 'prescricoes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Prescrições Pendentes
          </button>
          <button
            onClick={() => handleChangeAba('estoque')}
            className={`px-4 py-2 font-medium ${
              abaAtiva === 'estoque'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📦 Estoque Parado
          </button>
          <button
            onClick={() => handleChangeAba('consumo')}
            className={`px-4 py-2 font-medium ${
              abaAtiva === 'consumo'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Análise de Consumo
          </button>
          <button
            onClick={() => handleChangeAba('performance')}
            className={`px-4 py-2 font-medium ${
              abaAtiva === 'performance'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⭐ Performance
          </button>
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      {carregando && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      )}

      {/* ABA: Dashboard */}
      {abaAtiva === 'dashboard' && dashboard && !carregando && (
        <div className="space-y-6">
          {/* Indicadores Principais */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Total Prescrições</div>
              <div className="text-3xl font-bold text-blue-600">{dashboard.resumo.prescricoes.total}</div>
              <div className="text-xs text-gray-500 mt-2">
                {dashboard.resumo.prescricoes.pendentes} pendentes
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Total Dispensações</div>
              <div className="text-3xl font-bold text-green-600">{dashboard.resumo.dispensacoes.total}</div>
              <div className="text-xs text-gray-500 mt-2">
                {dashboard.resumo.dispensacoes.administradas} administradas
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Estoque Farmácia</div>
              <div className="text-3xl font-bold text-purple-600">{dashboard.resumo.estoque.quantidadeTotal}</div>
              <div className="text-xs text-gray-500 mt-2">
                {dashboard.resumo.estoque.totalItens} tipos
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Movimentações (Mês)</div>
              <div className="text-3xl font-bold text-orange-600">{dashboard.resumo.movimentacoes.doMes}</div>
              <div className="text-xs text-gray-500 mt-2">
                {dashboard.resumo.movimentacoes.entradas} entradas
              </div>
            </div>
          </div>

          {/* Indicadores de Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">🎯 Indicadores de Performance</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Eficiência de Dispensação</div>
                <div className="text-2xl font-bold text-blue-600">{dashboard.indicadores.eficienciaDispensacao}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tempo Médio</div>
                <div className="text-2xl font-bold text-green-600">{dashboard.indicadores.tempoMedioDispensacao}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Taxa de Atraso</div>
                <div className="text-2xl font-bold text-red-600">{dashboard.indicadores.taxaAtraso}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Rotatividade (Mês)</div>
                <div className="text-2xl font-bold text-purple-600">{dashboard.indicadores.rotatividade}</div>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {dashboard.alertas.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">🚨 Alertas do Sistema</h3>
              <div className="space-y-3">
                {dashboard.alertas.map((alerta, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 ${getCorAlerta(alerta.tipo)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{alerta.titulo}</div>
                        <div className="text-sm mt-1">{alerta.mensagem}</div>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        alerta.prioridade === 'alta' ? 'bg-red-200 text-red-800' :
                        alerta.prioridade === 'media' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alerta.prioridade.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medicamentos Próximos ao Vencimento */}
          {dashboard.proximosVencimento.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">⚠️ Medicamentos Próximos ao Vencimento (30 dias)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias Restantes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboard.proximosVencimento.map((med, index) => (
                      <tr key={index} className={med.diasRestantes <= 15 ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 text-sm text-gray-900">{med.medicamentoNome}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{med.quantidade}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(med.validade).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            med.diasRestantes <= 15 ? 'bg-red-200 text-red-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {med.diasRestantes} dias
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Botões de Exportação */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">💾 Exportar Dados</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <button
                  onClick={() => handleExportar('prescricoes', 'csv')}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                >
                  📋 Prescrições (CSV)
                </button>
                <button
                  onClick={() => handleExportar('prescricoes', 'json')}
                  className="w-full bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 text-sm"
                >
                  JSON
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleExportar('dispensacoes', 'csv')}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2"
                >
                  💊 Dispensações (CSV)
                </button>
                <button
                  onClick={() => handleExportar('dispensacoes', 'json')}
                  className="w-full bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 text-sm"
                >
                  JSON
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleExportar('movimentacoes', 'csv')}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mb-2"
                >
                  🔄 Movimentações (CSV)
                </button>
                <button
                  onClick={() => handleExportar('movimentacoes', 'json')}
                  className="w-full bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 text-sm"
                >
                  JSON
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleExportar('estoque', 'csv')}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mb-2"
                >
                  📦 Estoque (CSV)
                </button>
                <button
                  onClick={() => handleExportar('estoque', 'json')}
                  className="w-full bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 text-sm"
                >
                  JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA: Prescrições Não Dispensadas */}
      {abaAtiva === 'prescricoes' && prescricoesNaoDispensadas && !carregando && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">📋 Prescrições Não Dispensadas</h3>
              <button
                onClick={carregarPrescricoesNaoDispensadas}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                🔄 Atualizar
              </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold">{prescricoesNaoDispensadas.estatisticas.total}</div>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <div className="text-sm text-gray-600">Críticas</div>
                <div className="text-2xl font-bold text-red-600">{prescricoesNaoDispensadas.estatisticas.criticas}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <div className="text-sm text-gray-600">Médias</div>
                <div className="text-2xl font-bold text-yellow-600">{prescricoesNaoDispensadas.estatisticas.medias}</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-sm text-gray-600">Baixas</div>
                <div className="text-2xl font-bold text-green-600">{prescricoesNaoDispensadas.estatisticas.baixas}</div>
              </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prescritor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias Espera</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendentes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criticidade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescricoesNaoDispensadas.prescricoes.map((p: PrescricaoNaoDispensada) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{p.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{p.pacienteNome}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{p.prescritor}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(p.dataPrescricao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{p.diasEspera} dias</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {p.pendentes}/{p.totalMedicamentos}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getCorCriticidade(p.criticidade)}`}>
                          {p.criticidade.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA: Estoque Parado */}
      {abaAtiva === 'estoque' && medicamentosNaoDispensados && !carregando && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">📦 Medicamentos Não Dispensados (Estoque Parado)</h3>
              <div className="flex gap-2">
                <select
                  value={diasMinimo}
                  onChange={(e) => setDiasMinimo(Number(e.target.value))}
                  className="border rounded px-3 py-2"
                >
                  <option value={7}>7 dias</option>
                  <option value={15}>15 dias</option>
                  <option value={30}>30 dias</option>
                  <option value={60}>60 dias</option>
                </select>
                <button
                  onClick={carregarMedicamentosNaoDispensados}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  🔄 Atualizar
                </button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600">Total Itens</div>
                <div className="text-2xl font-bold">{medicamentosNaoDispensados.estatisticas.total}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-sm text-gray-600">Quantidade</div>
                <div className="text-2xl font-bold text-blue-600">{medicamentosNaoDispensados.estatisticas.quantidadeTotal}</div>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <div className="text-sm text-gray-600">Risco Alto</div>
                <div className="text-2xl font-bold text-red-600">{medicamentosNaoDispensados.estatisticas.riscoAlto}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <div className="text-sm text-gray-600">Risco Médio</div>
                <div className="text-2xl font-bold text-yellow-600">{medicamentosNaoDispensados.estatisticas.riscoMedio}</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-sm text-gray-600">Perda Estimada</div>
                <div className="text-2xl font-bold text-red-600">R$ {medicamentosNaoDispensados.estatisticas.perdaEstimada}</div>
              </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias Parado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias p/ Vencer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risco</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicamentosNaoDispensados.medicamentos.map((m: MedicamentoNaoDispensado, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.medicamentoNome}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.quantidade}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.diasParado || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {m.validade ? new Date(m.validade).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.diasParaVencer !== null ? `${m.diasParaVencer} dias` : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getCorRisco(m.riscoVencimento)}`}>
                          {m.riscoVencimento.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {m.custoEstimado ? `R$ ${m.custoEstimado}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA: Análise de Consumo */}
      {abaAtiva === 'consumo' && analiseConsumo && !carregando && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">📊 Análise de Consumo de Medicamentos</h3>
              <div className="flex gap-2">
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(Number(e.target.value))}
                  className="border rounded px-3 py-2"
                >
                  <option value={7}>Últimos 7 dias</option>
                  <option value={15}>Últimos 15 dias</option>
                  <option value={30}>Últimos 30 dias</option>
                  <option value={60}>Últimos 60 dias</option>
                  <option value={90}>Últimos 90 dias</option>
                </select>
                <button
                  onClick={carregarAnaliseConsumo}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  🔄 Atualizar
                </button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600">Medicamentos Diferentes</div>
                <div className="text-2xl font-bold">{analiseConsumo.estatisticas.totalMedicamentos}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-sm text-gray-600">Total Dispensações</div>
                <div className="text-2xl font-bold text-blue-600">{analiseConsumo.estatisticas.totalDispensacoes}</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-sm text-gray-600">Quantidade Total</div>
                <div className="text-2xl font-bold text-green-600">{analiseConsumo.estatisticas.quantidadeTotal}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <div className="text-sm text-gray-600">Média Diária</div>
                <div className="text-2xl font-bold text-purple-600">{analiseConsumo.estatisticas.mediaDiaria}</div>
              </div>
            </div>

            {/* Top 10 */}
            <h4 className="font-semibold mb-3">🏆 Top 10 Medicamentos Mais Consumidos</h4>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispensações</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pacientes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média/Disp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média Diária</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analiseConsumo.top10.map((m: ConsumoMedicamento, index: number) => (
                    <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.medicamentoNome}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">{m.quantidadeTotal}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.numeroDispensacoes}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.pacientesAtendidos}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.mediaPorDispensacao}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{m.mediaDiaria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA: Performance */}
      {abaAtiva === 'performance' && performanceDispensacao && !carregando && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">⭐ Performance de Dispensação</h3>
              <div className="flex gap-2">
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(Number(e.target.value))}
                  className="border rounded px-3 py-2"
                >
                  <option value={7}>Últimos 7 dias</option>
                  <option value={15}>Últimos 15 dias</option>
                  <option value={30}>Últimos 30 dias</option>
                  <option value={60}>Últimos 60 dias</option>
                </select>
                <button
                  onClick={carregarPerformanceDispensacao}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  🔄 Atualizar
                </button>
              </div>
            </div>

            {/* Performance Farmacêuticos */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">💊 Performance dos Farmacêuticos</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmacêutico</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Administradas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendentes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canceladas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa Sucesso</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceDispensacao.farmaceuticos.map((f, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{f.farmaceutico}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{f.totalDispensacoes}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-semibold">{f.administradas}</td>
                        <td className="px-6 py-4 text-sm text-yellow-600">{f.pendentes}</td>
                        <td className="px-6 py-4 text-sm text-red-600">{f.canceladas}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            parseFloat(f.taxaSucesso) >= 80 ? 'bg-green-100 text-green-800' :
                            parseFloat(f.taxaSucesso) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {f.taxaSucesso}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Enfermeiros */}
            <div>
              <h4 className="font-semibold mb-3">🩺 Performance dos Enfermeiros</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enfermeiro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Administrações</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Horário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Com Atraso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa Pontualidade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceDispensacao.enfermeiros.map((e, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.enfermeiro}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{e.totalAdministracoes}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-semibold">{e.noHorario}</td>
                        <td className="px-6 py-4 text-sm text-red-600">{e.comAtraso}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            parseFloat(e.taxaPontualidade) >= 85 ? 'bg-green-100 text-green-800' :
                            parseFloat(e.taxaPontualidade) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {e.taxaPontualidade}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatoriosGerenciais;
