import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LineProfile } from '../types/line';
import { Student } from '../types/student';
import { getLiffProfile } from '../services/lineService';
import { getStudentByLineUID } from '../services/googleSheetService';

interface UserContextProps {
  lineProfile: LineProfile | null;
  studentData: Student | null;
  loading: boolean;
  error: string | null;
  refreshStudentData: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lineProfile, setLineProfile] = useState<LineProfile | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ดึงข้อมูลโปรไฟล์จาก LINE
      const profile = await getLiffProfile();
      
      if (profile) {
        setLineProfile(profile);
        
        // ดึงข้อมูลนักเรียนจาก Google Sheet ด้วย LINE UID
        const student = await getStudentByLineUID(profile.userId);
        
        if (student) {
          setStudentData(student);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const refreshStudentData = async () => {
    if (lineProfile?.userId) {
      try {
        setLoading(true);
        const student = await getStudentByLineUID(lineProfile.userId);
        if (student) {
          setStudentData(student);
        }
      } catch (err) {
        console.error('Error refreshing student data:', err);
        setError('ไม่สามารถดึงข้อมูลนักเรียนล่าสุดได้');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ lineProfile, studentData, loading, error, refreshStudentData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};