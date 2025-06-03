import React, { useState } from 'react';
import { useReportData } from '../hooks/useReportData';
import { RefreshCw, CheckCircle, Settings, Database } from 'lucide-react';
import Card from './Card';

const percent = (value: number, total: number) => total > 0 ? Math.round((value / total) * 100) : 0;

// Função utilitária para formatar data yyyy-mm-dd para dd/mm/aaaa
function formatDateBR(dateStr?: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

const ReportDisplay: React.FC = () => {
  const { reportData, getHistory } = useReportData();

  // Filtros de data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Totais do dia
  const totalManha = reportData.morning.reduce((sum, c) => sum + c.cleaned, 0);
  const totalTardeReset = reportData.afternoon.reduce((sum, c) => sum + c.tested, 0);
  const totalTardeLimpeza = reportData.afternoon.reduce((sum, c) => sum + c.cleaned, 0);
  const totalEquip = totalManha + totalTardeReset + totalTardeLimpeza;

  // Totais do mês
  const history = getHistory();

  // Filtragem por intervalo de datas
  const filteredHistory = history.filter(r => {
    if (startDate && r.header.date < startDate) return false;
    if (endDate && r.header.date > endDate) return false;
    return true;
  });

  const currentMonth = reportData.header.date.slice(0, 7); // yyyy-mm
  const monthReports = history.filter(r => r.header.date.slice(0, 7) === currentMonth);
  const totalMesManha = monthReports.reduce((sum, r) => sum + r.morning.reduce((s, c) => s + c.cleaned, 0), 0);
  const totalMesTardeReset = monthReports.reduce((sum, r) => sum + r.afternoon.reduce((s, c) => s + c.tested, 0), 0);
  const totalMesTardeLimpeza = monthReports.reduce((sum, r) => sum + r.afternoon.reduce((s, c) => s + c.cleaned, 0), 0);

  // Totais gerais (apenas do intervalo filtrado)
  const totalGeralReset = filteredHistory.reduce((sum, r) =>
    sum + r.morning.reduce((s, c) => s + (c.resetados || 0), 0) +
          r.afternoon.reduce((s, c) => s + (c.resetados || 0), 0)
  , 0);
  const totalGeralLimpeza = filteredHistory.reduce((sum, r) =>
    sum + r.morning.reduce((s, c) => s + c.cleaned, 0) +
          r.afternoon.reduce((s, c) => s + c.cleaned, 0)
  , 0);
  const totalGeralLimpezaManha = filteredHistory.reduce((sum, r) => sum + r.morning.reduce((s, c) => s + c.tested, 0), 0);

  if (!reportData || !reportData.header.date) {
    return <div className="text-center text-gray-500 mt-10">Nenhum relatório preenchido ainda.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Dashboard de Manutenção</h1>
          <span className="text-base text-gray-500">Visão geral da manutenção de equipamentos</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <label className="text-sm text-gray-600">Data inicial:
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm" />
          </label>
          <label className="text-sm text-gray-600">Data final:
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm" />
          </label>
        </div>
        <span className="text-sm text-gray-400 mt-2 md:mt-0 font-medium">
          {startDate && endDate
            ? `Período: ${formatDateBR(startDate)} até ${formatDateBR(endDate)}`
            : reportData.header.date
              ? `Data do relatório: ${formatDateBR(reportData.header.date)}`
              : ''}
        </span>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card hoverable>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-4 mb-2">
              <RefreshCw className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-gray-700 text-lg">Equipamentos Resetados</span>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-4xl font-extrabold text-blue-700">{totalGeralReset}</span>
                <span className="text-sm text-gray-500">Todos os relatórios</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">Total geral</span>
                <span className="text-sm text-blue-600 font-medium">Acumulado</span>
              </div>
            </div>
          </div>
        </Card>
        <Card hoverable>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-4 mb-2">
              <Settings className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-gray-700 text-lg">Total Teste</span>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-4xl font-extrabold text-orange-700">{totalGeralLimpezaManha}</span>
                <span className="text-sm text-gray-500">Todos os relatórios</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-orange-600">Total geral</span>
                <span className="text-sm text-orange-600 font-medium">Acumulado</span>
              </div>
            </div>
          </div>
        </Card>
        <Card hoverable>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-4 mb-2">
              <Database className="w-10 h-10 text-indigo-500 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-gray-700 text-lg">Total Limpeza</span>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-4xl font-extrabold text-indigo-700">{totalGeralLimpeza}</span>
                <span className="text-sm text-gray-500">Todos os relatórios</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-indigo-600">Total geral</span>
                <span className="text-sm text-indigo-600 font-medium">Acumulado</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Observação */}
      <Card className="bg-yellow-50 border-l-4 border-yellow-400 mb-10">
        <span className="font-semibold text-yellow-700">Observação:</span> <span className="text-gray-700">{totalManha} equipamentos Limpeza no período da manhã não foram resetados.</span>
      </Card>

      {/* Barras de progresso e manutenção por tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card>
          <h3 className="font-bold text-lg text-gray-700 mb-6">Manutenção por Tipo</h3>
          <div className="mb-4">
            <span className="text-sm text-blue-700 font-semibold">Equipamentos Resetados (Tarde)</span>
            <div className="w-full bg-blue-100 rounded h-3 mt-1 mb-2 overflow-hidden">
              <div className="bg-blue-500 h-3 rounded transition-all duration-700" style={{ width: `${percent(totalTardeReset, totalEquip)}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{totalTardeReset}</span>
          </div>
          <div className="mb-4">
            <span className="text-sm text-emerald-700 font-semibold">Equipamentos Limpeza (Tarde - Com Reset)</span>
            <div className="w-full bg-emerald-100 rounded h-3 mt-1 mb-2 overflow-hidden">
              <div className="bg-emerald-500 h-3 rounded transition-all duration-700" style={{ width: `${percent(totalTardeLimpeza, totalEquip)}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{totalTardeLimpeza}</span>
          </div>
          <div>
            <span className="text-sm text-orange-700 font-semibold">Equipamentos Limpeza (Manhã - Sem Reset)</span>
            <div className="w-full bg-orange-100 rounded h-3 mt-1 mb-2 overflow-hidden">
              <div className="bg-orange-500 h-3 rounded transition-all duration-700" style={{ width: `${percent(totalManha, totalEquip)}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{totalManha}</span>
          </div>
        </Card>
        <div className="flex flex-col gap-8">
          <Card>
            <h3 className="font-bold text-lg text-gray-700 mb-6">Progresso de Manutenção - Reset</h3>
            <span className="text-sm text-gray-500">Progresso</span>
            <div className="w-full bg-gray-100 rounded h-3 mt-1 mb-2 overflow-hidden">
              <div className="bg-green-500 h-3 rounded transition-all duration-700" style={{ width: `${percent(totalTardeReset, totalEquip)}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>{percent(totalTardeReset, totalEquip)}%</span>
              <span>100%</span>
            </div>
          </Card>
          <Card>
            <h3 className="font-bold text-lg text-gray-700 mb-6">Progresso de Manutenção - Limpeza Total</h3>
            <span className="text-sm text-gray-500">Progresso</span>
            <div className="w-full bg-gray-100 rounded h-3 mt-1 mb-2 overflow-hidden">
              <div className="bg-green-500 h-3 rounded transition-all duration-700" style={{ width: `${percent(totalTardeLimpeza + totalManha, totalEquip)}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>{percent(totalTardeLimpeza + totalManha, totalEquip)}%</span>
              <span>100%</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Produção por colaborador */}
      <Card className="mb-10">
        <h3 className="font-bold text-lg text-gray-700 mb-6">Produção por Colaborador</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900">
                <th className="p-3 text-left rounded-tl-xl">Colaborador</th>
                <th className="p-3 text-left">Resetados</th>
                <th className="p-3 text-center">Teste</th>
                <th className="p-3 text-center">Limpeza</th>
                <th className="p-3 text-center rounded-tr-xl">Total</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Consolidar dados de todos os relatórios filtrados
                const colaboradorMap = new Map();
                filteredHistory.forEach(r => {
                  [...r.morning, ...r.afternoon].forEach(colab => {
                    if (!colab.name) return;
                    if (!colaboradorMap.has(colab.name)) {
                      colaboradorMap.set(colab.name, { resetados: 0, tested: 0, cleaned: 0 });
                    }
                    const data = colaboradorMap.get(colab.name);
                    data.resetados += colab.resetados || 0;
                    data.tested += colab.tested || 0;
                    data.cleaned += colab.cleaned || 0;
                  });
                });
                const rows = Array.from(colaboradorMap.entries()).map(([name, data], idx) => (
                  <tr key={name} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-semibold text-gray-700">{name}</td>
                    <td className="p-3 text-center text-yellow-700 font-bold">{data.resetados}</td>
                    <td className="p-3 text-center text-blue-700 font-bold">{data.tested}</td>
                    <td className="p-3 text-center text-emerald-700 font-bold">{data.cleaned}</td>
                    <td className="p-3 text-center text-blue-900 font-bold">{data.resetados + data.tested + data.cleaned}</td>
                  </tr>
                ));
                if (rows.length === 0) {
                  return (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400">Nenhum colaborador encontrado nos relatórios.</td>
                    </tr>
                  );
                }
                return rows;
              })()}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detalhes do Equipamento */}
      <Card className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-500">Modelo do Equipamento</span>
            <div className="font-bold text-lg text-gray-800 mt-1">ZTE 670 L</div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-500">Períodos de Manutenção</span>
            <div className="font-bold text-lg text-gray-800 mt-1">Manhã e Tarde</div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-500">Total de Equipamentos</span>
            <div className="font-bold text-lg text-gray-800 mt-1">{totalEquip}</div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-500">Data do Relatório</span>
            <div className="font-bold text-lg text-gray-800 mt-1">{new Date(reportData.header.date).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
      </Card>

      <footer className="text-center text-xs text-gray-400 mt-10 mb-2">
        © 2025 Relatório de Manutenção de Equipamentos ZTE
      </footer>
    </div>
  );
};

export default ReportDisplay; 