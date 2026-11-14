import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EvidenceProvider } from './context/EvidenceContext';
import MainLayout from './layouts/MainLayout';
import AIAnalysis from './pages/AIAnalysis';
import Dashboard from './pages/Dashboard';
import RelationshipGraph from './pages/RelationshipGraph';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Timeline from './pages/Timeline';
import UploadEvidence from './pages/UploadEvidence';

export default function App() {
  return (
    <AuthProvider>
      <EvidenceProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3200,
              style: {
                background: '#F7F9FC',
                color: '#131F44',
                border: '1px solid #C7D1E2',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 8px 24px rgba(19, 31, 68, 0.12)',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadEvidence />} />
              <Route path="/analysis" element={<AIAnalysis />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/graph" element={<RelationshipGraph />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </EvidenceProvider>
    </AuthProvider>
  );
}
