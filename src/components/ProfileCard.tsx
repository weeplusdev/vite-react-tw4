import React from 'react';
import { Student } from '../types/student';
import QRCodeCard from './QRCodeCard';

interface ProfileCardProps {
  student: Student;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ student }) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-image">
          {student.profileImage ? (
            <img src={student.profileImage} alt={`${student.firstName} ${student.lastName}`} />
          ) : (
            <div className="profile-image-placeholder">
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-details">
          <h1>{student.firstName} {student.lastName}</h1>
          <p className="profile-school">{student.school}</p>
          <p className="profile-grade">ระดับชั้น {student.grade} ห้อง {student.section}</p>
          <p className="profile-id">รหัสนักเรียน: {student.id}</p>
        </div>
      </div>
      
      <div className="profile-qrcode">
        <h2>QR Code สำหรับเข้าร่วมกิจกรรม</h2>
        <QRCodeCard value={student.qrCodeId} studentName={`${student.firstName} ${student.lastName}`} />
      </div>
    </div>
  );
};

export default ProfileCard;