import React, { useEffect } from 'react';
import { useReportData } from '../hooks/useReportData';
import ReportHeader from './ReportHeader';
import ProductionTable from './ProductionTable';
import ObservationsSection from './ObservationsSection';
import SummarySection from './SummarySection';
import { Save, FileDown, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { exportToPDF } from '../utils/pdfUtils';
import Card from './Card';
import Button from './Button';
import toast from 'react-hot-toast';

interface DataEntryPanelProps {
  onBack: () => void;
}

const DataEntryPanel: React.FC<DataEntryPanelProps> = ({ onBack }) => {
  const {
    reportData,
    updateReportHeader,
    updateCollaborator,
    addCollaborator,
    removeCollaborator,
    updateObservation,
    saveToHistory,
    setReportData
  } = useReportData();

  const handleExport = () => {
    const filename = `relatorio-manutencao-${reportData.header.date}`;
    exportToPDF('report-content', filename);
  };

  const handleSave = () => {
    // Validação removida: agora é opcional preencher Limpos (manhã) e 670L V9 (tarde)
    saveToHistory();
    toast.success('Relatório salvo com sucesso!', {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500'
      }
    });
  };

  // Calcular dados de produção
  const calculateProduction = (collaborators: any[]) => {
    return collaborators.reduce((acc, curr) => ({
      total: acc.total + (curr.tested || 0),
      good: acc.good + (curr.cleaned || 0),
      bad: acc.bad + (curr.resetados || 0)
    }), { total: 0, good: 0, bad: 0 });
  };

  // Calcular dados do resumo
  const calculateSummary = (collaborators: any[]) => {
    const morningCollaborators = reportData.morning.filter(c => c.name.trim() !== '').length;
    const afternoonCollaborators = reportData.afternoon.filter(c => c.name.trim() !== '').length;

    return collaborators.reduce((acc, curr) => ({
      totalEquipment: acc.totalEquipment + (curr.tested || 0),
      testedEquipment: acc.testedEquipment + (curr.tested || 0),
      cleanedEquipment: acc.cleanedEquipment + (curr.cleaned || 0),
      resetEquipment: acc.resetEquipment + (curr.resetados || 0),
      totalCollaborators: morningCollaborators + afternoonCollaborators,
      morningCollaborators,
      afternoonCollaborators
    }), {
      totalEquipment: 0,
      testedEquipment: 0,
      cleanedEquipment: 0,
      resetEquipment: 0,
      totalCollaborators: 0,
      morningCollaborators: 0,
      afternoonCollaborators: 0
    });
  };

  // Atualizar o resumo sempre que os colaboradores mudarem
  useEffect(() => {
    const summary = calculateSummary([...reportData.morning, ...reportData.afternoon]);
    setReportData(prev => ({
      ...prev,
      summary
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData.morning, reportData.afternoon]);

  const morningProduction = calculateProduction(reportData.morning);
  const afternoonProduction = calculateProduction(reportData.afternoon);

  const renderCollaboratorsTable = (period: 'morning' | 'afternoon', collaborators: any[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">670L V1</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">670L V9</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Resetados</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Limpos</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {collaborators.map((collaborator, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={collaborator.name}
                    onChange={(e) => updateCollaborator(period, index, 'name', e.target.value)}
                    placeholder="Nome do colaborador"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={collaborator.tested}
                    onChange={(e) => updateCollaborator(period, index, 'tested', Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={collaborator.v9 || 0}
                    onChange={(e) => updateCollaborator(period, index, 'v9', Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={collaborator.resetados}
                    onChange={(e) => updateCollaborator(period, index, 'resetados', Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={collaborator.cleaned}
                    onChange={(e) => updateCollaborator(period, index, 'cleaned', Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeCollaborator(period, index)}
                    className="flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => addCollaborator(period)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Colaborador
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between mb-10">
          <Button variant="secondary" onClick={onBack} className="flex items-center px-5 py-2.5">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Preenchimento do Relatório
          </h1>
        </div>

        <div id="report-content" className="space-y-10">
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-8">Informações do Relatório</h2>
            <ReportHeader
              date={reportData.header.date}
              supervisor={reportData.header.supervisor}
              unit={reportData.header.unit}
              onUpdate={updateReportHeader}
            />
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-50 rounded-xl">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Período da Manhã (08:00-12:00)</h2>
            </div>
            {renderCollaboratorsTable('morning', reportData.morning)}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Produção</h3>
              <ProductionTable
                production={morningProduction}
                onUpdate={() => {}}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-xl">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Período da Tarde (13:00-17:00)</h2>
            </div>
            {renderCollaboratorsTable('afternoon', reportData.afternoon)}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Produção</h3>
              <ProductionTable
                production={afternoonProduction}
                onUpdate={() => {}}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Observações</h2>
            </div>
            <ObservationsSection
              observations={reportData.observations}
              onUpdate={updateObservation}
            />
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-purple-50 rounded-xl">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Resumo da Produção</h2>
            </div>
            <SummarySection
              summary={reportData.summary}
              morning={reportData.morning}
              afternoon={reportData.afternoon}
            />
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="primary" onClick={handleExport} className="flex items-center px-6 py-3">
            <FileDown className="w-5 h-5 mr-2" />
            Exportar Relatório (PDF)
          </Button>
          <Button variant="success" onClick={handleSave} className="flex items-center px-6 py-3">
            <Save className="w-5 h-5 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataEntryPanel;