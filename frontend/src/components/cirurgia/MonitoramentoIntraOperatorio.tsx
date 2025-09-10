import React, { useState } from 'react';

interface MonitoramentoIntraOperatorioProps {
  onMonitoramentoChange: (dados: any) => void;
  dadosAtuais?: any;
}

const MonitoramentoIntraOperatorio: React.FC<MonitoramentoIntraOperatorioProps> = ({ 
  onMonitoramentoChange, 
  dadosAtuais 
}) => {
  const [dados, setDados] = useState(dadosAtuais || {
    escalaRamsay: '',
    escalaAldrete: {
      atividade: 0,
      respiracao: 0,
      circulacao: 0,
      consciencia: 0,
      coloracao: 0,
      total: 0
    },
    sinaisVitais: [],
    medicamentos: [],
    intercorrencias: [],
    balancoHidrico: {
      entrada: 0,
      saida: 0,
      balanco: 0
    }
  });

  const escalaRamsayOpcoes = [
    { valor: '1', descricao: 'Ansioso, agitado ou inquieto' },
    { valor: '2', descricao: 'Cooperativo, orientado, tranquilo' },
    { valor: '3', descricao: 'Responde apenas a comandos' },
    { valor: '4', descricao: 'Resposta rápida à pressão glabelar ou estímulo sonoro alto' },
    { valor: '5', descricao: 'Resposta lenta à pressão glabelar ou estímulo sonoro alto' },
    { valor: '6', descricao: 'Sem resposta à pressão glabelar ou estímulo sonoro alto' }
  ];

  const aldreteOpcoes = {
    atividade: [
      { valor: 2, descricao: 'Move voluntariamente ou sob comando os 4 membros' },
      { valor: 1, descricao: 'Move voluntariamente ou sob comando 2 membros' },
      { valor: 0, descricao: 'Incapaz de mover membros voluntariamente ou sob comando' }
    ],
    respiracao: [
      { valor: 2, descricao: 'Respira profundamente e tosse livremente' },
      { valor: 1, descricao: 'Dispneia ou limitação respiratória' },
      { valor: 0, descricao: 'Apneico' }
    ],
    circulacao: [
      { valor: 2, descricao: 'PA ± 20mmHg do nível pré-operatório' },
      { valor: 1, descricao: 'PA ± 20-50mmHg do nível pré-operatório' },
      { valor: 0, descricao: 'PA ± 50mmHg do nível pré-operatório' }
    ],
    consciencia: [
      { valor: 2, descricao: 'Completamente acordado' },
      { valor: 1, descricao: 'Desperta quando chamado' },
      { valor: 0, descricao: 'Não responde' }
    ],
    coloracao: [
      { valor: 2, descricao: 'Rosada' },
      { valor: 1, descricao: 'Pálida, escura, icterícia' },
      { valor: 0, descricao: 'Cianótica' }
    ]
  };

  const handleEscalaAldreteChange = (categoria: string, valor: number) => {
    const novosDados = {
      ...dados,
      escalaAldrete: {
        ...dados.escalaAldrete,
        [categoria]: valor
      }
    };
    
    // Calcular total
    const total = Object.keys(aldreteOpcoes).reduce((soma, key) => {
      const valorCategoria = key === categoria ? valor : novosDados.escalaAldrete[key as keyof typeof aldreteOpcoes];
      return soma + (valorCategoria || 0);
    }, 0);
    
    novosDados.escalaAldrete.total = total;
    setDados(novosDados);
    onMonitoramentoChange(novosDados);
  };

  const adicionarSinalVital = () => {
    const novoSinal = {
      id: Date.now().toString(),
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      pa: '',
      fc: '',
      fr: '',
      spo2: '',
      temp: ''
    };
    
    const novosDados = {
      ...dados,
      sinaisVitais: [...dados.sinaisVitais, novoSinal]
    };
    
    setDados(novosDados);
    onMonitoramentoChange(novosDados);
  };

  const adicionarMedicamento = () => {
    const novoMedicamento = {
      id: Date.now().toString(),
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      medicamento: '',
      dose: '',
      via: 'EV',
      prescrito: ''
    };
    
    const novosDados = {
      ...dados,
      medicamentos: [...dados.medicamentos, novoMedicamento]
    };
    
    setDados(novosDados);
    onMonitoramentoChange(novosDados);
  };

  const adicionarIntercorrencia = () => {
    const novaIntercorrencia = {
      id: Date.now().toString(),
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      descricao: '',
      conduta: ''
    };
    
    const novosDados = {
      ...dados,
      intercorrencias: [...dados.intercorrencias, novaIntercorrencia]
    };
    
    setDados(novosDados);
    onMonitoramentoChange(novosDados);
  };

  return (
    <div className="space-y-6">
      {/* Escala de Sedação de Ramsay */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-md font-semibold mb-3 text-gray-700">Escala de Sedação de Ramsay</h4>
        <div className="space-y-2">
          {escalaRamsayOpcoes.map((opcao) => (
            <label key={opcao.valor} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="escalaRamsay"
                value={opcao.valor}
                checked={dados.escalaRamsay === opcao.valor}
                onChange={(e) => {
                  const novosDados = { ...dados, escalaRamsay: e.target.value };
                  setDados(novosDados);
                  onMonitoramentoChange(novosDados);
                }}
                className="mt-1"
              />
              <span className="text-sm">
                <strong>Nível {opcao.valor}:</strong> {opcao.descricao}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Índice de Aldrete-Kroulik */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-md font-semibold mb-3 text-gray-700">
          Índice de Aldrete-Kroulik 
          <span className="ml-2 text-lg font-bold text-green-600">
            (Total: {dados.escalaAldrete.total}/10)
          </span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(aldreteOpcoes).map(([categoria, opcoes]) => (
            <div key={categoria} className="space-y-2">
              <h5 className="font-medium text-gray-700 capitalize">
                {categoria === 'consciencia' ? 'Consciência' : 
                 categoria === 'respiracao' ? 'Respiração' :
                 categoria === 'circulacao' ? 'Circulação' :
                 categoria === 'coloracao' ? 'Coloração' : categoria}
              </h5>
              {opcoes.map((opcao) => (
                <label key={opcao.valor} className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={categoria}
                    value={opcao.valor}
                    checked={dados.escalaAldrete[categoria as keyof typeof dados.escalaAldrete] === opcao.valor}
                    onChange={(e) => handleEscalaAldreteChange(categoria, parseInt(e.target.value))}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    <strong>{opcao.valor}:</strong> {opcao.descricao}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
        
        <div className={`mt-4 p-3 rounded ${
          dados.escalaAldrete.total >= 9 ? 'bg-green-100 text-green-800' :
          dados.escalaAldrete.total >= 7 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          <strong>
            {dados.escalaAldrete.total >= 9 ? 'Alta para enfermaria liberada' :
             dados.escalaAldrete.total >= 7 ? 'Observação necessária' :
             'Manter em recuperação'}
          </strong>
        </div>
      </div>

      {/* Sinais Vitais */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-semibold text-gray-700">Controle de Sinais Vitais</h4>
          <button
            onClick={adicionarSinalVital}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            + Adicionar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Horário</th>
                <th className="text-left py-2">PA</th>
                <th className="text-left py-2">FC</th>
                <th className="text-left py-2">FR</th>
                <th className="text-left py-2">SpO2</th>
                <th className="text-left py-2">Temp</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.sinaisVitais.map((sinal: any, index: number) => (
                <tr key={sinal.id} className="border-b">
                  <td className="py-2">{sinal.horario}</td>
                  <td className="py-2">
                    <input
                      type="text"
                      value={sinal.pa}
                      onChange={(e) => {
                        const novosSinais = [...dados.sinaisVitais];
                        novosSinais[index].pa = e.target.value;
                        const novosDados = { ...dados, sinaisVitais: novosSinais };
                        setDados(novosDados);
                        onMonitoramentoChange(novosDados);
                      }}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="120/80"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="text"
                      value={sinal.fc}
                      onChange={(e) => {
                        const novosSinais = [...dados.sinaisVitais];
                        novosSinais[index].fc = e.target.value;
                        const novosDados = { ...dados, sinaisVitais: novosSinais };
                        setDados(novosDados);
                        onMonitoramentoChange(novosDados);
                      }}
                      className="w-16 px-2 py-1 border rounded text-sm"
                      placeholder="80"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="text"
                      value={sinal.fr}
                      onChange={(e) => {
                        const novosSinais = [...dados.sinaisVitais];
                        novosSinais[index].fr = e.target.value;
                        const novosDados = { ...dados, sinaisVitais: novosSinais };
                        setDados(novosDados);
                        onMonitoramentoChange(novosDados);
                      }}
                      className="w-16 px-2 py-1 border rounded text-sm"
                      placeholder="20"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="text"
                      value={sinal.spo2}
                      onChange={(e) => {
                        const novosSinais = [...dados.sinaisVitais];
                        novosSinais[index].spo2 = e.target.value;
                        const novosDados = { ...dados, sinaisVitais: novosSinais };
                        setDados(novosDados);
                        onMonitoramentoChange(novosDados);
                      }}
                      className="w-16 px-2 py-1 border rounded text-sm"
                      placeholder="98%"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="text"
                      value={sinal.temp}
                      onChange={(e) => {
                        const novosSinais = [...dados.sinaisVitais];
                        novosSinais[index].temp = e.target.value;
                        const novosDados = { ...dados, sinaisVitais: novosSinais };
                        setDados(novosDados);
                        onMonitoramentoChange(novosDados);
                      }}
                      className="w-16 px-2 py-1 border rounded text-sm"
                      placeholder="36.5"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => {
                        const novosSinais = dados.sinaisVitais.filter((_: any, i: number) => i !== index);
                        const novosDados = { ...dados, sinaisVitais: novosSinais };
                        setDados(novosDados);
                        onMonitoramentoChange(novosDados);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medicamentos */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-semibold text-gray-700">Medicamentos Administrados</h4>
          <button
            onClick={adicionarMedicamento}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          >
            + Adicionar
          </button>
        </div>
        
        <div className="space-y-3">
          {dados.medicamentos.map((med: any, index: number) => (
            <div key={med.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-white rounded border">
              <div>
                <label className="block text-xs text-gray-600">Horário</label>
                <input
                  type="time"
                  value={med.horario}
                  onChange={(e) => {
                    const novosMeds = [...dados.medicamentos];
                    novosMeds[index].horario = e.target.value;
                    const novosDados = { ...dados, medicamentos: novosMeds };
                    setDados(novosDados);
                    onMonitoramentoChange(novosDados);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Medicamento</label>
                <input
                  type="text"
                  value={med.medicamento}
                  onChange={(e) => {
                    const novosMeds = [...dados.medicamentos];
                    novosMeds[index].medicamento = e.target.value;
                    const novosDados = { ...dados, medicamentos: novosMeds };
                    setDados(novosDados);
                    onMonitoramentoChange(novosDados);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Nome do medicamento"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Dose</label>
                <input
                  type="text"
                  value={med.dose}
                  onChange={(e) => {
                    const novosMeds = [...dados.medicamentos];
                    novosMeds[index].dose = e.target.value;
                    const novosDados = { ...dados, medicamentos: novosMeds };
                    setDados(novosDados);
                    onMonitoramentoChange(novosDados);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Dosagem"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Via</label>
                <select
                  value={med.via}
                  onChange={(e) => {
                    const novosMeds = [...dados.medicamentos];
                    novosMeds[index].via = e.target.value;
                    const novosDados = { ...dados, medicamentos: novosMeds };
                    setDados(novosDados);
                    onMonitoramentoChange(novosDados);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="EV">EV</option>
                  <option value="IM">IM</option>
                  <option value="SC">SC</option>
                  <option value="VO">VO</option>
                  <option value="SL">SL</option>
                  <option value="Inalatória">Inalatória</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600">Prescrito por</label>
                <input
                  type="text"
                  value={med.prescrito}
                  onChange={(e) => {
                    const novosMeds = [...dados.medicamentos];
                    novosMeds[index].prescrito = e.target.value;
                    const novosDados = { ...dados, medicamentos: novosMeds };
                    setDados(novosDados);
                    onMonitoramentoChange(novosDados);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Médico"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const novosMeds = dados.medicamentos.filter((_: any, i: number) => i !== index);
                    const novosDados = { ...dados, medicamentos: novosMeds };
                    setDados(novosDados);
                    onMonitoramentoChange(novosDados);
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs w-full"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intercorrências */}
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-semibold text-gray-700">Intercorrências</h4>
          <button
            onClick={adicionarIntercorrencia}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            + Adicionar
          </button>
        </div>
        
        <div className="space-y-3">
          {dados.intercorrencias.map((inter: any, index: number) => (
            <div key={inter.id} className="p-3 bg-white rounded border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <div>
                  <label className="block text-xs text-gray-600">Horário</label>
                  <input
                    type="time"
                    value={inter.horario}
                    onChange={(e) => {
                      const novasInter = [...dados.intercorrencias];
                      novasInter[index].horario = e.target.value;
                      const novosDados = { ...dados, intercorrencias: novasInter };
                      setDados(novosDados);
                      onMonitoramentoChange(novosDados);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs text-gray-600">Descrição da Intercorrência</label>
                    <button
                      onClick={() => {
                        const novasInter = dados.intercorrencias.filter((_: any, i: number) => i !== index);
                        const novosDados = { ...dados, intercorrencias: novasInter };
                        setDados(novosDados);
                        onMonitoramentoChange(novosDados);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remover
                    </button>
                  </div>
                  <textarea
                    value={inter.descricao}
                    onChange={(e) => {
                      const novasInter = [...dados.intercorrencias];
                      novasInter[index].descricao = e.target.value;
                      const novosDados = { ...dados, intercorrencias: novasInter };
                      setDados(novosDados);
                      onMonitoramentoChange(novosDados);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                    rows={2}
                    placeholder="Descreva a intercorrência..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600">Conduta Tomada</label>
                <textarea
                  value={inter.conduta}
                  onChange={(e) => {
                    const novasInter = [...dados.intercorrencias];
                    novasInter[index].conduta = e.target.value;
                    const novosDados = { ...dados, intercorrencias: novasInter };
                    setDados(novosDados);
                    onMonitoramentoChange(novosDados);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  rows={2}
                  placeholder="Descreva a conduta tomada..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Balanço Hídrico */}
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h4 className="text-md font-semibold mb-3 text-gray-700">Balanço Hídrico (ml)</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entrada</label>
            <input
              type="number"
              value={dados.balancoHidrico.entrada}
              onChange={(e) => {
                const entrada = parseInt(e.target.value) || 0;
                const novoBalanco = {
                  ...dados.balancoHidrico,
                  entrada,
                  balanco: entrada - dados.balancoHidrico.saida
                };
                const novosDados = { ...dados, balancoHidrico: novoBalanco };
                setDados(novosDados);
                onMonitoramentoChange(novosDados);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saída</label>
            <input
              type="number"
              value={dados.balancoHidrico.saida}
              onChange={(e) => {
                const saida = parseInt(e.target.value) || 0;
                const novoBalanco = {
                  ...dados.balancoHidrico,
                  saida,
                  balanco: dados.balancoHidrico.entrada - saida
                };
                const novosDados = { ...dados, balancoHidrico: novoBalanco };
                setDados(novosDados);
                onMonitoramentoChange(novosDados);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balanço</label>
            <input
              type="number"
              value={dados.balancoHidrico.balanco}
              readOnly
              className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 ${
                dados.balancoHidrico.balanco > 0 ? 'text-green-600' : 
                dados.balancoHidrico.balanco < 0 ? 'text-red-600' : 'text-gray-600'
              }`}
            />
          </div>
          <div className="flex items-end">
            <div className={`px-3 py-2 rounded text-sm font-medium ${
              dados.balancoHidrico.balanco > 0 ? 'bg-green-100 text-green-800' :
              dados.balancoHidrico.balanco < 0 ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {dados.balancoHidrico.balanco > 0 ? 'Positivo' :
               dados.balancoHidrico.balanco < 0 ? 'Negativo' : 'Neutro'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoramentoIntraOperatorio;
