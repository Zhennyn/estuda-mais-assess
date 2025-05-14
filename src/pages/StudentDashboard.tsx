
import React from "react";
import { Header } from "@/components/Header";
import { StudentExamList } from "@/components/student/ExamList";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard do Aluno</h1>
        </div>
        
        <StudentExamList />
      </div>
    </div>
  );
};

export default StudentDashboard;
