import React from 'react';

interface BodyMarker {
  x: number;
  y: number;
  note: string;
  id: string;
}

interface HumanBodyDiagramProps {
  markers: BodyMarker[];
  onAddMarker: (marker: Omit<BodyMarker, 'id'>) => void;
  onRemoveMarker: (id: string) => void;
}

const HumanBodyDiagram: React.FC<HumanBodyDiagramProps> = ({
  markers,
  onAddMarker,
  onRemoveMarker
}) => {
  const handleBodyClick = (event: React.MouseEvent<HTMLDivElement>, view: 'front' | 'back') => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    const note = prompt('Digite uma observação para este ponto:');
    if (note) {
      const markerWithView = {
        x,
        y,
        note: `${note} (${view === 'front' ? 'Frente' : 'Costas'})`
      };
      onAddMarker(markerWithView);
    }
  };

  const FrontBodySVG = () => (
    <img
      src="/images/corpo-frente.png"
      alt="Vista frontal do corpo humano"
      className="w-full h-full object-contain"
      style={{ 
        objectPosition: 'center center'
      }}
    />
  );

  const BackBodySVG = () => (
    <img
      src="/images/corpo-verso.png"
      alt="Vista traseira do corpo humano"
      className="w-full h-full object-contain"
      style={{ 
        objectPosition: 'center center'
      }}
    />
  );

  const frontMarkers = markers.filter(marker => marker.note.includes('(Frente)'));
  const backMarkers = markers.filter(marker => marker.note.includes('(Costas)'));

  return (
    <div className="space-y-6">
      {/* Título e instruções */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Diagrama Corporal</h3>
        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Instruções:</strong> Clique nos diagramas corporais abaixo para marcar pontos de intervenção cirúrgica.
          A vista frontal está à esquerda e a vista traseira à direita.
        </p>
      </div>

      {/* Diagramas lado a lado */}
      <div className="flex justify-center gap-8">
        {/* Vista Frontal */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Vista Frontal</h4>
          <div className="relative w-80 h-96 border-2 border-blue-300 rounded-lg bg-gradient-to-b from-blue-50 to-white shadow-lg">
            <div 
              className="relative w-full h-full cursor-crosshair p-4"
              onClick={(e) => handleBodyClick(e, 'front')}
            >
              <FrontBodySVG />
              
              {/* Marcadores da vista frontal */}
              {frontMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2 hover:scale-125 transition-all duration-200"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  title={marker.note}
                >
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg">
                    {marker.note.replace(' (Frente)', '')}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicador da vista */}
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Frente
            </div>
          </div>
        </div>

        {/* Vista Traseira */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Vista Traseira</h4>
          <div className="relative w-80 h-96 border-2 border-green-300 rounded-lg bg-gradient-to-b from-green-50 to-white shadow-lg">
            <div 
              className="relative w-full h-full cursor-crosshair p-4"
              onClick={(e) => handleBodyClick(e, 'back')}
            >
              <BackBodySVG />
              
              {/* Marcadores da vista traseira */}
              {backMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2 hover:scale-125 transition-all duration-200"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  title={marker.note}
                >
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg">
                    {marker.note.replace(' (Costas)', '')}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicador da vista */}
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Costas
            </div>
          </div>
        </div>
      </div>

      {/* Marcações registradas */}
      {markers.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Marcações Registradas ({markers.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {markers.map((marker) => (
              <div key={marker.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 break-words">
                        {marker.note.replace(/ \((Frente|Costas)\)/, '')}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          marker.note.includes('(Frente)') 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {marker.note.includes('(Frente)') ? '👤 Vista Frontal' : '🔄 Vista Traseira'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveMarker(marker.id)}
                    className="ml-3 text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                    title="Remover marcação"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HumanBodyDiagram;
