import React from 'react';
import { Activity } from '../types/activity';

interface ActivityScoreProps {
  activity: Activity;
}

const ActivityScore: React.FC<ActivityScoreProps> = ({ activity }) => {
  // แปลงรูปแบบวันที่
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`activity-card ${activity.attended ? 'attended' : 'not-attended'}`}>
      <div className="activity-info">
        <h3 className="activity-name">{activity.name}</h3>
        <p className="activity-description">{activity.description}</p>
        <p className="activity-date">วันที่: {formatDate(activity.date)}</p>
      </div>
      
      <div className="activity-status">
        {activity.attended ? (
          <>
            <div className="activity-points">{activity.points} คะแนน</div>
            <div className="activity-attended">เข้าร่วมแล้ว</div>
            {activity.verifiedBy && (
              <div className="activity-verified">
                ยืนยันโดย: {activity.verifiedBy}
                <br/>
                เวลา: {new Date(activity.verificationTime || '').toLocaleTimeString('th-TH')}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="activity-points">{activity.points} คะแนน</div>
            <div className="activity-not-attended">ยังไม่ได้เข้าร่วม</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityScore;