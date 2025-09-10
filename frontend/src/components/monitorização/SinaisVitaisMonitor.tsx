import React, { useState, useEffect } from 'react';
import { SinaisVitais } from '../../types/centro-cirurgico';

interface SinaisVitaisMonitorProps {
  sinaisVitais: SinaisVitais[];
  onAdicionarSinaisVitais: (sinais: Omit<SinaisVitais, 'hora'>) => void;
  readOnly?: boolean;
}

const SinaisVitaisMonitor: React.FC<SinaisVitaisMonitorProps> = ({
  sinaisVitais,
  onAdicionarSinaisVitais,
  readOnly = false
}) => {
  const [novosSinais, setNovosSinais] = useState<Omit<SinaisVitais, 'hora'>>({
    pa: '',
    fc: 0,
    fr: 0,
    so2: 0,
    temperatura: 0
  });

  const [intervaloAutomatico, setIntervaloAutomatico] = useState(false);
  const [intervaloMinutos, setIntervaloMinutos] = useState(15);

  useEffect(() => {
    if (intervaloAutomatico && !readOnly) {
      const interval = setInterval(() => {
        // Aqui você poderia integrar com equipamentos médicos
        console.log('Coletando sinais vitais automaticamente...');
      }, intervaloMinutos * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [intervaloAutomatico, intervaloMinutos, readOnly]);

  const handleInputChange = (campo: string, valor: string | number) => {
    setNovosSinais(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleAdicionarSinais = () => {
    if (novosSinais.pa && novosSinais.fc && novosSinais.fr && novosSinais.so2 && novosSinais.temperatura) {
      onAdicionarSinaisVitais(novosSinais);
      
      // Reset form
      setNovosSinais({
        pa: '',
        fc: 0,
        fr: 0,
        so2: 0,
        temperatura: 0
      });
    }
  };

  const getCorAlerta = (campo: string, valor: number) => {
    const alertas = {
      fc: { min: 60, max: 100 },
      fr: { min: 12, max: 20 },
      so2: { min: 95, max: 100 },
      temperatura: { min: 36, max: 37.5 }
    };

    const alerta = alertas[campo as keyof typeof alertas];
    if (!alerta) return '';

    if (valor < alerta.min || valor > alerta.max) {
      return 'text-red-600 bg-red-50 border-red-300';
    }
    return 'text-green-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Monitor de Sinais Vitais
        </h3>
        {!readOnly && (
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={intervaloAutomatico}
                onChange={(e) => setIntervaloAutomatico(e.target.checked)}
                className="mr-1"
              />
              Coleta automática a cada
            </label>
            <select
              value={intervaloMinutos}
              onChange={(e) => setIntervaloMinutos(parseInt(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
        )}
      </div>

      {/* Formulário para novos sinais vitais */}
      {!readOnly && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-blue-800 mb-3">Registrar Novos Sinais Vitais</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PA (mmHg)
              </label>
              <input
                type="text"
                placeholder="120x80"
                value={novosSinais.pa}
                onChange={(e) => handleInputChange('pa', e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FC (bpm)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                value={novosSinais.fc || ''}
                onChange={(e) => handleInputChange('fc', parseInt(e.target.value) || 0)}
                className={`w-full border rounded px-3 py-2 text-sm ${getCorAlerta('fc', novosSinais.fc)}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FR (irpm)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={novosSinais.fr || ''}
                onChange={(e) => handleInputChange('fr', parseInt(e.target.value) || 0)}
                className={`w-full border rounded px-3 py-2 text-sm ${getCorAlerta('fr', novosSinais.fr)}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SatO₂ (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={novosSinais.so2 || ''}
                onChange={(e) => handleInputChange('so2', parseInt(e.target.value) || 0)}
                className={`w-full border rounded px-3 py-2 text-sm ${getCorAlerta('so2', novosSinais.so2)}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="45"
                value={novosSinais.temperatura || ''}
                onChange={(e) => handleInputChange('temperatura', parseFloat(e.target.value) || 0)}
                className={`w-full border rounded px-3 py-2 text-sm ${getCorAlerta('temperatura', novosSinais.temperatura)}`}
              />
            </div>
          </div>

          <button
            onClick={handleAdicionarSinais}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Registrar Sinais Vitais
          </button>
        </div>
      )}

      {/* Tabela de sinais vitais registrados */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Horário</th>
              <th className="border border-gray-300 px-4 py-2 text-center">PA (mmHg)</th>
              <th className="border border-gray-300 px-4 py-2 text-center">FC (bpm)</th>
              <th className="border border-gray-300 px-4 py-2 text-center">FR (irpm)</th>
              <th className="border border-gray-300 px-4 py-2 text-center">SatO₂ (%)</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Temp (°C)</th>
            </tr>
          </thead>
          <tbody>
            {sinaisVitais.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  Nenhum registro de sinais vitais encontrado
                </td>
              </tr>
            ) : (
              sinaisVitais.map((sinais, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    {sinais.hora}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {sinais.pa}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 text-center ${getCorAlerta('fc', sinais.fc)}`}>
                    {sinais.fc}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 text-center ${getCorAlerta('fr', sinais.fr)}`}>
                    {sinais.fr}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 text-center ${getCorAlerta('so2', sinais.so2)}`}>
                    {sinais.so2}%
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 text-center ${getCorAlerta('temperatura', sinais.temperatura)}`}>
                    {sinais.temperatura}°C
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Alertas e valores normais */}
      <div className="mt-4 text-xs text-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <strong>FC Normal:</strong> 60-100 bpm
          </div>
          <div>
            <strong>FR Normal:</strong> 12-20 irpm
          </div>
          <div>
            <strong>SatO₂ Normal:</strong> ≥95%
          </div>
          <div>
            <strong>Temp Normal:</strong> 36-37.5°C
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinaisVitaisMonitor;
