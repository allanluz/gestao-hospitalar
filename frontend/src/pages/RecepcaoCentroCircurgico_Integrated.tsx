import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RecepcaoCentroCircurgico as RecepcaoType } from '../types/centro-cirurgico';
import { Paciente, Funcionario } from '../types';
import PacienteBuscador from '../components/common/PacienteBuscador';
import FuncionarioSeletor from '../components/common/FuncionarioSeletor';
import DataIntegrationService from '../services/dataIntegration';

const RecepcaoCentroCircurgico: React.FC = () => {
  const [recepcoes, setRecepcoes] = useState<RecepcaoType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecepcao, setEditingRecepcao] = useState<RecepcaoType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<Funcionario | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<RecepcaoType>>({
    numeroInternacao: '',
    nomePaciente: '',
    dataNascimento: '',
    sexo: 'M',
    procedimentoProgramado: '',
    medico: '',
    tipoAnestesia: 'geral',
    consentimentoAssinado: false,
    tempoJejum: 0,
    checklist: {
      identificacaoCorreta: false,
      sitioCircurgicoConfirmado: false,
      procedimentoConfirmado: false,
      consentimentoCircurgia: false,
      consentimentoAnestesia: false,
      alergiasMedicamentos: false,
      sinaisVitaisVerificados: false,
      materialCirurgicoDisponivel: false
    },
    observacoes: ''
  });

  useEffect(() => {
    carregarRecepcoes();
  }, []);

  // Função para carregar dados do paciente automaticamente
  const handlePacienteSelecionado = async (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    
    // Buscar internação ativa do paciente
    const internacaoAtiva = paciente.internacoes?.find(i => i.status === 'ativa');
    
    if (internacaoAtiva) {
      setFormData(prev => ({
        ...prev,
        numeroInternacao: internacaoAtiva.numeroInternacao,
        nomePaciente: paciente.nome,
        dataNascimento: paciente.dataNascimento,
        sexo: paciente.sexo || 'M'
      }));

      // Validar integridade dos dados
      const validation = await DataIntegrationService.validateDataIntegrity(internacaoAtiva.numeroInternacao);
      setValidationErrors(validation.issues);
    } else {
      setValidationErrors(['Paciente não possui internação ativa']);
    }
  };

  const handleMedicoSelecionado = (medico: Funcionario) => {
    setMedicoSelecionado(medico);
    setFormData(prev => ({
      ...prev,
      medico: medico.nome
    }));
  };

  const carregarRecepcoes = async () => {
    try {
      const data = await api.getRecepcoesCentroCircurgico();
      setRecepcoes(Array.isArray(data) ? data as RecepcaoType[] : []);
    } catch (error) {
      console.error('Erro ao carregar recepções:', error);
      setRecepcoes([]);
    }
  };

  const resetForm = () => {
    setPacienteSelecionado(null);
    setMedicoSelecionado(null);
    setValidationErrors([]);
    setFormData({
      numeroInternacao: '',
      nomePaciente: '',
      dataNascimento: '',
      sexo: 'M',
      procedimentoProgramado: '',
      medico: '',
      tipoAnestesia: 'geral',
      consentimentoAssinado: false,
      tempoJejum: 0,
      checklist: {
        identificacaoCorreta: false,
        sitioCircurgicoConfirmado: false,
        procedimentoConfirmado: false,
        consentimentoCircurgia: false,
        consentimentoAnestesia: false,
        alergiasMedicamentos: false,
        sinaisVitaisVerificados: false,
        materialCirurgicoDisponivel: false
      },
      observacoes: ''
    });
    setEditingRecepcao(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações antes de enviar
    if (validationErrors.length > 0) {
      alert('Corrija os erros de validação antes de continuar');
      return;
    }

    if (!pacienteSelecionado) {
      alert('Selecione um paciente');
      return;
    }

    if (!medicoSelecionado) {
      alert('Selecione um médico responsável');
      return;
    }

    try {
      if (editingRecepcao) {
        await api.updateRecepcaoCentroCircurgico(editingRecepcao.id!, formData);
      } else {
        await api.createRecepcaoCentroCircurgico(formData);
      }
      
      await carregarRecepcoes();
      setIsModalOpen(false);
      setEditingRecepcao(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar recepção:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta recepção?')) {
      try {
        await api.updateRecepcaoCentroCircurgico(id, { ...recepcoes.find(r => r.id === id), deleted: true });
        await carregarRecepcoes();
      } catch (error) {
        console.error('Erro ao excluir recepção:', error);
      }
    }
  };

  const handleEdit = (recepcao: RecepcaoType) => {
    setFormData(recepcao);
    setEditingRecepcao(recepcao);
    setIsModalOpen(true);
  };

  const filteredRecepcoes = Array.isArray(recepcoes) ? recepcoes.filter(recepcao =>
    recepcao.nomePaciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recepcao.numeroInternacao?.includes(searchTerm) ||
    recepcao.procedimentoProgramado?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getChecklistStatus = (checklist: any) => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(Boolean).length;
    const percentage = Math.round((completed / total) * 100);
    
    return {
      completed,
      total,
      percentage,
      color: percentage === 100 ? 'text-green-600' : percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Recepção do Centro Cirúrgico</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Nova Recepção
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Pesquisar por paciente, número de internação ou procedimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Lista de Recepções */}
          <div className="grid gap-6">
            {filteredRecepcoes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma recepção encontrada</p>
              </div>
            ) : (
              filteredRecepcoes.map((recepcao) => {
                const checklistStatus = getChecklistStatus(recepcao.checklist);
                
                return (
                  <div key={recepcao.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{recepcao.nomePaciente}</h3>
                        <p className="text-sm text-gray-600">Internação: {recepcao.numeroInternacao}</p>
                        <p className="text-sm text-gray-600">Procedimento: {recepcao.procedimentoProgramado}</p>
                        <p className="text-sm text-gray-600">Médico: {recepcao.medico}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(recepcao)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(recepcao.id!)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          Checklist: {checklistStatus.completed}/{checklistStatus.total}
                        </span>
                        <span className={`text-sm font-medium ${checklistStatus.color}`}>
                          {checklistStatus.percentage}%
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          recepcao.consentimentoAssinado 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {recepcao.consentimentoAssinado ? 'Consentimento Assinado' : 'Consentimento Pendente'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Jejum: {recepcao.tempoJejum}h
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingRecepcao ? 'Editar Recepção' : 'Nova Recepção'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seção de Busca de Paciente */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Paciente</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <PacienteBuscador
                      onPacienteSelecionado={handlePacienteSelecionado}
                      filtrarPorStatus={['internado', 'centro_cirurgico']}
                      className="w-full"
                    />
                    
                    {/* Exibir alertas de validação */}
                    {validationErrors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <h4 className="text-red-800 font-medium mb-2">⚠️ Problemas encontrados:</h4>
                        <ul className="text-red-700 text-sm list-disc list-inside">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Informações do paciente selecionado */}
                    {pacienteSelecionado && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="text-green-800 font-medium mb-2">✅ Paciente Selecionado</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Nome:</strong> {pacienteSelecionado.nome}
                          </div>
                          <div>
                            <strong>CPF:</strong> {pacienteSelecionado.cpf}
                          </div>
                          <div>
                            <strong>Idade:</strong> {pacienteSelecionado.idade} anos
                          </div>
                          <div>
                            <strong>Convênio:</strong> {pacienteSelecionado.convenio}
                          </div>
                          {pacienteSelecionado.tipoSanguineo && (
                            <div>
                              <strong>Tipo Sanguíneo:</strong> {pacienteSelecionado.tipoSanguineo}
                            </div>
                          )}
                          {pacienteSelecionado.alergias?.possui && (
                            <div className="col-span-2 text-red-700">
                              <strong>⚠️ Alergias:</strong> {pacienteSelecionado.alergias.descricao}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dados da Cirurgia */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados da Cirurgia</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Procedimento Programado
                      </label>
                      <input
                        type="text"
                        value={formData.procedimentoProgramado || ''}
                        onChange={(e) => setFormData({...formData, procedimentoProgramado: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Médico Responsável
                      </label>
                      <FuncionarioSeletor
                        onFuncionarioSelecionado={handleMedicoSelecionado}
                        setor="Centro Cirúrgico"
                        placeholder="Selecionar médico cirurgião"
                        funcionariosSelecionados={medicoSelecionado ? [medicoSelecionado] : []}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Anestesia
                      </label>
                      <select
                        value={formData.tipoAnestesia || 'geral'}
                        onChange={(e) => setFormData({...formData, tipoAnestesia: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="geral">Geral</option>
                        <option value="peridural">Peridural</option>
                        <option value="raquianestesia">Raquianestesia</option>
                        <option value="local">Local</option>
                        <option value="sedacao">Sedação</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tempo de Jejum (horas)
                      </label>
                      <input
                        type="number"
                        value={formData.tempoJejum || 0}
                        onChange={(e) => setFormData({...formData, tempoJejum: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.consentimentoAssinado || false}
                        onChange={(e) => setFormData({...formData, consentimentoAssinado: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Consentimento assinado</span>
                    </label>
                  </div>
                </div>

                {/* Checklist de Segurança */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Checklist de Segurança</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.checklist || {}).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => setFormData({
                            ...formData,
                            checklist: {
                              ...formData.checklist!,
                              [key]: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes || ''}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações adicionais..."
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={validationErrors.length > 0 || !pacienteSelecionado}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {editingRecepcao ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecepcaoCentroCircurgico;
