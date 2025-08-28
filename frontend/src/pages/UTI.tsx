import React, { useState } from 'react';

const UTI: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  // Dados mockados de pacientes na UTI
  const pacientesUTI = [
    {
      id: '1',
      nome: 'Carlos Eduardo Silva',
      idade: 58,
      numeroLeito: 'UTI-01',
      internacao: '3 dias',
      diagnostico: 'Infarto Agudo do Miocárdio',
      estado: 'Estável',
      medico: 'Dr. Fernando Cardoso',
      alergias: ['Aspirina', 'Morfina'],
      riscos: ['Cardiopatia Severa', 'Hipertensão'],
      tipoSanguineo: 'A+',
      ventilacao: 'Mecânica',
      medicacoes: ['Dopamina', 'Heparina', 'Furosemida'],
      observacoes: 'Paciente com histórico de IAM. Monitoramento cardíaco contínuo necessário',
      nivelConsciencia: 'Sedado',
      status: 'Crítico'
    },
    {
      id: '2',
      nome: 'Rosa Maria Santos',
      idade: 72,
      numeroLeito: 'UTI-03',
      internacao: '7 dias',
      diagnostico: 'Pneumonia Grave + COVID-19',
      estado: 'Instável',
      medico: 'Dra. Lucia Mendes',
      alergias: ['Penicilina'],
      riscos: ['Insuficiência Respiratória', 'Diabetes'],
      tipoSanguineo: 'O-',
      ventilacao: 'Invasiva',
      medicacoes: ['Antibióticos', 'Corticoides', 'Insulina'],
      observacoes: 'Paciente idosa com quadro respiratório grave. Isolamento de precaução',
      nivelConsciencia: 'Responsiva',
      status: 'Crítico'
    },
    {
      id: '3',
      nome: 'Miguel Andrade Costa',
      idade: 34,
      numeroLeito: 'UTI-05',
      internacao: '2 dias',
      diagnostico: 'Traumatismo Craniano',
      estado: 'Estável',
      medico: 'Dr. Paulo Neurocirurgião',
      alergias: [],
      riscos: ['Hipertensão Intracraniana'],
      tipoSanguineo: 'B+',
      ventilacao: 'Espontânea',
      medicacoes: ['Manitol', 'Fenitoína'],
      observacoes: 'Vítima de acidente automobilístico. Monitoramento neurológico rigoroso',
      nivelConsciencia: 'Confuso',
      status: 'Moderado'
    },
    {
      id: '4',
      nome: 'Elena Rodriguez Lima',
      idade: 29,
      numeroLeito: 'UTI-07',
      internacao: '1 dia',
      diagnostico: 'Pós-operatório Cesariana com Complicações',
      estado: 'Estável',
      medico: 'Dra. Isabel Obstetrícia',
      alergias: ['Látex'],
      riscos: ['Hemorragia Pós-parto'],
      tipoSanguineo: 'AB+',
      ventilacao: 'Espontânea',
      medicacoes: ['Ocitocina', 'Antibióticos'],
      observacoes: 'Puérpera com sangramento pós-cirúrgico controlado. Acompanhar sinais vitais',
      nivelConsciencia: 'Alerta',
      status: 'Estável'
    }
  ];

  const pacienteSelecionado = pacientesUTI.find(p => p.id === selectedPatient);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Crítico': return 'bg-red-100 text-red-800 border-red-200';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Estável': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Instável': return 'text-red-600';
      case 'Estável': return 'text-green-600';
      default: return 'text-yellow-600';
    }
  };

  const getRiscoColor = (risco: string) => {
    const riscosAltos = ['Cardiopatia Severa', 'Insuficiência Respiratória', 'Hipertensão Intracraniana', 'Hemorragia Pós-parto'];
    return riscosAltos.includes(risco) ? 'text-red-600' : 'text-orange-600';
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <span className="text-3xl mr-3">💓</span>
        <h1 className="text-3xl font-bold text-gray-900">Controle UTI</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pacientes Internados</p>
              <p className="text-2xl font-bold text-gray-900">{pacientesUTI.length}</p>
            </div>
            <span className="text-blue-500 text-2xl">🏥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Estado Crítico</p>
              <p className="text-2xl font-bold text-gray-900">
                {pacientesUTI.filter(p => p.status === 'Crítico').length}
              </p>
            </div>
            <span className="text-red-500 text-2xl">🚨</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ventilação Mecânica</p>
              <p className="text-2xl font-bold text-gray-900">
                {pacientesUTI.filter(p => p.ventilacao === 'Mecânica' || p.ventilacao === 'Invasiva').length}
              </p>
            </div>
            <span className="text-purple-500 text-2xl">🫁</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Consumo Hoje</p>
              <p className="text-2xl font-bold text-gray-900">47 itens</p>
            </div>
            <span className="text-green-500 text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Lista de Pacientes na UTI */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacientes na UTI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pacientesUTI.map((paciente) => (
            <div 
              key={paciente.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedPatient === paciente.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              } ${getStatusColor(paciente.status)}`}
              onClick={() => setSelectedPatient(paciente.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{paciente.nome}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(paciente.status)}`}>
                  {paciente.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Leito:</span> {paciente.numeroLeito}</p>
                <p><span className="font-medium">Diagnóstico:</span> {paciente.diagnostico}</p>
                <p><span className="font-medium">Estado:</span> 
                  <span className={`ml-1 font-medium ${getEstadoColor(paciente.estado)}`}>
                    {paciente.estado}
                  </span>
                </p>
                <p><span className="font-medium">Ventilação:</span> {paciente.ventilacao}</p>
                <p><span className="font-medium">Internação:</span> {paciente.internacao}</p>
              </div>

              {/* Alertas Rápidos */}
              <div className="mt-3 space-y-1">
                {paciente.alergias.length > 0 && (
                  <div className="flex items-center text-xs">
                    <span className="text-red-500 mr-1">🚨</span>
                    <span className="text-red-600 font-medium">
                      Alergias: {paciente.alergias.join(', ')}
                    </span>
                  </div>
                )}
                {paciente.riscos.length > 0 && (
                  <div className="flex items-center text-xs">
                    <span className="text-orange-500 mr-1">⚠️</span>
                    <span className="text-orange-600 font-medium">
                      {paciente.riscos[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhes do Paciente Selecionado */}
      {pacienteSelecionado && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações Detalhadas - {pacienteSelecionado.nome}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações Clínicas */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Dados Clínicos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium">{pacienteSelecionado.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-medium">{pacienteSelecionado.idade} anos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leito:</span>
                  <span className="font-medium">{pacienteSelecionado.numeroLeito}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo Sanguíneo:</span>
                  <span className="font-medium">{pacienteSelecionado.tipoSanguineo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Internação:</span>
                  <span className="font-medium">{pacienteSelecionado.internacao}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Médico:</span>
                  <span className="font-medium">{pacienteSelecionado.medico}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consciência:</span>
                  <span className="font-medium">{pacienteSelecionado.nivelConsciencia}</span>
                </div>
              </div>

              {/* Medicações */}
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-2">Medicações em Uso</h5>
                <div className="space-y-1">
                  {pacienteSelecionado.medicacoes.map((med, index) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Alertas e Riscos */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Alertas Médicos</h4>
              
              {/* Diagnóstico */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-center mb-2">
                  <span className="text-blue-500 text-lg mr-2">🏥</span>
                  <h5 className="font-medium text-blue-800">DIAGNÓSTICO</h5>
                </div>
                <p className="text-sm text-blue-700 font-medium">{pacienteSelecionado.diagnostico}</p>
              </div>

              {/* Alergias */}
              {pacienteSelecionado.alergias.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-2">
                    <span className="text-red-500 text-lg mr-2">🚨</span>
                    <h5 className="font-medium text-red-800">ALERGIAS CONHECIDAS</h5>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {pacienteSelecionado.alergias.map((alergia, index) => (
                      <li key={index} className="font-medium">{alergia}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Riscos */}
              {pacienteSelecionado.riscos.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-2">
                    <span className="text-orange-500 text-lg mr-2">⚠️</span>
                    <h5 className="font-medium text-orange-800">FATORES DE RISCO</h5>
                  </div>
                  <ul className="list-disc list-inside text-sm">
                    {pacienteSelecionado.riscos.map((risco, index) => (
                      <li key={index} className={`font-medium ${getRiscoColor(risco)}`}>
                        {risco}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Observações */}
              {pacienteSelecionado.observacoes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 text-lg mr-2">📝</span>
                    <h5 className="font-medium text-gray-800">OBSERVAÇÕES</h5>
                  </div>
                  <p className="text-sm text-gray-700">{pacienteSelecionado.observacoes}</p>
                </div>
              )}
            </div>

            {/* Estado Atual */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Estado Atual</h4>
              
              <div className="space-y-3">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estado Geral:</span>
                    <span className={`font-medium ${getEstadoColor(pacienteSelecionado.estado)}`}>
                      {pacienteSelecionado.estado}
                    </span>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ventilação:</span>
                    <span className="font-medium">{pacienteSelecionado.ventilacao}</span>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nível de Consciência:</span>
                    <span className="font-medium">{pacienteSelecionado.nivelConsciencia}</span>
                  </div>
                </div>

                <div className={`border rounded-lg p-3 ${getStatusColor(pacienteSelecionado.status)}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status Geral:</span>
                    <span className="font-bold">{pacienteSelecionado.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrar Consumo UTI */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Consumo UTI</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Paciente</label>
              <select 
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Selecione o paciente</option>
                {pacientesUTI.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nome} - {paciente.numeroLeito}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Item/Medicamento</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option>Selecione um item</option>
                <option>Soro Fisiológico 500ml</option>
                <option>Dipirona 500mg</option>
                <option>Morfina 10mg</option>
                <option>Heparina 5000UI</option>
                <option>Furosemida 40mg</option>
                <option>Dopamina 250mg</option>
                <option>Gaze Estéril</option>
                <option>Luvas Descartáveis</option>
                <option>Cateter Venoso</option>
                <option>Seringa 20ml</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                type="number"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: 2 ampolas, 1 unidade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Uso</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option>Selecione o tipo</option>
                <option>Medicação Prescrita</option>
                <option>Procedimento de Rotina</option>
                <option>Emergência Médica</option>
                <option>Cuidados de Enfermagem</option>
                <option>Exame/Monitoramento</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profissional Responsável</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option>Selecione o profissional</option>
                <option>Dr. Fernando Cardoso</option>
                <option>Dra. Lucia Mendes</option>
                <option>Dr. Paulo Neurocirurgião</option>
                <option>Dra. Isabel Obstetrícia</option>
                <option>Enfª Maria Silva</option>
                <option>Enfº João Santos</option>
                <option>Téc. Ana Costa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                rows={3}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Observações sobre o uso do item ou medicamento"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              💊 Registrar Consumo
            </button>
          </form>
        </div>

        {/* Histórico de Consumo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Movimentações UTI</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Carlos Eduardo - UTI-01</h4>
                <span className="text-sm text-gray-500">Hoje 14:30</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dr. Fernando Cardoso</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Soro Fisiológico 500ml</span>
                  <span className="text-blue-600 font-medium">2 unidades</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dopamina 250mg</span>
                  <span className="text-blue-600 font-medium">1 ampola</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Medicação Prescrita</span>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Rosa Maria - UTI-03</h4>
                <span className="text-sm text-gray-500">Hoje 13:45</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Enfª Maria Silva</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Gaze Estéril</span>
                  <span className="text-green-600 font-medium">10 pacotes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Luvas Descartáveis</span>
                  <span className="text-green-600 font-medium">6 pares</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Cuidados de Enfermagem</span>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Miguel Andrade - UTI-05</h4>
                <span className="text-sm text-gray-500">Hoje 12:20</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dr. Paulo Neurocirurgião</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Manitol 20%</span>
                  <span className="text-purple-600 font-medium">1 frasco</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cateter Venoso</span>
                  <span className="text-purple-600 font-medium">1 unidade</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Emergência Médica</span>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Elena Rodriguez - UTI-07</h4>
                <span className="text-sm text-gray-500">Hoje 11:15</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dra. Isabel Obstetrícia</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Ocitocina 5UI</span>
                  <span className="text-pink-600 font-medium">2 ampolas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Soro Glicosado 5%</span>
                  <span className="text-pink-600 font-medium">1 frasco</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Procedimento de Rotina</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UTI;
