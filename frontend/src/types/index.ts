export interface Paciente {
  id: number;
  nome: string;
  nomeCompleto?: string;
  cpf: string;
  rg?: string;
  dataNascimento: string;
  idade?: number;
  sexo: 'M' | 'F';
  estadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  profissao?: string;
  endereco: {
    rua: string;
    numero?: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    cep: string;
    uf: string;
  };
  telefone: string;
  celular?: string;
  email?: string;
  convenio: string;
  numeroConvenio?: string;
  tipoSanguineo?: string;
  fatorRh?: '+' | '-';
  peso?: number;
  altura?: number;
  nomeContato?: string;
  telefoneContato?: string;
  parentescoContato?: string;
  alergias?: {
    possui: boolean;
    descricao: string;
  };
  medicamentosUso?: string;
  historicoMedico?: string;
  observacoes?: string;
  // Campos para acessibilidade e inclusão
  deficiencias?: {
    auditiva?: boolean;
    visual?: boolean;
    fisica?: boolean;
    intelectual?: boolean;
    multipla?: boolean;
    descricao?: string;
  };
  neurodivergencias?: {
    autismo?: boolean;
    tdah?: boolean;
    dislexia?: boolean;
    sindrome_down?: boolean;
    outras?: boolean;
    descricao?: string;
  };
  necessidadesEspeciais?: {
    cadeirante?: boolean;
    acompanhante?: boolean;
    interprete_libras?: boolean;
    material_braille?: boolean;
    outras?: string;
  };
  // Campos para identificação
  qrCode?: string;
  codigoBarras?: string;
  internacoes?: Internacao[];
  statusAtual?: 'ambulatorial' | 'internado' | 'centro_cirurgico' | 'uti' | 'recuperacao' | 'alta';
}

export interface Internacao {
  id: number;
  pacienteId: number;
  numeroInternacao: string;
  dataInternacao: string;
  dataAlta?: string;
  motivoInternacao: string;
  medicoResponsavel: string;
  unidade: string;
  quarto?: string;
  leito?: string;
  status: 'ativa' | 'alta' | 'transferida' | 'obito';
  observacoes?: string;
  cirurgias?: CirurgiaRealizada[];
}

export interface CirurgiaRealizada {
  id: number;
  internacaoId: number;
  tipo: string;
  data: string;
  cirurgiao: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  observacoes?: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  setor: string;
  telefone: string;
  email: string;
  coren?: string;
  crm?: string;
  especialidade?: string;
  ativo: boolean;
  endereco?: {
    rua: string;
    bairro: string;
    cidade: string;
    cep: string;
    uf: string;
  };
}

export interface ItemEstoque {
  id: number;
  nome: string;
  categoria: string;
  setor: string;
  quantidade: number;
  estoqueMinimo: number;
  unidade: string;
  lote: string;
  dataValidade: string;
  fornecedor: string;
}

export interface MovimentacaoEstoque {
  id: number;
  itemId: number;
  nomeItem: string;
  quantidade: number;
  tipo: 'entrada' | 'saida';
  dataMovimentacao: string;
  responsavel: string;
  observacoes?: string;
  cirurgia?: string;
}

export interface DashboardData {
  totalPacientes: number;
  totalFuncionarios: number;
  totalItensEstoque: number;
  itensEstoqueBaixo: number;
  timestamp: string;
}
