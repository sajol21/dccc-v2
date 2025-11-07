import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import CursorTracker from './components/CursorTracker';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MotivePage = lazy(() => import('./pages/MotivePage'));
const DepartmentsPage = lazy(() => import('./pages/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('./pages/DepartmentDetailPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const LeadersPage = lazy(() => import('./pages/LeadershipPage'));

function App() {
  return (
    <HashRouter>
      <CursorTracker />
      <div className="min-h-screen font-sans">
        <Header />
        <main>
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/motive" element={<MotivePage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:id" element={<DepartmentDetailPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
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