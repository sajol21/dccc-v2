import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import CursorTracker from './components/CursorTracker';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/Auth';
import { ToastProvider } from './hooks/useToast';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DepartmentsPage = lazy(() => import('./pages/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('./pages/DepartmentDetailPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const LeadersPage = lazy(() => import('./pages/LeadershipPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <CursorTracker />
          <div className="min-h-screen font-sans">
            <Header />
            <main>
              <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/departments" element={<DepartmentsPage />} />
                  <Route path="/departments/:id" element={<DepartmentDetailPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/panel" element={<LeadersPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;