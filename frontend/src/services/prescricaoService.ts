import { Prescricao, PrescricaoFormData, EstatisticasPrescricao } from '../types/prescricao';

const API_URL = 'http://localhost:5000/api';

export const prescricaoService = {
  // Listar todas as prescrições
  async listar(filtros?: {
    status?: string;
    pacienteId?: string;
    prescritorId?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<Prescricao[]> {
    const params = new URLSearchParams();
    if (filtros?.status) params.append('status', filtros.status);
    if (filtros?.pacienteId) params.append('pacienteId', filtros.pacienteId);
    if (filtros?.prescritorId) params.append('prescritorId', filtros.prescritorId);
    if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros?.dataFim) params.append('dataFim', filtros.dataFim);

    const response = await fetch(`${API_URL}/prescricoes?${params.toString()}`);
    if (!response.ok) throw new Error('Erro ao listar prescrições');
    return response.json();
  },

  // Buscar prescrição por ID
  async buscarPorId(id: string): Promise<Prescricao> {
    const response = await fetch(`${API_URL}/prescricoes/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar prescrição');
    return response.json();
  },

  // Buscar prescrições pendentes de um paciente
  async buscarPendentesPorPaciente(pacienteId: string): Promise<Prescricao[]> {
    const response = await fetch(`${API_URL}/prescricoes/paciente/${pacienteId}/pendentes`);
    if (!response.ok) throw new Error('Erro ao buscar prescrições pendentes');
    return response.json();
  },

  // Buscar prescrições por paciente
  async listarPorPaciente(pacienteId: string): Promise<Prescricao[]> {
    const response = await fetch(`${API_URL}/prescricoes/paciente/${pacienteId}`);
    if (!response.ok) throw new Error('Erro ao listar prescrições do paciente');
    return response.json();
  },

  // Buscar prescrições por prescritor
  async listarPorPrescritor(prescritorId: string): Promise<Prescricao[]> {
    const response = await fetch(`${API_URL}/prescricoes/prescritor/${prescritorId}`);
    if (!response.ok) throw new Error('Erro ao listar prescrições do prescritor');
    return response.json();
  },

  // Criar nova prescrição
  async criar(prescricao: PrescricaoFormData): Promise<Prescricao> {
    const response = await fetch(`${API_URL}/prescricoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prescricao)
    });
    if (!response.ok) throw new Error('Erro ao criar prescrição');
    const data = await response.json();
    return data.prescricao;
  },

  // Atualizar prescrição (apenas observações)
  async atualizar(id: string, dados: { observacoes: string }): Promise<Prescricao> {
    const response = await fetch(`${API_URL}/prescricoes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao atualizar prescrição');
    const data = await response.json();
    return data.prescricao;
  },

  // Cancelar prescrição
  async cancelar(id: string, motivoCancelamento: string): Promise<Prescricao> {
    const response = await fetch(`${API_URL}/prescricoes/${id}/cancelar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ motivoCancelamento })
    });
    if (!response.ok) throw new Error('Erro ao cancelar prescrição');
    const data = await response.json();
    return data.prescricao;
  },

  // Obter estatísticas
  async obterEstatisticas(): Promise<EstatisticasPrescricao> {
    const response = await fetch(`${API_URL}/prescricoes/estatisticas`);
    if (!response.ok) throw new Error('Erro ao obter estatísticas');
    return response.json();
  }
};
