// React is used implicitly by JSX
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ProfileProvider } from './context/ProfileContext';
import { MessageProvider } from './context/MessageContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobsListPage from './pages/jobs/JobsListPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <JobProvider>
            <MessageProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/find-jobs" element={<JobsListPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/applications" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/messages" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/jobs/create" element={<Navigate to="/dashboard" replace />} />
                </Route>
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MessageProvider>
          </JobProvider>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;