import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { isInLineApp, openLiffScanQrCode } from '../services/lineService';
import axios from 'axios';

const Scanner: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [html5QrScanner, setHtml5QrScanner] = useState<Html5Qrcode | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  // เริ่มการสแกนด้วย HTML5 QR Scanner
  const startHtml5QrScanner = () => {
    setScanning(true);
    setScanResult(null);
    setStudentInfo(null);
    setError(null);
    
    const scanner = new Html5Qrcode('reader');
    setHtml5QrScanner(scanner);
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    scanner.start(
      { facingMode: 'environment' },
      config,
      (qrCodeMessage) => {
        // QR Code สแกนสำเร็จ
        scanner.stop();
        setScanning(false);
        setScanResult(qrCodeMessage);
        verifyQrCode(qrCodeMessage);
      },
      (errorMessage) => {
        // กรณีมีข้อผิดพลาดในการสแกน แต่ไม่ต้องแสดงข้อความผิดพลาดทุกครั้งที่สแกนไม่สำเร็จ
        console.log(errorMessage);
      }
    );
  };

  // หยุดการสแกน
  const stopScanner = () => {
    if (html5QrScanner) {
      html5QrScanner.stop().then(() => {
        setScanning(false);
      });
    }
  };

  // ใช้ LIFF API สแกน QR Code (เฉพาะในแอพ LINE)
  const startLiffQrScanner = async () => {
    try {
      setScanning(true);
      setScanResult(null);
      setStudentInfo(null);
      setError(null);
      
      const result = await openLiffScanQrCode();
      
      if (result) {
        setScanResult(result);
        verifyQrCode(result);
      } else {
        setError('ไม่สามารถอ่าน QR Code ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error('Error scanning QR code with LIFF:', err);
      setError('เกิดข้อผิดพลาดในการสแกน QR Code');
    } finally {
      setScanning(false);
    }
  };

  // ตรวจสอบ QR Code กับฐานข้อมูล
  const verifyQrCode = async (qrCodeValue: string) => {
    try {
      // สมมติว่าคุณมี API สำหรับตรวจสอบ QR Code
      const response = await axios.get(`YOUR_API_URL?action=verifyQrCode&code=${qrCodeValue}`);
      
      if (response.data.success) {
        setStudentInfo(response.data.student);
        // ดึงข้อมูลกิจกรรมที่มีในวันนี้
        fetchTodayActivities();
      } else {
        setError('QR Code ไม่ถูกต้องหรือไม่พบข้อมูลนักเรียน');
      }
    } catch (err) {
      console.error('Error verifying QR code:', err);
      setError('เกิดข้อผิดพลาดในการตรวจสอบ QR Code');
    }
  };

  // ดึงข้อมูลกิจกรรมวันนี้
  const fetchTodayActivities = async () => {
    try {
      const response = await axios.get('YOUR_API_URL?action=getTodayActivities');
      
      if (response.data.success) {
        setActivities(response.data.activities);
      } else {
        setError('ไม่สามารถดึงข้อมูลกิจกรรมวันนี้ได้');
      }
    } catch (err) {
      console.error('Error fetching today activities:', err);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม');
    }
  };

  // บันทึกการเข้าร่วมกิจกรรม
  const recordAttendance = async () => {
    if (!studentInfo || !selectedActivity) {
      setError('กรุณาเลือกกิจกรรม');
      return;
    }
    
    try {
      const response = await axios.post('YOUR_API_URL?action=recordAttendance', {
        studentId: studentInfo.id,
        activityId: selectedActivity
      });
      
      if (response.data.success) {
        setStudentInfo({
          ...studentInfo,
          message: 'บันทึกการเข้าร่วมกิจกรรมเรียบร้อยแล้ว'
        });
      } else {
        setError('ไม่สามารถบันทึกการเข้าร่วมกิจกรรมได้');
      }
    } catch (err) {
      console.error('Error recording attendance:', err);
      setError('เกิดข้อผิดพลาดในการบันทึกการเข้าร่วมกิจกรรม');
    }
  };

  // รีเซ็ตทั้งหมดเพื่อเริ่มสแกนใหม่
  const resetScanner = () => {
    setScanResult(null);
    setStudentInfo(null);
    setError(null);
    setSelectedActivity('');
  };

  useEffect(() => {
    return () => {
      // Cleanup เมื่อ component unmount
      if (html5QrScanner) {
        html5QrScanner.stop();
      }
    };
  }, [html5QrScanner]);

  return (
    <div className="scanner-page">
      <h1>เครื่องสแกน QR Code</h1>
      
      {!scanning && !scanResult && (
        <div className="scanner-actions">
          {isInLineApp() ? (
            <button className="scan-button" onClick={startLiffQrScanner}>
              สแกน QR Code ด้วยกล้อง LINE
            </button>
          ) : (
            <button className="scan-button" onClick={startHtml5QrScanner}>
              สแกน QR Code
            </button>
          )}
        </div>
      )}
      
      {scanning && !isInLineApp() && (
        <div className="scanner-container">
          <div id="reader"></div>
          <button className="cancel-button" onClick={stopScanner}>
            ยกเลิก
          </button>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>ลองใหม่</button>
        </div>
      )}
      
      {studentInfo && (
        <div className="student-info">
          <h2>ข้อมูลนักเรียน</h2>
          
          <div className="student-card">
            <div className="student-name">{studentInfo.firstName} {studentInfo.lastName}</div>
            <div className="student-school">{studentInfo.school}</div>
            <div className="student-grade">ชั้น {studentInfo.grade}</div>
            
            {studentInfo.message ? (
              <div className="success-message">{studentInfo.message}</div>
            ) : (
              <div className="activity-selection">
                <h3>เลือกกิจกรรม</h3>
                <select 
                  className="activity-select" 
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                >
                  <option value="">-- เลือกกิจกรรม --</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
                
                <button 
                  className="record-button"
                  onClick={recordAttendance}
                  disabled={!selectedActivity}
                >
                  บันทึกการเข้าร่วมกิจกรรม
                </button>
              </div>
            )}
            
            <button className="reset-button" onClick={resetScanner}>
              สแกนใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;