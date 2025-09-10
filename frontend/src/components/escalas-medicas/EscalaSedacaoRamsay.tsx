import React from 'react';
import { ESCALA_RAMSAY } from '../../types/centro-cirurgico';

interface EscalaSedacaoRamsayProps {
  valor: number;
  horario: string;
  onChange: (valor: number, horario: string) => void;
  readOnly?: boolean;
}

const EscalaSedacaoRamsay: React.FC<EscalaSedacaoRamsayProps> = ({
  valor,
  horario,
  onChange,
  readOnly = false
}) => {
  const getCorEscala = (valorEscala: number) => {
    if (valorEscala >= 5) return 'bg-green-100 border-green-500 text-green-800';
    if (valorEscala >= 3) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    return 'bg-red-100 border-red-500 text-red-800';
  };

  const handleValueChange = (novoValor: number) => {
    if (!readOnly) {
      onChange(novoValor, horario);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Escala de Sedação Ramsay
        </h3>
        <span className="text-sm text-gray-600">
          Horário: {horario}
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(ESCALA_RAMSAY).map(([key, descricao]) => {
          const valorEscala = parseInt(key);
          const isSelected = valor === valorEscala;
          
          return (
            <label
              key={key}
              className={`
                flex items-center p-3 border rounded-lg cursor-pointer transition-all
                ${isSelected 
                  ? getCorEscala(valorEscala)
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }
                ${readOnly ? 'cursor-not-allowed' : 'hover:shadow-sm'}
              `}
            >
              <input
                type="radio"
                name="escala-ramsay"
                value={valorEscala}
                checked={isSelected}
                onChange={() => handleValueChange(valorEscala)}
                disabled={readOnly}
                className="mr-3"
              />
              <div>
                <div className="font-medium">
                  Nível {valorEscala}
                </div>
                <div className="text-sm">
                  {descricao}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="text-sm text-blue-800">
          <strong>Valor Normal:</strong> 5 a 6 (Respiração lenta a estímulo / Não responde)
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Valor atual: <span className={`font-bold ${valor >= 5 ? 'text-green-600' : valor >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
            {valor} - {ESCALA_RAMSAY[valor as keyof typeof ESCALA_RAMSAY]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EscalaSedacaoRamsay;
