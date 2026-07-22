import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Exams from './pages/Exams';
import AIGenerator from './pages/AIGenerator';
import Bookmarks from './pages/Bookmarks';
import ErrorNotebook from './pages/ErrorNotebook';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !user.is_staff) return <Navigate to="/dashboard" replace />;
  return children;
};

/* Pages publiques sans sidebar */
const PUBLIC_PATHS = ['/', '/login', '/register'];

function AppContent() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  /* ── Layout Public (Home / Login / Register) ── */
  if (isPublic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  /* ── Layout Espace Candidat / Admin (avec Sidebar) ── */
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0c1220]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${collapsed ? 'ml-[68px]' : 'ml-[240px]'}`}>
        <Header />

        <main className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses"   element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/annales"   element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/generator" element={<ProtectedRoute><AIGenerator /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/errors"    element={<ProtectedRoute><ErrorNotebook /></ProtectedRoute>} />
            <Route path="/admin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
