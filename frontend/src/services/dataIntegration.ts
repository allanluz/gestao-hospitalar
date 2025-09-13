import { Paciente, Internacao, Funcionario } from '../types';
import api from './api';

export class DataIntegrationService {
  
  // Cache para dados utilizados frequentemente
  private static cache = {
    pacientes: new Map<number, Paciente>(),
    internacoes: new Map<string, Internacao>(),
    funcionarios: new Map<number, Funcionario>(),
    lastUpdate: {
      pacientes: 0,
      internacoes: 0,
      funcionarios: 0
    }
  };

  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  // Métodos para Pacientes
  static async getPacientes(): Promise<Paciente[]> {
    const now = Date.now();
    if (now - this.cache.lastUpdate.pacientes > this.CACHE_DURATION) {
      const pacientes = await api.getPacientes() as Paciente[];
      
      // Atualizar cache
      this.cache.pacientes.clear();
      pacientes.forEach((paciente: Paciente) => {
        this.cache.pacientes.set(paciente.id, paciente);
      });
      this.cache.lastUpdate.pacientes = now;
      
      return pacientes;
    }
    
    return Array.from(this.cache.pacientes.values());
  }

  static async getPacienteById(id: number): Promise<Paciente | null> {
    if (this.cache.pacientes.has(id)) {
      return this.cache.pacientes.get(id) || null;
    }
    
    try {
      const paciente = await api.getPaciente(id) as Paciente;
      this.cache.pacientes.set(id, paciente);
      return paciente;
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      return null;
    }
  }

  static async getPacienteByNumeroInternacao(numeroInternacao: string): Promise<Paciente | null> {
    try {
      // Primeiro buscar a internação para obter o pacienteId
      const internacao = await this.getInternacaoByNumero(numeroInternacao);
      if (internacao) {
        return await this.getPacienteById(internacao.pacienteId);
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar paciente por número de internação:', error);
      return null;
    }
  }

  static async searchPacientes(query: string): Promise<Paciente[]> {
    try {
      const pacientes = await this.getPacientes();
      return pacientes.filter(p => 
        p.nome.toLowerCase().includes(query.toLowerCase()) ||
        p.cpf.includes(query) ||
        (p.internacoes && p.internacoes.some(i => i.numeroInternacao.includes(query)))
      );
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      return [];
    }
  }

  // Métodos para Internações
  static async getInternacoes(): Promise<Internacao[]> {
    try {
      // Como não temos endpoint específico, vamos criar dados das internações baseados nos pacientes
      const pacientes = await this.getPacientes();
      const internacoes: Internacao[] = [];
      
      pacientes.forEach(paciente => {
        if (paciente.internacoes) {
          internacoes.push(...paciente.internacoes);
        }
      });
      
      // Atualizar cache
      internacoes.forEach((internacao: Internacao) => {
        this.cache.internacoes.set(internacao.numeroInternacao, internacao);
      });
      
      return internacoes;
    } catch (error) {
      console.error('Erro ao buscar internações:', error);
      return [];
    }
  }

  static async getInternacaoByNumero(numeroInternacao: string): Promise<Internacao | null> {
    if (this.cache.internacoes.has(numeroInternacao)) {
      return this.cache.internacoes.get(numeroInternacao) || null;
    }
    
    try {
      const internacoes = await this.getInternacoes();
      const internacao = internacoes.find(i => i.numeroInternacao === numeroInternacao);
      
      if (internacao) {
        this.cache.internacoes.set(numeroInternacao, internacao);
      }
      
      return internacao || null;
    } catch (error) {
      console.error('Erro ao buscar internação:', error);
      return null;
    }
  }

  static async getInternacoesAtivas(): Promise<Internacao[]> {
    try {
      const internacoes = await this.getInternacoes();
      return internacoes.filter(i => i.status === 'ativa');
    } catch (error) {
      console.error('Erro ao buscar internações ativas:', error);
      return [];
    }
  }

  static async createInternacao(internacao: Omit<Internacao, 'id'>): Promise<Internacao> {
    // Simular criação - em um cenário real isso seria uma chamada para API
    const novaInternacao: Internacao = {
      ...internacao,
      id: Date.now() // ID temporário
    };
    
    this.cache.internacoes.set(novaInternacao.numeroInternacao, novaInternacao);
    return novaInternacao;
  }

  // Métodos para Funcionários
  static async getFuncionarios(): Promise<Funcionario[]> {
    const now = Date.now();
    if (now - this.cache.lastUpdate.funcionarios > this.CACHE_DURATION) {
      const funcionarios = await api.getFuncionarios() as Funcionario[];
      
      // Atualizar cache
      this.cache.funcionarios.clear();
      funcionarios.forEach((funcionario: Funcionario) => {
        this.cache.funcionarios.set(funcionario.id, funcionario);
      });
      this.cache.lastUpdate.funcionarios = now;
      
      return funcionarios;
    }
    
    return Array.from(this.cache.funcionarios.values());
  }

  static async getFuncionariosBySetor(setor: string): Promise<Funcionario[]> {
    const funcionarios = await this.getFuncionarios();
    return funcionarios.filter(f => f.setor === setor && f.ativo);
  }

  static async getFuncionariosByCargo(cargo: string): Promise<Funcionario[]> {
    const funcionarios = await this.getFuncionarios();
    return funcionarios.filter(f => 
      f.cargo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
        cargo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      ) && f.ativo
    );
  }

  static async getMedicos(): Promise<Funcionario[]> {
    const funcionarios = await this.getFuncionarios();
    return funcionarios.filter(f => f.crm && f.ativo);
  }

  static async getEnfermeiros(): Promise<Funcionario[]> {
    const funcionarios = await this.getFuncionarios();
    return funcionarios.filter(f => f.coren && f.ativo);
  }

  // Métodos de integração para Centro Cirúrgico
  static async getDataForCentroCircurgico(numeroInternacao: string) {
    const [paciente, internacao] = await Promise.all([
      this.getPacienteByNumeroInternacao(numeroInternacao),
      this.getInternacaoByNumero(numeroInternacao)
    ]);

    return {
      paciente,
      internacao,
      equipeDisponivel: await this.getFuncionariosBySetor('Centro Cirúrgico'),
      medicos: await this.getMedicos(),
      anestesiologistas: await this.getFuncionariosBySetor('Anestesia')
    };
  }

  // Métodos de integração para UTI
  static async getDataForUTI() {
    const [pacientesInternados, equipeUTI] = await Promise.all([
      this.getInternacoesAtivas(),
      this.getFuncionariosBySetor('UTI')
    ]);

    return {
      pacientesInternados,
      equipeUTI,
      medicos: await this.getMedicos(),
      enfermeiros: await this.getEnfermeiros()
    };
  }

  // Método para sincronizar dados entre módulos
  static async syncPacienteData(pacienteId: number, updates: Partial<Paciente>) {
    try {
      const pacienteAtualizado = await api.updatePaciente(pacienteId, updates) as Paciente;
      
      // Atualizar cache
      this.cache.pacientes.set(pacienteId, pacienteAtualizado);
      
      return pacienteAtualizado;
    } catch (error) {
      console.error('Erro ao sincronizar dados do paciente:', error);
      throw error;
    }
  }

  // Limpar cache
  static clearCache() {
    this.cache.pacientes.clear();
    this.cache.internacoes.clear();
    this.cache.funcionarios.clear();
    this.cache.lastUpdate = {
      pacientes: 0,
      internacoes: 0,
      funcionarios: 0
    };
  }

  // Método para validar se dados estão sincronizados
  static async validateDataIntegrity(numeroInternacao: string): Promise<{
    isValid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    
    try {
      const internacao = await this.getInternacaoByNumero(numeroInternacao);
      if (!internacao) {
        issues.push('Internação não encontrada');
        return { isValid: false, issues };
      }

      const paciente = await this.getPacienteById(internacao.pacienteId);
      if (!paciente) {
        issues.push('Paciente da internação não encontrado');
      }

      // Verificar se médico responsável existe
      const medicos = await this.getMedicos();
      const medicoExiste = medicos.some(m => m.nome === internacao.medicoResponsavel);
      if (!medicoExiste) {
        issues.push('Médico responsável não encontrado no cadastro');
      }

      return {
        isValid: issues.length === 0,
        issues
      };
    } catch (error) {
      console.error('Erro ao validar integridade dos dados:', error);
      return {
        isValid: false,
        issues: ['Erro interno ao validar dados']
      };
    }
  }

  // Buscar assistências intra-operatórias
  static async getAssistenciasIntraOperatorias() {
    try {
      const response = await api.getAssistenciasIntraOperatorias();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Erro ao buscar assistências intra-operatórias:', error);
      return [];
    }
  }

  // Buscar assistência intra-operatória por número de internação
  static async getAssistenciaByNumeroInternacao(numeroInternacao: string) {
    try {
      const assistencias = await this.getAssistenciasIntraOperatorias();
      return assistencias.find((a: any) => a.numeroInternacao === numeroInternacao);
    } catch (error) {
      console.error('Erro ao buscar assistência por internação:', error);
      return null;
    }
  }

  // Buscar recuperações anestésicas
  static async getRecuperacoesAnestesicas() {
    try {
      const response = await api.getRecuperacoesAnestesicas();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Erro ao buscar recuperações anestésicas:', error);
      return [];
    }
  }

  // Buscar controles de infecção
  static async getControlesInfeccao() {
    try {
      const response = await api.getControlesInfeccao();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Erro ao buscar controles de infecção:', error);
      return [];
    }
  }

  // Buscar controle de infecção por número de internação
  static async getControleInfeccaoByNumeroInternacao(numeroInternacao: string) {
    try {
      const controles = await this.getControlesInfeccao();
      return controles.find((c: any) => c.numeroInternacao === numeroInternacao);
    } catch (error) {
      console.error('Erro ao buscar controle de infecção por internação:', error);
      return null;
    }
  }
}

export default DataIntegrationService;
