import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import ProfileStack from './components/ProfileStack';
import AddProfileForm from './components/AddProfileForm';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './App.css';

function MainApp() {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);

  return (
    <ProfileProvider>
      <div className="app">
        <header className="app-header">
          <h1 className="app-logo">🔥 Spark</h1>
          <div className="header-right">
            <span className="header-email">{user?.email}</span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Profile
            </button>
          </div>
        </header>

        <main className="app-main">
          <ProfileStack />
        </main>

        {showForm && <AddProfileForm onCancel={() => setShowForm(false)} />}
      </div>
    </ProfileProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
