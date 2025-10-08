export type ViaMedicamento = 
  | 'oral' 
  | 'intravenosa' 
  | 'intramuscular' 
  | 'subcutanea' 
  | 'topica' 
  | 'outra';

export type StatusPrescricao = 
  | 'pendente' 
  | 'parcial' 
  | 'dispensada' 
  | 'cancelada' 
  | 'expirada';

export type StatusItemPrescricao = 
  | 'pendente' 
  | 'parcial' 
  | 'completo';

export interface Dispensacao {
  id: string;
  numeroDispensacao: string;
  prescricaoId: string;
  medicamentoPrescritoIndex: number;
  pacienteId: string;
  pacienteNome: string;
  medicamentoId: string;
  medicamentoNome: string;
  lote: string;
  quantidade: number;
  unidade: string;
  dataHoraDispensacao: string;
  dispensadoPorId: string;
  dispensadoPorNome: string;
  metodoConfirmacao: 'qrcode' | 'codigobarras' | 'manual';
  codigoPacienteLido: string;
  codigoMedicamentoLido: string;
  observacoes?: string;
  local: string;
}

export interface MedicamentoPrescrito {
  medicamentoId: string;
  medicamentoNome: string;
  dose: string;
  via: ViaMedicamento;
  frequencia: string;
  duracao: string;
  quantidadeTotal: number;
  quantidadeDispensada: number;
  statusItem: StatusItemPrescricao;
  observacoes?: string;
  urgente: boolean;
  dispensacoes: Dispensacao[];
}

export interface Prescricao {
  id: string;
  numeroPrescricao: string;
  pacienteId: string;
  pacienteNome: string;
  prescritorId: string;
  prescritorNome: string;
  prescritorCRM: string;
  dataHoraPrescricao: string;
  setorOrigem: string;
  status: StatusPrescricao;
  validadeHoras: number;
  observacoes?: string;
  dataCancelamento?: string;
  motivoCancelamento?: string;
  medicamentos: MedicamentoPrescrito[];
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PrescricaoFormData {
  pacienteId: string;
  pacienteNome: string;
  prescritorId: string;
  prescritorNome: string;
  prescritorCRM: string;
  setorOrigem: string;
  validadeHoras: number;
  observacoes?: string;
  medicamentos: Omit<MedicamentoPrescrito, 'quantidadeDispensada' | 'statusItem' | 'dispensacoes'>[];
}

export interface EstatisticasPrescricao {
  total: number;
  pendentes: number;
  parciais: number;
  dispensadas: number;
  canceladas: number;
  urgentes: number;
  expiradas: number;
}
