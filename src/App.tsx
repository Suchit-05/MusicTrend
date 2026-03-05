import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import TrackDetails from './pages/TrackDetails';
import ArtistDetails from './pages/ArtistDetails';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-brand-dark">
      {!isAuthPage && <Navbar />}
      <main className={`container mx-auto px-6 ${!isAuthPage ? 'pt-24' : ''}`}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />

          <Route path="/trending" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/track/:id" element={
            <ProtectedRoute>
              <TrackDetails />
            </ProtectedRoute>
          } />

          <Route path="/artist/:id" element={
            <ProtectedRoute>
              <ArtistDetails />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
