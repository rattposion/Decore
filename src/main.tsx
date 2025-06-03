import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ReportDataProvider } from './hooks/useReportData';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReportDataProvider>
      <App />
    </ReportDataProvider>
  </StrictMode>
);
