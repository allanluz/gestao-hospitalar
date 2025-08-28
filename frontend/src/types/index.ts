export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    cep: string;
    uf: string;
  };
  telefone: string;
  convenio: string;
  historicoMedico?: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  setor: string;
  telefone: string;
  email: string;
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
