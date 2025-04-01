import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Home: React.FC = () => {
  const { lineProfile, studentData, loading, error } = useUser();

  if (loading) {
    return <div className="loading">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>ยินดีต้อนรับ{lineProfile ? `, คุณ${lineProfile.displayName}` : ''}</h1>
        
        {lineProfile && lineProfile.pictureUrl && (
          <div className="user-profile-pic">
            <img src={lineProfile.pictureUrl} alt="Profile" />
          </div>
        )}
        
        {studentData ? (
          <p className="welcome-message">
            ยินดีต้อนรับนักเรียนจาก{studentData.school} ระดับชั้น {studentData.grade}
          </p>
        ) : (
          <p className="welcome-message">
            {lineProfile ? 
              'ยังไม่พบข้อมูลนักเรียนของคุณในระบบ กรุณาลงทะเบียน' : 
              'กรุณาเข้าสู่ระบบด้วยบัญชี LINE เพื่อใช้งาน'}
          </p>
        )}
      </div>
      
      <div className="menu-section">
        <h2>เมนูหลัก</h2>
        
        <div className="menu-grid">
          <Link to="/profile" className="menu-item">
            <div className="menu-icon">👤</div>
            <div className="menu-text">โปรไฟล์</div>
          </Link>
          
          <Link to="/activities" className="menu-item">
            <div className="menu-icon">🏆</div>
            <div className="menu-text">กิจกรรม</div>
          </Link>
          
          <Link to="/scanner" className="menu-item">
            <div className="menu-icon">📷</div>
            <div className="menu-text">สแกน QR</div>
          </Link>
          
          <a 
            href="https://docs.google.com/forms/YOUR_FORM_ID/viewform" 
            className="menu-item"
          >
            <div className="menu-icon">📝</div>
            <div className="menu-text">แบบฟอร์ม</div>
          </a>
        </div>
      </div>
      
      <div className="announcements">
        <h2>ประกาศล่าสุด</h2>
        <div className="announcement-list">
          <div className="announcement-item">
            <h3>กิจกรรมวันวิทยาศาสตร์</h3>
            <p>วันที่ 18 สิงหาคม 2567 ณ อาคารหอประชุม</p>
          </div>
          
          <div className="announcement-item">
            <h3>การแข่งขันตอบปัญหาวิชาการ</h3>
            <p>เปิดรับสมัครแล้ววันนี้ - 15 สิงหาคม 2567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;