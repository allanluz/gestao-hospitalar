// Tipos de movimentação
export type TipoMovimentacao = 'requisicao' | 'transferencia';

// Status da movimentação
export type StatusMovimentacao = 
  | 'pendente' 
  | 'aprovada' 
  | 'em_transito' 
  | 'recebida' 
  | 'rejeitada';

// Origem/Destino
export type LocalEstoque = 'estoque_central' | 'farmacia';

// Interface para observações
export interface ObservacaoMovimentacao {
  data: string;
  usuario: string;
  texto: string;
}

// Interface principal de movimentação
export interface Movimentacao {
  id: string;
  tipo: TipoMovimentacao;
  medicamentoId: string;
  medicamentoNome: string;
  quantidade: number;
  justificativa: string;
  solicitante: string;
  dataSolicitacao: string;
  status: StatusMovimentacao;
  origem: LocalEstoque;
  destino: LocalEstoque;
  lote: string;
  validade: string;
  observacoes: ObservacaoMovimentacao[];
  
  // Campos opcionais baseados no status
  aprovadoPor?: string;
  dataAprovacao?: string;
  
  responsavelExpedicao?: string;
  dataExpedicao?: string;
  
  recebidoPor?: string;
  dataRecebimento?: string;
  quantidadeRecebida?: number;
  divergencia?: boolean;
  quantidadeDivergente?: number;
  
  rejeitadoPor?: string;
  dataRejeicao?: string;
  motivoRejeicao?: string;
}

// Interface para criação de requisição
export interface CriarRequisicaoDTO {
  medicamentoId: string;
  medicamentoNome: string;
  quantidade: number;
  justificativa: string;
  solicitante: string;
}

// Interface para aprovação
export interface AprovarRequisicaoDTO {
  aprovadoPor: string;
  observacao?: string;
}

// Interface para transferência
export interface IniciarTransferenciaDTO {
  responsavelExpedicao: string;
  lote?: string;
  validade?: string;
}

// Interface para recebimento
export interface ConfirmarRecebimentoDTO {
  recebidoPor: string;
  quantidadeRecebida?: number;
  observacao?: string;
}

// Interface para rejeição
export interface RejeitarRequisicaoDTO {
  rejeitadoPor: string;
  motivo: string;
}

// Interface para item do estoque da farmácia
export interface ItemEstoqueFarmacia {
  id: string;
  medicamentoId: string;
  medicamentoNome: string;
  quantidade: number;
  lote: string;
  validade: string;
  dataEntrada: string;
  dataUltimaMovimentacao?: string;
  localizacao: string;
}

// Interface para estatísticas
export interface EstatisticasMovimentacao {
  totalMovimentacoes: number;
  pendentes: number;
  aprovadas: number;
  emTransito: number;
  recebidas: number;
  rejeitadas: number;
  comDivergencia: number;
  totalItensEstoqueFarmacia: number;
  tiposEstoqueFarmacia: number;
  movimentacoesRecentes: MovimentacaoResumida[];
}

// Interface para movimentação resumida (usada em listas)
export interface MovimentacaoResumida {
  id: string;
  medicamentoNome: string;
  quantidade: number;
  status: StatusMovimentacao;
  dataSolicitacao: string;
}

// Interface para filtros
export interface FiltrosMovimentacao {
  tipo?: TipoMovimentacao;
  status?: StatusMovimentacao;
  dataInicio?: string;
  dataFim?: string;
  medicamentoId?: string;
}
