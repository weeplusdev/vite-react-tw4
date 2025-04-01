import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getLiffUID } from '../services/lineService';
import { saveGoogleFormResponse } from '../services/googleSheetService';

const RedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const formId = searchParams.get('formId');
        const redirectUrl = searchParams.get('redirectUrl');
        
        if (!formId) {
          setError('Missing form ID parameter');
          setLoading(false);
          return;
        }
        
        // ดึง LINE UID
        const lineUID = await getLiffUID();
        
        if (!lineUID) {
          setError('Unable to get LINE user ID. Please make sure you are logged in to LINE.');
          setLoading(false);
          return;
        }
        
        // สร้าง object จาก query parameters ทั้งหมด (ยกเว้น formId และ redirectUrl)
        const formData: Record<string, any> = {};
        searchParams.forEach((value, key) => {
          if (key !== 'formId' && key !== 'redirectUrl') {
            formData[key] = value;
          }
        });
        
        // บันทึกข้อมูลไปที่ Google Form
        const saved = await saveGoogleFormResponse(formId, lineUID, formData);
        
        if (saved) {
          setSuccess(true);
          // ถ้ามี redirectUrl ให้ redirect ไปที่นั่น
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
        } else {
          setError('Failed to save form response');
        }
      } catch (err) {
        console.error('Error during form redirect:', err);
        setError('An error occurred while processing your form submission');
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="redirect-loading">
        <h2>กำลังดำเนินการ...</h2>
        <p>กรุณารอสักครู่</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="redirect-error">
        <h2>เกิดข้อผิดพลาด</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>กลับไปหน้าหลัก</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="redirect-success">
        <h2>ส่งข้อมูลสำเร็จ</h2>
        <p>ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
        <button onClick={() => navigate('/')}>กลับไปหน้าหลัก</button>
      </div>
    );
  }

  return null;
};

export default RedirectPage;