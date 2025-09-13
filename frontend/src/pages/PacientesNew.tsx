import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Paciente } from '../types';
import PatientCodeGenerator from '../components/common/PatientCodeGenerator';
import PatientForm from '../components/forms/PatientForm';

const Pacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [codeType, setCodeType] = useState<'qrcode' | 'barcode'>('qrcode');

  useEffect(() => {
    document.title = 'Pacientes - Gestão Hospitalar';
    return () => {
      document.title = 'Gestão Hospitalar - Sistema de Administração';
    };
  }, []);

  useEffect(() => {
    const handleOpenModal = () => {
      setShowModal(true);
      setEditingPaciente(null);
    };

    window.addEventListener('openNewPatientModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openNewPatientModal', handleOpenModal);
    };
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      const data = await apiService.getPacientes() as Paciente[];
      setPacientes(data);
    } catch (err) {
      setError('Erro ao carregar pacientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingPaciente) {
        await apiService.updatePaciente(editingPaciente.id, formData);
      } else {
        await apiService.createPaciente(formData);
      }
      fetchPacientes();
      setShowModal(false);
      setEditingPaciente(null);
    } catch (err) {
      console.error('Erro ao salvar paciente:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingPaciente(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await apiService.deletePaciente(id);
        fetchPacientes();
      } catch (err) {
        console.error('Erro ao excluir paciente:', err);
      }
    }
  };

  const handleEdit = (paciente: Paciente) => {
    setEditingPaciente(paciente);
    setShowModal(true);
  };

  // Funções para códigos QR e códigos de barras
  const handleShowQRCode = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setCodeType('qrcode');
    setShowCodeGenerator(true);
  };

  const handleShowBarcode = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setCodeType('barcode');
    setShowCodeGenerator(true);
  };

  const closeCodeGenerator = () => {
    setShowCodeGenerator(false);
    setSelectedPaciente(null);
  };

  const filteredPacientes = pacientes.filter(paciente =>
    (paciente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     paciente.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     paciente.cpf?.includes(searchTerm))
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="text-red-800">Erro: {error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestão de Pacientes</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-w-80"
          />
          <span className="text-sm text-gray-500">
            {filteredPacientes.length} paciente(s) encontrado(s)
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Novo Paciente
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Convênio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPacientes.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {paciente.nomeCompleto || paciente.nome}
                        </div>
                        {paciente.nome !== paciente.nomeCompleto && paciente.nomeCompleto && (
                          <div className="text-sm text-gray-500">
                            Prefere: {paciente.nome}
                          </div>
                        )}
                        {/* Indicadores de necessidades especiais */}
                        <div className="flex gap-1 mt-1">
                          {paciente.deficiencias?.auditiva && <span title="Deficiência Auditiva">🔇</span>}
                          {paciente.deficiencias?.visual && <span title="Deficiência Visual">👁️</span>}
                          {paciente.deficiencias?.fisica && <span title="Deficiência Física">♿</span>}
                          {paciente.neurodivergencias?.autismo && <span title="Autismo">🧩</span>}
                          {paciente.neurodivergencias?.tdah && <span title="TDAH">⚡</span>}
                          {paciente.necessidadesEspeciais?.cadeirante && <span title="Cadeirante">♿</span>}
                          {paciente.necessidadesEspeciais?.interprete_libras && <span title="Intérprete LIBRAS">🤟</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paciente.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      {paciente.celular && <div>📱 {paciente.celular}</div>}
                      {paciente.telefone && <div className="text-xs text-gray-400">📞 {paciente.telefone}</div>}
                      {paciente.email && <div className="text-xs text-gray-400">✉️ {paciente.email}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="font-medium">{paciente.convenio}</div>
                      {paciente.numeroConvenio && (
                        <div className="text-xs text-gray-400">{paciente.numeroConvenio}</div>
                      )}
                      {paciente.validadeConvenio && (
                        <div className="text-xs text-gray-400">
                          Válido até: {new Date(paciente.validadeConvenio).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(paciente)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(paciente.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => handleShowQRCode(paciente)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Gerar QR Code"
                      >
                        📱
                      </button>
                      <button
                        onClick={() => handleShowBarcode(paciente)}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        title="Gerar Código de Barras"
                      >
                        📊
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPacientes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">Nenhum paciente encontrado</div>
              <div className="text-gray-400 text-sm">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Clique em "Novo Paciente" para começar'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <PatientForm
          paciente={editingPaciente}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={!!editingPaciente}
        />
      )}

      {/* Gerador de Código */}
      {showCodeGenerator && selectedPaciente && (
        <PatientCodeGenerator
          paciente={selectedPaciente}
          tipo={codeType}
          onClose={closeCodeGenerator}
        />
      )}
    </div>
  );
};

export default Pacientes;
