// Status da dispensação
export type StatusDispensacao = 
  | 'dispensada'    // Dispensada pelo farmacêutico, aguardando administração
  | 'administrada'  // Administrada ao paciente
  | 'cancelada';    // Cancelada

// Tipo de observação
export type TipoObservacao = 'dispensacao' | 'administracao' | 'cancelamento';

// Interface para observações
export interface ObservacaoDispensacao {
  data: string;
  usuario: string;
  texto: string;
  tipo: TipoObservacao;
}

// Interface principal de dispensação
export interface Dispensacao {
  id: string;
  prescricaoId: string;
  medicamentoId: string;
  medicamentoNome: string;
  quantidade: number;
  pacienteId: string;
  pacienteNome: string;
  lote: string;
  validade: string;
  status: StatusDispensacao;
  
  // 1ª Verificação (Farmacêutico)
  farmaceutico: string;
  dataDispensacao: string;
  
  // 2ª Verificação (Enfermeiro)
  enfermeiro: string | null;
  dataAdministracao: string | null;
  
  // Controle de horários
  horarioPrescrito: string | null;
  horarioRealAdministracao: string | null;
  atrasoMinutos?: number;
  
  // Cancelamento
  canceladoPor?: string;
  dataCancelamento?: string;
  motivoCancelamento?: string;
  
  // Histórico
  observacoes: ObservacaoDispensacao[];
}

// Interface para dispensar medicamento (1ª verificação)
export interface DispensarMedicamentoDTO {
  prescricaoId: string;
  medicamentoId: string;
  medicamentoNome: string;
  quantidade: number;
  pacienteId: string;
  pacienteNome: string;
  farmaceutico: string;
  lote?: string;
  validade?: string;
  observacao?: string;
}

// Interface para confirmar administração (2ª verificação)
export interface ConfirmarAdministracaoDTO {
  enfermeiro: string;
  horarioPrescrito?: string;
  observacao?: string;
}

// Interface para cancelar dispensação
export interface CancelarDispensacaoDTO {
  canceladoPor: string;
  motivo: string;
}

// Interface para estatísticas
export interface EstatisticasDispensacao {
  totalDispensacoes: number;
  pendentesAdministracao: number;
  administradas: number;
  canceladas: number;
  dispensacoesHoje: number;
  administradasHoje: number;
  comAtraso: number;
  taxaAdministracao: string;
  estoqueFarmacia: {
    totalItens: number;
    tiposMedicamentos: number;
  };
  topMedicamentos: TopMedicamento[];
  dispensacoesRecentes: DispensacaoResumida[];
}

// Interface para top medicamentos
export interface TopMedicamento {
  nome: string;
  quantidade: number;
}

// Interface para dispensação resumida (usada em listas)
export interface DispensacaoResumida {
  id: string;
  medicamentoNome: string;
  pacienteNome: string;
  quantidade: number;
  status: StatusDispensacao;
  dataDispensacao: string;
}

// Interface para filtros
export interface FiltrosDispensacao {
  prescricaoId?: string;
  status?: StatusDispensacao;
  dataInicio?: string;
  dataFim?: string;
  pacienteNome?: string;
}
