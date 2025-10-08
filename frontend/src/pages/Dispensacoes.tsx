import React, { useState, useEffect } from 'react';
import {
  Dispensacao,
  StatusDispensacao,
  EstatisticasDispensacao,
  DispensarMedicamentoDTO,
  ConfirmarAdministracaoDTO,
  CancelarDispensacaoDTO
} from '../types/dispensacao';
import * as dispensacaoService from '../services/dispensacaoService';
import { ValidacaoEscaneamento } from '../services/dispensacaoService';

const Dispensacoes: React.FC = () => {
  const [dispensacoes, setDispensacoes] = useState<Dispensacao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasDispensacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string>('');
  
  // Filtros
  const [filtroStatus, setFiltroStatus] = useState<StatusDispensacao | ''>('');
  const [filtroBusca, setFiltroBusca] = useState('');
  const [mostrarPendentes, setMostrarPendentes] = useState(false);
  
  // Modais
  const [modalDetalhes, setModalDetalhes] = useState<Dispensacao | null>(null);
  const [modalNovaDispensacao, setModalNovaDispensacao] = useState(false);
  const [modalEscaneamento, setModalEscaneamento] = useState(false);
  const [modalAdministrar, setModalAdministrar] = useState<Dispensacao | null>(null);
  const [modalCancelar, setModalCancelar] = useState<Dispensacao | null>(null);
  
  // Estados do escaneamento
  const [codigoPaciente, setCodigoPaciente] = useState('');
  const [codigoMedicamento, setCodigoMedicamento] = useState('');
  const [validacao, setValidacao] = useState<ValidacaoEscaneamento | null>(null);
  const [validando, setValidando] = useState(false);
  const [etapaEscaneamento, setEtapaEscaneamento] = useState<'paciente' | 'medicamento' | 'validado'>('paciente');
  
  // Formulário nova dispensação
  const [formDispensacao, setFormDispensacao] = useState<DispensarMedicamentoDTO>({
    prescricaoId: '',
    medicamentoId: '',
    medicamentoNome: '',
    quantidade: 0,
    pacienteId: '',
    pacienteNome: '',
    farmaceutico: '',
    lote: '',
    validade: '',
    observacao: ''
  });

  useEffect(() => {
    carregarDados();
  }, [filtroStatus, mostrarPendentes]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      let disps;
      if (mostrarPendentes) {
        disps = await dispensacaoService.listarPendentes();
      } else if (filtroStatus) {
        disps = await dispensacaoService.listar({ status: filtroStatus });
      } else {
        disps = await dispensacaoService.listar();
      }
      
      const stats = await dispensacaoService.obterEstatisticas();
      
      setDispensacoes(disps);
      setEstatisticas(stats);
      setErro('');
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const dispensacoesFiltradas = dispensacoes.filter(d =>
    d.medicamentoNome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    d.pacienteNome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    d.id.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    d.farmaceutico.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const obterCorStatus = (status: StatusDispensacao): string => {
    const cores = {
      dispensada: 'bg-yellow-100 text-yellow-800',
      administrada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800'
    };
    return cores[status];
  };

  const obterTextoStatus = (status: StatusDispensacao): string => {
    const textos = {
      dispensada: 'Aguardando Administração',
      administrada: 'Administrada',
      cancelada: 'Cancelada'
    };
    return textos[status];
  };

  const obterCorAtraso = (atraso?: number): string => {
    if (!atraso) return '';
    if (atraso <= 15) return 'text-green-600';
    if (atraso <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDispensar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispensacaoService.dispensar(formDispensacao);
      setModalNovaDispensacao(false);
      setFormDispensacao({
        prescricaoId: '',
        medicamentoId: '',
        medicamentoNome: '',
        quantidade: 0,
        pacienteId: '',
        pacienteNome: '',
        farmaceutico: '',
        lote: '',
        validade: '',
        observacao: ''
      });
      carregarDados();
      alert('✅ Medicamento dispensado com sucesso! Aguardando 2ª verificação (enfermeiro).');
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    }
  };

  const handleAdministrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalAdministrar) return;

    const formData = new FormData(e.currentTarget);
    const dados: ConfirmarAdministracaoDTO = {
      enfermeiro: formData.get('enfermeiro') as string,
      horarioPrescrito: formData.get('horarioPrescrito') as string || undefined,
      observacao: formData.get('observacao') as string || undefined
    };

    try {
      await dispensacaoService.administrar(modalAdministrar.id, dados);
      setModalAdministrar(null);
      carregarDados();
      alert('✅ Administração confirmada! Medicamento administrado ao paciente.');
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    }
  };

  const handleCancelar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalCancelar) return;

    const formData = new FormData(e.currentTarget);
    const dados: CancelarDispensacaoDTO = {
      canceladoPor: formData.get('canceladoPor') as string,
      motivo: formData.get('motivo') as string
    };

    try {
      await dispensacaoService.cancelar(modalCancelar.id, dados);
      setModalCancelar(null);
      carregarDados();
      alert('❌ Dispensação cancelada!');
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    }
  };

  // Funções de escaneamento
  const abrirModalEscaneamento = () => {
    setModalEscaneamento(true);
    setCodigoPaciente('');
    setCodigoMedicamento('');
    setValidacao(null);
    setEtapaEscaneamento('paciente');
  };

  const handleEscanearPaciente = (codigo: string) => {
    setCodigoPaciente(codigo);
    if (codigo.trim()) {
      setEtapaEscaneamento('medicamento');
    }
  };

  const handleEscanearMedicamento = async (codigo: string) => {
    setCodigoMedicamento(codigo);
    if (codigo.trim() && codigoPaciente.trim()) {
      await validarCodigos();
    }
  };

  const validarCodigos = async () => {
    if (!codigoPaciente.trim() || !codigoMedicamento.trim()) {
      return;
    }

    setValidando(true);
    try {
      const resultado = await dispensacaoService.validarEscaneamento(
        codigoPaciente.trim(),
        codigoMedicamento.trim()
      );
      
      setValidacao(resultado);
      
      if (resultado.valido && resultado.dados) {
        setEtapaEscaneamento('validado');
        // Preencher formulário automaticamente
        setFormDispensacao({
          prescricaoId: resultado.dados.prescricaoId,
          medicamentoId: resultado.dados.medicamentoId,
          medicamentoNome: resultado.dados.medicamentoNome,
          quantidade: resultado.dados.quantidade,
          pacienteId: resultado.dados.pacienteId,
          pacienteNome: resultado.dados.pacienteNome,
          farmaceutico: '',
          lote: resultado.dados.lote || '',
          validade: resultado.dados.validade || '',
          observacao: `Prescritor: ${resultado.dados.prescritor}. ${resultado.dados.posologia || ''}`
        });
      }
    } catch (error: any) {
      setValidacao({
        valido: false,
        erro: error.message || 'Erro ao validar códigos'
      });
    } finally {
      setValidando(false);
    }
  };

  const confirmarDispensacaoEscaneada = async (farmaceutico: string) => {
    if (!validacao?.valido || !validacao.dados) return;

    try {
      const dados: DispensarMedicamentoDTO = {
        ...formDispensacao,
        farmaceutico
      };
      
      await dispensacaoService.dispensar(dados);
      setModalEscaneamento(false);
      setModalNovaDispensacao(false);
      carregarDados();
      alert('✅ Medicamento dispensado com sucesso! Aguardando 2ª verificação (enfermeiro).');
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    }
  };

  const resetarEscaneamento = () => {
    setCodigoPaciente('');
    setCodigoMedicamento('');
    setValidacao(null);
    setEtapaEscaneamento('paciente');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">💊 Dispensação de Medicamentos</h1>
        <p className="text-gray-600 mt-2">Sistema de Dupla Verificação - Farmacêutico + Enfermeiro</p>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {erro}
        </div>
      )}

      {/* Dashboard de Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Dispensações</div>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.totalDispensacoes}</div>
            <div className="text-xs text-gray-500 mt-1">Histórico completo</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">⏱️ Pendentes</div>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentesAdministracao}</div>
            <div className="text-xs text-gray-500 mt-1">Aguardando enfermagem</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">✅ Administradas</div>
            <div className="text-2xl font-bold text-green-600">{estatisticas.administradas}</div>
            <div className="text-xs text-gray-500 mt-1">Taxa: {estatisticas.taxaAdministracao}%</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">❌ Canceladas</div>
            <div className="text-2xl font-bold text-red-600">{estatisticas.canceladas}</div>
            <div className="text-xs text-gray-500 mt-1">Não administradas</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">📊 Hoje</div>
            <div className="text-2xl font-bold text-indigo-600">{estatisticas.dispensacoesHoje}</div>
            <div className="text-xs text-gray-500 mt-1">Dispensações</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">✅ Admin. Hoje</div>
            <div className="text-2xl font-bold text-teal-600">{estatisticas.administradasHoje}</div>
            <div className="text-xs text-gray-500 mt-1">Administradas</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">⚠️ Com Atraso</div>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.comAtraso}</div>
            <div className="text-xs text-gray-500 mt-1">&gt; 15 minutos</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">💊 Estoque</div>
            <div className="text-2xl font-bold text-purple-600">{estatisticas.estoqueFarmacia.totalItens}</div>
            <div className="text-xs text-gray-500 mt-1">{estatisticas.estoqueFarmacia.tiposMedicamentos} tipos</div>
          </div>
        </div>
      )}

      {/* Top Medicamentos */}
      {estatisticas && estatisticas.topMedicamentos.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">🏆 Top 5 Medicamentos Dispensados</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {estatisticas.topMedicamentos.map((med, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-500">#{idx + 1}</span>
                <div>
                  <div className="font-medium text-sm">{med.nome}</div>
                  <div className="text-xs text-gray-500">{med.quantidade} unidades</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Buscar por medicamento, paciente, ID ou farmacêutico..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filtroStatus}
            onChange={(e) => {
              setFiltroStatus(e.target.value as StatusDispensacao | '');
              setMostrarPendentes(false);
            }}
          >
            <option value="">Todos os Status</option>
            <option value="dispensada">Aguardando Administração</option>
            <option value="administrada">Administrada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <button
            onClick={() => {
              setMostrarPendentes(!mostrarPendentes);
              setFiltroStatus('');
            }}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              mostrarPendentes 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            ⏱️ Pendentes ({estatisticas?.pendentesAdministracao || 0})
          </button>

          <button
            onClick={() => setModalNovaDispensacao(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ➕ Nova Dispensação
          </button>

          <button
            onClick={abrirModalEscaneamento}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            📷 Escanear Códigos
          </button>
        </div>
      </div>

      {/* Tabela de Dispensações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmacêutico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Disp.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dispensacoesFiltradas.map((disp) => (
                <tr key={disp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{disp.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{disp.medicamentoNome}</div>
                    {disp.lote && <div className="text-xs text-gray-500">Lote: {disp.lote}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{disp.pacienteNome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{disp.quantidade} un.</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{disp.farmaceutico}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(disp.dataDispensacao).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${obterCorStatus(disp.status)}`}>
                      {obterTextoStatus(disp.status)}
                    </span>
                    {disp.atrasoMinutos && disp.atrasoMinutos > 15 && (
                      <div className={`text-xs mt-1 font-medium ${obterCorAtraso(disp.atrasoMinutos)}`}>
                        ⚠️ +{disp.atrasoMinutos}min
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setModalDetalhes(disp)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      👁️ Ver
                    </button>
                    {disp.status === 'dispensada' && (
                      <>
                        <button
                          onClick={() => setModalAdministrar(disp)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          ✅ Administrar
                        </button>
                        <button
                          onClick={() => setModalCancelar(disp)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ❌ Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dispensacoesFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma dispensação encontrada
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Dispensação */}
      {modalNovaDispensacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">💊 Nova Dispensação (1ª Verificação)</h2>
            <form onSubmit={handleDispensar}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID da Prescrição *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.prescricaoId}
                    onChange={(e) => setFormDispensacao({...formDispensacao, prescricaoId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID do Medicamento *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.medicamentoId}
                    onChange={(e) => setFormDispensacao({...formDispensacao, medicamentoId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Medicamento *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.medicamentoNome}
                    onChange={(e) => setFormDispensacao({...formDispensacao, medicamentoNome: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.quantidade || ''}
                    onChange={(e) => setFormDispensacao({...formDispensacao, quantidade: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID do Paciente *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.pacienteId}
                    onChange={(e) => setFormDispensacao({...formDispensacao, pacienteId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.pacienteNome}
                    onChange={(e) => setFormDispensacao({...formDispensacao, pacienteNome: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farmacêutico Responsável *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.farmaceutico}
                    onChange={(e) => setFormDispensacao({...formDispensacao, farmaceutico: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.lote}
                    onChange={(e) => setFormDispensacao({...formDispensacao, lote: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.validade}
                    onChange={(e) => setFormDispensacao({...formDispensacao, validade: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formDispensacao.observacao}
                    onChange={(e) => setFormDispensacao({...formDispensacao, observacao: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalNovaDispensacao(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  💊 Dispensar (1ª Verificação)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      {modalDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Detalhes da Dispensação</h2>
              <button onClick={() => setModalDetalhes(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">ID:</span>
                  <p className="font-medium">{modalDetalhes.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <p><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${obterCorStatus(modalDetalhes.status)}`}>
                    {obterTextoStatus(modalDetalhes.status)}
                  </span></p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Medicamento:</span>
                  <p className="font-medium">{modalDetalhes.medicamentoNome}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Quantidade:</span>
                  <p className="font-medium">{modalDetalhes.quantidade} un.</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Paciente:</span>
                  <p className="font-medium">{modalDetalhes.pacienteNome}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Prescrição:</span>
                  <p className="font-medium">{modalDetalhes.prescricaoId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Lote:</span>
                  <p className="font-medium">{modalDetalhes.lote || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Validade:</span>
                  <p className="font-medium">{modalDetalhes.validade ? new Date(modalDetalhes.validade).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">1ª Verificação - Farmacêutico</h3>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-medium text-blue-900">{modalDetalhes.farmaceutico}</p>
                  <p className="text-xs text-blue-600">{new Date(modalDetalhes.dataDispensacao).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {modalDetalhes.enfermeiro && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">2ª Verificação - Enfermeiro</h3>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm font-medium text-green-900">{modalDetalhes.enfermeiro}</p>
                    {modalDetalhes.dataAdministracao && <p className="text-xs text-green-600">{new Date(modalDetalhes.dataAdministracao).toLocaleString('pt-BR')}</p>}
                    {modalDetalhes.atrasoMinutos && (
                      <p className={`text-sm mt-1 font-medium ${obterCorAtraso(modalDetalhes.atrasoMinutos)}`}>
                        {modalDetalhes.atrasoMinutos <= 15 ? '✅' : '⚠️'} Atraso: {modalDetalhes.atrasoMinutos} minutos
                      </p>
                    )}
                  </div>
                </div>
              )}

              {modalDetalhes.canceladoPor && (
                <div className="bg-red-50 p-3 rounded">
                  <span className="text-sm text-red-700 font-medium">Cancelado por:</span>
                  <p className="font-medium text-red-900">{modalDetalhes.canceladoPor}</p>
                  {modalDetalhes.dataCancelamento && <p className="text-sm text-red-600">{new Date(modalDetalhes.dataCancelamento).toLocaleString('pt-BR')}</p>}
                  <p className="mt-2 text-red-800">{modalDetalhes.motivoCancelamento}</p>
                </div>
              )}

              {modalDetalhes.observacoes.length > 0 && (
                <div className="border-t pt-4">
                  <span className="text-sm text-gray-600 font-medium">Histórico:</span>
                  <div className="mt-2 space-y-2">
                    {modalDetalhes.observacoes.map((obs, idx) => (
                      <div key={idx} className={`p-3 rounded ${
                        obs.tipo === 'dispensacao' ? 'bg-blue-50' :
                        obs.tipo === 'administracao' ? 'bg-green-50' :
                        'bg-red-50'
                      }`}>
                        <p className="text-sm font-medium text-gray-700">{obs.usuario}</p>
                        <p className="text-xs text-gray-500">{new Date(obs.data).toLocaleString('pt-BR')}</p>
                        <p className="text-sm mt-1">{obs.texto}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalDetalhes(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Administrar */}
      {modalAdministrar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">✅ Confirmar Administração (2ª Verificação)</h2>
            <div className="bg-yellow-50 p-3 rounded mb-4">
              <p className="text-sm"><strong>Medicamento:</strong> {modalAdministrar.medicamentoNome}</p>
              <p className="text-sm"><strong>Paciente:</strong> {modalAdministrar.pacienteNome}</p>
              <p className="text-sm"><strong>Quantidade:</strong> {modalAdministrar.quantidade} un.</p>
            </div>
            
            <form onSubmit={handleAdministrar}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enfermeiro Responsável *</label>
                  <input
                    type="text"
                    name="enfermeiro"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário Prescrito</label>
                  <input
                    type="datetime-local"
                    name="horarioPrescrito"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <textarea
                    name="observacao"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalAdministrar(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ✅ Confirmar Administração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cancelar */}
      {modalCancelar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">❌ Cancelar Dispensação</h2>
            
            <form onSubmit={handleCancelar}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável pelo Cancelamento *</label>
                  <input
                    type="text"
                    name="canceladoPor"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo do Cancelamento *</label>
                  <textarea
                    name="motivo"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalCancelar(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  ❌ Confirmar Cancelamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Escaneamento de Códigos */}
      {modalEscaneamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">📷 Dispensação por Escaneamento</h2>
              <button 
                onClick={() => setModalEscaneamento(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Indicador de Etapas */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  etapaEscaneamento === 'paciente' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {etapaEscaneamento === 'paciente' ? '1' : '✓'}
                </div>
                <span className="font-medium">Paciente</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4">
                <div className={`h-full transition-all ${
                  etapaEscaneamento !== 'paciente' ? 'bg-green-600 w-full' : 'bg-blue-600 w-0'
                }`}></div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  etapaEscaneamento === 'paciente' ? 'bg-gray-300 text-gray-600' :
                  etapaEscaneamento === 'medicamento' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {etapaEscaneamento === 'validado' ? '✓' : '2'}
                </div>
                <span className="font-medium">Medicamento</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4">
                <div className={`h-full transition-all ${
                  etapaEscaneamento === 'validado' ? 'bg-green-600 w-full' : 'bg-blue-600 w-0'
                }`}></div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  etapaEscaneamento === 'validado' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className="font-medium">Confirmar</span>
              </div>
            </div>

            {/* Etapa 1: Escanear Paciente */}
            {etapaEscaneamento === 'paciente' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-medium text-blue-900">📋 Etapa 1: Escanear pulseira do paciente</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Escaneie o QR Code ou código de barras da pulseira do paciente
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código do Paciente *
                    </label>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Escaneie ou digite o código do paciente..."
                      className="w-full px-4 py-3 text-lg border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={codigoPaciente}
                      onChange={(e) => setCodigoPaciente(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && codigoPaciente.trim()) {
                          handleEscanearPaciente(codigoPaciente);
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleEscanearPaciente(codigoPaciente)}
                    disabled={!codigoPaciente.trim()}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Próximo →
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    💡 <strong>Dica:</strong> Posicione o leitor sobre o código QR ou código de barras. 
                    O sistema detectará automaticamente o código.
                  </p>
                </div>
              </div>
            )}

            {/* Etapa 2: Escanear Medicamento */}
            {etapaEscaneamento === 'medicamento' && (
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="font-medium text-green-900">✅ Paciente identificado</p>
                  <p className="text-sm text-green-700 mt-1">
                    Código do paciente: <strong>{codigoPaciente}</strong>
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-medium text-blue-900">💊 Etapa 2: Escanear medicamento</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Escaneie o QR Code ou código de barras da embalagem do medicamento
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código do Medicamento *
                    </label>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Escaneie ou digite o código do medicamento..."
                      className="w-full px-4 py-3 text-lg border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={codigoMedicamento}
                      onChange={(e) => setCodigoMedicamento(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && codigoMedicamento.trim()) {
                          handleEscanearMedicamento(codigoMedicamento);
                        }
                      }}
                      disabled={validando}
                    />
                  </div>
                  <button
                    onClick={() => handleEscanearMedicamento(codigoMedicamento)}
                    disabled={!codigoMedicamento.trim() || validando}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {validando ? 'Validando...' : 'Validar'}
                  </button>
                </div>

                <button
                  onClick={resetarEscaneamento}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Voltar para escanear outro paciente
                </button>

                {/* Exibir erro de validação */}
                {validacao && !validacao.valido && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⛔</span>
                      <div className="flex-1">
                        <p className="font-medium text-red-900">{validacao.erro}</p>
                        {validacao.tipo === 'medicamento_nao_prescrito' && validacao.detalhe && (
                          <div className="mt-2 text-sm text-red-700">
                            <p>Paciente: <strong>{validacao.detalhe.pacienteNome}</strong></p>
                            <p>Prescrições abertas: {validacao.detalhe.prescricoesAbertas}</p>
                            <p className="mt-1">
                              ⚠️ Este medicamento não foi prescrito para este paciente ou já foi dispensado.
                            </p>
                          </div>
                        )}
                        {validacao.tipo === 'estoque_insuficiente' && validacao.detalhe && (
                          <div className="mt-2 text-sm text-red-700">
                            <p>Disponível: {validacao.detalhe.disponivel} unidades</p>
                            <p>Necessário: {validacao.detalhe.necessario} unidades</p>
                          </div>
                        )}
                        <button
                          onClick={resetarEscaneamento}
                          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          ⟲ Tentar Novamente
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Etapa 3: Validação Bem-Sucedida */}
            {etapaEscaneamento === 'validado' && validacao?.valido && validacao.dados && (
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✅</span>
                    <div>
                      <p className="font-bold text-green-900 text-lg">{validacao.mensagem}</p>
                      <p className="text-sm text-green-700 mt-1">
                        Prescrição válida encontrada. Confira os dados abaixo antes de confirmar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dados da Prescrição */}
                <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3">📋 Dados da Prescrição</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ID Prescrição:</span>
                      <p className="font-mono font-medium">{validacao.dados.prescricaoId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Data:</span>
                      <p className="font-medium">
                        {new Date(validacao.dados.prescricaoData).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">Prescritor:</span>
                      <p className="font-medium">{validacao.dados.prescritor}</p>
                    </div>
                  </div>
                </div>

                {/* Dados do Paciente */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3">👤 Paciente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ID:</span>
                      <p className="font-mono font-medium">{validacao.dados.pacienteId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Nome:</span>
                      <p className="font-medium">{validacao.dados.pacienteNome}</p>
                    </div>
                  </div>
                </div>

                {/* Dados do Medicamento */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3">💊 Medicamento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ID:</span>
                      <p className="font-mono font-medium">{validacao.dados.medicamentoId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Nome:</span>
                      <p className="font-medium">{validacao.dados.medicamentoNome}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Quantidade:</span>
                      <p className="font-medium text-lg text-purple-700">
                        {validacao.dados.quantidade} unidade(s)
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Estoque Disponível:</span>
                      <p className="font-medium text-lg text-green-700">
                        {validacao.dados.estoqueDisponivel} unidade(s)
                      </p>
                    </div>
                    {validacao.dados.lote && (
                      <div>
                        <span className="text-sm text-gray-600">Lote:</span>
                        <p className="font-medium">{validacao.dados.lote}</p>
                      </div>
                    )}
                    {validacao.dados.validade && (
                      <div>
                        <span className="text-sm text-gray-600">Validade:</span>
                        <p className="font-medium">
                          {new Date(validacao.dados.validade).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                  {validacao.dados.posologia && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <span className="text-sm text-gray-600">Posologia:</span>
                      <p className="font-medium">{validacao.dados.posologia}</p>
                      {validacao.dados.via && (
                        <p className="text-sm text-gray-700 mt-1">
                          Via: {validacao.dados.via} {validacao.dados.frequencia && `| ${validacao.dados.frequencia}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Formulário de Confirmação */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const farmaceutico = (e.currentTarget.elements.namedItem('farmaceutico') as HTMLInputElement).value;
                  confirmarDispensacaoEscaneada(farmaceutico);
                }}>
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Farmacêutico Responsável *
                    </label>
                    <input
                      type="text"
                      name="farmaceutico"
                      required
                      autoFocus
                      placeholder="Digite seu nome completo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-between gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetarEscaneamento}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ← Cancelar e Reiniciar
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
                    >
                      ✅ Confirmar Dispensação
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Rodapé com informações */}
            {etapaEscaneamento !== 'validado' && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Sistema de Dupla Verificação | A dispensação será confirmada após 2ª verificação do enfermeiro
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispensacoes;
