import React from 'react';
import { Production } from '../types';

interface ProductionTableProps {
  production: Production;
  onUpdate: (field: keyof Production, value: number) => void;
}

const ProductionTable: React.FC<ProductionTableProps> = ({ production, onUpdate }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Produção</h3>
        <p className="text-sm text-gray-500">Registre a produção do dia</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produção Total
            </label>
            <input
              type="number"
              value={production.total}
              onChange={(e) => onUpdate('total', Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produção Boa
            </label>
            <input
              type="number"
              value={production.good}
              onChange={(e) => onUpdate('good', Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produção Ruim
            </label>
            <input
              type="number"
              value={production.bad}
              onChange={(e) => onUpdate('bad', Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionTable;