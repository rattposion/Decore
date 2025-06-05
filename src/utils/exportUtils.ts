import { ReportData, Collaborator } from '../types';

// Function to format date as DD/MM/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Helper to create a consolidated view of collaborator data
const getConsolidatedCollaboratorData = (morningData: Collaborator[], afternoonData: Collaborator[]) => {
  const allCollaborators = new Map<string, { tested: number; cleaned: number }>();
  
  // Process morning data
  morningData.forEach(collab => {
    if (collab.name) {
      allCollaborators.set(collab.name, {
        tested: collab.tested,
        cleaned: collab.cleaned
      });
    }
  });
  
  // Process afternoon data
  afternoonData.forEach(collab => {
    if (collab.name) {
      const existing = allCollaborators.get(collab.name);
      if (existing) {
        allCollaborators.set(collab.name, {
          tested: existing.tested + collab.tested,
          cleaned: existing.cleaned + collab.cleaned
        });
      } else {
        allCollaborators.set(collab.name, {
          tested: collab.tested,
          cleaned: collab.cleaned
        });
      }
    }
  });
  
  return Array.from(allCollaborators.entries()).map(([name, data]) => ({
    name,
    tested: data.tested,
    cleaned: data.cleaned,
    total: data.tested + data.cleaned
  }));
};

// Main export function
export const exportToExcel = (reportData: ReportData) => {
  // In a real implementation, we would use a library like ExcelJS or SheetJS
  // Since we can't install additional libraries, we'll use CSV export as a fallback
  
  const { header, morning, afternoon, observations } = reportData;
  const consolidatedData = getConsolidatedCollaboratorData(morning, afternoon);
  
  // Calculate totals
  const totalTested = consolidatedData.reduce((sum, item) => sum + item.tested, 0);
  const totalCleaned = consolidatedData.reduce((sum, item) => sum + item.cleaned, 0);
  const totalItems = totalTested + totalCleaned;
  
  // Build CSV content
  let csvContent = 'Relatório de Produção Diária - Equipamentos ZTE 670\n\n';
  
  // Header
  csvContent += `Data do relatório:,${formatDate(header.date)}\n`;
  csvContent += `Supervisor responsável:,${header.supervisor}\n`;
  csvContent += `Unidade/Setor:,${header.unit}\n\n`;
  
  // Morning data
  csvContent += 'Período Manhã (08:00-12:00):\n';
  csvContent += 'Colaborador,Qtd. Testados,Qtd. Limpos,Total\n';
  
  morning.forEach(collab => {
    if (collab.name) {
      csvContent += `${collab.name},${collab.tested},${collab.cleaned},${collab.tested + collab.cleaned}\n`;
    }
  });
  
  // Afternoon data
  csvContent += '\nPeríodo Tarde (13:00-17:00):\n';
  csvContent += 'Colaborador,Qtd. Testados,Qtd. Limpos,Total\n';
  
  afternoon.forEach(collab => {
    if (collab.name) {
      csvContent += `${collab.name},${collab.tested},${collab.cleaned},${collab.tested + collab.cleaned}\n`;
    }
  });
  
  // Summary
  csvContent += '\nResumo Consolidado:\n';
  csvContent += 'Colaborador,Testados,Limpos,Total,% do Total\n';
  
  consolidatedData.forEach(item => {
    const percentage = totalItems > 0 ? ((item.total / totalItems) * 100).toFixed(1) : '0';
    csvContent += `${item.name},${item.tested},${item.cleaned},${item.total},${percentage}%\n`;
  });
  
  csvContent += `\nTotal Geral,${totalTested},${totalCleaned},${totalItems},100%\n`;
  csvContent += `Média por hora,,,,${(totalItems / 8).toFixed(1)}\n`;
  csvContent += `Percentual,${totalItems > 0 ? ((totalTested / totalItems) * 100).toFixed(1) : '0'}%,${totalItems > 0 ? ((totalCleaned / totalItems) * 100).toFixed(1) : '0'}%,,\n`;
  
  // Observations
  csvContent += '\nObservações:\n';
  csvContent += `Intercorrências:,"${observations.issues.replace(/"/g, '""')}"\n`;
  csvContent += `Destaques positivos:,"${observations.highlights.replace(/"/g, '""')}"\n`;
  csvContent += `Pontos de atenção:,"${observations.attentionPoints.replace(/"/g, '""')}"\n`;
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Prod_ZTE670_${formatDate(header.date).replace(/\//g, '-')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};