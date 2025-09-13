import React, { useState, useEffect } from 'react';
import { Paciente } from '../../types';
import { buscarEnderecoPorCep, formatarCep, validarCep } from '../../services/viaCep';
import { 
  formatarCPF, 
  validarCPF, 
  formatarRG, 
  formatarTelefone, 
  calcularIdade, 
  calcularIMC, 
  classificarIMC,
  limparCPF 
} from '../../utils/formatters';

interface PatientFormProps {
  paciente?: Paciente | null;
  onSave: (paciente: any) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  paciente,
  onSave,
  onCancel,
  isEditing
}) => {
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pessoais');
  const [cpfError, setCpfError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    nomeCompleto: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    sexo: 'M' as 'M' | 'F',
    estadoCivil: 'solteiro' as 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel',
    profissao: '',
    naturalidade: '',
    nacionalidade: 'Brasileira',
    nomePai: '',
    nomeMae: '',
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
    validadeConvenio: '',
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
    if (isEditing && paciente) {
      setFormData({
        nome: paciente.nome || '',
        nomeCompleto: paciente.nomeCompleto || '',
        cpf: paciente.cpf || '',
        rg: paciente.rg || '',
        dataNascimento: paciente.dataNascimento || '',
        sexo: paciente.sexo || 'M',
        estadoCivil: paciente.estadoCivil || 'solteiro',
        profissao: paciente.profissao || '',
        naturalidade: paciente.naturalidade || '',
        nacionalidade: paciente.nacionalidade || 'Brasileira',
        nomePai: paciente.nomePai || '',
        nomeMae: paciente.nomeMae || '',
        endereco: {
          rua: paciente.endereco?.rua || '',
          numero: paciente.endereco?.numero || '',
          complemento: paciente.endereco?.complemento || '',
          bairro: paciente.endereco?.bairro || '',
          cidade: paciente.endereco?.cidade || '',
          cep: paciente.endereco?.cep || '',
          uf: paciente.endereco?.uf || ''
        },
        telefone: paciente.telefone || '',
        celular: paciente.celular || '',
        email: paciente.email || '',
        convenio: paciente.convenio || '',
        numeroConvenio: paciente.numeroConvenio || '',
        validadeConvenio: paciente.validadeConvenio || '',
        tipoSanguineo: paciente.tipoSanguineo || '',
        fatorRh: paciente.fatorRh || '+',
        peso: paciente.peso?.toString() || '',
        altura: paciente.altura?.toString() || '',
        nomeContato: paciente.nomeContato || '',
        telefoneContato: paciente.telefoneContato || '',
        parentescoContato: paciente.parentescoContato || '',
        alergias: {
          possui: paciente.alergias?.possui || false,
          descricao: paciente.alergias?.descricao || ''
        },
        medicamentosUso: paciente.medicamentosUso || '',
        historicoMedico: paciente.historicoMedico || '',
        observacoes: paciente.observacoes || '',
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
        }
      });
    }
  }, [isEditing, paciente]);

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

  const handleCpfChange = (cpf: string) => {
    const cpfFormatado = formatarCPF(cpf);
    const cpfLimpo = limparCPF(cpf);
    
    setFormData({
      ...formData,
      cpf: cpfFormatado
    });

    // Validar CPF apenas quando tiver 11 dígitos
    if (cpfLimpo.length === 11) {
      if (!validarCPF(cpf)) {
        setCpfError('CPF inválido');
      } else {
        setCpfError(null);
      }
    } else {
      setCpfError(null);
    }
  };

  const handleRgChange = (rg: string) => {
    const rgFormatado = formatarRG(rg);
    setFormData({
      ...formData,
      rg: rgFormatado
    });
  };

  const handleTelefoneChange = (value: string, field: 'telefone' | 'celular' | 'telefoneContato') => {
    const telefoneFormatado = formatarTelefone(value);
    setFormData({
      ...formData,
      [field]: telefoneFormatado
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Preparar dados para envio - limpar formatação
      const dataToSend = {
        ...formData,
        cpf: limparCPF(formData.cpf), // Remove formatação do CPF
        endereco: {
          ...formData.endereco,
          cep: formData.endereco.cep.replace(/\D/g, '') // Remove formatação do CEP
        },
        telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação do telefone
        celular: formData.celular.replace(/\D/g, ''), // Remove formatação do celular
        telefoneContato: formData.telefoneContato.replace(/\D/g, ''), // Remove formatação
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        altura: formData.altura ? parseFloat(formData.altura) : undefined,
        imc: calculateIMC(formData.peso, formData.altura) ? parseFloat(calculateIMC(formData.peso, formData.altura)) : undefined
      };
      
      await onSave(dataToSend);
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    return calcularIdade(birthDate).toString();
  };

  const calculateIMC = (peso: string, altura: string) => {
    if (!peso || !altura) return '';
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);
    return calcularIMC(pesoNum, alturaNum);
  };

  const getIMCClassification = (peso: string, altura: string) => {
    const imc = calculateIMC(peso, altura);
    if (!imc) return '';
    return classificarIMC(parseFloat(imc));
  };

  const tabs = [
    { id: 'pessoais', label: 'Dados Pessoais' },
    { id: 'endereco', label: 'Endereço' },
    { id: 'contato', label: 'Contato' },
    { id: 'convenio', label: 'Convênio' },
    { id: 'medicos', label: 'Dados Médicos' },
    { id: 'emergencia', label: 'Contato de Emergência' },
    { id: 'acessibilidade', label: 'Acessibilidade' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
        <div className="mt-3">
          <h3 className="text-xl font-medium text-gray-900 mb-6">
            {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
          </h3>

          {/* Navegação por abas */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Aba: Dados Pessoais */}
            {activeTab === 'pessoais' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Social/Preferência
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Como gosta de ser chamado(a)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleCpfChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      cpfError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                  {cpfError && (
                    <p className="text-red-500 text-sm mt-1">{cpfError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RG
                  </label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={(e) => handleRgChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="00.000.000-0"
                    maxLength={12}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {formData.dataNascimento && (
                    <p className="text-sm text-gray-500 mt-1">
                      Idade: {calculateAge(formData.dataNascimento)} anos
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo *
                  </label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value as 'M' | 'F' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado Civil
                  </label>
                  <select
                    value={formData.estadoCivil}
                    onChange={(e) => setFormData({ ...formData, estadoCivil: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="uniao_estavel">União Estável</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profissão
                  </label>
                  <input
                    type="text"
                    value={formData.profissao}
                    onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naturalidade
                  </label>
                  <input
                    type="text"
                    value={formData.naturalidade}
                    onChange={(e) => setFormData({ ...formData, naturalidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cidade/Estado de nascimento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nacionalidade
                  </label>
                  <input
                    type="text"
                    value={formData.nacionalidade}
                    onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Pai
                  </label>
                  <input
                    type="text"
                    value={formData.nomePai}
                    onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Mãe
                  </label>
                  <input
                    type="text"
                    value={formData.nomeMae}
                    onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Aba: Endereço */}
            {activeTab === 'endereco' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.endereco.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="00000-000"
                      required
                    />
                    {cepLoading && (
                      <div className="absolute right-3 top-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                  {cepError && (
                    <p className="text-red-500 text-sm mt-1">{cepError}</p>
                  )}
                </div>

                <div></div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.rua}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, rua: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.numero}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, numero: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.complemento}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, complemento: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Apto, sala, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.bairro}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, bairro: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.cidade}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, cidade: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UF *
                  </label>
                  <select
                    value={formData.endereco.uf}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, uf: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="AC">AC - Acre</option>
                    <option value="AL">AL - Alagoas</option>
                    <option value="AP">AP - Amapá</option>
                    <option value="AM">AM - Amazonas</option>
                    <option value="BA">BA - Bahia</option>
                    <option value="CE">CE - Ceará</option>
                    <option value="DF">DF - Distrito Federal</option>
                    <option value="ES">ES - Espírito Santo</option>
                    <option value="GO">GO - Goiás</option>
                    <option value="MA">MA - Maranhão</option>
                    <option value="MT">MT - Mato Grosso</option>
                    <option value="MS">MS - Mato Grosso do Sul</option>
                    <option value="MG">MG - Minas Gerais</option>
                    <option value="PA">PA - Pará</option>
                    <option value="PB">PB - Paraíba</option>
                    <option value="PR">PR - Paraná</option>
                    <option value="PE">PE - Pernambuco</option>
                    <option value="PI">PI - Piauí</option>
                    <option value="RJ">RJ - Rio de Janeiro</option>
                    <option value="RN">RN - Rio Grande do Norte</option>
                    <option value="RS">RS - Rio Grande do Sul</option>
                    <option value="RO">RO - Rondônia</option>
                    <option value="RR">RR - Roraima</option>
                    <option value="SC">SC - Santa Catarina</option>
                    <option value="SP">SP - São Paulo</option>
                    <option value="SE">SE - Sergipe</option>
                    <option value="TO">TO - Tocantins</option>
                  </select>
                </div>
              </div>
            )}

            {/* Aba: Contato */}
            {activeTab === 'contato' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone Fixo
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleTelefoneChange(e.target.value, 'telefone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 3333-4444"
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular *
                  </label>
                  <input
                    type="tel"
                    value={formData.celular}
                    onChange={(e) => handleTelefoneChange(e.target.value, 'celular')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-8888"
                    maxLength={15}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>
            )}

            {/* Aba: Convênio */}
            {activeTab === 'convenio' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Convênio *
                  </label>
                  <input
                    type="text"
                    value={formData.convenio}
                    onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: SUS, Unimed, Bradesco Saúde"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Convênio
                  </label>
                  <input
                    type="text"
                    value={formData.numeroConvenio}
                    onChange={(e) => setFormData({ ...formData, numeroConvenio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validade do Convênio
                  </label>
                  <input
                    type="date"
                    value={formData.validadeConvenio}
                    onChange={(e) => setFormData({ ...formData, validadeConvenio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Aba: Dados Médicos */}
            {activeTab === 'medicos' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo Sanguíneo
                    </label>
                    <select
                      value={formData.tipoSanguineo}
                      onChange={(e) => setFormData({ ...formData, tipoSanguineo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fator Rh
                    </label>
                    <select
                      value={formData.fatorRh}
                      onChange={(e) => setFormData({ ...formData, fatorRh: e.target.value as '+' | '-' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="+">Positivo (+)</option>
                      <option value="-">Negativo (-)</option>
                    </select>
                  </div>

                  <div></div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.peso}
                      onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="70.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.altura}
                      onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="175"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IMC
                    </label>
                    <input
                      type="text"
                      value={calculateIMC(formData.peso, formData.altura)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                      placeholder="Calculado automaticamente"
                    />
                    {calculateIMC(formData.peso, formData.altura) && (
                      <p className="text-sm text-gray-500 mt-1">
                        Classificação: {getIMCClassification(formData.peso, formData.altura)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={formData.alergias.possui}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        alergias: { ...formData.alergias, possui: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Possui Alergias</span>
                  </label>
                  {formData.alergias.possui && (
                    <textarea
                      value={formData.alergias.descricao}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        alergias: { ...formData.alergias, descricao: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Descreva as alergias..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicamentos em Uso
                  </label>
                  <textarea
                    value={formData.medicamentosUso}
                    onChange={(e) => setFormData({ ...formData, medicamentosUso: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Liste os medicamentos em uso contínuo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Histórico Médico
                  </label>
                  <textarea
                    value={formData.historicoMedico}
                    onChange={(e) => setFormData({ ...formData, historicoMedico: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Cirurgias anteriores, doenças crônicas, internações..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações Gerais
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Informações adicionais relevantes..."
                  />
                </div>
              </div>
            )}

            {/* Aba: Contato de Emergência */}
            {activeTab === 'emergencia' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Contato
                  </label>
                  <input
                    type="text"
                    value={formData.nomeContato}
                    onChange={(e) => setFormData({ ...formData, nomeContato: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parentesco
                  </label>
                  <input
                    type="text"
                    value={formData.parentescoContato}
                    onChange={(e) => setFormData({ ...formData, parentescoContato: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Cônjuge, Filho(a), Pai/Mãe"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone do Contato
                  </label>
                  <input
                    type="tel"
                    value={formData.telefoneContato}
                    onChange={(e) => handleTelefoneChange(e.target.value, 'telefoneContato')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-8888"
                    maxLength={15}
                  />
                </div>
              </div>
            )}

            {/* Aba: Acessibilidade */}
            {activeTab === 'acessibilidade' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Deficiências</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries({
                      auditiva: 'Deficiência Auditiva',
                      visual: 'Deficiência Visual',
                      fisica: 'Deficiência Física',
                      intelectual: 'Deficiência Intelectual',
                      multipla: 'Deficiência Múltipla'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.deficiencias[key as keyof typeof formData.deficiencias] as boolean}
                          onChange={(e) => setFormData({
                            ...formData,
                            deficiencias: {
                              ...formData.deficiencias,
                              [key]: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição das Deficiências
                    </label>
                    <textarea
                      value={formData.deficiencias.descricao}
                      onChange={(e) => setFormData({
                        ...formData,
                        deficiencias: { ...formData.deficiencias, descricao: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Detalhes sobre as deficiências..."
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Neurodivergências</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries({
                      autismo: 'Transtorno do Espectro Autista',
                      tdah: 'TDAH',
                      dislexia: 'Dislexia',
                      sindrome_down: 'Síndrome de Down',
                      outras: 'Outras'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.neurodivergencias[key as keyof typeof formData.neurodivergencias] as boolean}
                          onChange={(e) => setFormData({
                            ...formData,
                            neurodivergencias: {
                              ...formData.neurodivergencias,
                              [key]: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição das Neurodivergências
                    </label>
                    <textarea
                      value={formData.neurodivergencias.descricao}
                      onChange={(e) => setFormData({
                        ...formData,
                        neurodivergencias: { ...formData.neurodivergencias, descricao: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Detalhes sobre as neurodivergências..."
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Necessidades Especiais</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries({
                      cadeirante: 'Cadeirante',
                      acompanhante: 'Necessita Acompanhante',
                      interprete_libras: 'Intérprete de LIBRAS',
                      material_braille: 'Material em Braille'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.necessidadesEspeciais[key as keyof typeof formData.necessidadesEspeciais] as boolean}
                          onChange={(e) => setFormData({
                            ...formData,
                            necessidadesEspeciais: {
                              ...formData.necessidadesEspeciais,
                              [key]: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outras Necessidades Especiais
                    </label>
                    <textarea
                      value={formData.necessidadesEspeciais.outras}
                      onChange={(e) => setFormData({
                        ...formData,
                        necessidadesEspeciais: { ...formData.necessidadesEspeciais, outras: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Outras necessidades especiais..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isEditing ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
