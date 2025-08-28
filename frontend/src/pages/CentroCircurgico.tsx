import React, { useState } from 'react';

const CentroCircurgico: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  // Dados mockados de pacientes para cirurgia
  const pacientesCircurgia = [
    {
      id: '1',
      nome: 'Maria Silva Santos',
      idade: 45,
      numeroLeito: '302A',
      cirurgia: 'Apendicectomia',
      horario: '09:00',
      cirurgiao: 'Dr. Ana Rodriguez',
      alergias: ['Penicilina', 'Látex'],
      riscos: ['Hipertensão', 'Diabetes Tipo 2'],
      tipoSanguineo: 'O+',
      jejum: '12h',
      status: 'Aguardando',
      observacoes: 'Paciente com histórico de reação alérgica severa à penicilina'
    },
    {
      id: '2',
      nome: 'João Carlos Oliveira',
      idade: 68,
      numeroLeito: '205B',
      cirurgia: 'Revascularização do Miocárdio',
      horario: '13:30',
      cirurgiao: 'Dr. Ricardo Alves',
      alergias: ['Iodo'],
      riscos: ['Cardiopatia', 'Insuficiência Renal'],
      tipoSanguineo: 'A-',
      jejum: '8h',
      status: 'Em cirurgia',
      observacoes: 'Paciente de alto risco. Monitoramento cardíaco contínuo necessário'
    },
    {
      id: '3',
      nome: 'Ana Beatriz Costa',
      idade: 32,
      numeroLeito: '104C',
      cirurgia: 'Colecistectomia Laparoscópica',
      horario: '15:45',
      cirurgiao: 'Dr. Marina Santos',
      alergias: [],
      riscos: ['Obesidade'],
      tipoSanguineo: 'B+',
      jejum: '10h',
      status: 'Preparação',
      observacoes: 'Primeira cirurgia. Paciente ansiosa, necessário acompanhamento psicológico'
    }
  ];

  const pacienteSelecionado = pacientesCircurgia.find(p => p.id === selectedPatient);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando': return 'bg-yellow-100 text-yellow-800';
      case 'Em cirurgia': return 'bg-red-100 text-red-800';
      case 'Preparação': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiscoColor = (risco: string) => {
    const riscosAltos = ['Cardiopatia', 'Insuficiência Renal', 'Hipertensão'];
    return riscosAltos.includes(risco) ? 'text-red-600' : 'text-orange-600';
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <span className="text-green-500 text-3xl mr-3">🏥</span>
        <h1 className="text-3xl font-bold text-gray-900">Centro Cirúrgico</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Cirurgias Hoje</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <span className="text-blue-500 text-2xl">⚕️</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <span className="text-red-500 text-2xl">�</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pacientes Alto Risco</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <span className="text-orange-500 text-2xl">⚠️</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Material Usado</p>
              <p className="text-2xl font-bold text-gray-900">68 itens</p>
            </div>
            <span className="text-green-500 text-2xl">📋</span>
          </div>
        </div>
      </div>

      {/* Lista de Pacientes Programados */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacientes Programados para Cirurgia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pacientesCircurgia.map((paciente) => (
            <div 
              key={paciente.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedPatient === paciente.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedPatient(paciente.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{paciente.nome}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paciente.status)}`}>
                  {paciente.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Cirurgia:</span> {paciente.cirurgia}</p>
                <p><span className="font-medium">Horário:</span> {paciente.horario}</p>
                <p><span className="font-medium">Leito:</span> {paciente.numeroLeito}</p>
                <p><span className="font-medium">Cirurgião:</span> {paciente.cirurgiao}</p>
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
                      Riscos: {paciente.riscos.join(', ')}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Dados do Paciente</h4>
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
                  <span className="text-gray-600">Tipo Sanguíneo:</span>
                  <span className="font-medium">{pacienteSelecionado.tipoSanguineo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leito:</span>
                  <span className="font-medium">{pacienteSelecionado.numeroLeito}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jejum:</span>
                  <span className="font-medium">{pacienteSelecionado.jejum}</span>
                </div>
              </div>
            </div>

            {/* Alertas e Riscos */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Alertas Médicos</h4>
              
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-500 text-lg mr-2">📝</span>
                    <h5 className="font-medium text-blue-800">OBSERVAÇÕES</h5>
                  </div>
                  <p className="text-sm text-blue-700">{pacienteSelecionado.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Consumo Cirúrgico</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Paciente</label>
              <select 
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Selecione o paciente</option>
                {pacientesCircurgia.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nome} - {paciente.cirurgia}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Consumido</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option>Selecione um item</option>
                <option>Luvas Cirúrgicas</option>
                <option>Bisturi Descartável</option>
                <option>Fio de Sutura</option>
                <option>Soro Fisiológico</option>
                <option>Gaze Estéril</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                type="number"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                rows={3}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Registrar Consumo
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Cirurgias</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Maria Silva Santos - Apendicectomia</h4>
                <span className="text-sm text-gray-500">Hoje 09:00</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dr. Ana Rodriguez</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Luvas Cirúrgicas</span>
                  <span>30 pares</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bisturi Descartável</span>
                  <span>5 unidades</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">João Carlos - Revascularização</h4>
                <span className="text-sm text-gray-500">Hoje 13:30</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dr. Ricardo Alves</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Luvas Cirúrgicas</span>
                  <span>25 pares</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fio de Sutura</span>
                  <span>8 unidades</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentroCircurgico;
