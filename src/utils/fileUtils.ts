import { ReportData } from '../hooks/useReportData';

// Função para salvar relatórios e saídas em um único arquivo de backup
export const saveReportsToFiles = async () => {
  try {
    // Pega os dados do localStorage
    const currentReport = localStorage.getItem('zte670_report_data');
    const historyReports = localStorage.getItem('zte670_report_history');
    const equipmentExits = localStorage.getItem('equipment_exits');

    if (!currentReport && !historyReports && !equipmentExits) {
      throw new Error('Nenhum dado encontrado no localStorage');
    }

    // Cria o conteúdo do arquivo de backup completo
    const backupData = {
      currentReport: currentReport ? JSON.parse(currentReport) : null,
      historyReports: historyReports ? JSON.parse(historyReports) : [],
      equipmentExits: equipmentExits ? JSON.parse(equipmentExits) : []
    };
    const backupContent = JSON.stringify(backupData, null, 2);
    const backupBlob = new Blob([backupContent], { type: 'application/json' });
    const backupLink = document.createElement('a');
    backupLink.href = URL.createObjectURL(backupBlob);
    backupLink.download = 'backup_relatorios_e_saidas.json';
    backupLink.click();

    return true;
  } catch (error) {
    console.error('Erro ao salvar backup:', error);
    throw error;
  }
};

// Função para carregar relatórios e saídas de um arquivo de backup
export const loadReportsFromFiles = async (file: File): Promise<void> => {
  try {
    const content = await file.text();
    const data = JSON.parse(content);

    // Novo formato de backup completo
    if (data && typeof data === 'object' && ('historyReports' in data || 'equipmentExits' in data)) {
      if (data.currentReport) {
        localStorage.setItem('zte670_report_data', JSON.stringify(data.currentReport));
      }
      if (data.historyReports) {
        localStorage.setItem('zte670_report_history', JSON.stringify(data.historyReports));
      }
      if (data.equipmentExits) {
        localStorage.setItem('equipment_exits', JSON.stringify(data.equipmentExits));
      }
      return;
    }

    // Compatibilidade com backups antigos
    if (Array.isArray(data)) {
      // É um arquivo de histórico
      localStorage.setItem('zte670_report_history', JSON.stringify(data));
    } else {
      // É um relatório individual
      localStorage.setItem('zte670_report_data', JSON.stringify(data));
    }
  } catch (error) {
    console.error('Erro ao carregar backup:', error);
    throw error;
  }
}; 