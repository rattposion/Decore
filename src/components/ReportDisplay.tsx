import React, { useState, useMemo, useEffect } from 'react';
import { useReportData } from '../hooks/useReportData';
import { RefreshCw, CheckCircle, Settings, Database, ArrowLeft, Download, Package, Truck, Droplet } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { exportToPDF } from '../utils/pdfUtils';

const percent = (value: number, total: number) => total > 0 ? Math.round((value / total) * 100) : 0;

// Função utilitária para formatar data yyyy-mm-dd para dd/mm/aaaa
function formatDateBR(dateStr?: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

interface ExitReport {
  v1Quantity: number;
  v9Quantity: number;
  destination: string;
  date: string;
  notes: string;
  timestamp: string;
}

const ReportDisplay: React.FC = () => {
  const { reportData, getHistory } = useReportData();
  const [exitTotals, setExitTotals] = useState({ v1: 0, v9: 0 });

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
  const totalGeralReset = useMemo(() => {
    return filteredHistory.reduce((acc, r) => {
      const resetTotal = r.morning.reduce((sum, c) => sum + (c.resetados || 0), 0) +
                        r.afternoon.reduce((sum, c) => sum + (c.resetados || 0), 0);
      return acc + resetTotal;
    }, 0);
  }, [filteredHistory]);

  const totalGeralLimpeza = useMemo(() => {
    return filteredHistory.reduce((acc, r) => {
      const limpezaTotal = r.morning.reduce((sum, c) => sum + c.cleaned, 0) +
                          r.afternoon.reduce((sum, c) => sum + c.cleaned, 0);
      return acc + limpezaTotal;
    }, 0);
  }, [filteredHistory]);

  const totalGeralLimpezaManha = useMemo(() => {
    return filteredHistory.reduce((acc, r) => {
      const limpezaManhaTotal = r.morning.reduce((sum, c) => sum + c.tested, 0);
      return acc + limpezaManhaTotal;
    }, 0);
  }, [filteredHistory]);

  useEffect(() => {
    const savedExits = JSON.parse(localStorage.getItem('equipment_exits') || '[]');
    const totals = savedExits.reduce((acc: { v1: number; v9: number }, exit: ExitReport) => ({
      v1: acc.v1 + exit.v1Quantity,
      v9: acc.v9 + exit.v9Quantity
    }), { v1: 0, v9: 0 });
    setExitTotals(totals);
  }, []);

  const handleExport = async () => {
    const filename = `relatorio-manutencao-${reportData.header.date}`;
    await exportToPDF('report-content', filename);
  };

  if (!reportData || !reportData.header.date) {
    return <div className="text-center text-gray-500 mt-10">Nenhum relatório preenchido ainda.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight select-none" style={{letterSpacing: '0.01em'}}>
            Dashboard de Manutenção
          </h1>
          <Button variant="primary" onClick={handleExport} className="flex items-center px-6 py-3 text-lg shadow-lg">
            <Download className="w-6 h-6 mr-2" />
            Exportar PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          <div className="backdrop-blur-xl bg-white/60 border border-blue-100 rounded-3xl shadow-2xl p-8 transition-transform hover:scale-105 duration-300 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-200 via-blue-100 to-transparent rounded-full opacity-40"></div>
            <div className="flex items-center gap-5 mb-6">
              <span className="p-4 bg-blue-200 rounded-2xl shadow">
                <Package className="w-10 h-10 text-blue-700" />
              </span>
              <h3 className="text-2xl font-bold text-blue-900 drop-shadow">Equipamentos Prontos</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white/80 rounded-xl p-4 shadow-inner flex flex-col items-center">
                <span className="text-sm text-gray-500">670L V1</span>
                <span className="text-3xl font-extrabold text-blue-700 mt-1">{reportData.morning.reduce((sum, c) => sum + c.cleaned, 0)}</span>
              </div>
              <div className="bg-white/80 rounded-xl p-4 shadow-inner flex flex-col items-center">
                <span className="text-sm text-gray-500">670L V9</span>
                <span className="text-3xl font-extrabold text-purple-700 mt-1">{reportData.afternoon.reduce((sum, c) => sum + (c.v9 || 0), 0)}</span>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/60 border border-red-100 rounded-3xl shadow-2xl p-8 transition-transform hover:scale-105 duration-300 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-red-200 via-red-100 to-transparent rounded-full opacity-40"></div>
            <div className="flex items-center gap-5 mb-6">
              <span className="p-4 bg-red-200 rounded-2xl shadow">
                <Truck className="w-10 h-10 text-red-700" />
              </span>
              <h3 className="text-2xl font-bold text-red-900 drop-shadow">Total de Saídas</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white/80 rounded-xl p-4 shadow-inner flex flex-col items-center">
                <span className="text-sm text-gray-500">670L V1</span>
                <span className="text-3xl font-extrabold text-red-700 mt-1">{exitTotals.v1}</span>
              </div>
              <div className="bg-white/80 rounded-xl p-4 shadow-inner flex flex-col items-center">
                <span className="text-sm text-gray-500">670L V9</span>
                <span className="text-3xl font-extrabold text-red-700 mt-1">{exitTotals.v9}</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-10 border-t-2 border-blue-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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

        <Card className="bg-yellow-50 border-l-4 border-yellow-400 mb-10">
          <span className="font-semibold text-yellow-700">Observação:</span> <span className="text-gray-700">{totalManha} equipamentos Limpeza no período da manhã não foram resetados.</span>
        </Card>

        <Card className="mb-10">
          <h3 className="font-bold text-lg text-gray-700 mb-6">Produção por Colaborador</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-1">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900">
                  <th className="p-3 text-left rounded-tl-xl">Colaborador</th>
                  <th className="p-3 text-center">670L V1</th>
                  <th className="p-3 text-center">670L V9</th>
                  <th className="p-3 text-center">Resetados</th>
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
                        colaboradorMap.set(colab.name, { v1: 0, v9: 0, resetados: 0, cleaned: 0 });
                      }
                      const data = colaboradorMap.get(colab.name);
                      data.v1 += colab.tested || 0;
                      data.v9 += colab.v9 || 0;
                      data.resetados += colab.resetados || 0;
                      data.cleaned += colab.cleaned || 0;
                    });
                  });
                  const rows = Array.from(colaboradorMap.entries()).map(([name, data], idx) => (
                    <tr key={name} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-3 font-semibold text-gray-700">{name}</td>
                      <td className="p-3 text-center text-blue-700 font-bold">{data.v1}</td>
                      <td className="p-3 text-center text-purple-700 font-bold">{data.v9}</td>
                      <td className="p-3 text-center text-yellow-700 font-bold">{data.resetados}</td>
                      <td className="p-3 text-center text-emerald-700 font-bold">{data.cleaned}</td>
                      <td className="p-3 text-center text-blue-900 font-bold">{data.v1 + data.v9 + data.resetados + data.cleaned}</td>
                    </tr>
                  ));
                  if (rows.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-400">Nenhum colaborador encontrado nos relatórios.</td>
                      </tr>
                    );
                  }
                  return rows;
                })()}
              </tbody>
            </table>
          </div>
        </Card>

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
    </div>
  );
};

export default ReportDisplay; 