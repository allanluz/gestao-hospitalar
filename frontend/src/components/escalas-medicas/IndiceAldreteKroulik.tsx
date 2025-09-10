import React from 'react';

interface IndiceAldreteKroulikProps {
  criterios: {
    movimentacao: number;
    respiracao: number;
    pressaoArterial: number;
    consciencia: number;
    saturacaoO2: number;
  };
  onChange: (criterios: any) => void;
  readOnly?: boolean;
}

const IndiceAldreteKroulik: React.FC<IndiceAldreteKroulikProps> = ({
  criterios,
  onChange,
  readOnly = false
}) => {
  const total = Object.values(criterios).reduce((sum, valor) => sum + valor, 0);
  const aptoParaAlta = total >= 8;

  const criteriosDefinicao = {
    movimentacao: {
      2: "Movimentar os quatro membros",
      1: "Movimentar dois membros", 
      0: "Incapaz de mover membros voluntariamente ou sob comando"
    },
    respiracao: {
      2: "Capaz de respirar profundamente ou tossir",
      1: "Dispinéia ou limitação da respiração",
      0: "Apnéia"
    },
    pressaoArterial: {
      2: "PA ±20% do nível pré-anestésico",
      1: "PA ±20-49% do nível pré-anestésico", 
      0: "PA ±50% do nível pré-anestésico"
    },
    consciencia: {
      2: "Lúcido e orientado no tempo e no espaço",
      1: "Desperta, se solicitado",
      0: "Não responde"
    },
    saturacaoO2: {
      2: "Capaz de manter saturação de O₂ maior que 92%",
      1: "Necessita de O₂ para manter saturação maior que 90%",
      0: "Saturação de O₂ menor que 90% com uso de oxigênio"
    }
  };

  const handleCriterioChange = (criterio: string, valor: number) => {
    if (!readOnly) {
      onChange({
        ...criterios,
        [criterio]: valor
      });
    }
  };

  const getCorTotal = () => {
    if (total >= 8) return 'text-green-600 bg-green-100 border-green-500';
    if (total >= 6) return 'text-yellow-600 bg-yellow-100 border-yellow-500';
    return 'text-red-600 bg-red-100 border-red-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Índice de Aldrete-Kroulik
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Avaliação para Alta da Sala de Recuperação
      </p>

      <div className="space-y-6">
        {Object.entries(criteriosDefinicao).map(([criterio, opcoes]) => (
          <div key={criterio} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3 capitalize">
              {criterio === 'pressaoArterial' ? 'Pressão Arterial' : 
               criterio === 'saturacaoO2' ? 'Saturação de O₂' :
               criterio}
            </h4>
            
            <div className="space-y-2">
              {Object.entries(opcoes).map(([pontos, descricao]) => {
                const pontosNum = parseInt(pontos);
                const isSelected = criterios[criterio as keyof typeof criterios] === pontosNum;
                
                return (
                  <label
                    key={pontos}
                    className={`
                      flex items-center p-3 border rounded cursor-pointer transition-all
                      ${isSelected 
                        ? pontosNum === 2 ? 'bg-green-100 border-green-500' :
                          pontosNum === 1 ? 'bg-yellow-100 border-yellow-500' :
                          'bg-red-100 border-red-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }
                      ${readOnly ? 'cursor-not-allowed' : 'hover:shadow-sm'}
                    `}
                  >
                    <input
                      type="radio"
                      name={`criterio-${criterio}`}
                      value={pontosNum}
                      checked={isSelected}
                      onChange={() => handleCriterioChange(criterio, pontosNum)}
                      disabled={readOnly}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">
                        {pontos} {pontos === '1' ? 'ponto' : 'pontos'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {descricao}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Resultado */}
      <div className={`mt-6 p-4 border-2 rounded-lg ${getCorTotal()}`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-bold">
              Total: {total}/10 pontos
            </div>
            <div className="text-sm">
              {aptoParaAlta ? '✅ APTO para alta' : '❌ NÃO apto para alta'}
            </div>
          </div>
          <div className="text-right text-sm">
            <div>Critério: ≥ 8 pontos</div>
            <div>Normal: 8 a 10 pontos</div>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 text-xs text-gray-500">
        <strong>Interpretação:</strong><br/>
        • 8-10 pontos: Apto para alta da recuperação<br/>
        • 6-7 pontos: Observação adicional necessária<br/>
        • 0-5 pontos: Permanência obrigatória na recuperação
      </div>
    </div>
  );
};

export default IndiceAldreteKroulik;
