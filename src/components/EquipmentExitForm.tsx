import React, { useState } from 'react';
import { useReportData } from '../hooks/useReportData';
import Card from './Card';
import Button from './Button';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface EquipmentExitFormProps {
  onBack: () => void;
}

const EquipmentExitForm: React.FC<EquipmentExitFormProps> = ({ onBack }) => {
  const { reportData, setReportData } = useReportData();
  
  // Calcular equipamentos disponíveis
  const availableV1 = reportData.morning.reduce((sum, c) => sum + (c.tested || 0), 0);
  const availableV9 = reportData.afternoon.reduce((sum, c) => sum + (c.v9 || 0), 0);

  const [exitData, setExitData] = useState({
    v1Quantity: 0,
    v9Quantity: 0,
    destination: '',
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar quantidades
    if (exitData.v1Quantity > availableV1) {
      toast.error('Quantidade de 670L V1 excede o disponível');
      return;
    }
    if (exitData.v9Quantity > availableV9) {
      toast.error('Quantidade de 670L V9 excede o disponível');
      return;
    }

    // Atualizar o relatório com as saídas
    const updatedMorning = reportData.morning.map(collab => ({
      ...collab,
      tested: Math.max(0, (collab.tested || 0) - exitData.v1Quantity)
    }));

    const updatedAfternoon = reportData.afternoon.map(collab => ({
      ...collab,
      v9: Math.max(0, (collab.v9 || 0) - exitData.v9Quantity)
    }));

    setReportData(prev => ({
      ...prev,
      morning: updatedMorning,
      afternoon: updatedAfternoon
    }));

    // Salvar histórico de saídas
    const exits = JSON.parse(localStorage.getItem('equipment_exits') || '[]');
    exits.push({
      ...exitData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('equipment_exits', JSON.stringify(exits));

    toast.success('Saída de equipamentos registrada com sucesso!');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="secondary" onClick={onBack} className="flex items-center px-5 py-2.5">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Saída de Equipamentos
          </h1>
        </div>

        <Card>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">670L V1 Disponíveis</h3>
              <p className="text-3xl font-bold text-blue-600">{availableV1}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">670L V9 Disponíveis</h3>
              <p className="text-3xl font-bold text-purple-600">{availableV9}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade 670L V1
                </label>
                <input
                  type="number"
                  min="0"
                  max={availableV1}
                  value={exitData.v1Quantity}
                  onChange={(e) => setExitData(prev => ({ ...prev, v1Quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade 670L V9
                </label>
                <input
                  type="number"
                  min="0"
                  max={availableV9}
                  value={exitData.v9Quantity}
                  onChange={(e) => setExitData(prev => ({ ...prev, v9Quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino
              </label>
              <input
                type="text"
                value={exitData.destination}
                onChange={(e) => setExitData(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Saída
              </label>
              <input
                type="date"
                value={exitData.date}
                onChange={(e) => setExitData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={exitData.notes}
                onChange={(e) => setExitData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="success"
                className="flex items-center px-6 py-3"
                disabled={exitData.v1Quantity === 0 && exitData.v9Quantity === 0}
              >
                <Save className="w-5 h-5 mr-2" />
                Registrar Saída
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentExitForm; 