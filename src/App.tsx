import { useState, useEffect, useCallback } from 'react';
import { ReportDataProvider, useReportData } from './hooks/useReportData';
import DataEntryPanel from './components/DataEntryPanel';
import ReportDisplay from './components/ReportDisplay';
import { exportToPDF } from './utils/pdfUtils';
import MainLayout from './components/MainLayout';
import toast, { Toaster } from 'react-hot-toast';
import Button from './components/Button';
import Modal from './components/Modal';
import { UserCircle } from 'lucide-react';

function App() {
  const [showDataEntry, setShowDataEntry] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { reportData, getHistory, loadFromHistory, saveToHistory, setReportData } = useReportData();

  // Carregar relatório do dia apenas uma vez na montagem
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const history = getHistory();
    const todayReport = history.find(r => r.header.date === today);
    
    if (todayReport) {
      loadFromHistory(today);
    } else {
      setReportData(prev => ({
        ...prev,
        header: { ...prev.header, date: today }
      }));
    }
    setSelectedDate(today);
  }, []); // Array vazio para executar apenas na montagem

  // Atualizar relatório ao selecionar data
  useEffect(() => {
    if (!selectedDate) return;
    
    const history = getHistory();
    const found = history.find(r => r.header.date === selectedDate);
    
    if (found) {
      loadFromHistory(selectedDate);
    } else {
      setReportData(prev => ({
        ...prev,
        header: { ...prev.header, date: selectedDate }
      }));
    }
  }, [selectedDate, getHistory, loadFromHistory, setReportData]);

  const handleExport = async () => {
    const filename = `relatorio-manutencao-${reportData.header.date}`;
    await exportToPDF('report-content', filename);
    toast.success('Relatório exportado com sucesso!');
  };

  const handleSave = useCallback(() => {
    saveToHistory();
    toast.success('Relatório salvo com sucesso!');
  }, [saveToHistory]);

  const handleDeleteReport = useCallback((date: string) => {
    const history = getHistory();
    const newHistory = history.filter(r => r.header.date !== date);
    localStorage.setItem('zte670_report_history', JSON.stringify(newHistory));
    toast.success('Relatório excluído!');
    
    if (reportData.header.date === date) {
      const today = new Date().toISOString().slice(0, 10);
      setReportData({
        header: { date: today, supervisor: '', unit: '' },
        morning: [],
        afternoon: [],
        observations: { issues: '', highlights: '', attentionPoints: '' }
      });
      setSelectedDate(today);
    }
  }, [getHistory, reportData.header.date, setReportData]);

  // Filtro de relatórios por data
  const filteredHistory = filterDate
    ? getHistory().filter(r => r.header.date.includes(filterDate))
    : getHistory();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <MainLayout>
      <Toaster position="top-right" toastOptions={{
        style: { fontSize: '1rem', borderRadius: '0.75rem', background: '#fff', color: '#222', boxShadow: '0 2px 16px #0001' },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
      }} />
      {/* Header fixo elegante */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow-md rounded-b-2xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight">Relatório de Manutenção</h1>
          <div className="flex items-center gap-2 md:ml-6">
            <label htmlFor="dashboard-date" className="text-sm text-gray-500">Data do Relatório:</label>
            <input
              id="dashboard-date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <div className="hidden md:block animate-fadeIn">
            <UserCircle className="w-10 h-10 text-blue-400 bg-blue-100 rounded-full p-1 shadow" />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => setShowHistory(true)}>
              Ver Relatórios Antigos
            </Button>
            <Button variant="success" onClick={() => setShowDataEntry(true)}>
              Preencher Relatório
            </Button>
            <Button variant="primary" className="bg-purple-500 hover:bg-purple-600" onClick={handleExport}>
              Exportar PDF
            </Button>
            <Button variant="warning" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-16px);} to { opacity: 1; transform: none; } }
          .animate-fadeIn { animation: fadeIn 0.5s; }
        `}</style>
      </header>

      {/* Conteúdo principal */}
      <div id="report-content">
        {showDataEntry ? (
          <DataEntryPanel onBack={() => setShowDataEntry(false)} />
        ) : (
          <ReportDisplay />
        )}
      </div>

      {/* Modal de Histórico */}
      <Modal open={showHistory} onClose={() => setShowHistory(false)} title="Relatórios Antigos">
        <div className="mb-4 flex gap-2 items-center">
          <label htmlFor="filter-date" className="text-sm text-gray-700">Filtrar por data:</label>
          <input
            id="filter-date"
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-200"
          />
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-xs text-blue-600 underline ml-2">Limpar</button>
          )}
        </div>
        <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {filteredHistory.length === 0 && (
            <li className="py-6 text-center text-gray-500">Nenhum relatório salvo para o filtro.</li>
          )}
          {filteredHistory.map((report, index) => (
            <li key={index} className="py-4 flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-gray-800">{report.header.date}</span>
                <span className="ml-2 text-gray-500 text-sm">{report.header.supervisor} - {report.header.unit}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" className="bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => { loadFromHistory(report.header.date); setShowHistory(false); toast.success('Relatório carregado!'); }}>
                  Carregar
                </Button>
                <Button variant="danger" className="bg-red-100 text-red-700 hover:bg-red-200" onClick={() => handleDeleteReport(report.header.date)}>
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="mt-6 w-full" onClick={() => setShowHistory(false)}>
          Fechar
        </Button>
      </Modal>
    </MainLayout>
  );
}

export default App;