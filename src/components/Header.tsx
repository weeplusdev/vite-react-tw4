import React from 'react';
import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { isLiffLoggedIn, loginWithLiff, logoutFromLiff } from '../services/lineService';

const Header: React.FC = () => {
  //const location = useLocation();
  const isLoggedIn = isLiffLoggedIn();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="Logo" />
            <span>Student Portal</span>
          </Link>
        </div>
      </div>
      
      <div className="header-right">
        {isLoggedIn ? (
          <button className="logout-button" onClick={logoutFromLiff}>
            ออกจากระบบ
          </button>
        ) : (
          <button className="login-button" onClick={loginWithLiff}>
            เข้าสู่ระบบด้วย LINE
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;