import axios from 'axios';
import { Student } from '../types/student';
import { Activity } from '../types/activity';

// สมมติว่าคุณมี API ที่สร้างด้วย Google Apps Script เพื่อดึงข้อมูลจาก Google Sheet
const API_BASE_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

export const getStudentByLineUID = async (lineUID: string): Promise<Student | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}?action=getStudent&lineuid=${lineUID}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data as Student;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch student data from Google Sheet', error);
    return null;
  }
};

export const getStudentActivities = async (studentId: string): Promise<Activity[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}?action=getActivities&studentId=${studentId}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data as Activity[];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch student activities from Google Sheet', error);
    return [];
  }
};

export const saveGoogleFormResponse = async (
  formId: string,
  lineUID: string,
  additionalData: Record<string, any>
): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}?action=saveFormResponse`, {
      formId,
      lineUID,
      ...additionalData
    });
    
    return response.data.success;
  } catch (error) {
    console.error('Failed to save form response', error);
    return false;
  }
};