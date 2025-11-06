import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DepartmentsPage = lazy(() => import('./pages/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('./pages/DepartmentDetailPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const LeadersPage = lazy(() => import('./pages/LeadershipPage'));

function App() {
  return (
    <HashRouter>
      <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
        <Header />
        <main>
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:id" element={<DepartmentDetailPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/leaders" element={<LeadersPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;