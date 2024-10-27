// src/types/exam.ts
export interface ExamQuestion {
    id: string;
    text: string;
    sectionType: 'self-introduction' | 'opinion' | 'video';
    points: number;
    timeLimit: number;
    audioResponses?: {
      segment1?: string;
      segment2?: string;
    };
  }
  
  export interface ExamSection {
    id: string;
    type: 'self-introduction' | 'opinion' | 'video';
    title: string;
    description: string;
    totalPoints: number;
    questions: ExamQuestion[];
    videoUrl?: string;
  }
  
  export interface ExamConfig {
    totalTime: number; // in minutes
    sections: ExamSection[];
  }