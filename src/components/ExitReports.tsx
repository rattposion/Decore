import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { exportToPDF } from '../utils/pdfUtils';

interface ExitReport {
  v1Quantity: number;
  v9Quantity: number;
  destination: string;
  date: string;
  notes: string;
  timestamp: string;
}

interface ExitReportsProps {
  onBack: () => void;
}

const ExitReports: React.FC<ExitReportsProps> = ({ onBack }) => {
  const [exits, setExits] = useState<ExitReport[]>([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const savedExits = JSON.parse(localStorage.getItem('equipment_exits') || '[]');
    setExits(savedExits.sort((a: ExitReport, b: ExitReport) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, []);

  const filteredExits = filterDate
    ? exits.filter(exit => exit.date.includes(filterDate))
    : exits;

  const handleExport = async () => {
    const filename = `relatorio-saidas-${new Date().toISOString().slice(0, 10)}`;
    await exportToPDF('exit-reports-content', filename);
  };

  const handleDelete = (timestamp: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta saída?')) {
      const savedExits = JSON.parse(localStorage.getItem('equipment_exits') || '[]');
      const updated = savedExits.filter((exit: ExitReport) => exit.timestamp !== timestamp);
      localStorage.setItem('equipment_exits', JSON.stringify(updated));
      setExits(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="secondary" onClick={onBack} className="flex items-center px-5 py-2.5">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Relatório de Saídas de Equipamentos
          </h1>
        </div>

        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="filter-date" className="text-sm text-gray-700">Filtrar por data:</label>
              <input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-200"
              />
              {filterDate && (
                <button 
                  onClick={() => setFilterDate('')} 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpar filtro
                </button>
              )}
            </div>
            <Button variant="primary" onClick={handleExport} className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          <div id="exit-reports-content">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      670L V1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      670L V9
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhuma saída registrada
                      </td>
                    </tr>
                  ) : (
                    filteredExits.map((exit, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(exit.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exit.v1Quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exit.v9Quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exit.destination}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {exit.notes}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleDelete(exit.timestamp)} className="text-red-600 hover:text-red-800 p-2 rounded-full transition-colors" title="Excluir">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExitReports; 