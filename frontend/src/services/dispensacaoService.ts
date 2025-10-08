import {
  Dispensacao,
  DispensarMedicamentoDTO,
  ConfirmarAdministracaoDTO,
  CancelarDispensacaoDTO,
  EstatisticasDispensacao,
  FiltrosDispensacao
} from '../types/dispensacao';

const API_URL = 'http://localhost:5000/api/dispensacoes';

// Listar dispensações com filtros
export async function listar(filtros?: FiltrosDispensacao): Promise<Dispensacao[]> {
  const params = new URLSearchParams();
  
  if (filtros?.prescricaoId) params.append('prescricaoId', filtros.prescricaoId);
  if (filtros?.status) params.append('status', filtros.status);
  if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio);
  if (filtros?.dataFim) params.append('dataFim', filtros.dataFim);
  if (filtros?.pacienteNome) params.append('pacienteNome', filtros.pacienteNome);
  
  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao listar dispensações');
  }
  
  return response.json();
}

// Obter uma dispensação específica
export async function obter(id: string): Promise<Dispensacao> {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Erro ao obter dispensação');
  }
  
  return response.json();
}

// Dispensar medicamento (1ª verificação - Farmacêutico)
export async function dispensar(dados: DispensarMedicamentoDTO): Promise<Dispensacao> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao dispensar medicamento');
  }
  
  return response.json();
}

// Confirmar administração (2ª verificação - Enfermeiro)
export async function administrar(id: string, dados: ConfirmarAdministracaoDTO): Promise<Dispensacao> {
  const response = await fetch(`${API_URL}/${id}/administrar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao confirmar administração');
  }
  
  return response.json();
}

// Cancelar dispensação
export async function cancelar(id: string, dados: CancelarDispensacaoDTO): Promise<Dispensacao> {
  const response = await fetch(`${API_URL}/${id}/cancelar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao cancelar dispensação');
  }
  
  return response.json();
}

// Listar dispensações pendentes (aguardando administração)
export async function listarPendentes(): Promise<Dispensacao[]> {
  const response = await fetch(`${API_URL}/pendentes`);
  
  if (!response.ok) {
    throw new Error('Erro ao listar pendentes');
  }
  
  return response.json();
}

// Listar dispensações por prescrição
export async function listarPorPrescricao(prescricaoId: string): Promise<Dispensacao[]> {
  const response = await fetch(`${API_URL}/prescricao/${prescricaoId}`);
  
  if (!response.ok) {
    throw new Error('Erro ao listar por prescrição');
  }
  
  return response.json();
}

// Listar dispensações por paciente
export async function listarPorPaciente(pacienteId: string): Promise<Dispensacao[]> {
  const response = await fetch(`${API_URL}/paciente/${pacienteId}`);
  
  if (!response.ok) {
    throw new Error('Erro ao listar por paciente');
  }
  
  return response.json();
}

// Obter estatísticas
export async function obterEstatisticas(): Promise<EstatisticasDispensacao> {
  const response = await fetch(`${API_URL}/estatisticas`);
  
  if (!response.ok) {
    throw new Error('Erro ao obter estatísticas');
  }
  
  return response.json();
}
