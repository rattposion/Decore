import React from 'react';
import { Summary } from '../types';
import { BarChart2, RefreshCcw, CheckCircle, Layers, Users } from 'lucide-react';

interface Collaborator {
  name: string;
  tested: number;
  cleaned: number;
  resetados: number;
  v9: number;
}

interface SummarySectionProps {
  summary: Summary;
  morning?: Collaborator[];
  afternoon?: Collaborator[];
}

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary, morning = [], afternoon = [] }) => {
  const total = summary.resetEquipment + summary.testedEquipment + summary.cleanedEquipment + summary.v9Equipment;

  // Agrupar e somar colaboradores
  const collaboratorMap: Record<string, Collaborator> = {};
  [...morning, ...afternoon].forEach((colab) => {
    const key = normalizeName(colab.name);
    if (!key) return;
    if (!collaboratorMap[key]) {
      collaboratorMap[key] = { ...colab };
    } else {
      collaboratorMap[key] = {
        name: colab.name,
        tested: collaboratorMap[key].tested + colab.tested,
        cleaned: collaboratorMap[key].cleaned + colab.cleaned,
        resetados: collaboratorMap[key].resetados + colab.resetados,
        v9: collaboratorMap[key].v9 + (colab.v9 || 0)
      };
    }
  });
  const allCollaborators = Object.values(collaboratorMap);

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart2 className="text-purple-600 w-6 h-6" />
          Resumo da Produção
        </h3>
        <p className="text-lg font-semibold text-gray-700 mt-2">Resumo da Produção</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        {/* 670L V1 */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <span className="text-4xl font-bold text-green-600">{summary.testedEquipment}</span>
          <span className="text-sm text-green-700 mt-2 font-semibold">670L V1</span>
          <span className="text-xs text-green-500 mt-1">{total > 0 ? ((summary.testedEquipment / total) * 100).toFixed(1) : '0.0'}% do total</span>
        </div>
        {/* 670L V9 */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
            <CheckCircle className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-4xl font-bold text-blue-600">{summary.v9Equipment}</span>
          <span className="text-sm text-blue-700 mt-2 font-semibold">670L V9</span>
          <span className="text-xs text-blue-500 mt-1">{total > 0 ? ((summary.v9Equipment / total) * 100).toFixed(1) : '0.0'}% do total</span>
        </div>
        {/* Resetados */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 mb-2">
            <RefreshCcw className="w-6 h-6 text-yellow-500" />
          </div>
          <span className="text-4xl font-bold text-yellow-600">{summary.resetEquipment}</span>
          <span className="text-sm text-yellow-700 mt-2 font-semibold">Equipamentos Resetados</span>
          <span className="text-xs text-yellow-500 mt-1">No dia</span>
        </div>
        {/* Limpeza */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mb-2">
            <Layers className="w-6 h-6 text-purple-500" />
          </div>
          <span className="text-4xl font-bold text-purple-600">{summary.cleanedEquipment}</span>
          <span className="text-sm text-purple-700 mt-2 font-semibold">Equipamentos Limpeza</span>
          <span className="text-xs text-purple-500 mt-1">{total > 0 ? ((summary.cleanedEquipment / total) * 100).toFixed(1) : '0.0'}% do total</span>
        </div>
        {/* Total do Dia */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
            <BarChart2 className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-4xl font-bold text-blue-600">{total}</span>
          <span className="text-sm text-blue-700 mt-2 font-semibold">Total do Dia</span>
          <div className="text-xs text-blue-500 mt-1 text-left">
            <span className="block">670L V1: <span className="font-bold text-green-600">{summary.testedEquipment}</span></span>
            <span className="block">670L V9: <span className="font-bold text-blue-600">{summary.v9Equipment}</span></span>
            <span className="block">Resetados: <span className="font-bold text-yellow-600">{summary.resetEquipment}</span></span>
            <span className="block">Limpos: <span className="font-bold text-purple-600">{summary.cleanedEquipment}</span></span>
          </div>
        </div>
      </div>

      {/* Tabela de total por colaborador */}
      <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
        <div className="flex items-center mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 mr-3">
            <Users className="w-5 h-5" />
          </span>
          <h4 className="text-lg font-bold text-gray-700">Total por Colaborador</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full rounded-xl">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Colaborador</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-green-600">670L V1</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-blue-600">670L V9</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-yellow-600">Resetados</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-purple-600">Limpeza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allCollaborators.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">Nenhum colaborador cadastrado</td>
                </tr>
              ) : (
                allCollaborators.map((colab, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-medium text-gray-700 rounded-l-xl">{colab.name}</td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-block min-w-[32px] rounded bg-green-50 text-green-700 font-semibold border border-green-100 px-2 py-1 text-sm shadow-sm">{colab.tested}</span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-block min-w-[32px] rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100 px-2 py-1 text-sm shadow-sm">{colab.v9 || 0}</span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-block min-w-[32px] rounded bg-yellow-50 text-yellow-700 font-semibold border border-yellow-100 px-2 py-1 text-sm shadow-sm">{colab.resetados}</span>
                    </td>
                    <td className="px-4 py-2 text-center rounded-r-xl">
                      <span className="inline-block min-w-[32px] rounded bg-purple-50 text-purple-700 font-semibold border border-purple-100 px-2 py-1 text-sm shadow-sm">{colab.cleaned}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;