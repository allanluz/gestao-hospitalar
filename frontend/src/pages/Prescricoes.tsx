import React, { useState, useEffect } from 'react';
import { Prescricao, EstatisticasPrescricao } from '../types/prescricao';
import { prescricaoService } from '../services/prescricaoService';

const Prescricoes: React.FC = () => {
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasPrescricao | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [termoBusca, setTermoBusca] = useState('');
  const [prescricaoSelecionada, setPrescricaoSelecionada] = useState<Prescricao | null>(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [filtroStatus]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const filtros = filtroStatus ? { status: filtroStatus } : undefined;
      const [prescData, statsData] = await Promise.all([
        prescricaoService.listar(filtros),
        prescricaoService.obterEstatisticas()
      ]);
      setPrescricoes(prescData);
      setEstatisticas(statsData);
    } catch (error) {
      console.error('Erro ao carregar prescrições:', error);
    } finally {
      setLoading(false);
    }
  };

  const prescricoesFiltradas = prescricoes.filter(p => {
    const busca = termoBusca.toLowerCase();
    return (
      p.numeroPrescricao.toLowerCase().includes(busca) ||
      p.pacienteNome.toLowerCase().includes(busca) ||
      p.prescritorNome.toLowerCase().includes(busca) ||
      p.setorOrigem.toLowerCase().includes(busca)
    );
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: 'bg-yellow-100 text-yellow-800',
      parcial: 'bg-blue-100 text-blue-800',
      dispensada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      expirada: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pendente: '⏱️',
      parcial: '⚠️',
      dispensada: '✅',
      cancelada: '❌',
      expirada: '⏰'
    };
    return icons[status as keyof typeof icons] || '⏱️';
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularTempoDecorrido = (dataPrescricao: string) => {
    const diff = Date.now() - new Date(dataPrescricao).getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}min`;
  };

  const handleCancelarPrescricao = async (prescricao: Prescricao) => {
    const motivo = prompt('Digite o motivo do cancelamento:');
    if (motivo) {
      try {
        await prescricaoService.cancelar(prescricao.id, motivo);
        alert('Prescrição cancelada com sucesso!');
        carregarDados();
      } catch (error) {
        alert('Erro ao cancelar prescrição');
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📋 Prescrições Médicas
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento de prescrições de medicamentos</p>
        </div>
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-gray-900">{estatisticas.total}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-1">⏱️ Pendentes</div>
            <div className="text-2xl font-bold text-yellow-800">{estatisticas.pendentes}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="text-sm text-blue-700 mb-1">⚠️ Parciais</div>
            <div className="text-2xl font-bold text-blue-800">{estatisticas.parciais}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
            <div className="text-sm text-green-700 mb-1">✅ Dispensadas</div>
            <div className="text-2xl font-bold text-green-800">{estatisticas.dispensadas}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
            <div className="text-sm text-red-700 mb-1">❌ Canceladas</div>
            <div className="text-2xl font-bold text-red-800">{estatisticas.canceladas}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow-sm border border-orange-200">
            <div className="text-sm text-orange-700 mb-1">🚨 Urgentes</div>
            <div className="text-2xl font-bold text-orange-800">{estatisticas.urgentes}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-700 mb-1">⏰ Expiradas</div>
            <div className="text-2xl font-bold text-gray-800">{estatisticas.expiradas}</div>
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="🔍 Buscar por número, paciente, prescritor ou setor..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">📊 Todos os Status</option>
              <option value="pendente">⏱️ Pendente</option>
              <option value="parcial">⚠️ Parcial</option>
              <option value="dispensada">✅ Dispensada</option>
              <option value="cancelada">❌ Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Prescrições */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescritor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicamentos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescricoesFiltradas.map((prescricao) => {
                const temUrgente = prescricao.medicamentos.some(m => m.urgente);
                return (
                  <tr 
                    key={prescricao.id} 
                    className={`hover:bg-gray-50 transition-colors ${temUrgente ? 'bg-orange-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {prescricao.numeroPrescricao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prescricao.pacienteNome}</div>
                      <div className="text-xs text-gray-500">{prescricao.setorOrigem}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{prescricao.prescritorNome}</div>
                      <div className="text-xs text-gray-500">{prescricao.prescritorCRM}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarData(prescricao.dataHoraPrescricao)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {prescricao.medicamentos.length} medicamento(s)
                      </div>
                      {temUrgente && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full mt-1">
                          🚨 Urgente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(prescricao.status)}`}>
                        {getStatusIcon(prescricao.status)}
                        {prescricao.status.charAt(0).toUpperCase() + prescricao.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calcularTempoDecorrido(prescricao.dataHoraPrescricao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPrescricaoSelecionada(prescricao);
                            setMostrarDetalhes(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Ver detalhes"
                        >
                          👁️
                        </button>
                        {(prescricao.status === 'pendente' || prescricao.status === 'parcial') && (
                          <button
                            onClick={() => handleCancelarPrescricao(prescricao)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancelar prescrição"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {prescricoesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500">Nenhuma prescrição encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {mostrarDetalhes && prescricaoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Detalhes da Prescrição - {prescricaoSelecionada.numeroPrescricao}
              </h2>
              <button
                onClick={() => setMostrarDetalhes(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✖️
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Paciente</label>
                  <p className="mt-1 text-gray-900">{prescricaoSelecionada.pacienteNome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prescritor</label>
                  <p className="mt-1 text-gray-900">{prescricaoSelecionada.prescritorNome}</p>
                  <p className="text-sm text-gray-500">{prescricaoSelecionada.prescritorCRM}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Data/Hora</label>
                  <p className="mt-1 text-gray-900">{formatarData(prescricaoSelecionada.dataHoraPrescricao)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Setor</label>
                  <p className="mt-1 text-gray-900">{prescricaoSelecionada.setorOrigem}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Validade</label>
                  <p className="mt-1 text-gray-900">{prescricaoSelecionada.validadeHoras} horas</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(prescricaoSelecionada.status)}`}>
                      {getStatusIcon(prescricaoSelecionada.status)}
                      {prescricaoSelecionada.status.charAt(0).toUpperCase() + prescricaoSelecionada.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Observações */}
              {prescricaoSelecionada.observacoes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Observações</label>
                  <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {prescricaoSelecionada.observacoes}
                  </p>
                </div>
              )}

              {/* Medicamentos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">💊 Medicamentos Prescritos</h3>
                <div className="space-y-3">
                  {prescricaoSelecionada.medicamentos.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{med.medicamentoNome}</h4>
                          {med.urgente && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full mt-1">
                              🚨 Urgente
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(med.statusItem)}`}>
                          {med.statusItem.charAt(0).toUpperCase() + med.statusItem.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Dose:</span>
                          <span className="ml-2 font-medium text-gray-900">{med.dose}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Via:</span>
                          <span className="ml-2 font-medium text-gray-900 capitalize">{med.via}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Frequência:</span>
                          <span className="ml-2 font-medium text-gray-900">{med.frequencia}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duração:</span>
                          <span className="ml-2 font-medium text-gray-900">{med.duracao}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Quantidade:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {med.quantidadeDispensada} / {med.quantidadeTotal}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${(med.quantidadeDispensada / med.quantidadeTotal) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      {med.observacoes && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          {med.observacoes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações de Cancelamento */}
              {prescricaoSelecionada.status === 'cancelada' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Motivo do Cancelamento</h4>
                  <p className="text-red-800">{prescricaoSelecionada.motivoCancelamento}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Cancelada em: {formatarData(prescricaoSelecionada.dataCancelamento!)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescricoes;
