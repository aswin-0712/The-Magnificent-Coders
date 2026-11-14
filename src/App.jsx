import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EvidenceProvider } from './context/EvidenceContext';
import MainLayout from './layouts/MainLayout';
import AIAnalysis from './pages/AIAnalysis';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RelationshipGraph from './pages/RelationshipGraph';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Timeline from './pages/Timeline';
import UploadEvidence from './pages/UploadEvidence';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

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
                background: '#FFFFFF',
                color: '#172554',
                border: '1px solid #E5E7F0',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 8px 24px rgba(23, 37, 84, 0.08)',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadEvidence />} />
              <Route path="/analysis" element={<AIAnalysis />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/graph" element={<RelationshipGraph />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </EvidenceProvider>
    </AuthProvider>
  );
}
