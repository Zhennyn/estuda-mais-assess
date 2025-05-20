import React, { createContext, useState, useContext, ReactNode } from "react";
import { Exam, ExamSubmission } from "@/types";
import { useNavigate } from "react-router-dom";

type ExamContextType = {
  exams: Exam[];
  examSubmissions: ExamSubmission[];
  createExam: (exam: Exam) => void;
  submitExam: (submission: ExamSubmission) => void;
  getExamById: (id: string) => Exam | undefined;
  getExamsByProfessorId: (professorId: string) => Exam[];
  getExamsForStudent: () => Exam[];
  getSubmissionsByExamId: (examId: string) => ExamSubmission[];
  getSubmissionsByStudentId: (studentId: string) => ExamSubmission[];
  deleteExam: (examId: string) => void;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examSubmissions, setExamSubmissions] = useState<ExamSubmission[]>([]);
  const navigate = useNavigate();

  const createExam = (exam: Exam) => {
    setExams(prevExams => [...prevExams, exam]);
  };

  const submitExam = (submission: ExamSubmission) => {
    // Calculate score
    const exam = getExamById(submission.exam_id);
    if (!exam) return;
    
    let correctAnswers = 0;
    submission.answers.forEach(answer => {
      const question = exam.questions.find(q => q.id === answer.question_id);
      if (question) {
        const correctOption = question.options.find(o => o.is_correct);
        if (correctOption && correctOption.id === answer.selected_option_id) {
          correctAnswers++;
        }
      }
    });
    
    const score = exam.questions.length > 0 ? (correctAnswers / exam.questions.length) * 100 : 0;
    const submissionWithScore = { ...submission, score };
    
    setExamSubmissions(prevSubmissions => [...prevSubmissions, submissionWithScore]);
  };

  const getExamById = (id: string) => {
    return exams.find(exam => exam.id === id);
  };

  const getExamsByProfessorId = (professorId: string) => {
    return exams.filter(exam => exam.created_by === professorId);
  };

  const getExamsForStudent = () => {
    // In a real app, we would filter exams assigned to this student
    // For now, return all exams
    return exams;
  };

  const getSubmissionsByExamId = (examId: string) => {
    return examSubmissions.filter(submission => submission.exam_id === examId);
  };

  const getSubmissionsByStudentId = (studentId: string) => {
    return examSubmissions.filter(submission => submission.student_id === studentId);
  };

  const deleteExam = (examId: string) => {
    setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
    navigate('/professor/dashboard');
  };

  return (
    <ExamContext.Provider value={{
      exams,
      examSubmissions,
      createExam,
      submitExam,
      getExamById,
      getExamsByProfessorId,
      getExamsForStudent,
      getSubmissionsByExamId,
      getSubmissionsByStudentId,
      deleteExam
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};
