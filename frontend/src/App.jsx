import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopAppBar from './components/common/TopAppBar';
import Footer from './components/common/Footer';
import RegistrationPage from './pages/Registration/RegistrationPage';
import CrewDashboard from './pages/CrewDashboard/CrewDashboard';
import LeaderboardPage from './pages/Leaderboard/LeaderboardPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative">
        <TopAppBar />
        
        <main className="flex-grow flex relative w-full h-full">
          {/* Main content area */}
          <div className="w-full flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/register" replace />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/crew" element={<CrewDashboard />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </div>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
