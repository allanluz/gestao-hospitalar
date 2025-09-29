import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Material, CategoriaMaterial, CATEGORIAS_LABELS } from '../types/materiais';

const GerenciamentoMateriais: React.FC = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [categorias, setCategorias] = useState<any>({});
  const [estatisticas, setEstatisticas] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    subcategoria: '',
    ativo: '',
    esteril: '',
    descartavel: '',
    implantavel: '',
    search: ''
  });

  // Ordenação
  const [sortOrder, setSortOrder] = useState<'nome-asc' | 'nome-desc' | 'categoria-asc' | 'categoria-desc' | 'estoque-asc' | 'estoque-desc' | 'valor-asc' | 'valor-desc'>('nome-asc');

  // Form data
  const [formData, setFormData] = useState<Partial<Material>>({
    nome: '',
    categoria: CategoriaMaterial.MATERIAIS_BASICOS,
    subcategoria: '',
    especificacao: '',
    unidadeMedida: '',
    valorCusto: 0,
    valorVenda: 0,
    estoqueMinimo: 0,
    estoqueAtual: 0,
    ativo: true,
    esteril: false,
    descartavel: true,
    implantavel: false,
    observacoes: '',
    fornecedor: '',
    codigoFornecedor: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMateriais();
  }, [filtros]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [materiaisData, categoriasData, estatisticasData] = await Promise.all([
        api.getMateriais(),
        api.getCategoriasMateriais(),
        api.getEstatisticasMateriais()
      ]);
      
      setMateriais(materiaisData as Material[]);
      setCategorias(categoriasData);
      setEstatisticas(estatisticasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMateriais = async () => {
    try {
      const filtrosLimpos = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '')
      );
      
      const data = await api.getMateriais(filtrosLimpos);
      setMateriais(data as Material[]);
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
    }
  };

  // Materiais ordenados
  const materiaisOrdenados = [...materiais].sort((a, b) => {
    switch (sortOrder) {
      case 'nome-asc':
        return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
      case 'nome-desc':
        return b.nome.localeCompare(a.nome, 'pt-BR', { sensitivity: 'base' });
      case 'categoria-asc':
        return a.categoria.localeCompare(b.categoria, 'pt-BR', { sensitivity: 'base' });
      case 'categoria-desc':
        return b.categoria.localeCompare(a.categoria, 'pt-BR', { sensitivity: 'base' });
      case 'estoque-asc':
        return (a.estoqueAtual || 0) - (b.estoqueAtual || 0);
      case 'estoque-desc':
        return (b.estoqueAtual || 0) - (a.estoqueAtual || 0);
      case 'valor-asc':
        return a.valorVenda - b.valorVenda;
      case 'valor-desc':
        return b.valorVenda - a.valorVenda;
      default:
        return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateMaterial(editingId, formData);
      } else {
        await api.createMaterial(formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar material:', error);
    }
  };

  const handleEdit = (material: Material) => {
    setFormData(material);
    setEditingId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      try {
        await api.deleteMaterial(id);
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir material:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      categoria: CategoriaMaterial.MATERIAIS_BASICOS,
      subcategoria: '',
      especificacao: '',
      unidadeMedida: '',
      valorCusto: 0,
      valorVenda: 0,
      estoqueMinimo: 0,
      estoqueAtual: 0,
      ativo: true,
      esteril: false,
      descartavel: true,
      implantavel: false,
      observacoes: '',
      fornecedor: '',
      codigoFornecedor: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      categoria: '',
      subcategoria: '',
      ativo: '',
      esteril: '',
      descartavel: '',
      implantavel: '',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerenciamento de Materiais</h1>

      {/* Dashboard de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total de Materiais</p>
              <p className="text-3xl font-bold text-blue-800">{estatisticas.total || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Materiais Ativos</p>
              <p className="text-3xl font-bold text-green-800">{estatisticas.ativos || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Estoque Baixo</p>
              <p className="text-3xl font-bold text-yellow-800">{estatisticas.estoqueBaixo || 0}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Valor do Estoque</p>
              <p className="text-2xl font-bold text-purple-800">R$ {(estatisticas.valorTotalEstoque || 0).toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Filtros de Busca</h2>
          <button
            onClick={limparFiltros}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={filtros.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Nome, código ou especificação..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="nome-asc">Nome (A-Z)</option>
              <option value="nome-desc">Nome (Z-A)</option>
              <option value="categoria-asc">Categoria (A-Z)</option>
              <option value="categoria-desc">Categoria (Z-A)</option>
              <option value="estoque-asc">Estoque (Menor)</option>
              <option value="estoque-desc">Estoque (Maior)</option>
              <option value="valor-asc">Valor (Menor)</option>
              <option value="valor-desc">Valor (Maior)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={filtros.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as categorias</option>
              {Object.entries(categorias).map(([key, value]: [string, any]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
            <select
              value={filtros.subcategoria}
              onChange={(e) => handleFilterChange('subcategoria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!filtros.categoria}
            >
              <option value="">Todas as subcategorias</option>
              {filtros.categoria && categorias[filtros.categoria]?.subcategorias?.map((sub: string) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filtros.ativo}
              onChange={(e) => handleFilterChange('ativo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filtros.esteril}
              onChange={(e) => handleFilterChange('esteril', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Estéril</option>
              <option value="false">Não Estéril</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uso</label>
            <select
              value={filtros.descartavel}
              onChange={(e) => handleFilterChange('descartavel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Descartável</option>
              <option value="false">Reutilizável</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Implante</label>
            <select
              value={filtros.implantavel}
              onChange={(e) => handleFilterChange('implantavel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Implantável</option>
              <option value="false">Não Implantável</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão Adicionar */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Adicionar Material
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Editar Material' : 'Adicionar Material'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Material *
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={formData.codigo || ''}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      categoria: e.target.value as CategoriaMaterial,
                      subcategoria: '' 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.entries(categorias).map(([key, value]: [string, any]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoria
                  </label>
                  <select
                    value={formData.subcategoria || ''}
                    onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione...</option>
                    {formData.categoria && categorias[formData.categoria]?.subcategorias?.map((sub: string) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade de Medida *
                  </label>
                  <select
                    value={formData.unidadeMedida || ''}
                    onChange={(e) => setFormData({ ...formData, unidadeMedida: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="unidade">Unidade</option>
                    <option value="caixa">Caixa</option>
                    <option value="pacote">Pacote</option>
                    <option value="frasco">Frasco</option>
                    <option value="ampola">Ampola</option>
                    <option value="envelope">Envelope</option>
                    <option value="rolo">Rolo</option>
                    <option value="par">Par</option>
                    <option value="kit">Kit</option>
                    <option value="ml">Mililitro</option>
                    <option value="g">Grama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor de Custo (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valorCusto || ''}
                    onChange={(e) => setFormData({ ...formData, valorCusto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valorVenda || ''}
                    onChange={(e) => setFormData({ ...formData, valorVenda: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estoqueMinimo || ''}
                    onChange={(e) => setFormData({ ...formData, estoqueMinimo: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estoqueAtual || ''}
                    onChange={(e) => setFormData({ ...formData, estoqueAtual: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    value={formData.fornecedor || ''}
                    onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código do Fornecedor
                  </label>
                  <input
                    type="text"
                    value={formData.codigoFornecedor || ''}
                    onChange={(e) => setFormData({ ...formData, codigoFornecedor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especificação
                </label>
                <textarea
                  value={formData.especificacao || ''}
                  onChange={(e) => setFormData({ ...formData, especificacao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo || false}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                    Ativo
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="esteril"
                    checked={formData.esteril || false}
                    onChange={(e) => setFormData({ ...formData, esteril: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="esteril" className="ml-2 block text-sm text-gray-900">
                    Estéril
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="descartavel"
                    checked={formData.descartavel || false}
                    onChange={(e) => setFormData({ ...formData, descartavel: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="descartavel" className="ml-2 block text-sm text-gray-900">
                    Descartável
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="implantavel"
                    checked={formData.implantavel || false}
                    onChange={(e) => setFormData({ ...formData, implantavel: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="implantavel" className="ml-2 block text-sm text-gray-900">
                    Implantável
                  </label>
                </div>
              </div>

              {/* Botões */}
              <div className="flex space-x-4 pt-4">
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
        </div>
      )}

      {/* Lista de Materiais */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Lista de Materiais ({materiaisOrdenados.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
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
              {materiaisOrdenados.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{material.nome}</div>
                    <div className="text-sm text-gray-500">
                      {material.codigo && `Código: ${material.codigo}`}
                      {material.especificacao && ` • ${material.especificacao}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {categorias[material.categoria]?.label || material.categoria}
                    </div>
                    {material.subcategoria && (
                      <div className="text-sm text-gray-500">{material.subcategoria}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Custo: R$ {material.valorCusto.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Venda: R$ {material.valorVenda.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      (material.estoqueAtual || 0) <= (material.estoqueMinimo || 0) 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {material.estoqueAtual || 0} {material.unidadeMedida}
                    </div>
                    <div className="text-sm text-gray-500">
                      Mín: {material.estoqueMinimo || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        material.ativo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {material.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      {material.esteril && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Estéril
                        </span>
                      )}
                      {material.implantavel && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Implante
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(material)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {materiaisOrdenados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum material encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GerenciamentoMateriais;