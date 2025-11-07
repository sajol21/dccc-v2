import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/Auth';
import { ToastProvider } from './components/ToastProvider';
import { ThemeProvider } from './components/ThemeProvider';
import MainLayout from './components/MainLayout';

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
      <ThemeProvider>
        <ToastProvider>
          <HashRouter>
            <div className="min-h-screen font-sans">
              <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/departments" element={<DepartmentsPage />} />
                    <Route path="/departments/:id" element={<DepartmentDetailPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:id" element={<EventDetailPage />} />
                    <Route path="/team" element={<LeadersPage />} />
                  </Route>
                  
                  <Route path="/login" element={<LoginPage />} />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </div>
          </HashRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;