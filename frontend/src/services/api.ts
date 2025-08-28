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

  // Centro Cirúrgico
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
}

export default new ApiService();
