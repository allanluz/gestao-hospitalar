import {
  Movimentacao,
  CriarRequisicaoDTO,
  AprovarRequisicaoDTO,
  IniciarTransferenciaDTO,
  ConfirmarRecebimentoDTO,
  RejeitarRequisicaoDTO,
  ItemEstoqueFarmacia,
  EstatisticasMovimentacao,
  FiltrosMovimentacao
} from '../types/movimentacao';

const API_URL = 'http://localhost:5000/api/movimentacoes';

// Listar movimentações com filtros
export async function listar(filtros?: FiltrosMovimentacao): Promise<Movimentacao[]> {
  const params = new URLSearchParams();
  
  if (filtros?.tipo) params.append('tipo', filtros.tipo);
  if (filtros?.status) params.append('status', filtros.status);
  if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio);
  if (filtros?.dataFim) params.append('dataFim', filtros.dataFim);
  if (filtros?.medicamentoId) params.append('medicamentoId', filtros.medicamentoId);
  
  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao listar movimentações');
  }
  
  return response.json();
}

// Obter uma movimentação específica
export async function obter(id: string): Promise<Movimentacao> {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Erro ao obter movimentação');
  }
  
  return response.json();
}

// Criar requisição
export async function criarRequisicao(dados: CriarRequisicaoDTO): Promise<Movimentacao> {
  const response = await fetch(`${API_URL}/requisicao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao criar requisição');
  }
  
  return response.json();
}

// Aprovar requisição
export async function aprovar(id: string, dados: AprovarRequisicaoDTO): Promise<Movimentacao> {
  const response = await fetch(`${API_URL}/${id}/aprovar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao aprovar requisição');
  }
  
  return response.json();
}

// Iniciar transferência
export async function transferir(id: string, dados: IniciarTransferenciaDTO): Promise<Movimentacao> {
  const response = await fetch(`${API_URL}/${id}/transferir`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao iniciar transferência');
  }
  
  return response.json();
}

// Confirmar recebimento
export async function receber(id: string, dados: ConfirmarRecebimentoDTO): Promise<Movimentacao> {
  const response = await fetch(`${API_URL}/${id}/receber`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao confirmar recebimento');
  }
  
  return response.json();
}

// Rejeitar requisição
export async function rejeitar(id: string, dados: RejeitarRequisicaoDTO): Promise<Movimentacao> {
  const response = await fetch(`${API_URL}/${id}/rejeitar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao rejeitar requisição');
  }
  
  return response.json();
}

// Obter estatísticas
export async function obterEstatisticas(): Promise<EstatisticasMovimentacao> {
  const response = await fetch(`${API_URL}/estatisticas`);
  
  if (!response.ok) {
    throw new Error('Erro ao obter estatísticas');
  }
  
  return response.json();
}

// Obter estoque da farmácia
export async function obterEstoqueFarmacia(): Promise<ItemEstoqueFarmacia[]> {
  const response = await fetch(`${API_URL}/estoque-farmacia`);
  
  if (!response.ok) {
    throw new Error('Erro ao obter estoque da farmácia');
  }
  
  return response.json();
}
