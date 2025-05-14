
import React from "react";
import { Header } from "@/components/Header";
import { ExamTaker } from "@/components/student/ExamTaker";

const TakeExam = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8">
        <ExamTaker />
      </div>
    </div>
  );
};

export default TakeExam;
