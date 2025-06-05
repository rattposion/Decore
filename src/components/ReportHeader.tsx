import React from 'react';
import { Calendar, User, Building2 } from 'lucide-react';

interface ReportHeaderProps {
  date: string;
  supervisor: string;
  unit: string;
  onUpdate: (field: 'date' | 'supervisor' | 'unit', value: string) => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  date, 
  supervisor, 
  unit, 
  onUpdate 
}) => {
  // Format the date to YYYY-MM-DD for the input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    // Se a data estiver no formato DD/MM/YYYY, converte para YYYY-MM-DD
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dateString;
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <label htmlFor="date" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Calendar size={18} className="text-blue-600" />
          </div>
          Data do Relatório
        </label>
        <input
          type="date"
          id="date"
          value={formatDateForInput(date)}
          onChange={(e) => onUpdate('date', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <label htmlFor="supervisor" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <div className="p-2 bg-emerald-100 rounded-lg mr-3">
            <User size={18} className="text-emerald-600" />
          </div>
          Supervisor Responsável
        </label>
        <input
          type="text"
          id="supervisor"
          value={supervisor}
          onChange={(e) => onUpdate('supervisor', e.target.value)}
          placeholder="Nome do Supervisor"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        />
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <label htmlFor="unit" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <Building2 size={18} className="text-purple-600" />
          </div>
          Unidade/Setor
        </label>
        <input
          type="text"
          id="unit"
          value={unit}
          onChange={(e) => onUpdate('unit', e.target.value)}
          placeholder="Identificação da Unidade"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        />
      </div>
    </div>
  );
};

export default ReportHeader;