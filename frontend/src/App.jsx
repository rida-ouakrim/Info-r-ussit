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
import Plan from './pages/Plan';
import LanguagesAcademy from './pages/LanguagesAcademy';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  /* ── Layout Public (Home / Login / Register) ── */
  if (isPublic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  /* ── Layout Espace Candidat / Admin (avec Sidebar) ── */

  return (
    <div className="min-h-screen flex bg-[#f0f9f8] dark:bg-[#090e1a] relative overflow-x-hidden">
      {/* Educeet Background Shapes */}
      <img src="assets/img/shape/gallary-bg-4-1.png" alt="" className="fixed inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none z-0" onError={e => e.target.style.display = 'none'} />
      <img src="assets/img/shape/about-6-2.png" alt="" className="fixed top-24 right-8 w-28 opacity-35 pointer-events-none z-0 hidden lg:block" onError={e => e.target.style.display = 'none'} />
      <img src="assets/img/shape/course-1-2.png" alt="" className="fixed bottom-12 right-16 w-32 opacity-30 pointer-events-none z-0 hidden lg:block" onError={e => e.target.style.display = 'none'} />

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ml-0 ${collapsed ? 'md:ml-[68px]' : 'md:ml-[240px]'}`}>
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/annales" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/generator" element={<ProtectedRoute><AIGenerator /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/errors" element={<ProtectedRoute><ErrorNotebook /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
            <Route path="/languages-academy" element={<AdminRoute><LanguagesAcademy /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
