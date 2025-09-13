import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RecepcaoCentroCircurgico as RecepcaoType } from '../types/centro-cirurgico';
import { Paciente, Funcionario } from '../types';
import PacienteBuscador from '../components/common/PacienteBuscador';
import FuncionarioSeletor from '../components/common/FuncionarioSeletor';
import CodeScanner from '../components/common/CodeScanner';
import DataIntegrationService from '../services/dataIntegration';

const RecepcaoCentroCircurgico: React.FC = () => {
  const [recepcoes, setRecepcoes] = useState<RecepcaoType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecepcao, setEditingRecepcao] = useState<RecepcaoType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<Funcionario | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false);
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

  useEffect(() => {
    // Carregar dados dos pacientes para as recepções existentes
    recepcoes.forEach(async (recepcao) => {
      await buscarDadosPaciente(recepcao.nomePaciente);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recepcoes]);

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

  // Função para buscar dados do paciente pelo nome
  const [pacientesData, setPacientesData] = useState<{ [nome: string]: Paciente }>({});

  const buscarDadosPaciente = async (nomePaciente: string) => {
    if (pacientesData[nomePaciente]) {
      return pacientesData[nomePaciente];
    }

    try {
      // Simular busca de paciente - na implementação real, isso seria uma chamada API
      const pacientes = await api.getPacientes() as Paciente[];
      const paciente = pacientes.find((p: Paciente) => p.nome === nomePaciente);
      
      if (paciente) {
        setPacientesData(prev => ({ ...prev, [nomePaciente]: paciente }));
        return paciente;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do paciente:', error);
    }
    return null;
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

  // Função para lidar com paciente encontrado pelo scanner
  const handlePatientFoundByCode = (paciente: Paciente) => {
    handlePacienteSelecionado(paciente);
    setShowScanner(false);
    setIsModalOpen(true); // Abre o modal para nova recepção com dados do paciente
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
        {/* Alerta de Acessibilidade Global */}
        {(() => {
          const pacientesComNecessidades = filteredRecepcoes.filter(recepcao => {
            const pacienteInfo = pacientesData[recepcao.nomePaciente];
            if (pacienteInfo) {
              const hasDeficiencias = Object.values(pacienteInfo.deficiencias || {}).some(val => val === true);
              const hasNeurodivergencias = Object.values(pacienteInfo.neurodivergencias || {}).some(val => val === true);
              const hasNecessidades = Object.values(pacienteInfo.necessidadesEspeciais || {}).some(val => val === true || val);
              return hasDeficiencias || hasNeurodivergencias || hasNecessidades;
            }
            return false;
          });

          if (pacientesComNecessidades.length > 0) {
            return (
              <div className="bg-red-600 text-white p-4 rounded-lg mb-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h3 className="text-lg font-bold">ALERTA: Pacientes com Necessidades Especiais</h3>
                    <p className="text-sm">
                      {pacientesComNecessidades.length} paciente(s) no centro cirúrgico requer(em) atenção especial para acessibilidade
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Recepção do Centro Cirúrgico</h1>
              <p className="text-sm text-gray-600 mt-1">
                Sistema integrado com alertas de acessibilidade e inclusão para atendimento especializado
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowScanner(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Escanear QR Code ou Código de Barras do Paciente"
              >
                📱 Escanear Código
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Nova Recepção
              </button>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Pesquisar por paciente, número de internação ou procedimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Lista de Recepções */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecepcoes.map((recepcao) => {
              const checklistStatus = getChecklistStatus(recepcao.checklist);
              return (
                <div key={recepcao.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{recepcao.nomePaciente}</h3>
                      <p className="text-sm text-gray-600">Int: {recepcao.numeroInternacao}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(recepcao)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(recepcao.id!)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>Procedimento:</strong> {recepcao.procedimentoProgramado}</p>
                    <p><strong>Médico:</strong> {recepcao.medico}</p>
                    <p><strong>Anestesia:</strong> {recepcao.tipoAnestesia}</p>
                    <p><strong>Jejum:</strong> {recepcao.tempoJejum}h</p>
                    
                    {/* Indicadores de Acessibilidade na Listagem */}
                    {(() => {
                      const pacienteInfo = pacientesData[recepcao.nomePaciente];
                      if (pacienteInfo && (pacienteInfo.deficiencias || pacienteInfo.neurodivergencias || pacienteInfo.necessidadesEspeciais)) {
                        const hasDeficiencias = Object.values(pacienteInfo.deficiencias || {}).some(val => val === true);
                        const hasNeurodivergencias = Object.values(pacienteInfo.neurodivergencias || {}).some(val => val === true);
                        const hasNecessidades = Object.values(pacienteInfo.necessidadesEspeciais || {}).some(val => val === true || val);
                        
                        if (hasDeficiencias || hasNeurodivergencias || hasNecessidades) {
                          return (
                            <div className="bg-red-100 border-2 border-red-400 rounded p-2 mt-2">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-red-800 font-bold text-xs">🚨 ATENÇÃO ESPECIAL REQUERIDA</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {pacienteInfo.deficiencias?.auditiva && (
                                  <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">🔇 AUDITIVA</span>
                                )}
                                {pacienteInfo.deficiencias?.visual && (
                                  <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">👁️ VISUAL</span>
                                )}
                                {pacienteInfo.deficiencias?.fisica && (
                                  <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">♿ FÍSICA</span>
                                )}
                                {pacienteInfo.deficiencias?.intelectual && (
                                  <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">🧠 INTELECTUAL</span>
                                )}
                                {pacienteInfo.neurodivergencias?.autismo && (
                                  <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded font-bold">🧩 AUTISMO</span>
                                )}
                                {pacienteInfo.neurodivergencias?.tdah && (
                                  <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded font-bold">⚡ TDAH</span>
                                )}
                                {pacienteInfo.neurodivergencias?.sindrome_down && (
                                  <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">💙 DOWN</span>
                                )}
                                {pacienteInfo.necessidadesEspeciais?.cadeirante && (
                                  <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">♿ CADEIRANTE</span>
                                )}
                                {pacienteInfo.necessidadesEspeciais?.interprete_libras && (
                                  <span className="inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded font-bold">🤟 LIBRAS</span>
                                )}
                                {pacienteInfo.necessidadesEspeciais?.acompanhante && (
                                  <span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded font-bold">👥 ACOMPANHANTE</span>
                                )}
                              </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })()}
                    
                    <div className="flex justify-between items-center">
                      <span><strong>Checklist:</strong></span>
                      <span className={`font-semibold ${checklistStatus.color}`}>
                        {checklistStatus.completed}/{checklistStatus.total} ({checklistStatus.percentage}%)
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          checklistStatus.percentage === 100 ? 'bg-green-600' :
                          checklistStatus.percentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${checklistStatus.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingRecepcao ? 'Editar Recepção' : 'Nova Recepção'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

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
                  {pacienteSelecionado && (
                    <div className="mt-3 p-4 bg-white rounded border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm"><strong>Selecionado:</strong> {pacienteSelecionado.nome}</p>
                          <p className="text-sm text-gray-600">Status: {pacienteSelecionado.statusAtual}</p>
                          {pacienteSelecionado.alergias && pacienteSelecionado.alergias.possui && (
                            <p className="text-sm text-red-600">
                              <strong>⚠️ Alergias:</strong> {pacienteSelecionado.alergias.descricao}
                            </p>
                          )}
                        </div>
                        
                        {/* Indicadores de Acessibilidade */}
                        {(pacienteSelecionado.deficiencias || pacienteSelecionado.neurodivergencias || pacienteSelecionado.necessidadesEspeciais) && (
                          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl">🚨</span>
                              <h4 className="text-lg font-bold text-red-800">ATENÇÃO ESPECIAL REQUERIDA</h4>
                            </div>
                            
                            {/* Deficiências */}
                            {(pacienteSelecionado.deficiencias?.auditiva || 
                              pacienteSelecionado.deficiencias?.visual || 
                              pacienteSelecionado.deficiencias?.fisica || 
                              pacienteSelecionado.deficiencias?.intelectual ||
                              pacienteSelecionado.deficiencias?.multipla) && (
                              <div className="mb-3">
                                <h5 className="font-semibold text-red-700 mb-2">⚠️ DEFICIÊNCIAS:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {pacienteSelecionado.deficiencias?.auditiva && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-300">
                                      🔇 AUDITIVA - Necessita comunicação visual/escrita
                                    </span>
                                  )}
                                  {pacienteSelecionado.deficiencias?.visual && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-300">
                                      👁️ VISUAL - Necessita comunicação verbal clara
                                    </span>
                                  )}
                                  {pacienteSelecionado.deficiencias?.fisica && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-300">
                                      ♿ FÍSICA - Atenção para mobilidade/transferência
                                    </span>
                                  )}
                                  {pacienteSelecionado.deficiencias?.intelectual && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-300">
                                      🧠 INTELECTUAL - Comunicação simplificada
                                    </span>
                                  )}
                                  {pacienteSelecionado.deficiencias?.multipla && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-300">
                                      🔄 MÚLTIPLA - Cuidados especiais integrados
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Neurodivergências */}
                            {(pacienteSelecionado.neurodivergencias?.autismo || 
                              pacienteSelecionado.neurodivergencias?.tdah || 
                              pacienteSelecionado.neurodivergencias?.dislexia || 
                              pacienteSelecionado.neurodivergencias?.sindrome_down ||
                              pacienteSelecionado.neurodivergencias?.outras) && (
                              <div className="mb-3">
                                <h5 className="font-semibold text-purple-700 mb-2">🧠 NEURODIVERGÊNCIAS:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {pacienteSelecionado.neurodivergencias?.autismo && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                                      🧩 AUTISMO - Ambiente calmo, rotina clara
                                    </span>
                                  )}
                                  {pacienteSelecionado.neurodivergencias?.tdah && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                                      ⚡ TDAH - Atenção para concentração
                                    </span>
                                  )}
                                  {pacienteSelecionado.neurodivergencias?.dislexia && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                                      📚 DISLEXIA - Comunicação verbal preferível
                                    </span>
                                  )}
                                  {pacienteSelecionado.neurodivergencias?.sindrome_down && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                                      💙 SÍNDROME DE DOWN - Paciência e clareza
                                    </span>
                                  )}
                                  {pacienteSelecionado.neurodivergencias?.outras && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                                      ➕ OUTRAS NEURODIVERGÊNCIAS
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Necessidades Especiais */}
                            {(pacienteSelecionado.necessidadesEspeciais?.cadeirante || 
                              pacienteSelecionado.necessidadesEspeciais?.acompanhante || 
                              pacienteSelecionado.necessidadesEspeciais?.interprete_libras || 
                              pacienteSelecionado.necessidadesEspeciais?.material_braille ||
                              pacienteSelecionado.necessidadesEspeciais?.outras) && (
                              <div className="mb-3">
                                <h5 className="font-semibold text-blue-700 mb-2">🛠️ RECURSOS NECESSÁRIOS:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {pacienteSelecionado.necessidadesEspeciais?.cadeirante && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                      ♿ CADEIRANTE - Acesso facilitado
                                    </span>
                                  )}
                                  {pacienteSelecionado.necessidadesEspeciais?.acompanhante && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                      👥 NECESSITA ACOMPANHANTE
                                    </span>
                                  )}
                                  {pacienteSelecionado.necessidadesEspeciais?.interprete_libras && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                      🤟 INTÉRPRETE LIBRAS OBRIGATÓRIO
                                    </span>
                                  )}
                                  {pacienteSelecionado.necessidadesEspeciais?.material_braille && (
                                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                      ⠃ MATERIAL EM BRAILLE
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Observações Adicionais */}
                            {(pacienteSelecionado.deficiencias?.descricao || 
                              pacienteSelecionado.neurodivergencias?.descricao || 
                              pacienteSelecionado.necessidadesEspeciais?.outras) && (
                              <div className="bg-yellow-50 border border-yellow-300 p-3 rounded">
                                <h5 className="font-semibold text-yellow-800 mb-2">📝 OBSERVAÇÕES IMPORTANTES:</h5>
                                {pacienteSelecionado.deficiencias?.descricao && (
                                  <p className="text-sm text-yellow-700 mb-1">
                                    <strong>Deficiências:</strong> {pacienteSelecionado.deficiencias.descricao}
                                  </p>
                                )}
                                {pacienteSelecionado.neurodivergencias?.descricao && (
                                  <p className="text-sm text-yellow-700 mb-1">
                                    <strong>Neurodivergências:</strong> {pacienteSelecionado.neurodivergencias.descricao}
                                  </p>
                                )}
                                {pacienteSelecionado.necessidadesEspeciais?.outras && (
                                  <p className="text-sm text-yellow-700">
                                    <strong>Outras necessidades:</strong> {pacienteSelecionado.necessidadesEspeciais.outras}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seleção de Médico */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Médico Responsável</h3>
                  <FuncionarioSeletor
                    onFuncionarioSelecionado={handleMedicoSelecionado}
                    setor="CIRURGIA"
                    multiplo={false}
                  />
                  {medicoSelecionado && (
                    <div className="mt-3 p-3 bg-white rounded border border-green-200">
                      <p className="text-sm"><strong>Selecionado:</strong> {medicoSelecionado.nome}</p>
                      <p className="text-sm text-gray-600">Cargo: {medicoSelecionado.cargo}</p>
                      {medicoSelecionado.especialidade && (
                        <p className="text-sm text-gray-600">
                          Especialidade: {medicoSelecionado.especialidade}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Dados do Paciente */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados do Paciente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Internação
                      </label>
                      <input
                        type="text"
                        value={formData.numeroInternacao}
                        onChange={(e) => setFormData({ ...formData, numeroInternacao: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Paciente
                      </label>
                      <input
                        type="text"
                        value={formData.nomePaciente}
                        onChange={(e) => setFormData({ ...formData, nomePaciente: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexo
                      </label>
                      <select
                        value={formData.sexo}
                        onChange={(e) => setFormData({ ...formData, sexo: e.target.value as 'M' | 'F' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dados do Procedimento */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados do Procedimento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Procedimento Programado
                      </label>
                      <input
                        type="text"
                        value={formData.procedimentoProgramado}
                        onChange={(e) => setFormData({ ...formData, procedimentoProgramado: e.target.value })}
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
                        cargo="medico"
                        placeholder="Selecionar médico responsável"
                        className="w-full"
                        showCrmCoren={true}
                      />
                      {medicoSelecionado && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                          <strong>Selecionado:</strong> {medicoSelecionado.nome}
                          {medicoSelecionado.crm && (
                            <span className="ml-2 text-gray-600">CRM: {medicoSelecionado.crm}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Anestesia
                      </label>
                      <select
                        value={formData.tipoAnestesia}
                        onChange={(e) => setFormData({ ...formData, tipoAnestesia: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="geral">Geral</option>
                        <option value="regional">Regional</option>
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
                        value={formData.tempoJejum}
                        onChange={(e) => setFormData({ ...formData, tempoJejum: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Checklist de Segurança */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Checklist de Segurança Pré-Operatória</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(formData.checklist || {}).map(([key, value]) => {
                      const labels: { [key: string]: string } = {
                        identificacaoCorreta: 'Identificação do paciente correta',
                        sitioCircurgicoConfirmado: 'Sítio cirúrgico confirmado',
                        procedimentoConfirmado: 'Procedimento confirmado',
                        consentimentoCircurgia: 'Consentimento para cirurgia',
                        consentimentoAnestesia: 'Consentimento para anestesia',
                        alergiasMedicamentos: 'Alergias/medicamentos verificados',
                        sinaisVitaisVerificados: 'Sinais vitais verificados',
                        materialCirurgicoDisponivel: 'Material cirúrgico disponível'
                      };
                      
                      return (
                        <div key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={key}
                            checked={value as boolean}
                            onChange={(e) => setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist!,
                                [key]: e.target.checked
                              }
                            })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={key} className="text-sm text-gray-700">
                            {labels[key]}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações adicionais sobre a recepção..."
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingRecepcao ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Scanner de Código */}
      {showScanner && (
        <CodeScanner
          onPatientFound={handlePatientFoundByCode}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default RecepcaoCentroCircurgico;
