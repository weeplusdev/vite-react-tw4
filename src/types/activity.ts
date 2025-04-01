export interface Activity {
    id: string;
    name: string;
    description: string;
    date: string;
    points: number;
    studentId: string;
    attended: boolean;
    verifiedBy?: string;
    verificationTime?: string;
  }