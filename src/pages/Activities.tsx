import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getStudentActivities } from '../services/googleSheetService';
import { Activity } from '../types/activity';
import ActivityScore from '../components/ActivityScore';

const Activities: React.FC = () => {
  const { studentData, loading: userLoading } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!studentData?.id) return;
      
      try {
        setLoading(true);
        const fetchedActivities = await getStudentActivities(studentData.id);
        setActivities(fetchedActivities);
        
        // คำนวณคะแนนรวม
        const total = fetchedActivities.reduce((sum, activity) => {
          return activity.attended ? sum + activity.points : sum;
        }, 0);
        
        setTotalPoints(total);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('ไม่สามารถดึงข้อมูลกิจกรรมได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [studentData]);

  if (userLoading || loading) {
    return <div className="loading">กำลังโหลดข้อมูลกิจกรรม...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!studentData) {
    return <div className="no-data">ไม่พบข้อมูลนักเรียน</div>;
  }

  return (
    <div className="activities-page">
      <h1>คะแนนกิจกรรม</h1>
      
      <div className="total-points-card">
        <h2>คะแนนรวมทั้งหมด</h2>
        <div className="total-points">{totalPoints} คะแนน</div>
      </div>
      
      <div className="activities-list">
        <h2>กิจกรรมทั้งหมด</h2>
        
        {activities.length === 0 ? (
          <div className="no-activities">ยังไม่มีกิจกรรมที่เข้าร่วม</div>
        ) : (
          activities.map((activity) => (
            <ActivityScore 
              key={activity.id} 
              activity={activity} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Activities;