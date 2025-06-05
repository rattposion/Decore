import { ReportData } from '../hooks/useReportData';

// Função para salvar relatórios em arquivos físicos
export const saveReportsToFiles = async () => {
  try {
    // Pega os dados do localStorage
    const currentReport = localStorage.getItem('zte670_report_data');
    const historyReports = localStorage.getItem('zte670_report_history');

    if (!currentReport && !historyReports) {
      throw new Error('Nenhum relatório encontrado no localStorage');
    }

    // Cria o conteúdo do arquivo de relatório atual
    if (currentReport) {
      const reportData: ReportData = JSON.parse(currentReport);
      const currentReportContent = JSON.stringify(reportData, null, 2);
      const currentReportBlob = new Blob([currentReportContent], { type: 'application/json' });
      
      // Cria link para download
      const currentReportLink = document.createElement('a');
      currentReportLink.href = URL.createObjectURL(currentReportBlob);
      currentReportLink.download = `relatorio_atual_${reportData.header.date}.json`;
      currentReportLink.click();
    }

    // Cria o conteúdo do arquivo de histórico
    if (historyReports) {
      const historyData: ReportData[] = JSON.parse(historyReports);
      const historyContent = JSON.stringify(historyData, null, 2);
      const historyBlob = new Blob([historyContent], { type: 'application/json' });
      
      // Cria link para download
      const historyLink = document.createElement('a');
      historyLink.href = URL.createObjectURL(historyBlob);
      historyLink.download = 'historico_relatorios.json';
      historyLink.click();
    }

    return true;
  } catch (error) {
    console.error('Erro ao salvar relatórios:', error);
    throw error;
  }
};

// Função para carregar relatórios de arquivos
export const loadReportsFromFiles = async (file: File): Promise<void> => {
  try {
    const content = await file.text();
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      // É um arquivo de histórico
      localStorage.setItem('zte670_report_history', JSON.stringify(data));
    } else {
      // É um relatório individual
      localStorage.setItem('zte670_report_data', JSON.stringify(data));
    }
  } catch (error) {
    console.error('Erro ao carregar relatório:', error);
    throw error;
  }
}; 