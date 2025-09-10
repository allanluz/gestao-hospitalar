import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RecuperacaoAnestesica, SinaisVitais, MedicamentoMinistrado } from '../types/centro-cirurgico';
import { AssistenciaIntraOperatoria } from '../types/centro-cirurgico';
import { Paciente, Funcionario } from '../types';
import PacienteBuscador from '../components/common/PacienteBuscador';
import FuncionarioSeletor from '../components/common/FuncionarioSeletor';
import DataIntegrationService from '../services/dataIntegration';
// import { IndiceAldreteKroulik } from '../components/IndiceAldreteKroulik';
// import { SinaisVitaisMonitor } from '../components/SinaisVitaisMonitor';
// import { EscalaSedacaoRamsay } from '../components/EscalaSedacaoRamsay';

const RecuperacaoAnestesicaPage: React.FC = () => {
  const [recuperacoes, setRecuperacoes] = useState<RecuperacaoAnestesica[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [assistenciaIntraOperatoria, setAssistenciaIntraOperatoria] = useState<AssistenciaIntraOperatoria | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loadingAssistencia, setLoadingAssistencia] = useState(false);
  
  const [formData, setFormData] = useState<Partial<RecuperacaoAnestesica>>({
    numeroInternacao: '',
    nome: '',
    idade: 0,
    quartoLeito: '',
    cirurgiaRealizada: '',
    diagnosticoBase: '',
    anestesiologista: '',
    nebulizacao: false,
    escalaDor: 0,
    tipoAnestesia: {
      geralVenosa: false,
      geralInalatoria: false,
      geralCombinada: false,
      peridural: false,
      periduralCateter: false,
      raqui: false,
      bloqueio: false,
      sedacao: false,
    },
    alergias: {
      possui: false,
      descricao: '',
    },
    monitorizacao: {
      multiparametrico: false,
      ecg: false,
      oximetroPulso: false,
      pa: false,
      pvc: false,
      paInvasiva: false,
      localPaInvasiva: '',
    },
    escalaPupilas: {
      tamanho: '',
      tipo: '',
      simetria: '',
      fotorreacao: '',
    },
    sinaisVitaisHorarios: [],
    escalaSedacaoRamsay: [],
    medicamentosMinistrados: [],
    liquidosEliminados: [],
    indiceAldreteKroulik: {
      movimentacao: 0,
      respiracao: 0,
      pressaoArterial: 0,
      consciencia: 0,
      saturacaoO2: 0,
      total: 0,
      aptoParaAlta: false,
    },
  });

  useEffect(() => {
    fetchRecuperacoes();
  }, []);

  // Função para carregar dados do paciente e buscar assistência intra-operatória
  const handlePacienteSelecionado = async (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setLoadingAssistencia(true);
    
    try {
      // Buscar internação ativa do paciente
      const internacaoAtiva = paciente.internacoes?.find(i => i.status === 'ativa');
      
      if (internacaoAtiva) {
        // Buscar assistência intra-operatória relacionada
        const assistencias = await api.getAssistenciasIntraOperatorias();
        const assistenciaRelacionada = (assistencias as AssistenciaIntraOperatoria[]).find(
          a => a.numeroInternacao === internacaoAtiva.numeroInternacao && 
               a.horarios?.fim // Só considerar cirurgias finalizadas
        );

        if (assistenciaRelacionada) {
          setAssistenciaIntraOperatoria(assistenciaRelacionada);
          
          // Preencher automaticamente os dados da recuperação com base na assistência
          setFormData(prev => ({
            ...prev,
            numeroInternacao: assistenciaRelacionada.numeroInternacao,
            nome: paciente.nome,
            idade: paciente.idade || 0,
            quartoLeito: internacaoAtiva.quarto && internacaoAtiva.leito ? 
              `${internacaoAtiva.quarto}/${internacaoAtiva.leito}` : '',
            cirurgiaRealizada: assistenciaRelacionada.cirurgiaProposta,
            anestesiologista: assistenciaRelacionada.equipe?.anestesiologista || '',
            alergias: paciente.alergias || { possui: false, descricao: '' },
            tipoAnestesia: {
              geralVenosa: assistenciaRelacionada.anestesia?.tipo === 'geral',
              geralInalatoria: false,
              geralCombinada: false,
              peridural: assistenciaRelacionada.anestesia?.tipo === 'peridural',
              periduralCateter: false,
              raqui: assistenciaRelacionada.anestesia?.tipo === 'raquianestesia',
              bloqueio: assistenciaRelacionada.anestesia?.tipo === 'local',
              sedacao: assistenciaRelacionada.anestesia?.tipo === 'sedacao',
            }
          }));

          // Validar integridade dos dados
          const validation = await DataIntegrationService.validateDataIntegrity(internacaoAtiva.numeroInternacao);
          setValidationErrors(validation.issues);
        } else {
          setValidationErrors(['Nenhuma assistência intra-operatória concluída encontrada para este paciente']);
          setAssistenciaIntraOperatoria(null);
        }
      } else {
        setValidationErrors(['Paciente não possui internação ativa']);
        setAssistenciaIntraOperatoria(null);
      }
    } catch (error) {
      console.error('Erro ao buscar assistência intra-operatória:', error);
      setValidationErrors(['Erro ao buscar dados da cirurgia']);
      setAssistenciaIntraOperatoria(null);
    } finally {
      setLoadingAssistencia(false);
    }
  };

  const fetchRecuperacoes = async () => {
    try {
      const data = await api.getRecuperacoesAnestesicas();
      setRecuperacoes(Array.isArray(data) ? data as RecuperacaoAnestesica[] : []);
    } catch (error) {
      console.error('Erro ao buscar recuperações:', error);
      setRecuperacoes([]);
    } finally {
      setLoading(false);
    }
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

    if (!assistenciaIntraOperatoria) {
      alert('É necessário ter uma assistência intra-operatória concluída para este paciente');
      return;
    }

    try {
      // Adicionar referência à assistência intra-operatória
      const recuperacaoData = {
        ...formData,
        pacienteId: pacienteSelecionado.id,
        assistenciaIntraOperatoriaId: assistenciaIntraOperatoria.id,
        dataRecuperacao: new Date().toISOString()
      };

      if (editingId) {
        await api.updateRecuperacaoAnestesica(editingId, recuperacaoData);
      } else {
        await api.createRecuperacaoAnestesica(recuperacaoData);
      }
      resetForm();
      fetchRecuperacoes();
    } catch (error) {
      console.error('Erro ao salvar recuperação:', error);
    }
  };

  const handleEdit = (recuperacao: RecuperacaoAnestesica) => {
    setFormData(recuperacao);
    setEditingId(recuperacao.id || null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await api.deleteRecuperacaoAnestesica(id);
        fetchRecuperacoes();
      } catch (error) {
        console.error('Erro ao excluir recuperação:', error);
      }
    }
  };

  const resetForm = () => {
    setPacienteSelecionado(null);
    setAssistenciaIntraOperatoria(null);
    setValidationErrors([]);
    setFormData({
      numeroInternacao: '',
      nome: '',
      idade: 0,
      quartoLeito: '',
      cirurgiaRealizada: '',
      diagnosticoBase: '',
      anestesiologista: '',
      nebulizacao: false,
      escalaDor: 0,
      tipoAnestesia: {
        geralVenosa: false,
        geralInalatoria: false,
        geralCombinada: false,
        peridural: false,
        periduralCateter: false,
        raqui: false,
        bloqueio: false,
        sedacao: false,
      },
      alergias: {
        possui: false,
        descricao: '',
      },
      monitorizacao: {
        multiparametrico: false,
        ecg: false,
        oximetroPulso: false,
        pa: false,
        pvc: false,
        paInvasiva: false,
        localPaInvasiva: '',
      },
      escalaPupilas: {
        tamanho: '',
        tipo: '',
        simetria: '',
        fotorreacao: '',
      },
      sinaisVitaisHorarios: [],
      escalaSedacaoRamsay: [],
      medicamentosMinistrados: [],
      liquidosEliminados: [],
      indiceAldreteKroulik: {
        movimentacao: 0,
        respiracao: 0,
        pressaoArterial: 0,
        consciencia: 0,
        saturacaoO2: 0,
        total: 0,
        aptoParaAlta: false,
      },
    });
    setEditingId(null);
  };

  const addSinaisVitais = () => {
    const novoSinal: SinaisVitais = {
      hora: new Date().toTimeString().slice(0, 5),
      pa: '',
      fc: 0,
      fr: 0,
      so2: 0,
      temperatura: 0,
    };
    
    setFormData({
      ...formData,
      sinaisVitaisHorarios: [...(formData.sinaisVitaisHorarios || []), novoSinal]
    });
  };

  const updateSinaisVitais = (index: number, field: keyof SinaisVitais, value: any) => {
    const sinaisVitais = [...(formData.sinaisVitaisHorarios || [])];
    sinaisVitais[index] = { ...sinaisVitais[index], [field]: value };
    setFormData({ ...formData, sinaisVitaisHorarios: sinaisVitais });
  };

  const removeSinaisVitais = (index: number) => {
    const sinaisVitais = [...(formData.sinaisVitaisHorarios || [])];
    sinaisVitais.splice(index, 1);
    setFormData({ ...formData, sinaisVitaisHorarios: sinaisVitais });
  };

  const addMedicamento = () => {
    const novoMedicamento: MedicamentoMinistrado = {
      medicamento: '',
      hora: new Date().toTimeString().slice(0, 5),
      quantidade: '',
    };
    
    setFormData({
      ...formData,
      medicamentosMinistrados: [...(formData.medicamentosMinistrados || []), novoMedicamento]
    });
  };

  const updateMedicamento = (index: number, field: keyof MedicamentoMinistrado, value: string) => {
    const medicamentos = [...(formData.medicamentosMinistrados || [])];
    medicamentos[index] = { ...medicamentos[index], [field]: value };
    setFormData({ ...formData, medicamentosMinistrados: medicamentos });
  };

  const removeMedicamento = (index: number) => {
    const medicamentos = [...(formData.medicamentosMinistrados || [])];
    medicamentos.splice(index, 1);
    setFormData({ ...formData, medicamentosMinistrados: medicamentos });
  };

  const filteredRecuperacoes = Array.isArray(recuperacoes) ? recuperacoes.filter(recuperacao =>
    recuperacao.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperacao.numeroInternacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperacao.anestesiologista?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Recuperação Anestésica</h1>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alertas de Validação */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h4 className="text-red-800 font-medium mb-2">Problemas de Validação:</h4>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Busca de Paciente */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Buscar Paciente</h3>
            <PacienteBuscador
              onPacienteSelecionado={handlePacienteSelecionado}
            />
            {loadingAssistencia && (
              <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                <p className="text-sm text-gray-600">Buscando dados da cirurgia...</p>
              </div>
            )}
            {pacienteSelecionado && (
              <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                <p className="text-sm"><strong>Paciente:</strong> {pacienteSelecionado.nome}</p>
                <p className="text-sm text-gray-600">Status: {pacienteSelecionado.statusAtual}</p>
                {pacienteSelecionado.alergias && pacienteSelecionado.alergias.possui && (
                  <p className="text-sm text-red-600">
                    <strong>Alergias:</strong> {pacienteSelecionado.alergias.descricao}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Dados da Assistência Intra-Operatória */}
          {assistenciaIntraOperatoria && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados da Cirurgia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Cirurgia:</strong> {assistenciaIntraOperatoria.cirurgiaProposta}</p>
                  <p className="text-sm text-gray-600">SO: {assistenciaIntraOperatoria.so}</p>
                </div>
                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Anestesiologista:</strong> {assistenciaIntraOperatoria.equipe?.anestesiologista}</p>
                  <p className="text-sm text-gray-600">Tipo: {assistenciaIntraOperatoria.anestesia?.tipo}</p>
                </div>
                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Horário:</strong></p>
                  <p className="text-sm text-gray-600">
                    Início: {assistenciaIntraOperatoria.horarios?.inicio} - 
                    Fim: {assistenciaIntraOperatoria.horarios?.fim}
                  </p>
                </div>
                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-sm"><strong>Equipe:</strong></p>
                  <p className="text-sm text-gray-600">
                    Instrumentador: {assistenciaIntraOperatoria.equipe?.instrumentador}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Internação *
              </label>
              <input
                type="text"
                value={formData.numeroInternacao || ''}
                onChange={(e) => setFormData({ ...formData, numeroInternacao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Paciente *
              </label>
              <input
                type="text"
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade *
              </label>
              <input
                type="number"
                value={formData.idade || 0}
                onChange={(e) => setFormData({ ...formData, idade: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Segunda linha de informações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quarto/Leito *
              </label>
              <input
                type="text"
                value={formData.quartoLeito || ''}
                onChange={(e) => setFormData({ ...formData, quartoLeito: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cirurgia Realizada *
              </label>
              <input
                type="text"
                value={formData.cirurgiaRealizada || ''}
                onChange={(e) => setFormData({ ...formData, cirurgiaRealizada: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anestesiologista *
              </label>
              <input
                type="text"
                value={formData.anestesiologista || ''}
                onChange={(e) => setFormData({ ...formData, anestesiologista: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Componentes Especializados */}
          <div className="space-y-6">
            {/* Componentes serão adicionados posteriormente */}
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-600 text-center">
                Componentes especializados (Sinais Vitais, Escala Ramsay, Índice Aldrete) serão implementados em breve
              </p>
            </div>
          </div>

          {/* Medicamentos Ministrados */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Medicamentos Ministrados</h3>
              <button
                type="button"
                onClick={addMedicamento}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Adicionar Medicamento
              </button>
            </div>

            {formData.medicamentosMinistrados?.map((medicamento, index) => (
              <div key={index} className="mb-4 p-4 bg-white rounded-md border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Medicamento #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeMedicamento(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicamento
                    </label>
                    <input
                      type="text"
                      value={medicamento.medicamento}
                      onChange={(e) => updateMedicamento(index, 'medicamento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={medicamento.hora}
                      onChange={(e) => updateMedicamento(index, 'hora', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade
                    </label>
                    <input
                      type="text"
                      value={medicamento.quantidade}
                      onChange={(e) => updateMedicamento(index, 'quantidade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Recuperações */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Registros de Recuperação</h2>
            <input
              type="text"
              placeholder="Buscar por paciente, internação ou anestesiologista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cirurgia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anestesiologista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Aldrete
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecuperacoes.map((recuperacao) => (
                <tr key={recuperacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {recuperacao.nome}
                    </div>
                    <div className="text-sm text-gray-500">Idade: {recuperacao.idade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{recuperacao.numeroInternacao}</div>
                    <div className="text-sm text-gray-500">{recuperacao.quartoLeito}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {recuperacao.cirurgiaRealizada}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {recuperacao.anestesiologista}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      recuperacao.indiceAldreteKroulik?.aptoParaAlta
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {recuperacao.indiceAldreteKroulik?.aptoParaAlta ? 'Alta autorizada' : 'Em observação'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(recuperacao)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(recuperacao.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRecuperacoes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecuperacaoAnestesicaPage;
