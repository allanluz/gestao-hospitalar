import React, { useState, useEffect } from 'react';

interface SinaisVitais {
  pressaoArterial: string;
  frequenciaCardiaca: number;
  saturacaoO2: number;
}

interface Horarios {
  entrada: string;
  inicio: string;
  fim: string;
}

interface Equipe {
  primeiroAssistente: string;
  equipeCompleta: string[];
  anestesiologista: string;
  circulantesSala: string[];
  instrumentador: string;
  enfermeiro: string;
}

interface Anestesia {
  tipo: string;
  canulaNasofaringea: boolean;
  manobraValsalva: boolean;
  sondaEndotraqueal: string;
  cateterNasal: boolean;
  agulhaRaquianestesia: string;
  agulhaPeridural: string;
}

interface AnestesicosAdministrados {
  xylocaina2SV?: number;
  xylocaina2CV?: number;
  levobupivacaina?: number;
  ropivacaina75?: number;
  ropivacaina2?: number;
  neocainaPesada?: number;
  neocainaIsobarica?: number;
  neotutocaina?: number;
  isoflurano?: number;
  sevoflurano?: number;
  etomidato?: number;
}

interface MedicamentosAdministrados {
  [key: string]: string;
}

interface PosicionamentoCirurgico {
  tipo: string;
  usoCoxim: boolean;
  outros: string;
}

interface GarrotePneumatico {
  utilizado: boolean;
  local: string;
  inicioHora: string;
  retiradaHora: string;
}

interface MantaTermica {
  utilizada: boolean;
  tempo: number;
}

interface EquipamentosSeguranca {
  travesseiros: boolean;
  faixaSeguranca: boolean;
}

interface AssistenciaIntraOperatoriaData {
  id: string;
  numeroInternacao: string;
  pacienteId: number;
  cirurgiaProposta: string;
  so: string;
  dataAssistencia: string;
  statusCirurgia: string;
  horarios: Horarios;
  sinaisVitais: SinaisVitais;
  equipe: Equipe;
  anestesia: Anestesia;
  anestesicosAdministrados: AnestesicosAdministrados;
  medicamentosAdministrados: MedicamentosAdministrados;
  posicionamentoCirurgico: PosicionamentoCirurgico;
  garrotePneumatico: GarrotePneumatico;
  mantaTermica: MantaTermica;
  equipamentosSeguranca: EquipamentosSeguranca;
}

const AssistenciaIntraOperatoria: React.FC = () => {
  const [assistencias, setAssistencias] = useState<AssistenciaIntraOperatoriaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssistencia, setSelectedAssistencia] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('geral');
  const [bodyMarkers, setBodyMarkers] = useState<Array<{x: number, y: number, note: string}>>([]);

  useEffect(() => {
    fetchAssistencias();
  }, []);

  const fetchAssistencias = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assistencia-intra-operatoria');
      if (!response.ok) {
        throw new Error('Erro ao carregar dados de assistência intra-operatória');
      }
      const data = await response.json();
      console.log('Dados recebidos:', data); // Para debug
      setAssistencias(data.data || data.assistencias || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar assistências:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBodyClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    const note = prompt('Digite uma observação para este ponto:');
    if (note) {
      setBodyMarkers([...bodyMarkers, { x, y, note }]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'agendada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Erro:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const selectedAssistenciaData = assistencias.find(a => a.id === selectedAssistencia);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Assistência Intra-Operatória</h1>
        <p className="text-gray-600 mt-2">
          Gerenciamento e monitoramento da assistência durante procedimentos cirúrgicos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total de Assistências</h3>
              <p className="text-2xl font-bold text-blue-600">{assistencias.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Concluídas</h3>
              <p className="text-2xl font-bold text-green-600">
                {assistencias.filter(a => a.statusCirurgia === 'concluida').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Em Andamento</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {assistencias.filter(a => a.statusCirurgia === 'em_andamento').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Agendadas</h3>
              <p className="text-2xl font-bold text-blue-600">
                {assistencias.filter(a => a.statusCirurgia === 'agendada').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de Assistências */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Assistências</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {assistencias.map((assistencia) => (
                <div
                  key={assistencia.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedAssistencia === assistencia.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedAssistencia(assistencia.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{assistencia.cirurgiaProposta}</p>
                      <p className="text-sm text-gray-600">Sala: {assistencia.so}</p>
                      <p className="text-sm text-gray-600">
                        Internação: {assistencia.numeroInternacao}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(assistencia.dataAssistencia)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assistencia.statusCirurgia)}`}>
                      {assistencia.statusCirurgia.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalhes da Assistência */}
        <div className="lg:col-span-3">
          {selectedAssistenciaData ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Detalhes da Assistência Intra-Operatória
                </h2>
                
                {/* Tabs */}
                <div className="mt-4">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'geral', name: 'Informações Gerais' },
                      { id: 'anestesia', name: 'Anestesia' },
                      { id: 'medicamentos', name: 'Medicamentos' },
                      { id: 'posicionamento', name: 'Posicionamento' },
                      { id: 'equipamentos', name: 'Equipamentos' },
                      { id: 'corpo', name: 'Indicação Corporal' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              
              <div className="p-6">
                {/* Tab Content - Informações Gerais */}
                {activeTab === 'geral' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Gerais</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Cirurgia Proposta</label>
                          <p className="text-gray-900">{selectedAssistenciaData.cirurgiaProposta}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Sala de Operação</label>
                          <p className="text-gray-900">{selectedAssistenciaData.so}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Número da Internação</label>
                          <p className="text-gray-900">{selectedAssistenciaData.numeroInternacao}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAssistenciaData.statusCirurgia)}`}>
                            {selectedAssistenciaData.statusCirurgia.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Horários</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Entrada</label>
                          <p className="text-gray-900">{selectedAssistenciaData.horarios.entrada}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Início</label>
                          <p className="text-gray-900">{selectedAssistenciaData.horarios.inicio}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Fim</label>
                          <p className="text-gray-900">{selectedAssistenciaData.horarios.fim}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Sinais Vitais</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Pressão Arterial</label>
                          <p className="text-gray-900">{selectedAssistenciaData.sinaisVitais.pressaoArterial}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Frequência Cardíaca</label>
                          <p className="text-gray-900">{selectedAssistenciaData.sinaisVitais.frequenciaCardiaca} bpm</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Saturação O2</label>
                          <p className="text-gray-900">{selectedAssistenciaData.sinaisVitais.saturacaoO2}%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Equipe Médica</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Primeiro Assistente</label>
                          <p className="text-gray-900">{selectedAssistenciaData.equipe.primeiroAssistente}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Anestesiologista</label>
                          <p className="text-gray-900">{selectedAssistenciaData.equipe.anestesiologista}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Instrumentador</label>
                          <p className="text-gray-900">{selectedAssistenciaData.equipe.instrumentador}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Enfermeiro</label>
                          <p className="text-gray-900">{selectedAssistenciaData.equipe.enfermeiro}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Equipe Completa</label>
                          <ul className="text-gray-900 list-disc list-inside">
                            {selectedAssistenciaData.equipe.equipeCompleta.map((membro, index) => (
                              <li key={index}>{membro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Circulantes de Sala</label>
                          <ul className="text-gray-900 list-disc list-inside">
                            {selectedAssistenciaData.equipe.circulantesSala.map((circulante, index) => (
                              <li key={index}>{circulante}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Anestesia */}
                {activeTab === 'anestesia' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Tipo de Anestesia</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tipo</label>
                          <p className="text-gray-900 capitalize">{selectedAssistenciaData.anestesia?.tipo || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Sonda Endotraqueal</label>
                          <p className="text-gray-900">{selectedAssistenciaData.anestesia?.sondaEndotraqueal || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Agulha Raquianestesia</label>
                          <p className="text-gray-900">{selectedAssistenciaData.anestesia?.agulhaRaquianestesia || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Agulha Peridural</label>
                          <p className="text-gray-900">{selectedAssistenciaData.anestesia?.agulhaPeridural || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Procedimentos Anestésicos</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.anestesia?.canulaNasofaringea} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Cânula Nasofaríngea</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.anestesia?.manobraValsalva} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Manobra Valsalva</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.anestesia?.cateterNasal} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Cateter Nasal</label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Anestésicos Administrados</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(selectedAssistenciaData.anestesicosAdministrados || {}).map(([key, value]) => (
                          value !== 0 && (
                            <div key={key}>
                              <label className="text-sm font-medium text-gray-500 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </label>
                              <p className="text-gray-900">{value} mg</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Medicamentos */}
                {activeTab === 'medicamentos' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Medicamentos Administrados</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(selectedAssistenciaData.medicamentosAdministrados || {}).map(([medicamento, dose]) => (
                          <div key={medicamento} className="bg-gray-50 p-3 rounded">
                            <label className="text-sm font-medium text-gray-500 capitalize">
                              {medicamento}
                            </label>
                            <p className="text-gray-900 font-semibold">{dose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Posicionamento */}
                {activeTab === 'posicionamento' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Posicionamento Cirúrgico</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tipo de Posição</label>
                          <p className="text-gray-900 uppercase">{selectedAssistenciaData.posicionamentoCirurgico?.tipo}</p>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.posicionamentoCirurgico?.usoCoxim} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Uso de Coxim</label>
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-500">Outros</label>
                          <p className="text-gray-900">{selectedAssistenciaData.posicionamentoCirurgico?.outros || 'Nenhuma observação'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Garrote Pneumático</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.garrotePneumatico?.utilizado} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Utilizado</label>
                        </div>
                        {selectedAssistenciaData.garrotePneumatico?.utilizado && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Local</label>
                              <p className="text-gray-900">{selectedAssistenciaData.garrotePneumatico.local}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Hora Início</label>
                              <p className="text-gray-900">{selectedAssistenciaData.garrotePneumatico.inicioHora}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Hora Retirada</label>
                              <p className="text-gray-900">{selectedAssistenciaData.garrotePneumatico.retiradaHora}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Equipamentos */}
                {activeTab === 'equipamentos' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Manta Térmica</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.mantaTermica?.utilizada} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Utilizada</label>
                        </div>
                        {selectedAssistenciaData.mantaTermica?.utilizada && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Tempo (minutos)</label>
                            <p className="text-gray-900">{selectedAssistenciaData.mantaTermica.tempo}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Equipamentos de Segurança</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.equipamentosSeguranca?.travesseiros} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Travesseiros</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAssistenciaData.equipamentosSeguranca?.faixaSeguranca} 
                            readOnly 
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Faixa de Segurança</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Indicação Corporal */}
                {activeTab === 'corpo' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Indicação Corporal</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Clique na imagem para marcar pontos de intervenção cirúrgica
                      </p>
                      
                      <div className="relative border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div 
                          className="relative w-full h-96 mx-auto cursor-crosshair"
                          onClick={handleBodyClick}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 400'%3E%3C!-- Figura humana simples --%3E%3Cpath d='M100 20 C110 20 120 30 120 40 C120 50 110 60 100 60 C90 60 80 50 80 40 C80 30 90 20 100 20' fill='%23ddd' stroke='%23666'/%3E%3Cpath d='M100 60 L100 200 M100 80 L80 120 M100 80 L120 120 M100 200 L80 280 M100 200 L120 280' stroke='%23666' stroke-width='3' fill='none'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'contain'
                          }}
                        >
                          {/* SVG Body Diagram */}
                          <svg viewBox="0 0 200 400" className="w-full h-full">
                            {/* Head */}
                            <circle cx="100" cy="40" r="25" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
                            
                            {/* Body */}
                            <rect x="80" y="60" width="40" height="100" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
                            
                            {/* Arms */}
                            <rect x="50" y="80" width="30" height="15" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
                            <rect x="120" y="80" width="30" height="15" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
                            
                            {/* Legs */}
                            <rect x="85" y="160" width="15" height="80" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
                            <rect x="100" y="160" width="15" height="80" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
                          </svg>
                          
                          {/* Markers */}
                          {bodyMarkers.map((marker, index) => (
                            <div
                              key={index}
                              className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2"
                              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                              title={marker.note}
                            >
                              <span className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                                {marker.note}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Lista de marcações */}
                      {bodyMarkers.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Marcações Registradas:</h4>
                          <ul className="space-y-2">
                            {bodyMarkers.map((marker, index) => (
                              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <span className="text-sm">{marker.note}</span>
                                <button
                                  onClick={() => setBodyMarkers(bodyMarkers.filter((_, i) => i !== index))}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remover
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma assistência selecionada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Selecione uma assistência da lista para ver os detalhes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistenciaIntraOperatoria;
