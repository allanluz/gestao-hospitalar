import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AssistenciaIntraOperatoria } from '../types/centro-cirurgico';

const AssistenciaIntraOperatoriaPage: React.FC = () => {
  const [assistencias, setAssistencias] = useState<AssistenciaIntraOperatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<AssistenciaIntraOperatoria>>({
    numeroInternacao: '',
    cirurgiaProposta: '',
    so: '',
    horarios: {
      entrada: '',
      inicio: '',
      fim: ''
    },
    sinaisVitais: {
      pressaoArterial: '',
      frequenciaCardiaca: 0,
      saturacaoO2: 0
    },
    equipe: {
      primeiroAssistente: '',
      equipeCompleta: [],
      anestesiologista: '',
      circulantesSala: [],
      instrumentador: '',
      enfermeiro: ''
    },
    anestesia: {
      tipo: '',
      canulaNasofaringea: false,
      manobraValsalva: false,
      sondaEndotraqueal: '',
      cateterNasal: false,
      agulhaRaquianestesia: '',
      agulhaPeridural: ''
    },
    anestesicosAdministrados: {},
    medicamentosAdministrados: {},
    posicionamentoCirurgico: {
      tipo: 'ddh',
      usoCoxim: false,
      outros: ''
    },
    garrotePneumatico: {
      utilizado: false,
      local: '',
      inicioHora: '',
      retiradaHora: ''
    },
    mantaTermica: {
      utilizada: false,
      tempo: 0
    },
    equipamentosSeguranca: {
      travesseiros: false,
      faixaSeguranca: false
    }
  });

  useEffect(() => {
    fetchAssistencias();
  }, []);

  const fetchAssistencias = async () => {
    try {
      const data = await api.getAssistenciasIntraOperatorias();
      setAssistencias(Array.isArray(data) ? data as AssistenciaIntraOperatoria[] : []);
    } catch (error) {
      console.error('Erro ao buscar assistências:', error);
      setAssistencias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateAssistenciaIntraOperatoria(editingId, formData);
      } else {
        await api.createAssistenciaIntraOperatoria(formData);
      }
      resetForm();
      fetchAssistencias();
    } catch (error) {
      console.error('Erro ao salvar assistência:', error);
    }
  };

  const handleEdit = (assistencia: AssistenciaIntraOperatoria) => {
    setFormData(assistencia);
    setEditingId(assistencia.id || null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await api.deleteAssistenciaIntraOperatoria(id);
        fetchAssistencias();
      } catch (error) {
        console.error('Erro ao excluir assistência:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      numeroInternacao: '',
      cirurgiaProposta: '',
      so: '',
      horarios: {
        entrada: '',
        inicio: '',
        fim: ''
      },
      sinaisVitais: {
        pressaoArterial: '',
        frequenciaCardiaca: 0,
        saturacaoO2: 0
      },
      equipe: {
        primeiroAssistente: '',
        equipeCompleta: [],
        anestesiologista: '',
        circulantesSala: [],
        instrumentador: '',
        enfermeiro: ''
      },
      anestesia: {
        tipo: '',
        canulaNasofaringea: false,
        manobraValsalva: false,
        sondaEndotraqueal: '',
        cateterNasal: false,
        agulhaRaquianestesia: '',
        agulhaPeridural: ''
      },
      anestesicosAdministrados: {},
      medicamentosAdministrados: {},
      posicionamentoCirurgico: {
        tipo: 'ddh',
        usoCoxim: false,
        outros: ''
      },
      garrotePneumatico: {
        utilizado: false,
        local: '',
        inicioHora: '',
        retiradaHora: ''
      },
      mantaTermica: {
        utilizada: false,
        tempo: 0
      },
      equipamentosSeguranca: {
        travesseiros: false,
        faixaSeguranca: false
      }
    });
    setEditingId(null);
  };

  const filteredAssistencias = Array.isArray(assistencias) ? assistencias.filter(assistencia =>
    assistencia.numeroInternacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistencia.cirurgiaProposta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistencia.equipe?.anestesiologista?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Assistência Intra-Operatória</h1>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                Cirurgia Proposta *
              </label>
              <input
                type="text"
                value={formData.cirurgiaProposta || ''}
                onChange={(e) => setFormData({ ...formData, cirurgiaProposta: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SO (Sala Operatória) *
              </label>
              <input
                type="text"
                value={formData.so || ''}
                onChange={(e) => setFormData({ ...formData, so: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Horários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrada
              </label>
              <input
                type="time"
                value={formData.horarios?.entrada || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  horarios: { 
                    ...formData.horarios!, 
                    entrada: e.target.value 
                  } 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Início da Cirurgia
              </label>
              <input
                type="time"
                value={formData.horarios?.inicio || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  horarios: { 
                    ...formData.horarios!, 
                    inicio: e.target.value 
                  } 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fim da Cirurgia
              </label>
              <input
                type="time"
                value={formData.horarios?.fim || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  horarios: { 
                    ...formData.horarios!, 
                    fim: e.target.value 
                  } 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Equipe */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Equipe Cirúrgica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anestesiologista
                </label>
                <input
                  type="text"
                  value={formData.equipe?.anestesiologista || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipe: { 
                      ...formData.equipe!, 
                      anestesiologista: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primeiro Assistente
                </label>
                <input
                  type="text"
                  value={formData.equipe?.primeiroAssistente || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipe: { 
                      ...formData.equipe!, 
                      primeiroAssistente: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrumentador
                </label>
                <input
                  type="text"
                  value={formData.equipe?.instrumentador || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipe: { 
                      ...formData.equipe!, 
                      instrumentador: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enfermeiro
                </label>
                <input
                  type="text"
                  value={formData.equipe?.enfermeiro || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipe: { 
                      ...formData.equipe!, 
                      enfermeiro: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Anestesia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Anestesia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Anestesia
                </label>
                <select
                  value={formData.anestesia?.tipo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    anestesia: { 
                      ...formData.anestesia!, 
                      tipo: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="geral">Geral</option>
                  <option value="peridural">Peridural</option>
                  <option value="raquianestesia">Raquianestesia</option>
                  <option value="local">Local</option>
                  <option value="sedacao">Sedação</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sonda Endotraqueal
                </label>
                <input
                  type="text"
                  value={formData.anestesia?.sondaEndotraqueal || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    anestesia: { 
                      ...formData.anestesia!, 
                      sondaEndotraqueal: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Número da sonda"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="canulaNasofaringea"
                  checked={formData.anestesia?.canulaNasofaringea || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    anestesia: { 
                      ...formData.anestesia!, 
                      canulaNasofaringea: e.target.checked 
                    }
                  })}
                  className="mr-2"
                />
                <label htmlFor="canulaNasofaringea" className="text-sm text-gray-700">
                  Cânula Nasofaríngea
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cateterNasal"
                  checked={formData.anestesia?.cateterNasal || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    anestesia: { 
                      ...formData.anestesia!, 
                      cateterNasal: e.target.checked 
                    }
                  })}
                  className="mr-2"
                />
                <label htmlFor="cateterNasal" className="text-sm text-gray-700">
                  Cateter Nasal
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="manobraValsalva"
                  checked={formData.anestesia?.manobraValsalva || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    anestesia: { 
                      ...formData.anestesia!, 
                      manobraValsalva: e.target.checked 
                    }
                  })}
                  className="mr-2"
                />
                <label htmlFor="manobraValsalva" className="text-sm text-gray-700">
                  Manobra Valsalva
                </label>
              </div>
            </div>
          </div>

          {/* Sinais Vitais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Sinais Vitais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pressão Arterial
                </label>
                <input
                  type="text"
                  value={formData.sinaisVitais?.pressaoArterial || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sinaisVitais: { 
                      ...formData.sinaisVitais!, 
                      pressaoArterial: e.target.value 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 120/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência Cardíaca
                </label>
                <input
                  type="number"
                  value={formData.sinaisVitais?.frequenciaCardiaca || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sinaisVitais: { 
                      ...formData.sinaisVitais!, 
                      frequenciaCardiaca: parseInt(e.target.value) || 0 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="BPM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saturação O2
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sinaisVitais?.saturacaoO2 || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sinaisVitais: { 
                      ...formData.sinaisVitais!, 
                      saturacaoO2: parseInt(e.target.value) || 0 
                    } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="%"
                />
              </div>
            </div>
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

      {/* Lista de Assistências */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Registros de Assistência</h2>
            <input
              type="text"
              placeholder="Buscar por internação, cirurgia ou anestesiologista..."
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
                  Internação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cirurgia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssistencias.map((assistencia) => (
                <tr key={assistencia.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assistencia.numeroInternacao}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assistencia.equipe?.anestesiologista}</div>
                    <div className="text-sm text-gray-500">{assistencia.equipe?.instrumentador}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assistencia.cirurgiaProposta}</div>
                    <div className="text-sm text-gray-500">{assistencia.anestesia?.tipo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assistencia.horarios?.inicio} - {assistencia.horarios?.fim}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assistencia.horarios?.fim ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assistencia.horarios?.fim ? 'Concluída' : 'Em andamento'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(assistencia)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(assistencia.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssistencias.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistenciaIntraOperatoriaPage;
