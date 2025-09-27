const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Dashboard
  async getDashboard() {
    return this.request('/dashboard');
  }

  // Pacientes
  async getPacientes() {
    return this.request('/pacientes');
  }

  async getPaciente(id: number) {
    return this.request(`/pacientes/${id}`);
  }

  async createPaciente(paciente: any) {
    return this.request('/pacientes', {
      method: 'POST',
      body: JSON.stringify(paciente),
    });
  }

  async updatePaciente(id: number, paciente: any) {
    return this.request(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paciente),
    });
  }

  async deletePaciente(id: number) {
    return this.request(`/pacientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Funcionários
  async getFuncionarios() {
    return this.request('/funcionarios');
  }

  async getFuncionario(id: number) {
    return this.request(`/funcionarios/${id}`);
  }

  async createFuncionario(funcionario: any) {
    return this.request('/funcionarios', {
      method: 'POST',
      body: JSON.stringify(funcionario),
    });
  }

  async updateFuncionario(id: number, funcionario: any) {
    return this.request(`/funcionarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(funcionario),
    });
  }

  async deleteFuncionario(id: number) {
    return this.request(`/funcionarios/${id}`, {
      method: 'DELETE',
    });
  }

  // Estoque
  async getEstoque() {
    return this.request('/estoque');
  }

  async getItemEstoque(id: number) {
    return this.request(`/estoque/${id}`);
  }

  async createItemEstoque(item: any) {
    return this.request('/estoque', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItemEstoque(id: number, item: any) {
    return this.request(`/estoque/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteItemEstoque(id: number) {
    return this.request(`/estoque/${id}`, {
      method: 'DELETE',
    });
  }

  async movimentarEstoque(movimentacao: any) {
    return this.request('/estoque/movimentar', {
      method: 'POST',
      body: JSON.stringify(movimentacao),
    });
  }

  async getEstoqueBaixo() {
    return this.request('/estoque/baixo');
  }

  // UTI
  async getMovimentacoesUTI() {
    return this.request('/uti/movimentacoes');
  }

  async registrarConsumoUTI(consumo: any) {
    return this.request('/uti/consumo', {
      method: 'POST',
      body: JSON.stringify(consumo),
    });
  }

  async getRelatorioUTI(dataInicio?: string, dataFim?: string) {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    
    return this.request(`/uti/relatorio?${params.toString()}`);
  }

  // Centro Cirúrgico (original)
  async getMovimentacoesCentroCircurgico() {
    return this.request('/centro-cirurgico/movimentacoes');
  }

  async registrarConsumoCentroCircurgico(consumo: any) {
    return this.request('/centro-cirurgico/consumo', {
      method: 'POST',
      body: JSON.stringify(consumo),
    });
  }

  async getRelatorioCentroCircurgico(dataInicio?: string, dataFim?: string) {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    
    return this.request(`/centro-cirurgico/relatorio?${params.toString()}`);
  }

  // ========== NOVOS SERVIÇOS DO FLUXO HOSPITALAR ==========

  // Recepção Centro Cirúrgico
  async getRecepcoesCentroCircurgico() {
    return this.request('/centro-cirurgico-recepcao');
  }

  async getRecepcaoCentroCircurgico(id: string) {
    return this.request(`/centro-cirurgico-recepcao/${id}`);
  }

  async createRecepcaoCentroCircurgico(recepcao: any) {
    return this.request('/centro-cirurgico-recepcao', {
      method: 'POST',
      body: JSON.stringify(recepcao),
    });
  }

  async updateRecepcaoCentroCircurgico(id: string, recepcao: any) {
    return this.request(`/centro-cirurgico-recepcao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recepcao),
    });
  }

  async buscarRecepcaoPorInternacao(numeroInternacao: string) {
    return this.request(`/centro-cirurgico-recepcao/buscar/${numeroInternacao}`);
  }

  // Assistência Intra-Operatória
  async getAssistenciasIntraOperatorias() {
    return this.request('/assistencia-intra-operatoria');
  }

  async getAssistenciaIntraOperatoria(id: string) {
    return this.request(`/assistencia-intra-operatoria/${id}`);
  }

  async createAssistenciaIntraOperatoria(assistencia: any) {
    return this.request('/assistencia-intra-operatoria', {
      method: 'POST',
      body: JSON.stringify(assistencia),
    });
  }

  async updateAssistenciaIntraOperatoria(id: string, assistencia: any) {
    return this.request(`/assistencia-intra-operatoria/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assistencia),
    });
  }

  async getRelatorioAssistenciaPorPeriodo(dataInicio: string, dataFim: string) {
    return this.request(`/assistencia-intra-operatoria/relatorio/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  // Recuperação Anestésica
  async getRecuperacoesAnestesicas() {
    return this.request('/recuperacao-anestesica');
  }

  async getRecuperacaoAnestesica(id: string) {
    return this.request(`/recuperacao-anestesica/${id}`);
  }

  async createRecuperacaoAnestesica(recuperacao: any) {
    return this.request('/recuperacao-anestesica', {
      method: 'POST',
      body: JSON.stringify(recuperacao),
    });
  }

  async updateRecuperacaoAnestesica(id: string, recuperacao: any) {
    return this.request(`/recuperacao-anestesica/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recuperacao),
    });
  }

  async deleteRecuperacaoAnestesica(id: string) {
    return this.request(`/recuperacao-anestesica/${id}`, {
      method: 'DELETE',
    });
  }

  async adicionarSinaisVitais(id: string, sinaisVitais: any) {
    return this.request(`/recuperacao-anestesica/${id}/sinais-vitais`, {
      method: 'POST',
      body: JSON.stringify({ sinaisVitais }),
    });
  }

  async calcularAldreteKroulik(id: string, criterios: any) {
    return this.request(`/recuperacao-anestesica/${id}/aldrete-kroulik`, {
      method: 'POST',
      body: JSON.stringify({ criterios }),
    });
  }

  async getPacientesEmRecuperacao() {
    return this.request('/recuperacao-anestesica/pacientes/em-recuperacao');
  }

  // Controle de Infecção Hospitalar (CCIH)
  async getControlesInfeccao() {
    return this.request('/controle-infeccao');
  }

  async getControleInfeccao(id: string) {
    return this.request(`/controle-infeccao/${id}`);
  }

  async createControleInfeccao(controle: any) {
    return this.request('/controle-infeccao', {
      method: 'POST',
      body: JSON.stringify(controle),
    });
  }

  async updateControleInfeccao(id: string, controle: any) {
    return this.request(`/controle-infeccao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(controle),
    });
  }

  async calcularRiscoInfeccao(id: string) {
    return this.request(`/controle-infeccao/${id}/risco-infeccao`);
  }

  async getRelatorioMensalCCIH(mes: number, ano: number) {
    return this.request(`/controle-infeccao/relatorio/mensal?mes=${mes}&ano=${ano}`);
  }

  // Custeio Cirúrgico
  async getCusteios() {
    return this.request('/custeio');
  }

  async getCusteio(id: string) {
    return this.request(`/custeio/${id}`);
  }

  async createCusteio(custeio: any) {
    return this.request('/custeio', {
      method: 'POST',
      body: JSON.stringify(custeio),
    });
  }

  async updateCusteio(id: string, custeio: any) {
    return this.request(`/custeio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(custeio),
    });
  }

  async adicionarMaterialCusteio(id: string, material: any) {
    return this.request(`/custeio/${id}/material`, {
      method: 'POST',
      body: JSON.stringify({ material }),
    });
  }

  async getRelatorioFinanceiro(dataInicio?: string, dataFim?: string, tipoCirurgia?: string) {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    if (tipoCirurgia) params.append('tipoCirurgia', tipoCirurgia);
    
    return this.request(`/custeio/relatorio/financeiro?${params.toString()}`);
  }

  async getMateriaisDisponiveis() {
    return this.request('/custeio/materiais/disponiveis');
  }

  // Delete methods for Centro Cirúrgico
  async deleteAssistenciaIntraOperatoria(id: string) {
    return this.request(`/assistencia-intraoperatoria/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteControleInfeccao(id: string) {
    return this.request(`/controle-infeccao/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteCusteioCircurgico(id: string) {
    return this.request(`/custeio/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteRecepcaoCentroCircurgico(id: string) {
    return this.request(`/recepcao-centro-cirurgico/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== SERVIÇOS DE MATERIAIS ==========

  // Materiais
  async getMateriais(filters?: {
    categoria?: string;
    subcategoria?: string;
    ativo?: boolean;
    esteril?: boolean;
    descartavel?: boolean;
    implantavel?: boolean;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    return this.request(`/materiais${queryString ? `?${queryString}` : ''}`);
  }

  async getMaterial(id: string) {
    return this.request(`/materiais/${id}`);
  }

  async createMaterial(material: any) {
    return this.request('/materiais', {
      method: 'POST',
      body: JSON.stringify(material),
    });
  }

  async updateMaterial(id: string, material: any) {
    return this.request(`/materiais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(material),
    });
  }

  async deleteMaterial(id: string) {
    return this.request(`/materiais/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategoriasMateriais() {
    return this.request('/materiais/categorias');
  }

  async getEstatisticasMateriais() {
    return this.request('/materiais/estatisticas');
  }

  // Alternative method names for compatibility
  async getCusteioCircurgico() {
    return this.getCusteios();
  }

  async createCusteioCircurgico(custeio: any) {
    return this.createCusteio(custeio);
  }

  async updateCusteioCircurgico(id: string, custeio: any) {
    return this.updateCusteio(id, custeio);
  }
}

const api = new ApiService();
export default api;
export { api };
