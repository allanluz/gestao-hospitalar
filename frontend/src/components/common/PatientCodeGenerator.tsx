import React from 'react';
import QRCode from 'react-qr-code';
import JsBarcode from 'jsbarcode';
import { Paciente } from '../../types';

interface PatientCodeGeneratorProps {
  paciente: Paciente;
  tipo: 'qrcode' | 'barcode';
  onClose: () => void;
}

const PatientCodeGenerator: React.FC<PatientCodeGeneratorProps> = ({
  paciente,
  tipo,
  onClose
}) => {
  const generatePatientCode = () => {
    // Gera um código único baseado no CPF e ID do paciente
    return `PAC${paciente.id.toString().padStart(6, '0')}${paciente.cpf.replace(/\D/g, '')}`;
  };

  const generatePatientData = () => {
    // Dados do paciente em formato JSON para QR Code
    return JSON.stringify({
      id: paciente.id,
      nome: paciente.nome,
      cpf: paciente.cpf,
      dataNascimento: paciente.dataNascimento,
      tipoSanguineo: paciente.tipoSanguineo,
      convenio: paciente.convenio,
      deficiencias: paciente.deficiencias,
      neurodivergencias: paciente.neurodivergencias,
      necessidadesEspeciais: paciente.necessidadesEspeciais,
      alergias: paciente.alergias,
      timestamp: new Date().toISOString()
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = document.getElementById('codigo-impressao')?.innerHTML;
      printWindow.document.write(`
        <html>
          <head>
            <title>Código de Identificação - ${paciente.nome}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .patient-info {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                width: 100%;
                max-width: 400px;
              }
              .code-container {
                text-align: center;
                margin: 20px 0;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Hospital - Identificação do Paciente</h2>
            </div>
            ${content}
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const generateBarcode = () => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, generatePatientCode(), {
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: true
    });
    return canvas.toDataURL();
  };

  const patientCode = generatePatientCode();
  const patientData = generatePatientData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {tipo === 'qrcode' ? 'QR Code' : 'Código de Barras'} - {paciente.nome}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div id="codigo-impressao">
            <div className="patient-info">
              <h4 className="font-semibold mb-2">Dados do Paciente:</h4>
              <p><strong>Nome:</strong> {paciente.nome}</p>
              <p><strong>CPF:</strong> {paciente.cpf}</p>
              <p><strong>Nascimento:</strong> {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}</p>
              {paciente.tipoSanguineo && (
                <p><strong>Tipo Sanguíneo:</strong> {paciente.tipoSanguineo}{paciente.fatorRh}</p>
              )}
              <p><strong>Convênio:</strong> {paciente.convenio}</p>
              
              {/* Indicadores de necessidades especiais */}
              {(paciente.deficiencias?.auditiva || paciente.deficiencias?.visual || 
                paciente.deficiencias?.fisica || paciente.deficiencias?.intelectual ||
                paciente.neurodivergencias?.autismo || paciente.neurodivergencias?.tdah ||
                paciente.necessidadesEspeciais?.cadeirante || paciente.necessidadesEspeciais?.interprete_libras) && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 className="font-semibold text-yellow-800 mb-1">⚠️ Necessidades Especiais:</h5>
                  <div className="text-sm text-yellow-700">
                    {paciente.deficiencias?.auditiva && <span className="inline-block mr-2">🔇 Deficiência Auditiva</span>}
                    {paciente.deficiencias?.visual && <span className="inline-block mr-2">👁️ Deficiência Visual</span>}
                    {paciente.deficiencias?.fisica && <span className="inline-block mr-2">♿ Deficiência Física</span>}
                    {paciente.neurodivergencias?.autismo && <span className="inline-block mr-2">🧩 Autismo</span>}
                    {paciente.neurodivergencias?.tdah && <span className="inline-block mr-2">⚡ TDAH</span>}
                    {paciente.necessidadesEspeciais?.cadeirante && <span className="inline-block mr-2">♿ Cadeirante</span>}
                    {paciente.necessidadesEspeciais?.interprete_libras && <span className="inline-block mr-2">🤟 Intérprete LIBRAS</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="code-container">
              {tipo === 'qrcode' ? (
                <div className="flex flex-col items-center">
                  <QRCode
                    value={patientData}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                  <p className="text-sm text-gray-600 mt-2">Código: {patientCode}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img 
                    src={generateBarcode()} 
                    alt="Código de Barras" 
                    className="max-w-full"
                  />
                  <p className="text-sm text-gray-600 mt-2">Código: {patientCode}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCodeGenerator;
