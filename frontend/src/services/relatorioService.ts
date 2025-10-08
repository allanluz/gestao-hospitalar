import {
  DashboardExecutivo,
  PrescricaoNaoDispensada,
  MedicamentoNaoDispensado,
  ConsumoMedicamento,
  PerformanceDispensacao
} from '../types/relatorio';

const API_URL = 'http://localhost:5000/api/relatorios';

export const relatorioService = {
  async obterDashboard(): Promise<DashboardExecutivo> {
    const response = await fetch(`${API_URL}/dashboard`);
    if (!response.ok) throw new Error('Erro ao obter dashboard');
    return response.json();
  },

  async obterPrescricoesNaoDispensadas(filtros?: {
    dataInicio?: string;
    dataFim?: string;
    prescritor?: string;
    setor?: string;
  }): Promise<{ prescricoes: PrescricaoNaoDispensada[]; estatisticas: any }> {
    const params = new URLSearchParams();
    if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros?.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros?.prescritor) params.append('prescritor', filtros.prescritor);
    if (filtros?.setor) params.append('setor', filtros.setor);

    const response = await fetch(`${API_URL}/prescricoes-nao-dispensadas?${params}`);
    if (!response.ok) throw new Error('Erro ao obter prescrições não dispensadas');
    return response.json();
  },

  async obterMedicamentosNaoDispensados(diasMinimo: number = 7): Promise<{
    medicamentos: MedicamentoNaoDispensado[];
    estatisticas: any;
    parametros: any;
  }> {
    const response = await fetch(`${API_URL}/medicamentos-nao-dispensados?diasMinimo=${diasMinimo}`);
    if (!response.ok) throw new Error('Erro ao obter medicamentos não dispensados');
    return response.json();
  },

  async obterAnaliseConsumo(periodo: number = 30): Promise<{
    consumo: ConsumoMedicamento[];
    top10: ConsumoMedicamento[];
    estatisticas: any;
  }> {
    const response = await fetch(`${API_URL}/analise-consumo?periodo=${periodo}`);
    if (!response.ok) throw new Error('Erro ao obter análise de consumo');
    return response.json();
  },

  async obterPerformanceDispensacao(periodo: number = 30): Promise<PerformanceDispensacao> {
    const response = await fetch(`${API_URL}/performance-dispensacao?periodo=${periodo}`);
    if (!response.ok) throw new Error('Erro ao obter performance de dispensação');
    return response.json();
  },

  async exportarDados(tipo: 'prescricoes' | 'dispensacoes' | 'movimentacoes' | 'estoque', formato: 'json' | 'csv' = 'json'): Promise<void> {
    const response = await fetch(`${API_URL}/exportar?tipo=${tipo}&formato=${formato}`);
    if (!response.ok) throw new Error('Erro ao exportar dados');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tipo}.${formato}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
