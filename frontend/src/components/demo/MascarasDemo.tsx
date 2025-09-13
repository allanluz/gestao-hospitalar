import React, { useState } from 'react';
import { formatarCPF, validarCPF, formatarRG, formatarTelefone } from '../../utils/formatters';

const MascarasDemo: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleCpfChange = (value: string) => {
    const cpfFormatado = formatarCPF(value);
    setCpf(cpfFormatado);
  };

  const handleRgChange = (value: string) => {
    const rgFormatado = formatarRG(value);
    setRg(rgFormatado);
  };

  const handleTelefoneChange = (value: string) => {
    const telefoneFormatado = formatarTelefone(value);
    setTelefone(telefoneFormatado);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Demo - Máscaras Automáticas</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF
          </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => handleCpfChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              cpf.length === 14 ? (validarCPF(cpf) ? 'border-green-300' : 'border-red-300') : 'border-gray-300'
            }`}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {cpf.length === 14 && (
            <p className={`text-sm mt-1 ${validarCPF(cpf) ? 'text-green-600' : 'text-red-600'}`}>
              {validarCPF(cpf) ? '✅ CPF válido' : '❌ CPF inválido'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RG
          </label>
          <input
            type="text"
            value={rg}
            onChange={(e) => handleRgChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="00.000.000-0"
            maxLength={12}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="(11) 99999-8888"
            maxLength={15}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">Valores formatados:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>CPF:</strong> {cpf}</div>
          <div><strong>RG:</strong> {rg}</div>
          <div><strong>Telefone:</strong> {telefone}</div>
        </div>
      </div>
    </div>
  );
};

export default MascarasDemo;
