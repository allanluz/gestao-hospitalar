import React, { useState, useEffect } from 'react';
import {
  Movimentacao,
  StatusMovimentacao,
  EstatisticasMovimentacao,
  CriarRequisicaoDTO,
  AprovarRequisicaoDTO,
  IniciarTransferenciaDTO,
  ConfirmarRecebimentoDTO,
  RejeitarRequisicaoDTO
} from '../types/movimentacao';
import * as movimentacaoService from '../services/movimentacaoService';

const Movimentacoes: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasMovimentacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string>('');
  
  // Filtros
  const [filtroStatus, setFiltroStatus] = useState<StatusMovimentacao | ''>('');
  const [filtroBusca, setFiltroBusca] = useState('');
  
  // Modais
  const [modalDetalhes, setModalDetalhes] = useState<Movimentacao | null>(null);
  const [modalNovaRequisicao, setModalNovaRequisicao] = useState(false);
  const [modalAcao, setModalAcao] = useState<{tipo: 'aprovar' | 'transferir' | 'receber' | 'rejeitar', movimentacao: Movimentacao} | null>(null);
  
  // Formulário nova requisição
  const [formRequisicao, setFormRequisicao] = useState<CriarRequisicaoDTO>({
    medicamentoId: '',
    medicamentoNome: '',
    quantidade: 0,
    justificativa: '',
    solicitante: ''
  });

  useEffect(() => {
    carregarDados();
  }, [filtroStatus]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [movs, stats] = await Promise.all([
        movimentacaoService.listar(filtroStatus ? { status: filtroStatus } : {}),
        movimentacaoService.obterEstatisticas()
      ]);
      setMovimentacoes(movs);
      setEstatisticas(stats);
      setErro('');
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const movimentacoesFiltradas = movimentacoes.filter(m =>
    m.medicamentoNome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    m.id.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    m.solicitante.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const obterCorStatus = (status: StatusMovimentacao): string => {
    const cores = {
      pendente: 'bg-yellow-100 text-yellow-800',
      aprovada: 'bg-blue-100 text-blue-800',
      em_transito: 'bg-purple-100 text-purple-800',
      recebida: 'bg-green-100 text-green-800',
      rejeitada: 'bg-red-100 text-red-800'
    };
    return cores[status];
  };

  const obterTextoStatus = (status: StatusMovimentacao): string => {
    const textos = {
      pendente: 'Pendente',
      aprovada: 'Aprovada',
      em_transito: 'Em Trânsito',
      recebida: 'Recebida',
      rejeitada: 'Rejeitada'
    };
    return textos[status];
  };

  const handleCriarRequisicao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await movimentacaoService.criarRequisicao(formRequisicao);
      setModalNovaRequisicao(false);
      setFormRequisicao({
        medicamentoId: '',
        medicamentoNome: '',
        quantidade: 0,
        justificativa: '',
        solicitante: ''
      });
      carregarDados();
      alert('Requisição criada com sucesso!');
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleAprovar = async (dados: AprovarRequisicaoDTO) => {
    if (!modalAcao) return;
    try {
      await movimentacaoService.aprovar(modalAcao.movimentacao.id, dados);
      setModalAcao(null);
      carregarDados();
      alert('Requisição aprovada com sucesso!');
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleTransferir = async (dados: IniciarTransferenciaDTO) => {
    if (!modalAcao) return;
    try {
      await movimentacaoService.transferir(modalAcao.movimentacao.id, dados);
      setModalAcao(null);
      carregarDados();
      alert('Transferência iniciada com sucesso!');
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleReceber = async (dados: ConfirmarRecebimentoDTO) => {
    if (!modalAcao) return;
    try {
      await movimentacaoService.receber(modalAcao.movimentacao.id, dados);
      setModalAcao(null);
      carregarDados();
      alert('Recebimento confirmado com sucesso!');
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleRejeitar = async (dados: RejeitarRequisicaoDTO) => {
    if (!modalAcao) return;
    try {
      await movimentacaoService.rejeitar(modalAcao.movimentacao.id, dados);
      setModalAcao(null);
      carregarDados();
      alert('Requisição rejeitada!');
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
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
        <h1 className="text-3xl font-bold text-gray-800">📦 Movimentação de Medicamentos</h1>
        <p className="text-gray-600 mt-2">Gestão de transferências entre Estoque Central e Farmácia</p>
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
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.totalMovimentacoes}</div>
            <div className="text-xs text-gray-500 mt-1">Movimentações</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">⏱️ Pendentes</div>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</div>
            <div className="text-xs text-gray-500 mt-1">Aguardando aprovação</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">🚚 Em Trânsito</div>
            <div className="text-2xl font-bold text-purple-600">{estatisticas.emTransito}</div>
            <div className="text-xs text-gray-500 mt-1">Aguardando recebimento</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">✅ Recebidas</div>
            <div className="text-2xl font-bold text-green-600">{estatisticas.recebidas}</div>
            <div className="text-xs text-gray-500 mt-1">Finalizadas</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">❌ Rejeitadas</div>
            <div className="text-2xl font-bold text-red-600">{estatisticas.rejeitadas}</div>
            <div className="text-xs text-gray-500 mt-1">Não aprovadas</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">⚠️ Divergências</div>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.comDivergencia}</div>
            <div className="text-xs text-gray-500 mt-1">Conferir</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">💊 Estoque Farmácia</div>
            <div className="text-2xl font-bold text-indigo-600">{estatisticas.totalItensEstoqueFarmacia}</div>
            <div className="text-xs text-gray-500 mt-1">Unidades totais</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">📋 Tipos Medicamento</div>
            <div className="text-2xl font-bold text-teal-600">{estatisticas.tiposEstoqueFarmacia}</div>
            <div className="text-xs text-gray-500 mt-1">Na farmácia</div>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Buscar por medicamento, ID ou solicitante..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as StatusMovimentacao | '')}
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="aprovada">Aprovada</option>
            <option value="em_transito">Em Trânsito</option>
            <option value="recebida">Recebida</option>
            <option value="rejeitada">Rejeitada</option>
          </select>

          <button
            onClick={() => setModalNovaRequisicao(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ➕ Nova Requisição
          </button>
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimentacoesFiltradas.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{mov.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{mov.medicamentoNome}</div>
                    {mov.lote && <div className="text-xs text-gray-500">Lote: {mov.lote}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mov.quantidade} un.
                    {mov.divergencia && <span className="ml-2 text-orange-600">⚠️</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{mov.solicitante}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(mov.dataSolicitacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${obterCorStatus(mov.status)}`}>
                      {obterTextoStatus(mov.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setModalDetalhes(mov)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      👁️ Ver
                    </button>
                    {mov.status === 'pendente' && (
                      <>
                        <button
                          onClick={() => setModalAcao({tipo: 'aprovar', movimentacao: mov})}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          ✅ Aprovar
                        </button>
                        <button
                          onClick={() => setModalAcao({tipo: 'rejeitar', movimentacao: mov})}
                          className="text-red-600 hover:text-red-900"
                        >
                          ❌ Rejeitar
                        </button>
                      </>
                    )}
                    {mov.status === 'aprovada' && (
                      <button
                        onClick={() => setModalAcao({tipo: 'transferir', movimentacao: mov})}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        🚚 Transferir
                      </button>
                    )}
                    {mov.status === 'em_transito' && (
                      <button
                        onClick={() => setModalAcao({tipo: 'receber', movimentacao: mov})}
                        className="text-green-600 hover:text-green-900"
                      >
                        📥 Receber
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {movimentacoesFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma movimentação encontrada
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Requisição */}
      {modalNovaRequisicao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Nova Requisição</h2>
            <form onSubmit={handleCriarRequisicao}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID do Medicamento</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formRequisicao.medicamentoId}
                    onChange={(e) => setFormRequisicao({...formRequisicao, medicamentoId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Medicamento</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formRequisicao.medicamentoNome}
                    onChange={(e) => setFormRequisicao({...formRequisicao, medicamentoNome: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formRequisicao.quantidade || ''}
                    onChange={(e) => setFormRequisicao({...formRequisicao, quantidade: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Justificativa</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formRequisicao.justificativa}
                    onChange={(e) => setFormRequisicao({...formRequisicao, justificativa: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Solicitante</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formRequisicao.solicitante}
                    onChange={(e) => setFormRequisicao({...formRequisicao, solicitante: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalNovaRequisicao(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Criar Requisição
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
              <h2 className="text-2xl font-bold">Detalhes da Movimentação</h2>
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
                  <span className="text-sm text-gray-600">Lote:</span>
                  <p className="font-medium">{modalDetalhes.lote || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Validade:</span>
                  <p className="font-medium">{modalDetalhes.validade ? new Date(modalDetalhes.validade).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Justificativa:</span>
                <p className="mt-1">{modalDetalhes.justificativa}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Solicitante:</span>
                <p className="font-medium">{modalDetalhes.solicitante}</p>
                <p className="text-sm text-gray-500">{new Date(modalDetalhes.dataSolicitacao).toLocaleString('pt-BR')}</p>
              </div>

              {modalDetalhes.aprovadoPor && (
                <div>
                  <span className="text-sm text-gray-600">Aprovado por:</span>
                  <p className="font-medium">{modalDetalhes.aprovadoPor}</p>
                  {modalDetalhes.dataAprovacao && <p className="text-sm text-gray-500">{new Date(modalDetalhes.dataAprovacao).toLocaleString('pt-BR')}</p>}
                </div>
              )}

              {modalDetalhes.rejeitadoPor && (
                <div className="bg-red-50 p-3 rounded">
                  <span className="text-sm text-red-700 font-medium">Rejeitado por:</span>
                  <p className="font-medium text-red-900">{modalDetalhes.rejeitadoPor}</p>
                  {modalDetalhes.dataRejeicao && <p className="text-sm text-red-600">{new Date(modalDetalhes.dataRejeicao).toLocaleString('pt-BR')}</p>}
                  <p className="mt-2 text-red-800">{modalDetalhes.motivoRejeicao}</p>
                </div>
              )}

              {modalDetalhes.divergencia && (
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-orange-800 font-medium">⚠️ Divergência Detectada</p>
                  <p className="text-sm text-orange-700">Quantidade esperada: {modalDetalhes.quantidade} | Recebida: {modalDetalhes.quantidadeRecebida}</p>
                </div>
              )}

              {modalDetalhes.observacoes.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 font-medium">Histórico:</span>
                  <div className="mt-2 space-y-2">
                    {modalDetalhes.observacoes.map((obs, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
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

      {/* Modal de Ações (simplificado - use formulários reais em produção) */}
      {modalAcao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {modalAcao.tipo === 'aprovar' && '✅ Aprovar Requisição'}
              {modalAcao.tipo === 'transferir' && '🚚 Iniciar Transferência'}
              {modalAcao.tipo === 'receber' && '📥 Confirmar Recebimento'}
              {modalAcao.tipo === 'rejeitar' && '❌ Rejeitar Requisição'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              if (modalAcao.tipo === 'aprovar') {
                handleAprovar({
                  aprovadoPor: formData.get('usuario') as string,
                  observacao: formData.get('observacao') as string
                });
              } else if (modalAcao.tipo === 'transferir') {
                handleTransferir({
                  responsavelExpedicao: formData.get('usuario') as string,
                  lote: formData.get('lote') as string,
                  validade: formData.get('validade') as string
                });
              } else if (modalAcao.tipo === 'receber') {
                handleReceber({
                  recebidoPor: formData.get('usuario') as string,
                  quantidadeRecebida: Number(formData.get('quantidade')) || undefined,
                  observacao: formData.get('observacao') as string
                });
              } else if (modalAcao.tipo === 'rejeitar') {
                handleRejeitar({
                  rejeitadoPor: formData.get('usuario') as string,
                  motivo: formData.get('motivo') as string
                });
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    name="usuario"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {modalAcao.tipo === 'transferir' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                      <input type="text" name="lote" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                      <input type="date" name="validade" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </>
                )}

                {modalAcao.tipo === 'receber' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Recebida</label>
                    <input
                      type="number"
                      name="quantidade"
                      defaultValue={modalAcao.movimentacao.quantidade}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {modalAcao.tipo === 'rejeitar' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
                    <textarea
                      name="motivo"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {(modalAcao.tipo === 'aprovar' || modalAcao.tipo === 'receber') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                    <textarea
                      name="observacao"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalAcao(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimentacoes;
