import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { ItemEstoque } from '../types';

const Estoque: React.FC = () => {
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'movimentacao'>('create');
  const [selectedItem, setSelectedItem] = useState<ItemEstoque | null>(null);
  const [formData, setFormData] = useState<Partial<ItemEstoque>>({
    nome: '',
    categoria: '',
    setor: '',
    quantidade: 0,
    estoqueMinimo: 0,
    unidade: '',
    lote: '',
    dataValidade: '',
    fornecedor: ''
  });
  const [movimentacaoData, setMovimentacaoData] = useState({
    quantidade: 0,
    tipo: 'entrada' as 'entrada' | 'saida',
    responsavel: '',
    observacoes: ''
  });

  useEffect(() => {
    fetchEstoque();
  }, []);

  useEffect(() => {
    document.title = 'Estoque - Gestão Hospitalar';
    return () => {
      document.title = 'Gestão Hospitalar - Sistema de Administração';
    };
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEstoque() as ItemEstoque[];
      setItens(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar estoque');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: 'create' | 'edit' | 'delete' | 'movimentacao', item?: ItemEstoque) => {
    setModalType(type);
    setSelectedItem(item || null);
    
    if (type === 'create') {
      setFormData({
        nome: '',
        categoria: '',
        setor: '',
        quantidade: 0,
        estoqueMinimo: 0,
        unidade: '',
        lote: '',
        dataValidade: '',
        fornecedor: ''
      });
    } else if (type === 'edit' && item) {
      setFormData(item);
    } else if (type === 'movimentacao') {
      setMovimentacaoData({
        quantidade: 0,
        tipo: 'entrada',
        responsavel: '',
        observacoes: ''
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' || name === 'estoqueMinimo' ? parseInt(value) || 0 : value
    }));
  };

  const validateForm = () => {
    const required = ['nome', 'categoria', 'setor', 'unidade', 'lote', 'dataValidade', 'fornecedor'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setError(`O campo ${field} é obrigatório`);
        return false;
      }
    }
    
    if ((formData.quantidade ?? 0) < 0) {
      setError('A quantidade não pode ser negativa');
      return false;
    }
    
    if ((formData.estoqueMinimo ?? 0) < 0) {
      setError('O estoque mínimo não pode ser negativo');
      return false;
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (formData.dataValidade && formData.dataValidade < today) {
      setError('A data de validade não pode ser anterior à data atual');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (modalType === 'create') {
        await apiService.createItemEstoque(formData);
        setSuccess('Item criado com sucesso!');
      } else if (modalType === 'edit' && selectedItem) {
        await apiService.updateItemEstoque(selectedItem.id, formData);
        setSuccess('Item atualizado com sucesso!');
      }
      
      await fetchEstoque();
      closeModal();
    } catch (err) {
      setError('Erro ao salvar item');
      console.error(err);
    }
  };

  const handleMovimentacaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedItem) return;
    
    if (!movimentacaoData.responsavel || movimentacaoData.quantidade <= 0) {
      setError('Responsável e quantidade são obrigatórios');
      return;
    }
    
    try {
      await apiService.movimentarEstoque({
        itemId: selectedItem.id,
        ...movimentacaoData
      });
      setSuccess(`Movimentação de ${movimentacaoData.tipo} realizada com sucesso!`);
      await fetchEstoque();
      closeModal();
    } catch (err) {
      setError('Erro ao realizar movimentação');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    try {
      await apiService.deleteItemEstoque(selectedItem.id);
      setSuccess('Item excluído com sucesso!');
      await fetchEstoque();
      closeModal();
    } catch (err) {
      setError('Erro ao excluir item');
      console.error(err);
    }
  };

  const filteredItens = itens.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itensEstoqueBaixo = itens.filter(item => item.quantidade < item.estoqueMinimo);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
        <button 
          onClick={() => openModal('create')}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          ➕ Novo Item
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {itensEstoqueBaixo.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            ⚠️
            <h3 className="text-lg font-semibold text-red-800 ml-2">Atenção: {itensEstoqueBaixo.length} itens com estoque baixo</h3>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          🔍
          <input
            type="text"
            placeholder="Buscar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
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
              {filteredItens.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                      <div className="text-sm text-gray-500">Lote: {item.lote}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.categoria}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.setor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantidade} {item.unidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantidade < item.estoqueMinimo ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ⚠️ Baixo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => openModal('edit', item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => openModal('movimentacao', item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Movimentar"
                    >
                      📦
                    </button>
                    <button 
                      onClick={() => openModal('delete', item)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {modalType === 'create' && 'Novo Item'}
                  {modalType === 'edit' && 'Editar Item'}
                  {modalType === 'delete' && 'Confirmar Exclusão'}
                  {modalType === 'movimentacao' && 'Movimentar Estoque'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {modalType === 'delete' ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Tem certeza que deseja excluir o item <strong>{selectedItem?.nome}</strong>? 
                    Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ) : modalType === 'movimentacao' ? (
                <form onSubmit={handleMovimentacaoSubmit}>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Item:</strong> {selectedItem?.nome}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Estoque atual:</strong> {selectedItem?.quantidade} {selectedItem?.unidade}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Movimentação *
                      </label>
                      <select
                        value={movimentacaoData.tipo}
                        onChange={(e) => setMovimentacaoData(prev => ({ ...prev, tipo: e.target.value as 'entrada' | 'saida' }))}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade *
                      </label>
                      <input
                        type="number"
                        value={movimentacaoData.quantidade}
                        onChange={(e) => setMovimentacaoData(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 0 }))}
                        required
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Responsável *
                      </label>
                      <input
                        type="text"
                        value={movimentacaoData.responsavel}
                        onChange={(e) => setMovimentacaoData(prev => ({ ...prev, responsavel: e.target.value }))}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observações
                      </label>
                      <textarea
                        value={movimentacaoData.observacoes}
                        onChange={(e) => setMovimentacaoData(prev => ({ ...prev, observacoes: e.target.value }))}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Confirmar Movimentação
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Item *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="Medicamento">Medicamento</option>
                        <option value="Material Hospitalar">Material Hospitalar</option>
                        <option value="Material Cirúrgico">Material Cirúrgico</option>
                        <option value="Medicamento Controlado">Medicamento Controlado</option>
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Descartáveis">Descartáveis</option>
                        <option value="Higiene">Higiene</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Setor *
                      </label>
                      <select
                        name="setor"
                        value={formData.setor}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="Farmácia">Farmácia</option>
                        <option value="UTI">UTI</option>
                        <option value="Centro Cirúrgico">Centro Cirúrgico</option>
                        <option value="Enfermaria">Enfermaria</option>
                        <option value="Emergência">Emergência</option>
                        <option value="Geral">Geral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade *
                      </label>
                      <input
                        type="number"
                        name="quantidade"
                        value={formData.quantidade}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estoque Mínimo *
                      </label>
                      <input
                        type="number"
                        name="estoqueMinimo"
                        value={formData.estoqueMinimo}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unidade *
                      </label>
                      <select
                        name="unidade"
                        value={formData.unidade}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="UN">Unidade</option>
                        <option value="CX">Caixa</option>
                        <option value="PC">Pacote</option>
                        <option value="ML">Mililitro</option>
                        <option value="G">Grama</option>
                        <option value="KG">Quilograma</option>
                        <option value="L">Litro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lote *
                      </label>
                      <input
                        type="text"
                        name="lote"
                        value={formData.lote}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Validade *
                      </label>
                      <input
                        type="date"
                        name="dataValidade"
                        value={formData.dataValidade}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fornecedor *
                      </label>
                      <input
                        type="text"
                        name="fornecedor"
                        value={formData.fornecedor}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      {modalType === 'create' ? 'Criar' : 'Salvar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estoque;
