import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

// Tipos do relatório
export interface Collaborator {
  name: string;
  tested: number;
  cleaned: number;
  resetados: number;
}

export interface ReportData {
  header: {
    date: string;
    supervisor: string;
    unit: string;
  };
  morning: Collaborator[];
  afternoon: Collaborator[];
  observations: {
    issues: string;
    highlights: string;
    attentionPoints: string;
  };
  summary: {
    totalEquipment: number;
    testedEquipment: number;
    cleanedEquipment: number;
    resetEquipment: number;
    totalCollaborators: number;
    morningCollaborators: number;
    afternoonCollaborators: number;
  };
}

const emptyCollaborator = (): Collaborator => ({
  name: '',
  tested: 0,
  cleaned: 0,
  resetados: 0
});

const initialReportData: ReportData = {
  header: {
    date: new Date().toISOString().split('T')[0],
    supervisor: '',
    unit: ''
  },
  morning: [emptyCollaborator()],
  afternoon: [emptyCollaborator()],
  observations: {
    issues: '',
    highlights: '',
    attentionPoints: ''
  },
  summary: {
    totalEquipment: 0,
    testedEquipment: 0,
    cleanedEquipment: 0,
    resetEquipment: 0,
    totalCollaborators: 0,
    morningCollaborators: 0,
    afternoonCollaborators: 0
  }
};

const STORAGE_KEY = 'zte670_report_data';
const HISTORY_KEY = 'zte670_report_history';

interface ReportDataContextType {
  reportData: ReportData;
  updateReportHeader: (field: 'date' | 'supervisor' | 'unit', value: string) => void;
  updateCollaborator: (period: 'morning' | 'afternoon', index: number, field: keyof Collaborator, value: any) => void;
  addCollaborator: (period: 'morning' | 'afternoon') => void;
  removeCollaborator: (period: 'morning' | 'afternoon', index: number) => void;
  updateObservation: (field: keyof typeof initialReportData.observations, value: string) => void;
  resetData: () => void;
  saveToHistory: () => void;
  getHistory: () => ReportData[];
  loadFromHistory: (date: string) => void;
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>;
}

const ReportDataContext = createContext<ReportDataContextType | undefined>(undefined);

export const ReportDataProvider = ({ children }: { children: ReactNode }) => {
  const [reportData, setReportData] = useState<ReportData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      // Corrigir colaboradores antigos sem o campo resetados
      data.morning = Array.isArray(data.morning)
        ? data.morning.map((colab: any) => ({
            ...colab,
            resetados: typeof colab.resetados === 'number' ? colab.resetados : 0
          }))
        : [];
      data.afternoon = Array.isArray(data.afternoon)
        ? data.afternoon.map((colab: any) => ({
            ...colab,
            resetados: typeof colab.resetados === 'number' ? colab.resetados : 0
          }))
        : [];
      return data;
    }
    return initialReportData;
  });

  // Memoize o histórico para evitar recálculos desnecessários
  const getHistory = useCallback((): ReportData[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }, []);

  // Otimizar o salvamento no localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const currentData = JSON.stringify(reportData);
    
    if (savedData !== currentData) {
      localStorage.setItem(STORAGE_KEY, currentData);
    }
  }, [reportData]);

  const saveToHistory = useCallback(() => {
    const history = getHistory();
    const exists = history.find(r => r.header.date === reportData.header.date);
    let newHistory;
    if (exists) {
      newHistory = history.map(r => r.header.date === reportData.header.date ? reportData : r);
    } else {
      newHistory = [...history, reportData];
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  }, [reportData, getHistory]);

  const loadFromHistory = useCallback((date: string) => {
    const history = getHistory();
    const found = history.find(r => r.header.date === date);
    if (found) {
      // Corrigir colaboradores antigos sem o campo resetados
      found.morning = Array.isArray(found.morning)
        ? found.morning.map((colab: any) => ({
            ...colab,
            resetados: typeof colab.resetados === 'number' ? colab.resetados : 0
          }))
        : [];
      found.afternoon = Array.isArray(found.afternoon)
        ? found.afternoon.map((colab: any) => ({
            ...colab,
            resetados: typeof colab.resetados === 'number' ? colab.resetados : 0
          }))
        : [];
      setReportData(found);
    }
  }, [getHistory]);

  const updateReportHeader = useCallback((field: 'date' | 'supervisor' | 'unit', value: string) => {
    setReportData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value
      }
    }));
  }, []);

  const updateCollaborator = useCallback((
    period: 'morning' | 'afternoon',
    index: number,
    field: keyof Collaborator,
    value: any
  ) => {
    setReportData(prev => ({
      ...prev,
      [period]: prev[period].map((collab, i) => 
        i === index ? { ...collab, [field]: value } : collab
      )
    }));
  }, []);

  const addCollaborator = useCallback((period: 'morning' | 'afternoon') => {
    setReportData(prev => ({
      ...prev,
      [period]: [...prev[period], emptyCollaborator()]
    }));
  }, []);

  const removeCollaborator = useCallback((period: 'morning' | 'afternoon', index: number) => {
    setReportData(prev => ({
      ...prev,
      [period]: prev[period].filter((_, i) => i !== index)
    }));
  }, []);

  const updateObservation = useCallback((field: keyof typeof initialReportData.observations, value: string) => {
    setReportData(prev => ({
      ...prev,
      observations: {
        ...prev.observations,
        [field]: value
      }
    }));
  }, []);

  const resetData = useCallback(() => {
    setReportData(initialReportData);
  }, []);

  // Memoize o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(() => ({
    reportData,
    updateReportHeader,
    updateCollaborator,
    addCollaborator,
    removeCollaborator,
    updateObservation,
    resetData,
    saveToHistory,
    getHistory,
    loadFromHistory,
    setReportData
  }), [
    reportData,
    updateReportHeader,
    updateCollaborator,
    addCollaborator,
    removeCollaborator,
    updateObservation,
    resetData,
    saveToHistory,
    getHistory,
    loadFromHistory
  ]);

  return (
    <ReportDataContext.Provider value={contextValue}>
      {children}
    </ReportDataContext.Provider>
  );
};

export const useReportData = () => {
  const context = useContext(ReportDataContext);
  if (!context) {
    throw new Error('useReportData deve ser usado dentro de ReportDataProvider');
  }
  return context;
}; 