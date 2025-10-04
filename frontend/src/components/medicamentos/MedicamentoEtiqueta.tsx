import React, { useState, useEffect } from 'react';

interface Medicamento {
  id: number;
  nome: string;
  principioAtivo: string;
  concentracao: string;
  lote: string;
  dataValidade: string;
  fabricante: string;
  codigoBarras?: string;
  qrCode?: string;
}

interface EtiquetaData {
  qrCodeImage: string;
  codigoBarrasImage: string;
  codigoBarrasTexto: string;
  qrCodeTexto: string;
}

interface MedicamentoEtiquetaProps {
  medicamento: Medicamento;
  onClose: () => void;
}

const MedicamentoEtiqueta: React.FC<MedicamentoEtiquetaProps> = ({ medicamento, onClose }) => {
  const [etiqueta, setEtiqueta] = useState<EtiquetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    gerarEtiqueta();
  }, [medicamento.id]);

  const gerarEtiqueta = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/medicamentos/${medicamento.id}/gerar-etiqueta`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar etiqueta');
      }

      const data = await response.json();
      setEtiqueta(data.etiqueta);
    } catch (err) {
      setError('Falha ao gerar etiqueta. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const imprimirEtiqueta = () => {
    window.print();
  };

  const baixarEtiqueta = () => {
    // Criar um canvas temporário para combinar QR Code e Código de Barras
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx || !etiqueta) return;

    canvas.width = 400;
    canvas.height = 600;

    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(medicamento.nome, canvas.width / 2, 30);

    // Informações do medicamento
    ctx.font = '12px Arial';
    ctx.fillText(`Lote: ${medicamento.lote}`, canvas.width / 2, 50);
    ctx.fillText(`Validade: ${new Date(medicamento.dataValidade).toLocaleDateString()}`, canvas.width / 2, 70);

    // QR Code
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, (canvas.width - 200) / 2, 90, 200, 200);

      // Código de Barras
      const barcodeImg = new Image();
      barcodeImg.onload = () => {
        ctx.drawImage(barcodeImg, (canvas.width - 300) / 2, 320, 300, 100);

        // Download
        const link = document.createElement('a');
        link.download = `etiqueta-${medicamento.nome.replace(/\s+/g, '-')}-${medicamento.lote}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      barcodeImg.src = etiqueta.codigoBarrasImage;
    };
    qrImg.src = etiqueta.qrCodeImage;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏷️</span>
              <div>
                <h2 className="text-2xl font-bold">Etiqueta do Medicamento</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Geração de QR Code e Código de Barras
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Gerando etiqueta...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {etiqueta && !loading && (
            <div>
              {/* Informações do Medicamento */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  {medicamento.nome}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Princípio Ativo:</span>
                    <p className="font-medium">{medicamento.principioAtivo}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Concentração:</span>
                    <p className="font-medium">{medicamento.concentracao}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Lote:</span>
                    <p className="font-medium">{medicamento.lote}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Validade:</span>
                    <p className="font-medium">
                      {new Date(medicamento.dataValidade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fabricante:</span>
                    <p className="font-medium">{medicamento.fabricante}</p>
                  </div>
                </div>
              </div>

              {/* Etiqueta para Impressão */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 bg-white print:border-solid print:border-black">
                <div className="text-center">
                  {/* QR Code */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-xl">📱</span>
                      <h4 className="font-semibold text-gray-700">QR Code</h4>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={etiqueta.qrCodeImage}
                        alt="QR Code"
                        className="w-48 h-48 border border-gray-200 rounded"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-mono break-all px-4">
                      {etiqueta.qrCodeTexto.length > 50 
                        ? `${etiqueta.qrCodeTexto.substring(0, 50)}...` 
                        : etiqueta.qrCodeTexto}
                    </p>
                  </div>

                  {/* Código de Barras */}
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-xl">▬▬▬</span>
                      <h4 className="font-semibold text-gray-700">Código de Barras</h4>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={etiqueta.codigoBarrasImage}
                        alt="Código de Barras"
                        className="max-w-full h-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-700 mt-2 font-mono font-semibold">
                      {etiqueta.codigoBarrasTexto}
                    </p>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>{medicamento.nome}</strong> | Lote: {medicamento.lote}
                    </p>
                    <p className="text-xs text-gray-600">
                      Val: {new Date(medicamento.dataValidade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 print:hidden">
                <button
                  onClick={imprimirEtiqueta}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <span className="text-xl">🖨️</span>
                  Imprimir Etiqueta
                </button>
                <button
                  onClick={baixarEtiqueta}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <span className="text-xl">💾</span>
                  Baixar Imagem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:border-solid,
          .print\\:border-solid * {
            visibility: visible;
          }
          .print\\:border-solid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default MedicamentoEtiqueta;
