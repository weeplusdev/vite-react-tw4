import React from 'react';
import { QRCodeCanvas} from 'qrcode.react';

interface QRCodeCardProps {
  value: string;
  studentName: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ value, studentName }) => {
  return (
    <div className="qrcode-card">
      <div className="qrcode-container">
        <QRCodeCanvas 
          value={value} 
          size={200}
          level="H"
        />
      </div>
      <div className="qrcode-info">
        <p className="qrcode-name">{studentName}</p>
        <p className="qrcode-instructions">
          แสดง QR Code นี้เพื่อเช็คชื่อเข้าร่วมกิจกรรม
        </p>
      </div>
    </div>
  );
};

export default QRCodeCard;