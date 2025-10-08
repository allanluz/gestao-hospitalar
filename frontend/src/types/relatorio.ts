// Types para Relatórios Gerenciais

export interface ResumoGeral {
  prescricoes: {
    total: number;
    pendentes: number;
    dispensadas: number;
    canceladas: number;
    doMes: number;
    taxaDispensacao: string;
  };
  dispensacoes: {
    total: number;
    pendentes: number;
    administradas: number;
    comAtraso: number;
    doMes: number;
    tempoMedio: string;
    taxaAdministracao: string;
  };
  movimentacoes: {
    total: number;
    entradas: number;
    saidas: number;
    doMes: number;
  };
  estoque: {
    totalItens: number;
    quantidadeTotal: number;
    abaixoMinimo: number;
    proximosVencimento: number;
  };
}

export interface Alerta {
  tipo: 'warning' | 'danger' | 'info' | 'success';
  titulo: string;
  mensagem: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface MedicamentoVencimento {
  medicamentoId: string;
  medicamentoNome: string;
  quantidade: number;
  validade: string;
  diasRestantes: number;
}

export interface Indicadores {
  eficienciaDispensacao: string;
  tempoMedioDispensacao: string;
  taxaAtraso: string;
  rotatividade: number;
}

export interface DashboardExecutivo {
  resumo: ResumoGeral;
  alertas: Alerta[];
  proximosVencimento: MedicamentoVencimento[];
  indicadores: Indicadores;
}

export interface PrescricaoNaoDispensada {
  id: string;
  dataPrescricao: string;
  prescritor: string;
  pacienteNome: string;
  status: string;
  setor?: string;
  diasEspera: number;
  medicamentosDispensados: number;
  totalMedicamentos: number;
  pendentes: number;
  criticidade: 'alta' | 'media' | 'baixa';
}

export interface MedicamentoNaoDispensado {
  medicamentoId: string;
  medicamentoNome: string;
  quantidade: number;
  lote?: string;
  validade?: string;
  diasParado: number | null;
  ultimaMovimentacao: string | null;
  riscoVencimento: 'vencido' | 'alto' | 'medio' | 'baixo';
  diasParaVencer: number | null;
  custoEstimado: string | null;
}

export interface ConsumoMedicamento {
  medicamentoId: string;
  medicamentoNome: string;
  quantidadeTotal: number;
  numeroDispensacoes: number;
  pacientesAtendidos: number;
  mediaPorDispensacao: string;
  mediaDiaria: string;
}

export interface PerformanceFarmaceutico {
  farmaceutico: string;
  totalDispensacoes: number;
  administradas: number;
  pendentes: number;
  canceladas: number;
  taxaSucesso: string;
}

export interface PerformanceEnfermeiro {
  enfermeiro: string;
  totalAdministracoes: number;
  comAtraso: number;
  noHorario: number;
  taxaPontualidade: string;
}

export interface AnaliseTemporal {
  porDiaSemana: { [key: string]: number };
  porHora: { [key: string]: number };
}

export interface PerformanceDispensacao {
  farmaceuticos: PerformanceFarmaceutico[];
  enfermeiros: PerformanceEnfermeiro[];
  temporal: AnaliseTemporal;
  periodo: number;
}
