import React from 'react';
import { useUser } from '../contexts/UserContext';
import ProfileCard from '../components/ProfileCard';

const Profile: React.FC = () => {
  const { lineProfile, studentData, loading, error } = useUser();

  if (loading) {
    return <div className="loading">กำลังโหลดข้อมูลโปรไฟล์...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!lineProfile) {
    return (
      <div className="not-logged-in">
        <h2>กรุณาเข้าสู่ระบบ</h2>
        <p>คุณยังไม่ได้เข้าสู่ระบบด้วยบัญชี LINE กรุณาเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="no-student-data">
        <h2>ไม่พบข้อมูลนักเรียน</h2>
        <p>ไม่พบข้อมูลนักเรียนของคุณในระบบ กรุณาลงทะเบียนก่อนใช้งาน</p>
        <a 
          href="https://docs.google.com/forms/YOUR_REGISTRATION_FORM_ID/viewform" 
          className="register-button"
        >
          ลงทะเบียน
        </a>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>โปรไฟล์</h1>
      <ProfileCard student={studentData} />
    </div>
  );
};

export default Profile;