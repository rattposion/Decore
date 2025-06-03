import React from 'react';
import { AlertCircle, Check, AlertTriangle } from 'lucide-react';
import { Observations } from '../types';

interface ObservationsSectionProps {
  observations: Observations;
  onUpdate: (field: keyof Observations, value: string) => void;
}

const ObservationsSection: React.FC<ObservationsSectionProps> = ({ 
  observations, 
  onUpdate 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-red-50 rounded-xl p-6 border border-red-100">
        <label className="flex items-center text-sm font-semibold text-red-700 mb-3">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <AlertCircle size={18} className="text-red-600" />
          </div>
          Intercorrências
        </label>
        <textarea
          value={observations.issues}
          onChange={(e) => onUpdate('issues', e.target.value)}
          placeholder="Registre aqui qualquer problema ocorrido durante o dia..."
          className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors min-h-[120px] resize-none"
        />
      </div>
      
      <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
        <label className="flex items-center text-sm font-semibold text-emerald-700 mb-3">
          <div className="p-2 bg-emerald-100 rounded-lg mr-3">
            <Check size={18} className="text-emerald-600" />
          </div>
          Destaques Positivos
        </label>
        <textarea
          value={observations.highlights}
          onChange={(e) => onUpdate('highlights', e.target.value)}
          placeholder="Registre aqui pontos positivos ou conquistas do dia..."
          className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors min-h-[120px] resize-none"
        />
      </div>
      
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
        <label className="flex items-center text-sm font-semibold text-amber-700 mb-3">
          <div className="p-2 bg-amber-100 rounded-lg mr-3">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          Pontos de Atenção
        </label>
        <textarea
          value={observations.attentionPoints}
          onChange={(e) => onUpdate('attentionPoints', e.target.value)}
          placeholder="Registre aqui pontos que precisam de atenção especial..."
          className="w-full px-4 py-3 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[120px] resize-none"
        />
      </div>
    </div>
  );
};

export default ObservationsSection;