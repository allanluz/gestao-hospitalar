import React, { useState, useEffect } from 'react';
import MedicamentoEtiqueta from '../components/medicamentos/MedicamentoEtiqueta';

interface Medicamento {
  id: number;
  nome: string;
  principioAtivo: string;
  concentracao: string;
  formaFarmaceutica: string;
  fabricante: string;
  lote: string;
  dataValidade: string;
  registroAnvisa: string;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  unidade: string;
  localizacao: string;
  observacoes?: string;
  codigoBarras?: string;
  qrCode?: string;
}

const Medicamentos: React.FC = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [filteredMedicamentos, setFilteredMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicamento, setSelectedMedicamento] = useState<Medicamento | null>(null);
  const [showEtiqueta, setShowEtiqueta] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');

  const [formData, setFormData] = useState<Partial<Medicamento>>({
    nome: '',
    principioAtivo: '',
    concentracao: '',
    formaFarmaceutica: 'Comprimido',
    fabricante: '',
    lote: '',
    dataValidade: '',
    registroAnvisa: '',
    categoria: 'Analgésico',
    quantidade: 0,
    estoqueMinimo: 0,
    estoqueMaximo: 0,
    unidade: 'comprimido',
    localizacao: '',
    observacoes: ''
  });

  const categorias = [
    'Analgésico', 'Antibiótico', 'Antiulceroso', 'Anti-hipertensivo',
    'Antidiabético', 'Soluções', 'Analgésico Opioide', 'Hormônio',
    'Anticoagulante', 'Anestésico', 'Emergência', 'Corticoide', 'Diurético'
  ];

  const formasFarmaceuticas = [
    'Comprimido', 'Cápsula', 'Solução injetável', 'Suspensão injetável',
    'Emulsão injetável', 'Solução oral', 'Suspensão oral', 'Pomada',
    'Creme', 'Gel', 'Spray'
  ];

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  useEffect(() => {
    filterMedicamentos();
  }, [searchTerm, medicamentos, filterCategoria, filterStatus]);

  const fetchMedicamentos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/medicamentos');
      const data = await response.json();
      setMedicamentos(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      setLoading(false);
    }
  };

  const filterMedicamentos = () => {
    let filtered = medicamentos;

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.nome.toLowerCase().includes(term) ||
        m.principioAtivo.toLowerCase().includes(term) ||
        m.lote.toLowerCase().includes(term)
      );
    }

    // Filtro por categoria
    if (filterCategoria !== 'todas') {
      filtered = filtered.filter(m => m.categoria === filterCategoria);
    }

    // Filtro por status
    if (filterStatus === 'estoque-baixo') {
      filtered = filtered.filter(m => m.quantidade <= m.estoqueMinimo);
    } else if (filterStatus === 'vencimento-proximo') {
      const hoje = new Date();
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);
      
      filtered = filtered.filter(m => {
        const dataValidade = new Date(m.dataValidade);
        return dataValidade >= hoje && dataValidade <= dataLimite;
      });
    }

    setFilteredMedicamentos(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = selectedMedicamento
        ? `http://localhost:5000/api/medicamentos/${selectedMedicamento.id}`
        : 'http://localhost:5000/api/medicamentos';
      
      const method = selectedMedicamento ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMedicamentos();
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/medicamentos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMedicamentos();
      }
    } catch (error) {
      console.error('Erro ao excluir medicamento:', error);
    }
  };

  const handleEdit = (medicamento: Medicamento) => {
    setSelectedMedicamento(medicamento);
    setFormData(medicamento);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      principioAtivo: '',
      concentracao: '',
      formaFarmaceutica: 'Comprimido',
      fabricante: '',
      lote: '',
      dataValidade: '',
      registroAnvisa: '',
      categoria: 'Analgésico',
      quantidade: 0,
      estoqueMinimo: 0,
      estoqueMaximo: 0,
      unidade: 'comprimido',
      localizacao: '',
      observacoes: ''
    });
    setSelectedMedicamento(null);
    setShowForm(false);
  };

  const getEstoqueStatus = (medicamento: Medicamento) => {
    if (medicamento.quantidade <= medicamento.estoqueMinimo) {
      return { color: 'bg-red-100 text-red-800', label: 'Crítico' };
    } else if (medicamento.quantidade <= medicamento.estoqueMinimo * 1.5) {
      return { color: 'bg-yellow-100 text-yellow-800', label: 'Baixo' };
    }
    return { color: 'bg-green-100 text-green-800', label: 'Normal' };
  };

  const getValidadeStatus = (dataValidade: string) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return { color: 'bg-red-100 text-red-800', label: 'Vencido' };
    } else if (diasRestantes <= 30) {
      return { color: 'bg-yellow-100 text-yellow-800', label: `${diasRestantes} dias` };
    }
    return { color: 'bg-green-100 text-green-800', label: 'Válido' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Medicamentos</h1>
        <p className="text-gray-600">Controle completo do estoque de medicamentos com etiquetagem</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total de Medicamentos</div>
          <div className="text-2xl font-bold text-blue-600">{medicamentos.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Estoque Baixo</div>
          <div className="text-2xl font-bold text-red-600">
            {medicamentos.filter(m => m.quantidade <= m.estoqueMinimo).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Próximos ao Vencimento</div>
          <div className="text-2xl font-bold text-yellow-600">
            {medicamentos.filter(m => {
              const dias = Math.ceil((new Date(m.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return dias >= 0 && dias <= 30;
            }).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Com Etiqueta</div>
          <div className="text-2xl font-bold text-green-600">
            {medicamentos.filter(m => m.codigoBarras && m.qrCode).length}
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Buscar por nome, princípio ativo ou lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas as Categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os Status</option>
              <option value="estoque-baixo">Estoque Baixo</option>
              <option value="vencimento-proximo">Vencimento Próximo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão Adicionar */}
      <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-lg">➕</span>
          {showForm ? 'Cancelar' : 'Novo Medicamento'}
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {selectedMedicamento ? 'Editar Medicamento' : 'Novo Medicamento'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Medicamento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Princípio Ativo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.principioAtivo}
                  onChange={(e) => setFormData({ ...formData, principioAtivo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concentração *
                </label>
                <input
                  type="text"
                  required
                  value={formData.concentracao}
                  onChange={(e) => setFormData({ ...formData, concentracao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 500mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma Farmacêutica *
                </label>
                <select
                  required
                  value={formData.formaFarmaceutica}
                  onChange={(e) => setFormData({ ...formData, formaFarmaceutica: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {formasFarmaceuticas.map(forma => (
                    <option key={forma} value={forma}>{forma}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabricante *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fabricante}
                  onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lote *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lote}
                  onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dataValidade}
                  onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registro ANVISA
                </label>
                <input
                  type="text"
                  value={formData.registroAnvisa}
                  onChange={(e) => setFormData({ ...formData, registroAnvisa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  required
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque Mínimo *
                </label>
                <input
                  type="number"
                  required
                  value={formData.estoqueMinimo}
                  onChange={(e) => setFormData({ ...formData, estoqueMinimo: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque Máximo *
                </label>
                <input
                  type="number"
                  required
                  value={formData.estoqueMaximo}
                  onChange={(e) => setFormData({ ...formData, estoqueMaximo: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade *
                </label>
                <input
                  type="text"
                  required
                  value={formData.unidade}
                  onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: comprimido, ampola"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localização *
                </label>
                <input
                  type="text"
                  required
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Prateleira A1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedMedicamento ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Medicamentos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lote / Validade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedicamentos.map((medicamento) => {
                const estoqueStatus = getEstoqueStatus(medicamento);
                const validadeStatus = getValidadeStatus(medicamento.dataValidade);

                return (
                  <tr key={medicamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{medicamento.nome}</div>
                        <div className="text-sm text-gray-500">
                          {medicamento.principioAtivo} - {medicamento.concentracao}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">Lote: {medicamento.lote}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={validadeStatus.color.includes('red') ? 'text-red-600' : validadeStatus.color.includes('yellow') ? 'text-yellow-600' : 'text-green-600'}>📅</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${validadeStatus.color}`}>
                            {validadeStatus.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{medicamento.categoria}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {medicamento.quantidade <= medicamento.estoqueMinimo && (
                          <span className="text-red-600">⚠️</span>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {medicamento.quantidade} {medicamento.unidade}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${estoqueStatus.color}`}>
                            {estoqueStatus.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {medicamento.localizacao}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedMedicamento(medicamento);
                            setShowEtiqueta(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Gerar Etiqueta"
                        >
                          <span className="text-lg">🏷️</span>
                        </button>
                        <button
                          onClick={() => handleEdit(medicamento)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Editar"
                        >
                          <span className="text-lg">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDelete(medicamento.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredMedicamentos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum medicamento encontrado
            </div>
          )}
        </div>
      </div>

      {/* Modal de Etiqueta */}
      {showEtiqueta && selectedMedicamento && (
        <MedicamentoEtiqueta
          medicamento={selectedMedicamento}
          onClose={() => {
            setShowEtiqueta(false);
            setSelectedMedicamento(null);
            fetchMedicamentos(); // Recarregar para pegar os códigos gerados
          }}
        />
      )}
    </div>
  );
};

export default Medicamentos;
