
export interface User {
  id: string;
  name: string;
  email: string;
  role: "professor" | "student";
}

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  duration: number; // in minutes
  questions: Question[];
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  submittedAt: Date;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  score?: number;
}
