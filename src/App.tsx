import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeLiff, isLiffLoggedIn } from './services/lineService';
import { UserProvider } from './contexts/UserContext';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Activities from './pages/Activities';
import Scanner from './pages/Scanner';
import RedirectPage from './pages/RedirectPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [liffInitialized, setLiffInitialized] = useState<boolean>(false);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await initializeLiff();
        setLiffInitialized(true);
      } catch (error) {
        console.error('LIFF initialization failed:', error);
        setLiffError('ไม่สามารถเชื่อมต่อกับ LINE ได้ กรุณาลองใหม่อีกครั้ง');
      }
    };

    initLiff();
  }, []);

  if (liffError) {
    return (
      <div className="app-error">
        <h2>เกิดข้อผิดพลาด</h2>
        <p>{liffError}</p>
        <button onClick={() => window.location.reload()}>ลองใหม่</button>
      </div>
    );
  }

  if (!liffInitialized) {
    return (
      <div className="app-loading">
        <h2>กำลังโหลด...</h2>
        <p>กรุณารอสักครู่...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <UserProvider>
        <div className="app-container">
          <Header />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/redirect" element={<RedirectPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;