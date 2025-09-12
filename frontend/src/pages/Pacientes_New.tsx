import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Paciente } from '../types';
import { buscarEnderecoPorCep, formatarCep, validarCep } from '../services/viaCep';
import PatientCodeGenerator from '../components/common/PatientCodeGenerator';

const Pacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
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

  const [formData, setFormData] = useState({
    nome: '',
    nomeCompleto: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    sexo: 'M' as 'M' | 'F',
    estadoCivil: 'solteiro' as 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel',
    profissao: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      uf: ''
    },
    telefone: '',
    celular: '',
    email: '',
    convenio: '',
    numeroConvenio: '',
    tipoSanguineo: '',
    fatorRh: '+' as '+' | '-',
    peso: '',
    altura: '',
    nomeContato: '',
    telefoneContato: '',
    parentescoContato: '',
    alergias: {
      possui: false,
      descricao: ''
    },
    medicamentosUso: '',
    historicoMedico: '',
    observacoes: '',
    deficiencias: {
      auditiva: false,
      visual: false,
      fisica: false,
      intelectual: false,
      multipla: false,
      descricao: ''
    },
    neurodivergencias: {
      autismo: false,
      tdah: false,
      dislexia: false,
      sindrome_down: false,
      outras: false,
      descricao: ''
    },
    necessidadesEspeciais: {
      cadeirante: false,
      acompanhante: false,
      interprete_libras: false,
      material_braille: false,
      outras: ''
    }
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPaciente) {
        await apiService.updatePaciente(editingPaciente.id, formData);
      } else {
        await apiService.createPaciente(formData);
      }
      fetchPacientes();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar paciente:', err);
    }
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
    setFormData({
      ...paciente,
      endereco: {
        rua: paciente.endereco.rua || '',
        numero: paciente.endereco.numero || '',
        complemento: paciente.endereco.complemento || '',
        bairro: paciente.endereco.bairro || '',
        cidade: paciente.endereco.cidade || '',
        cep: paciente.endereco.cep || '',
        uf: paciente.endereco.uf || ''
      },
      sexo: paciente.sexo || 'M',
      estadoCivil: paciente.estadoCivil || 'solteiro',
      fatorRh: paciente.fatorRh || '+',
      peso: paciente.peso?.toString() || '',
      altura: paciente.altura?.toString() || '',
      alergias: paciente.alergias || { possui: false, descricao: '' },
      deficiencias: {
        auditiva: paciente.deficiencias?.auditiva || false,
        visual: paciente.deficiencias?.visual || false,
        fisica: paciente.deficiencias?.fisica || false,
        intelectual: paciente.deficiencias?.intelectual || false,
        multipla: paciente.deficiencias?.multipla || false,
        descricao: paciente.deficiencias?.descricao || ''
      },
      neurodivergencias: {
        autismo: paciente.neurodivergencias?.autismo || false,
        tdah: paciente.neurodivergencias?.tdah || false,
        dislexia: paciente.neurodivergencias?.dislexia || false,
        sindrome_down: paciente.neurodivergencias?.sindrome_down || false,
        outras: paciente.neurodivergencias?.outras || false,
        descricao: paciente.neurodivergencias?.descricao || ''
      },
      necessidadesEspeciais: {
        cadeirante: paciente.necessidadesEspeciais?.cadeirante || false,
        acompanhante: paciente.necessidadesEspeciais?.acompanhante || false,
        interprete_libras: paciente.necessidadesEspeciais?.interprete_libras || false,
        material_braille: paciente.necessidadesEspeciais?.material_braille || false,
        outras: paciente.necessidadesEspeciais?.outras || ''
      },
      nomeCompleto: paciente.nomeCompleto || '',
      rg: paciente.rg || '',
      profissao: paciente.profissao || '',
      celular: paciente.celular || '',
      email: paciente.email || '',
      numeroConvenio: paciente.numeroConvenio || '',
      tipoSanguineo: paciente.tipoSanguineo || '',
      nomeContato: paciente.nomeContato || '',
      telefoneContato: paciente.telefoneContato || '',
      parentescoContato: paciente.parentescoContato || '',
      medicamentosUso: paciente.medicamentosUso || '',
      observacoes: paciente.observacoes || '',
      historicoMedico: paciente.historicoMedico || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      nomeCompleto: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      sexo: 'M',
      estadoCivil: 'solteiro',
      profissao: '',
      endereco: { 
        rua: '', 
        numero: '', 
        complemento: '', 
        bairro: '', 
        cidade: '', 
        cep: '', 
        uf: '' 
      },
      telefone: '',
      celular: '',
      email: '',
      convenio: '',
      numeroConvenio: '',
      tipoSanguineo: '',
      fatorRh: '+',
      peso: '',
      altura: '',
      nomeContato: '',
      telefoneContato: '',
      parentescoContato: '',
      alergias: {
        possui: false,
        descricao: ''
      },
      medicamentosUso: '',
      historicoMedico: '',
      observacoes: '',
      deficiencias: {
        auditiva: false,
        visual: false,
        fisica: false,
        intelectual: false,
        multipla: false,
        descricao: ''
      },
      neurodivergencias: {
        autismo: false,
        tdah: false,
        dislexia: false,
        sindrome_down: false,
        outras: false,
        descricao: ''
      },
      necessidadesEspeciais: {
        cadeirante: false,
        acompanhante: false,
        interprete_libras: false,
        material_braille: false,
        outras: ''
      }
    });
    setEditingPaciente(null);
    setShowModal(false);
    setCepError(null);
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

  const handleCepChange = async (cep: string) => {
    const cepFormatado = formatarCep(cep);
    
    setFormData({
      ...formData,
      endereco: { ...formData.endereco, cep: cepFormatado }
    });

    setCepError(null);

    if (validarCep(cep)) {
      setCepLoading(true);
      try {
        const endereco = await buscarEnderecoPorCep(cep);
        if (endereco) {
          setFormData({
            ...formData,
            endereco: {
              ...formData.endereco,
              cep: cepFormatado,
              rua: endereco.logradouro,
              bairro: endereco.bairro,
              cidade: endereco.localidade,
              uf: endereco.uf
            }
          });
        }
      } catch (error) {
        setCepError('CEP não encontrado');
      } finally {
        setCepLoading(false);
      }
    }
  };

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm)
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestão de Pacientes</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Novo Paciente
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
                  Telefone
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
                <tr key={paciente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{paciente.nome}</div>
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
                    {paciente.telefone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paciente.convenio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(paciente)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(paciente.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => handleShowQRCode(paciente)}
                        className="text-green-600 hover:text-green-900"
                        title="Gerar QR Code"
                      >
                        📱
                      </button>
                      <button
                        onClick={() => handleShowBarcode(paciente)}
                        className="text-yellow-600 hover:text-yellow-900"
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
        </div>
      </div>

      {/* Modal de Cadastro/Edição será continuado no próximo arquivo... */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                {editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}
              </h3>
              
              {/* O formulário será adicionado no próximo bloco... */}
              <p className="text-sm text-gray-600 mb-4">
                Formulário completo será implementado na próxima etapa...
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
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
