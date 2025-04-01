import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-nav">
        <Link to="/" className="footer-nav-item">
          <div className="nav-icon">🏠</div>
          <div className="nav-text">หน้าแรก</div>
        </Link>
        
        <Link to="/profile" className="footer-nav-item">
          <div className="nav-icon">👤</div>
          <div className="nav-text">โปรไฟล์</div>
        </Link>
        
        <Link to="/activities" className="footer-nav-item">
          <div className="nav-icon">🏆</div>
          <div className="nav-text">กิจกรรม</div>
        </Link>
        
        <Link to="/scanner" className="footer-nav-item">
          <div className="nav-icon">📷</div>
          <div className="nav-text">สแกน</div>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;