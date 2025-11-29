// Configuração centralizada da API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  pacientes: `${API_BASE_URL}/api/pacientes`,
  funcionarios: `${API_BASE_URL}/api/funcionarios`,
  estoque: `${API_BASE_URL}/api/estoque`,
  medicamentos: `${API_BASE_URL}/api/medicamentos`,
  uti: `${API_BASE_URL}/api/uti`,
  centroCirurgico: `${API_BASE_URL}/api/centro-cirurgico`,
  centroCirurgicoRecepcao: `${API_BASE_URL}/api/centro-cirurgico-recepcao`,
  assistenciaIntraOperatoria: `${API_BASE_URL}/api/assistencia-intra-operatoria`,
  recuperacaoAnestesica: `${API_BASE_URL}/api/recuperacao-anestesica`,
  controleInfeccao: `${API_BASE_URL}/api/controle-infeccao`,
  custeio: `${API_BASE_URL}/api/custeio`,
  materiais: `${API_BASE_URL}/api/materiais`,
  prescricoes: `${API_BASE_URL}/api/prescricoes`,
  movimentacoes: `${API_BASE_URL}/api/movimentacoes`,
  dispensacoes: `${API_BASE_URL}/api/dispensacoes`,
  relatorios: `${API_BASE_URL}/api/relatorios`,
};

export default API_BASE_URL;
